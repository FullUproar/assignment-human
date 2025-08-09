class AssignmentManager {
    constructor() {
        this.assignments = this.loadAssignments();
        this.currentFilter = 'all';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadSampleAssignments();
        this.renderAssignments();
        this.updateStats();
    }

    setupEventListeners() {
        // Navigation filters
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

        // Add assignment modal
        const addModal = document.getElementById('addModal');
        const viewModal = document.getElementById('viewModal');
        const addBtn = document.getElementById('addAssignmentBtn');
        const closeBtns = document.querySelectorAll('.close');

        addBtn.addEventListener('click', () => {
            addModal.style.display = 'block';
        });

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
            this.addAssignment();
            addModal.style.display = 'none';
            e.target.reset();
        });
    }

    loadSampleAssignments() {
        if (this.assignments.length === 0) {
            const samples = [
                {
                    id: this.generateId(),
                    title: "Nature Photography Walk",
                    description: "Take a 30-minute walk in your neighborhood or local park. Find and photograph 5 different types of wildflowers, plants, or interesting natural patterns. Share your photos to inspire others to notice the beauty around them.",
                    scale: "micro",
                    tags: ["nature", "photography", "mindfulness"],
                    contributor: { name: "Sarah Chen", location: "Portland, OR" },
                    date: new Date().toISOString(),
                    contributors: 42,
                    completed: 28,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Community Garden Initiative",
                    description: "Start or join a community garden in your area. Transform unused urban spaces into productive green areas where neighbors can grow food together, share knowledge, and build stronger community bonds.",
                    scale: "project",
                    tags: ["community", "sustainability", "food", "urban"],
                    contributor: { name: "Marcus Johnson", location: "Detroit, MI" },
                    date: new Date().toISOString(),
                    contributors: 156,
                    completed: 3,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Ocean Cleanup Technology Network",
                    description: "Develop and deploy a global network of autonomous ocean cleanup vessels powered by renewable energy. Create an international collaboration platform for engineers, marine biologists, and environmentalists to design, build, and operate systems that can remove plastic and other pollutants from our oceans.",
                    scale: "dream",
                    tags: ["ocean", "technology", "environment", "global"],
                    contributor: { name: "Dr. Yuki Tanaka", location: "Tokyo, Japan" },
                    date: new Date().toISOString(),
                    contributors: 1420,
                    completed: 0,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Random Acts of Kindness Day",
                    description: "Perform 3 random acts of kindness today: hold a door, pay for someone's coffee, leave an encouraging note, or help someone with their groceries. Small gestures that brighten someone's day.",
                    scale: "micro",
                    tags: ["kindness", "community", "daily"],
                    contributor: { name: "Emma Wilson", location: "London, UK" },
                    date: new Date().toISOString(),
                    contributors: 234,
                    completed: 189,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Sustainable Farming Co-op",
                    description: "Establish a cooperative farm that uses permaculture principles, renewable energy, and water conservation techniques. Create a model for sustainable food production that can be replicated in communities worldwide.",
                    scale: "project",
                    tags: ["farming", "sustainability", "cooperative", "food"],
                    contributor: { name: "Carlos Rodriguez", location: "Austin, TX" },
                    date: new Date().toISOString(),
                    contributors: 89,
                    completed: 1,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Global Seed Vault Network",
                    description: "Create a decentralized network of seed vaults around the world to preserve biodiversity and protect our agricultural heritage. Each vault would store native and heirloom varieties, creating resilience against climate change and ensuring food security for future generations.",
                    scale: "dream",
                    tags: ["biodiversity", "agriculture", "future", "global"],
                    contributor: { name: "Dr. Amara Okonkwo", location: "Lagos, Nigeria" },
                    date: new Date().toISOString(),
                    contributors: 3250,
                    completed: 0,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Teach Someone Something New",
                    description: "Share a skill you have with someone today. It could be cooking a recipe, fixing something, using software, or any knowledge you possess. Spend 30 minutes passing on something valuable.",
                    scale: "micro",
                    tags: ["education", "sharing", "skills"],
                    contributor: { name: "Alex Kim", location: "Vancouver, Canada" },
                    date: new Date().toISOString(),
                    contributors: 567,
                    completed: 423,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Lunar Habitat Research Station",
                    description: "Design and build a self-sustaining habitat on the Moon that can support human life for extended periods. Develop closed-loop life support systems, lunar agriculture, and resource extraction technologies to create humanity's first permanent off-world settlement.",
                    scale: "dream",
                    tags: ["space", "technology", "future", "exploration"],
                    contributor: { name: "Dr. Raj Patel", location: "Mumbai, India" },
                    date: new Date().toISOString(),
                    contributors: 8970,
                    completed: 0,
                    contributions: []
                },
                {
                    id: this.generateId(),
                    title: "Great Barrier Reef Bio-Ark",
                    description: "Create a massive conservation facility in the Australian Outback designed to preserve and cultivate coral species from the Great Barrier Reef. This bio-ark would maintain optimal conditions for coral growth and serve as a genetic repository to restore reef ecosystems as ocean conditions improve.",
                    scale: "dream",
                    tags: ["conservation", "marine", "climate", "australia"],
                    contributor: { name: "Dr. Sophie Anderson", location: "Brisbane, Australia" },
                    date: new Date().toISOString(),
                    contributors: 5420,
                    completed: 0,
                    contributions: []
                }
            ];

            samples.forEach(sample => this.assignments.push(sample));
            this.saveAssignments();
        }
    }

    loadAssignments() {
        const stored = localStorage.getItem('humanityAssignments');
        return stored ? JSON.parse(stored) : [];
    }

    saveAssignments() {
        localStorage.setItem('humanityAssignments', JSON.stringify(this.assignments));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    addAssignment() {
        const title = document.getElementById('assignmentTitle').value;
        const description = document.getElementById('assignmentDescription').value;
        const scale = document.getElementById('assignmentScale').value;
        const tags = document.getElementById('assignmentTags').value
            .split(',')
            .map(tag => tag.trim())
            .filter(tag => tag);
        const contributorName = document.getElementById('contributorName').value || 'Anonymous';
        const contributorLocation = document.getElementById('contributorLocation').value || 'Earth';

        const newAssignment = {
            id: this.generateId(),
            title,
            description,
            scale,
            tags,
            contributor: {
                name: contributorName,
                location: contributorLocation
            },
            date: new Date().toISOString(),
            contributors: 1,
            completed: 0,
            contributions: []
        };

        this.assignments.unshift(newAssignment);
        this.saveAssignments();
        this.renderAssignments();
        this.updateStats();
    }

    renderAssignments() {
        const grid = document.getElementById('assignmentGrid');
        const filtered = this.currentFilter === 'all' 
            ? this.assignments 
            : this.assignments.filter(a => a.scale === this.currentFilter);

        if (filtered.length === 0) {
            grid.innerHTML = `
                <div class="empty-state">
                    <h3>No assignments yet in this category</h3>
                    <p>Be the first to create an assignment!</p>
                    <button class="contribute-btn" onclick="document.getElementById('addAssignmentBtn').click()">
                        Create Assignment
                    </button>
                </div>
            `;
            return;
        }

        grid.innerHTML = filtered.map(assignment => `
            <div class="assignment-card ${assignment.scale}" onclick="assignmentManager.viewAssignment('${assignment.id}')">
                <h3 class="assignment-title">${this.escapeHtml(assignment.title)}</h3>
                <span class="assignment-scale scale-${assignment.scale}">
                    ${this.getScaleLabel(assignment.scale)}
                </span>
                <p class="assignment-description">
                    ${this.escapeHtml(assignment.description.substring(0, 150))}${assignment.description.length > 150 ? '...' : ''}
                </p>
                ${assignment.tags.length > 0 ? `
                    <div class="tags">
                        ${assignment.tags.slice(0, 3).map(tag => `
                            <span class="tag">${this.escapeHtml(tag)}</span>
                        `).join('')}
                    </div>
                ` : ''}
                <div class="assignment-meta">
                    <div class="contributor-info">
                        ${this.escapeHtml(assignment.contributor.name)}
                    </div>
                    <div class="assignment-stats">
                        <span title="Contributors">👥 ${assignment.contributors}</span>
                        <span title="Completed">✓ ${assignment.completed}</span>
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
            <span class="assignment-scale scale-${assignment.scale}">
                ${this.getScaleLabel(assignment.scale)}
            </span>
            
            <p style="margin: 1rem 0; line-height: 1.6; color: var(--text-dark);">
                ${this.escapeHtml(assignment.description)}
            </p>

            ${assignment.tags.length > 0 ? `
                <div class="tags">
                    ${assignment.tags.map(tag => `
                        <span class="tag">${this.escapeHtml(tag)}</span>
                    `).join('')}
                </div>
            ` : ''}

            <div style="margin: 1.5rem 0; padding: 1rem; background: var(--bg-light); border-radius: 5px;">
                <strong>Created by:</strong> ${this.escapeHtml(assignment.contributor.name)}<br>
                <strong>Location:</strong> ${this.escapeHtml(assignment.contributor.location)}<br>
                <strong>Date:</strong> ${new Date(assignment.date).toLocaleDateString()}<br>
                <strong>Contributors:</strong> ${assignment.contributors}<br>
                <strong>Completed:</strong> ${assignment.completed}
            </div>

            <div class="contribute-section">
                <h3>Get Involved</h3>
                <p style="margin: 1rem 0; color: var(--text-light);">
                    Join this assignment by taking action, sharing ideas, or collaborating with others.
                </p>
                <button class="contribute-btn" onclick="assignmentManager.markContributing('${id}')">
                    I'm Contributing!
                </button>
                <button class="contribute-btn" onclick="assignmentManager.markCompleted('${id}')">
                    Mark as Completed
                </button>
                
                <div class="contribution-form" style="margin-top: 1rem;">
                    <h4>Share Your Experience</h4>
                    <textarea id="contributionText-${id}" placeholder="Share how you're contributing or what you've learned..."></textarea>
                    <button class="submit-btn" onclick="assignmentManager.addContribution('${id}')">
                        Share Contribution
                    </button>
                </div>

                ${assignment.contributions && assignment.contributions.length > 0 ? `
                    <div class="contributions-list">
                        <h4>Community Contributions</h4>
                        ${assignment.contributions.map(contrib => `
                            <div class="contribution-item">
                                <div class="contribution-author">${this.escapeHtml(contrib.author)}</div>
                                <div class="contribution-text">${this.escapeHtml(contrib.text)}</div>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `;

        modal.style.display = 'block';
    }

    markContributing(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.contributors++;
            this.saveAssignments();
            this.viewAssignment(id);
            this.updateStats();
        }
    }

    markCompleted(id) {
        const assignment = this.assignments.find(a => a.id === id);
        if (assignment) {
            assignment.completed++;
            this.saveAssignments();
            this.viewAssignment(id);
            this.updateStats();
        }
    }

    addContribution(id) {
        const assignment = this.assignments.find(a => a.id === id);
        const textArea = document.getElementById(`contributionText-${id}`);
        
        if (assignment && textArea.value.trim()) {
            if (!assignment.contributions) {
                assignment.contributions = [];
            }
            
            assignment.contributions.unshift({
                author: 'Community Member',
                text: textArea.value.trim(),
                date: new Date().toISOString()
            });
            
            this.saveAssignments();
            this.viewAssignment(id);
        }
    }

    updateStats() {
        const totalAssignments = this.assignments.length;
        const totalContributors = this.assignments.reduce((sum, a) => sum + a.contributors, 0);
        const totalCompleted = this.assignments.reduce((sum, a) => sum + a.completed, 0);

        document.getElementById('totalAssignments').textContent = totalAssignments;
        document.getElementById('totalContributors').textContent = totalContributors;
        document.getElementById('totalCompleted').textContent = totalCompleted;
    }

    getScaleLabel(scale) {
        const labels = {
            micro: 'Micro Task',
            project: 'Project',
            dream: 'Dream Scale'
        };
        return labels[scale] || scale;
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