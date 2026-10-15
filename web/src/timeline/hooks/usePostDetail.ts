import { useQuery } from '@tanstack/react-query';
import { calculateExponentialBackoff } from 'src/api/utils/retry';
import { timelineQueries } from '../queries/timelineQueries';

interface UsePostDetailOptions {
  id: string;
}

export const usePostDetail = ({ id }: UsePostDetailOptions) => {
  return useQuery({
    ...timelineQueries.post(id),
    retry: 3,
    retryDelay: (attemptIndex) => calculateExponentialBackoff({ attemptIndex }),
  });
};
