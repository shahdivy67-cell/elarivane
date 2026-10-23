import { SimulatorItem, SimulatorDomain } from '../types/simulator';

// 12 Curated Master Seed Simulations with deep educational lessons
export const CURATED_MASTER_SIMULATORS: SimulatorItem[] = [
  {
    id: 'sim_prisoner_dilemma',
    title: 'The Evolution of Trust & Forgiveness',
    domain: 'game-theory',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 40,
    subtitle: 'Why tit-for-tat with forgiveness outperforms relentless retaliation in human relationships.',
    coreLesson: 'In repeated interactions, initial trust paired with clear boundaries and generous forgiveness produces higher collective prosperity than cynicism or permanent grudges.',
    philosophicalContext: 'Robert Axelrod’s famous tournaments proved that cooperative strategies thrive when players can forgive occasional missteps.',
    variables: [
      { id: 'initialTrust', name: 'Initial Trust Level', min: 0, max: 100, step: 5, defaultValue: 70, unit: '%', description: 'Willingness to start relationships openly' },
      { id: 'forgivenessRate', name: 'Forgiveness Frequency', min: 0, max: 100, step: 5, defaultValue: 80, unit: '%', description: 'Likelihood to offer another chance after a mistake' },
      { id: 'retaliationStrength', name: 'Firmness on Betrayal', min: 0, max: 100, step: 5, defaultValue: 60, unit: '%', description: 'Holding accountable without vindictiveness' }
    ],
    initialMetrics: { collectiveWellbeing: 82, exploitationRisk: 18, longTermSynergy: 88 },
    metricLabels: { collectiveWellbeing: 'Community Flourishing', exploitationRisk: 'Vulnerability to Bad Actors', longTermSynergy: 'Long-Term Synergy' },
    evaluatorFnKey: 'game-theory-trust',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 1420
  },
  {
    id: 'sim_compound_growth',
    title: 'The Quiet Magic of Compound Patience',
    domain: 'finance-patience',
    engineType: 'interactive-slider-system',
    durationMinutes: 3,
    xpReward: 35,
    subtitle: 'The counterintuitive hockey stick of sustained 1% daily improvements vs sudden bursts.',
    coreLesson: 'Immediate gratification feels exhilarating today, but imperceptible, unsexy 1% daily compounding generates vastly superior resilience over seasons.',
    philosophicalContext: 'Warren Buffett and Seneca both noted that true security is built on unhurried consistency that ordinary observers overlook.',
    variables: [
      { id: 'dailyEffort', name: 'Consistent Daily Habit', min: 0.5, max: 3.0, step: 0.1, defaultValue: 1.0, unit: '%/day', description: 'Small micro-actions taken quietly every single day' },
      { id: 'distractionTax', name: 'Attention Leakage / Scrolling', min: 0, max: 50, step: 2, defaultValue: 15, unit: '%/day', description: 'Energy dissipated into mindless feeds' },
      { id: 'timeHorizonMonths', name: 'Time Horizon', min: 3, max: 60, step: 3, defaultValue: 24, unit: 'mo', description: 'Willingness to let seeds take root without digging them up' }
    ],
    initialMetrics: { skillGrowthMultiplier: 14.8, mentalReserve: 78, freedomQuotient: 84 },
    metricLabels: { skillGrowthMultiplier: 'Capability Multiplier', mentalReserve: 'Inner Calm & Reserves', freedomQuotient: 'Sovereign Autonomy' },
    evaluatorFnKey: 'compound-patience',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 2105
  },
  {
    id: 'sim_dopamine_adaptation',
    title: 'The Dopamine Baseline & Hedonic Treadmill',
    domain: 'human-psychology',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 45,
    subtitle: 'How endless hyper-stimulating content downregulates receptors and causes anhedonia.',
    coreLesson: 'When you bombard your brain with cheap short-form stimulation, your natural baseline drops, making ordinary sunlight, books, and face-to-face talks feel boring. Abstaining resets your joy.',
    philosophicalContext: 'Neuroscience demonstrates that receptor sensitivity renormalizes within 72 hours of low-stimulation living.',
    variables: [
      { id: 'reelFrequencyHours', name: 'Fast Media Ingestion', min: 0, max: 6, step: 0.5, defaultValue: 1.5, unit: 'hrs', description: 'Rapid, algorithmically saturated video scrolling' },
      { id: 'analogPresenceHours', name: 'Analog Real-World Hours', min: 1, max: 8, step: 0.5, defaultValue: 4.5, unit: 'hrs', description: 'Walks, woodworking, cooking, conversation, and reading' },
      { id: 'sleepRestQuality', name: 'Rest & Deep Silence', min: 4, max: 10, step: 0.5, defaultValue: 7.5, unit: 'hrs', description: 'Screenless wind-down before resting' }
    ],
    initialMetrics: { baselineHappiness: 76, sensoryVibrancy: 81, cravingsResistance: 85 },
    metricLabels: { baselineHappiness: 'Sustained Mood Baseline', sensoryVibrancy: 'Appreciation of Everyday Nuances', cravingsResistance: 'Cognitive Immunity' },
    evaluatorFnKey: 'dopamine-reset',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 3340
  },
  {
    id: 'sim_tragedy_commons',
    title: 'Tragedy of the Commons & Mutual Pledges',
    domain: 'systems-ecology',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 40,
    subtitle: 'How shared pastures collapse under egoism, but regenerate under community covenants.',
    coreLesson: 'Unconstrained self-interest exhausts shared ground; Elinor Ostrom showed that localized, peer-monitored mutual agreements preserve vitality without authoritarianism.',
    philosophicalContext: 'Awarded the Nobel Prize in Economics for proving that local communities successfully self-govern shared resources.',
    variables: [
      { id: 'harvestRate', name: 'Individual Extraction Rate', min: 10, max: 100, step: 5, defaultValue: 35, unit: '%', description: 'How much each actor consumes for immediate self-gain' },
      { id: 'restorationInvestment', name: 'Reinvestment in Commons', min: 0, max: 100, step: 5, defaultValue: 55, unit: '%', description: 'Tending to soil, infrastructure, and public health' },
      { id: 'transparencyLevel', name: 'Peer Visibility & Trust', min: 10, max: 100, step: 5, defaultValue: 75, unit: '%', description: 'Clear agreements with no hidden extraction' }
    ],
    initialMetrics: { ecosystemLongevity: 91, aggregateYield: 84, stabilityIndex: 88 },
    metricLabels: { ecosystemLongevity: 'Ecosystem Longevity', aggregateYield: 'Continuous Sustainable Yield', stabilityIndex: 'Peace & Equanimity' },
    evaluatorFnKey: 'commons-stewardship',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 980
  },
  {
    id: 'sim_stoic_sphere_control',
    title: 'Epictetus’s Dichotomy of Control',
    domain: 'philosophy-ethics',
    engineType: 'choice-branching',
    durationMinutes: 3,
    xpReward: 35,
    subtitle: 'Sorting life’s tumult into what is up to you vs what is entirely outside your hands.',
    coreLesson: '90% of chronic distress arises from trying to control other people’s opinions, global events, and the past. Serenity arrives the moment you channel 100% of your energy into your own deeds.',
    philosophicalContext: 'The Enchiridion of Epictetus: "Some things are in our control and others not. Things in our control are opinion, pursuit, desire, aversion..."',
    variables: [
      { id: 'internalFocusWeight', name: 'Focus on Own Character', min: 0, max: 100, step: 5, defaultValue: 80, unit: '%', description: 'Time spent mastering reactions and virtue' },
      { id: 'externalOutcomesFixation', name: 'Fixation on Others & Luck', min: 0, max: 100, step: 5, defaultValue: 20, unit: '%', description: 'Obsessing over algorithmic likes, weather, or rumors' }
    ],
    initialMetrics: { innerFortress: 89, emotionalVolatility: 15, clarityOfAction: 92 },
    metricLabels: { innerFortress: 'Equanimity & Peace', emotionalVolatility: 'Anxious Agitation', clarityOfAction: 'Clarity of Purpose' },
    evaluatorFnKey: 'stoic-balance',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 1890
  },
  {
    id: 'sim_forest_fire_mosaic',
    title: 'Forest Fire Resilience & Controlled Burns',
    domain: 'systems-ecology',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 35,
    subtitle: 'Why total suppression of small setbacks inevitably produces catastrophic infernos.',
    coreLesson: 'Rigidly avoiding every minor failure creates fragile systems. Welcoming frequent, low-stakes friction builds anti-fragile immunity.',
    philosophicalContext: 'Nassim Taleb’s Antifragile & indigenous forestry methods: moderate perturbations keep the whole living web supple.',
    variables: [
      { id: 'smallBurnTolerance', name: 'Tolerance of Minor Discomfort', min: 0, max: 100, step: 5, defaultValue: 65, unit: '%', description: 'Allowing small, constructive failures rather than hiding them' },
      { id: 'fuelSuppressionIntensity', name: 'Overprotective Suppression', min: 0, max: 100, step: 5, defaultValue: 25, unit: '%', description: 'Attempting to keep conditions completely sterile' }
    ],
    initialMetrics: { ancientTreeSurvival: 88, catastrophicFireRisk: 14, biodiversityHealth: 91 },
    metricLabels: { ancientTreeSurvival: 'Old Growth Preservation', catastrophicFireRisk: 'Catastrophic Burn Risk', biodiversityHealth: 'Ecological Diversity' },
    evaluatorFnKey: 'antifragile-fire',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 820
  },
  {
    id: 'sim_confirmation_bias_echo',
    title: 'The Algorithmic Rabbit Hole & Echo Chambers',
    domain: 'social-dynamics',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 40,
    subtitle: 'How machine engagement funnels turn nuanced humans into dogmatic combatants.',
    coreLesson: 'Feeds optimize for outrage because rage keeps eyeballs glued to screens. Actively reading opposing viewpoints with good faith dismantles the cognitive funhouse mirror.',
    philosophicalContext: 'Jonathan Haidt’s social psychology studies on affective polarization and epistemic humility.',
    variables: [
      { id: 'algorithmCurationStrength', name: 'Feeds Automated Filtering', min: 10, max: 100, step: 5, defaultValue: 40, unit: '%', description: 'Algorithms serving only what confirms biases' },
      { id: 'crossPerspectiveCuriosity', name: 'Willingness to Read Contrary Views', min: 0, max: 100, step: 5, defaultValue: 75, unit: '%', description: 'Engaging opposing perspectives in deep charity' },
      { id: 'outrageSlowingBuffer', name: 'Cooling-off Period Before Reacting', min: 0, max: 60, step: 5, defaultValue: 30, unit: 'mins', description: 'Waiting before commenting or reposting' }
    ],
    initialMetrics: { intellectualGroundedness: 86, tribalPolarization: 19, empathyCapacity: 88 },
    metricLabels: { intellectualGroundedness: 'Epistemic Truth-Seeking', tribalPolarization: 'Tribal Hatred', empathyCapacity: 'Empathy for Human Nuance' },
    evaluatorFnKey: 'echo-chamber',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 2750
  },
  {
    id: 'sim_orbit_gravity_balance',
    title: 'Orbital Resonance: Falling Without Collapsing',
    domain: 'physics-cosmos',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 45,
    subtitle: 'The delicate equilibrium between forward momentum and gravitational pull.',
    coreLesson: 'An orbit is not a static pedestal; it is constantly falling toward the center while moving sideways fast enough never to crash. Balance is dynamic motion, not frozen stillness.',
    philosophicalContext: 'Newton’s Principia & Taoist concepts of wu wei: natural harmony is an active, ongoing reconciliation of forces.',
    variables: [
      { id: 'tangentialVelocity', name: 'Forward Momentum (Speed)', min: 10, max: 100, step: 2, defaultValue: 58, unit: 'km/s', description: 'Action-oriented drive and creative velocity' },
      { id: 'gravitationalAnchor', name: 'Rooted Anchor (Gravitational Mass)', min: 10, max: 100, step: 2, defaultValue: 60, unit: 'G', description: 'Connection to friends, ethics, and physical presence' }
    ],
    initialMetrics: { orbitalStability: 94, orbitEccentricity: 8, energyEfficiency: 90 },
    metricLabels: { orbitalStability: 'Sustained Flight Balance', orbitEccentricity: 'Chaos / Wobble', energyEfficiency: 'Graceful Energy Economy' },
    evaluatorFnKey: 'orbital-resonance',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 1320
  },
  {
    id: 'sim_sleep_architecture',
    title: 'Circadian Phase & Memory Consolidation',
    domain: 'mindful-habits',
    engineType: 'interactive-slider-system',
    durationMinutes: 3,
    xpReward: 35,
    subtitle: 'How midnight blue light dismantles slow-wave restorative neurochemistry.',
    coreLesson: 'Sleep is not an inert loss of time; it is the active hydraulic wash of metabolic waste (glymphatic system) and crystallization of what you learned today.',
    philosophicalContext: 'Dr. Matthew Walker’s neuroscience on REM dream integration and emotional regulation.',
    variables: [
      { id: 'morningSunlightMinutes', name: 'Morning Sunlight Contact', min: 0, max: 45, step: 5, defaultValue: 25, unit: 'mins', description: 'Photons setting your suprachiasmatic master clock' },
      { id: 'lateNightScreenTime', name: 'Late Night Screen Glare', min: 0, max: 180, step: 10, defaultValue: 20, unit: 'mins', description: 'High-intensity blue photons past 10 PM' },
      { id: 'caffeineCutoffHour', name: 'Last Caffeine Ingestion', min: 10, max: 22, step: 1, defaultValue: 13, unit: ':00', description: 'Hour of day for final espresso or tea' }
    ],
    initialMetrics: { deepRestorativeSleep: 88, cognitiveClarityNextDay: 92, immuneVigor: 87 },
    metricLabels: { deepRestorativeSleep: 'Slow-Wave Sleep %', cognitiveClarityNextDay: 'Morning Mental Clarity', immuneVigor: 'Immune Restoration' },
    evaluatorFnKey: 'sleep-circadian',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 3100
  },
  {
    id: 'sim_urban_walkability',
    title: 'The 15-Minute Village & Social Micro-Encounters',
    domain: 'systems-ecology',
    engineType: 'interactive-slider-system',
    durationMinutes: 4,
    xpReward: 35,
    subtitle: 'How car-dependent sprawl atomizes humans while walkable trees weave community.',
    coreLesson: 'Solitary alienation drops dramatically when daily necessities, parks, and bakeries are within a 10-minute footpaths radius. Proximity breeds spontaneous kindness.',
    philosophicalContext: 'Jane Jacobs in The Death and Life of Great American Cities: "The sidewalk ballet creates unconscious safety and trust."',
    variables: [
      { id: 'sidewalkTreeCanopy', name: 'Tree Canopy & Shaded Benches', min: 0, max: 100, step: 5, defaultValue: 70, unit: '%', description: 'Living green pedestrian infrastructure' },
      { id: 'carSpeedLimits', name: 'Pedestrian Priority vs Car Speed', min: 15, max: 60, step: 5, defaultValue: 25, unit: 'km/h', description: 'Calmed traffic streets allowing children to play' },
      { id: 'mixedUseZoning', name: 'Corner Grocery & Tea Shops', min: 10, max: 100, step: 5, defaultValue: 80, unit: '%', description: 'Blending residential and artisanal community hubs' }
    ],
    initialMetrics: { neighborCohesion: 89, physicalVitality: 84, ambientNoisePollution: 22 },
    metricLabels: { neighborCohesion: 'Community Trust & Encounters', physicalVitality: 'Daily Physical Vigor', ambientNoisePollution: 'Noise & Stress Levels' },
    evaluatorFnKey: 'urban-commons',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 1140
  },
  {
    id: 'sim_deep_work_distraction',
    title: 'Attention Fragmentation & Attentional Residue',
    domain: 'mindful-habits',
    engineType: 'interactive-slider-system',
    durationMinutes: 3,
    xpReward: 35,
    subtitle: 'Why checking a phone "for 5 seconds" burns 23 minutes of deep cognitive immersion.',
    coreLesson: 'Multitasking is a myth; you are merely suffering rapid attention residue costs. Protecting 90 continuous minutes of un-pinged craftsmanship produces masters.',
    philosophicalContext: 'Cal Newport’s Deep Work and Gloria Mark’s attention research at UC Irvine.',
    variables: [
      { id: 'notificationFrequencyPerHour', name: 'App Alerts & Vibrations', min: 0, max: 40, step: 2, defaultValue: 3, unit: '/hr', description: 'Visual & acoustic interrupts stealing presence' },
      { id: 'deepBlockMinutes', name: 'Unbroken Craft Block', min: 15, max: 120, step: 15, defaultValue: 75, unit: 'mins', description: 'Singular focus on one creative problem' },
      { id: 'phonePhysicalDistance', name: 'Phone Kept in Another Room', min: 0, max: 100, step: 10, defaultValue: 90, unit: '%', description: 'Removing the cognitive drain of resisting glances' }
    ],
    initialMetrics: { deepInsightBreakthrough: 91, mentalFatigue: 24, craftsmanshipFulfillment: 93 },
    metricLabels: { deepInsightBreakthrough: 'Breakthrough Insight Quality', mentalFatigue: 'Mental Exhaustion', craftsmanshipFulfillment: 'Flow & Craft Joy' },
    evaluatorFnKey: 'attention-residue',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 4200
  },
  {
    id: 'sim_golden_mean_virtue',
    title: 'Aristotle’s Golden Mean & The Middle Way',
    domain: 'philosophy-ethics',
    engineType: 'equilibrium-scale',
    durationMinutes: 4,
    xpReward: 40,
    subtitle: 'Finding the luminous harmonic center between paralyzing deficiency and reckless excess.',
    coreLesson: 'Courage is the Golden Mean between cowardice and recklessness. Generosity lies between stinginess and wasteful vanity. Wisdom is balance in action.',
    philosophicalContext: 'Aristotle’s Nicomachean Ethics & Buddhist Middle Path (Majjhima Patipada).',
    variables: [
      { id: 'boldActionDegree', name: 'Drive Toward Bold Action', min: 0, max: 100, step: 2, defaultValue: 52, unit: '%', description: 'Courageous initiative versus timid hesitation' },
      { id: 'humbleRestraintDegree', name: 'Circumspect Prudence', min: 0, max: 100, step: 2, defaultValue: 48, unit: '%', description: 'Patient reflection before committing' }
    ],
    initialMetrics: { trueCourageFlourishing: 95, rashFoolhardiness: 12, timidParalysis: 10 },
    metricLabels: { trueCourageFlourishing: 'Virtuous Middle Path', rashFoolhardiness: 'Rash Recklessness', timidParalysis: 'Paralyzed Hesitation' },
    evaluatorFnKey: 'aristotle-mean',
    creator: 'Alivane Wisdom Core',
    timesCompleted: 1590
  }
];

