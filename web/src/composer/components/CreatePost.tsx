import { PencilSquareIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router';
import { useTranslation } from 'src/i18n/useTranslation';
import { routesConfig } from '../../routing/routesConfig';
import { FloatingButton } from '../../ui/floatingButton/FloatingButton';

export const CreatePost = () => {
  const { t } = useTranslation();

  return (
    <FloatingButton as={Link} to={routesConfig.createPost} variant="default">
      <PencilSquareIcon
        aria-label={t('composer.createPost.ariaLabel')}
        className="w-6 h-6"
      />
    </FloatingButton>
  );
};
