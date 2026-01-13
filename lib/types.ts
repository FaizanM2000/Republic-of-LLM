export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  role: string;
  personality: Personality;
  position: Position;
  relationships: Relationship[];
  effectiveness: number;
  age: number;
  canCreateAgents: boolean;
  canExpandAuthority: boolean;
  status: AgentStatus;
  department?: string;
  budget?: number;
  staffCount?: number;
  createdBy?: string;
  createdAt: Date;
  termLimit?: number;
  currentTerm?: number;
  innerMonologue?: InnerMonologue[];
}

export type AgentType =
  | 'executive'
  | 'legislative'
  | 'judicial'
  | 'department'
  | 'agency'
  | 'committee'
  | 'taskforce'
  | 'oversight'
  | 'emergency'
  | 'coalition';

export type AgentStatus = 'active' | 'inactive' | 'temporary' | 'under_review' | 'emergency';

export interface Personality {
  riskTolerance: number; // 0-1
  innovation: number; // 0-1
  collaboration: number; // 0-1
  leadershipStyle: 'authoritative' | 'democratic' | 'collaborative' | 'delegative';
  specializations: string[];
  ideologyLean: number; // -1 (progressive) to 1 (conservative)
  decisionSpeed: number; // 0-1
}

export interface Position {
  x: number;
  y: number;
  branch: 'executive' | 'legislative' | 'judicial' | 'independent';
  level: number; // hierarchy level
}

export interface Relationship {
  targetAgentId: string;
  type: RelationshipType;
  strength: number; // 0-1
  influence: number; // -1 to 1
  created: Date;
}

export type RelationshipType =
  | 'reports_to'
  | 'oversees'
  | 'collaborates'
  | 'coordinates'
  | 'conflicts'
  | 'coalition'
  | 'appointment'
  | 'confirmation';

export interface ExternalConditions {
  population: number;
  gdp: number;
  unemploymentRate: number;
  inflationRate: number;
  technologyLevel: number;
  globalStability: number;
  domesticSentiment: number;
  environmentalChallenges: number;
  year: number;
}

export interface GovernmentState {
  agents: Agent[];
  day: number;
  totalBudget: number;
  crisisLevel: number;
  publicApproval: number;
  constitutionalViolations: ConstitutionalViolation[];
  activeProposals: Proposal[];
  recentEvents: Event[];
  externalConditions: ExternalConditions;
  collectiveGoals: CollectiveGoal[];
  meetings: Meeting[];
  laws: Law[];
}

export interface ConstitutionalViolation {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  violatingAgentId: string;
  detectedAt: Date;
  resolved: boolean;
}

export interface Proposal {
  id: string;
  title: string;
  description: string;
  proposedBy: string;
  type: 'new_agency' | 'budget_change' | 'new_authority' | 'reorganization';
  status: 'proposed' | 'under_review' | 'approved' | 'rejected';
  requiredApprovals: string[];
  receivedApprovals: string[];
  impact: ProposalImpact;
}

export interface ProposalImpact {
  budgetChange: number;
  agentsAffected: string[];
  newPositions: number;
  constitutionalRisk: number; // 0-1
}

export interface Event {
  id: string;
  type: EventType;
  description: string;
  timestamp: Date;
  involvedAgents: string[];
  impact: number; // -1 to 1
  public: boolean;
}

export type EventType =
  | 'agent_created'
  | 'agent_removed'
  | 'relationship_formed'
  | 'budget_allocated'
  | 'crisis_response'
  | 'proposal_submitted'
  | 'approval_given'
  | 'oversight_action'
  | 'constitutional_review'
  | 'agent_action'
  | 'simulation_day';

export interface Crisis {
  id: string;
  type: 'economic' | 'security' | 'natural_disaster' | 'health' | 'technology';
  severity: number; // 0-1
  description: string;
  startDate: Date;
  estimatedDuration: number; // days
  requiredResponse: string[];
  assignedAgents: string[];
}

export interface Department {
  id: string;
  name: string;
  mission: string;
  secretaryId: string;
  budget: number;
  agencies: string[];
  subdivisions: string[];
  canExpand: boolean;
  performanceScore: number;
  fieldOffices: FieldOffice[];
}

export interface FieldOffice {
  id: string;
  location: string;
  parentDepartment: string;
  autonomousOperations: boolean;
  localStaff: number;
}

export interface Committee {
  id: string;
  name: string;
  focus: string;
  chairId: string;
  members: string[];
  investigativePowers: boolean;
  subpoenaAuthority: boolean;
  subcommittees: string[];
  canSpawnSubcommittees: boolean;
}

export interface NetworkNode {
  id: string;
  name: string;
  type: AgentType;
  x: number;
  y: number;
  size: number;
  color: string;
  influence: number;
  connections: string[];
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: RelationshipType;
  strength: number;
  color: string;
  animated?: boolean;
}

export interface InnerMonologue {
  id: string;
  timestamp: Date;
  thought: string;
  action: string;
  reasoning: string;
}

export interface CollectiveGoal {
  id: string;
  title: string;
  description: string;
  targetMetric: string;
  targetValue: number;
  currentValue: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedAgents: string[];
  deadline?: Date;
  progress: number; // 0-1
  status: 'proposed' | 'active' | 'completed' | 'failed';
}

export interface Meeting {
  id: string;
  title: string;
  type: 'hearing' | 'committee' | 'cabinet' | 'emergency' | 'joint-session';
  organizer: string;
  participants: string[];
  agenda: string;
  outcomes: string[];
  scheduledDate: Date;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  transcript?: string;
}

export interface Law {
  id: string;
  title: string;
  description: string;
  category: 'economic' | 'social' | 'environmental' | 'security' | 'technology' | 'healthcare' | 'education' | 'infrastructure' | 'other';
  sponsor: string;
  cosponsors: string[];
  status: 'drafted' | 'committee' | 'floor-vote' | 'passed' | 'vetoed' | 'enacted';
  votes: { agentId: string; vote: 'yes' | 'no' | 'abstain' }[];
  effectiveDate?: Date;
  impact: {
    budgetChange: number;
    affectedPopulation: number;
    implementationCost: number;
  };
}