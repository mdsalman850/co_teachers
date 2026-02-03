// utils/sciencePdfExtractor.ts
import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface Lesson {
  id: string;
  title: string;
  content: string;
  pageStart: number;
  pageEnd: number;
}

export interface SubjectLessons {
  subjectId: 'biology' | 'physics' | 'chemistry';
  lessons: Lesson[];
}

/**
 * Extract text content from a PDF file
 */
export const extractPDFText = async (pdfUrl: string): Promise<string> => {
  try {
    const response = await fetch(pdfUrl);
    const arrayBuffer = await response.arrayBuffer();
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    const totalPages = pdf.numPages;
    
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      const pageText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .trim();
      
      if (pageText) {
        fullText += `\n\n---PAGE ${pageNum}---\n\n${pageText}`;
      }
    }
    
    return normalizeText(fullText);
  } catch (error) {
    console.error('Error extracting PDF:', error);
    throw error;
  }
};

/**
 * Normalize text by cleaning whitespace
 */
const normalizeText = (text: string): string => {
  return text
    .replace(/\s+/g, ' ')
    .replace(/\n\s*\n/g, '\n\n')
    .trim();
};

/**
 * Parse lessons from extracted PDF text
 * Looks for chapter headings, numbered sections, etc.
 */
export const parseLessonsFromText = (text: string, subjectId: 'biology' | 'physics' | 'chemistry'): Lesson[] => {
  const lessons: Lesson[] = [];
  
  // Common patterns for chapter/lesson headings
  const chapterPatterns = [
    /(?:Chapter|CHAPTER|CH\.?|Lesson|LESSON|Unit|UNIT)\s*(\d+)[:\.]?\s*([^\n]+)/gi,
    /(\d+)[\.\)]\s*([A-Z][^\n]{10,100})/g, // Numbered headings like "1. Title" or "1) Title"
    /([A-Z][A-Z\s]{10,50})\s*(?:\n|$)/g, // ALL CAPS headings
  ];
  
  // Split text by page markers
  const pages = text.split(/---PAGE \d+---/);
  
  let currentLesson: Partial<Lesson> | null = null;
  let lessonNumber = 1;
  let currentPage = 1;
  
  for (let i = 0; i < pages.length; i++) {
    const pageText = pages[i].trim();
    if (!pageText) continue;
    
    // Extract page number if available
    const pageMatch = text.substring(0, text.indexOf(pageText)).match(/---PAGE (\d+)---/);
    if (pageMatch) {
      currentPage = parseInt(pageMatch[1]);
    }
    
    // Check for chapter/lesson headings
    let foundHeading = false;
    
    for (const pattern of chapterPatterns) {
      const matches = [...pageText.matchAll(pattern)];
      
      for (const match of matches) {
        const heading = match[0].trim();
        const headingText = (match[2] || match[1] || match[0]).trim();
        
        // Skip if heading is too short or too long (likely not a real heading)
        if (headingText.length < 10 || headingText.length > 150) continue;
        
        // Skip common false positives
        if (/^(Page|PAGE|Table|Figure|Fig\.|See|Note|Example)/i.test(headingText)) continue;
        
        // If we have a current lesson, save it
        if (currentLesson && currentLesson.content) {
          currentLesson.pageEnd = currentPage - 1;
          lessons.push(currentLesson as Lesson);
        }
        
        // Start new lesson
        currentLesson = {
          id: `${subjectId}-lesson-${lessonNumber++}`,
          title: headingText,
          content: '',
          pageStart: currentPage,
          pageEnd: currentPage
        };
        
        foundHeading = true;
        break;
      }
      
      if (foundHeading) break;
    }
    
    // Add page content to current lesson
    if (currentLesson) {
      if (currentLesson.content) {
        currentLesson.content += '\n\n';
      }
      currentLesson.content += pageText;
      currentLesson.pageEnd = currentPage;
    } else {
      // If no lesson started yet, create one from first content
      if (lessons.length === 0 && pageText.length > 100) {
        currentLesson = {
          id: `${subjectId}-lesson-${lessonNumber++}`,
          title: `Introduction - ${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)}`,
          content: pageText,
          pageStart: currentPage,
          pageEnd: currentPage
        };
      }
    }
  }
  
  // Add final lesson if exists
  if (currentLesson && currentLesson.content) {
    lessons.push(currentLesson as Lesson);
  }
  
  // If no lessons found, create one large lesson with all content
  if (lessons.length === 0) {
    const allText = text.replace(/---PAGE \d+---/g, '').trim();
    if (allText.length > 100) {
      lessons.push({
        id: `${subjectId}-lesson-1`,
        title: `${subjectId.charAt(0).toUpperCase() + subjectId.slice(1)} Complete Textbook`,
        content: allText,
        pageStart: 1,
        pageEnd: pages.length
      });
    }
  }
  
  return lessons;
};

