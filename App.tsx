
import React, { useState, useCallback, useEffect } from 'react';
import { Participant, AppView } from './types';
import ListInput from './components/ListInput';
import LuckyDraw from './components/LuckyDraw';
import AutoGrouping from './components/AutoGrouping';

const App: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentView, setCurrentView] = useState<AppView>(AppView.LIST_MANAGEMENT);

  const handleUpdateParticipants = (newList: Participant[]) => {
    setParticipants(newList);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navigation Header */}
      <header className="bg-indigo-600 text-white shadow-lg sticky top-0 z-50">
        <div className="max-container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <i className="fa-solid fa-people-group text-2xl"></i>
            <h1 className="text-xl font-bold tracking-tight">HR Pro Toolbox</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <button 
              onClick={() => setCurrentView(AppView.LIST_MANAGEMENT)}
              className={`hover:text-indigo-200 transition-colors ${currentView === AppView.LIST_MANAGEMENT ? 'border-b-2 border-white' : ''}`}
            >
              名單管理
            </button>
            <button 
              onClick={() => setCurrentView(AppView.LUCKY_DRAW)}
              className={`hover:text-indigo-200 transition-colors ${currentView === AppView.LUCKY_DRAW ? 'border-b-2 border-white' : ''}`}
            >
              獎品抽籤
            </button>
            <button 
              onClick={() => setCurrentView(AppView.GROUPING)}
              className={`hover:text-indigo-200 transition-colors ${currentView === AppView.GROUPING ? 'border-b-2 border-white' : ''}`}
            >
              自動分組
            </button>
          </nav>
          <div className="md:hidden">
             {/* Mobile simplicity */}
             <select 
               value={currentView} 
               onChange={(e) => setCurrentView(e.target.value as AppView)}
               className="bg-indigo-700 text-white border-none rounded px-2 py-1 text-sm focus:ring-0"
             >
               <option value={AppView.LIST_MANAGEMENT}>名單管理</option>
               <option value={AppView.LUCKY_DRAW}>獎品抽籤</option>
               <option value={AppView.GROUPING}>自動分組</option>
             </select>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {currentView === AppView.LIST_MANAGEMENT && (
          <ListInput 
            participants={participants} 
            onUpdate={handleUpdateParticipants} 
            onNext={() => setCurrentView(AppView.LUCKY_DRAW)}
          />
        )}
        
        {currentView === AppView.LUCKY_DRAW && (
          <LuckyDraw 
            participants={participants}
          />
        )}

        {currentView === AppView.GROUPING && (
          <AutoGrouping 
            participants={participants}
          />
        )}
      </main>

      <footer className="bg-slate-100 py-6 border-t">
        <div className="container mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; 2024 HR Pro Toolbox. Designed for excellence.
        </div>
      </footer>
    </div>
  );
};

export default App;
