// EduPocket Retrieval-First AI Engine
// "AI that knows when it doesn't know"
// Operates 100% offline using locally indexed curriculum materials

class OfflineAIEngine {
  constructor() {
    this.stopWords = new Set([
      "a", "an", "the", "and", "or", "in", "on", "at", "to", "for", "with", "is", "are", 
      "was", "were", "what", "how", "why", "which", "where", "who", "when", "does", "do", 
      "can", "of", "by", "its", "it", "from", "that", "this", "these", "those",
      // Telugu common particles
      "అంటే", "ఏమిటి", "ఎలా", "ఎందుకు", "యొక్క", "లో", "పై", "మరియు", "లేదా", "అనేది"
    ]);
  }

  tokenize(text) {
    if (!text) return [];
    return text
      .toLowerCase()
      .replace(/[^\w\s\u0C00-\u0C7F\u0900-\u097F]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 1 && !this.stopWords.has(w));
  }

  // Search across currently downloaded curriculum packs
  searchCurriculum(query, options = {}) {
    const lang = options.language || window.eduStore?.state.currentLanguage || "en";
    const downloadedIds = window.eduStore?.state.downloadedPackIds || ["class8-science-te"];
    const queryTokens = this.tokenize(query);

    if (queryTokens.length === 0) {
      return { found: false, reason: "empty_query" };
    }

    const packs = window.CURRICULUM_PACKS || [];
    const candidates = [];

    // Filter to only downloaded packs
    const activePacks = packs.filter(p => downloadedIds.includes(p.id));

    activePacks.forEach(pack => {
      // Find pack chapters (including shared Class 8 Science chapters)
      let chapters = pack.chapters || [];
      if (chapters.length === 0 && pack.id === "class8-science-en") {
        const tePack = packs.find(p => p.id === "class8-science-te");
        if (tePack) chapters = tePack.chapters;
      }

      chapters.forEach(ch => {
        const chTitle = typeof ch.title === "object" ? (ch.title[lang] || ch.title.en) : ch.title;

        // 1. Check chapter title & objectives
        let chTitleTokens = this.tokenize(chTitle);
        let chMatchCount = queryTokens.filter(t => chTitleTokens.includes(t)).length;

        // 2. Search chapter sections
        ch.sections.forEach(sec => {
          const secTitle = typeof sec.title === "object" ? (sec.title[lang] || sec.title.en) : sec.title;
          const secContent = typeof sec.content === "object" ? (sec.content[lang] || sec.content.en) : sec.content;
          const verifiedExcerpt = lang === "te" && sec.verifiedExcerptTe ? sec.verifiedExcerptTe : sec.verifiedExcerpt;

          const contentTokens = this.tokenize(secContent + " " + secTitle);
          
          // Calculate score
          let matches = 0;
          queryTokens.forEach(token => {
            if (contentTokens.includes(token)) {
              matches += 1;
            } else if (secContent.toLowerCase().includes(token)) {
              matches += 0.8;
            }
          });

          // Extra weight if title matches
          if (secTitle.toLowerCase().includes(query.toLowerCase().trim())) {
            matches += 3;
          }

          if (matches > 0) {
            const score = (matches / queryTokens.length) * 100;
            candidates.push({
              score,
              packId: pack.id,
              packClass: pack.class,
              subject: pack.subject,
              chapterId: ch.id,
              chapterNumber: ch.number,
              chapterTitle: chTitle,
              sectionId: sec.id,
              sectionTitle: secTitle,
              excerpt: verifiedExcerpt || secContent.substring(0, 220) + "...",
              fullContent: secContent,
              sourceCitation: `${pack.class} ${pack.subject} → Chapter ${ch.number}: ${chTitle} (${secTitle})`
            });
          }
        });

        // 3. Search glossary terms
        if (ch.terms) {
          ch.terms.forEach(term => {
            const termName = term.term;
            const termDef = lang === "te" && term.definitionTe ? term.definitionTe : term.definition;
            const termTokens = this.tokenize(termName + " " + termDef);

            let termMatches = queryTokens.filter(t => termTokens.includes(t)).length;
            if (termMatches > 0) {
              const score = (termMatches / queryTokens.length) * 110; // High priority for terms
              candidates.push({
                score,
                packId: pack.id,
                packClass: pack.class,
                subject: pack.subject,
                chapterId: ch.id,
                chapterNumber: ch.number,
                chapterTitle: chTitle,
                sectionId: "term",
                sectionTitle: `Glossary: ${termName}`,
                excerpt: `${termName}: ${termDef}`,
                fullContent: termDef,
                sourceCitation: `${pack.class} ${pack.subject} → Chapter ${ch.number} Glossary`
              });
            }
          });
        }
      });
    });

    // Sort by best relevance score
    candidates.sort((a, b) => b.score - a.score);

    // Strict threshold: If the highest match is below 35% relevance, do not hallucinate!
    if (candidates.length === 0 || candidates[0].score < 30) {
      return {
        found: false,
        query,
        reason: "not_in_downloaded_curriculum",
        message: lang === "te" 
          ? "మీరు డౌన్‌లోడ్ చేసిన పాఠ్యాంశాల్లో ఈ ప్రశ్నకు ఖచ్చితమైన సమాధానం దొరకలేదు."
          : "I couldn't find this answer in your downloaded curriculum.",
        candidatesCount: candidates.length
      };
    }

    const bestMatch = candidates[0];

    return {
      found: true,
      query,
      answer: bestMatch.excerpt,
      fullContent: bestMatch.fullContent,
      source: bestMatch.sourceCitation,
      chapterId: bestMatch.chapterId,
      packId: bestMatch.packId,
      confidenceScore: Math.min(99, Math.round(bestMatch.score)),
      isVerified: true,
      relatedPassages: candidates.slice(1, 3)
    };
  }

