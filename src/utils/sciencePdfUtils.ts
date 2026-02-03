// Enhanced PDF utilities for Science RAG with better chunking and semantic search
import * as pdfjsLib from 'pdfjs-dist';
import lunr from 'lunr';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// Enhanced configuration constants
const CHUNK_SIZE_CHARS = 1500; // Smaller chunks for better precision
const CHUNK_OVERLAP_CHARS = 500; // Larger overlap for better context preservation
const TOP_K = 8; // Increased for better retrieval
const MAX_CONTEXT_CHUNKS = 10; // Maximum chunks to use in context

export interface ScienceChunk {
  id: string;
  text: string;
  page_range_start: number;
  page_range_end: number;
  position: number;
  keywords: string[]; // Extracted keywords for better matching
  topic: string; // Detected topic/category
}

// Science-specific terminology mapping for better semantic search
const SCIENCE_TERMS: Record<string, string[]> = {
  // Biology terms
  'cell': ['cellular', 'cytoplasm', 'nucleus', 'organelle', 'membrane', 'mitochondria', 'ribosome'],
  'biology': ['biological', 'organism', 'living', 'life', 'biotic', 'ecosystem'],
  'organism': ['organism', 'species', 'living thing', 'creature', 'life form'],
  'photosynthesis': ['chlorophyll', 'light reaction', 'dark reaction', 'carbon dioxide', 'glucose'],
  'respiration': ['aerobic', 'anaerobic', 'oxygen', 'carbon dioxide', 'energy', 'ATP'],
  'digestion': ['digestive', 'stomach', 'intestine', 'enzyme', 'nutrient', 'absorption'],
  'circulation': ['circulatory', 'heart', 'blood', 'vessel', 'artery', 'vein', 'capillary'],
  'reproduction': ['reproductive', 'gamete', 'fertilization', 'embryo', 'offspring'],
  'genetics': ['gene', 'DNA', 'chromosome', 'heredity', 'inheritance', 'trait', 'allele'],
  'evolution': ['natural selection', 'adaptation', 'species', 'fossil', 'mutation'],
  'ecosystem': ['habitat', 'niche', 'food chain', 'food web', 'biodiversity', 'environment'],
  
  // Physics terms
  'motion': ['velocity', 'acceleration', 'speed', 'displacement', 'distance', 'kinematics'],
  'force': ['newton', 'friction', 'gravity', 'tension', 'normal', 'applied'],
  'energy': ['kinetic', 'potential', 'mechanical', 'thermal', 'conservation', 'work'],
  'light': ['reflection', 'refraction', 'lens', 'mirror', 'wavelength', 'frequency', 'spectrum'],
  'sound': ['wave', 'frequency', 'amplitude', 'pitch', 'echo', 'vibration'],
  'electricity': ['current', 'voltage', 'resistance', 'circuit', 'conductor', 'insulator'],
  'magnetism': ['magnetic field', 'pole', 'attraction', 'repulsion', 'compass'],
  'heat': ['temperature', 'thermal', 'conduction', 'convection', 'radiation', 'calorie'],
  
  // Chemistry terms
  'atom': ['atomic', 'proton', 'neutron', 'electron', 'nucleus', 'shell', 'orbital'],
  'molecule': ['compound', 'bond', 'covalent', 'ionic', 'chemical formula'],
  'reaction': ['chemical', 'reactant', 'product', 'equation', 'balance', 'catalyst'],
  'acid': ['acidic', 'pH', 'hydrogen ion', 'corrosive', 'sour'],
  'base': ['alkaline', 'hydroxide', 'bitter', 'neutralization'],
  'periodic': ['element', 'period', 'group', 'atomic number', 'atomic mass'],
  'bond': ['ionic bond', 'covalent bond', 'metallic bond', 'hydrogen bond'],
  'solution': ['solute', 'solvent', 'dissolve', 'concentration', 'saturated'],
};

