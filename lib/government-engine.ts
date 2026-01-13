import { Agent, AgentType, Personality, GovernmentState, Crisis, Proposal, Event, ConstitutionalViolation, RelationshipType, ExternalConditions } from './types';
import { LLMAgentBrain, LLM_CONFIG } from './llm-integration';
import { DataLogger } from './data-logger';

export class GovernmentEngine {
  private state: GovernmentState;
  private eventCallbacks: ((event: Event) => void)[] = [];
  private llmBrain: LLMAgentBrain | null = null;
  private useLLM: boolean = false;
  private dataLogger: DataLogger = new DataLogger();

  constructor() {
    this.state = this.initializeGovernment();
    this.initializeLLM();
  }

  private initializeLLM(): void {
    // Always use Gemini LLM
    this.useLLM = true;
    this.llmBrain = new LLMAgentBrain(LLM_CONFIG);
  }

  public updateGeminiApiKey(apiKey: string): void {
    const config = { ...LLM_CONFIG, apiKey };
    this.llmBrain = new LLMAgentBrain(config);
  }

  private initializeGovernment(): GovernmentState {
    const initialAgents: Agent[] = [
      // Executive Branch
      this.createAgent('president', 'President', 'executive', {
        riskTolerance: 0.7,
        innovation: 0.6,
        collaboration: 0.5,
        leadershipStyle: 'authoritative',
        specializations: ['foreign-policy', 'crisis-management'],
        ideologyLean: 0.1,
        decisionSpeed: 0.8
      }, { x: 400, y: 100, branch: 'executive', level: 0 }),

      this.createAgent('vp', 'Vice President', 'executive', {
        riskTolerance: 0.5,
        innovation: 0.7,
        collaboration: 0.8,
        leadershipStyle: 'collaborative',
        specializations: ['domestic-policy', 'senate-relations'],
        ideologyLean: 0.0,
        decisionSpeed: 0.6
      }, { x: 350, y: 150, branch: 'executive', level: 1 }),

      // Cabinet Secretaries
      this.createAgent('sec-state', 'Secretary of State', 'department', {
        riskTolerance: 0.3,
        innovation: 0.5,
        collaboration: 0.9,
        leadershipStyle: 'diplomatic',
        specializations: ['foreign-policy', 'diplomacy', 'international-relations'],
        ideologyLean: -0.2,
        decisionSpeed: 0.4
      }, { x: 200, y: 200, branch: 'executive', level: 2 }),

      this.createAgent('sec-defense', 'Secretary of Defense', 'department', {
        riskTolerance: 0.6,
        innovation: 0.4,
        collaboration: 0.6,
        leadershipStyle: 'authoritative',
        specializations: ['military', 'security', 'defense-tech'],
        ideologyLean: 0.3,
        decisionSpeed: 0.9
      }, { x: 300, y: 200, branch: 'executive', level: 2 }),

      this.createAgent('sec-treasury', 'Secretary of Treasury', 'department', {
        riskTolerance: 0.2,
        innovation: 0.6,
        collaboration: 0.7,
        leadershipStyle: 'analytical',
        specializations: ['economics', 'finance', 'monetary-policy'],
        ideologyLean: 0.1,
        decisionSpeed: 0.5
      }, { x: 400, y: 200, branch: 'executive', level: 2 }),

      // Legislative Branch
      this.createAgent('speaker', 'Speaker of the House', 'legislative', {
        riskTolerance: 0.5,
        innovation: 0.5,
        collaboration: 0.8,
        leadershipStyle: 'democratic',
        specializations: ['procedure', 'coalition-building'],
        ideologyLean: -0.3,
        decisionSpeed: 0.6
      }, { x: 100, y: 300, branch: 'legislative', level: 0 }),

      this.createAgent('senate-leader', 'Senate Majority Leader', 'legislative', {
        riskTolerance: 0.4,
        innovation: 0.4,
        collaboration: 0.9,
        leadershipStyle: 'collaborative',
        specializations: ['legislation', 'negotiation'],
        ideologyLean: -0.1,
        decisionSpeed: 0.5
      }, { x: 200, y: 300, branch: 'legislative', level: 0 }),

      // Judicial Branch
      this.createAgent('chief-justice', 'Chief Justice', 'judicial', {
        riskTolerance: 0.1,
        innovation: 0.3,
        collaboration: 0.5,
        leadershipStyle: 'deliberative',
        specializations: ['constitutional-law', 'precedent'],
        ideologyLean: 0.0,
        decisionSpeed: 0.2
      }, { x: 600, y: 200, branch: 'judicial', level: 0 }),

      // Independent Agencies
      this.createAgent('fbi-director', 'FBI Director', 'agency', {
        riskTolerance: 0.4,
        innovation: 0.7,
        collaboration: 0.6,
        leadershipStyle: 'methodical',
        specializations: ['law-enforcement', 'investigation', 'intelligence'],
        ideologyLean: 0.0,
        decisionSpeed: 0.7
      }, { x: 500, y: 300, branch: 'independent', level: 1 }),

      this.createAgent('fed-chair', 'Federal Reserve Chair', 'agency', {
        riskTolerance: 0.2,
        innovation: 0.5,
        collaboration: 0.4,
        leadershipStyle: 'technocratic',
        specializations: ['monetary-policy', 'economics', 'banking'],
        ideologyLean: 0.0,
        decisionSpeed: 0.3
      }, { x: 600, y: 300, branch: 'independent', level: 1 })
    ];

    // Add relationships
    this.addInitialRelationships(initialAgents);

    return {
      agents: initialAgents,
      day: 0,
      totalBudget: 4500000000000, // $4.5 trillion
      crisisLevel: 0.2,
      publicApproval: 0.45,
      constitutionalViolations: [],
      activeProposals: [],
      recentEvents: [],
      externalConditions: {
        population: 335_000_000, // US population ~335M
        gdp: 26_900_000_000_000, // US GDP ~$26.9T
        unemploymentRate: 3.8, // ~3.8%
        inflationRate: 2.1, // ~2.1%
        technologyLevel: 0.85, // High tech level (0-1)
        globalStability: 0.65, // Moderate global stability
        domesticSentiment: 0.50, // Neutral domestic sentiment
        environmentalChallenges: 0.40, // Moderate environmental issues
        year: 2024
      },
      collectiveGoals: [
        {
          id: 'founding-goal-1',
          title: 'Stabilize Economic Growth',
          description: 'Achieve sustainable GDP growth while keeping inflation and unemployment low',
          targetMetric: 'GDP Growth Rate',
          targetValue: 3.5,
          currentValue: 2.5,
          priority: 'critical',
          assignedAgents: ['president', 'sec-treasury', 'fed-chair'],
          progress: 0.3,
          status: 'active'
        }
      ],
      meetings: [],
      laws: []
    };
  }

