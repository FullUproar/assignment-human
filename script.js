class AssignmentManager {
    constructor() {
        this.assignments = this.loadAssignments();
        this.currentFilter = 'all';
        this.currentMission = null;
        this.userLocation = null;
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.detectLocation();
        this.loadInitialAssignments();
        this.updateStats();
        this.initializeEffects();
    }

    async detectLocation() {
        try {
            // Try to get location from IP using a CORS-friendly service
            const response = await fetch('https://api.ipbase.com/v2/info?apikey=free');
            const data = await response.json();
            if (data.data && data.data.location) {
                this.userLocation = {
                    city: data.data.location.city?.name,
                    region: data.data.location.region?.name,
                    country: data.data.location.country?.name
                };
                document.getElementById('agentInfo').textContent = 
                    `AGENT: ${data.data.location.city?.name?.toUpperCase() || 'UNKNOWN'}, ${data.data.location.region?.name?.toUpperCase() || 'EARTH'}`;
            } else {
                document.getElementById('agentInfo').textContent = 'AGENT: LOCATION CLASSIFIED';
            }
        } catch (error) {
            // Fallback to browser geolocation or default
            document.getElementById('agentInfo').textContent = 'AGENT: LOCATION CLASSIFIED';
        }
    }

    initializeEffects() {
        // Custom cursor tracking
        document.addEventListener('mousemove', (e) => {
            const cursor = document.querySelector('.cursor-cross');
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
        });

        // Add random glitch effect
        setInterval(() => {
            const elements = document.querySelectorAll('.assignment-title, .terminal-header');
            elements.forEach(el => {
                if (Math.random() < 0.1) {
                    el.classList.add('glitch');
                    setTimeout(() => el.classList.remove('glitch'), 300);
                }
            });
        }, 2000);
    }

    setupEventListeners() {
        // Navigation filters in platform view
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!e.target.classList.contains('add-btn')) {
                    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.currentFilter = e.target.dataset.filter;
                    this.renderAssignments();
                }
            });
        });

        // Modal controls
        const addModal = document.getElementById('addModal');
        const viewModal = document.getElementById('viewModal');
        const addBtn = document.getElementById('addAssignmentBtn');
        const closeBtns = document.querySelectorAll('.close');

        if (addBtn) {
            addBtn.addEventListener('click', () => {
                addModal.style.display = 'block';
            });
        }

        closeBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.target.closest('.modal').style.display = 'none';
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.style.display = 'none';
            }
        });

        // Form submission
        document.getElementById('assignmentForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.submitAssignment();
            addModal.style.display = 'none';
            e.target.reset();
        });
    }

    loadInitialAssignments() {
        // Load assignments from data file if no saved assignments
        if (this.assignments.length === 0 && typeof assignmentData !== 'undefined') {
            // Convert assignment data to full assignment objects
            Object.keys(assignmentData).forEach(scale => {
                assignmentData[scale].forEach(assignment => {
                    this.assignments.push({
                        id: this.generateId(),
                        ...assignment,
                        scale: scale,
                        commander: { 
                            name: 'System', 
                            location: 'Global Command' 
                        },
                        date: new Date().toISOString(),
                        agents: Math.floor(Math.random() * 500) + 1,
                        completed: Math.floor(Math.random() * 100),
                        verifications: Math.floor(Math.random() * 50),
                        contributions: []
                    });
                });
            });
            this.saveAssignments();
        }
    }

    getAssignment(type) {
        const splash = document.getElementById('splashScreen');
        const reveal = document.getElementById('assignmentReveal');
        
        splash.classList.add('hidden');
        
        setTimeout(() => {
            let missionPool;
            
            if (type === 'random') {
                missionPool = this.assignments;
            } else {
                missionPool = this.assignments.filter(a => a.scale === type);
            }
            
            // Filter by location if applicable
            const localMissions = missionPool.filter(a => 
                a.locationType === 'virtual' || 
                a.locationType === 'global' ||
                (a.locationType === 'local' && this.userLocation)
            );
            
            this.currentMission = localMissions[Math.floor(Math.random() * localMissions.length)];
            
            if (this.currentMission) {
                reveal.classList.add('show');
                this.displayAssignment();
            } else {
                alert('No assignments available for your parameters. Try a different duration.');
                this.requestNewAssignment();
            }
        }, 1500);
    }

    displayAssignment() {
        const headerEl = document.getElementById('missionHeader');
        const contentEl = document.getElementById('assignmentContent');
        const detailsEl = document.getElementById('missionDetails');
        
        headerEl.textContent = `ASSIGNMENT BRIEFING - ${this.currentMission.classification}`;
        contentEl.textContent = this.currentMission.description;
        
        const durationText = this.currentMission.duration || this.getDurationText(this.currentMission.scale);
        
        detailsEl.innerHTML = `
            <div class="detail-item">OBJECTIVE: ${this.currentMission.objective}</div>
            <div class="detail-item">DURATION: ${durationText}</div>
            <div class="detail-item">LOCATION: ${this.currentMission.locationType?.toUpperCase()}</div>
            <div class="detail-item">CLEARANCE: UNCLASSIFIED</div>
        `;
        
        // Reset and trigger animations
        this.resetAnimations();
        setTimeout(() => headerEl.classList.add('animate'), 200);
        setTimeout(() => contentEl.classList.add('animate'), 700);
        setTimeout(() => detailsEl.classList.add('animate'), 1200);
        setTimeout(() => document.querySelector('.action-controls').classList.add('animate'), 1700);
    }

    getDurationText(scale) {
        const durations = {
            quick: '5-20 minutes',
            medium: 'Week to Month',
            deep: 'Lifetime commitment'
        };
        return durations[scale] || 'Variable';
    }

    acceptMission() {
        if (this.currentMission) {
            // Increment agent count
            const assignment = this.assignments.find(a => a.id === this.currentMission.id);
            if (assignment) {
                assignment.agents = (assignment.agents || 0) + 1;
                this.saveAssignments();
            }
            
            alert(`ASSIGNMENT ACCEPTED\n\nAssignment ID: ${this.currentMission.id}\nClassification: ${this.currentMission.classification}\n\nConnecting to support systems and fellow agents...`);
        }
    }

    requestNewAssignment() {
        const reveal = document.getElementById('assignmentReveal');
        reveal.classList.remove('show');
        
        setTimeout(() => {
            const splash = document.getElementById('splashScreen');
            splash.classList.remove('hidden');
            this.resetAnimations();
        }, 1500);
    }

    accessFullSystem() {
        const reveal = document.getElementById('assignmentReveal');
        const platform = document.getElementById('platformView');
        
        reveal.classList.remove('show');
        setTimeout(() => {
            platform.classList.add('show');
            this.renderAssignments();
            this.updateStats();
        }, 1500);
    }

    returnToBase() {
        const platform = document.getElementById('platformView');
        const splash = document.getElementById('splashScreen');
        
        platform.classList.remove('show');
        setTimeout(() => {
            splash.classList.remove('hidden');
            this.resetAnimations();
        }, 1500);
    }

    resetAnimations() {
        const elements = [
            document.getElementById('missionHeader'),
            document.getElementById('assignmentContent'),
            document.getElementById('missionDetails'),
            document.querySelector('.action-controls')
        ];
        
        elements.forEach(el => {
            if (el) el.classList.remove('animate');
        });
    }

    renderAssignments() {
        const grid = document.getElementById('assignmentGrid');
        const filtered = this.currentFilter === 'all' 
            ? this.assignments 
            : this.assignments.filter(a => a.scale === this.currentFilter);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>NO MISSIONS IN THIS CATEGORY</h3>
                    <p>Be the first to submit a mission</p>
                    <button class="control-btn" onclick="document.getElementById('addAssignmentBtn').click()">
                        SUBMIT MISSION
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(assignment => `
            <div class="assignment-card ${assignment.scale}" onclick="assignmentManager.viewAssignment('${assignment.id}')">
                <h3 class="assignment-title">${this.escapeHtml(assignment.title)}</h3>
                <span class="assignment-classification">
                    ${assignment.classification}
                </span>
                <p class="assignment-description">
                    ${this.escapeHtml(assignment.description.substring(0, 150))}${assignment.description.length > 150 ? '...' : ''}
                </p>
                <div class="assignment-meta">
                    <div class="commander-info">
                        CMD: ${this.escapeHtml(assignment.commander?.name || 'Unknown')}
                    </div>
                    <div class="assignment-stats">
                        <span title="Active Agents">⚡ ${assignment.agents || 0}</span>
                        <span title="Completed">✓ ${assignment.completed || 0}</span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    viewAssignment(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (!assignment) return;

        const modal = document.getElementById('viewModal');
        const details = document.getElementById('assignmentDetails');

        details.innerHTML = `
            <h2>${this.escapeHtml(assignment.title)}</h2>
            <span class="assignment-classification">
                ${assignment.classification}
            </span>
            
            <p style="margin: 1.5rem 0; line-height: 1.6; color: var(--terminal-green);">
                ${this.escapeHtml(assignment.description)}
            </p>

            <div class="mission-details" style="position: static; opacity: 1; transform: none;">
                <div class="detail-item">OBJECTIVE: ${this.escapeHtml(assignment.objective)}</div>
                <div class="detail-item">DURATION: ${assignment.duration || this.getDurationText(assignment.scale)}</div>
                <div class="detail-item">LOCATION: ${assignment.locationType?.toUpperCase()}</div>
                <div class="detail-item">AGENTS: ${assignment.agents || 0}</div>
            </div>

            ${assignment.skillsRequired && assignment.skillsRequired.length > 0 ? `
                <div style="margin: 1rem 0;">
                    <strong>SKILLS REQUIRED:</strong> ${assignment.skillsRequired.map(skill => 
                        `<span class="detail-item" style="display: inline-block; margin: 0.25rem; padding: 0.5rem;">${skill.toUpperCase()}</span>`
                    ).join('')}
                </div>
            ` : ''}

            <div style="margin: 2rem 0; padding: 1rem; border: 1px solid var(--terminal-green); background: rgba(0,255,0,0.05);">
                <strong>COMMANDER:</strong> ${this.escapeHtml(assignment.commander?.name || 'System')}<br>
                <strong>BASE:</strong> ${this.escapeHtml(assignment.commander?.location || 'Global')}<br>
                <strong>ISSUED:</strong> ${new Date(assignment.date).toLocaleDateString()}<br>
                <strong>ACTIVE AGENTS:</strong> ${assignment.agents || 0}<br>
                <strong>COMPLETIONS:</strong> ${assignment.completed || 0}<br>
                <strong>VERIFICATIONS:</strong> ${assignment.verifications || 0}
            </div>

            <div class="action-controls" style="position: static; opacity: 1; transform: none; margin-top: 2rem;">
                <button class="control-btn" onclick="assignmentManager.joinMission('${id}')">
                    JOIN ASSIGNMENT
                </button>
                <button class="control-btn secondary" onclick="assignmentManager.markCompleted('${id}')">
                    MARK COMPLETED
                </button>
            </div>
        `;

        modal.style.display = 'block';
    }

    joinMission(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.agents = (assignment.agents || 0) + 1;
            this.saveAssignments();
            this.viewAssignment(id);
            this.updateStats();
            alert('ASSIGNMENT JOINED\n\nYou are now an active agent on this assignment.');
        }
    }

    markCompleted(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.completed = (assignment.completed || 0) + 1;
            this.saveAssignments();
            this.viewAssignment(id);
            this.updateStats();
            alert('ASSIGNMENT COMPLETION RECORDED\n\nThank you for your service, Agent.');
        }
    }

    submitAssignment() {
        const title = document.getElementById('assignmentTitle').value;
        const description = document.getElementById('assignmentDescription').value;
        const objective = document.getElementById('assignmentObjective').value;
        const scale = document.getElementById('assignmentScale').value;
        const classification = document.getElementById('assignmentClassification').value;
        const locationType = document.getElementById('locationType').value;
        const skills = document.getElementById('assignmentTags').value
            .split(',')
            .map(skill => skill.trim())
            .filter(skill => skill);
        const commanderName = document.getElementById('contributorName').value || 'Anonymous Commander';
        const commanderLocation = document.getElementById('contributorLocation').value || 'Undisclosed';

        const newAssignment = {
            id: this.generateId(),
            title,
            description,
            objective,
            scale,
            classification,
            locationType,
            skillsRequired: skills,
            commander: {
                name: commanderName,
                location: commanderLocation
            },
            date: new Date().toISOString(),
            agents: 1,
            completed: 0,
            verifications: 0,
            contributions: []
        };

        this.assignments.unshift(newAssignment);
        this.saveAssignments();
        this.renderAssignments();
        this.updateStats();
        
        alert('ASSIGNMENT SUBMITTED\n\nYour assignment has been added to the global database.');
    }

    updateStats() {
        const totalAssignments = this.assignments.length;
        const totalAgents = this.assignments.reduce((sum, a) => sum + (a.agents || 0), 0);
        const totalCompleted = this.assignments.reduce((sum, a) => sum + (a.completed || 0), 0);
        const totalImpact = Math.floor(totalAgents * 1.5 + totalCompleted * 10);

        document.getElementById('totalAssignments').textContent = totalAssignments;
        document.getElementById('totalAgents').textContent = totalAgents;
        document.getElementById('totalCompleted').textContent = totalCompleted;
        document.getElementById('totalImpact').textContent = totalImpact;
    }

    loadAssignments() {
        const stored = localStorage.getItem('assignmentHumanMissions');
        return stored ? JSON.parse(stored) : [];
    }

    saveAssignments() {
        localStorage.setItem('assignmentHumanMissions', JSON.stringify(this.assignments));
    }

    generateId() {
        return 'AH-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).substr(2, 5).toUpperCase();
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize the application
let assignmentManager;
document.addEventListener('DOMContentLoaded', () => {
    assignmentManager = new AssignmentManager();
});