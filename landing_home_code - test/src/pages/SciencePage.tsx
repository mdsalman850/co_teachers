import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  ArrowLeft,
  Atom,
  BookOpen,
  Download,
  ExternalLink,
  FileText,
  FlaskRound,
  Microscope,
  MessageSquare,
  Play,
  Video
} from 'lucide-react';

type ScienceTab = 'syllabus' | 'notes' | 'videos' | 'assistant';

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
  syllabus: {
    title: string;
    topics: string[];
  };
}

const getPdfUrl = (fileName: string) => encodeURI(`/${fileName}`).replace(/&/g, '%26');

const scienceSubjects: ScienceSubject[] = [
  {
    id: 'biology',
    name: 'Biology',
    accent: 'text-green-600',
    icon: Microscope,
    summary: 'Dive into living systems, from cellular structures to ecosystems, with easy-to-follow explanations and diagrams.',
    focusAreas: [
      'Life processes and cellular biology',
      'Human anatomy and physiology',
      'Plant biology and reproduction',
      'Ecology and environmental science'
    ],
    notes: [
      {
        title: 'How to use these notes',
        points: [
          'Skim the chapter summary first, then scan diagrams and key terms.',
          'Use quick self-quizzes after each unit; aim for short, spaced recall.',
          'Practice labelling diagrams (cell, leaf, heart) from memory.',
          'Connect processes (e.g., photosynthesis ⇄ respiration) in a single map.'
        ]
      }
    ],
    resources: [
      {
        title: 'Biology Complete Textbook',
        description: 'Full syllabus coverage with chapter-wise summaries, diagrams, and review questions.',
        fileName: 'FINAL BIOLOGY AICU TEXTBOOK.pdf'
      }
    ],
    videos: [],
    syllabus: {
      title: 'Syllabus overview (from Biology textbook)',
      topics: [
        'Cell: structure, organelles and functions',
        'Tissues and organization in plants and animals',
        'Nutrition in plants and humans',
        'Respiration and excretion',
        'Transport in plants (xylem/phloem) and circulatory system',
        'Reproduction in plants and humans; heredity basics',
        'Health, disease and hygiene',
        'Ecosystems, food chains and environmental awareness'
      ]
    }
  },
  {
    id: 'physics',
    name: 'Physics',
    accent: 'text-sky-600',
    icon: Atom,
    summary: 'Understand the laws of motion, energy, light, and electricity with worked examples and practical applications.',
    focusAreas: [
      'Motion, force, and energy concepts',
      'Heat, light, and sound fundamentals',
      'Electric circuits and magnetism',
      'Everyday applications of physics principles'
    ],
    notes: [
      {
        title: 'Quick study roadmap',
        points: [
          'Build a compact formula sheet as you progress.',
          'Do one conceptual question + one numeric per topic daily.',
          'Relate each law to a real-world example (friction, levers, lenses).',
          'Redraw circuit diagrams and trace current flow direction.'
        ]
      }
    ],
    resources: [
      {
        title: 'Physics Units (from combined text)',
        description: 'Physics chapters from the combined Physics & Chemistry textbook.',
        fileName: 'FINAL AICU PHY & CHEMISTRY SCIENCE TEXT BOOK.pdf'
      }
    ],
    videos: [],
    syllabus: {
      title: 'Syllabus overview (from Physics units)',
      topics: [
        'Measurement, units and basics of motion',
        'Force, pressure and simple machines',
        'Work, energy and power',
        'Heat and temperature; expansion; transfer of heat',
        'Light: reflection, refraction and lenses',
        'Sound: production, propagation and characteristics',
        'Electricity: circuits, resistance and safety',
        'Magnetism and electromagnetism basics'
      ]
    }
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    accent: 'text-amber-600',
    icon: FlaskRound,
    summary: 'Explore the building blocks of matter, chemical reactions, and lab techniques with practice-based notes.',
    focusAreas: [
      'Atomic structure and periodic classification',
      'Chemical bonding and reactions',
      'Acids, bases, and salts in daily life',
      'Basic laboratory practices and safety'
    ],
    notes: [
      {
        title: 'Revision strategy',
        points: [
          'Memorise core definitions (atom, isotope, valency) with flashcards.',
          'Balance one chemical equation daily; track tricky ones separately.',
          'Review common lab apparatus and safety symbols.',
          'Group properties by periodic trends to spot patterns.'
        ]
      }
    ],
    resources: [
      {
        title: 'Chemistry Units (from combined text)',
        description: 'Chemistry chapters from the combined Physics & Chemistry textbook.',
        fileName: 'FINAL AICU PHY & CHEMISTRY SCIENCE TEXT BOOK.pdf'
      }
    ],
    videos: [],
    syllabus: {
      title: 'Syllabus overview (from Chemistry units)',
      topics: [
        'Matter and its states; physical vs chemical changes',
        'Atomic structure; elements, compounds and mixtures',
        'Periodic table: groups, periods and trends',
        'Chemical bonding; basic reactions and equations',
        'Acids, bases, salts and indicators',
        'Metals and non-metals; everyday applications',
        'Separation techniques and purity',
        'Intro to lab safety and good practices'
      ]
    }
  }
];