  private createAgent(
    id: string,
    name: string,
    type: AgentType,
    personality: Personality,
    position: any,
    canCreateAgents: boolean = true
  ): Agent {
    return {
      id,
      name,
      type,
      role: name,
      personality,
      position,
      relationships: [],
      effectiveness: 0, // Start at 0, build up through experience
      age: 0,
      canCreateAgents,
      canExpandAuthority: type === 'executive' || type === 'department',
      status: 'active',
      budget: this.calculateInitialBudget(type),
      staffCount: this.calculateInitialStaff(type),
      createdAt: new Date(),
      termLimit: this.getTermLimit(type),
      currentTerm: 1,
      innerMonologue: []
    };
  }

  private calculateInitialBudget(type: AgentType): number {
    const budgets = {
      executive: 15000000,
      legislative: 5000000,
      judicial: 8000000,
      department: 50000000000,
      agency: 10000000000,
      committee: 5000000,
      taskforce: 100000000,
      oversight: 50000000,
      emergency: 500000000,
      coalition: 0
    };
    return budgets[type] || 1000000;
  }

  private calculateInitialStaff(type: AgentType): number {
    const staff = {
      executive: 500,
      legislative: 100,
      judicial: 200,
      department: 50000,
      agency: 15000,
      committee: 50,
      taskforce: 500,
      oversight: 200,
      emergency: 1000,
      coalition: 0
    };
    return staff[type] || 10;
  }

  private getTermLimit(type: AgentType): number | undefined {
    if (type === 'executive') return 8; // 2 terms * 4 years
    if (type === 'legislative') return 12; // 6 terms * 2 years for House
    return undefined; // No term limits for others
  }

  private addInitialRelationships(agents: Agent[]): void {
    // President oversees Cabinet
    const president = agents.find(a => a.id === 'president')!;
    const vp = agents.find(a => a.id === 'vp')!;
    const secretaries = agents.filter(a => a.id.startsWith('sec-'));

    secretaries.forEach(secretary => {
      president.relationships.push({
        targetAgentId: secretary.id,
        type: 'oversees',
        strength: 0.8,
        influence: 0.9,
        created: new Date()
      });
      secretary.relationships.push({
        targetAgentId: president.id,
        type: 'reports_to',
        strength: 0.8,
        influence: -0.9,
        created: new Date()
      });
    });

    // VP collaborates with Senate
    const senateLeader = agents.find(a => a.id === 'senate-leader')!;
    vp.relationships.push({
      targetAgentId: senateLeader.id,
      type: 'collaborates',
      strength: 0.6,
      influence: 0.3,
      created: new Date()
    });

    // Add more relationships as needed...
  }

  public async simulateDay(): Promise<void> {
    this.state.day++;

    // Update external conditions gradually over time
    this.evolveExternalConditions();

    // Agent autonomous actions
    await this.processAgentActions();

    // Conduct scheduled meetings
    await this.conductScheduledMeetings();

    // Update and check collective goals
    this.updateCollectiveGoals();

    // Process proposals (keep for democratic process)
    this.processProposals();

    // Check constitutional compliance (keep as safety check)
    this.checkConstitutionalCompliance();

    // Update effectiveness scores
    this.updateEffectiveness();

    // Trigger daily completion event
    this.emitEvent({
      id: `day-${this.state.day}`,
      type: 'simulation_day',
      description: `Day ${this.state.day}: Government agents took autonomous actions`,
      timestamp: new Date(),
      involvedAgents: [],
      impact: 0,
      public: false
    });

    // Log snapshot for research
    this.dataLogger.logSnapshot(this.state);
  }

