export type UiStyleTheme = 'brutal' | 'minimal';

export type DataProvenance =
  | 'NASA Measured Data'
  | 'Published Research Finding'
  | 'AI-Generated Interpretation'
  | 'Illustrative Demonstration Data';

export type ExperimentCategory =
  | 'All'
  | 'Solid Fuels'
  | 'Droplet & Cool Flame'
  | 'Large-Scale Fire'
  | 'Smoke & Detection'
  | 'Gaseous & ACME';

export interface PsiExperiment {
  id: string;
  psiId: string;
  name: string;
  fullName: string;
  experimentType: string;
  category: Exclude<ExperimentCategory, 'All'>;
  facility: string;
  year: string;
  psiVerification?: 'verified' | 'unverified';
  tagColor: string;
  researchObjective: string;
  shortDescription: string;
  overviewSummary: string;
  keyFindings: string[];
  resultHighlights?: {
    label: string;
    value: string;
    provenance: DataProvenance;
  }[];
  experimentalData: {
    provenance: DataProvenance;
    note: string;
    records: { metric: string; value: string; provenance: DataProvenance }[];
  };
  parameters: {
    fuelType: string;
    oxygenConcentration: string;
    pressure: string;
    airflow: string;
    temperature: string;
    experimentalEnvironment: string;
    suppressionMethod: string;
  };
  publications: {
    title: string;
    authors: string;
    venue: string;
    year: string;
    doi?: string;
    url?: string;
  }[];
  dataUrl?: string;
  visualCaption: string;
  imageUrl: string;
  imageCredit: string;
  imageType?: 'nasa' | 'ai-illustration' | 'schematic';
  imageFit?: 'cover' | 'contain';
  thumbnailVariant:
    | 'droplet-cool-flame'
    | 'solid-airflow'
    | 'saffire-cygnus'
    | 'smoke-aerosol'
    | 'acme-gaseous'
    | 'jet-soot';
}

export interface MissionEnvironment {
  id: string;
  name: string;
  shortName: string;
  gravity: string;
  atmosphere: string;
  accentColor: string;
  stickyBg: string;
  stickyBorder: string;
  tagLabel: string;
  tiltClass: string;
  iconType: 'capsule' | 'iss' | 'moon' | 'mars' | 'rover';
  buoyancySummary: string;
  keyHazards: string[];
  safetyControls: string[];
  linkedPsiIds: string[];
}

export interface IntelligenceTopic {
  id:
    | 'oxygen'
    | 'flammability'
    | 'airflow'
    | 'spread'
    | 'suppression'
    | 'smoke';
  label: string;
  title: string;
  provenance: DataProvenance;
  insight: string;
  chartType: 'bar' | 'area' | 'composed';
  xKey: string;
  series: { key: string; label: string; color: string }[];
  unitNote: string;
  data: Record<string, string | number>[];
  relatedPsiIds: string[];
}

export interface ResearchDocument {
  id: string;
  docCode: string;
  title: string;
  category:
    | 'Combustion Physics'
    | 'Spacecraft Standards'
    | 'Smoke & Aerosols'
    | 'Suppression & Habitats';
  psiRef: string;
  year: string;
  provenance: DataProvenance;
  summary: string;
  keyTakeaways: string[];
}

export const CHALLENGE_PILLARS = [
  {
    name: 'Microgravity',
    detail: 'Near-zero buoyant convection alters flame shape to spherical & delays soot escape.',
  },
  {
    name: 'Flammability',
    detail: 'Low-speed opposed cabin airflow can lower the limiting oxygen index of solid fuels.',
  },
  {
    name: 'Oxygen & Flow',
    detail: 'Exploration atmospheres (~34–36% O2 at 56.5 kPa) heighten ignition sensitivity.',
  },
  {
    name: 'Suppression',
    detail: 'Ventilation shutoff, CO2/N2 inerting, and depressurization protocols verified in 0g.',
  },
  {
    name: 'Smoke Detection',
    detail: 'Microgravity smoke coagulates into larger aerosols that require multi-wavelength sensing.',
  },
];

export const MISSION_ENVIRONMENTS: MissionEnvironment[] = [
  {
    id: 'spacecraft',
    name: 'Spacecraft',
    shortName: 'Spacecraft',
    gravity: '0g Microgravity (Freefall)',
    atmosphere: '21% O2 at 101.3 kPa or ~34% O2 exploration cabin',
    accentColor: '#FFE14D',
    stickyBg: '#FCE883',
    stickyBorder: '#D9A726',
    tagLabel: '0g Freefall',
    tiltClass: '-rotate-[2deg]',
    iconType: 'capsule',
    buoyancySummary:
      'In orbital freefall, buoyancy-driven convection vanishes. Fires do not send plumes upward; instead they rely on cabin forced ventilation and molecular diffusion.',
    keyHazards: [
      'Invisible or pale-blue cool flames persisting after hot flame extinction (FLEX PSI-69).',
      'Forced ventilation ducts carrying smoke and embers along hidden avionics racks.',
      'Elevated fire growth in large enclosed cargo volumes (SAFFIRE I–III).',
    ],
    safetyControls: [
      'Immediate fan shutdown to starve convective oxygen transport.',
      'NASA-STD-6001 material flammability qualification supplemented by low-flow 0g data.',
      'Targeted CO2 or water-mist port suppression inside enclosed racks.',
    ],
    linkedPsiIds: ['PSI-69', 'PSI-98', 'PSI-26'],
  },
  {
    id: 'iss',
    name: 'International Space Station',
    shortName: 'ISS',
    gravity: '10⁻⁶g Orbital Microgravity',
    atmosphere: '21% O2 · 79% N2 · ~101.3 kPa',
    accentColor: '#CBBDFB',
    stickyBg: '#9BE2FF',
    stickyBorder: '#2998D8',
    tagLabel: 'ISS 101.3 kPa',
    tiltClass: 'rotate-[1.5deg]',
    iconType: 'iss',
    buoyancySummary:
      'Continuous HVAC circulation (~0.08–0.20 m/s) keeps cabin air breathable for crew—but that exact airflow replaces buoyancy as the primary oxidizer supply to a flame.',
    keyHazards: [
      'Smoke aerosol coagulation shifts mean particle size, risking delayed optical triggers (SAME PSI-102).',
      'Smoldering wiring insulation behind racks before visible flames appear.',
      'Limited egress options requiring rapid rack-level isolation.',
    ],
    safetyControls: [
      'Photoelectric smoke detectors positioned along return air ducts calibrated via SAME/SAME-R.',
      'Portable CO2 and fine water-mist fire extinguishers rated for microgravity dispersion.',
      'Power-down and rack isolation checklists tested across ISS Expedition campaigns.',
    ],
    linkedPsiIds: ['PSI-102', 'PSI-101', 'PSI-25'],
  },
  {
    id: 'moon-base',
    name: 'Moon Base',
    shortName: 'Moon Base',
    gravity: '1/6g Lunar Partial Gravity (~1.62 m/s²)',
    atmosphere: 'Exploration target: ~34% O2 at ~56.5 kPa',
    accentColor: '#F48C8C',
    stickyBg: '#FFAEEC',
    stickyBorder: '#E04EC2',
    tagLabel: '1/6g Lunar',
    tiltClass: '-rotate-[1.5deg]',
    iconType: 'moon',
    buoyancySummary:
      'At 1/6g, buoyant convection is ~6x weaker than Earth while lower-pressure, oxygen-enriched habitats (~34% O2) reduce EVA pre-breathe time but increase flame spread velocity.',
    keyHazards: [
      'Higher oxygen fraction accelerates ignition of polymers, textiles, and seals.',
      'Fine abrasive lunar regolith dust accumulating on filters and electrical contacts.',
      'Partial-gravity mixed convection creating unstable flame plumes.',
    ],
    safetyControls: [
      'Strict oxygen-compatible material screening beyond 1g air tests.',
      'Zone-isolating pressure bulkheads allowing controlled module depressurization.',
      'Multi-parameter CO + UV/IR + multi-wavelength aerosol detection.',
    ],
    linkedPsiIds: ['PSI-25', 'PSI-99', 'PSI-159'],
  },
  {
    id: 'mars-habitat',
    name: 'Mars Habitat & Pressurized Rovers',
    shortName: 'Mars & Rovers',
    gravity: '3/8g Martian (~3.72 m/s²) & Rover Cabins',
    atmosphere: 'Exploration target: ~34–36% O2 · ~55–57 kPa',
    accentColor: '#8FD8F8',
    stickyBg: '#9BE2FF',
    stickyBorder: '#2998D8',
    tagLabel: '3/8g + Rovers',
    tiltClass: 'rotate-[2deg]',
    iconType: 'mars',
    buoyancySummary:
      'Mars habitats and pressurized surface rovers operate far from Earth resupply with compact internal volumes where smoke, CO, and toxic off-gassing saturate living quarters within minutes.',
    keyHazards: [
      'Rapid cabin atmospheric contamination in compact pressurized rover volumes.',
      'High-voltage battery & power electronics packs near enriched-O2 crew zones.',
      'Suppression agent recovery required in closed-loop ECLSS life support.',
    ],
    safetyControls: [
      'Water-mist or nitrogen inerting compatible with closed-loop air scrubbers.',
      'Compartmentalized thermal barriers for rover battery bays.',
      'Automated HVAC damper shutoff tied to gas & aerosol anomalies.',
    ],
    linkedPsiIds: ['PSI-98', 'PSI-100', 'PSI-20'],
  },
];