// Extract keywords from text for better matching
const extractKeywords = (text: string): string[] => {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const uniqueWords = [...new Set(words)];
  
  // Add science-specific terms if found
  const scienceKeywords: string[] = [];
  Object.entries(SCIENCE_TERMS).forEach(([key, synonyms]) => {
    if (text.toLowerCase().includes(key)) {
      scienceKeywords.push(key, ...synonyms.slice(0, 3));
    }
  });
  
  return [...uniqueWords.slice(0, 10), ...scienceKeywords.slice(0, 5)];
};

// Detect topic/category from text
const detectTopic = (text: string): string => {
  const lowerText = text.toLowerCase();
  
  // Biology topics
  if (lowerText.match(/\b(cell|organism|photosynthesis|respiration|digestion|circulation|reproduction|genetics|evolution|ecosystem)\b/)) {
    return 'biology';
  }
  
  // Physics topics
  if (lowerText.match(/\b(motion|force|energy|light|sound|electricity|magnetism|heat|wave|velocity|acceleration)\b/)) {
    return 'physics';
  }
  
  // Chemistry topics
  if (lowerText.match(/\b(atom|molecule|reaction|acid|base|periodic|bond|solution|element|compound)\b/)) {
    return 'chemistry';
  }
  
  return 'general';
};

/**
 * Enhanced text normalization for science content
 */
export const normalizeText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    // Preserve scientific notation and formulas
    .replace(/\s*([=+\-×÷])\s*/g, ' $1 ')
    .trim();
};

/**
 * Enhanced PDF text extraction with better structure preservation
 */
export const extractPDFText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  
  let fullText = '';
  const totalPages = pdf.numPages;
  
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Extract text items with better structure preservation
    const pageText = textContent.items
      .map((item: any) => {
        // Preserve spacing for better structure
        if (item.hasEOL) {
          return item.str + '\n';
        }
        return item.str + ' ';
      })
      .join('')
      .replace(/\n\s+/g, '\n')
      .trim();
    
    if (pageText) {
      fullText += `\n\n---PAGE ${pageNum}---\n\n${pageText}`;
    }
  }
  
  return normalizeText(fullText);
};

/**
 * Enhanced semantic chunking with topic detection and keyword extraction
 */
