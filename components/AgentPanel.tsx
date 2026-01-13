'use client';

import { useGovernmentStore } from '@/lib/store';
import {
  X, User, Calendar, TrendingUp, Users, DollarSign,
  Shield, Crown, Gavel, Building, Zap, AlertTriangle,
  ArrowRight, ArrowLeft, Eye, Settings
} from 'lucide-react';
import { Agent, Relationship } from '@/lib/types';

export function AgentPanel() {
  const { selectedAgent, selectAgent, state } = useGovernmentStore();

  if (!selectedAgent) return null;

  const getTypeIcon = (type: string) => {
    const icons = {
      executive: Crown,
      legislative: Users,
      judicial: Gavel,
      department: Building,
      agency: Shield,
      committee: Users,
      taskforce: Zap,
      oversight: Eye,
      emergency: AlertTriangle,
      coalition: Users
    };
    return icons[type as keyof typeof icons] || User;
  };

  const getRelationshipIcon = (type: string) => {
    const icons = {
      reports_to: ArrowLeft,
      oversees: ArrowRight,
      collaborates: Users,
      coordinates: Settings,
      conflicts: AlertTriangle,
      coalition: Users,
      appointment: Crown,
      confirmation: Gavel
    };
    return icons[type as keyof typeof icons] || ArrowRight;
  };

  const getRelatedAgent = (agentId: string): Agent | undefined => {
    return state.agents.find(a => a.id === agentId);
  };

  const formatBudget = (amount: number) => {
    if (amount >= 1e12) return `$${(amount / 1e12).toFixed(1)}T`;
    if (amount >= 1e9) return `$${(amount / 1e9).toFixed(1)}B`;
    if (amount >= 1e6) return `$${(amount / 1e6).toFixed(1)}M`;
    return `$${amount.toLocaleString()}`;
  };

  const TypeIcon = getTypeIcon(selectedAgent.type);

  return (
    <div className="h-full bg-white border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            selectedAgent.type === 'executive' ? 'bg-blue-100 text-blue-600' :
            selectedAgent.type === 'legislative' ? 'bg-green-100 text-green-600' :
            selectedAgent.type === 'judicial' ? 'bg-purple-100 text-purple-600' :
            'bg-gray-100 text-gray-600'
          }`}>
            <TypeIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Agent Details</h3>
            <p className="text-sm text-gray-500">Click relationships to navigate</p>
          </div>
        </div>
        <button
          onClick={() => selectAgent(null)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Basic Info */}
        <div>
          <h4 className="font-semibold text-lg text-gray-900 mb-3">{selectedAgent.name}</h4>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Type</div>
              <div className="font-medium capitalize">{selectedAgent.type}</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Status</div>
              <div className={`font-medium capitalize ${
                selectedAgent.status === 'active' ? 'text-green-600' :
                selectedAgent.status === 'emergency' ? 'text-red-600' :
                'text-yellow-600'
              }`}>
                {selectedAgent.status}
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Effectiveness</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-16 bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      selectedAgent.effectiveness > 0.7 ? 'bg-green-500' :
                      selectedAgent.effectiveness > 0.4 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${selectedAgent.effectiveness * 100}%` }}
                  />
                </div>
                <span className="font-medium text-sm">{Math.round(selectedAgent.effectiveness * 100)}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">Age</span>
              </div>
              <span className="font-medium text-sm">{selectedAgent.age} days</span>
            </div>

            {selectedAgent.staffCount && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Staff</span>
                </div>
                <span className="font-medium text-sm">{selectedAgent.staffCount.toLocaleString()}</span>
              </div>
            )}

            {selectedAgent.budget && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Budget</span>
                </div>
                <span className="font-medium text-sm">{formatBudget(selectedAgent.budget)}</span>
              </div>
            )}

            {selectedAgent.termLimit && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">Term</span>
                </div>
                <span className="font-medium text-sm">
                  {selectedAgent.currentTerm || 1} / {selectedAgent.termLimit / 4}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Political Spectrum */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Political Spectrum</h5>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Progressive</span>
              <span>Center</span>
              <span>Conservative</span>
            </div>
            <div className="relative w-full h-8 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 rounded-lg">
              <div
                className="absolute top-0 h-full w-1 bg-white border-2 border-gray-800 rounded"
                style={{
                  left: `${((selectedAgent.personality.ideologyLean + 1) / 2) * 100}%`,
                  transform: 'translateX(-50%)'
                }}
                title={`Ideology: ${selectedAgent.personality.ideologyLean.toFixed(2)}`}
              />
            </div>
            <div className="text-center text-sm font-medium">
              {selectedAgent.personality.ideologyLean < -0.3 ? 'Progressive' :
               selectedAgent.personality.ideologyLean > 0.3 ? 'Conservative' : 'Moderate'}
            </div>
          </div>
        </div>

        {/* Personality Profile */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Personality Profile</h5>
          <div className="space-y-3">
            {Object.entries(selectedAgent.personality).map(([trait, value]) => {
              if (typeof value === 'number' && trait !== 'ideologyLean') {
                return (
                  <div key={trait} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 capitalize">
                      {trait.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${Math.abs(value) * 100}%` }}
                        />
                      </div>
                      <span className="font-medium text-xs w-8">
                        {Math.round(value * 100)}
                      </span>
                    </div>
                  </div>
                );
              }
              if (trait === 'ideologyLean') return null;
              return (
                <div key={trait} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 capitalize">
                    {trait.replace(/([A-Z])/g, ' $1').toLowerCase()}
                  </span>
                  <span className="font-medium text-sm capitalize">{String(value)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Capabilities */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Capabilities</h5>
          <div className="flex flex-wrap gap-2">
            {selectedAgent.canCreateAgents && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                Can Create Agents
              </span>
            )}
            {selectedAgent.canExpandAuthority && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                Can Expand Authority
              </span>
            )}
            {selectedAgent.termLimit && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                Term Limited
              </span>
            )}
            {selectedAgent.personality.specializations.map(spec => (
              <span key={spec} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                {spec}
              </span>
            ))}
          </div>
        </div>

        {/* Relationships */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">
            Relationships ({selectedAgent.relationships.length})
          </h5>
          <div className="space-y-2">
            {selectedAgent.relationships.length === 0 ? (
              <p className="text-sm text-gray-500 italic">No relationships yet</p>
            ) : (
              selectedAgent.relationships.map((rel, index) => {
                const relatedAgent = getRelatedAgent(rel.targetAgentId);
                const RelIcon = getRelationshipIcon(rel.type);

                if (!relatedAgent) return null;

                return (
                  <div
                    key={index}
                    onClick={() => selectAgent(relatedAgent)}
                    className="flex items-center space-x-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors group"
                  >
                    <RelIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-600" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 group-hover:text-blue-600 truncate">
                        {relatedAgent.name}
                      </div>
                      <div className="text-xs text-gray-500 capitalize">
                        {rel.type.replace('_', ' ')} • Strength: {Math.round(rel.strength * 100)}%
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      rel.influence > 0.5 ? 'bg-green-400' :
                      rel.influence > 0 ? 'bg-yellow-400' :
                      rel.influence < -0.5 ? 'bg-red-400' : 'bg-gray-400'
                    }`} title={`Influence: ${Math.round(rel.influence * 100)}%`} />
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Inner Monologue */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Inner Monologue</h5>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {selectedAgent.innerMonologue && selectedAgent.innerMonologue.length > 0 ? (
              selectedAgent.innerMonologue.slice(0, 10).map(thought => (
                <div key={thought.id} className="p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                  <div className="text-xs font-semibold text-purple-700 mb-1">
                    {new Date(thought.timestamp).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-900 font-medium mb-1">
                    Action: {thought.action}
                  </div>
                  <div className="text-xs text-gray-600 italic">
                    "{thought.reasoning}"
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 italic">No thoughts recorded yet</p>
            )}
          </div>
        </div>

        {/* Meetings Participated */}
        {state.meetings && state.meetings.filter(m => m.participants.includes(selectedAgent.id)).length > 0 && (
          <div>
            <h5 className="font-medium text-gray-900 mb-3">Meetings Participated</h5>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {state.meetings
                .filter(m => m.participants.includes(selectedAgent.id))
                .slice(0, 5)
                .map(meeting => (
                  <div key={meeting.id} className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-blue-900">{meeting.title}</div>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        meeting.status === 'completed' ? 'bg-green-100 text-green-700' :
                        meeting.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>{meeting.status}</span>
                    </div>
                    <div className="text-xs text-blue-700 mb-2">
                      Type: {meeting.type} | Participants: {meeting.participants.length}
                    </div>
                    {meeting.transcript && (
                      <details className="text-xs">
                        <summary className="cursor-pointer text-blue-600 hover:text-blue-800">View Transcript</summary>
                        <div className="mt-2 p-2 bg-white rounded border border-blue-200 whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {meeting.transcript}
                        </div>
                      </details>
                    )}
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div>
          <h5 className="font-medium text-gray-900 mb-3">Recent Activity</h5>
          <div className="space-y-2">
            {state.recentEvents
              .filter(event => event.involvedAgents.includes(selectedAgent.id))
              .slice(0, 5)
              .map(event => (
                <div key={event.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm text-gray-900">{event.description}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(event.timestamp).toLocaleString()}
                  </div>
                </div>
              ))}
            {state.recentEvents.filter(event => event.involvedAgents.includes(selectedAgent.id)).length === 0 && (
              <p className="text-sm text-gray-500 italic">No recent activity</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}