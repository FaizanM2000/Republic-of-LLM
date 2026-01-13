// LLM Integration for Dynamic Government Agents
import { GoogleGenAI } from '@google/genai';

interface LLMConfig {
  provider: 'gemini';
  apiKey?: string;
  model?: string;
}

interface AgentPrompt {
  role: string;
  personality: string;
  context: string;
  decision: string;
}

export class LLMAgentBrain {
  private config: LLMConfig;

  constructor(config: LLMConfig) {
    this.config = config;
  }

  async makeDecision(agent: any, situation: string): Promise<string> {
    const prompt = this.buildPrompt(agent, situation);
    return this.callGemini(prompt);
  }

  private buildPrompt(agent: any, situation: string): string {
    return `
You are ${agent.name}, a ${agent.type} in the US government. You have complete autonomy to think, act, and respond as you see fit based on your personality and role.

YOUR PERSONALITY & NATURE:
- Risk Tolerance: ${agent.personality.riskTolerance}/1.0 (how willing you are to take chances)
- Innovation: ${agent.personality.innovation}/1.0 (how much you embrace new ideas)
- Collaboration: ${agent.personality.collaboration}/1.0 (how much you work with others)
- Leadership Style: ${agent.personality.leadershipStyle}
- Areas of Expertise: ${agent.personality.specializations.join(', ')}
- Political Ideology: ${agent.personality.ideologyLean} (-1=progressive, +1=conservative)
- Decision Speed: ${agent.personality.decisionSpeed}/1.0 (how quickly you act)

CURRENT GOVERNMENT SITUATION: ${situation}

Based on the external conditions and your role, consider what realistic actions you might take. Remember that government expansion should be driven by genuine need, not just activity. Some possible actions:

**When facing new challenges:**
- Create specialized departments/agencies only if existing ones can't handle the issue
- Form task forces for time-limited problems
- Establish oversight mechanisms for emerging risks
- Call hearings or meetings to coordinate responses
- Draft laws to address systemic issues

**When conditions are stable:**
- Focus on improving efficiency of existing structures
- Build relationships and coalitions
- Develop long-term strategic policies
- Conduct reviews and assessments
- Hold committee meetings to review progress

**During economic stress:**
- Request budget increases/decreases as needed for your operations
- Propose budget reallocations or efficiency measures
- Consider consolidating overlapping functions
- Focus on recovery and stabilization initiatives
- Draft responsive legislation

**When new challenges arise:**
- Create agencies to address emerging issues if needed
- Update existing departments to handle changing circumstances
- Draft laws to govern new situations

**Budget Management:**
You can request budget changes for your department/agency. Consider whether you need more funding to be effective, or if you should reduce spending. Be realistic about budget needs.

**Collective Goals:**
You are working toward collective goals with other government agents. Consider how your actions contribute to these shared objectives.
When goals are completed, all assigned agents receive substantial budget rewards! Critical goals = $50B total, High = $25B, Medium = $10B, Low = $5B (split among assigned agents).

**Meetings:**
You can call meetings (hearings, committee meetings, cabinet sessions, etc.) to coordinate with other agents. Meetings will have actual conversations between participating agents to reach decisions.

**Creating Goals:**
You can propose new collective goals for the government to achieve. Goals should target specific metrics like GDP Growth Rate, Unemployment Rate, Public Approval, Technology Level, etc.

Think like a real government official: Would a rational person in your position actually create something new, or would they work within existing structures? What would genuinely serve the public interest?

Respond with your decision and reasoning. If you want to create something new, give it a BRIEF title (2-5 words max).

FORMAT: ACTION: [what you're doing] | REASONING: [your thinking] | CREATE: [brief 2-5 word title or "none"] | MEETING: [meeting title & type (hearing/committee/cabinet/emergency/joint-session) or "none"] | LAW: [law title & category (economic/social/environmental/security/technology/healthcare/education/infrastructure/other) or "none"] | BUDGET_CHANGE: [amount in billions as number like "5.2" for increase or "-3.1" for decrease, or "none"] | GOAL: [goal title & priority (critical/high/medium/low) & metric (GDP Growth Rate/Unemployment Rate/Inflation Rate/Public Approval/Technology Level/Environmental Score/Global Stability) & target value or "none"]
`;
  }


