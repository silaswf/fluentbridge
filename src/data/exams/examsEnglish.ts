/**
 * @file src/data/exams/examsEnglish.ts
 * @description Banco de simulados oficiais cronometrados (English).
 * @exports ENGLISH_MOCK_EXAMS
 */
import type { MockExam } from '../../types/exams';

export const ENGLISH_MOCK_EXAMS: MockExam[] = [
  // =========================================================================
  // IELTS ACADEMIC (Simulations 1-4)
  // =========================================================================
  {
    id: 'ielts-sim-1',
    examTypeId: 'ielts',
    languageCode: 'en',
    simulationNumber: 1,
    title: 'IELTS Academic — Simulado 1: Urban Ecology & Climate',
    targetCefr: 'B2',
    durationMinutes: 35,
    questions: [
      {
        id: 'ielts-sim-1-q1',
        section: 'reading',
        passageTitle: 'Vertical Forests and Urban Microclimates',
        passageText:
          'Over the past decade, architects in Milan, Singapore, and Toronto have integrated thousands of shrubs and medium-sized trees directly into the facades of high-rise residential towers. Far from serving purely aesthetic purposes, these "vertical forests" measurably alter local microclimates. Thermal imaging conducted during peak summer months indicates that vegetated facades can reduce exterior wall surface temperatures by up to 12°C compared with conventional glass-and-concrete towers, thereby lowering indoor air-conditioning demand. However, structural engineers caution that supporting saturated soil beds and wind-exposed canopies requires reinforced cantilevers and specialized irrigation networks, increasing initial construction outlays by roughly 5 to 8 percent.',
        prompt: 'According to the passage, what is one measurable effect of vegetated high-rise facades?',
        options: [
          'They eliminate the need for mechanical air-conditioning entirely.',
          'They significantly lower the surface temperature of exterior walls.',
          'They reduce initial building construction costs by 5 to 8 percent.',
          'They prevent strong winds from reaching upper residential floors.',
        ],
        correctIndex: 1,
        explanation:
          'The passage states that vegetated facades can reduce exterior wall surface temperatures by up to 12°C compared with conventional towers.',
      },
      {
        id: 'ielts-sim-1-q2',
        section: 'reading',
        passageTitle: 'Vertical Forests and Urban Microclimates',
        passageText:
          'Over the past decade, architects in Milan, Singapore, and Toronto have integrated thousands of shrubs and medium-sized trees directly into the facades of high-rise residential towers. Far from serving purely aesthetic purposes, these "vertical forests" measurably alter local microclimates. Thermal imaging conducted during peak summer months indicates that vegetated facades can reduce exterior wall surface temperatures by up to 12°C compared with conventional glass-and-concrete towers, thereby lowering indoor air-conditioning demand. However, structural engineers caution that supporting saturated soil beds and wind-exposed canopies requires reinforced cantilevers and specialized irrigation networks, increasing initial construction outlays by roughly 5 to 8 percent.',
        prompt: 'What reservation do structural engineers express about vertical forests?',
        options: [
          'Residents rarely maintain the plants on private balconies.',
          'Glass-and-concrete towers are more visually appealing in dense cities.',
          'Additional structural reinforcement and irrigation raise upfront costs.',
          'Thermal imaging is unreliable during peak summer months.',
        ],
        correctIndex: 2,
        explanation:
          'Engineers note that reinforced cantilevers and specialized irrigation networks increase initial construction outlays by 5 to 8 percent.',
      },
      {
        id: 'ielts-sim-1-q3',
        section: 'listening',
        audioText:
          'Welcome to the University Sustainability Office briefing. Before you submit your fieldwork proposals for the coastal marsh survey, please note two administrative updates. First, the boat transfer from Pier 4 will depart at 7:15 a.m. sharp rather than 8:00 a.m. due to the low tide schedule. Second, while waterproof boots are provided by the department, every participant must bring their own calibrated salinity meter; we ran out of spare units after last week’s undergraduate trip.',
        audioPlaysLimit: 2,
        prompt: 'Why has the boat departure time been moved to 7:15 a.m.?',
        options: [
          'To allow extra time for distributing waterproof boots.',
          'Because of the timing of the low tide.',
          'Because undergraduate students booked the pier at 8:00 a.m.',
          'To give researchers time to calibrate their salinity meters.',
        ],
        correctIndex: 1,
        explanation:
          'The speaker explicitly mentions that the boat will depart at 7:15 a.m. sharp "due to the low tide schedule."',
      },
      {
        id: 'ielts-sim-1-q4',
        section: 'listening',
        audioText:
          'Welcome to the University Sustainability Office briefing. Before you submit your fieldwork proposals for the coastal marsh survey, please note two administrative updates. First, the boat transfer from Pier 4 will depart at 7:15 a.m. sharp rather than 8:00 a.m. due to the low tide schedule. Second, while waterproof boots are provided by the department, every participant must bring their own calibrated salinity meter; we ran out of spare units after last week’s undergraduate trip.',
        audioPlaysLimit: 2,
        prompt: 'Which item must participants supply themselves?',
        options: [
          'Waterproof boots',
          'Fieldwork proposal forms',
          'Pier 4 boarding passes',
          'A calibrated salinity meter',
        ],
        correctIndex: 3,
        explanation:
          'Boots are provided by the department, but every participant must bring their own calibrated salinity meter.',
      },
      {
        id: 'ielts-sim-1-q5',
        section: 'language_use',
        prompt: 'Choose the most accurate academic collocation to complete the sentence: "The longitudinal study _____ compelling evidence that early wetland restoration mitigates seasonal flooding."',
        options: [
          'yielded',
          'manufactured',
          'performed',
          'insisted',
        ],
        correctIndex: 0,
        explanation:
          '"Yielded evidence" is a standard formal academic collocation meaning produced or provided evidence.',
      },
      {
        id: 'ielts-sim-1-q6',
        section: 'language_use',
        prompt: 'Select the grammatically correct sentence for an IELTS Task 2 essay:',
        options: [
          'Not only urban trees absorb carbon, but they also cool pavements.',
          'Not only do urban trees absorb carbon, but they also cool pavements.',
          'Not only urban trees do absorb carbon, they also cool pavements.',
          'Urban trees not only absorbing carbon, but also cooling pavements.',
        ],
        correctIndex: 1,
        explanation:
          'When "Not only" begins a clause, subject-auxiliary inversion ("do urban trees absorb") is required.',
      },
    ],
    writingTask: {
      prompt:
        'IELTS Writing Task 2: In many rapidly growing cities, green spaces are being replaced by commercial and residential developments. Do the advantages of urban expansion outweigh the disadvantages of losing public parks? Give reasons for your answer and include relevant examples.',
      minWords: 150,
      rubricCriteria: [
        'Clear thesis addressing whether advantages outweigh disadvantages',
        'Coherent paragraphing with topic sentences and linking devices',
        'Appropriate academic register and lexical variety',
        'Accurate complex sentence structures',
      ],
      expectedKeywords: ['urban', 'green spaces', 'development', 'public health', 'infrastructure', 'balance'],
      modelAnswer:
        'Rapid urbanization has placed unprecedented pressure on municipal land, often resulting in the conversion of public parks into housing and commercial complexes. While expanding urban infrastructure offers undeniable economic benefits, I believe the long-term disadvantages of losing green spaces far outweigh these short-term gains.\n\nOn the one hand, constructing new residential towers and business districts addresses acute housing shortages and stimulates local employment. Compact, high-density development can also shorten commuting distances when paired with reliable public transit. Nevertheless, these advantages are severely undermined if cities become inhospitable environments.\n\nPublic parks play an irreplaceable role in regulating urban temperatures, absorbing stormwater, and supporting residents’ mental well-being. Without accessible green corridors, cities suffer from intensified heat-island effects and rising healthcare costs linked to sedentary lifestyles. Therefore, municipal planners should prioritize brownfield redevelopment and vertical growth rather than sacrificing vital ecological spaces.',
    },
  },
  {
    id: 'ielts-sim-2',
    examTypeId: 'ielts',
    languageCode: 'en',
    simulationNumber: 2,
    title: 'IELTS Academic — Simulado 2: Cognitive Science & Memory',
    targetCefr: 'C1',
    durationMinutes: 35,
    questions: [
      {
        id: 'ielts-sim-2-q1',
        section: 'reading',
        passageTitle: 'The Spacing Effect in Long-Term Retention',
        passageText:
          'Since Hermann Ebbinghaus first plotted forgetting curves in the late nineteenth century, cognitive psychologists have repeatedly demonstrated that distributing study sessions over time—known as the spacing effect—produces markedly superior recall compared with massed practice, or "cramming." Recent neuroimaging research clarifies why this occurs: when learners retrieve information after a partial delay, the hippocampus must reconstruct neural pathways under mild difficulty, strengthening synaptic consolidation. Conversely, immediate repetition relies heavily on short-term working memory, creating an illusion of mastery that dissipates rapidly once testing is postponed by several weeks.',
        prompt: 'Why does "cramming" create a false sense of competence according to the passage?',
        options: [
          'It overstimulates the hippocampus during sleep.',
          'It depends on working memory rather than deep synaptic consolidation.',
          'It completely eliminates forgetting curves within a few days.',
          'It prevents learners from using neuroimaging feedback.',
        ],
        correctIndex: 1,
        explanation:
          'Immediate repetition relies on short-term working memory, creating an illusion of mastery that fades when testing is delayed.',
      },
      {
        id: 'ielts-sim-2-q2',
        section: 'reading',
        passageTitle: 'The Spacing Effect in Long-Term Retention',
        passageText:
          'Since Hermann Ebbinghaus first plotted forgetting curves in the late nineteenth century, cognitive psychologists have repeatedly demonstrated that distributing study sessions over time—known as the spacing effect—produces markedly superior recall compared with massed practice, or "cramming." Recent neuroimaging research clarifies why this occurs: when learners retrieve information after a partial delay, the hippocampus must reconstruct neural pathways under mild difficulty, strengthening synaptic consolidation. Conversely, immediate repetition relies heavily on short-term working memory, creating an illusion of mastery that dissipates rapidly once testing is postponed by several weeks.',
        prompt: 'In the context of the passage, the word "dissipates" is closest in meaning to:',
        options: [
          'accelerates',
          'stabilizes',
          'fades away',
          'multiplies',
        ],
        correctIndex: 2,
        explanation:
          '"Dissipates rapidly" means disappears or fades away quickly.',
      },
      {
        id: 'ielts-sim-2-q3',
        section: 'listening',
        audioText:
          'Tutor: So Maya, how is your dissertation literature review progressing? Maya: Well, Dr. Patel, I initially planned to compare bilingualism effects in both children and older adults, but after reading forty papers, I realized the scope is far too broad for a ten-thousand-word thesis. Tutor: That’s a sensible realization. Narrowing it to executive function in older bilinguals will let you critique the methodology of the three landmark studies in real depth.',
        audioPlaysLimit: 2,
        prompt: 'Why did Maya decide to modify her dissertation plan?',
        options: [
          'She could not find enough published papers on older adults.',
          'Dr. Patel instructed her to shorten the word count.',
          'Her original comparison was too wide for the thesis length.',
          'The three landmark studies were retracted.',
        ],
        correctIndex: 2,
        explanation:
          'Maya realized the scope of comparing both age groups was "far too broad for a ten-thousand-word thesis."',
      },
      {
        id: 'ielts-sim-2-q4',
        section: 'listening',
        audioText:
          'Tutor: So Maya, how is your dissertation literature review progressing? Maya: Well, Dr. Patel, I initially planned to compare bilingualism effects in both children and older adults, but after reading forty papers, I realized the scope is far too broad for a ten-thousand-word thesis. Tutor: That’s a sensible realization. Narrowing it to executive function in older bilinguals will let you critique the methodology of the three landmark studies in real depth.',
        audioPlaysLimit: 2,
        prompt: 'What does Dr. Patel suggest Maya will now be able to do?',
        options: [
          'Examine the research methods of key studies more thoroughly.',
          'Finish her literature review without reading further papers.',
          'Conduct original neuroimaging experiments on children.',
          'Expand her thesis beyond ten thousand words.',
        ],
        correctIndex: 0,
        explanation:
          'Dr. Patel says narrowing the topic will let her "critique the methodology of the three landmark studies in real depth."',
      },
      {
        id: 'ielts-sim-2-q5',
        section: 'language_use',
        prompt: 'Complete the sentence with the most appropriate hedging expression: "The correlation between sleep deprivation and error rates _____ that shift schedules should be reconsidered."',
        options: [
          'proves beyond any doubt',
          'strongly suggests',
          'forces everyone to agree',
          'is totally obvious',
        ],
        correctIndex: 1,
        explanation:
          'Academic writing in IELTS favors cautious hedging such as "strongly suggests" over absolute claims.',
      },
      {
        id: 'ielts-sim-2-q6',
        section: 'language_use',
        prompt: 'Choose the correct preposition: "The researchers remained skeptical _____ the self-reported survey data."',
        options: [
          'of',
          'to',
          'for',
          'at',
        ],
        correctIndex: 0,
        explanation:
          'The adjective "skeptical" collocates with "of" (or "about"), not "to", "for", or "at".',
      },
    ],
    writingTask: {
      prompt:
        'IELTS Writing Task 1 (Academic Summary): Summarize a report comparing university library usage across three formats (print books, e-books, and quiet study rooms) between 2015 and 2025, noting that e-book downloads tripled while print borrowing declined by half and study room bookings rose steadily.',
      minWords: 150,
      rubricCriteria: [
        'Clear overview paragraph highlighting main trends',
        'Accurate reporting of proportions and comparisons without personal opinion',
        'Varied verbs and nouns of change (tripled, declined, surged)',
        'Cohesive sequencing',
      ],
      expectedKeywords: ['overview', 'e-books', 'print', 'study rooms', 'decline', 'contrast'],
      modelAnswer:
        'The data illustrates marked shifts in how university students utilized library resources between 2015 and 2025 across three primary categories: print books, e-books, and quiet study rooms.\n\nOverall, digital consumption and physical workspace demand expanded substantially, whereas traditional print borrowing experienced a pronounced downturn. E-book downloads recorded the sharpest growth, tripling over the ten-year period to become the dominant reading format by 2025.\n\nIn stark contrast, print book loans fell by approximately fifty percent over the same decade, reflecting a broader transition toward portable digital texts. Meanwhile, demand for quiet study rooms demonstrated consistent upward momentum, rising steadily each year despite the shift away from physical collections. This divergence indicates that modern academic libraries increasingly function as collaborative and quiet study hubs rather than solely as repositories for printed volumes.',
    },
  },
  {
    id: 'ielts-sim-3',
    examTypeId: 'ielts',
    languageCode: 'en',
    simulationNumber: 3,
    title: 'IELTS Academic — Simulado 3: Global Supply & Automation',
    targetCefr: 'B2',
    durationMinutes: 35,
    questions: [
      {
        id: 'ielts-sim-3-q1',
        section: 'reading',
        passageTitle: 'Port Automation and Maritime Logistics',
        passageText:
          'Modern container terminals increasingly rely on automated guided vehicles (AGVs) and remote-controlled gantry cranes to transfer cargo from vessels to rail yards. Proponents point out that automated terminals operate continuously with minimal lighting and predictable turnaround times, reducing vessel idling emissions. Yet labor economists observe that the transition is rarely frictionless: retrofitting legacy ports demands massive capital expenditure, and smaller ports often struggle to justify the investment when cargo volumes fluctuate seasonally.',
        prompt: 'What environmental benefit of automated terminals is mentioned in the passage?',
        options: [
          'They eliminate the need for rail yards near ports.',
          'They reduce emissions caused by waiting ships.',
          'They recycle old gantry cranes into electric vehicles.',
          'They increase seasonal cargo volumes.',
        ],
        correctIndex: 1,
        explanation:
          'Predictable turnaround times reduce "vessel idling emissions."',
      },
      {
        id: 'ielts-sim-3-q2',
        section: 'reading',
        passageTitle: 'Port Automation and Maritime Logistics',
        passageText:
          'Modern container terminals increasingly rely on automated guided vehicles (AGVs) and remote-controlled gantry cranes to transfer cargo from vessels to rail yards. Proponents point out that automated terminals operate continuously with minimal lighting and predictable turnaround times, reducing vessel idling emissions. Yet labor economists observe that the transition is rarely frictionless: retrofitting legacy ports demands massive capital expenditure, and smaller ports often struggle to justify the investment when cargo volumes fluctuate seasonally.',
        prompt: 'Why might smaller ports hesitate to adopt full automation?',
        options: [
          'Automated vehicles cannot operate without bright lighting.',
          'High upfront costs are hard to recover with variable cargo traffic.',
          'Rail yards refuse to accept automated cargo transfers.',
          'Labor economists prohibit retrofitting legacy ports.',
        ],
        correctIndex: 1,
        explanation:
          'Retrofitting requires massive capital expenditure, which is difficult to justify when cargo volumes fluctuate seasonally.',
      },
      {
        id: 'ielts-sim-3-q3',
        section: 'listening',
        audioText:
          'Good morning, everyone. Today’s industrial engineering seminar will examine warehouse ergonomics. Before we review the case study from Rotterdam, I want to clarify one point from Tuesday’s reading: wearable exoskeletons are not designed to let workers lift heavier loads than safety regulations permit. Rather, their primary purpose is to reduce cumulative lower-back strain during repetitive bending tasks.',
        audioPlaysLimit: 2,
        prompt: 'What is the main purpose of wearable exoskeletons according to the lecturer?',
        options: [
          'To allow workers to exceed legal weight limits.',
          'To replace automated guided vehicles in Rotterdam.',
          'To lessen repetitive strain on the lower back.',
          'To speed up Tuesday’s reading assignments.',
        ],
        correctIndex: 2,
        explanation:
          'The lecturer clarifies their primary purpose is "to reduce cumulative lower-back strain during repetitive bending tasks."',
      },
      {
        id: 'ielts-sim-3-q4',
        section: 'listening',
        audioText:
          'Good morning, everyone. Today’s industrial engineering seminar will examine warehouse ergonomics. Before we review the case study from Rotterdam, I want to clarify one point from Tuesday’s reading: wearable exoskeletons are not designed to let workers lift heavier loads than safety regulations permit. Rather, their primary purpose is to reduce cumulative lower-back strain during repetitive bending tasks.',
        audioPlaysLimit: 2,
        prompt: 'What does the lecturer imply about safety regulations?',
        options: [
          'They should be abolished once exoskeletons are introduced.',
          'Maximum permitted load limits still apply when wearing exoskeletons.',
          'Rotterdam warehouses have different weight laws.',
          'Exoskeletons are banned under current safety regulations.',
        ],
        correctIndex: 1,
        explanation:
          'Exoskeletons are not designed to let workers lift heavier loads than safety regulations permit.',
      },
      {
        id: 'ielts-sim-3-q5',
        section: 'language_use',
        prompt: 'Choose the best linker to show contrast: "_____ the high initial cost of automated cranes, long-term operating expenses fell by twenty percent."',
        options: [
          'Although',
          'Despite',
          'Whereas',
          'However',
        ],
        correctIndex: 1,
        explanation:
          '"Despite" is followed by a noun phrase ("the high initial cost..."), whereas "Although" and "Whereas" require a full clause.',
      },
      {
        id: 'ielts-sim-3-q6',
        section: 'language_use',
        prompt: 'Select the correct passive reporting structure: "Global shipping delays _____ to ease gradually over the next two quarters."',
        options: [
          'are expected',
          'expecting',
          'have expect',
          'are expect',
        ],
        correctIndex: 0,
        explanation:
          '"Are expected to ease" is the standard passive reporting structure.',
      },
    ],
    writingTask: {
      prompt:
        'IELTS Writing Task 2: Automation and artificial intelligence are transforming manufacturing and logistics. Some argue this will create widespread unemployment, while others believe it will generate higher-skilled jobs. Discuss both views and give your own opinion.',
      minWords: 150,
      rubricCriteria: [
        'Balanced discussion of both viewpoints',
        'Clear personal position stated and supported',
        'Cohesive transitions between contrasting ideas',
        'Precise vocabulary related to employment and technology',
      ],
      expectedKeywords: ['automation', 'employment', 'reskilling', 'productivity', 'workforce', 'transition'],
      modelAnswer:
        'The rapid integration of automation and artificial intelligence into manufacturing and logistics has sparked intense debate regarding the future of work. While some fear widespread job displacement, others contend that technological progress will cultivate higher-skilled roles.\n\nThose who anticipate rising unemployment point out that routine tasks—such as sorting parcels or assembling standardized components—are increasingly performed faster and more cheaply by machines. Without targeted intervention, workers in these sectors face prolonged economic insecurity.\n\nConversely, optimists emphasize that automation boosts industrial productivity, which in turn creates demand for technicians, data analysts, and maintenance specialists. Historically, technological revolutions have reshaped rather than eliminated labor markets. In my view, whether automation yields net benefits depends primarily on public and corporate investment in continuous reskilling programs, ensuring displaced workers can transition into emerging technical roles.',
    },
  },
  {
    id: 'ielts-sim-4',
    examTypeId: 'ielts',
    languageCode: 'en',
    simulationNumber: 4,
    title: 'IELTS Academic — Simulado 4: Cultural Heritage & Museums',
    targetCefr: 'C1',
    durationMinutes: 35,
    questions: [
      {
        id: 'ielts-sim-4-q1',
        section: 'reading',
        passageTitle: 'Digitizing Fragile Manuscripts',
        passageText:
          'Multispectral imaging has revolutionized the study of medieval palimpsests—parchments whose original ink was scraped off so the sheets could be reused. By illuminating manuscripts with narrow bands of ultraviolet and infrared light, conservators can render faded undertext legible without subjecting the artifact to invasive chemical reagents. Equally important, open-access digital repositories enable scholars worldwide to examine high-resolution scans simultaneously, dramatically reducing the physical handling that accelerates parchment degradation.',
        prompt: 'How does multispectral imaging protect fragile manuscripts?',
        options: [
          'It coats parchment with protective chemical reagents.',
          'It reveals hidden text non-invasively and reduces physical handling.',
          'It restores the original medieval ink to the surface.',
          'It restricts access to a small group of conservators.',
        ],
        correctIndex: 1,
        explanation:
          'It avoids invasive chemical reagents and, combined with digital repositories, reduces physical handling.',
      },
      {
        id: 'ielts-sim-4-q2',
        section: 'reading',
        passageTitle: 'Digitizing Fragile Manuscripts',
        passageText:
          'Multispectral imaging has revolutionized the study of medieval palimpsests—parchments whose original ink was scraped off so the sheets could be reused. By illuminating manuscripts with narrow bands of ultraviolet and infrared light, conservators can render faded undertext legible without subjecting the artifact to invasive chemical reagents. Equally important, open-access digital repositories enable scholars worldwide to examine high-resolution scans simultaneously, dramatically reducing the physical handling that accelerates parchment degradation.',
        prompt: 'What is a "palimpsest" as defined in the passage?',
        options: [
          'A type of ultraviolet lamp used in archives.',
          'A digital repository for high-resolution scans.',
          'A reused parchment whose earlier writing was erased.',
          'A chemical reagent that preserves medieval ink.',
        ],
        correctIndex: 2,
        explanation:
          'The passage defines palimpsests as "parchments whose original ink was scraped off so the sheets could be reused."',
      },
      {
        id: 'ielts-sim-4-q3',
        section: 'listening',
        audioText:
          'Curator: Thanks for calling the National Archive Visitor Desk. Please remember that while general admission to the Silver Gallery is free, entry to the Map Room requires a timed pass booked online at least 24 hours in advance. Also, photography without flash is permitted in the sculpture hall, whereas no cameras of any kind are allowed inside the Map Room due to light-sensitivity rules.',
        audioPlaysLimit: 2,
        prompt: 'What is required to visit the Map Room?',
        options: [
          'A paid ticket purchased at the desk.',
          'An online timed pass reserved at least a day ahead.',
          'Special permission to use flash photography.',
          'Membership in the National Archive.',
        ],
        correctIndex: 1,
        explanation:
          'Entry to the Map Room requires "a timed pass booked online at least 24 hours in advance."',
      },
      {
        id: 'ielts-sim-4-q4',
        section: 'listening',
        audioText:
          'Curator: Thanks for calling the National Archive Visitor Desk. Please remember that while general admission to the Silver Gallery is free, entry to the Map Room requires a timed pass booked online at least 24 hours in advance. Also, photography without flash is permitted in the sculpture hall, whereas no cameras of any kind are allowed inside the Map Room due to light-sensitivity rules.',
        audioPlaysLimit: 2,
        prompt: 'Where is non-flash photography permitted?',
        options: [
          'Inside the Map Room',
          'In the sculpture hall',
          'Only at the Visitor Desk',
          'Nowhere in the building',
        ],
        correctIndex: 1,
        explanation:
          'Photography without flash is permitted in the sculpture hall.',
      },
      {
        id: 'ielts-sim-4-q5',
        section: 'language_use',
        prompt: 'Choose the most appropriate inverted conditional: "_____ earlier, the archival parchment might have suffered irreversible mold damage."',
        options: [
          'Had the climate controls not been repaired',
          'If the climate controls were not repaired',
          'Were the climate controls not repaired',
          'Did the climate controls not repair',
        ],
        correctIndex: 0,
        explanation:
          '"Had the climate controls not been repaired" is the formal third-conditional inversion matching "might have suffered."',
      },
      {
        id: 'ielts-sim-4-q6',
        section: 'language_use',
        prompt: 'Select the word that best fits: "The museum’s decision to _____ admission fees led to a 30% surge in weekend visitors."',
        options: [
          'waive',
          'wave',
          'forbid',
          'compel',
        ],
        correctIndex: 0,
        explanation:
          '"Waive" means to refrain from insisting on or charging a fee.',
      },
    ],
    writingTask: {
      prompt:
        'IELTS Writing Task 2: Some people believe that national museums should be free for all visitors, funded entirely by taxpayers, while others think charging an entrance fee is necessary to maintain collections. Discuss both sides and give your opinion.',
      minWords: 150,
      rubricCriteria: [
        'Clear exploration of taxpayer funding vs. user-fee arguments',
        'Well-reasoned personal stance',
        'Cohesive paragraph structure',
        'C1-level lexical precision and grammatical range',
      ],
      expectedKeywords: ['museums', 'taxpayers', 'accessibility', 'conservation', 'revenue', 'cultural heritage'],
      modelAnswer:
        'Whether national museums should offer universal free entry or charge admission remains a recurring policy question. Both funding models carry distinct merits for public access and heritage preservation.\n\nAdvocates of free admission argue that cultural artifacts belong to the public and should remain accessible regardless of household income. Removing financial barriers encourages repeat visits from families and students, fostering civic education and social cohesion. When funded through general taxation, museums can focus on scholarship rather than commercial ticketing targets.\n\nOn the other hand, maintaining climate-controlled galleries and funding conservation laboratories is extraordinarily expensive. Proponents of entrance fees contend that modest ticket charges—particularly for international tourists—provide a reliable revenue stream that insulates museums from sudden government budget cuts. In my opinion, a hybrid approach is ideal: national museums should remain free for residents and students while charging a modest fee for special exhibitions to sustain conservation standards.',
    },
  },

  // =========================================================================
  // TOEFL iBT (Simulations 1-4)
  // =========================================================================
  {
    id: 'toefl-sim-1',
    examTypeId: 'toefl',
    languageCode: 'en',
    simulationNumber: 1,
    title: 'TOEFL iBT — Simulado 1: Marine Biology & Ocean Currents',
    targetCefr: 'B2',
    durationMinutes: 35,
    questions: [
      {
        id: 'toefl-sim-1-q1',
        section: 'reading',
        passageTitle: 'Hydrothermal Vent Ecosystems',
        passageText:
          'Prior to 1977, biologists assumed that virtually all complex food webs on Earth depended directly or indirectly on sunlight and photosynthesis. That assumption was overturned when deep-sea submersibles discovered thriving colonies of giant tube worms and blind shrimp clustered around hydrothermal vents along the Galápagos Rift. In these sunless depths, specialized bacteria perform chemosynthesis, oxidizing hydrogen sulfide from superheated mineral plumes to convert carbon dioxide into organic nutrients. Consequently, entire abyssal communities flourish independently of solar energy.',
        prompt: 'What major scientific assumption did the 1977 Galápagos Rift discovery overturn?',
        options: [
          'That giant tube worms live only in shallow coastal waters.',
          'That all complex ecosystems ultimately rely on sunlight.',
          'That hydrogen sulfide is toxic to all marine bacteria.',
          'That deep-sea submersibles could not withstand abyssal pressure.',
        ],
        correctIndex: 1,
        explanation:
          'Biologists previously assumed virtually all complex food webs depended on sunlight and photosynthesis.',
      },
      {
        id: 'toefl-sim-1-q2',
        section: 'reading',
        passageTitle: 'Hydrothermal Vent Ecosystems',
        passageText:
          'Prior to 1977, biologists assumed that virtually all complex food webs on Earth depended directly or indirectly on sunlight and photosynthesis. That assumption was overturned when deep-sea submersibles discovered thriving colonies of giant tube worms and blind shrimp clustered around hydrothermal vents along the Galápagos Rift. In these sunless depths, specialized bacteria perform chemosynthesis, oxidizing hydrogen sulfide from superheated mineral plumes to convert carbon dioxide into organic nutrients. Consequently, entire abyssal communities flourish independently of solar energy.',
        prompt: 'How do bacteria near hydrothermal vents produce organic nutrients?',
        options: [
          'By absorbing faint sunlight filtered through mineral plumes.',
          'By consuming blind shrimp and tube worms.',
          'By oxidizing hydrogen sulfide through chemosynthesis.',
          'By storing oxygen from surface ocean currents.',
        ],
        correctIndex: 2,
        explanation:
          'Specialized bacteria oxidize hydrogen sulfide to convert carbon dioxide into organic nutrients via chemosynthesis.',
      },
      {
        id: 'toefl-sim-1-q3',
        section: 'listening',
        audioText:
          'Student: Excuse me, Professor Lin, I’m having trouble understanding why the lab manual asks us to measure salinity before temperature when analyzing water samples. Professor Lin: Good question, Jordan. Actually, the order doesn’t affect the chemistry, but our digital conductivity probes require a clean sensor tip. If you dip the probe into the sediment-heavy bottom sample first, it’ll skew the salinity reading—so we test salinity in the filtered flask first, then move to the thermal probe.',
        audioPlaysLimit: 2,
        prompt: 'Why does Professor Lin recommend measuring salinity before temperature?',
        options: [
          'Temperature changes the chemical composition of salt.',
          'To avoid contaminating the conductivity sensor with sediment.',
          'The thermal probe takes twenty minutes to warm up.',
          'The lab manual contains a printing error.',
        ],
        correctIndex: 1,
        explanation:
          'Professor Lin explains that dipping the probe into sediment-heavy samples first would skew the salinity reading.',
      },
      {
        id: 'toefl-sim-1-q4',
        section: 'listening',
        audioText:
          'Student: Excuse me, Professor Lin, I’m having trouble understanding why the lab manual asks us to measure salinity before temperature when analyzing water samples. Professor Lin: Good question, Jordan. Actually, the order doesn’t affect the chemistry, but our digital conductivity probes require a clean sensor tip. If you dip the probe into the sediment-heavy bottom sample first, it’ll skew the salinity reading—so we test salinity in the filtered flask first, then move to the thermal probe.',
        audioPlaysLimit: 2,
        prompt: 'What can be inferred about the order of measurements from a purely chemical standpoint?',
        options: [
          'Measuring temperature first ruins the filtered flask.',
          'The chemical properties of the sample do not depend on measurement order.',
          'Salinity can only be measured in boiling water.',
          'Digital conductivity probes also measure oxygen.',
        ],
        correctIndex: 1,
        explanation:
          'Professor Lin explicitly notes, "Actually, the order doesn’t affect the chemistry."',
      },
      {
        id: 'toefl-sim-1-q5',
        section: 'language_use',
        prompt: 'Choose the option that best completes the academic sentence: "Unlike shallow coral reefs, _____ rely on photosynthetic algae, hydrothermal vent communities depend on chemosynthetic bacteria."',
        options: [
          'which',
          'that',
          'what',
          'whom',
        ],
        correctIndex: 0,
        explanation:
          'A non-restrictive relative clause after a comma requires "which", not "that".',
      },
      {
        id: 'toefl-sim-1-q6',
        section: 'language_use',
        prompt: 'Identify the closest meaning to "overturned" in: "That long-standing hypothesis was overturned by new deep-sea data."',
        options: [
          'confirmed',
          'disproved',
          'postponed',
          'repeated',
        ],
        correctIndex: 1,
        explanation:
          'In scientific contexts, "overturned" means disproved or invalidated.',
      },
    ],
    writingTask: {
      prompt:
        'TOEFL Academic Discussion: Your biology professor asks: "Should governments prioritize funding deep-sea exploration or focus marine budgets primarily on protecting coastal ecosystems near human populations?" Write a concise, well-reasoned response contributing to the class discussion.',
      minWords: 120,
      rubricCriteria: [
        'Direct engagement with the prompt question',
        'Clear rationale with a concrete example',
        'Natural academic discussion tone',
        'Grammatical accuracy and varied sentence structures',
      ],
      expectedKeywords: ['coastal', 'deep-sea', 'ecosystems', 'funding', 'biodiversity', 'balance'],
      modelAnswer:
        'While deep-sea exploration yields remarkable discoveries about extreme life forms and climate regulation, I believe marine conservation budgets should prioritize coastal ecosystems first. Coastal habitats—such as mangroves, estuaries, and coral reefs—face immediate threats from runoff, warming waters, and overfishing. Protecting these zones directly safeguards both marine biodiversity and the livelihoods of millions of people who depend on coastal fisheries and storm barriers.\n\nThat said, deep-sea research should not be abandoned entirely. A balanced policy would allocate the majority of near-term funding to coastal restoration while preserving targeted grants for deep-ocean mapping, especially before commercial seabed mining expands.',
    },
  },
  {
    id: 'toefl-sim-2',
    examTypeId: 'toefl',
    languageCode: 'en',
    simulationNumber: 2,
    title: 'TOEFL iBT — Simulado 2: Linguistics & Writing Systems',
    targetCefr: 'C1',
    durationMinutes: 35,
    questions: [
      {
        id: 'toefl-sim-2-q1',
        section: 'reading',
        passageTitle: 'The Origins of Linear B',
        passageText:
          'For half a century after Sir Arthur Evans unearthed clay tablets at Knossos in 1900, the script known as Linear B remained undeciphered. Scholars debated whether the underlying language was Minoan, an unknown Anatolian tongue, or an early form of Greek. In 1952, architect and amateur linguist Michael Ventris demonstrated through statistical grid analysis of sign frequencies and inflectional endings that Linear B recorded Mycenaean Greek—pushing the documented history of the Greek language back by nearly five centuries.',
        prompt: 'What method enabled Michael Ventris to decipher Linear B?',
        options: [
          'Comparing Knossos tablets with Egyptian hieroglyphs.',
          'Statistical analysis of symbol frequencies and word endings.',
          'Translating bilingual inscriptions discovered in Anatolia.',
          'Excavating new libraries on the Greek mainland.',
        ],
        correctIndex: 1,
        explanation:
          'Ventris used "statistical grid analysis of sign frequencies and inflectional endings."',
      },
      {
        id: 'toefl-sim-2-q2',
        section: 'reading',
        passageTitle: 'The Origins of Linear B',
        passageText:
          'For half a century after Sir Arthur Evans unearthed clay tablets at Knossos in 1900, the script known as Linear B remained undeciphered. Scholars debated whether the underlying language was Minoan, an unknown Anatolian tongue, or an early form of Greek. In 1952, architect and amateur linguist Michael Ventris demonstrated through statistical grid analysis of sign frequencies and inflectional endings that Linear B recorded Mycenaean Greek—pushing the documented history of the Greek language back by nearly five centuries.',
        prompt: 'What was the broader historical significance of Ventris’s breakthrough?',
        options: [
          'It proved that Sir Arthur Evans forged the Knossos tablets.',
          'It extended the written record of Greek by roughly 500 years.',
          'It showed that Mycenaean Greek was borrowed from Minoan.',
          'It ended all academic interest in Aegean archaeology.',
        ],
        correctIndex: 1,
        explanation:
          'The passage states it pushed "the documented history of the Greek language back by nearly five centuries."',
      },
      {
        id: 'toefl-sim-2-q3',
        section: 'listening',
        audioText:
          'Campus Librarian: Welcome to the Special Collections orientation. You’re welcome to request any nineteenth-century travelogue from our catalog, provided you submit the call slip before 3:30 p.m. Please keep in mind that pens are strictly prohibited at the reading tables—only pencils and laptops without cases are allowed. Also, if you need high-resolution scans, our staff handles all imaging; personal scanners cannot be used on bound volumes.',
        audioPlaysLimit: 2,
        prompt: 'Which item is a researcher permitted to bring to the reading tables?',
        options: [
          'A ballpoint pen',
          'A handheld scanner',
          'A pencil',
          'A padded laptop sleeve',
        ],
        correctIndex: 2,
        explanation:
          'Only pencils and laptops without cases are allowed at the reading tables.',
      },
      {
        id: 'toefl-sim-2-q4',
        section: 'listening',
        audioText:
          'Campus Librarian: Welcome to the Special Collections orientation. You’re welcome to request any nineteenth-century travelogue from our catalog, provided you submit the call slip before 3:30 p.m. Please keep in mind that pens are strictly prohibited at the reading tables—only pencils and laptops without cases are allowed. Also, if you need high-resolution scans, our staff handles all imaging; personal scanners cannot be used on bound volumes.',
        audioPlaysLimit: 2,
        prompt: 'What happens if a student wants a high-resolution scan of a bound volume?',
        options: [
          'They must wait until after 3:30 p.m. to scan it themselves.',
          'They must ask the library staff to perform the imaging.',
          'They may use a personal scanner with a supervisor.',
          'Bound volumes cannot be scanned under any circumstances.',
        ],
        correctIndex: 1,
        explanation:
          'The librarian states that "our staff handles all imaging; personal scanners cannot be used on bound volumes."',
      },
      {
        id: 'toefl-sim-2-q5',
        section: 'language_use',
        prompt: 'Choose the sentence that uses parallel structure correctly:',
        options: [
          'The archive preserves clay tablets, digitizing scrolls, and catalogs maps.',
          'The archive preserves clay tablets, digitizes scrolls, and catalogs maps.',
          'The archive is preserving clay tablets, digitize scrolls, and cataloging maps.',
          'The archive preserves clay tablets, to digitize scrolls, and catalogs maps.',
        ],
        correctIndex: 1,
        explanation:
          'All three verbs ("preserves", "digitizes", "catalogs") are in the third-person singular present simple.',
      },
      {
        id: 'toefl-sim-2-q6',
        section: 'language_use',
        prompt: 'Select the best transition: "Linear B was deciphered in 1952; _____, the older Linear A script remains largely unreadable today."',
        options: [
          'consequently',
          'similarly',
          'by contrast',
          'for instance',
        ],
        correctIndex: 2,
        explanation:
          '"By contrast" highlights the difference between deciphered Linear B and undeciphered Linear A.',
      },
    ],
    writingTask: {
      prompt:
        'TOEFL Academic Discussion: Your linguistics professor asks: "With instant machine translation becoming increasingly accurate, is it still worthwhile for university students to spend years learning a second language?" Write your response.',
      minWords: 120,
      rubricCriteria: [
        'Clear position on language learning vs. machine translation',
        'Supporting arguments addressing nuance, culture, or cognition',
        'Cohesive academic style',
        'Accurate grammar and vocabulary',
      ],
      expectedKeywords: ['translation', 'nuance', 'culture', 'communication', 'cognitive', 'fluency'],
      modelAnswer:
        'Even as neural machine translation improves, learning a second language remains deeply worthwhile for university students. Translation tools excel at conveying literal facts, yet they frequently miss pragmatic nuance, humor, and cultural subtext that build genuine trust in international collaboration.\n\nFurthermore, studying another language trains cognitive flexibility and sharpens awareness of how meaning is structured in one’s native tongue. In fields such as diplomacy, medicine, and literary research, relying solely on automated software creates distance between speakers. Mastering a language directly enables authentic human connection that algorithms cannot replicate.',
    },
  },
  {
    id: 'toefl-sim-3',
    examTypeId: 'toefl',
    languageCode: 'en',
    simulationNumber: 3,
    title: 'TOEFL iBT — Simulado 3: Renewable Grid Storage',
    targetCefr: 'B2',
    durationMinutes: 35,
    questions: [
      {
        id: 'toefl-sim-3-q1',
        section: 'reading',
        passageTitle: 'Pumped Hydro and Grid Stability',
        passageText:
          'As wind and solar generation expand, electrical grids face an intermittency challenge: peak sunlight rarely coincides with evening electricity demand. While lithium-ion batteries dominate short-duration storage, pumped-storage hydroelectricity still accounts for over ninety percent of utility-scale energy storage worldwide. During periods of surplus power, pumps move water from a lower reservoir to an upper basin; when demand surges, water flows back down through turbines. Though geographically constrained to hilly terrain, pumped hydro offers multi-decade lifespans with minimal capacity degradation.',
        prompt: 'What problem do renewable grids face according to the passage?',
        options: [
          'Solar panels degrade faster in hilly terrain.',
          'Peak renewable supply often does not match peak demand.',
          'Lithium-ion batteries cannot store any electricity.',
          'Turbines only operate during daylight hours.',
        ],
        correctIndex: 1,
        explanation:
          'The passage notes that "peak sunlight rarely coincides with evening electricity demand."',
      },
      {
        id: 'toefl-sim-3-q2',
        section: 'reading',
        passageTitle: 'Pumped Hydro and Grid Stability',
        passageText:
          'As wind and solar generation expand, electrical grids face an intermittency challenge: peak sunlight rarely coincides with evening electricity demand. While lithium-ion batteries dominate short-duration storage, pumped-storage hydroelectricity still accounts for over ninety percent of utility-scale energy storage worldwide. During periods of surplus power, pumps move water from a lower reservoir to an upper basin; when demand surges, water flows back down through turbines. Though geographically constrained to hilly terrain, pumped hydro offers multi-decade lifespans with minimal capacity degradation.',
        prompt: 'What limitation of pumped-storage hydroelectricity is mentioned?',
        options: [
          'It degrades rapidly after five years.',
          'It accounts for less than ten percent of global storage.',
          'It requires specific topography such as hilly terrain.',
          'It consumes more power than it ever returns.',
        ],
        correctIndex: 2,
        explanation:
          'The passage states pumped hydro is "geographically constrained to hilly terrain."',
      },
      {
        id: 'toefl-sim-3-q3',
        section: 'listening',
        audioText:
          'Advisor: Hi Sam, I reviewed your course registration for the fall semester. You signed up for Thermodynamics II, but the system flagged a missing prerequisite—you still need Differential Equations. Sam: Oh, I took Differential Equations at a community college last summer! I just haven’t sent the official transcript to the registrar yet. Advisor: That explains it. Bring the sealed transcript to Room 210 by Friday, and I’ll enter a manual override so you don’t lose your lab seat.',
        audioPlaysLimit: 2,
        prompt: 'Why was Sam’s registration for Thermodynamics II flagged?',
        options: [
          'The lab section was already full.',
          'The university system lacked record of a required math course.',
          'Sam failed Thermodynamics I last spring.',
          'Community college credits are never accepted.',
        ],
        correctIndex: 1,
        explanation:
          'Sam had not yet sent the official transcript for Differential Equations to the registrar.',
      },
      {
        id: 'toefl-sim-3-q4',
        section: 'listening',
        audioText:
          'Advisor: Hi Sam, I reviewed your course registration for the fall semester. You signed up for Thermodynamics II, but the system flagged a missing prerequisite—you still need Differential Equations. Sam: Oh, I took Differential Equations at a community college last summer! I just haven’t sent the official transcript to the registrar yet. Advisor: That explains it. Bring the sealed transcript to Room 210 by Friday, and I’ll enter a manual override so you don’t lose your lab seat.',
        audioPlaysLimit: 2,
        prompt: 'What will the advisor do once Sam submits the transcript?',
        options: [
          'Move Sam to a different major.',
          'Enter a manual override to keep Sam’s lab seat.',
          'Ask Sam to retake Differential Equations.',
          'Mail the transcript back to the community college.',
        ],
        correctIndex: 1,
        explanation:
          'The advisor says, "I’ll enter a manual override so you don’t lose your lab seat."',
      },
      {
        id: 'toefl-sim-3-q5',
        section: 'language_use',
        prompt: 'Choose the correct word form: "Grid operators must balance _____ supply with fluctuating consumer demand."',
        options: [
          'intermittent',
          'intermittently',
          'intermittence',
          'intermit',
        ],
        correctIndex: 0,
        explanation:
          'An adjective ("intermittent") is needed to modify the noun "supply".',
      },
      {
        id: 'toefl-sim-3-q6',
        section: 'language_use',
        prompt: 'Complete the sentence: "No sooner _____ the solar array been connected than cloud cover reduced output by forty percent."',
        options: [
          'has',
          'had',
          'was',
          'did',
        ],
        correctIndex: 1,
        explanation:
          '"No sooner had [subject] [past participle] than..." is the standard inverted past-perfect structure.',
      },
    ],
    writingTask: {
      prompt:
        'TOEFL Academic Discussion: Your environmental policy professor asks: "Should cities subsidize residential rooftop solar panels, or is it more cost-effective to invest public funds in utility-scale solar and wind farms?" State and support your view.',
      minWords: 120,
      rubricCriteria: [
        'Clear comparison of distributed vs. utility-scale renewables',
        'Logical economic and practical justification',
        'Concise, cohesive academic prose',
        'Correct grammar and varied syntax',
      ],
      expectedKeywords: ['utility-scale', 'rooftop', 'subsidies', 'cost-effective', 'grid', 'efficiency'],
      modelAnswer:
        'From an economic and engineering standpoint, investing public funds in utility-scale solar and wind farms is generally more cost-effective than subsidizing individual rooftop installations. Large-scale projects benefit from economies of scale, professional maintenance, and optimal siting, generating significantly more clean electricity per public dollar spent.\n\nAdditionally, rooftop subsidies often disproportionately benefit affluent homeowners, whereas utility-scale investments lower grid emissions for all residents, including renters. While rooftop solar can still be encouraged through streamlined permitting, public subsidies deliver greater decarbonization impact when directed toward large generation and grid storage.',
    },
  },
  {
    id: 'toefl-sim-4',
    examTypeId: 'toefl',
    languageCode: 'en',
    simulationNumber: 4,
    title: 'TOEFL iBT — Simulado 4: Behavioral Economics',
    targetCefr: 'C1',
    durationMinutes: 35,
    questions: [
      {
        id: 'toefl-sim-4-q1',
        section: 'reading',
        passageTitle: 'Default Options and Choice Architecture',
        passageText:
          'Classical economic models assume that individuals evaluate every option independently and select the one that maximizes utility. Behavioral economists, however, have shown that "choice architecture"—the way options are presented—profoundly shapes decisions. In retirement savings plans, for instance, switching from an opt-in system to automatic enrollment with an opt-out option routinely raises participation rates from under fifty percent to over eighty-five percent. Because people tend to procrastinate when faced with complex financial paperwork, the default setting acts as a powerful yet non-coercive nudge.',
        prompt: 'What does automatic enrollment in retirement plans demonstrate?',
        options: [
          'Employees prefer lower salaries over retirement benefits.',
          'The framing of default choices strongly influences participation.',
          'Complex paperwork increases people’s enthusiasm for saving.',
          'Classical economic models accurately predict all financial behavior.',
        ],
        correctIndex: 1,
        explanation:
          'Switching to automatic enrollment raises participation from under 50% to over 85%, showing choice architecture shapes decisions.',
      },
      {
        id: 'toefl-sim-4-q2',
        section: 'reading',
        passageTitle: 'Default Options and Choice Architecture',
        passageText:
          'Classical economic models assume that individuals evaluate every option independently and select the one that maximizes utility. Behavioral economists, however, have shown that "choice architecture"—the way options are presented—profoundly shapes decisions. In retirement savings plans, for instance, switching from an opt-in system to automatic enrollment with an opt-out option routinely raises participation rates from under fifty percent to over eighty-five percent. Because people tend to procrastinate when faced with complex financial paperwork, the default setting acts as a powerful yet non-coercive nudge.',
        prompt: 'Why is an opt-out system described as "non-coercive"?',
        options: [
          'Participants are legally fined if they withdraw.',
          'Individuals remain free to leave the program if they choose.',
          'Employers pay the entire contribution.',
          'Paperwork is completely banned.',
        ],
        correctIndex: 1,
        explanation:
          'An opt-out option allows individuals to decline or leave, making it a nudge rather than a mandate.',
      },
      {
        id: 'toefl-sim-4-q3',
        section: 'listening',
        audioText:
          'Professor: Before we wrap up today’s seminar on consumer psychology, let’s revisit the jam-tasting experiment we read about. When shoppers were shown twenty-four varieties of jam, more people stopped at the display, yet far fewer actually bought a jar compared with when only six varieties were offered. Remember, this isn’t because customers disliked the extra flavors—it’s because excessive options triggered decision paralysis.',
        audioPlaysLimit: 2,
        prompt: 'What happened when shoppers were presented with 24 jam varieties instead of 6?',
        options: [
          'Both display visits and purchases increased sharply.',
          'Fewer shoppers stopped at the display, but more bought jam.',
          'More shoppers stopped, but a smaller proportion made a purchase.',
          'Shoppers complained that the flavors were too similar.',
        ],
        correctIndex: 2,
        explanation:
          'More people stopped at the 24-variety display, "yet far fewer actually bought a jar."',
      },
      {
        id: 'toefl-sim-4-q4',
        section: 'listening',
        audioText:
          'Professor: Before we wrap up today’s seminar on consumer psychology, let’s revisit the jam-tasting experiment we read about. When shoppers were shown twenty-four varieties of jam, more people stopped at the display, yet far fewer actually bought a jar compared with when only six varieties were offered. Remember, this isn’t because customers disliked the extra flavors—it’s because excessive options triggered decision paralysis.',
        audioPlaysLimit: 2,
        prompt: 'How does the professor explain the lower purchase rate?',
        options: [
          'The 24-variety table was priced higher.',
          'Too many choices caused decision paralysis.',
          'Customers disliked the extra flavors.',
          'The store ran out of sample spoons.',
        ],
        correctIndex: 1,
        explanation:
          'The professor states that "excessive options triggered decision paralysis."',
      },
      {
        id: 'toefl-sim-4-q5',
        section: 'language_use',
        prompt: 'Choose the best sentence to integrate a concession:',
        options: [
          'Default nudges are effective; nevertheless, they cannot replace transparent financial education.',
          'Default nudges are effective, because they cannot replace transparent financial education.',
          'Despite default nudges are effective, they cannot replace transparent financial education.',
          'Default nudges are effective; therefore, they cannot replace transparent financial education.',
        ],
        correctIndex: 0,
        explanation:
          '"Nevertheless" correctly introduces a concession contrasting effectiveness with limitations.',
      },
      {
        id: 'toefl-sim-4-q6',
        section: 'language_use',
        prompt: 'Select the correct collocation: "Excessive menu options can _____ cognitive overload among consumers."',
        options: [
          'induce',
          'insist',
          'afford',
          'comply',
        ],
        correctIndex: 0,
        explanation:
          '"Induce cognitive overload" is the standard academic collocation meaning bring about or cause.',
      },
    ],
    writingTask: {
      prompt:
        'TOEFL Academic Discussion: Your economics professor asks: "Do default \'nudges\'—such as automatic organ-donor registration or automatic pension enrollment—respect individual freedom, or do they cross into paternalistic manipulation?" Share your perspective.',
      minWords: 120,
      rubricCriteria: [
        'Nuanced evaluation of autonomy vs. behavioral nudges',
        'Clear thesis and supporting example',
        'Formal academic register',
        'Strong lexical and grammatical control',
      ],
      expectedKeywords: ['autonomy', 'opt-out', 'choice architecture', 'transparency', 'welfare', 'consent'],
      modelAnswer:
        'Well-designed default nudges respect individual freedom so long as opting out remains effortless and transparent. Because no institution can present choices in a completely neutral vacuum, setting a socially beneficial default—such as automatic retirement enrollment—simply aligns inertia with long-term personal welfare rather than forcing compliance.\n\nHowever, nudges cross into manipulation when organizations obscure the opt-out mechanism or design confusing interfaces to trap users. Provided that the default is publicly disclosed and reversible with a single click or signature, choice architecture enhances public outcomes while preserving genuine autonomy.',
    },
  },

  // =========================================================================
  // CAMBRIDGE B2 FIRST / C1 ADVANCED (Simulations 1-4)
  // =========================================================================
  {
    id: 'cambridge-sim-1',
    examTypeId: 'cambridge',
    languageCode: 'en',
    simulationNumber: 1,
    title: 'Cambridge B2/C1 — Simulado 1: Work & Remote Collaboration',
    targetCefr: 'B2',
    durationMinutes: 35,
    questions: [
      {
        id: 'cambridge-sim-1-q1',
        section: 'reading',
        passageTitle: 'The Myth of Constant Availability',
        passageText:
          'When hybrid work became widespread, many organizations assumed that instant messaging platforms would seamlessly replicate the spontaneity of shared offices. Instead, internal audits at several European software firms revealed a striking paradox: employees spent more hours online than ever, yet deep, uninterrupted project work declined. Responding to pings within minutes fragmented concentration, leaving staff exhausted at the end of the day without having completed their core tasks. Firms that subsequently introduced "core quiet hours"—two-hour morning blocks with notifications muted—reported both higher code quality and lower self-reported burnout.',
        prompt: 'What paradox did the internal audits uncover?',
        options: [
          'Employees worked fewer hours but produced more software.',
          'Longer online presence coincided with less focused, deep work.',
          'Instant messaging completely replaced email in Europe.',
          'Burnout increased only among staff who muted notifications.',
        ],
        correctIndex: 1,
        explanation:
          'Employees spent more hours online than ever, yet deep, uninterrupted project work declined.',
      },
      {
        id: 'cambridge-sim-1-q2',
        section: 'reading',
        passageTitle: 'The Myth of Constant Availability',
        passageText:
          'When hybrid work became widespread, many organizations assumed that instant messaging platforms would seamlessly replicate the spontaneity of shared offices. Instead, internal audits at several European software firms revealed a striking paradox: employees spent more hours online than ever, yet deep, uninterrupted project work declined. Responding to pings within minutes fragmented concentration, leaving staff exhausted at the end of the day without having completed their core tasks. Firms that subsequently introduced "core quiet hours"—two-hour morning blocks with notifications muted—reported both higher code quality and lower self-reported burnout.',
        prompt: 'What resulted from introducing "core quiet hours"?',
        options: [
          'Spontaneous office conversations disappeared permanently.',
          'Software quality improved and burnout levels dropped.',
          'Employees had to work two extra hours every evening.',
          'Clients complained about slower response times.',
        ],
        correctIndex: 1,
        explanation:
          'Firms reported "both higher code quality and lower self-reported burnout."',
      },
      {
        id: 'cambridge-sim-1-q3',
        section: 'listening',
        audioText:
          'Hannah: Did you get a chance to look at the draft schedule for next month’s design sprint? Liam: I did, yeah. Honestly, cramming three client workshops into Tuesday afternoon feels unrealistic. Even if we trim the presentations, people will be too drained to give useful feedback by five o’clock. Hannah: Fair point. Let’s shift the third workshop to Wednesday morning when everyone’s fresh.',
        audioPlaysLimit: 2,
        prompt: 'What is Liam’s main concern about Tuesday afternoon?',
        options: [
          'The presentations are too short to cover the project.',
          'Participants will be too tired for the final workshop to be productive.',
          'The client prefers meeting on Wednesday afternoon.',
          'Hannah forgot to invite the design team.',
        ],
        correctIndex: 1,
        explanation:
          'Liam says people will be "too drained to give useful feedback by five o’clock."',
      },
      {
        id: 'cambridge-sim-1-q4',
        section: 'listening',
        audioText:
          'Hannah: Did you get a chance to look at the draft schedule for next month’s design sprint? Liam: I did, yeah. Honestly, cramming three client workshops into Tuesday afternoon feels unrealistic. Even if we trim the presentations, people will be too drained to give useful feedback by five o’clock. Hannah: Fair point. Let’s shift the third workshop to Wednesday morning when everyone’s fresh.',
        audioPlaysLimit: 2,
        prompt: 'What do Hannah and Liam agree to do?',
        options: [
          'Cancel the third client workshop.',
          'Shorten all presentations by half.',
          'Move the third workshop to Wednesday morning.',
          'Hold all workshops online instead.',
        ],
        correctIndex: 2,
        explanation:
          'Hannah agrees: "Let’s shift the third workshop to Wednesday morning when everyone’s fresh."',
      },
      {
        id: 'cambridge-sim-1-q5',
        section: 'language_use',
        prompt: 'Cambridge Key Word Transformation: "It was a mistake for the team to ignore the early warning signs." Complete using SHOULD: "The team _____ the early warning signs."',
        options: [
          'should not ignore',
          'should not have ignored',
          'should have not ignored',
          'shouldn’t be ignoring',
        ],
        correctIndex: 1,
        explanation:
          '"Should not have ignored" expresses past regret or criticism of a completed mistake.',
      },
      {
        id: 'cambridge-sim-1-q6',
        section: 'language_use',
        prompt: 'Choose the phrasal verb that fits: "We had to _____ the product launch until the security audit was finished."',
        options: [
          'put off',
          'put up',
          'put out',
          'put across',
        ],
        correctIndex: 0,
        explanation:
          '"Put off" means to postpone or delay.',
      },
    ],
    writingTask: {
      prompt:
        'Cambridge B2/C1 Report: Your company is considering making Friday afternoons "meeting-free" to boost focus. Write a report for your manager evaluating the current meeting culture, the potential benefits of meeting-free Fridays, and one recommendation for implementation.',
      minWords: 140,
      rubricCriteria: [
        'Clear report format with section headings',
        'Objective, semi-formal tone',
        'Specific evaluation and actionable recommendation',
        'Accurate grammar and cohesive devices',
      ],
      expectedKeywords: ['introduction', 'findings', 'productivity', 'collaboration', 'recommendation'],
      modelAnswer:
        'Introduction\nThis report evaluates the current scheduling of internal meetings and assesses the proposal to introduce meeting-free Friday afternoons.\n\nCurrent Situation\nAt present, staff spend an average of twelve hours per week in video calls, many of which overlap with peak concentration periods. Consequently, complex analytical tasks are frequently pushed into overtime.\n\nBenefits of Meeting-Free Fridays\nProtecting Friday afternoons from recurring calls would give teams an uninterrupted block to finalize weekly deliverables and clear administrative backlogs. Pilot schemes in comparable firms indicate higher morale and fewer missed deadlines.\n\nRecommendation\nI recommend trialing meeting-free Friday afternoons for an eight-week period, with an exception solely for urgent client escalations, followed by a brief staff survey to measure impact.',
    },
  },
  {
    id: 'cambridge-sim-2',
    examTypeId: 'cambridge',
    languageCode: 'en',
    simulationNumber: 2,
    title: 'Cambridge B2/C1 — Simulado 2: Architecture & Adaptive Reuse',
    targetCefr: 'C1',
    durationMinutes: 35,
    questions: [
      {
        id: 'cambridge-sim-2-q1',
        section: 'reading',
        passageTitle: 'Breathing New Life into Industrial Shells',
        passageText:
          'Across post-industrial cities, derelict power stations, textile mills, and railway depots are increasingly being transformed into public libraries, galleries, and start-up hubs. Beyond preserving architectural character, adaptive reuse retains the "embodied carbon" already locked inside massive brick and steel frames—emissions that would otherwise be wasted through demolition and new concrete pouring. Nevertheless, repurposing century-old structures poses formidable acoustic and thermal challenges, often obliging architects to insert freestanding timber pods inside the original masonry shell.',
        prompt: 'What environmental advantage of adaptive reuse is highlighted?',
        options: [
          'Old brick walls generate renewable electricity.',
          'It avoids the carbon emissions of demolition and new construction.',
          'Timber pods absorb industrial pollutants from the soil.',
          'Railway depots require no heating in winter.',
        ],
        correctIndex: 1,
        explanation:
          'Adaptive reuse retains embodied carbon that would otherwise be wasted through demolition and new concrete pouring.',
      },
      {
        id: 'cambridge-sim-2-q2',
        section: 'reading',
        passageTitle: 'Breathing New Life into Industrial Shells',
        passageText:
          'Across post-industrial cities, derelict power stations, textile mills, and railway depots are increasingly being transformed into public libraries, galleries, and start-up hubs. Beyond preserving architectural character, adaptive reuse retains the "embodied carbon" already locked inside massive brick and steel frames—emissions that would otherwise be wasted through demolition and new concrete pouring. Nevertheless, repurposing century-old structures poses formidable acoustic and thermal challenges, often obliging architects to insert freestanding timber pods inside the original masonry shell.',
        prompt: 'Why do architects sometimes build freestanding timber pods inside old buildings?',
        options: [
          'To conceal damaged brick exteriors from pedestrians.',
          'To overcome soundproofing and insulation difficulties.',
          'Because masonry shells cannot support any roof.',
          'To satisfy laws banning steel in public libraries.',
        ],
        correctIndex: 1,
        explanation:
          'They insert freestanding timber pods to address "formidable acoustic and thermal challenges."',
      },
      {
        id: 'cambridge-sim-2-q3',
        section: 'listening',
        audioText:
          'Interviewer: Welcome, Clara. Your studio just won the regional prize for converting the 1920s grain silo into a community theater. What was the trickiest moment during construction? Clara: Everyone assumes it was reinforcing the concrete cylinders, which actually went smoothly. What nearly derailed our budget was discovering asbestos insulation beneath the loading bay—we had to halt site work for six weeks while specialist contractors cleared it safely.',
        audioPlaysLimit: 2,
        prompt: 'What caused the unexpected six-week delay on Clara’s project?',
        options: [
          'Reinforcing the concrete grain cylinders.',
          'A dispute over the regional architecture prize.',
          'Removing hazardous insulation found under the loading bay.',
          'Waiting for community theater seating to arrive.',
        ],
        correctIndex: 2,
        explanation:
          'Clara says discovering asbestos insulation beneath the loading bay forced them to halt work for six weeks.',
      },
      {
        id: 'cambridge-sim-2-q4',
        section: 'listening',
        audioText:
          'Interviewer: Welcome, Clara. Your studio just won the regional prize for converting the 1920s grain silo into a community theater. What was the trickiest moment during construction? Clara: Everyone assumes it was reinforcing the concrete cylinders, which actually went smoothly. What nearly derailed our budget was discovering asbestos insulation beneath the loading bay—we had to halt site work for six weeks while specialist contractors cleared it safely.',
        audioPlaysLimit: 2,
        prompt: 'How did the reinforcement of the concrete cylinders go?',
        options: [
          'It nearly derailed the entire budget.',
          'It went without major problems.',
          'It had to be redone after six weeks.',
          'It was handled by the community volunteers.',
        ],
        correctIndex: 1,
        explanation:
          'Clara notes that reinforcing the concrete cylinders "actually went smoothly."',
      },
      {
        id: 'cambridge-sim-2-q5',
        section: 'language_use',
        prompt: 'Choose the correct word for this C1 cloze gap: "The renovation was completed on schedule, _____ minor setbacks with the electrical wiring."',
        options: [
          'notwithstanding',
          'provided',
          'whereas',
          'furthermore',
        ],
        correctIndex: 0,
        explanation:
          '"Notwithstanding" means in spite of / despite, fitting a noun phrase ("minor setbacks...").',
      },
      {
        id: 'cambridge-sim-2-q6',
        section: 'language_use',
        prompt: 'Complete the Key Word Transformation using ACCOUNT: "Architects must consider acoustic comfort when designing open halls." -> "Acoustic comfort must _____ when designing open halls."',
        options: [
          'be taken into account',
          'take on account',
          'be made account of',
          'have account for',
        ],
        correctIndex: 0,
        explanation:
          '"Be taken into account" is the passive form of "take into account" (consider).',
      },
    ],
    writingTask: {
      prompt:
        'Cambridge C1 Essay: Your town council is deciding whether to demolish a historic vacant factory to build a modern sports complex or renovate the factory into a cultural center. Write an essay discussing both options and recommending which should be prioritized.',
      minWords: 150,
      rubricCriteria: [
        'Sophisticated argument weighing heritage, cost, and community need',
        'Clear thesis and persuasive conclusion',
        'C1 vocabulary and complex structures (inversion, participle clauses)',
        'Cohesive flow',
      ],
      expectedKeywords: ['heritage', 'adaptive reuse', 'community', 'cost', 'sustainability', 'recommend'],
      modelAnswer:
        'Deciding the fate of a vacant historic factory requires balancing cultural preservation against practical community needs. Both demolishing the site for a modern sports complex and converting it into a cultural center offer tangible benefits, yet adaptive reuse presents the more sustainable long-term choice.\n\nConstructing a purpose-built sports facility would undoubtedly address immediate gaps in recreational infrastructure, offering energy-efficient courts and accessible changing rooms. However, demolishing a structurally sound landmark squanders its embodied carbon and erases a visible link to the town’s industrial past.\n\nRenovating the factory into a cultural center, by contrast, preserves architectural character while providing flexible spaces for exhibitions, youth workshops, and local enterprises. Although retrofitting older masonry demands careful budgeting, phased renovation can spread costs over several years. Therefore, the council should prioritize adaptive reuse, retaining the building’s historic shell for contemporary civic life.',
    },
  },
  {
    id: 'cambridge-sim-3',
    examTypeId: 'cambridge',
    languageCode: 'en',
    simulationNumber: 3,
    title: 'Cambridge B2/C1 — Simulado 3: Media & Journalism',
    targetCefr: 'B2',
    durationMinutes: 35,
    questions: [
      {
        id: 'cambridge-sim-3-q1',
        section: 'reading',
        passageTitle: 'Slow Journalism in an Age of Breaking Alerts',
        passageText:
          'In an era dominated by real-time newsfeeds and algorithmic headlines, a growing number of independent publications are championing "slow journalism." Rather than racing to publish unverified updates within seconds of an event, these outlets invest months in investigative reporting, fact-checking, and narrative depth. Readers who subscribe to quarterly print journals or long-form newsletters often cite relief from notification fatigue as a primary reason for paying—demonstrating that patience and accuracy remain commercially viable.',
        prompt: 'What distinguishes "slow journalism" from conventional real-time news?',
        options: [
          'It relies on algorithms to write headlines faster.',
          'It prioritizes thorough investigation and verification over speed.',
          'It avoids publishing any print editions.',
          'It is funded exclusively by breaking-news alerts.',
        ],
        correctIndex: 1,
        explanation:
          'Slow journalism invests months in investigative reporting, fact-checking, and narrative depth rather than racing to publish first.',
      },
      {
        id: 'cambridge-sim-3-q2',
        section: 'reading',
        passageTitle: 'Slow Journalism in an Age of Breaking Alerts',
        passageText:
          'In an era dominated by real-time newsfeeds and algorithmic headlines, a growing number of independent publications are championing "slow journalism." Rather than racing to publish unverified updates within seconds of an event, these outlets invest months in investigative reporting, fact-checking, and narrative depth. Readers who subscribe to quarterly print journals or long-form newsletters often cite relief from notification fatigue as a primary reason for paying—demonstrating that patience and accuracy remain commercially viable.',
        prompt: 'Why do many subscribers say they are willing to pay for slow journalism?',
        options: [
          'They want to receive more frequent smartphone notifications.',
          'They appreciate escaping constant alerts and reading in-depth work.',
          'Quarterly print journals are cheaper than free websites.',
          'They prefer unverified updates over long-form articles.',
        ],
        correctIndex: 1,
        explanation:
          'Subscribers "cite relief from notification fatigue as a primary reason for paying."',
      },
      {
        id: 'cambridge-sim-3-q3',
        section: 'listening',
        audioText:
          'Editor: Marco, I really enjoyed your feature on local community radio stations, especially the interview with the volunteer sound engineer. One small tweak before we go to press: the opening anecdote runs a bit long, so readers don’t reach your main argument until page three. Could you tighten those first two paragraphs?',
        audioPlaysLimit: 2,
        prompt: 'What does the editor ask Marco to revise?',
        options: [
          'Remove the interview with the sound engineer.',
          'Shorten the opening paragraphs so the main point appears earlier.',
          'Add two more pages to the end of the feature.',
          'Change the topic from community radio to podcasts.',
        ],
        correctIndex: 1,
        explanation:
          'The editor asks Marco to "tighten those first two paragraphs" because readers don’t reach the main argument until page three.',
      },
      {
        id: 'cambridge-sim-3-q4',
        section: 'listening',
        audioText:
          'Editor: Marco, I really enjoyed your feature on local community radio stations, especially the interview with the volunteer sound engineer. One small tweak before we go to press: the opening anecdote runs a bit long, so readers don’t reach your main argument until page three. Could you tighten those first two paragraphs?',
        audioPlaysLimit: 2,
        prompt: 'What part of Marco’s article did the editor particularly praise?',
        options: [
          'The opening anecdote',
          'The page-three layout',
          'The interview with the volunteer sound engineer',
          'The headline choices',
        ],
        correctIndex: 2,
        explanation:
          'The editor says, "I really enjoyed your feature..., especially the interview with the volunteer sound engineer."',
      },
      {
        id: 'cambridge-sim-3-q5',
        section: 'language_use',
        prompt: 'Choose the correct word formation: "The editor praised the reporter’s _____ attention to detail." (METICULOUS)',
        options: [
          'meticulous',
          'meticulously',
          'meticulousness',
          'meticulosity',
        ],
        correctIndex: 0,
        explanation:
          'An adjective ("meticulous") modifies the noun phrase "attention to detail".',
      },
      {
        id: 'cambridge-sim-3-q6',
        section: 'language_use',
        prompt: 'Complete the sentence: "Scarcely had the article been published _____ dozens of readers wrote in with additional historical photos."',
        options: [
          'when',
          'than',
          'after',
          'since',
        ],
        correctIndex: 0,
        explanation:
          '"Scarcely ... when" (like "Hardly ... when") is the standard correlative pair, whereas "No sooner" pairs with "than".',
      },
    ],
    writingTask: {
      prompt:
        'Cambridge B2/C1 Review: Write a review of a documentary, podcast, or magazine you recently followed, explaining what makes it engaging, who would enjoy it most, and any aspect that could be improved.',
      minWords: 140,
      rubricCriteria: [
        'Engaging title and semi-formal review tone',
        'Descriptive language and balanced evaluation',
        'Clear recommendation for a target audience',
        'Accurate grammar and natural idiomatic expressions',
      ],
      expectedKeywords: ['engaging', 'episode', 'narration', 'audience', 'recommend', 'drawback'],
      modelAnswer:
        'The Sound of Cities: A Review\n\nIf you are tired of superficial news podcasts, "The Sound of Cities" offers a refreshing alternative. Each thirty-minute episode explores how urban acoustics—from tram bells in Lisbon to night markets in Taipei—shape the daily rhythm of neighborhoods.\n\nWhat makes the series stand out is its restrained narration. Rather than crowding every second with commentary, the producers let ambient recordings breathe, allowing listeners to immerse themselves in each location before historians explain the context.\n\nThe only minor drawback is the irregular release schedule, which can leave subscribers waiting weeks between episodes. Even so, anyone interested in urban culture, travel, or thoughtful audio storytelling will find this podcast thoroughly rewarding.',
    },
  },
  {
    id: 'cambridge-sim-4',
    examTypeId: 'cambridge',
    languageCode: 'en',
    simulationNumber: 4,
    title: 'Cambridge B2/C1 — Simulado 4: Biodiversity & Rewilding',
    targetCefr: 'C1',
    durationMinutes: 35,
    questions: [
      {
        id: 'cambridge-sim-4-q1',
        section: 'reading',
        passageTitle: 'Trophic Cascades and Keystone Species',
        passageText:
          'Rewilding initiatives aim to restore self-regulating ecosystems by reintroducing missing "keystone species"—organisms whose ecological impact is disproportionately large relative to their population size. A classic illustration comes from riverine valleys where the return of beavers transformed straight, fast-flowing channels into terraced networks of ponds and wetlands. By slowing water velocity, beaver dams trap sediment, recharge aquifers, and create sheltered nurseries for juvenile trout and amphibians, demonstrating how a single species can reshape an entire landscape.',
        prompt: 'What defines a "keystone species" according to the passage?',
        options: [
          'It is always the largest predator in a valley.',
          'Its influence on the ecosystem far exceeds what its numbers alone suggest.',
          'It can survive without water or wetlands.',
          'It prevents amphibians from breeding in ponds.',
        ],
        correctIndex: 1,
        explanation:
          'Keystone species have an ecological impact "disproportionately large relative to their population size."',
      },
      {
        id: 'cambridge-sim-4-q2',
        section: 'reading',
        passageTitle: 'Trophic Cascades and Keystone Species',
        passageText:
          'Rewilding initiatives aim to restore self-regulating ecosystems by reintroducing missing "keystone species"—organisms whose ecological impact is disproportionately large relative to their population size. A classic illustration comes from riverine valleys where the return of beavers transformed straight, fast-flowing channels into terraced networks of ponds and wetlands. By slowing water velocity, beaver dams trap sediment, recharge aquifers, and create sheltered nurseries for juvenile trout and amphibians, demonstrating how a single species can reshape an entire landscape.',
        prompt: 'Which effect of beaver dams is NOT mentioned in the passage?',
        options: [
          'Reducing the speed of flowing water',
          'Replenishing underground water reserves',
          'Providing safe habitats for young fish',
          'Eliminating all seasonal rainfall',
        ],
        correctIndex: 3,
        explanation:
          'Slowing water, recharging aquifers, and sheltering juvenile trout are all mentioned; eliminating rainfall is not.',
      },
      {
        id: 'cambridge-sim-4-q3',
        section: 'listening',
        audioText:
          'Ranger: Welcome to the Highland Reserve volunteer briefing. Today we’re mapping wildflower meadows along the eastern ridge. Before we set off, please remember that livestock are grazing in the lower pasture, so keep every gate latched behind you. Also, if you spot any ground-nesting birds, note the GPS coordinates on your tablet and move at least fifty meters away so they aren’t disturbed.',
        audioPlaysLimit: 2,
        prompt: 'What should volunteers do if they encounter ground-nesting birds?',
        options: [
          'Chase them away from the livestock pasture.',
          'Record their location and keep a safe distance.',
          'Take close-up photos for the visitor center.',
          'Leave the meadow gates open.',
        ],
        correctIndex: 1,
        explanation:
          'Volunteers should "note the GPS coordinates on your tablet and move at least fifty meters away."',
      },
      {
        id: 'cambridge-sim-4-q4',
        section: 'listening',
        audioText:
          'Ranger: Welcome to the Highland Reserve volunteer briefing. Today we’re mapping wildflower meadows along the eastern ridge. Before we set off, please remember that livestock are grazing in the lower pasture, so keep every gate latched behind you. Also, if you spot any ground-nesting birds, note the GPS coordinates on your tablet and move at least fifty meters away so they aren’t disturbed.',
        audioPlaysLimit: 2,
        prompt: 'Why is it important to latch the gates?',
        options: [
          'To keep wildflower seeds from blowing away.',
          'Because farm animals are grazing in the lower pasture.',
          'To block tourists from reaching the eastern ridge.',
          'To protect the GPS tablets from wind.',
        ],
        correctIndex: 1,
        explanation:
          'Livestock are grazing in the lower pasture, so gates must stay latched.',
      },
      {
        id: 'cambridge-sim-4-q5',
        section: 'language_use',
        prompt: 'Choose the correct preposition to complete this C1 sentence: "The success of rural rewilding hinges _____ close cooperation with local farmers."',
        options: [
          'on',
          'in',
          'at',
          'by',
        ],
        correctIndex: 0,
        explanation:
          'The verb "hinge" collocates with "on" (or "upon"), meaning to depend entirely on.',
      },
      {
        id: 'cambridge-sim-4-q6',
        section: 'language_use',
        prompt: 'Select the sentence that uses a participle clause accurately:',
        options: [
          'Restored to its natural floodplains, the river began supporting diverse birdlife again.',
          'Restoring to its natural floodplains, diverse birdlife returned to the river.',
          'Having restore to its natural floodplains, the river supported birdlife.',
          'Being restoring to its floodplains, the river supported birdlife.',
        ],
        correctIndex: 0,
        explanation:
          '"Restored to its natural floodplains" correctly modifies the subject "the river" in passive participle form.',
      },
    ],
    writingTask: {
      prompt:
        'Cambridge C1 Proposal: Your local environmental committee has funds for one nature-restoration project. Write a proposal advocating for either urban pollinator corridors or wetland restoration, outlining the objectives, expected benefits, and practical steps.',
      minWords: 150,
      rubricCriteria: [
        'Clear proposal structure with headings',
        'Persuasive, formal register suitable for a committee',
        'Realistic objectives and implementation steps',
        'C1 lexical range and grammatical accuracy',
      ],
      expectedKeywords: ['proposal', 'objectives', 'biodiversity', 'wetland', 'implementation', 'long-term'],
      modelAnswer:
        'Proposal: Municipal Wetland Restoration Project\n\nObjective\nThis proposal recommends allocating the committee’s annual conservation grant to restoring the neglected marshland along the southern creek.\n\nRationale and Benefits\nRestoring native reeds and shallow retention pools will deliver dual benefits: absorbing heavy seasonal rainfall to protect nearby neighborhoods from flooding, and re-establishing breeding habitats for migratory birds and amphibians. Unlike ornamental parks, self-sustaining wetlands require minimal mowing or irrigation once established.\n\nImplementation Plan\nPhase one involves clearing invasive brush and re-contouring drainage channels in autumn. Phase two will engage local schools in planting native sedges in spring. Clear signage and a raised boardwalk will also allow residents to enjoy the site without disturbing sensitive wildlife.',
    },
  },
];
