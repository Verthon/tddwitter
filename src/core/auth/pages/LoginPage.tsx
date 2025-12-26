import { Shell } from 'src/core/shell/Shell';
import { useTranslation } from 'src/i18n/useTranslation';
import { Heading } from 'src/ui/heading/Heading';
import { Text } from 'src/ui/text/Text';

import { LoginForm } from '../components/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Shell>
      <div className="flex items-center justify-center bg-gray-50 px-4 py-8 min-h-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="mb-2">
              <Heading variant="heading-md" as="h1">
                {t('core.auth.login.title')}
              </Heading>
            </div>
            <Text size="sm" color="secondary">
              {t('core.auth.login.subtitle')}
            </Text>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <LoginForm />
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default LoginPage;
