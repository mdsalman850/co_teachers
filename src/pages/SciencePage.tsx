import React, { useState, useEffect, Suspense, lazy } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import { extractAllScienceLessons, type Lesson } from '../utils/sciencePdfExtractor';
import ScienceRAG from '../components/ScienceRAG';
import { GEMINI_API_KEY } from '../config/scienceApi';
import CursorTrail from '../components/CursorTrail';

// Import simulator directly to avoid lazy loading issues with React Three Fiber
// The component already has client-side checks, so direct import should be safe
import ChloroplastSimulator from '../components/ChloroplastSimulator';
import StomataSimulator from '../components/StomataSimulator';
import LungAnimationSimulator from '../components/LungAnimationSimulator';
import RespiratorySystemSimulator from '../components/RespiratorySystemSimulator';
import ParrotfishGillSimulator from '../components/ParrotfishGillSimulator';
import FlowerAnatomySimulator from '../components/FlowerAnatomySimulator';
import UrinarySystemSimulator from '../components/UrinarySystemSimulator';
import KidneyAnatomySimulator from '../components/KidneyAnatomySimulator';
import KidneyNephronSimulator from '../components/KidneyNephronSimulator';
import HumanHeartSimulator from '../components/HumanHeartSimulator';
import PhotosynthesisPlantAnatomySimulator from '../components/PhotosynthesisPlantAnatomySimulator';
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  FlaskRound,
  Microscope,
  Video,
  Brain,
  MessageSquare,
  Monitor,
  ChevronDown,
  Beaker,
  Dna,
  Zap,
  GraduationCap,
  LayoutDashboard,
  BookText,
  PlayCircle,
  ClipboardCheck,
  Trophy,
  Cpu,
  Sparkles
} from 'lucide-react';

type ScienceTab = 'overview' | 'textbook' | 'notes' | 'resources' | 'videos' | 'papers' | 'quiz' | 'simulator' | 'assistant';

interface NoteSection {
  title: string;
  points: string[];
}

interface ScienceResource {
  title: string;
  description: string;
  fileName: string;
}

interface ScienceVideo {
  title: string;
  url: string;
  description: string;
}

