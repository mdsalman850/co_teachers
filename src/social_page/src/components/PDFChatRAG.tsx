import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Trash2, Loader, MessageSquare, AlertCircle, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { extractPDFText, chunkText, createSearchIndex, searchChunks, Chunk } from '../utils/pdfUtils';
import { callGroq } from '../utils/groqApi';

interface PDFChatRAGProps {
  apiKey: string;
  currentChapter: string;
  pdfFile: File | null;
  onPdfLoaded: (loaded: boolean) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChapterChatHistory {
  messages: Message[];
  lastUpdated: number;
}

// List of all available chapters for validation
const ALL_CHAPTERS = [
  'Ancient India',
  'India from 9th to 14th CE',
  'Mughal Emperors',
  'Modern India',
  'Telangana History and State Formation',
  'Our Universe',
  'All About Villages',
  'Physical Divisions Of India',
  'Natural Resources',
  'Indian Constitution',
  'Union and State Government',
  'Economic System'
];

// Chapter keywords for detection
const CHAPTER_KEYWORDS: { [key: string]: string[] } = {
  'Ancient India': ['ancient india', 'indus valley', 'vedic', 'maurya', 'gupta', 'harappa', 'mohenjo-daro', 'ashoka', 'chandragupta'],
  'India from 9th to 14th CE': ['9th to 14th', 'medieval india', 'delhi sultanate', 'khilji', 'tughlaq', 'lodi', 'ghaznavi', 'ghori'],
  'Mughal Emperors': ['mughal', 'babur', 'humayun', 'akbar', 'jahangir', 'shah jahan', 'aurangzeb', 'mughal empire'],
  'Modern India': ['modern india', 'british', 'colonial', 'independence', 'partition', 'gandhi', 'nehru', 'freedom struggle'],
  'Telangana History and State Formation': ['telangana', 'hyderabad', 'state formation', 'andhra pradesh'],
  'Our Universe': ['universe', 'solar system', 'planets', 'stars', 'galaxy', 'astronomy'],
  'All About Villages': ['village', 'villages', 'rural', 'agriculture', 'farming'],
  'Physical Divisions Of India': ['physical divisions', 'himalayas', 'plains', 'plateau', 'coastal', 'topography', 'geography'],
  'Natural Resources': ['natural resources', 'minerals', 'forests', 'water resources', 'coal', 'oil'],
  'Indian Constitution': ['constitution', 'fundamental rights', 'directive principles', 'parliament', 'president'],
  'Union and State Government': ['union government', 'state government', 'governance', 'legislature', 'executive'],
  'Economic System': ['economic system', 'economy', 'market', 'trade', 'commerce', 'economics']
};

const PDFChatRAG: React.FC<PDFChatRAGProps> = ({ apiKey, currentChapter, pdfFile, onPdfLoaded }) => {
  const [pdfText, setPdfText] = useState('');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [isChapterSwitching, setIsChapterSwitching] = useState(false);
  const [chapterChatHistories, setChapterChatHistories] = useState<Map<string, ChapterChatHistory>>(new Map());
  const [lastRequestTime, setLastRequestTime] = useState<number>(0);
  const [retryCount, setRetryCount] = useState(0);
  const [lastFailedMessage, setLastFailedMessage] = useState<string>('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const requestThrottleRef = useRef<NodeJS.Timeout | null>(null);
  const MAX_MESSAGES_PER_CHAPTER = 30;
  const CHAT_HISTORY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
  const MIN_REQUEST_INTERVAL = 2000; // Minimum 2 seconds between requests to prevent rate limiting

  /**
   * Check if the question is about a different chapter
   * Returns the detected chapter name if found, null otherwise
   */
  const detectOtherChapter = (question: string): string | null => {
    const questionLower = question.toLowerCase();
    const currentChapterName = currentChapter.split(' - ')[1] || currentChapter;
    
    // Check each chapter's keywords
    for (const [chapterName, keywords] of Object.entries(CHAPTER_KEYWORDS)) {
      // Skip if it's the current chapter
      if (chapterName === currentChapterName || currentChapter.includes(chapterName)) {
        continue;
      }
      
      // Check if any keyword is mentioned in the question
      for (const keyword of keywords) {
        if (questionLower.includes(keyword.toLowerCase())) {
          return chapterName;
        }
      }
    }
    
    // Also check for direct chapter name mentions
    for (const chapterName of ALL_CHAPTERS) {
      if (chapterName === currentChapterName || currentChapter.includes(chapterName)) {
        continue;
      }
      
      // Check if chapter name is mentioned (with some flexibility)
      const chapterNameLower = chapterName.toLowerCase();
      if (questionLower.includes(chapterNameLower)) {
        return chapterName;
      }
    }
    
    return null;
  };

  // localStorage functions
  const saveChatHistoryToStorage = (chapterId: string, messages: Message[]) => {
    try {
      const historyData = {
        messages,
        lastUpdated: Date.now()
      };
      localStorage.setItem(`chat_history_${chapterId}`, JSON.stringify(historyData));
    } catch (error) {
      console.error('Failed to save chat history to localStorage:', error);
    }
  };

  const loadChatHistoryFromStorage = (chapterId: string): ChapterChatHistory | null => {
    try {
      const stored = localStorage.getItem(`chat_history_${chapterId}`);
      if (stored) {
        const historyData = JSON.parse(stored);
        // Check if the history is still valid (not expired)
        if (Date.now() - historyData.lastUpdated < CHAT_HISTORY_TIMEOUT) {
          return historyData;
        } else {
          // Clear expired history
          localStorage.removeItem(`chat_history_${chapterId}`);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history from localStorage:', error);
    }
    return null;
  };

  const clearExpiredHistories = () => {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('chat_history_')) {
          const stored = localStorage.getItem(key);
          if (stored) {
            const historyData = JSON.parse(stored);
            if (Date.now() - historyData.lastUpdated >= CHAT_HISTORY_TIMEOUT) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    } catch (error) {
      console.error('Failed to clear expired histories:', error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle chapter switching
  useEffect(() => {
    const switchChapter = async () => {
      console.log('Switching to chapter:', currentChapter);
      setIsChapterSwitching(true);
      
      // Clear current messages immediately
      setMessages([]);
      setInputMessage('');
      setError('');
      
      // Brief loading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load the new chapter's chat history from localStorage
      const chapterHistory = loadChatHistoryFromStorage(currentChapter);
      console.log('Chapter history for', currentChapter, ':', chapterHistory);
      
      if (chapterHistory && chapterHistory.messages.length > 0) {
        setMessages(chapterHistory.messages);
        console.log('Loaded', chapterHistory.messages.length, 'messages for', currentChapter);
      } else {
        console.log('No previous history for', currentChapter, '- starting fresh');
      }
      
      setIsChapterSwitching(false);
    };

    switchChapter();
  }, [currentChapter]);

  // Auto-load PDF when component mounts or PDF file changes
  useEffect(() => {
    if (pdfFile && !pdfText) {
      loadPDF();
    }
  }, [pdfFile]);

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (requestThrottleRef.current) {
        clearTimeout(requestThrottleRef.current);
      }
    };
  }, []);

  // Clear expired histories on component mount
  useEffect(() => {
    clearExpiredHistories();
  }, []);

  const loadPDF = async () => {
    if (!pdfFile) return;

    setError('');
    setIsExtracting(true);
    onPdfLoaded(false);

    try {
      // Extract text from PDF
      const extractedText = await extractPDFText(pdfFile);
      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from this PDF.');
      }

      setPdfText(extractedText);

      // Chunk the text
      const textChunks = chunkText(extractedText);
      setChunks(textChunks);

      // Create search index
      const index = createSearchIndex(textChunks);
      setSearchIndex(index);

      // Clear previous messages
      setMessages([]);
      onPdfLoaded(true);
      
    } catch (err: any) {
      console.error('PDF processing error:', err);
      setError(`Failed to process PDF: ${err.message}`);
      onPdfLoaded(false);
    } finally {
      setIsExtracting(false);
    }
  };

  const retryLoadPDF = async () => {
    setIsRetrying(true);
    setError('');
    await loadPDF();
    setIsRetrying(false);
  };

  const clearSession = () => {
    setMessages([]);
    setInputMessage('');
    setError('');
    
    // Clear current chapter's chat history from localStorage
    localStorage.removeItem(`chat_history_${currentChapter}`);
    
    // Clear timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const addMessageToHistory = (message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      
      // Enforce message limit
      if (newMessages.length > MAX_MESSAGES_PER_CHAPTER) {
        newMessages.splice(0, newMessages.length - MAX_MESSAGES_PER_CHAPTER);
      }
      
      // Save to localStorage immediately
      saveChatHistoryToStorage(currentChapter, newMessages);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set new timeout to clear history after 10 minutes of inactivity
      timeoutRef.current = setTimeout(() => {
        console.log('Clearing chat history for', currentChapter, 'due to inactivity');
        setMessages([]);
        localStorage.removeItem(`chat_history_${currentChapter}`);
      }, CHAT_HISTORY_TIMEOUT);
      
      return newMessages;
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !searchIndex || !chunks.length || isLoading) {
      return;
    }

    if (!apiKey) {
      setError('Groq API key is not configured. Please check your configuration.');
      return;
    }

    // Throttle requests to prevent rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL && lastRequestTime > 0) {
      const remainingTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      setError(`Please wait ${Math.ceil(remainingTime / 1000)} second(s) before sending another message.`);
      
      // Clear any existing throttle timeout
      if (requestThrottleRef.current) {
        clearTimeout(requestThrottleRef.current);
      }
      
      // Auto-retry after the throttle period
      requestThrottleRef.current = setTimeout(() => {
        setError('');
        handleSendMessage();
      }, remainingTime);
      
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError('');
    setLastRequestTime(Date.now());
    setLastFailedMessage(''); // Clear any previous failed message

    // Add user message to chat
    const newUserMessage: Message = { role: 'user', content: userMessage };
    addMessageToHistory(newUserMessage);

    // Check if the question is about a different chapter
    const detectedChapter = detectOtherChapter(userMessage);
    if (detectedChapter) {
      const currentChapterName = currentChapter.split(' - ')[1] || currentChapter;
      const warningMessage = `I can only answer questions about "${currentChapterName}". Please switch to the "${detectedChapter}" chapter to ask questions about it.`;
      
      // Add warning as assistant message
      const warningResponse: Message = { role: 'assistant', content: warningMessage };
      addMessageToHistory(warningResponse);
      setIsLoading(false);
      inputRef.current?.focus();
      return; // Don't proceed with API call
    }

    try {
      // Search for relevant chunks - increase to 6 for better context
      let relevantChunks = searchChunks(searchIndex, chunks, userMessage, 6);
      
      // Special handling for relationship queries
      const relationshipKeywords = ['part', 'belong', 'include', 'member', 'category', 'type', 'kind'];
      const hasRelationshipQuery = relationshipKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      // Special handling for detailed explanation requests
      const detailKeywords = ['explain', 'detail', 'lines', 'describe', 'tell me about'];
      const hasDetailRequest = detailKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      if (hasRelationshipQuery && relevantChunks.length < 3) {
        // For relationship queries, try to find chunks that mention both terms
        const queryWords = userMessage.toLowerCase().split(/\s+/).filter(word => word.length > 2);
        const additionalChunks = chunks.filter(chunk => {
          const chunkText = chunk.text.toLowerCase();
          const mentionedTerms = queryWords.filter(word => chunkText.includes(word));
          return mentionedTerms.length >= 2; // Chunks that mention multiple query terms
        });
        
        // Add additional chunks if we found any
        if (additionalChunks.length > 0) {
          relevantChunks = [...relevantChunks, ...additionalChunks.slice(0, 3)];
          // Remove duplicates
          relevantChunks = relevantChunks.filter((chunk, index, self) => 
            index === self.findIndex(c => c.id === chunk.id)
          );
        }
      }
      
      // For detailed requests, try to find more related chunks
      if (hasDetailRequest && relevantChunks.length < 4) {
        const queryWords = userMessage.toLowerCase().split(/\s+/).filter(word => word.length > 2);
        const additionalChunks = chunks.filter(chunk => {
          const chunkText = chunk.text.toLowerCase();
          return queryWords.some(word => chunkText.includes(word));
        });
        
        // Add additional chunks if we found any
        if (additionalChunks.length > 0) {
          relevantChunks = [...relevantChunks, ...additionalChunks.slice(0, 4)];
          // Remove duplicates
          relevantChunks = relevantChunks.filter((chunk, index, self) => 
            index === self.findIndex(c => c.id === chunk.id)
          );
        }
      }

      // Build context from chunks
      let context = relevantChunks
        .map(chunk => chunk.text)
        .join('\n\n---\n\n');

      // Get recent conversation history (last 4 messages)
      const recentHistory = messages.slice(-4);
      const conversationHistory = recentHistory
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Build the prompt with chapter context
      const prompt = `CONTEXT:
${context}

CONVERSATION_HISTORY:
${conversationHistory}

CURRENT_CHAPTER: ${currentChapter}

QUESTION: ${userMessage}

INSTRUCTION: Use the CONTEXT above to answer the question. Focus on information related to the CURRENT_CHAPTER: "${currentChapter}". You can combine information from multiple sections if needed. 

If the CONTEXT contains relevant information but is incomplete, provide what you can from the context and add a brief, accurate explanation to complete the answer. Only add information that is scientifically accurate and directly related to the question.

If the answer is completely absent from the CONTEXT, respond exactly: "I couldn't find that information in the document."

Be thorough in your analysis and provide detailed answers when the context supports it.`;

      // Prepare messages for Groq API
      const systemMessage = {
        role: 'user',
        content: `You are an educational assistant for social studies. Answer the user's question using the provided CONTEXT as your primary source. Focus ONLY on the CURRENT_CHAPTER context.

CRITICAL RULE - CHAPTER RESTRICTION:
- You can ONLY answer questions about the CURRENT_CHAPTER: "${currentChapter}"
- If the user asks about ANY other chapter (Ancient India, Mughal Emperors, Modern India, Geography, Political Science, Economics, etc.), you MUST respond with EXACTLY this message: "I can only answer questions about "${currentChapter}". Please switch to that chapter to ask questions about it."
- Do NOT provide any information about other chapters, even if you know it
- Do NOT answer questions that are clearly about a different chapter
- This is a strict rule - you must only respond with the warning message and nothing else

FORMATTING REQUIREMENTS (CRITICAL):
- NEVER use markdown symbols like #, ##, ###, *, **, or any markdown formatting
- NEVER use asterisks (*) or double asterisks (**) for emphasis
- NEVER use hash symbols (#) for headings
- Use plain text formatting only
- For headings, use ALL CAPS or Title Case without any symbols
- For emphasis, use CAPITAL LETTERS or simply bold language
- Use simple bullet points with dashes (-) or numbers (1. 2. 3.)
- Use clear paragraph breaks and spacing
- Format like a textbook or study guide with clean, readable text
- Structure answers with clear sections and logical flow
- Use visual hierarchy with spacing and indentation
- Include relevant examples and explanations
- Make answers comprehensive but easy to read

EXAMPLE OF CORRECT FORMATTING:
Instead of: "### Ancient India **Key Features:** *Indus Valley Civilization*"
Use: "ANCIENT INDIA KEY FEATURES

- Indus Valley Civilization
- Harappan culture and cities
- Trade and commerce systems
- Agricultural practices

SUMMARY:
Ancient India was characterized by advanced urban planning and sophisticated trade networks."

If the context contains relevant information but is incomplete, provide what you can from the context and add brief, scientifically accurate information to complete the answer. Only add information that is directly related to the question and is scientifically correct.

If the context does not contain any relevant information needed to answer the question, respond exactly: "I couldn't find that information in the document."

Provide detailed and thorough answers when the context supports it. Keep answers clear and educational for students.

${prompt}`
      };

      const response = await callGroq([systemMessage], apiKey, {
        model: 'groq/compound',
        max_tokens: 1024,
        temperature: 0.3
      });
      
      // Clean up any markdown formatting that might have slipped through
      const cleanResponse = response
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold** formatting
        .replace(/\*(.*?)\*/g, '$1') // Remove *italic* formatting
        .replace(/### (.*?)$/gm, '$1') // Remove ### headings
        .replace(/## (.*?)$/gm, '$1') // Remove ## headings
        .replace(/# (.*?)$/gm, '$1') // Remove # headings
        .replace(/^\s*[-*+]\s+/gm, '- ') // Standardize bullet points
        .replace(/^\s*\d+\.\s+/gm, (match) => match) // Keep numbered lists
        .trim();
      
      // Add assistant response to chat
      const assistantMessage: Message = { role: 'assistant', content: cleanResponse };
      addMessageToHistory(assistantMessage);

    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMessage = err.message || 'Failed to get response';
      setError(errorMessage);
      
      // Store the failed message for retry
      const userMessage = messages.length > 0 && messages[messages.length - 1]?.role === 'user' 
        ? messages[messages.length - 1].content 
        : '';
      if (userMessage) {
        setLastFailedMessage(userMessage);
      }
      
      // If it's a rate limit error, allow manual retry
      if (errorMessage.includes('Rate limit exceeded') || errorMessage.includes('429')) {
        setRetryCount(prev => prev + 1);
      } else {
        setRetryCount(0);
      }
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleRetryMessage = async () => {
    if (isLoading) return;
    
    // Find the last user message to retry
    const lastUserMessage = messages.length > 0 
      ? messages.filter(m => m.role === 'user').pop()?.content 
      : lastFailedMessage;
    
    if (!lastUserMessage) return;
    
    setError('');
    setRetryCount(0);
    
    // Wait before retrying to avoid immediate rate limit
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Set message and trigger send
    setInputMessage(lastUserMessage);
    setLastRequestTime(0); // Reset throttle
    
    // Small delay to ensure state update, then send
    setTimeout(() => {
      handleSendMessage();
    }, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Show loading state while PDF is being processed or chapter is switching
  if (isExtracting || isChapterSwitching) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {isChapterSwitching ? 'Switching Chapter' : 'Loading Learning Assistant'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {isChapterSwitching 
              ? `Loading ${currentChapter} chat history...` 
              : 'Processing your social studies content. This may take a moment...'
            }
          </p>
        </motion.div>
      </div>
    );
  }

  // Show error state with retry option
  if (error && !isExtracting) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <AlertCircle className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Unable to Load Assistant
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={retryLoadPDF}
            disabled={isRetrying}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
          >
            {isRetrying ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Retrying...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    );
  }

  // Show main chat interface
  return (
    <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Ready to help!
            </h3>
            <p className="text-gray-600 text-lg">
              Ask me anything about {currentChapter}.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${message.role === 'user' ? 'message-user' : 'message-assistant'} px-6 py-4 message-fade-in`}>
                <div className="flex items-start space-x-3">
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="message-assistant px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-blue-500 rounded-xl flex items-center justify-center shadow-md">
                  <Loader className="w-5 h-5 animate-spin text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Thinking</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full typing-indicator"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full typing-indicator" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full typing-indicator" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-6 bg-white shadow-lg">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-red-600 whitespace-pre-wrap">{error}</p>
                {error.includes('Quota exceeded') ? (
                  <p className="text-xs text-red-500 mt-2">
                    Your API quota has been reached. This typically resets daily. Please check your plan at{' '}
                    <a 
                      href="https://ai.dev/usage?tab=rate-limit" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="underline hover:text-red-700"
                    >
                      Google AI Studio
                    </a>
                    {' '}or wait for the quota to reset.
                  </p>
                ) : (error.includes('Rate limit exceeded') || error.includes('429')) && !error.includes('Quota exceeded') ? (
                  <p className="text-xs text-red-500 mt-1">
                    The system will automatically retry. You can also click "Retry" below.
                  </p>
                ) : null}
              </div>
              {(error.includes('Rate limit exceeded') || error.includes('429') || error.includes('temporarily unavailable')) && 
               !error.includes('Quota exceeded') && (
                <button
                  onClick={handleRetryMessage}
                  disabled={isLoading}
                  className="ml-4 px-3 py-1.5 text-xs bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                >
                  <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Retry</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
        
        <div className="flex items-end space-x-4">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about ${currentChapter.split(' - ')[1] || currentChapter}...`}
              className="w-full px-6 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base resize-none"
              disabled={isLoading || isExtracting || !chunks.length}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || isExtracting || !chunks.length}
            className="px-6 py-4 bg-gradient-to-r from-orange-500 to-blue-500 hover:from-orange-600 hover:to-blue-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default PDFChatRAG;
