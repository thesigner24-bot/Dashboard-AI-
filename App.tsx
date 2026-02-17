import React, { useState } from 'react';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { AlertTable } from './components/AlertTable';
import { FeedLibrary } from './components/FeedLibrary';
import { FeedDashboard } from './components/FeedDashboard';
import ChatView from './components/ChatView';
import ImageView from './components/ImageView';
import VideoView from './components/VideoView';
import LiveView from './components/LiveView';
import { Tab, Alert, Plant, Camera, AppTab } from './types';
import { analyzeAlerts } from './services/geminiService';
import { Info, BarChart3, MessageSquare, Image, Film, Mic } from 'lucide-react';

const MOCK_PLANTS: Plant[] = [
  { id: '1', name: 'Angul' },
  { id: '2', name: 'Jharsuguda' },
  { id: '3', name: 'Raigarh' },
];

const MOCK_CAMERAS: Camera[] = [
  { id: 'c1', name: 'camJ31C1 (Conveyor A)' },
  { id: 'c2', name: 'camJ31C2 (Conveyor B)' },
  { id: 'c3', name: 'camCrusher01' },
];

const INITIAL_ALERTS: Alert[] = [
  { 
    id: '1', 
    timestamp: '2026-02-15T14:53:00', 
    status: 'critical', 
    issueType: 'Size Deviation', 
    message: '8-12mm particles size is more than 5.2%.', 
    validation: null,
    imagePlaceholder: 'bg-red-900'
  },
  { 
    id: '2', 
    timestamp: '2026-02-15T14:45:00', 
    status: 'warning', 
    issueType: 'Oversize', 
    message: 'Detected 150mm rock fragment on Belt 2.', 
    validation: 'confirmed',
    imagePlaceholder: 'bg-orange-800'
  },
  { 
    id: '3', 
    timestamp: '2026-02-15T14:12:00', 
    status: 'critical', 
    issueType: 'Size Deviation', 
    message: 'Fine particles < 2mm exceeding 12% threshold.', 
    validation: null,
    imagePlaceholder: 'bg-slate-800'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ALERTS);
  const [activeAiTab, setActiveAiTab] = useState<AppTab>(AppTab.CHAT);
  const [selectedPlant, setSelectedPlant] = useState(MOCK_PLANTS[0]);
  const [selectedCamera, setSelectedCamera] = useState(MOCK_CAMERAS[0]);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleValidation = (id: string, status: 'confirmed' | 'rejected') => {
    setAlerts(prev => prev.map(a => 
      a.id === id ? { ...a, validation: status === a.validation ? null : status } : a
    ));
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    const result = await analyzeAlerts(alerts);
    setAiAnalysis(result);
    setIsGenerating(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      <Header 
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        selectedPlant={selectedPlant}
        selectedCamera={selectedCamera}
        plants={MOCK_PLANTS}
        cameras={MOCK_CAMERAS}
        onPlantChange={setSelectedPlant}
        onCameraChange={setSelectedCamera}
      />

      {currentTab !== Tab.AI_TOOLS && (
        <ControlBar 
          onGenerateReport={handleGenerateReport}
          isGenerating={isGenerating}
        />
      )}

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 overflow-hidden flex flex-col">
        
        {aiAnalysis && currentTab !== Tab.AI_TOOLS && (
            <div className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex gap-4 animate-fadeIn">
                <div className="p-2 bg-white rounded-full h-fit shadow-sm">
                    <BarChart3 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                    <h3 className="text-sm font-bold text-indigo-900 mb-1">AI Operational Insight</h3>
                    <p className="text-sm text-indigo-800 leading-relaxed">{aiAnalysis}</p>
                </div>
                <button 
                  onClick={() => setAiAnalysis(null)}
                  className="ml-auto text-indigo-400 hover:text-indigo-600 self-start"
                >
                    &times;
                </button>
            </div>
        )}

        {currentTab === Tab.FEED && <FeedDashboard mode="live" />}

        {currentTab === Tab.ALERTS && <AlertTable alerts={alerts} onValidation={handleValidation} />}

        {currentTab === Tab.LIBRARY && <FeedLibrary />}

        {currentTab === Tab.AI_TOOLS && (
          <div className="flex flex-1 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[700px]">
            {/* AI Side Nav */}
            <div className="w-20 md:w-64 bg-slate-900 flex flex-col border-r border-slate-800 transition-all">
              <div className="p-6">
                <h2 className="hidden md:block text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Intelligence Suite</h2>
                <div className="space-y-2">
                  <AiNavButton icon={<MessageSquare size={18}/>} label="AI Chat" active={activeAiTab === AppTab.CHAT} onClick={() => setActiveAiTab(AppTab.CHAT)} />
                  <AiNavButton icon={<Image size={18}/>} label="Imaging" active={activeAiTab === AppTab.IMAGE} onClick={() => setActiveAiTab(AppTab.IMAGE)} />
                  <AiNavButton icon={<Film size={18}/>} label="Video Studio" active={activeAiTab === AppTab.VIDEO} onClick={() => setActiveAiTab(AppTab.VIDEO)} />
                  <AiNavButton icon={<Mic size={18}/>} label="Live Aura" active={activeAiTab === AppTab.LIVE} onClick={() => setActiveAiTab(AppTab.LIVE)} />
                </div>
              </div>
            </div>
            
            {/* AI Content Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50/30">
              {activeAiTab === AppTab.CHAT && <ChatView />}
              {activeAiTab === AppTab.IMAGE && <ImageView />}
              {activeAiTab === AppTab.VIDEO && <VideoView />}
              {activeAiTab === AppTab.LIVE && <LiveView />}
            </div>
          </div>
        )}

        {currentTab === Tab.ANALYTICS && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Analytics Dashboard Placeholder</p>
                <p className="text-sm">Extended historical reporting is available in AI Tools.</p>
            </div>
        )}
      </main>
    </div>
  );
}

const AiNavButton = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
      active 
      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
    }`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className="hidden md:block font-medium text-sm">{label}</span>
  </button>
);