/**
 * Extract and parse lessons from Biology PDF
 * Uses hardcoded lesson names from the Biology textbook content table
 */
export const extractBiologyLessons = async (): Promise<Lesson[]> => {
  // Hardcoded Biology chapters from the AICU textbook - 12 chapters total
  const biologyChapters = [
    "Food Components",                    // Chapter 1
    "Nutrition",                           // Chapter 2
    "Respiration",                         // Chapter 3
    "Reproduction",                        // Chapter 4
    "Excretion",                          // Chapter 5
    "Classification of Plants and Animals", // Chapter 6
    "Transportation",                      // Chapter 7
    "Microorganisms",                     // Chapter 8
    "Cell, Tissue - Organs",              // Chapter 9
    "Control and Coordination",            // Chapter 10
    "Ecosystem Around Us",                // Chapter 11
    "Evolution and Heredity"              // Chapter 12
  ];
  
  // Return simple lessons with just chapter names
  const lessons: Lesson[] = biologyChapters.map((chapterTitle, index) => {
    return {
      id: `biology-lesson-${index + 1}`,
      title: chapterTitle,
      content: '',
      pageStart: 0,
      pageEnd: 0
    };
  });
  
  return lessons;
};

/**
 * Extract and parse lessons from Physics PDF
 * Uses hardcoded lesson names from the Physics & Chemistry textbook content table
 */
export const extractPhysicsLessons = async (): Promise<Lesson[]> => {
  // Hardcoded Physics chapters from the AICU textbook - 6 chapters total
  const physicsChapters = [
    "Reflection of light",           // Chapter 1
    "Motion & Its Description",      // Chapter 2
    "Force-Motion",                  // Chapter 3
    "Thermal Energy",                // Chapter 4
    "Sound",                         // Chapter 5
    "Electric Energy"                // Chapter 6
  ];
  
  // Return simple lessons with just chapter names
  const lessons: Lesson[] = physicsChapters.map((chapterTitle, index) => {
    return {
      id: `physics-lesson-${index + 1}`,
      title: chapterTitle,
      content: '',
      pageStart: 0,
      pageEnd: 0
    };
  });
  
  return lessons;
};

/**
 * Extract and parse lessons from Chemistry PDF
 * Uses hardcoded lesson names from the Physics & Chemistry textbook content table
 */
export const extractChemistryLessons = async (): Promise<Lesson[]> => {
  // Hardcoded Chemistry chapters from the AICU textbook - 6 chapters total
  const chemistryChapters = [
    "Atomic structure",                    // Chapter 1
    "Matter around us",                   // Chapter 2
    "Metals and non-Metals",              // Chapter 3
    "Periodic classification of elements", // Chapter 4
    "Chemical reactions",                 // Chapter 5
    "Acids, Bases & Salts"                // Chapter 6
  ];
  
  // Return simple lessons with just chapter names
  const lessons: Lesson[] = chemistryChapters.map((chapterTitle, index) => {
    return {
      id: `chemistry-lesson-${index + 1}`,
      title: chapterTitle,
      content: '',
      pageStart: 0,
      pageEnd: 0
    };
  });
  
  return lessons;
};

/**
 * Extract all lessons for all subjects
 */
export const extractAllScienceLessons = async (): Promise<{
  biology: Lesson[];
  physics: Lesson[];
  chemistry: Lesson[];
}> => {
  const [biology, physics, chemistry] = await Promise.all([
    extractBiologyLessons(),
    extractPhysicsLessons(),
    extractChemistryLessons()
  ]);
  
  return { biology, physics, chemistry };
};


