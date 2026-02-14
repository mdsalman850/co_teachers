import React, { useState, useEffect, useCallback } from 'react';
import {
  ScrollText,
  Scale,
  Globe,
  Coins,
  BookOpen,
  Video,
  Brain,
  FileText,
  MessageSquare,
  Monitor,
  Play,
  Download,
  Send,
  ChevronDown,
  Landmark,
  Map,
  Users,
  TrendingUp,
  Crown,
  Compass,
  Building,
  Menu,
  Maximize,
  Minimize,
  X
} from 'lucide-react';
import PDFChatRAG from './components/PDFChatRAG';
import MughalSimulator from './components/MughalSimulator';
import SolarSystemSimulator from './components/SolarSystemSimulator';
import EarthCoreSimulator from './components/EarthCoreSimulator';
import AncientIndiaSimulator from './components/AncientIndiaSimulator';
import India9th14thSimulator from './components/India9th14thSimulator';
import PhysicalDivisionsSimulator from './components/PhysicalDivisionsSimulator';
import ModernIndiaTimeline from './components/ModernIndiaTimeline';
import VillageSimulator from './components/village-life-simulator';
import NaturalResourcesSimulator from './components/NaturalResourcesSimulator';
import Chapter10Simulator from './components/Chapter10Simulator';
import Chapter11Simulator from '../../components/Chapter11Simulator';
import EconomicSystemSimulator from './components/EconomicSystemSimulator';
import QuizGenerator from './components/QuizGenerator';
import { modelPapers } from './data/modelPapers';

// API Configuration
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';

// Removed FloatingIcon component - no floating background icons

