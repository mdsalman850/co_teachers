// utils/pdfUtils.ts
import * as pdfjsLib from 'pdfjs-dist';
import lunr from 'lunr';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

// Configuration constants
const CHUNK_SIZE_CHARS = 2000; // Reduced for more focused chunks
const CHUNK_OVERLAP_CHARS = 400; // Increased overlap for better context preservation
const TOP_K = 5; // Increased for better retrieval

export interface Chunk {
  id: string;
  text: string;
  page_range_start: number;
  page_range_end: number;
  position: number;
}

/**
 * Extract text content from a PDF file
 * @param {File} file - PDF file to extract text from
 * @returns {Promise<string>} - Extracted text content
 */
export const extractPDFText = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
  
  let fullText = '';
  const totalPages = pdf.numPages;
  
  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    // Extract text items and join them
    const pageText = textContent.items
      .map((item: any) => item.str)
      .join(' ')
      .trim();
    
    if (pageText) {
      fullText += `\n\n---PAGE ${pageNum}---\n\n${pageText}`;
    }
  }
  
  return normalizeText(fullText);
};

/**
 * Normalize text by cleaning whitespace and basic punctuation
 * @param {string} text - Raw text to normalize
 * @returns {string} - Normalized text
 */
export const normalizeText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
    .replace(/\n\s*\n/g, '\n\n') // Normalize paragraph breaks
    .replace(/['']/g, "'") // Normalize quotes
    .replace(/[""]/g, '"') // Normalize double quotes
    .trim();
};

/**
 * Split text into overlapping chunks
 * @param {string} text - Text to chunk
 * @param {number} chunkSize - Size of each chunk in characters
 * @param {number} overlapSize - Overlap between chunks in characters
 * @returns {Array} - Array of chunk objects
 */
export const chunkText = (
  text: string, 
  chunkSize: number = CHUNK_SIZE_CHARS, 
  overlapSize: number = CHUNK_OVERLAP_CHARS
): Chunk[] => {
  const chunks: Chunk[] = [];
  let currentPosition = 0;
  let chunkId = 0;
  
  while (currentPosition < text.length) {
    const chunkEnd = Math.min(currentPosition + chunkSize, text.length);
    let chunkText = text.slice(currentPosition, chunkEnd).trim();
    
    // Try to break at sentence boundary if we're not at the end
    if (chunkEnd < text.length) {
      const lastSentenceEnd = Math.max(
        chunkText.lastIndexOf('.'),
        chunkText.lastIndexOf('!'),
        chunkText.lastIndexOf('?'),
        chunkText.lastIndexOf(':'),
        chunkText.lastIndexOf(';')
      );
      
      // More aggressive sentence boundary detection
      if (lastSentenceEnd > chunkSize * 0.6) { // Break earlier to preserve more context
        chunkText = chunkText.slice(0, lastSentenceEnd + 1).trim();
      } else {
        // Try to break at paragraph boundaries
        const lastParagraphEnd = chunkText.lastIndexOf('\n\n');
        if (lastParagraphEnd > chunkSize * 0.5) {
          chunkText = chunkText.slice(0, lastParagraphEnd).trim();
        }
      }
    }
    
    if (chunkText.length > 0) {
      // Extract page information from chunk
      const pageMatches = chunkText.match(/---PAGE (\d+)---/g);
      let pageStart = 1, pageEnd = 1;
      
      if (pageMatches && pageMatches.length > 0) {
        const firstPage = pageMatches[0].match(/\d+/);
        const lastPage = pageMatches[pageMatches.length - 1].match(/\d+/);
        pageStart = firstPage ? parseInt(firstPage[0]) : 1;
        pageEnd = lastPage ? parseInt(lastPage[0]) : pageStart;
      }
      
      chunks.push({
        id: `chunk_${chunkId++}`,
        text: chunkText.replace(/---PAGE \d+---/g, '').trim(),
        page_range_start: pageStart,
        page_range_end: pageEnd,
        position: currentPosition
      });
    }
    
    // Move position forward, accounting for overlap
    currentPosition = chunkEnd - overlapSize;
    
    // Prevent infinite loop
    if (currentPosition <= chunks[chunks.length - 1]?.position) {
      currentPosition = chunkEnd;
    }
  }
  
  return chunks;
};

/**
 * Create a Lunr search index from text chunks
 * @param {Array} chunks - Array of chunk objects
 * @returns {lunr.Index} - Lunr search index
 */
export const createSearchIndex = (chunks: Chunk[]): lunr.Index => {
  return lunr(function () {
    this.ref('id');
    this.field('text', { boost: 10 });
    this.field('id');
    
    chunks.forEach((chunk) => {
      this.add({
        id: chunk.id,
        text: chunk.text
      });
    });
  });
};

/**
 * Search chunks using the Lunr index with fallback to fuzzy matching
 * @param {lunr.Index} searchIndex - Lunr search index
 * @param {Array} chunks - Array of chunk objects
 * @param {string} query - Search query
 * @param {number} topK - Number of top results to return
 * @returns {Array} - Array of relevant chunks sorted by relevance
 */
