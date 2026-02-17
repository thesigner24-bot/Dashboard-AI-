import React from 'react';
import { Calendar, Download, RefreshCw, Sparkles, Loader2 } from 'lucide-react';

interface ControlBarProps {
  onGenerateReport: () => void;
  isGenerating: boolean;
}

export const ControlBar: React.FC<ControlBarProps> = ({ onGenerateReport, isGenerating }) => {
  return (
    <div className="px-6 py-4 bg-white border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Left: Date Picker (Visual only for mock) */}
      <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
        <div className="flex items-center px-3 py-1.5 border-r border-slate-200">
          <Calendar className="w-4 h-4 text-slate-500 mr-2" />
          <span className="text-sm text-slate-700">15 Feb 2026</span>
        </div>
        <div className="flex items-center px-3 py-1.5">
           <span className="text-sm text-slate-700">Today</span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center space-x-3">
        <button 
          onClick={onGenerateReport}
          disabled={isGenerating}
          className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium border border-indigo-100"
        >
          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin"/> : <Sparkles className="w-4 h-4 mr-2" />}
          AI Insights
        </button>

        <div className="h-6 w-px bg-slate-300 mx-1"></div>

        <button className="flex items-center px-4 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </button>
        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </button>
      </div>
    </div>
  );
};