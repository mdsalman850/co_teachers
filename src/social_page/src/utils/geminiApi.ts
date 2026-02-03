// utils/geminiApi.ts

// Gemini API configuration
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';
// Use gemini-2.0-flash-exp as default (experimental 2.0 flash model)
const DEFAULT_MODEL = 'gemini-2.0-flash-exp';

// Retry configuration
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 30000; // 30 seconds
const RATE_LIMIT_RETRY_DELAY = 5000; // 5 seconds for rate limits

/**
 * Sleep/delay utility for retries
 */
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Extract retry delay from response headers or use default
 */
const getRetryDelay = (response: Response | null, attempt: number, isRateLimit: boolean): number => {
  if (isRateLimit) {
    // For rate limits, check for Retry-After header
    if (response) {
      const retryAfter = response.headers.get('Retry-After');
      if (retryAfter) {
        const seconds = parseInt(retryAfter, 10);
        if (!isNaN(seconds) && seconds > 0) {
          return Math.min(seconds * 1000, MAX_RETRY_DELAY);
        }
      }
    }
    // Use exponential backoff for rate limits with longer initial delay
    return Math.min(RATE_LIMIT_RETRY_DELAY * Math.pow(2, attempt - 1), MAX_RETRY_DELAY);
  }
  // Exponential backoff for other retryable errors
  return Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1), MAX_RETRY_DELAY);
};

/**
 * Call Gemini API with chat messages (with retry logic)
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} apiKey - Gemini API key
 * @param {Object} options - Optional parameters
 * @returns {Promise<string>} - Assistant response text
 */
