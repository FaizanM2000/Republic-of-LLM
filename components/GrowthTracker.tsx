'use client';

import { useGovernmentStore } from '@/lib/store';
import { TrendingUp, Users, Building, Calendar, Target } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useMemo } from 'react';

export function GrowthTracker() {
  const { state } = useGovernmentStore();

  // Calculate growth metrics over time
  const growthData = useMemo(() => {
    const data = [];
    const daysToShow = Math.min(state.day, 30); // Show last 30 days

    for (let i = Math.max(0, state.day - daysToShow); i <= state.day; i++) {
      // Simulate historical data based on current state
      const agentsAtDay = Math.max(10, state.agents.length - (state.day - i) * 0.5);
      const effectivenessAtDay = Math.max(0.3,
        state.agents.reduce((sum, a) => sum + a.effectiveness, 0) / state.agents.length -
        (state.day - i) * 0.01
      );

      data.push({
        day: i,
        agents: Math.round(agentsAtDay),
        effectiveness: Math.round(effectivenessAtDay * 100),
        budget: Math.round(state.totalBudget / 1e9), // In billions
        crisisLevel: Math.round((Math.sin(i * 0.5) + 1) * 15 + 10) // Deterministic simulation
      });
    }

    return data;
  }, [state.agents, state.day, state.totalBudget]);

  // Agent type distribution
  const agentTypeData = useMemo(() => {
    const distribution = state.agents.reduce((acc, agent) => {
      acc[agent.type] = (acc[agent.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(distribution).map(([type, count]) => ({
      type: type.replace('_', ' '),
      count,
      percentage: state.agents.length > 0 ? Math.round((count / state.agents.length) * 100) : 0
    }));
  }, [state.agents]);

  // Growth rate calculations
  const growthRate = useMemo(() => {
    if (growthData.length < 2) return 0;
    const current = growthData[growthData.length - 1].agents;
    const previous = growthData[growthData.length - 2].agents;
    return ((current - previous) / previous) * 100;
  }, [growthData]);

  const avgEffectiveness = state.agents.reduce((sum, a) => sum + a.effectiveness, 0) / state.agents.length;

  return (
    <div className="space-y-6">
      {/* Growth Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Agents</p>
              <p className="text-2xl font-bold text-gray-900">{state.agents.length}</p>
              <p className={`text-sm ${growthRate >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {growthRate >= 0 ? '+' : ''}{growthRate.toFixed(1)}% from yesterday
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Effectiveness</p>
              <p className="text-2xl font-bold text-gray-900">{Math.round(avgEffectiveness * 100)}%</p>
              <p className="text-sm text-gray-500">System-wide performance</p>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Government Age</p>
              <p className="text-2xl font-bold text-gray-900">{state.day}</p>
              <p className="text-sm text-gray-500">Days of evolution</p>
            </div>
            <Calendar className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {state.agents.filter(a => a.type === 'department').length}
              </p>
              <p className="text-sm text-gray-500">Major divisions</p>
            </div>
            <Building className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Growth Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Growth Over Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Government Growth</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={growthData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="agents"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Total Agents"
              />
              <Line
                type="monotone"
                dataKey="effectiveness"
                stroke="#10b981"
                strokeWidth={2}
                name="Effectiveness %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Agent Type Distribution */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Agent Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={agentTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Growth Analysis */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Analysis</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Growth Patterns */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Growth Patterns</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-900">Organic Expansion</span>
                <span className="font-semibold text-blue-900">
                  {state.agents.filter(a => a.createdBy).length} agents
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-900">Crisis Response</span>
                <span className="font-semibold text-green-900">
                  {state.agents.filter(a => a.type === 'emergency' || a.type === 'taskforce').length} units
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="text-sm text-purple-900">Oversight Bodies</span>
                <span className="font-semibold text-purple-900">
                  {state.agents.filter(a => a.type === 'oversight' || a.type === 'committee').length} entities
                </span>
              </div>
            </div>
          </div>

          {/* Evolution Metrics */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Evolution Metrics</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Specialization</span>
                  <span className="text-sm font-medium">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Adaptation Rate</span>
                  <span className="text-sm font-medium">63%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '63%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Complexity Index</span>
                  <span className="text-sm font-medium">82%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-gray-600">Efficiency</span>
                  <span className="text-sm font-medium">{Math.round(avgEffectiveness * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-orange-500 h-2 rounded-full"
                    style={{ width: `${avgEffectiveness * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Growth Events */}
        <div className="mt-6">
          <h4 className="font-medium text-gray-900 mb-3">Recent Growth Events</h4>
          <div className="space-y-2">
            {state.recentEvents
              .filter(event => event.type === 'agent_created')
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Target className="w-4 h-4 text-green-600" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{event.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            {state.recentEvents.filter(e => e.type === 'agent_created').length === 0 && (
              <p className="text-sm text-gray-500 italic">No recent growth events</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}