export const PRESSURIZED_ROVER_DETAILS: MissionEnvironment = {
  id: 'pressurized-rovers',
  name: 'Pressurized Rovers',
  shortName: 'Rovers',
  gravity: '1/6g Lunar or 3/8g Martian Surface Ops',
  atmosphere: 'High-O2 Exploration Cabin (~34% O2 / ~56.5 kPa)',
  accentColor: '#FFE14D',
  stickyBg: '#FCE883',
  stickyBorder: '#D9A726',
  tagLabel: 'Rover Cabins',
  tiltClass: 'rotate-0',
  iconType: 'rover',
  buoyancySummary:
    'Pressurized surface rovers have the smallest free air volume per crew member, meaning any fire rapidly consumes oxygen and spikes carbon monoxide and toxic pyrolysis gases.',
  keyHazards: [
    'Dense avionics, lithium-ion traction batteries, and EVA suit ports in tight proximity.',
    'Elevated O2 fraction lowering ignition thresholds for cab polymers and wiring.',
    'No external venting without suit donning or emergency cabin depressurization.',
  ],
  safetyControls: [
    'Partitioned battery & power distribution enclosures isolated from crew air loop.',
    'Early-warning smoldering wire detection informed by SAME & SAME-R aerosol data.',
    'Zero-residue nitrogen purge or water-mist suppression preserving ECLSS scrubbers.',
  ],
  linkedPsiIds: ['PSI-102', 'PSI-101', 'PSI-26'],
};

