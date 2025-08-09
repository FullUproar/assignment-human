# Assignment Human - Complete Project Brief

## Executive Summary
Build a platform that transforms individual action into meaningful participation in humanity's progress. Users receive personalized "assignments" presented as official missions with a terminal/sci-fi aesthetic. The platform bridges micro-actions (5 minutes) to species-level coordination (lifetime projects).

**Domain**: assignmenthuman.com (owned)
**Target**: Zero-to-assignment in under 30 seconds
**Innovation**: No browsing required - instant mission generation based on time availability

## Development Phases

### Phase 1: MVP (2-3 weeks)
- Landing page with terminal interface
- Assignment database with 50+ missions
- Random assignment generation with geolocation
- Mission briefing interface
- Basic completion tracking

### Phase 2: Enhanced Platform (4-6 weeks)
- User accounts and progress tracking
- Assignment creation interface for commanders
- Community verification system
- Mobile optimization

### Phase 3: Advanced Features (8-12 weeks)
- Cross-scale mission coordination
- Real-world impact tracking
- API integrations
- Mobile app

## Technical Stack

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS with custom terminal theme
- **Animations**: Framer Motion
- **State Management**: Zustand or React Context
- **TypeScript**: Full type safety

### Backend
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (optional for tracking)
- **Geolocation**: IP-based detection with ipapi.co
- **Hosting**: Vercel (frontend) + Railway (backend)

### Core Features Implementation

#### Landing Experience
```javascript
// Key components needed:
- TerminalSplash.tsx - Main landing with typewriter effects
- DurationSelector.tsx - Four mission duration buttons
- MissionBriefing.tsx - Assignment reveal interface
- AssignmentGenerator.ts - Random mission selection logic
```

#### Database Schema (Prisma)
```prisma
model Assignment {
  id          String @id @default(cuid())
  title       String
  description String
  objective   String
  classification String
  scale       String // personal, community, regional, national, species
  durationType String // quick, medium, deep
  locationType String // local, regional, global, virtual
  skillsRequired String[]
  active      Boolean @default(true)
  createdAt   DateTime @default(now())
  completions Completion[]
}

model Completion {
  id           String @id @default(cuid())
  assignmentId String
  assignment   Assignment @relation(fields: [assignmentId], references: [id])
  userLocation String?
  status       String // accepted, completed, abandoned
  completedAt  DateTime?
  createdAt    DateTime @default(now())
}
```

## UI Implementation Guide

### Terminal Aesthetic
```css
/* Core theme variables */
:root {
  --terminal-green: #00ff00;
  --deep-black: #000000;
  --warning-yellow: #ffff00;
  --font-mono: 'Courier New', monospace;
}

/* Key animations */
@keyframes typewriter {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes glitch {
  0% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
  100% { transform: translate(0); }
}
```

### Component Structure
```
/components
  /ui
    - TerminalButton.tsx
    - ScanningLine.tsx
    - GlitchText.tsx
    - MissionCard.tsx
  /features
    - DurationSelector.tsx
    - AssignmentReveal.tsx
    - MissionBriefing.tsx
  /layout
    - TerminalLayout.tsx
    - CustomCursor.tsx
```

## API Endpoints

### Core Assignment API
```javascript
// GET /api/assignment/random
// Query params: duration, location, skills
// Returns: Single randomized assignment

// POST /api/assignment/accept
// Body: { assignmentId, userLocation }
// Returns: Assignment with resources and tracking

// POST /api/assignment/complete
// Body: { assignmentId, status, evidence }
// Returns: Completion confirmation

// POST /api/assignment/create (Phase 2)
// Body: Assignment object
// Returns: Submitted assignment for review
```

### Geolocation Integration
```javascript
// Use ipapi.co for location detection
const getLocation = async () => {
  const response = await fetch('https://ipapi.co/json/');
  const data = await response.json();
  return {
    city: data.city,
    region: data.region,
    country: data.country_code
  };
};
```

## Safety & Verification System

### Built-in Protections
1. **All projects public by default** - No private coordination
2. **Community verification** - Multiple users confirm completions
3. **No financial transactions** - Platform handles no money
4. **Meeting safety protocols** - Public spaces only
5. **Rapid reporting system** - One-click issue reporting