const tabs: { id: ScienceTab; label: string; icon: LucideIcon }[] = [
  { id: 'syllabus', label: 'Syllabus', icon: BookOpen },
  { id: 'notes', label: 'Notes', icon: FileText },
  { id: 'videos', label: 'Videos', icon: Video },
  { id: 'assistant', label: 'Assistant', icon: MessageSquare }
];

const SciencePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeSubjectId, setActiveSubjectId] = useState<ScienceSubject['id']>('biology');
  const [activeTab, setActiveTab] = useState<ScienceTab>('syllabus');

  const activeSubject = useMemo(
    () => scienceSubjects.find(subject => subject.id === activeSubjectId) ?? scienceSubjects[0],
    [activeSubjectId]
  );

  const handleBackToHome = () => {
    navigate('/home');
  };

  const renderSyllabus = () => (
    <div className="p-8 space-y-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">{activeSubject.syllabus.title}</h3>
        <ul className="grid gap-3 md:grid-cols-2 text-gray-700">
          {activeSubject.syllabus.topics.map((topic, i) => (
            <li key={i} className="flex items-start space-x-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{topic}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
        <h4 className="text-lg font-semibold text-gray-800 mb-3">Open syllabus PDF</h4>
        {activeSubject.resources.map((resource, index) => (
          <div key={index} className="flex flex-col sm:flex-row gap-3">
            <a
              href={getPdfUrl(resource.fileName)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Open {resource.title}
            </a>
            <a
              href={getPdfUrl(resource.fileName)}
              download
              className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="p-8 space-y-6">
      {activeSubject.notes.map((section, index) => (
        <div key={index} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">{section.title}</h3>
          <ul className="space-y-3 text-gray-600">
            {section.points.map((point, pointIndex) => (
              <li key={pointIndex} className="flex items-start space-x-3">
                <span className="mt-1 h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  const renderVideos = () => (
    <div className="p-8">
      {activeSubject.videos.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
          <Play className="w-12 h-12 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Add YouTube playlists</h3>
          <p className="text-gray-600">Share links for {activeSubject.name}, and I’ll embed them here with thumbnails.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {activeSubject.videos.map((video, index) => (
            <a
              key={index}
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{video.title}</h3>
              <p className="text-sm text-gray-600">{video.description}</p>
              <span className="mt-4 inline-flex items-center text-emerald-600 font-medium">
                Watch on YouTube
                <ExternalLink className="w-4 h-4 ml-1" />
              </span>
            </a>
          ))}
        </div>
      )}
    </div>
  );

  const renderAssistant = () => (
    <div className="p-8">
      <div className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm text-center">
        <MessageSquare className="w-12 h-12 mx-auto text-emerald-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Chat with the PDF assistant</h3>
        <p className="text-gray-600 mb-6">Launch the AI assistant to ask questions about {activeSubject.name}. It uses the Science textbooks you provided.</p>
        <button
          onClick={() => window.open('/src/social_page/dist/index.html', '_blank')}
          className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Open Assistant
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'syllabus':
        return renderSyllabus();
      case 'notes':
        return renderNotes();
      case 'videos':
        return renderVideos();
      case 'assistant':
        return renderAssistant();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <button
        onClick={handleBackToHome}
        className="fixed top-4 right-4 z-50 flex items-center px-4 py-2 bg-white text-gray-700 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Home
      </button>

      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Science • Biology, Physics, and Chemistry</h1>
          <p className="text-sm text-gray-600 mt-2">
            Syllabus topics, concise notes, video playlists, and an AI assistant—organized by branch.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-80">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 divide-y divide-gray-100">
              {scienceSubjects.map(subject => {
                const Icon = subject.icon;
                const isActive = subject.id === activeSubjectId;
                return (
                  <button
                    key={subject.id}
                    onClick={() => setActiveSubjectId(subject.id)}
                    className={`w-full flex items-center justify-between px-5 py-4 transition-colors ${
                      isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-600' : subject.accent}`} />
                      <span>{subject.name}</span>
                    </span>
                    <span className="text-xs uppercase tracking-wide text-gray-400">Explore</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
              <nav className="flex flex-wrap border-b border-gray-100 bg-gray-50">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = tab.id === activeTab;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 px-5 py-4 text-sm font-medium transition-colors ${
                        isActive ? 'text-emerald-600 bg-white border-b-2 border-emerald-500' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
              <div className="bg-white">{renderContent()}</div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default SciencePage;