  private updateCollectiveGoals(): void {
    if (!this.state.collectiveGoals || this.state.collectiveGoals.length === 0) {
      return;
    }

    const conditions = this.state.externalConditions;

    this.state.collectiveGoals.forEach(goal => {
      if (goal.status !== 'active') return;

      // Update current value based on target metric
      switch (goal.targetMetric) {
        case 'GDP Growth Rate':
          const baselineGDP = 26_900_000_000_000;
          const growthRate = ((conditions.gdp - baselineGDP) / baselineGDP) * 100;
          goal.currentValue = growthRate;
          break;
        case 'Unemployment Rate':
          goal.currentValue = conditions.unemploymentRate;
          break;
        case 'Inflation Rate':
          goal.currentValue = conditions.inflationRate;
          break;
        case 'Public Approval':
          goal.currentValue = this.state.publicApproval * 100;
          break;
        case 'Technology Level':
          goal.currentValue = conditions.technologyLevel * 100;
          break;
        case 'Environmental Score':
          goal.currentValue = (1 - conditions.environmentalChallenges) * 100;
          break;
        case 'Global Stability':
          goal.currentValue = conditions.globalStability * 100;
          break;
      }

      // Calculate progress
      const range = Math.abs(goal.targetValue - 0);
      const achieved = Math.abs(goal.targetValue - goal.currentValue);
      goal.progress = Math.max(0, Math.min(1, 1 - (achieved / range)));

      // Check if goal is completed (within 5% tolerance)
      const tolerance = Math.abs(goal.targetValue * 0.05);
      if (Math.abs(goal.currentValue - goal.targetValue) <= tolerance) {
        goal.progress = 1.0;
        goal.status = 'completed';
        this.rewardGoalCompletion(goal);
      }

      // Check if goal has failed (if deadline passed or severely off track)
      if (goal.deadline && new Date() > new Date(goal.deadline) && goal.progress < 0.5) {
        goal.status = 'failed';
        this.emitEvent({
          id: `goal-failed-${goal.id}`,
          type: 'proposal_submitted',
          description: `Goal failed: ${goal.title} - Only ${Math.round(goal.progress * 100)}% progress achieved`,
          timestamp: new Date(),
          involvedAgents: goal.assignedAgents,
          impact: -0.3,
          public: true
        });
      }
    });
  }

  private rewardGoalCompletion(goal: any): void {
    // Calculate reward based on goal priority
    const baseReward = {
      'critical': 50_000_000_000, // $50B
      'high': 25_000_000_000,     // $25B
      'medium': 10_000_000_000,   // $10B
      'low': 5_000_000_000        // $5B
    };

    const rewardAmount = baseReward[goal.priority as keyof typeof baseReward] || 10_000_000_000;
    const rewardPerAgent = rewardAmount / goal.assignedAgents.length;

    // Distribute rewards to assigned agents
    goal.assignedAgents.forEach((agentId: string) => {
      const agent = this.state.agents.find(a => a.id === agentId);
      if (agent && agent.budget !== undefined) {
        const oldBudget = agent.budget;
        agent.budget += rewardPerAgent;

        // Boost effectiveness for goal completion
        agent.effectiveness = Math.min(1.0, agent.effectiveness + 0.1);

        this.emitEvent({
          id: `reward-${agentId}-${goal.id}`,
          type: 'budget_allocated',
          description: `${agent.name} received $${(rewardPerAgent / 1e9).toFixed(2)}B reward for completing goal: ${goal.title}`,
          timestamp: new Date(),
          involvedAgents: [agentId],
          impact: 0.4,
          public: true
        });
      }
    });

    // Boost public approval for goal completion
    const approvalBoost = {
      'critical': 0.05,
      'high': 0.03,
      'medium': 0.02,
      'low': 0.01
    };
    this.state.publicApproval = Math.min(1.0, this.state.publicApproval + (approvalBoost[goal.priority as keyof typeof approvalBoost] || 0.02));

    // Emit goal completion event
    this.emitEvent({
      id: `goal-completed-${goal.id}`,
      type: 'proposal_submitted',
      description: `🎉 GOAL COMPLETED: ${goal.title} - All assigned agents rewarded with budget increases!`,
      timestamp: new Date(),
      involvedAgents: goal.assignedAgents,
      impact: 0.5,
      public: true
    });
  }

