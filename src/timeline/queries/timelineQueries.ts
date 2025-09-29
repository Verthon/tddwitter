import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchTimeline } from '../services/timelineService';

const TIMELINE_QUERY_KEY = 'timeline' as const;

export const timelineQueries = {
  all: () => [TIMELINE_QUERY_KEY] as const,
  
  feed: (pageSize = 10) =>
    infiniteQueryOptions({
      queryKey: [...timelineQueries.all(), { pageSize }] as const,
      queryFn: ({ pageParam }) =>
        fetchTimeline({
          cursor: pageParam || undefined,
          limit: pageSize,
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      staleTime: 1000 * 60, // 1 minute
      gcTime: 1000 * 60 * 5, // 5 minutes
    }),
} as const;
