import { useNavigate, useLocation } from 'react-router';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

import { Shell } from '../../core/shell/Shell';
import { routesConfig } from '../../routing/routesConfig';
import { Button } from '../../ui/Button/Button';
import { useTranslation } from 'src/i18n/useTranslation';

export const PostDetailPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            ariaLabel={t('postDetail.backButton')}
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-bold text-gray-900">{t('postDetail.title')}</h1>
        </div>
      </div>
    </Shell>
  );
};

export default PostDetailPage;
