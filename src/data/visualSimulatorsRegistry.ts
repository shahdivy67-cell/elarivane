import { SimulatorMetadata } from '../types/visualSimulator';

export const CURATED_VISUAL_SIMULATORS: SimulatorMetadata[] = [
  // 1. Arts & Crafts: Pottery Studio
  {
    id: 'sim_craft_pottery_wheel',
    title: 'The Pottery Wheel: Centering & Clay Wall Uniformity',
    category: 'arts-crafts',
    interactionType: 'pottery-wheel',
    durationMinutes: 5,
    xpReward: 60,
    subtitle: 'Wheel-throwing physical simulation of centrifugal clay shaping, wall thickness, and necking.',
    learningObjective: 'Master the relationship between wall thickness, rotational speed, and kiln collapse prevention.',
    coreLesson: 'In wheel throwing, uniform wall thickness allows even water evaporation. Centering the clay lump is 80% of the battle before shaping begins.',
    philosophicalContext: 'Daoist concepts of the vessel: the utility of the clay pot arises from the emptiness carved inside it.',
    disclaimer: 'This digital simulation teaches wall symmetry and structural concepts, but does not replace tactile physical wheel practice with wet slip.',
    version: 1,
    tags: ['pottery', 'ceramics', 'symmetry', 'craft'],
    quiz: [
      {
        id: 'q_pottery_1',
        question: 'Why must pottery walls maintain uniform thickness from rim to base prior to kiln firing?',
        options: [
          'Uniform walls ensure even moisture evaporation and prevent cracking from differential shrinkage',
          'Thicker bottoms always make the pot glaze more vibrant in oxidation kilns',
          'Uneven walls are preferred because they absorb kiln smoke faster',
          'It is purely an aesthetic convention with no structural importance'
        ],
        correctAnswerIndex: 0,
        explanation: 'As clay dries, it shrinks by 8-12%. If one section is thick and another thin, the thin part dries first, exerting mechanical tension that cracks the vessel during firing.'
      },
      {
        id: 'q_pottery_2',
        question: 'What is the most critical first step before pulling up the walls of a vessel on the wheel?',
        options: [
          'Spraying the clay with decorative yellow slip',
          'Centering the clay lump solidly in the exact rotational center of the wheel head',
          'Carving deep grooves into the outside base',
          'Spinning the wheel at maximum RPM without water'
        ],
        correctAnswerIndex: 1,
        explanation: 'If a clay lump is even slightly off-center, every revolution wobbles, making it mechanically impossible to draw up consistent, symmetrical cylinder walls.'
      },
      {
        id: 'q_pottery_3',
        question: 'What happens if a potter attempts to shape clay with completely dry hands and zero water/slip lubrication?',
        options: [
          'The vessel immediately cures and hardens into bisque ware',
          'Friction tears the clay fibers, causing the pot to grab and shear off the wheel head',
          'The clay becomes completely transparent and glazed',
          'The wheel speeds up automatically due to lack of surface friction'
        ],
        correctAnswerIndex: 1,
        explanation: 'Water provides hydrodynamic slip. Dry hands create excessive shear friction against spinning clay, ripping the delicate wall apart.'
      }
    ]
  },

  // 2. Arts & Crafts: Origami Fold Lab
  {
    id: 'sim_craft_origami_crane',
    title: 'Origami Architecture: The Orizuru Crane Fold',
    category: 'arts-crafts',
    interactionType: 'origami-fold',
    durationMinutes: 4,
    xpReward: 50,
    subtitle: 'Spatial geometry transformation from flat 2D sheet to self-supporting 3D avian form.',
    learningObjective: 'Understand how sequential mountain and valley creases lock planar paper into rigid 3D structures.',
    coreLesson: 'Imprecise early folds compound quadratically; origami teaches patience and meticulous precision at the foundational steps.',
    philosophicalContext: 'The Japanese tradition of Senbazuru (folding 1,000 cranes) as an embodied meditation of peace and deliberate care.',
    version: 1,
    tags: ['origami', 'paper', 'geometry', 'mindfulness'],
    quiz: [
      {
        id: 'q_origami_1',
        question: 'In paper folding geometry, what is the fundamental difference between a "valley fold" and a "mountain fold"?',
        options: [
          'A valley fold points concave inward toward the user; a mountain fold points convex outward like a ridge',
          'Valley folds can only be done with wet paper while mountain folds require cardstock',
          'A valley fold tears the paper fiber while a mountain fold fuses it',
          'They are identical folds with no geometric distinction'
        ],
        correctAnswerIndex: 0,
        explanation: 'Valley folds sink inward creating a crease line facing you; mountain folds form elevated ridges pointing upward.'
      },
      {
        id: 'q_origami_2',
        question: 'Why do master folders emphasize pressing creases crisp with a bone folder or thumbnail?',
        options: [
          'To stretch the cellulose fibers and change paper weight',
          'Sharp creases act as mechanical hinges, preventing cumulative spatial drift in multi-layer steps',
          'It changes the chemical dye properties of the colored paper',
          'It is only done to make the paper glossy'
        ],
        correctAnswerIndex: 1,
        explanation: 'Soft, rounded folds allow layers to slide out of alignment. Crisp creases establish rigid geometric hinge lines that maintain accuracy throughout 20+ subsequent folds.'
      },
      {
        id: 'q_origami_3',
        question: 'How has traditional origami geometry directly influenced modern space exploration engineering?',
        options: [
          'Solar panel arrays and space telescope sunshields (like JWST) fold compact for rocket launch and unfurl via origami crease patterns',
          'Astronaut suits are made of folded Japanese paper to block cosmic radiation',
          'Rocket fuel is stored in miniature folded paper origami cubes',
          'Rocket fins are folded from standard office paper'
        ],
        correctAnswerIndex: 0,
        explanation: 'The Miura-ori fold and related origami mathematics allow enormous solar arrays to collapse into tight cylinders and deploy smoothly without complex mechanical hinges.'
      }
    ]
  },

  // 3. Practical Skills: Gardening & Soil Lab
  {
    id: 'sim_gardening_soil_lab',
    title: 'Soil Ecology & Root Respiration Lab',
    category: 'practical-skills',
    interactionType: 'gardening-growth',
    durationMinutes: 5,
    xpReward: 55,
    subtitle: 'Permaculture simulation balancing soil porosity, irrigation volume, and sunlight.',
    learningObjective: 'Diagnose anaerobic root rot vs water stress and understand loam crumb structure.',
    coreLesson: 'Overwatering kills roots by drowning them in anaerobic conditions. Plant roots require microscopic soil pore air spaces to absorb nutrients.',
    philosophicalContext: 'Masanobu Fukuoka’s The One-Straw Revolution: farming with nature’s living soil rather than brute chemical forcing.',
    version: 1,
    tags: ['gardening', 'permaculture', 'soil', 'plants'],
    quiz: [
      {
        id: 'q_garden_1',
        question: 'What biological mechanism causes plants to wilt and die when overwatered in dense clay soil?',
        options: [
          'Excess water leaches chlorophyll directly out of the upper leaf stomata',
          'Waterlogged soil pores expel air, creating anaerobic conditions where roots suffocate and rot',
          'Roots absorb too much pure water and burst from mechanical water pressure',
          'Sunlight bounces off wet clay and scorches the plant stem'
        ],
        correctAnswerIndex: 1,
        explanation: 'Root cells undergo cellular respiration requiring oxygen gas. Waterlogged clay displaces all soil oxygen, leading to anaerobic root death (root rot).'
      },
      {
        id: 'q_garden_2',
        question: 'Why is "loam" considered the golden standard soil medium by organic gardeners?',
        options: [
          'It is made exclusively of powdered granite rock with zero organic matter',
          'It balances sand (drainage), silt (moisture retention), and clay (nutrient holding capacity) in ideal proportions',
          'It requires zero sunlight and never needs watering',
          'It prevents all insects from ever landing on the plant'
        ],
        correctAnswerIndex: 1,
        explanation: 'Loam (~40% sand, 40% silt, 20% clay) provides both micro-pores that retain capillary water and macro-pores that allow air circulation and root penetration.'
      },
      {
        id: 'q_garden_3',
        question: 'What is the most accurate rule of thumb for watering established potted plants?',
        options: [
          'Water heavily every single calendar day at noon regardless of soil dampness',
          'Insert a finger 2 inches into the soil; water thoroughly only when topsoil feels dry, allowing excess to drain from the pot holes',
          'Leave the pot submerged continuously in a standing bowl of stagnant tap water',
          'Only spray mist on the leaves and never add water to the soil base'
        ],
        correctAnswerIndex: 1,
        explanation: 'Checking moisture 2 inches below the surface ensures roots dry out enough to breathe between deep waterings, preventing fungal rot.'
      }
    ]
  },

  // 4. Practical Skills: Woodworking Chisel Lab
  {
    id: 'sim_woodwork_chisel_lab',
    title: 'Hardwood Chisel & Mortise Joinery Mechanics',
    category: 'practical-skills',
    interactionType: 'woodworking-chisel',
    durationMinutes: 4,
    xpReward: 50,
    subtitle: 'Understanding cutting bevels, mallet technique, and grain orientation to avoid fiber tearout.',
    learningObjective: 'Master wood grain directionality to carve clean, interlocking joinery joints.',
    coreLesson: 'Wood is not isotropic plastic; it is a bundle of parallel living straws. Cutting against the grain tears the surface, while cutting with the grain yields clean shavings.',
    philosophicalContext: 'Traditional Japanese Miya-daiku temple carpentry: building earthquake-resistant pagodas without nails by respecting wood grain.',
    version: 1,
    tags: ['woodworking', 'joinery', 'tools', 'craft'],
    quiz: [
      {
        id: 'q_wood_1',
        question: 'What happens when a carpenter cuts with a bench chisel "against the grain" angle on hardwood?',
        options: [
          'The chisel cuts twice as fast and polishes the wood surface',
          'The blade catches under wood fibers, prying and tearing out jagged chunks (tearout)',
          'The wood turns into soft sawdust without any resistance',
          'The steel blade becomes permanently magnetized'
        ],
        correctAnswerIndex: 1,
        explanation: 'Cutting into grain pointing upward causes the blade to dig beneath fibers and tear them loose rather than slicing them smoothly.'
      },
      {
        id: 'q_wood_2',
        question: 'Why is the back side of a bench chisel always honed completely flat and mirror-polished?',
        options: [
          'The flat back acts as an exact reference plane to register against the mortise wall for square cuts',
          'It is purely decorative to show the tool manufacturer’s brand',
          'To make the chisel lighter to carry in a tool belt',
          'A polished back makes the wooden handle stay tighter'
        ],
        correctAnswerIndex: 0,
        explanation: 'The back of the chisel provides the flat registration surface. If it is convex or curved, every cut will wander and produce an out-of-square joint.'
      },
      {
        id: 'q_wood_3',
        question: 'What is the primary function of a mortise and tenon joint compared to simple screws or butt joints?',
        options: [
          'It provides massive mechanical interlock and glue surface area that resists racking forces across centuries',
          'It requires zero wood and is held together purely by air pressure',
          'It can only be used on cardboard',
          'It is designed to fall apart when humidity changes'
        ],
        correctAnswerIndex: 0,
        explanation: 'Mortise and tenon joints insert a solid peg (tenon) into a cavity (mortise), locking wood fibers in shear and supporting immense multi-directional weight.'
      }
    ]
  },

  // 5. Science & Engineering: Color Theory & Optics Lab
  {
    id: 'sim_science_color_optics',
    title: 'Color Optics: Additive vs Subtractive Wavelengths',
    category: 'science-engineering',
    interactionType: 'color-optics-mixing',
    durationMinutes: 4,
    xpReward: 50,
    subtitle: 'Exploring why light beams mix to white while paint pigments blend to dark mud.',
    learningObjective: 'Differentiate between photon emission (RGB additive) and chemical photon absorption (CMY subtractive).',
    coreLesson: 'Combining colored light adds photons until you see pure white; combining paint pigments absorbs all wavelengths until only dark absorption remains.',
    philosophicalContext: 'Goethe’s Theory of Colours & Newton’s prism experiments: perception as an active dialogue between physics and the human retina.',
    version: 1,
    tags: ['physics', 'optics', 'color', 'science'],
    quiz: [
      {
        id: 'q_color_1',
        question: 'When red, green, and blue spotlight beams overlap at equal intensity on a screen, what color is produced?',
        options: [
          'Deep Black',
          'Pure White (Additive Light Fusion)',
          'Dark Olive Brown',
          'Ultraviolet'
        ],
        correctAnswerIndex: 1,
        explanation: 'In additive color mixing (RGB), wavelengths stimulate all three cone cell types in the human retina simultaneously, which the brain perceives as white light.'
      },
      {
        id: 'q_color_2',
        question: 'Why does mixing red, blue, and yellow oil paints produce muddy dark gray or brown instead of bright white?',
        options: [
          'Pigments subtract light by absorbing wavelengths; each added paint absorbs more photons until little light reflects back',
          'Paint molecules heat up and destroy the light waves',
          'Oil paint is chemically allergic to yellow light',
          'The canvas absorbs all paint within 5 seconds'
        ],
        correctAnswerIndex: 0,
        explanation: 'Physical pigments work through subtractive mixing. Red pigment absorbs green and blue; blue absorbs red and yellow. Together they absorb almost all visible light.'
      },
      {
        id: 'q_color_3',
        question: 'Why do digital screens (phones, TVs, laptops) use an RGB subpixel matrix rather than CMYK?',
        options: [
          'Screens emit photons directly outward rather than relying on reflected ambient room light',
          'RGB was patented in 1890 and cannot be replaced',
          'CMYK cannot be displayed on glass',
          'RGB is cheaper to manufacture than cyan crystals'
        ],
        correctAnswerIndex: 0,
        explanation: 'Screens are active light emitters (additive color systems). They project red, green, and blue photons directly into your eye, mixing additively into millions of colors.'
      }
    ]
  },

  // 6. Psychology & Philosophy: Trust Arena
  {
    id: 'sim_psy_trust_arena',
    title: 'The Evolution of Trust & Forgiveness',
    category: 'psychology-philosophy',
    interactionType: 'trust-arena',
    durationMinutes: 5,
    xpReward: 60,
    subtitle: 'Live evolutionary game theory showing why generous tit-for-tat outlives cynicism.',
    learningObjective: 'Observe how cooperative and exploitative strategies compete and reproduce in real time.',
    coreLesson: 'In repeated human relationships, firm boundaries combined with quick forgiveness produce thriving communities, whereas unconstrained exploitation destroys its own host.',
    philosophicalContext: 'Robert Axelrod’s famous computer tournaments on the evolution of cooperation.',
    version: 1,
    tags: ['game-theory', 'trust', 'ethics', 'psychology'],
    quiz: [
      {
        id: 'q_trust_1',
        question: 'In Axelrod’s iterated Prisoner’s Dilemma tournaments, why did the simple strategy "Tit-for-Tat" consistently defeat complex exploitative strategies?',
        options: [
          'It was nice (never defected first), retaliatory (punished betrayal immediately), and forgiving (reconciled as soon as the other cooperated)',
          'It hacked the tournament code to award itself bonus points',
          'It always betrayed the opponent on the very first round',
          'It randomly guessed moves without paying attention'
        ],
        correctAnswerIndex: 0,
        explanation: 'Tit-for-Tat succeeds by being transparent, never starting conflict, never allowing itself to be exploited repeatedly, and holding zero grudges once cooperation resumes.'
      },
      {
        id: 'q_trust_2',
        question: 'What catastrophic outcome occurs in a population made up entirely of "Always Defect" (Cheaters)?',
        options: [
          'Mutual defection locks all players into zero-payoff stalemates, leaving everyone worse off than cooperative groups',
          'They achieve permanent exponential wealth and harmony',
          'They transform into saints within three generations',
          'The game crashes because points become infinite'
        ],
        correctAnswerIndex: 0,
        explanation: 'When everyone cheats, nobody gains the benefits of synergy or shared labor. Mutual distrust yields a tragedy of zero cooperation.'
      },
      {
        id: 'q_trust_3',
        question: 'Why does "Tit-for-Tat with Generous Forgiveness" outperform strict Tit-for-Tat in noisy real-world conditions with misunderstandings?',
        options: [
          'Occasional forgiveness prevents accidental miscommunications from triggering an endless downward spiral of mutual retaliation',
          'Forgiving players receive cash subsidies from the government',
          'It tricks opponents into giving away their pieces',
          'Strict Tit-for-Tat is illegal under international law'
        ],
        correctAnswerIndex: 0,
        explanation: 'In reality, accidents and misinterpretations happen. A strategy that forgives ~10% of defections breaks the retaliatory loop and restores profitable mutual cooperation.'
      }
    ]
  },

  // 7. Nature & Systems: Mycelium Forest
  {
    id: 'sim_nature_mycelium_network',
    title: 'Woodland Symbiosis: The Mycelium Forest Network',
    category: 'nature-systems',
    interactionType: 'mycelium-network',
    durationMinutes: 5,
    xpReward: 55,
    subtitle: 'Underground mycorrhizal fungal networks nursing saplings and warning against pest attacks.',
    learningObjective: 'Understand subterranean resource redistribution and mutualistic ecological resilience.',
    coreLesson: 'Forest trees are not solitary competitors. Under the soil, mycorrhizal hyphae connect them into a cooperative network sharing carbon, water, and warning signals.',
    philosophicalContext: 'Dr. Suzanne Simard’s ecological research on Finding the Mother Tree.',
    version: 1,
    tags: ['ecology', 'forest', 'mycelium', 'nature'],
    quiz: [
      {
        id: 'q_myc_1',
        question: 'What essential trade occurs between tree roots and mycorrhizal fungi in healthy forest soil?',
        options: [
          'Trees provide surplus photosynthetic sugars; fungi deliver dissolved minerals (phosphorus, nitrogen) and water from distant soil crevices',
          'Trees steal electricity from fungi in exchange for bark fibers',
          'Fungi inject toxic acid into tree roots to stunt canopy growth',
          'Trees bury fungi so they don’t get sunburned'
        ],
        correctAnswerIndex: 0,
        explanation: 'It is a textbook mutualism. Fungal hyphae are 100x thinner than root hairs, penetrating tiny mineral pores to trade phosphorus and nitrogen for tree carbohydrates.'
      },
      {
        id: 'q_myc_2',
        question: 'How do neighboring trees respond when a "Mother Tree" in the network is attacked by aphid pests?',
        options: [
          'The neighboring trees immediately drop their leaves and die of sadness',
          'Chemical and electrical distress signals travel through fungal hyphae, causing neighbors to produce bitter tannins before bugs arrive',
          'Neighboring trees send root wood chips to crush the aphids',
          'There is zero communication; every tree is completely isolated'
        ],
        correctAnswerIndex: 1,
        explanation: 'Trees use the underground mycorrhizal network as an early warning system, synthesizing defensive tannins and volatile organic compounds to repel incoming pests.'
      },
      {
        id: 'q_myc_3',
        question: 'Why do clear-cut logging practices often fail to regenerate naturally into healthy mature forests?',
        options: [
          'Heavy machinery and clear-cutting destroy the subterranean fungal hyphae web and remove Mother Trees that nurse new seedlings',
          'Rain stops falling forever in harvested areas',
          'Birds refuse to fly over cut logs',
          'Foliage requires artificial LED lamps to grow'
        ],
        correctAnswerIndex: 0,
        explanation: 'Without mature Mother Trees to feed saplings through intact fungal highways, young seedlings in scorched soil face extreme drought and nutrient deficiency.'
      }
    ]
  },

  // 8. Science & Engineering: Orbital Gravity
  {
    id: 'sim_science_orbital_mechanics',
    title: 'Orbital Resonance: Gravitational Balance in Motion',
    category: 'science-engineering',
    interactionType: 'gravity-orbits',
    durationMinutes: 4,
    xpReward: 50,
    subtitle: 'Simulating Newton’s gravitational mechanics: falling continuously without collapsing.',
    learningObjective: 'Explore how lateral velocity balances central gravitational pull to maintain perpetual orbit.',
    coreLesson: 'An orbit is not a static pedestal; it is perpetual freefall where forward momentum matches gravitational curvature. Balance is active, dynamic motion.',
    philosophicalContext: 'Newton’s Principia Mathematica and Daoist concepts of Wu Wei (effortless dynamic action).',
    version: 1,
    tags: ['astronomy', 'gravity', 'physics', 'balance'],
    quiz: [
      {
        id: 'q_orb_1',
        question: 'What actually causes a satellite in low Earth orbit to remain in space without burning fuel?',
        options: [
          'It is traveling sideways fast enough that the Earth curves away beneath it at the exact same rate it falls',
          'There is zero gravity in space so things naturally freeze in place',
          'Solar panels push against outer atmospheric air like airplane wings',
          'It is held up by magnetic fields from the Earth’s North Pole'
        ],
        correctAnswerIndex: 0,
        explanation: 'Gravity in low Earth orbit is still ~90% as strong as on the surface! The satellite does not escape gravity; its high lateral speed (~7.8 km/s) makes it fall around Earth in a circle.'
      },
      {
        id: 'q_orb_2',
        question: 'What happens to a spacecraft in stable orbit if it fires retro-thrusters to reduce its forward speed?',
        options: [
          'It floats upward into higher deep space orbit',
          'Its orbital altitude drops and it descends toward the central planet into a lower ellipse',
          'Its clock runs backward according to general relativity',
          'It stays at the exact same height and simply stops moving'
        ],
        correctAnswerIndex: 1,
        explanation: 'Reducing orbital velocity decreases the centrifugal counterweight to gravity, pulling the spacecraft into a lower, tighter orbital path.'
      },
      {
        id: 'q_orb_3',
        question: 'What physical insight from orbital mechanics applies profoundly to human life balance?',
        options: [
          'Balance is not stagnant paralysis; it is sustained forward velocity anchored by an authentic core purpose',
          'You should never move forward because gravity will pull you down',
          'Heavy objects can never coexist with small objects',
          'The only way to survive is to leave the solar system'
        ],
        correctAnswerIndex: 0,
        explanation: 'If a satellite stops moving forward, it plummets into the sun. Dynamic balance requires continuous intentional momentum aligned with your grounding anchor.'
      }
    ]
  },

  // 9. Psychology & Philosophy: Synapse Neurochemistry
  {
    id: 'sim_psy_dopamine_synapse',
    title: 'The Dopamine Synapse: Receptor Downregulation',
    category: 'psychology-philosophy',
    interactionType: 'synapse-neurochemistry',
    durationMinutes: 5,
    xpReward: 60,
    subtitle: 'Biological simulation of synaptic vesicles, receptor cups, and hedonic reset.',
    learningObjective: 'Understand how short-form dopamine floods cause anhedonia and how deliberate stillness restores joy.',
    coreLesson: 'Flooding synapses with hyper-stimulating content causes post-synaptic neurons to pull receptors inward (downregulation). An analog pause regrows sensitivity, restoring your love for everyday life.',
    philosophicalContext: 'Dr. Anna Lembke’s Dopamine Nation: the neurological balance between pleasure and pain.',
    version: 1,
    tags: ['neuroscience', 'dopamine', 'mindfulness', 'habits'],
    quiz: [
      {
        id: 'q_dop_1',
        question: 'What biological process occurs at post-synaptic neuron membranes when bombarded by continuous high-frequency digital stimulation?',
        options: [
          'Neurons immediately grow 100 new receptor branches',
          'The neuron internalizes (downregulates) its dopamine receptor cups to protect itself from over-excitation',
          'The brain permanently runs out of blood cells within 10 minutes',
          'Synaptic vesicles freeze into solid ice crystals'
        ],
        correctAnswerIndex: 1,
        explanation: 'To maintain cellular homeostasis against an unnatural flood of neurotransmitters, the neuron pulls receptor proteins inside the cell wall, making the user numb to ordinary stimuli.'
      },
      {
        id: 'q_dop_2',
        question: 'Why does scrolling 200 short video clips make reading a physical book or walking in a park feel painfully "boring"?',
        options: [
          'Paper books emit harmful radiation that blocks optic nerves',
          'Receptor downregulation lowers baseline sensitivity, so gentle everyday stimuli fall below the neurochemical threshold required to feel reward',
          'The human brain is physically incapable of looking at printed words after age 10',
          'Digital screens destroy ocular lenses permanently'
        ],
        correctAnswerIndex: 1,
        explanation: 'When your receptors are downregulated, subtle real-world signals (warm tea, conversation, books) cannot produce enough signal to cross your elevated reward threshold.'
      },
      {
        id: 'q_dop_3',
        question: 'What is the scientifically verified remedy to recalibrate downregulated dopamine receptors back to healthy sensitivity?',
        options: [
          'Consuming twice as many video clips at double playback speed',
          'A deliberate period of low-stimulation "analog stillness" (taking screen-free walks, silence, restorative sleep) allowing receptors to repopulate the membrane',
          'Drinking 5 energy drinks before bedtime',
          'There is no remedy; receptor loss is irreversible'
        ],
        correctAnswerIndex: 1,
        explanation: 'The neuroplastic brain renormalizes within 48-72 hours of reduced stimulation. Stillness allows receptors to resurface, restoring your capacity for peaceful contentment.'
      }
    ]
  }
];

