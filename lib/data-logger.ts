// Data Logger for Research and Emergent Behavior Analysis

import { GovernmentState, Agent, Event, CollectiveGoal, Meeting, Law } from './types';

export interface DataSnapshot {
  day: number;
  timestamp: Date;

  // Agent Metrics
  totalAgents: number;
  agentsByType: Record<string, number>;
  agentsByBranch: Record<string, number>;
  avgEffectiveness: number;
  effectivenessDistribution: number[];
  avgAgentAge: number;

  // Budget Metrics
  totalBudget: number;
  budgetByAgent: Array<{ agentId: string; budget: number }>;
  budgetChanges: Array<{ agentId: string; change: number; reason: string }>;

  // Relationship Metrics
  totalRelationships: number;
  relationshipsByType: Record<string, number>;
  avgRelationshipsPerAgent: number;
  networkDensity: number;

  // Goal Metrics
  activeGoals: number;
  completedGoals: number;
  failedGoals: number;
  avgGoalProgress: number;
  goalCompletionsThisDay: number;

  // Meeting Metrics
  totalMeetings: number;
  meetingsThisDay: number;
  meetingsByType: Record<string, number>;
  avgParticipantsPerMeeting: number;

  // Law Metrics
  totalLaws: number;
  lawsThisDay: number;
  lawsByCategory: Record<string, number>;
  lawsByStatus: Record<string, number>;

  // External Conditions
  population: number;
  gdp: number;
  unemploymentRate: number;
  inflationRate: number;
  technologyLevel: number;
  globalStability: number;
  domesticSentiment: number;
  environmentalChallenges: number;
  year: number;

  // Government Health
  publicApproval: number;
  crisisLevel: number;
  constitutionalViolations: number;

  // Event Metrics
  eventsThisDay: number;
  eventsByType: Record<string, number>;
  avgEventImpact: number;

  // Emergent Behavior Indicators
  agentCreationRate: number; // Agents created per day
  governmentComplexity: number; // Total agents * avg relationships
  policyVelocity: number; // Laws + meetings per day
  collaborationIndex: number; // Relationships / agents
  innovationRate: number; // New entities created per day
}

export interface ExperimentConfig {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  snapshotInterval: number; // Take snapshot every N days
  initialConditions?: Partial<GovernmentState>;
  parameters?: {
    actionProbabilityMultiplier?: number;
    budgetConstraints?: boolean;
    goalIncentives?: boolean;
    [key: string]: any;
  };
}

export interface ExperimentRun {
  experimentId: string;
  runId: string;
  config: ExperimentConfig;
  startTime: Date;
  endTime?: Date;
  snapshots: DataSnapshot[];
  events: Event[];
  summary: ExperimentSummary;
}

export interface ExperimentSummary {
  totalDays: number;
  totalAgentsCreated: number;
  totalGoalsCompleted: number;
  totalMeetingsHeld: number;
  totalLawsEnacted: number;
  finalPublicApproval: number;
  avgEffectiveness: number;
  emergentPatterns: EmergentPattern[];
}

export interface EmergentPattern {
  type: 'growth_spike' | 'collaboration_surge' | 'policy_cascade' | 'crisis_response' | 'stagnation' | 'innovation_burst';
  description: string;
  detectedAt: number; // Day number
  metrics: any;
}

export class DataLogger {
  private currentRun: ExperimentRun | null = null;
  private previousSnapshot: DataSnapshot | null = null;

  startExperiment(config: ExperimentConfig): string {
    const runId = `run-${Date.now()}`;

    this.currentRun = {
      experimentId: config.id,
      runId,
      config,
      startTime: new Date(),
      snapshots: [],
      events: [],
      summary: {
        totalDays: 0,
        totalAgentsCreated: 0,
        totalGoalsCompleted: 0,
        totalMeetingsHeld: 0,
        totalLawsEnacted: 0,
        finalPublicApproval: 0,
        avgEffectiveness: 0,
        emergentPatterns: []
      }
    };

    return runId;
  }

  logSnapshot(state: GovernmentState): void {
    if (!this.currentRun) return;

    const snapshot = this.createSnapshot(state);
    this.currentRun.snapshots.push(snapshot);

    // Detect emergent patterns
    if (this.previousSnapshot) {
      const patterns = this.detectEmergentPatterns(this.previousSnapshot, snapshot);
      this.currentRun.summary.emergentPatterns.push(...patterns);
    }

    this.previousSnapshot = snapshot;
  }

  logEvent(event: Event): void {
    if (!this.currentRun) return;
    this.currentRun.events.push(event);
  }