  private selectMeetingParticipants(organizer: Agent, meetingType: string, maxParticipants: number): string[] {
    const participants = [organizer.id];
    const potentialParticipants: Agent[] = [];

    // Select based on meeting type
    switch (meetingType) {
      case 'cabinet':
        // Executive branch members
        potentialParticipants.push(...this.state.agents.filter(a =>
          a.position.branch === 'executive' && a.id !== organizer.id
        ));
        break;
      case 'committee':
        // Legislative and related agents
        potentialParticipants.push(...this.state.agents.filter(a =>
          (a.position.branch === 'legislative' || a.type === 'committee') && a.id !== organizer.id
        ));
        break;
      case 'hearing':
        // Mix of branches for oversight
        potentialParticipants.push(...this.state.agents.filter(a =>
          a.id !== organizer.id && (a.type === 'oversight' || a.type === 'legislative')
        ));
        break;
      case 'joint-session':
        // All branches
        potentialParticipants.push(...this.state.agents.filter(a => a.id !== organizer.id));
        break;
      case 'emergency':
        // High-level officials
        potentialParticipants.push(...this.state.agents.filter(a =>
          a.id !== organizer.id && (a.type === 'executive' || a.type === 'department' || a.type === 'agency')
        ));
        break;
      default:
        // Related agents based on relationships
        const relatedIds = organizer.relationships.map(r => r.targetAgentId);
        potentialParticipants.push(...this.state.agents.filter(a =>
          relatedIds.includes(a.id)
        ));
    }

    // Add agents with highest effectiveness first
    potentialParticipants.sort((a, b) => b.effectiveness - a.effectiveness);

    // Add up to maxParticipants
    for (let i = 0; i < Math.min(potentialParticipants.length, maxParticipants - 1); i++) {
      participants.push(potentialParticipants[i].id);
    }

    return participants;
  }

  private async conductScheduledMeetings(): Promise<void> {
    const scheduledMeetings = this.state.meetings.filter(m => m.status === 'scheduled');

    for (const meeting of scheduledMeetings) {
      await this.conductMeeting(meeting);
    }
  }

  private async conductMeeting(meeting: any): Promise<void> {
    if (!this.useLLM || !this.llmBrain) {
      meeting.status = 'cancelled';
      return;
    }

    meeting.status = 'in-progress';
    const participants = meeting.participants
      .map((id: string) => this.state.agents.find(a => a.id === id))
      .filter((a: any) => a !== undefined);

    if (participants.length === 0) {
      meeting.status = 'cancelled';
      return;
    }

    const transcript: string[] = [];
    const conversationHistory: string[] = [];
    const MAX_EXCHANGES = 5;

    // Conduct the meeting with max 5 exchanges
    for (let exchange = 0; exchange < MAX_EXCHANGES; exchange++) {
      const speaker = participants[exchange % participants.length];

      const meetingContext = `
MEETING: ${meeting.title} (${meeting.type})
AGENDA: ${meeting.agenda}
PARTICIPANTS: ${participants.map((p: any) => p.name).join(', ')}
EXCHANGE ${exchange + 1}/${MAX_EXCHANGES}

CONVERSATION SO FAR:
${conversationHistory.length > 0 ? conversationHistory.join('\n') : 'Meeting just started.'}

You are ${speaker.name}. This is a ${meeting.type} meeting. You must contribute to reaching a decision within ${MAX_EXCHANGES - exchange} exchanges remaining.
${exchange === MAX_EXCHANGES - 1 ? 'THIS IS THE FINAL EXCHANGE - You must propose a concrete decision or conclusion.' : ''}

Respond with your statement for this meeting. Be concise and constructive. Focus on reaching a decision.

FORMAT: STATEMENT: [your contribution to the discussion]`;

      try {
        const response = await this.llmBrain.makeDecision(speaker, meetingContext);
        const statementMatch = response.match(/STATEMENT:\s*(.+)/);
        const statement = statementMatch ? statementMatch[1].trim() : response.trim();

        const speakerLine = `${speaker.name}: ${statement}`;
        transcript.push(speakerLine);
        conversationHistory.push(speakerLine);

        // Boost effectiveness for participating
        speaker.effectiveness = Math.min(1.0, speaker.effectiveness + 0.02);
      } catch (error) {
        console.error(`Error in meeting exchange:`, error);
      }
    }

    // Extract outcomes from the final exchanges
    const finalStatements = transcript.slice(-2).join(' ');
    meeting.outcomes = [finalStatements];
    meeting.transcript = transcript.join('\n\n');
    meeting.status = 'completed';

    this.emitEvent({
      id: `meeting-completed-${meeting.id}`,
      type: 'proposal_submitted',
      description: `${meeting.type} completed: ${meeting.title}`,
      timestamp: new Date(),
      involvedAgents: meeting.participants,
      impact: 0.3,
      public: true
    });
  }

  private async processAgentActions(): Promise<void> {
    // Give each agent a chance to act autonomously - much more gradual
    const agentActions = this.state.agents.map(async (agent) => {
      // More realistic action probability - considers external conditions and needs
      const conditions = this.state.externalConditions;

      // Base probability is lower - government doesn't expand constantly
      let actionProbability = agent.effectiveness * 0.02; // 0-2% base chance

      // Increase probability based on external pressures
      if (conditions.unemploymentRate > 6) actionProbability += 0.02;
      if (conditions.inflationRate > 4) actionProbability += 0.015;
      if (conditions.environmentalChallenges > 0.6) actionProbability += 0.01;
      if (conditions.technologyLevel > 0.9) actionProbability += 0.01; // AI era needs
      if (conditions.globalStability < 0.4) actionProbability += 0.02;
      if (conditions.domesticSentiment < 0.3) actionProbability += 0.015;

      // Senior officials more likely to act during challenging times
      if (agent.type === 'executive' || agent.type === 'legislative') {
        actionProbability *= 2;
      }

      if (Math.random() < actionProbability) {
        await this.considerAgentAction(agent);
      }

      // Update agent age and effectiveness
      agent.age++;
      this.updateAgentEffectiveness(agent);
    });

    // Process all agent actions in parallel
    await Promise.all(agentActions);
  }

