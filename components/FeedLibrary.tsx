
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, Info, Download, Image as ImageIcon, AlertTriangle, Filter, ArrowLeft, Grid, List, Search, ChevronDown } from 'lucide-react';
import { FeedDashboard } from './FeedDashboard';

interface FeedItem {
  id: number;
  camera: string;
  hasAlert: boolean;
  date: string;
  time: string;
  timestamp: string;
}

export const FeedLibrary: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'photo' | 'video'>('photo');
  const [selectedFeed, setSelectedFeed] = useState<FeedItem | null>(null);

  // Mock data
  const feedItems: FeedItem[] = Array(12).fill(null).map((_, i) => {
    const min = 54 - i;
    const time = `14:${min}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`;
    return {
      id: i,
      camera: 'CamJ31c1',
      hasAlert: i % 3 === 0, // Some have alerts
      date: '15/02/2026',
      time: time,
      timestamp: `2026-02-15T${time}:00`,
    };
  });

  if (selectedFeed) {
    return (
      <FeedDashboard 
        mode="historical" 
        timestamp={selectedFeed.timestamp} 
        onBack={() => setSelectedFeed(null)} 
      />
    );
  }

  return (
    <div className="bg-slate-50/50 rounded-2xl min-h-[600px] flex flex-col animate-fadeIn gap-6">
       
       {/* Toolbar Section */}
       <div className="bg-white p-4 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          
          {/* Sub Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
             <button
               onClick={() => setActiveSubTab('photo')}
               className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                 activeSubTab === 'photo' 
                 ? 'bg-white text-slate-800 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               Photo Gallery
             </button>
             <button
               onClick={() => setActiveSubTab('video')}
               className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                 activeSubTab === 'video' 
                 ? 'bg-white text-slate-800 shadow-sm' 
                 : 'text-slate-500 hover:text-slate-700'
               }`}
             >
               Video Gallery
             </button>
          </div>

          {/* Filters */}
          <div className="flex flex-1 items-center justify-end gap-3 flex-wrap">
              <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search frames..." 
                    className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-full md:w-48 transition-all"
                  />
              </div>
              <div className="h-6 w-px bg-slate-200 hidden md:block mx-1"></div>
              <Select placeholder="Angul" />
              <Select placeholder="CamJ31c1" />
              <Select placeholder="Today" />
              <button className="p-2 text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-lg transition-colors">
                  <Filter className="w-4 h-4" />
              </button>
          </div>
       </div>

       {/* Grid Content */}
       <div className="flex-1">
          <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                Angul Plant Feed
                <span className="text-slate-400 font-normal ml-2 text-xs">845 items</span>
              </h2>
              <div className="flex items-center gap-2 text-slate-500">
                 <button className="p-1 hover:bg-slate-200 rounded"><Grid className="w-4 h-4" /></button>
                 <button className="p-1 hover:bg-slate-200 rounded"><List className="w-4 h-4" /></button>
              </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {feedItems.map((item) => (
               <FeedCard 
                 key={item.id} 
                 item={item} 
                 onClick={() => setSelectedFeed(item)} 
               />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="mt-8 flex justify-center pb-4">
             <div className="flex items-center bg-white rounded-lg shadow-sm border border-slate-200 p-1">
                <button className="p-2 hover:bg-slate-50 rounded-md text-slate-400 hover:text-slate-600"><ChevronLeft className="w-4 h-4" /></button>
                <span className="px-4 text-sm font-medium text-slate-600">Page 1 of 12</span>
                <button className="p-2 hover:bg-slate-50 rounded-md text-slate-400 hover:text-slate-600"><ChevronRight className="w-4 h-4" /></button>
             </div>
          </div>
       </div>
    </div>
  );
};

// Helper Components

const Select = ({ placeholder }: { placeholder: string }) => (
  <div className="relative group">
    <select className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 py-2 pl-3 pr-8 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 cursor-pointer min-w-[120px] shadow-sm transition-all font-medium">
       <option>{placeholder}</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400 group-hover:text-slate-600">
      <ChevronDown className="w-3.5 h-3.5" />
    </div>
  </div>
);

// Added React.FC typing to correctly handle the key prop in TypeScript
const FeedCard: React.FC<{ item: FeedItem; onClick: () => void }> = ({ item, onClick }) => (
   <div 
     onClick={onClick}
     className="group relative aspect-video bg-white rounded-xl overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] border border-slate-200 hover:border-blue-300 transition-all duration-300 cursor-pointer"
   >
       {/* Background (simulating coal conveyor belt) */}
       <div className="absolute inset-0 bg-neutral-900 group-hover:scale-105 transition-transform duration-700 ease-out">
           {/* Conveyor Belt Texture Simulation */}
           <div className="absolute inset-0 opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-600 via-slate-900 to-black"></div>
           <div className="absolute inset-0" style={{ 
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 19px, #ffffff10 20px)',
               backgroundSize: '100% 20px'
           }}></div>
           {/* Coal-like noise */}
           <div className="absolute inset-0 opacity-40" style={{ filter: 'contrast(150%) brightness(80%)', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`}}></div>
       </div>

       {/* Status Badges - Always Visible */}
       <div className="absolute top-3 left-3 flex gap-2 z-10">
          <span className="bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-white/20">
              {item.camera}
          </span>
          {item.hasAlert && (
            <span className="flex items-center bg-rose-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm animate-pulse">
               <AlertTriangle className="w-3 h-3 mr-1 fill-current" />
               Alert
            </span>
          )}
       </div>

       {/* Hover Overlay */}
       <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           
           {/* Top Right Actions */}
           <div className="absolute top-3 right-3 flex gap-2 transform -translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <button className="p-1.5 bg-black/40 hover:bg-white text-white hover:text-slate-900 rounded-lg backdrop-blur-md border border-white/10 transition-colors">
                    <Info className="w-3.5 h-3.5" />
                </button>
           </div>

           {/* Bottom Content */}
           <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-white text-xs font-medium opacity-80 mb-0.5">Timestamp</p>
                        <p className="text-white font-mono text-sm tracking-wide">{item.date} {item.time}</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="p-2 bg-white text-slate-900 rounded-lg hover:bg-blue-50 transition-colors shadow-lg">
                            <Maximize2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
           </div>
       </div>
   </div>
);
