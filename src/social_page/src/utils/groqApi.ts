// utils/groqApi.ts

// Groq API configuration
const GROQ_API_BASE = 'https://api.groq.com/openai/v1';
const DEFAULT_MODEL = 'llama-3.1-8b-instant';

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
 * Call Groq API with chat messages (with retry logic)
 * Groq uses OpenAI-compatible API format
 * @param {Array} messages - Array of message objects with role and content
 * @param {string} apiKey - Groq API key
 * @param {Object} options - Optional parameters
 * @returns {Promise<string>} - Assistant response text
 */
export const callGroq = async (messages: any[], apiKey: string, options: any = {}) => {
  if (!apiKey) {
    throw new Error('Groq API key is required');
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.3,
    max_tokens = 1024,
    maxRetries = MAX_RETRIES
  } = options;

  // Convert messages to OpenAI format (Groq uses OpenAI-compatible API)
  // Ensure messages are in the correct format
  const formattedMessages = messages.map(msg => ({
    role: msg.role === 'assistant' ? 'assistant' : 'user',
    content: msg.content
  }));

  // If there's only a user message, we can use it directly
  // Groq API expects messages array with role and content
  const requestBody = {
    model: model,
    messages: formattedMessages,
    temperature: temperature,
    max_tokens: max_tokens
  };

  let lastError: Error | null = null;
  let lastResponse: Response | null = null;

  // Retry loop
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const response = await fetch(
        `${GROQ_API_BASE}/chat/completions`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
          },
          body: JSON.stringify(requestBody)
        }
      );

      lastResponse = response;

      // Handle rate limit (429) with retry
      if (response.status === 429) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || '';

        // Check if it's a quota exceeded error
        const isQuotaExceeded = errorMessage.toLowerCase().includes('quota exceeded') ||
          errorMessage.toLowerCase().includes('rate limit') ||
          errorMessage.toLowerCase().includes('too many requests');

        if (isQuotaExceeded) {
          // Extract retry time if available
          const retryAfterMatch = errorMessage.match(/retry in ([\d.]+)s/i);
          const retryAfter = retryAfterMatch ? parseFloat(retryAfterMatch[1]) * 1000 : null;

          // Don't retry quota exceeded errors - they won't resolve until quota resets
          if (attempt === maxRetries) {
            throw new Error(
              `Quota exceeded. You've reached your API quota limit. ${retryAfter ? `Please retry in ${Math.ceil(retryAfter / 1000)} seconds.` : 'Please check your plan and billing details.'}`
            );
          }

          // Calculate delay for rate limit
          const delay = getRetryDelay(response, attempt, true);
          console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);

          await sleep(delay);
          continue; // Retry the request
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
        console.log(`Rate limit hit. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);

        await sleep(delay);
        continue; // Retry the request
      }

      // Handle other HTTP errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || response.statusText;

        // Retry on server errors (5xx) but not on client errors (4xx except 429)
        const isRetryable = response.status >= 500 && response.status < 600;
        const isLastAttempt = attempt === maxRetries;

        if (!isRetryable || isLastAttempt) {
          throw new Error(
            `Groq API error (${response.status}): ${errorMessage}`
          );
        }

        // Retry with exponential backoff for server errors
        const delay = getRetryDelay(response, attempt, false);
        console.log(`Server error ${response.status}. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);

        await sleep(delay);
        continue; // Retry the request
      }

      // Success - parse and return response
      const data = await response.json();

      // Check if we have a valid response (OpenAI-compatible format)
      if (!data.choices || data.choices.length === 0) {
        throw new Error('No response generated from Groq API');
      }

      const choice = data.choices[0];

      if (!choice.message || !choice.message.content) {
        throw new Error('Invalid response format from Groq API');
      }

      return choice.message.content.trim();

    } catch (error: any) {
      lastError = error;

      // Don't retry on certain errors
      if (error.message.includes('401') || error.message.includes('403')) {
        throw new Error('Invalid API key or insufficient permissions');
      }

      if (error.message.includes('Response blocked') ||
        error.message.includes('No response generated') ||
        error.message.includes('Invalid response format')) {
        throw error; // Don't retry these
      }

      // Network errors - retry if not last attempt
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        if (attempt === maxRetries) {
          throw new Error('Network error: Please check your internet connection');
        }
        const delay = getRetryDelay(null, attempt, false);
        console.log(`Network error. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
        await sleep(delay);
        continue;
      }

      // If we've exhausted retries, throw the error
      if (attempt === maxRetries) {
        throw error;
      }

      // For other errors, check if it's a retryable error
      const isRetryable = error.message.includes('500') ||
        error.message.includes('502') ||
        error.message.includes('503') ||
        error.message.includes('429');

      if (isRetryable) {
        const delay = getRetryDelay(lastResponse, attempt, error.message.includes('429'));
        console.log(`Retryable error. Retrying in ${delay}ms (attempt ${attempt}/${maxRetries})...`);
        await sleep(delay);
        continue;
      }

      // Non-retryable error
      throw error;
    }
  }

  // Should never reach here, but just in case
  throw lastError || new Error('Failed to get response from Groq API after retries');
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

  // Groq API keys typically start with gsk_ and are ~51 characters
  const keyPattern = /^gsk_[0-9A-Za-z_-]{40,}$/;
  return keyPattern.test(apiKey);
};

