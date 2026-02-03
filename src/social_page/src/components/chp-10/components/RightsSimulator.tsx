import React, { useState } from 'react';
import { CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';
import { FUNDAMENTAL_RIGHTS, SCENARIOS } from '../constants';
import { Right } from '../types';

export const RightsSimulator: React.FC = () => {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null);
  const [completed, setCompleted] = useState(false);

  const currentScenario = SCENARIOS[currentScenarioIndex];

  const handleSelectRight = (rightId: string) => {
    if (feedback) return; // Prevent double clicking

    const isCorrect = rightId === currentScenario.correctRightId;
    
    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback({
        isCorrect: true,
        message: "Correct! " + currentScenario.explanation
      });
    } else {
      setFeedback({
        isCorrect: false,
        message: "Not quite. " + currentScenario.explanation
      });
    }
  };

  const handleNext = () => {
    setFeedback(null);
    if (currentScenarioIndex < SCENARIOS.length - 1) {
      setCurrentScenarioIndex(prev => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentScenarioIndex(0);
    setScore(0);
    setFeedback(null);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="text-center py-12 animate-fade-in bg-white rounded-2xl shadow-xl p-8">
        <div className="inline-block p-4 bg-yellow-100 rounded-full mb-6">
          <Trophy size={64} className="text-yellow-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Simulation Complete!</h2>
        <p className="text-xl text-slate-600 mb-8">
          You scored <span className="font-bold text-blue-600">{score}</span> out of <span className="font-bold">{SCENARIOS.length}</span>.
        </p>
        <button
          onClick={handleRestart}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw size={20} />
          Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800">Fundamental Rights Simulator</h2>
        <p className="text-slate-600">Act as a Judge! Match the situation to the correct Fundamental Right.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Scenario Card */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl h-full flex flex-col justify-between relative overflow-hidden">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10"></div>
             <div>
               <div className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-2">
                 Case File #{currentScenario.id}
               </div>
               <p className="text-xl font-medium leading-relaxed">
                 "{currentScenario.scenario}"
               </p>
             </div>
             <div className="mt-8">
               <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                 <div 
                    className="bg-blue-500 h-full transition-all duration-500" 
                    style={{ width: `${((currentScenarioIndex) / SCENARIOS.length) * 100}%` }}
                 ></div>
               </div>
               <div className="text-right text-sm text-slate-400 mt-2">
                 {currentScenarioIndex + 1} / {SCENARIOS.length}
               </div>
             </div>
          </div>
        </div>

        {/* Options Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FUNDAMENTAL_RIGHTS.map((right: Right) => (
              <button
                key={right.id}
                onClick={() => handleSelectRight(right.id)}
                disabled={feedback !== null}
                className={`p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-start gap-3
                  ${feedback 
                    ? feedback.isCorrect && right.id === currentScenario.correctRightId 
                      ? 'bg-green-50 border-green-500 ring-2 ring-green-200'
                      : !feedback.isCorrect && right.id === currentScenario.correctRightId
                        ? 'bg-green-50 border-green-500' // Show correct answer if wrong
                        : 'bg-slate-50 border-slate-200 opacity-50'
                    : 'bg-white border-slate-200 hover:border-blue-400 hover:shadow-md'
                  }
                `}
              >
                <div className={`p-2 rounded-lg ${
                    feedback && right.id === currentScenario.correctRightId ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                }`}>
                    {/* Basic icon representation since we aren't dynamically rendering lucide components for simplicity in this structure, normally we'd map string to component */}
                   <span className="font-bold text-xs">{right.id.slice(0,2).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{right.title}</h4>
                </div>
              </button>
            ))}
          </div>

          {/* Feedback Overlay */}
          {feedback && (
            <div className={`mt-6 p-4 rounded-xl flex items-start gap-4 animate-fade-in ${
              feedback.isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              <div className="mt-1">
                {feedback.isCorrect ? <CheckCircle size={24} /> : <XCircle size={24} />}
              </div>
              <div className="flex-1">
                <p className="font-bold text-lg mb-1">{feedback.isCorrect ? 'Excellent!' : 'Incorrect'}</p>
                <p>{feedback.message}</p>
              </div>
              <button 
                onClick={handleNext}
                className="bg-white px-4 py-2 rounded-lg shadow-sm font-semibold text-sm hover:bg-slate-50 transition-colors whitespace-nowrap self-center"
              >
                {currentScenarioIndex < SCENARIOS.length - 1 ? 'Next Case' : 'Finish'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};