// High-speed mathematical simulation registry generator capable of serving 1,000+ interactive scenarios
// across domains with meaningful moral, scientific, and behavioral teachings.
export interface ScenarioTemplate {
  domain: SimulatorDomain;
  titlePrefixes: string[];
  subjects: string[];
  lessons: string[];
  evaluator: string;
}

const TEMPLATES: ScenarioTemplate[] = [
  {
    domain: 'human-psychology',
    titlePrefixes: ['The Threshold of', 'Deconstructing', 'Navigating', 'The Mirror of', 'Inner Balance in'],
    subjects: ['Emotional Regulation', 'Imposter Syndrome', 'Empathic Boundaries', 'Social Comparison', 'Intrinsic Motivation', 'Creative Self-Doubt', 'Patience Under Pressure', 'Perspective Reframing'],
    lessons: [
      'Your value is intrinsic; external metrics are fickle illusions that disappear when you look inward.',
      'Comparison steals today’s peace; honoring your own slow cadence fosters genuine mastery.',
      'True empathy preserves boundaries so you do not burn out trying to save ships that refuse to steer.',
      'Anxiety is energy without direction; grounding into physical breath transforms it into calm resolve.'
    ],
    evaluator: 'dopamine-reset'
  },
  {
    domain: 'systems-ecology',
    titlePrefixes: ['Dynamic Equilibrium in', 'Resilience Cycles in', 'Symbiosis Across', 'The Ripple Effect in', 'Stewardship of'],
    subjects: ['Riparian Watersheds', 'Coral Reef Diversity', 'Subterranean Fungal Hyphae', 'Prairie Topsoil Regeneration', 'Keystone Species Webs', 'Urban Pollinator Corridors', 'Perennial Permaculture'],
    lessons: [
      'Healthy systems welcome self-regulating feedback loops; monocultures invite collapse.',
      'Taking care of the understory roots is 100x more fruitful than only decorating the upper leaves.',
      'Reciprocity between species creates resilience that no individual can achieve alone.',
      'Small localized sanctuaries accumulate into regional vitality when connected by unpolluted corridors.'
    ],
    evaluator: 'commons-stewardship'
  },
  {
    domain: 'game-theory',
    titlePrefixes: ['Strategic Equilibrium in', 'Iterated Cooperation in', 'Zero-Sum vs Non-Zero in', 'Pacts of Trust in'],
    subjects: ['Public Goods Funding', 'Scientific Collaboration', 'Shared Resource Negotiation', 'Community Barter Circles', 'Diplomatic De-escalation', 'Peer Review Honesty'],
    lessons: [
      'Treating every interaction as win-win cultivates compounding social wealth.',
      'Transparency removes the incentive for opportunistic betrayal before it begins.',
      'Forgiving quickly while keeping clear boundaries keeps bad actors from spreading cynicism.',
      'Real strength is refusing to play petty zero-sum games when positive-sum horizons are available.'
    ],
    evaluator: 'game-theory-trust'
  },
  {
    domain: 'physics-cosmos',
    titlePrefixes: ['Harmonic Frequency of', 'Entropy and Order in', 'Gravitational Dynamics in', 'Quantum Coherence in', 'Thermodynamic Grace in'],
    subjects: ['Pendulum Resonance', 'Stellar Fusion Life Cycles', 'Fluid Convection Waves', 'Atmospheric Light Scattering', 'Lagrange Point Equilibrium', 'Acoustic Standing Waves'],
    lessons: [
      'Structure arises through the patient dissipation of energy; order requires constant intentional care.',
      'Every action creates resonance far beyond its point of origin; choose what frequency you broadcast.',
      'Stability in nature is dynamic and responsive, never brittle or permanently locked.',
      'Light travels through vast darkness without diminishing its speed or purity.'
    ],
    evaluator: 'orbital-resonance'
  },
  {
    domain: 'mindful-habits',
    titlePrefixes: ['Quiet Architecture of', 'Ritual Integrity in', 'The Sacred Rhythm of', 'Sanctuary Design for', 'Untangling'],
    subjects: ['Morning Solitude', 'Evening Screenless Sunset', 'Mindful Tea Brewing', 'Analog Journaling', 'Silent Meal Contemplation', 'Digital Fasting Weekends', 'Walking Meditation'],
    lessons: [
      'Creating space before reacting is the birthplace of freedom and dignity.',
      'A simple routine executed without a screen anchors the nervous system like deep roots.',
      'Silence is not emptiness; it is the presence of your own uncluttered awareness.',
      'Doing one thing at a time with full devotion turns ordinary chores into restorative meditation.'
    ],
    evaluator: 'attention-residue'
  },
  {
    domain: 'finance-patience',
    titlePrefixes: ['The Long View of', 'Frugality and Wealth in', 'Sovereign Reserves in', 'Resisting The Urge in'],
    subjects: ['Emergency Nest Eggs', 'Minimalist Wardrobe Economics', 'Repairing Over Buying', 'Compound Dividend Reinvestment', 'Value-Aligned Spending', 'Debt-Free Liberation'],
    lessons: [
      'True wealth is the ability to say "I have enough" and sleep in tranquility.',
      'Buying things to impress people you do not respect is a trap that trades freedom for trinkets.',
      'Patient capital weathers storms; speculative greed drowns at the first high tide.',
      'The greatest return on investment is time with people you love and peace of mind.'
    ],
    evaluator: 'compound-patience'
  },
  {
    domain: 'philosophy-ethics',
    titlePrefixes: ['Socratic Inquiry into', 'The Tao of', 'Marcus Aurelius on', 'The Stoic Citadel of', 'Kantian Reflection on'],
    subjects: ['Integrity Under Secrecy', 'Grace in Misfortune', 'Universal Duty of Kindness', 'Wabi-Sabi Brokenness', 'The Fragility of Fame', 'Forgiving Historical Injury'],
    lessons: [
      'What hurts the beehive hurts the bee; your well-being is inseparable from collective humanity.',
      'Character is what you do when nobody is looking and no algorithm rewards you.',
      'Things do not upset us; our unexamined judgments about things upset us.',
      'Imperfection and weathering give a vessel its soul; do not seek glossy sterility.'
    ],
    evaluator: 'stoic-balance'
  },
  {
    domain: 'social-dynamics',
    titlePrefixes: ['The Human Tapestry of', 'Active Listening in', 'De-escalation in', 'Authentic Presence in'],
    subjects: ['Generational Conversations', 'Disagreement Without Contempt', 'Neighborhood Banter', 'Healing Fractured Friendships', 'Vulnerability in Community'],
    lessons: [
      'Listening to understand rather than to counter-attack disarms defensiveness instantly.',
      'Contempt is toxic to the human heart; curiosity is its sovereign antidote.',
      'Real presence requires putting the phone away and looking into someone’s eyes.',
      'Shared laughter over simple meals binds communities deeper than any political doctrine.'
    ],
    evaluator: 'echo-chamber'
  }
];