  private async considerAgentAction(agent: Agent): Promise<void> {
    if (!this.useLLM || !this.llmBrain) {
      console.log(`Skipping agent ${agent.name} - LLM required for autonomous behavior`);
      return;
    }

    try {
      const conditions = this.state.externalConditions;

      // Prepare collective goals info
      const goalsInfo = this.state.collectiveGoals && this.state.collectiveGoals.length > 0
        ? `\n\nCOLLECTIVE GOALS:\n${this.state.collectiveGoals.map(goal =>
            `- ${goal.title} (${Math.round(goal.progress * 100)}% complete, ${goal.priority} priority)\n  Target: ${goal.targetMetric} = ${goal.targetValue}\n  Current: ${goal.currentValue}`
          ).join('\n')}`
        : '';

      const situation = `
Current Year: ${Math.round(conditions.year)}
Population: ${Math.round(conditions.population / 1000000)}M people
GDP: $${Math.round(conditions.gdp / 1e12)}T (${Math.round((conditions.gdp / 26.9e12 - 1) * 100)}% from baseline)
Unemployment: ${conditions.unemploymentRate.toFixed(1)}%
Inflation: ${conditions.inflationRate.toFixed(1)}%
Technology Level: ${Math.round(conditions.technologyLevel * 100)}% (AI/automation era)
Global Stability: ${Math.round(conditions.globalStability * 100)}%
Domestic Sentiment: ${Math.round(conditions.domesticSentiment * 100)}%
Environmental Challenges: ${Math.round(conditions.environmentalChallenges * 100)}%

Government Status:
- Day ${this.state.day} in office
- Public Approval: ${Math.round(this.state.publicApproval * 100)}%
- Your effectiveness: ${Math.round(agent.effectiveness * 100)}%
- Your relationships: ${agent.relationships.length}
- Government budget: $${Math.round(this.state.totalBudget / 1e12)}T${goalsInfo}`;

      const llmResponse = await this.llmBrain.makeDecision(agent, situation);
      const decision = this.llmBrain.parseDecision(llmResponse);

      // Execute the agent's autonomous decision
      await this.executeAgentDecision(agent, decision);

    } catch (error) {
      console.log(`Agent ${agent.name} unable to make decision:`, error);
      // No fallback - agents must think for themselves
    }
  }

