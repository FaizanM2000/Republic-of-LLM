'use client';

import { useGovernmentStore } from '@/lib/store';
import { Building2, Eye, BarChart3, Clock, Target, Microscope, Gavel } from 'lucide-react';

export function Header() {
  const { state, viewMode, setViewMode } = useGovernmentStore();

  const viewOptions = [
    { mode: 'network' as const, icon: Eye, label: 'Network View' },
    { mode: 'hierarchy' as const, icon: Building2, label: 'Hierarchy' },
    { mode: 'goals' as const, icon: Target, label: 'Goals' },
    { mode: 'laws' as const, icon: Gavel, label: 'Laws' },
    { mode: 'timeline' as const, icon: Clock, label: 'Timeline' },
    { mode: 'research' as const, icon: Microscope, label: 'Research' }
  ];

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Building2 className="w-8 h-8 text-government-600" />
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-government-600 to-democracy-600 bg-clip-text text-transparent">
                Dynamic Government Digital Twin
              </h1>
              <p className="text-sm text-gray-600">Living Democracy Simulation</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Government Stats */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-lg text-government-700">{state.day}</div>
              <div className="text-gray-500">Days</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-green-700">{state.agents.length}</div>
              <div className="text-gray-500">Agents</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-lg text-blue-700">
                {Math.round(state.publicApproval * 100)}%
              </div>
              <div className="text-gray-500">Approval</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold text-lg ${
                state.crisisLevel > 0.7 ? 'text-red-600' :
                state.crisisLevel > 0.4 ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {Math.round(state.crisisLevel * 100)}%
              </div>
              <div className="text-gray-500">Crisis Level</div>
            </div>
          </div>

          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {viewOptions.map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === mode
                    ? 'bg-white text-government-700 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title={label}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}