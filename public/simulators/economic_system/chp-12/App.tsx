import React from 'react';
import { LearningModule } from './components/LearningModule';

const App: React.FC = () => {
  return (
    <div className="h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900 overflow-hidden relative">
      <main className="h-full w-full">
        <LearningModule />
      </main>
    </div>
  );
};

export default App;