export const chunkText = (
  text: string, 
  chunkSize: number = CHUNK_SIZE_CHARS, 
  overlapSize: number = CHUNK_OVERLAP_CHARS
): ScienceChunk[] => {
  const chunks: ScienceChunk[] = [];
  let currentPosition = 0;
  let chunkId = 0;
  
  // Split by major sections first (chapters, units, etc.)
  const majorSections = text.split(/(?=\n\s*(?:Chapter|Unit|Section|Topic)\s+\d+[:\-])/i);
  
  for (const section of majorSections) {
    let sectionPosition = 0;
    
    while (sectionPosition < section.length) {
      const chunkEnd = Math.min(sectionPosition + chunkSize, section.length);
      let chunkText = section.slice(sectionPosition, chunkEnd).trim();
      
      // Smart boundary detection - prefer sentence boundaries
      if (chunkEnd < section.length) {
        const sentenceEndings = ['.', '!', '?', ':', ';'];
        let bestBreak = -1;
        let bestBreakPos = -1;
        
        for (let i = chunkText.length - 1; i >= chunkSize * 0.5; i--) {
          if (sentenceEndings.includes(chunkText[i])) {
            // Check if it's not part of a number or abbreviation
            const before = chunkText[i - 1];
            const after = chunkText[i + 1];
            
            if (before && before.match(/\d/) && after && after.match(/\d/)) {
              continue; // Skip decimal points
            }
            
            if (before && before.match(/[A-Za-z]/) && after && after.match(/[A-Za-z]/)) {
              continue; // Skip abbreviations
            }
            
            bestBreak = i;
            bestBreakPos = i;
            break;
          }
        }
        
        if (bestBreak > chunkSize * 0.6) {
          chunkText = chunkText.slice(0, bestBreak + 1).trim();
        } else {
          // Fallback to paragraph boundary
          const lastParagraphEnd = chunkText.lastIndexOf('\n\n');
          if (lastParagraphEnd > chunkSize * 0.5) {
            chunkText = chunkText.slice(0, lastParagraphEnd).trim();
          }
        }
      }
      
      if (chunkText.length > 50) { // Minimum chunk size
        // Extract page information
        const pageMatches = chunkText.match(/---PAGE (\d+)---/g);
        let pageStart = 1, pageEnd = 1;
        
        if (pageMatches && pageMatches.length > 0) {
          const firstPage = pageMatches[0].match(/\d+/);
          const lastPage = pageMatches[pageMatches.length - 1].match(/\d+/);
          pageStart = firstPage ? parseInt(firstPage[0]) : 1;
          pageEnd = lastPage ? parseInt(lastPage[0]) : pageStart;
        }
        
        const cleanChunkText = chunkText.replace(/---PAGE \d+---/g, '').trim();
        const keywords = extractKeywords(cleanChunkText);
        const topic = detectTopic(cleanChunkText);
        
        chunks.push({
          id: `chunk_${chunkId++}`,
          text: cleanChunkText,
          page_range_start: pageStart,
          page_range_end: pageEnd,
          position: currentPosition + sectionPosition,
          keywords,
          topic
        });
      }
      
      // Move position forward with overlap
      sectionPosition = chunkEnd - overlapSize;
      
      // Prevent infinite loop
      if (sectionPosition <= (chunks[chunks.length - 1]?.position || 0)) {
        sectionPosition = chunkEnd;
      }
    }
    
    currentPosition += section.length;
  }
  
  return chunks;
};

/**
 * Enhanced search index creation with multiple fields
 */
export const createSearchIndex = (chunks: ScienceChunk[]): lunr.Index => {
  return lunr(function () {
    this.ref('id');
    this.field('text', { boost: 10 });
    this.field('keywords', { boost: 5 });
    this.field('topic', { boost: 3 });
    this.field('id');
    
    chunks.forEach((chunk) => {
      this.add({
        id: chunk.id,
        text: chunk.text,
        keywords: chunk.keywords.join(' '),
        topic: chunk.topic
      });
    });
  });
};

/**
 * Enhanced multi-strategy search with semantic understanding
 */