const FloatingSymbol = ({ icon: Icon, className, delay = 0 }: { icon: any, className: string, delay?: number }) => (
  <div
    className={`absolute opacity-25 animate-float-gentle ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon
      size={64}
      className="text-amber-200/40 stroke-1"
      strokeWidth={1}
    />
  </div>
);

const ChapterItem = ({
  title,
  active,
  onClick,
  delay = 0,
  number
}: {
  title: string,
  active: boolean,
  onClick: () => void,
  delay?: number,
  number?: number
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left transition-all duration-500 ease-out transform hover:translate-x-2 hover:scale-105 group animate-fade-in ${active
      ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-l-3 border-amber-400 shadow-md scale-105'
      : 'bg-transparent hover:bg-white/60'
      }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center py-3 px-6 relative">
      <div className={`flex-1 font-medium transition-all duration-300 ${active
        ? 'text-amber-800 font-semibold'
        : 'text-stone-700 group-hover:text-stone-900'
        }`}>
        {number && `${number}. `}{title}
      </div>
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-400 rounded-r-full animate-pulse"></div>
      )}
    </div>
  </button>
);

const SubjectDropdown = ({
  title,
  children,
  isExpanded,
  onToggle
}: {
  title: string,
  children: React.ReactNode,
  isExpanded: boolean,
  onToggle: () => void
}) => (
  <div className="mb-2">
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between py-4 px-4 hover:bg-white/40 transition-all duration-300 ease-out transform hover:translate-x-0.5 group"
    >
      <div className="flex items-center gap-3">
        <div className="w-2.5 h-2.5 bg-gradient-to-br from-orange-500 to-red-500 rounded-full shadow-sm transition-transform duration-200 group-hover:scale-110"></div>
        <span className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors duration-200">{title}</span>
      </div>
      <div className="transition-transform duration-300 ease-out">
        <ChevronDown
          size={16}
          className={`text-gray-500 group-hover:text-gray-700 transition-all duration-300 ${isExpanded ? 'rotate-180' : ''
            }`}
        />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
      <div className="bg-gradient-to-b from-white/80 to-gray-50/60 backdrop-blur-sm border-l border-gray-200/50 ml-4 rounded-r-lg shadow-inner">
        <div className="py-2">
          {children}
        </div>
      </div>
    </div>
  </div>
);

// Custom hook for viewport detection
const useViewport = () => {
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080
  });

  const handleResize = useCallback(() => {
    setViewport({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, [handleResize]);

  return viewport;
};

// Responsive Video Player Component
const ResponsiveVideoPlayer = ({ src, title, className = "" }: { src: string, title: string, className?: string }) => {
  const viewport = useViewport();

  // Calculate optimal video height based on viewport
  const getVideoHeight = () => {
    const availableHeight = viewport.height - 250; // Reserve space for header, navigation, and taskbar
    const maxHeight = Math.min(650, availableHeight);
    const minHeight = 350;
    return Math.max(minHeight, maxHeight);
  };

  // Auto-scroll is now handled at the tab level in handleTabChange

  return (
    <div
      data-video-player
      className={`relative w-full rounded-xl shadow-lg border-2 border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
      style={{
        height: `${getVideoHeight()}px`,
        maxHeight: 'calc(100vh - 250px)',
        minHeight: '350px'
      }}
    >
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-xl"
        src={src}
        title={title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

const QuizCard = ({
  subject,
  question,
  options,
  answer,
  delay = 0
}: {
  subject: string,
  question: string,
  options: string[],
  answer: string,
  delay?: number
}) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <div
      className="bg-white rounded-lg p-6 shadow-md border border-stone-200 transition-all duration-300 hover:shadow-lg hover:scale-105 transform animate-fade-in opacity-0"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      <h3 className="font-semibold text-lg text-amber-800 mb-3">{subject}</h3>
      <p className="text-stone-700 mb-4 font-medium">{question}</p>
      <div className="space-y-2 mb-4">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => setSelectedOption(option)}
            className={`w-full text-left p-3 rounded-lg border transition-all duration-300 transform hover:scale-105 ${selectedOption === option
              ? 'bg-amber-100 border-amber-300 text-amber-800'
              : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
              }`}
          >
            {option}
          </button>
        ))}
      </div>
      {selectedOption && (
        <button
          onClick={() => setShowAnswer(true)}
          className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105"
        >
          Check Answer
        </button>
      )}
      {showAnswer && (
        <div className={`mt-3 p-3 rounded-lg transition-all duration-500 animate-fade-in ${selectedOption === answer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
          {selectedOption === answer ? 'Correct! ' : 'Incorrect. '}
          The correct answer is: {answer}
        </div>
      )}
    </div>
  );
};

const VideoCard = ({ title, description, delay = 0 }: { title: string, description: string, delay?: number }) => (
  <div
    className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 transform animate-fade-in opacity-0"
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div className="bg-gradient-to-r from-amber-100 to-stone-100 h-40 flex items-center justify-center">
      <Play size={48} className="text-amber-600 transition-transform duration-300 hover:scale-110" />
    </div>
    <div className="p-4">
      <h3 className="font-semibold text-lg text-stone-800 mb-2">{title}</h3>
      <p className="text-stone-600 text-sm">{description}</p>
    </div>
  </div>
);

// Badge component for header
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}>
    {children}
  </span>
);

// 1. Definition for Modal (add before App)
const PaperPreviewModal = ({ filename, onClose }: { filename: string, onClose: () => void }) => (
  <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex flex-col animate-fade-in transition-all duration-500">
    <div className="flex items-center justify-between p-4 bg-stone-900/95 text-white border-b border-stone-800 shadow-xl">
      <h3 className="text-lg font-semibold truncate flex-1 tracking-wide">{filename}</h3>
      <button
        onClick={onClose}
        className="p-2 hover:bg-stone-800 rounded-full transition-all duration-300 hover:rotate-90 active:scale-95"
      >
        <X size={24} />
      </button>
    </div>
    <div className="flex-1 bg-stone-800 relative animate-slide-up-fade">
      <iframe
        src={`/model_papers/${filename}`}
        className="w-full h-full border-none"
        title="PDF Preview"
      />
    </div>
  </div>
);

// 2. Updated ModelPaperCard
const ModelPaperCard = ({ title, description, year, filename, onPreview, delay = 0 }: { title: string, description: string, year: string, filename: string, onPreview: () => void, delay?: number }) => (
  <div
    className="group relative bg-white rounded-xl shadow-sm border border-stone-200 p-6 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden"
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    {/* Top Accent Border */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700 ease-out"></div>

    <div className="flex justify-between items-start mb-4">
      <div className="bg-amber-50 p-3 rounded-lg group-hover:bg-amber-100 transition-colors duration-500">
        <FileText className="text-amber-600 w-6 h-6 transform group-hover:scale-110 transition-transform duration-500" />
      </div>
      <span className="bg-stone-100 text-stone-600 px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase border border-stone-200 group-hover:border-amber-200 group-hover:text-amber-700 transition-all duration-500">
        {year}
      </span>
    </div>

    <h3 className="font-bold text-lg text-stone-800 mb-2 group-hover:text-amber-700 transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
      {title}
    </h3>

    <p className="text-stone-500 text-sm mb-6 line-clamp-2 group-hover:text-stone-600 transition-colors duration-300">
      {description}
    </p>

    <button
      onClick={onPreview}
      className="w-full bg-stone-900 text-white px-4 py-3 rounded-lg hover:bg-gradient-to-r hover:from-amber-600 hover:to-orange-600 transition-all duration-300 flex items-center justify-center gap-2 font-medium shadow-md hover:shadow-orange-200 active:scale-95 transform"
    >
      <Monitor size={18} />
      <span>Preview Paper</span>
    </button>
  </div>
);

const SimulatorCard = ({ title, description, icon: Icon, delay = 0 }: { title: string, description: string, icon: any, delay?: number }) => (
  <div
    className="bg-white rounded-lg shadow-md border border-stone-200 p-6 transition-all duration-300 hover:shadow-lg hover:scale-105 transform animate-fade-in opacity-0"
    style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
  >
    <div className="flex items-center gap-3 mb-3">
      <div className="bg-amber-100 p-2 rounded-lg transition-transform duration-300 hover:rotate-12">
        <Icon size={24} className="text-amber-600" />
      </div>
      <h3 className="font-semibold text-lg text-stone-800">{title}</h3>
    </div>
    <p className="text-stone-600 mb-4">{description}</p>
    <button className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105 flex items-center gap-2">
      <Play size={16} />
      Launch Simulator
    </button>
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeChapter, setActiveChapter] = useState('ancient-india');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedPaper, setSelectedPaper] = useState<string | null>(null); // New state for PDF preview
  const [expandedSections, setExpandedSections] = useState({
    history: true,
    geography: false,
    politicalScience: false,
    economics: false
  });
  const [assistantQuestion, setAssistantQuestion] = useState('');
  const [assistantReply, setAssistantReply] = useState('');
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [isPdfLoaded, setIsPdfLoaded] = useState(false);
  const [videoLanguage, setVideoLanguage] = useState<'english' | 'hindi-urdu'>('english');

  // Fullscreen functionality
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyPress);
      return () => document.removeEventListener('keydown', handleKeyPress);
    }
  }, [isFullscreen]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;

    setActiveTab(newTab);
    // Removed animationKey update - only update when chapter changes to prevent unnecessary remounts

    // Auto-scroll to video player when Videos tab is clicked
    if (newTab === 'videos') {
      setTimeout(() => {
        const videoElement = document.querySelector('[data-video-player]');
        if (videoElement) {
          videoElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 150); // Small delay to ensure content is rendered
    }
  };

  // Removed animationKey update - using key prop causes unnecessary remounts
  // React will handle content updates naturally based on activeChapter and activeTab state

  // Auto-scroll when chapter changes (tab-specific behavior)
  useEffect(() => {
    // Small delay to ensure content is rendered
    setTimeout(() => {
      if (activeTab === 'videos') {
        // For Videos tab: scroll to video player
        const videoElement = document.querySelector('[data-video-player]');
        if (videoElement) {
          videoElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      } else {
        // For all other tabs (Overview, Model Papers, Quiz, Simulator, Assistant): scroll to top
        const mainContent = document.querySelector('.flex-1.overflow-y-auto.scrollbar-hide');
        if (mainContent) {
          mainContent.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        } else {
          // Fallback: scroll the entire window to top
          window.scrollTo({
            top: 0,
            behavior: 'smooth'
          });
        }
      }
    }, 100); // Small delay to ensure content is rendered
  }, [activeChapter, activeTab]);

  const quizQuestions = [
    {
      subject: 'History',
      question: 'Who was the first Mughal Emperor?',
      options: ['(a) Akbar', '(b) Babur', '(c) Humayun', '(d) Aurangzeb'],
      answer: '(b) Babur'
    },
    {
      subject: 'Civics',
      question: 'Which is the highest court in India?',
      options: ['(a) High Court', '(b) Supreme Court', '(c) District Court', '(d) Gram Panchayat'],
      answer: '(b) Supreme Court'
    },
    {
      subject: 'Geography',
      question: 'Which is the largest continent?',
      options: ['(a) Africa', '(b) Asia', '(c) Europe', '(d) Antarctica'],
      answer: '(b) Asia'
    },
    {
      subject: 'Economics',
      question: 'Which term means rise in general price levels?',
      options: ['(a) Inflation', '(b) Recession', '(c) Barter', '(d) Trade'],
      answer: '(a) Inflation'
    }
  ];

  const handleAssistantSubmit = () => {
    if (assistantQuestion.trim()) {
      setAssistantReply(`That's a great question about "${assistantQuestion}". I'm here to help you learn! Let me provide some guidance on this topic. Would you like me to explain it step by step?`);
    }
  };

  // Function to get chapter display name
  const getChapterDisplayName = (chapterId: string): string => {
    const chapterMap: { [key: string]: string } = {
      'ancient-india': 'History - Ancient India',
      'india-9th-14th': 'History - India from 9th to 14th CE',
      'mughal-emperors': 'History - Mughal Emperors',
      'modern-india': 'History - Modern India',
      'telangana-history': 'History - Telangana History and State Formation',
      'our-universe': 'Geography - Our Universe',
      'all-about-villages': 'Geography - All About Villages',
      'physical-divisions': 'Geography - Physical Divisions Of India',
      'natural-resources': 'Geography - Natural Resources',
      'indian-constitution': 'Political Science - Indian Constitution',
      'union-state-government': 'Political Science - Union and State Government',
      'economic-system': 'Economics - Economic System'
    };
    return chapterMap[chapterId] || chapterId.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  // Load PDF file on component mount
  useEffect(() => {
    const loadPDFFile = async () => {
      try {
        // Try different possible paths for the PDF file
        const possiblePaths = [
          '/FINAL AICU TEXTBOOK  SOCIAL STUDIES-24-25 (1).pdf',
          './FINAL AICU TEXTBOOK  SOCIAL STUDIES-24-25 (1).pdf'
        ];

        let pdfLoaded = false;
        for (const path of possiblePaths) {
          try {
            const response = await fetch(path);
            if (response.ok) {
              const blob = await response.blob();
              const file = new File([blob], 'Social Studies Textbook.pdf', { type: 'application/pdf' });
              setPdfFile(file);
              pdfLoaded = true;
              break;
            }
          } catch (err) {
            console.log(`Failed to load PDF from ${path}:`, err);
          }
        }

        if (!pdfLoaded) {
          console.error('Could not load PDF from any of the attempted paths');
        }
      } catch (error) {
        console.error('Failed to load PDF:', error);
      }
    };

    loadPDFFile();
  }, []);

  const renderContent = () => {
    // Persistent Assistant is handled by the wrapper
    if (activeTab === 'assistant') return null;
    // Model Papers content is now independent of chapters
    if (activeTab === 'papers') {
      return (
        <div className="space-y-8 pb-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-white rounded-2xl p-10 border border-amber-100 shadow-sm text-center">
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-amber-200 rounded-full opacity-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-orange-200 rounded-full opacity-20 blur-3xl"></div>

            <Badge className="mb-4 bg-white/80 backdrop-blur-sm text-amber-700 border-amber-200 px-4 py-1.5 shadow-sm mx-auto w-fit">
              Exam Preparation
            </Badge>
            <h1 className="text-4xl md:text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
              Model <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-600">Question Papers</span>
            </h1>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Access currated collection of previous year question papers and weekly assessments to boost your exam readiness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {modelPapers.map((paper, index) => (
              <ModelPaperCard
                key={paper.id}
                title={paper.title}
                description={paper.description}
                year={paper.year}
                filename={paper.filename}
                onPreview={() => setSelectedPaper(paper.filename)}
                delay={0.1 * (index + 1)}
              />
            ))}
          </div>
        </div>
      );
    }

    // Get chapter-specific content
    const getChapterContent = () => {
      switch (activeChapter) {
        case 'ancient-india':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Ancient India</h1>
                    <p className="text-lg text-stone-600">The foundation of Indian civilization and culture</p>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-6 border-b-2 border-amber-200 pb-2">
                      The Main Periods of Ancient Indian History
                    </h3>

                    <div className="space-y-6">
                      {/* Indus Valley Civilization */}
                      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-5 border-l-4 border-blue-400">
                        <h4 className="text-xl font-bold text-blue-800 mb-3">1. Indus Valley Civilization (2500 BCE - 1500 BCE)</h4>
                        <div className="space-y-2 text-stone-700">
                          <p><strong className="text-blue-700">When:</strong> This was a very, very old time, from about 2500 years before Jesus Christ to 1500 years before.</p>
                          <p><strong className="text-blue-700">Where:</strong> People lived in what is now Pakistan and parts of northwest India.</p>
                          <p><strong className="text-blue-700">What was special:</strong> This was one of the first big city civilisations in the world!</p>
                          <ul className="ml-6 space-y-1">
                            <li>• The cities like Harappa and Mohenjo-daro were very smart.</li>
                            <li>• They had amazing town planning with straight streets and good drainage systems, like modern cities.</li>
                            <li>• Mohenjo-daro was even called the "City of Dead".</li>
                          </ul>
                          <p><strong className="text-blue-700">How they lived:</strong> They grew food like crops and traded with other places.</p>
                          <p><strong className="text-blue-700">Why it ended:</strong> We don't know exactly why these cities disappeared, but it might have been due to floods, earthquakes, or changes in the environment. This civilisation showed how advanced ancient India was.</p>
                        </div>
                      </div>

                      {/* Vedic Period */}
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5 border-l-4 border-green-400">
                        <h4 className="text-xl font-bold text-green-800 mb-3">2. Vedic Period (c. 1500 – 600 BCE)</h4>
                        <div className="space-y-2 text-stone-700">
                          <p><strong className="text-green-700">When:</strong> After the Indus cities, this period lasted from about 1500 BCE to 600 BCE.</p>
                          <p><strong className="text-green-700">What was special:</strong> This time is named after the Vedas, which are very old holy books of Hinduism.</p>
                          <ul className="ml-6 space-y-1">
                            <li>• The Rigveda, the oldest Veda, was written during this time.</li>
                            <li>• People called Indo-Aryans arrived in India.</li>
                            <li>• They lived in groups called Janas, like small tribes.</li>
                          </ul>
                          <p><strong className="text-green-700">How they lived:</strong> They first looked after animals (pastoralism) and then started farming more.</p>
                        </div>
                      </div>

                      {/* Maurya Empire */}
                      <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-5 border-l-4 border-purple-400">
                        <h4 className="text-xl font-bold text-purple-800 mb-3">3. Maurya Empire (c. 322 – 185 BCE)</h4>
                        <div className="space-y-2 text-stone-700">
                          <p><strong className="text-purple-700">When:</strong> This was a time of a very big empire, from around 322 BCE to 185 BCE.</p>
                          <p><strong className="text-purple-700">Important Rulers:</strong></p>
                          <ul className="ml-6 space-y-1">
                            <li>• Chandragupta Maurya started this empire. He was a powerful king.</li>
                            <li>• His grandson, Ashoka, became one of the most famous rulers.</li>
                            <li className="ml-4">▪ Ashoka changed his heart after a big war and became a follower of Buddhism.</li>
                            <li className="ml-4">▪ He taught everyone about peace and kindness.</li>
                          </ul>
                          <p><strong className="text-purple-700">What was special:</strong></p>
                          <ul className="ml-6 space-y-1">
                            <li>• It was the first big empire that covered almost all of India.</li>
                            <li>• The capital city was Pataliputra (which is now Patna).</li>
                            <li>• They had a very organised government.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Gupta Empire */}
                      <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-5 border-l-4 border-yellow-400">
                        <h4 className="text-xl font-bold text-yellow-800 mb-3">4. Gupta Empire (c. 320 – 550 CE)</h4>
                        <div className="space-y-2 text-stone-700">
                          <p><strong className="text-yellow-700">When:</strong> This empire existed from about 320 CE to 550 CE.</p>
                          <p><strong className="text-yellow-700">What was special:</strong> This time is called the "Golden Age" of India!</p>
                          <ul className="ml-6 space-y-1">
                            <li>• There were big discoveries in science and mathematics. For example, scholars like Aryabhata made important contributions.</li>
                            <li>• Art and literature also grew wonderfully.</li>
                            <li>• Kings like Chandragupta I started it, and Chandragupta II made it very strong.</li>
                            <li>• Famous learning places like Nalanda and Taxila Universities were built.</li>
                            <li>• Hinduism became very popular again.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Post-Gupta Period */}
                      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-5 border-l-4 border-red-400">
                        <h4 className="text-xl font-bold text-red-800 mb-3">5. Post-Gupta Period (c. 550 – 1200 CE)</h4>
                        <div className="space-y-2 text-stone-700">
                          <p><strong className="text-red-700">When:</strong> After the Gupta Empire, this period lasted from about 550 CE to 1200 CE.</p>
                          <p><strong className="text-red-700">What happened:</strong></p>
                          <ul className="ml-6 space-y-1">
                            <li>• India had many smaller kingdoms instead of one big empire.</li>
                            <li>• Some tribes from Central Asia, like the Huns, tried to invade.</li>
                            <li>• Hinduism and Buddhism started to spread to countries in Southeast Asia.</li>
                          </ul>
                        </div>
                      </div>

                      {/* Chola Dynasty */}
                      <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-5 border-l-4 border-orange-400">
                        <h4 className="text-xl font-bold text-orange-800 mb-3">6. Chola Dynasty (c. 9th – 13th century CE)</h4>
                        <div className="space-y-2 text-stone-700">
                          <p><strong className="text-orange-700">When:</strong> The Cholas ruled for a very long time, from the 9th century CE to the 13th century CE.</p>
                          <p><strong className="text-orange-700">Where:</strong> They were powerful in the southern part of India, especially in Tamil Nadu.</p>
                          <p><strong className="text-orange-700">What was special:</strong></p>
                          <ul className="ml-6 space-y-1">
                            <li>• They were famous for their trade by sea and their strong navy.</li>
                            <li>• They loved art and architecture.</li>
                            <li>• They built magnificent temples, like the famous Brihadeeswarar Temple in Thanjavur.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-200">
                    <h3 className="text-2xl font-bold text-emerald-800 mb-4">Why is Learning Ancient Indian History Important?</h3>
                    <p className="text-stone-700 text-lg leading-relaxed">
                      Learning about Ancient Indian History is super important because it helps us understand where we come from. It teaches us about the brilliant ideas, beautiful art, and brave people who lived long ago. Knowing our history helps us appreciate our diverse cultures and makes us smart, caring, and ready to learn new things throughout our lives. It shows us how people solved problems and built amazing things, which can inspire us today!
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/FpmfWYMFSW0?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/b0MX-iM-ous?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Ancient India - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>
                  <div className="bg-white rounded-lg p-8 shadow-lg border border-stone-200">
                    <h3 className="text-xl font-semibold text-stone-800 mb-6 text-center">Introduction to Ancient India</h3>

                    {/* Language Toggle Buttons */}
                    <div className="flex justify-center mb-8">
                      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                        <button
                          onClick={() => setVideoLanguage('english')}
                          className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md hover:scale-105 border border-transparent'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇺🇸</span>
                            English
                          </span>
                        </button>
                        <button
                          onClick={() => setVideoLanguage('hindi-urdu')}
                          className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                            ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md hover:scale-105 border border-transparent'
                            }`}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-lg">🇮🇳</span>
                            Hindi/Urdu
                          </span>
                        </button>
                      </div>
                    </div>

                    <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                      <ResponsiveVideoPlayer
                        src={videoUrls[videoLanguage]}
                        title={`Introduction to Ancient India - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                      />
                    </div>
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Ancient India - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Ancient India model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                      <AncientIndiaSimulator className="w-full" />
                    </div>
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Ancient India - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Ancient India</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Ancient India content.</p>
                  </div>
                </div>
              );
          }
        case 'india-9th-14th':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">India from 9th to 14th CE</h1>
                    <p className="text-lg text-stone-600">A period of significant political changes and the establishment of Muslim rule in India</p>
                  </div>

                  {/* Mahmud of Ghazni */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Mahmud of Ghazni</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 11th Century</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Conquests & Legacy</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was the ruler of the Ghaznavid Empire and is famous for his seventeen raids into the Indian subcontinent.</li>
                      <li>• During his raids, he plundered wealthy temples and gathered great riches.</li>
                      <li>• He was a great supporter of art, culture, and learning.</li>
                      <li>• His court in the city of Ghazni was a famous centre for scholars, poets, and artists.</li>
                    </ul>
                  </div>

                  {/* Mohammed Ghori */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Mohammed Ghori</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 12th Century</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was a ruler from the Ghurid dynasty in Afghanistan.</li>
                      <li>• He is best known for his military campaigns in the Indian subcontinent.</li>
                      <li>• He established a powerful empire that laid the foundation for the Delhi Sultanate.</li>
                    </ul>
                  </div>

                  {/* Qutbuddin Aibak */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Qutbuddin Aibak</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> Ruled from 1206 AD</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Achievements</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was the founder of the Ghulam (Slave) Dynasty in India.</li>
                      <li>• His rule marked the beginning of Muslim rule in India.</li>
                      <li>• He built the famous Qutub Minar, a victory tower in Delhi, which is a testament to his legacy.</li>
                      <li>• Originally a Turkic slave, he rose to become the ruler of the Delhi Sultanate.</li>
                    </ul>
                  </div>

                  {/* Khilji Dynasty */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Khilji Dynasty</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1290 to 1320</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Key Rulers & Achievements</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The dynasty was founded by Jalaluddin Khilji.</li>
                      <li>• Its most powerful ruler was Alauddin Khilji, who successfully repelled Mongol invasions and conquered the Deccan region.</li>
                      <li>• Alauddin Khilji introduced a smart administrative system called the "dagh" system, which involved branding horses to maintain a strong army.</li>
                    </ul>
                  </div>

                  {/* Bahlul Lodi */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Bahlul Lodi</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1451 to 1489</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was the founder of the Lodi dynasty and ruled over the Delhi Sultanate.</li>
                      <li>• He was known for his military skills and administrative reforms.</li>
                      <li>• He successfully expanded the territories of his kingdom and strengthened the central government.</li>
                      <li>• His rule marked the transition from the Sayyid dynasty to the Lodi dynasty.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Mahmud of Ghazni – Famous for 17 raids and a love for art and culture.</li>
                      <li>• Mohammed Ghori – Laid the foundation for the Delhi Sultanate in India.</li>
                      <li>• Qutbuddin Aibak – Founder of the Ghulam Dynasty and builder of the Qutub Minar.</li>
                      <li>• Alauddin Khilji – Stopped Mongol invasions and created the "dagh" system for his army.</li>
                      <li>• Bahlul Lodi – Founder of the Lodi dynasty who expanded the Delhi Sultanate.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-700 text-center leading-relaxed">
                      This chapter helps us understand how India changed during this time. We learn about the new rulers and dynasties that came to power and see how their actions shaped the history of the Indian subcontinent.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/tKmP4_a4gpo?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/tKmP4_a4gpo?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">India from 9th to 14th CE - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md hover:scale-105 border border-transparent'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-gray-600 hover:text-gray-800 hover:bg-white hover:shadow-md hover:scale-105 border border-transparent'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`India from 9th to 14th CE - ${videoLanguage === 'english' ? 'English' : 'Hinglish'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">India from 9th to 14th CE - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">India from 9th to 14th CE model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <India9th14thSimulator className="w-full" />
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">India from 9th to 14th CE - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">India from 9th to 14th CE</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view India from 9th to 14th CE content.</p>
                  </div>
                </div>
              );
          }
        case 'mughal-emperors':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Mughal Emperors</h1>
                    <p className="text-lg text-stone-600">A period of great rulers who established one of the most powerful empires in Indian history</p>
                  </div>

                  {/* Babur */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Babur</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1526–1530</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Achievements</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was the founder of the Mughal Empire in India.</li>
                      <li>• Originally from Turkistan, he was a brave warrior and a skilled leader.</li>
                      <li>• In 1526, he defeated Ibrahim Lodhi, the Sultan of Delhi, in the famous Battle of Panipat.</li>
                      <li>• He wrote about his life in a book called "Tuzuk-I-Baburi" in the Turkish language.</li>
                    </ul>
                  </div>

                  {/* Humayun */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Humayun</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1530–1540</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was Babur's eldest son and the second emperor of the Mughal Empire.</li>
                      <li>• He faced many challenges and was forced to leave his throne by Sher Shah Suri.</li>
                      <li>• He later returned, regained his power in 1555, and expanded the empire.</li>
                    </ul>
                  </div>

                  {/* Akbar the Great */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Akbar the Great</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1556–1605</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Often considered the greatest Mughal emperor, he was the son of Humayun and the fourth Mughal emperor.</li>
                      <li>• He was known for his great love for art, especially painting.</li>
                      <li>• During his rule, Mughal art and culture reached new heights.</li>
                    </ul>
                  </div>

                  {/* Shah Jahan */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Shah Jahan</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1628–1658</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The fifth Mughal emperor, he was the eldest son of Jahangir.</li>
                      <li>• He is famous for building the beautiful Taj Mahal in Agra as a memorial for his beloved wife, Mumtaz Mahal.</li>
                      <li>• His reign is called the "Golden Age" of Mughal architecture because of the many magnificent buildings he created.</li>
                    </ul>
                  </div>

                  {/* Aurangzeb */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Aurangzeb</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1659–1707</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Reforms</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• He was the sixth Mughal emperor and a powerful but controversial ruler.</li>
                      <li>• He imprisoned his father, Shah Jahan, to seize the throne and took the title Alamgir (World holder).</li>
                      <li>• He banned the practice of sati, along with music, gambling, and drinking alcohol in his kingdom.</li>
                      <li>• Despite banning music at his court, he was an expert at playing the musical instrument "VEENA".</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Babur – Founder of the Mughal Empire after the Battle of Panipat.</li>
                      <li>• Humayun – Lost his throne to Sher Shah Suri but later regained it.</li>
                      <li>• Akbar – Known for religious tolerance and the "Golden Age of the Mughal Empire".</li>
                      <li>• Jahangir – A great lover and patron of painting and Mughal art.</li>
                      <li>• Shah Jahan – Built the famous Taj Mahal for his wife, Mumtaz Mahal.</li>
                      <li>• Aurangzeb – A powerful ruler who banned the practice of sati.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      This chapter helps us see how the Mughals changed India with their new ideas, strong rule, and great buildings like the Taj Mahal. Learning about them teaches us about an important period in India's rich and diverse history.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/O-L2wdH9fv8?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/fSHhC9onj5w?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Mughal Emperors - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Mughal Emperors - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Mughal Emperors - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Mughal Emperors model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <MughalSimulator className="w-full" />
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Mughal Emperors - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Mughal Emperors</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Mughal Emperors content.</p>
                  </div>
                </div>
              );
          }
        case 'modern-india':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Modern India</h1>
                    <p className="text-lg text-stone-600">A period of struggle, resistance, and the journey towards independence from British rule</p>
                  </div>

                  {/* European Traders & the British */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">European Traders & the British</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> From the 15th Century onwards</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Events</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• For a long time, trade between India and Europe happened over land through Constantinople.</li>
                      <li>• When this land route was closed in 1453, Europeans had to find new sea routes.</li>
                      <li>• A Portuguese explorer named Vasco da Gama was the first to find a sea route to India.</li>
                      <li>• After the Portuguese, other Europeans like the Dutch, the English, and the French also came to India for trade.</li>
                      <li>• The Europeans, especially the British, eventually established an empire and captured rule in India.</li>
                    </ul>
                  </div>

                  {/* Battle of Plassey */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Battle of Plassey</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 23 June 1757</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• This famous battle was fought in Bengal between the British East India Company, led by Robert Clive, and the Nawab of Bengal, Siraj ud-Daulah.</li>
                      <li>• The British won, which marked the beginning of British rule in India.</li>
                      <li>• The Battle of Plassey is significant because it laid the foundation for the British Empire in India.</li>
                    </ul>
                  </div>

                  {/* Battle of Buxar */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Battle of Buxar</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 22 October 1764</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• This battle took place near the town of Buxar in Bihar.</li>
                      <li>• The British East India Company, led by Hector Munro, fought against the combined armies of the Nawab of Oudh, the Mughal Emperor Shah Alam II, and the Nawab of Bengal.</li>
                      <li>• The British won because they had better weapons and strategy.</li>
                      <li>• This victory was a turning point that paved the way for British control over much of India.</li>
                    </ul>
                  </div>

                  {/* Revolt of 1857 */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Revolt of 1857</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 1857</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Events</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Revolt of 1857 was a great event in the history of modern India, though it was mostly confined to northern and central India.</li>
                      <li>• The reasons for the revolt were political, economic, social, and military.</li>
                      <li>• Indian soldiers lacked modern weapons and resources, so the English were able to suppress the revolt.</li>
                      <li>• Although the revolt failed, it was a major movement that inspired future freedom fighters.</li>
                    </ul>
                  </div>

                  {/* The Independence Movement */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Independence Movement</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> Late 19th and early 20th Century</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Indian independence movement was a great people's movement against British rule, with people of all religions and communities participating.</li>
                      <li>• Mahatma Gandhi became a key leader, turning the national struggle into a mass movement.</li>
                      <li>• Under Gandhiji's leadership, major movements like the Non-Cooperation Movement, the Civil Obedience Movement, and the Quit India Movement were organised.</li>
                    </ul>
                  </div>

                  {/* Freedom in 1947 */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Freedom in 1947</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> 15 August 1947</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Achievements</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• After a long struggle by many national leaders and freedom fighters, India achieved Independence from British rule.</li>
                      <li>• Jawaharlal Nehru became the first Prime Minister of independent India.</li>
                      <li>• Our national flag was designed by Pingali Venkayya.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Vasco da Gama – Found the sea route from Europe to India for trade.</li>
                      <li>• Battle of Plassey (1757) – Marked the beginning of British rule in India.</li>
                      <li>• Battle of Buxar (1764) – Strengthened British control over much of India.</li>
                      <li>• Revolt of 1857 – A great but unsuccessful uprising against the British.</li>
                      <li>• Mahatma Gandhi – Led the freedom movement with non-cooperation and other protests.</li>
                      <li>• August 15, 1947 – The day India finally achieved its freedom from British rule.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      This chapter shows us how India's struggle against the British led to freedom in 1947. It teaches us about the bravery of our freedom fighters, the importance of unity, and the hope for a better future.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/QHeoz6150wE?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/97BcIO08aJ8?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Modern India - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇮🇳</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Modern India - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Modern India - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Modern India model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                      <ModernIndiaTimeline />
                    </div>
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Modern India - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Modern India</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Modern India content.</p>
                  </div>
                </div>
              );
          }
        case 'telangana-history':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Telangana History and State Formation</h1>
                    <p className="text-lg text-stone-600">Telangana is a land of rich culture and heritage, with a colourful history of brave rulers and a long journey to becoming India's 29th state.</p>
                  </div>

                  {/* Ancient Times */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Ancient Times</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> Long, long ago.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Telangana was ruled by great dynasties like the Satavahanas, Kakatiyas, and Qutb Shahis of Hyderabad.</li>
                      <li>• These rulers built magnificent forts, beautiful mosques, and temples, creating vibrant cities.</li>
                      <li>• They left behind a rich legacy that continues to enchant us today.</li>
                    </ul>
                  </div>

                  {/* The Struggle for Freedom */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Struggle for Freedom</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> During India's fight for freedom.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Events:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The people of Telangana joined the rest of India in the movement against British rule.</li>
                      <li>• Brave men and women from this land contributed to the freedom struggle with their courage and determination.</li>
                    </ul>
                  </div>

                  {/* The Journey to Statehood */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Journey to Statehood</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> After India gained independence until 2014.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• After independence, Telangana was a part of Andhra Pradesh state.</li>
                      <li>• The people of the region always dreamed of self-governance.</li>
                      <li>• After many years of struggle, Telangana was formed as the 29th state of India on June 2, 2014.</li>
                    </ul>
                  </div>

                  {/* Celebrations of Telangana */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Celebrations of Telangana</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> Since its formation in 2014.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Culture & Progress:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Telangana is blossoming into a hub of culture, technology, and progress.</li>
                      <li>• The state is known for its joyful and colourful festivals, such as Bathukamma and Bonalu.</li>
                      <li>• The government follows the principle of "Progress – Justice for all" to implement many programmes.</li>
                    </ul>
                  </div>

                  {/* Physical Features */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Physical Features</h3>
                    <p className="text-stone-600 mb-4"><strong>Geography:</strong></p>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Telangana region is a part of the Deccan Plateau and lies in the Tropical Zone.</li>
                      <li>• Major rivers like the Godavari (also known as Dakhshin Ganga), Krishna, Manjeera, and Musi flow through the state.</li>
                      <li>• The state has 33 Districts, and its capital is Hyderabad, which is the fifth-largest city in the country.</li>
                      <li>• By area, Telangana is the twelfth largest state in India.</li>
                    </ul>
                  </div>

                  {/* Climate */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Climate</h3>
                    <p className="text-stone-600 mb-4"><strong>Weather Patterns:</strong></p>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Telangana experiences an extreme climate because it does not have the influence of the sea.</li>
                      <li>• The average maximum temperature is 44°C, and the minimum temperature is 15°C.</li>
                    </ul>
                  </div>

                  {/* Population */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Population</h3>
                    <p className="text-stone-600 mb-4"><strong>Facts & Figures:</strong></p>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• According to the 2011 census, the population of Telangana was 3.62 Crores.</li>
                      <li>• The state's population density is 312 people per square kilometre.</li>
                      <li>• Hyderabad is the most densely populated district, while Adilabad is the least.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Ancient Rulers – Satavahanas, Kakatiyas, and Qutb Shahis.</li>
                      <li>• State Formation Day – June 2, 2014, becoming the 29th state.</li>
                      <li>• Major Festivals – Bathukamma and Bonalu.</li>
                      <li>• Capital City – Hyderabad, the fifth-largest city in India.</li>
                      <li>• Main Rivers – Godavari and Krishna.</li>
                      <li>• Geography – Part of the Deccan Plateau.</li>
                      <li>• 2011 Population – 3.62 Crores.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      Learning about Telangana's history helps us understand its rich culture, the struggles of its people, and the long journey to statehood. This story of determination reminds us of the importance of unity in building a better future.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/tUppNee-v9U?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/hrEbiTJhmgk?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Telangana History and State Formation - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Telangana History and State Formation - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Telangana History and State Formation - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Telangana History and State Formation model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <>
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-amber-800 mb-4">Telangana History and State Formation - Interactive Simulators</h2>
                    <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                      <div className="text-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Telangana Visualization Simulator</h3>
                      </div>
                      <div className="relative w-full h-[700px] border border-gray-300 rounded-lg overflow-hidden">
                        <iframe
                          src="/simulators/telangana/index.html"
                          title="Telangana Visualization Simulator"
                          className="w-full h-full border-none"
                          allowFullScreen
                        />
                        <button
                          onClick={toggleFullscreen}
                          className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-700 hover:text-gray-900 p-2 rounded-lg shadow-md transition-all duration-200 z-10"
                          title="Toggle Fullscreen"
                        >
                          <Maximize className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Fullscreen Modal */}
                  {isFullscreen && (
                    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <button
                          onClick={toggleFullscreen}
                          className="absolute top-4 right-4 bg-gray-800/90 hover:bg-gray-800 text-white hover:text-gray-100 p-2 rounded-lg shadow-md transition-all duration-200 z-10"
                          title="Exit Fullscreen"
                        >
                          <X className="w-6 h-6" />
                        </button>
                        <iframe
                          src="/simulators/telangana/index.html"
                          title="Telangana Visualization Simulator - Fullscreen"
                          className="w-full h-full border-none"
                          allowFullScreen
                        />
                      </div>
                    </div>
                  )}
                </>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Telangana History and State Formation - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Telangana History and State Formation</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Telangana History and State Formation content.</p>
                  </div>
                </div>
              );
          }
        case 'our-universe':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Our Universe</h1>
                    <p className="text-lg text-stone-600">The universe is everything around us—all the stars, planets, and galaxies that make up our amazing world in space.</p>
                  </div>

                  {/* The Universe */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Universe</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> The universe is everything that exists, including all matter, energy, planets, stars, and galaxies.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Facts:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It contains everything we can see with telescopes and even things we can't see, like dark matter and dark energy.</li>
                      <li>• Our solar system is just a tiny part of the vast universe.</li>
                    </ul>
                  </div>

                  {/* Galaxies */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Galaxies</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> A galaxy is a huge collection of stars, gas, and dust held together by gravity.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Facts:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Our galaxy is called the Milky Way.</li>
                      <li>• The Milky Way is where our solar system, including the Sun and Earth, lives.</li>
                    </ul>
                  </div>

                  {/* Stars */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Stars</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> A star is a giant ball of hot, glowing gas that shines brightly in the night sky.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Facts:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Our Sun is a star, and it's the closest one to Earth.</li>
                      <li>• Stars come in different sizes and colours and form beautiful patterns in the sky.</li>
                    </ul>
                  </div>

                  {/* The Solar System */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Solar System</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> The solar system is a group of planets, moons, comets, and asteroids that all travel around the Sun.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• There are eight planets in our solar system: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, and Neptune.</li>
                      <li>• Jupiter is the largest planet, and Mercury is the smallest.</li>
                      <li>• Venus is the hottest planet, while Mars is known as the red planet.</li>
                      <li>• Saturn is famous for its beautiful rings.</li>
                    </ul>
                  </div>

                  {/* Earth */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Earth</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> Earth is the third planet from the Sun and our special home.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It is called the blue planet.</li>
                      <li>• The shape of the Earth is a sphere, which is like a big ball that is slightly squashed at the top and bottom.</li>
                      <li>• Water is present on other planets as ice or vapour, but Earth is unique for having liquid water.</li>
                    </ul>
                  </div>

                  {/* Rotation and Revolution */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Rotation and Revolution</h3>
                    <p className="text-stone-600 mb-4"><strong>What they are:</strong> These are the two main movements of the Earth.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Facts:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Rotation is the spinning of the Earth on its own axis, which takes about 24 hours (specifically 23 hours, 56 minutes, and 4 seconds).</li>
                      <li>• Revolution is the Earth's journey in a big circle around the Sun, which takes 365 days, or one whole year, to complete.</li>
                    </ul>
                  </div>

                  {/* Latitudes and Longitudes */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Latitudes and Longitudes</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> Latitudes and longitudes are imaginary lines on a globe that act like an address system for the Earth.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Latitude lines tell us how far north or south a place is.</li>
                      <li>• Longitude lines tell us how far east or west a place is.</li>
                      <li>• Together, they help us find any location on a map.</li>
                    </ul>
                  </div>

                  {/* Layers of the Earth */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Layers of the Earth</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> The Earth is made up of four important layers.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Crust: This is the solid outer layer we live on, also called the Lithosphere. It is between 8 and 40 km deep.</li>
                      <li>• Mantle: This is the second and middle layer of the Earth.</li>
                      <li>• Core: This is the innermost layer of the Earth and is divided into an Outer Core and an Inner Core. It contains important minerals.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Milky Way – Our home galaxy.</li>
                      <li>• Sun – The closest star to us.</li>
                      <li>• Solar System – The Sun and its eight planets.</li>
                      <li>• Earth – The Blue Planet, our home.</li>
                      <li>• Rotation – Earth's spin, which takes about 24 hours.</li>
                      <li>• Revolution – Earth's orbit around the sun, taking 365 days.</li>
                      <li>• Earth's Layers – The Crust, Mantle, and Core.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      Studying the universe helps us understand our amazing planet, Earth, and our special place in the solar system. Learning about stars and galaxies inspires us to be curious and explore the wonders of space.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/RCrRkWFCQYE?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/pk68lNZG7gA?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Our Universe - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Our Universe - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Our Universe - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Our Universe model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <div className="space-y-6">
                      <h2 className="text-2xl font-bold text-amber-800 mb-4">Our Universe - Interactive Simulators</h2>
                      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                        <SolarSystemSimulator className="w-full" />
                      </div>
                      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                        <EarthCoreSimulator className="w-full" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Our Universe - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Our Universe</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Our Universe content.</p>
                  </div>
                </div>
              );
          }
        case 'all-about-villages':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">All About Villages</h1>
                    <p className="text-lg text-stone-600">Villages are the heart of India—they are full of farms, traditions, and community life.</p>
                  </div>

                  {/* Village Life */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Village Life</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> A village is a small group of houses in a rural area where people live and work together as a community.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Villages are usually surrounded by natural environments like farmland and forests.</li>
                      <li>• Life in a village is connected to strong traditions and customs passed down through generations.</li>
                      <li>• The community works together, creating a close-knit lifestyle.</li>
                    </ul>
                  </div>

                  {/* Occupations */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Occupations</h3>
                    <p className="text-stone-600 mb-4"><strong>Importance:</strong> Most people in villages are involved in agriculture and related activities.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Types of Jobs:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Farming is the main occupation, where farmers grow crops like rice, wheat, and vegetables using irrigation from tanks and wells.</li>
                      <li>• Many villagers also raise animals like cows and buffaloes for milk or work in poultry farms and sheep rearing.</li>
                      <li>• Other jobs include craftsmanship like pottery and weaving, or working as drivers and masons.</li>
                    </ul>
                  </div>

                  {/* Culture & Religion */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Culture & Religion</h3>
                    <p className="text-stone-600 mb-4"><strong>What it is:</strong> Village life is rich with culture, festivals, and religious practices.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Culture:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Villagers celebrate festivals like Diwali, Holi, Eid, and Bathukamma with great joy.</li>
                      <li>• Traditional music, dance, and homemade food are an important part of their celebrations.</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3 mt-4">Religion:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• People from different religions, such as Hinduism, Islam, Christianity, and Sikhism, often live together in harmony.</li>
                    </ul>
                  </div>

                  {/* Education & Healthcare */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Education & Healthcare</h3>
                    <p className="text-stone-600 mb-4"><strong>What is available:</strong> Many villages have basic facilities for learning and health.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Facilities:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Villages often have primary schools, and some may have higher secondary schools for older children.</li>
                      <li>• For medical needs, there may be a healthcare centre or a small hospital with doctors and nurses.</li>
                    </ul>
                  </div>

                  {/* Challenges in Villages */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Challenges in Villages</h3>
                    <p className="text-stone-600 mb-4"><strong>What they are:</strong> Villages often face difficulties due to limited resources.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Challenges:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• There can be a shortage of important services like electricity, clean water, and the internet.</li>
                      <li>• Sometimes, people leave their villages and move to cities to find better jobs, which is called migration.</li>
                    </ul>
                  </div>

                  {/* Soil Types in Villages */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Soil Types in Villages</h3>
                    <p className="text-stone-600 mb-4"><strong>Importance:</strong> The type of soil determines which crops can be grown in a village.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Types & Uses:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Black soil is perfect for growing cotton and soybeans.</li>
                      <li>• Red soil is used to cultivate crops like millets and pulses.</li>
                      <li>• Alluvial soil is very fertile and is used to grow rice, wheat, and sugarcane.</li>
                    </ul>
                  </div>

                  {/* Local Self-Government */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Local Self-Government</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> Villages have their own local government, called the Gram Panchayat, to manage community affairs.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">How it works:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Villagers participate in democracy by voting in elections to choose their leaders or representatives.</li>
                      <li>• These elected leaders are responsible for the welfare and development of the village.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Farming is the main occupation in villages.</li>
                      <li>• The Gram Panchayat is the local government body in villages.</li>
                      <li>• Villages have rich traditions and celebrate many colourful festivals.</li>
                      <li>• Villagers vote in elections to choose their local leaders.</li>
                      <li>• Villages face challenges like a lack of electricity and water.</li>
                      <li>• Different types of soil, like black and red, are used for different crops.</li>
                      <li>• People of many religions live together peacefully in villages.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      This chapter teaches us how villages support our country with food and culture. Understanding their life helps us appreciate the importance of community and why we must work to improve village life.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/Ke8JX0FLtqk?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/pg3fMAwCkwY?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">All About Villages - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`All About Villages - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">All About Villages - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">All About Villages model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <VillageSimulator />
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">All About Villages - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">All About Villages</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view All About Villages content.</p>
                  </div>
                </div>
              );
          }
        case 'physical-divisions':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Relief Features of India</h1>
                    <p className="text-lg text-stone-600">India is a land of mountains, plains, plateaus, deserts, and coasts. Each feature tells a story about our country's geography and lifestyle.</p>
                  </div>

                  {/* Location of India */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Location of India</h3>
                    <p className="text-stone-600 mb-4"><strong>Where:</strong> India is located entirely in the Northern and Eastern Hemispheres.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Indian mainland extends from 8° 4' North to 37° 6' North latitude and 68° 7' East to 97° 25' East longitude.</li>
                      <li>• The distance from North to South is 3214 km, and from East to West is 2933 km.</li>
                      <li>• The Tropic of Cancer (23° 30' North latitude) passes through the centre of the country, dividing it into almost two equal parts.</li>
                      <li>• The 82° 30' East longitude is treated as the Standard Meridian of India.</li>
                    </ul>
                  </div>

                  {/* Neighbouring Countries */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Neighbouring Countries</h3>
                    <p className="text-stone-600 mb-4"><strong>Where:</strong> India is a peninsula surrounded by water on three sides.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• To the west is the Arabian Sea, to the east is the Bay of Bengal, and to the south is the Indian Ocean.</li>
                      <li>• Our neighbours in the North-West are Pakistan and Afghanistan.</li>
                      <li>• In the North, we have China, Bhutan, and Nepal.</li>
                      <li>• To the East are Bangladesh and Myanmar, and to the South are Sri Lanka and the Maldives.</li>
                    </ul>
                  </div>

                  {/* Physical Features of India */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">Physical Features of India</h3>
                    <p className="text-blue-700 text-lg">India has a wide variety of physical features and can be divided into six main divisions.</p>
                  </div>

                  {/* The Himalayas */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Himalayas</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> The Himalayas are young fold mountains and are the highest mountain range in the world.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• They are divided into three parallel ranges: The Great Himalayas (Himadri), The Lesser Himalayas (Himachal), and the Outer Himalayas (Siwaliks).</li>
                      <li>• Famous hill stations like Shimla, Darjeeling, Mussoorie, and Nainital are located here.</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3 mt-4">Rivers:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Ganga and Yamuna rivers originate from the Himalayas.</li>
                      <li>• A famous glacier in the Himalayas is Gangotri.</li>
                    </ul>
                  </div>

                  {/* The Indo-Gangetic Plains */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Indo-Gangetic Plains</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> These are the vast northern plains of India, located south of the Himalayas.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The plains are divided into two parts: the Sindhu Plain in the west and the Ganga-Brahmaputra plain.</li>
                    </ul>
                  </div>

                  {/* The Peninsular Plateau */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Peninsular Plateau</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> This is a large, triangular-shaped plateau.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It covers the states of Maharashtra, Karnataka, Andhra Pradesh, Tamil Nadu, and Telangana.</li>
                      <li>• The river Narmada divides the plateau into two parts.</li>
                    </ul>
                  </div>

                  {/* The Thar Desert */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Thar Desert</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> The Thar Desert is a large, dry region located in Rajasthan.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Climate:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It has an arid climate with very little rainfall and not much vegetation.</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3 mt-4">Rivers:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The only river in this area is the 'Luni'.</li>
                    </ul>
                  </div>

                  {/* The Coastal Plains */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Coastal Plains</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> These are the flat lands along India's coasts.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Western Coast is divided into the Konkan coast (Maharashtra and Goa), the Canara Coast (Karnataka), and the Malabar coast (Kerala).</li>
                      <li>• The Eastern Coast is divided into the Utkal Coast (Odisha), the Circar Coast (Andhra Pradesh), and the Coromandel Coast (Tamil Nadu).</li>
                    </ul>
                  </div>

                  {/* The Islands */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Islands</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> India has two main groups of islands.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Andaman and Nicobar Islands are located in the Bay of Bengal.</li>
                      <li>• The Lakshadweep Islands are in the Arabian Sea.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• The Himalayas – The highest mountain range in the world.</li>
                      <li>• The Northern Plains – Divided into the Sindhu and Ganga-Brahmaputra plains.</li>
                      <li>• The Peninsular Plateau – A triangular-shaped plateau in southern India.</li>
                      <li>• The Thar Desert – A hot and dry desert in Rajasthan.</li>
                      <li>• The Western Coast – Includes the Konkan, Canara, and Malabar coasts.</li>
                      <li>• The Islands – Andaman & Nicobar (Bay of Bengal) and Lakshadweep (Arabian Sea).</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      By studying India's relief features, we understand how geography shapes people's lives, cultures, and resources. It helps us appreciate the wonderful diversity of our country.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/U0y_yynzO-c?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/LuaOvObHb54?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Physical Divisions Of India - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Physical Divisions Of India - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Physical Divisions Of India - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Physical Divisions Of India model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Physical Divisions Of India - Interactive Simulators</h2>
                  <div className="bg-white rounded-lg p-2 shadow-md border border-stone-200">
                    <PhysicalDivisionsSimulator />
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Physical Divisions Of India - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Physical Divisions Of India</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Physical Divisions Of India content.</p>
                  </div>
                </div>
              );
          }
        case 'natural-resources':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Natural Resources</h1>
                    <p className="text-lg text-stone-600">Natural resources are gifts from nature that help us live, grow, and build our world.</p>
                  </div>

                  {/* Definition of Natural Resources */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Definition of Natural Resources</h3>
                    <p className="text-stone-600 mb-4"><strong>What they are:</strong> Natural resources are things that are formed in nature without any help from humans.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• They are a part of our planet and are found all around us.</li>
                      <li>• These resources are used to produce other goods and help create health, wealth, and well-being for people.</li>
                      <li>• Things like land, air, water, forests, and minerals are all natural resources.</li>
                    </ul>
                  </div>

                  {/* Classification of Natural Resources */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Classification of Natural Resources</h3>
                    <p className="text-stone-600 mb-4"><strong>What it means:</strong> Natural resources are divided into two main types.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Types:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Renewable Resources: These are resources that can be refilled or recharged over time. Examples include Tides, Winds, and Plants.</li>
                      <li>• Non-Renewable Resources: These are resources that are very difficult to refill once they are used up. Examples include Fossil Fuels and minerals like Coal, Iron, and Gold.</li>
                    </ul>
                  </div>

                  {/* Sources of Energy */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Sources of Energy</h3>
                    <p className="text-stone-600 mb-4"><strong>What they are:</strong> These are natural resources used to create energy and electricity.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Examples:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Biomass Energy: Energy generated from organic material from plants and animals.</li>
                      <li>• Hydro Energy: Electricity generated from the power of water.</li>
                      <li>• Solar Energy: Energy generated using radiation from the sun.</li>
                      <li>• Wind Energy: Electricity generated using wind turbines that spin when the wind blows.</li>
                      <li>• Geothermal Energy: Energy produced from the heat released from the inside of the Earth.</li>
                    </ul>
                  </div>

                  {/* Importance of Natural Resources */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Importance of Natural Resources</h3>
                    <p className="text-stone-600 mb-4"><strong>Why they matter:</strong> Natural resources are very helpful in our daily lives and support the economy.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Key Roles:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• They provide employment, especially for people in rural areas.</li>
                      <li>• Poor people often depend on natural resources to satisfy their needs and use medicinal herbs for healing.</li>
                      <li>• They are used in all three sectors of the economy: agriculture, industrial, and service sectors.</li>
                    </ul>
                  </div>

                  {/* Conservation of Natural Resources */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Conservation of Natural Resources</h3>
                    <p className="text-stone-600 mb-4"><strong>Why we must save them:</strong> It is important to protect our natural resources so they don't run out.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">How to Conserve:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• We should gradually reduce the use of non-renewable resources.</li>
                      <li>• We should find and use alternate materials instead of overusing limited ones.</li>
                      <li>• Everyone should practice the 4Rs:</li>
                      <li className="ml-6">▪ Reduce: Use fewer resources.</li>
                      <li className="ml-6">▪ Reuse: Use the same things many times.</li>
                      <li className="ml-6">▪ Recycle: Turn old resources into new things.</li>
                      <li className="ml-6">▪ Refuse: Say no to using a resource if you don't need it.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Natural resources are gifts from nature like water, forests, and minerals.</li>
                      <li>• Renewable resources can be refilled, like wind and solar power.</li>
                      <li>• Non-Renewable resources are limited, like coal and Fossil Fuels.</li>
                      <li>• Energy sources include water (Hydro), sun (Solar), and wind.</li>
                      <li>• Resources provide jobs and are used in farming and industries.</li>
                      <li>• We must save resources using the 4Rs: Reduce, Reuse, Recycle, Refuse.</li>
                      <li>• Poor people in rural areas often depend on natural resources to live.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      This chapter reminds us to use our natural resources wisely and carefully. By conserving these precious gifts from nature, we can make sure that future generations will also be able to enjoy and use them.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/WjqF2gcunBM?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/vhU-TTF0FsY?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Natural Resources - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Natural Resources - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Natural Resources - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Natural Resources model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full min-h-screen">
                  <div className="w-full min-h-[calc(100vh-200px)] overflow-y-auto">
                    <NaturalResourcesSimulator />
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Natural Resources - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Natural Resources</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Natural Resources content.</p>
                  </div>
                </div>
              );
          }
        case 'indian-constitution':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Indian Constitution</h1>
                    <p className="text-lg text-stone-600">The Indian Constitution is the rulebook of our country, guiding how we live, our rights, and our duties as citizens.</p>
                  </div>

                  {/* What is a Constitution? */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">What is a Constitution?</h3>
                    <p className="text-stone-600 mb-4"><strong>Definition:</strong> A constitution is a set of rules and laws that guides how a state or country is governed.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It contains the most important and fundamental laws of the land.</li>
                      <li>• It can be written or unwritten, but India's constitution is the world's longest written constitution.</li>
                      <li>• It ensures that everyone is treated fairly and the government works properly.</li>
                    </ul>
                  </div>

                  {/* Drafting of the Constitution */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Drafting of the Constitution</h3>
                    <p className="text-stone-600 mb-4"><strong>When:</strong> The Constitution of India came into effect on 26th January 1950.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• We celebrate this special day every year as Republic Day.</li>
                      <li>• The constitution outlines everything about our country, from citizenship and Fundamental Rights to how the government should function.</li>
                    </ul>
                  </div>

                  {/* The Constituent Assembly */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Constituent Assembly</h3>
                    <p className="text-stone-600 mb-4"><strong>Who:</strong> The Constituent Assembly was the group of leaders responsible for writing the Constitution.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Events:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Its first meeting was held on December 9th, 1946, in Delhi.</li>
                      <li>• Dr. R. Rajendra Prasad was elected as its permanent president.</li>
                      <li>• The assembly worked for many years to create the final rulebook for India.</li>
                    </ul>
                  </div>

                  {/* The Drafting Committee */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Drafting Committee</h3>
                    <p className="text-stone-600 mb-4"><strong>Who:</strong> A special committee of seven members was set up on August 29th, 1947, to write the draft of the Constitution.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Legacy:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Dr. B.R. Ambedkar was the Chairman of this committee.</li>
                      <li>• Because of his great contribution, he is known as the father of the Indian Constitution.</li>
                    </ul>
                  </div>

                  {/* Fundamental Rights */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Fundamental Rights</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> The Constitution gives every citizen six special rights, known as Fundamental Rights, to protect them and ensure their well-being.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">The Six Rights:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• Right to Equality</li>
                      <li>• Right to Freedom</li>
                      <li>• Right against Exploitation</li>
                      <li>• Right to Freedom of Religion</li>
                      <li>• Cultural and Educational Rights</li>
                      <li>• Right to Constitutional Remedies.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• Constitution – A set of rules for governing India.</li>
                      <li>• Came into effect on 26 January 1950, celebrated as Republic Day.</li>
                      <li>• The Constituent Assembly wrote the constitution.</li>
                      <li>• Dr. B.R. Ambedkar was the Chairman of the Drafting Committee.</li>
                      <li>• It is the world's longest written constitution.</li>
                      <li>• It gives citizens six Fundamental Rights.</li>
                      <li>• Dr. R. Rajendra Prasad was the president of the Constituent Assembly.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      The Constitution protects our rights and guides our responsibilities as citizens. Learning about it helps us understand the importance of equality, freedom, and democracy in our lives.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/NYGpmg-Zr8U?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/_Y05NMfi-i8?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Indian Constitution - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Indian Constitution - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Indian Constitution - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Indian Constitution model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full -mx-6 -my-6">
                  <Chapter10Simulator />
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Indian Constitution - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Indian Constitution</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Indian Constitution content.</p>
                  </div>
                </div>
              );
          }
        case 'union-state-government':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Union and State Government</h1>
                    <p className="text-lg text-stone-600">India has two levels of government—Union and State—that work together to run the country and serve the people.</p>
                  </div>

                  {/* What is Government? */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">What is Government?</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> A government is the system or group of people that governs a community or a country.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The government's role is very important for the development of a country and its people.</li>
                      <li>• It makes laws and ensures that different services work well for everyone.</li>
                      <li>• India is a large country with 28 states and 8 Union Territories, so it needs different levels of government to manage everything.</li>
                    </ul>
                  </div>

                  {/* The Union Government */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The Union Government</h3>
                    <p className="text-stone-600 mb-4"><strong>Who:</strong> The Union Government, also called the Central Government, is responsible for the entire country.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Roles:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The President is the constitutional head of the nation and the first citizen of India. He or she has nominal powers.</li>
                      <li>• The Prime Minister is the real head of the Union Government and leads the cabinet.</li>
                      <li>• The Parliament is the highest law-making body in India. It has two houses: the Lok Sabha (Lower House) and the Rajya Sabha (Upper House).</li>
                    </ul>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3 mt-4">Functions:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Union Government controls all the states and union territories.</li>
                      <li>• It is responsible for very important matters like the country's defence and relationships with other countries.</li>
                    </ul>
                  </div>

                  {/* The State Government */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">The State Government</h3>
                    <p className="text-stone-600 mb-4"><strong>Who:</strong> Each state in India has its own government to manage its affairs.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Roles:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Governor is the constitutional head of the state and is appointed by the President.</li>
                      <li>• The Chief Minister is the head of the state government and is the leader of the majority party in the State Assembly.</li>
                      <li>• The Legislative Assembly is where members (MLAs) are elected by the people to make laws for the state.</li>
                      <li>• Some states also have an upper house called the Vidhan Parishath or Legislative Council.</li>
                    </ul>
                  </div>

                  {/* How Union and State Governments Share Powers */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">How Union and State Governments Share Powers</h3>
                    <p className="text-stone-600 mb-4"><strong>How:</strong> The Union and State governments have different but coordinated responsibilities.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Powers:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• The Union Government makes laws that apply to the whole nation.</li>
                      <li>• The State Government makes laws and policies for its own state.</li>
                      <li>• Both levels of government work together to ensure the well-being and development of all citizens in the country.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• President = The constitutional Head of the Nation.</li>
                      <li>• Prime Minister leads the Union Government.</li>
                      <li>• Parliament (Lok Sabha & Rajya Sabha) makes laws for the country.</li>
                      <li>• Governor = The constitutional Head of the State.</li>
                      <li>• Chief Minister leads the State Government.</li>
                      <li>• MLAs are elected members of the State Legislative Assembly.</li>
                      <li>• India has 28 states and 8 Union Territories.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      By learning about our governments, we understand how leaders are chosen and how they work for us. This knowledge helps us appreciate our roles and participate in democracy as responsible citizens.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/20CFnlUX9es?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/20CFnlUX9es?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Union and State Government - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Union and State Government - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Union and State Government - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Union and State Government model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="w-full -mx-6 -my-6">
                  <Chapter11Simulator />
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Union and State Government - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Union and State Government</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Union and State Government content.</p>
                  </div>
                </div>
              );
          }
        case 'economic-system':
          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-8">
                  {/* Chapter Header */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-8 border border-amber-200 shadow-md text-center">
                    <h1 className="text-4xl font-bold text-amber-800 mb-4">Economic System</h1>
                    <p className="text-lg text-stone-600">An economic system decides how people use resources, produce goods, and share wealth in a country.</p>
                  </div>

                  {/* What is an Economic System? */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">What is an Economic System?</h3>
                    <p className="text-stone-600 mb-4"><strong>What:</strong> An economic system is the way a country organises the production, distribution, and consumption of goods and services.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It helps answer important questions like, "What to produce?", "How to produce?", and "Whom to produce for?".</li>
                      <li>• All the activities that people do to earn and use money are part of the economic system.</li>
                      <li>• Economics is the study of these daily activities and is known as the "Study of wealth," according to Adam Smith, the Father of Economics.</li>
                    </ul>
                  </div>

                  {/* Why is it Important? */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Why is it Important?</h3>
                    <p className="text-stone-600 mb-4"><strong>Why:</strong> Understanding the economic system is crucial for a country's progress.</p>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Importance:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• It helps us understand and find solutions for big problems like poverty, unemployment, and economic inequality.</li>
                      <li>• It guides producers and businesses in making decisions about creating goods and services for people.</li>
                      <li>• It helps a country properly use its available resources for the development and well-being of its citizens.</li>
                    </ul>
                  </div>

                  {/* Types of Economic Systems */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-200">
                    <h3 className="text-2xl font-bold text-blue-800 mb-4">Types of Economic Systems</h3>
                    <p className="text-blue-700 text-lg">Please note that while the sources mention India has a Mixed Economy and defines related concepts like Privatization, the detailed descriptions of Capitalist and Socialist economies below are provided for a complete understanding and are based on general knowledge, not the provided text.</p>
                  </div>

                  {/* Capitalist Economy */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Capitalist Economy</h3>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• In this system, private individuals and companies own and control most of the businesses and resources.</li>
                      <li>• The main goal is to make a profit.</li>
                      <li>• The government has less control, which is related to the idea of Liberalization, meaning fewer rules and restrictions on businesses.</li>
                      <li>• Privatization, where the government sells its businesses to private owners, is a common feature of this system.</li>
                    </ul>
                  </div>

                  {/* Socialist Economy */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Socialist Economy</h3>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• In this system, the government owns and controls the most important businesses and resources.</li>
                      <li>• The main goal is to ensure the well-being of all citizens, not just to make a profit.</li>
                      <li>• The government makes all the key decisions about production and distribution.</li>
                    </ul>
                  </div>

                  {/* Mixed Economy */}
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <h3 className="text-2xl font-bold text-stone-800 mb-4">Mixed Economy</h3>
                    <h4 className="text-lg font-semibold text-stone-700 mb-3">Features:</h4>
                    <ul className="space-y-2 text-stone-700 ml-6">
                      <li>• A Mixed Economy is a blend of both capitalist and socialist systems.</li>
                      <li>• Both the government (public sector) and private companies (private sector) play important roles in the economy.</li>
                      <li>• India has a Mixed Economy, where both government-run and private businesses operate together.</li>
                      <li>• This system allows for private businesses to grow while the government provides essential services and works for the welfare of the people.</li>
                    </ul>
                  </div>

                  {/* Quick Recap */}
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6 border border-amber-200">
                    <h3 className="text-2xl font-bold text-amber-800 mb-4">Quick Recap</h3>
                    <ul className="space-y-2 text-stone-700">
                      <li>• An Economic System is how a country manages production and wealth.</li>
                      <li>• Capitalist Economy is based on private ownership and profit.</li>
                      <li>• Socialist Economy is based on government ownership and social welfare.</li>
                      <li>• Mixed Economy is a blend of both private and government ownership.</li>
                      <li>• India follows a Mixed Economy system.</li>
                      <li>• Economics helps us find solutions to problems like poverty.</li>
                    </ul>
                  </div>

                  {/* Footer Reflection */}
                  <div className="bg-gradient-to-r from-stone-50 to-gray-50 rounded-lg p-6 border border-stone-200">
                    <p className="text-stone-600 text-center leading-relaxed italic">
                      Understanding economic systems helps us see how different countries use their resources to plan for people's needs. It shows us how the choices a country makes can affect the lives and well-being of all its citizens.
                    </p>
                  </div>
                </div>
              );
            case 'videos':
              const videoUrls = {
                english: "https://www.youtube.com/embed/KoWufsy6O2w?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0",
                'hindi-urdu': "https://www.youtube.com/embed/KoWufsy6O2w?rel=0&modestbranding=1&showinfo=0&controls=1&disablekb=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0"
              };

              return (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-3xl font-bold text-amber-800 mb-2">Economic System - Educational Videos</h2>
                    <p className="text-stone-600 text-lg">Interactive learning with high-quality video content</p>
                  </div>

                  {/* Language Toggle Buttons */}
                  <div className="flex justify-center mb-8">
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-1.5 inline-flex shadow-lg border border-gray-200">
                      <button
                        onClick={() => setVideoLanguage('english')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'english'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">🇺🇸</span>
                          US English
                        </span>
                      </button>
                      <button
                        onClick={() => setVideoLanguage('hindi-urdu')}
                        className={`px-8 py-3 rounded-lg font-semibold text-sm transition-all duration-300 transform ${videoLanguage === 'hindi-urdu'
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg scale-105 border border-amber-400'
                          : 'text-stone-600 hover:bg-white hover:shadow-md'
                          }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-lg">lN</span>
                          Hindi/Urdu
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="relative w-full max-w-5xl mx-auto bg-gray-100 rounded-2xl p-4 shadow-inner">
                    <ResponsiveVideoPlayer
                      src={videoUrls[videoLanguage]}
                      title={`Economic System - ${videoLanguage === 'english' ? 'English' : 'Hindi/Urdu'}`}
                    />
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Economic System - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Economic System model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Economic System - Interactive Simulators</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden" style={{ minHeight: '600px' }}>
                    <EconomicSystemSimulator />
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">Economic System - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">Economic System</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view Economic System content.</p>
                  </div>
                </div>
              );
          }
        default:
          // For other chapters, show placeholder content
          const chapterName = activeChapter.split('-').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');

          switch (activeTab) {
            case 'overview':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">{chapterName} - Overview</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">{chapterName} overview content coming soon...</p>
                  </div>
                </div>
              );
            case 'videos':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">{chapterName} - Educational Videos</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">{chapterName} video content coming soon...</p>
                  </div>
                </div>
              );
            case 'papers':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">{chapterName} - Model Papers</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">{chapterName} model papers coming soon...</p>
                  </div>
                </div>
              );
            case 'quiz':
              return (
                <div className="space-y-6">
                  <QuizGenerator apiKey={GROQ_API_KEY}
                    currentChapter={getChapterDisplayName(activeChapter)}
                    pdfFile={pdfFile}
                  />
                </div>
              );
            case 'simulator':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">{chapterName} - Interactive Simulators</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">{chapterName} simulators coming soon...</p>
                  </div>
                </div>
              );
            case 'assistant':
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-blue-800 mb-4">{chapterName} - Learning Assistant</h2>
                  <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden">
                    <PDFChatRAG apiKey={GROQ_API_KEY}
                      currentChapter={getChapterDisplayName(activeChapter)}
                      pdfFile={pdfFile}
                      onPdfLoaded={setIsPdfLoaded}
                    />
                  </div>
                </div>
              );
            default:
              return (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-amber-800 mb-4">{chapterName}</h2>
                  <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
                    <p className="text-stone-700">Select a tab to view {chapterName} content.</p>
                  </div>
                </div>
              );
          }
      }
    };

    return getChapterContent();
  };

  const renderMainContent = () => {
    return (
      <div className="h-full flex flex-col relative bg-transparent">
        {/* Persistent Assistant Component - Always mounted, hidden when inactive */}
        <div
          style={{
            display: activeTab === 'assistant' ? 'block' : 'none',
            height: '100%'
          }}
          className="h-full absolute inset-0 z-10 bg-gray-50"
        >
          <div className="space-y-6 h-full flex flex-col container mx-auto px-4 py-8">

            <div className="bg-white rounded-lg shadow-md border border-stone-200 overflow-hidden flex-1 relative flex flex-col">
              <PDFChatRAG apiKey={GROQ_API_KEY}
                currentChapter={getChapterDisplayName(activeChapter)}
                pdfFile={pdfFile}
                onPdfLoaded={setIsPdfLoaded}
              />
            </div>
          </div>
        </div>

        {/* Other Tabs Content */}
        <div style={{ display: activeTab !== 'assistant' ? 'block' : 'none' }}>
          {renderContent()}
        </div>
      </div>
    );
  };


  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 relative flex flex-col overflow-hidden">
      {/* PDF Preview Modal */}
      {selectedPaper && (
        <PaperPreviewModal
          filename={selectedPaper}
          onClose={() => setSelectedPaper(null)}
        />
      )}

      {/* Background decorations removed for cleaner look */}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-amber-100 to-stone-100 border-b border-stone-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-amber-800 mb-1">
                Social Science • History, Geography, Political Science, Economics
              </h1>
              <p className="text-stone-600 text-sm">
                Clear explanations, gentle animations, and handy tools — all in one place.
              </p>
            </div>
          </div>
        </div>
      </header>


      {/* Main Content */}
      <div className="flex-1 flex flex-col pt-24 min-h-0">
        {/* Tab Navigation */}
        <div className="bg-white border-b border-stone-200 px-4 py-2 transition-all duration-300 sticky top-20 z-20 flex-shrink-0">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className={`hidden lg:flex items-center gap-2 pb-2 border-b-2 border-transparent text-amber-700 hover:text-amber-800 transition-all duration-500 transform hover:scale-105 px-3 py-1 rounded-lg ${sidebarOpen
                ? 'bg-amber-100 scale-105 shadow-md'
                : 'bg-amber-50 hover:bg-amber-100'
                }`}
            >
              <Menu
                size={20}
                className={`transition-transform duration-500 ${sidebarOpen ? 'rotate-90' : 'rotate-0'
                  }`}
              />
              <span className={`transition-all duration-300 ${sidebarOpen ? 'font-semibold' : 'font-medium'
                }`}>
                Lessons
              </span>
            </button>
            <div className="flex gap-8 ml-12">
              <button
                onClick={() => handleTabChange('overview')}
                className={`nav-tab flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === 'overview'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
              >
                <BookOpen size={20} />
                Overview
              </button>
              <button
                onClick={() => handleTabChange('videos')}
                className={`nav-tab flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === 'videos'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
              >
                <Video size={20} />
                Videos
              </button>
              <button
                onClick={() => handleTabChange('quiz')}
                className={`nav-tab flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === 'quiz'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
              >
                <Brain size={20} />
                Quiz
              </button>
              <button
                onClick={() => handleTabChange('simulator')}
                className={`nav-tab flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === 'simulator'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
              >
                <Monitor size={20} />
                Simulator
              </button>
              <button
                onClick={() => handleTabChange('assistant')}
                className={`nav-tab flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === 'assistant'
                  ? 'border-blue-500 text-blue-600 bg-blue-50 px-4 py-1 rounded-lg'
                  : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
              >
                <MessageSquare size={20} />
                Assistant
              </button>
              <button
                onClick={() => handleTabChange('papers')}
                className={`nav-tab flex items-center gap-2 pb-2 border-b-2 transition-all duration-300 transform hover:scale-105 focus:outline-none ${activeTab === 'papers'
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-stone-600 hover:text-stone-800'
                  }`}
              >
                <FileText size={20} />
                Model Papers
              </button>
            </div>
          </div>
        </div>


        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel */}
          <div className={`bg-white border-r border-stone-200 transition-all duration-500 ease-in-out transform ${sidebarOpen ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'
            } overflow-hidden hidden lg:block`}>
            <div className={`h-full overflow-y-auto p-4 transition-all duration-700 ease-out ${sidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
              <div className="space-y-2">
                <SubjectDropdown
                  title="History"
                  isExpanded={expandedSections.history}
                  onToggle={() => toggleSection('history')}
                >
                  <div>
                    <ChapterItem
                      title="Ancient India"
                      active={activeChapter === 'ancient-india'}
                      onClick={() => setActiveChapter('ancient-india')}
                      delay={100}
                      number={1}
                    />
                    <ChapterItem
                      title="India from 9th to 14th CE"
                      active={activeChapter === 'india-9th-14th'}
                      onClick={() => setActiveChapter('india-9th-14th')}
                      delay={200}
                      number={2}
                    />
                    <ChapterItem
                      title="Mughal Emperors"
                      active={activeChapter === 'mughal-emperors'}
                      onClick={() => setActiveChapter('mughal-emperors')}
                      delay={300}
                      number={3}
                    />
                    <ChapterItem
                      title="Modern India"
                      active={activeChapter === 'modern-india'}
                      onClick={() => setActiveChapter('modern-india')}
                      delay={400}
                      number={4}
                    />
                    <ChapterItem
                      title="Telangana history and state formation"
                      active={activeChapter === 'telangana-history'}
                      onClick={() => setActiveChapter('telangana-history')}
                      delay={500}
                      number={5}
                    />
                  </div>
                </SubjectDropdown>

                <SubjectDropdown
                  title="Geography"
                  isExpanded={expandedSections.geography}
                  onToggle={() => toggleSection('geography')}
                >
                  <div>
                    <ChapterItem
                      title="Our Universe"
                      active={activeChapter === 'our-universe'}
                      onClick={() => setActiveChapter('our-universe')}
                      delay={100}
                      number={6}
                    />
                    <ChapterItem
                      title="All About Villages"
                      active={activeChapter === 'all-about-villages'}
                      onClick={() => setActiveChapter('all-about-villages')}
                      delay={200}
                      number={7}
                    />
                    <ChapterItem
                      title="Physical Divisions Of India"
                      active={activeChapter === 'physical-divisions'}
                      onClick={() => setActiveChapter('physical-divisions')}
                      delay={300}
                      number={8}
                    />
                    <ChapterItem
                      title="Natural Resources"
                      active={activeChapter === 'natural-resources'}
                      onClick={() => setActiveChapter('natural-resources')}
                      delay={400}
                      number={9}
                    />
                  </div>
                </SubjectDropdown>

                <SubjectDropdown
                  title="Political Science"
                  isExpanded={expandedSections.politicalScience}
                  onToggle={() => toggleSection('politicalScience')}
                >
                  <div>
                    <ChapterItem
                      title="Indian Constitution"
                      active={activeChapter === 'indian-constitution'}
                      onClick={() => setActiveChapter('indian-constitution')}
                      delay={100}
                      number={10}
                    />
                    <ChapterItem
                      title="Union and State Government"
                      active={activeChapter === 'union-state-government'}
                      onClick={() => setActiveChapter('union-state-government')}
                      delay={200}
                      number={11}
                    />
                  </div>
                </SubjectDropdown>

                <SubjectDropdown
                  title="Economics"
                  isExpanded={expandedSections.economics}
                  onToggle={() => toggleSection('economics')}
                >
                  <div>
                    <ChapterItem
                      title="Economic System"
                      active={activeChapter === 'economic-system'}
                      onClick={() => setActiveChapter('economic-system')}
                      delay={100}
                      number={12}
                    />
                  </div>
                </SubjectDropdown>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide min-h-0">
            <div className="p-8 h-full">
              <div className="h-full">
                {renderMainContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