  private createSnapshot(state: GovernmentState): DataSnapshot {
    // Agent Metrics
    const agentsByType: Record<string, number> = {};
    const agentsByBranch: Record<string, number> = {};
    let totalEffectiveness = 0;
    let totalAge = 0;
    const effectivenessValues: number[] = [];

    state.agents.forEach(agent => {
      agentsByType[agent.type] = (agentsByType[agent.type] || 0) + 1;
      agentsByBranch[agent.position.branch] = (agentsByBranch[agent.position.branch] || 0) + 1;
      totalEffectiveness += agent.effectiveness;
      totalAge += agent.age;
      effectivenessValues.push(agent.effectiveness);
    });

    const avgEffectiveness = state.agents.length > 0 ? totalEffectiveness / state.agents.length : 0;
    const avgAgentAge = state.agents.length > 0 ? totalAge / state.agents.length : 0;

    // Relationship Metrics
    let totalRelationships = 0;
    const relationshipsByType: Record<string, number> = {};

    state.agents.forEach(agent => {
      totalRelationships += agent.relationships.length;
      agent.relationships.forEach(rel => {
        relationshipsByType[rel.type] = (relationshipsByType[rel.type] || 0) + 1;
      });
    });

    const avgRelationshipsPerAgent = state.agents.length > 0 ? totalRelationships / state.agents.length : 0;
    const maxPossibleRelationships = state.agents.length * (state.agents.length - 1);
    const networkDensity = maxPossibleRelationships > 0 ? totalRelationships / maxPossibleRelationships : 0;

    // Goal Metrics
    const activeGoals = state.collectiveGoals?.filter(g => g.status === 'active').length || 0;
    const completedGoals = state.collectiveGoals?.filter(g => g.status === 'completed').length || 0;
    const failedGoals = state.collectiveGoals?.filter(g => g.status === 'failed').length || 0;
    const avgGoalProgress = state.collectiveGoals && state.collectiveGoals.length > 0
      ? state.collectiveGoals.reduce((sum, g) => sum + g.progress, 0) / state.collectiveGoals.length
      : 0;

    const goalCompletionsThisDay = this.previousSnapshot
      ? completedGoals - (this.currentRun?.snapshots[this.currentRun.snapshots.length - 1]?.completedGoals || 0)
      : 0;

    // Meeting Metrics
    const totalMeetings = state.meetings?.length || 0;
    const meetingsThisDay = this.previousSnapshot
      ? totalMeetings - (this.currentRun?.snapshots[this.currentRun.snapshots.length - 1]?.totalMeetings || 0)
      : 0;

    const meetingsByType: Record<string, number> = {};
    let totalParticipants = 0;
    state.meetings?.forEach(meeting => {
      meetingsByType[meeting.type] = (meetingsByType[meeting.type] || 0) + 1;
      totalParticipants += meeting.participants.length;
    });
    const avgParticipantsPerMeeting = totalMeetings > 0 ? totalParticipants / totalMeetings : 0;

    // Law Metrics
    const totalLaws = state.laws?.length || 0;
    const lawsThisDay = this.previousSnapshot
      ? totalLaws - (this.currentRun?.snapshots[this.currentRun.snapshots.length - 1]?.totalLaws || 0)
      : 0;

    const lawsByCategory: Record<string, number> = {};
    const lawsByStatus: Record<string, number> = {};
    state.laws?.forEach(law => {
      lawsByCategory[law.category] = (lawsByCategory[law.category] || 0) + 1;
      lawsByStatus[law.status] = (lawsByStatus[law.status] || 0) + 1;
    });

    // Event Metrics
    const eventsThisDay = state.recentEvents.length;
    const eventsByType: Record<string, number> = {};
    let totalImpact = 0;
    state.recentEvents.forEach(event => {
      eventsByType[event.type] = (eventsByType[event.type] || 0) + 1;
      totalImpact += Math.abs(event.impact);
    });
    const avgEventImpact = eventsThisDay > 0 ? totalImpact / eventsThisDay : 0;

    // Budget Metrics
    const budgetByAgent = state.agents.map(agent => ({
      agentId: agent.id,
      budget: agent.budget || 0
    }));

    // Emergent Behavior Indicators
    const agentCreationRate = this.previousSnapshot
      ? state.agents.length - this.previousSnapshot.totalAgents
      : 0;

    const governmentComplexity = state.agents.length * avgRelationshipsPerAgent;
    const policyVelocity = lawsThisDay + meetingsThisDay;
    const collaborationIndex = avgRelationshipsPerAgent;
    const innovationRate = agentCreationRate;

    return {
      day: state.day,
      timestamp: new Date(),

      totalAgents: state.agents.length,
      agentsByType,
      agentsByBranch,
      avgEffectiveness,
      effectivenessDistribution: effectivenessValues,
      avgAgentAge,

      totalBudget: state.totalBudget,
      budgetByAgent,
      budgetChanges: [],

      totalRelationships,
      relationshipsByType,
      avgRelationshipsPerAgent,
      networkDensity,

      activeGoals,
      completedGoals,
      failedGoals,
      avgGoalProgress,
      goalCompletionsThisDay,

      totalMeetings,
      meetingsThisDay,
      meetingsByType,
      avgParticipantsPerMeeting,

      totalLaws,
      lawsThisDay,
      lawsByCategory,
      lawsByStatus,

      population: state.externalConditions.population,
      gdp: state.externalConditions.gdp,
      unemploymentRate: state.externalConditions.unemploymentRate,
      inflationRate: state.externalConditions.inflationRate,
      technologyLevel: state.externalConditions.technologyLevel,
      globalStability: state.externalConditions.globalStability,
      domesticSentiment: state.externalConditions.domesticSentiment,
      environmentalChallenges: state.externalConditions.environmentalChallenges,
      year: state.externalConditions.year,

      publicApproval: state.publicApproval,
      crisisLevel: state.crisisLevel,
      constitutionalViolations: state.constitutionalViolations.length,

      eventsThisDay,
      eventsByType,
      avgEventImpact,

      agentCreationRate,
      governmentComplexity,
      policyVelocity,
      collaborationIndex,
      innovationRate
    };
  }

