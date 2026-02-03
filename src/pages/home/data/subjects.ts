export interface Subject {
  id: string;
  title: string;
  accent: string;
  description: string;
  progress: number;
  icon: string;
}

export const subjectsData: Subject[] = [
  {
    id: 'english',
    title: 'ENGLISH',
    accent: '--accent-eng',
    description: 'Reading, writing, and language arts',
    progress: 68,
    icon: 'book'
  },
  {
    id: 'mathematics',
    title: 'MATHEMATICS',
    accent: '--accent-math',
    description: 'Numbers, algebra & geometry',
    progress: 75,
    icon: 'calculator'
  },
  {
    id: 'science',
    title: 'SCIENCE',
    accent: '--accent-bio',
    description: 'Biology, chemistry & physics',
    progress: 42,
    icon: 'atom'
  },
  {
    id: 'social-studies',
    title: 'SOCIAL STUDIES',
    accent: '--accent-social',
    description: 'History, geography & culture',
    progress: 56,
    icon: 'globe'
  }
];

// Firebase data structure for future integration
export interface FirebaseSubject extends Subject {
  lessons?: string[];
  lastAccessed?: string;
  completedLessons?: number;
  totalLessons?: number;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  ageGroup?: string;
}

// Example Firebase collection structure
export const firebaseSubjectSchema = {
  subjects: {
    // Document ID would be the subject.id
    english: {
      id: 'english',
      title: 'ENGLISH',
      accent: '--accent-eng',
      description: 'Reading, writing, and language arts',
      progress: 68,
      icon: 'book',
      lessons: ['lesson-1', 'lesson-2', 'lesson-3'],
      lastAccessed: '2024-01-15T10:30:00Z',
      completedLessons: 12,
      totalLessons: 18,
      difficulty: 'intermediate',
      ageGroup: '8-12'
    }
    // ... other subjects
  },
  userProgress: {
    // Document ID would be userId
    userId: {
      subjects: {
        english: {
          progress: 68,
          lastAccessed: '2024-01-15T10:30:00Z',
          completedLessons: ['lesson-1', 'lesson-2'],
          currentLesson: 'lesson-3',
          timeSpent: 1800 // seconds
        }
        // ... other subjects
      }
    }
  }
};