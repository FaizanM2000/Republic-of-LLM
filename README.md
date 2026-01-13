# Dynamic Government Digital Twin

A living, breathing government simulation built with Next.js that demonstrates autonomous agent creation, institutional evolution, and democratic processes in real-time.

## 🌟 Features

### 🏛️ **Living Government System**
- **Autonomous Agent Creation**: Agents can spawn new departments, agencies, and committees
- **Organic Growth**: Government structure evolves based on needs and crises
- **Constitutional Constraints**: All growth checked against democratic principles
- **Real-time Evolution**: Watch government adapt and respond to challenges

### 🎯 **Interactive Visualizations**
- **Network View**: Interactive force-directed graph of government relationships
- **Hierarchy View**: Organized branch-by-branch government structure
- **Timeline View**: Real-time event feed and activity log

### 📊 **Advanced Analytics**
- **Growth Tracking**: Monitor government expansion and evolution patterns
- **Constitutional Monitoring**: Real-time checks and balances analysis
- **Effectiveness Metrics**: Agent performance and institutional health
- **Crisis Response**: Emergency expansion and adaptation capabilities

### 🎮 **Simulation Controls**
- **Real-time Simulation**: Start/pause government evolution
- **Speed Controls**: Adjust simulation pace from slow to ultra-fast
- **Step Mode**: Manual day-by-day progression
- **Crisis Triggers**: Manually inject challenges to test adaptability

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RepublicofLLM
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ System Architecture

### Core Components

#### **Government Engine** (`lib/government-engine.ts`)
- Central simulation logic
- Agent lifecycle management
- Relationship dynamics
- Constitutional compliance checking
- Crisis response mechanisms

#### **Agent System** (`lib/types.ts`)
- Comprehensive agent modeling
- Personality-driven behavior
- Dynamic relationship formation
- Autonomous decision making

#### **State Management** (`lib/store.ts`)
- Zustand-based global state
- Real-time simulation control
- Event broadcasting
- UI state coordination

### Agent Types

1. **Executive Agents**
   - President, Vice President
   - Cabinet Secretaries
   - Department Heads

2. **Legislative Agents**
   - Congressional Leadership
   - Committee Chairs
   - Representatives

3. **Judicial Agents**
   - Supreme Court Justices
   - Federal Judges
   - Court Officials

4. **Administrative Agents**
   - Federal Agencies
   - Independent Bodies
   - Regulatory Organizations

5. **Dynamic Agents**
   - Task Forces
   - Crisis Response Teams
   - Oversight Committees
   - Emergency Coordinators

## 🧬 Agent Evolution

### **Personality-Driven Behavior**
Each agent has a complex personality profile:
- **Risk Tolerance**: Willingness to take bold actions
- **Innovation**: Openness to new approaches
- **Collaboration**: Preference for working with others
- **Leadership Style**: Decision-making approach
- **Specializations**: Areas of expertise
- **Ideology**: Political/policy orientation

### **Autonomous Actions**
Agents can independently:
- Create new departments/agencies
- Form coalitions and partnerships
- Respond to crises with new structures
- Establish oversight mechanisms
- Adapt to changing circumstances

### **Genetic Algorithm Evolution**
- Successful agents pass traits to new entities
- Mutations introduce diversity
- Natural selection favors effective institutions
- Emergent behaviors develop over time

## 🏛️ Constitutional Framework

### **Built-in Constraints**
- Separation of powers enforcement
- Democratic accountability requirements
- Term limits and rotation
- Budget approval processes
- Oversight mechanisms

### **Checks and Balances**
- Executive power limitations
- Legislative oversight authority
- Judicial review capabilities
- Independent agency autonomy

### **Violation Detection**
- Real-time constitutional monitoring
- Severity assessment
- Automatic correction mechanisms
- Public transparency requirements

## 🎮 How to Use

### **Basic Operation**
1. **Start Simulation**: Click play to begin government evolution
2. **Observe Growth**: Watch as agents create new entities
3. **Interact**: Click on agents to view detailed information
4. **Navigate**: Use relationship links to explore connections

### **Advanced Features**
1. **Speed Control**: Adjust simulation pace for different observation modes
2. **Crisis Injection**: Trigger emergencies to test adaptation
3. **Constitutional Review**: Monitor democratic health indicators
4. **Growth Analysis**: Track institutional evolution patterns

### **View Modes**
- **Network**: Interactive force-directed visualization
- **Hierarchy**: Structured organizational chart
- **Timeline**: Event-driven activity feed

## 🔧 Customization

### **Adding New Agent Types**
```typescript
// In lib/types.ts
export type AgentType =
  | 'executive'
  | 'legislative'
  | 'judicial'
  | 'your_new_type';
```

### **Modifying Behavior**
```typescript
// In lib/government-engine.ts
private considerAgentCreation(agent: Agent): void {
  // Add custom creation logic
}
```

### **Custom Crisis Types**
```typescript
// Add new crisis scenarios
export interface Crisis {
  type: 'economic' | 'security' | 'your_crisis_type';
  // ... other properties
}
```

## 📈 Technical Details

### **Technologies Used**
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **D3.js**: Interactive visualizations
- **Zustand**: State management
- **Recharts**: Data visualization
- **Framer Motion**: Animations

### **Performance Features**
- **Real-time Updates**: Efficient state synchronization
- **Virtualized Rendering**: Smooth performance with large datasets
- **Optimized Calculations**: Minimal computational overhead
- **Responsive Design**: Works on all screen sizes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Inspired by complex systems theory
- Built on democratic principles
- Powered by emergent behavior research
- Driven by civic technology innovation

---

**Experience Democracy in Action** - Watch as a government grows, adapts, and evolves in real-time, constrained by constitutional principles but free to innovate and respond to challenges.