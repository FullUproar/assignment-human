-- Assignment Human Database Schema
-- Using Supabase (PostgreSQL)

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- USERS (AGENTS)
-- =============================================
CREATE TABLE agents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE,
    username TEXT UNIQUE,
    display_name TEXT,
    location_city TEXT,
    location_region TEXT,
    location_country TEXT,
    skills TEXT[],
    rank TEXT DEFAULT 'recruit', -- recruit, agent, commander, coordinator
    points INTEGER DEFAULT 0,
    streak_days INTEGER DEFAULT 0,
    last_active DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TEAMS
-- =============================================
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    mission_focus TEXT, -- primary classification they work on
    location_base TEXT,
    leader_id UUID REFERENCES agents(id),
    member_count INTEGER DEFAULT 0,
    total_completions INTEGER DEFAULT 0,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- TEAM MEMBERS
-- =============================================
CREATE TABLE team_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member', -- member, moderator, co-leader
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(team_id, agent_id)
);

-- =============================================
-- ASSIGNMENTS (Individual Tasks)
-- =============================================
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    objective TEXT NOT NULL,
    classification TEXT NOT NULL, -- SOCIAL IMPACT, EDUCATION, etc.
    duration_type TEXT NOT NULL, -- quick, medium, deep
    duration_estimate TEXT, -- "5 minutes", "1 week", etc.
    scale TEXT NOT NULL, -- personal, community, regional, national, species
    location_type TEXT NOT NULL, -- local, regional, global, virtual
    skills_required TEXT[],
    
    -- Creation info
    created_by UUID REFERENCES agents(id),
    commander_name TEXT,
    commander_location TEXT,
    
    -- Statistics
    times_accepted INTEGER DEFAULT 0,
    times_completed INTEGER DEFAULT 0,
    times_verified INTEGER DEFAULT 0,
    avg_rating DECIMAL(3,2),
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false, -- community verified as safe/good
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- MISSIONS (Collections of Assignments)
-- =============================================
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    objective TEXT NOT NULL,
    classification TEXT NOT NULL,
    duration_estimate TEXT,
    
    -- Mission requirements
    required_assignments UUID[], -- array of assignment IDs
    min_assignments_to_complete INTEGER DEFAULT 1,
    
    -- Creation info
    created_by UUID REFERENCES agents(id),
    
    -- Statistics
    times_joined INTEGER DEFAULT 0,
    times_completed INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- ASSIGNMENT PROGRESS (Agent's work on assignments)
-- =============================================
CREATE TABLE assignment_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID REFERENCES assignments(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id), -- optional, if done as team
    
    status TEXT NOT NULL, -- accepted, in_progress, completed, abandoned, verified
    
    -- Evidence/Notes
    completion_notes TEXT,
    evidence_url TEXT,
    
    -- Verification
    verified_by UUID[] DEFAULT '{}', -- array of agent IDs who verified
    verification_count INTEGER DEFAULT 0,
    
    -- Rating
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    
    -- Timestamps
    accepted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    verified_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(assignment_id, agent_id)
);

-- =============================================
-- MISSION PROGRESS (Agent's work on missions)
-- =============================================
CREATE TABLE mission_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mission_id UUID REFERENCES missions(id) ON DELETE CASCADE,
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id), -- optional
    
    status TEXT NOT NULL, -- active, completed, abandoned
    assignments_completed UUID[] DEFAULT '{}', -- which assignments they've done
    completion_percentage INTEGER DEFAULT 0,
    
    -- Timestamps
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(mission_id, agent_id)
);

-- =============================================
-- OPERATIONS (Special time-limited events)
-- =============================================
CREATE TABLE operations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code_name TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    objective TEXT NOT NULL,
    
    -- Operation parameters
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    target_participants INTEGER,
    target_completions INTEGER,
    
    -- Linked content
    featured_assignments UUID[], -- highlighted assignments for this operation
    featured_missions UUID[], -- highlighted missions for this operation
    
    -- Statistics
    participant_count INTEGER DEFAULT 0,
    completion_count INTEGER DEFAULT 0,
    
    -- Status
    is_active BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- VERIFICATIONS (Community verification system)
-- =============================================
CREATE TABLE verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    progress_id UUID REFERENCES assignment_progress(id) ON DELETE CASCADE,
    verifier_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    
    verification_type TEXT, -- completed, quality, impact
    verification_status BOOLEAN NOT NULL, -- true = verified, false = disputed
    notes TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(progress_id, verifier_id)
);

-- =============================================
-- ACTIVITY FEED (For tracking all actions)
-- =============================================
CREATE TABLE activity_feed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    agent_id UUID REFERENCES agents(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id),
    
    activity_type TEXT NOT NULL, -- accepted, completed, verified, joined_team, etc.
    activity_data JSONB, -- flexible data for different activity types
    
    is_public BOOLEAN DEFAULT true,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_assignments_classification ON assignments(classification);
CREATE INDEX idx_assignments_duration ON assignments(duration_type);
CREATE INDEX idx_assignments_location ON assignments(location_type);
CREATE INDEX idx_assignments_active ON assignments(is_active);

CREATE INDEX idx_assignment_progress_agent ON assignment_progress(agent_id);
CREATE INDEX idx_assignment_progress_status ON assignment_progress(status);

CREATE INDEX idx_agents_location ON agents(location_country, location_region, location_city);
CREATE INDEX idx_agents_rank ON agents(rank);

CREATE INDEX idx_activity_feed_agent ON activity_feed(agent_id);
CREATE INDEX idx_activity_feed_created ON activity_feed(created_at DESC);

-- =============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE assignment_progress ENABLE ROW LEVEL SECURITY;

-- Public read access to assignments
CREATE POLICY "Assignments are viewable by everyone"
    ON assignments FOR SELECT
    USING (is_active = true);

-- Agents can update their own profiles
CREATE POLICY "Agents can update own profile"
    ON agents FOR UPDATE
    USING (auth.uid() = id);

-- Anyone can create assignment progress (accept assignments)
CREATE POLICY "Anyone can accept assignments"
    ON assignment_progress FOR INSERT
    WITH CHECK (true);

-- Agents can update their own progress
CREATE POLICY "Agents can update own progress"
    ON assignment_progress FOR UPDATE
    USING (agent_id = auth.uid());

-- =============================================
-- FUNCTIONS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_agents_updated_at BEFORE UPDATE ON agents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assignments_updated_at BEFORE UPDATE ON assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_missions_updated_at BEFORE UPDATE ON missions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to get random assignment
CREATE OR REPLACE FUNCTION get_random_assignment(
    p_duration_type TEXT DEFAULT NULL,
    p_location_type TEXT DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    description TEXT,
    objective TEXT,
    classification TEXT,
    duration_type TEXT,
    location_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.title,
        a.description,
        a.objective,
        a.classification,
        a.duration_type,
        a.location_type
    FROM assignments a
    WHERE 
        a.is_active = true
        AND (p_duration_type IS NULL OR a.duration_type = p_duration_type)
        AND (p_location_type IS NULL OR a.location_type = p_location_type OR a.location_type IN ('virtual', 'global'))
    ORDER BY RANDOM()
    LIMIT 1;
END;
$$ LANGUAGE plpgsql;