export const callGemini = async (messages: any[], apiKey: string, options: any = {}) => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    maxOutputTokens = 1024,
    topK = 40,
    topP = 0.95,
    maxRetries = MAX_RETRIES
  } = options;

  // Convert messages to Gemini format
  const contents = messages.map(msg => ({
    parts: [{ text: msg.content }],
    role: msg.role === 'assistant' ? 'model' : 'user'
  }));

  // If there's only a user message, structure it properly for Gemini
  if (contents.length === 1 && contents[0].role === 'user') {
    // For single user message, we don't need role specification
    const requestBody = {
      contents: [{
        parts: [{ text: contents[0].parts[0].text }]
      }],
      generationConfig: {
        temperature,
        topK,
        topP,
        maxOutputTokens,
        stopSequences: []
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH", 
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    // Try multiple models in order if the primary model fails
    const modelsToTry = [
      model, // Try the requested model first (gemini-2.0-flash-exp)
      'gemini-2.0-flash', // Fallback to stable 2.0 flash
      'gemini-1.5-flash', // Fallback option
      'gemini-pro', // Another fallback
      'gemini-1.5-pro' // Last resort
    ].filter((m, index, self) => self.indexOf(m) === index); // Remove duplicates

    let lastError: Error | null = null;
    let lastResponse: Response | null = null;

    // Try each model in sequence
    for (const currentModel of modelsToTry) {
      // Retry loop for this model
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          const response = await fetch(
            `${GEMINI_API_BASE}/models/${currentModel}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
            }
          );

          lastResponse = response;

          // Handle rate limit (429) with retry
          if (response.status === 429) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || '';
            const errorDetails = errorData.error?.details || [];
            
            // Check if it's a quota exceeded error (daily/monthly limit reached)
            const isQuotaExceeded = errorMessage.toLowerCase().includes('quota exceeded') ||
                                   errorMessage.toLowerCase().includes('exceeded your current quota') ||
                                   errorDetails.some((detail: any) => 
                                     detail?.errorCode === 'RESOURCE_EXHAUSTED' ||
                                     detail?.errorMessage?.toLowerCase().includes('quota')
                                   );
            
            if (isQuotaExceeded) {
              // Extract retry time if available
              const retryAfterMatch = errorMessage.match(/retry in ([\d.]+)s/i);
              const retryAfter = retryAfterMatch ? parseFloat(retryAfterMatch[1]) * 1000 : null;
              
              // If quota exceeded, try next model instead of retrying same model
              if (modelsToTry.indexOf(currentModel) < modelsToTry.length - 1) {
                console.log(`Quota exceeded for ${currentModel}, trying next model...`);
                break; // Break out of retry loop, try next model
              }
              
              // If this is the last model, throw error
              throw new Error(
                `Quota exceeded. You've reached your API quota limit. ${retryAfter ? `Please retry in ${Math.ceil(retryAfter / 1000)} seconds.` : 'Please check your plan and billing details.'} For more information: https://ai.google.dev/gemini-api/docs/rate-limits`
              );
            }
            
            // For regular rate limits (temporary), retry with backoff
            const isLastAttempt = attempt === maxRetries;
            
            if (isLastAttempt) {
              // Extract retry time from error message if available
              const retryAfterMatch = errorMessage.match(/retry in ([\d.]+)s/i);
              const retryAfter = retryAfterMatch ? parseFloat(retryAfterMatch[1]) * 1000 : null;
              
              throw new Error(
                `Rate limit exceeded. ${retryAfter ? `Please retry in ${Math.ceil(retryAfter / 1000)} seconds.` : 'Please try again in a moment.'} ${errorMessage}`
              );
            }

            // Calculate delay for rate limit
            const delay = getRetryDelay(response, attempt, true);
            console.log(`Rate limit hit for ${currentModel}. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
            
            await sleep(delay);
            continue; // Retry the request with same model
          }

          // Handle 404 (model not found) - try next model
          if (response.status === 404) {
            console.log(`Model ${currentModel} not found, trying next model...`);
            break; // Break out of retry loop, try next model
          }

          // Handle other HTTP errors
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error?.message || response.statusText;
            
            // Retry on server errors (5xx) but not on client errors (4xx except 429, 404)
            const isRetryable = response.status >= 500 && response.status < 600;
            const isLastAttempt = attempt === maxRetries;
            
            if (!isRetryable || isLastAttempt) {
              // If not retryable and not last model, try next model
              if (!isRetryable && modelsToTry.indexOf(currentModel) < modelsToTry.length - 1) {
                console.log(`Error ${response.status} for ${currentModel}, trying next model...`);
                break; // Try next model
              }
              throw new Error(
                `Gemini API error (${response.status}): ${errorMessage}`
              );
            }

            // Retry with exponential backoff for server errors
            const delay = getRetryDelay(response, attempt, false);
            console.log(`Server error ${response.status} for ${currentModel}. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
            
            await sleep(delay);
            continue; // Retry the request with same model
          }

        // Success - parse and return response
        const data = await response.json();
        
        // Check if we have a valid response
        if (!data.candidates || data.candidates.length === 0) {
          throw new Error('No response generated from Gemini API');
        }

        const candidate = data.candidates[0];
        
        // Check for safety blocks
        if (candidate.finishReason === 'SAFETY') {
          throw new Error('Response blocked for safety reasons');
        }

        // Check for other finish reasons
        if (candidate.finishReason === 'RECITATION') {
          throw new Error('Response blocked due to recitation concerns');
        }

        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
          throw new Error('Invalid response format from Gemini API');
        }

        return candidate.content.parts[0].text.trim();
        
      } catch (error: any) {
        lastError = error;
        
        // Don't retry on certain errors - throw immediately
        if (error.message.includes('401') || error.message.includes('403')) {
          throw new Error('Invalid API key or insufficient permissions');
        }
        
        if (error.message.includes('Response blocked') || 
            error.message.includes('No response generated') ||
            error.message.includes('Invalid response format') ||
            error.message.includes('Quota exceeded')) {
          // If quota exceeded and not last model, try next model
          if (error.message.includes('Quota exceeded') && 
              modelsToTry.indexOf(currentModel) < modelsToTry.length - 1) {
            console.log(`Quota exceeded for ${currentModel}, trying next model...`);
            break; // Break out of retry loop, try next model
          }
          throw error; // Don't retry these
        }

        // Network errors - retry if not last attempt
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
          if (attempt === maxRetries) {
            // If last attempt and not last model, try next model
            if (modelsToTry.indexOf(currentModel) < modelsToTry.length - 1) {
              console.log(`Network error for ${currentModel}, trying next model...`);
              break;
            }
            throw new Error('Network error: Please check your internet connection');
          }
          const delay = getRetryDelay(null, attempt, false);
          console.log(`Network error. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
          await sleep(delay);
          continue;
        }

        // If we've exhausted retries for this model, try next model
        if (attempt === maxRetries) {
          if (modelsToTry.indexOf(currentModel) < modelsToTry.length - 1) {
            console.log(`All retries exhausted for ${currentModel}, trying next model...`);
            break; // Try next model
          }
          throw error; // Last model, throw error
        }

        // For other errors, check if it's a retryable error
        const isRetryable = error.message.includes('500') || 
                           error.message.includes('502') || 
                           error.message.includes('503');
        
        if (isRetryable) {
          const delay = getRetryDelay(lastResponse, attempt, false);
          console.log(`Retryable error. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
          await sleep(delay);
          continue;
        }

        // Non-retryable error - try next model if available
        if (modelsToTry.indexOf(currentModel) < modelsToTry.length - 1) {
          console.log(`Non-retryable error for ${currentModel}, trying next model...`);
          break;
        }
        throw error;
      }
      } // Close inner for loop (attempt)
    } // Close outer for loop (currentModel)

    // If we've tried all models and none worked, throw the last error
    if (lastError) {
      throw lastError;
    }
    
    // Should never reach here, but just in case
    throw new Error('Failed to get response from Gemini API after trying all models');
  } else {
    // For multi-turn conversations, use chat format (if needed in future)
    throw new Error('Multi-turn conversation format not yet implemented');
  }
};

