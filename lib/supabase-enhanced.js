// Enhanced Supabase Client with Full Features
class EnhancedSupabaseClient {
    constructor() {
        this.client = null;
        this.currentUser = null;
        this.currentAgent = null;
    }

    async init() {
        try {
            // Use config from config.js
            if (window.SUPABASE_CONFIG && window.supabase) {
                this.client = window.supabase.createClient(
                    window.SUPABASE_CONFIG.url,
                    window.SUPABASE_CONFIG.anonKey
                );
                
                // Listen for auth changes
                this.client.auth.onAuthStateChange((event, session) => {
                    this.currentUser = session?.user || null;
                    if (this.currentUser) {
                        this.loadAgentProfile();
                    }
                });
                
                // Check current session
                const { data: { session } } = await this.client.auth.getSession();
                this.currentUser = session?.user || null;
                
                console.log('✅ Supabase connected!');
                return true;
            }
        } catch (error) {
            console.error('Failed to initialize Supabase:', error);
            return false;
        }
    }

    // =============================================
    // AUTHENTICATION
    // =============================================
    
    async signUp(email, password, username) {
        if (!this.client) return { error: 'No connection' };
        
        const { data, error } = await this.client.auth.signUp({
            email,
            password,
            options: {
                data: { username }
            }
        });
        
        if (!error && data.user) {
            // Create agent profile
            await this.createAgentProfile(data.user.id, email, username);
        }
        
        return { data, error };
    }

    async signIn(email, password) {
        if (!this.client) return { error: 'No connection' };
        
        const { data, error } = await this.client.auth.signInWithPassword({
            email,
            password
        });
        
        if (!error) {
            this.currentUser = data.user;
            await this.loadAgentProfile();
        }
        
        return { data, error };
    }

    async signInAnonymously() {
        if (!this.client) return { error: 'No connection' };
        
        // Generate random username for anonymous user
        const randomUsername = 'Agent_' + Math.random().toString(36).substr(2, 9);
        
        const { data, error } = await this.client.auth.signInAnonymously({
            options: {
                data: { username: randomUsername }
            }
        });
        
        if (!error && data.user) {
            await this.createAgentProfile(data.user.id, null, randomUsername);
        }
        
        return { data, error };
    }

    async signOut() {
        if (!this.client) return;
        await this.client.auth.signOut();
        this.currentUser = null;
        this.currentAgent = null;
    }

    // =============================================
    // AGENT PROFILE
    // =============================================

    async createAgentProfile(userId, email, username) {
        const { data, error } = await this.client
            .from('agents')
            .insert({
                id: userId,
                email: email,
                username: username,
                display_name: username,
                rank: 'recruit',
                points: 0
            })
            .select()
            .single();
        
        if (!error) {
            this.currentAgent = data;
        }
        
        return data;
    }

    async loadAgentProfile() {
        if (!this.currentUser) return null;
        
        const { data, error } = await this.client
            .from('agents')
            .select('*')
            .eq('id', this.currentUser.id)
            .single();
        
        if (!error) {
            this.currentAgent = data;
        }
        
        return data;
    }

    async updateAgentProfile(updates) {
        if (!this.currentUser) return null;
        
        const { data, error } = await this.client
            .from('agents')
            .update(updates)
            .eq('id', this.currentUser.id)
            .select()
            .single();
        
        if (!error) {
            this.currentAgent = data;
        }
        
        return data;
    }

    // =============================================
    // ASSIGNMENTS
    // =============================================

    async getRandomAssignment(durationType) {
        const { data, error } = await this.client
            .rpc('get_random_assignment', {
                p_duration_type: durationType
            });
        
        return data?.[0] || null;
    }

    async getAllAssignments(filters = {}) {
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

        const { data, error } = await query.order('created_at', { ascending: false });
        return data || [];
    }

    async createAssignment(assignment) {
        if (!this.currentUser) {
            return { error: 'Must be logged in to create assignments' };
        }
        
        const { data, error } = await this.client
            .from('assignments')
            .insert({
                ...assignment,
                created_by: this.currentUser.id,
                commander_name: this.currentAgent?.username || 'Anonymous',
                commander_location: this.currentAgent?.location_city || 'Unknown'
            })
            .select()
            .single();
        
        return { data, error };
    }

    async acceptAssignment(assignmentId) {
        if (!this.currentUser) {
            // Create anonymous session
            await this.signInAnonymously();
        }
        
        const { data, error } = await this.client
            .from('assignment_progress')
            .insert({
                assignment_id: assignmentId,
                agent_id: this.currentUser.id,
                status: 'accepted'
            })
            .select()
            .single();
        
        if (!error) {
            // Increment accepted count
            await this.client
                .from('assignments')
                .update({ times_accepted: this.client.sql`times_accepted + 1` })
                .eq('id', assignmentId);
        }
        
        return { data, error };
    }

