-- Seed data for Assignment Human database
-- Run this after creating the schema

-- Insert sample assignments from our existing data
INSERT INTO assignments (
    title,
    description,
    objective,
    classification,
    duration_type,
    duration_estimate,
    scale,
    location_type,
    skills_required,
    commander_name,
    commander_location,
    is_active,
    is_verified
) VALUES 
-- Quick Assignments (5-20 minutes)
(
    'Deploy Micro-Positivity Protocol',
    'Leave a handwritten note of encouragement in a public place where someone will find it today.',
    'Deploy micro-positivity',
    'SOCIAL IMPACT',
    'quick',
    '5 minutes',
    'personal',
    'local',
    '{}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Knowledge Distribution Mission',
    'Research one fact about renewable energy and share it with someone who doesn''t know it.',
    'Spread critical knowledge',
    'EDUCATION',
    'quick',
    '10 minutes',
    'personal',
    'virtual',
    '{}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Environmental Restoration Task',
    'Pick up 10 pieces of trash that aren''t yours and dispose of them properly.',
    'Environmental restoration',
    'PLANET CARE',
    'quick',
    '5 minutes',
    'community',
    'local',
    '{}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Cultural Bridge Protocol',
    'Learn how to say "thank you" in three languages you don''t speak and use them today.',
    'Cultural connection',
    'SOCIAL IMPACT',
    'quick',
    '15 minutes',
    'personal',
    'virtual',
    '{}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Beauty Amplification Mission',
    'Take a photo of something beautiful in your area and share the location with a stranger online.',
    'Beauty distribution',
    'CULTURAL',
    'quick',
    '10 minutes',
    'community',
    'local',
    '{"photography"}',
    'System',
    'Global Command',
    true,
    true
),

-- Medium Assignments (1 week - 1 month)
(
    'Community Story Archive',
    'Document a local business owner''s story and share it to help their community visibility.',
    'Economic ecosystem support',
    'COMMUNITY BUILDING',
    'medium',
    '3-5 days',
    'community',
    'local',
    '{"writing", "interviewing"}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Knowledge Transfer Protocol',
    'Teach one person a valuable skill you possess through a hands-on session this week.',
    'Skill distribution',
    'EDUCATION',
    'medium',
    'One week',
    'community',
    'local',
    '{"teaching"}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Network Amplification Mission',
    'Connect two people in your network who should collaborate but don''t know each other.',
    'Network optimization',
    'SOCIAL IMPACT',
    'medium',
    'This week',
    'community',
    'virtual',
    '{"networking"}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Local Problem Documentation',
    'Identify and document three problems in your community with proposed solutions.',
    'Problem visibility',
    'COMMUNITY BUILDING',
    'medium',
    'One week',
    'community',
    'local',
    '{"observation", "analysis"}',
    'System',
    'Global Command',
    true,
    true
),

-- Deep Assignments (Lifetime commitments)
(
    'Carbon Neutral Neighborhood',
    'Design a comprehensive plan for your neighborhood to become carbon neutral within 5 years.',
    'Climate intervention system',
    'PLANET CARE',
    'deep',
    'Multi-year project',
    'regional',
    'local',
    '{"research", "planning", "community organizing"}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Knowledge Preservation Protocol',
    'Create an open-source educational resource that preserves important knowledge for future generations.',
    'Knowledge preservation',
    'SPECIES ADVANCEMENT',
    'deep',
    'Ongoing mission',
    'species',
    'global',
    '{"subject expertise", "writing", "digital archiving"}',
    'System',
    'Global Command',
    true,
    true
),
(
    'Universal Basic Services Framework',
    'Design a scalable system for providing basic services (food, shelter, healthcare, education) to all humans.',
    'Human baseline elevation',
    'SPECIES ADVANCEMENT',
    'deep',
    'Lifetime project',
    'species',
    'global',
    '{"economics", "policy", "systems design"}',
    'System',
    'Global Command',
    true,
    true
);

-- Insert sample missions (collections of assignments)
INSERT INTO missions (
    name,
    description,
    objective,
    classification,
    duration_estimate,
    min_assignments_to_complete,
    is_active,
    is_featured
) VALUES
(
    '30-Day Kindness Mission',
    'Complete one act of kindness every day for 30 days to build a habit of positivity.',
    'Build kindness habits',
    'SOCIAL IMPACT',
    '30 days',
    20,
    true,
    true
),
(
    'Digital Literacy Campaign',
    'Help bridge the digital divide by teaching essential tech skills to those who need them.',
    'Reduce digital inequality',
    'EDUCATION',
    '3 months',
    10,
    true,
    true
),
(
    'Local Climate Action',
    'Take concrete steps to reduce carbon footprint in your community.',
    'Community carbon reduction',
    'PLANET CARE',
    '6 months',
    15,
    true,
    false
);

-- Insert sample teams
INSERT INTO teams (
    name,
    description,
    mission_focus,
    location_base,
    member_count,
    total_completions,
    is_public
) VALUES
(
    'Chicago Climate Collective',
    'Working together to make Chicago carbon neutral by 2030',
    'PLANET CARE',
    'Chicago, IL',
    42,
    156,
    true
),
(
    'Digital Bridge Brigade',
    'Teaching digital skills to seniors and underserved communities',
    'EDUCATION',
    'Global',
    128,
    892,
    true
),
(
    'Random Acts Squad',
    'Spreading unexpected kindness everywhere we go',
    'SOCIAL IMPACT',
    'Global',
    2341,
    15234,
    true
);

-- Insert a sample operation
INSERT INTO operations (
    code_name,
    description,
    objective,
    start_date,
    end_date,
    target_participants,
    target_completions,
    is_active
) VALUES
(
    'SPRING_RENEWAL_2024',
    'Global coordinated effort to clean and beautify communities as spring arrives',
    'Clean 10,000 neighborhoods worldwide',
    '2024-03-20',
    '2024-04-20',
    50000,
    100000,
    false
);