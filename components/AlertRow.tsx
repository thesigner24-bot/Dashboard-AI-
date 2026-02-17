
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ThumbsUp, ThumbsDown, AlertCircle, AlertTriangle } from 'lucide-react';
import { Alert } from '../types';

interface AlertRowProps {
  alert: Alert;
  onValidation: (id: string, status: 'confirmed' | 'rejected') => void;
}

export const AlertRow: React.FC<AlertRowProps> = ({ alert, onValidation }) => {
  const [expanded, setExpanded] = useState(false);

  // Helper to highlight numbers
  const renderMessage = (text: string) => {
    // Regex to match numbers, including percentages and decimals
    const parts = text.split(/(\d+(?:\.\d+)?%?)/);
    return (
      <span className="text-slate-700">
        {parts.map((part, i) => 
          /\d/.test(part) ? <span key={i} className="font-bold text-slate-900">{part}</span> : part
        )}
      </span>
    );
  };

  const getStatusIcon = (status: 'critical' | 'warning') => {
    if (status === 'critical') return <div className="w-2.5 h-2.5 rounded-full bg-red-500 ring-4 ring-red-50" />;
    return <div className="w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-orange-50" />;
  };

  return (
    <>
      <tr 
        onClick={() => setExpanded(!expanded)}
        className={`group border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer ${expanded ? 'bg-slate-50' : ''}`}
      >
        {/* Col 1: Status & Time */}
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-3">
            {getStatusIcon(alert.status)}
            <span className="text-sm font-medium text-slate-900">{alert.timestamp.split('T')[1].substring(0, 5)}</span>
          </div>
        </td>

        {/* Col 2: Issue Type */}
        <td className="px-6 py-4 whitespace-nowrap">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            alert.status === 'critical' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
          }`}>
            {alert.issueType}
          </span>
        </td>

        {/* Col 3: Analysis */}
        <td className="px-6 py-4 text-sm w-1/2">
           {renderMessage(alert.message)}
        </td>

        {/* Col 4: Validation */}
        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => onValidation(alert.id, 'confirmed')}
              className={`p-1.5 rounded-md transition-all ${
                alert.validation === 'confirmed' 
                  ? 'bg-green-100 text-green-700 ring-1 ring-green-600 border-transparent' 
                  : 'text-slate-400 hover:text-green-600 border border-slate-200 hover:border-green-600'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 ${alert.validation === 'confirmed' ? 'fill-current' : ''}`} />
            </button>
            <button 
              onClick={() => onValidation(alert.id, 'rejected')}
               className={`p-1.5 rounded-md transition-all ${
                alert.validation === 'rejected' 
                  ? 'bg-red-100 text-red-700 ring-1 ring-red-600 border-transparent' 
                  : 'text-slate-400 hover:text-red-600 border border-slate-200 hover:border-red-600'
              }`}
            >
              <ThumbsDown className={`w-4 h-4 ${alert.validation === 'rejected' ? 'fill-current' : ''}`} />
            </button>
          </div>
        </td>

        {/* Col 5: Actions */}
        <td className="px-6 py-4 whitespace-nowrap text-right">
          <button 
            className={`p-2 rounded-full hover:bg-slate-200 transition-transform ${expanded ? 'rotate-180' : ''}`}
          >
            <ChevronDown className="w-5 h-5 text-slate-500" />
          </button>
        </td>
      </tr>
      
      {/* Expanded Row Content */}
      {expanded && (
        <tr className="bg-slate-50 border-b border-slate-200 animate-fadeIn">
          <td colSpan={5} className="px-6 py-4">
             <div className="flex gap-6">
                {/* Snapshot Image Placeholder */}
                <div className="w-64 h-40 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-300 shrink-0 overflow-hidden relative group-hover:border-blue-400 transition-colors">
                    {/* Simulated Image */}
                    <div className={`absolute inset-0 opacity-20 ${alert.imagePlaceholder || 'bg-slate-500'}`}></div>
                    <span className="relative z-10 flex flex-col items-center">
                        <AlertCircle className="w-8 h-8 mb-2 opacity-50"/>
                        <span className="text-xs font-medium">Snapshot at {alert.timestamp.split('T')[1].substring(0, 5)}</span>
                    </span>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-900">Detailed Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                         <div className="bg-white p-3 rounded border border-slate-200">
                            <span className="text-xs text-slate-500 block mb-1">Oversize Fraction (&gt;12mm)</span>
                            <span className="text-lg font-bold text-red-600">6.8%</span>
                            <span className="text-xs text-slate-400 ml-2">(Limit: 2%)</span>
                         </div>
                         <div className="bg-white p-3 rounded border border-slate-200">
                            <span className="text-xs text-slate-500 block mb-1">Fines Fraction (&lt;2mm)</span>
                            <span className="text-lg font-bold text-slate-700">1.2%</span>
                            <span className="text-xs text-slate-400 ml-2">(Normal)</span>
                         </div>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        Automated Vision System detected a cluster of oversized rocks. Likely due to Crusher B primary sieve wear. Recommend manual inspection of Screen 4 within the next 2 hours.
                    </p>
                </div>
             </div>
          </td>
        </tr>
      )}
    </>
  );
};
