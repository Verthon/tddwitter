import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchTimeline } from '../services/timelineService';

export const timelineQueries = {
  all: () => ['timeline'] as const,
  feeds: () => [...timelineQueries.all(), 'feed'] as const,
  feed: (pageSize = 10) =>
    infiniteQueryOptions({
      queryKey: [...timelineQueries.feeds(), { pageSize }] as const,
      queryFn: ({ pageParam }) =>
        fetchTimeline({
          cursor: pageParam || undefined,
          limit: pageSize,
        }),
      initialPageParam: null as string | null,
      getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextCursor : undefined,
      staleTime: 1000 * 60,
      gcTime: 1000 * 60 * 5,
    }),
} as const;
