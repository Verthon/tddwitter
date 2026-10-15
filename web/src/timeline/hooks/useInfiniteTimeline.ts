import { useInfiniteQuery } from '@tanstack/react-query';
import { calculateExponentialBackoff } from 'src/api/utils/retry';
import { timelineQueries } from '../queries/timelineQueries';

interface UseInfiniteTimelineOptions {
  pageSize?: number;
}

export const useInfiniteTimeline = (options?: UseInfiniteTimelineOptions) => {
  const pageSize = options?.pageSize ?? 10;

  return useInfiniteQuery({
    ...timelineQueries.feed(pageSize),
    retry: 3,
    retryDelay: (attemptIndex) => calculateExponentialBackoff({ attemptIndex }),
  });
};