export const searchChunks = (searchIndex: lunr.Index, chunks: Chunk[], query: string, topK: number = TOP_K): Chunk[] => {
  const normalizedQuery = normalizeText(query.toLowerCase());
  const queryWords = normalizedQuery.split(/\s+/).filter(word => word.length > 2);
  
  try {
    let results: any[] = [];
    
    // Strategy 1: Try exact phrase search
    results = searchIndex.search(`"${normalizedQuery}"`);
    
    // Strategy 2: Try individual word search with AND logic
    if (results.length === 0 && queryWords.length > 1) {
      const wordQueries = queryWords.map(word => `+${word}`).join(' ');
      results = searchIndex.search(wordQueries);
    }
    
    // Strategy 3: Try individual word search with OR logic
    if (results.length === 0 && queryWords.length > 1) {
      const wordQueries = queryWords.join(' ');
      results = searchIndex.search(wordQueries);
    }
    
    // Strategy 4: Try fuzzy search for each word
    if (results.length === 0) {
      for (const word of queryWords) {
        const fuzzyResults = searchIndex.search(`${word}~1`);
        results = results.concat(fuzzyResults);
      }
      // Remove duplicates
      results = results.filter((result, index, self) => 
        index === self.findIndex(r => r.ref === result.ref)
      );
    }
    
    // Strategy 5: Try wildcard search
    if (results.length === 0) {
      for (const word of queryWords) {
        const wildcardResults = searchIndex.search(`*${word}*`);
        results = results.concat(wildcardResults);
      }
      // Remove duplicates
      results = results.filter((result, index, self) => 
        index === self.findIndex(r => r.ref === result.ref)
      );
    }
    
    // Strategy 6: Enhanced substring matching with better scoring
    if (results.length === 0) {
      results = chunks
        .map(chunk => {
          const chunkText = chunk.text.toLowerCase();
          let score = 0;
          let exactMatches = 0;
          let partialMatches = 0;
          
          // Check for exact word matches
          queryWords.forEach(word => {
            if (chunkText.includes(word)) {
              exactMatches++;
              score += 2; // Higher weight for exact matches
            }
          });
          
          // Check for partial matches (substring)
          queryWords.forEach(word => {
            if (word.length > 3) {
              for (let i = 0; i <= word.length - 3; i++) {
                const substring = word.substring(i, i + 3);
                if (chunkText.includes(substring)) {
                  partialMatches++;
                  score += 0.5; // Lower weight for partial matches
                  break; // Only count one partial match per word
                }
              }
            }
          });
          
          // Bonus for having multiple query words
          if (exactMatches > 1) {
            score += 1;
          }
          
          return score > 0 ? { ref: chunk.id, score: score / (queryWords.length + 1) } : null;
        })
        .filter(result => result !== null)
        .sort((a, b) => b.score - a.score);
    }
    
    // Strategy 7: Semantic similarity for social studies terms
    if (results.length === 0) {
      const socialStudiesTerms = {
        'ancient': ['old', 'early', 'prehistoric', 'primitive', 'historical'],
        'india': ['indian', 'subcontinent', 'south asia', 'bharat'],
        'history': ['historical', 'past', 'timeline', 'chronology', 'events'],
        'geography': ['geographical', 'location', 'place', 'region', 'terrain'],
        'political': ['government', 'administration', 'politics', 'governance'],
        'economics': ['economic', 'economy', 'trade', 'commerce', 'financial'],
        'constitution': ['constitutional', 'law', 'legal', 'rights', 'duties'],
        'village': ['rural', 'countryside', 'agricultural', 'farming'],
        'universe': ['cosmic', 'space', 'astronomical', 'celestial', 'planets'],
        'resources': ['natural', 'materials', 'minerals', 'energy', 'wealth']
      };
      
      results = chunks
        .map(chunk => {
          const chunkText = chunk.text.toLowerCase();
          let score = 0;
          
          // Check for related social studies terms
          Object.entries(socialStudiesTerms).forEach(([key, synonyms]) => {
            if (queryWords.some(word => word.includes(key) || key.includes(word))) {
              synonyms.forEach(synonym => {
                if (chunkText.includes(synonym)) {
                  score += 1.5;
                }
              });
            }
          });
          
          // Special handling for relationship queries
          if (queryWords.includes('part') || queryWords.includes('belong') || queryWords.includes('include')) {
            // Look for chunks that mention both terms in the same context
            const hasMultipleTerms = queryWords.filter(word => 
              chunkText.includes(word) || 
              socialStudiesTerms[word]?.some(synonym => chunkText.includes(synonym))
            ).length > 1;
            
            if (hasMultipleTerms) {
              score += 2; // Higher score for chunks with multiple related terms
            }
          }
          
          return score > 0 ? { ref: chunk.id, score } : null;
        })
        .filter(result => result !== null)
        .sort((a, b) => b.score - a.score);
    }
    
    // Get the actual chunks and return top K
    const relevantChunks = results
      .slice(0, topK)
      .map(result => chunks.find(chunk => chunk.id === result.ref))
      .filter(chunk => chunk !== undefined) as Chunk[];
    
    return relevantChunks;
    
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
 * Helper function to remove common stopwords (optional, lightweight)
 * @param {string} text - Text to process
 * @returns {string} - Text with stopwords removed
 */
export const removeStopwords = (text: string): string => {
  const stopwords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
    'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'between', 'among', 'across',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
    'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
    'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she',
    'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his',
    'her', 'its', 'our', 'their'
  ]);
  
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopwords.has(word))
    .join(' ');
};