  private async executeAgentDecision(agent: Agent, decision: {action: string, reasoning: string, createEntity?: string, meeting?: any, law?: any, budgetChange?: number, goal?: any}): Promise<void> {
    // Store inner monologue
    if (!agent.innerMonologue) agent.innerMonologue = [];
    agent.innerMonologue.unshift({
      id: `thought-${Date.now()}`,
      timestamp: new Date(),
      thought: decision.reasoning,
      action: decision.action,
      reasoning: decision.reasoning
    });
    // Keep only last 50 thoughts
    if (agent.innerMonologue.length > 50) {
      agent.innerMonologue = agent.innerMonologue.slice(0, 50);
    }

    // Create meeting if requested
    if (decision.meeting) {
      // Select relevant participants based on meeting type and agent relationships
      const participants = this.selectMeetingParticipants(agent, decision.meeting.type, 4); // Max 4 participants including organizer

      const meeting = {
        id: `meeting-${Date.now()}`,
        title: decision.meeting.title || 'Government Meeting',
        type: decision.meeting.type || 'committee',
        organizer: agent.id,
        participants: participants,
        agenda: decision.meeting.agenda || decision.action,
        outcomes: [],
        scheduledDate: new Date(),
        status: 'scheduled' as const
      };
      this.state.meetings.push(meeting);
      this.emitEvent({
        id: `meeting-scheduled-${meeting.id}`,
        type: 'proposal_submitted',
        description: `${agent.name} scheduled ${meeting.type}: ${meeting.title}`,
        timestamp: new Date(),
        involvedAgents: participants,
        impact: 0.15,
        public: true
      });
    }

    // Create law if requested
    if (decision.law) {
      const law = {
        id: `law-${Date.now()}`,
        title: decision.law.title || 'New Legislation',
        description: decision.law.description || decision.action,
        category: decision.law.category || 'other',
        sponsor: agent.id,
        cosponsors: [],
        status: 'drafted' as const,
        votes: [],
        impact: {
          budgetChange: decision.law.budgetChange || 0,
          affectedPopulation: decision.law.affectedPopulation || 0,
          implementationCost: decision.law.implementationCost || 0
        }
      };
      this.state.laws.push(law);
      this.emitEvent({
        id: `law-drafted-${law.id}`,
        type: 'proposal_submitted',
        description: `${agent.name} drafted law: ${law.title}`,
        timestamp: new Date(),
        involvedAgents: [agent.id],
        impact: 0.2,
        public: true
      });
    }

    // Apply budget change if requested
    if (decision.budgetChange && agent.budget !== undefined) {
      const oldBudget = agent.budget;
      agent.budget = Math.max(0, agent.budget + decision.budgetChange);
      const change = agent.budget - oldBudget;
      if (Math.abs(change) > 0) {
        this.emitEvent({
          id: `budget-change-${agent.id}-${Date.now()}`,
          type: 'budget_allocated',
          description: `${agent.name} ${change > 0 ? 'increased' : 'decreased'} their budget by $${Math.abs(change / 1e9).toFixed(2)}B`,
          timestamp: new Date(),
          involvedAgents: [agent.id],
          impact: Math.abs(change) / this.state.totalBudget,
          public: true
        });
      }
    }

    // Create goal if requested
    if (decision.goal) {
      const newGoal = {
        id: `goal-${Date.now()}`,
        title: decision.goal.title || 'New Government Goal',
        description: decision.action,
        targetMetric: decision.goal.metric || 'GDP Growth Rate',
        targetValue: decision.goal.targetValue || 3.0,
        currentValue: 0,
        priority: decision.goal.priority || 'medium',
        assignedAgents: [agent.id], // Creator is automatically assigned
        progress: 0,
        status: 'proposed' as 'proposed' | 'active' | 'completed' | 'failed'
      };

      // Only executives and legislative leaders can activate goals immediately
      if (agent.type === 'executive' || agent.type === 'legislative') {
        newGoal.status = 'active';
      }

      this.state.collectiveGoals.push(newGoal);
      this.emitEvent({
        id: `goal-created-${newGoal.id}`,
        type: 'proposal_submitted',
        description: `${agent.name} proposed new ${newGoal.priority} priority goal: ${newGoal.title}`,
        timestamp: new Date(),
        involvedAgents: [agent.id],
        impact: 0.3,
        public: true
      });
    }

    // Create new entity if requested
    if (decision.createEntity) {
      const newAgent = this.createChildAgentFromLLM(agent, decision.createEntity, decision.reasoning);
      if (newAgent) {
        this.state.agents.push(newAgent);
        this.emitEvent({
          id: `creation-${newAgent.id}`,
          type: 'agent_created',
          description: `${agent.name}: ${decision.action}`,
          timestamp: new Date(),
          involvedAgents: [agent.id, newAgent.id],
          impact: 0.2,
          public: true
        });
      }
    } else {
      // Log the agent's action
      this.emitEvent({
        id: `action-${agent.id}-${Date.now()}`,
        type: 'agent_action',
        description: `${agent.name}: ${decision.action}`,
        timestamp: new Date(),
        involvedAgents: [agent.id],
        impact: 0.1,
        public: true
      });
    }

    // Potentially form new relationships based on the action
    if (decision.action.toLowerCase().includes('coalition') ||
        decision.action.toLowerCase().includes('partner') ||
        decision.action.toLowerCase().includes('collaborate')) {
      await this.formRandomRelationship(agent);
    }

    // Boost effectiveness for taking action
    agent.effectiveness = Math.min(1.0, agent.effectiveness + 0.05);
  }

  private async formRandomRelationship(agent: Agent): Promise<void> {
    const potentialPartners = this.state.agents.filter(other =>
      other.id !== agent.id &&
      !agent.relationships.some(r => r.targetAgentId === other.id)
    );

    if (potentialPartners.length > 0) {
      const partner = potentialPartners[Math.floor(Math.random() * potentialPartners.length)];
      const relationshipTypes: RelationshipType[] = ['collaborates', 'coordinates', 'coalition'];
      const type = relationshipTypes[Math.floor(Math.random() * relationshipTypes.length)];

      agent.relationships.push({
        targetAgentId: partner.id,
        type,
        strength: Math.random() * 0.5 + 0.3,
        influence: (Math.random() - 0.5) * 0.4,
        created: new Date()
      });

      this.emitEvent({
        id: `relationship-${agent.id}-${partner.id}`,
        type: 'relationship_formed',
        description: `${agent.name} formed ${type} relationship with ${partner.name}`,
        timestamp: new Date(),
        involvedAgents: [agent.id, partner.id],
        impact: 0.1,
        public: true
      });
    }
  }

  private createChildAgentFromLLM(parent: Agent, entityName: string, reasoning: string): Agent | null {
    // Parse the LLM's entity name to determine type
    const lowercaseName = entityName.toLowerCase();
    let type: AgentType = 'agency';

    if (lowercaseName.includes('department')) type = 'department';
    else if (lowercaseName.includes('committee')) type = 'committee';
    else if (lowercaseName.includes('task force') || lowercaseName.includes('taskforce')) type = 'taskforce';
    else if (lowercaseName.includes('oversight')) type = 'oversight';
    else if (lowercaseName.includes('emergency')) type = 'emergency';

    const id = `${parent.id}-llm-${Date.now()}`;
    const personality = this.evolvePersonality(parent.personality);

    return this.createAgent(
      id,
      entityName,
      type,
      personality,
      this.calculateChildPosition(parent),
      type === 'department' || type === 'agency'
    );
  }