// Algorithmic generator producing 1,024 educational simulations on demand
export function generateEcosystemSimulators(): SimulatorItem[] {
  const result: SimulatorItem[] = [...CURATED_MASTER_SIMULATORS];
  let idCounter = 1;

  // Generate 128 items per domain template (8 * 128 = 1,024 simulations)
  TEMPLATES.forEach(tmpl => {
    for (let i = 0; i < 128; i++) {
      const prefix = tmpl.titlePrefixes[i % tmpl.titlePrefixes.length];
      const subject = tmpl.subjects[(i * 3 + 1) % tmpl.subjects.length];
      const variationNum = Math.floor(i / tmpl.subjects.length) + 1;
      const title = `${prefix} ${subject} ${variationNum > 1 ? `(Vol. ${variationNum})` : ''}`;
      const coreLesson = tmpl.lessons[i % tmpl.lessons.length];

      result.push({
        id: `sim_gen_${tmpl.domain}_${idCounter++}`,
        title,
        domain: tmpl.domain,
        engineType: 'interactive-slider-system',
        durationMinutes: 3 + (i % 3),
        xpReward: 30 + ((i * 5) % 25),
        subtitle: `An interactive model illuminating how ${subject.toLowerCase()} behaves across time and pressure.`,
        coreLesson,
        philosophicalContext: `Explored through dynamic systems modeling to cultivate ${tmpl.domain.replace('-', ' ')} wisdom.`,
        variables: [
          {
            id: 'primaryLever',
            name: `${subject.split(' ')[0]} Intentionality`,
            min: 0,
            max: 100,
            step: 5,
            defaultValue: 50 + (i % 25),
            unit: '%',
            description: `Level of conscious, deliberate effort applied to ${subject.toLowerCase()}.`
          },
          {
            id: 'distractionResistance',
            name: 'Distraction Immunity',
            min: 0,
            max: 100,
            step: 5,
            defaultValue: 60,
            unit: '%',
            description: 'Shielding the experiment from compulsive digital interruptions.'
          },
          {
            id: 'patienceHorizon',
            name: 'Patience & Reinvestment',
            min: 1,
            max: 36,
            step: 1,
            defaultValue: 12 + (i % 12),
            unit: 'mo',
            description: 'Allowing natural growth cycles to unfold without forcing premature results.'
          }
        ],
        initialMetrics: {
          systemicHarmony: 75 + (i % 20),
          frictionVulnerability: 25 - (i % 15),
          insightMaturity: 80 + (i % 18)
        },
        metricLabels: {
          systemicHarmony: 'Harmonic Equilibrium',
          frictionVulnerability: 'Friction Vulnerability',
          insightMaturity: 'Deep Insight & Integration'
        },
        evaluatorFnKey: tmpl.evaluator,
        creator: 'Alivane Wisdom Core',
        timesCompleted: 100 + ((i * 83) % 900)
      });
    }
  });

  return result;
}
