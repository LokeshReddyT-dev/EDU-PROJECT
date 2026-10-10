// api/curriculum.js — Curriculum packs metadata endpoint
// GET /api/curriculum              — List all available curriculum packs
// GET /api/curriculum?id=class8-science-te — Get a specific pack's metadata

import { handleCors } from "./_lib/cors.js";

// Mirrors the packs defined in js/curriculum-data.js (backend source of truth)
// In a production system this would come from a database or CMS.
const CURRICULUM_PACKS = [
  {
    id: "class8-science-te",
    class: "Class 8",
    grade: 8,
    subject: "Science",
    language: "te",
    languageName: "Telugu",
    title: "8th Class Science",
    description: "SCERT Telangana 8th Class Science covering Crop Production, Microorganisms, Metals & Non-Metals, Photosynthesis, Cell Structure, Combustion, Conservation, Reproduction, and Light.",
    chapterCount: 8,
    sizeKB: 48,
    version: "1.0.0",
    updatedAt: "2026-10-01",
    downloadable: true,
    tags: ["science", "class8", "telangana", "scert"],
  },
  {
    id: "class7-math-en",
    class: "Class 7",
    grade: 7,
    subject: "Mathematics",
    language: "en",
    languageName: "English",
    title: "7th Class Mathematics",
    description: "CBSE Class 7 Mathematics covering Integers, Fractions, Algebra, Geometry, and Data Handling.",
    chapterCount: 6,
    sizeKB: 32,
    version: "1.0.0",
    updatedAt: "2026-10-01",
    downloadable: true,
    tags: ["mathematics", "class7", "cbse"],
  },
  {
    id: "class9-science-en",
    class: "Class 9",
    grade: 9,
    subject: "Science",
    language: "en",
    languageName: "English",
    title: "9th Class Science",
    description: "CBSE Class 9 Science covering Matter, Atoms, Motion, Force, Tissues, Diversity, Natural Resources.",
    chapterCount: 9,
    sizeKB: 56,
    version: "1.0.0",
    updatedAt: "2026-10-01",
    downloadable: true,
    tags: ["science", "class9", "cbse"],
  },
  {
    id: "class6-evs-hi",
    class: "Class 6",
    grade: 6,
    subject: "EVS",
    language: "hi",
    languageName: "Hindi",
    title: "6th Class पर्यावरण अध्ययन",
    description: "कक्षा 6 पर्यावरण अध्ययन — पौधे, जानवर, भोजन, पानी, और आसपास का वातावरण।",
    chapterCount: 7,
    sizeKB: 28,
    version: "1.0.0",
    updatedAt: "2026-10-01",
    downloadable: true,
    tags: ["evs", "class6", "hindi"],
  },
];

export default function handler(req, res) {
  if (handleCors(req, res)) return;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed. Use GET." });
  }

  const { id, grade, subject, language } = req.query;

  // Return single pack by ID
  if (id) {
    const pack = CURRICULUM_PACKS.find((p) => p.id === id);
    if (!pack) {
      return res.status(404).json({ error: `Pack '${id}' not found.` });
    }
    return res.status(200).json({ pack });
  }

  // Filter packs
  let results = [...CURRICULUM_PACKS];
  if (grade) results = results.filter((p) => p.grade === parseInt(grade, 10));
  if (subject) results = results.filter((p) => p.subject.toLowerCase() === subject.toLowerCase());
  if (language) results = results.filter((p) => p.language === language);

  return res.status(200).json({
    total: results.length,
    packs: results,
    updatedAt: new Date().toISOString(),
  });
}
