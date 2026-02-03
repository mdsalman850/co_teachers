import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Sigma,
  BookOpen,
  FileText,
  Video,
  MessageSquare,
  Monitor,
  ChevronDown,
  GraduationCap,
  LayoutDashboard,
  BookText,
  PlayCircle,
  ClipboardCheck,
  Trophy,
  Cpu,
  Sparkles
} from 'lucide-react';
import CursorTrail from '../components/CursorTrail';

type MathTab = 'overview' | 'textbook' | 'videos' | 'papers' | 'quiz' | 'simulator' | 'assistant';

interface MathLesson {
  id: string;
  title: string;
}

const FloatingSymbol = ({ icon: Icon, className, delay = 0 }: { icon: any, className: string, delay?: number }) => (
  <div 
    className={`absolute opacity-25 animate-float-gentle ${className}`}
    style={{ animationDelay: `${delay}s` }}
  >
    <Icon 
      size={64} 
      className="text-red-200/40 stroke-1" 
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
        ? 'bg-gradient-to-r from-red-100 to-orange-100 border-l-3 border-red-400 shadow-md scale-105'
        : 'bg-transparent hover:bg-white/60'
    }`}
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-center py-3 px-6 relative">
      <div className={`flex-1 font-medium transition-all duration-300 ${
        active 
          ? 'text-red-800 font-semibold' 
          : 'text-stone-700 group-hover:text-stone-900'
      }`}>
        {number && `${number}. `}{title}
      </div>
      {active && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-red-400 to-orange-400 rounded-r-full animate-pulse"></div>
      )}
    </div>
  </button>
);

// Math chapters/lessons
const mathLessons: MathLesson[] = [
  { id: 'math-lesson-1', title: 'Basics of Mathematics' },
  { id: 'math-lesson-2', title: 'Number System' },
  { id: 'math-lesson-3', title: 'Fundamental Operations on Mathematics' },
  { id: 'math-lesson-4', title: 'Types of Numbers' },
  { id: 'math-lesson-5', title: 'Integers with Operations' },
  { id: 'math-lesson-6', title: 'Factors and Multiples (H.C.F and L.C.M)' },
  { id: 'math-lesson-7', title: 'Difference Between Measurements' },
  { id: 'math-lesson-8', title: 'Time' },
  { id: 'math-lesson-9', title: 'Decimals' },
  { id: 'math-lesson-10', title: 'Fractions' },
  { id: 'math-lesson-11', title: 'Simple Equations' },
  { id: 'math-lesson-12', title: 'Ratio and Proportion' },
  { id: 'math-lesson-13', title: 'Percentages, Profit and Loss' },
  { id: 'math-lesson-14', title: 'Simple Interest' },
  { id: 'math-lesson-15', title: 'Algebraic Expressions' },
  { id: 'math-lesson-16', title: 'Linear Equations' },
  { id: 'math-lesson-17', title: 'Geometry' },
  { id: 'math-lesson-18', title: 'Lines and Angles' },
  { id: 'math-lesson-19', title: 'Triangles' },
  { id: 'math-lesson-20', title: 'Quadrilaterals' },
  { id: 'math-lesson-21', title: 'Perimeter and Area' },
  { id: 'math-lesson-22', title: 'Volume and Surface Area' },
  { id: 'math-lesson-23', title: 'Data Handling' },
  { id: 'math-lesson-24', title: 'Probability' },
  { id: 'math-lesson-25', title: 'Coordinate Geometry' },
  { id: 'math-lesson-26', title: 'Symmetry' },
  { id: 'math-lesson-27', title: 'Patterns' },
  { id: 'math-lesson-28', title: 'Revision and Model Paper' }
];

const MathPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<MathTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeLessonId, setActiveLessonId] = useState<string>(mathLessons[0].id);

  const activeLesson = mathLessons.find(l => l.id === activeLessonId) || mathLessons[0];

  const handleBackToHome = () => {
    navigate('/home');
  };

  const handleTabChange = (tab: MathTab) => {
    setActiveTab(tab);
  };

  const renderOverview = () => {
    const isBasicsLesson = activeLessonId === 'math-lesson-1' || activeLesson.title === 'Basics of Mathematics';
    const isNumberSystemLesson = activeLessonId === 'math-lesson-2' || activeLesson.title === 'Number System';
    const isFundamentalOpsLesson = activeLessonId === 'math-lesson-3' || activeLesson.title === 'Fundamental Operations on Mathematics';
    const isTypesOfNumbersLesson = activeLessonId === 'math-lesson-4' || activeLesson.title === 'Types of Numbers';
    const isIntegersLesson = activeLessonId === 'math-lesson-5' || activeLesson.title === 'Integers with Operations';
    const isFactorsMultiplesLesson = activeLessonId === 'math-lesson-6' || activeLesson.title === 'Factors and Multiples (H.C.F and L.C.M)';
    const isMeasurementsLesson = activeLessonId === 'math-lesson-7' || activeLesson.title === 'Difference Between Measurements';
    const isTimeLesson = activeLessonId === 'math-lesson-8' || activeLesson.title === 'Time';
    const isDecimalsLesson = activeLessonId === 'math-lesson-9' || activeLesson.title === 'Decimals';
    const isFractionsLesson = activeLessonId === 'math-lesson-10' || activeLesson.title === 'Fractions';
    const isSimpleEquationsLesson = activeLessonId === 'math-lesson-11' || activeLesson.title === 'Simple Equations';
    const isRatioProportionLesson = activeLessonId === 'math-lesson-12' || activeLesson.title === 'Ratio and Proportion';
    const isPercentagesProfitLossLesson = activeLessonId === 'math-lesson-13' || activeLesson.title === 'Profit and Loss' || activeLesson.title === 'Percentages' || activeLesson.title === 'Percentages, Profit and Loss';
    const isSimpleInterestLesson = activeLessonId === 'math-lesson-14' || activeLesson.title === 'Simple Interest';
    const isAlgebraicExpressionsLesson = activeLessonId === 'math-lesson-15' || activeLesson.title === 'Algebraic Expressions';
    const isLinearEquationsLesson = activeLessonId === 'math-lesson-16' || activeLesson.title === 'Linear Equations';

    if (isBasicsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              1. BASICS OF MATHEMATICS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">Mathematics is a subject that deals with <span className="font-semibold text-blue-600">numbers</span>, <span className="font-semibold text-green-600">shapes</span>, <span className="font-semibold text-purple-600">patterns</span>, and <span className="font-semibold text-orange-600">logical thinking</span>. It helps us solve problems in our daily lives such as <span className="font-semibold text-cyan-600">counting money</span>, <span className="font-semibold text-pink-600">measuring objects</span>, and <span className="font-semibold text-indigo-600">telling time</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Place Value
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Place value tells us the value of a digit based on its position in a number.</p>
              <div className="bg-white/60 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-gray-700 font-semibold mb-2">Example:</p>
                <p className="text-gray-600 mb-3">In the number <span className="font-bold text-blue-600">4,582</span></p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Digit</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Position</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">4</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Thousands</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">4000</td>
                      </tr>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">5</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Hundreds</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">500</td>
                      </tr>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">8</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Tens</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">80</td>
                      </tr>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">2</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm">Ones</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">2</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Face Value
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Face value is the value of the digit itself. It does not change based on position.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-700">Example:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">In <span className="font-bold text-green-600">673</span>, the face value of <span className="font-bold text-emerald-600">7</span> is <span className="font-bold text-teal-600">7</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Expanded Form
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Writing a number by showing the value of each digit.</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">Example:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-bold text-purple-600">5,321</span> = <span className="font-semibold text-pink-600">5000 + 300 + 20 + 1</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-orange-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-orange-200">
              Ascending Order
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Arranging numbers from smallest to largest.</p>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-700">Example:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-bold text-orange-600">14, 25, 32, 48</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Descending Order
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Arranging numbers from largest to smallest.</p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-700">Example:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-bold text-red-600">48, 32, 25, 14</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Rounding Off Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Rounding makes a number simpler but keeps its value close to the original.</p>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Rules:</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">•</span>
                    <span>If the digit is <span className="font-semibold text-cyan-600">5 or more</span>, increase the previous digit by <span className="font-semibold text-blue-600">1</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>If the digit is <span className="font-semibold text-indigo-600">less than 5</span>, keep the previous digit the <span className="font-semibold text-cyan-600">same</span></span>
                  </li>
                </ul>
                <p className="text-gray-700 text-sm leading-relaxed mt-3"><span className="font-semibold text-cyan-700">Example:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Rounding <span className="font-bold text-cyan-600">67</span> to the nearest ten → <span className="font-bold text-blue-600">70</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Even and Odd Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-violet-600">Even numbers</span> end in <span className="font-bold text-purple-600">0, 2, 4, 6, 8</span></p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-600">Odd numbers</span> end in <span className="font-bold text-blue-600">1, 3, 5, 7, 9</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Roman Numerals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Roman</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Number</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">I</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">1</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">V</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">5</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">X</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">10</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">L</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">50</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">C</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">100</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">D</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">500</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">M</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">1000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Rules:</p>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>When a <span className="font-semibold text-amber-600">smaller numeral</span> is placed <span className="font-semibold text-orange-600">before</span> a larger one, we <span className="font-semibold text-red-600">subtract</span>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold mt-0.5">•</span>
                    <span className="text-gray-600 italic">Example: <span className="font-bold text-amber-600">IV</span> = 5 − 1 = <span className="font-bold text-orange-600">4</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-600 font-bold mt-0.5">•</span>
                    <span>When a <span className="font-semibold text-red-600">smaller numeral</span> is placed <span className="font-semibold text-pink-600">after</span> a larger one, we <span className="font-semibold text-green-600">add</span>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold mt-0.5">•</span>
                    <span className="text-gray-600 italic">Example: <span className="font-bold text-red-600">VI</span> = 5 + 1 = <span className="font-bold text-pink-600">6</span></span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isNumberSystemLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              2. NUMBER SYSTEM
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">There are <span className="font-semibold text-blue-600">two types</span> of number systems:</p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-red-600 font-bold mt-0.5">•</span>
                  <span><span className="font-semibold text-red-600">Indian place value system</span></span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-600 font-bold mt-0.5">•</span>
                  <span><span className="font-semibold text-orange-600">International place value system</span></span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              1. Indian Place Value System
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">The <span className="font-semibold text-green-600">Indian system</span> of numeration is used in the <span className="font-semibold text-emerald-600">Indian subcontinent</span> to express large numbers. This system is also called the <span className="font-semibold text-teal-600">Hindu-Arabic numeral system</span>.</p>
              
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <h4 className="text-base font-bold text-green-700 mb-2">Period:</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">In the Indian system, the periods from right to left are:</p>
                <ul className="space-y-1 ml-4 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-green-600">ones</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-emerald-600">thousands</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-teal-600">lakhs</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-cyan-600">crores</span></span>
                  </li>
                </ul>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">The <span className="font-semibold text-green-600">first three places</span> make the <span className="font-semibold text-emerald-600">ones</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-teal-600">next two places</span> make up the <span className="font-semibold text-cyan-600">thousands</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-blue-600">next two places after thousands</span> make the <span className="font-semibold text-indigo-600">lakhs</span> period.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">The periods are separated by a <span className="font-semibold text-green-600">comma (,)</span> in a given number.</p>
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm mt-4">
                <h4 className="text-base font-bold text-blue-700 mb-2">Examples:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">(i).</span>
                    <span><span className="font-bold text-blue-600">456</span> = Four hundred and fifty-six.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">(ii).</span>
                    <span><span className="font-bold text-indigo-600">3,482</span> = Three thousand four hundred and eighty-two</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">(iii).</span>
                    <span><span className="font-bold text-purple-600">12,980</span> = Twelve thousand nine hundred and eighty.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">(iv).</span>
                    <span><span className="font-bold text-pink-600">2,34,450</span> = Two lakhs, thirty-four thousand, four hundred fifty</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              EXERCISE - Indian System
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <h4 className="text-base font-bold text-amber-700 mb-2">I. Write the numbers for the following:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">(i) 342, (ii) 234 (iii) 890 (iv) 3421 (v) 4523</p>
                <p className="text-gray-700 text-sm leading-relaxed">(vi) 24,405 (vii) 36,980 (viii) 4,89,008 (ix) 78,90,003</p>
                <p className="text-gray-700 text-sm leading-relaxed">(x) 7.90,230 (xi) 21,34,567 (xii) 8,909 (xiii) 12,39,908</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                <h4 className="text-base font-bold text-orange-700 mb-2">II. Write the numeral for each of the following:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">(i)</span>
                    <span>Four thousand three hundred nine</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">(ii)</span>
                    <span>Sixty-eight thousand four hundred forty-four</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">(iii)</span>
                    <span>Two crore, five lakh, ten thousand, four hundred and ten</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">(iv)</span>
                    <span>Five thousand, three hundred and sixty-four</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">(v)</span>
                    <span>Two crore forty lakh, twenty thousand seven hundred forty-six</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">(vi)</span>
                    <span>Eighty-four crore, thirty-six lakh, forty-five thousand, two hundred nine</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">(vii)</span>
                    <span>Two lakh seventy-three thousand four hundred forty-six</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">(viii)</span>
                    <span>Seven thousand fifty-five</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">(ix)</span>
                    <span>Ten thousand five hundred forty-five</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              2. International Place Value System
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">The <span className="font-semibold text-purple-600">international system</span> of numeration is followed by <span className="font-semibold text-indigo-600">most of the world's countries</span>. The international system of numeration has <span className="font-semibold text-blue-600">three places in each period</span>.</p>
              
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <h4 className="text-base font-bold text-purple-700 mb-2">Periods:</h4>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">In the International System, the period from right to left are:</p>
                <ul className="space-y-1 ml-4 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-purple-600">ones</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-indigo-600">thousands</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-blue-600">millions</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold mt-0.5">•</span>
                    <span><span className="font-semibold text-cyan-600">billions</span></span>
                  </li>
                </ul>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">The <span className="font-semibold text-purple-600">first three places</span> make the <span className="font-semibold text-indigo-600">ones</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-blue-600">next three places</span> make up the <span className="font-semibold text-cyan-600">thousands</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-teal-600">next three places, after thousands</span>, make the <span className="font-semibold text-green-600">millions</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-emerald-600">next three places, after millions</span> make the <span className="font-semibold text-lime-600">billions</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">In a given number, each period is separated by a <span className="font-semibold text-purple-600">comma (,)</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              EXERCISE - International System
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <h4 className="text-base font-bold text-cyan-700 mb-2">I. Write the numerals for the following according to the International system:</h4>
                <p className="text-gray-700 text-sm leading-relaxed">(a) 476,675; (b) 678,980 (c) 67,876,900 (d) 6,780,659</p>
                <p className="text-gray-700 text-sm leading-relaxed">(e) 79, 890,009 (f) 678,900,980 (g) 78,908 (h) 655,890,876</p>
                <p className="text-gray-700 text-sm leading-relaxed">(i) 768,908 (j) 67,980,900 (k) 56,987 (l) 654,908,098</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <h4 className="text-base font-bold text-blue-700 mb-2">II. Write the numeral for each of the following:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">(a).</span>
                    <span>Three hundred seventy-two million, four hundred nine thousand, and three hundred seventy.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">(b).</span>
                    <span>Eighty-nine million, four hundred seventy-four thousand, seven hundred ninety-four</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">(c).</span>
                    <span>Two hundred fifty-nine million, seven hundred ninety-four thousand, six hundred thirty</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">(d).</span>
                    <span>Ninety-nine million, four hundred two thousand, ninety-seven.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">(e).</span>
                    <span>Sixty-six million five hundred thirty-four thousand ninety-seven</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">(f).</span>
                    <span>Fifty-seven million, four hundred ninety-four thousand, seven hundred fifty-six</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">(g).</span>
                    <span>One hundred thirty-three million four hundred seventy-nine.</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isFundamentalOpsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              3. FUNDAMENTAL OPERATIONS ON MATHEMATICS
            </h2>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Addition of Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-blue-600">Addition:</span> In mathematics, addition is the process of calculating the <span className="font-semibold text-indigo-600">total</span> of two or more numbers.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>(i) <span className="font-bold text-blue-600">2 + 3 = 5</span></p>
                  <p>(ii) <span className="font-bold text-indigo-600">7 + 9 = 16</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm mt-4">
                <h4 className="text-base font-bold text-indigo-700 mb-2">Exercise I. Add the following numbers:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 3456 + 3789</p>
                  <p>(2) 2987 + 5698</p>
                  <p>(3) 3489 + 6745</p>
                  <p>(4) 9754 + 2987</p>
                  <p>(5) 6789 + 9876</p>
                  <p>(6) 23456 + 98765</p>
                  <p>(7) 54321 + 98760</p>
                  <p>(8) 78654 + 54321</p>
                  <p>(9) 56789 + 98765</p>
                  <p>(10) 45678 + 67890</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Subtraction of Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-red-600">Subtraction:</span> Subtraction is the process of <span className="font-semibold text-rose-600">removing objects</span> from a collection.</p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>(i) <span className="font-bold text-red-600">5 − 3 = 2</span></p>
                  <p>(ii) <span className="font-bold text-rose-600">16 − 7 = 9</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm mt-4">
                <h4 className="text-base font-bold text-rose-700 mb-2">Exercise II. Subtract the following numbers:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 9865 − 6786</p>
                  <p>(2) 7654 − 4321</p>
                  <p>(3) 98765 − 87654</p>
                  <p>(4) 76589 − 65443</p>
                  <p>(5) 98765 − 87656</p>
                  <p>(6) 65432 − 54321</p>
                  <p>(7) 87654 − 76543</p>
                  <p>(8) 98765 − 76543</p>
                  <p>(9) 87654 − 54321</p>
                  <p>(10) 76543 − 43210</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Multiplication of Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-green-600">Multiplication:</span> Multiplication is the process of calculating the <span className="font-semibold text-emerald-600">total</span> of one number added to itself <span className="font-semibold text-teal-600">multiple times</span>.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>(i) <span className="font-bold text-green-600">3 × 4 = 12</span></p>
                  <p>(ii) <span className="font-bold text-emerald-600">6 × 5 = 30</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <h4 className="text-base font-bold text-emerald-700 mb-2">Exercise III. Multiply the following numbers:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 336 × 22</p>
                  <p>(2) 756 × 13</p>
                  <p>(3) 375 × 42</p>
                  <p>(4) 204 × 1</p>
                  <p>(5) 5245 × 24</p>
                  <p>(6) 2105 × 26</p>
                  <p>(7) 4653 × 25</p>
                  <p>(8) 2706 × 116</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm mt-4">
                <h4 className="text-base font-bold text-teal-700 mb-2">III. Solve the word problems:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p className="flex items-start gap-2">
                    <span className="text-teal-600 font-bold">1.</span>
                    <span>One kurta costs Rs. 210. How much would six kurtas cost?</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-cyan-600 font-bold">2.</span>
                    <span>Zain drove 55 kilometres in one hour. How many kilometres will he cover in 36 hours?</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Saad uses the computer for 12 hours. If the average power consumption of a computer per hour is 299 watts, how much power does Saad use?</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">4.</span>
                    <span>A newspaper vendor sells 3596 newspapers in a day. How many newspapers does he sell in 28 days?</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">5.</span>
                    <span>If a bed sheet costs Rs 392, how much would 149 bed sheets cost?</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">6.</span>
                    <span>A plane flying from Hyderabad to Banglore covers about 4166 kilometres in one trip. Find out the distance covered in 35 trips.</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-rose-600 font-bold">7.</span>
                    <span>There are 35 children in the class. Each student needs eight dozen pencils in a year. How many pencils do the students use in a year?</span>
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="text-red-600 font-bold">8.</span>
                    <span>Kashif has 32 marbles. Raaqib has eight times more marbles than Kashif. How many marbles does Raaqib have?</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Division
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-amber-600">Division:</span> In division, <span className="font-semibold text-orange-600">four quantities</span> are present. They are:</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">(i)</span>
                    <span><span className="font-semibold text-amber-600">Dividend</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600 font-bold">(ii)</span>
                    <span><span className="font-semibold text-orange-600">Divisor</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-600 font-bold">(iii)</span>
                    <span><span className="font-semibold text-yellow-600">Quotient</span></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">(iv)</span>
                    <span><span className="font-semibold text-amber-600">Remainder</span></span>
                  </li>
                </ul>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm mt-4">
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-semibold text-orange-700">(i) Dividend:</span> The number that is being divided is known as the <span className="font-semibold text-orange-600">dividend</span>.</p>
                  <p><span className="font-semibold text-yellow-700">(ii) Divisor:</span> The number that is dividing the other number is known as the <span className="font-semibold text-yellow-600">divisor</span>.</p>
                  <p><span className="font-semibold text-amber-700">(iii) Quotient:</span> The answer that comes after dividing the number is known as the <span className="font-semibold text-amber-600">quotient</span>.</p>
                  <p><span className="font-semibold text-orange-700">(iv) Remainder:</span> The value that is left undivided is known as the <span className="font-semibold text-orange-600">remainder</span>.</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm leading-relaxed mb-2">The relationship between the above four quantities is:</p>
                <p className="text-gray-700 text-sm font-bold text-amber-700 mb-2">Dividend = (Divisor × Quotient) + Remainder</p>
                <p className="text-gray-700 text-sm leading-relaxed">It is called the <span className="font-semibold text-yellow-600">operation of division</span>. It is denoted by the <span className="font-semibold text-amber-600">"÷"</span> sign.</p>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-amber-600">625 ÷ 25 = 25</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Here, <span className="font-semibold text-amber-600">dividend = 625</span>, <span className="font-semibold text-orange-600">divisor = 25</span>, <span className="font-semibold text-yellow-600">quotient = 25</span> and <span className="font-semibold text-amber-600">remainder = 0</span></p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm mt-4">
                <h4 className="text-base font-bold text-orange-700 mb-2">Exercise I. Divide the following numbers (1-digit number):</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 76 ÷ 2</p>
                  <p>(2) 380 ÷ 5</p>
                  <p>(3) 108 ÷ 2</p>
                  <p>(4) 696 ÷ 3</p>
                  <p>(5) 511 ÷ 7</p>
                  <p>(6) 728 ÷ 8</p>
                  <p>(7) 488 ÷ 4</p>
                  <p>(8) 234 ÷ 7</p>
                  <p>(9) 733 ÷ 3</p>
                  <p>(10) 563 ÷ 7</p>
                  <p>(11) 347 ÷ 6</p>
                  <p>(12) 903 ÷ 8</p>
                  <p>(13) 562 ÷ 5</p>
                  <p>(14) 763 ÷ 8</p>
                  <p>(15) 819 ÷ 5</p>
                  <p>(16) 912 ÷ 7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isTypesOfNumbersLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              4. TYPES OF NUMBERS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">There are <span className="font-semibold text-blue-600">different types</span> of numbers. They are as follows:</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Natural Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Counting numbers beginning with <span className="font-semibold text-blue-600">1, 2, 3, 4, …</span> are called <span className="font-semibold text-indigo-600">natural numbers</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-blue-700">Example:</span> <span className="font-bold text-blue-600">1, 2, 3, 4, 5…</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Whole Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Natural numbers including <span className="font-semibold text-green-600">zero</span> are called <span className="font-semibold text-emerald-600">whole numbers</span>.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-green-700">Example:</span> <span className="font-bold text-green-600">0, 1, 2, 3, 4…</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Integers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">All whole numbers including <span className="font-semibold text-purple-600">negative numbers</span> are known as <span className="font-semibold text-pink-600">integers</span>.</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">Example:</span> <span className="font-bold text-purple-600">…–3, –2, –1, 0, 1, 2, 3…</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Even Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Numbers that are <span className="font-semibold text-cyan-600">completely divisible by 2</span> are called <span className="font-semibold text-blue-600">even numbers</span>.</p>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-700">Example:</span> <span className="font-bold text-cyan-600">2, 4, 6, 8, 10…</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Odd Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Numbers that are <span className="font-semibold text-red-600">not divisible by 2</span> are called <span className="font-semibold text-rose-600">odd numbers</span>.</p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-red-700">Example:</span> <span className="font-bold text-red-600">1, 3, 5, 7, 9...</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Prime Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Numbers greater than <span className="font-semibold text-amber-600">1</span> that have exactly <span className="font-semibold text-orange-600">two factors</span>, <span className="font-semibold text-yellow-600">1</span> and the number itself, are called <span className="font-semibold text-amber-600">prime numbers</span>.</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-700">Example:</span> <span className="font-bold text-amber-600">2, 3, 5, 7, 11…</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-teal-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-teal-200">
              Composite Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Numbers that have <span className="font-semibold text-teal-600">more than two factors</span> are called <span className="font-semibold text-cyan-600">composite numbers</span>.</p>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-teal-700">Example:</span> <span className="font-bold text-teal-600">4, 6, 8, 9, 12…</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Perfect Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A number is said to be <span className="font-semibold text-violet-600">perfect</span> if the <span className="font-semibold text-purple-600">sum of all its factors</span> (excluding the number itself) <span className="font-semibold text-indigo-600">equals the number</span>.</p>
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed">Factors of <span className="font-bold text-violet-600">6</span> → <span className="font-semibold text-purple-600">1, 2, 3</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-bold text-indigo-600">1 + 2 + 3 = 6</span> (So, <span className="font-bold text-violet-600">6</span> is a perfect number.)</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <h4 className="text-base font-bold text-amber-700 mb-2">I. Fill in the blanks:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>1. The counting numbers are called <span className="font-semibold text-amber-600">____________</span>.</p>
                  <p>2. <span className="font-semibold text-orange-600">_____________</span> is the smallest whole number.</p>
                  <p>3. Numbers divisible by 2 are called <span className="font-semibold text-yellow-600">____________</span>.</p>
                  <p>4. Those numbers that have only two factors are called <span className="font-semibold text-amber-600">____________</span>.</p>
                  <p>5. 6 is a <span className="font-semibold text-orange-600">_____________</span> number.</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                <h4 className="text-base font-bold text-orange-700 mb-2">II. State whether the following statements are True or False:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>1. 1 is a prime number.</p>
                  <p>2. Whole numbers start from 1.</p>
                  <p>3. All even numbers are divisible by 2.</p>
                  <p>4. 15 is a composite number.</p>
                  <p>5. 6 is a perfect number.</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border-l-4 border-yellow-500 shadow-sm">
                <h4 className="text-base font-bold text-yellow-700 mb-2">III. Classify the following numbers into Prime and Composite:</h4>
                <p className="text-gray-700 text-sm"><span className="font-semibold text-yellow-600">17, 25, 31, 45, 53, 81, 97, 100</span></p>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <h4 className="text-base font-bold text-amber-700 mb-2">IV. Classify the following numbers into:</h4>
                <p className="text-gray-700 text-sm mb-2">Natural Numbers, Whole Numbers, Even Numbers, Odd Numbers</p>
                <p className="text-gray-700 text-sm"><span className="font-semibold text-amber-600">22, 0, 15, 3, 28, 46, 2, 7, 49, 18</span></p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isIntegersLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              5. INTEGERS WITH OPERATIONS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">Integers include all <span className="font-semibold text-blue-600">whole numbers</span> and their <span className="font-semibold text-red-600">negative values</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples of integers:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-blue-600">…, –5, –4, –3, –2, –1, 0, 1, 2, 3, 4, 5, …</span></p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm mt-3">
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold">•</span>
                    <span><span className="font-semibold text-indigo-600">0</span> is neither positive nor negative.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600 font-bold">•</span>
                    <span><span className="font-semibold text-purple-600">1, 2, 3, …</span> are <span className="font-semibold text-green-600">positive integers</span>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-600 font-bold">•</span>
                    <span><span className="font-semibold text-pink-600">–1, –2, –3, …</span> are <span className="font-semibold text-red-600">negative integers</span>.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Addition of Integers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Rule 1:</p>
                <p className="text-gray-700 text-sm leading-relaxed">When both integers have the <span className="font-semibold text-blue-600">same sign</span>, add their values and put the <span className="font-semibold text-indigo-600">same sign</span>.</p>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-700 text-sm"><span className="font-semibold text-blue-700">Examples:</span></p>
                  <p className="text-gray-700 text-sm">(<span className="font-bold text-green-600">+7</span>) + (<span className="font-bold text-green-600">+3</span>) = <span className="font-bold text-green-600">+10</span></p>
                  <p className="text-gray-700 text-sm">(<span className="font-bold text-red-600">–8</span>) + (<span className="font-bold text-red-600">–2</span>) = <span className="font-bold text-red-600">–10</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Rule 2:</p>
                <p className="text-gray-700 text-sm leading-relaxed">When integers have <span className="font-semibold text-indigo-600">different signs</span>, subtract the smaller value from the larger value and put the <span className="font-semibold text-purple-600">sign of the larger number</span>.</p>
                <div className="mt-3 space-y-1">
                  <p className="text-gray-700 text-sm"><span className="font-semibold text-indigo-700">Examples:</span></p>
                  <p className="text-gray-700 text-sm">(<span className="font-bold text-green-600">+9</span>) + (<span className="font-bold text-red-600">–4</span>) = <span className="font-bold text-green-600">+5</span></p>
                  <p className="text-gray-700 text-sm">(<span className="font-bold text-red-600">–10</span>) + (<span className="font-bold text-green-600">+3</span>) = <span className="font-bold text-red-600">–7</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Subtraction of Integers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Subtracting an integer is the same as <span className="font-semibold text-red-600">adding its opposite</span>.</p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>(<span className="font-bold text-green-600">+8</span>) – (<span className="font-bold text-green-600">+3</span>) = <span className="font-bold text-green-600">+5</span></p>
                  <p>(<span className="font-bold text-red-600">–7</span>) – (<span className="font-bold text-green-600">+4</span>) = <span className="font-bold text-red-600">–11</span></p>
                  <p>(<span className="font-bold text-green-600">+6</span>) – (<span className="font-bold text-red-600">–2</span>) = <span className="font-bold text-green-600">+8</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Multiplication of Integers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3 font-semibold">Rules:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Sign × Sign</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">(+) × (+)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">+</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">(–) × (–)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">+</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">(+) × (–)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">–</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">(–) × (+)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">–</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>(<span className="font-bold text-green-600">+5</span>) × (<span className="font-bold text-green-600">+2</span>) = <span className="font-bold text-green-600">+10</span></p>
                  <p>(<span className="font-bold text-red-600">–6</span>) × (<span className="font-bold text-red-600">–3</span>) = <span className="font-bold text-green-600">+18</span></p>
                  <p>(<span className="font-bold text-green-600">+4</span>) × (<span className="font-bold text-red-600">–3</span>) = <span className="font-bold text-red-600">–12</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Division of Integers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Rules follow the same sign rule as multiplication:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Sign ÷ Sign</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">(+) ÷ (+)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">+</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">(–) ÷ (–)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">+</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">(+) ÷ (–)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">–</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">(–) ÷ (+)</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">–</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>(<span className="font-bold text-green-600">+12</span>) ÷ (<span className="font-bold text-green-600">+3</span>) = <span className="font-bold text-green-600">+4</span></p>
                  <p>(<span className="font-bold text-red-600">–18</span>) ÷ (<span className="font-bold text-red-600">–6</span>) = <span className="font-bold text-green-600">+3</span></p>
                  <p>(<span className="font-bold text-green-600">+15</span>) ÷ (<span className="font-bold text-red-600">–5</span>) = <span className="font-bold text-red-600">–3</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <h4 className="text-base font-bold text-purple-700 mb-2">I. Add the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>1. (+5) + (–8)</p>
                  <p>2. (–9) + (–6)</p>
                  <p>3. (+12) + (–7)</p>
                  <p>4. (–15) + (+10)</p>
                  <p>5. (–20) + (–10)</p>
                  <p>6. (+30) + (+40)</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                <h4 className="text-base font-bold text-indigo-700 mb-2">II. Subtract the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>1. (+9) – (+3)</p>
                  <p>2. (–10) – (–5)</p>
                  <p>3. (+15) – (–6)</p>
                  <p>4. (–18) – (+7)</p>
                  <p>5. (–25) – (–10)</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <h4 className="text-base font-bold text-blue-700 mb-2">III. Multiply the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>1. (+7) × (–3)</p>
                  <p>2. (–8) × (–4)</p>
                  <p>3. (+10) × (+5)</p>
                  <p>4. (–6) × (+2)</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-teal-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <h4 className="text-base font-bold text-cyan-700 mb-2">IV. Divide the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>1. (+12) ÷ (–3)</p>
                  <p>2. (–20) ÷ (+5)</p>
                  <p>3. (–30) ÷ (–6)</p>
                  <p>4. (+40) ÷ (+8)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isFactorsMultiplesLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              6. FACTORS AND MULTIPLES (H.C.F AND L.C.M)
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">A number is <span className="font-semibold text-blue-600">divisible</span> by another number if the other number <span className="font-semibold text-indigo-600">divides it exactly</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Divisibility Rules
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-blue-600">Divisibility by 2:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 2 if its last digit is <span className="font-semibold text-blue-600">0, 2, 4, 6, or 8</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border-l-4 border-indigo-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-indigo-600">Divisibility by 3:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 3 if the <span className="font-semibold text-indigo-600">sum of its digits</span> is divisible by 3.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-purple-600">Divisibility by 4:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 4 if the <span className="font-semibold text-purple-600">last two digits</span> form a number divisible by 4.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-3 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-pink-600">Divisibility by 5:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 5 if its last digit is <span className="font-semibold text-pink-600">0 or 5</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-3 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-rose-600">Divisibility by 6:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 6 if it is divisible by both <span className="font-semibold text-rose-600">2 and 3</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-lg p-3 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-red-600">Divisibility by 8:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 8 if the <span className="font-semibold text-red-600">last three digits</span> form a number divisible by 8.</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg p-3 border-l-4 border-orange-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-orange-600">Divisibility by 9:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 9 if the <span className="font-semibold text-orange-600">sum of its digits</span> is divisible by 9.</p>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-amber-600">Divisibility by 10:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 10 if the last digit is <span className="font-semibold text-amber-600">0</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-lime-50 rounded-lg p-3 border-l-4 border-yellow-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-1"><span className="text-yellow-600">Divisibility by 11:</span></p>
                <p className="text-gray-700 text-sm">A number is divisible by 11 if the <span className="font-semibold text-yellow-600">difference</span> between the sum of digits at <span className="font-semibold text-lime-600">odd places</span> and digits at <span className="font-semibold text-green-600">even places</span> is divisible by 11.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Prime and Composite Numbers
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">A <span className="font-semibold text-green-600">prime number</span> is a number greater than 1 having only <span className="font-semibold text-emerald-600">two factors</span>, 1 and the number itself.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-green-700">Example:</span> <span className="font-bold text-green-600">2, 3, 5, 7, 11...</span></p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">A <span className="font-semibold text-emerald-600">composite number</span> has <span className="font-semibold text-teal-600">more than two factors</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-emerald-700">Example:</span> <span className="font-bold text-emerald-600">4, 6, 8, 9, 12...</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              H.C.F (Highest Common Factor)
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">The <span className="font-semibold text-purple-600">largest number</span> that divides two or more numbers exactly is called the <span className="font-semibold text-indigo-600">Highest Common Factor (H.C.F)</span>.</p>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Find the H.C.F of <span className="font-bold text-purple-600">24</span> and <span className="font-bold text-indigo-600">36</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">Factors of 24 → <span className="font-semibold text-purple-600">1, 2, 3, 4, 6, 8, 12, 24</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">Factors of 36 → <span className="font-semibold text-indigo-600">1, 2, 3, 4, 6, 9, 12, 18, 36</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Common factors → <span className="font-semibold text-blue-600">1, 2, 3, 4, 6, 12</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">So, <span className="font-bold text-purple-600">H.C.F = 12</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              L.C.M (Least Common Multiple)
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">The <span className="font-semibold text-amber-600">smallest common multiple</span> of two or more numbers is called the <span className="font-semibold text-orange-600">Least Common Multiple (L.C.M)</span>.</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Find the L.C.M of <span className="font-bold text-amber-600">4</span> and <span className="font-bold text-orange-600">6</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">Multiples of 4 → <span className="font-semibold text-amber-600">4, 8, 12, 16, 20, 24...</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">Multiples of 6 → <span className="font-semibold text-orange-600">6, 12, 18, 24...</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Common multiples → <span className="font-semibold text-yellow-600">12, 24...</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">So, <span className="font-bold text-amber-600">L.C.M = 12</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Relation between H.C.F and L.C.M
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">For any two numbers:</p>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-bold text-cyan-700 mb-2">H.C.F × L.C.M = Product of the numbers</p>
                <p className="text-gray-700 text-sm font-semibold mb-2 mt-3">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed">H.C.F of <span className="font-bold text-cyan-600">8</span> and <span className="font-bold text-blue-600">12</span> = <span className="font-bold text-indigo-600">4</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">L.C.M of <span className="font-bold text-cyan-600">8</span> and <span className="font-bold text-blue-600">12</span> = <span className="font-bold text-indigo-600">24</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Check: <span className="font-bold text-cyan-600">4 × 24 = 96</span> and <span className="font-bold text-blue-600">8 × 12 = 96</span> <span className="text-green-600 font-bold">✔️</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <h4 className="text-base font-bold text-violet-700 mb-2">I. Find the H.C.F of the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 12 and 18</p>
                  <p>(2) 24 and 30</p>
                  <p>(3) 18, 27 and 36</p>
                  <p>(4) 20 and 25</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <h4 className="text-base font-bold text-purple-700 mb-2">II. Find the L.C.M of the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 4 and 6</p>
                  <p>(2) 9 and 12</p>
                  <p>(3) 5, 10 and 15</p>
                  <p>(4) 7 and 14</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                <h4 className="text-base font-bold text-indigo-700 mb-2">III. State whether the following are divisible by 2, 3, 5, and 10:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>(1) 120</p>
                  <p>(2) 75</p>
                  <p>(3) 248</p>
                  <p>(4) 450</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isMeasurementsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              7. DIFFERENCE BETWEEN MEASUREMENTS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600"><span className="font-semibold text-blue-600">Measurement</span> is the process of finding the <span className="font-semibold text-indigo-600">size</span>, <span className="font-semibold text-purple-600">length</span>, or <span className="font-semibold text-pink-600">amount</span> of something.</p>
              <p className="mb-3 text-gray-600">We use <span className="font-semibold text-cyan-600">different units</span> for measuring different physical quantities such as <span className="font-semibold text-green-600">length</span>, <span className="font-semibold text-amber-600">mass</span>, and <span className="font-semibold text-orange-600">capacity</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              1. Measurement of Length
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Length is measured in <span className="font-semibold text-blue-600">centimetres (cm)</span>, <span className="font-semibold text-indigo-600">metres (m)</span>, and <span className="font-semibold text-purple-600">kilometres (km)</span>.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Unit</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Symbol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Millimetre</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">mm</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Centimetre</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">cm</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Metre</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">m</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Kilometre</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">km</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Conversions:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-bold text-blue-600">10 mm</span> = <span className="font-bold text-indigo-600">1 cm</span></p>
                  <p><span className="font-bold text-indigo-600">100 cm</span> = <span className="font-bold text-purple-600">1 m</span></p>
                  <p><span className="font-bold text-purple-600">1000 m</span> = <span className="font-bold text-pink-600">1 km</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>The length of a <span className="font-semibold text-indigo-600">pencil</span> is measured in <span className="font-semibold text-blue-600">centimetres</span>.</p>
                  <p>The distance between two <span className="font-semibold text-purple-600">cities</span> is measured in <span className="font-semibold text-pink-600">kilometres</span>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              2. Measurement of Mass
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Mass is measured in <span className="font-semibold text-green-600">grams (g)</span> and <span className="font-semibold text-emerald-600">kilograms (kg)</span>.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Unit</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Symbol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">Milligram</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">mg</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">Gram</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">g</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">Kilogram</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">kg</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Conversions:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-bold text-green-600">1000 mg</span> = <span className="font-bold text-emerald-600">1 g</span></p>
                  <p><span className="font-bold text-emerald-600">1000 g</span> = <span className="font-bold text-teal-600">1 kg</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>The mass of <span className="font-semibold text-emerald-600">vegetables</span> is measured in <span className="font-semibold text-teal-600">kilograms</span>.</p>
                  <p>The mass of small objects like <span className="font-semibold text-green-600">chocolates</span> is measured in <span className="font-semibold text-emerald-600">grams</span>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              3. Measurement of Capacity
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-amber-600">Capacity</span> is the measurement of <span className="font-semibold text-orange-600">liquids</span>. It is measured in <span className="font-semibold text-yellow-600">millilitres (ml)</span> and <span className="font-semibold text-amber-600">litres (L)</span>.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Unit</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Symbol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">Millilitre</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">ml</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">Litre</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">L</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Conversions:</p>
                <p className="text-gray-700 text-sm"><span className="font-bold text-amber-600">1000 ml</span> = <span className="font-bold text-orange-600">1 L</span></p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p>The capacity of a <span className="font-semibold text-amber-600">water bottle</span> is measured in <span className="font-semibold text-orange-600">millilitres</span>.</p>
                  <p>The capacity of a <span className="font-semibold text-yellow-600">tank</span> is measured in <span className="font-semibold text-amber-600">litres</span>.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <h4 className="text-base font-bold text-purple-700 mb-2">I. Convert the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>6 km = <span className="font-semibold text-purple-600">______</span> m</p>
                  <p>4520 m = <span className="font-semibold text-indigo-600">______</span> km</p>
                  <p>18 kg = <span className="font-semibold text-purple-600">______</span> g</p>
                  <p>4500 g = <span className="font-semibold text-indigo-600">______</span> kg</p>
                  <p>5000 ml = <span className="font-semibold text-purple-600">______</span> L</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                <h4 className="text-base font-bold text-indigo-700 mb-2">II. Fill in the blanks:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>1. Capacity is measured in <span className="font-semibold text-indigo-600">______</span> and <span className="font-semibold text-blue-600">______</span>.</p>
                  <p>2. Mass is measured in <span className="font-semibold text-indigo-600">______</span> and <span className="font-semibold text-blue-600">______</span>.</p>
                  <p>3. 100 cm = <span className="font-semibold text-indigo-600">______</span> m</p>
                  <p>4. 1000 ml = <span className="font-semibold text-indigo-600">______</span> L</p>
                  <p>5. 1000 g = <span className="font-semibold text-indigo-600">______</span> kg</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <h4 className="text-base font-bold text-blue-700 mb-2">III. Match the following:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">A</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">B</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">(a) Length</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">Litres</td>
                      </tr>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">(b) Capacity</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">Kilogram</td>
                      </tr>
                      <tr className="hover:bg-blue-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">(c) Mass</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">Metre</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isTimeLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              8. TIME
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">Time tells us how long an event takes place.</p>
              <p className="mb-3 text-gray-600">We measure time in <span className="font-semibold text-blue-600">seconds</span>, <span className="font-semibold text-green-600">minutes</span>, and <span className="font-semibold text-purple-600">hours</span>.</p>
              <p className="mb-3 text-gray-600">Time can be measured using a <span className="font-semibold text-orange-600">clock</span> or a <span className="font-semibold text-amber-600">watch</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Units of Time
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Unit</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Symbol</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Seconds</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">s</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Minutes</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">min</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Hours</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">h</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Conversions of Time
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-bold text-green-600">60 seconds</span> = <span className="font-bold text-emerald-600">1 minute</span></p>
                  <p><span className="font-bold text-emerald-600">60 minutes</span> = <span className="font-bold text-teal-600">1 hour</span></p>
                  <p><span className="font-bold text-teal-600">24 hours</span> = <span className="font-bold text-green-600">1 day</span></p>
                  <p><span className="font-bold text-green-600">7 days</span> = <span className="font-bold text-emerald-600">1 week</span></p>
                  <p><span className="font-bold text-emerald-600">365 days</span> = <span className="font-bold text-teal-600">1 year</span></p>
                  <p><span className="font-bold text-teal-600">366 days</span> = <span className="font-bold text-green-600">1 leap year</span></p>
                  <p><span className="font-bold text-green-600">52 weeks</span> = <span className="font-bold text-emerald-600">1 year</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm leading-relaxed">A <span className="font-semibold text-emerald-600">leap year</span> comes once every <span className="font-semibold text-teal-600">4 years</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Reading a Clock
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A clock has three hands:</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-semibold text-purple-600">Hour hand</span> → <span className="font-semibold text-pink-600">short hand</span></p>
                  <p><span className="font-semibold text-purple-600">Minute hand</span> → <span className="font-semibold text-pink-600">long hand</span></p>
                  <p><span className="font-semibold text-purple-600">Second hand</span> → <span className="font-semibold text-pink-600">thin, moving fast</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Types of Time
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-amber-600">A.M (Ante Meridian)</span> → Time from <span className="font-semibold text-orange-600">12:00 midnight</span> to <span className="font-semibold text-yellow-600">11:59 morning</span></p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-orange-600">P.M (Post Meridian)</span> → Time from <span className="font-semibold text-amber-600">12:00 noon</span> to <span className="font-semibold text-yellow-600">11:59 night</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              24-Hour Clock Format
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Some digital clocks use a <span className="font-semibold text-cyan-600">24-hour system</span>.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">12-Hour Time</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">24-Hour Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-cyan-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">1:00 PM</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">13:00</td>
                    </tr>
                    <tr className="hover:bg-cyan-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">2:30 PM</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">14:30</td>
                    </tr>
                    <tr className="hover:bg-cyan-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">7:15 PM</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">19:15</td>
                    </tr>
                    <tr className="hover:bg-cyan-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-cyan-600">11:45 PM</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">23:45</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Calendar
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A calendar shows:</p>
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-semibold text-violet-600">Days</span></p>
                  <p><span className="font-semibold text-purple-600">Months</span></p>
                  <p><span className="font-semibold text-indigo-600">Weeks</span></p>
                </div>
              </div>
              <p className="text-gray-600 mb-3 mt-4">There are <span className="font-semibold text-violet-600">12 months</span> in a year.</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-violet-500 to-purple-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Month</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Days</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">January</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">February</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">28/29</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">March</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">April</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">30</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">May</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">June</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">30</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">July</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">August</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">September</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">30</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">October</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">November</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">30</td>
                    </tr>
                    <tr className="hover:bg-violet-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-violet-600">December</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">31</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <h4 className="text-base font-bold text-red-700 mb-2">I. Convert the following:</h4>
                <div className="grid grid-cols-2 gap-2 text-gray-700 text-sm">
                  <p>180 seconds = <span className="font-semibold text-red-600">______</span> minutes</p>
                  <p>3 hours = <span className="font-semibold text-rose-600">______</span> minutes</p>
                  <p>600 minutes = <span className="font-semibold text-red-600">______</span> hours</p>
                  <p>2 days = <span className="font-semibold text-rose-600">______</span> hours</p>
                  <p>3600 seconds = <span className="font-semibold text-red-600">______</span> minutes</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <h4 className="text-base font-bold text-rose-700 mb-2">II. Fill in the blanks:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>60 minutes = <span className="font-semibold text-rose-600">______</span> hour</p>
                  <p>A leap year has <span className="font-semibold text-rose-600">______</span> days</p>
                  <p>The short hand in a clock is called the <span className="font-semibold text-rose-600">______</span> hand</p>
                  <p>February has <span className="font-semibold text-rose-600">______</span> days in a leap year</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <h4 className="text-base font-bold text-pink-700 mb-2">III. Match the following:</h4>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-pink-500 to-red-500 text-white">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">A</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">B</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-pink-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">(a) Time</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">Calendar</td>
                      </tr>
                      <tr className="hover:bg-pink-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">(b) Month</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">Clock</td>
                      </tr>
                      <tr className="hover:bg-pink-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">(c) Hours</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-red-600">Minutes</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isDecimalsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              9. DECIMALS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">When we write a number with a <span className="font-semibold text-blue-600">point</span> to separate its <span className="font-semibold text-green-600">whole number part</span> from its <span className="font-semibold text-purple-600">fractional part</span>, it is called a <span className="font-semibold text-orange-600">decimal number</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-blue-600">3.5</span>, <span className="font-bold text-indigo-600">7.25</span>, <span className="font-bold text-purple-600">10.875</span></p>
              </div>
              <p className="mb-3 text-gray-600 mt-4">The <span className="font-semibold text-red-600">dot</span> between the numbers is called the <span className="font-semibold text-orange-600">decimal point</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Place value in decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Place</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Ones</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">1</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Tenths</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">1/10</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Hundredths</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">1/100</td>
                    </tr>
                    <tr className="hover:bg-blue-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-blue-600">Thousandths</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-indigo-600">1/1000</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">In the number <span className="font-bold text-blue-600">4.52</span></p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-semibold text-blue-600">4</span> is in the <span className="font-semibold text-indigo-600">ones</span> place</p>
                  <p><span className="font-semibold text-blue-600">5</span> is in the <span className="font-semibold text-indigo-600">tenths</span> place</p>
                  <p><span className="font-semibold text-blue-600">2</span> is in the <span className="font-semibold text-indigo-600">hundredths</span> place</p>
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mt-3">So,</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-1"><span className="font-bold text-blue-600">4.52</span> = <span className="font-semibold text-indigo-600">4 + 5/10 + 2/100</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Reading decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Decimal</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Read as</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">3.1</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">Three point one</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">4.25</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">Four point two five</td>
                    </tr>
                    <tr className="hover:bg-green-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-green-600">8.305</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-emerald-600">Eight point three zero five</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Comparing decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Compare digits from <span className="font-semibold text-purple-600">left to right</span>:</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                    <thead>
                      <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Numbers</th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Comparison</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="hover:bg-purple-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">5.32 and 5.9</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">5.32 &lt; 5.9</td>
                      </tr>
                      <tr className="hover:bg-purple-50">
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">7.46 and 7.406</td>
                        <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">7.46 &gt; 7.406</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Addition of decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Step 1:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">Write the numbers with the <span className="font-semibold text-amber-600">decimal points aligned</span>.</p>
                <p className="text-gray-700 text-sm font-semibold mb-2">Step 2:</p>
                <p className="text-gray-700 text-sm leading-relaxed">Add as <span className="font-semibold text-orange-600">ordinary numbers</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="text-gray-700 text-sm font-mono leading-relaxed">
                  <p className="mb-1"><span className="font-bold text-amber-600">6.25</span></p>
                  <p className="mb-1"><span className="font-bold text-orange-600">+ 2.15</span></p>
                  <p className="mb-1 border-t-2 border-gray-300 pt-1"><span className="font-bold text-yellow-600">= 8.40</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Subtraction of decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Step 1:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3"><span className="font-semibold text-cyan-600">Align decimal points</span></p>
                <p className="text-gray-700 text-sm font-semibold mb-2">Step 2:</p>
                <p className="text-gray-700 text-sm leading-relaxed">Subtract <span className="font-semibold text-blue-600">normally</span></p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="text-gray-700 text-sm font-mono leading-relaxed">
                  <p className="mb-1"><span className="font-bold text-cyan-600">9.75</span></p>
                  <p className="mb-1"><span className="font-bold text-blue-600">– 4.28</span></p>
                  <p className="mb-1 border-t-2 border-gray-300 pt-1"><span className="font-bold text-indigo-600">= 5.47</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Multiplication of decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Multiply <span className="font-semibold text-violet-600">normally</span>, then <span className="font-semibold text-purple-600">count total decimal places</span> and <span className="font-semibold text-indigo-600">place the point</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-bold text-violet-600">3.2</span> × <span className="font-bold text-purple-600">2</span> = <span className="font-bold text-indigo-600">6.4</span></p>
                  <p><span className="font-bold text-violet-600">2.5</span> × <span className="font-bold text-purple-600">1.5</span> = <span className="font-bold text-indigo-600">3.75</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Division of decimals
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Move the <span className="font-semibold text-red-600">decimal point</span> to make the <span className="font-semibold text-rose-600">divisor a whole number</span>, then <span className="font-semibold text-pink-600">divide</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-red-600">6.4</span> ÷ <span className="font-bold text-rose-600">2</span> = <span className="font-bold text-pink-600">3.2</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                <h4 className="text-base font-bold text-emerald-700 mb-2">I. Write the place values of the underlined digits:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-semibold text-emerald-600">3.52</span></p>
                  <p><span className="font-semibold text-teal-600">7.24</span></p>
                  <p><span className="font-semibold text-cyan-600">18.09</span></p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                <h4 className="text-base font-bold text-teal-700 mb-2">II. Compare using &gt;, &lt;, or =</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>6.35 <span className="font-semibold text-teal-600">______</span> 6.5</p>
                  <p>4.206 <span className="font-semibold text-teal-600">______</span> 4.26</p>
                  <p>9.03 <span className="font-semibold text-teal-600">______</span> 9.003</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <h4 className="text-base font-bold text-cyan-700 mb-2">III. Add the following:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>4.25 + 3.6</p>
                  <p>7.05 + 8.45</p>
                  <p>9.5 + 2.35</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                <h4 className="text-base font-bold text-emerald-700 mb-2">IV. Subtract:</h4>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p>6.75 – 2.45</p>
                  <p>8.05 – 3.62</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isFractionsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              10. FRACTIONS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">A <span className="font-semibold text-blue-600">fraction</span> represents a <span className="font-semibold text-green-600">part of a whole</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-blue-600">3/4</span> means <span className="font-semibold text-indigo-600">3 parts out of 4 equal parts</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Parts of a Fraction
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">In <span className="font-semibold text-green-600">a/b</span>:</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><span className="font-semibold text-green-600">a</span> = <span className="font-semibold text-emerald-600">Numerator</span> (number of parts taken)</p>
                  <p><span className="font-semibold text-green-600">b</span> = <span className="font-semibold text-emerald-600">Denominator</span> (total equal parts)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Types of Fractions
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">1️⃣ Proper Fraction</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Numerator &lt; Denominator</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">Example:</span> <span className="font-bold text-purple-600">3/7</span>, <span className="font-bold text-pink-600">5/9</span></p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">2️⃣ Improper Fraction</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Numerator &gt; Denominator</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-pink-700">Example:</span> <span className="font-bold text-pink-600">9/4</span>, <span className="font-bold text-rose-600">7/3</span></p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">3️⃣ Mixed Fraction</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Combination of a whole number and fraction</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-rose-700">Example:</span> <span className="font-bold text-rose-600">3 2/5</span></p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">4️⃣ Like Fractions</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Same denominator</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-purple-700">Example:</span> <span className="font-bold text-purple-600">2/9</span>, <span className="font-bold text-indigo-600">7/9</span></p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">5️⃣ Unlike Fractions</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Different denominators</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-indigo-700">Example:</span> <span className="font-bold text-indigo-600">3/5</span>, <span className="font-bold text-blue-600">4/7</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Converting Improper Fraction to Mixed Fraction
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Divide <span className="font-semibold text-amber-600">numerator</span> by <span className="font-semibold text-orange-600">denominator</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-amber-600">17/5</span> = <span className="font-bold text-orange-600">3 2/5</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Converting Mixed to Improper
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Formula:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-cyan-600">Improper</span> = <span className="font-semibold text-blue-600">(Whole × Denominator) + Numerator</span></p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-cyan-600">2 3/4</span> = <span className="font-semibold text-blue-600">(2 × 4) + 3</span> / <span className="font-semibold text-indigo-600">4</span></p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-cyan-600">2 3/4</span> = <span className="font-bold text-blue-600">11/4</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Equivalent Fractions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Multiply or divide <span className="font-semibold text-violet-600">numerator</span> and <span className="font-semibold text-purple-600">denominator</span> by the <span className="font-semibold text-indigo-600">same number</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-violet-600">2/3</span> = <span className="font-semibold text-purple-600">2 × 4</span> / <span className="font-semibold text-indigo-600">3 × 4</span> = <span className="font-bold text-violet-600">8/12</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Simplest Form (Reduction)
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Divide <span className="font-semibold text-red-600">numerator</span> and <span className="font-semibold text-rose-600">denominator</span> by their <span className="font-semibold text-pink-600">H.C.F</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-red-600">12/20</span> = <span className="font-bold text-rose-600">3/5</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
              Comparing Fractions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">If denominators are different: Make them <span className="font-semibold text-emerald-600">same (LCM)</span> and <span className="font-semibold text-teal-600">compare</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-emerald-600">3/4</span> and <span className="font-bold text-teal-600">5/6</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">LCM of 4 and 6 = <span className="font-semibold text-cyan-600">12</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-1"><span className="font-bold text-emerald-600">3/4</span> = <span className="font-semibold text-teal-600">9/12</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-emerald-600">5/6</span> = <span className="font-semibold text-teal-600">10/12</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">So <span className="font-bold text-emerald-600">5/6</span> &gt; <span className="font-bold text-teal-600">3/4</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Addition of Fractions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Like fractions:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-3">Add <span className="font-semibold text-blue-600">numerators</span></p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-blue-600">5/9</span> + <span className="font-bold text-indigo-600">2/9</span> = <span className="font-bold text-purple-600">7/9</span></p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Unlike fractions:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Convert to <span className="font-semibold text-indigo-600">like denominators</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-indigo-600">1/6</span> + <span className="font-bold text-purple-600">1/3</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">LCM of 6 and 3 = <span className="font-semibold text-purple-600">6</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-indigo-600">1/3</span> = <span className="font-semibold text-purple-600">2/6</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">So, <span className="font-bold text-indigo-600">1/6</span> + <span className="font-bold text-purple-600">2/6</span> = <span className="font-bold text-indigo-600">3/6</span> = <span className="font-bold text-purple-600">1/2</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Subtraction of Fractions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Make <span className="font-semibold text-green-600">denominators same</span> → subtract <span className="font-semibold text-emerald-600">numerators</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example 1:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-green-600">7/8</span> - <span className="font-bold text-emerald-600">3/8</span> = <span className="font-bold text-teal-600">4/8</span> = <span className="font-bold text-green-600">1/2</span></p>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example 2:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-teal-600">5/6</span> - <span className="font-bold text-green-600">1/3</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">LCM of 6 and 3 = <span className="font-semibold text-green-600">6</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-teal-600">1/3</span> = <span className="font-semibold text-green-600">2/6</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">So, <span className="font-bold text-teal-600">5/6</span> - <span className="font-bold text-green-600">2/6</span> = <span className="font-bold text-teal-600">3/6</span> = <span className="font-bold text-green-600">1/2</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Multiplication of Fractions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Multiply <span className="font-semibold text-amber-600">numerator × numerator</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">Multiply <span className="font-semibold text-orange-600">denominator × denominator</span></p>
              </div>
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border-l-4 border-orange-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-amber-600">4/5</span> × <span className="font-bold text-orange-600">3/7</span> = <span className="font-bold text-yellow-600">12/35</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Division of Fractions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">Change the <span className="font-semibold text-cyan-600">divisor</span> to its <span className="font-semibold text-blue-600">reciprocal</span> and <span className="font-semibold text-indigo-600">multiply</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-cyan-600">3/4</span> ÷ <span className="font-bold text-blue-600">2/5</span> = <span className="font-bold text-cyan-600">3/4</span> × <span className="font-bold text-blue-600">5/2</span></p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-cyan-600">3/4</span> ÷ <span className="font-bold text-blue-600">2/5</span> = <span className="font-bold text-indigo-600">15/8</span></p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isSimpleEquationsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              11. SIMPLE EQUATIONS
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">Content for Simple Equations will be added here.</p>
            </div>
          </div>
        </div>
      );
    }

    if (isRatioProportionLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              12. RATIO AND PROPORTION
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">In our daily life, we come across many situations where we <span className="font-semibold text-blue-600">estimate</span>, <span className="font-semibold text-green-600">calculate</span>, and <span className="font-semibold text-purple-600">compare quantities</span>. We compare a lot of things, such as <span className="font-semibold text-orange-600">prices</span>, <span className="font-semibold text-amber-600">heights</span>, <span className="font-semibold text-red-600">weights</span>, etc. We often compare quantities, and comparisons are done in different ways.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Ratio
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-blue-600">Ratio</span> is a <span className="font-semibold text-indigo-600">comparison between two quantities</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-2">We use the symbol <span className="font-bold text-blue-600">(:)</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">The ratio of two quantities <span className="font-semibold text-indigo-600">"a"</span> and <span className="font-semibold text-purple-600">"b"</span> is <span className="font-bold text-blue-600">a : b</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Proportion
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">When we <span className="font-semibold text-green-600">compare two ratios</span>, the relationship is called a <span className="font-semibold text-emerald-600">proportion</span>.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-2">We use the symbol <span className="font-bold text-green-600">(::)</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">If two ratios <span className="font-semibold text-emerald-600">a : b</span> and <span className="font-semibold text-teal-600">c : d</span> are equal, we write <span className="font-bold text-green-600">a : b :: c : d</span></p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Note:</p>
                <p className="text-gray-700 text-sm leading-relaxed">If two ratios are in proportion, then the <span className="font-semibold text-emerald-600">product of their extremes</span> is equal to the <span className="font-semibold text-teal-600">product of their means</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">If <span className="font-bold text-green-600">a : b :: c : d</span> then <span className="font-bold text-emerald-600">ad = bc</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Examples of Ratio
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">S.No</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">First quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Second quantity</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Comparing Fraction form</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Simple ratio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-purple-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">01</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">10 balls in the first basket</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">15 balls in the second basket</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">10:15 = 10/15 = 2/3</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">2 : 3</td>
                    </tr>
                    <tr className="hover:bg-purple-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">02</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">2kg of rice</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">500 grams of rice</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">2kg : 500gm = 2000:500 = 2000/500</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-pink-600">4 : 1</td>
                    </tr>
                    <tr className="hover:bg-purple-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">03</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">5m long red ribbon</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">3m long Black ribbon</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                    </tr>
                    <tr className="hover:bg-purple-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-purple-600">04</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">45 match sticks in the first box</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">30 match sticks in the second box</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Activity 1
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Use the proportions given to fill in the blanks:</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse bg-white rounded-lg shadow-sm">
                  <thead>
                    <tr className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">S.No</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Proportion</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Product of extremes</th>
                      <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold">Product of means</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">01</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">2 : 3 :: 4 : 6</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">02</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">5 : 4 :: 20 : 16</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                    </tr>
                    <tr className="hover:bg-amber-50">
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-amber-600">03</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm font-semibold text-orange-600">25 : 1 :: 75 : 3</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                      <td className="border border-gray-300 px-4 py-2 text-sm">—</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">1. Define ratio and proportion. Give example.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">2. What is the ratio between 100 and 10? Express your answer in the simplest form possible.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">3. Write the simplest form of the ratio for 1 day and 6 weeks.</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">4. Rani takes 20 minutes to reach the school from her home, whereas Posha takes 25 minutes from her home. Find the ratio of time taken by them to reach the school.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">5. A rectangle measures 40 cm in length and 20 cm in width. Find the ratio of the length to the width.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">6. Express the following ratios in their simplest form:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(i) 5 : 10</p>
                  <p>(ii) 16 : 18</p>
                  <p>(iii) 14 : 21</p>
                  <p>(iv) 8 : 24</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">7. In a class of 40 students, there are 24 boys. Then</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(i) find the ratio of the number of girls to the number of boys in that class</p>
                  <p>(ii) find the ratio of the number of girls to the total number of students in that class.</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">8. Vishwanath cuts the part of an apple and gives it to Ramu, find the ratio of parts of the apple shared by Vishwanath and Ramu.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">9. A basket contains a dozen bananas. Akhila and Radha have to share the bananas, in 1 : 3 ratios. Find the number of bananas each will get.</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">10. Divide Rs. 2400 between Shyam and Kalyan in 3 : 5. Find how much amount each will receive?</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">11. The income and savings of an employee are in the ratio of 10 : 3. If his expenditure is Rs. 7000/-, then find his savings.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isPercentagesProfitLossLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              13. PERCENTAGES, PROFIT AND LOSS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">We use <span className="font-semibold text-blue-600">percentages</span> in our daily life situations. The results of <span className="font-semibold text-green-600">examinations</span> are calculated through percentages. For <span className="font-semibold text-purple-600">discounts</span>, <span className="font-semibold text-orange-600">profit and loss</span>, and <span className="font-semibold text-amber-600">commission</span> we use percentages.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Key Concept - Percentage
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3"><span className="font-semibold text-blue-600">Percentage:</span> The word <span className="font-semibold text-indigo-600">"percent"</span> means <span className="font-semibold text-purple-600">"per every hundred"</span> or <span className="font-semibold text-blue-600">"for a hundred"</span>. The comparative calculation of a quantity for every 100 units (percent) is known as a <span className="font-semibold text-indigo-600">percentage</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-2">The symbol <span className="font-bold text-blue-600">%</span> means percent.</p>
                <p className="text-gray-700 text-sm leading-relaxed">The fractions whose <span className="font-semibold text-indigo-600">denominators are equal to 100</span> can be expressed in <span className="font-semibold text-purple-600">percentage form</span>. By simplification, percentages can be expressed in <span className="font-semibold text-blue-600">fraction form</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Profit and Loss
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2"><span className="text-green-600">Cost Price (C.P.):</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-green-600">value/price</span> at which we <span className="font-semibold text-emerald-600">purchase</span> an article is known as the <span className="font-semibold text-teal-600">cost price</span> denoted by <span className="font-bold text-green-600">CP</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2"><span className="text-emerald-600">Selling Price (S.P.):</span></p>
                <p className="text-gray-700 text-sm leading-relaxed">The <span className="font-semibold text-emerald-600">price</span> at which we <span className="font-semibold text-teal-600">sell</span> an article is known as the <span className="font-semibold text-green-600">selling price</span> denoted by <span className="font-bold text-emerald-600">SP</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-green-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2"><span className="text-teal-600">Profit:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">If the <span className="font-semibold text-teal-600">selling price</span> is <span className="font-semibold text-green-600">more than</span> the cost price, then the <span className="font-semibold text-emerald-600">profit</span> is incurred denoted by <span className="font-bold text-teal-600">"p"</span> (or) <span className="font-bold text-green-600">"G"</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed font-semibold"><span className="text-teal-600">Profit = S.P - C.P.</span></p>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2"><span className="text-green-600">Loss:</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">If the <span className="font-semibold text-green-600">selling price</span> is <span className="font-semibold text-emerald-600">less than</span> the cost price, then a <span className="font-semibold text-teal-600">loss</span> is incurred, denoted by <span className="font-bold text-green-600">"L"</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed font-semibold"><span className="text-green-600">Loss = C.P. - S.P.</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Example 1
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A shopkeeper bought a suitcase for Rs 1840. He sold it for Rs. 1360. Find whether he is at a profit or loss.</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Solution:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">The cost price of the suitcase = <span className="font-bold text-purple-600">Rs 1840</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">The selling price of the suitcase = <span className="font-bold text-pink-600">Rs 1360</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Since <span className="font-semibold text-pink-600">S.P &lt; C.P</span>, there is a <span className="font-semibold text-rose-600">loss</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-purple-600">Loss</span> = <span className="font-semibold text-pink-600">C.P - S.P</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">= <span className="font-bold text-purple-600">1840 – 1360</span> = <span className="font-bold text-rose-600">480</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Hence, the shopkeeper suffered a loss of <span className="font-bold text-rose-600">Rs 480/-</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Example 2
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Rahul is a TV mechanic. He bought a second-hand TV for Rs 3430 and spent Rs 580 on its repairs. He sold the TV for Rs. 4380. Find the profit or loss in this transaction.</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Solution:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">The cost of the TV = <span className="font-bold text-amber-600">Rs 3430</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Cost of the repairs = <span className="font-bold text-orange-600">Rs 580</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Total C.P of the TV = <span className="font-bold text-amber-600">3430 + 580</span> = <span className="font-bold text-orange-600">4010</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">S.P of the TV = <span className="font-bold text-yellow-600">4380</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">Since <span className="font-semibold text-yellow-600">S.P &gt; C.P</span>, Rahul made a <span className="font-semibold text-amber-600">profit</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-amber-600">Profit</span> = <span className="font-semibold text-orange-600">S.P - C.P.</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">P = <span className="font-bold text-yellow-600">4380 – 4010</span> = <span className="font-bold text-amber-600">370</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">Hence, Rahul made a profit of <span className="font-bold text-amber-600">Rs 370</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">1. Convert the following fractions into percentage:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(i) 1/2</p>
                  <p>(ii) 1/4</p>
                  <p>(iii) 1/5</p>
                  <p>(iv) 4/25</p>
                  <p>(v) 9/20</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">2. In a school of 500 children, 350 children are boys. Find the percentage of boys.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">3. A student secured 375 marks in an examination. If the total marks are 500, find his percentage of marks.</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">4. A man buys a doll for Rs 150 and sells it for Rs 180. Find his profit %.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">5. A man bought a TV for Rs 7200 and spent Rs. 500 on its repair. If he sells the TV for Rs 8000, find his loss or gain percent.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">6. A man bought a sheep for Rs 4000 and sold it at a loss of 8%. Find selling price.</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">7. A man buys a shirt for Rs 450 and sells it at a profit of 7%. Find his selling price.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isSimpleInterestLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              14. SIMPLE INTEREST
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">Simple interest is the <span className="font-semibold text-blue-600">interest calculated</span> on the <span className="font-semibold text-green-600">principal amount</span> for a given <span className="font-semibold text-purple-600">period of time</span> at a given <span className="font-semibold text-orange-600">rate</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Key Terms
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">The amount borrowed is called the <span className="font-semibold text-blue-600">principal (P)</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 border-l-4 border-indigo-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">The extra money paid for using the borrowed money is called <span className="font-semibold text-indigo-600">interest</span>.</p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed">The extra money paid after the completion of the fixed period is called <span className="font-semibold text-purple-600">simple interest (SI)</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Formula for Simple Interest
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2 text-center"><span className="text-green-600">SI = (P × R × T) / 100</span></p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Where:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-semibold text-green-600">P</span> = Principal</p>
                  <p><span className="font-semibold text-emerald-600">R</span> = Rate of interest</p>
                  <p><span className="font-semibold text-teal-600">T</span> = Time in years</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Amount
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">The total money paid back after the time period is called the <span className="font-semibold text-purple-600">amount (A)</span>.</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-purple-600">Amount = Principal + Interest</span></p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-semibold text-pink-600">A = P + SI</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Example 1
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Find the simple interest on Rs. 500 at 5% per year for 2 years.</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Solution:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">P = <span className="font-bold text-amber-600">500</span>, R = <span className="font-bold text-orange-600">5%</span>, T = <span className="font-bold text-yellow-600">2 years</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-amber-600">SI</span> = <span className="font-semibold text-orange-600">(500 × 5 × 2) / 100</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-amber-600">SI</span> = <span className="font-semibold text-orange-600">5000 / 100</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-amber-600">SI</span> = <span className="font-bold text-orange-600">Rs. 50</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Example 2
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Find the simple interest and the amount on Rs. 3500 at 4% for 3 years.</p>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Solution:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">P = <span className="font-bold text-cyan-600">3500</span>, R = <span className="font-bold text-blue-600">4%</span>, T = <span className="font-bold text-indigo-600">3 years</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-cyan-600">SI</span> = <span className="font-semibold text-blue-600">(3500 × 4 × 3) / 100</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-cyan-600">SI</span> = <span className="font-semibold text-blue-600">42000 / 100</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-semibold text-cyan-600">SI</span> = <span className="font-bold text-blue-600">Rs. 420</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-3"><span className="font-semibold text-cyan-600">Amount</span> = <span className="font-semibold text-blue-600">P + SI</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">= <span className="font-bold text-cyan-600">3500 + 420</span> = <span className="font-bold text-blue-600">Rs. 3920</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">1. Find the simple interest on Rs. 200 at 5% for 2 years.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">2. Find the simple interest and amount on Rs. 1500 at 7% for 4 years.</p>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">3. What will be the simple interest on Rs. 820 at 6% for 3 years?</p>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">4. A boy borrows Rs. 5000 for 2 years at the rate of 5% per year. Find the amount he will return.</p>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm mb-2">5. Find the simple interest when principal = Rs. 800, rate = 10% and time = 5 years.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isAlgebraicExpressionsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              15. ALGEBRAIC EXPRESSIONS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600"><span className="font-semibold text-blue-600">Algebra</span> is the branch of mathematics that uses <span className="font-semibold text-green-600">letters or symbols</span> to represent numbers.</p>
              <p className="mb-3 text-gray-600">These symbols are used to form <span className="font-semibold text-purple-600">expressions</span> and <span className="font-semibold text-orange-600">equations</span>.</p>
              <p className="mb-3 text-gray-600">An <span className="font-semibold text-blue-600">algebraic expression</span> is a combination of <span className="font-semibold text-green-600">variables</span>, <span className="font-semibold text-purple-600">constants</span>, and <span className="font-semibold text-orange-600">mathematical operations</span> such as addition, subtraction, multiplication, and division.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-bold text-blue-600">3x + 4</span></p>
                  <p><span className="font-bold text-indigo-600">7y – 5</span></p>
                  <p><span className="font-bold text-purple-600">2a + 3b – 6</span></p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Terms
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Each part of an algebraic expression separated by <span className="font-semibold text-green-600">+</span> or <span className="font-semibold text-emerald-600">–</span> is called a <span className="font-semibold text-teal-600">term</span>.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed">In <span className="font-bold text-green-600">5x + 3y – 2</span>, the terms are <span className="font-semibold text-emerald-600">5x</span>, <span className="font-semibold text-teal-600">3y</span>, and <span className="font-semibold text-green-600">–2</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Constant
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A number <span className="font-semibold text-purple-600">without a variable</span> is called a <span className="font-semibold text-pink-600">constant</span>.</p>
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-purple-600">2</span>, <span className="font-bold text-pink-600">–5</span>, <span className="font-bold text-rose-600">10</span>, <span className="font-bold text-purple-600">100</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Variable
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A symbol (usually a letter) used to represent an <span className="font-semibold text-amber-600">unknown number</span> is called a <span className="font-semibold text-orange-600">variable</span>.</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Examples:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-amber-600">x</span>, <span className="font-bold text-orange-600">y</span>, <span className="font-bold text-yellow-600">a</span>, <span className="font-bold text-amber-600">b</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Coefficient
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">A number <span className="font-semibold text-cyan-600">multiplied by a variable</span> is called its <span className="font-semibold text-blue-600">coefficient</span>.</p>
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">In <span className="font-bold text-cyan-600">7x</span>, the coefficient of x is <span className="font-bold text-blue-600">7</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed">In <span className="font-bold text-cyan-600">–4y</span>, the coefficient of y is <span className="font-bold text-blue-600">–4</span>.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Like and Unlike Terms
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2"><span className="text-violet-600">Like terms:</span> Terms having the <span className="font-semibold text-purple-600">same variable and exponent</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-violet-700">Example:</span> <span className="font-bold text-violet-600">3x</span>, <span className="font-bold text-purple-600">–2x</span>, <span className="font-bold text-indigo-600">10x</span></p>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2"><span className="text-purple-600">Unlike terms:</span> Terms with <span className="font-semibold text-indigo-600">different variables or powers</span>.</p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2"><span className="font-semibold text-purple-700">Example:</span> <span className="font-bold text-purple-600">4x</span>, <span className="font-bold text-indigo-600">7y</span>, <span className="font-bold text-violet-600">6a</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Addition and Subtraction of Algebraic Expressions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Only <span className="font-semibold text-green-600">like terms</span> can be added or subtracted.</p>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-l-4 border-green-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-green-600">(5x + 3y) + (2x + 4y)</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">= <span className="font-semibold text-emerald-600">(5x + 2x) + (3y + 4y)</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">= <span className="font-bold text-green-600">7x + 7y</span></p>
              </div>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm mt-4">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-emerald-600">(9a – 3b) – (4a + 2b)</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">= <span className="font-semibold text-teal-600">9a – 3b – 4a – 2b</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2">= <span className="font-semibold text-emerald-600">(9a – 4a) + (–3b – 2b)</span></p>
                <p className="text-gray-700 text-sm leading-relaxed mt-2">= <span className="font-bold text-emerald-600">5a – 5b</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-5 shadow-lg border border-blue-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-blue-200">
              Multiplication of Expressions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Multiply <span className="font-semibold text-blue-600">constants</span> and <span className="font-semibold text-indigo-600">variables</span> separately.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-blue-600">(3x)(4y)</span> = <span className="font-bold text-indigo-600">12xy</span></p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-blue-600">(2x)(2x)</span> = <span className="font-bold text-indigo-600">4x²</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Division of Expressions
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">Divide <span className="font-semibold text-amber-600">coefficients</span> and <span className="font-semibold text-orange-600">variables</span>.</p>
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm leading-relaxed mb-2"><span className="font-bold text-amber-600">12x / 3</span> = <span className="font-bold text-orange-600">4x</span></p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-amber-600">15x² / 5x</span> = <span className="font-bold text-orange-600">3x</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">1. Identify constants, variables, and coefficients in:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) 7x + 5</p>
                  <p>(b) 9y – 2</p>
                  <p>(c) 4a + 3b – 8</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">2. Add the following:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) 4x + 5x</p>
                  <p>(b) 7a + 3a – 2a</p>
                  <p>(c) 6p + 2p + 3</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border-l-4 border-pink-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">3. Subtract:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) (8x – 3) – (5x – 2)</p>
                  <p>(b) (9y + 4) – (2y + 1)</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">4. Multiply:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) (2x × 3y)</p>
                  <p>(b) (5a × a)</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-lg p-4 border-l-4 border-rose-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">5. Simplify:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) 9x + 4x – 2x</p>
                  <p>(b) 12a – 3a + 6</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (isLinearEquationsLesson) {
      return (
        <div className="space-y-6">
          <div className="bg-white rounded-b-2xl rounded-t-none p-6 pt-6 shadow-lg border-t-0 border-l border-r border-b border-stone-200/50 hover:shadow-xl transition-all duration-300">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 bg-clip-text text-transparent mb-4 pb-2 border-b-2 border-red-200">
              16. LINEAR EQUATIONS
            </h2>
            
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="mb-3 text-gray-600">An <span className="font-semibold text-blue-600">equation</span> is a statement of <span className="font-semibold text-green-600">equality</span> that contains one or more <span className="font-semibold text-purple-600">variables</span>.</p>
              <p className="mb-3 text-gray-600">A <span className="font-semibold text-blue-600">linear equation</span> is an equation in which the <span className="font-semibold text-green-600">highest power</span> of the variable is <span className="font-semibold text-purple-600">1</span>.</p>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-l-4 border-blue-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <div className="space-y-1 text-gray-700 text-sm">
                  <p><span className="font-bold text-blue-600">x + 3 = 5</span></p>
                  <p><span className="font-bold text-indigo-600">2y – 4 = 10</span></p>
                </div>
              </div>
              <p className="mb-3 text-gray-600 mt-4">The <span className="font-semibold text-blue-600">solution</span> of a linear equation is the <span className="font-semibold text-green-600">value of the variable</span> that makes the equation <span className="font-semibold text-purple-600">true</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl p-5 shadow-lg border border-green-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-green-200">
              Solving Simple Linear Equations
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">To solve a linear equation, we perform the <span className="font-semibold text-green-600">same mathematical operation</span> on <span className="font-semibold text-emerald-600">both sides</span> until the variable is <span className="font-semibold text-teal-600">isolated</span>.</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-2xl p-5 shadow-lg border border-purple-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-purple-200">
              Example 1
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-500 shadow-sm">
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-purple-600">x + 5 = 12</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-pink-600">x = 12 – 5</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mt-2"><span className="font-bold text-rose-600">x = 7</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 shadow-lg border border-amber-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-amber-200">
              Example 2
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4 border-l-4 border-amber-500 shadow-sm">
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-amber-600">y – 8 = 20</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-orange-600">y = 20 + 8</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mt-2"><span className="font-bold text-yellow-600">y = 28</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-cyan-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-cyan-200">
              Example 3
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-cyan-600">3x = 21</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-blue-600">x = 21 ÷ 3</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mt-2"><span className="font-bold text-indigo-600">x = 7</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-violet-50 via-purple-50 to-indigo-50 rounded-2xl p-5 shadow-lg border border-violet-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-violet-200">
              Example 4
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-lg p-4 border-l-4 border-violet-500 shadow-sm">
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-violet-600">4y + 6 = 22</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-purple-600">4y = 22 – 6</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-indigo-600">4y = 16</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mb-2"><span className="font-bold text-violet-600">y = 16 ÷ 4</span></p>
                <p className="text-gray-700 text-sm font-mono leading-relaxed mt-2"><span className="font-bold text-purple-600">y = 4</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 rounded-2xl p-5 shadow-lg border border-red-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-red-200">
              Checking a Solution
            </h3>
            <div className="space-y-3 text-gray-700 leading-relaxed text-sm">
              <p className="text-gray-600 mb-3">To verify, <span className="font-semibold text-red-600">substitute the value</span> back into the equation to check if <span className="font-semibold text-rose-600">both sides are equal</span>.</p>
              <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4 border-l-4 border-red-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">Example:</p>
                <p className="text-gray-700 text-sm font-semibold mb-2">Solve and verify:</p>
                <div className="bg-white rounded p-3 mt-2 mb-3">
                  <p className="text-gray-700 text-sm font-mono leading-relaxed mb-1"><span className="font-bold text-red-600">2x + 4 = 14</span></p>
                  <p className="text-gray-700 text-sm font-mono leading-relaxed mb-1"><span className="font-bold text-rose-600">2x = 14 – 4</span></p>
                  <p className="text-gray-700 text-sm font-mono leading-relaxed mb-1"><span className="font-bold text-pink-600">2x = 10</span></p>
                  <p className="text-gray-700 text-sm font-mono leading-relaxed mb-1"><span className="font-bold text-red-600">x = 10 ÷ 2</span></p>
                  <p className="text-gray-700 text-sm font-mono leading-relaxed mt-2"><span className="font-bold text-rose-600">x = 5</span></p>
                </div>
                <p className="text-gray-700 text-sm font-semibold mb-2 mt-3">Check:</p>
                <p className="text-gray-700 text-sm leading-relaxed"><span className="font-bold text-red-600">2(5) + 4</span> = <span className="font-semibold text-rose-600">10 + 4</span> = <span className="font-bold text-pink-600">14</span> <span className="text-green-600 font-semibold">(True)</span></p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-5 shadow-lg border border-emerald-200/50 hover:shadow-xl transition-all duration-300">
            <h3 className="text-lg font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-3 pb-2 border-b-2 border-emerald-200">
              EXERCISE
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed text-sm">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-4 border-l-4 border-emerald-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">1. Solve the following equations:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) x + 9 = 15</p>
                  <p>(b) y − 6 = 20</p>
                  <p>(c) 5a = 30</p>
                  <p>(d) 7b + 2 = 23</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg p-4 border-l-4 border-teal-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">2. Solve and verify:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) 3x + 4 = 19</p>
                  <p>(b) 8y − 5 = 43</p>
                </div>
              </div>
              <div className="bg-gradient-to-r from-cyan-50 to-emerald-50 rounded-lg p-4 border-l-4 border-cyan-500 shadow-sm">
                <p className="text-gray-700 text-sm font-semibold mb-2">3. Find the value of the variable:</p>
                <div className="space-y-1 text-gray-700 text-sm ml-4">
                  <p>(a) 6n = 42</p>
                  <p>(b) 2p + 6 = 20</p>
                  <p>(c) 9m − 8 = 19</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Default content for other lessons
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-200">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
            {activeLesson.title}
          </h2>
          <p className="text-stone-600">
            Content for {activeLesson.title} will be added here.
          </p>
        </div>
      </div>
    );
  };

  const renderTextbook = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Mathematics - Textbook</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">Mathematics textbook coming soon...</p>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Mathematics - Educational Videos</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <Video className="w-12 h-12 mx-auto text-stone-300 mb-4" />
        <h3 className="text-xl font-semibold text-red-800 mb-2">Video playlists coming soon</h3>
        <p className="text-stone-600">
          We are preparing curated YouTube playlists for Mathematics. Add your favourite videos to the backlog and we will include them here.
        </p>
      </div>
    </div>
  );

  const renderPapers = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Mathematics - Model Papers</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">Mathematics model papers coming soon...</p>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Mathematics - Practice Quiz</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">Mathematics quiz coming soon...</p>
      </div>
    </div>
  );

  const renderSimulator = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Mathematics - Interactive Simulators</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">Mathematics simulators coming soon...</p>
      </div>
    </div>
  );

  const renderAssistant = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-red-800 mb-4">Mathematics - AI Assistant</h2>
      <div className="bg-white rounded-lg p-6 shadow-md border border-stone-200">
        <p className="text-stone-700">AI Assistant for Mathematics coming soon...</p>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'textbook':
        return renderTextbook();
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
  };

  return (
    <div className="h-screen bg-gradient-to-br from-red-50 via-stone-50 to-orange-50 relative flex flex-col">
      <CursorTrail />
      {/* Floating Math Symbols */}
      <FloatingSymbol icon={Sigma} className="top-20 left-1/6" delay={0} />
      <FloatingSymbol icon={Sigma} className="top-2/3 right-1/5" delay={4} />
      <FloatingSymbol icon={BookOpen} className="top-1/2 left-1/12" delay={8} />
      
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
      <header className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-red-100 to-stone-100 border-b border-stone-200 shadow-sm transition-all duration-300">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-800 mb-1">
                Mathematics
              </h1>
              <p className="text-sm text-stone-600">
                Master numbers, operations, and problem-solving with structured lessons and practice.
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
              className={`hidden lg:flex items-center gap-1.5 pb-1.5 border-b-2 border-transparent text-red-700 hover:text-red-800 hover:scale-105 active:scale-95 transition-all duration-300 px-2.5 py-0.5 rounded-lg text-sm ${
                sidebarOpen
                  ? 'bg-red-100 border-red-300 font-semibold'
                  : 'bg-red-50 hover:bg-red-100'
              }`}
            >
              <GraduationCap 
                size={18} 
                className={`transition-transform duration-300 text-red-600 ${
                  sidebarOpen ? 'rotate-90' : 'rotate-0'
                }`}
              />
              <span className="transition-all duration-300">
                Lessons
              </span>
            </button>
            <div className="flex gap-6 ml-8">
              <button
                onClick={() => handleTabChange('overview')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none text-sm ${
                  activeTab === 'overview'
                    ? 'border-red-500 text-red-600 font-semibold'
                    : 'border-transparent text-stone-600 hover:text-stone-800'
                }`}
              >
                <LayoutDashboard size={18} className="text-red-600" />
                Overview
              </button>
              <button
                onClick={() => handleTabChange('textbook')}
                className={`nav-tab flex items-center gap-1.5 pb-1.5 border-b-2 transition-all duration-300 focus:outline-none text-sm ${
                  activeTab === 'textbook' 
                    ? 'border-red-500 text-red-600 font-semibold' 
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
                    ? 'border-red-500 text-red-600 font-semibold' 
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
                    ? 'border-red-500 text-red-600 font-semibold' 
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
                    ? 'border-red-500 text-red-600 font-semibold' 
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
                    ? 'border-red-500 text-red-600 font-semibold' 
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
                <div className="mb-2">
                  <div className="w-full flex items-center justify-between py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-gradient-to-br from-red-500 to-orange-500 rounded-full shadow-sm"></div>
                      <span className="font-semibold text-gray-800">Mathematics</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-b from-white/80 to-gray-50/60 backdrop-blur-sm border-l border-gray-200/50 ml-4 rounded-r-lg shadow-inner overflow-y-auto">
                    <div className="py-2">
                      {mathLessons.map((lesson, index) => (
                        <ChapterItem
                          key={lesson.id}
                          title={lesson.title}
                          active={activeLessonId === lesson.id}
                          onClick={() => {
                            setActiveLessonId(lesson.id);
                            setActiveTab('overview');
                          }}
                          delay={(index + 1) * 100}
                          number={index + 1}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            <div className="pt-0 px-6 pb-6">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MathPage;

