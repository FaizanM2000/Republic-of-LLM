'use client';

import { useGovernmentStore } from '@/lib/store';
import { Building2, Users, TrendingUp, AlertCircle } from 'lucide-react';

export function Dashboard() {
  const { state, selectAgent } = useGovernmentStore();

  const agentsByBranch = state.agents.reduce((acc, agent) => {
    const branch = agent.position?.branch || 'independent';
    if (!acc[branch]) acc[branch] = [];
    acc[branch].push(agent);
    return acc;
  }, {} as Record<string, typeof state.agents>);

  const getBranchColor = (branch: string) => {
    const colors = {
      executive: 'from-blue-500 to-blue-600',
      legislative: 'from-green-500 to-green-600',
      judicial: 'from-purple-500 to-purple-600',
      independent: 'from-gray-500 to-gray-600'
    };
    return colors[branch as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const getBranchIcon = (branch: string) => {
    switch (branch) {
      case 'executive': return Building2;
      case 'legislative': return Users;
      case 'judicial': return AlertCircle;
      case 'independent': return TrendingUp;
      default: return Building2;
    }
  };

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 p-6 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Government Hierarchy</h2>
          <p className="text-gray-600">Interactive organizational structure of the dynamic government</p>
        </div>

        <div className="space-y-8">
          {Object.entries(agentsByBranch).map(([branch, agents]) => {
            const Icon = getBranchIcon(branch);
            const colorClass = getBranchColor(branch);

            return (
              <div key={branch} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Branch Header */}
                <div className={`bg-gradient-to-r ${colorClass} px-6 py-4`}>
                  <div className="flex items-center space-x-3">
                    <Icon className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold text-white capitalize">
                      {branch === 'independent' ? 'Independent Agencies' : `${branch} Branch`}
                    </h3>
                    <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {agents.length} agents
                    </span>
                  </div>
                </div>

                {/* Agents Grid */}
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {agents
                      .sort((a, b) => (a.position?.level || 0) - (b.position?.level || 0))
                      .map((agent) => (
                        <div
                          key={agent.id}
                          onClick={() => selectAgent(agent)}
                          className="group bg-gray-50 hover:bg-gray-100 rounded-lg p-4 cursor-pointer transition-all duration-200 hover:shadow-md border border-gray-200 hover:border-gray-300"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                {agent.name}
                              </h4>
                              <p className="text-sm text-gray-500 capitalize">{agent.type}</p>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                              <span className={`w-3 h-3 rounded-full ${
                                agent.effectiveness > 0.7 ? 'bg-green-400' :
                                agent.effectiveness > 0.4 ? 'bg-yellow-400' : 'bg-red-400'
                              }`} title={`Effectiveness: ${Math.round(agent.effectiveness * 100)}%`} />
                              {agent.status !== 'active' && (
                                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                                  {agent.status}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex justify-between">
                              <span>Effectiveness:</span>
                              <span className="font-medium">
                                {Math.round(agent.effectiveness * 100)}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Age:</span>
                              <span className="font-medium">{agent.age} days</span>
                            </div>
                            {agent.staffCount && (
                              <div className="flex justify-between">
                                <span>Staff:</span>
                                <span className="font-medium">{agent.staffCount.toLocaleString()}</span>
                              </div>
                            )}
                            {agent.budget && (
                              <div className="flex justify-between">
                                <span>Budget:</span>
                                <span className="font-medium">
                                  ${(agent.budget / 1e9).toFixed(1)}B
                                </span>
                              </div>
                            )}
                          </div>

                          {agent.relationships.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <div className="flex items-center space-x-2">
                                <span className="text-xs text-gray-500">Relationships:</span>
                                <span className="text-xs font-medium text-gray-700">
                                  {agent.relationships.length}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Special indicators */}
                          <div className="mt-3 flex flex-wrap gap-1">
                            {agent.canCreateAgents && (
                              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                                Can Create
                              </span>
                            )}
                            {agent.canExpandAuthority && (
                              <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                Can Expand
                              </span>
                            )}
                            {agent.termLimit && (
                              <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                                Term Limited
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>

                  {agents.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Building2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No agents in this branch yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Agents</p>
                <p className="text-2xl font-bold text-gray-900">{state.agents.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Effectiveness</p>
                <p className="text-2xl font-bold text-gray-900">
                  {state.agents.length > 0 ? Math.round(state.agents.reduce((sum, a) => sum + a.effectiveness, 0) / state.agents.length * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Proposals</p>
                <p className="text-2xl font-bold text-gray-900">{state.activeProposals.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Constitutional Issues</p>
                <p className="text-2xl font-bold text-gray-900">{state.constitutionalViolations.length}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}