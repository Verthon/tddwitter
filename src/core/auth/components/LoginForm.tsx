import { type FormEvent, useReducer } from 'react';
import { useNavigate } from 'react-router';

import { useTranslation } from 'src/i18n/useTranslation';
import { Button } from 'src/ui/Button/Button';
import { Input } from 'src/ui/input/Input';

interface LoginFormProps {
  onSubmit?: (data: { email: string; password: string }) => void;
}

interface FormErrors {
  email?: string;
  password?: string;
}

interface FormState {
  email: string;
  password: string;
  errors: FormErrors;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_ERRORS'; payload: FormErrors }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

const initialState: FormState = {
  email: '',
  password: '',
  errors: {},
  isSubmitting: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_ERRORS':
      return { ...state, errors: action.payload };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
};

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateForm = (
  email: string,
  password: string,
  t: (key: string) => string,
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!email.trim()) {
    errors.email = t('core.auth.login.error.emailRequired');
  } else if (!validateEmail(email)) {
    errors.email = t('core.auth.login.error.emailInvalid');
  }

  if (!password.trim()) {
    errors.password = t('core.auth.login.error.passwordRequired');
  } else if (password.length < 6) {
    errors.password = t('core.auth.login.error.passwordMinLength');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const LoginForm = ({ onSubmit }: LoginFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, errors } = validateForm(state.email, state.password, t);
    dispatch({ type: 'SET_ERRORS', payload: errors });

    if (!isValid) {
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      if (onSubmit) {
        await onSubmit({ email: state.email, password: state.password });
      }
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const handleCreateAccountClick = () => {
    navigate('/signup');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <div>
        <Input
          label={t('core.auth.login.emailLabel')}
          type="email"
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
          error={state.errors.email}
          isDisabled={state.isSubmitting}
          autoComplete="email"
          required
        />
      </div>

      <div>
        <Input
          label={t('core.auth.login.passwordLabel')}
          type="password"
          value={state.password}
          onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
          error={state.errors.password}
          isDisabled={state.isSubmitting}
          autoComplete="current-password"
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isDisabled={state.isSubmitting}
          fullWidth
        >
          {state.isSubmitting ? t('core.auth.login.submitting') : t('core.auth.login.submitButton')}
        </Button>

        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={handleCreateAccountClick}
          isDisabled={state.isSubmitting}
          fullWidth
        >
          {t('core.auth.login.createAccount')}
        </Button>
      </div>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
          disabled={state.isSubmitting}
        >
          {t('core.auth.login.forgotPassword')}
        </button>
      </div>
    </form>
  );
};
