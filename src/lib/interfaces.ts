interface TopicEntry {
    level: number;
    page: number;
    time: number;
    title: string;
  }
  
  interface TopicJson {
    topics: {
      entries: TopicEntry[];
      total_entries: number;
    };
  }
  
  interface TableOfContentsItem {
    title: string;
    page: number;
    readingTime: string;
    level: number;
    chapter: number;
  }

interface Lesson {
  time: number;
  title: string;
}

interface LessonPlan {
  lesson_list: Lesson[][];
}

interface ProcessedSession {
  sessionNumber: number;
  lessons: Lesson[];
  totalTime: number;
  hasPractice: boolean;
}