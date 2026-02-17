
import React from 'react';
import { AppTab } from '../types';

interface SidebarProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    { id: AppTab.CHAT, icon: 'fa-message', label: 'Chat' },
    { id: AppTab.IMAGE, icon: 'fa-image', label: 'Imaging' },
    { id: AppTab.VIDEO, icon: 'fa-film', label: 'Studio' },
    { id: AppTab.LIVE, icon: 'fa-microphone', label: 'Live' },
  ];

  return (
    <aside className="w-20 md:w-64 flex flex-col h-full bg-zinc-900 border-r border-zinc-800 transition-all duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
          <i className="fas fa-microchip text-white text-lg"></i>
        </div>
        <span className="hidden md:block font-bold text-xl tracking-tight gradient-text">OmniAI</span>
      </div>

      <nav className="flex-1 mt-6 px-3 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all group ${
              activeTab === item.id
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-600/20'
                : 'hover:bg-zinc-800 text-zinc-400'
            }`}
          >
            <i className={`fas ${item.icon} text-lg w-6 flex justify-center group-hover:scale-110 transition-transform`}></i>
            <span className="hidden md:block font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 mt-auto">
        <div className="hidden md:block p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
          <p className="text-xs text-zinc-500 uppercase font-semibold mb-2">Power User</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500" />
            <div className="overflow-hidden">
              <p className="text-sm font-medium truncate">Guest User</p>
              <p className="text-xs text-zinc-500 truncate">Free Tier</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
