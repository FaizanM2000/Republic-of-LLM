'use client';

import { useState, useEffect } from 'react';
import { useGovernmentStore } from '@/lib/store';
import { BarChart3, TrendingUp, AlertTriangle, DollarSign, Target, Users as UsersIcon, FileText } from 'lucide-react';

export function StatsPanel() {
  const { state } = useGovernmentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const agentsByType = state.agents.reduce((acc, agent) => {
    acc[agent.type] = (acc[agent.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgEffectiveness = state.agents.length > 0
    ? state.agents.reduce((sum, agent) => sum + agent.effectiveness, 0) / state.agents.length
    : 0;

  const formatBudget = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center space-x-2 mb-4">
        <BarChart3 className="w-5 h-5 text-government-600" />
        <h3 className="font-semibold text-gray-900">Government Statistics</h3>
      </div>

      <div className="space-y-4">
        {/* Overall Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span className="text-xs text-blue-600 font-medium">EFFECTIVENESS</span>
            </div>
            <div className="text-lg font-bold text-blue-900 mt-1">
              {mounted ? Math.round(avgEffectiveness * 100) : 0}%
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <DollarSign className="w-4 h-4 text-green-600" />
              <span className="text-xs text-green-600 font-medium">BUDGET</span>
            </div>
            <div className="text-lg font-bold text-green-900 mt-1">
              {mounted ? formatBudget(state.totalBudget) : '$0'}
            </div>
          </div>
        </div>

        {/* Agent Breakdown */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Agent Distribution</h4>
          <div className="space-y-2">
            {mounted ? Object.entries(agentsByType).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between text-sm">
                <span className="capitalize text-gray-600">{type.replace('_', ' ')}</span>
                <span className="font-medium text-gray-900">{count}</span>
              </div>
            )) : (
              <div className="text-sm text-gray-500">Loading...</div>
            )}
          </div>
        </div>

        {/* Crisis Alerts */}
        {mounted && state.constitutionalViolations.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium text-red-800">Constitutional Alerts</span>
            </div>
            <div className="text-sm text-red-700">
              {state.constitutionalViolations.length} active violations
            </div>
          </div>
        )}

        {/* Active Proposals */}
        {mounted && state.activeProposals.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm font-medium text-yellow-800 mb-1">Active Proposals</div>
            <div className="text-sm text-yellow-700">
              {state.activeProposals.length} pending decisions
            </div>
          </div>
        )}

        {/* Collective Goals */}
        {mounted && state.collectiveGoals && state.collectiveGoals.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Target className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-700">Collective Goals</h4>
            </div>
            <div className="space-y-2">
              {state.collectiveGoals.slice(0, 3).map(goal => (
                <div key={goal.id} className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <div className="text-sm font-medium text-purple-900 mb-1">{goal.title}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-purple-700">{Math.round(goal.progress * 100)}% complete</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      goal.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      goal.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      goal.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-green-100 text-green-700'
                    }`}>{goal.priority}</span>
                  </div>
                  <div className="w-full bg-purple-200 rounded-full h-1.5 mt-2">
                    <div className="bg-purple-600 h-1.5 rounded-full" style={{ width: `${goal.progress * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Meetings */}
        {mounted && state.meetings && state.meetings.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <UsersIcon className="w-4 h-4 text-blue-600" />
              <h4 className="font-medium text-gray-700">Recent Meetings</h4>
            </div>
            <div className="space-y-2">
              {state.meetings.slice(0, 3).map(meeting => (
                <div key={meeting.id} className="bg-blue-50 border border-blue-200 rounded-lg p-2">
                  <div className="text-xs font-medium text-blue-900">{meeting.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-blue-700 capitalize">{meeting.type}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                      meeting.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{meeting.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Laws */}
        {mounted && state.laws && state.laws.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex items-center space-x-2 mb-3">
              <FileText className="w-4 h-4 text-green-600" />
              <h4 className="font-medium text-gray-700">Recent Laws</h4>
            </div>
            <div className="space-y-2">
              {state.laws.slice(0, 3).map(law => (
                <div key={law.id} className="bg-green-50 border border-green-200 rounded-lg p-2">
                  <div className="text-xs font-medium text-green-900">{law.title}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-green-700 capitalize">{law.category}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded ${
                      law.status === 'enacted' ? 'bg-green-100 text-green-700' :
                      law.status === 'passed' ? 'bg-blue-100 text-blue-700' :
                      law.status === 'vetoed' ? 'bg-red-100 text-red-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>{law.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}