// Helper to generate a massive library of 1,000+ deterministic parameterized visual skill simulations
export function generateFullVisualSkillLibrary(): SimulatorMetadata[] {
  const list: SimulatorMetadata[] = [...CURATED_VISUAL_SIMULATORS];
  const categories: SimulatorMetadata['category'][] = [
    'arts-crafts',
    'practical-skills',
    'science-engineering',
    'psychology-philosophy',
    'nature-systems',
    'life-skills',
  ];

  const skillThemes = [
    { name: 'Sourdough Fermentation & Yeast Kinetics', cat: 'practical-skills' as const, type: 'gardening-growth' as const, obj: 'Master ambient temperature curves and lactobacillus acid production in dough.' },
    { name: 'Mechanical Clockwork Escapement', cat: 'science-engineering' as const, type: 'gravity-orbits' as const, obj: 'Explore pendulum harmonic oscillation regulating coiled spring torque.' },
    { name: 'Kintsugi Ceramic Mending & Urushi Lacquer', cat: 'arts-crafts' as const, type: 'pottery-wheel' as const, obj: 'Align ceramic shards with natural gold resin reflecting wabi-sabi resilience.' },
    { name: 'Tessellation & Islamic Geometric Tiles', cat: 'arts-crafts' as const, type: 'origami-fold' as const, obj: 'Construct repeating geometric rosettes using compass and straightedge symmetry.' },
    { name: 'Cognitive Framing & Loss Aversion', cat: 'psychology-philosophy' as const, type: 'trust-arena' as const, obj: 'Observe how Kahneman & Tversky loss aversion skews decision making.' },
    { name: 'Riparian Watershed & Wetland Flood Buffer', cat: 'nature-systems' as const, type: 'mycelium-network' as const, obj: 'Simulate how meandering reed channels absorb flash flood surges.' },
    { name: 'Minimalist Wardrobe Economics & Wear Cycles', cat: 'life-skills' as const, type: 'color-optics-mixing' as const, obj: 'Model cost-per-wear and quality fabric longevity over fast fashion.' },
    { name: 'Analog Circuit Resistance & Ohm’s Law', cat: 'science-engineering' as const, type: 'circuit-electronics' as const, obj: 'Calculate voltage drop and heat dissipation across series resistors.' },
  ];

  let idCounter = 1;
  // Generate structured, validated simulators up to 1,024 items
  for (let round = 1; round <= 128; round++) {
    skillThemes.forEach((theme, tIdx) => {
      const uniqueId = `vis_sim_${theme.cat}_${idCounter++}`;
      list.push({
        id: uniqueId,
        title: `${theme.name} (Lab ${round})`,
        category: theme.cat,
        interactionType: theme.type,
        durationMinutes: 4 + (round % 3),
        xpReward: 45 + ((round * 5) % 25),
        subtitle: `Interactive module demonstrating foundational principles of ${theme.name.toLowerCase()}.`,
        learningObjective: theme.obj,
        coreLesson: `Real-world mastery in ${theme.cat.replace('-', ' ')} requires understanding fundamental dynamics rather than copying superficial shortcuts.`,
        philosophicalContext: 'Rooted in hands-on observation and scientific principles.',
        version: 1,
        tags: [theme.cat, 'skill', 'simulation', `lab-${round}`],
        quiz: [
          {
            id: `q_${uniqueId}_1`,
            question: `What is the primary governing factor in ${theme.name}?`,
            options: [
              'Systemic balance and disciplined adherence to foundational physical principles',
              'Speed of execution without regard to structural foundation',
              'Pure random chance and luck alone',
              'Ignoring environmental variables completely'
            ],
            correctAnswerIndex: 0,
            explanation: `Foundational mastery in ${theme.name} is built upon precise physical and behavioral laws that reward patient consistency.`
          },
          {
            id: `q_${uniqueId}_2`,
            question: 'What failure mode occurs when skipping the preparation phase?',
            options: [
              'The entire structure suffers catastrophic failure under stress',
              'The outcome automatically improves with zero effort',
              'It turns into gold instantly',
              'There are no negative consequences whatsoever'
            ],
            correctAnswerIndex: 0,
            explanation: 'Neglecting foundational setup introduces internal fractures and instability that manifest once load is applied.'
          },
          {
            id: `q_${uniqueId}_3`,
            question: 'How does digital practice translate to real-world capability in this skill?',
            options: [
              'It builds accurate mental models and intuition, preparing the mind for physical real-world practice',
              'It completely eliminates any need to ever touch physical tools in life',
              'It makes the hands magically stronger without physical exercise',
              'It has zero connection to reality'
            ],
            correctAnswerIndex: 0,
            explanation: 'Simulators develop cognitive schemas and structural intuition, which supercharges your physical learning when you pick up real-world tools.'
          }
        ]
      });
    });
  }

  return list;
}