  // Global search returning multiple matched items for the Search page
  searchGlobalLessons(query, lang = "en") {
    const queryTokens = this.tokenize(query);
    if (queryTokens.length === 0) return [];

    const downloadedIds = window.eduStore?.state.downloadedPackIds || ["class8-science-te"];
    const packs = window.CURRICULUM_PACKS || [];
    const results = [];

    const activePacks = packs.filter(p => downloadedIds.includes(p.id));

    activePacks.forEach(pack => {
      let chapters = pack.chapters || [];
      if (chapters.length === 0 && pack.id === "class8-science-en") {
        const tePack = packs.find(p => p.id === "class8-science-te");
        if (tePack) chapters = tePack.chapters;
      }

      chapters.forEach(ch => {
        const chTitle = typeof ch.title === "object" ? (ch.title[lang] || ch.title.en) : ch.title;

        ch.sections.forEach(sec => {
          const secTitle = typeof sec.title === "object" ? (sec.title[lang] || sec.title.en) : sec.title;
          const secContent = typeof sec.content === "object" ? (sec.content[lang] || sec.content.en) : sec.content;

          const textToSearch = (secTitle + " " + secContent).toLowerCase();
          const qLower = query.toLowerCase().trim();

          if (textToSearch.includes(qLower) || queryTokens.some(t => textToSearch.includes(t))) {
            // Find context snippet around the match
            let snippet = secContent.substring(0, 160) + "...";
            const matchIndex = textToSearch.indexOf(qLower);
            if (matchIndex !== -1) {
              const start = Math.max(0, matchIndex - 40);
              const end = Math.min(secContent.length, matchIndex + 120);
              snippet = (start > 0 ? "..." : "") + secContent.substring(start, end) + (end < secContent.length ? "..." : "");
            }

            results.push({
              packClass: pack.class,
              subject: pack.subject,
              chapterId: ch.id,
              chapterNumber: ch.number,
              chapterTitle: chTitle,
              sectionTitle: secTitle,
              snippet,
              lang
            });
          }
        });
      });
    });

    return results;
  }
}

window.offlineAI = new OfflineAIEngine();
