import { useTranslation } from 'src/i18n/useTranslation';
import { useLikeMetadata } from '../hooks/useLikeMetadata';

interface LikeCountProps {
  postId: string;
}

export const LikeCount = ({ postId }: LikeCountProps) => {
  const { t } = useTranslation();
  const { likeCount } = useLikeMetadata(postId);

  return (
    <span className="text-sm text-gray-500">
      {t('engagement.likeCount', { count: likeCount })}
    </span>
  );
};
