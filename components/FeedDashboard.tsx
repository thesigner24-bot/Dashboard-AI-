import React from 'react';
import { ThumbsUp, ThumbsDown, Maximize2, MoreVertical, ChevronDown, ArrowLeft, Activity, Thermometer, TrendingUp, TrendingDown } from 'lucide-react';

interface FeedDashboardProps {
  mode?: 'live' | 'historical';
  timestamp?: string;
  onBack?: () => void;
}

export const FeedDashboard: React.FC<FeedDashboardProps> = ({ 
  mode = 'live', 
  timestamp = new Date().toISOString(), 
  onBack 
}) => {
  const isLive = mode === 'live';
  const displayTime = isLive 
    ? new Date().toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : new Date(timestamp).toLocaleString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Back Button for Historical Mode */}
      {!isLive && onBack && (
        <div className="flex items-center space-x-2 mb-2">
          <button 
            onClick={onBack}
            className="flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Library
          </button>
          <span className="text-slate-500 text-sm ml-2 font-medium">Snapshot: {displayTime}</span>
        </div>
      )}

      {/* Top Section: Video + Params + Summary */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* 1. Live/Recorded Feed (Left) - Span 5 */}
        <div className="xl:col-span-5 flex flex-col">
           <div className="flex items-center justify-between mb-3 px-1">
              <div className="flex items-center space-x-3">
                <span className={`flex h-3 w-3 relative`}>
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isLive ? 'bg-rose-400 opacity-75' : 'hidden'}`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isLive ? 'bg-rose-500' : 'bg-slate-400'}`}></span>
                </span>
                <h2 className="text-base font-semibold text-slate-800 tracking-tight">{isLive ? 'Live Feed' : 'Recorded Feed'}</h2>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{displayTime}</span>
           </div>
           
           <div className="relative aspect-video bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-800 group ring-1 ring-black/5">
              {/* Simulated Video Content */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-slate-800 via-slate-950 to-black opacity-90"></div>
              {/* Heatmap-like overlay effect */}
              <div className="absolute inset-0 opacity-50 mix-blend-screen" style={{ background: 'radial-gradient(circle at 30% 40%, rgba(255,100,100,0.2), transparent 40%), radial-gradient(circle at 70% 60%, rgba(100,100,255,0.2), transparent 40%)'}}></div>
              
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_4px,6px_100%] pointer-events-none"></div>

              {/* Overlay Text */}
              <div className="absolute top-4 left-4 font-mono text-white/90 text-xs tracking-wider z-20 bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                {displayTime.replace(/\//g, '-')}
              </div>
              <div className="absolute bottom-4 right-12 font-mono text-white/90 text-xs z-20 bg-black/40 px-2 py-1 rounded backdrop-blur-md">
                CAM-01 / ZONE-A
              </div>
              <button className="absolute bottom-3 right-3 p-2 text-white/90 hover:text-white bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-md transition-all z-20">
                <Maximize2 className="w-4 h-4" />
              </button>
           </div>
        </div>

        {/* 2. Detailed Parameters (Middle) - Span 3 */}
        <div className="xl:col-span-3 flex flex-col">
            <div className="flex items-center space-x-2 mb-3 px-1">
               <Activity className="w-4 h-4 text-indigo-500" />
               <h2 className="text-base font-semibold text-slate-800">Parameters</h2>
            </div>
            
            <div className="bg-white rounded-2xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100 p-5 h-full flex flex-col gap-5">
               {/* Gauge Section */}
               <div className="flex gap-4 h-full">
                  <div className="w-1/3 bg-slate-50/50 rounded-xl border border-slate-100 flex flex-col items-center justify-between py-4 relative overflow-hidden">
                     <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider z-10">Hot Index</span>
                     
                     <div className="relative h-32 w-8 bg-slate-200 rounded-full overflow-hidden flex items-end justify-center">
                        {/* Background ticks */}
                         <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(to bottom, transparent 50%, rgba(255,255,255,0.5) 50%)', backgroundSize: '100% 4px' }}></div>
                        
                        {/* Fill */}
                        <div className="w-full bg-gradient-to-t from-indigo-500 via-purple-500 to-rose-500 relative transition-all duration-1000" style={{ height: '36%' }}></div>
                     </div>
                     
                     <div className="text-center z-10">
                        <span className="text-lg font-bold text-slate-800 block">1.83</span>
                        <span className="text-[10px] text-slate-400">Normal</span>
                     </div>
                  </div>

                  <div className="flex-1 flex flex-col gap-3">
                     {/* Health Status */}
                     <div className="bg-emerald-50/50 rounded-xl p-4 border border-emerald-100/50">
                        <span className="text-[10px] uppercase font-bold text-emerald-800/70 block mb-1">System Health</span>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                              <span className="text-sm font-bold text-slate-800">Healthy</span>
                           </div>
                           <div className="flex gap-1">
                              <button className="p-1 text-slate-400 hover:text-emerald-600 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                              <button className="p-1 text-slate-400 hover:text-rose-600 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                           </div>
                        </div>
                     </div>
                     
                     {/* Process Params Table */}
                     <div className="flex-1 flex flex-col justify-center gap-3 pl-1">
                        <ParamRow label="Torque HO 2" value="38.21" unit="Nm" />
                        <ParamRow label="NOX Input" value="-30.64" unit="ppm" />
                        <ParamRow label="Temp Calc" value="706.9" unit="°C" />
                     </div>
                  </div>
               </div>
            </div>
        </div>

        {/* 3. Summary (Right) - Span 4 */}
        <div className="xl:col-span-4 flex flex-col">
            <div className="flex items-center justify-between mb-3 px-1">
               <div className="flex items-center space-x-2">
                  <MoreVertical className="w-4 h-4 text-slate-400 rotate-90" />
                  <h2 className="text-base font-semibold text-slate-800">Hourly Summary</h2>
               </div>
               <button className="text-xs text-indigo-600 font-medium hover:underline">View Report</button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 h-full">
               <SummaryCard 
                  label="Avg Torque HO2" 
                  value="37.61" 
                  trend="+2.4%" 
                  trendUp={true} 
                  subtext="vs last hour"
               />
               <SummaryCard 
                  label="% Hot Value Kiln" 
                  value="6.82%" 
                  trend="-0.5%" 
                  trendUp={false} 
                  subtext="vs last hour"
               />
               <SummaryCard 
                  label="Avg NOX Input" 
                  value="-18.9" 
                  trend="+1.2%" 
                  trendUp={true} 
                  subtext="vs last hour"
               />
               <SummaryCard 
                  label="Avg Hot Index" 
                  value="2.00" 
                  trend="0.0%" 
                  trendUp={true} 
                  neutral={true}
                  subtext="Stable"
               />
            </div>
        </div>
      </div>

      {/* Bottom Section: Trend Chart */}
      <div className="bg-white rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] border border-slate-100 p-6">
         <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div className="flex items-center space-x-3">
               <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center text-orange-500 border border-orange-100">
                  <Activity className="w-4 h-4" />
               </div>
               <div>
                  <h3 className="font-bold text-slate-800 text-base">24hr Performance Trend</h3>
                  <p className="text-xs text-slate-500">Real-time analysis of kiln operational parameters</p>
               </div>
            </div>
            
            <div className="flex items-center space-x-3">
                <span className="text-xs font-medium text-slate-500">Zoom:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="px-3 py-1 text-xs font-medium bg-white text-slate-800 rounded shadow-sm">1H</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">6H</button>
                    <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-700">24H</button>
                </div>
               <div className="relative">
                  <button className="flex items-center space-x-2 text-xs font-medium text-slate-600 border border-slate-200 bg-white rounded-lg px-3 py-1.5 hover:bg-slate-50 transition-colors">
                     <span>Rolling Avg: 30m</span>
                     <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>
               </div>
            </div>
         </div>

         {/* Chart Area */}
         <div className="relative w-full h-72">
            {/* Legend */}
            <div className="absolute top-0 right-0 flex flex-wrap gap-x-4 gap-y-2 mb-4 text-[10px] text-slate-500 justify-end z-10 bg-white/80 backdrop-blur-sm p-2 rounded-lg border border-slate-100">
                <LegendItem color="bg-rose-500" label="Hot Index" />
                <LegendItem color="bg-purple-500" label="Temp Calc" />
                <LegendItem color="bg-amber-500" label="Air Sec" />
                <LegendItem color="bg-emerald-500" label="Torque" />
            </div>

            <div className="absolute inset-0 top-10">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 1000 200" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(244, 63, 94, 0.2)" />
                        <stop offset="100%" stopColor="rgba(244, 63, 94, 0)" />
                        </linearGradient>
                        <linearGradient id="grad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(168, 85, 247, 0.2)" />
                        <stop offset="100%" stopColor="rgba(168, 85, 247, 0)" />
                        </linearGradient>
                    </defs>

                    {/* Grid Lines */}
                    {[0, 50, 100, 150, 200].map((y) => (
                        <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                    ))}

                    {/* Paths */}
                    <path d="M0,150 C50,140 100,60 150,50 C200,40 250,90 300,80 C350,70 400,20 450,100 C500,180 550,120 600,130 C650,140 700,60 750,50 C800,40 850,90 900,80 C950,70 1000,20 1000,100 L1000,200 L0,200 Z" fill="url(#grad1)" opacity="0.6" />
                    <path d="M0,150 C50,140 100,60 150,50 C200,40 250,90 300,80 C350,70 400,20 450,100 C500,180 550,120 600,130 C650,140 700,60 750,50 C800,40 850,90 900,80 C950,70 1000,20 1000,100" fill="none" stroke="#f43f5e" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                    
                    <path d="M0,100 C100,100 200,50 300,150 C400,250 500,50 600,100 C700,150 800,100 900,150 L1000,120 L1000,200 L0,200 Z" fill="url(#grad2)" opacity="0.6"/>
                    <path d="M0,100 C100,100 200,50 300,150 C400,250 500,50 600,100 C700,150 800,100 900,150 L1000,120" fill="none" stroke="#a855f7" strokeWidth="2.5" vectorEffect="non-scaling-stroke" />
                    
                    <path d="M0,180 C150,180 200,160 300,160 C400,160 500,100 600,140 C700,180 800,80 900,100 L1000,60" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" />
                    <path d="M0,20 C100,30 200,20 300,40 C400,60 500,150 600,140 C700,130 800,160 900,150 L1000,180" fill="none" stroke="#10b981" strokeWidth="1.5" opacity="0.8" vectorEffect="non-scaling-stroke" />
                </svg>
            </div>
            
            {/* X Axis Labels */}
            <div className="absolute bottom-[-24px] left-0 right-0 flex justify-between text-[10px] text-slate-400 font-medium px-2">
               <span>15:00</span>
               <span>18:00</span>
               <span>21:00</span>
               <span>00:00</span>
               <span>03:00</span>
               <span>06:00</span>
               <span>09:00</span>
               <span>12:00</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const ParamRow = ({ label, value, unit }: { label: string, value: string, unit: string }) => (
    <div className="flex justify-between items-center py-1 border-b border-slate-50 last:border-0">
        <span className="text-xs font-medium text-slate-500">{label}</span>
        <div className="flex items-baseline space-x-1">
            <span className="font-mono font-bold text-slate-700">{value}</span>
            <span className="text-[10px] text-slate-400">{unit}</span>
        </div>
    </div>
);

const SummaryCard = ({ label, value, trend, trendUp, neutral = false, subtext }: { label: string, value: string, trend: string, trendUp: boolean, neutral?: boolean, subtext: string }) => (
   <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col justify-between hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] transition-all group">
      <div className="flex justify-between items-start mb-2">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide truncate pr-2">{label}</span>
          <div className={`flex items-center space-x-0.5 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              neutral ? 'bg-slate-100 text-slate-600' :
              trendUp ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
          }`}>
              {!neutral && (trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />)}
              <span>{trend}</span>
          </div>
      </div>
      <div>
        <span className="text-2xl font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition-colors">{value}</span>
        <span className="block text-[10px] text-slate-400 mt-1">{subtext}</span>
      </div>
   </div>
);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
   <div className="flex items-center space-x-1.5">
      <div className={`w-2 h-2 rounded-full ${color} shadow-sm`}></div>
      <span className="font-medium">{label}</span>
   </div>
);