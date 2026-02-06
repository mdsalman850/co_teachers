import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader, AlertCircle, CheckCircle, XCircle, RefreshCw, Trophy, BookOpen } from 'lucide-react';
import { extractPDFText, chunkText } from '../utils/pdfUtils';
import { callGroq } from '../utils/groqApi';

interface QuizGeneratorProps {
    apiKey: string;
    currentChapter: string;
    pdfFile: File | null;
}

interface Question {
    id: number;
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
}

interface QuizData {
    questions: Question[];
}

const QuizGenerator: React.FC<QuizGeneratorProps> = ({ apiKey, currentChapter, pdfFile }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quizData, setQuizData] = useState<QuizData | null>(null);
    const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [pdfText, setPdfText] = useState<string>('');
    const [isExtracting, setIsExtracting] = useState(false);

    // Load PDF content
    useEffect(() => {
        const loadPdfContent = async () => {
            if (!pdfFile) return;

            setIsExtracting(true);
            try {
                const text = await extractPDFText(pdfFile);
                setPdfText(text);
            } catch (err) {
                console.error('Failed to extract PDF text:', err);
                setError('Failed to read chapter content from PDF.');
            } finally {
                setIsExtracting(false);
            }
        };

        loadPdfContent();
    }, [pdfFile]);

    // Generate Quiz when text is ready and not yet generated
    // useEffect(() => {
    //     if (pdfText && !quizData && !loading && !error) {
    //         generateQuiz();
    //     }
    // }, [pdfText]);

    const generateQuiz = async () => {
        if (!pdfText || !apiKey) return;

        setLoading(true);
        setError(null);

        try {
            // Strategy: Intelligent Context Selection
            // 1. Chunk the text
            // 2. Score chunks based on relevance to currentChapter
            // 3. Select top chunks to form context

            const chunks = chunkText(pdfText, 3000, 500); // 3000 chars per chunk

            // Words that are too generic to be useful for distinguishing chapters
            const stopWords = ['history', 'geography', 'political', 'science', 'economics', 'india', 'chapter', 'the', 'and', 'of', 'in', 'unit', 'syllabus'];

            // Normalize chapter name for keyword matching
            const chapterKeywords = currentChapter.toLowerCase()
                .replace(/[^a-z0-9\s]/g, '')
                .split(' ')
                .filter(w => w.length > 3 && !stopWords.includes(w))
                .map(w => w.trim());

            // Score chunks
            const scoredChunks = chunks.map(chunk => {
                const textLower = chunk.text.toLowerCase();
                let score = 0;

                // Keyword density scoring
                chapterKeywords.forEach(keyword => {
                    const regex = new RegExp(keyword, 'g');
                    const matches = textLower.match(regex);
                    if (matches) {
                        score += matches.length * 2;
                    }
                });

                // Bonus for exact chapter phrase (very strong indicator)
                // We strip the prefix "History - " etc if present for the check
                const coreChapterName = currentChapter.split('-').pop()?.trim().toLowerCase();
                if (coreChapterName && textLower.includes(coreChapterName)) {
                    score += 20;
                }

                // Negative scoring: Penalize if it looks like a different chapter
                // (Simple heuristic: if it mentions "Modern India" while we want "Ancient")
                if (currentChapter.includes('Ancient') && textLower.includes('modern')) score -= 10;
                if (currentChapter.includes('Ancient') && textLower.includes('british')) score -= 10;
                if (currentChapter.includes('Ancient') && textLower.includes('1947')) score -= 10;

                return { chunk, score };
            });

            // Sort by score (descending) and take top 3 relevant chunks
            // We then sort these top chunks by position to maintain narrative flow
            const topChunks = scoredChunks
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .sort((a, b) => a.chunk.position - b.chunk.position);

            const context = topChunks.map(c => c.chunk.text).join('\n\n...\n\n');

            const prompt = `
        Create a multiple-choice quiz for the chapter "${currentChapter}" using ONLY the provided text below.
        
        Requirements:
        1. Generate exactly 5 questions.
        2. Questions MUST be derived strictly from the provided text content that relates to "${currentChapter}".
        3. IGNORE text that belongs to other chapters (e.g., if you see "Modern India" words but the topic is "Ancient India", ignore that text).
        4. If the text mentions dates, figures, or definitions, focus on those.
        5. Provide 4 options for each question.
        6. JSON FORMAT ONLY.
        
        Output JSON Structure:
        {
          "questions": [
            {
              "id": 1,
              "question": "Question text",
              "options": ["A", "B", "C", "D"],
              "correctIndex": 0,
              "explanation": "Explanation"
            }
          ]
        }

        RELEVANT TEXT CONTENT:
        ${context}
      `;

            const response = await callGroq([
                { role: 'system', content: 'You are a helpful educational assistant that generates quizzes in strict JSON format.' },
                { role: 'user', content: prompt }
            ], apiKey, {
                model: 'llama-3.1-8b-instant',
                response_format: { type: 'json_object' }
            });

            // Parse response
            let parsedData: QuizData;
            try {
                // Find the first '{' and last '}' to extract JSON if there's extra text
                const jsonStart = response.indexOf('{');
                const jsonEnd = response.lastIndexOf('}');
                if (jsonStart !== -1 && jsonEnd !== -1) {
                    const jsonStr = response.substring(jsonStart, jsonEnd + 1);
                    parsedData = JSON.parse(jsonStr);
                } else {
                    parsedData = JSON.parse(response);
                }

                if (!parsedData.questions || !Array.isArray(parsedData.questions)) {
                    throw new Error("Invalid format");
                }
            } catch (parseErr) {
                console.error("JSON Parse Error:", parseErr, response);
                throw new Error("Failed to generate valid quiz data.");
            }

            setQuizData(parsedData);

        } catch (err: any) {
            console.error('Quiz generation error:', err);
            setError(err.message || 'Failed to generate quiz.');
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (questionId: number, optionIndex: number) => {
        if (submitted) return;
        setUserAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const handleSubmit = () => {
        if (!quizData) return;

        let newScore = 0;
        quizData.questions.forEach(q => {
            if (userAnswers[q.id] === q.correctIndex) {
                newScore++;
            }
        });
        setScore(newScore);
        setSubmitted(true);
    };

    const handleRetake = () => {
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
        // Optionally regenerate: setQuizData(null); generateQuiz();
        // For now, just reset the current quiz
    };

    const handleRegenerate = () => {
        setQuizData(null);
        setUserAnswers({});
        setSubmitted(false);
        setScore(0);
        generateQuiz();
    }

    if (isExtracting) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-blue-500 animate-pulse" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Reading Chapter...</h3>
                <p className="text-gray-500"> analyzing content for quiz generation</p>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4">
                    <Loader className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Generating Quiz...</h3>
                <p className="text-gray-500">Creating custom questions for {currentChapter}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center h-full">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops! Something went wrong</h3>
                <p className="text-red-600 mb-6 max-w-md">{error}</p>
                <button
                    onClick={generateQuiz}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <RefreshCw size={18} /> Try Again
                </button>
            </div>
        );
    }

    // if (!quizData) return null;

    if (!quizData && !loading && !error) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center h-full min-h-[400px]">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-200 transform rotate-3 hover:rotate-6 transition-transform">
                    <BookOpen className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-3">Ready to test your knowledge?</h3>
                <p className="text-gray-600 max-w-md mb-8">
                    Generate a custom AI quiz based specifically on the content from
                    <span className="font-semibold text-blue-700"> {currentChapter}</span>.
                </p>
                <button
                    onClick={generateQuiz}
                    disabled={!pdfText}
                    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none overflow-hidden"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    <span className="relative flex items-center gap-2">
                        <RefreshCw className={`w-5 h-5 ${!pdfText ? 'animate-pulse' : ''}`} />
                        {pdfText ? 'Generate Quiz Now' : 'Loading Textbook...'}
                    </span>
                </button>
                {!pdfText && (
                    <p className="text-xs text-gray-400 mt-3 animate-pulse">Reading chapter content...</p>
                )}
            </div>
        );
    }

    // Safety check for TypeScript
    if (!quizData) return null;

    return (
        <div className="max-w-4xl mx-auto p-6 pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{currentChapter} Quiz</h2>
                    <p className="text-gray-600">Test your knowledge with these AI-generated questions</p>
                </div>
                {!submitted && (
                    <div className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                        {Object.keys(userAnswers).length} / {quizData.questions.length} Answered
                    </div>
                )}
            </div>

            {submitted && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100 flex items-center justify-between shadow-sm"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                            {score === quizData.questions.length ? (
                                <Trophy className="w-8 h-8 text-yellow-500" />
                            ) : (
                                <span className="text-2xl font-bold text-green-600">{Math.round((score / quizData.questions.length) * 100)}%</span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-900">
                                {score === quizData.questions.length ? 'Perfect Score!' : 'Quiz Completed!'}
                            </h3>
                            <p className="text-green-700">
                                You got {score} out of {quizData.questions.length} questions correct.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRetake}
                            className="px-4 py-2 bg-white text-green-700 border border-green-200 rounded-lg hover:bg-green-50 font-medium transition-colors"
                        >
                            Retake Quiz
                        </button>
                        <button
                            onClick={handleRegenerate}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors shadow-sm flex items-center gap-2"
                        >
                            <RefreshCw size={16} /> New Questions
                        </button>
                    </div>
                </motion.div>
            )}

            <div className="space-y-6">
                {quizData.questions.map((q, index) => (
                    <motion.div
                        key={q.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`bg-white rounded-xl p-6 shadow-sm border ${submitted
                            ? userAnswers[q.id] === q.correctIndex
                                ? 'border-green-200 ring-1 ring-green-100'
                                : 'border-red-200 ring-1 ring-red-100'
                            : 'border-gray-200 hover:border-blue-200 transition-colors'
                            }`}
                    >
                        <div className="flex gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-semibold text-gray-600">
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">{q.question}</h3>

                                <div className="space-y-3">
                                    {q.options.map((option, optIndex) => {
                                        const isSelected = userAnswers[q.id] === optIndex;
                                        const isCorrect = q.correctIndex === optIndex;

                                        let optionClass = "border-gray-200 hover:bg-gray-50 hover:border-gray-300";

                                        if (submitted) {
                                            if (isCorrect) optionClass = "bg-green-50 border-green-300 text-green-800";
                                            else if (isSelected && !isCorrect) optionClass = "bg-red-50 border-red-300 text-red-800";
                                            else optionClass = "border-gray-200 opacity-60";
                                        } else if (isSelected) {
                                            optionClass = "bg-blue-50 border-blue-400 text-blue-800 ring-1 ring-blue-100";
                                        }

                                        return (
                                            <button
                                                key={optIndex}
                                                onClick={() => handleOptionSelect(q.id, optIndex)}
                                                disabled={submitted}
                                                className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-between group ${optionClass}`}
                                            >
                                                <span className="font-medium">{option}</span>
                                                {submitted && isCorrect && <CheckCircle className="w-5 h-5 text-green-500" />}
                                                {submitted && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {submitted && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <span className="font-bold text-gray-800">Explanation:</span> {q.explanation}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {!submitted && (
                <div className="mt-10 flex justify-center">
                    <button
                        onClick={handleSubmit}
                        disabled={Object.keys(userAnswers).length < quizData.questions.length}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        Submit Answers
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuizGenerator;
