'use client';

import { useGovernmentStore } from '@/lib/store';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock, Users } from 'lucide-react';

export function GoalsTracker() {
  const { state } = useGovernmentStore();

  const activeGoals = state.collectiveGoals?.filter(g => g.status === 'active') || [];
  const completedGoals = state.collectiveGoals?.filter(g => g.status === 'completed') || [];
  const failedGoals = state.collectiveGoals?.filter(g => g.status === 'failed') || [];

  const overallProgress = activeGoals.length > 0
    ? activeGoals.reduce((sum, goal) => sum + goal.progress, 0) / activeGoals.length
    : 0;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'border-red-500 bg-red-50';
      case 'high': return 'border-orange-500 bg-orange-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAssignedAgentNames = (agentIds: string[]) => {
    return agentIds
      .map(id => state.agents.find(a => a.id === id))
      .filter(a => a !== undefined)
      .map(a => a!.name)
      .join(', ');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Target className="w-6 h-6 text-white" />
            <h2 className="text-2xl font-bold text-white">Government Goals Tracker</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
            <div className="text-xs text-white/80 uppercase tracking-wide">Overall Progress</div>
            <div className="text-2xl font-bold text-white">{Math.round(overallProgress * 100)}%</div>
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="px-6 py-4 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Collective Achievement</span>
          <span className="text-sm text-gray-600">
            {activeGoals.length} active, {completedGoals.length} completed, {failedGoals.length} failed
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
          <div
            className="h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full transition-all duration-500 flex items-center justify-end px-2"
            style={{ width: `${Math.max(5, overallProgress * 100)}%` }}
          >
            {overallProgress > 0.1 && (
              <span className="text-xs font-bold text-white">{Math.round(overallProgress * 100)}%</span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{activeGoals.length}</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Active Goals</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{completedGoals.length}</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {Math.round(state.publicApproval * 100)}%
          </div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Public Approval</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">Day {state.day}</div>
          <div className="text-xs text-gray-600 uppercase tracking-wide">Time Elapsed</div>
        </div>
      </div>

      {/* Reward Info Banner */}
      <div className="px-6 py-3 bg-gradient-to-r from-yellow-100 to-green-100 border-b border-yellow-200">
        <div className="flex items-center justify-center space-x-2 text-sm">
          <span className="font-semibold text-yellow-900">💰 Goal Completion Rewards:</span>
          <span className="text-yellow-800">Critical: $50B</span>
          <span className="text-gray-400">|</span>
          <span className="text-yellow-800">High: $25B</span>
          <span className="text-gray-400">|</span>
          <span className="text-yellow-800">Medium: $10B</span>
          <span className="text-gray-400">|</span>
          <span className="text-yellow-800">Low: $5B</span>
          <span className="text-xs text-yellow-700 ml-2">(split among assigned agents)</span>
        </div>
      </div>

      {/* Active Goals */}
      <div className="p-6">
        <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-purple-600" />
          Active Goals
        </h3>

        {activeGoals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p>No active goals yet</p>
            <p className="text-sm mt-1">Goals will be created by agents as the simulation progresses</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeGoals.map(goal => (
              <div
                key={goal.id}
                className={`border-l-4 rounded-lg p-4 transition-all duration-300 hover:shadow-md ${getPriorityColor(goal.priority)}`}
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-lg mb-1">{goal.title}</h4>
                    <p className="text-sm text-gray-600">{goal.description}</p>
                  </div>
                  <div className="flex flex-col items-end space-y-2 ml-4">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wide ${getPriorityBadgeColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                      goal.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {goal.status}
                    </span>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-700">Progress:</span>
                      <span className="text-sm font-bold text-purple-700">{Math.round(goal.progress * 100)}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {goal.currentValue} / {goal.targetValue} {goal.targetMetric}
                    </div>
                  </div>
                  <div className="w-full bg-white rounded-full h-3 border border-gray-300 overflow-hidden">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        goal.progress >= 0.8 ? 'bg-green-500' :
                        goal.progress >= 0.5 ? 'bg-blue-500' :
                        goal.progress >= 0.25 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(2, goal.progress * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Assigned Agents */}
                {goal.assignedAgents && goal.assignedAgents.length > 0 && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Assigned to:</span>
                    <span className="font-medium text-gray-900">{getAssignedAgentNames(goal.assignedAgents)}</span>
                  </div>
                )}

                {/* Deadline if exists */}
                {goal.deadline && (
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">Deadline:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Completed Goals */}
        {completedGoals.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
              Completed Goals ({completedGoals.length})
            </h3>
            <div className="space-y-3">
              {completedGoals.slice(0, 5).map(goal => {
                const rewardAmounts = {
                  'critical': 50,
                  'high': 25,
                  'medium': 10,
                  'low': 5
                };
                const totalReward = rewardAmounts[goal.priority as keyof typeof rewardAmounts] || 10;
                const rewardPerAgent = goal.assignedAgents.length > 0
                  ? totalReward / goal.assignedAgents.length
                  : totalReward;

                return (
                  <div key={goal.id} className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-lg p-4 shadow-sm">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <div>
                          <span className="font-semibold text-green-900">{goal.title}</span>
                          <div className="text-xs text-green-700 mt-1">
                            {getAssignedAgentNames(goal.assignedAgents)}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span className="text-xs px-2 py-1 bg-green-200 text-green-900 rounded-full font-bold">
                          ✓ COMPLETE
                        </span>
                        <span className="text-xs text-green-700 capitalize">{goal.priority}</span>
                      </div>
                    </div>
                    <div className="bg-yellow-100 border border-yellow-300 rounded px-3 py-2 mt-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-900 font-medium">💰 Rewards Distributed:</span>
                        <span className="text-yellow-900 font-bold">
                          ${rewardPerAgent.toFixed(1)}B per agent (${totalReward}B total)
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Failed Goals */}
        {failedGoals.length > 0 && (
          <div className="mt-8">
            <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2 text-red-600" />
              Failed Goals ({failedGoals.length})
            </h3>
            <div className="space-y-2">
              {failedGoals.slice(0, 3).map(goal => (
                <div key={goal.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <AlertCircle className="w-4 h-4 text-red-600" />
                      <span className="font-medium text-red-900">{goal.title}</span>
                    </div>
                    <span className="text-xs text-red-700">{Math.round(goal.progress * 100)}% Reached</span>
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
