// Supabase Client Configuration
// This will be loaded in the browser

class SupabaseClient {
    constructor() {
        // These will be set from environment variables or config
        this.supabaseUrl = null;
        this.supabaseAnonKey = null;
        this.client = null;
    }

    async init() {
        // Load config from a config endpoint or environment
        try {
            const config = await this.loadConfig();
            this.supabaseUrl = config.supabaseUrl;
            this.supabaseAnonKey = config.supabaseAnonKey;
            
            // Initialize Supabase client
            if (window.supabase) {
                this.client = window.supabase.createClient(
                    this.supabaseUrl, 
                    this.supabaseAnonKey
                );
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            // Fall back to local storage
            return null;
        }
    }

    async loadConfig() {
        // In production, this would load from an API endpoint
        // For now, we'll use placeholder values
        return {
            supabaseUrl: 'YOUR_SUPABASE_URL',
            supabaseAnonKey: 'YOUR_SUPABASE_ANON_KEY'
        };
    }

    // =============================================
    // AUTHENTICATION
    // =============================================
    
    async signUpAnonymously() {
        if (!this.client) return null;
        
        const { data, error } = await this.client.auth.signInAnonymously();
        if (error) {
            console.error('Anonymous signup error:', error);
            return null;
        }
        return data;
    }

    async signUpWithEmail(email, password, metadata = {}) {
        if (!this.client) return null;
        
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: metadata
            }
        });
        
        if (error) {
            console.error('Signup error:', error);
            return null;
        }
        return data;
    }

    async signIn(email, password) {
        if (!this.client) return null;
        
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            console.error('Sign in error:', error);
            return null;
        }
        return data;
    }

    async signOut() {
        if (!this.client) return;
        await this.client.auth.signOut();
    }

    async getCurrentUser() {
        if (!this.client) return null;
        
        const { data: { user } } = await this.client.auth.getUser();
        return user;
    }

    // =============================================
    // ASSIGNMENTS
    // =============================================

    async getRandomAssignment(durationType = null, locationType = null) {
        if (!this.client) {
            // Fallback to local data
            return this.getLocalRandomAssignment(durationType);
        }

        const { data, error } = await this.client
            .rpc('get_random_assignment', {
                p_duration_type: durationType,
                p_location_type: locationType
            });

        if (error) {
            console.error('Error getting random assignment:', error);
            return this.getLocalRandomAssignment(durationType);
        }

        return data?.[0] || null;
    }

    async getAllAssignments(filters = {}) {
        if (!this.client) {
            return this.getLocalAssignments();
        }

        let query = this.client
            .from('assignments')
            .select('*')
            .eq('is_active', true);

        if (filters.duration_type) {
            query = query.eq('duration_type', filters.duration_type);
        }
        if (filters.classification) {
            query = query.eq('classification', filters.classification);
        }
        if (filters.location_type) {
            query = query.eq('location_type', filters.location_type);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching assignments:', error);
            return this.getLocalAssignments();
        }

        return data || [];
    }

    async createAssignment(assignment) {
        if (!this.client) {
            // Save to local storage
            return this.saveLocalAssignment(assignment);
        }

        const user = await this.getCurrentUser();
        
        const { data, error } = await this.client
            .from('assignments')
            .insert({
                ...assignment,
                created_by: user?.id
            })
            .select()
            .single();

        if (error) {
            console.error('Error creating assignment:', error);
            return this.saveLocalAssignment(assignment);
        }

        return data;
    }

    async acceptAssignment(assignmentId) {
        if (!this.client) {
            return this.saveLocalProgress(assignmentId, 'accepted');
        }

        const user = await this.getCurrentUser();
        if (!user) {
            // Create anonymous session first
            await this.signUpAnonymously();
        }

        const { data, error } = await this.client
            .from('assignment_progress')
            .insert({
                assignment_id: assignmentId,
                agent_id: user?.id,
                status: 'accepted'
            })
            .select()
            .single();

        if (!error) {
            // Update assignment statistics
            await this.client.rpc('increment', {
                table_name: 'assignments',
                column_name: 'times_accepted',
                row_id: assignmentId
            });
        }

        return data;
    }

    async completeAssignment(assignmentId, notes = '') {
        if (!this.client) {
            return this.saveLocalProgress(assignmentId, 'completed');
        }

        const user = await this.getCurrentUser();
        
        const { data, error } = await this.client
            .from('assignment_progress')
            .update({
                status: 'completed',
                completion_notes: notes,
                completed_at: new Date().toISOString()
            })
            .eq('assignment_id', assignmentId)
            .eq('agent_id', user?.id)
            .select()
            .single();

        if (!error) {
            // Update assignment statistics
            await this.client.rpc('increment', {
                table_name: 'assignments',
                column_name: 'times_completed',
                row_id: assignmentId
            });

            // Update agent points
            await this.updateAgentPoints(user?.id, 10); // 10 points per completion
        }

        return data;
    }

    // =============================================
    // MISSIONS
    // =============================================

    async getMissions() {
        if (!this.client) return [];

        const { data, error } = await this.client
            .from('missions')
            .select('*')
            .eq('is_active', true)
            .order('is_featured', { ascending: false });

        if (error) {
            console.error('Error fetching missions:', error);
            return [];
        }

        return data || [];
    }

    async joinMission(missionId) {
        if (!this.client) return null;

        const user = await this.getCurrentUser();
        
        const { data, error } = await this.client
            .from('mission_progress')
            .insert({
                mission_id: missionId,
                agent_id: user?.id,
                status: 'active'
            })
            .select()
            .single();

        return data;
    }

    // =============================================
    // TEAMS
    // =============================================

    async createTeam(teamData) {
        if (!this.client) return null;

        const user = await this.getCurrentUser();
        
        const { data: team, error: teamError } = await this.client
            .from('teams')
            .insert({
                ...teamData,
                leader_id: user?.id
            })
            .select()
            .single();

        if (!teamError && team) {
            // Add creator as first member
            await this.client
                .from('team_members')
                .insert({
                    team_id: team.id,
                    agent_id: user?.id,
                    role: 'leader'
                });
        }

        return team;
    }

    async joinTeam(teamId) {
        if (!this.client) return null;

        const user = await this.getCurrentUser();
        
        const { data, error } = await this.client
            .from('team_members')
            .insert({
                team_id: teamId,
                agent_id: user?.id,
                role: 'member'
            })
            .select()
            .single();

        if (!error) {
            // Update team member count
            await this.client.rpc('increment', {
                table_name: 'teams',
                column_name: 'member_count',
                row_id: teamId
            });
        }

        return data;
    }

    async getTeams() {
        if (!this.client) return [];

        const { data, error } = await this.client
            .from('teams')
            .select(`
                *,
                leader:agents!leader_id(username, display_name)
            `)
            .eq('is_public', true)
            .order('member_count', { ascending: false });

        if (error) {
            console.error('Error fetching teams:', error);
            return [];
        }

        return data || [];
    }

    // =============================================
    // AGENTS
    // =============================================

    async updateAgentProfile(updates) {
        if (!this.client) return null;

        const user = await this.getCurrentUser();
        
        const { data, error } = await this.client
            .from('agents')
            .upsert({
                id: user?.id,
                ...updates,
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        return data;
    }

    async updateAgentPoints(agentId, points) {
        if (!this.client) return;

        await this.client
            .from('agents')
            .update({ 
                points: this.client.sql`points + ${points}` 
            })
            .eq('id', agentId);
    }

    async getLeaderboard(limit = 10) {
        if (!this.client) return [];

        const { data, error } = await this.client
            .from('agents')
            .select('username, display_name, points, rank')
            .order('points', { ascending: false })
            .limit(limit);

        return data || [];
    }

    // =============================================
    // LOCAL STORAGE FALLBACKS
    // =============================================

    getLocalAssignments() {
        const stored = localStorage.getItem('assignmentHumanMissions');
        return stored ? JSON.parse(stored) : [];
    }

    getLocalRandomAssignment(durationType) {
        const assignments = this.getLocalAssignments();
        const filtered = durationType 
            ? assignments.filter(a => a.scale === durationType)
            : assignments;
        
        return filtered[Math.floor(Math.random() * filtered.length)] || null;
    }

    saveLocalAssignment(assignment) {
        const assignments = this.getLocalAssignments();
        const newAssignment = {
            ...assignment,
            id: 'local-' + Date.now(),
            created_at: new Date().toISOString()
        };
        assignments.unshift(newAssignment);
        localStorage.setItem('assignmentHumanMissions', JSON.stringify(assignments));
        return newAssignment;
    }

    saveLocalProgress(assignmentId, status) {
        const progress = JSON.parse(localStorage.getItem('assignmentProgress') || '{}');
        progress[assignmentId] = {
            status,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem('assignmentProgress', JSON.stringify(progress));
        return progress[assignmentId];
    }
}

// Export for use in main script
window.AssignmentHumanDB = new SupabaseClient();