  private async callGemini(prompt: string): Promise<string> {
    if (!this.config.apiKey) {
      console.error('❌ Gemini API key is not configured!');
      console.error('Please add your API key in the LLM Config panel');
      throw new Error('Gemini API key required - configure in UI');
    }

    try {
      console.log('🔄 Calling Gemini API...');
      const ai = new GoogleGenAI({
        apiKey: this.config.apiKey,
      });

      const config = {
        temperature: 0.8, // More deterministic for government decisions
        thinkingConfig: {
          thinkingBudget: -1,
        },
      };

      const model = this.config.model || 'gemini-2.5-flash';
      const contents = [
        {
          role: 'user',
          parts: [
            {
              text: prompt,
            },
          ],
        },
      ];

      const response = await ai.models.generateContentStream({
        model,
        config,
        contents,
      });

      let fullResponse = '';
      for await (const chunk of response) {
        if (chunk.text) {
          fullResponse += chunk.text;
        }
      }

      if (!fullResponse) {
        console.error('⚠️ Gemini API returned empty response');
        throw new Error('Empty response from Gemini API');
      }

      console.log('✅ Gemini API call successful');
      return fullResponse;
    } catch (error: any) {
      console.error('❌ Gemini API error:', error);
      console.error('Error details:', {
        message: error?.message,
        status: error?.status,
        statusText: error?.statusText
      });

      if (error?.message?.includes('API key')) {
        console.error('🔑 API Key issue - please verify your Gemini API key is valid');
      } else if (error?.status === 429) {
        console.error('⏰ Rate limit exceeded - please wait before retrying');
      } else if (error?.status === 403) {
        console.error('🚫 API access forbidden - check API key permissions');
      }

      throw new Error(`Gemini API failed: ${error?.message || 'Unknown error'}`);
    }
  }

  private fallbackDecision(agent: any, situation: string): string {
    // No fallback - agents must think through decisions
    throw new Error('LLM decision required - no rule-based fallback available');
  }

  parseDecision(llmResponse: string): {action: string, reasoning: string, createEntity?: string, meeting?: any, law?: any, budgetChange?: number, goal?: any} {
    const actionMatch = llmResponse.match(/ACTION:\s*([^|]+)/);
    const reasoningMatch = llmResponse.match(/REASONING:\s*([^|]+)/);
    const createMatch = llmResponse.match(/CREATE:\s*([^|]+)/);
    const meetingMatch = llmResponse.match(/MEETING:\s*([^|]+)/);
    const lawMatch = llmResponse.match(/LAW:\s*([^|]+)/);
    const budgetMatch = llmResponse.match(/BUDGET_CHANGE:\s*([^|]+)/);
    const goalMatch = llmResponse.match(/GOAL:\s*([^|]+)/);

    let meeting = undefined;
    if (meetingMatch && meetingMatch[1].trim().toLowerCase() !== 'none') {
      const meetingStr = meetingMatch[1].trim();
      const typeMatch = meetingStr.match(/(hearing|committee|cabinet|emergency|joint-session)/i);
      meeting = {
        title: meetingStr.split('&')[0].trim(),
        type: typeMatch ? typeMatch[1].toLowerCase() : 'committee',
        agenda: actionMatch ? actionMatch[1].trim() : 'Government business'
      };
    }

    let law = undefined;
    if (lawMatch && lawMatch[1].trim().toLowerCase() !== 'none') {
      const lawStr = lawMatch[1].trim();
      const categoryMatch = lawStr.match(/(economic|social|environmental|security|technology|healthcare|education|infrastructure|other)/i);
      law = {
        title: lawStr.split('&')[0].trim(),
        category: categoryMatch ? categoryMatch[1].toLowerCase() : 'other',
        description: actionMatch ? actionMatch[1].trim() : 'Legislative action'
      };
    }

    let budgetChange = undefined;
    if (budgetMatch && budgetMatch[1].trim().toLowerCase() !== 'none') {
      const budgetStr = budgetMatch[1].trim();
      const budgetNum = parseFloat(budgetStr);
      if (!isNaN(budgetNum)) {
        budgetChange = budgetNum * 1e9; // Convert billions to actual number
      }
    }

    let goal = undefined;
    if (goalMatch && goalMatch[1].trim().toLowerCase() !== 'none') {
      const goalStr = goalMatch[1].trim();
      const priorityMatch = goalStr.match(/(critical|high|medium|low)/i);
      const metricMatch = goalStr.match(/(GDP Growth Rate|Unemployment Rate|Inflation Rate|Public Approval|Technology Level|Environmental Score|Global Stability)/i);
      const targetMatch = goalStr.match(/(\d+\.?\d*)/);

      goal = {
        title: goalStr.split('&')[0].trim(),
        priority: priorityMatch ? priorityMatch[1].toLowerCase() : 'medium',
        metric: metricMatch ? metricMatch[1] : 'GDP Growth Rate',
        targetValue: targetMatch ? parseFloat(targetMatch[1]) : 3.0
      };
    }

    return {
      action: actionMatch ? actionMatch[1].trim() : "Taking thoughtful action based on current situation",
      reasoning: reasoningMatch ? reasoningMatch[1].trim() : "Acting according to role and personality",
      createEntity: createMatch && createMatch[1].trim().toLowerCase() !== 'none' ? createMatch[1].trim() : undefined,
      meeting,
      law,
      budgetChange,
      goal
    };
  }
}

// Default Gemini Configuration
export const LLM_CONFIG = {
  provider: 'gemini' as const,
  apiKey: process.env.GEMINI_API_KEY || 'AIzaSyDYrceTj8W1XqNRK0MtIiepT1aKio11s-4',
  model: 'gemini-2.5-flash'
};