    async completeAssignment(progressId, notes = '') {
        const { data, error } = await this.client
            .from('assignment_progress')
            .update({
                status: 'completed',
                completion_notes: notes,
                completed_at: new Date().toISOString()
            })
            .eq('id', progressId)
            .select()
            .single();
        
        if (!error) {
            // Update stats and points
            await this.client
                .from('assignments')
                .update({ times_completed: this.client.sql`times_completed + 1` })
                .eq('id', data.assignment_id);
            
            await this.client
                .from('agents')
                .update({ points: this.client.sql`points + 10` })
                .eq('id', this.currentUser.id);
        }
        
        return { data, error };
    }

    async getMyProgress() {
        if (!this.currentUser) return [];
        
        const { data, error } = await this.client
            .from('assignment_progress')
            .select(`
                *,
                assignment:assignments(*)
            `)
            .eq('agent_id', this.currentUser.id)
            .order('accepted_at', { ascending: false });
        
        return data || [];
    }

    // =============================================
    // MISSIONS
    // =============================================

    async getMissions() {
        const { data, error } = await this.client
            .from('missions')
            .select('*')
            .eq('is_active', true)
            .order('is_featured', { ascending: false });
        
        return data || [];
    }

    async createMission(mission) {
        if (!this.currentUser) {
            return { error: 'Must be logged in to create missions' };
        }
        
        const { data, error } = await this.client
            .from('missions')
            .insert({
                ...mission,
                created_by: this.currentUser.id
            })
            .select()
            .single();
        
        return { data, error };
    }

    async joinMission(missionId) {
        if (!this.currentUser) {
            await this.signInAnonymously();
        }
        
        const { data, error } = await this.client
            .from('mission_progress')
            .insert({
                mission_id: missionId,
                agent_id: this.currentUser.id,
                status: 'active'
            })
            .select()
            .single();
        
        return { data, error };
    }

    // =============================================
    // TEAMS
    // =============================================

    async getTeams() {
        const { data, error } = await this.client
            .from('teams')
            .select('*')
            .eq('is_public', true)
            .order('member_count', { ascending: false });
        
        return data || [];
    }

    async createTeam(team) {
        if (!this.currentUser) {
            return { error: 'Must be logged in to create teams' };
        }
        
        const { data: teamData, error: teamError } = await this.client
            .from('teams')
            .insert({
                ...team,
                leader_id: this.currentUser.id
            })
            .select()
            .single();
        
        if (!teamError && teamData) {
            // Add creator as member
            await this.client
                .from('team_members')
                .insert({
                    team_id: teamData.id,
                    agent_id: this.currentUser.id,
                    role: 'leader'
                });
        }
        
        return { data: teamData, error: teamError };
    }

    async joinTeam(teamId) {
        if (!this.currentUser) {
            return { error: 'Must be logged in to join teams' };
        }
        
        const { data, error } = await this.client
            .from('team_members')
            .insert({
                team_id: teamId,
                agent_id: this.currentUser.id,
                role: 'member'
            })
            .select()
            .single();
        
        if (!error) {
            await this.client
                .from('teams')
                .update({ member_count: this.client.sql`member_count + 1` })
                .eq('id', teamId);
        }
        
        return { data, error };
    }

    async getMyTeams() {
        if (!this.currentUser) return [];
        
        const { data, error } = await this.client
            .from('team_members')
            .select(`
                *,
                team:teams(*)
            `)
            .eq('agent_id', this.currentUser.id);
        
        return data || [];
    }

    // =============================================
    // LEADERBOARD & STATS
    // =============================================

    async getLeaderboard(limit = 10) {
        const { data, error } = await this.client
            .from('agents')
            .select('username, display_name, points, rank')
            .order('points', { ascending: false })
            .limit(limit);
        
        return data || [];
    }

    async getStats() {
        const stats = {
            totalAssignments: 0,
            totalAgents: 0,
            totalCompletions: 0,
            totalTeams: 0
        };
        
        // Get counts
        const { count: assignmentCount } = await this.client
            .from('assignments')
            .select('*', { count: 'exact', head: true });
        
        const { count: agentCount } = await this.client
            .from('agents')
            .select('*', { count: 'exact', head: true });
        
        const { count: completionCount } = await this.client
            .from('assignment_progress')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'completed');
        
        const { count: teamCount } = await this.client
            .from('teams')
            .select('*', { count: 'exact', head: true });
        
        stats.totalAssignments = assignmentCount || 0;
        stats.totalAgents = agentCount || 0;
        stats.totalCompletions = completionCount || 0;
        stats.totalTeams = teamCount || 0;
        
        return stats;
    }
}

// Initialize and export
window.AssignmentHumanDB = new EnhancedSupabaseClient();