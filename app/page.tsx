'use client';

import { useEffect } from 'react';
import { useGovernmentStore } from '@/lib/store';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { NetworkVisualization } from '@/components/NetworkVisualization';
import { AgentPanel } from '@/components/AgentPanel';
import { ControlPanel } from '@/components/ControlPanel';
import { EventFeed } from '@/components/EventFeed';
import { StatsPanel } from '@/components/StatsPanel';
import { GrowthTracker } from '@/components/GrowthTracker';
import { ConstitutionalMonitor } from '@/components/ConstitutionalMonitor';
import { LLMConfig } from '@/components/LLMConfig';
import { GoalsTracker } from '@/components/GoalsTracker';
import { ResearchDashboard } from '@/components/ResearchDashboard';
import { LawsViewer } from '@/components/LawsViewer';

export default function Home() {
  const { viewMode, selectedAgent, refresh } = useGovernmentStore();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const renderMainContent = () => {
    switch (viewMode) {
      case 'network':
        return <NetworkVisualization />;
      case 'hierarchy':
        return <Dashboard />;
      case 'timeline':
        return <EventFeed expanded />;
      case 'goals':
        return (
          <div className="h-full overflow-y-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50">
            <GoalsTracker />
          </div>
        );
      case 'research':
        return <ResearchDashboard />;
      case 'laws':
        return <LawsViewer />;
      default:
        return <NetworkVisualization />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        {/* Left Sidebar */}
        <div className="w-80 border-r border-gray-200 bg-white/50 backdrop-blur-sm">
          <div className="p-4 space-y-4 h-full overflow-y-auto">
            <StatsPanel />
            <ControlPanel />
            <LLMConfig />
            <EventFeed />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          <div className="flex-1 relative">
            {renderMainContent()}
          </div>

          {/* Right Sidebar - Agent Details */}
          {selectedAgent && (
            <div className="w-96 border-l border-gray-200 bg-white/50 backdrop-blur-sm">
              <AgentPanel />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}