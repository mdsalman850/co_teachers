// Enhanced Gemini API wrapper for Science RAG with better prompt engineering
const GEMINI_API_BASE = 'https://generativelanguage.googleapis.com/v1';
// Use gemini-1.5-flash as default (more widely available than 2.0)
const DEFAULT_MODEL = 'gemini-1.5-flash';

/**
 * Enhanced Gemini API call with better configuration for science content
 */
export const callGemini = async (
  messages: any[], 
  apiKey: string, 
  options: any = {}
) => {
  if (!apiKey) {
    throw new Error('Gemini API key is required');
  }

  const {
    model = DEFAULT_MODEL,
    temperature = 0.2, // Lower temperature for more factual responses
    maxOutputTokens = 2048, // Increased for detailed science explanations
    topK = 40,
    topP = 0.95
  } = options;

  try {
    const contents = messages.map(msg => ({
      parts: [{ text: msg.content }],
      role: msg.role === 'assistant' ? 'model' : 'user'
    }));

    if (contents.length === 1 && contents[0].role === 'user') {
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
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_ONLY_HIGH"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_ONLY_HIGH"
          }
        ]
      };

      // Try multiple models in order: gemini-1.5-flash, gemini-pro, gemini-1.5-pro
      let response: Response | undefined;
      const modelsToTry = [
        'gemini-1.5-flash',
        'gemini-pro', 
        'gemini-1.5-pro',
        'gemini-2.0-flash'
      ];
      
      let lastError: Error | null = null;
      let success = false;
      
      for (const modelToTry of modelsToTry) {
        try {
          response = await fetch(
            `${GEMINI_API_BASE}/models/${modelToTry}:generateContent?key=${apiKey}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(requestBody)
            }
          );

          if (response.ok) {
            success = true;
            break; // Success, exit loop
          } else {
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(
              `Gemini API error (${response.status}): ${
                errorData.error?.message || response.statusText
              }`
            );
            // If 404, try next model
            if (response.status === 404) {
              continue;
            }
            // For other errors, throw immediately
            throw lastError;
          }
        } catch (err: any) {
          lastError = err;
          // If it's a 404 or "not found" error, try next model
          if (err.message?.includes('404') || err.message?.includes('not found')) {
            continue;
          }
          // For other errors, throw immediately
          throw err;
        }
      }

      if (!success || !response || !response.ok) {
        throw lastError || new Error('Failed to get response from any Gemini model. Please check your API key and try again.');
      }

      const data = await response.json();
      
      if (!data.candidates || data.candidates.length === 0) {
        throw new Error('No response generated from Gemini API');
      }

      const candidate = data.candidates[0];
      
      if (candidate.finishReason === 'SAFETY') {
        throw new Error('Response blocked for safety reasons');
      }

      if (candidate.finishReason === 'RECITATION') {
        throw new Error('Response blocked due to recitation concerns');
      }

      if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
        throw new Error('Invalid response format from Gemini API');
      }

      return candidate.content.parts[0].text.trim();
      
    } else {
      throw new Error('Multi-turn conversation format not yet implemented');
    }

  } catch (error: any) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error: Please check your internet connection');
    }
    
    if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('Invalid API key or insufficient permissions');
    }
    
    if (error.message.includes('429')) {
      throw new Error('Rate limit exceeded. Please try again in a moment');
    }
    
    if (error.message.includes('500') || error.message.includes('502') || error.message.includes('503')) {
      throw new Error('Gemini API is temporarily unavailable. Please try again later');
    }

    if (error.message.includes('Gemini API error') || 
        error.message.includes('No response generated') ||
        error.message.includes('Response blocked') ||
        error.message.includes('Invalid response format')) {
      throw error;
    }
    
    throw new Error(`Failed to get response from Gemini: ${error.message}`);
  }
};

/**
 * Build enhanced prompt for science questions
 */
export const buildSciencePrompt = (
  context: string,
  query: string,
  currentChapter: string,
  subject: 'biology' | 'physics' | 'chemistry',
  conversationHistory: string = ''
): string => {
  const subjectContext = {
    biology: 'You are an expert biology tutor helping students understand biological concepts, processes, and systems. Focus on accuracy, clarity, and educational value.',
    physics: 'You are an expert physics tutor helping students understand physical laws, principles, and phenomena. Focus on accuracy, clarity, and educational value.',
    chemistry: 'You are an expert chemistry tutor helping students understand chemical concepts, reactions, and principles. Focus on accuracy, clarity, and educational value.'
  };

  return `${subjectContext[subject]}

CONTEXT FROM TEXTBOOK:
${context}

${conversationHistory ? `PREVIOUS CONVERSATION:\n${conversationHistory}\n` : ''}

CURRENT CHAPTER/TOPIC: ${currentChapter}

STUDENT QUESTION: ${query}

INSTRUCTIONS:
1. Answer the question using ONLY the information provided in the CONTEXT above
2. Focus on information related to the CURRENT CHAPTER/TOPIC: "${currentChapter}"
3. If the context contains relevant information but is incomplete, provide what you can from the context and add brief, scientifically accurate information to complete the answer
4. Only add information that is directly related to the question and is scientifically correct
5. If the answer is completely absent from the CONTEXT, respond exactly: "I couldn't find that information in the textbook. Could you rephrase your question or check if it's covered in a different chapter?"

FORMATTING REQUIREMENTS (CRITICAL):
- NEVER use markdown symbols like #, ##, ###, *, **, or any markdown formatting
- NEVER use asterisks (*) or double asterisks (**) for emphasis
- NEVER use hash symbols (#) for headings
- Use plain text formatting only
- For headings, use ALL CAPS or Title Case without any symbols
- For emphasis, use CAPITAL LETTERS or simply clear language
- Use simple bullet points with dashes (-) or numbers (1. 2. 3.)
- Use clear paragraph breaks and spacing
- Format like a textbook or study guide with clean, readable text
- Structure answers with clear sections and logical flow
- Use visual hierarchy with spacing and indentation
- Include relevant examples and explanations
- Make answers comprehensive but easy to read
- For scientific terms, use proper capitalization (e.g., DNA, ATP, pH)
- For formulas, use clear notation (e.g., H2O, CO2, C6H12O6)

EXAMPLE OF CORRECT FORMATTING:
Instead of: "### Cell Structure **Key Components:** *Nucleus* and *Mitochondria*"
Use: "CELL STRUCTURE KEY COMPONENTS

- Nucleus: Contains genetic material (DNA)
- Mitochondria: Powerhouse of the cell, produces ATP
- Cytoplasm: Gel-like substance where cellular processes occur

SUMMARY:
The cell is the basic unit of life, containing specialized structures called organelles that perform specific functions."

RESPONSE GUIDELINES:
- Be thorough and detailed when the context supports it
- Use scientific terminology appropriately
- Explain complex concepts in a way that's accessible to students
- Connect concepts to real-world examples when possible
- If discussing processes, explain them step-by-step
- Maintain accuracy and scientific correctness at all times

Now provide a clear, comprehensive answer to the student's question:`;
};

