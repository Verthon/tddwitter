import { Shell } from 'src/core/shell/Shell';
import { useTranslation } from 'src/i18n/useTranslation';
import { Text } from 'src/ui/text/Text';

import { LoginForm } from '../components/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation();

  const handleLogin = async (data: { email: string; password: string }) => {
    console.log('Login attempt:', data);
  };

  return (
    <Shell>
      <div className="flex items-center justify-center bg-gray-50 px-4 py-8 min-h-full">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Text weight="bold" className="text-2xl mb-2">
              {t('core.auth.login.title')}
            </Text>
            <Text className="text-sm text-gray-600">
              {t('core.auth.login.subtitle')}
            </Text>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <LoginForm onSubmit={handleLogin} />
          </div>
        </div>
      </div>
    </Shell>
  );
};

export default LoginPage;
