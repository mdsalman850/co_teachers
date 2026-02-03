import React, { useState, useRef, useEffect } from 'react';
import { Send, FileText, Trash2, Loader, MessageSquare, AlertCircle, RefreshCw, Brain, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  extractPDFText, 
  chunkText, 
  createSearchIndex, 
  searchChunks, 
  rerankChunks,
  type ScienceChunk 
} from '../utils/sciencePdfUtils';
import { callGemini, buildSciencePrompt } from '../utils/scienceGeminiApi';

interface ScienceRAGProps {
  apiKey: string;
  currentChapter: string;
  currentSubject: 'biology' | 'physics' | 'chemistry';
  pdfFile: File | null;
  onPdfLoaded: (loaded: boolean) => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface ChapterChatHistory {
  messages: Message[];
  lastUpdated: number;
}

const ScienceRAG: React.FC<ScienceRAGProps> = ({ 
  apiKey, 
  currentChapter, 
  currentSubject,
  pdfFile, 
  onPdfLoaded 
}) => {
  const [pdfText, setPdfText] = useState('');
  const [chunks, setChunks] = useState<ScienceChunk[]>([]);
  const [searchIndex, setSearchIndex] = useState<lunr.Index | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [error, setError] = useState('');
  const [isRetrying, setIsRetrying] = useState(false);
  const [isChapterSwitching, setIsChapterSwitching] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const MAX_MESSAGES_PER_CHAPTER = 50;
  const CHAT_HISTORY_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  const MAX_CONTEXT_CHUNKS = 10;

  // localStorage functions
  const saveChatHistoryToStorage = (chapterId: string, messages: Message[]) => {
    try {
      const historyData = {
        messages,
        lastUpdated: Date.now()
      };
      localStorage.setItem(`science_chat_${chapterId}`, JSON.stringify(historyData));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const loadChatHistoryFromStorage = (chapterId: string): ChapterChatHistory | null => {
    try {
      const stored = localStorage.getItem(`science_chat_${chapterId}`);
      if (stored) {
        const historyData = JSON.parse(stored);
        if (Date.now() - historyData.lastUpdated < CHAT_HISTORY_TIMEOUT) {
          return historyData;
        } else {
          localStorage.removeItem(`science_chat_${chapterId}`);
        }
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
    return null;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle chapter/subject switching
  useEffect(() => {
    const switchChapter = async () => {
      setIsChapterSwitching(true);
      setMessages([]);
      setInputMessage('');
      setError('');
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const chapterHistory = loadChatHistoryFromStorage(currentChapter);
      if (chapterHistory && chapterHistory.messages.length > 0) {
        setMessages(chapterHistory.messages);
      }
      
      setIsChapterSwitching(false);
    };

    switchChapter();
  }, [currentChapter, currentSubject]);

  // Auto-load PDF when component mounts or PDF file changes
  useEffect(() => {
    if (pdfFile) {
      // Reset state when PDF file changes
      setPdfText('');
      setChunks([]);
      setSearchIndex(null);
      setMessages([]);
      loadPDF();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfFile]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const loadPDF = async () => {
    if (!pdfFile) return;

    setError('');
    setIsExtracting(true);
    onPdfLoaded(false);

    try {
      const extractedText = await extractPDFText(pdfFile);
      if (!extractedText.trim()) {
        throw new Error('No text could be extracted from this PDF.');
      }

      setPdfText(extractedText);

      // Enhanced chunking
      const textChunks = chunkText(extractedText);
      setChunks(textChunks);

      // Create enhanced search index
      const index = createSearchIndex(textChunks);
      setSearchIndex(index);

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
    localStorage.removeItem(`science_chat_${currentChapter}`);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const addMessageToHistory = (message: Message) => {
    setMessages(prev => {
      const newMessages = [...prev, message];
      
      if (newMessages.length > MAX_MESSAGES_PER_CHAPTER) {
        newMessages.splice(0, newMessages.length - MAX_MESSAGES_PER_CHAPTER);
      }
      
      saveChatHistoryToStorage(currentChapter, newMessages);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        setMessages([]);
        localStorage.removeItem(`science_chat_${currentChapter}`);
      }, CHAT_HISTORY_TIMEOUT);
      
      return newMessages;
    });
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !searchIndex || !chunks.length || isLoading) {
      return;
    }

    if (!apiKey) {
      setError('Gemini API key is not configured. Please check your configuration.');
      return;
    }

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    setError('');

    const newUserMessage: Message = { 
      role: 'user', 
      content: userMessage,
      timestamp: Date.now()
    };
    addMessageToHistory(newUserMessage);

    try {
      // Enhanced multi-strategy search
      let relevantChunks = searchChunks(searchIndex, chunks, userMessage, MAX_CONTEXT_CHUNKS);
      
      // Re-rank chunks based on chapter relevance
      relevantChunks = rerankChunks(relevantChunks, userMessage, currentChapter);
      
      // Get additional context for relationship queries
      const relationshipKeywords = ['part', 'belong', 'include', 'member', 'category', 'type', 'kind', 'function', 'role', 'process'];
      const hasRelationshipQuery = relationshipKeywords.some(keyword => 
        userMessage.toLowerCase().includes(keyword)
      );
      
      if (hasRelationshipQuery && relevantChunks.length < 5) {
        const queryWords = userMessage.toLowerCase().split(/\s+/).filter(word => word.length > 2);
        const additionalChunks = chunks.filter(chunk => {
          const chunkText = chunk.text.toLowerCase();
          const mentionedTerms = queryWords.filter(word => chunkText.includes(word));
          return mentionedTerms.length >= 2;
        });
        
        if (additionalChunks.length > 0) {
          relevantChunks = [...relevantChunks, ...additionalChunks.slice(0, 3)];
          relevantChunks = relevantChunks.filter((chunk, index, self) => 
            index === self.findIndex(c => c.id === chunk.id)
          );
        }
      }

      // Build context from chunks
      let context = relevantChunks
        .map((chunk, index) => `[Context ${index + 1} - Pages ${chunk.page_range_start}-${chunk.page_range_end}]:\n${chunk.text}`)
        .join('\n\n---\n\n');

      // Get recent conversation history (last 6 messages for better context)
      const recentHistory = messages.slice(-6);
      const conversationHistory = recentHistory
        .map(msg => `${msg.role === 'user' ? 'Student' : 'Assistant'}: ${msg.content}`)
        .join('\n');

      // Build enhanced prompt
      const prompt = buildSciencePrompt(
        context,
        userMessage,
        currentChapter,
        currentSubject,
        conversationHistory
      );

      const systemMessage = {
        role: 'user',
        content: prompt
      };

      const response = await callGemini([systemMessage], apiKey, {
        maxOutputTokens: 2048,
        temperature: 0.2
      });
      
      // Clean up any markdown formatting
      const cleanResponse = response
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/### (.*?)$/gm, '$1')
        .replace(/## (.*?)$/gm, '$1')
        .replace(/# (.*?)$/gm, '$1')
        .replace(/^\s*[-*+]\s+/gm, '- ')
        .trim();
      
      const assistantMessage: Message = { 
        role: 'assistant', 
        content: cleanResponse,
        timestamp: Date.now()
      };
      addMessageToHistory(assistantMessage);

    } catch (err: any) {
      console.error('Chat error:', err);
      setError(`Failed to get response: ${err.message}`);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Loading state
  if (isExtracting || isChapterSwitching) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-lg"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Loader className="w-10 h-10 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {isChapterSwitching ? 'Switching Chapter' : 'Loading Science Assistant'}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed">
            {isChapterSwitching 
              ? `Loading ${currentChapter} chat history...` 
              : `Processing your ${currentSubject} content. This may take a moment...`
            }
          </p>
        </motion.div>
      </div>
    );
  }

  // Error state
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
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 mx-auto"
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

  // Main chat interface
  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-amber-50/30 to-stone-50 overflow-hidden">
      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
        {messages.length === 0 && !isLoading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-3">
              Ready to help with {currentSubject}!
            </h3>
            <p className="text-gray-600 text-lg mb-4">
              Ask me anything about {currentChapter}.
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-6">
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Scientific Concepts</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Processes & Systems</span>
              <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm">Formulas & Equations</span>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.timestamp}-${index}`}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-3xl ${
                message.role === 'user' 
                  ? 'bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl px-6 py-4 shadow-lg' 
                  : 'bg-white text-gray-800 rounded-2xl px-6 py-4 shadow-md border border-amber-100'
              }`}>
                <div className="flex items-start space-x-3">
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 mt-1 shadow-md">
                      <Sparkles className="w-5 h-5 text-white" />
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
            <div className="bg-white rounded-2xl px-6 py-4 shadow-md border border-amber-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
                  <Loader className="w-5 h-5 animate-spin text-white" />
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">Analyzing...</span>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-1 h-1 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-amber-200 p-6 bg-white/80 backdrop-blur-sm shadow-lg">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-sm text-red-600">{error}</p>
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
              placeholder={`Ask about ${currentChapter}...`}
              className="w-full px-6 py-4 border border-amber-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-base bg-white"
              disabled={isLoading || isExtracting || !chunks.length}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading || isExtracting || !chunks.length}
            className="px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl transition-all duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            aria-label="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
          {messages.length > 0 && (
            <button
              onClick={clearSession}
              className="px-4 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-all duration-200 flex items-center justify-center"
              aria-label="Clear chat"
              title="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
        
        <div className="mt-3 text-xs text-gray-500 text-center">
          Press Enter to send • Shift + Enter for new line
        </div>
      </div>
    </div>
  );
};

export default ScienceRAG;

