'use client';

import { useGovernmentStore } from '@/lib/store';
import { Clock, Users, AlertCircle, CheckCircle, Zap } from 'lucide-react';
import { Event, EventType } from '@/lib/types';
import { useState, useEffect } from 'react';

interface EventFeedProps {
  expanded?: boolean;
}

export function EventFeed({ expanded = false }: EventFeedProps) {
  const { state } = useGovernmentStore();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getEventIcon = (type: EventType) => {
    switch (type) {
      case 'agent_created': return Users;
      case 'crisis_response': return AlertCircle;
      case 'proposal_submitted': return CheckCircle;
      case 'approval_given': return CheckCircle;
      case 'constitutional_review': return Zap;
      default: return Clock;
    }
  };

  const getEventColor = (type: EventType) => {
    switch (type) {
      case 'agent_created': return 'text-green-600';
      case 'crisis_response': return 'text-red-600';
      case 'proposal_submitted': return 'text-blue-600';
      case 'approval_given': return 'text-green-600';
      case 'constitutional_review': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const formatTimeAgo = (date: Date) => {
    if (!isHydrated) {
      // Return static content during SSR
      return 'Recently';
    }

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const events = state.recentEvents.slice(0, expanded ? 50 : 10);

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-200 ${
      expanded ? 'h-full' : ''
    }`}>
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-government-600" />
          <h3 className="font-semibold text-gray-900">
            {expanded ? 'Government Activity Timeline' : 'Recent Events'}
          </h3>
        </div>
      </div>

      <div className={`${expanded ? 'h-full overflow-y-auto' : 'max-h-80 overflow-y-auto'}`}>
        {events.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p>No events yet. Start the simulation to see government activity!</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {events.map((event) => {
              const Icon = getEventIcon(event.type);
              const colorClass = getEventColor(event.type);

              return (
                <div
                  key={event.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`flex-shrink-0 mt-0.5 ${colorClass}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900 font-medium leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {formatTimeAgo(event.timestamp)}
                      </span>

                      {event.impact !== 0 && (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          event.impact > 0
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {event.impact > 0 ? '+' : ''}{Math.round(event.impact * 100)}%
                        </span>
                      )}
                    </div>

                    {event.involvedAgents.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {event.involvedAgents.slice(0, 3).map((agentId) => {
                          const agent = state.agents.find(a => a.id === agentId);
                          return agent ? (
                            <span
                              key={agentId}
                              className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
                            >
                              {agent.name}
                            </span>
                          ) : null;
                        })}
                        {event.involvedAgents.length > 3 && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full">
                            +{event.involvedAgents.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}