### Implementation
```javascript
// Verification system
const verifyCompletion = async (completionId, verifierId) => {
  // Record verification vote
  // Auto-approve after 3+ verifications
  // Flag for review if disputed
};

// Safety reporting
const reportIssue = async (assignmentId, reason, evidence) => {
  // Immediate assignment suspension
  // Admin notification
  // Community alert if needed
};
```

## Assignment Content Strategy

### Quick Missions (5-20 minutes)
- Local kindness actions
- Learning micro-tasks
- Environmental mini-actions
- Social connection moments

### Medium Missions (1 week - 1 month)
- Community building projects
- Skill sharing initiatives
- Local problem solving
- Resource creation

### Deep Missions (Months to lifetime)
- System design challenges
- Research contributions
- Long-term coordination
- Species-level projects

### Classification System
- **SOCIAL IMPACT**: Human connection and kindness
- **EDUCATION**: Knowledge sharing and learning
- **PLANET CARE**: Environmental action
- **COMMUNITY BUILDING**: Local infrastructure and connection
- **SAFETY**: Emergency preparedness and security
- **CULTURAL**: Art, tradition, and creative expression
- **SPECIES ADVANCEMENT**: Long-term human progress

## User Experience Flow

### First-Time User (30 seconds to assignment)
1. **Land on page** (0s) - See terminal interface
2. **Read prompt** (5s) - "Ready for your assignment?"
3. **Select duration** (10s) - Click time commitment
4. **Receive mission** (15s) - Generated assignment appears
5. **Accept or decline** (30s) - Decision and next steps

### Assignment Generation Logic
```javascript
const generateAssignment = async (duration, location) => {
  // Filter by duration type
  const pool = assignments.filter(a => a.durationType === duration);
  
  // Filter by location if local assignment
  const locationFiltered = pool.filter(a => 
    a.locationType === 'virtual' || 
    a.locationType === 'global' ||
    (a.locationType === 'local' && location.city)
  );
  
  // Random selection
  return locationFiltered[Math.floor(Math.random() * locationFiltered.length)];
};
```

## Success Metrics

### Engagement
- **Time to first assignment**: < 30 seconds
- **Assignment acceptance rate**: > 70%
- **Completion rate**: > 60%
- **Return rate**: > 40%

### Growth
- **Daily active users**: 1000+ by month 3
- **Assignments completed**: 10,000+ by month 6
- **Geographic spread**: 50+ cities by month 6
- **User-generated assignments**: 20% of total by month 12

### Impact
- **Verified completions**: > 80%
- **Real-world outcomes**: Documented impact stories
- **Cross-scale participation**: Users completing multiple mission types
- **Community formation**: Local agent networks

## Deployment Strategy

### Infrastructure
- **Frontend**: Vercel with automatic deployments
- **Backend**: Railway with PostgreSQL
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics + Railway metrics
- **Error tracking**: Sentry integration

### Launch Plan
1. **Soft launch**: 100 beta users in Chicago
2. **Local expansion**: 1000 users in 5 cities
3. **Regional scaling**: 10,000 users across US
4. **Global rollout**: International expansion

### Marketing Approach
- **Word of mouth**: Viral assignment sharing
- **Local media**: Community impact stories
- **Social proof**: Assignment completion stories
- **Influencer partnerships**: Mission completion challenges

## Next Steps for Implementation

### Week 1: Foundation
- Set up Next.js project with TypeScript
- Implement terminal UI components
- Create assignment database schema
- Build landing page with duration selector

### Week 2: Core Logic
- Assignment generation algorithm
- Mission briefing interface
- Geolocation integration
- Basic completion tracking

### Week 3: Polish & Deploy
- Mobile optimization
- Performance optimization
- Testing and bug fixes
- Deploy to production

### Post-MVP: Enhanced Features
- User accounts and profiles
- Assignment creation interface
- Community verification system
- Impact tracking and visualization

This brief provides everything needed to build Assignment Human from concept to deployment. The focus is on rapid iteration to validate the core experience: zero-friction assignment generation that makes individual action feel meaningful and connected to humanity's progress.