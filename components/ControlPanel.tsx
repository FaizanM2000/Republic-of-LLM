'use client';

import { useGovernmentStore } from '@/lib/store';
import { Play, Pause, SkipForward, Settings, Zap } from 'lucide-react';

export function ControlPanel() {
  const {
    isSimulating,
    simulationSpeed,
    startSimulation,
    stopSimulation,
    stepSimulation,
    setSimulationSpeed
  } = useGovernmentStore();

  const speedOptions = [
    { value: 3000, label: 'Slow', icon: '🐌' },
    { value: 1000, label: 'Normal', icon: '🚶' },
    { value: 500, label: 'Fast', icon: '🏃' },
    { value: 100, label: 'Ultra', icon: '⚡' }
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <Settings className="w-5 h-5 text-government-600" />
        <h3 className="font-semibold text-gray-900">Simulation Control</h3>
      </div>

      <div className="space-y-4">
        {/* Play/Pause Controls */}
        <div className="flex space-x-2">
          <button
            onClick={isSimulating ? stopSimulation : startSimulation}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-colors ${
              isSimulating
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {isSimulating ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={stepSimulation}
            className="px-4 py-3 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors"
            title="Step One Day"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Control */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Simulation Speed
          </label>
          <div className="grid grid-cols-2 gap-2">
            {speedOptions.map(({ value, label, icon }) => (
              <button
                key={value}
                onClick={() => setSimulationSpeed(value)}
                className={`flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  simulationSpeed === value
                    ? 'bg-government-100 text-government-700 border-2 border-government-300'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-100">
          <div className={`w-2 h-2 rounded-full ${
            isSimulating ? 'bg-green-500 animate-pulse' : 'bg-gray-400'
          }`} />
          <span className="text-sm text-gray-600">
            {isSimulating ? 'Simulation Running' : 'Simulation Paused'}
          </span>
        </div>

        {/* Quick Actions */}
        <div className="pt-2 border-t border-gray-100">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
          <div className="space-y-2">
            <button
              className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-left text-gray-600 hover:bg-gray-50 rounded-lg"
              onClick={() => {
                // Trigger a crisis for demonstration
                console.log('Crisis triggered manually');
              }}
            >
              <Zap className="w-4 h-4 text-orange-500" />
              <span>Trigger Crisis</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}