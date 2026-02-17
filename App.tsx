import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ControlBar } from './components/ControlBar';
import { AlertTable } from './components/AlertTable';
import { FeedLibrary } from './components/FeedLibrary';
import { FeedDashboard } from './components/FeedDashboard';
import { Tab, Alert, Plant, Camera } from './types';
import { analyzeAlerts } from './services/geminiService';
import { Info, BarChart3 } from 'lucide-react';

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
  },
  { 
    id: '4', 
    timestamp: '2026-02-15T13:30:00', 
    status: 'warning', 
    issueType: 'Contamination', 
    message: 'Possible foreign object (Wood/Plastic) detected with 85% confidence.', 
    validation: 'rejected',
    imagePlaceholder: 'bg-yellow-900'
  },
  { 
    id: '5', 
    timestamp: '2026-02-15T13:15:00', 
    status: 'critical', 
    issueType: 'Blockage Risk', 
    message: 'Aggregate pile height > 45cm detected.', 
    validation: null,
    imagePlaceholder: 'bg-red-950'
  }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<Tab>(Tab.ALERTS);
  const [selectedPlant, setSelectedPlant] = useState(MOCK_PLANTS[0]);
  const [selectedCamera, setSelectedCamera] = useState(MOCK_CAMERAS[0]);
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_ALERTS);
  
  // Gemini AI State
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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
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

      <ControlBar 
        onGenerateReport={handleGenerateReport}
        isGenerating={isGenerating}
      />

      <main className="max-w-7xl mx-auto px-6 py-8">
        
        {/* AI Insight Box */}
        {aiAnalysis && (
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

        {currentTab === Tab.FEED && (
          <FeedDashboard mode="live" />
        )}

        {currentTab === Tab.ALERTS && (
            <div className="space-y-6">
                <AlertTable alerts={alerts} onValidation={handleValidation} />
            </div>
        )}

        {currentTab === Tab.LIBRARY && (
            <FeedLibrary />
        )}

        {currentTab === Tab.ANALYTICS && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">Analytics Dashboard Placeholder</p>
                <p className="text-sm">Select 'Alerts' tab to view the main data table.</p>
            </div>
        )}

         {(currentTab !== Tab.ALERTS && currentTab !== Tab.LIBRARY && currentTab !== Tab.ANALYTICS && currentTab !== Tab.FEED) && (
            <div className="flex flex-col items-center justify-center h-96 text-slate-400">
                <Info className="w-16 h-16 mb-4 opacity-50" />
                <p className="text-lg">{currentTab} View</p>
                <p className="text-sm">Under Construction</p>
            </div>
        )}

      </main>
    </div>
  );
}