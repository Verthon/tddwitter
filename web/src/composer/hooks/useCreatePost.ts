import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { routesConfig } from '../../routing/routesConfig';
import { composerMutations } from '../queries/composerQueries';

export const useCreatePost = () => {
  const navigate = useNavigate();

  return useMutation({
    ...composerMutations.createPost(),
    onSuccess: () => {
      navigate(routesConfig.home);
    },
  });
};