  private detectEmergentPatterns(prev: DataSnapshot, current: DataSnapshot): EmergentPattern[] {
    const patterns: EmergentPattern[] = [];

    // Growth Spike: Sudden increase in agents
    if (current.agentCreationRate > 5) {
      patterns.push({
        type: 'growth_spike',
        description: `Rapid government expansion: ${current.agentCreationRate} new agents created`,
        detectedAt: current.day,
        metrics: { agentCreationRate: current.agentCreationRate }
      });
    }

    // Collaboration Surge: Big increase in relationships
    if (current.avgRelationshipsPerAgent - prev.avgRelationshipsPerAgent > 2) {
      patterns.push({
        type: 'collaboration_surge',
        description: `Collaboration surge: Avg relationships increased by ${(current.avgRelationshipsPerAgent - prev.avgRelationshipsPerAgent).toFixed(1)}`,
        detectedAt: current.day,
        metrics: { relationshipIncrease: current.avgRelationshipsPerAgent - prev.avgRelationshipsPerAgent }
      });
    }

    // Policy Cascade: Multiple laws/meetings in rapid succession
    if (current.policyVelocity > 10) {
      patterns.push({
        type: 'policy_cascade',
        description: `Policy cascade: ${current.lawsThisDay} laws and ${current.meetingsThisDay} meetings`,
        detectedAt: current.day,
        metrics: { laws: current.lawsThisDay, meetings: current.meetingsThisDay }
      });
    }

    // Stagnation: No new activity
    if (current.policyVelocity === 0 && current.agentCreationRate === 0 && current.day > 10) {
      patterns.push({
        type: 'stagnation',
        description: 'Government stagnation: No new policies or agents',
        detectedAt: current.day,
        metrics: { inactivityDays: 1 }
      });
    }

    // Innovation Burst: High innovation rate
    if (current.innovationRate > 3) {
      patterns.push({
        type: 'innovation_burst',
        description: `Innovation burst: ${current.innovationRate} new entities`,
        detectedAt: current.day,
        metrics: { innovationRate: current.innovationRate }
      });
    }

    return patterns;
  }

  endExperiment(): ExperimentRun | null {
    if (!this.currentRun) return null;

    this.currentRun.endTime = new Date();

    // Calculate summary statistics
    const lastSnapshot = this.currentRun.snapshots[this.currentRun.snapshots.length - 1];
    if (lastSnapshot) {
      this.currentRun.summary = {
        totalDays: lastSnapshot.day,
        totalAgentsCreated: lastSnapshot.totalAgents - (this.currentRun.snapshots[0]?.totalAgents || 0),
        totalGoalsCompleted: lastSnapshot.completedGoals,
        totalMeetingsHeld: lastSnapshot.totalMeetings,
        totalLawsEnacted: lastSnapshot.totalLaws,
        finalPublicApproval: lastSnapshot.publicApproval,
        avgEffectiveness: lastSnapshot.avgEffectiveness,
        emergentPatterns: this.currentRun.summary.emergentPatterns
      };
    }

    const completedRun = this.currentRun;
    this.currentRun = null;
    this.previousSnapshot = null;

    return completedRun;
  }

  getCurrentRun(): ExperimentRun | null {
    return this.currentRun;
  }

  exportToJSON(run: ExperimentRun): string {
    return JSON.stringify(run, null, 2);
  }

  exportToCSV(run: ExperimentRun): string {
    if (run.snapshots.length === 0) return '';

    // CSV Headers
    const headers = Object.keys(run.snapshots[0]).filter(key =>
      typeof run.snapshots[0][key as keyof DataSnapshot] !== 'object'
    );

    let csv = headers.join(',') + '\n';

    // CSV Rows
    run.snapshots.forEach(snapshot => {
      const row = headers.map(header => {
        const value = snapshot[header as keyof DataSnapshot];
        return typeof value === 'string' ? `"${value}"` : value;
      });
      csv += row.join(',') + '\n';
    });

    return csv;
  }
}
