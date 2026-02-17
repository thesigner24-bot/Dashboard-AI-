import React, { useState } from 'react';
import { ChevronDown, Menu, Bell, User, Search } from 'lucide-react';
import { Tab, Plant, Camera } from '../types';

interface HeaderProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
  selectedPlant: Plant;
  selectedCamera: Camera;
  plants: Plant[];
  cameras: Camera[];
  onPlantChange: (plant: Plant) => void;
  onCameraChange: (camera: Camera) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onTabChange,
  selectedPlant,
  selectedCamera,
  plants,
  cameras,
  onPlantChange,
  onCameraChange
}) => {
  const [plantOpen, setPlantOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);

  return (
    <header className="bg-white sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)] border-b border-slate-100">
      <div className="px-6 h-16 flex items-center justify-between">
        {/* Left: Breadcrumbs & Context */}
        <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-4 shadow-sm shadow-blue-200">
                <span className="text-white font-bold text-lg">C</span>
            </div>
            
            <div className="flex items-center text-sm">
                <span className="text-slate-400 font-medium">Dashboard</span>
                <span className="mx-2 text-slate-300">/</span>
                
                {/* Plant Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setPlantOpen(!plantOpen)}
                    className="flex items-center hover:bg-slate-50 px-2 py-1.5 rounded-md transition-colors text-slate-800 font-bold"
                  >
                    {selectedPlant.name}
                    <ChevronDown className="ml-1.5 w-3.5 h-3.5 text-slate-400" />
                  </button>
                  
                  {plantOpen && (
                    <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-50 animate-fadeIn">
                      {plants.map(plant => (
                        <button
                          key={plant.id}
                          onClick={() => { onPlantChange(plant); setPlantOpen(false); }}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium"
                        >
                          {plant.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <span className="mx-2 text-slate-300">/</span>

                {/* Camera Dropdown */}
                <div className="relative">
                  <button 
                    onClick={() => setCameraOpen(!cameraOpen)}
                    className="flex items-center hover:bg-slate-50 px-2 py-1.5 rounded-md transition-colors text-slate-800 font-bold"
                  >
                    {selectedCamera.name}
                    <ChevronDown className="ml-1.5 w-3.5 h-3.5 text-slate-400" />
                  </button>
                   {cameraOpen && (
                    <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-slate-100 rounded-xl shadow-xl py-1 z-50 animate-fadeIn">
                      {cameras.map(cam => (
                        <button
                          key={cam.id}
                          onClick={() => { onCameraChange(cam); setCameraOpen(false); }}
                          className="block w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-700 font-medium"
                        >
                          {cam.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
            </div>
        </div>

        {/* Right: User/System Actions */}
        <div className="flex items-center space-x-2">
            <div className="relative hidden md:block mr-2">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className="pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-blue-300 w-48 transition-all"
                />
            </div>
            <button className="p-2 hover:bg-slate-50 rounded-full text-slate-500 hover:text-slate-700 transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-200 mx-1"></div>
            <button className="flex items-center gap-2 p-1 pl-2 hover:bg-slate-50 rounded-full transition-colors">
                <span className="text-sm font-semibold text-slate-700 hidden md:block">Admin User</span>
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 border border-indigo-200">
                    <User className="w-4 h-4" />
                </div>
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 flex space-x-1 overflow-x-auto">
        {Object.values(Tab).map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-3 text-sm font-medium border-b-[2px] transition-all whitespace-nowrap ${
              currentTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </header>
  );
};