export const searchChunks = (
  searchIndex: lunr.Index, 
  chunks: ScienceChunk[], 
  query: string, 
  topK: number = TOP_K
): ScienceChunk[] => {
  const normalizedQuery = normalizeText(query.toLowerCase());
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
  
  try {
    let results: any[] = [];
    const scoredChunks = new Map<string, number>();
    
    // Strategy 1: Exact phrase search (highest priority)
    const phraseResults = searchIndex.search(`"${normalizedQuery}"`);
    phraseResults.forEach(result => {
      scoredChunks.set(result.ref, (scoredChunks.get(result.ref) || 0) + 100);
    });
    
    // Strategy 2: All words with AND logic
    if (queryWords.length > 1) {
      const andQuery = queryWords.map(word => `+${word}`).join(' ');
      const andResults = searchIndex.search(andQuery);
      andResults.forEach(result => {
        scoredChunks.set(result.ref, (scoredChunks.get(result.ref) || 0) + 50);
      });
    }
    
    // Strategy 3: Individual word search
    queryWords.forEach(word => {
      const wordResults = searchIndex.search(word);
      wordResults.forEach(result => {
        scoredChunks.set(result.ref, (scoredChunks.get(result.ref) || 0) + 20);
      });
    });
    
    // Strategy 4: Fuzzy search for typos
    queryWords.forEach(word => {
      if (word.length > 4) {
        const fuzzyResults = searchIndex.search(`${word}~1`);
        fuzzyResults.forEach(result => {
          scoredChunks.set(result.ref, (scoredChunks.get(result.ref) || 0) + 10);
        });
      }
    });
    
    // Strategy 5: Semantic similarity using science terms
    const semanticMatches = new Map<string, number>();
    Object.entries(SCIENCE_TERMS).forEach(([key, synonyms]) => {
      if (queryWords.some(word => word.includes(key) || key.includes(word))) {
        synonyms.forEach(synonym => {
          chunks.forEach(chunk => {
            if (chunk.text.toLowerCase().includes(synonym) || 
                chunk.keywords.some(kw => kw.includes(synonym))) {
              semanticMatches.set(chunk.id, (semanticMatches.get(chunk.id) || 0) + 15);
            }
          });
        });
      }
    });
    
    semanticMatches.forEach((score, chunkId) => {
      scoredChunks.set(chunkId, (scoredChunks.get(chunkId) || 0) + score);
    });
    
    // Strategy 6: Topic-based matching
    const queryTopic = detectTopic(normalizedQuery);
    chunks.forEach(chunk => {
      if (chunk.topic === queryTopic) {
        scoredChunks.set(chunk.id, (scoredChunks.get(chunk.id) || 0) + 5);
      }
    });
    
    // Strategy 7: Keyword matching
    queryWords.forEach(word => {
      chunks.forEach(chunk => {
        if (chunk.keywords.some(kw => kw.includes(word) || word.includes(kw))) {
          scoredChunks.set(chunk.id, (scoredChunks.get(chunk.id) || 0) + 8);
        }
      });
    });
    
    // Convert to array and sort by score
    results = Array.from(scoredChunks.entries())
      .map(([ref, score]) => ({ ref, score }))
      .sort((a, b) => b.score - a.score);
    
    // Get top K chunks
    const relevantChunks = results
      .slice(0, topK)
      .map(result => chunks.find(chunk => chunk.id === result.ref))
      .filter(chunk => chunk !== undefined) as ScienceChunk[];
    
    // If we don't have enough results, add more based on substring matching
    if (relevantChunks.length < topK) {
      const remaining = chunks
        .filter(chunk => !relevantChunks.find(c => c.id === chunk.id))
        .map(chunk => {
          const chunkText = chunk.text.toLowerCase();
          let matchScore = 0;
          queryWords.forEach(word => {
            if (chunkText.includes(word)) {
              matchScore += 1;
            }
          });
          return { chunk, score: matchScore };
        })
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, topK - relevantChunks.length)
        .map(item => item.chunk);
      
      relevantChunks.push(...remaining);
    }
    
    return relevantChunks.slice(0, MAX_CONTEXT_CHUNKS);
    
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to simple substring search
    const queryLower = normalizedQuery.toLowerCase();
    return chunks
      .filter(chunk => chunk.text.toLowerCase().includes(queryLower))
      .slice(0, topK);
  }
};

/**
 * Re-rank chunks based on relevance to query and context
 */
export const rerankChunks = (
  chunks: ScienceChunk[], 
  query: string, 
  currentChapter?: string
): ScienceChunk[] => {
  const queryLower = query.toLowerCase();
  const chapterLower = currentChapter?.toLowerCase() || '';
  
  return chunks
    .map(chunk => {
      let score = 0;
      const chunkText = chunk.text.toLowerCase();
      
      // Boost if chapter name appears in chunk
      if (chapterLower && chunkText.includes(chapterLower)) {
        score += 20;
      }
      
      // Boost for exact query matches
      if (chunkText.includes(queryLower)) {
        score += 15;
      }
      
      // Boost for keyword matches
      const queryWords = queryLower.split(/\s+/);
      queryWords.forEach(word => {
        if (chunk.keywords.some(kw => kw.includes(word))) {
          score += 5;
        }
      });
      
      // Boost for topic relevance
      const queryTopic = detectTopic(query);
      if (chunk.topic === queryTopic) {
        score += 10;
      }
      
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .map(item => item.chunk);
};