export const PSI_EXPERIMENTS: PsiExperiment[] = [
  {
    id: 'psi-26',
    psiId: 'PSI-26',
    name: 'BASS',
    fullName: 'Burning and Suppression of Solids',
    experimentType: 'Solid Fuel Flammability & Suppression',
    category: 'Solid Fuels',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    year: '2009–2013',
    psiVerification: 'verified',
    tagColor: '#FFE14D',
    researchObjective:
      'Determine burning rates, flame spread regimes, and gaseous nitrogen extinguishment limits for solid spacecraft fuels in microgravity.',
    shortDescription:
      'Investigated PMMA spheres, rods, flat sheets, and cotton-fiberglass fabrics under low-speed flows in the ISS glovebox.',
    overviewSummary:
      'BASS demonstrated that solid materials in microgravity can continue burning at lower airflow velocities and lower oxygen concentrations than many ground-based upward flame tests predict. It also evaluated nitrogen dilution extinguishment boundaries.',
    keyFindings: [
      'Low-speed forced airflow (a few cm/s) sustains steady microgravity combustion while quiescent conditions often quench via radiative loss.',
      'Concurrent and opposed flame spread respond differently to sample thickness and flow speed.',
      'Demonstrated effective flame suppression using nitrogen gas injection in microgravity.',
    ],
    resultHighlights: [
      { label: 'ISS test campaign', value: '122 BASS test runs (2009–2013)', provenance: 'Published Research Finding' },
      { label: 'Forced-flow range', value: '0 – 0.40 m/s', provenance: 'NASA Measured Data' },
    ],
    dataUrl: 'https://doi.org/10.60555/58h4-dy80',
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published NASA PSI test conditions; unpublished raw sensor traces marked as unavailable.',
      records: [
        { metric: 'Test Fuels', value: 'PMMA, Cotton-Fiberglass (Sibal), Nomex', provenance: 'Published Research Finding' },
        { metric: 'Airflow Range', value: '0 – 0.40 m/s forced flow (published BASS range)', provenance: 'NASA Measured Data' },
        { metric: 'Suppression Agent Tested', value: 'Gaseous Nitrogen (N2) dilution', provenance: 'Published Research Finding' },
        { metric: 'Peak Surface Thermocouple Curve', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Solid polymers (PMMA), Cotton-fiberglass blend, Nomex',
      oxygenConcentration: 'Varied ~15% – 22% O2 in N2',
      pressure: '~101.3 kPa (ISS cabin pressure)',
      airflow: '0 – 0.40 m/s (opposed & concurrent)',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'ISS Microgravity Science Glovebox (MSG)',
      suppressionMethod: 'Gaseous Nitrogen (N2) dilution & flow cutoff',
    },
    publications: [
      {
        title: 'Burning and Suppression of Solids (BASS) aboard the International Space Station',
        authors: 'S. L. Olson, P. V. Ferkul et al.',
        venue: 'NASA Glenn Research Center / Combustion & Flame',
        year: '2014',
      },
    ],
    visualCaption: 'Schematic of solid PMMA/fabric sample inside MSG flow duct under opposed low-speed airflow.',
    imageUrl: '/assets/assests/image_8c38fee5.png',
    imageCredit: 'AI-generated illustration — not a NASA photograph. Concept: solid-fuel flame in low-speed microgravity airflow.',
    imageType: 'ai-illustration',
    imageFit: 'contain',
    thumbnailVariant: 'solid-airflow',
  },
  {
    id: 'psi-25',
    psiId: 'PSI-25',
    name: 'BASS-II',
    fullName: 'Burning and Suppression of Solids – II',
    experimentType: 'Solid Flammability in Exploration Atmospheres',
    category: 'Solid Fuels',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    year: '2014–2015',
    psiVerification: 'verified',
    tagColor: '#F472B6',
    researchObjective:
      'Establish minimum limiting oxygen concentrations and extinguishment boundaries for solid materials in microgravity.',
    shortDescription:
      'Extended BASS solid-combustion campaigns with wider fuel geometries and concurrent/opposed extinction measurements.',
    overviewSummary:
      'BASS-II quantified how flame spread transitions to extinction as oxygen concentration or flow velocity drops, directly informing material qualification rules for ISS and future lunar/Martian cabins.',
    keyFindings: [
      'Identified distinct quench (too slow flow) and blow-off (too fast flow) extinction limits in 0g.',
      'Provided benchmark validation datasets for computational fire dynamics models (FDS).',
    ],
    resultHighlights: [
      { label: 'Flow regime', value: '0 – 0.55 m/s opposed & concurrent', provenance: 'NASA Measured Data' },
      { label: 'Extinction modes', value: 'Low-flow quench and high-flow blow-off', provenance: 'Published Research Finding' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Summary bounds verified from NASA PSI documentation.',
      records: [
        { metric: 'Materials Tested', value: 'PMMA cylinders/flats, Sibal cloth, Nomex', provenance: 'Published Research Finding' },
        { metric: 'Flow Regimes', value: 'Opposed & concurrent microgravity duct flow', provenance: 'NASA Measured Data' },
        { metric: 'Exact Extinction O2 Threshold Table', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'PMMA, Cotton-fiberglass (Sibal), Nomex',
      oxygenConcentration: 'Sub-ambient to ambient (~14% – 21% O2)',
      pressure: '~101.3 kPa',
      airflow: 'Low-speed forced flow (0 – 0.55 m/s)',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'ISS Microgravity Science Glovebox (MSG)',
      suppressionMethod: 'Oxygen depletion & airflow reduction',
    },
    publications: [
      {
        title: 'Solid Fuel Flammability and Extinction in Microgravity: BASS-II Results',
        authors: 'P. V. Ferkul, S. L. Olson',
        venue: 'AIAA / NASA PSI Technical Report',
        year: '2016',
      },
    ],
    visualCaption: 'BASS-II concurrent vs opposed solid-fuel extinction boundary diagram.',
    imageUrl: '/assets/assests/image_027753ef.png',
    imageCredit: 'AI-generated illustration — not a NASA photograph. Concept: concurrent vs opposed solid-fuel extinction boundary.',
    imageType: 'ai-illustration',
    imageFit: 'contain',
    thumbnailVariant: 'solid-airflow',
  },
  {
    id: 'psi-69',
    psiId: 'PSI-69',
    name: 'FLEX',
    fullName: 'Flame Extinguishment Experiment',
    experimentType: 'Liquid Droplet Combustion & Cool Flames',
    category: 'Droplet & Cool Flame',
    facility: 'ISS Combustion Integrated Rack (CIR)',
    year: '2009–2012',
    psiVerification: 'verified',
    tagColor: '#38BDF8',
    researchObjective:
      'Observe isolated spherical liquid fuel droplet burning, radiative extinction, and suppression in microgravity.',
    shortDescription:
      'Discovered dual-stage combustion where heptane droplets continued burning as invisible low-temperature cool flames after hot-flame extinction.',
    overviewSummary:
      'FLEX transformed combustion physics by revealing that large n-heptane droplets in microgravity undergo visible radiative extinction and immediately enter a sustained, nearly invisible low-temperature cool flame regime (~500–800 K) driven by hydroperoxide chemistry.',
    keyFindings: [
      'First observation of quasi-steady cool flames following hot-flame radiative extinction of heptane droplets.',
      'Spherical flame symmetry eliminated buoyancy flicker, enabling exact validation of 1D chemical kinetic models.',
      'Showed extinguishment limits depend strongly on inert diluent (N2, CO2, He) and initial droplet diameter.',
    ],
    resultHighlights: [
      { label: 'Droplet diameter', value: '1.5 – 5.0 mm', provenance: 'NASA Measured Data' },
      { label: 'Oxygen mole fraction', value: '0.10 – 0.40', provenance: 'Published Research Finding' },
      { label: 'Pressure', value: '0.7 – 3.0 atm', provenance: 'NASA Measured Data' },
      { label: 'LOI (methanol / n-heptane)', value: '0.12 / 0.15', provenance: 'Published Research Finding' },
    ],
    experimentalData: {
      provenance: 'NASA Measured Data',
      note: 'Published NASA CIR droplet combustion parameters and cool-flame observations.',
      records: [
        { metric: 'Liquid Fuels', value: 'n-Heptane, Methanol', provenance: 'NASA Measured Data' },
        { metric: 'Observed Cool Flame Regime', value: '~500 – 800 K low-temp oxidation', provenance: 'Published Research Finding' },
        { metric: 'Inert Diluents', value: 'Nitrogen, Carbon Dioxide, Helium', provenance: 'NASA Measured Data' },
        { metric: 'Droplet Diameter Range', value: '~1.5 – 5.0 mm isolated droplets', provenance: 'NASA Measured Data' },
      ],
    },
    parameters: {
      fuelType: 'Liquid n-Heptane & Methanol droplets',
      oxygenConcentration: 'O2 mole fraction 0.10 – 0.40 (N2/CO2/He diluents)',
      pressure: '0.7 – 3.0 atm (CIR chamber)',
      airflow: 'Quiescent (0 m/s forced flow)',
      temperature: 'Cool flame ~500 – 800 K after hot extinction',
      experimentalEnvironment: 'ISS Combustion Integrated Rack (CIR)',
      suppressionMethod: 'Radiative heat loss & inert gas dilution (CO2, He, N2)',
    },
    publications: [
      {
        title: 'Can cool flames support quasi-steady droplet burning?',
        authors: 'V. Nayagam, D. L. Dietrich, P. V. Ferkul, M. C. Hicks, F. A. Williams',
        venue: 'Combustion and Flame 159 (2012) 3583–3588',
        year: '2012',
        doi: '10.1016/j.combustflame.2012.06.016',
        url: 'https://doi.org/10.1016/j.combustflame.2012.06.016',
      },
    ],
    visualCaption: 'Spherical n-heptane droplet transitioning from visible hot flame to pale-blue/invisible cool flame.',
    imageUrl: '/assets/assests/image_11f039d4.png',
    imageCredit: 'AI-generated illustration — not a NASA photograph. Concept: spherical droplet hot-to-cool flame transition.',
    imageType: 'ai-illustration',
    imageFit: 'cover',
    thumbnailVariant: 'droplet-cool-flame',
  },
  {
    id: 'psi-68',
    psiId: 'PSI-68',
    name: 'FLEX-2',
    fullName: 'Flame Extinguishment Experiment – 2',
    experimentType: 'Binary Droplet & Cool Flame Kinetics',
    category: 'Droplet & Cool Flame',
    facility: 'ISS Combustion Integrated Rack (CIR)',
    year: '2012–2017',
    psiVerification: 'verified',
    tagColor: '#CBBDFB',
    researchObjective:
      'Study burning rates, soot formation, and cool-flame extinction of single and multi-component liquid fuel droplets.',
    shortDescription:
      'Investigated n-heptane, iso-octane, decane, and binary fuel droplets under varied pressures and oxygen concentrations.',
    overviewSummary:
      'FLEX-2 expanded on FLEX by examining binary hydrocarbon mixtures and droplet arrays, clarifying how fuel volatility and pressure govern the onset and duration of cool flames.',
    keyFindings: [
      'Confirmed cool-flame behavior across higher alkanes (decane, dodecane) and hydrocarbon mixtures.',
      'Mapped hot-to-cool extinction boundaries across sub-atmospheric and elevated pressures.',
    ],
    resultHighlights: [
      { label: 'Fuel set', value: 'n-Heptane, decane, iso-octane, binary mixtures', provenance: 'NASA Measured Data' },
      { label: 'Droplet configuration', value: 'Single droplets and droplet arrays', provenance: 'NASA Measured Data' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Derived from NASA PSI FLEX-2 summary records.',
      records: [
        { metric: 'Test Fuels', value: 'n-Heptane, Decane, Iso-octane, Binary mixtures', provenance: 'NASA Measured Data' },
        { metric: 'Ambient Environment', value: 'Quiescent microgravity in CIR', provenance: 'NASA Measured Data' },
        { metric: 'Individual Run Radiometer CSV', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Single & binary alkane droplets (heptane, decane, iso-octane)',
      oxygenConcentration: 'Varied O2 / N2 / CO2 / He mixtures',
      pressure: 'Sub-atmospheric to elevated CIR chamber pressure',
      airflow: 'Quiescent microgravity',
      temperature: 'Low-temperature cool-flame regime',
      experimentalEnvironment: 'ISS Combustion Integrated Rack (CIR)',
      suppressionMethod: 'Radiative quenching & diluent gas addition',
    },
    publications: [
      {
        title: 'FLEX-2: Droplet Combustion and Cool Flames in the ISS Combustion Integrated Rack',
        authors: 'NASA FLEX-2 Science Team',
        venue: 'NASA PSI investigation summary',
        year: '2012–2017',
      },
    ],
    visualCaption: 'FLEX-2 dual-droplet radiative interaction and cool-flame shell schematic.',
    imageUrl: '/assets/psi/flex2_droplet.jpg',
    imageCredit: 'AI-generated artistic illustration — not a NASA photograph. Concept: droplet combustion and cool-flame shell.',
    imageType: 'ai-illustration',
    imageFit: 'cover',
    thumbnailVariant: 'droplet-cool-flame',
  },
  {
    id: 'psi-98',
    psiId: 'PSI-98',
    name: 'SAFFIRE-I',
    fullName: 'Spacecraft Fire Experiment – I',
    experimentType: 'Large-Scale Spacecraft Fire Growth',
    category: 'Large-Scale Fire',
    facility: 'Cygnus Uncrewed Cargo Vehicle (OA-6)',
    year: '2016',
    psiVerification: 'verified',
    tagColor: '#F26C57',
    researchObjective:
      'Measure realistic large-scale flame spread, heat release, and smoke transport inside an actual spacecraft after ISS departure.',
    shortDescription:
      'Burned a large 0.4 m × 0.94 m cotton-fiberglass sample inside an uncrewed Cygnus cargo vehicle under 0.20 m/s airflow.',
    overviewSummary:
      'SAFFIRE-I was NASA’s first full-scale spacecraft fire experiment, overcoming the size limits of glovebox tests to verify how a large fire grows, heats cabin air, and spreads smoke inside a real vehicle.',
    keyFindings: [
      'Demonstrated steady flame spread across a ~1 meter fabric sheet at 0.20 m/s airflow (~21.7% O2).',
      'Confirmed large-scale temperature rise and smoke dispersion patterns inside Cygnus.',
    ],
    resultHighlights: [
      { label: 'Average flame spread rate', value: '≈1.8 mm/s', provenance: 'NASA Measured Data' },
      { label: 'Burn duration', value: '≈420 s', provenance: 'NASA Measured Data' },
      { label: 'Average flame power', value: '≈1200 W', provenance: 'NASA Measured Data' },
      { label: 'Oxygen consumed', value: '≈1.5 percentage points', provenance: 'NASA Measured Data' },
    ],
    dataUrl: 'https://doi.org/10.60555/0t15-1z43',
    experimentalData: {
      provenance: 'NASA Measured Data',
      note: 'Published NASA Cygnus OA-6 test configuration and telemetry summaries.',
      records: [
        { metric: 'Sample Dimensions', value: '0.40 m × 0.94 m Cotton-Fiberglass (Sibal)', provenance: 'NASA Measured Data' },
        { metric: 'Cabin Airflow', value: '~0.20 m/s forced duct flow', provenance: 'NASA Measured Data' },
        { metric: 'Cabin Atmosphere', value: '~21.7% O2 at ~101 kPa', provenance: 'NASA Measured Data' },
        { metric: 'Full Radiometer Raw Trace', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Cotton-fiberglass blend fabric (Sibal cloth)',
      oxygenConcentration: '~21.7% O2',
      pressure: '~101 kPa (spacecraft cabin)',
      airflow: '0.20 m/s controlled fan flow',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'Cygnus OA-6 uncrewed spacecraft flow duct',
      suppressionMethod: 'Self-extinguished upon full fuel consumption / flow stop',
    },
    publications: [
      {
        title: 'Results of Large-Scale Spacecraft Flammability Tests',
        authors: 'P. V. Ferkul, S. L. Olson, D. L. Urban, G. A. Ruff, S. Easton',
        venue: 'NASA NTRS 20170008805 / ICES',
        year: '2017',
        url: 'https://ntrs.nasa.gov/citations/20170008805',
      },
    ],
    visualCaption: 'Cygnus OA-6 internal flow duct carrying large Sibal fabric flame front.',
    imageUrl: '/assets/psi/saffire_fabric.jpg',
    imageCredit: 'NASA JSC / Cygnus · SAFFIRE large-scale fabric burn with green smoke-tracking LEDs',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'saffire-cygnus',
  },
  {
    id: 'psi-99',
    psiId: 'PSI-99',
    name: 'SAFFIRE-II',
    fullName: 'Spacecraft Fire Experiment – II',
    experimentType: 'Multi-Material Qualification Benchmark',
    category: 'Large-Scale Fire',
    facility: 'Cygnus Uncrewed Cargo Vehicle (OA-5)',
    year: '2016',
    psiVerification: 'verified',
    tagColor: '#EAB308',
    researchObjective:
      'Benchmark nine spacecraft materials against NASA-STD-6001 Earth-normal flammability tests in real orbital microgravity.',
    shortDescription:
      'Tested nine separate material samples (PMMA, Nomex, silicone, cotton-fiberglass, flame-retardant fabrics) aboard Cygnus.',
    overviewSummary:
      'SAFFIRE-II compared standard 1g upward flame-propagation material tests with real spacecraft microgravity ignition and spread across nine materials of varying thickness.',
    keyFindings: [
      'Validated how material thickness and airflow control upward-vs-microgravity flammability correlation.',
      'Provided empirical evidence for updating NASA-STD-6001 material screening safety margins.',
    ],
    resultHighlights: [
      { label: 'Material samples', value: '9 distinct spacecraft materials', provenance: 'NASA Measured Data' },
      { label: 'Cabin atmosphere', value: '~22.1% O2 at ~101 kPa', provenance: 'NASA Measured Data' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published Cygnus OA-5 9-sample test matrix.',
      records: [
        { metric: 'Tested Samples', value: '9 distinct materials (Sibal, PMMA, Nomex, Silicone)', provenance: 'NASA Measured Data' },
        { metric: 'Atmosphere', value: '~22.1% O2 · ~101 kPa', provenance: 'NASA Measured Data' },
        { metric: 'Individual Sample Mass Loss Curves', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'PMMA, Silicone, Nomex, Cotton-fiberglass, FR cotton',
      oxygenConcentration: '~22.1% O2',
      pressure: '~101 kPa',
      airflow: 'Controlled forced ventilation',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'Cygnus OA-5 uncrewed spacecraft',
      suppressionMethod: 'Sample-limited burn / airflow management',
    },
    publications: [
      {
        title: 'SAFFIRE-II: Flammability Testing of Nine Spacecraft Materials in Microgravity',
        authors: 'G. A. Ruff, D. L. Urban, P. V. Ferkul',
        venue: '47th International Conference on Environmental Systems (ICES)',
        year: '2017',
      },
    ],
    visualCaption: 'Nine-sample Cygnus material rack comparing microgravity burn lengths.',
    imageUrl: '/assets/psi/saffire_pmma_hd.jpg',
    imageCredit: 'NASA JSC / Cygnus · SAFFIRE multi-material PMMA combustion flame in microgravity',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'saffire-cygnus',
  },
  {
    id: 'psi-100',
    psiId: 'PSI-100',
    name: 'SAFFIRE-III',
    fullName: 'Spacecraft Fire Experiment – III',
    experimentType: 'High-Flow Large-Scale Fire',
    category: 'Large-Scale Fire',
    facility: 'Cygnus Uncrewed Cargo Vehicle (OA-7)',
    year: '2017',
    psiVerification: 'verified',
    tagColor: '#4ADE80',
    researchObjective:
      'Measure flame spread acceleration, peak heat release, and gas emissions at elevated spacecraft ventilation speed.',
    shortDescription:
      'Investigated large-scale Sibal fabric combustion at ~0.25 m/s airflow to contrast flame growth against SAFFIRE-I.',
    overviewSummary:
      'By increasing forced airflow from 0.20 m/s (SAFFIRE-I) to 0.25 m/s, SAFFIRE-III showed how cabin HVAC velocity amplifies flame spread rate, plume length, and downstream thermal loading.',
    keyFindings: [
      'Higher ventilation velocity (~0.25 m/s, 25% above SAFFIRE-I) accelerated flame spread compared to 0.20 m/s.',
      'Tracked CO, CO2, O2 depletion, and particulate trends inside a real spacecraft cabin.',
    ],
    resultHighlights: [
      { label: 'Airflow velocity', value: '≈0.25 m/s (25% above SAFFIRE-I)', provenance: 'NASA Measured Data' },
      { label: 'Cabin atmosphere', value: '~21.5% O2 at ~101 kPa', provenance: 'NASA Measured Data' },
    ],
    experimentalData: {
      provenance: 'NASA Measured Data',
      note: 'Published Cygnus OA-7 ventilation velocity and fuel setup.',
      records: [
        { metric: 'Airflow Velocity', value: '~0.25 m/s (25% higher than SAFFIRE-I)', provenance: 'NASA Measured Data' },
        { metric: 'Fuel Sample', value: 'Large Sibal cotton-fiberglass cloth', provenance: 'NASA Measured Data' },
        { metric: 'Time-Series CO ppm Sensor Log', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Cotton-fiberglass blend (Sibal)',
      oxygenConcentration: '~21.5% O2',
      pressure: '~101 kPa',
      airflow: '~0.25 m/s forced flow',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'Cygnus OA-7 uncrewed spacecraft',
      suppressionMethod: 'Controlled burnout / fan shutoff test',
    },
    publications: [
      {
        title: 'Comparison of Flame Spread in SAFFIRE-I and SAFFIRE-III',
        authors: 'P. V. Ferkul, D. L. Urban, G. A. Ruff',
        venue: 'NASA Glenn Research Center / ICES',
        year: '2018',
      },
    ],
    visualCaption: 'SAFFIRE-III accelerated flame front under 0.25 m/s spacecraft airflow.',
    imageUrl: '/assets/psi/saffire3_cygnus.jpg',
    imageCredit: 'NASA ISS Expedition 51 (iss051e039882) · SAFFIRE-III flight module aboard Cygnus OA-7',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'saffire-cygnus',
  },
  {
    id: 'psi-102',
    psiId: 'PSI-102',
    name: 'SAME',
    fullName: 'Smoke Aerosol Measurement Experiment',
    experimentType: 'Smoke Detection & Aerosol Physics',
    category: 'Smoke & Detection',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    year: '2007–2010',
    psiVerification: 'verified',
    tagColor: '#38BDF8',
    researchObjective:
      'Characterize particle size distributions and optical scattering of smoke from overheated spacecraft materials in microgravity.',
    shortDescription:
      'Measured smoke aerosols from Kapton, Teflon, silicone, cotton, and cellulose in 0g to calibrate spacecraft smoke detectors.',
    overviewSummary:
      'In microgravity, smoke particles linger near the heat source longer without rising, allowing coagulation into larger aggregates. SAME showed that detectors calibrated only on Earth 1g smoke can respond differently to early spacecraft fire aerosols.',
    keyFindings: [
      'Microgravity smoke exhibits noticeably larger mean particle diameters than identical 1g burns due to longer residence time and agglomeration.',
      'Provided essential calibration curves for spacecraft photoelectric vs ionization smoke alarms.',
    ],
    resultHighlights: [
      { label: 'Overheated materials', value: 'Teflon, Kapton, silicone, cotton, lampwick', provenance: 'NASA Measured Data' },
      { label: 'Key result', value: 'Larger coagulated smoke particles in 0g than 1g', provenance: 'Published Research Finding' },
    ],
    dataUrl: 'https://doi.org/10.60555/gd4k-8h62',
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published NASA SAME aerosol instrumentation summary.',
      records: [
        { metric: 'Overheated Test Materials', value: 'Teflon, Kapton, Silicone, Cotton, Lampwick', provenance: 'NASA Measured Data' },
        { metric: 'Key Discovery', value: 'Larger coagulated mean particle diameter in 0g vs 1g', provenance: 'Published Research Finding' },
        { metric: 'Raw Nephelometer Count Table', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Pyrolyzing wire insulation (Kapton, Teflon), Silicone, Cellulose',
      oxygenConcentration: '~21% O2 (ISS cabin)',
      pressure: '~101.3 kPa',
      airflow: 'Controlled low-flow aerosol aging chamber',
      temperature: 'Heated pyrolysis (~300 – 500 °C target)',
      experimentalEnvironment: 'ISS Microgravity Science Glovebox (MSG)',
      suppressionMethod: 'Early smoke detection calibration (non-flaming pyrolysis)',
    },
    publications: [
      {
        title: 'Smoke Aerosol Measurement Experiment (SAME) on the International Space Station',
        authors: 'D. L. Urban, G. W. Mulholland, Z. Yuan et al.',
        venue: 'NASA Glenn Research Center / Fire Technology',
        year: '2011',
      },
    ],
    visualCaption: 'Smoke aerosol size distribution shift between 1g buoyant plumes and 0g coagulation.',
    imageUrl: '/assets/psi/same_msg.jpg',
    imageCredit: 'NASA ISS Expedition 15 (iss015e27411) · Smoke Aerosol Measurement Experiment (SAME) in MSG',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'smoke-aerosol',
  },
  {
    id: 'psi-101',
    psiId: 'PSI-101',
    name: 'SAME-R',
    fullName: 'Smoke Aerosol Measurement Experiment – Reflight',
    experimentType: 'Smoke Detector Calibration Reflight',
    category: 'Smoke & Detection',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    year: '2010–2011',
    psiVerification: 'verified',
    tagColor: '#F472B6',
    researchObjective:
      'Validate multi-wavelength light-scattering signatures and aerosol aging dynamics for next-generation spacecraft smoke detectors.',
    shortDescription:
      'Reflight expanding SAME measurements with improved optical scatter diagnostics and detector false-alarm immunity metrics.',
    overviewSummary:
      'SAME-R measured smoke particle aging with multi-wavelength optical sensors, informing smoke-detection design for Orion and future habitats.',
    keyFindings: [
      'Distinguished nuisance dust/condensation aerosols from true pyrolysis smoke in 0g.',
      'Confirmed multi-wavelength optical scatter outperforms single-wavelength alarms in spacecraft ducts.',
    ],
    resultHighlights: [
      { label: 'Detection approach', value: 'Multi-wavelength optical scatter + ionization', provenance: 'Published Research Finding' },
      { label: 'Application', value: 'Orion / Artemis smoke-detector development', provenance: 'Published Research Finding' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published NASA SAME-R optical scattering insights.',
      records: [
        { metric: 'Detection Modality', value: 'Multi-wavelength optical scatter + ionization', provenance: 'Published Research Finding' },
        { metric: 'Target Hardware', value: 'Orion / Artemis Exploration Smoke Detectors', provenance: 'Published Research Finding' },
        { metric: 'Full Scatter Matrix CSV', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Overheated Kapton, Silicone, Cellulose, Cotton wick',
      oxygenConcentration: '~21% O2',
      pressure: '~101.3 kPa',
      airflow: 'Low-flow aging duct',
      temperature: 'Controlled thermal pyrolysis',
      experimentalEnvironment: 'ISS Microgravity Science Glovebox (MSG)',
      suppressionMethod: 'Detection-triggered alarm & ventilation shutoff',
    },
    publications: [
      {
        title: 'Aerosol Properties of Microgravity Smoldering Smoke: SAME & SAME-R',
        authors: 'D. L. Urban, G. W. Mulholland et al.',
        venue: 'AIAA / NASA Technical Memorandum',
        year: '2012',
      },
    ],
    visualCaption: 'Dual-wavelength laser scattering response across coagulating microgravity smoke.',
    imageUrl: '/assets/psi/samer_msg.jpg',
    imageCredit: 'NASA ISS Expedition 15 (iss015e26252) · SAME aerosol diagnostic hardware configuration in MSG',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'smoke-aerosol',
  },
  {
    id: 'psi-20',
    psiId: 'PSI-20',
    name: 'ACME BRE',
    fullName: 'Burning Rate Emulator',
    experimentType: 'Gaseous Emulation of Solid Flammability',
    category: 'Gaseous & ACME',
    facility: 'ISS Combustion Integrated Rack (CIR / ACME)',
    year: '2017–2021',
    psiVerification: 'unverified',
    tagColor: '#FFE14D',
    researchObjective:
      'Emulate solid material flammability using a flat porous gaseous burner to measure heat feedback and extinction limits cleanly.',
    shortDescription:
      'Used ethylene/methane/nitrogen mixtures on a flat porous burner in CIR to replicate solid polymer burning rates.',
    overviewSummary:
      'BRE replaced complex solid polymers with precisely metered gaseous fuels flowing through a flat porous plate, isolating gas-phase heat transfer and radiative extinction limits without charring uncertainties.',
    keyFindings: [
      'Successfully replicated solid-fuel extinction boundaries using gaseous fuel mixtures in 0g.',
      'Quantified conductive and radiative heat feedback back to the fuel surface.',
    ],
    resultHighlights: [
      { label: 'Emulated fuels', value: 'Ethylene / methane with N2 dilution', provenance: 'NASA Measured Data' },
      { label: 'Facility', value: 'ACME insert in the ISS Combustion Integrated Rack', provenance: 'NASA Measured Data' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published ACME BRE test configuration.',
      records: [
        { metric: 'Gaseous Fuels', value: 'Ethylene, Methane with Nitrogen dilution', provenance: 'NASA Measured Data' },
        { metric: 'Chamber Facility', value: 'ACME insert inside ISS CIR', provenance: 'NASA Measured Data' },
        { metric: 'Burner Heat Flux Array', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Gaseous Ethylene / Methane (solid-material emulator)',
      oxygenConcentration: 'Varied O2 / N2 mixtures in CIR',
      pressure: 'Varied sub-atmospheric to 1 atm',
      airflow: 'Quiescent & low cross-flow',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'ISS Combustion Integrated Rack (ACME)',
      suppressionMethod: 'Fuel flow reduction & radiative extinction',
    },
    publications: [
      {
        title: 'Burning Rate Emulator (BRE) Microgravity Experiment Overview',
        authors: 'NASA ACME BRE Science Team',
        venue: 'NASA PSI investigation summary',
        year: '2017–2021',
      },
    ],
    visualCaption: 'ACME facility hardware aboard the ISS CIR (photo shows hardware, not the BRE burner flame).',
    imageUrl: '/assets/psi/acme_bre_burner.jpg',
    imageCredit: 'NASA Glenn (GRC-2016-C-05051) · ACME hardware for CIR — not a BRE burner-flame photograph',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'acme-gaseous',
  },
  {
    id: 'psi-106',
    psiId: 'PSI-106',
    name: 'SLICE',
    fullName: 'Structure and Liftoff in Combustion Experiment',
    experimentType: 'Coflow Laminar Jet Flame Structure',
    category: 'Gaseous & ACME',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    year: '2012–2013',
    psiVerification: 'verified',
    tagColor: '#CBBDFB',
    researchObjective:
      'Measure flame liftoff, blowout, and structure of laminar coflow jet flames free of buoyancy-induced flicker.',
    shortDescription:
      'Studied methane and diluted ethylene jet flames inside a concentric coflow air duct in microgravity.',
    overviewSummary:
      'Removing gravitational buoyancy allowed SLICE researchers to observe steady laminar jet flame stabilization and liftoff heights at conditions impossible to maintain steadily on Earth.',
    keyFindings: [
      'Demonstrated how radial diffusion dominates flame width and liftoff height in 0g.',
      'Validated axisymmetric laminar flame simulation codes without buoyancy turbulence.',
    ],
    resultHighlights: [
      { label: 'Fuels', value: 'Methane and N2-diluted ethylene', provenance: 'NASA Measured Data' },
      { label: 'Configuration', value: 'Concentric laminar coflow in the MSG', provenance: 'NASA Measured Data' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Verified from NASA SLICE experiment summary.',
      records: [
        { metric: 'Jet Fuels', value: 'Methane, N2-diluted Ethylene', provenance: 'NASA Measured Data' },
        { metric: 'Coflow Geometry', value: 'Concentric laminar air coflow in MSG', provenance: 'NASA Measured Data' },
        { metric: 'Optical Liftoff Height Log', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Gaseous Methane & Diluted Ethylene',
      oxygenConcentration: '~21% O2 coflow air',
      pressure: '~101.3 kPa',
      airflow: 'Laminar concentric coflow',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'ISS Microgravity Science Glovebox (MSG)',
      suppressionMethod: 'Fuel shutoff / coflow blowout limit',
    },
    publications: [
      {
        title: 'Structure and Liftoff of Microgravity Coflow Diffusion Flames (SLICE)',
        authors: 'M. B. Long, M. D. Smooke, P. B. Sunderland',
        venue: 'Combustion and Flame',
        year: '2014',
      },
    ],
    visualCaption: 'Axisymmetric lifted laminar jet flame stabilized in microgravity coflow.',
    imageUrl: '/assets/psi/slice_coflow_flame.jpg',
    imageCredit: 'NASA Glenn (9902616) · Coflow laminar methane flame transition to lifted blue flame',
    imageType: 'nasa',
    imageFit: 'contain',
    thumbnailVariant: 'jet-soot',
  },
  {
    id: 'psi-107',
    psiId: 'PSI-107',
    name: 'SPICE',
    fullName: 'Smoke Point in Coflow Experiment',
    experimentType: 'Soot Inception & Smoke Point',
    category: 'Smoke & Detection',
    facility: 'ISS Microgravity Science Glovebox (MSG)',
    year: '2009–2012',
    psiVerification: 'verified',
    tagColor: '#F26C57',
    researchObjective:
      'Determine the smoke-point flame height (threshold where soot escapes unburned) for gaseous hydrocarbon flames in microgravity.',
    shortDescription:
      'Measured ethylene and propane coflow jet flames in 0g, showing soot emits at much lower fuel flow rates than on Earth.',
    overviewSummary:
      'Without buoyant acceleration to thin and stretch a flame, fuel molecules spend far longer in hot oxygen-lean zones—causing SPICE flames to produce soot much more readily than identical 1g flames.',
    keyFindings: [
      'Microgravity smoke-point fuel flow thresholds are significantly lower than 1g buoyant flames.',
      'Higher radiative heat loss from dense soot clouds alters flame temperature and visible glow.',
    ],
    resultHighlights: [
      { label: 'Fuels', value: 'Ethylene and propane coflow flames', provenance: 'NASA Measured Data' },
      { label: 'Key result', value: 'Earlier soot inception in 0g than in 1g', provenance: 'Published Research Finding' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published SPICE soot inception behavior.',
      records: [
        { metric: 'Gaseous Fuels', value: 'Ethylene, Propane', provenance: 'NASA Measured Data' },
        { metric: 'Key Finding', value: 'Earlier soot inception & emission in 0g vs 1g', provenance: 'Published Research Finding' },
        { metric: 'Soot Volume Fraction Profile', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Gaseous Ethylene & Propane',
      oxygenConcentration: '~21% O2 coflow air',
      pressure: '~101.3 kPa',
      airflow: 'Laminar coflow air stream',
      temperature: 'Experimental data not available.',
      experimentalEnvironment: 'ISS Microgravity Science Glovebox (MSG)',
      suppressionMethod: 'Solenoid fuel valve shutoff',
    },
    publications: [
      {
        title: 'Smoke Point in Coflow Experiment (SPICE) on the International Space Station',
        authors: 'D. L. Urban, P. B. Sunderland, Z.-G. Yuan',
        venue: 'AIAA Aerospace Sciences / Combustion & Flame',
        year: '2013',
      },
    ],
    visualCaption: 'Luminous soot wing formation along a microgravity ethylene coflow flame.',
    imageUrl: '/assets/psi/spice_soot_flame.jpg',
    imageCredit: 'NASA Glenn (9902588) · Laser-induced incandescence soot distribution imaging in 0g',
    imageType: 'nasa',
    imageFit: 'contain',
    thumbnailVariant: 'jet-soot',
  },
  {
    id: 'psi-159',
    psiId: 'PSI-159',
    name: 'ACME CFI-G',
    fullName: 'Cool Flame Investigation with Gases',
    experimentType: 'Gaseous Cool Flame Chemistry',
    category: 'Gaseous & ACME',
    facility: 'ISS Combustion Integrated Rack (CIR / ACME)',
    year: '2021–2022',
    psiVerification: 'unverified',
    tagColor: '#8FD8F8',
    researchObjective:
      'Generate and stabilize steady-state gaseous cool flames without liquid droplets in microgravity.',
    shortDescription:
      'Used gaseous hydrocarbon flows inside ACME to sustain pure gas-phase cool flames in 0g without ozone sensitization.',
    overviewSummary:
      'Building on FLEX droplet discoveries, ACME CFI-G proved that steady low-temperature cool flames can exist purely in gas-phase burner systems—helping engineers develop cleaner engines and recognize non-visible spacecraft fire signatures.',
    keyFindings: [
      'Achieved steady-state burner-stabilized gaseous cool flames in microgravity.',
      'Provided clean chemical kinetic benchmarks for low-temperature hydrocarbon oxidation.',
    ],
    resultHighlights: [
      { label: 'Combustion regime', value: 'Gaseous cool flames without ozone enhancement', provenance: 'Published Research Finding' },
      { label: 'Facility', value: 'ACME insert in the ISS Combustion Integrated Rack', provenance: 'NASA Measured Data' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published NASA ACME CFI-G campaign summary.',
      records: [
        { metric: 'Oxidizer', value: 'O2 / N2 mixtures (no ozone sensitization)', provenance: 'Published Research Finding' },
        { metric: 'Facility', value: 'ISS CIR / ACME', provenance: 'NASA Measured Data' },
        { metric: 'OH* Chemiluminescence Dataset', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Gaseous hydrocarbons (e.g., DME / butane / propane mixtures)',
      oxygenConcentration: 'Controlled O2 / N2 mixtures',
      pressure: 'Controlled CIR chamber pressure',
      airflow: 'Steady laminar burner flow',
      temperature: 'Low-temperature cool-flame regime',
      experimentalEnvironment: 'ISS Combustion Integrated Rack (ACME)',
      suppressionMethod: 'Fuel flow cutoff & diluent inerting',
    },
    publications: [
      {
        title: 'Cool Flame Investigation with Gases (CFI-G) aboard the ISS',
        authors: 'NASA CFI-G Science Team',
        venue: 'NASA PSI investigation summary',
        year: '2021–2022',
      },
    ],
    visualCaption: 'ACME/CIR facility hardware used for CFI-G operations (not a cool-flame image).',
    imageUrl: '/assets/psi/acme_cir.jpg',
    imageCredit: 'NASA ISS (iss056e130654) · Combustion Integrated Rack (CIR) open for ACME operations',
    imageType: 'nasa',
    imageFit: 'contain',
    thumbnailVariant: 'acme-gaseous',
  },
  {
    id: 'psi-39',
    psiId: 'PSI-39',
    name: 'CFI',
    fullName: 'Cool Flames Investigation',
    experimentType: 'Low-Temperature Cool Flame Transitions',
    category: 'Droplet & Cool Flame',
    facility: 'ISS Combustion Integrated Rack (CIR)',
    year: '2016–2019',
    psiVerification: 'unverified',
    tagColor: '#F7B2D9',
    researchObjective:
      'Investigate ignition, persistence, and extinction transitions between hot flames and low-temperature cool flames.',
    shortDescription:
      'Mapped conditions under which hydrocarbon fuels sustain invisible or dim cool flames in microgravity.',
    overviewSummary:
      'CFI isolated the thermo-chemical transition between high-temperature soot-producing combustion and low-temperature cool flames, demonstrating critical safety implications when spacecraft fire sensors rely solely on visible brightness.',
    keyFindings: [
      'Demonstrated re-ignition risks if fresh oxygen reaches partially oxidized cool-flame vapors.',
      'Reinforced the requirement for multi-species gas sensing (CO, formaldehyde, IR) in habitats.',
    ],
    resultHighlights: [
      { label: 'Combustion regime', value: 'Low-temperature cool flame and two-stage ignition', provenance: 'Published Research Finding' },
      { label: 'Detection lesson', value: 'Dim or near-invisible flames require non-optical sensing', provenance: 'Published Research Finding' },
    ],
    experimentalData: {
      provenance: 'Published Research Finding',
      note: 'Published NASA PSI CFI overview.',
      records: [
        { metric: 'Combustion Regime', value: 'Low-temperature cool flame & two-stage ignition', provenance: 'Published Research Finding' },
        { metric: 'Visibility', value: 'Extremely dim / near-invisible to standard video', provenance: 'Published Research Finding' },
        { metric: 'IR Radiometer Raw Data', value: 'Experimental data not available.', provenance: 'Published Research Finding' },
      ],
    },
    parameters: {
      fuelType: 'Hydrocarbon liquid & vapor fuels (e.g., n-alkanes)',
      oxygenConcentration: 'Varied O2 / N2 / CO2 CIR atmospheres',
      pressure: 'Varied chamber pressures',
      airflow: 'Quiescent microgravity',
      temperature: 'Low-temp cool-flame oxidation (~500 – 800 K)',
      experimentalEnvironment: 'ISS Combustion Integrated Rack (CIR)',
      suppressionMethod: 'Diluent inerting & thermal quenching',
    },
    publications: [
      {
        title: 'Cool Flames Investigation (CFI): Microgravity Cool-Flame Behavior',
        authors: 'NASA CFI Science Team',
        venue: 'NASA PSI investigation summary',
        year: '2016–2019',
      },
    ],
    visualCaption: 'Microgravity droplet cool-flame sequence from CIR/MDCA imagery, illustrative of CFI behavior.',
    imageUrl: '/assets/psi/cfi_cool_flame.gif',
    imageCredit: 'NASA ISS CIR / MDCA · Microgravity droplet cool-flame combustion sequence',
    imageType: 'nasa',
    imageFit: 'cover',
    thumbnailVariant: 'droplet-cool-flame',
  },
];

export const INTELLIGENCE_TOPICS: IntelligenceTopic[] = [
  {
    id: 'oxygen',
    label: 'Oxygen Concentration',
    title: 'Oxygen & Pressure Regimes Across Space Habitats',
    provenance: 'Published Research Finding',
    insight:
      'Moon and Mars exploration habitats propose lower total pressure (~56.5 kPa) with higher oxygen percentage (~34% O2) to reduce EVA pre-breathe time—raising material ignition sensitivity compared to 21% O2 ISS air. The EMU suit itself operates at roughly pure oxygen and 29.6 kPa.',
    chartType: 'bar',
    xKey: 'habitat',
    series: [
      { key: 'o2Percent', label: 'Oxygen % (Published Target)', color: '#FFE14D' },
      { key: 'pressureKpa', label: 'Total Pressure (kPa)', color: '#9BE2FF' },
    ],
    unitNote: 'Published NASA atmosphere targets (ISS, exploration habitat, and EMU suit) — not continuous cabin measurements.',
    data: [
      { habitat: 'ISS Cabin', o2Percent: 21, pressureKpa: 101.3 },
      { habitat: 'Cygnus SAFFIRE', o2Percent: 21.7, pressureKpa: 101.0 },
      { habitat: 'Exploration Norm', o2Percent: 34, pressureKpa: 56.5 },
      { habitat: 'EMU Suit (pure O2)', o2Percent: 100, pressureKpa: 29.6 },
    ],
    relatedPsiIds: ['PSI-25', 'PSI-98', 'PSI-99'],
  },
  {
    id: 'flammability',
    label: 'Fuel Flammability',
    title: 'Material Flammability Sensitivity Trends (Illustrative Physics)',
    provenance: 'Illustrative Demonstration Data',
    insight:
      'Tested across SAFFIRE-II (PSI-99) and BASS (PSI-26): thin cellulosic fabrics (Sibal cloth) and PMMA ignite more readily in low-speed 0g flows than thermally thick flame-retardant Nomex or silicone composites.',
    chartType: 'bar',
    xKey: 'material',
    series: [
      { key: 'relativeSpread', label: 'Relative Microgravity Spread Index (Illustrative)', color: '#F472B6' },
      { key: 'smokeYield', label: 'Relative Aerosol Yield (Illustrative)', color: '#CBBDFB' },
    ],
    unitNote: 'Illustrative comparative scale (0–100) reflecting published qualitative NASA rankings — not raw PSI telemetry.',
    data: [
      { material: 'Sibal Fabric', relativeSpread: 82, smokeYield: 64 },
      { material: 'PMMA Acrylic', relativeSpread: 68, smokeYield: 58 },
      { material: 'Silicone', relativeSpread: 34, smokeYield: 72 },
      { material: 'Nomex FR', relativeSpread: 18, smokeYield: 26 },
    ],
    relatedPsiIds: ['PSI-99', 'PSI-26', 'PSI-102'],
  },
  {
    id: 'airflow',
    label: 'Airflow Effects',
    title: 'How Low-Speed Microgravity Airflow Fuels Flame Spread',
    provenance: 'Illustrative Demonstration Data',
    insight:
      'In 0g, stagnant air can starve a small flame of oxygen, whereas gentle HVAC airflow (0.05–0.25 m/s, studied in BASS & SAFFIRE-I/III) supplies oxidizer directly to the reaction zone and accelerates spread.',
    chartType: 'area',
    xKey: 'flow',
    series: [
      { key: 'spreadIndex', label: 'Relative Flame Spread Trend (0g)', color: '#38BDF8' },
    ],
    unitNote: 'Physical trend based on BASS (0–0.55 m/s) and SAFFIRE-I (0.20 m/s) vs SAFFIRE-III (0.25 m/s) findings.',
    data: [
      { flow: '0.00 m/s', spreadIndex: 12 },
      { flow: '0.05 m/s', spreadIndex: 44 },
      { flow: '0.15 m/s', spreadIndex: 68 },
      { flow: '0.20 m/s', spreadIndex: 76 },
      { flow: '0.25 m/s', spreadIndex: 88 },
      { flow: '0.55 m/s', spreadIndex: 81 },
    ],
    relatedPsiIds: ['PSI-26', 'PSI-98', 'PSI-100'],
  },
  {
    id: 'spread',
    label: 'Flame Spread',
    title: 'Buoyant 1g vs Microgravity 0g Combustion Behavior',
    provenance: 'Illustrative Demonstration Data',
    insight:
      'Without buoyancy stretching the flame upward, 0g flames burn more spherically with longer gas residence times, shifting soot formation (SPICE PSI-107) and allowing cool flames to persist (FLEX PSI-69).',
    chartType: 'bar',
    xKey: 'regime',
    series: [
      { key: 'residenceTime', label: 'Relative Residence Time', color: '#FFE14D' },
      { key: 'radiativeLoss', label: 'Radiative Heat Fraction', color: '#F26C57' },
    ],
    unitNote: 'Illustrative comparative physics summary derived from SLICE, SPICE, and FLEX publications.',
    data: [
      { regime: 'Earth 1g Buoyant', residenceTime: 30, radiativeLoss: 25 },
      { regime: 'ISS 0g Quiescent', residenceTime: 88, radiativeLoss: 74 },
      { regime: 'ISS 0g Low-Flow', residenceTime: 65, radiativeLoss: 56 },
      { regime: '1/6g Lunar Est.', residenceTime: 62, radiativeLoss: 50 },
    ],
    relatedPsiIds: ['PSI-106', 'PSI-107', 'PSI-69'],
  },
  {
    id: 'suppression',
    label: 'Fire Suppression',
    title: 'Spacecraft Suppression Mechanisms Studied in PSI',
    provenance: 'Illustrative Demonstration Data',
    insight:
      'BASS tested how cutting ventilation airflow and adding inert gas dilution (N2, CO2, or He) can quench microgravity solid-fuel flames; operators must still watch for invisible cool-flame re-ignition.',
    chartType: 'bar',
    xKey: 'method',
    series: [
      { key: 'eclssCompatibility', label: 'ECLSS Recovery Score (Qual.)', color: '#4ADE80' },
      { key: 'knockdownSpeed', label: 'Microgravity Effectiveness', color: '#38BDF8' },
    ],
    unitNote: 'Qualitative engineering comparison grounded in ISS suppression protocols & BASS/FLEX diluent tests.',
    data: [
      { method: 'Fan Cutoff + N2', eclssCompatibility: 95, knockdownSpeed: 80 },
      { method: 'CO2 Extinguisher', eclssCompatibility: 78, knockdownSpeed: 88 },
      { method: 'Fine Water Mist', eclssCompatibility: 86, knockdownSpeed: 84 },
      { method: 'Depressurization', eclssCompatibility: 50, knockdownSpeed: 98 },
    ],
    relatedPsiIds: ['PSI-26', 'PSI-69', 'PSI-68'],
  },
  {
    id: 'smoke',
    label: 'Smoke Detection',
    title: 'Smoke Particle Coagulation: 1g Plumes vs 0g Microgravity',
    provenance: 'Illustrative Demonstration Data',
    insight:
      'SAME (PSI-102) and SAME-R (PSI-101) revealed that reduced buoyancy gives nascent smoke aerosols extra time to collide and coagulate, shifting particle diameter upward and demanding dual-wavelength photoelectric detection.',
    chartType: 'area',
    xKey: 'agingStage',
    series: [
      { key: 'microgravitySize', label: '0g Mean Particle Trend', color: '#F472B6' },
      { key: 'earthSize', label: '1g Mean Particle Trend', color: '#94A3B8' },
    ],
    unitNote: 'Illustrative aerosol coagulation trend based on SAME & SAME-R published findings (exact nm logs unavailable).',
    data: [
      { agingStage: 'Ignition', microgravitySize: 22, earthSize: 18 },
      { agingStage: '+15s Aging', microgravitySize: 48, earthSize: 24 },
      { agingStage: '+30s Aging', microgravitySize: 72, earthSize: 28 },
      { agingStage: '+60s Duct', microgravitySize: 89, earthSize: 31 },
    ],
    relatedPsiIds: ['PSI-102', 'PSI-101'],
  },
];

export const RESEARCH_LIBRARY_DOCS: ResearchDocument[] = [
  {
    id: 'doc-flex-cool',
    docCode: 'NASA-PSI-69',
    title: 'Dual-Stage Cool Flame Extinction in Microgravity Droplets',
    category: 'Combustion Physics',
    psiRef: 'PSI-69 · PSI-68 · PSI-39',
    year: '2012–2019',
    provenance: 'Published Research Finding',
    summary:
      'Documents how n-heptane droplets continue oxidizing at ~500–800 K after visible radiative extinction inside the ISS Combustion Integrated Rack.',
    keyTakeaways: [
      'Hot flame extinction does not guarantee total reaction termination.',
      'Optical camera detection alone can miss pale/invisible cool flames.',
      'CO and hydroperoxide intermediate monitoring improves early warning.',
    ],
  },
  {
    id: 'doc-saffire-cygnus',
    docCode: 'NASA-PSI-98/100',
    title: 'SAFFIRE Large-Scale Spacecraft Fire Growth & Material Benchmarking',
    category: 'Spacecraft Standards',
    psiRef: 'PSI-98 · PSI-99 · PSI-100',
    year: '2016–2018',
    provenance: 'NASA Measured Data',
    summary:
      'Full-scale Cygnus burn tests bridging small glovebox coupons with realistic 0.4 m × 0.94 m fabrics under 0.20–0.25 m/s cabin airflows.',
    keyTakeaways: [
      'Increased ventilation (0.25 vs 0.20 m/s) accelerates spread rate.',
      'Nine-material benchmark tests inform NASA-STD-6001 upward-burn criteria.',
      'Validates computational spacecraft fire propagation models.',
    ],
  },
  {
    id: 'doc-same-smoke',
    docCode: 'NASA-PSI-102',
    title: 'Microgravity Smoke Aerosol Size Distributions & Detector Calibration',
    category: 'Smoke & Aerosols',
    psiRef: 'PSI-102 · PSI-101',
    year: '2011–2012',
    provenance: 'Published Research Finding',
    summary:
      'Demonstrates smoke particle coagulation into larger optical-scattering sizes in microgravity compared to Earth-normal 1g buoyant plumes.',
    keyTakeaways: [
      '0g smoke shifts toward larger particle diameters due to longer residence times.',
      'Multi-wavelength optical sensors reduce nuisance false alarms on ISS and Orion.',
      'Sample duct placement along HVAC return loops is critical.',
    ],
  },
  {
    id: 'doc-bass-suppression',
    docCode: 'NASA-PSI-26/25',
    title: 'Solid Fuel Extinction & Exploration Atmosphere Fire Safety',
    category: 'Suppression & Habitats',
    psiRef: 'PSI-26 · PSI-25 · PSI-20',
    year: '2014–2020',
    provenance: 'Published Research Finding',
    summary:
      'Quantifies minimum oxygen and airflow limits for PMMA, Sibal cloth, and Nomex, guiding suppression and habitat atmosphere choices.',
    keyTakeaways: [
      'Very low cabin airflow sustains burning below quiescent extinction thresholds.',
      'Nitrogen dilution and airflow shutdown reliably suppress solid-fuel flames.',
      'Guides material selection for 34% O2 / 56.5 kPa Moon and Mars habitats.',
    ],
  },
];

export const SUGGESTED_COPILOT_QUESTIONS = [
  'How does fire behave in microgravity?',
  'Which materials are more flammable?',
  'How does oxygen concentration affect combustion?',
  'What did NASA FLEX experiments discover?',
  'What fire safety lessons are relevant to Moon habitats?',
];
