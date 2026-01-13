import { create } from 'zustand';
import { GovernmentState, Agent, Event } from './types';
import { GovernmentEngine } from './government-engine';

interface GovernmentStore {
  engine: GovernmentEngine;
  state: GovernmentState;
  isSimulating: boolean;
  selectedAgent: Agent | null;
  simulationSpeed: number;
  viewMode: 'network' | 'hierarchy' | 'timeline' | 'goals' | 'research' | 'laws';

  // Actions
  startSimulation: () => void;
  stopSimulation: () => void;
  stepSimulation: () => void;
  setSimulationSpeed: (speed: number) => void;
  selectAgent: (agent: Agent | null) => void;
  setViewMode: (mode: 'network' | 'hierarchy' | 'timeline' | 'goals' | 'research' | 'laws') => void;
  updateGeminiApiKey: (apiKey: string) => void;
  refresh: () => void;
}

let simulationInterval: NodeJS.Timeout | null = null;

export const useGovernmentStore = create<GovernmentStore>((set, get) => {
  const engine = new GovernmentEngine();

  // Listen to engine events
  engine.addEventListener((event: Event) => {
    set({ state: engine.getState() });
  });

  return {
    engine,
    state: engine.getState(),
    isSimulating: false,
    selectedAgent: null,
    simulationSpeed: 1000, // ms between steps
    viewMode: 'network',

    startSimulation: () => {
      const { engine, simulationSpeed, isSimulating } = get();

      if (isSimulating) return;

      set({ isSimulating: true });

      simulationInterval = setInterval(async () => {
        try {
          await engine.simulateDay();
          set({ state: engine.getState() });
        } catch (error) {
          console.error('Simulation error:', error);
        }
      }, simulationSpeed);
    },

    stopSimulation: () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
      }
      set({ isSimulating: false });
    },

    stepSimulation: async () => {
      const { engine } = get();
      try {
        await engine.simulateDay();
        set({ state: engine.getState() });
      } catch (error) {
        console.error('Step simulation error:', error);
      }
    },

    setSimulationSpeed: (speed: number) => {
      const { isSimulating, startSimulation, stopSimulation } = get();

      set({ simulationSpeed: speed });

      // Restart simulation with new speed if currently running
      if (isSimulating) {
        stopSimulation();
        setTimeout(() => startSimulation(), 100);
      }
    },

    selectAgent: (agent: Agent | null) => {
      set({ selectedAgent: agent });
    },

    setViewMode: (mode: 'network' | 'hierarchy' | 'timeline' | 'goals' | 'research' | 'laws') => {
      set({ viewMode: mode });
    },

    updateGeminiApiKey: (apiKey: string) => {
      const { engine } = get();
      engine.updateGeminiApiKey(apiKey);
      set({ state: engine.getState() });
    },

    refresh: () => {
      const { engine } = get();
      set({ state: engine.getState() });
    }
  };
});