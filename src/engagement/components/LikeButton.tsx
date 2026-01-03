import { useTranslation } from 'src/i18n/useTranslation';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import { IconButton } from '../../ui/IconButton/IconButton';
import { useLikeMetadata } from '../hooks/useLikeMetadata';
import { useLikePost } from '../hooks/useLikePost';

interface LikeButtonProps {
  postId: string;
}

export const LikeButton = ({ postId }: LikeButtonProps) => {
  const { t } = useTranslation();
  const { isLiked } = useLikeMetadata(postId);
  const { like, unlike } = useLikePost(postId);

  const ariaLabel = isLiked
    ? t('engagement.unlike.ariaLabel')
    : t('engagement.like.ariaLabel');

  const handleClick = () => {
    if (isLiked) {
      unlike();
    } else {
      like();
    }
  };

  return (
    <IconButton variant="ghost" ariaLabel={ariaLabel} onClick={handleClick}>
      {isLiked ? (
        <HeartSolid className="h-6 w-6 text-red-600" aria-hidden="true" />
      ) : (
        <HeartOutline className="h-6 w-6" aria-hidden="true" />
      )}
    </IconButton>
  );
};