/**
 * Validate API key format (basic check)
 * @param {string} apiKey - API key to validate
 * @returns {boolean} - Whether the API key format appears valid
 */
export const validateApiKey = (apiKey: string) => {
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }
  
  // Basic format validation - Gemini keys typically start with AIza and are ~39 characters
  const keyPattern = /^AIza[0-9A-Za-z_-]{35,}$/;
  return keyPattern.test(apiKey);
};

/**
 * Test API key by making a simple request
 * @param {string} apiKey - API key to test
 * @returns {Promise<boolean>} - Whether the API key works
 */
export const testApiKey = async (apiKey: string) => {
  try {
    const testMessages = [{
      role: 'user',
      content: 'Hello, can you respond with just "API test successful"?'
    }];
    
    const response = await callGemini(testMessages, apiKey, {
      maxOutputTokens: 10
    });
    
    return response.toLowerCase().includes('api test successful') || 
           response.toLowerCase().includes('test successful') ||
           response.toLowerCase().includes('successful');
           
  } catch (error) {
    console.error('API key test failed:', error);
    return false;
  }
};

/**
 * Estimate token count for text (rough approximation)
 * @param {string} text - Text to count tokens for
 * @returns {number} - Estimated token count
 */
export const estimateTokenCount = (text: string) => {
  if (!text) return 0;
  
  // Rough estimate: ~4 characters per token for English text
  // This is a simplified estimate and may not be perfectly accurate
  return Math.ceil(text.length / 4);
};

/**
 * Truncate text to fit within token limit
 * @param {string} text - Text to truncate
 * @param {number} maxTokens - Maximum token count
 * @returns {string} - Truncated text
 */
export const truncateToTokenLimit = (text: string, maxTokens: number) => {
  const estimatedTokens = estimateTokenCount(text);
  
  if (estimatedTokens <= maxTokens) {
    return text;
  }
  
  // Calculate character limit based on token estimate
  const charLimit = maxTokens * 4; // Rough conversion
  
  if (text.length <= charLimit) {
    return text;
  }
  
  // Truncate and try to break at sentence boundary
  let truncated = text.slice(0, charLimit);
  const lastSentenceEnd = Math.max(
    truncated.lastIndexOf('.'),
    truncated.lastIndexOf('!'),
    truncated.lastIndexOf('?')
  );
  
  if (lastSentenceEnd > charLimit * 0.8) {
    truncated = truncated.slice(0, lastSentenceEnd + 1);
  }
  
  return truncated + '...';
};
