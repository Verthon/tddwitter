import { useNavigate, useLocation, useParams } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { Shell } from '../../core/shell/Shell';
import { routesConfig } from '../../routing/routesConfig';
import { IconButton } from '../../ui/IconButton/IconButton';
import { useTranslation } from 'src/i18n/useTranslation';
import { usePostDetail } from '../hooks/usePostDetail';
import { Avatar } from 'src/ui/avatar/Avatar';
import { Text } from 'src/ui/text/Text';
import { dateService } from 'src/core/services/dateService';

export const PostDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();

  const { data: post, isLoading, isError, error } = usePostDetail({ id: id! });

  const handleBack = () => {
    if (location.key === 'default') {
      navigate(routesConfig.home);
    } else {
      navigate(-1);
    }
  };

  return (
    <Shell>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 p-4 border-b border-gray-200">
          <IconButton
            variant="ghost"
            size="sm"
            onClick={handleBack}
            ariaLabel={t('postDetail.backButton')}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </IconButton>
          <h1 className="text-xl font-bold text-gray-900">{t('postDetail.title')}</h1>
        </div>

        <div className="p-4">
          {isLoading && (
            <div className="text-center py-8">
              <Text>{t('postDetail.loading')}</Text>
            </div>
          )}

          {isError && (
            <div className="text-center py-8">
              <Text>{t('postDetail.error')}</Text>
              {error && <Text size="sm">{error.message}</Text>}
            </div>
          )}

          {post && (
            <article className="flex gap-3 py-6">
              <Avatar src={post.avatar} alt={`${post.username}'s avatar`} size={48} />

              <div className="flex flex-col gap-2 flex-1 min-w-0">
                <Text weight="bold" as="div">
                  {post.username}
                </Text>
                <Text as="p">
                  {post.content}
                </Text>
                <Text size="sm" as="time" dateTime={post.timestamp}>
                  {dateService.toDisplayFormat(post.timestamp)}
                </Text>
              </div>
            </article>
          )}
        </div>
      </div>
    </Shell>
  );
};

export default PostDetailPage;
