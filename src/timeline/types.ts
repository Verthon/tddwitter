export interface TimelineItem {
  id: string;
  avatar: string;
  username: string;
  content: string;
  timestamp: string; // ISO 8601 format
}

export interface TimelineResponse {
  items: TimelineItem[];
  nextCursor: string | null;
  hasMore: boolean;
}

export interface TimelineParams {
  cursor?: string;
  limit?: number;
}