interface ScienceSubject {
  id: 'biology' | 'physics' | 'chemistry';
  name: string;
  accent: string;
  icon: LucideIcon;
  summary: string;
  focusAreas: string[];
  notes: NoteSection[];
  resources: ScienceResource[];
  videos: ScienceVideo[];
}

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
    className={`chapter-item w-full text-left transition-all duration-500 ease-out transform hover:translate-x-2 hover:scale-105 group animate-fade-in ${
      active 
        ? 'bg-gradient-to-r from-amber-100 to-yellow-100 border-l-3 border-amber-400 shadow-md scale-105' 
        : 'bg-transparent hover:bg-white/60'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center py-3 px-6 relative">
      <div className={`flex-1 font-medium transition-all duration-300 ${
        active 
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
        className={`text-gray-500 group-hover:text-gray-700 transition-all duration-300 ${
          isExpanded ? 'rotate-180' : ''
        }`}
        />
      </div>
    </button>
    <div className={`overflow-hidden transition-all duration-500 ease-out ${
      isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'
    }`}>
      <div className="bg-gradient-to-b from-white/80 to-gray-50/60 backdrop-blur-sm border-l border-gray-200/50 ml-4 rounded-r-lg shadow-inner overflow-y-auto max-h-[800px]">
        <div className="py-2">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const getPdfUrl = (fileName: string) => {
  // Properly encode the file name for URL
  const encodedFileName = encodeURIComponent(fileName);
  // Return the URL - files in public folder are served from root
  return `/${encodedFileName}`;
};

const scienceSubjects: ScienceSubject[] = [
  {
    id: 'biology',
    name: 'Biology',
    accent: 'text-green-600',
    icon: Dna,
    summary: '',
    focusAreas: [],
    notes: [],
    resources: [
      {
        title: 'Biology Textbook',
        description: 'Complete Biology textbook covering all chapters and topics.',
        fileName: 'FINAL BIOLOGY AICU TEXTBOOK.pdf'
      }
    ],
    videos: []
  },
  {
    id: 'physics',
    name: 'Physics',
    accent: 'text-sky-600',
    icon: Atom,
    summary: '',
    focusAreas: [],
    notes: [],
    resources: [],
    videos: []
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    accent: 'text-amber-600',
    icon: FlaskRound,
    summary: '',
    focusAreas: [],
    notes: [],
    resources: [],
    videos: []
  }
];

const SciencePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubjectId, setActiveSubjectId] = useState<ScienceSubject['id']>('biology');
  const [activeTab, setActiveTab] = useState<ScienceTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true); // Open by default to show chapters
  const [expandedSections, setExpandedSections] = useState({
    biology: true, // Biology expanded by default
    physics: false,
    chemistry: false
  });
  const [lessons, setLessons] = useState<{
    biology: Lesson[];
    physics: Lesson[];
    chemistry: Lesson[];
  }>({
    biology: [],
    physics: [],
    chemistry: []
  });
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [, setIsPdfLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeSubject = scienceSubjects.find(subject => subject.id === activeSubjectId) ?? scienceSubjects[0];
  const activeLessons = lessons[activeSubjectId] || [];
  const activeLesson = activeLessons.find(l => l.id === activeLessonId) || activeLessons[0] || null;

  // Load lessons from PDFs on component mount (only once)
  useEffect(() => {
    const loadLessons = async () => {
      setIsLoadingLessons(true);
      setError(null);
      try {
        const extractedLessons = await extractAllScienceLessons();
        setLessons(extractedLessons);
        
        // Set first lesson as active if available for current subject
        if (extractedLessons[activeSubjectId]?.length > 0) {
          setActiveLessonId(extractedLessons[activeSubjectId][0].id);
        }
      } catch (error) {
        console.error('Error loading lessons:', error);
        setError('Failed to load lessons. Please refresh the page.');
      } finally {
        setIsLoadingLessons(false);
      }
    };

    loadLessons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Update active lesson when subject changes
  useEffect(() => {
    if (activeLessons.length > 0 && !activeLessons.find(l => l.id === activeLessonId)) {
      // Set first lesson as active if current one is not found
      if (activeSubjectId === 'biology') {
        // For Biology, set first lesson (Food Components) by default
        setActiveLessonId(activeLessons[0].id);
      } else {
        setActiveLessonId(activeLessons[0].id);
      }
    }
  }, [activeSubjectId, activeLessons, activeLessonId]);

  const loadPdfFile = async () => {
    try {
      let pdfFileName = '';
      
      if (activeSubjectId === 'biology') {
        pdfFileName = 'FINAL BIOLOGY AICU TEXTBOOK.pdf';
      } else if (activeSubjectId === 'physics' || activeSubjectId === 'chemistry') {
        pdfFileName = 'FINAL AICU PHY & CHEMISTRY SCIENCE TEXT BOOK.pdf';
      }

      if (pdfFileName) {
        const response = await fetch(`/${pdfFileName}`);
        if (response.ok) {
          const blob = await response.blob();
          const file = new File([blob], pdfFileName, { type: 'application/pdf' });
          setPdfFile(file);
        } else {
          console.error('Failed to load PDF:', pdfFileName);
        }
      }
    } catch (error) {
      console.error('Error loading PDF file:', error);
    }
  };

  // Load PDF file when assistant tab is active or subject changes
  useEffect(() => {
    if (activeTab === 'assistant') {
      loadPdfFile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, activeSubjectId]);

  const handleBackToHome = () => {
    navigate('/home');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section as keyof typeof prev]
    }));
  };

  const handleTabChange = (newTab: string) => {
    if (newTab === activeTab) return;
    
    setActiveTab(newTab as ScienceTab);
    // Removed animationKey update - using key prop causes unnecessary remounts
    // React will handle content updates naturally based on activeTab, activeSubjectId, and activeLessonId state
  };

  const renderOverview = () => {
    const SubjectIcon = activeSubject.icon;
    
    // For Biology, show the overview content based on selected lesson
    if (activeSubjectId === 'biology') {
      const isNutritionLesson = activeLessonId === 'biology-lesson-2' || (activeLesson && activeLesson.title === 'Nutrition');
      const isRespirationLesson = activeLessonId === 'biology-lesson-3' || (activeLesson && activeLesson.title === 'Respiration');
      const isReproductionLesson = activeLessonId === 'biology-lesson-4' || (activeLesson && activeLesson.title === 'Reproduction');
      const isExcretionLesson = activeLessonId === 'biology-lesson-5' || (activeLesson && activeLesson.title === 'Excretion');
      const isClassificationLesson = activeLessonId === 'biology-lesson-6' || (activeLesson && activeLesson.title === 'Classification of Plants and Animals');
      const isTransportationLesson = activeLessonId === 'biology-lesson-7' || (activeLesson && activeLesson.title === 'Transportation');
      const isMicroorganismsLesson = activeLessonId === 'biology-lesson-8' || (activeLesson && activeLesson.title === 'Microorganisms');
      const isCellTissueOrgansLesson = activeLessonId === 'biology-lesson-9' || (activeLesson && (activeLesson.title === 'Cell, Tissue-Organs' || activeLesson.title === 'Cell, Tissue - Organs'));
      const isControlCoordinationLesson = activeLessonId === 'biology-lesson-10' || (activeLesson && activeLesson.title === 'Control and Coordination');
      const isEcosystemLesson = activeLessonId === 'biology-lesson-11' || (activeLesson && activeLesson.title === 'Ecosystem Around Us');
      const isEvolutionHeredityLesson = activeLessonId === 'biology-lesson-12' || (activeLesson && activeLesson.title === 'Evolution and Heredity');
      
      return (
        <div className="space-y-0 -mt-2">
          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-t-xl rounded-b-none p-3 border-t border-l border-r border-amber-200/50 border-b-0 shadow-md overflow-hidden mb-0 pb-0">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-row items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <SubjectIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-amber-900 leading-tight">{activeSubject.name}</h1>
                {activeLesson && (
                  <p className="text-sm text-stone-600 mt-1">
                    {activeLesson.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isNutritionLesson ? (
            // Nutrition for Animals Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-gradient-to-r from-green-200 to-teal-200">
                  2. NUTRITION FOR ANIMALS
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">AUTOTROPHIC NUTRITION:</h3>
                    <p className="text-gray-600 mb-3">Nutrition in animals involves the intake, digestion, absorption, and utilization of nutrients to sustain life, growth, and reproduction.</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Intake:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Animals consume food through various methods, depending on their species and environment. Some animals are herbivores, feeding primarily on plants, while others are carnivores, feeding on other animals. Omnivores consume both plant and animal matter. Filter feeders consume small particles suspended in water, while detritivores feed on decomposing organic matter.</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Digestion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Food undergoes mechanical and chemical digestion to break down complex molecules into simpler forms that the body can absorb. Digestive enzymes break down carbohydrates, proteins, and fats into their component molecules (glucose, amino acids, and fatty acids, respectively). Digestion can occur in specialized organs such as the stomach, intestines, and oral cavity.</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Absorption:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Once food molecules are broken down, they are absorbed across the lining of the digestive tract and into the bloodstream. Nutrients are transported to cells throughout the body for energy production, growth, and repair.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Utilization:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Nutrients are used by cells for various metabolic processes, including energy production (through cellular respiration), the synthesis of new molecules, and the maintenance of cellular structures.</p>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Excretion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Waste products from the digestion and metabolism of nutrients are excreted from the body. This process typically involves the elimination of undigested food (faeces) and metabolic waste products such as urea (in urine).</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Introduction
                </h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <p className="italic text-indigo-700 font-semibold bg-white/60 rounded-lg p-3 border-l-4 border-indigo-400">"Photosynthesis is the process by which photoautotrophs convert light energy into chemical energy, which can later be used as fuel for the activities of organisms."</p>
                  <p className="text-gray-600">The photosynthesis process requires three crucial elements to function: <span className="font-semibold text-blue-600">water</span>, <span className="font-semibold text-green-600">carbon dioxide</span>, and <span className="font-semibold text-yellow-600">light</span>. If any of these elements are absent, then the process may be hindered.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-yellow-200">
                  Photosynthesis Process
                </h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">The actual process occurs during the day, and two interrelated phases are involved in the process:</p>
                  <ul className="list-disc list-inside space-y-1.5 ml-4">
                    <li className="text-blue-600 font-semibold">Light-dependent reaction</li>
                    <li className="text-purple-600 font-semibold">Light-independent reaction</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Light-dependent reaction
                </h3>
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">This reaction requires <span className="font-semibold text-yellow-600">sunlight</span> to produce energy molecules (<span className="font-semibold text-green-600">ATP</span> and <span className="font-semibold text-purple-600">NADPH</span>). Moreover, photosynthesis increases with more photons (light), and consequently, more energy molecules are produced.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Light independent reaction
                </h3>
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">Essentially, the light-independent reaction uses the energy molecules produced by the light-dependent reaction to produce even more energy molecules.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Process of Photosynthesis Step by Step
                </h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">The <span className="font-semibold text-yellow-600">sunlight</span> is absorbed by the <span className="font-semibold text-green-600">chlorophyll</span> in the leaves of the plants. <span className="font-semibold text-blue-600">Carbon dioxide</span> enters the plant through structures called the <span className="font-semibold text-purple-600">stomata</span>, which are usually found on the underside of the leaves. <span className="font-semibold text-cyan-600">Water</span> is absorbed through the roots of the plant.</p>
                  <p className="text-gray-600">The light-dependent reaction occurs during the day. At this stage, water is split into its elements <span className="font-semibold text-red-600">oxygen</span> and <span className="font-semibold text-blue-600">hydrogen ions</span>. Then, the ions go through a series of electron carriers, eventually leading to the accumulation of hydrogen ions. As electrons get transferred from one electron carrier to another, energy is released. In this case, <span className="font-semibold text-green-600">ATP</span> and <span className="font-semibold text-purple-600">NADPH</span> are released.</p>
                  <p className="text-gray-600">The light-independent reaction uses the energy produced during light, depending on the reaction, to transform <span className="font-semibold text-blue-600">carbon dioxide</span> into <span className="font-semibold text-green-600">glucose</span>. The transformation from carbon dioxide to glucose requires a few reactions. The same molecule produces glucose during this process.</p>
                  <p className="text-gray-600">The lower parts of the leaves have rather "spaced out" cells. This structure permits carbon dioxide to permeate into other parts of the leaves, thereby facilitating the release of <span className="font-semibold text-red-600">oxygen</span>.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  HETEROTROPHIC NUTRITION:
                </h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <h4 className="text-base font-bold text-violet-700 mb-2">Amoeba</h4>
                    <p className="text-gray-600 italic text-xs">(includes the diagrams shown in the PDF)</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">a) Saprophytic Nutrition:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Some organisms break down the food materials outside their body and then absorb them. These are called <span className="font-semibold text-green-600">saprophytes</span>. Examples: <span className="text-green-600">bread moulds</span>, <span className="text-green-600">yeast</span>, <span className="text-green-600">mushrooms</span>, etc.</p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">b) Parasitic Nutrition:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Plants or animals that live in or on other plants or animals and get their food from them. E.g., <span className="font-semibold text-orange-600">Cucuta</span>, <span className="font-semibold text-orange-600">leech</span>, <span className="font-semibold text-orange-600">head louse</span>, <span className="font-semibold text-orange-600">tapeworms</span>, etc.</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">c) Holozoic Nutrition:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Some organisms take in whole food material and break it down into simple substances inside their body. Examples: <span className="font-semibold text-blue-600">amoeba</span>, <span className="font-semibold text-blue-600">dog</span>, <span className="font-semibold text-blue-600">human</span>, etc.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Nutrition in animals:
                </h3>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600 font-medium">Here are some examples of nutrition in animals:</p>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Carnivores:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Lions</span>, <span className="font-semibold text-red-600">tigers</span>, and <span className="font-semibold text-red-600">wolves</span> are examples of carnivores that primarily consume meat for their nutrition. Their diet consists mainly of other animals, which provide them with essential nutrients like <span className="text-blue-600 font-semibold">protein</span> and <span className="text-yellow-600 font-semibold">fats</span>.</p>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Herbivores:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-600">Cows</span>, <span className="font-semibold text-green-600">horses</span>, and <span className="font-semibold text-green-600">rabbits</span> are examples of herbivores that primarily consume plant matter for their nutrition. They feed on grasses, leaves, and other plant materials, obtaining <span className="text-yellow-600 font-semibold">carbohydrates</span>, <span className="text-blue-600 font-semibold">proteins</span>, <span className="text-purple-600 font-semibold">vitamins</span>, and <span className="text-orange-600 font-semibold">minerals</span> from their diet.</p>
                  </div>

                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <h4 className="text-base font-bold text-amber-700 mb-2">Omnivores:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-600">Humans</span>, <span className="font-semibold text-amber-600">bears</span>, and <span className="font-semibold text-amber-600">pigs</span> are examples of omnivores that have a varied diet, consuming both plant and animal matter. They obtain nutrients from a wide range of foods, including <span className="text-green-600">fruits</span>, <span className="text-green-600">vegetables</span>, <span className="text-yellow-600">grains</span>, <span className="text-red-600">meat</span>, and <span className="text-blue-600">fish</span>.</p>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Detritivores:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-600">Earthworms</span>, <span className="font-semibold text-teal-600">dung beetles</span>, and <span className="font-semibold text-teal-600">vultures</span> are examples of detritivores that feed on decomposing organic matter. They break down dead plants and animals, obtaining nutrients like <span className="text-yellow-600 font-semibold">carbohydrates</span> and <span className="text-blue-600 font-semibold">proteins</span> from the decaying material.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl p-5 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-700 to-gray-700 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-slate-200">
                  NUTRITION IN HUMANS
                </h3>
                <div className="space-y-2.5 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">Humans are <span className="font-semibold text-purple-600">heterotrophs</span> as they cannot make their own food.</p>
                  <p className="text-gray-600">Food is crushed with <span className="font-semibold text-blue-600">teeth</span> and acted on by <span className="font-semibold text-green-600">saliva</span> secreted from the <span className="font-semibold text-cyan-600">salivary gland</span>.</p>
                  <p className="text-gray-600">The enzyme <span className="font-semibold text-red-600">salivary amylase</span> in saliva breaks down <span className="font-semibold text-yellow-600">starch</span> into <span className="font-semibold text-orange-600">sugar</span>.</p>
                  <p className="text-gray-600">Food is transferred to the <span className="font-semibold text-pink-600">stomach</span> through a long tube <span className="font-semibold text-indigo-600">esophagus</span> by rhythmic contractions.</p>
                  <p className="text-gray-600">In the stomach, food releases <span className="font-semibold text-blue-600">pepsin</span>, <span className="font-semibold text-red-600">hydrochloric acid</span> and <span className="font-semibold text-green-600">mucus</span>.</p>
                  <p className="text-gray-600">Food is partially digested in the stomach. Undigested and semi-digested food enters the <span className="font-semibold text-teal-600">small intestine</span>.</p>
                  <p className="text-gray-600">In the small intestine, the <span className="font-semibold text-amber-600">liver</span> releases <span className="font-semibold text-yellow-600">bile juice</span>, and the <span className="font-semibold text-purple-600">pancreas</span> releases <span className="font-semibold text-pink-600">pancreatic juice</span>, including <span className="font-semibold text-blue-600">lipase</span>, into the surface area for digestion.</p>
                  <p className="text-gray-600"><span className="font-semibold text-indigo-600">Large intestine</span> will absorb <span className="font-semibold text-cyan-600">water</span> from the unabsorbed food.</p>
                  <p className="text-gray-600">Waste material is removed via <span className="font-semibold text-red-600">anus</span>.</p>
                </div>
              </div>
            </>
          ) : isRespirationLesson ? (
            // Respiration Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-cyan-200">
                3. RESPIRATION
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                  <h3 className="text-base font-bold text-green-700 mb-2">Respiration in plants:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Respiration in plants – is a metabolic process where they break down <span className="font-semibold text-yellow-600">glucose</span> to release <span className="font-semibold text-orange-600">energy</span> for cellular activities, just like in animals. It occurs in <span className="font-semibold text-purple-600">mitochondria</span>, and it involves the intake of <span className="font-semibold text-blue-600">oxygen</span> and the release of <span className="font-semibold text-red-600">carbon dioxide</span>. Unlike animals, plants also perform <span className="font-semibold text-green-600">photosynthesis</span>, which produces glucose and oxygen, creating a balance between respiration and photosynthesis for energy needs.</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h3 className="text-base font-bold text-blue-700 mb-2">Respiration in animals:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Respiration in animals – is the process by which <span className="font-semibold text-blue-600">oxygen</span> is taken in and <span className="font-semibold text-red-600">carbon dioxide</span> is expelled. It occurs in specialized organs like the <span className="font-semibold text-pink-600">lungs</span> in mammals, the <span className="font-semibold text-cyan-600">gills</span> in fish, and the <span className="font-semibold text-indigo-600">tracheal systems</span> in insects. The oxygen taken in during respiration is used in <span className="font-semibold text-purple-600">cellular respiration</span>, where <span className="font-semibold text-yellow-600">glucose</span> is broken down to release <span className="font-semibold text-orange-600">energy</span> for the organism's activities. Carbon dioxide, a by-product of cellular respiration, is then expelled from the body. This process is vital for the survival of animals, providing the energy needed for various physiological functions.</p>
                </div>
              </div>
            </div>

            {/* Summary Section */}
            <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-violet-200">
                SUMMARY
              </h2>
              
              <div className="space-y-2.5 text-gray-700 leading-relaxed text-sm">
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-green-500">
                  <span className="text-green-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700">Respiration is the process of taking <span className="font-semibold text-blue-600">oxygen</span> into the cells, breaking down <span className="font-semibold text-yellow-600">food</span> for <span className="font-semibold text-orange-600">energy</span> release, and eliminating waste products like <span className="font-semibold text-red-600">carbon dioxide</span> and <span className="font-semibold text-cyan-600">water</span>.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-blue-500">
                  <span className="text-blue-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700">Breathing is a part of the process of respiration, in which <span className="font-semibold text-blue-600">oxygen-rich air</span> is taken in and <span className="font-semibold text-red-600">carbon dioxide-rich air</span> is taken out. It involves <span className="font-semibold text-green-600">inhalation</span> and <span className="font-semibold text-purple-600">exhalation</span>.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-purple-500">
                  <span className="text-purple-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700">Based on the presence or absence of oxygen, respiration is of two types: <span className="font-semibold text-green-600">aerobic respiration</span> and <span className="font-semibold text-orange-600">anaerobic respiration</span>.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-emerald-500">
                  <span className="text-emerald-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700"><span className="font-semibold text-green-600">Stomata</span> and <span className="font-semibold text-teal-600">lenticels</span> help in the exchange of gases in plants. The <span className="font-semibold text-amber-600">roots</span> take in the air present in the <span className="font-semibold text-brown-600">soil</span>.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-cyan-500">
                  <span className="text-cyan-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700"><span className="font-semibold text-orange-600">Cockroaches</span>, <span className="font-semibold text-yellow-600">grasshoppers</span>, and other insects respire through <span className="font-semibold text-blue-600">spiracles</span>; <span className="font-semibold text-cyan-600">fish</span> respire through <span className="font-semibold text-teal-600">gills</span>; <span className="font-semibold text-purple-600">amoeba</span> through the <span className="font-semibold text-pink-600">cell membrane</span>; <span className="font-semibold text-green-600">earthworms</span> through their <span className="font-semibold text-emerald-600">skin</span>; and <span className="font-semibold text-lime-600">frogs</span> through their skin while on land and through their gills while in water.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-indigo-500">
                  <span className="text-indigo-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700">The exchange of gases through <span className="font-semibold text-teal-600">gills</span> is known as <span className="font-semibold text-blue-600">'bronchial respiration'</span>. Insects such as cockroaches and grasshoppers do not have <span className="font-semibold text-red-600">haemoglobin</span> in their blood. So blood is colourless. They have a system tube called the <span className="font-semibold text-indigo-600">'Tracheal System'</span> for the transport of gases.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-pink-500">
                  <span className="text-pink-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700">Other terrestrial organisms, such as <span className="font-semibold text-green-600">reptiles</span>, <span className="font-semibold text-blue-600">birds</span>, and <span className="font-semibold text-purple-600">mammals</span>, breathe through the <span className="font-semibold text-pink-600">lungs</span>. Breathing in the lungs is called <span className="font-semibold text-cyan-600">'pulmonary respiration'</span>.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-amber-500">
                  <span className="text-amber-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700">The human respiratory system comprises the <span className="font-semibold text-blue-600">nostrils</span>, <span className="font-semibold text-cyan-600">nasal cavity</span>, <span className="font-semibold text-purple-600">pharynx</span>, <span className="font-semibold text-pink-600">larynx</span>, <span className="font-semibold text-indigo-600">trachea</span>, <span className="font-semibold text-teal-600">bronchus</span>, <span className="font-semibold text-green-600">bronchioles</span>, <span className="font-semibold text-emerald-600">alveoli</span>, and <span className="font-semibold text-red-600">lungs</span>.</p>
                </div>
                
                <div className="flex items-start gap-2.5 bg-white/60 rounded-lg p-3 border-l-4 border-rose-500">
                  <span className="text-rose-600 font-bold mt-0.5 text-base">✓</span>
                  <p className="text-gray-700"><span className="font-semibold text-emerald-600">'Alveoli'</span> are called the 'structural and functional units of the lungs'. <span className="font-semibold text-red-600">Asthma</span>, <span className="font-semibold text-orange-600">bronchitis</span>, <span className="font-semibold text-pink-600">pneumonia</span>, and <span className="font-semibold text-purple-600">emphysema</span> are respiratory diseases.</p>
                </div>
              </div>
            </div>
            </>
          ) : isReproductionLesson ? (
            // Reproduction Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-pink-200">
                4. REPRODUCTION
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div>
                  <p className="mb-3 text-gray-600">Reproduction in animals can occur through <span className="font-semibold text-purple-600">sexual</span> or <span className="font-semibold text-blue-600">asexual</span> means. Sexual reproduction involves the fusion of <span className="font-semibold text-pink-600">gametes</span> from two parents to form offspring with <span className="font-semibold text-green-600">genetic variation</span>. This process typically involves the following steps:</p>
                </div>

                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                  <h3 className="text-base font-bold text-pink-700 mb-2">Gamete production:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Specialized cells, called <span className="font-semibold text-pink-600">gametes</span> (<span className="font-semibold text-blue-600">sperm</span> in males and <span className="font-semibold text-red-600">eggs</span> in females), are produced through a process called <span className="font-semibold text-purple-600">gametogenesis</span>.</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                  <h3 className="text-base font-bold text-purple-700 mb-2">Fertilization:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Fertilization is the fusion of a <span className="font-semibold text-blue-600">sperm cell</span> with an <span className="font-semibold text-red-600">egg cell</span>, usually occurring <span className="font-semibold text-green-600">internally</span> or <span className="font-semibold text-orange-600">externally</span>, depending on the species.</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h3 className="text-base font-bold text-blue-700 mb-2">Embryo development:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">The fertilized egg, or <span className="font-semibold text-purple-600">zygote</span>, undergoes <span className="font-semibold text-green-600">division</span> and <span className="font-semibold text-pink-600">differentiation</span> to form an <span className="font-semibold text-blue-600">embryo</span>, which eventually develops into a new individual.</p>
                </div>

                <div>
                  <p className="mb-3 text-gray-600"><span className="font-semibold text-blue-600">Asexual reproduction</span> occurs without the involvement of gametes from two parents.</p>
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                  <h3 className="text-base font-bold text-cyan-700 mb-2">A. Fission:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Single-celled organisms such as <span className="font-semibold text-cyan-600">paramecium</span> and <span className="font-semibold text-blue-600">bacteria</span> reproduce by <span className="font-semibold text-purple-600">fission</span>. Paramecium divides into two; it is <span className="font-semibold text-green-600">binary fission</span>.</p>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                  <h3 className="text-base font-bold text-emerald-700 mb-2">B. Budding:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Where a new organism develops from an <span className="font-semibold text-green-600">outgrowth</span> or <span className="font-semibold text-emerald-600">bud</span> on the parent.</p>
                </div>

                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                  <h3 className="text-base font-bold text-teal-700 mb-2">C. Fragmentation:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">Where a parent organism breaks into <span className="font-semibold text-teal-600">fragments</span> and each fragment develops into a new individual.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl p-5 shadow-lg border border-pink-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-pink-200">
                Sexual Reproduction:
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div>
                  <h4 className="text-base font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">Flowering Plants:</h4>
                  <p className="mb-3 text-gray-600">Most flowering plants reproduce sexually through the production of <span className="font-semibold text-pink-600">flowers</span>. <span className="font-semibold text-yellow-600">Pollen grains</span> produced by the <span className="font-semibold text-blue-600">male reproductive organs</span> (anthers) are transferred to the <span className="font-semibold text-red-600">female reproductive organs</span> (stigma) either by <span className="font-semibold text-cyan-600">wind</span>, <span className="font-semibold text-green-600">insects</span>, <span className="font-semibold text-purple-600">birds</span>, or other animals.</p>
                </div>

                <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                  <h4 className="text-sm font-bold text-violet-700 mb-2">Unisexual flower:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">A flower that has either <span className="font-semibold text-blue-600">stamens</span> (Androecium) or <span className="font-semibold text-pink-600">pistils</span> (Gynoecium). It is called a unisexual flower. E.g., <span className="text-green-600">cucumber</span>, <span className="text-green-600">bottle gourd</span>, <span className="text-green-600">bitter gourd</span>, etc.</p>
                </div>

                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                  <h4 className="text-sm font-bold text-indigo-700 mb-2">Bisexual flower:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">A flower that has both <span className="font-semibold text-blue-600">stamens</span> and <span className="font-semibold text-pink-600">pistils</span> (androecium and gynoecium). E.g. <span className="text-green-600">natural</span>, <span className="text-green-600">hibiscus</span>, <span className="text-green-600">mango</span>, etc.</p>
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                  <h4 className="text-sm font-bold text-emerald-700 mb-2">Complete flower:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">A flower that has four or more whorls—at least one each of <span className="font-semibold text-green-600">sepals</span>, <span className="font-semibold text-pink-600">petals</span>, <span className="font-semibold text-blue-600">stamens</span>, and <span className="font-semibold text-red-600">pistils</span>—is called a complete flower. E.g., <span className="text-green-600">datura</span>, <span className="text-green-600">hibiscus</span>, <span className="text-green-600">mango</span>, etc.</p>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                  <h4 className="text-sm font-bold text-orange-700 mb-2">Incomplete flower:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">A flower in which any of these four whorls is missing is an incomplete flower. E.g., <span className="text-green-600">cucumber</span>, <span className="text-green-600">bottle gourd</span>, <span className="text-green-600">papaya</span>.</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Self-pollination, or autogamy:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Is the process of transferring <span className="font-semibold text-yellow-600">pollen</span> from one flower to the <span className="font-semibold text-pink-600">stigma</span> of another flower of the same plant.</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                  <h4 className="text-sm font-bold text-purple-700 mb-2">Cross-pollination:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">The transfer of <span className="font-semibold text-yellow-600">pollen grains</span> from the <span className="font-semibold text-blue-600">anther</span> of one flower to the <span className="font-semibold text-pink-600">stigma</span> of another flower belonging to the same species is called <span className="font-semibold text-purple-600">cross-pollination</span>, or <span className="font-semibold text-indigo-600">allogamy</span>.</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                  <h4 className="text-sm font-bold text-amber-700 mb-2">Conifers:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-600">Conifers</span>, such as <span className="text-green-600">pine trees</span>, reproduce sexually through the production of <span className="font-semibold text-brown-600">cones</span>. <span className="font-semibold text-blue-600">Male cones</span> produce <span className="font-semibold text-yellow-600">pollen</span>, which is carried by <span className="font-semibold text-cyan-600">wind</span> to <span className="font-semibold text-pink-600">female cones</span>. <span className="font-semibold text-purple-600">Fertilization</span> occurs within the female cones, leading to the formation of <span className="font-semibold text-green-600">seeds</span>.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
                Asexual Reproduction
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                  <h4 className="text-sm font-bold text-green-700 mb-2">Runners:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Some plants, like <span className="font-semibold text-red-600">strawberries</span> and <span className="font-semibold text-green-600">spider plants</span>, produce horizontal stems called <span className="font-semibold text-emerald-600">runners</span> that grow along the <span className="font-semibold text-amber-600">soil surface</span>. These runners develop <span className="font-semibold text-brown-600">roots</span> and new <span className="font-semibold text-green-600">plantlets</span> at their nodes, eventually forming new independent plants.</p>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                  <h4 className="text-sm font-bold text-yellow-700 mb-2">Bulbs:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Bulb-forming plants, such as <span className="font-semibold text-purple-600">onions</span> and <span className="font-semibold text-pink-600">tulips</span>, reproduce asexually through the development of underground storage structures called <span className="font-semibold text-yellow-600">bulbs</span>. These bulbs produce new <span className="font-semibold text-green-600">shoots</span> and <span className="font-semibold text-brown-600">roots</span>, leading to the formation of <span className="font-semibold text-blue-600">genetically identical</span> offspring.</p>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                  <h4 className="text-sm font-bold text-amber-700 mb-2">Rhizomes:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Plants like <span className="font-semibold text-yellow-600">ginger</span> and <span className="font-semibold text-green-600">bamboo</span> reproduce asexually through underground stems called <span className="font-semibold text-amber-600">rhizomes</span>. Rhizomes grow <span className="font-semibold text-blue-600">horizontally</span> and produce new <span className="font-semibold text-green-600">shoots</span> and <span className="font-semibold text-brown-600">roots</span> at various points, allowing the plant to spread and form <span className="font-semibold text-purple-600">colonies</span>.</p>
                </div>

                <div className="bg-white/60 rounded-lg p-3 border-l-4 border-indigo-400">
                  <p className="text-gray-600 text-sm leading-relaxed">These examples showcase the diverse ways in which plants reproduce, utilizing both <span className="font-semibold text-pink-600">sexual</span> and <span className="font-semibold text-blue-600">asexual</span> strategies to ensure the survival and proliferation of species.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 rounded-2xl p-5 shadow-lg border border-lime-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-lime-600 to-green-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-lime-200">
                Germination:
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600">When the <span className="font-semibold text-brown-600">seed</span> is sown in <span className="font-semibold text-cyan-600">moist soil</span>, it begins to grow. The process by which a seed begins to grow is called <span className="font-semibold text-green-600">germination</span>. When a seed germinates, the <span className="font-semibold text-amber-600">seed coat</span> splits <span className="font-semibold text-brown-600">tiny roots</span> grow down, and a <span className="font-semibold text-green-600">shoot</span> grows upwards. This produces a <span className="font-semibold text-emerald-600">seedling</span> of the plant. The seedling grows further, and a <span className="font-semibold text-green-600">new plant</span> is formed. When the plant bears <span className="font-semibold text-pink-600">flowers</span>, it again produces <span className="font-semibold text-red-600">fruits</span> and <span className="font-semibold text-yellow-600">seeds</span>. The seeds can germinate when sown in soil under suitable conditions to produce new plants.</p>
              </div>
            </div>
            </>
          ) : isExcretionLesson ? (
            // Excretion Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-orange-200">
                5. EXCRETION
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600"><span className="font-semibold text-orange-600">Excretion</span> is the process by which <span className="font-semibold text-red-600">metabolic waste products</span> and other harmful substances are removed from the body to maintain <span className="font-semibold text-blue-600">internal balance</span> and prevent the build-up of <span className="font-semibold text-red-600">toxins</span>. In animals, excretion primarily involves the removal of waste products such as:</p>

                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                  <h3 className="text-base font-bold text-red-700 mb-2">1. Nitrogenous Waste</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Animals produce nitrogenous wastes, such as <span className="font-semibold text-red-600">ammonia</span>, <span className="font-semibold text-orange-600">urea</span>, and <span className="font-semibold text-pink-600">uric acid</span>, as by-products of <span className="font-semibold text-blue-600">protein metabolism</span>. These wastes are <span className="font-semibold text-red-600">toxic</span> and must be removed from the body.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">Different animals excrete nitrogenous wastes in various forms. For example, <span className="font-semibold text-cyan-600">aquatic animals</span> like <span className="font-semibold text-blue-600">fish</span> excrete ammonia directly into the water, while <span className="font-semibold text-purple-600">mammals</span> excrete urea in <span className="font-semibold text-yellow-600">urine</span>, and <span className="font-semibold text-pink-600">birds</span> excrete uric acid as a semisolid paste.</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h3 className="text-base font-bold text-blue-700 mb-2">2. Carbon Dioxide:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-red-600">Carbon dioxide</span> (CO₂) is produced as a by-product of <span className="font-semibold text-purple-600">cellular respiration</span>, where <span className="font-semibold text-yellow-600">glucose</span> is broken down to release <span className="font-semibold text-orange-600">energy</span>. Excess carbon dioxide must be removed from the body to maintain proper <span className="font-semibold text-green-600">pH levels</span> and prevent <span className="font-semibold text-red-600">respiratory acidosis</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">In animals, carbon dioxide is primarily eliminated through the <span className="font-semibold text-cyan-600">respiratory system</span> by exhaling it into the environment.</p>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                  <h3 className="text-base font-bold text-purple-700 mb-2">3. Other metabolic wastes:</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Animals produce various other metabolic wastes, such as excess <span className="font-semibold text-blue-600">salts</span>, <span className="font-semibold text-cyan-600">water</span>, and <span className="font-semibold text-red-600">toxins</span> that need to be eliminated to maintain <span className="font-semibold text-green-600">homeostasis</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-yellow-600">urinary system</span>, <span className="font-semibold text-cyan-600">respiratory system</span>, and <span className="font-semibold text-pink-600">integumentary system</span> (skin) play essential roles in excreting these waste products from the body.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-yellow-200">
                Excretory Systems
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                  <h4 className="text-sm font-bold text-yellow-700 mb-2">I) Urinary System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">Many animals have a <span className="font-semibold text-yellow-600">urinary system</span> responsible for removing <span className="font-semibold text-red-600">metabolic waste products</span>, primarily <span className="font-semibold text-orange-600">nitrogenous wastes</span> like <span className="font-semibold text-pink-600">urea</span> and <span className="font-semibold text-red-600">ammonia</span>, from the body. In <span className="font-semibold text-purple-600">mammals</span>, this system includes the <span className="font-semibold text-red-600">kidneys</span>, <span className="font-semibold text-blue-600">ureters</span>, <span className="font-semibold text-cyan-600">bladder</span>, and <span className="font-semibold text-indigo-600">urethra</span>. The kidneys filter waste products from the <span className="font-semibold text-red-600">bloodstream</span>, producing <span className="font-semibold text-yellow-600">urine</span>, which is then excreted from the body.</p>
                </div>

                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                  <h4 className="text-sm font-bold text-cyan-700 mb-2">ii) Respiratory System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-cyan-600">respiratory system</span> also plays a role in excretion by eliminating <span className="font-semibold text-red-600">carbon dioxide</span>, a waste product of <span className="font-semibold text-purple-600">cellular respiration</span>, from the body through <span className="font-semibold text-blue-600">exhalation</span>.</p>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                  <h4 className="text-sm font-bold text-green-700 mb-2">iii) Digestive System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The <span className="font-semibold text-green-600">digestive system</span> removes <span className="font-semibold text-amber-600">undigested food</span> and other waste products from the body through <span className="font-semibold text-brown-600">defecation</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">These processes are vital for maintaining <span className="font-semibold text-blue-600">homeostasis</span> and ensuring the proper functioning of the body's <span className="font-semibold text-purple-600">cells</span> and <span className="font-semibold text-pink-600">systems</span>.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                Do plants also excrete like animals?
              </h3>
              
              <div className="space-y-2.5 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Do they also have <span className="font-semibold text-purple-600">excretory organs</span>? How do plants manage to get rid of waste products from their bodies?</p>
                <p className="text-gray-600 mb-2">Plants produce a variety of <span className="font-semibold text-red-600">waste products</span> during <span className="font-semibold text-blue-600">metabolism</span>, but they do not have specific organs to excrete. Plants break down waste substances at a much slower rate than animals; therefore, the accumulation of waste is also much slower. They are also capable of <span className="font-semibold text-green-600">managing and recycling</span> waste.</p>
                <p className="text-gray-600 mb-2">Plants use completely different strategies for excretion than animals. <span className="font-semibold text-blue-600">Oxygen</span> itself can be considered a waste product generated during <span className="font-semibold text-green-600">photosynthesis</span> in plants that exits through the <span className="font-semibold text-emerald-600">stomata</span> of leaves and <span className="font-semibold text-teal-600">lenticels</span> of the stem.</p>
                <p className="text-gray-600 mb-2"><span className="font-semibold text-red-600">Excretory products</span> may be stored in <span className="font-semibold text-green-600">leaves</span>, <span className="font-semibold text-amber-600">bark</span>, and <span className="font-semibold text-pink-600">fruits</span>. When these dead leaves, bark, and ripe fruits fall off the tree, the waste products in them are disposed of. Waste may get stored in the fruits in the form of a solid body called <span className="font-semibold text-purple-600">'Raphides'</span>. Several <span className="font-semibold text-red-600">toxic compounds</span> are synthesized by the plants for protection against <span className="font-semibold text-orange-600">herbivores</span>.</p>
                <p className="text-gray-600 mb-2">Most plant products that we think are waste may be beneficial to the plant in some way or another. <span className="font-semibold text-indigo-600">Alkaloids</span>, <span className="font-semibold text-amber-600">tannins</span>, <span className="font-semibold text-green-600">gums</span>, etc. are products that are often protective for the plant's body.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                Excretion vs Secretion
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                  <h4 className="text-sm font-bold text-red-700 mb-2">Excretion:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-red-600">Excretion</span> is the removal of materials from a living being. Excretion is <span className="font-semibold text-blue-600">passive</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">Humans excrete materials such as <span className="font-semibold text-yellow-600">urine</span>, <span className="font-semibold text-red-600">carbon dioxide</span>, <span className="font-semibold text-orange-600">sweat</span>, and <span className="font-semibold text-pink-600">urea</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">In plants, we find excretion through <span className="font-semibold text-brown-600">roots</span> into their surroundings, including falling <span className="font-semibold text-green-600">leaves</span>, <span className="font-semibold text-amber-600">bark</span>, and <span className="font-semibold text-pink-600">fruits</span>.</p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Secretion:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-blue-600">Secretion</span> is the movement of material from one point to another point. It has an <span className="font-semibold text-green-600">active nature</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Secretions include <span className="font-semibold text-purple-600">enzymes</span>, <span className="font-semibold text-pink-600">hormones</span>, and <span className="font-semibold text-cyan-600">saliva</span>.</p>
                  <p className="text-gray-700 text-sm leading-relaxed">Secretions occur in the plant body in the form of <span className="font-semibold text-yellow-600">latex</span>, <span className="font-semibold text-amber-600">resins</span>, <span className="font-semibold text-green-600">gums</span>, etc.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Plant Excretory Products
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Tannins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">These are organic compounds. These are stored in different parts of the plant and are dark brown. Tannins are used in leather, tanning and pharmaceuticals. E.g. Cassia, Acacia.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Resins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Resins mostly occur in gymnosperms in specialized passages called resin passages. Varnishes. E.g. Pinus</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Gums:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Plants like Neem, and Acacia ooze out a sticky substance called gum when branches are cut. The gums swell by absorbing water and help heal damaged parts of a plant. Gums are economically valuable and used as adhesives and binding agents in the preparation of medicines, food, etc.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Latex:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Latex is a sticky, milky white substance secreted by plants. Latex is stored in latex cells or latex vessels. From the latex of Hevea braziliensis (Rubber plant), rubber is prepared.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Excretion in humans
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">The excretory system is the system of an organism's body that performs the function of excretion, the bodily process of discharging waste.</p>
                <p className="mb-4">Chemical waste like urea is excreted by the urinary system and skin. The excretory system in a human being consists of the following:</p>
                
                <ul className="list-disc list-inside space-y-2 ml-4 mb-4">
                  <li>A pair of kidneys</li>
                  <li>A pair of ureters</li>
                  <li>The urinary bladder</li>
                  <li>Urethra</li>
                </ul>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Kidneys:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">In human beings, there are a pair of bean-shaped, reddish-brown structures called kidneys.</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">They are present in the abdominal cavity attached to the dorsal body wall, one on either side of the spine. The position of the right kidney is lower than that of the left kidney. This is due to the presence of the liver above. The kidneys filter and clean the blood and form urine. Each kidney is convex on the outer side and concave on the inner side.</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The inner side of each kidney has a raised structure called a fissure or hilus where the renal artery enters and a renal vein and ureter exit. The renal artery brings oxygenated blood filled with waste products (mainly urea) into the kidney. The renal vein carries blood with less waste and oxygenated blood out of the kidneys.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Ureters:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Each ureter arises from the hilus of the kidney. The ureters are muscular tubes. The movement of urine from the kidney to the urinary bladder is done in the ureters through peristalsis.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Urinary bladder:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">It is a pear-shaped, distensible sac-like structure. It is situated in the pelvic region on the ventral side of the rectum in the abdomen. It stores urine brought by two ureters, and the capacity of the bladder is 300 = 800 ml.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Urethra:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">It is the tube that excretes urine from the bladder. The opening of the urinary bladder into the urethra is guarded by a ring of muscles helping in closing and opening it called a sphincter. It regulates the movement of urine. The urethra is 4 cm long in females and in males, it is about 20 cm long.</p>
                </div>
              </div>
            </div>
            </>
          ) : isClassificationLesson ? (
            // Classification of Plants and Animals Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                6. CLASSIFICATION OF PLANTS AND ANIMALS
              </h2>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">R.H. Whittaker gave the Five Kingdom classification for living organisms. He categorized living organisms based on multiple characteristics such as cellular structure, mode of nutrition, body organization, reproduction, phylogenetic relationship, etc. These five kingdoms were Monera, Protista, Fungi, Plantae, and Animalia.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Plant Kingdom: Plantae
              </h3>
              
              <div className="space-y-4 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p>Kingdom Plantae includes all the plants. They are eukaryotic, multicellular, and autotrophic organisms. The plant cell contains a rigid cell wall. Plants have chloroplasts and chlorophyll pigment, which are required for photosynthesis.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Characteristics of Kingdom Plantae
              </h3>
              
              <div className="space-y-4 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p>The plant kingdom has the following characteristic features:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>They are non-motile.</li>
                  <li>They make their food and, hence, are called autotrophs.</li>
                  <li>They reproduce asexually, either by vegetative propagation or sexually.</li>
                  <li>These are multicellular eukaryotes.</li>
                  <li>The plant cell contains the outer cell wall and a large central vacuole.</li>
                  <li>Plants contain photosynthetic pigments called chlorophyll present in the plastids.</li>
                  <li>They have different organelles for anchorage, reproduction, support, and photosynthesis.</li>
                </ul>
                <p className="mt-4">The plant kingdom is further classified into subgroups. Classification is based on the following Criteria:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li><strong className="text-amber-800">Plant body:</strong> Presence or absence of a well-differentiated plant body. E.g., roots, stems, and leaves.</li>
                  <li><strong className="text-amber-800">Vascular system:</strong> Presence or absence of a vascular system for the transportation of water and other substances. E.g., Phloem and Xylem.</li>
                  <li><strong className="text-amber-800">Seed formation:</strong> The presence or absence of flowers and seeds, and whether the seeds are naked or enclosed in a fruit.</li>
                </ul>
                <p className="mt-4">The plant kingdom has been classified into five subgroups according to the above-mentioned criteria:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Thalophyta</li>
                  <li>Bryophytes</li>
                  <li>Pteridophyta</li>
                  <li>Gymnosperms</li>
                  <li>Angiosperms</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                1. Thallophyta
              </h3>
              
              <div className="space-y-3 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>A well-differentiated body structure, and the plant body is thallus-like.</li>
                  <li>Includes plants with primitive and simple body structures.</li>
                  <li>The plant body is the thallus; it may be filamentous, colonial, branched, or unbranched.</li>
                  <li>Examples include green algae, red algae, and brown algae.</li>
                  <li>Common examples: Volvox, Fucus, Spirogyra, Chara, Polysiphonia, Ulothrix, etc.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                2. Bryophyta
              </h3>
              
              <div className="space-y-3 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Bryophytes do not have vascular tissues.</li>
                  <li>The plant body has root-like, stem-like, and leaf-like structures.</li>
                  <li>Bryophytes are terrestrial plants but are known as "amphibians of the plant kingdom" as they require water for sexual reproduction.</li>
                  <li>They are present in moist and shady places.</li>
                  <li>Examples: Marchantia, Funaria, Sphagnum, Antheoceros, etc.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                3. Pteridophyta
              </h3>
              
              <div className="space-y-3 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Have a well-differentiated plant body into roots, stems, and leaves.</li>
                  <li>They have a vascular system for the conduction of water and other substances.</li>
                  <li>Examples: Selaginella, Equisetum, Pteris, etc.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                4. Gymnosperms
              </h3>
              
              <div className="space-y-3 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Cone-bearing plants that bear naked seeds.</li>
                  <li>They fall under the kingdom Plantae and subkingdom Embryophyte.</li>
                  <li>Includes trees and shrubs.</li>
                  <li>Largest group = Conifers (pine, yew, cedar, redwood, spruce).</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                5. Angiosperms
              </h3>
              
              <div className="space-y-3 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Flowering plants that bear flowers and fruits.</li>
                  <li>Include forbs, grasses, shrubs, vines, most broad-leaved trees, and many aquatic plants.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Animal Kingdom
              </h3>
              
              <div className="space-y-4 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <h4 className="text-xl font-semibold text-amber-800 mb-3">Introduction</h4>
                <p>The organisms, which are eukaryotic, multicellular, and heterotrophic, are categorized as members of the Animalia kingdom. The organisms of the Animalia kingdom have no cell wall. Most animals are mobile.</p>
                
                <h4 className="text-xl font-semibold text-amber-800 mb-3 mt-6">Classification of the Animalia Kingdom</h4>
                <p>Based on the extent and type of body design differentiation, the Animalia kingdom is classified as:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Porifera</li>
                  <li>Coelenterata</li>
                  <li>Platyhelminthes</li>
                  <li>Nematoda</li>
                  <li>Annelida</li>
                  <li>Arthropoda</li>
                  <li>Mollusca</li>
                  <li>Echinodermata</li>
                  <li>Protochordate</li>
                  <li>Vertebrata
                    <ul className="list-disc list-inside space-y-1 ml-6 mt-2">
                      <li>Pisces</li>
                      <li>Amphibia</li>
                      <li>Reptilia</li>
                      <li>Aves</li>
                      <li>Mammalia</li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Animal Phyla Details
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">1. Porifera</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Meaning "organism with holes."</li>
                    <li>Non-motile and attached to solid support.</li>
                    <li>Examples: Sycon, Spongilla, Euplectelia.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">2. Coelenterata</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Live in water.</li>
                    <li>Have cavities in their bodies.</li>
                    <li>Examples: Hydra, sea anemones.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">3. Platyhelminthes</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>No true internal body cavity (no coelom).</li>
                    <li>Flattened bodies → "flatworms."</li>
                    <li>Examples: Planarian, liver fluke, tapeworm.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">4. Nematoda</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cylindrical bodies.</li>
                    <li>Have tissues but no real organs.</li>
                    <li>Examples: Filarial worms, roundworms.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">5. Annelida</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Found in freshwater, marine water, and on land.</li>
                    <li>Examples: Earthworm, nereis, leech.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">6. Arthropoda</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Largest group of animals.</li>
                    <li>Have jointed legs.</li>
                    <li>Open circulatory system.</li>
                    <li>Examples: Prawns, butterflies, spiders, houseflies, scorpions.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">7. Mollusca</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Invertebrates.</li>
                    <li>Mostly aquatic.</li>
                    <li>Examples: Snails, mussels.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">8. Echinodermata</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Spiny-skinned organisms.</li>
                    <li>Marine animals.</li>
                    <li>Examples: Starfish, sea urchins, feather stars.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">9. Protochordate</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Mostly marine.</li>
                    <li>Examples: Balanoglossus, Herdmania, Amphioxus.</li>
                    <li>Have a notochord (not throughout life).</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">10. Vertebrata</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Have a true vertebral column and internal skeleton.</li>
                    <li>Classified into:</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Vertebrate Classes
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">11. Pisces (Fishes)</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Live only in water.</li>
                    <li>Body covered with scales.</li>
                    <li>Use gills to breathe.</li>
                    <li>Cold-blooded.</li>
                    <li>Two-chambered heart.</li>
                    <li>Lay eggs.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">12. Amphibia</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Live on land and water.</li>
                    <li>Moist skin with mucus glands.</li>
                    <li>Three-chambered heart.</li>
                    <li>Respire through gills or lungs.</li>
                    <li>Lay eggs.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">13. Reptilia</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Cold-blooded.</li>
                    <li>Lay eggs with tough coverings.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">14. Aves (Birds)</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Warm-blooded.</li>
                    <li>Lay eggs.</li>
                    <li>Have feathers.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">15. Mammalia</h4>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Warm-blooded.</li>
                    <li>Four-chambered heart.</li>
                    <li>Have mammary glands.</li>
                    <li>Usually give birth to live young (exceptions: platypus, echidna).</li>
                    <li>Skin with hair, sweat glands, oil glands.</li>
                  </ul>
                </div>
              </div>
            </div>
            </>
          ) : isTransportationLesson ? (
            // Transportation Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                7. TRANSPORTATION
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Transportation and excretion are essential processes in animals for maintaining internal balance, eliminating waste, and distributing essential nutrients and gases throughout the body.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Animal Transportation Systems
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Circulatory System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Many animals have a circulatory system responsible for transporting nutrients, oxygen, hormones, and waste products throughout the body. In vertebrates, this system typically consists of a heart, blood vessels, and blood. The heart pumps blood, carrying oxygen and nutrients from the lungs and digestive system to cells while picking up carbon dioxide and waste products for excretion.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Respiratory System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Animals also have respiratory systems that facilitate the exchange of gases, primarily oxygen and carbon dioxide, between the body and the environment. In mammals, this often involves the lungs, where oxygen is absorbed into the bloodstream and carbon dioxide is released for exhalation.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Digestive System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The digestive system plays a role in transportation by absorbing nutrients from ingested food and transporting them to cells throughout the body. Nutrients are absorbed into the bloodstream through the walls of the intestines and transported to cells via the circulatory system.</p>
                  <p className="mb-2 italic text-stone-600">(diagram shown in PDF)</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Plant Transportation
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">ROOT PRESSURE:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Root pressure can also be called osmotic pressure, which occurs within the cells of a root system. It causes the sap to rise through a plant stem to the leaves. It occurs in the xylem of some vascular plants.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">TRANSPIRATION:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The evaporation of water through leaves is called transpiration. Water evaporates through the stomata of leaves and lenticels of Stem. The main driving force of water uptake and transportation in plants is the transpiration of water from leaves. The transpiration Creates negative water vapor pressure in the surrounding cells of the Leaf. Once this happens, water is pulled into the leaf from the vascular. The xylem is a continuous water column that extends from the leaf to the roots.</p>
                  <p className="mb-2 italic text-stone-600">(diagram included in PDF)</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                TRANSPORTATION IN ANIMALS: BLOOD
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <div>
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">What happens when you get a cut on your body?</h4>
                  <p className="mb-4">We see blood arising out of Blood is a liquid connective tissue. Normal adult human beings possess about 5 liters of blood in their bodies. Blood consists of two main components.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Liquid-state plasma:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">90 per cent of the plasma is water. Plasma contains 7 to 8 per cent proteins, 1 per cent salts, fats, glucose, vitamins, hormones, and many other substances.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Blood cells:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The blood cells that float in plasma are red blood cells, white blood cells, and platelets.</p>
                  <p className="mb-2 italic text-stone-600">(diagram shown in PDF)</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Why is blood red?</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Red blood cells are biconcave and round, and the nucleus is absent. Due to the presence of hemoglobin, blood appears red. When oxygen binds to the iron molecule, hemoglobin is converted into ox hemoglobin and delivered to the cells of the body. Carbon dioxide in the cells enters the bloodstream. The average life span of red blood cells is 120 days.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">White blood cells:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">White blood cells do not contain hemoglobin (pigment). Therefore, they are white. They protect our bodies from many infections and diseases. We classify WBCs into 5 types:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Eosinophils</li>
                    <li>Basophils</li>
                    <li>Neutrophils</li>
                    <li>Lymphocytes</li>
                    <li>Monocytes</li>
                  </ul>
                  <p className="mb-2 mt-3 italic text-stone-600">(diagram included in PDF)</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Blood transport system:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The blood transport system consists mainly of blood, blood vessels, and the heart. Blood vessels in our body were named and discovered nearly 400 years ago. A remarkable observation was made by a British physician named William Harvey. He observed that there were two major paths of blood flow:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Towards the heart</li>
                    <li>Away from the heart</li>
                  </ul>
                  <p className="mb-2 mt-3 italic text-stone-600">(diagram shown in PDF)</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Structure of the heart and blood circulation:</h4>
                  <p className="mb-2 italic text-stone-600">(full heart diagram included in PDF)</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Double circular blood transportation:</h4>
                  <p className="mb-2 italic text-stone-600">(diagram included in PDF)</p>
                </div>
              </div>
            </div>
            </>
          ) : isMicroorganismsLesson ? (
            // Micro-organisms Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                8. MICRO-ORGANISMS
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">If you observe a drop of water in a pond through a microscope, you will see a lot of tiny, rounded structures. These tiny creatures are known as microbes or microorganisms. They are all around us and are so small in size that they cannot be seen with bare human eyes.</p>
                <p className="mb-4">Microbes are classified into four groups:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Protozoa</li>
                  <li>Bacteria</li>
                  <li>Fungi</li>
                  <li>Algae</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Microorganisms
              </h3>
              
              <div className="space-y-4 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p>Microorganisms are microscopic organisms that cannot be seen with the naked eye. These organisms are usually unicellular.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Types of Microorganisms
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Bacteria</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Bacteria are unicellular prokaryotic microorganisms. Some bacteria are useful for humans while some can be harmful. They are of four major types: Bacillus, Vibrio, Cocci and Spirilla.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Fungi</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Fungi are saprophytic or parasitic organisms. They are mostly multicellular and not microscopic. However, yeast is a unicellular and microscopic organism.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Fermentation</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Fermentation is a metabolic process that converts sugar to acids, gases or alcohol. Fermentation is used in the preparation of curd and alcohol.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Protozoa</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Protozoa are single-celled microscopic animals which include flagellates, ciliates, protozoans and many other forms. A few examples of protozoa are amoeba, paramecium, euglena, plasmodium, etc.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Viruses</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Viruses are organisms that possess nucleic acid but lack replicating machinery. Thus, a virus cannot survive without a living cell. Viruses are also considered to be on the borderline between living and non-living entities.</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">A few examples of viruses are influenza virus, HIV, rabies virus, poliovirus, tobacco mosaic virus, etc.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Vaccines and Antibiotics
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Vaccines</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">A vaccine is a biological preparation that provides active, acquired immunity to a disease. Vaccines are usually made for viral diseases. A few examples of vaccines are the Salk vaccine for polio, the influenza vaccine, the rabies vaccine, etc.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Antibiotics</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Antibiotics are inorganic or organic compounds that inhibit and kill microorganisms. Antibiotics usually target bacteria. Thus, most bacterial diseases are treated with antibiotics.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Disease Transmission
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Pathogens</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">A pathogen is any organism that causes disease. In this context, pathogens are Microorganisms. Bacteria, protozoa, and viruses can be pathogenic.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Carrier</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">A carrier is a person or organism infected with an infectious disease agent but who displays no symptoms of it. They can spread the infection since they already have the pathogen in their bodies.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Vector</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">A vector is an organism, which is a biting insect or tick that can transmit disease or parasite from one animal or plant to another. Common examples are mosquitoes. Aedes mosquitoes spread the dengue virus, and Anopheles mosquitoes spread the malarial parasite.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Airborne diseases</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Certain diseases can spread by air. These diseases are called airborne diseases. Influenza is the best example of this type of disease.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Waterborne diseases</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The diseases that spread through water are called waterborne diseases. Contaminated water is host to several pathogens. Typhoid is the best example of a waterborne disease.</p>
                </div>

                <div>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Certain pathogens can cause diseases in plants. Just like humans, plants can be attacked by bacteria or viruses.</p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Several microorganisms cause diseases in plants like rice, potatoes, wheat, sugarcane, oranges, apples, and others.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Food Poisoning and Preservation
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">1. Food poisoning</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">When food contaminated with pathogens or toxins is consumed, it causes food poisoning. The most common symptom is pain in the stomach. In severe cases, food poisoning can also cause death.</p>
                  <p className="mb-2 italic text-stone-600">(diagram included in PDF)</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">2. Food preservation</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Food preservation is the most vital part of the food industry. Certain chemicals inhibit the growth of bacteria and increase the life of cooked food. Certain simple preservation methods can be carried out at home.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">3. Chemical methods</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Chemical preservatives are used in food preservation by major food industries because they are harmless to humans. Sodium meta-bisulphate and sodium benzoate are commonly used chemical preservatives.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Uses of common salt:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Common salt, also known as sodium chloride, is used as a preservative at home. Vegetables are pickled with salt, as the salt removes water and kills bacteria and fungus cells.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">4. Preservation by Sugar</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Sugar is used for the preservation of jams, jellies, and squashes. The growth of microbes is restricted by the use of sugar, as it reduces the moisture content.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">5. Preservation by oil and vinegar</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Many food preparations, like pickles, are preserved by adding either oil or vinegar to them. Bacteria cannot grow in such a medium.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">6. Pasteurization</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Pasteurization is the process of superheating and cooling beverages to kill pathogenic microbes. Pasteurization ensures the taste of the beverage, such as milk, does not get destroyed.</p>
                </div>
              </div>
            </div>
            </>
          ) : isCellTissueOrgansLesson ? (
            // Cell, Tissue-Organs Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                9. CELL, TISSUE-ORGANS
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Cells, tissues, and organs are the hierarchical levels of organization in multicellular organisms, each playing distinct roles in maintaining the structure and function of the organisms. Cells are researched using a variety of methods, including cell culture, various types of microscopy, and cell fractionation. These have enabled, and are currently being utilized for, discoveries and studies into how cells work, ultimately leading to a better understanding of bigger creatures.</p>
                <p className="mb-4">Understanding the components of cells and how they function is crucial to all biological sciences and is also required for biomedical research in sectors such as cancer and other disorders. Genetics, molecular genetics, biochemistry, molecular biology, medical microbiology, immunology, and cytochemistry are all linked to cell biology research. With the introduction of the compound microscope in the 17th century, cells were visible for the first time. After viewing a cell-like structure on a piece of cork in 1665, Robert Hooke used the term "cells" to describe the building blocks of all living organisms. However, the cells were dead and did not indicate the true overall components of a cell. Anton Van Leeuwenhoek was the first to examine live cells in his study of algae a few years later, in 1674. All of this came before the cell hypothesis, which argues that cells make up all living things and that cells are the functional and structural units of organisms.</p>
                <p className="mb-4">In 1838, plant scientist Matthias Schneider and animal scientist Theodor Schwann observed live cells in plant and animal tissue, respectively, and came to this conclusion. Rudolf Virchow added to the cell hypothesis 19 years later, stating that all cells arise through the division of pre-existing cells. Despite its widespread acceptance, various investigations have cast doubt on the cell theory's veracity. Viruses, for example, lack membranes, cell organelles, and the ability to self-replicate, which are all common features of live cells. In 1665, Robert Hooke was the first to discover and name the cell. He noticed that it appeared oddly similar to cellula, or little apartments inhabited by monks, and so the name. However, what Hooke truly saw under the microscope were the dead cell walls of plant cells (cork). Micrographic published Hooke's description of these cells.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Hierarchical Organization
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Cells</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Cells are the basic structural and functional units of life. They are the smallest independently functioning unit of an organism and perform various specialized functions. Cells can be grouped into different types based on their structure and function. Examples include muscle cells, nerve cells, epithelial cells, and blood cells. Cells contain organelles such as the nucleus, mitochondria, endoplasmic reticulum, and Golgi apparatus, which carry out specific functions within the cell.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Tissues</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Tissues are groups of similar cells that work together to perform a specific function. They are organized into various types based on their structure and function there are four primary types of tissues in animals: epithelial tissue, connective tissue, muscle tissue, and nervous tissue epithelial tissue lines the surfaces of organs and forms protective barriers. Connective tissue provides support and structure for the body. Muscle tissue allows for movement and contraction. Nervous tissue transmits signals throughout the body.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Organs</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Organs are structures composed of two or more types of tissues that work together to perform a specific function or set of functions. Examples of organs in animals include the heart, lungs, liver, brain, and kidneys. Each organ has a specific role in maintaining homeostasis and carrying out essential physiological processes.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Organ system</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Organs are often organized into organ systems, which are groups of organs that work together to perform complex functions necessary for the survival of the organism. Examples include the respiratory system, digestive system, circulatory system, and nervous system. Together, cells, tissues, and organs form the hierarchical organization of multicellular organisms, with each level contributing to the overall structure, function, and survival of the organism.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Prokaryotic Cell
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">Prokaryotes are organisms whose cells lack a nucleus and other organelles. Prokaryotes are divided into two distinct groups: the bacteria and the archaea, which scientists believe have unique evolutionary lineages.</p>
                <p className="mb-4">Most prokaryotes are small, single-celled organisms that have a relatively simple structure. Prokaryotic cells are surrounded by a plasma membrane, but they have no internal membrane-bound organelles within their cytoplasm. The absence of a nucleus and other membrane-bound organelles differentiates prokaryotes from another class of organisms called eukaryotes. Most prokaryotes carry a small amount of genetic material in the form of a single molecule, or chromosome, of circular DNA. The DNA in prokaryotes is contained in a central area of the cell called the nucleoid, which is not surrounded by a nuclear membrane. Many prokaryotes also carry small, circular DNA molecules called plasmids, which are distinct from the chromosomal DNA and can provide genetic advantages in specific environments.</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">No Nucleus:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Prokaryotic cells lack a membrane-bound nucleus. Instead, their genetic material is typically found in a region of the cell called the nucleoid, which is not enclosed by a membrane.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Small Size:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Prokaryotic cells are generally smaller in size compared to eukaryotic cells. They typically range from 0.1 to 5.0 micrometres in diameter.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Simple Structure:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Prokaryotic cells have a simpler internal structure compared to eukaryotic cells.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Eukaryotic Cell
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">Eukaryotic cells are a type of cell that contain membrane-bound organelles, including a nucleus, where the genetic material is enclosed. These cells are found in organisms belonging to the domain Eukaryote, which includes protists, fungi, plants, and animals. Here are some key features of eukaryotic cells.</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Nucleus</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Eukaryotic cells have a well-defined nucleus that houses the cell's genetic material (DNA). The nucleus is surrounded by a double membrane called the nuclear envelope, which contains pores for the exchange of molecules between the nucleus and the cytoplasm.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Membrane-Bound Organelles:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Eukaryotic cells contain various membrane-bound organelles, each with specific functions. Examples include the endoplasmic reticulum, Golgi apparatus, mitochondria, chloroplasts (in plants), lysosomes, and peroxisomes.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Complex Structure:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Eukaryotic cells are typically larger and more structurally complex than prokaryotic cells. They have internal compartments and structures that allow specialized functions and cellular processes.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Cytoskeleton:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Eukaryotic cells have a network of protein filaments known as the cytoskeleton, which provides structural support, facilitates cell movement, and helps transport materials within the cell.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Mitochondria:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Eukaryotic cells contain mitochondria, which are organelles responsible for energy production through cellular respiration. Mitochondria have their DNA and replicate independently of the cell.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Endosymbiotic Theory:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Mitochondria and chloroplasts are believed to have originated from prokaryotic cells through a process called endosymbiosis. According to this theory, these organelles were once free-living bacteria that were engulfed by ancestral eukaryotic cells and formed a symbiotic relationship.</p>
                </div>

                <p className="mb-2">Eukaryotic cells are incredibly diverse and have adapted to various environments and lifestyles. They are the building blocks of complex multicellular organisms and are essential for life as we know it.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Plant Cells and Animal Cells
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">Plant cells and animal cells are both types of eukaryotic cells with many similarities, but they also have some distinct differences. Here's a comparison:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Plant Cell:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>Cell Wall:</strong> Plant cells have a rigid cell wall made of cellulose outside the cell membrane. This provides structural support and protection.</li>
                    <li><strong>Chloroplasts:</strong> Plant cells contain chloroplasts, organelles responsible for photosynthesis, which convert light energy into chemical energy (glucose).</li>
                    <li><strong>Large Central Vacuole:</strong> Plant cells typically have a large central vacuole that stores water, nutrients, and waste products. It helps maintain cell turgidity and regulates cell volume.</li>
                    <li><strong>Plastids:</strong> Besides chloroplasts, plant cells may contain other types of plastids, such as chloroplasts (for pigment storage) and amyloplasts (for starch storage).</li>
                    <li><strong>No Centrioles:</strong> Plant cells usually lack centrioles, which are involved in cell division in animal cells.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Animal Cell:</h4>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li><strong>No Cell Wall:</strong> Animal cells do not have a cell wall. Instead, they are surrounded by a flexible cell membrane.</li>
                    <li><strong>No chloroplasts:</strong> Animal cells do not contain chloroplasts or other organelles involved in photosynthesis.</li>
                    <li><strong>Small Vacuoles:</strong> Animal cells may have small vacuoles, but they are not as prominent as those in plant cells.</li>
                    <li><strong>Centrioles:</strong> Animal cells contain centrioles, which are involved in organizing microtubules during cell division (mitosis).</li>
                    <li><strong>Lysosomes:</strong> Animal cells typically contain lysosomes, organelles that contain digestive enzymes and break down waste materials and cellular debris.</li>
                    <li><strong>Shape:</strong> Animal cells often have a more varied shape, depending on their function and location in the body.</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Different Types of Cells
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">Cells are the basic structural and functional units of life, and they come in various types, each specialized for specific functions. Here are some of the different types of cells found in multicellular organisms:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Epithelial Cells:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Epithelial cells form protective barriers on the surfaces of organs and tissues. They line the skin, respiratory tract, gastrointestinal tract, and blood vessels. Different types of epithelial cells include squamous (flat), cuboidal (cube-shaped), and columnar (elongated) epithelial cells, each adapted to their respective functions.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Muscle Cells:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Muscle cells, also known as myocytes, are specialized for contraction, and movement. There are three main types of muscle cells:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>A. Skeletal muscle cells:</strong> responsible for voluntary movements of the body.</li>
                    <li><strong>B. Cardiac muscle cells</strong> are found in the heart and are responsible for pumping blood.</li>
                    <li><strong>C. Smooth muscle cells</strong> are found in the walls of organs and blood vessels, controlling involuntary movements like peristalsis and vasoconstriction.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Nerve cells (neurons):</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Neurons are specialized cells that transmit electrical impulses and carry information throughout the nervous system. They consist of three main parts:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>A. Dendrites:</strong> Receive signals from other neurons or sensory receptors.</li>
                    <li><strong>B. Cell body (soma):</strong> contains the nucleus and other organelles.</li>
                    <li><strong>C. Axon:</strong> transmits signals away from the cell body to other neurons, muscles, or glands.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Blood Cells:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Blood cells are responsible for transporting oxygen, nutrients, hormones, and waste products throughout the body. The main types of blood cells include:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li><strong>Red blood cells (erythrocytes)</strong> carry oxygen from the lungs to tissues and remove carbon dioxide.</li>
                    <li><strong>White blood cells (leukocytes):</strong> play a role in the immune response, defending the body against pathogens and foreign invaders.</li>
                    <li><strong>Platelets (thrombocytes):</strong> assist in blood clotting and wound healing.</li>
                  </ul>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Adipocytes (fat cells):</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Adipocytes store energy in the form of fat and regulate energy balance in the body. They also provide insulation and cushioning for the organs.</p>
                </div>

                <p className="mb-2">These are just a few examples of the many types of cells found in multicellular organisms, each with unique structures and functions essential for the organism's survival and proper functioning.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Different Types of Organ Systems
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">There are several organ systems in the human body, each composed of multiple organs working together to perform specific functions necessary for the survival and well-being of the organism. Here are some of the main organ systems:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Nervous System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of the brain, spinal cord, and nerves. Responsible for transmitting signals and coordinating the body's responses to stimuli, including sensory perception, motor control, and cognition.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Digestive System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of the mouth, esophagus, stomach, intestines, liver, gallbladder, and pancreas. Responsible for ingesting, breaking down, and absorbing nutrients from food, as well as eliminating waste.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Respiratory System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of the nose, trachea, bronchi, and lungs.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Circulatory System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of the heart, blood vessels (arteries, veins, and capillaries), and blood. Responsible for circulating oxygen, nutrients, hormones, and waste products throughout the body and regulating body temperature.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Musculoskeletal System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of bones, muscles, ligaments, and tendons. Responsible for providing structural support, facilitating movement, and protecting internal organs.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Urinary System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of the kidneys, ureters, bladder, and urethra. Responsible for filtering waste products from the blood, regulating fluid balance, and maintaining electrolyte concentrations.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Reproductive System:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Composed of organs involved in reproduction, such as the ovaries, testes, uterus, and accessory glands. Responsible for producing gametes (sperm and eggs), facilitating fertilization, and supporting the development and birth of offspring.</p>
                </div>

                <p className="mb-2">These organ systems work together to maintain homeostasis, support growth and development, and ensure the overall health and functioning of the human body.</p>
              </div>
            </div>
            </>
          ) : isControlCoordinationLesson ? (
            // Control and Coordination Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                10. CONTROL AND COORDINATION
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Nervous system: the nervous system includes the brain, spinal cord, sense organs, and nerves. The sense organs receive the stimulus, and this stimulus, with the help of sensory nerves, reaches the brain and spinal cord. This information will be sent to different organs by motor nerves for action.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Structure of Nerve Cells
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">To know the function of nerve cells, let us observe the structure of nerve cells. Every nerve cell consists of 3 parts:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Cyton</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The cell body contains a well-defined nucleus, surrounded by cytoplasm. It has cell organelles like any other cell. The cell body further transmits the impulse to the axon.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Dendrites</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">These are branched projections from the cell body. The dendric tip of the nerve cells receives impulses and sets off a chemical reaction that creates more electrical impulses, which are further transmitted to the cell body.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Axon (cell body)</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The longest branch arising out of the cell body is called the axon (or) nerve fibre. The axon is surrounded by a specialized fatty sheath called the myelin sheath. The nerve cell containing the myelin sheath is called the myelinated nerve cell. The myelin sheath is interrupted at regular intervals, called nodes of Ranvier. A nerve cell not having a myelin sheath is called a non-myelinated nerve cell. The myelin sheath separates the one axon from the adjacent axon. The information from one nerve cell to another will be passed through a synapse.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Synapse
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Synapses are mainly found in the brain, spinal cord, and around the spinal cord. Beyond these areas, the axon carries the signals to the respective areas of our body. In this way, based on the ways of carrying messages, nerves are divided into three types.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Types of Nerves
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">Based on their function, nerves are divided into three types:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Sensory nerves (afferent nerves)</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Sensory nerves contain sensory fibres. Sensory nerves are also called afferent nerves. They carry the impulse from receptors (sense organs) to the central nervous system (brain and spinal cord).</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Motor nerves (efferent nerves)</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Motor nerves contain motor fibres. The motor nerve is also called the efferent nerve. They carry impulses from the central nervous system to different body parts.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Mixed nerves</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">These nerves contain both sensory and motor fibres and perform the functions of both sensory and motor nerves.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Sense Organs
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">A receptor (or sense organ) is a group of highly specialized cells. Receptors help sensory nerves collect information from sensory organs. The sense organs that are present in our body—the eye, ear, nose, tongue, and skin—receive the stimulus. The stimulus then reaches the spinal cord and the brain through sensory nerves, where it is integrated. The message is then sent by motor nerves to the required organ (muscle or gland) for suitable action. In this way, a response is generated.</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Human eye</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Acts as a photographic camera in which the conjunctiva, cornea, lenses, and humor refract the light rays to focus on the retina of the eye. Photoreceptors are stimulated, which change usual stimuli into nerve impulses, which are carried by the nerve fibres of the optic nerves to the visual area of the cerebrum, which interprets these impulses and initiates the proper response by which we can see.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Ear</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The receptors present in the ear detect sound stimuli. Nerve impulses from the ear are carried to auditors of the cerebrum by auditory nerves, thus we can hear.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Tongue</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Once the food enters the mouth, we grind and chew it. As a result, the chemicals released from the food stimulate the taste buds. Each taste bud is composed of a larger cluster of taste cells. Each taste cell is a chemoreceptor and detects the chemicals in food and initiates nerve impulses, which are carried by the nerves to the taste area of the brain to interpret the message. Thus, we can taste the food.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Nose</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The upper part of the nasal chamber has olfactory cells. These cells detect the chemical stimuli, convert them into nerve impulses, and send these impulses to an olfactory area of the brain through the olfactory nerve, thus knowing the smell.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Skin</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Skin is sensitive to touch, temperature, and pressure. The skin contains tactile receptors for touch. These receptors create a sense of touch. This message is passed on to the brain through sensory nerves. Due to this, we can feel a sense of touch, whether cold or hot.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Central Nervous System
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The Central Nervous System consists of the brain and spinal cord.</p>
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Brain</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Observe the figure of the human brain. The brain is a soft structure present inside the cranium of the skull. It is protected by three layers. The fluid present in between these layers is called cerebrospinal fluid. This fluid protects the brain from the shocks.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Peripheral Nervous System
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">As shown in the figure, the nerves attached to the spinal cord have two types of connections (or roots), one to the back or dorsal side and the other to the front or ventral side of the cord. The dorsal root carries messages of sensation inward, while the ventral pathway carries outward the instructions for muscular contraction. The peripheral nervous system is a vast system of the dorsal and ventral root spinal and cranial nerves that are linked to the brain and spinal cord on one end and muscles on the other. In our body, 12 pairs of cranial nerves arise from the brain, and 31 pairs of spinal nerves arise from the spinal cord.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Autonomous Nervous System
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The peripheral nervous system involuntarily controls several functions of regions like our internal organs (for example, blood vessels), so it is called the autonomous nervous system. It has voluntary control of the muscles of some areas of the skin and the skeletal muscles.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Plant Responses to Hormones and Their Application in Plant Propagation
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Auxins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Auxins are a group of related molecules that are involved in almost every aspect of the plant's life cycle. Auxins stimulate growth through cell elongation, which is integral to the plant's responses to environmental changes. Auxins are responsible for two types of growth responses Phototropism, the bending or growth of a shoot toward light, and Gravitropism, a change in growth occurring after a change in gravitational force.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Cytokinins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Like auxins, cytokinins are a group of related molecules that regulate growth and development. However, the plant's response to cytokinins is very different from its auxin response. Cytokinins come from the word cytokinesis, which means cell division. You will learn about cytokinesis, specifically mitosis. Cytokinins promote cell division, where one cell splits and two new daughter cells are formed. Cytokinins are important regulators of plant growth and development.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Gibberellins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Gibberellins, or gibberellin acid (GA), are a group of over 100 molecules that are primary regulators of stem elongation and seed germination. They were discovered during research on the cause of the "foolish seedling" disease of rice. The disease, characterized by tall plants with little grain, is caused by an infection with Gibberellin Fujikura, a parasitic fungus that produces GA in the rice shoots, causing increased stem elongation.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Abscisic acid:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">While GA facilitates seed germination, abscisic acid (ABA) inhibits it.</p>
                </div>
              </div>
            </div>
            </>
          ) : isEcosystemLesson ? (
            // Ecosystem Around Us Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                11. ECOSYSTEM AROUND US
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Environment refers to the environment in which an organism thrives. It constitutes both living and non-living things, i.e., physical, chemical, and biotic factors. In this chapter, we will learn about various components of the environment, their interactions, and how our activities affect the environment.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Ecosystem
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The ecosystem comprises all the biotic and abiotic factors interacting with one another in a given area. Biotic components include all living organisms such as plants, animals, microorganisms, humans, etc., and abiotic components include sunlight, temperature, air, wind, rainfall, soil, minerals, etc. E.g., pond ecosystem, grassland ecosystem, etc.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Saprophytes and Decomposers
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Saprophytes:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Saprophytes feed on dead and decaying material, e.g., fungi and microorganisms. They absorb nutrients from dead and decaying plants and animal parts.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Decomposers:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Decomposers break down the organic matter or waste material and release nutrients into the soil. For example, bacteria, worms, slugs, and snails. They are considered extremely important in soil biology. They break down the complex organic matter into simpler substances that are taken up by the plants for various metabolic activities.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Components of Ecosystem
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Abiotic components:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Non-living chemical and physical components of the environment, like the soil, air, water, temperature, etc.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Biotic components:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Living organisms of the environment, like plants, animals, microbes, and fungi.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Biotic and Abiotic Trophic Levels
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">It refers to the various levels in a food web as per the flow of energy. The different trophic levels are:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">What do you understand by trophic level?</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The pyramid of trophic levels is a graphical representation. It can be the pyramid of numbers, the pyramid of biomass, or the pyramid of energy. All the pyramids start with producers.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">a) Pyramid of numbers:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Gives the number of organisms present at each trophic level. It can be upright or inverted.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">b) Pyramid of biomass:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Gives the biomass of each trophic level and could be upright or inverted.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">c) The pyramid of energy:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Is always upright, as it shows the flow of energy from one trophic level to the next trophic level.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                The Law of Conservation of Energy
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Energy can neither be created nor destroyed; rather, it transforms from one form to another. In biological systems, it gets passed from one organism to another across trophic levels.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Energy Flow
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Transfer of energy from one trophic level to another, depicting its direction and amount. Can be represented by the pyramid of energy. In any food chain, only 10% of the energy is transferred from one trophic level to another.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Food Chain and Food Web
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The food chain is a series of organisms, each dependent on the next as a source of food. The food web is formed by the interconnections of different food chains. Is a graphical representation of 'Who eats whom' in an ecosystem.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Characteristics of Ecosystems
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <ul className="list-disc list-inside space-y-1.5 ml-4 text-gray-600">
                  <li>Includes a summary of trophic levels.</li>
                  <li>Their energy flow and pyramids.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Environment
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <ul className="list-disc list-inside space-y-1.5 ml-4 text-gray-600">
                  <li>Includes all living and nonliving things.</li>
                  <li>Unlike ecosystems, there need not be any necessary interaction between them.</li>
                </ul>
              </div>
            </div>
            </>
          ) : isEvolutionHeredityLesson ? (
            // Evolution and Heredity Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                12. EVOLUTION AND HEREDITY
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Heredity refers to the passing of characteristics from one generation to the next. Evolution is defined as the gradual process by which a simple life form leads to the development of complex organisms over some time, spanning several generations.</p>
                <p className="mb-4">Here in this chapter, we will learn about the mechanism by which variations are created, the rules of heredity determining their pattern of inheritance, and how the accumulation of these variations leads to evolution.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Heredity
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The transfer of traits from one generation to the next is termed heredity. Genes are the functional units of heredity that transfer characteristics from parents to offspring. Genes are short stretches of DNA that code for a specific protein, or RNA.</p>
                <p className="mb-2">Genetics is the branch of biology that deals with the study of genes, heredity, and variations.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Sexual Reproduction
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The mode of reproduction involves two individuals, one male and one female. They produce sex cells, or gametes, which fuse to form a new organism.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Genes
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The gene is the functional unit of heredity. Every gene controls one or several particular characteristic features in living organs.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Mendel's Work
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Gregor Johann Mendel, known as the 'Father of Genetics', was an Austrian monk who worked on pea plants to understand the concept of heredity. His work laid the foundation of modern genetics. He made three basic laws of inheritance: the Law of Dominance, the Law of Segregation, and the Law of Independent Assortment.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Dominant and Recessive Traits
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Dominant Traits</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The traits that express themselves in an organism in every possible combination and can be seen are called dominant traits. In Mendel's experiment, we see that the tall trait in pea plants tends to express more than the short trait.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Recessive Traits</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The traits that remain hidden in the organism in the presence of a dominant trait are called recessive traits. In Mendel's experiment, the short trait in peas is recessive.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Genotype and Phenotype
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The genetic constitution of an organism is called its genotype. The appearance of the organism is called its phenotype.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Evolution
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Evolution is the sequence of gradual changes that take place in primitive organisms over millions of years to form new species.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Speciation
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Formation of new species from pre-existing species is called speciation.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Natural Selection
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">It is a process through which organisms better adapted to their environment survive and produce more offspring.</p>
                </div>
              </div>
            </>
          ) : isControlCoordinationLesson ? (
            // Control and Coordination Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                10. CONTROL AND COORDINATION
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Nervous system: the nervous system includes the brain, spinal cord, sense organs, and nerves. The sense organs receive the stimulus, and this stimulus, with the help of sensory nerves, reaches the brain and spinal cord. This information will be sent to different organs by motor nerves for action.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Structure of Nerve Cells
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">To know the function of nerve cells, let us observe the structure of nerve cells. Every nerve cell consists of 3 parts:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Cyton</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The cell body contains a well-defined nucleus, surrounded by cytoplasm. It has cell organelles like any other cell. The cell body further transmits the impulse to the axon.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Dendrites</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">These are branched projections from the cell body. The dendric tip of the nerve cells receives impulses and sets off a chemical reaction that creates more electrical impulses, which are further transmitted to the cell body.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Axon (cell body)</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The longest branch arising out of the cell body is called the axon (or) nerve fibre. The axon is surrounded by a specialized fatty sheath called the myelin sheath. The nerve cell containing the myelin sheath is called the myelinated nerve cell. The myelin sheath is interrupted at regular intervals, called nodes of Ranvier. A nerve cell not having a myelin sheath is called a non-myelinated nerve cell. The myelin sheath separates the one axon from the adjacent axon. The information from one nerve cell to another will be passed through a synapse.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Synapse
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Synapses are mainly found in the brain, spinal cord, and around the spinal cord. Beyond these areas, the axon carries the signals to the respective areas of our body. In this way, based on the ways of carrying messages, nerves are divided into three types.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Types of Nerves
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">Based on their function, nerves are divided into three types:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Sensory nerves (afferent nerves)</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Sensory nerves contain sensory fibres. Sensory nerves are also called afferent nerves. They carry the impulse from receptors (sense organs) to the central nervous system (brain and spinal cord).</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Motor nerves (efferent nerves)</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Motor nerves contain motor fibres. The motor nerve is also called the efferent nerve. They carry impulses from the central nervous system to different body parts.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Mixed nerves</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">These nerves contain both sensory and motor fibres and perform the functions of both sensory and motor nerves.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Sense Organs
              </h3>
              
              <div className="space-y-6 text-stone-700 leading-relaxed" style={{ fontFamily: 'system-ui, -apple-system, sans-serif', fontSize: '1.2rem' }}>
                <p className="mb-4">A receptor (or sense organ) is a group of highly specialized cells. Receptors help sensory nerves collect information from sensory organs. The sense organs that are present in our body—the eye, ear, nose, tongue, and skin—receive the stimulus. The stimulus then reaches the spinal cord and the brain through sensory nerves, where it is integrated. The message is then sent by motor nerves to the required organ (muscle or gland) for suitable action. In this way, a response is generated.</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Human eye</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Acts as a photographic camera in which the conjunctiva, cornea, lenses, and humor refract the light rays to focus on the retina of the eye. Photoreceptors are stimulated, which change usual stimuli into nerve impulses, which are carried by the nerve fibres of the optic nerves to the visual area of the cerebrum, which interprets these impulses and initiates the proper response by which we can see.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Ear</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The receptors present in the ear detect sound stimuli. Nerve impulses from the ear are carried to auditors of the cerebrum by auditory nerves, thus we can hear.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Tongue</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Once the food enters the mouth, we grind and chew it. As a result, the chemicals released from the food stimulate the taste buds. Each taste bud is composed of a larger cluster of taste cells. Each taste cell is a chemoreceptor and detects the chemicals in food and initiates nerve impulses, which are carried by the nerves to the taste area of the brain to interpret the message. Thus, we can taste the food.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Nose</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The upper part of the nasal chamber has olfactory cells. These cells detect the chemical stimuli, convert them into nerve impulses, and send these impulses to an olfactory area of the brain through the olfactory nerve, thus knowing the smell.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Skin</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Skin is sensitive to touch, temperature, and pressure. The skin contains tactile receptors for touch. These receptors create a sense of touch. This message is passed on to the brain through sensory nerves. Due to this, we can feel a sense of touch, whether cold or hot.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Central Nervous System
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The Central Nervous System consists of the brain and spinal cord.</p>
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Brain</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Observe the figure of the human brain. The brain is a soft structure present inside the cranium of the skull. It is protected by three layers. The fluid present in between these layers is called cerebrospinal fluid. This fluid protects the brain from the shocks.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Peripheral Nervous System
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">As shown in the figure, the nerves attached to the spinal cord have two types of connections (or roots), one to the back or dorsal side and the other to the front or ventral side of the cord. The dorsal root carries messages of sensation inward, while the ventral pathway carries outward the instructions for muscular contraction. The peripheral nervous system is a vast system of the dorsal and ventral root spinal and cranial nerves that are linked to the brain and spinal cord on one end and muscles on the other. In our body, 12 pairs of cranial nerves arise from the brain, and 31 pairs of spinal nerves arise from the spinal cord.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Autonomous Nervous System
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The peripheral nervous system involuntarily controls several functions of regions like our internal organs (for example, blood vessels), so it is called the autonomous nervous system. It has voluntary control of the muscles of some areas of the skin and the skeletal muscles.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Plant Responses to Hormones and Their Application in Plant Propagation
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Auxins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Auxins are a group of related molecules that are involved in almost every aspect of the plant's life cycle. Auxins stimulate growth through cell elongation, which is integral to the plant's responses to environmental changes. Auxins are responsible for two types of growth responses Phototropism, the bending or growth of a shoot toward light, and Gravitropism, a change in growth occurring after a change in gravitational force.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Cytokinins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Like auxins, cytokinins are a group of related molecules that regulate growth and development. However, the plant's response to cytokinins is very different from its auxin response. Cytokinins come from the word cytokinesis, which means cell division. You will learn about cytokinesis, specifically mitosis. Cytokinins promote cell division, where one cell splits and two new daughter cells are formed. Cytokinins are important regulators of plant growth and development.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Gibberellins:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Gibberellins, or gibberellin acid (GA), are a group of over 100 molecules that are primary regulators of stem elongation and seed germination. They were discovered during research on the cause of the "foolish seedling" disease of rice. The disease, characterized by tall plants with little grain, is caused by an infection with Gibberellin Fujikura, a parasitic fungus that produces GA in the rice shoots, causing increased stem elongation.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Abscisic acid:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">While GA facilitates seed germination, abscisic acid (ABA) inhibits it.</p>
                </div>
              </div>
            </div>
            </>
          ) : isEcosystemLesson ? (
            // Ecosystem Around Us Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                11. ECOSYSTEM AROUND US
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Environment refers to the environment in which an organism thrives. It constitutes both living and non-living things, i.e., physical, chemical, and biotic factors. In this chapter, we will learn about various components of the environment, their interactions, and how our activities affect the environment.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Ecosystem
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The ecosystem comprises all the biotic and abiotic factors interacting with one another in a given area. Biotic components include all living organisms such as plants, animals, microorganisms, humans, etc., and abiotic components include sunlight, temperature, air, wind, rainfall, soil, minerals, etc. E.g., pond ecosystem, grassland ecosystem, etc.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Saprophytes and Decomposers
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Saprophytes:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Saprophytes feed on dead and decaying material, e.g., fungi and microorganisms. They absorb nutrients from dead and decaying plants and animal parts.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Decomposers:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Decomposers break down the organic matter or waste material and release nutrients into the soil. For example, bacteria, worms, slugs, and snails. They are considered extremely important in soil biology. They break down the complex organic matter into simpler substances that are taken up by the plants for various metabolic activities.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Components of Ecosystem
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Abiotic components:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Non-living chemical and physical components of the environment, like the soil, air, water, temperature, etc.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Biotic components:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Living organisms of the environment, like plants, animals, microbes, and fungi.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Biotic and Abiotic Trophic Levels
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">It refers to the various levels in a food web as per the flow of energy. The different trophic levels are:</p>
                
                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">What do you understand by trophic level?</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The pyramid of trophic levels is a graphical representation. It can be the pyramid of numbers, the pyramid of biomass, or the pyramid of energy. All the pyramids start with producers.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">a) Pyramid of numbers:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Gives the number of organisms present at each trophic level. It can be upright or inverted.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">b) Pyramid of biomass:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Gives the biomass of each trophic level and could be upright or inverted.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">c) The pyramid of energy:</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">Is always upright, as it shows the flow of energy from one trophic level to the next trophic level.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                The Law of Conservation of Energy
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Energy can neither be created nor destroyed; rather, it transforms from one form to another. In biological systems, it gets passed from one organism to another across trophic levels.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Energy Flow
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Transfer of energy from one trophic level to another, depicting its direction and amount. Can be represented by the pyramid of energy. In any food chain, only 10% of the energy is transferred from one trophic level to another.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Food Chain and Food Web
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The food chain is a series of organisms, each dependent on the next as a source of food. The food web is formed by the interconnections of different food chains. Is a graphical representation of 'Who eats whom' in an ecosystem.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Characteristics of Ecosystems
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <ul className="list-disc list-inside space-y-1.5 ml-4 text-gray-600">
                  <li>Includes a summary of trophic levels.</li>
                  <li>Their energy flow and pyramids.</li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Environment
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <ul className="list-disc list-inside space-y-1.5 ml-4 text-gray-600">
                  <li>Includes all living and nonliving things.</li>
                  <li>Unlike ecosystems, there need not be any necessary interaction between them.</li>
                </ul>
              </div>
            </div>
            </>
          ) : isEvolutionHeredityLesson ? (
            // Evolution and Heredity Content
            <>
            <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                12. EVOLUTION AND HEREDITY
              </h2>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <p className="mb-3 text-gray-600">Heredity refers to the passing of characteristics from one generation to the next. Evolution is defined as the gradual process by which a simple life form leads to the development of complex organisms over some time, spanning several generations.</p>
                <p className="mb-4">Here in this chapter, we will learn about the mechanism by which variations are created, the rules of heredity determining their pattern of inheritance, and how the accumulation of these variations leads to evolution.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Heredity
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The transfer of traits from one generation to the next is termed heredity. Genes are the functional units of heredity that transfer characteristics from parents to offspring. Genes are short stretches of DNA that code for a specific protein, or RNA.</p>
                <p className="mb-2">Genetics is the branch of biology that deals with the study of genes, heredity, and variations.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Sexual Reproduction
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The mode of reproduction involves two individuals, one male and one female. They produce sex cells, or gametes, which fuse to form a new organism.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Genes
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The gene is the functional unit of heredity. Every gene controls one or several particular characteristic features in living organs.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Mendel's Work
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Gregor Johann Mendel, known as the 'Father of Genetics', was an Austrian monk who worked on pea plants to understand the concept of heredity. His work laid the foundation of modern genetics. He made three basic laws of inheritance: the Law of Dominance, the Law of Segregation, and the Law of Independent Assortment.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Dominant and Recessive Traits
              </h3>
              
              <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                  <h4 className="text-sm font-bold text-blue-700 mb-2">Dominant Traits</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The traits that express themselves in an organism in every possible combination and can be seen are called dominant traits. In Mendel's experiment, we see that the tall trait in pea plants tends to express more than the short trait.</p>
                </div>

                <div className="bg-stone-50 rounded-lg p-5 border-l-4 border-amber-400">
                  <h4 className="text-xl font-semibold text-amber-800 mb-3">Recessive Traits</h4>
                  <p className="text-gray-700 text-sm leading-relaxed mb-2">The traits that remain hidden in the organism in the presence of a dominant trait are called recessive traits. In Mendel's experiment, the short trait in peas is recessive.</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Genotype and Phenotype
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">The genetic constitution of an organism is called its genotype. The appearance of the organism is called its phenotype.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Evolution
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Evolution is the sequence of gradual changes that take place in primitive organisms over millions of years to form new species.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Speciation
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">Formation of new species from pre-existing species is called speciation.</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
              <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                Natural Selection
              </h3>
              
              <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                <p className="text-gray-600 mb-2">It is a process through which organisms better adapted to their environment survive and produce more offspring.</p>
              </div>
            </div>
            </>
          ) : (
            // Food Components Content (default for lesson 1) or other lessons
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-orange-200">
                  {activeLesson ? activeLesson.title : '1. FOOD COMPONENTS'}
                </h2>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  {activeLesson && activeLesson.content ? (
                    <div className="prose prose-stone max-w-none">
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {activeLesson.content.split('\n\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-4 last:mb-0 text-gray-600 leading-6">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
              </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-yellow-700 font-bold">Carbohydrates</strong> are nutrients that provide <span className="font-semibold text-orange-600">energy</span> to the body. They include <span className="font-semibold text-yellow-600">sugars</span>, <span className="font-semibold text-amber-600">starches</span>, and <span className="font-semibold text-orange-600">fibre</span>.</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-blue-700 font-bold">Proteins</strong> are essential nutrients that are important for <span className="font-semibold text-green-600">building</span> and <span className="font-semibold text-purple-600">repairing tissues</span> and for various <span className="font-semibold text-cyan-600">metabolic functions</span> in the body.</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-pink-700 font-bold">Fats</strong> are concentrated <span className="font-semibold text-orange-600">energy sources</span> necessary for proper <span className="font-semibold text-blue-600">cell function</span> and <span className="font-semibold text-purple-600">hormone production</span>.</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-green-700 font-bold">Vitamins</strong> are <span className="font-semibold text-blue-600">organic compounds</span> essential for various <span className="font-semibold text-purple-600">metabolic processes</span> in the body, such as <span className="font-semibold text-green-600">growth</span>, <span className="font-semibold text-cyan-600">development</span>, and <span className="font-semibold text-pink-600">immunity</span>.</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-purple-700 font-bold">Minerals</strong> are <span className="font-semibold text-blue-600">inorganic nutrients</span> important for various bodily functions, including <span className="font-semibold text-amber-600">bone health</span>, <span className="font-semibold text-red-600">muscle function</span>, and <span className="font-semibold text-cyan-600">nerve transmission</span>.</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-teal-700 font-bold">Fibre</strong> is a type of <span className="font-semibold text-yellow-600">carbohydrate</span> that the body cannot digest but is important for <span className="font-semibold text-green-600">digestive health</span> and regulating <span className="font-semibold text-blue-600">bowel movements</span>.</p>
                      </div>
                      
                      <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                        <p className="text-gray-700 text-sm leading-relaxed"><strong className="text-cyan-700 font-bold">Water</strong> is vital for life; it is essential for various bodily functions, including <span className="font-semibold text-blue-600">hydration</span>, <span className="font-semibold text-orange-600">temperature regulation</span>, and <span className="font-semibold text-green-600">nutrition</span>.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {!activeLesson?.content && (
                <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                  <h2 className="text-xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
                    MALNUTRITIONAL DISEASES
                  </h2>
                  
                  <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                    <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                      <h3 className="text-base font-bold text-red-700 mb-2">Marasmus:</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">This is due to a deficiency of both <span className="font-semibold text-blue-600">proteins</span> and <span className="font-semibold text-yellow-600">carbohydrates</span>. <span className="font-semibold text-gray-600">Lean and weak muscles</span>, <span className="font-semibold text-amber-600">less developed muscles</span>, <span className="font-semibold text-orange-600">dry skin</span>, <span className="font-semibold text-red-600">diarrhea</span>, etc. are the symptoms of the disease.</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                      <h3 className="text-base font-bold text-orange-700 mb-2">Kwashiorkor:</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">This is due to a <span className="font-semibold text-blue-600">protein deficiency</span> in the diet. <span className="font-semibold text-pink-600">Body parts become swollen</span>. Very poor <span className="font-semibold text-red-600">muscle development</span>, a <span className="font-semibold text-yellow-600">fluffy face</span>, a <span className="font-semibold text-amber-600">bulging abdomen</span>, <span className="font-semibold text-red-600">diarrhea</span>, and <span className="font-semibold text-orange-600">dry skin</span> are the symptoms of the disease.</p>
                    </div>
                    
                    <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                      <h3 className="text-base font-bold text-amber-700 mb-2">Goitre:</h3>
                      <p className="text-gray-700 text-sm leading-relaxed">Caused by prolonged <span className="font-semibold text-purple-600">iodine deficiency</span>, which causes <span className="font-semibold text-red-600">thyroid gland enlargement</span>. Taking <span className="font-semibold text-blue-600">iodized salt</span> and <span className="font-semibold text-cyan-600">seafood</span>, which are good sources of <span className="font-semibold text-purple-600">iodine</span>, can prevent goitre.</p>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    
    // For Physics, show the overview content based on selected lesson
    if (activeSubjectId === 'physics') {
      // Get lesson index for additional matching
      const lessonIndex = activeLessons.findIndex(l => l.id === activeLessonId);
      
      const isReflectionLesson = activeLessonId === 'physics-lesson-1' || lessonIndex === 0 || (activeLesson && (activeLesson.title === 'Reflection of Light' || activeLesson.title === 'REFLECTION OF LIGHT' || activeLesson.title === 'Reflection of light' || activeLesson.title.toLowerCase().includes('reflection')));
      const isMotionLesson = activeLessonId === 'physics-lesson-2' || lessonIndex === 1 || (activeLesson && (activeLesson.title === 'Motion and Its Description' || activeLesson.title === 'MOTION AND ITS DESCRIPTION' || activeLesson.title === 'Motion & Its Description' || activeLesson.title === 'Motion & its Description' || (activeLesson.title.toLowerCase().includes('motion') && activeLesson.title.toLowerCase().includes('description'))));
      const isForceMotionLesson = activeLessonId === 'physics-lesson-3' || lessonIndex === 2 || activeLessonId?.includes('physics-lesson-3') || (activeLesson && (activeLesson.title === 'Force and Motion' || activeLesson.title === 'FORCE AND MOTION' || activeLesson.title === 'Force And Motion' || activeLesson.title === 'Force-Motion' || activeLesson.title === 'FORCE-MOTION' || activeLesson.title === 'Force Motion' || activeLesson.title.toLowerCase().includes('force-motion') || (activeLesson.title.toLowerCase().includes('force') && activeLesson.title.toLowerCase().includes('motion'))));
      const isThermalEnergyLesson = activeLessonId === 'physics-lesson-4' || lessonIndex === 3 || (activeLesson && (activeLesson.title === 'Thermal Energy' || activeLesson.title === 'THERMAL ENERGY' || activeLesson.title.includes('Thermal')));
      const isSoundLesson = activeLessonId === 'physics-lesson-5' || lessonIndex === 4 || (activeLesson && (activeLesson.title === 'Sound' || activeLesson.title === 'SOUND' || activeLesson.title.includes('Sound')));
      const isElectricEnergyLesson = activeLessonId === 'physics-lesson-6' || lessonIndex === 5 || (activeLesson && (activeLesson.title === 'Electric Energy' || activeLesson.title === 'ELECTRIC ENERGY' || activeLesson.title === 'Electric energy' || activeLesson.title.toLowerCase().includes('electric') && activeLesson.title.toLowerCase().includes('energy')));
      
      return (
        <div className="space-y-0 -mt-2">
          <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 rounded-t-xl rounded-b-none p-3 border-t border-l border-r border-sky-200/50 border-b-0 shadow-md overflow-hidden mb-0 pb-0">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-sky-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-row items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-sky-400 to-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                <SubjectIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-sky-900 leading-tight">{activeSubject.name}</h1>
                {activeLesson && (
                  <p className="text-sm text-stone-600 mt-1">
                    {activeLesson.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isReflectionLesson ? (
            // Reflection of Light Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-yellow-200">
                  1. REFLECTION OF LIGHT
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Reflection of light is the process where <span className="font-semibold text-yellow-600">light bounces off a surface</span>. When light encounters a <span className="font-semibold text-amber-600">smooth and shiny surface</span>, such as a <span className="font-semibold text-orange-600">mirror</span> or a <span className="font-semibold text-blue-600">still body of water</span>, it reflects off at the same angle it hits the surface, obeying the <span className="font-semibold text-purple-600">law of reflection</span>. This law states that the <span className="font-semibold text-cyan-600">angle of incidence</span> (the angle between the incident ray and the normal, or perpendicular line to the surface) is equal to the <span className="font-semibold text-indigo-600">angle of reflection</span> (the angle between the reflected ray and the normal).</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Reflection is responsible for many everyday phenomena, such as <span className="font-semibold text-blue-600">seeing your reflection in a mirror</span>, the <span className="font-semibold text-yellow-600">visibility of objects</span> due to sunlight reflecting off them, and the <span className="font-semibold text-purple-600">formation of images</span> in optical devices like <span className="font-semibold text-cyan-600">telescopes</span> and <span className="font-semibold text-indigo-600">microscopes</span>. It's also fundamental in the study of <span className="font-semibold text-green-600">optics</span> and plays a crucial role in technologies like <span className="font-semibold text-red-600">lasers</span>, <span className="font-semibold text-pink-600">fiber optics</span>, and <span className="font-semibold text-orange-600">reflective coatings</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-yellow-200">
                  Light
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-yellow-700">(i)</span> Light is the form of <span className="font-semibold text-orange-600">energy</span>, and its speed in a <span className="font-semibold text-blue-600">vacuum</span> is <span className="font-semibold text-red-600">3×10⁸ m/s</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-700">(ii)</span> It helps us to <span className="font-semibold text-cyan-600">see the objects</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-700">(iii)</span> It helps <span className="font-semibold text-green-600">plants produce food</span> with the help of <span className="font-semibold text-emerald-600">photosynthesis</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">(iv)</span> The path light travels is called a <span className="font-semibold text-indigo-600">ray of light</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Reflection of light
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">The <span className="font-semibold text-blue-600">bouncing back of light rays</span> after hitting any surface is called the <span className="font-semibold text-cyan-600">reflection of light</span>.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Dispersion of light
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">The phenomenon of <span className="font-semibold text-purple-600">splitting visible light</span> into its <span className="font-semibold text-pink-600">component colors</span>.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Spectrum of light
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">A <span className="font-semibold text-indigo-600">band of seven colors</span> was obtained due to the <span className="font-semibold text-purple-600">dispersion of light</span>.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
                  Types of Reflection
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Regular reflection:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">When a <span className="font-semibold text-blue-600">beam of parallel light</span> is incident on a <span className="font-semibold text-cyan-600">smooth, flat surface</span>, the <span className="font-semibold text-indigo-600">reflected rays will also be parallel</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Irregular reflection:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">When a <span className="font-semibold text-blue-600">beam of parallel light rays</span> is incident on a <span className="font-semibold text-gray-600">rough surface</span>, the <span className="font-semibold text-purple-600">reflected rays scatter in different directions</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl p-5 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-slate-200">
                  Mirrors
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border-l-4 border-slate-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-slate-700">Mirror:</span> A mirror is a surface that reflects <span className="font-semibold text-blue-600">almost all incident light</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-zinc-50 rounded-lg p-4 border-l-4 border-gray-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-gray-700">Plane mirror:</span> A <span className="font-semibold text-blue-600">straight, highly polished, smooth</span>, reflecting surface.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-700">Concave mirror:</span> <span className="font-semibold text-blue-600">Spherical mirrors</span> that are <span className="font-semibold text-cyan-600">curved inward</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-700">Convex mirror:</span> The <span className="font-semibold text-blue-600">spherical mirror</span> that is <span className="font-semibold text-indigo-600">curved outward</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Definitions
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-emerald-700">Incident ray:</span> The <span className="font-semibold text-blue-600">ray of light</span> that <span className="font-semibold text-cyan-600">falls on the surface</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-700">Reflected ray:</span> The <span className="font-semibold text-blue-600">ray of light</span> <span className="font-semibold text-purple-600">bounces back</span> from the surface.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-700">Point of incidence:</span> The point where the <span className="font-semibold text-blue-600">incident ray strikes</span> the surface.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">Normal:</span> The <span className="font-semibold text-indigo-600">perpendicular line</span> drawn onto the surface at the <span className="font-semibold text-cyan-600">point of incidence</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-700">The angle of incidence:</span> The angle made by the <span className="font-semibold text-blue-600">incident ray</span> with the <span className="font-semibold text-cyan-600">normal</span> at the point of incidence.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">The angle of reflection:</span> The angle made by the <span className="font-semibold text-blue-600">reflected ray</span> with the <span className="font-semibold text-cyan-600">normal</span> at the point of incidence.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Lateral inversion
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600">The term <span className="font-semibold text-violet-600">"lateral inversion"</span> describes a picture <span className="font-semibold text-purple-600">inverted in terms of left and right</span>. In the mirror, the <span className="font-semibold text-pink-600">left-side virtual image</span> of an object is seen on the <span className="font-semibold text-fuchsia-600">right side</span>, and vice versa.</p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 rounded-2xl p-5 shadow-lg border border-rose-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-rose-200">
                  Types of Images
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Real image:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">A real image is formed by the <span className="font-semibold text-red-600">actual intersection of light rays</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Virtual image:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">A virtual image is formed by the <span className="font-semibold text-purple-600">imaginary intersection of light rays</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : isMotionLesson ? (
            // Motion and Its Description Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
                  2. MOTION AND ITS DESCRIPTION
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Motion refers to the <span className="font-semibold text-blue-600">change in position</span> of an object concerning its <span className="font-semibold text-indigo-600">surroundings over time</span>. It's a fundamental concept in physics and can be described in terms of various parameters such as <span className="font-semibold text-purple-600">distance</span>, <span className="font-semibold text-cyan-600">displacement</span>, <span className="font-semibold text-green-600">speed</span>, <span className="font-semibold text-orange-600">velocity</span>, and <span className="font-semibold text-red-600">acceleration</span>.</p>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Motion can be described using <span className="font-semibold text-blue-600">graphs</span>, <span className="font-semibold text-purple-600">equations</span>, and <span className="font-semibold text-cyan-600">mathematical formulas</span>. It's studied in various branches of physics, including <span className="font-semibold text-green-600">classical mechanics</span>, <span className="font-semibold text-indigo-600">kinematics</span>, and <span className="font-semibold text-pink-600">dynamics</span>, and applies to many real-world scenarios, from the motion of <span className="font-semibold text-yellow-600">celestial bodies in space</span> to the movement of <span className="font-semibold text-orange-600">vehicles on Earth</span>. Understanding motion allows scientists and engineers to analyze and predict the behaviour of objects and systems, leading to advancements in technology and our understanding of the universe.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Basic Concepts
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">If an object <span className="font-semibold text-blue-600">changes its position</span> to its surroundings <span className="font-semibold text-cyan-600">over time</span>, then it is said to be <span className="font-semibold text-indigo-600">in motion</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border-l-4 border-gray-500 shadow-sm">
                    <h4 className="text-base font-bold text-gray-700 mb-2">Rest:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">If an object <span className="font-semibold text-gray-600">does not change its position</span> to its surroundings <span className="font-semibold text-slate-600">with time</span>, then it is said to be <span className="font-semibold text-zinc-600">at rest</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Types of Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Translatory motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">When an object <span className="font-semibold text-purple-600">moves from one place to another</span> over a period of time, the <span className="font-semibold text-indigo-600">position of the object changes</span>; its motion is called <span className="font-semibold text-blue-600">translatory motion</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed">A vehicle is moving on the road in a <span className="font-semibold text-green-600">straight path</span>, but sometimes in a <span className="font-semibold text-cyan-600">curved path</span> as well. So, we can say that <span className="font-semibold text-blue-600">rectilinear</span> and <span className="font-semibold text-purple-600">curvilinear or circular motions</span> of an object are translatory.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Rectilinear motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-green-600">Motion in a straight line</span> is called rectilinear motion.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-emerald-700">For example:</span></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600">a <span className="font-semibold text-blue-600">man walking on the road</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">vehicles on the road</span></li>
                      <li className="text-gray-600">a <span className="font-semibold text-purple-600">march past soldiers</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Curvilinear motion or circular motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">The motion of an object <span className="font-semibold text-cyan-600">moving in a curved path</span> is called curvilinear motion.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">For example:</span></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600">the <span className="font-semibold text-yellow-600">earth's motion around the sun</span></li>
                      <li className="text-gray-600">an <span className="font-semibold text-orange-600">athlete running around a circular path</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Rotational Motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A body <span className="font-semibold text-orange-600">moving about a fixed axis</span> is called rotational motion. Rotational motion is <span className="font-semibold text-amber-600">non-uniform with a changing rate of rotation</span>. In rotatory motion, the body <span className="font-semibold text-yellow-600">rotates on its axis</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-700">For example:</span></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600">rotation of the <span className="font-semibold text-blue-600">hands of a clock</span></li>
                      <li className="text-gray-600">rotation of the <span className="font-semibold text-cyan-600">fan</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">spinning the top</span> on the ground</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Oscillatory Motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A motion that <span className="font-semibold text-pink-600">repeats itself at regular intervals of time</span> is called oscillatory motion. It is also known as <span className="font-semibold text-rose-600">periodic motion</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-pink-700">For example:</span></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600">a <span className="font-semibold text-green-600">swing in motion</span></li>
                      <li className="text-gray-600">a <span className="font-semibold text-blue-600">water wave</span></li>
                      <li className="text-gray-600">a <span className="font-semibold text-purple-600">pendulum bob</span> in a clock</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Random motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">If the motion of moving objects is <span className="font-semibold text-teal-600">not in a definite direction</span>, it is known as <span className="font-semibold text-cyan-600">random motion</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-700">For example:</span> the motion of <span className="font-semibold text-blue-600">fish in the water</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Displacement and Distance
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-base font-bold text-emerald-700 mb-2">Displacement:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-emerald-600">shortest path or shortest distance</span> between two points is called <span className="font-semibold text-teal-600">'Displacement'</span>. Displacement is the <span className="font-semibold text-cyan-600">vector quantity</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Distance:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Distance is defined as the <span className="font-semibold text-teal-600">length of the actual path</span> from the <span className="font-semibold text-cyan-600">initial position</span> to the <span className="font-semibold text-blue-600">final position</span> of an object. Distance is the <span className="font-semibold text-indigo-600">scalar quantity</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">SI Units:</span> <span className="font-semibold text-indigo-600">meter (m)</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Scalar and Vector
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-violet-700">Scalar:</span> A physical quantity that has <span className="font-semibold text-violet-600">only one magnitude</span> is a scalar.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">Vector:</span> A physical quantity that has <span className="font-semibold text-purple-600">both magnitude and direction</span> is a vector.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Scalar vs Vector Comparison
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Quantity</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Scalar</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Vector</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gradient-to-r from-violet-50 to-purple-50 hover:from-violet-100 hover:to-purple-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-violet-700">Definition</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700">A physical quantity that has <span className="font-semibold text-violet-600">only one magnitude</span>.</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700">A physical quantity that has <span className="font-semibold text-purple-600">both magnitude and direction</span>.</td>
                      </tr>
                      <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-blue-700">Examples</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">Mass</span>, <span className="font-semibold text-cyan-600">time</span>, <span className="font-semibold text-indigo-600">distance</span>, <span className="font-semibold text-purple-600">volume</span>, <span className="font-semibold text-pink-600">speed</span>, and <span className="font-semibold text-orange-600">temperature</span>.</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">Weight</span>, <span className="font-semibold text-cyan-600">velocity</span>, <span className="font-semibold text-indigo-600">displacement</span>, <span className="font-semibold text-purple-600">acceleration</span>, and <span className="font-semibold text-pink-600">momentum</span>.</td>
                      </tr>
                      <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-green-700">Quantity</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-green-600">Yes</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-green-600">Yes</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-rose-50 to-pink-50 hover:from-rose-100 hover:to-pink-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-rose-700">Direction</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-gray-600">No direction</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-rose-600">It has direction</span> and is denoted by <span className="font-semibold text-pink-600">→</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-yellow-200">
                  Speed
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-yellow-700">Speed</span> can be defined as the <span className="font-semibold text-amber-600">distance covered by an object</span> in <span className="font-semibold text-orange-600">one second</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : isForceMotionLesson ? (
            // Force and Motion Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
                  3. FORCE AND MOTION
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Force is a <span className="font-semibold text-red-600">fundamental concept in physics</span> that describes the <span className="font-semibold text-orange-600">interaction between objects</span> that results in a <span className="font-semibold text-amber-600">change in motion</span>. It can cause an object to <span className="font-semibold text-yellow-600">accelerate</span>, <span className="font-semibold text-orange-600">decelerate</span>, or <span className="font-semibold text-purple-600">change direction</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Effects on Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <p className="text-gray-600 mb-2">Forces can cause changes in the motion of objects. They can:</p>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• Cause objects to <span className="font-semibold text-green-600">accelerate</span> or <span className="font-semibold text-orange-600">decelerate</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-purple-600">Change the direction</span> of motion.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• Cause objects to <span className="font-semibold text-pink-600">deform or break</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-blue-600">Maintain the motion</span> of objects in the absence of <span className="font-semibold text-gray-600">friction</span> or other <span className="font-semibold text-indigo-600">opposing forces</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <p className="text-gray-700 text-sm leading-relaxed">Understanding force is essential for analyzing and predicting the motion of objects in various scenarios, from everyday situations like <span className="font-semibold text-blue-600">driving a car</span> to complex phenomena like the <span className="font-semibold text-purple-600">motion of planets in space</span>. It forms the basis for many branches of physics, including <span className="font-semibold text-indigo-600">mechanics</span>, <span className="font-semibold text-cyan-600">dynamics</span>, and <span className="font-semibold text-green-600">engineering</span>.</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Force
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-emerald-700">Force:</span> A <span className="font-semibold text-emerald-600">push or pull</span> acting on an object is called <span className="font-semibold text-teal-600">force</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-700">Units of force:</span> The <span className="font-semibold text-cyan-600">S.I. unit of force</span> is <span className="font-semibold text-blue-600">Newton</span>. It is denoted by <span className="font-semibold text-indigo-600">'N'</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-700">S.I.</span>, in its full form, is an <span className="font-semibold text-blue-600">international system of units</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Types of Force
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-purple-600">Contact forces</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-indigo-600">Field forces</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">Contact forces:</span> "The force that results when there is <span className="font-semibold text-blue-600">direct physical contact</span> between two interacting objects is called the <span className="font-semibold text-cyan-600">contact force</span>."</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-700">Field force:</span> The force that results when there is <span className="font-semibold text-cyan-600">no physical contact</span> between two interacting objects is called <span className="font-semibold text-teal-600">field force</span>."</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Types of Contact Force
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-green-600">Muscular force</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-emerald-600">Normal force</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-teal-600">Tension force</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-cyan-600">Friction force</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  TYPES OF CONTACT FORCE
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <h4 className="text-base font-bold text-amber-700 mb-2">Muscular force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The force that is exerted by <span className="font-semibold text-amber-600">body muscles</span> is called <span className="font-semibold text-orange-600">muscular force</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-amber-700">Example:</span> <span className="font-semibold text-green-600">Playing cricket</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Normal force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The force that a <span className="font-semibold text-orange-600">solid surface exerts</span> on any object in a <span className="font-semibold text-yellow-600">normal (perpendicular to the surface)</span> direction is called <span className="font-semibold text-amber-600">normal force</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-orange-700">Example:</span> <span className="font-semibold text-blue-600">Normal force and gravitational forces</span> acting on a body.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <h4 className="text-base font-bold text-yellow-700 mb-2">Tension force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The force exerted by a <span className="font-semibold text-yellow-600">string in the opposite direction</span> of the force acting on it. Within its <span className="font-semibold text-amber-600">elastic limit</span>, it is called <span className="font-semibold text-orange-600">tension</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-yellow-700">Example:</span> <span className="font-semibold text-cyan-600">Drawing water from a well</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <h4 className="text-base font-bold text-amber-700 mb-2">Friction force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The force that <span className="font-semibold text-amber-600">opposes the relative motion</span> of a surface in contact is called the <span className="font-semibold text-orange-600">force of friction</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-amber-700">Example:</span> When you try to <span className="font-semibold text-red-600">push a heavy rock</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Types of Field Force
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-violet-600">Magnetic force</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-purple-600">Gravitational force</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">• <span className="font-semibold text-indigo-600">Electrostatic force</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-red-50 rounded-2xl p-5 shadow-lg border border-pink-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-pink-200">
                  Types of Field Force
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Magnetic force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The force of the <span className="font-semibold text-pink-600">attraction or repulsion</span> that arises due to <span className="font-semibold text-rose-600">magnets</span> is called <span className="font-semibold text-red-600">magnetic force</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-pink-700">Example:</span> <span className="font-semibold text-blue-600">Magnetic force attracts iron nails</span> when they are bought near a magnet.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Gravitational force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-rose-600">attractive force</span> between any two objects at a distance is called <span className="font-semibold text-red-600">gravitational force</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-rose-700">Example:</span> The force that acts on a <span className="font-semibold text-yellow-600">vertically thrown ball</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Electrostatic force:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The force exerted by a <span className="font-semibold text-red-600">charged body</span> on another <span className="font-semibold text-pink-600">charged body</span> is called <span className="font-semibold text-rose-600">electrostatic force</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-red-700">Example:</span> The <span className="font-semibold text-purple-600">combed comb attracts pieces of paper</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50 rounded-2xl p-5 shadow-lg border border-slate-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-slate-600 to-gray-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-slate-200">
                  Pressure
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-lg p-4 border-l-4 border-slate-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-slate-700">Pressure:</span> A <span className="font-semibold text-slate-600">force acting on a unit area</span> of a surface is called <span className="font-semibold text-gray-600">pressure</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-zinc-50 rounded-lg p-4 border-l-4 border-gray-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed font-mono text-base"><span className="font-semibold text-gray-700">PRESSURE = FORCE / AREA ON WHICH IT ACTS</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-zinc-50 to-slate-50 rounded-lg p-4 border-l-4 border-zinc-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-zinc-700">UNITS OF FORCE:</span> The units of pressure in the <span className="font-semibold text-blue-600">SI system</span> are <span className="font-semibold text-indigo-600">newtons per meter²</span> (or <span className="font-semibold text-purple-600">N/m²</span>).</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Newton's Laws of Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">INERTIA:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-600">Inertia</span> is the tendency of an object to <span className="font-semibold text-purple-600">stay at rest</span> or <span className="font-semibold text-pink-600">keep moving with the same velocity</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Newton's First Law of Motion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Newton's First Law of Motion states that an object will <span className="font-semibold text-purple-600">remain at rest</span> or in <span className="font-semibold text-pink-600">uniform motion in a straight line</span> unless acted upon by an <span className="font-semibold text-indigo-600">external force</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Applications for Newton's First Law of Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Seatbelts in Cars:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">When a car <span className="font-semibold text-blue-600">suddenly stops</span>, the passengers tend to <span className="font-semibold text-cyan-600">keep moving forward due to inertia</span>. Seatbelts prevent this by exerting a force on the passengers to bring them to a stop, under <span className="font-semibold text-indigo-600">Newton's first law</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-indigo-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Skating:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-600">Ice skating</span> or <span className="font-semibold text-blue-600">roller skating</span> provides an example of Newton's first law. When gliding on ice or smooth surfaces, the skater <span className="font-semibold text-indigo-600">continues moving forward</span> until <span className="font-semibold text-gray-600">friction</span> or another force acts upon them to stop their motion.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Momentum
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-700">Momentum</span> is a physics term that describes the <span className="font-semibold text-green-600">quantity of motion</span> an object has. It is calculated as the <span className="font-semibold text-emerald-600">product of an object's mass and its velocity</span>. Mathematically, momentum (p) is defined as:</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed font-mono text-base"><span className="font-semibold text-emerald-700">p = m × v</span></p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">Where:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-emerald-600">p</span> is momentum.</li>
                      <li className="text-gray-600"><span className="font-semibold text-teal-600">m</span> is the mass of the object.</li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">v</span> is the velocity of the object.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-orange-200">
                  Applications Newton's Second Law of Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Newton's second law of motion states that the <span className="font-semibold text-orange-600">force acting on an object</span> is equal to the <span className="font-semibold text-amber-600">mass of the object multiplied by its acceleration</span>. Mathematically, it's expressed as <span className="font-semibold text-yellow-600 font-mono">F = ma</span>, where <span className="font-semibold text-orange-600">F</span> is the force applied to the object, <span className="font-semibold text-amber-600">m</span> is its mass, and <span className="font-semibold text-yellow-600">a</span> is its acceleration.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">This law explains how the <span className="font-semibold text-amber-600">velocity of an object changes</span> when subjected to an <span className="font-semibold text-orange-600">external force</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Newton's Third Law of Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Newton's third law of motion states that <span className="font-semibold text-red-600">"for every action, there is an equal and opposite reaction"</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Applications of Newton's Third Law of Motion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <h4 className="text-base font-bold text-violet-700 mb-2">Walking:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">When you walk, your foot <span className="font-semibold text-violet-600">exerts a backward force on the ground</span>, and the ground <span className="font-semibold text-purple-600">exerts an equal and opposite forward force</span> on your foot, <span className="font-semibold text-pink-600">propelling you forward</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Rocket Propulsion:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">A rocket's engines <span className="font-semibold text-purple-600">expel high-speed exhaust gases downward</span>, which creates a force <span className="font-semibold text-pink-600">pushing the rocket upward</span>. The rocket experiences an <span className="font-semibold text-violet-600">equal and opposite force downward</span>, according to <span className="font-semibold text-indigo-600">Newton's third law</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Swimming:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">As you swim, you <span className="font-semibold text-pink-600">push the water backwards</span> with your hands and feet, and the water <span className="font-semibold text-rose-600">pushes you forward</span> with an <span className="font-semibold text-red-600">equal force in the opposite direction</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : isThermalEnergyLesson ? (
            // Thermal Energy Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 via-red-600 to-rose-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-orange-200">
                  4. THERMAL ENERGY
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Thermal energy is a form of <span className="font-semibold text-orange-600">energy associated with the temperature</span> of an object or a system. It originates from the <span className="font-semibold text-red-600">movement of atoms and molecules</span> within a substance. The <span className="font-semibold text-rose-600">faster the particles move</span>, the <span className="font-semibold text-amber-600">higher the temperature</span> and <span className="font-semibold text-yellow-600">thermal energy</span> of the object.</p>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">This energy plays a crucial role in <span className="font-semibold text-red-600">everyday life</span> and various <span className="font-semibold text-rose-600">scientific fields</span>. It's involved in processes like <span className="font-semibold text-orange-600">heating</span>, <span className="font-semibold text-blue-600">cooling</span>, and <span className="font-semibold text-purple-600">phase changes</span> such as <span className="font-semibold text-cyan-600">melting</span> and <span className="font-semibold text-indigo-600">boiling</span>.</p>
                  </div>

                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Understanding thermal energy is essential for fields like <span className="font-semibold text-rose-600">thermodynamics</span>, <span className="font-semibold text-orange-600">engineering</span>, <span className="font-semibold text-blue-600">meteorology</span>, and <span className="font-semibold text-green-600">environmental science</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 via-red-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-orange-200">
                  Thermal Energy
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-700">Thermal Energy:</span> Thermal energy is a form of <span className="font-semibold text-orange-600">internal energy</span> associated with the <span className="font-semibold text-red-600">random motion of atoms and molecules</span> within a substance. It is directly related to the <span className="font-semibold text-rose-600">temperature of the substance</span> and represents the <span className="font-semibold text-amber-600">total kinetic energy</span> of its particles.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Temperature
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">Temperature:</span> Temperature is a measure of the <span className="font-semibold text-blue-600">average kinetic energy</span> of the particles in a substance. It determines the <span className="font-semibold text-cyan-600">direction of heat transfer</span> between two objects in contact and is commonly measured in units such as <span className="font-semibold text-indigo-600">Celsius (°C)</span>, <span className="font-semibold text-purple-600">Fahrenheit (°F)</span>, or <span className="font-semibold text-pink-600">Kelvin (K)</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Heat
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-700">Heat:</span> Heat is the <span className="font-semibold text-red-600">transfer of thermal energy</span> between two systems due to a <span className="font-semibold text-rose-600">temperature difference</span>. It flows from regions of <span className="font-semibold text-orange-600">higher temperature</span> to regions of <span className="font-semibold text-blue-600">lower temperature</span> until <span className="font-semibold text-purple-600">thermal equilibrium</span> is reached. Heat is measured in units of <span className="font-semibold text-cyan-600">joules (J)</span> or <span className="font-semibold text-indigo-600">calories (cal)</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Heat Transfer Methods
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Conduction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Conduction is the process of <span className="font-semibold text-purple-600">heat transfer through direct contact</span> between particles of matter. It occurs when <span className="font-semibold text-indigo-600">hotter particles transfer thermal energy</span> to <span className="font-semibold text-blue-600">cooler particles</span> by colliding with them, leading to an <span className="font-semibold text-cyan-600">increase in temperature</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Convection:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Convection is the process of <span className="font-semibold text-indigo-600">heat transfer through the movement of fluids</span> (liquids or gases). It occurs when <span className="font-semibold text-blue-600">hotter fluid rises</span> and <span className="font-semibold text-cyan-600">cooler fluid sinks</span>, creating a <span className="font-semibold text-purple-600">circulation pattern</span> that redistributes thermal energy within the fluid.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Radiation:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Radiation is the transfer of heat through <span className="font-semibold text-blue-600">electromagnetic waves</span>. Unlike conduction and convection, radiation <span className="font-semibold text-cyan-600">does not require a medium</span> and can occur through a <span className="font-semibold text-indigo-600">vacuum</span>. Objects emit and absorb thermal radiation based on their <span className="font-semibold text-purple-600">temperature</span> and <span className="font-semibold text-pink-600">surface properties</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Specific Heat
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-emerald-700">Specific Heat:</span> Specific heat is the amount of <span className="font-semibold text-emerald-600">heat required to raise the temperature</span> of one unit of mass of a substance by <span className="font-semibold text-teal-600">one degree Celsius</span> (or Kelvin). It is a <span className="font-semibold text-cyan-600">property of materials</span> and is commonly measured in units of <span className="font-semibold text-blue-600">joules per kilogram per degree Celsius</span> (J/kg°C).</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Latent Heat
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-700">Latent Heat:</span> Latent heat is the <span className="font-semibold text-amber-600">heat energy absorbed or released</span> during a <span className="font-semibold text-orange-600">phase change</span> of a substance (such as <span className="font-semibold text-yellow-600">melting</span>, <span className="font-semibold text-red-600">freezing</span>, <span className="font-semibold text-purple-600">vaporization</span>, or <span className="font-semibold text-cyan-600">condensation</span>) without a <span className="font-semibold text-blue-600">temperature change</span>. It represents the energy required to <span className="font-semibold text-indigo-600">overcome intermolecular forces</span> and change the <span className="font-semibold text-pink-600">arrangement of particles</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Thermal Equilibrium
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-violet-700">Thermal Equilibrium:</span> Thermal equilibrium is a state in which <span className="font-semibold text-violet-600">two systems are at the same temperature</span> and there is <span className="font-semibold text-purple-600">no net heat transfer</span> between them. In thermal equilibrium, the <span className="font-semibold text-pink-600">rates of heat transfer</span> between the systems are equal, and their <span className="font-semibold text-indigo-600">temperatures remain constant</span> over time.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  CHANGE OF STATE OF MATTER
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Melting:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Melting is the process by which a <span className="font-semibold text-green-600">solid substance changes</span> into its <span className="font-semibold text-emerald-600">liquid state</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-base font-bold text-emerald-700 mb-2">Boiling:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Boiling is the process of <span className="font-semibold text-emerald-600">heating a liquid continuously</span> until it gets converted into <span className="font-semibold text-teal-600">gas</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Freezing:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Freezing is the process by which a <span className="font-semibold text-teal-600">liquid substance changes</span> into its <span className="font-semibold text-cyan-600">solid state</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Condensation:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">The process in which <span className="font-semibold text-cyan-600">gas cools</span> and changes back into a <span className="font-semibold text-blue-600">liquid state</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : isSoundLesson ? (
            // Sound Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-indigo-200">
                  5. SOUND
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Sound is a form of <span className="font-semibold text-indigo-600">energy that travels through a medium</span> (such as <span className="font-semibold text-purple-600">air</span>, <span className="font-semibold text-blue-600">water</span>, or <span className="font-semibold text-cyan-600">solids</span>) in the form of <span className="font-semibold text-pink-600">vibrations</span>. These vibrations create a <span className="font-semibold text-indigo-600">wave that moves outward</span> from the source in <span className="font-semibold text-purple-600">all directions</span>.</p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">When vibrations travel through the medium, they cause <span className="font-semibold text-purple-600">compression and rarefaction</span> of particles. Sound waves are classified as <span className="font-semibold text-indigo-600">longitudinal waves</span> because the particles of the medium vibrate <span className="font-semibold text-pink-600">parallel to the direction</span> of wave propagation.</p>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Sound travels <span className="font-semibold text-blue-600">fastest in solids</span>, <span className="font-semibold text-cyan-600">slower in liquids</span>, and <span className="font-semibold text-indigo-600">slowest in gases</span>. In a <span className="font-semibold text-gray-600">vacuum</span>, where there are no particles, <span className="font-semibold text-red-600">sound cannot travel</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Characteristics of Sound
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Pitch:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Pitch refers to how <span className="font-semibold text-indigo-600">high or low a sound</span> is. It depends on the <span className="font-semibold text-purple-600">frequency of the vibration</span>.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-green-600">Higher frequency</span> = <span className="font-semibold text-green-600">higher pitch</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Lower frequency</span> = <span className="font-semibold text-blue-600">lower pitch</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Loudness:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Loudness refers to how <span className="font-semibold text-purple-600">strong or intense a sound</span> is. It depends on the <span className="font-semibold text-pink-600">amplitude of the sound wave</span>.</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-orange-600">Greater amplitude</span> = <span className="font-semibold text-orange-600">louder sound</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Lower amplitude</span> = <span className="font-semibold text-blue-600">softer sound</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Quality (Timbre):</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Quality refers to the <span className="font-semibold text-pink-600">nature or characteristics</span> that help us differentiate between sounds, like a <span className="font-semibold text-rose-600">guitar</span> and a <span className="font-semibold text-red-600">flute</span> playing the same note.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Frequency:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Frequency is the <span className="font-semibold text-cyan-600">number of vibrations per second</span>. The unit of frequency is the <span className="font-semibold text-blue-600">hertz (Hz)</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Audible frequency:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Humans can hear sounds in the frequency range of <span className="font-semibold text-blue-600">20 Hz to 20,000 Hz</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2">Sounds below <span className="font-semibold text-indigo-600">20 Hz</span> are called <span className="font-semibold text-purple-600">infrasonic</span>, and sounds above <span className="font-semibold text-pink-600">20,000 Hz</span> are called <span className="font-semibold text-rose-600">ultrasonic</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Types of Sound Waves
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <h4 className="text-base font-bold text-violet-700 mb-2">Infrasonic Waves:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Sounds with a frequency <span className="font-semibold text-violet-600">below 20 Hz</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Ultrasonic Waves:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Sounds with a frequency <span className="font-semibold text-purple-600">above 20,000 Hz</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Audible Waves:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Sounds that can be heard by humans in the range of <span className="font-semibold text-indigo-600">20 Hz–20,000 Hz</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Echo
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">An <span className="font-semibold text-emerald-600">echo</span> is the <span className="font-semibold text-teal-600">repetition of sound</span> caused by the <span className="font-semibold text-cyan-600">reflection of sound waves</span> from a surface.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Sound must travel at least <span className="font-semibold text-teal-600">17 meters</span> to and back from the reflecting surface to hear a <span className="font-semibold text-cyan-600">clear echo</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-700">Echoes are used in:</span></p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">SONAR</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Ultrasonic imaging</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Sound engineering</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Reflection of Sound
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Sound <span className="font-semibold text-blue-600">reflects from surfaces</span> just like light does. The <span className="font-semibold text-indigo-600">angle of incidence = angle of reflection</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Uses of Sound
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li className="text-gray-600"><span className="font-semibold text-amber-600">Communication</span></li>
                    <li className="text-gray-600"><span className="font-semibold text-orange-600">Medical ultrasound</span></li>
                    <li className="text-gray-600"><span className="font-semibold text-yellow-600">SONAR</span></li>
                    <li className="text-gray-600"><span className="font-semibold text-red-600">Musical instruments</span></li>
                    <li className="text-gray-600"><span className="font-semibold text-pink-600">Alarms and signals</span></li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Noise and Music
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Music:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">A <span className="font-semibold text-green-600">pleasant sound</span> that follows a <span className="font-semibold text-emerald-600">pattern</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Noise:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">An <span className="font-semibold text-red-600">unpleasant sound</span> without a <span className="font-semibold text-rose-600">definite pattern</span> that may be <span className="font-semibold text-pink-600">harmful</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Noise Pollution
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Excessive and unwanted sound</span> from <span className="font-semibold text-rose-600">traffic</span>, <span className="font-semibold text-pink-600">factories</span>, <span className="font-semibold text-orange-600">loudspeakers</span>, etc., creates <span className="font-semibold text-red-600">noise pollution</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Harmful effects include:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-red-600">Headache</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-orange-600">Stress</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Hearing loss</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-yellow-600">Lack of concentration</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Control measures:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-green-600">Planting trees</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-emerald-600">Using silencers</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-teal-600">Avoiding unnecessary honking</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Soundproofing buildings</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : isElectricEnergyLesson ? (
            // Electric Energy Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-yellow-200">
                  6. ELECTRIC ENERGY
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Electric energy is a type of <span className="font-semibold text-yellow-600">energy that comes from the movement of electric charges</span>. It is one of the most <span className="font-semibold text-amber-600">widely used forms of energy</span> in modern life and plays a <span className="font-semibold text-orange-600">vital role in our daily activities</span>. Electric energy is used to power <span className="font-semibold text-blue-600">homes</span>, <span className="font-semibold text-green-600">schools</span>, <span className="font-semibold text-red-600">hospitals</span>, <span className="font-semibold text-purple-600">industries</span>, <span className="font-semibold text-cyan-600">transport</span>, and <span className="font-semibold text-indigo-600">communication systems</span>. It can easily be converted into other forms of energy, such as <span className="font-semibold text-yellow-600">light energy</span>, <span className="font-semibold text-orange-600">heat energy</span>, <span className="font-semibold text-blue-600">mechanical energy</span>, and <span className="font-semibold text-pink-600">sound energy</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Electric current
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-blue-600">flow of electric charge</span> through a <span className="font-semibold text-indigo-600">conductor or circuit</span> is called <span className="font-semibold text-purple-600">electric current</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Conductors and Insulators
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Conductors:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Materials that <span className="font-semibold text-green-600">allow electric current to pass through them</span> are called <span className="font-semibold text-emerald-600">conductors</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-700">Examples:</span> <span className="font-semibold text-amber-600">Metals like copper</span>, <span className="font-semibold text-orange-600">iron</span>, and <span className="font-semibold text-yellow-600">aluminum</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-green-700">Examples of conductors:</span> <span className="font-semibold text-blue-600">Copper wire</span>, <span className="font-semibold text-gray-600">iron wire</span>, and <span className="font-semibold text-slate-600">aluminum wire</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Insulators:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Materials that <span className="font-semibold text-red-600">do not allow electric current to pass through them</span> are called <span className="font-semibold text-rose-600">insulators</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-700">Examples:</span> <span className="font-semibold text-pink-600">Plastic</span>, <span className="font-semibold text-amber-600">wood</span>, <span className="font-semibold text-orange-600">rubber</span>, and <span className="font-semibold text-blue-600">glass</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Cell and Battery
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Cell:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">A cell is a device that <span className="font-semibold text-purple-600">converts chemical energy into electrical energy</span>. It has <span className="font-semibold text-indigo-600">two terminals</span>: a <span className="font-semibold text-green-600">positive (+) terminal</span> and a <span className="font-semibold text-red-600">negative (–) terminal</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Battery:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-600">Two or more cells joined together</span> are called a <span className="font-semibold text-blue-600">battery</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
                  Electric circuit
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">An <span className="font-semibold text-cyan-600">electric circuit</span> is a <span className="font-semibold text-blue-600">closed path</span> through which <span className="font-semibold text-indigo-600">electric current flows</span>. It consists of a <span className="font-semibold text-purple-600">power source</span> (cell or battery), <span className="font-semibold text-pink-600">connecting wires</span>, a <span className="font-semibold text-orange-600">switch</span>, and an <span className="font-semibold text-yellow-600">electrical appliance</span> such as a bulb.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Types of Electric Circuits
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-base font-bold text-emerald-700 mb-2">Open circuit:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">When the <span className="font-semibold text-emerald-600">switch is open</span>, the <span className="font-semibold text-teal-600">electric current does not flow</span>. The <span className="font-semibold text-cyan-600">bulb does not glow</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Closed circuit:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">When the <span className="font-semibold text-teal-600">switch is closed</span>, <span className="font-semibold text-cyan-600">electric current flows</span>. The <span className="font-semibold text-blue-600">bulb glows</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Series and Parallel Connection
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <h4 className="text-base font-bold text-violet-700 mb-2">Series Connection:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-violet-600">Components are connected end-to-end</span>, forming a <span className="font-semibold text-purple-600">single pathway for the current</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed">If <span className="font-semibold text-pink-600">one component fails</span>, the <span className="font-semibold text-red-600">whole circuit stops working</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-violet-700">Example:</span> <span className="font-semibold text-yellow-600">Old decorative lights</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Parallel Connection:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-purple-600">Components are connected in branches</span>, forming <span className="font-semibold text-pink-600">multiple pathways for the current</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed">If <span className="font-semibold text-rose-600">one bulb stops working</span>, the <span className="font-semibold text-green-600">others continue glowing</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-purple-700">Example:</span> <span className="font-semibold text-blue-600">Household wiring</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Electric Bulb
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">When <span className="font-semibold text-amber-600">electric current passes through the filament</span> of the bulb, it becomes <span className="font-semibold text-orange-600">hot and produces light</span>. The filament is usually made of <span className="font-semibold text-yellow-600">tungsten</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Fuse
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">A <span className="font-semibold text-red-600">fuse</span> is a <span className="font-semibold text-rose-600">safety device</span> used in electrical circuits to <span className="font-semibold text-pink-600">prevent excessive current</span>. It <span className="font-semibold text-orange-600">melts when too much current flows</span>, <span className="font-semibold text-amber-600">breaking the circuit</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Switch
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">A <span className="font-semibold text-blue-600">switch</span> is used to <span className="font-semibold text-indigo-600">open or close</span> an <span className="font-semibold text-purple-600">electrical circuit</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Electromagnet
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">An <span className="font-semibold text-indigo-600">electromagnet</span> is a <span className="font-semibold text-purple-600">temporary magnet</span> made by <span className="font-semibold text-pink-600">winding a coil of wire</span> around a piece of <span className="font-semibold text-gray-600">iron</span> and <span className="font-semibold text-blue-600">passing electric current</span> through it.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Uses of electromagnets:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Electric bell</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Motors</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Generators</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Magnetic cranes</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 rounded-2xl p-5 shadow-lg border border-yellow-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-yellow-200">
                  Electric Bell
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">An <span className="font-semibold text-yellow-600">electric bell</span> works with the help of an <span className="font-semibold text-amber-600">electromagnet</span>. When the <span className="font-semibold text-orange-600">circuit is closed</span>, the electromagnet <span className="font-semibold text-red-600">pulls the iron armature</span> toward it, <span className="font-semibold text-pink-600">striking the gong</span> and <span className="font-semibold text-purple-600">producing sound</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Default Physics lesson content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-sky-200">
                  {activeLesson ? activeLesson.title : 'Physics Lesson'}
                </h2>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  {activeLesson && activeLesson.content ? (
                    <div className="prose prose-stone max-w-none">
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {activeLesson.content.split('\n\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-4 last:mb-0 text-gray-600 leading-6">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Content will be available soon.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
    
    // For Chemistry, show the overview content based on selected lesson
    if (activeSubjectId === 'chemistry') {
      // Get lesson index for additional matching
      const lessonIndex = activeLessons.findIndex(l => l.id === activeLessonId);
      
      const isAtomicStructureLesson = activeLessonId === 'chemistry-lesson-1' || lessonIndex === 0 || (activeLesson && (activeLesson.title === 'Atomic structure' || activeLesson.title === 'ATOMIC STRUCTURE' || activeLesson.title === 'Atomic Structure' || activeLesson.title.toLowerCase().includes('atomic') && activeLesson.title.toLowerCase().includes('structure')));
      const isMatterAroundUsLesson = activeLessonId === 'chemistry-lesson-2' || lessonIndex === 1 || (activeLesson && (activeLesson.title === 'Matter around us' || activeLesson.title === 'MATTER AROUND US' || activeLesson.title === 'Matter Around Us' || activeLesson.title.toLowerCase().includes('matter') && activeLesson.title.toLowerCase().includes('around')));
      const isMetalsAndNonMetalsLesson = activeLessonId === 'chemistry-lesson-3' || lessonIndex === 2 || (activeLesson && (activeLesson.title === 'Metals and non-metals' || activeLesson.title === 'METALS AND NON-METALS' || activeLesson.title === 'Metals and Non-Metals' || activeLesson.title.toLowerCase().includes('metals') && activeLesson.title.toLowerCase().includes('non')));
      const isPeriodicClassificationLesson = activeLessonId === 'chemistry-lesson-4' || lessonIndex === 3 || (activeLesson && (activeLesson.title === 'Periodic classification of elements' || activeLesson.title === 'PERIODIC CLASSIFICATION OF ELEMENTS' || activeLesson.title === 'Periodic Classification of Elements' || activeLesson.title.toLowerCase().includes('periodic') && activeLesson.title.toLowerCase().includes('classification')));
      const isChemicalReactionsLesson = activeLessonId === 'chemistry-lesson-5' || lessonIndex === 4 || (activeLesson && (activeLesson.title === 'Chemical reactions' || activeLesson.title === 'CHEMICAL REACTIONS' || activeLesson.title === 'Chemical Reactions' || activeLesson.title.toLowerCase().includes('chemical') && activeLesson.title.toLowerCase().includes('reaction')));
      const isAcidsBasesAndSaltsLesson = activeLessonId === 'chemistry-lesson-6' || lessonIndex === 5 || (activeLesson && (activeLesson.title === 'Acids, bases and salts' || activeLesson.title === 'ACIDS, BASES AND SALTS' || activeLesson.title === 'Acids, Bases and Salts' || activeLesson.title.toLowerCase().includes('acids') && activeLesson.title.toLowerCase().includes('bases')));
      
      return (
        <div className="space-y-0 -mt-2">
          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-t-xl rounded-b-none p-3 border-t border-l border-r border-amber-200/50 border-b-0 shadow-md overflow-hidden mb-0 pb-0">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-48 h-48 bg-amber-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10 flex flex-row items-center gap-3">
              <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm">
                <SubjectIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-amber-900 leading-tight">{activeSubject.name}</h1>
                {activeLesson && (
                  <p className="text-sm text-stone-600 mt-1">
                    {activeLesson.title}
                  </p>
                )}
              </div>
            </div>
          </div>

          {isAtomicStructureLesson ? (
            // Atomic Structure Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-purple-200">
                  7. ATOMIC STRUCTURE
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Matter is made up of <span className="font-semibold text-purple-600">tiny particles called atoms</span>. The atom is the <span className="font-semibold text-indigo-600">smallest unit of matter</span> that retains its <span className="font-semibold text-blue-600">chemical properties</span>. Although atoms are <span className="font-semibold text-cyan-600">extremely small</span>, scientists have developed <span className="font-semibold text-pink-600">models to explain their structure</span> and behavior.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Atom
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The atom is the <span className="font-semibold text-purple-600">smallest particle of an element</span> that <span className="font-semibold text-indigo-600">cannot be divided further</span> by any <span className="font-semibold text-blue-600">chemical means</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Subatomic particles
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Atoms are made up of <span className="font-semibold text-blue-600">three fundamental particles</span>:</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Protons:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Positively charged particles</span> present in the <span className="font-semibold text-rose-600">nucleus</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Electrons:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Negatively charged particles</span> <span className="font-semibold text-cyan-600">revolving around the nucleus</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg p-4 border-l-4 border-gray-500 shadow-sm">
                    <h4 className="text-base font-bold text-gray-700 mb-2">Neutrons:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-gray-600">Neutral particles</span> present in the <span className="font-semibold text-slate-600">nucleus</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Nucleus
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-indigo-600">center of the atom</span> where <span className="font-semibold text-purple-600">protons and neutrons</span> are present is called the <span className="font-semibold text-pink-600">nucleus</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
                  Electron shells
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Electrons <span className="font-semibold text-cyan-600">revolve around the nucleus</span> in <span className="font-semibold text-blue-600">fixed paths called shells</span> or <span className="font-semibold text-indigo-600">energy levels</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The shells are named as: <span className="font-semibold text-blue-600">K, L, M, N…</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Each shell has a <span className="font-semibold text-indigo-600">maximum number of electrons</span>:</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Shell Maximum Electrons
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Shell</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Maximum electrons</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-blue-700">K</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">2</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-green-700">L</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-green-600">8</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-purple-700">M</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-purple-600">18</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-orange-700">N</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-orange-600">32</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Atomic number
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-emerald-600">total number of protons</span> present in the <span className="font-semibold text-teal-600">nucleus of an atom</span> is called the <span className="font-semibold text-cyan-600">atomic number</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed font-mono text-base"><span className="font-semibold text-teal-700">Atomic number = Number of protons</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Mass number
                </h3>
                
                <div className="space-y-2 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-blue-600">sum of the number of protons and neutrons</span> present in the <span className="font-semibold text-indigo-600">nucleus of an atom</span> is called the <span className="font-semibold text-purple-600">mass number</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed font-mono text-base"><span className="font-semibold text-indigo-700">Mass number = Protons + Neutrons</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Isotopes
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Atoms of the <span className="font-semibold text-violet-600">same element</span> having the <span className="font-semibold text-purple-600">same atomic number</span> but <span className="font-semibold text-pink-600">different mass numbers</span> are called <span className="font-semibold text-rose-600">isotopes</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Example:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-600">Hydrogen:</span> <span className="font-semibold text-blue-600">Protium</span>, <span className="font-semibold text-cyan-600">Deuterium</span>, <span className="font-semibold text-indigo-600">Tritium</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Uses of isotopes:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-pink-600">In medicine</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-rose-600">To detect and treat diseases</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-green-600">In agriculture</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">In industry</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Valency
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-green-600">combining capacity of an atom</span> is called its <span className="font-semibold text-emerald-600">valency</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The number of electrons <span className="font-semibold text-emerald-600">lost, gained, or shared</span> during a <span className="font-semibold text-teal-600">chemical reaction</span> determines valency.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Hydrogen</span> = <span className="font-semibold text-blue-600">1</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Oxygen</span> = <span className="font-semibold text-cyan-600">2</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Nitrogen</span> = <span className="font-semibold text-indigo-600">3</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Carbon</span> = <span className="font-semibold text-purple-600">4</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Electronic Configuration
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-indigo-600">arrangement of electrons</span> in various <span className="font-semibold text-purple-600">shells of an atom</span> is called <span className="font-semibold text-pink-600">electronic configuration</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Hydrogen (Z=1):</span> <span className="font-semibold text-blue-600">1</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Carbon (Z=6):</span> <span className="font-semibold text-cyan-600">2, 4</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Oxygen (Z=8):</span> <span className="font-semibold text-indigo-600">2, 6</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Calcium (Z=20):</span> <span className="font-semibold text-purple-600">2, 8, 8, 2</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : isMatterAroundUsLesson ? (
            // Matter Around Us Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-teal-600 via-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-teal-200">
                  8. MATTER AROUND US
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Matter is anything that <span className="font-semibold text-teal-600">occupies space and has mass</span>. Everything around us, including <span className="font-semibold text-cyan-600">air</span>, <span className="font-semibold text-blue-600">water</span>, <span className="font-semibold text-green-600">soil</span>, <span className="font-semibold text-emerald-600">plants</span>, and <span className="font-semibold text-orange-600">animals</span>, is made up of matter. Matter exists in <span className="font-semibold text-purple-600">different forms</span> and can undergo <span className="font-semibold text-pink-600">various changes</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
                  States of matter
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Matter exists in <span className="font-semibold text-teal-600">three major physical states</span>:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Solid</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Liquid</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Gas</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Properties of States of Matter
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Property</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Solid</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Liquid</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Gas</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-blue-700">Shape</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">Fixed</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-cyan-600">No fixed</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-indigo-600">No fixed</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-green-700">Volume</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-green-600">Fixed</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-emerald-600">Fixed</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-teal-600">No fixed</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-purple-700">Compressibility</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-purple-600">Negligible</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-pink-600">Very little</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-rose-600">Highly compressible</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-orange-700">Arrangement of particles</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-orange-600">Closely packed</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-amber-600">Less packed</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-yellow-600">Far apart</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-indigo-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-indigo-200">
                  Intermolecular forces
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-indigo-600">force of attraction between molecules</span> is called the <span className="font-semibold text-purple-600">intermolecular force</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li className="text-gray-600"><span className="font-semibold text-red-600">Strongest in solids</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-orange-600">Moderate in liquids</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-yellow-600">Weakest in gases</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
                  Change in state of matter
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Matter can change from <span className="font-semibold text-emerald-600">one state to another</span> by <span className="font-semibold text-teal-600">heating or cooling</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Change in State of Matter
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Change</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Process</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">Solid → Liquid</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-cyan-600">Melting</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-green-600">Liquid → Gas</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-emerald-600">Evaporation/Boiling</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-purple-600">Gas → Liquid</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-pink-600">Condensation</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-orange-50 to-amber-50 hover:from-orange-100 hover:to-amber-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-orange-600">Liquid → Solid</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-amber-600">Freezing/Solidification</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-red-600">Solid → Gas</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-rose-600">Sublimation</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Physical change
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">A change in which <span className="font-semibold text-blue-600">no new substance is formed</span> is called a <span className="font-semibold text-indigo-600">physical change</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Melting of ice</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Breaking a glass</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Dissolving sugar in water</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Characteristics:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">No new substance is formed</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-pink-600">Usually reversible</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-rose-600">Change in shape, size, or state</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Chemical change
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">A change in which a <span className="font-semibold text-red-600">new substance is formed</span> is called a <span className="font-semibold text-rose-600">chemical change</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-red-600">Rusting of iron</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-orange-600">Burning of paper</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Cooking food</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Characteristics:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-pink-600">A new substance is formed</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-red-600">Usually irreversible</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-orange-600">Heat or light may be released</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Elements, Compounds, and Mixtures
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <h4 className="text-base font-bold text-green-700 mb-2">Element:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A <span className="font-semibold text-green-600">pure substance</span> made up of only <span className="font-semibold text-emerald-600">one kind of atom</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-700">Examples:</span> <span className="font-semibold text-gray-600">Iron</span>, <span className="font-semibold text-yellow-600">Gold</span>, <span className="font-semibold text-blue-600">Oxygen</span>, <span className="font-semibold text-cyan-600">Hydrogen</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-base font-bold text-emerald-700 mb-2">Compound:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A substance formed by <span className="font-semibold text-emerald-600">chemical combination</span> of <span className="font-semibold text-teal-600">two or more elements</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-emerald-700">Examples:</span> <span className="font-semibold text-blue-600">Water (H₂O)</span>, <span className="font-semibold text-cyan-600">Carbon dioxide (CO₂)</span>, <span className="font-semibold text-indigo-600">Salt (NaCl)</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Mixture:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A combination of <span className="font-semibold text-teal-600">two or more substances</span> that are <span className="font-semibold text-cyan-600">not chemically combined</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-700">Examples:</span> <span className="font-semibold text-blue-600">Air</span>, <span className="font-semibold text-cyan-600">Saltwater</span>, <span className="font-semibold text-green-600">Soil</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
                  Types of mixtures
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                    <h4 className="text-base font-bold text-violet-700 mb-2">Homogeneous mixture:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">The components are <span className="font-semibold text-violet-600">uniformly mixed</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-violet-700">Example:</span> <span className="font-semibold text-green-600">Sugar in water</span>, <span className="font-semibold text-blue-600">air</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Heterogeneous mixture:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">The components are <span className="font-semibold text-purple-600">not uniformly mixed</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">Example:</span> <span className="font-semibold text-amber-600">Sand and water</span>, <span className="font-semibold text-yellow-600">oil and water</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Methods of Separation of Mixtures
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-600">Filtration</span> (<span className="font-semibold text-orange-600">tea leaves</span>)</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-600">Evaporation</span> (<span className="font-semibold text-yellow-600">salt from seawater</span>)</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-yellow-600">Sedimentation and Decantation</span> (<span className="font-semibold text-amber-600">muddy water</span>)</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-600">Chromatography</span> (<span className="font-semibold text-orange-600">ink separation</span>)</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-600">Distillation</span> (<span className="font-semibold text-yellow-600">petrol, kerosene</span>)</p>
                  </div>
                </div>
              </div>
            </>
          ) : isMetalsAndNonMetalsLesson ? (
            // Metals and Non-Metals Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-amber-200">
                  9. METALS AND NON-METALS
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The earth's crust is composed of <span className="font-semibold text-amber-600">various types of materials</span>. Broadly, these can be categorized as <span className="font-semibold text-orange-600">metals and non-metals</span>. Metals and non-metals have <span className="font-semibold text-yellow-600">distinct physical and chemical properties</span> that allow us to <span className="font-semibold text-red-600">differentiate between them</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Physical Properties of Metals
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Lustre:</span> Metals have a <span className="font-semibold text-indigo-600">shiny appearance</span> and are <span className="font-semibold text-purple-600">lustrous</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-600">Hardness:</span> Most metals are <span className="font-semibold text-purple-600">hard</span>, though some like <span className="font-semibold text-pink-600">sodium and potassium</span> are <span className="font-semibold text-rose-600">soft</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-600">Malleability:</span> Metals can be <span className="font-semibold text-pink-600">beaten into thin sheets</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-pink-600">Ductility:</span> Metals can be <span className="font-semibold text-rose-600">drawn into wires</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-rose-600">Conductivity:</span> Metals are <span className="font-semibold text-red-600">good conductors</span> of <span className="font-semibold text-orange-600">heat and electricity</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Sonorous:</span> Metals produce a <span className="font-semibold text-orange-600">ringing sound</span> when hit.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-600">Density and Melting Point:</span> Metals usually have <span className="font-semibold text-amber-600">high density</span> and <span className="font-semibold text-yellow-600">high melting points</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Physical Properties of Non-Metals
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-600">Lustre:</span> Non-metals are generally <span className="font-semibold text-emerald-600">dull</span>, except <span className="font-semibold text-teal-600">iodine and diamond</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-emerald-600">Hardness:</span> Non-metals are generally <span className="font-semibold text-teal-600">soft</span>, except <span className="font-semibold text-cyan-600">diamond</span> which is the <span className="font-semibold text-blue-600">hardest substance</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-600">Malleability:</span> Non-metals are <span className="font-semibold text-cyan-600">not malleable</span>; they <span className="font-semibold text-blue-600">break when hammered</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-600">Ductility:</span> Non-metals <span className="font-semibold text-blue-600">cannot be drawn into wires</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Conductivity:</span> Non-metals are <span className="font-semibold text-indigo-600">poor conductors</span> of <span className="font-semibold text-purple-600">heat and electricity</span> (<span className="font-semibold text-pink-600">graphite is an exception</span>).</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-600">Density and Melting Point:</span> Non-metals usually have <span className="font-semibold text-purple-600">lower density</span> and <span className="font-semibold text-pink-600">melting points</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Chemical Properties of Metals
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Reaction with Oxygen:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Metals react with <span className="font-semibold text-red-600">oxygen</span> to form <span className="font-semibold text-rose-600">metal oxides</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="font-semibold text-blue-600">Example:</span> <span className="text-indigo-600">2Mg + O₂ → 2MgO</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Reaction with Water:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Some metals react with <span className="font-semibold text-rose-600">water</span> to form <span className="font-semibold text-pink-600">metal hydroxides</span> and <span className="font-semibold text-red-600">hydrogen gas</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Example:</span> <span className="font-semibold text-cyan-600">Sodium</span> reacts <span className="font-semibold text-indigo-600">vigorously</span> with water.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Reaction with Acids:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Metals react with <span className="font-semibold text-pink-600">acids</span> to produce <span className="font-semibold text-red-600">hydrogen gas</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="font-semibold text-blue-600">Example:</span> <span className="text-indigo-600">Zn + 2HCl → ZnCl₂ + H₂</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Reaction with Bases:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Some metals react with <span className="font-semibold text-red-600">strong bases</span> to form <span className="font-semibold text-orange-600">salt and hydrogen gas</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
                  Chemical Properties of Non-Metals
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Reaction with Oxygen:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Non-metals react with <span className="font-semibold text-teal-600">oxygen</span> to form <span className="font-semibold text-cyan-600">non-metallic oxides</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="font-semibold text-blue-600">Example:</span> <span className="text-indigo-600">C + O₂ → CO₂</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Reaction with Water:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Non-metals <span className="font-semibold text-cyan-600">generally do not react</span> with water.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Reaction with Acids:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Non-metals <span className="font-semibold text-blue-600">do not react</span> with <span className="font-semibold text-indigo-600">dilute acids</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Reaction with Bases:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Some <span className="font-semibold text-indigo-600">non-metallic oxides</span> react with <span className="font-semibold text-purple-600">bases</span> to form <span className="font-semibold text-pink-600">salt and water</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Uses of Metals
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Electrical wires</span> (<span className="font-semibold text-orange-600">copper</span>, <span className="font-semibold text-yellow-600">aluminium</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Machinery and vehicles</span> (<span className="font-semibold text-orange-600">iron</span>, <span className="font-semibold text-yellow-600">steel</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Jewellery</span> (<span className="font-semibold text-orange-600">gold</span>, <span className="font-semibold text-yellow-600">silver</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Construction</span> (<span className="font-semibold text-orange-600">iron</span>, <span className="font-semibold text-yellow-600">aluminium</span>)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Uses of Non-Metals
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li className="text-gray-600"><span className="font-semibold text-green-600">Oxygen</span> for <span className="font-semibold text-emerald-600">respiration</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-green-600">Nitrogen</span> for <span className="font-semibold text-emerald-600">fertilizers</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-green-600">Carbon</span> in <span className="font-semibold text-emerald-600">fuels and pencil lead</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-green-600">Sulphur</span> in <span className="font-semibold text-emerald-600">medicines and rubber processing</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Alloys
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">An <span className="font-semibold text-purple-600">alloy</span> is a <span className="font-semibold text-indigo-600">mixture of two or more metals</span>, or a <span className="font-semibold text-blue-600">metal and a non-metal</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-amber-600">Brass</span> (<span className="font-semibold text-orange-600">Copper + Zinc</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-yellow-600">Bronze</span> (<span className="font-semibold text-amber-600">Copper + Tin</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-red-600">Steel</span> (<span className="font-semibold text-orange-600">Iron + Carbon</span>)</li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : isPeriodicClassificationLesson ? (
            // Periodic Classification of Elements Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-indigo-200">
                  10. PERIODIC CLASSIFICATION OF ELEMENTS
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The periodic table is a <span className="font-semibold text-indigo-600">tabular arrangement of chemical elements</span>, organized based on their <span className="font-semibold text-purple-600">atomic number</span>, <span className="font-semibold text-pink-600">electron configuration</span>, and <span className="font-semibold text-rose-600">recurring chemical properties</span>. Elements are placed in <span className="font-semibold text-red-600">specific rows and columns</span> based on their properties, creating a <span className="font-semibold text-orange-600">systematic representation</span> of all known elements.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">This classification helps scientists <span className="font-semibold text-purple-600">predict the behavior of elements</span>, <span className="font-semibold text-pink-600">understand their relationships</span>, and <span className="font-semibold text-rose-600">identify patterns</span> that might not be immediately obvious.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The modern periodic table is divided into <span className="font-semibold text-pink-600">rows (called periods)</span> and <span className="font-semibold text-rose-600">columns (called groups or families)</span>. Each element within a group has <span className="font-semibold text-red-600">similar chemical and physical properties</span> because they share a <span className="font-semibold text-orange-600">similar valence electron configuration</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The periodic table continues to <span className="font-semibold text-rose-600">evolve as new elements are discovered</span> or <span className="font-semibold text-red-600">synthesized in laboratories</span>, <span className="font-semibold text-orange-600">expanding our knowledge</span> of chemistry.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Periodic table
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The periodic table is used to <span className="font-semibold text-blue-600">display all the elements</span> in an <span className="font-semibold text-indigo-600">organized way</span>. The modern periodic table of elements is based on <span className="font-semibold text-purple-600">atomic number and valency</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">In the modern periodic table, elements are arranged in the <span className="font-semibold text-indigo-600">increasing order of atomic numbers</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">The periodic table is classified into:</p>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Periods:</span> <span className="font-semibold text-pink-600">Horizontal rows</span> are called periods.</li>
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Groups:</span> <span className="font-semibold text-pink-600">Vertical columns</span> are called groups.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Modern periodic table
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Features</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Details</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gradient-to-r from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-blue-700">Total elements</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">118 elements</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-green-700">Total periods</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-green-600">7 periods</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-purple-700">Total groups</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-purple-600">18 groups</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
                  Position of metals and non-metals in the periodic table
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-600">Metals</span> are present on the <span className="font-semibold text-cyan-600">left side</span> of the table.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-600">Non-metals</span> are present on the <span className="font-semibold text-blue-600">right side</span> of the table.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Inert gases (noble gases)</span> are present in <span className="font-semibold text-indigo-600">group 18</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  NEWLANDS LAW OF OCTAVES
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">According to Newlands, when elements are arranged in the <span className="font-semibold text-amber-600">increasing order of their atomic masses</span>, <span className="font-semibold text-orange-600">every eighth element</span> has properties <span className="font-semibold text-yellow-600">similar to the first one</span>, similar to <span className="font-semibold text-red-600">musical notes</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Example:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Lithium (Li)</span> → <span className="font-semibold text-cyan-600">Sodium (Na)</span> → <span className="font-semibold text-indigo-600">Potassium (K)</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  MENDELEEV'S PERIODIC TABLE
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Mendeleev arranged elements in <span className="font-semibold text-purple-600">increasing order of atomic mass</span> and grouped them based on <span className="font-semibold text-indigo-600">similar physical and chemical properties</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">He <span className="font-semibold text-indigo-600">left blank spaces</span> for <span className="font-semibold text-pink-600">undiscovered elements</span> and <span className="font-semibold text-rose-600">predicted their properties</span> accurately.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  MODERN PERIODIC TABLE
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The modern periodic table is arranged based on <span className="font-semibold text-green-600">increasing atomic number</span> instead of <span className="font-semibold text-emerald-600">atomic mass</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">This <span className="font-semibold text-emerald-600">corrected the limitations</span> of earlier models and <span className="font-semibold text-teal-600">aligned the arrangement</span> with the <span className="font-semibold text-cyan-600">structure of the atom</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  ADVANTAGES OF THE MODERN PERIODIC TABLE
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Properties of elements depend on their <span className="font-semibold text-red-600">electronic configuration</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Elements in the <span className="font-semibold text-rose-600">same group</span> have <span className="font-semibold text-pink-600">similar chemical properties</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-pink-600">Metallic character</span> <span className="font-semibold text-red-600">decreases from left to right</span> and <span className="font-semibold text-orange-600">increases from top to bottom</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Non-metallic character</span> shows the <span className="font-semibold text-orange-600">opposite trend</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : isChemicalReactionsLesson ? (
            // Chemical Reactions Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
                  11. CHEMICAL REACTIONS
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">A chemical reaction is a process in which <span className="font-semibold text-red-600">one or more substances</span> undergo a <span className="font-semibold text-orange-600">chemical change</span> to form <span className="font-semibold text-yellow-600">new substances</span> with <span className="font-semibold text-amber-600">different properties</span>. Chemical reactions are all around us, from the <span className="font-semibold text-green-600">food we eat</span> to the <span className="font-semibold text-blue-600">rusting of iron</span> and the <span className="font-semibold text-purple-600">photosynthesis process</span> in plants.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">During a chemical reaction, the <span className="font-semibold text-orange-600">reactants</span> undergo changes, resulting in the formation of <span className="font-semibold text-yellow-600">products</span>. The substances that undergo <span className="font-semibold text-amber-600">chemical changes</span> are called <span className="font-semibold text-red-600">reactants</span>, and the <span className="font-semibold text-orange-600">newly formed substances</span> are known as <span className="font-semibold text-yellow-600">products</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Examples of chemical reactions
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Burning of magnesium ribbon:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-blue-600">Magnesium + Oxygen</span> → <span className="font-semibold text-indigo-600">Magnesium oxide</span></p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-indigo-600">2Mg + O₂ → 2MgO</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Rusting of iron:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-indigo-600">Iron + Oxygen + Water</span> → <span className="font-semibold text-purple-600">Rust</span></p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-purple-600">4Fe + 3O₂ + 6H₂O → 4Fe(OH)₃</span></p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Characteristics of chemical reactions
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Some of the <span className="font-semibold text-green-600">observable changes</span> that indicate a chemical reaction has occurred are:</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-base font-bold text-emerald-700 mb-2">Formation of a precipitate:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A <span className="font-semibold text-emerald-600">solid product (precipitate)</span> may form and <span className="font-semibold text-teal-600">settle down</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Example:</span> <span className="font-semibold text-cyan-600">Mixing lead nitrate and potassium iodide</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <h4 className="text-base font-bold text-teal-700 mb-2">Change in color:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Some reactions result in a <span className="font-semibold text-teal-600">change of color</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-600">Example:</span> <span className="font-semibold text-cyan-600">Rusting iron turns reddish brown</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Change in temperature:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Some chemical reactions <span className="font-semibold text-cyan-600">release or absorb heat</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <h4 className="text-base font-bold text-blue-700 mb-2">Evolution of gas:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">Some reactions <span className="font-semibold text-blue-600">release gases</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-600">Example:</span> <span className="font-semibold text-purple-600">Marble reacts with HCl to form CO₂</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Change in smell:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">Some reactions produce substances with a <span className="font-semibold text-indigo-600">different odor</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Types of chemical reactions
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <h4 className="text-base font-bold text-amber-700 mb-2">Combination reaction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-amber-600">Two or more substances</span> combine to form a <span className="font-semibold text-orange-600">single product</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-orange-600">Example: CaO + H₂O → Ca(OH)₂</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Decomposition reaction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A <span className="font-semibold text-orange-600">single compound</span> breaks down into <span className="font-semibold text-yellow-600">two or more simpler substances</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-yellow-600">Example: 2HgO → 2Hg + O₂</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <h4 className="text-base font-bold text-yellow-700 mb-2">Displacement reaction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">A <span className="font-semibold text-yellow-600">more reactive metal</span> displaces a <span className="font-semibold text-amber-600">less reactive metal</span> from its compound.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-amber-600">Example: CuSO₄ + Zn → ZnSO₄ + Cu</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <h4 className="text-base font-bold text-amber-700 mb-2">Double displacement reaction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-amber-600">Two compounds</span> exchange their ions to form <span className="font-semibold text-orange-600">new compounds</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-orange-600">Example: AgNO₃ + NaCl → AgCl + NaNO₃</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Oxidation reaction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-orange-600">Addition of oxygen</span> or <span className="font-semibold text-red-600">removal of hydrogen</span>.</p>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-red-600">Example: Mg + O₂ → MgO</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Reduction reaction:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Removal of oxygen</span> or <span className="font-semibold text-rose-600">addition of hydrogen</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Corrosion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Corrosion is the <span className="font-semibold text-red-600">slow destruction of metal</span> due to the reaction with <span className="font-semibold text-rose-600">moisture</span>, <span className="font-semibold text-pink-600">oxygen</span>, or <span className="font-semibold text-rose-600">chemicals</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Example:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-rose-600">Rusting of iron</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Prevention of corrosion
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Painting</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Greasing and oiling</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-purple-600">Galvanization</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-pink-600">Alloying</span></li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Rancidity
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">When <span className="font-semibold text-green-600">oils or fats</span> become <span className="font-semibold text-emerald-600">stale due to oxidation</span>, they produce a <span className="font-semibold text-teal-600">foul smell</span>; this process is called <span className="font-semibold text-cyan-600">rancidity</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
                  Prevention
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li className="text-gray-600"><span className="font-semibold text-teal-600">Keeping food in airtight containers</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Refrigeration</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">Adding antioxidants</span></li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : isAcidsBasesAndSaltsLesson ? (
            // Acids, Bases and Salts Content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 via-rose-600 to-red-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-pink-200">
                  12. ACIDS, BASES AND SALTS
                </h2>
                
                <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Acids, bases, and salts are <span className="font-semibold text-pink-600">important chemical substances</span> used in our daily life. They play a <span className="font-semibold text-rose-600">vital role</span> in the <span className="font-semibold text-red-600">food we eat</span>, <span className="font-semibold text-orange-600">medicines</span>, <span className="font-semibold text-amber-600">household products</span>, and <span className="font-semibold text-yellow-600">industries</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
                  Acids
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Acids are substances that have a <span className="font-semibold text-red-600">sour taste</span> and turn <span className="font-semibold text-rose-600">blue litmus red</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                    <h4 className="text-base font-bold text-rose-700 mb-2">Examples:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-yellow-600">Lemon juice</span>, <span className="font-semibold text-orange-600">vinegar</span>, <span className="font-semibold text-amber-600">curd</span>, <span className="font-semibold text-red-600">tamarind</span>, and <span className="font-semibold text-pink-600">oranges</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed mb-2">There are <span className="font-semibold text-pink-600">two types of acids</span>:</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                    <h4 className="text-base font-bold text-red-700 mb-2">Strong acids:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-600">Hydrochloric acid</span>, <span className="font-semibold text-orange-600">Sulphuric acid</span>, <span className="font-semibold text-amber-600">Nitric acid</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <h4 className="text-base font-bold text-orange-700 mb-2">Weak acids:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-600">Carbonic acid</span>, <span className="font-semibold text-amber-600">Acetic acid</span>, <span className="font-semibold text-yellow-600">Citric acid</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
                  Bases
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Bases are substances that taste <span className="font-semibold text-blue-600">bitter</span> and feel <span className="font-semibold text-indigo-600">soapy to touch</span>. They turn <span className="font-semibold text-purple-600">red litmus blue</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Examples:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-600">Baking soda</span>, <span className="font-semibold text-emerald-600">washing soda</span>, <span className="font-semibold text-teal-600">milk of magnesia</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h3 className="text-base font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                      Types of Bases:
                    </h3>
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <h4 className="text-base font-bold text-purple-700 mb-2">Strong bases:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-600">Sodium hydroxide (NaOH)</span>, <span className="font-semibold text-pink-600">Potassium hydroxide (KOH)</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Weak bases:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-pink-600">Magnesium hydroxide</span>, <span className="font-semibold text-rose-600">Ammonium hydroxide</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  Indicators
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Indicators are substances that show a <span className="font-semibold text-green-600">change in color</span> when added to an <span className="font-semibold text-emerald-600">acid or base</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <h4 className="text-base font-bold text-emerald-700 mb-2">Common indicators:</h4>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Indicators Table
                </h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm overflow-hidden">
                    <thead>
                      <tr className="bg-gradient-to-r from-amber-100 to-orange-100">
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">Indicator</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">In Acid</th>
                        <th className="border border-amber-300 px-4 py-3 text-left text-sm font-bold text-amber-800">In Base</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-gradient-to-r from-red-50 to-rose-50 hover:from-red-100 hover:to-rose-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-red-700">Litmus</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-red-600">Red</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-blue-600">Blue</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-yellow-700">Turmeric</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-yellow-600">Yellow</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-orange-600">Reddish brown</span></td>
                      </tr>
                      <tr className="bg-gradient-to-r from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 transition-colors">
                        <td className="border border-amber-200 px-4 py-3 text-sm font-semibold text-pink-700">Phenolphthalein</td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-gray-600">Colorless</span></td>
                        <td className="border border-amber-200 px-4 py-3 text-sm text-gray-700"><span className="font-semibold text-pink-600">Pink</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
                  Neutralization Reaction
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">When an <span className="font-semibold text-purple-600">acid reacts with a base</span>, they <span className="font-semibold text-indigo-600">cancel each other's effect</span> and form <span className="font-semibold text-pink-600">salt and water</span>. This reaction is called a <span className="font-semibold text-rose-600">neutralization reaction</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-pink-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                    <h4 className="text-base font-bold text-indigo-700 mb-2">Example:</h4>
                    <p className="text-gray-700 text-sm leading-relaxed font-mono bg-gray-100 p-2 rounded mt-2"><span className="text-indigo-600">HCl + NaOH → NaCl + H₂O</span></p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                    <h4 className="text-base font-bold text-pink-700 mb-2">Uses of neutralization reactions:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600">Used in <span className="font-semibold text-pink-600">treating insect bites</span>.</li>
                      <li className="text-gray-600">Used in <span className="font-semibold text-rose-600">agriculture</span> to neutralize <span className="font-semibold text-red-600">acidic soil</span>.</li>
                      <li className="text-gray-600">Used in <span className="font-semibold text-orange-600">factories</span> to treat <span className="font-semibold text-amber-600">acidic waste</span> before disposal.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
                  Salts
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Salts are formed when <span className="font-semibold text-teal-600">acids react with bases</span>. They may be <span className="font-semibold text-cyan-600">acidic</span>, <span className="font-semibold text-blue-600">basic</span>, or <span className="font-semibold text-indigo-600">neutral</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                    <h4 className="text-base font-bold text-cyan-700 mb-2">Examples:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-4 mt-2">
                      <li className="text-gray-600"><span className="font-semibold text-cyan-600">Sodium chloride</span> (<span className="font-semibold text-blue-600">table salt</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-indigo-600">Sodium carbonate</span> (<span className="font-semibold text-purple-600">washing soda</span>)</li>
                      <li className="text-gray-600"><span className="font-semibold text-pink-600">Sodium bicarbonate</span> (<span className="font-semibold text-rose-600">baking soda</span>)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
                  pH Scale
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-green-600">pH scale</span> measures how <span className="font-semibold text-emerald-600">acidic or basic</span> a substance is.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li className="text-gray-600"><span className="font-semibold text-red-600">pH less than 7</span> → <span className="font-semibold text-red-600">acidic</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-gray-600">pH equal to 7</span> → <span className="font-semibold text-gray-600">neutral</span></li>
                      <li className="text-gray-600"><span className="font-semibold text-blue-600">pH more than 7</span> → <span className="font-semibold text-blue-600">basic</span></li>
                    </ul>
                  </div>
                  
                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed">Values range from <span className="font-semibold text-teal-600">0 to 14</span>.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
                <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
                  Applications of acids, bases, and salts
                </h3>
                
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-600">Acids</span> are used in <span className="font-semibold text-orange-600">fertilizers</span>, <span className="font-semibold text-yellow-600">medicines</span>, and <span className="font-semibold text-red-600">food preservatives</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-600">Bases</span> are used in <span className="font-semibold text-yellow-600">soaps</span>, <span className="font-semibold text-amber-600">detergents</span>, and <span className="font-semibold text-red-600">paper industries</span>.</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                    <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-yellow-600">Salts</span> are used in <span className="font-semibold text-amber-600">cooking</span>, <span className="font-semibold text-orange-600">glass making</span>, and <span className="font-semibold text-red-600">fire extinguishers</span>.</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            // Default Chemistry lesson content
            <>
              <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300 -mt-[1px]">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-amber-200">
                  {activeLesson ? activeLesson.title : 'Chemistry Lesson'}
                </h2>
                <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
                  {activeLesson && activeLesson.content ? (
                    <div className="prose prose-stone max-w-none">
                      <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                        {activeLesson.content.split('\n\n').map((paragraph, index) => (
                          paragraph.trim() && (
                            <p key={index} className="mb-4 last:mb-0 text-gray-600 leading-6">
                              {paragraph.trim()}
                            </p>
                          )
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-600">Content will be available soon.</p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      );
    }
    
    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md mx-auto p-8">
            <div className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full mx-auto mb-4 flex items-center justify-center">
              <span className="text-red-500 text-2xl">⚠</span>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-2">Error Loading Content</h3>
            <p className="text-stone-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }
    
    if (isLoadingLessons) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-stone-600">Loading lessons from PDF...</p>
          </div>
        </div>
      );
    }

    if (activeLesson) {
      return (
        <div className="space-y-6">
          {/* Enhanced Lesson Header */}
          <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-8 border border-amber-200/50 shadow-xl overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-400 rounded-full blur-3xl"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <SubjectIcon className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-amber-900 mb-3 leading-tight">{activeLesson.title}</h1>
                  <p className="text-lg text-stone-700 mb-3 leading-relaxed">{activeSubject.summary}</p>
                  <div className="flex items-center gap-4 text-sm text-stone-600">
                    <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-lg">
                      <FileText className="w-4 h-4 text-amber-600" />
                      <span className="font-medium">Pages {activeLesson.pageStart} - {activeLesson.pageEnd}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Content Card */}
          <div className="bg-gradient-to-br from-white via-gray-50 to-stone-50 rounded-2xl p-6 shadow-lg border border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <div className="prose prose-stone max-w-none">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                {activeLesson.content.split('\n\n').map((paragraph, index) => (
                  paragraph.trim() && (
                    <p key={index} className="mb-4 last:mb-0 text-gray-600 leading-6">
                      {paragraph.trim().split(/(\b\w+\b)/g).map((word, wordIndex) => {
                        // Add colorful styling to key scientific terms
                        const scientificTerms = [
                          'photosynthesis', 'respiration', 'digestion', 'excretion', 'reproduction',
                          'mitochondria', 'chloroplast', 'nucleus', 'cell', 'tissue', 'organ',
                          'glucose', 'oxygen', 'carbon dioxide', 'ATP', 'DNA', 'RNA',
                          'enzyme', 'hormone', 'protein', 'carbohydrate', 'lipid', 'nucleic acid'
                        ];
                        const lowerWord = word.toLowerCase().trim();
                        if (scientificTerms.some(term => lowerWord.includes(term))) {
                          const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-pink-600', 'text-cyan-600', 'text-indigo-600'];
                          const colorIndex = scientificTerms.findIndex(term => lowerWord.includes(term)) % colors.length;
                          return <span key={wordIndex} className={`font-semibold ${colors[colorIndex]}`}>{word}</span>;
                        }
                        return word;
                      })}
                    </p>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Enhanced Subject Header */}
        <div className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-10 border border-amber-200/50 shadow-xl overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-56 h-56 bg-orange-400 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-300">
              <SubjectIcon className="w-10 h-10 text-white" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-5xl font-bold text-amber-900 mb-4 leading-tight">{activeSubject.name}</h1>
              <p className="text-xl text-stone-700 leading-relaxed max-w-3xl">{activeSubject.summary}</p>
            </div>
          </div>
        </div>

        {/* Enhanced Focus Areas Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-stone-200/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-amber-200">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-3xl font-bold text-stone-800">Core Focus Areas</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {activeSubject.focusAreas.map((area, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-200 hover:border-amber-300 hover:shadow-md transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>
                  <p className="flex-1 text-stone-700 font-medium leading-relaxed pt-1">{area}</p>
                </div>
                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-b-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderNotes = () => (
    <div className="space-y-6">
      {activeSubject.notes.map((section, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
          <h3 className="text-xl font-semibold text-amber-800 mb-4">{section.title}</h3>
          <ul className="space-y-3 text-stone-700">
            {section.points.map((point, pointIndex) => (
              <li key={pointIndex} className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderTextbook = () => {
    const handleOpenPdf = (fileName: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Use direct URL - HashRouter should not intercept files in public folder
      const encodedFileName = encodeURIComponent(fileName);
      // For HashRouter, we need to use the hash path correctly
      const currentPath = window.location.pathname;
      const baseUrl = window.location.origin;
      const pdfUrl = `${baseUrl}/${encodedFileName}`;
      
      // Try opening directly
      const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      
      // If window.open fails (blocked), try using location
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback: try fetching and using blob URL
        fetch(pdfUrl)
          .then(response => {
            if (response.ok) {
              return response.blob();
            }
            throw new Error(`HTTP ${response.status}`);
          })
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const fallbackWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
            if (fallbackWindow) {
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } else {
              alert('Please allow pop-ups to open the PDF.');
            }
          })
          .catch(error => {
            console.error('Error opening PDF:', error);
            alert('Failed to open PDF. Please try downloading it instead.');
          });
      }
    };

    const handleDownloadPdf = (fileName: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const encodedFileName = encodeURIComponent(fileName);
      const pdfUrl = `/${encodedFileName}`;
      
      // Create a direct download link
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">{activeSubject.name} - Textbook</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {activeSubject.resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-stone-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-amber-800 mb-3">{resource.title}</h3>
              <p className="text-sm text-stone-600 mb-6">{resource.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                  href={`/${encodeURIComponent(resource.fileName)}`}
                target="_blank"
                rel="noopener noreferrer"
                  onClick={(e) => handleOpenPdf(resource.fileName, e)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </a>
              <a
                  href={`/${encodeURIComponent(resource.fileName)}`}
                  download={resource.fileName}
                  onClick={(e) => handleDownloadPdf(resource.fileName, e)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-700 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  };

  const renderResources = () => {
    const handleOpenPdf = (fileName: string, e?: React.MouseEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      
      // Use direct URL - HashRouter should not intercept files in public folder
      const encodedFileName = encodeURIComponent(fileName);
      const baseUrl = window.location.origin;
      const pdfUrl = `${baseUrl}/${encodedFileName}`;
      
      // Try opening directly
      const newWindow = window.open(pdfUrl, '_blank', 'noopener,noreferrer');
      
      // If window.open fails (blocked), try using location
      if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
        // Fallback: try fetching and using blob URL
        fetch(pdfUrl)
          .then(response => {
            if (response.ok) {
              return response.blob();
            }
            throw new Error(`HTTP ${response.status}`);
          })
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            const fallbackWindow = window.open(blobUrl, '_blank', 'noopener,noreferrer');
            if (fallbackWindow) {
              setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } else {
              alert('Please allow pop-ups to open the PDF.');
            }
          })
          .catch(error => {
            console.error('Error opening PDF:', error);
            alert('Failed to open PDF. Please try downloading it instead.');
          });
      }
    };

    const handleDownloadPdf = (fileName: string, e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
      e.stopPropagation();
      
      const encodedFileName = encodeURIComponent(fileName);
      const pdfUrl = `/${encodedFileName}`;
      
      // Create a direct download link
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      link.target = '_blank';
      link.style.display = 'none';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">{activeSubject.name} - Textbooks</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {activeSubject.resources.map((resource, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md border border-stone-200 p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-amber-800 mb-3">{resource.title}</h3>
              <p className="text-sm text-stone-600 mb-6">{resource.description}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                  href={`/${encodeURIComponent(resource.fileName)}`}
                target="_blank"
                rel="noopener noreferrer"
                  onClick={(e) => handleOpenPdf(resource.fileName, e)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Open
              </a>
              <a
                  href={`/${encodeURIComponent(resource.fileName)}`}
                  download={resource.fileName}
                  onClick={(e) => handleDownloadPdf(resource.fileName, e)}
                className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-stone-600 text-white rounded-lg font-medium hover:bg-stone-700 transition-all duration-300 transform hover:scale-105"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
  };

  const renderVideos = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">{activeSubject.name} - Educational Videos</h2>
      {activeSubject.videos.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-md border border-stone-200">
          <Video className="w-12 h-12 mx-auto text-stone-300 mb-4" />
          <h3 className="text-xl font-semibold text-amber-800 mb-2">Video playlists coming soon</h3>
          <p className="text-stone-600">
            We are preparing curated YouTube playlists for {activeSubject.name}. Add your favourite videos to the backlog and we will include them here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {activeSubject.videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-lg p-6 shadow-md border border-stone-200 hover:shadow-lg transition-shadow"
            >
              <h3 className="text-lg font-semibold text-amber-800 mb-2">{video.title}</h3>
              <p className="text-sm text-stone-600">{video.description}</p>
              <span className="mt-4 inline-flex items-center text-amber-600 font-medium">
                Watch on YouTube
                <ExternalLink className="w-4 h-4 ml-1" />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const renderPapers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
        {activeSubject.name} - Model Papers
      </h2>
      
      {activeSubjectId === 'biology' ? (
        <div className="space-y-6">
          {/* Model Paper Header */}
          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-green-200/50">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent mb-2">
              BIOLOGY MODEL PAPER
            </h3>
            <div className="flex flex-wrap gap-4 text-sm text-gray-700 mt-4">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-green-700">Time:</span>
                <span className="text-gray-600">2 Hours</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-emerald-700">Maximum Marks:</span>
                <span className="text-gray-600">40</span>
              </div>
            </div>
          </div>

          {/* Section A */}
          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 shadow-lg border border-blue-200/50">
            <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-blue-200">
              Section – A (Short Answer Questions)
            </h4>
            <div className="space-y-3 text-sm text-gray-700 mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-blue-600">(Each question carries 2 marks)</span>
              </p>
              <p className="text-gray-600">
                Answer any <span className="font-semibold text-indigo-600">5</span> of the following.
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-purple-600">(5 × 2 = 10 Marks)</span>
              </p>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 font-medium">1. What are the components of food? Write any four.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-indigo-500">
                <p className="text-gray-700 font-medium">2. Define respiration. How is it different from breathing?</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-gray-700 font-medium">3. What is malnutrition? Write symptoms of kwashiorkor.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 font-medium">4. Write any two differences between unicellular and multicellular organisms.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-indigo-500">
                <p className="text-gray-700 font-medium">5. What are gymnosperms? Give two examples.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-gray-700 font-medium">6. What is blood? Name its main components.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 font-medium">7. Write a short note on osmosis with an example.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-indigo-500">
                <p className="text-gray-700 font-medium">8. Define vaccine and give two examples.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-purple-500">
                <p className="text-gray-700 font-medium">9. What is ecosystem? Name biotic and abiotic components.</p>
              </div>
            </div>
          </div>

          {/* Section B */}
          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-6 shadow-lg border border-amber-200/50">
            <h4 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-amber-200">
              Section – B (Long Answer Questions)
            </h4>
            <div className="space-y-3 text-sm text-gray-700 mb-4">
              <p className="text-gray-600">
                <span className="font-semibold text-amber-600">(Each question carries 7 marks)</span>
              </p>
              <p className="text-gray-600">
                Answer any <span className="font-semibold text-orange-600">5</span> of the following.
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-yellow-600">(Only 5 to be attempted. Total questions given: 7)</span>
              </p>
              <p className="text-gray-600">
                <span className="font-semibold text-amber-700">(5 × 7 = 35 Marks)</span>
              </p>
            </div>
            
            <div className="space-y-3 mt-4">
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-amber-500">
                <p className="text-gray-700 font-medium">1. Explain carbohydrates, proteins, fats, vitamins and minerals with examples and functions.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-gray-700 font-medium">2. Describe the process of respiration in plants and animals. Add diagrams where required.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-gray-700 font-medium">3. Explain reproduction in plants. Write differences between sexual and asexual reproduction.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-amber-500">
                <p className="text-gray-700 font-medium">4. Explain the human excretory system with a labeled diagram of the kidney and nephron.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-orange-500">
                <p className="text-gray-700 font-medium">5. Describe prokaryotic and eukaryotic cells. Write 5 differences and draw both diagrams.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-yellow-500">
                <p className="text-gray-700 font-medium">6. Explain food chain, food web and ecological pyramid with examples.</p>
              </div>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-amber-500">
                <p className="text-gray-700 font-medium">7. What is heredity? Explain Mendel's work and laws of inheritance with suitable examples.</p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-red-50 via-pink-50 to-rose-50 rounded-2xl p-6 shadow-lg border border-red-200/50">
            <h4 className="text-lg font-bold bg-gradient-to-r from-red-600 to-pink-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              Instructions for students:
            </h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold mt-0.5">•</span>
                <span className="text-gray-600">Draw diagrams wherever necessary.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-pink-600 font-bold mt-0.5">•</span>
                <span className="text-gray-600">Maintain neatness and proper labeling.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-600 font-bold mt-0.5">•</span>
                <span className="text-gray-600">Answer according to word limit.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">{activeSubject.name} model papers coming soon...</p>
      </div>
      )}
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-800 mb-4">{activeSubject.name} - Practice Quiz</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">{activeSubject.name} quiz coming soon...</p>
      </div>
    </div>
  );

  const renderSimulator = () => {
    // Biology simulators
    if (activeSubjectId === 'biology') {
      // Check if Respiration lesson is active
      const isRespirationLesson = activeLessonId === 'biology-lesson-3' || (activeLesson && activeLesson.title === 'Respiration');
      // Check if Reproduction lesson is active
      const isReproductionLesson = activeLessonId === 'biology-lesson-4' || (activeLesson && activeLesson.title === 'Reproduction');
      // Check if Excretion lesson is active
      const isExcretionLesson = activeLessonId === 'biology-lesson-5' || (activeLesson && activeLesson.title === 'Excretion');
      // Check if Transportation lesson is active
      const isTransportationLesson = activeLessonId === 'biology-lesson-7' || (activeLesson && activeLesson.title === 'Transportation');
      
      return (
    <div className="space-y-8 pb-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
              Biology - Interactive Simulators
            </h2>
            <p className="text-gray-600 text-sm">
              Explore biological structures in 3D. Click on parts to learn more about their functions.
            </p>
          </div>
          
          {/* Show Respiration simulators for Respiration chapter */}
          {isRespirationLesson ? (
            <div className="space-y-8">
              {/* Plant Stomata Structure */}
              <StomataSimulator />
              
              {/* Lung Animation */}
              <LungAnimationSimulator />
              
              {/* Respiratory System */}
              <RespiratorySystemSimulator />
              
              {/* Parrotfish Gill Anatomy */}
              <ParrotfishGillSimulator />
            </div>
          ) : isReproductionLesson ? (
            <div className="space-y-8">
              {/* Flower Anatomy Simulator */}
              <FlowerAnatomySimulator />
            </div>
          ) : isExcretionLesson ? (
            <div className="space-y-8">
              {/* Urinary System */}
              <UrinarySystemSimulator />
              
              {/* Human Kidney Anatomy Cross Section */}
              <KidneyAnatomySimulator />
              
              {/* Kidney Nephron Structure Anatomy */}
              <KidneyNephronSimulator />
            </div>
          ) : isTransportationLesson ? (
            <div className="space-y-8">
              {/* Human Heart */}
              <HumanHeartSimulator />
              
              {/* Photosynthesis and Plant Anatomy */}
              <PhotosynthesisPlantAnatomySimulator />
            </div>
          ) : (
            <>
              {/* Chloroplast Simulator */}
              <ChloroplastSimulator />
              
              {/* Future simulators can be added here */}
            </>
          )}
        </div>
      );
    }
    
    // Physics and Chemistry simulators (coming soon)
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent mb-2">
            {activeSubject.name} - Interactive Simulators
          </h2>
          <p className="text-gray-600 text-sm">
            {activeSubject.name} simulators are coming soon. Check back for exciting interactive learning tools!
          </p>
        </div>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
          <div className="text-center py-8">
            <Cpu className="w-16 h-16 mx-auto text-stone-300 mb-4" />
            <p className="text-stone-700 font-medium">{activeSubject.name} simulators coming soon...</p>
            <p className="text-stone-500 text-sm mt-2">We're working on bringing you amazing interactive experiences!</p>
          </div>
      </div>
    </div>
  );
  };

  const renderAssistant = () => {
    const currentChapterName = activeLesson 
      ? `${activeSubject.name} - ${activeLesson.title}`
      : `${activeSubject.name} - Overview`;

    return (
      <div className="h-full w-full">
        <ScienceRAG
          apiKey={GEMINI_API_KEY}
          currentChapter={currentChapterName}
          currentSubject={activeSubjectId}
          pdfFile={pdfFile}
          onPdfLoaded={setIsPdfLoaded}
        />
      </div>
    );
  };

  const renderMainContent = () => {
    try {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'textbook':
        return renderTextbook();
      case 'notes':
        return renderNotes();
      case 'resources':
        return renderResources();
      case 'videos':
        return renderVideos();
      case 'papers':
        return renderPapers();
      case 'quiz':
        return renderQuiz();
      case 'simulator':
        return renderSimulator();
      case 'assistant':
        return renderAssistant();
      default:
        return renderOverview();
      }
    } catch (err) {
      console.error('Error rendering main content:', err);
      return (
        <div className="p-8 text-center">
          <p className="text-red-600 mb-4">An error occurred while loading content.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
          >
            Refresh Page
          </button>
        </div>
      );
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-amber-50 via-stone-50 to-orange-50 relative flex flex-col">
      <CursorTrail />
      {/* Floating Science Symbols */}
      <FloatingSymbol icon={Atom} className="top-20 left-1/6" delay={0} />
      <FloatingSymbol icon={Atom} className="top-2/3 right-1/5" delay={4} />
      <FloatingSymbol icon={Microscope} className="top-1/2 left-1/12" delay={8} />
      <FloatingSymbol icon={FlaskRound} className="bottom-1/4 right-1/6" delay={12} />
      <FloatingSymbol icon={Beaker} className="top-1/3 right-1/4" delay={1} />
      <FloatingSymbol icon={Beaker} className="bottom-1/5 left-1/4" delay={5} />
      <FloatingSymbol icon={Dna} className="top-3/4 left-1/8" delay={9} />
      <FloatingSymbol icon={Zap} className="top-1/4 right-1/8" delay={13} />
      <FloatingSymbol icon={Microscope} className="top-1/4 left-1/4" delay={2} />
      <FloatingSymbol icon={Microscope} className="bottom-1/3 right-1/4" delay={6} />
      <FloatingSymbol icon={FlaskRound} className="top-1/2 right-1/6" delay={10} />
      <FloatingSymbol icon={Atom} className="bottom-1/6 left-1/6" delay={14} />
      
      {/* Back to Home Button */}
      <button
        onClick={handleBackToHome}
        className="fixed top-4 right-4 z-50 flex items-center px-4 py-2 bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 hover:shadow-md hover:scale-105 active:scale-95 transition-all duration-300 ease-out font-medium"
        title="Back to Home"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-amber-100 to-stone-100 border-b border-stone-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-amber-800 mb-1">
                Science • Biology, Physics, and Chemistry
              </h1>
              <p className="text-sm text-stone-600">
                Structured notes, complete textbooks, and curated media—everything you need to master each branch of science.
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
              className={`hidden lg:flex items-center gap-1.5 pb-1.5 border-b-2 border-transparent text-amber-700 hover:text-amber-800 hover:scale-105 active:scale-95 transition-all duration-300 px-2.5 py-0.5 rounded-lg text-sm ${
                sidebarOpen 
                  ? 'bg-amber-100 border-amber-300 font-semibold' 
                  : 'bg-amber-50 hover:bg-amber-100'
              }`}
            >
              <GraduationCap 
                size={18} 
                className={`transition-transform duration-300 text-blue-600 ${
                  sidebarOpen ? 'rotate-90' : 'rotate-0'
                }`}
              />
              <span className="transition-all duration-300">
                Subjects
              </span>
            </button>
            <div className="flex gap-6 ml-8">
              <button
                onClick={() => handleTabChange('overview')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none text-sm ${
                  activeTab === 'overview' 
                    ? 'border-amber-500 text-amber-600 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <LayoutDashboard size={18} className="text-amber-600" />
                Overview
              </button>
              <button
                onClick={() => handleTabChange('textbook')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'textbook' 
                    ? 'border-amber-500 text-amber-600 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <BookText size={18} className="text-red-700" />
                Textbook
              </button>
              <button
                onClick={() => handleTabChange('videos')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'videos' 
                    ? 'border-amber-500 text-amber-600 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <PlayCircle size={18} className="text-red-600" />
                Videos
              </button>
              <button
                onClick={() => handleTabChange('papers')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'papers' 
                    ? 'border-amber-500 text-amber-600 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <ClipboardCheck size={18} className="text-green-600" />
                Model Papers
              </button>
              <button
                onClick={() => handleTabChange('quiz')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'quiz' 
                    ? 'border-amber-500 text-amber-600 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <Trophy size={18} className="text-yellow-600" />
                Quiz
              </button>
              <button
                onClick={() => handleTabChange('simulator')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'simulator' 
                    ? 'border-amber-500 text-amber-600 font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <Cpu size={18} className="text-purple-600" />
                Simulator
              </button>
              <button
                onClick={() => handleTabChange('assistant')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'assistant' 
                    ? 'border-blue-500 text-blue-600 bg-blue-50 px-3 py-1 rounded-lg font-semibold' 
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <Sparkles size={18} className="text-cyan-600" />
                Assistant
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex min-h-0">
          {/* Left Panel - Sidebar */}
          <div className={`bg-white border-r border-stone-200 transition-all duration-500 ease-in-out transform ${
            sidebarOpen ? 'w-80 opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-full'
          } overflow-hidden hidden lg:block`}>
            <div className={`h-full overflow-y-auto p-4 transition-all duration-700 ease-out ${
              sidebarOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}>
              <div className="space-y-2">
                <SubjectDropdown 
                  title="Biology" 
                  isExpanded={expandedSections.biology}
                  onToggle={() => toggleSection('biology')}
                >
                  <div>
                    {isLoadingLessons ? (
                      <div className="p-4 text-center text-stone-500 text-sm">Loading lessons...</div>
                    ) : lessons.biology.length > 0 ? (
                      lessons.biology.map((lesson, index) => (
                        <ChapterItem
                          key={lesson.id}
                          title={lesson.title}
                          active={activeLessonId === lesson.id && activeSubjectId === 'biology'}
                          onClick={() => {
                            setActiveSubjectId('biology');
                            setActiveLessonId(lesson.id);
                            setActiveTab('overview');
                          }}
                          delay={(index + 1) * 100}
                          number={index + 1}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-stone-500 text-sm">No lessons found</div>
                    )}
                  </div>
                </SubjectDropdown>

                <SubjectDropdown 
                  title="Physics" 
                  isExpanded={expandedSections.physics}
                  onToggle={() => toggleSection('physics')}
                >
                  <div>
                    {isLoadingLessons ? (
                      <div className="p-4 text-center text-stone-500 text-sm">Loading lessons...</div>
                    ) : lessons.physics.length > 0 ? (
                      lessons.physics.map((lesson, index) => (
                        <ChapterItem
                          key={lesson.id}
                          title={lesson.title}
                          active={activeLessonId === lesson.id && activeSubjectId === 'physics'}
                          onClick={() => {
                            setActiveSubjectId('physics');
                            setActiveLessonId(lesson.id);
                            setActiveTab('overview');
                          }}
                          delay={(index + 1) * 100}
                          number={index + 1}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-stone-500 text-sm">No lessons found</div>
                    )}
                  </div>
                </SubjectDropdown>

                <SubjectDropdown 
                  title="Chemistry" 
                  isExpanded={expandedSections.chemistry}
                  onToggle={() => toggleSection('chemistry')}
                >
                  <div>
                    {isLoadingLessons ? (
                      <div className="p-4 text-center text-stone-500 text-sm">Loading lessons...</div>
                    ) : lessons.chemistry.length > 0 ? (
                      lessons.chemistry.map((lesson, index) => (
                        <ChapterItem
                          key={lesson.id}
                          title={lesson.title}
                          active={activeLessonId === lesson.id && activeSubjectId === 'chemistry'}
                          onClick={() => {
                            setActiveSubjectId('chemistry');
                            setActiveLessonId(lesson.id);
                            setActiveTab('overview');
                          }}
                          delay={(index + 1) * 100}
                          number={index + 1}
                        />
                      ))
                    ) : (
                      <div className="p-4 text-center text-stone-500 text-sm">No lessons found</div>
                    )}
                  </div>
                </SubjectDropdown>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className={`flex-1 overflow-hidden min-h-0 ${activeTab === 'assistant' ? '' : 'overflow-y-auto scrollbar-hide'}`}>
            {activeTab === 'assistant' ? (
              renderMainContent()
            ) : (
              <div className="pt-0 px-6 pb-6">
                  {renderMainContent()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SciencePage;
