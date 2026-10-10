// Curriculum Data Store for EduPocket Offline Engine
// Includes rich bilingual content (English, Telugu, Hindi) for verified offline retrieval

const CURRICULUM_PACKS = [
  {
    id: "class8-science-te",
    class: "Class 8",
    grade: 8,
    subject: "Science",
    subjectName: { en: "Science", te: "సైన్స్ (విజ్ఞాన శాస్త్రం)", hi: "विज्ञान" },
    language: "te",
    langName: "తెలుగు (Telugu)",
    chaptersCount: 12,
    sizeMB: 18,
    isDownloaded: true, // Pre-downloaded for initial experience or ready for demo
    liteSizeMB: 8,
    fullSizeMB: 18,
    version: "v2.4",
    chapters: [
      {
        id: "c8-sci-ch3",
        number: 3,
        title: {
          en: "Photosynthesis in Plants",
          te: "మొక్కలలో కిరణజన్య సంయోగక్రియ (Photosynthesis)",
          hi: "पौधों में प्रकाश संश्लेषण"
        },
        readTime: "15 min",
        progress: 65,
        objectives: {
          en: [
            "Understand how green plants synthesize their own food using light energy",
            "Learn the chemical reaction and equation of photosynthesis",
            "Identify the roles of Chlorophyll, Sunlight, Stomata, Carbon Dioxide, and Water",
            "Recognize the importance of oxygen release for all living organisms"
          ],
          te: [
            "ఆకుపచ్చని మొక్కలు కాంతి శక్తిని ఉపయోగించి ఆహారాన్ని ఎలా తయారుచేస్తాయో గ్రహించడం",
            "కిరణజన్య సంయోగక్రియ యొక్క రసాయన సమీకరణాన్ని అర్థం చేసుకోవడం",
            "క్లోరోఫిల్, సూర్యరశ్మి, పత్రరంధ్రాలు, కార్బన్ డయాక్సైడ్ మరియు నీటి పాత్రను గుర్తించడం",
            "జీవుల మనుగడకు విడుదలయ్యే ఆక్సిజన్ యొక్క ప్రాముఖ్యతను తెలుసుకోవడం"
          ]
        },
        sections: [
          {
            id: "sec1",
            title: {
              en: "1. What is Photosynthesis?",
              te: "1. కిరణజన్య సంయోగక్రియ అంటే ఏమిటి?"
            },
            content: {
              en: `Photosynthesis is the fundamental biological process by which green plants, algae, and certain bacteria synthesize organic nutrients (glucose) using sunlight, carbon dioxide from the air, and water absorbed from the soil. The word is derived from two Greek words: 'Photo' meaning light, and 'Synthesis' meaning putting together.
              
Because plants produce their own food, they are called autotrophs. This process forms the foundation of almost all food chains on Earth. Without photosynthesis, atmospheric oxygen would deplete and life as we know it would cease to exist.`,
              te: `కిరణజన్య సంయోగక్రియ అనేది ఆకుపచ్చని మొక్కలు సూర్యరశ్మి సమక్షంలో, గాలిలోని కార్బన్ డయాక్సైడ్ మరియు నేలలోని నీటిని గ్రహించి గ్లూకోజ్ (పిండిపదార్థం) రూపంలో ఆహారాన్ని తయారుచేసే ఒక ముఖ్యమైన జీవక్రియ. 'ఫోటో' అంటే కాంతి, 'సింథసిస్' అంటే సంశ్లేషణ లేదా కలపడం అని అర్థం.

మొక్కలు తమ ఆహారాన్ని తామే సొంతంగా తయారుచేసుకుంటాయి కాబట్టి వాటిని స్వయంపోషకాలు (Autotrophs) అంటారు. భూమిపై ఉన్న దాదాపు అన్ని ఆహారపు గొలుసులకు ఈ ప్రక్రియే మూలాధారం. ఈ ప్రక్రియ జరగకపోతే భూమిపై ప్రాణవాయువు (ఆక్సిజన్) లభించదు.`
            },
            verifiedExcerpt: "Photosynthesis is the process by which green plants make their food using sunlight, carbon dioxide, and water.",
            verifiedExcerptTe: "ఆకుపచ్చని మొక్కలు సూర్యరశ్మి, కార్బన్ డయాక్సైడ్ మరియు నీటిని ఉపయోగించి ఆహారాన్ని తయారుచేసే ప్రక్రియను కిరణజన్య సంయోగక్రియ అంటారు."
          },
          {
            id: "sec2",
            title: {
              en: "2. The Chemical Equation",
              te: "2. రసాయన సమీకరణం"
            },
            content: {
              en: `During photosynthesis, carbon dioxide gas and water react in the presence of chlorophyll and light energy to produce glucose (sugar) and oxygen gas.

The balanced chemical equation is:
6CO₂ (Carbon Dioxide) + 6H₂O (Water) + Light Energy —[Chlorophyll]→ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)

The glucose produced is either used immediately by plant cells for energy or stored as starch in leaves, stems, and roots. Oxygen is released into the atmosphere as a vital byproduct.`,
              te: `కిరణజన్య సంయోగక్రియ సమయంలో క్లోరోఫిల్ మరియు సూర్యరశ్మి సమక్షంలో కార్బన్ డయాక్సైడ్ మరియు నీరు కలిసి గ్లూకోజ్ మరియు ఆక్సిజన్‌ను విడుదల చేస్తాయి.

రసాయన సమీకరణం:
6CO₂ (కార్బన్ డయాక్సైడ్) + 6H₂O (నీరు) + సూర్యకాంతి —[పత్రహరితం]→ C₆H₁₂O₆ (గ్లూకోజ్) + 6O₂ (ఆక్సిజన్)

తయారైన గ్లూకోజ్ మొక్క యొక్క శక్తి కోసం ఉపయోగపడుతుంది లేదా పిండిపదార్థం రూపంలో నిల్వ చేయబడుతుంది. ఆక్సిజన్ వాతావరణంలోకి విడుదలవుతుంది.`
            },
            verifiedExcerpt: "Carbon dioxide and water react in sunlight and chlorophyll to form glucose and oxygen gas.",
            verifiedExcerptTe: "కార్బన్ డయాక్సైడ్ మరియు నీరు సూర్యకాంతి సమక్షంలో రసాయన చర్య జరిపి గ్లూకోజ్ మరియు ఆక్సిజన్‌ను ఉత్పత్తి చేస్తాయి."
          },
          {
            id: "sec3",
            title: {
              en: "3. Four Essential Raw Materials",
              te: "3. అవసరమైన నాలుగు ముడి పదార్థాలు"
            },
            content: {
              en: `Photosynthesis requires four essential components:
1. Sunlight: The primary source of radiant electromagnetic energy.
2. Chlorophyll: The green pigment contained inside chloroplasts in leaf cells that traps photons of light.
3. Carbon Dioxide (CO₂): Absorbed directly from the atmosphere through microscopic pores on leaf surfaces called stomata.
4. Water (H₂O): Absorbed by root hair cells from moist soil and transported upwards to leaves via xylem vessels.

If any one of these factors is missing, photosynthesis slows down or halts completely.`,
              te: `కిరణజన్య సంయోగక్రియకు నాలుగు ముఖ్యమైన అంశాలు అవసరం:
1. సూర్యరశ్మి: శక్తికి ప్రధాన మూలం.
2. పత్రహరితం (క్లోరోఫిల్): ఆకులలో ఉండే హరితరేణువులలో కాంతిని శోషించే ఆకుపచ్చని వర్ణద్రవ్యం.
3. కార్బన్ డయాక్సైడ్ (CO₂): ఆకుల ఉపరితలంపై ఉండే పత్రరంధ్రాల (Stomata) ద్వారా గాలి నుంచి గ్రహించబడుతుంది.
4. నీరు (H₂O): వేర్ల ద్వారా భూమి నుండి గ్రహించబడి దారు కణజాలం (Xylem) ద్వారా ఆకులకు చేరుతుంది.

ఈ నాలుగింటిలో ఏ ఒక్కటి లోపించినా కిరణజన్య సంయోగక్రియ జరగదు.`
            },
            verifiedExcerpt: "The 4 essential components are sunlight, chlorophyll, carbon dioxide, and water.",
            verifiedExcerptTe: "సూర్యరశ్మి, పత్రహరితం, కార్బన్ డయాక్సైడ్ మరియు నీరు అత్యవసరమైనవి."
          },
          {
            id: "sec4",
            title: {
              en: "4. Leaves and Stomata Function",
              te: "4. ఆకులు మరియు పత్రరంధ్రాల (Stomata) పనితీరు"
            },
            content: {
              en: `Leaves are the 'food factories' or kitchens of the plant. On the underside of the epidermis, there are tiny openings called stomata (singular: stoma).

Each stoma is bordered by two kidney-shaped guard cells. When guard cells swell with water, the pore opens, allowing carbon dioxide to diffuse into the spongy mesophyll cells and oxygen to escape. During dry spells, guard cells lose water and close the pore to prevent excess water transpiration.`,
              te: `ఆకులను మొక్కల 'ఆహార కర్మాగారాలు' అంటారు. ఆకు అడుగు భాగంలో పత్రరంధ్రాలు (Stomata) అనబడే సూక్ష్మ రంధ్రాలు ఉంటాయి.

ప్రతి పత్రరంధ్రం చుట్టూ రెండు మూత్రపిండాల ఆకారంలో ఉండే రక్షక కణాలు (Guard cells) ఉంటాయి. ఇవి నీటిని పీల్చుకున్నప్పుడు రంధ్రం తెరుచుకుంటుంది. దీని ద్వారా కార్బన్ డయాక్సైడ్ లోపలికి వచ్చి, ఆక్సిజన్ బయటకు వెళుతుంది.`
            },
            verifiedExcerpt: "Stomata are microscopic pores on leaves regulated by guard cells for gas exchange.",
            verifiedExcerptTe: "పత్రరంధ్రాలు అనేవి వాయు మార్పిడి కొరకు ఆకులపై ఉండే సూక్ష్మ రంధ్రాలు."
          }
        ],
        diagram: {
          title: "Photosynthesis Process & Leaf Anatomy",
          titleTe: "కిరణజన్య సంయోగక్రియ విధానం మరియు పత్ర నిర్మాణం",
          type: "svg-diagram",
          elements: [
            { label: "Sunlight (Energy)", te: "సూర్యకాంతి (శక్తి)" },
            { label: "Carbon Dioxide (CO₂)", te: "కార్బన్ డయాక్సైడ్" },
            { label: "Oxygen Released (O₂)", te: "విడుదలైన ఆక్సిజన్" },
            { label: "Chloroplasts (Chlorophyll)", te: "హరితరేణువులు (పత్రహరితం)" },
            { label: "Water & Minerals (from roots)", te: "నీరు & ఖనిజాలు (వేర్ల నుండి)" },
            { label: "Glucose Formed (C₆H₁₂O₆)", te: "గ్లూకోజ్ తయారీ" }
          ]
        },
        terms: [
          {
            term: "Chlorophyll (క్లోరోఫిల్ / పత్రహరితం)",
            definition: "The green pigment found in chloroplasts that absorbs light energy.",
            definitionTe: "హరితరేణువులలో కాంతి శక్తిని గ్రహించే ఆకుపచ్చని వర్ణద్రవ్యం."
          },
          {
            term: "Stomata (పత్రరంధ్రాలు)",
            definition: "Microscopic openings on the leaf surface that facilitate gas exchange (CO₂ in, O₂ out).",
            definitionTe: "వాయు మార్పిడికి ఉపయోగపడే ఆకులపై గల సూక్ష్మ రంధ్రాలు."
          },
          {
            term: "Guard Cells (రక్షక కణాలు)",
            definition: "Specialized kidney-shaped cells that control the opening and closing of stomata.",
            definitionTe: "పత్రరంధ్రాలు తెరుచుకోవడం మరియు మూసుకోవడాన్ని నియంత్రించే కణాలు."
          },
          {
            term: "Autotroph (స్వయంపోషకం)",
            definition: "An organism capable of synthesizing its own food from inorganic substances.",
            definitionTe: "తమ ఆహారాన్ని తామే స్వయంగా తయారుచేసుకోగల జీవి (మొక్కలు)."
          }
        ],
        quiz: [
          {
            id: "q1",
            question: "Which gas is used by green plants during photosynthesis?",
            questionTe: "కిరణజన్య సంయోగక్రియ సమయంలో ఆకుపచ్చని మొక్కలు ఏ వాయువును వినియోగిస్తాయి?",
            options: [
              "Oxygen",
              "Carbon dioxide",
              "Nitrogen",
              "Hydrogen"
            ],
            optionsTe: [
              "ఆక్సిజన్ (Oxygen)",
              "కార్బన్ డయాక్సైడ్ (Carbon dioxide)",
              "నైట్రోజన్ (Nitrogen)",
              "హైడ్రోజన్ (Hydrogen)"
            ],
            correctIndex: 1,
            explanation: "Carbon dioxide (CO₂) is absorbed through stomata from the air and used to synthesize glucose.",
            explanationTe: "వాతావరణం నుండి పత్రరంధ్రాల ద్వారా గ్రహించబడిన కార్బన్ డయాక్సైడ్ గ్లూకోజ్ తయారీలో వినియోగపడుతుంది.",
            reviewSection: "Chapter 3 → Section 2: Chemical Equation"
          },
          {
            id: "q2",
            question: "What green pigment absorbs sunlight inside plant leaf cells?",
            questionTe: "మొక్కల ఆకు కణాలలో సూర్యరశ్మిని శోషించే ఆకుపచ్చ వర్ణద్రవ్యం ఏది?",
            options: [
              "Hemoglobin",
              "Melanin",
              "Chlorophyll",
              "Carotene"
            ],
            optionsTe: [
              "హిమోగ్లోబిన్",
              "మెలనిన్",
              "క్లోరోఫిల్ (పత్రహరితం)",
              "కెరోటిన్"
            ],
            correctIndex: 2,
            explanation: "Chlorophyll resides inside chloroplasts and absorbs blue and red wavelengths of sunlight.",
            explanationTe: "క్లోరోఫిల్ (పత్రహరితం) హరితరేణువులలో ఉంటూ సూర్యకాంతిని గ్రహిస్తుంది.",
            reviewSection: "Chapter 3 → Section 3: Essential Raw Materials"
          },
          {
            id: "q3",
            question: "Which gas is released into the atmosphere as a byproduct of photosynthesis?",
            questionTe: "కిరణజన్య సంయోగక్రియ ముగింపులో వాతావరణంలోకి విడుదలయ్యే వాయువు ఏది?",
            options: [
              "Oxygen",
              "Carbon monoxide",
              "Methane",
              "Helium"
            ],
            optionsTe: [
              "ఆక్సిజన్ (Oxygen)",
              "కార్బన్ మోనాక్సైడ్",
              "మీథేన్",
              "హీలియం"
            ],
            correctIndex: 0,
            explanation: "Water molecules are split during the light reaction, releasing pure Oxygen (O₂) into the atmosphere.",
            explanationTe: "నీటి అణువుల విచ్ఛిన్నం ద్వారా జీవుల శ్వాసక్రియకు అవసరమైన ఆక్సిజన్ విడుదలవుతుంది.",
            reviewSection: "Chapter 3 → Section 2: Chemical Equation"
          },
          {
            id: "q4",
            question: "What are the tiny pores on the underside of leaves called?",
            questionTe: "ఆకుల అడుగు భాగంలో ఉండే సూక్ష్మ రంధ్రాలను ఏమని పిలుస్తారు?",
            options: [
              "Pores",
              "Stomata",
              "Villi",
              "Alveoli"
            ],
            optionsTe: [
              "రంద్రాలు",
              "పత్రరంధ్రాలు (Stomata)",
              "విల్లి",
              "వాయుకోశాలు"
            ],
            correctIndex: 1,
            explanation: "Stomata are microscopic pores regulated by guard cells that facilitate gas exchange.",
            explanationTe: "పత్రరంధ్రాలు (Stomata) రక్షక కణాల ద్వారా నియంత్రించబడుతూ వాయు మార్పిడిని సాధ్యం చేస్తాయి.",
            reviewSection: "Chapter 3 → Section 4: Leaves and Stomata"
          },
          {
            id: "q5",
            question: "What carbohydrate is primarily synthesized by plants during photosynthesis?",
            questionTe: "కిరణజన్య సంయోగక్రియలో మొక్కలు ప్రాథమికంగా తయారుచేసే పిండిపదార్థం ఏది?",
            options: [
              "Glucose",
              "Lactose",
              "Fructose only",
              "Cellulose only"
            ],
            optionsTe: [
              "గ్లూకోజ్ (Glucose / C₆H₁₂O₆)",
              "లాక్టోస్",
              "ఫ్రక్టోజ్ మాత్రమే",
              "సెల్యులోజ్ మాత్రమే"
            ],
            correctIndex: 0,
            explanation: "Plants synthesize simple glucose (C₆H₁₂O₆), which is later stored as starch.",
            explanationTe: "మొక్కలు గ్లూకోజ్ (C₆H₁₂O₆)ను తయారుచేస్తాయి, ఇది తరువాత స్టార్చ్ (పిండిపదార్థం)గా నిల్వ ఉంటుంది.",
            reviewSection: "Chapter 3 → Section 1: What is Photosynthesis?"
          }
        ]
      },
      {
        id: "c8-sci-ch1",
        number: 1,
        title: {
          en: "Crop Production and Management",
          te: "పంట ఉత్పత్తి మరియు యాజమాన్యం (Crop Production)",
          hi: "फसल उत्पादन एवं प्रबंध"
        },
        readTime: "18 min",
        progress: 100,
        objectives: {
          en: [
            "Identify Kharif and Rabi crop seasons in India",
            "Learn essential agricultural practices: tilling, sowing, irrigation, and harvesting",
            "Differentiate between natural manure and chemical fertilizers"
          ],
          te: [
            "భారతదేశంలో ఖరీఫ్ మరియు రబీ పంట కాలాలను గుర్తించడం",
            "దున్నడం, విత్తడం, నీటిపారుదల మరియు కోత వంటి వ్యవసాయ పద్ధతులను నేర్చుకోవడం",
            "సహజ సేంద్రీయ ఎరువులు మరియు రసాయనిక ఎరువుల మధ్య వ్యత్యాసాన్ని అర్థం చేసుకోవడం"
          ]
        },
        sections: [
          {
            id: "sec1_1",
            title: {
              en: "1. Agricultural Seasons in India",
              te: "1. భారతదేశంలో వ్యవసాయ పంట రుతువులు"
            },
            content: {
              en: `Crops in India are divided based on rainfall and temperature seasons:
1. Kharif Crops: Sown in the rainy season (June to September). Examples include Paddy (Rice), Maize, Soybean, Groundnut, and Cotton.
2. Rabi Crops: Grown in the winter season (October to March). Examples include Wheat, Gram, Pea, Mustard, and Linseed.`,
              te: `భారతదేశంలో వర్షపాతం మరియు వాతావరణం ఆధారంగా పంటలను విభజించారు:
1. ఖరీఫ్ పంటలు: వర్షాకాలంలో (జూన్ నుండి సెప్టెంబర్) సాగు చేస్తారు. ఉదాహరణలు: వరి, మొక్కజొన్న, సోయాబీన్, వేరుశనగ, పత్తి.
2. రబీ పంటలు: శీతాకాలంలో (అక్టోబర్ నుండి మార్చి) పండిస్తారు. ఉదాహరణలు: గోధుమ, శనగ, బఠానీ, ఆవాలు.`
            },
            verifiedExcerpt: "Kharif crops grow in rainy season (Paddy, Maize), while Rabi crops grow in winter (Wheat, Gram).",
            verifiedExcerptTe: "ఖరీఫ్ పంటలు వర్షాకాలంలో (వరి, మొక్కజొన్న), రబీ పంటలు శీతాకాలంలో (గోధుమ, శనగ) పండుతాయి."
          },
          {
            id: "sec1_2",
            title: {
              en: "2. Modern Irrigation Techniques",
              te: "2. ఆధునిక నీటిపారుదల పద్ధతులు"
            },
            content: {
              en: `Water conservation in dry rural areas relies on modern methods:
- Drip Irrigation: Delivers water drop by drop directly to root zones, saving up to 60% of water and preventing weed growth.
- Sprinkler Irrigation: Simulates gentle rainfall, highly effective on uneven sandy terrain.`,
              te: `గ్రామీణ ప్రాంతాలలో నీటిని ఆదా చేసే ఆధునిక పద్ధతులు:
- బిందు సేద్యం (Drip Irrigation): నీటిని నేరుగా మొక్క వేళ్ళ వద్దకు చుక్కలు చుక్కలుగా అందిస్తుంది. ఇది 60% వరకు నీటిని ఆదా చేస్తుంది.
- తుంపర సేద్యం (Sprinkler System): వర్షం కురిసినట్లుగా నీటిని చిలకరిస్తుంది. అసమాన భూములలో ఇది ఎంతో ఉపయోగకరం.`
            },
            verifiedExcerpt: "Drip irrigation delivers water drop by drop directly to plant roots, conserving water in arid regions.",
            verifiedExcerptTe: "బిందు సేద్యం నీటిని నేరుగా వేళ్ళ వద్దకు చుక్కలుగా చేరవేసి నీటిని ఆదా చేస్తుంది."
          }
        ],
        terms: [
          {
            term: "Kharif Crop (ఖరీఫ్ పంట)",
            definition: "Crops sown during the rainy monsoon season (June–September).",
            definitionTe: "వర్షాకాలంలో సాగు చేసే పంటలు (వరి, పత్తి)."
          },
          {
            term: "Drip Irrigation (బిందు సేద్యం)",
            definition: "Water-saving method supplying water drop-by-drop at plant roots.",
            definitionTe: "మొక్క వేళ్ళ వద్దకు చుక్కలుగా నీటిని అందించే ఆదా పద్ధతి."
          }
        ],
        quiz: [
          {
            id: "q1_1",
            question: "Which of the following is an example of a Kharif crop?",
            questionTe: "క్రింది వాటిలో ఖరీఫ్ పంటకు ఉదాహరణ ఏది?",
            options: ["Wheat", "Gram", "Paddy (Rice)", "Mustard"],
            optionsTe: ["గోధుమ", "శనగ", "వరి (Paddy)", "ఆవాలు"],
            correctIndex: 2,
            explanation: "Paddy requires substantial standing water and is grown in the monsoon rainy season.",
            explanationTe: "వరి పంటకు ఎక్కువ నీరు అవసరం కాబట్టి దీనిని వర్షాకాలంలో సాగు చేస్తారు.",
            reviewSection: "Chapter 1 → Section 1: Agricultural Seasons"
          }
        ]
      },
      {
        id: "c8-sci-ch6",
        number: 6,
        title: {
          en: "Cell - Structure and Functions",
          te: "కణం - నిర్మాణం మరియు విధులు (Cell Structure)",
          hi: "कोशिका - संरचना एवं प्रकार्य"
        },
        readTime: "20 min",
        progress: 30,
        objectives: {
          en: [
            "Discover that cells are the basic structural units of all living organisms",
            "Differentiate between plant cells and animal cells",
            "Understand the functions of the Nucleus, Cell Wall, Cell Membrane, and Mitochondria"
          ],
          te: [
            "కణం అనేది జీవుల ప్రాథమిక నిర్మాణాత్మక మరియు క్రియాత్మక ప్రమాణం అని తెలుసుకోవడం",
            "వృక్ష కణం మరియు జంతు కణం మధ్య తేడాలను గుర్తించడం",
            "కేంద్రకం, కణ కవచం, కణ త్వచం మరియు మైటోకాండ్రియా విధులు అర్థం చేసుకోవడం"
          ]
        },
        sections: [
          {
            id: "sec6_1",
            title: {
              en: "1. The Basic Unit of Life",
              te: "1. జీవానికి ప్రాథమిక ప్రమాణం"
            },
            content: {
              en: `In 1665, Robert Hooke observed thin slices of cork under a simple microscope and noticed honeycomb-like compartments, which he termed 'cells'.

Every living organism on Earth is made of one or more cells. Unicellular organisms like Amoeba perform all bodily functions within a single cell, whereas multicellular organisms like humans and trees possess billions of specialized cells.`,
              te: `1665వ సంవత్సరంలో రాబర్ట్ హుక్ బెండు ముక్కను మైక్రోస్కోప్ కింద పరిశీలించి, తేనెటీగల గూడు లాంటి గదులను చూసి వాటికి 'కణాలు' (Cells) అని పేరు పెట్టారు.

భూమిపై ఉన్న ప్రతి జీవి కణాలతోనే నిర్మితమైంది. అమీబా వంటి ఏకకణ జీవులు ఒకే కణంలో అన్ని పనులు చేసుకోగా, మానవులు మరియు వృక్షాల వంటి బహుకణ జీవుల్లో బిలియన్ల కొద్దీ ప్రత్యేక కణాలు ఉంటాయి.`
            },
            verifiedExcerpt: "Robert Hooke discovered cells in 1665; cells are the basic structural unit of life.",
            verifiedExcerptTe: "1665లో రాబర్ట్ హుక్ కణాలను కనుగొన్నారు; కణం జీవుల ప్రాథమిక ప్రమాణం."
          },
          {
            id: "sec6_2",
            title: {
              en: "2. Plant Cell vs Animal Cell",
              te: "2. వృక్ష కణం మరియు జంతు కణం మధ్య తేడాలు"
            },
            content: {
              en: `Major differences between plant and animal cells:
1. Cell Wall: Plant cells possess an outer rigid cell wall made of cellulose for structural strength against environmental wind and pressure. Animal cells lack a cell wall.
2. Plastids / Chloroplasts: Present in green plant cells for photosynthesis; absent in animal cells.
3. Vacuole: Plant cells usually contain one large central vacuole, while animal cells have multiple small vacuoles.`,
              te: `వృక్ష మరియు జంతు కణాల మధ్య ముఖ్యమైన తేడాలు:
1. కణ కవచం (Cell Wall): వృక్ష కణాల్లో రక్షణ కొరకు సెల్యులోజ్ తో కూడిన దృఢమైన కణ కవచం ఉంటుంది. జంతు కణాల్లో ఇది ఉండదు.
2. హరితరేణువులు (Chloroplasts): మొక్కల కణాలలో ఆహార తయారీకి హరితరేణువులు ఉంటాయి; జంతు కణాలలో ఉండవు.
3. రిక్తిక (Vacuole): వృక్ష కణంలో ఒక పెద్ద కేంద్ర రిక్తిక ఉంటుంది, జంతు కణంలో చిన్న చిన్న రిక్తికలు ఉంటాయి.`
            },
            verifiedExcerpt: "Plant cells have a rigid cellulose cell wall and chloroplasts, which animal cells lack.",
            verifiedExcerptTe: "వృక్ష కణాల్లో కణ కవచం మరియు హరితరేణువులు ఉంటాయి, ఇవి జంతు కణాల్లో ఉండవు."
          }
        ],
        terms: [
          {
            term: "Cell Wall (కణ కవచం)",
            definition: "Rigid protective layer outside the membrane found specifically in plant cells.",
            definitionTe: "వృక్ష కణాల వెలుపల ఉండే దృఢమైన రక్షణ పొర."
          },
          {
            term: "Mitochondria (మైటోకాండ్రియా)",
            definition: "The powerhouse of the cell, generating ATP energy through cellular respiration.",
            definitionTe: "కణానికి అవసరమైన శక్తిని ఉత్పత్తి చేసే కణాంగం (కణ శక్త్యాగారాలు)."
          }
        ],
        quiz: [
          {
            id: "q6_1",
            question: "Which organelle is known as the 'powerhouse of the cell'?",
            questionTe: "కణ శక్త్యాగారం (Powerhouse of the cell) అని దేనిని పిలుస్తారు?",
            options: ["Nucleus", "Mitochondria", "Ribosome", "Golgi body"],
            optionsTe: ["కేంద్రకం", "మైటోకాండ్రియా", "రైబోజోమ్", "గాల్జీ సంక్లిష్టం"],
            correctIndex: 1,
            explanation: "Mitochondria release energy in the form of ATP during cellular respiration.",
            explanationTe: "మైటోకాండ్రియా శ్వాసక్రియ ద్వారా ఏటీపీ (ATP) రూపంలో శక్తిని ఉత్పత్తి చేస్తుంది.",
            reviewSection: "Chapter 6 → Section 2: Cell Organelles"
          }
        ]
      },
      {
        id: "c8-sci-ch8",
        number: 8,
        title: {
          en: "Force and Pressure",
          te: "బలం మరియు పీడనం (Force & Pressure)",
          hi: "बल तथा दाब"
        },
        readTime: "16 min",
        progress: 0,
        objectives: {
          en: [
            "Understand force as a push or pull on an object",
            "Explore contact forces (muscular, friction) and non-contact forces (magnetic, gravity, electrostatic)",
            "Define pressure as force per unit area (P = F / A)"
          ],
          te: [
            "ఒక వస్తువుపై నెట్టడం లేదా లాగడాన్ని బలం అంటారు అని తెలుసుకోవడం",
            "స్పర్శ బలాలు మరియు క్షేత్ర బలాల మధ్య తేడాను గ్రహించడం",
            "పీడనం = బలం / వైశాల్యం (P = F / A) సూత్రాన్ని నేర్చుకోవడం"
          ]
        },
        sections: [
          {
            id: "sec8_1",
            title: {
              en: "1. What is Force?",
              te: "1. బలం అంటే ఏమిటి?"
            },
            content: {
              en: `A push or a pull acting upon an object resulting from its interaction with another object is called a force. Forces have both magnitude and direction.

Forces can change the state of motion of an object, speed it up, slow it down, change its direction of travel, or alter its shape (like compressing a ball of clay).`,
              te: `ఒక వస్తువుపై జరిగే తోపుడు లేదా లాగుడు ప్రభావాన్ని బలం అంటారు. బలానికి దిశ మరియు పరిమాణం రెండూ ఉంటాయి.

బలం ఒక వస్తువు యొక్క నిశ్చల స్థితిని లేదా చలన స్థితిని మార్చగలదు, వస్తువు వేగాన్ని పెంచగలదు లేదా తగ్గించగలదు, మరియు వస్తువు ఆకారాన్ని మార్చగలదు.`
            },
            verifiedExcerpt: "Force is a push or pull that can change an object's speed, direction, or shape.",
            verifiedExcerptTe: "బలం అనేది వస్తువు వేగాన్ని, దిశను లేదా ఆకారాన్ని మార్చగల తోపుడు లేదా లాగుడు."
          },
          {
            id: "sec8_2",
            title: {
              en: "2. Concept of Pressure",
              te: "2. పీడనం భావన"
            },
            content: {
              en: `Pressure is defined as the force acting perpendicularly on a unit area of a surface:
Pressure = Force / Area (P = F / A)

Unit of pressure is the Pascal (Pa) or N/m².
Because area is in the denominator, a smaller contact area creates immense pressure for the same force. That is why a sharp knife cuts vegetables easily, while a blunt knife requires far more effort!`,
              te: `ప్రమాణ వైశాల్యం గల తలంపై లంబంగా పనిచేసే బలాన్ని పీడనం అంటారు:
పీడనం = బలం / వైశాల్యం (P = F / A)

పీడనాన్ని పాస్కల్ (Pa) లేదా న్యూటన్/మీటర్² లో కొలుస్తారు.
వైశాల్యం తగ్గేకొద్దీ పీడనం పెరుగుతుంది. అందుకే పదునైన కత్తి సులభంగా కూరగాయలను కోయగలదు!`
            },
            verifiedExcerpt: "Pressure is force applied per unit area (P = Force / Area).",
            verifiedExcerptTe: "పీడనం అనగా ప్రమాణ వైశాల్యంపై పనిచేసే బలం (P = F / A)."
          }
        ],
        terms: [
          {
            term: "Pressure (పీడనం)",
            definition: "Force applied per unit area perpendicular to the surface.",
            definitionTe: "ప్రమాణ వైశాల్యంపై లంబంగా పనిచేసే బలం."
          },
          {
            term: "Friction (ఘర్షణ)",
            definition: "A contact force that opposes the relative motion between two sliding surfaces.",
            definitionTe: "రెండు ఉపరితలాల సాపేక్ష చలనాన్ని వ్యతిరేకించే స్పర్శ బలం."
          }
        ],
        quiz: [
          {
            id: "q8_1",
            question: "What happens to pressure when the contact area decreases for a constant force?",
            questionTe: "స్థిరమైన బలం వద్ద స్పర్శ వైశాల్యం తగ్గితే పీడనం ఏమవుతుంది?",
            options: ["Decreases", "Increases", "Remains same", "Becomes zero"],
            optionsTe: ["తగ్గుతుంది", "పెరుగుతుంది", "మారదు", "సున్నా అవుతుంది"],
            correctIndex: 1,
            explanation: "Because Pressure = Force / Area, decreasing area increases pressure inversely.",
            explanationTe: "పీడనం = బలం / వైశాల్యం కాబట్టి, వైశాల్యం తగ్గితే పీడనం పెరుగుతుంది.",
            reviewSection: "Chapter 8 → Section 2: Concept of Pressure"
          }
        ]
      }
    ]
  },
  {
    id: "class8-science-en",
    class: "Class 8",
    grade: 8,
    subject: "Science",
    subjectName: { en: "Science (English)", te: "సైన్స్ (ఇంగ్లీష్ మీడియం)", hi: "विज्ञान" },
    language: "en",
    langName: "English",
    chaptersCount: 12,
    sizeMB: 18,
    isDownloaded: true,
    liteSizeMB: 8,
    fullSizeMB: 18,
    version: "v2.4",
    chapters: [] // Inherits/links to c8 science content
  },
  {
    id: "class8-math-en",
    class: "Class 8",
    grade: 8,
    subject: "Mathematics",
    subjectName: { en: "Mathematics", te: "గణితం (Mathematics)", hi: "गणित" },
    language: "en",
    langName: "English",
    chaptersCount: 14,
    sizeMB: 22,
    isDownloaded: true,
    liteSizeMB: 9,
    fullSizeMB: 22,
    version: "v1.8",
    chapters: [
      {
        id: "c8-math-ch4",
        number: 4,
        title: {
          en: "Fractions and Decimals",
          te: "భిన్నాలు మరియు దశాంశాలు (Fractions & Decimals)",
          hi: "भिन्न एवं दशमलव"
        },
        readTime: "22 min",
        progress: 40,
        objectives: {
          en: [
            "Master proper, improper, and mixed fractions",
            "Perform addition and subtraction with unlike denominators using LCM",
            "Multiply and divide fractions with reciprocal techniques"
          ],
          te: [
            "క్రమ, అపక్రమ మరియు మిశ్రమ భిన్నాలను గుర్తించడం",
            "భిన్నాల కూడికలు మరియు తీసివేతలు నేర్చుకోవడం",
            "వ్యుత్క్రమం (Reciprocal) ఉపయోగించి భిన్నాల గుణకారం మరియు భాగాహారం చేయడం"
          ]
        },
        sections: [
          {
            id: "m4_1",
            title: {
              en: "1. Understanding Fractions",
              te: "1. భిన్నాల ప్రాథమిక భావన"
            },
            content: {
              en: `A fraction represents a part of a whole or collection. Written as a/b, where 'a' is the numerator (parts taken) and 'b' is the denominator (total equal parts). Note that b can never be zero.

Types of Fractions:
- Proper fraction: Numerator < Denominator (e.g., 3/4). Value is always less than 1.
- Improper fraction: Numerator ≥ Denominator (e.g., 7/4).
- Mixed fraction: A whole number combined with a proper fraction (e.g., 1 3/4 = 7/4).`,
              te: `మొత్తం భాగంలో ఒక భాగాన్ని సూచించే సంఖ్యను భిన్నం అంటారు. దీనిని a/b రూపంలో రాస్తారు, ఇక్కడ a అనేది లవం (Numerator) మరియు b అనేది హారం (Denominator). హారం ఎన్నడూ సున్నా కాకూడదు.

భిన్నాల రకాలు:
- క్రమ భిన్నం: లవం < హారం (ఉదా: 3/4).
- అపక్రమ భిన్నం: లవం ≥ హారం (ఉదా: 7/4).
- మిశ్రమ భిన్నం: పూర్ణాంకం మరియు క్రమ భిన్నం కలయిక (ఉదా: 1 3/4).`
            },
            verifiedExcerpt: "A fraction a/b represents a part of a whole; proper fractions have numerator smaller than denominator.",
            verifiedExcerptTe: "భిన్నం మొత్తం భాగంలో ఒక భాగాన్ని తెలుపుతుంది; క్రమ భిన్నంలో లవం హారం కంటే చిన్నదిగా ఉంటుంది."
          },
          {
            id: "m4_2",
            title: {
              en: "2. Operations with Fractions",
              te: "2. భిన్నాల గణన పద్ధతులు"
            },
            content: {
              en: `To add or subtract fractions with unlike denominators, first find the Least Common Multiple (LCM) of the denominators to convert them into like fractions.

Example: 1/2 + 1/3
LCM of 2 and 3 is 6.
(3/6) + (2/6) = (3 + 2)/6 = 5/6.

For Division: Multiply by the reciprocal of the second fraction!
(2/3) ÷ (4/5) = (2/3) × (5/4) = 10/12 = 5/6.`,
              te: `వేర్వేరు హారాలు ఉన్న భిన్నాలను కూడేటప్పుడు లేదా తీసివేసేటప్పుడు మొదట కసాగు (LCM) కనుగొని సజాతి భిన్నాలుగా మార్చాలి.

ఉదాహరణ: 1/2 + 1/3
2 మరియు 3 ల కసాగు 6.
(3/6) + (2/6) = 5/6.

భాగాహారానికి: రెండవ భిన్నం యొక్క వ్యుత్క్రమంతో గుణించాలి!`
            },
            verifiedExcerpt: "To add unlike fractions, find LCM of denominators; to divide, multiply by the reciprocal.",
            verifiedExcerptTe: "విజాతి భిన్నాలను కూడటానికి కసాగు కనుగొనాలి; భాగించడానికి వ్యుత్క్రమంతో గుణించాలి."
          }
        ],
        terms: [
          {
            term: "Numerator (లవం)",
            definition: "The top number in a fraction denoting parts considered.",
            definitionTe: "భిన్నంలో పైన ఉండే సంఖ్య."
          },
          {
            term: "Denominator (హారం)",
            definition: "The bottom number showing total equal parts into which whole is divided.",
            definitionTe: "భిన్నంలో క్రింద ఉండే సంఖ్య."
          },
          {
            term: "Reciprocal (వ్యుత్క్రమం)",
            definition: "The inverted fraction where numerator and denominator swap places (e.g. 3/4 becomes 4/3).",
            definitionTe: "లవ, హారాలను తారుమారు చేయగా వచ్చే భిన్నం (3/4 కి వ్యుత్క్రమం 4/3)."
          }
        ],
        quiz: [
          {
            id: "qm1",
            question: "What is the result of 1/2 + 1/3?",
            questionTe: "1/2 + 1/3 యొక్క విలువ ఎంత?",
            options: ["2/5", "5/6", "1/6", "2/6"],
            optionsTe: ["2/5", "5/6", "1/6", "2/6"],
            correctIndex: 1,
            explanation: "Convert to common denominator 6: 3/6 + 2/6 = 5/6.",
            explanationTe: "ఉమ్మడి హారం 6 కి మార్చగా: 3/6 + 2/6 = 5/6.",
            reviewSection: "Chapter 4 → Section 2: Operations with Fractions"
          }
        ]
      }
    ]
  },
  {
    id: "class8-social-te",
    class: "Class 8",
    grade: 8,
    subject: "Social Studies",
    subjectName: { en: "Social Studies", te: "సాంఘిక శాస్త్రం (Social Studies)", hi: "सामाजिक विज्ञान" },
    language: "te",
    langName: "తెలుగు (Telugu)",
    chaptersCount: 10,
    sizeMB: 16,
    isDownloaded: false, // Can be downloaded in demo
    liteSizeMB: 7,
    fullSizeMB: 16,
    version: "v1.2",
    chapters: []
  },
  {
    id: "class7-science-en",
    class: "Class 7",
    grade: 7,
    subject: "General Science",
    subjectName: { en: "General Science", te: "సాధారణ సైన్స్", hi: "सामान्य विज्ञान" },
    language: "en",
    langName: "English",
    chaptersCount: 8,
    sizeMB: 14,
    isDownloaded: false,
    liteSizeMB: 6,
    fullSizeMB: 14,
    version: "v1.0",
    chapters: []
  },
  {
    id: "class6-evs-hi",
    class: "Class 6",
    grade: 6,
    subject: "Environmental Studies",
    subjectName: { en: "Environmental Studies", te: "పర్యావరణ విద్య", hi: "पर्यावरण अध्ययन" },
    language: "hi",
    langName: "हिंदी (Hindi)",
    chaptersCount: 6,
    sizeMB: 10,
    isDownloaded: false,
    liteSizeMB: 4,
    fullSizeMB: 10,
    version: "v1.0",
    chapters: []
  }
];

window.CURRICULUM_PACKS = CURRICULUM_PACKS;
