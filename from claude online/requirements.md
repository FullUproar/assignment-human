# Assignment Human - Project Requirements

## Core Concept
A platform that transforms individual action into meaningful participation in humanity's progress. Users receive personalized "assignments" presented as official missions with a terminal/sci-fi aesthetic that makes small acts feel significant and connected to larger purposes.

## Key Innovation
- **No browsing required**: Instant assignment generation based on available time
- **Scale bridging**: Show how individual actions connect to global outcomes  
- **Official mission format**: Terminal UI makes tasks feel important and purposeful
- **Zero friction entry**: No signup required for first assignment

## User Types

### Agents (Assignment Recipients)
- Receive randomized assignments based on time commitment
- Complete missions and report back
- Progress through different scale levels
- Access mission resources and coordination tools

### Commanders (Assignment Creators)
- Submit new assignments to the database
- Set mission parameters (scale, location, skills required)
- Monitor assignment completion rates
- Collaborate on large-scale mission design

## Core Features

### Landing Experience
- Terminal-style interface with green-on-black aesthetic
- Four duration options: "5 Minutes", "This Week", "This Lifetime", "Surprise Me"
- Geolocation detection for location-aware assignments
- Custom crosshair cursor and scanning line effects
- Typewriter animations and glitch effects

### Assignment System
- Real-time mission generation from database
- Scale-based categorization (Personal, Community, Regional, National, Species)
- Location-aware matching (local, regional, global, virtual)
- Skill-based assignment recommendation
- Time commitment filtering

### Mission Briefing Interface
- Official military/space mission format
- Classification levels (Social Impact, Education, Planet Care, etc.)
- Objective descriptions and success metrics
- Duration estimates and resource requirements
- Accept/Decline/Request New Mission options

### Safety & Verification
- All projects public by default
- Community verification for completed assignments
- Reporting system for inappropriate content
- No financial transactions or IP handling
- Meeting safety protocols (public spaces only)

## Technical Requirements

### Frontend Stack
- **Framework**: React with Next.js
- **Styling**: CSS-in-JS or Tailwind CSS
- **Animations**: Framer Motion or CSS animations
- **Typography**: Courier New (monospace) for terminal feel
- **Color Scheme**: Green (#00ff00) on black (#000000)
- **Responsive**: Mobile-first design

### Backend Stack
- **Runtime**: Node.js with Express
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Optional for assignment completion tracking
- **Geolocation**: IP-based location detection
- **API**: RESTful endpoints for assignments and user actions

### Database Schema

```sql
-- Users table (optional, for tracking)
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  location VARCHAR(100),
  skills TEXT[],
  preferences JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Assignments table
CREATE TABLE assignments (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  objective VARCHAR(200),
  classification VARCHAR(50),
  scale VARCHAR(20), -- personal, community, regional, national, species
  duration_type VARCHAR(20), -- quick, medium, deep
  location_type VARCHAR(20), -- local, regional, global, virtual
  skills_required TEXT[],
  created_by INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  active BOOLEAN DEFAULT true
);

-- Assignment completions
CREATE TABLE completions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  assignment_id INTEGER REFERENCES assignments(id),
  status VARCHAR(20), -- accepted, in_progress, completed, abandoned
  completed_at TIMESTAMP,
  verification_count INTEGER DEFAULT 0
);
```

### API Endpoints
- `GET /api/assignment/random?duration=quick&location=chicago` - Get random assignment
- `POST /api/assignment/accept` - Accept an assignment
- `POST /api/assignment/complete` - Mark assignment complete
- `POST /api/assignment/create` - Submit new assignment (commanders)
- `GET /api/assignments` - Browse all assignments (full platform view)

## Deployment Requirements
- **Frontend**: Vercel or Netlify
- **Backend**: Railway, Render, or AWS
- **Database**: Hosted PostgreSQL (Railway, Supabase, or AWS RDS)
- **Domain**: assignmenthuman.com (already owned)
- **SSL**: Required for geolocation features

## Success Metrics
- Time from landing to assignment acceptance < 30 seconds
- Assignment completion rate > 60%
- User return rate for additional assignments > 40%
- Community verification of completed assignments > 80%

## Development Phases

### Phase 1: Core Experience (MVP)
- Landing page with duration selection
- Assignment database with 100+ missions
- Random assignment generation
- Mission briefing interface
- Basic completion tracking

### Phase 2: Enhanced Features
- User accounts and progress tracking
- Location-aware assignment filtering
- Assignment creation interface for commanders
- Community verification system

### Phase 3: Advanced Platform
- Cross-scale mission coordination
- Real-world impact tracking
- Mobile app
- Integration with existing volunteer platforms

## Design Principles
- **Immediate engagement**: No barriers to getting first assignment
- **Meaningful framing**: Every task feels important and connected
- **Progressive disclosure**: Simple entry, complex coordination available
- **Community safety**: Transparency and verification built-in
- **Scale consciousness**: Help users see their place in larger systems