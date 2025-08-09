// Assignment data from Claude online enhanced with additional fields
const assignmentData = {
    quick: [
        {
            title: "Deploy Micro-Positivity Protocol",
            description: "Leave a handwritten note of encouragement in a public place where someone will find it today.",
            objective: "Deploy micro-positivity",
            classification: "SOCIAL IMPACT",
            duration: "5 minutes",
            locationType: "local",
            skillsRequired: []
        },
        {
            title: "Knowledge Distribution Mission",
            description: "Research one fact about renewable energy and share it with someone who doesn't know it.",
            objective: "Spread critical knowledge",
            classification: "EDUCATION",
            duration: "10 minutes",
            locationType: "virtual",
            skillsRequired: []
        },
        {
            title: "Environmental Restoration Task",
            description: "Pick up 10 pieces of trash that aren't yours and dispose of them properly.",
            objective: "Environmental restoration",
            classification: "PLANET CARE",
            duration: "5 minutes",
            locationType: "local",
            skillsRequired: []
        },
        {
            title: "Cultural Bridge Protocol",
            description: "Learn how to say 'thank you' in three languages you don't speak and use them today.",
            objective: "Cultural connection",
            classification: "SOCIAL IMPACT",
            duration: "15 minutes",
            locationType: "virtual",
            skillsRequired: []
        },
        {
            title: "Beauty Amplification Mission",
            description: "Take a photo of something beautiful in your area and share the location with a stranger online.",
            objective: "Beauty distribution",
            classification: "CULTURAL",
            duration: "10 minutes",
            locationType: "local",
            skillsRequired: ["photography"]
        },
        {
            title: "Kindness Multiplication Task",
            description: "Pay for the coffee/meal of the person behind you in line without them knowing.",
            objective: "Anonymous kindness",
            classification: "SOCIAL IMPACT",
            duration: "5 minutes",
            locationType: "local",
            skillsRequired: []
        },
        {
            title: "Memory Preservation Protocol",
            description: "Call an elder and ask them to share one story from their youth. Write it down.",
            objective: "Preserve human history",
            classification: "CULTURAL",
            duration: "20 minutes",
            locationType: "virtual",
            skillsRequired: []
        },
        {
            title: "Skill Transfer Initiative",
            description: "Teach someone one keyboard shortcut that will save them time every day.",
            objective: "Efficiency propagation",
            classification: "EDUCATION",
            duration: "5 minutes",
            locationType: "local",
            skillsRequired: ["basic computer"]
        },
        {
            title: "Gratitude Deployment",
            description: "Send a message to someone who helped you in the past, thanking them specifically.",
            objective: "Acknowledge impact",
            classification: "SOCIAL IMPACT",
            duration: "10 minutes",
            locationType: "virtual",
            skillsRequired: []
        },
        {
            title: "Local Discovery Mission",
            description: "Find one interesting fact about your neighborhood's history and share it with a neighbor.",
            objective: "Community knowledge",
            classification: "COMMUNITY BUILDING",
            duration: "15 minutes",
            locationType: "local",
            skillsRequired: []
        }
    ],
    medium: [
        {
            title: "Community Story Archive",
            description: "Document a local business owner's story and share it to help their community visibility.",
            objective: "Economic ecosystem support",
            classification: "COMMUNITY BUILDING",
            duration: "3-5 days",
            locationType: "local",
            skillsRequired: ["writing", "interviewing"]
        },
        {
            title: "Knowledge Transfer Protocol",
            description: "Teach one person a valuable skill you possess through a hands-on session this week.",
            objective: "Skill distribution",
            classification: "EDUCATION",
            duration: "One week",
            locationType: "local",
            skillsRequired: []
        },
        {
            title: "Network Amplification Mission",
            description: "Connect two people in your network who should collaborate but don't know each other.",
            objective: "Network optimization",
            classification: "SOCIAL IMPACT",
            duration: "This week",
            locationType: "virtual",
            skillsRequired: ["networking"]
        },
        {
            title: "Resource Creation Initiative",
            description: "Create a free guide or tutorial for something you know well and publish it online.",
            objective: "Knowledge democratization",
            classification: "EDUCATION",
            duration: "Two weeks",
            locationType: "virtual",
            skillsRequired: ["writing", "subject expertise"]
        },
        {
            title: "Local Problem Documentation",
            description: "Identify and document three problems in your community with proposed solutions.",
            objective: "Problem visibility",
            classification: "COMMUNITY BUILDING",
            duration: "One week",
            locationType: "local",
            skillsRequired: ["observation", "analysis"]
        },
        {
            title: "Intergenerational Bridge",
            description: "Organize a skill exchange between young and old people in your community.",
            objective: "Age connection",
            classification: "SOCIAL IMPACT",
            duration: "One month",
            locationType: "local",
            skillsRequired: ["organizing", "communication"]
        },
        {
            title: "Digital Literacy Mission",
            description: "Help five people set up password managers and explain digital security basics.",
            objective: "Security propagation",
            classification: "EDUCATION",
            duration: "Two weeks",
            locationType: "local",
            skillsRequired: ["technology", "teaching"]
        },
        {
            title: "Food Waste Reduction Protocol",
            description: "Start a food sharing system in your building or neighborhood to reduce waste.",
            objective: "Resource optimization",
            classification: "PLANET CARE",
            duration: "One month",
            locationType: "local",
            skillsRequired: ["organizing"]
        },
        {
            title: "Local Art Amplification",
            description: "Document and promote five local artists through social media or a blog.",
            objective: "Cultural support",
            classification: "CULTURAL",
            duration: "Three weeks",
            locationType: "local",
            skillsRequired: ["writing", "photography", "social media"]
        },
        {
            title: "Emergency Preparedness Network",
            description: "Create an emergency contact and resource list for your immediate neighbors.",
            objective: "Community resilience",
            classification: "COMMUNITY BUILDING",
            duration: "One week",
            locationType: "local",
            skillsRequired: ["organizing", "communication"]
        }
    ],
    deep: [
        {
            title: "Carbon Neutral Neighborhood",
            description: "Design a comprehensive plan for your neighborhood to become carbon neutral within 5 years.",
            objective: "Climate intervention system",
            classification: "PLANET CARE",
            duration: "Multi-year project",
            locationType: "local",
            skillsRequired: ["research", "planning", "community organizing"]
        },
        {
            title: "Knowledge Preservation Protocol",
            description: "Create an open-source educational resource that preserves important knowledge for future generations.",
            objective: "Knowledge preservation",
            classification: "SPECIES ADVANCEMENT",
            duration: "Ongoing mission",
            locationType: "global",
            skillsRequired: ["subject expertise", "writing", "digital archiving"]
        },
        {
            title: "Sustainable Space Exploration",
            description: "Research and develop a solution for sustainable space exploration that doesn't harm Earth's environment.",
            objective: "Expansion without destruction",
            classification: "SPECIES ADVANCEMENT",
            duration: "Lifetime commitment",
            locationType: "global",
            skillsRequired: ["science", "engineering", "systems thinking"]
        },
        {
            title: "Universal Basic Services Framework",
            description: "Design a scalable system for providing basic services (food, shelter, healthcare, education) to all humans.",
            objective: "Human baseline elevation",
            classification: "SPECIES ADVANCEMENT",
            duration: "Lifetime project",
            locationType: "global",
            skillsRequired: ["economics", "policy", "systems design"]
        },
        {
            title: "Biodiversity Restoration Initiative",
            description: "Create and implement a plan to restore biodiversity in a damaged ecosystem near you.",
            objective: "Ecosystem restoration",
            classification: "PLANET CARE",
            duration: "5-10 years",
            locationType: "regional",
            skillsRequired: ["ecology", "project management", "fundraising"]
        },
        {
            title: "Intergenerational Wealth Transfer",
            description: "Design a system that ensures knowledge, skills, and resources transfer effectively between generations.",
            objective: "Generational continuity",
            classification: "SPECIES ADVANCEMENT",
            duration: "Lifetime commitment",
            locationType: "global",
            skillsRequired: ["education", "economics", "social design"]
        },
        {
            title: "Post-Scarcity Local Economy",
            description: "Build a local economic system based on abundance rather than scarcity principles.",
            objective: "Economic transformation",
            classification: "COMMUNITY BUILDING",
            duration: "10+ years",
            locationType: "local",
            skillsRequired: ["economics", "community organizing", "systems thinking"]
        },
        {
            title: "Conflict Resolution Protocol",
            description: "Develop and implement a new framework for resolving conflicts without violence at any scale.",
            objective: "Peace infrastructure",
            classification: "SPECIES ADVANCEMENT",
            duration: "Lifetime commitment",
            locationType: "global",
            skillsRequired: ["psychology", "mediation", "systems design"]
        },
        {
            title: "Ocean Cleanup Network",
            description: "Design and deploy a network of ocean cleanup systems powered by renewable energy.",
            objective: "Marine restoration",
            classification: "PLANET CARE",
            duration: "20+ years",
            locationType: "global",
            skillsRequired: ["engineering", "marine biology", "project management"]
        },
        {
            title: "Human Potential Maximization",
            description: "Create systems that help every human reach their full potential regardless of birthplace or circumstances.",
            objective: "Potential unlocking",
            classification: "SPECIES ADVANCEMENT",
            duration: "Lifetime commitment",
            locationType: "global",
            skillsRequired: ["education", "psychology", "technology", "policy"]
        }
    ]
};