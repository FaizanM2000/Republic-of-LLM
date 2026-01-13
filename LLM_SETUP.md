# 🤖 LLM Integration Setup Guide

## 🎯 **Current State: Pure Simulation**

**Your system is currently running in pure simulation mode** - no LLM APIs are required! The government evolves using:
- Rule-based decision making
- Probabilistic behaviors
- Personality-driven actions
- Genetic algorithm evolution

## 🔗 **Adding Real AI Decision Making**

To enable actual LLM-powered agent decisions, you have several options:

### **Option 1: OpenAI Integration (Recommended)**

1. **Get API Key**
   - Sign up at [OpenAI](https://platform.openai.com/)
   - Create an API key in your dashboard
   - Add credits to your account (~$5-10 for testing)

2. **Configure Environment**
   ```bash
   # Copy the example file
   cp .env.local.example .env.local

   # Edit .env.local and add:
   OPENAI_API_KEY=your_actual_api_key_here
   LLM_PROVIDER=openai
   ```

3. **Enable in UI**
   - Open the AI Integration panel in the left sidebar
   - Select "OpenAI (GPT-4)"
   - Enter your API key
   - Click "Enable AI Decision Making"

### **Option 2: Anthropic (Claude) Integration**

1. **Get API Key**
   - Sign up at [Anthropic Console](https://console.anthropic.com/)
   - Create an API key
   - Add credits (~$5-10 for testing)

2. **Configure Environment**
   ```bash
   # In .env.local add:
   ANTHROPIC_API_KEY=your_anthropic_key_here
   LLM_PROVIDER=anthropic
   ```

3. **Enable in UI**
   - Select "Anthropic (Claude)" in the AI Integration panel
   - Enter your API key
   - Enable AI decision making

### **Option 3: Local LLM (Free Alternative)**

1. **Install Ollama**
   ```bash
   # Download from https://ollama.ai/
   # Or using package manager:
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Download a Model**
   ```bash
   # Download Llama 2 (4GB)
   ollama pull llama2

   # Or download a smaller model
   ollama pull phi3.5
   ```

3. **Configure Environment**
   ```bash
   # In .env.local add:
   LLM_PROVIDER=local
   LOCAL_LLM_URL=http://localhost:11434/api/generate
   LOCAL_LLM_MODEL=llama2
   ```

4. **Enable in UI**
   - Select "Local LLM (Ollama)" in the AI Integration panel
   - Click "Enable AI Decision Making" (no API key required)

## 🧠 **How LLM Integration Works**

When enabled, agents will:

1. **Receive Context**: Current government state, crisis levels, relationships
2. **AI Decision**: LLM evaluates situation based on agent's personality
3. **Parse Response**: System extracts decision and reasoning
4. **Execute Action**: Create entities, form coalitions, respond to crises
5. **Fallback**: If LLM fails, fall back to simulation logic

### **Example LLM Prompt**
```
You are Secretary of Defense, a department in the US government.

PERSONALITY PROFILE:
- Risk Tolerance: 0.6/1.0
- Innovation: 0.4/1.0
- Collaboration: 0.6/1.0
- Leadership Style: authoritative
- Specializations: military, security, defense-tech
- Ideology: 0.3 (-1=progressive, +1=conservative)

CURRENT SITUATION: Government day 15. Current crisis level: 0.4.
Public approval: 0.45. You have 3 relationships and effectiveness 0.75.

DECISION OPTIONS:
1. Create a new department/agency
2. Form a coalition with other agents
3. Respond to crisis with emergency measures
4. Maintain status quo
5. Delegate to subordinates

Based on your personality and role, what would you decide?

Format: DECISION: [number] | REASONING: [text] | CREATE: [entity name if any]
```

## 💰 **Cost Considerations**

### **OpenAI Costs** (Approximate)
- **GPT-4**: ~$0.03 per agent decision
- **Daily simulation**: 10-50 agent decisions = $0.30-$1.50/day
- **Monthly usage**: ~$10-45 for active simulation

### **Anthropic Costs** (Approximate)
- **Claude Sonnet**: ~$0.015 per agent decision
- **Daily simulation**: 10-50 agent decisions = $0.15-$0.75/day
- **Monthly usage**: ~$5-22 for active simulation

### **Local LLM** (Free)
- No ongoing costs after setup
- Requires ~4-8GB RAM for model
- Slower response times
- Privacy-focused (no data sent externally)

## 🔒 **Privacy & Security**

### **Cloud LLMs (OpenAI/Anthropic)**
- ✅ High-quality reasoning
- ❌ Government simulation data sent to external APIs
- ❌ API key storage required
- ❌ Ongoing costs

### **Local LLMs**
- ✅ Complete privacy (no external calls)
- ✅ No ongoing costs
- ✅ No API key required
- ❌ Lower reasoning quality
- ❌ Requires local compute resources

## 🧪 **Testing LLM Integration**

1. **Start with Local LLM** (free and private)
2. **Run short simulations** (5-10 days) to test
3. **Compare behaviors** between simulation and LLM modes
4. **Monitor costs** if using cloud APIs
5. **Scale up** once satisfied with results

## 🔧 **Troubleshooting**

### **LLM Calls Failing**
- Check API key validity
- Verify account has credits
- Check rate limits
- System automatically falls back to simulation

### **Local LLM Not Working**
- Ensure Ollama is running: `ollama serve`
- Check model is downloaded: `ollama list`
- Verify URL in .env.local

### **Poor Decision Quality**
- Try different models (GPT-4 > Claude > Llama2)
- Adjust personality parameters
- Monitor agent effectiveness scores

## 🎮 **Quick Start Without LLM**

**You can enjoy the full system without any LLM setup!**
1. Visit `http://localhost:3006`
2. Click "Start" in the control panel
3. Watch the simulation evolve using pure algorithmic intelligence
4. Add LLM integration later when ready

The rule-based system is sophisticated and creates fascinating emergent behaviors without requiring any external APIs or costs.