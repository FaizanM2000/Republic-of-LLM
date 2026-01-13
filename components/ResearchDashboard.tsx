'use client';

import { useState, useEffect } from 'react';
import { useGovernmentStore } from '@/lib/store';
import { Microscope, Play, Square, Download, BarChart3, TrendingUp, Activity, Database } from 'lucide-react';
import { ExperimentConfig, ExperimentRun, EmergentPattern } from '@/lib/data-logger';

export function ResearchDashboard() {
  const { engine, state, startSimulation, stopSimulation, isSimulating } = useGovernmentStore();
  const [currentExperiment, setCurrentExperiment] = useState<ExperimentRun | null>(null);
  const [completedRuns, setCompletedRuns] = useState<ExperimentRun[]>([]);
  const [experimentConfig, setExperimentConfig] = useState<ExperimentConfig>({
    id: `exp-${Date.now()}`,
    name: 'Government Emergence Study',
    description: 'Track emergent behavior in agent-based government simulation',
    durationDays: 100,
    snapshotInterval: 1
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const current = engine.getCurrentExperiment();
      setCurrentExperiment(current);

      // Auto-stop experiment when duration reached
      if (current && current.snapshots.length >= experimentConfig.durationDays) {
        stopExperiment();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [engine, experimentConfig.durationDays]);

  const startExperiment = () => {
    const runId = engine.startExperiment(experimentConfig);
    console.log('Started experiment:', runId);

    // Automatically start simulation if not already running
    if (!isSimulating) {
      startSimulation();
    }
  };

  const stopExperiment = () => {
    const completed = engine.endExperiment();
    if (completed) {
      setCompletedRuns(prev => [...prev, completed]);
    }
    setCurrentExperiment(null);

    // Stop simulation when experiment ends
    if (isSimulating) {
      stopSimulation();
    }
  };

  const downloadJSON = (run: ExperimentRun) => {
    const json = engine.exportExperimentJSON(run);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-${run.runId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadCSV = (run: ExperimentRun) => {
    const csv = engine.exportExperimentCSV(run);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `experiment-${run.runId}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getPatternIcon = (type: EmergentPattern['type']) => {
    const icons = {
      'growth_spike': '📈',
      'collaboration_surge': '🤝',
      'policy_cascade': '⚖️',
      'crisis_response': '🚨',
      'stagnation': '⏸️',
      'innovation_burst': '💡'
    };
    return icons[type] || '📊';
  };

  return (
    <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Microscope className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Research Dashboard</h1>
                <p className="text-sm text-gray-600">Track emergent behavior and government dynamics</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {isSimulating && (
                <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-lg text-sm font-medium">
                  <Activity className="w-4 h-4 animate-pulse" />
                  <span>Simulation Running</span>
                </div>
              )}
              {currentExperiment ? (
                <button
                  onClick={stopExperiment}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  <Square className="w-4 h-4" />
                  <span>Stop Experiment</span>
                </button>
              ) : (
                <button
                  onClick={startExperiment}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  <span>Start Experiment</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Experiment Configuration */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Experiment Configuration</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Experiment Name</label>
              <input
                type="text"
                value={experimentConfig.name}
                onChange={(e) => setExperimentConfig({ ...experimentConfig, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!!currentExperiment}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
              <input
                type="number"
                value={experimentConfig.durationDays}
                onChange={(e) => setExperimentConfig({ ...experimentConfig, durationDays: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={!!currentExperiment}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <textarea
                value={experimentConfig.description}
                onChange={(e) => setExperimentConfig({ ...experimentConfig, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                rows={2}
                disabled={!!currentExperiment}
              />
            </div>
          </div>
        </div>

        {/* Current Experiment Status */}
        {currentExperiment && (
          <div className="bg-white rounded-xl shadow-lg border border-indigo-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Current Experiment</h2>
              <div className="flex items-center space-x-4">
                <div className="text-sm text-gray-600">
                  Progress: {currentExperiment.snapshots.length} / {experimentConfig.durationDays} days
                </div>
                <div className="flex items-center space-x-2">
                  <Activity className="w-5 h-5 text-green-600 animate-pulse" />
                  <span className="text-sm font-medium text-green-600">Recording</span>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(currentExperiment.snapshots.length / experimentConfig.durationDays) * 100}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="text-sm text-indigo-600 mb-1">Days Simulated</div>
                <div className="text-2xl font-bold text-indigo-900">
                  {currentExperiment.snapshots.length}
                </div>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="text-sm text-purple-600 mb-1">Data Points</div>
                <div className="text-2xl font-bold text-purple-900">
                  {currentExperiment.snapshots.length * 50}+
                </div>
              </div>
              <div className="bg-pink-50 rounded-lg p-4">
                <div className="text-sm text-pink-600 mb-1">Events Logged</div>
                <div className="text-2xl font-bold text-pink-900">
                  {currentExperiment.events.length}
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4">
                <div className="text-sm text-orange-600 mb-1">Patterns Detected</div>
                <div className="text-2xl font-bold text-orange-900">
                  {currentExperiment.summary.emergentPatterns.length}
                </div>
              </div>
            </div>

            {/* Latest Metrics */}
            {currentExperiment.snapshots.length > 0 && (
              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Latest Metrics</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  {(() => {
                    const latest = currentExperiment.snapshots[currentExperiment.snapshots.length - 1];
                    return (
                      <>
                        <div>
                          <span className="text-gray-600">Agents:</span>
                          <span className="ml-2 font-semibold">{latest.totalAgents}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Avg Effectiveness:</span>
                          <span className="ml-2 font-semibold">{(latest.avgEffectiveness * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Relationships:</span>
                          <span className="ml-2 font-semibold">{latest.totalRelationships}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Goals Completed:</span>
                          <span className="ml-2 font-semibold">{latest.completedGoals}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Laws Enacted:</span>
                          <span className="ml-2 font-semibold">{latest.totalLaws}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Public Approval:</span>
                          <span className="ml-2 font-semibold">{(latest.publicApproval * 100).toFixed(1)}%</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Complexity:</span>
                          <span className="ml-2 font-semibold">{latest.governmentComplexity.toFixed(1)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Policy Velocity:</span>
                          <span className="ml-2 font-semibold">{latest.policyVelocity}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Network Density:</span>
                          <span className="ml-2 font-semibold">{(latest.networkDensity * 100).toFixed(2)}%</span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Emergent Patterns */}
            {currentExperiment.summary.emergentPatterns.length > 0 && (
              <div className="border-t pt-4 mt-4">
                <h3 className="font-medium text-gray-900 mb-3">Detected Emergent Patterns</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {currentExperiment.summary.emergentPatterns.slice(-10).reverse().map((pattern, idx) => (
                    <div key={idx} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">{getPatternIcon(pattern.type)}</span>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 capitalize">
                          {pattern.type.replace(/_/g, ' ')}
                        </div>
                        <div className="text-sm text-gray-600">{pattern.description}</div>
                        <div className="text-xs text-gray-500 mt-1">Day {pattern.detectedAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Completed Runs */}
        {completedRuns.length > 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Completed Experiments</h2>
            <div className="space-y-3">
              {completedRuns.map((run) => (
                <div key={run.runId} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">{run.config.name}</h3>
                      <p className="text-sm text-gray-600">{run.config.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(run.startTime).toLocaleString()} - {run.endTime && new Date(run.endTime).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => downloadJSON(run)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>JSON</span>
                      </button>
                      <button
                        onClick={() => downloadCSV(run)}
                        className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Download className="w-4 h-4" />
                        <span>CSV</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-3 text-sm">
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-600 text-xs">Duration</div>
                      <div className="font-semibold">{run.summary.totalDays} days</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-600 text-xs">Agents Created</div>
                      <div className="font-semibold">{run.summary.totalAgentsCreated}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-600 text-xs">Goals</div>
                      <div className="font-semibold">{run.summary.totalGoalsCompleted}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-600 text-xs">Meetings</div>
                      <div className="font-semibold">{run.summary.totalMeetingsHeld}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-2">
                      <div className="text-gray-600 text-xs">Patterns</div>
                      <div className="font-semibold">{run.summary.emergentPatterns.length}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research Info */}
        <div className="bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 rounded-xl p-6">
          <div className="flex items-start space-x-4">
            <Database className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-indigo-900 mb-2">Research Capabilities</h3>
              <ul className="space-y-1 text-sm text-indigo-800">
                <li>• <strong>Full Data Capture:</strong> 50+ metrics tracked per simulation day</li>
                <li>• <strong>Emergent Pattern Detection:</strong> Automatic identification of growth spikes, collaboration surges, policy cascades</li>
                <li>• <strong>Export Formats:</strong> JSON for detailed analysis, CSV for statistical software</li>
                <li>• <strong>Metrics Include:</strong> Agent dynamics, budgets, relationships, goals, meetings, laws, external conditions</li>
                <li>• <strong>Research Use:</strong> Study self-organizing government, emergent hierarchies, collective decision-making</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
