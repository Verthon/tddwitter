import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { composerMutations } from '../queries/composerQueries';
import { routesConfig } from '../../routing/routesConfig';

export const useCreatePost = () => {
  const navigate = useNavigate();

  return useMutation({
    ...composerMutations.createPost(),
    onSuccess: () => {
      navigate(routesConfig.home);
    },
  });
};