  private createChildAgent(parent: Agent, need: string): Agent | null {
    const agentTypes: { [key: string]: AgentType } = {
      'crisis-response': 'taskforce',
      'oversight': 'oversight',
      'specialization': 'agency',
      'expansion': 'department'
    };

    const type = agentTypes[need];
    const id = `${parent.id}-${type}-${Date.now()}`;
    const name = this.generateAgentName(parent, type, need);

    // Generate personality based on parent with mutations
    const personality = this.evolvePersonality(parent.personality);

    return this.createAgent(
      id,
      name,
      type,
      personality,
      this.calculateChildPosition(parent),
      type === 'department' || type === 'agency'
    );
  }

  private evolvePersonality(parentPersonality: Personality): Personality {
    const mutationRate = 0.1;
    return {
      riskTolerance: this.mutateValue(parentPersonality.riskTolerance, mutationRate),
      innovation: this.mutateValue(parentPersonality.innovation, mutationRate),
      collaboration: this.mutateValue(parentPersonality.collaboration, mutationRate),
      leadershipStyle: Math.random() < mutationRate ?
        this.getRandomLeadershipStyle() : parentPersonality.leadershipStyle,
      specializations: [...parentPersonality.specializations, this.getRandomSpecialization()],
      ideologyLean: this.mutateValue(parentPersonality.ideologyLean, mutationRate, -1, 1),
      decisionSpeed: this.mutateValue(parentPersonality.decisionSpeed, mutationRate)
    };
  }

  private mutateValue(value: number, rate: number, min: number = 0, max: number = 1): number {
    if (Math.random() < rate) {
      const change = (Math.random() - 0.5) * 0.2;
      return Math.max(min, Math.min(max, value + change));
    }
    return value;
  }

