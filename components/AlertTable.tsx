import React from 'react';
import { AlertRow } from './AlertRow';
import { Alert } from '../types';

interface AlertTableProps {
  alerts: Alert[];
  onValidation: (id: string, status: 'confirmed' | 'rejected') => void;
}

export const AlertTable: React.FC<AlertTableProps> = ({ alerts, onValidation }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                Status / Time
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-40">
                Issue Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Analysis
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider w-32">
                Validation
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider w-16">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {alerts.map((alert) => (
              <AlertRow key={alert.id} alert={alert} onValidation={onValidation} />
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">Showing {alerts.length} alerts from today</span>
        <div className="flex gap-2">
            <button className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors">Previous</button>
            <button className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1 rounded hover:bg-slate-200 transition-colors">Next</button>
        </div>
      </div>
    </div>
  );
};