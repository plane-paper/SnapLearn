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