  private getRandomLeadershipStyle(): Personality['leadershipStyle'] {
    const styles: Personality['leadershipStyle'][] = ['authoritative', 'democratic', 'collaborative', 'delegative'];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private getRandomSpecialization(): string {
    const specs = ['technology', 'environment', 'healthcare', 'education', 'transportation',
                  'energy', 'agriculture', 'veterans', 'housing', 'immigration'];
    return specs[Math.floor(Math.random() * specs.length)];
  }

  private generateAgentName(parent: Agent, type: AgentType, need: string): string {
    const prefixes: Record<AgentType, string> = {
      taskforce: 'Task Force on',
      oversight: 'Oversight Committee for',
      agency: 'Agency for',
      department: 'Department of',
      committee: 'Committee on',
      emergency: 'Emergency Response for',
      executive: 'Executive Office of',
      legislative: 'Legislative Committee on',
      judicial: 'Judicial Panel on',
      coalition: 'Coalition for'
    };

    const subjects: Record<string, string> = {
      'crisis-response': 'Emergency Response',
      'oversight': `${parent.name} Operations`,
      'specialization': 'Advanced Operations',
      'expansion': 'Regional Development'
    };

    return `${prefixes[type]} ${subjects[need] || 'Special Operations'}`;
  }

  private calculateChildPosition(parent: Agent): any {
    return {
      x: parent.position.x + (Math.random() - 0.5) * 100,
      y: parent.position.y + 80 + Math.random() * 40,
      branch: parent.position.branch,
      level: parent.position.level + 1
    };
  }


  private checkConstitutionalAuthority(creator: Agent, newAgent: Agent): boolean {
    // Simplified constitutional check
    if (creator.type === 'executive' && newAgent.type === 'department') {
      return true; // President can create departments with Senate confirmation
    }
    if (creator.type === 'department' && newAgent.type === 'agency') {
      return true; // Departments can create agencies
    }
    if (creator.type === 'legislative' && newAgent.type === 'committee') {
      return true; // Congress can create committees
    }
    return false;
  }


  private determineRelationshipType(agent1: Agent, agent2: Agent): any {
    // Simplified relationship determination logic
    if (agent1.position.branch === agent2.position.branch) {
      return 'collaborates';
    }
    if (Math.abs(agent1.position.level - agent2.position.level) === 1) {
      return agent1.position.level < agent2.position.level ? 'oversees' : 'reports_to';
    }
    return 'coordinates';
  }

  private evolveExternalConditions(): void {
    const conditions = this.state.externalConditions;

    // Gradual year progression (roughly 1 day = 0.01 years for realistic pacing)
    const yearIncrement = 0.01;
    conditions.year += yearIncrement;

    // Population growth - realistic ~0.5% annually
    const populationGrowthRate = 1 + (0.005 * yearIncrement);
    conditions.population *= populationGrowthRate;

    // GDP growth - varies with economic cycles, typically 2-4% annually
    const baseGdpGrowth = 0.025 + (Math.random() - 0.5) * 0.02;
    conditions.gdp *= 1 + (baseGdpGrowth * yearIncrement);

    // Technology advancement - steady progress with occasional breakthroughs
    const techProgress = 0.001 + (Math.random() < 0.05 ? Math.random() * 0.01 : 0);
    conditions.technologyLevel = Math.min(1.0, conditions.technologyLevel + techProgress);

    // Economic indicators fluctuate naturally
    conditions.unemploymentRate += (Math.random() - 0.5) * 0.02;
    conditions.unemploymentRate = Math.max(1.5, Math.min(15, conditions.unemploymentRate));

    conditions.inflationRate += (Math.random() - 0.5) * 0.05;
    conditions.inflationRate = Math.max(-2, Math.min(8, conditions.inflationRate));

    // Global stability evolves with world events
    conditions.globalStability += (Math.random() - 0.5) * 0.01;
    conditions.globalStability = Math.max(0.1, Math.min(0.9, conditions.globalStability));

    // Domestic sentiment influenced by economic conditions
    const economicFactor = (5 - conditions.unemploymentRate) / 10 + (3 - conditions.inflationRate) / 20;
    conditions.domesticSentiment = 0.8 * conditions.domesticSentiment + 0.2 * economicFactor;
    conditions.domesticSentiment = Math.max(0.1, Math.min(0.9, conditions.domesticSentiment));

    // Environmental challenges gradually increase unless addressed
    conditions.environmentalChallenges += Math.random() * 0.001;
    conditions.environmentalChallenges = Math.min(1.0, conditions.environmentalChallenges);

    // Update budget based on GDP and tax policy
    const budgetGrowthRate = (conditions.gdp / 26_900_000_000_000) * 0.18; // ~18% of GDP
    this.state.totalBudget = conditions.gdp * budgetGrowthRate;

    // Update public approval based on conditions
    const approvalFactor = (conditions.domesticSentiment + conditions.globalStability) / 2;
    this.state.publicApproval = 0.9 * this.state.publicApproval + 0.1 * approvalFactor;
  }

  private processProposals(): void {
    // Process pending proposals
    this.state.activeProposals.forEach(proposal => {
      if (proposal.status === 'under_review') {
        this.evaluateProposal(proposal);
      }
    });
  }

  private evaluateProposal(proposal: Proposal): void {
    // Simplified proposal evaluation
    if (Math.random() < 0.3) {
      proposal.status = Math.random() < 0.7 ? 'approved' : 'rejected';
    }
  }

  private checkConstitutionalCompliance(): void {
    // Check for constitutional violations
    this.state.agents.forEach(agent => {
      if (this.detectViolation(agent)) {
        const violation: ConstitutionalViolation = {
          id: `violation-${agent.id}-${Date.now()}`,
          description: `Potential authority overreach by ${agent.name}`,
          severity: 'medium',
          violatingAgentId: agent.id,
          detectedAt: new Date(),
          resolved: false
        };
        this.state.constitutionalViolations.push(violation);
      }
    });
  }

  private detectViolation(agent: Agent): boolean {
    // Simplified violation detection
    return agent.effectiveness > 0.9 && agent.canExpandAuthority && Math.random() < 0.01;
  }

  private updateEffectiveness(): void {
    this.state.agents.forEach(agent => {
      this.updateAgentEffectiveness(agent);
    });
  }

  private updateAgentEffectiveness(agent: Agent): void {
    // Factor in age, relationships, and random events
    const ageBonus = Math.min(agent.age * 0.01, 0.2);
    const relationshipBonus = agent.relationships.length * 0.02;
    const randomFactor = (Math.random() - 0.5) * 0.1;

    agent.effectiveness = Math.max(0.1, Math.min(1.0,
      agent.effectiveness + ageBonus + relationshipBonus + randomFactor
    ));
  }

  public getState(): GovernmentState {
    return { ...this.state };
  }

  public addEventListener(callback: (event: Event) => void): void {
    this.eventCallbacks.push(callback);
  }

  private emitEvent(event: Event): void {
    this.state.recentEvents.unshift(event);
    if (this.state.recentEvents.length > 100) {
      this.state.recentEvents = this.state.recentEvents.slice(0, 100);
    }

    // Log event to data logger
    this.dataLogger.logEvent(event);

    this.eventCallbacks.forEach(callback => callback(event));
  }

  public createProposal(proposal: Omit<Proposal, 'id' | 'status'>): void {
    const fullProposal: Proposal = {
      ...proposal,
      id: `proposal-${Date.now()}`,
      status: 'proposed'
    };
    this.state.activeProposals.push(fullProposal);
  }

  // Research and Data Logging Methods
  public getDataLogger(): DataLogger {
    return this.dataLogger;
  }

  public startExperiment(config: any): string {
    return this.dataLogger.startExperiment(config);
  }

  public endExperiment() {
    return this.dataLogger.endExperiment();
  }

  public getCurrentExperiment() {
    return this.dataLogger.getCurrentRun();
  }

  public exportExperimentJSON(run: any): string {
    return this.dataLogger.exportToJSON(run);
  }

  public exportExperimentCSV(run: any): string {
    return this.dataLogger.exportToCSV(run);
  }
}