import { useQuery } from '@tanstack/react-query';
import { timelineQueries } from '../queries/timelineQueries';
import { calculateExponentialBackoff } from 'src/api/utils/retry';

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
