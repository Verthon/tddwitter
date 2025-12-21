import { type FormEvent, useReducer } from 'react';
import { useNavigate } from 'react-router';
import { Form } from '@base-ui/react/form';

import { useTranslation } from 'src/i18n/useTranslation';
import { Button } from 'src/ui/Button/Button';
import { Field } from 'src/ui/field/Field';

interface RegisterFormProps {
  onSubmit?: (data: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => void;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  errors: FormErrors;
  isSubmitting: boolean;
}

type FormAction =
  | { type: 'SET_USERNAME'; payload: string }
  | { type: 'SET_EMAIL'; payload: string }
  | { type: 'SET_PASSWORD'; payload: string }
  | { type: 'SET_CONFIRM_PASSWORD'; payload: string }
  | { type: 'SET_ERRORS'; payload: FormErrors }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'RESET' };

const initialState: FormState = {
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  errors: {},
  isSubmitting: false,
};

const formReducer = (state: FormState, action: FormAction): FormState => {
  switch (action.type) {
    case 'SET_USERNAME':
      return { ...state, username: action.payload };
    case 'SET_EMAIL':
      return { ...state, email: action.payload };
    case 'SET_PASSWORD':
      return { ...state, password: action.payload };
    case 'SET_CONFIRM_PASSWORD':
      return { ...state, confirmPassword: action.payload };
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
  username: string,
  email: string,
  password: string,
  confirmPassword: string,
  t: (key: string) => string,
): { isValid: boolean; errors: FormErrors } => {
  const errors: FormErrors = {};

  if (!username.trim()) {
    errors.username = t('core.auth.register.error.usernameRequired');
  } else if (username.trim().length < 3) {
    errors.username = t('core.auth.register.error.usernameMinLength');
  }

  if (!email.trim()) {
    errors.email = t('core.auth.register.error.emailRequired');
  } else if (!validateEmail(email)) {
    errors.email = t('core.auth.register.error.emailInvalid');
  }

  if (!password.trim()) {
    errors.password = t('core.auth.register.error.passwordRequired');
  } else if (password.length < 6) {
    errors.password = t('core.auth.register.error.passwordMinLength');
  }

  if (!confirmPassword.trim()) {
    errors.confirmPassword = t('core.auth.register.error.confirmPasswordRequired');
  } else if (password !== confirmPassword) {
    errors.confirmPassword = t('core.auth.register.error.passwordMismatch');
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const RegisterForm = ({ onSubmit }: RegisterFormProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(formReducer, initialState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { isValid, errors } = validateForm(
      state.username,
      state.email,
      state.password,
      state.confirmPassword,
      t,
    );
    dispatch({ type: 'SET_ERRORS', payload: errors });

    if (!isValid) {
      return;
    }

    dispatch({ type: 'SET_SUBMITTING', payload: true });

    try {
      if (onSubmit) {
        await onSubmit({
          username: state.username,
          email: state.email,
          password: state.password,
          confirmPassword: state.confirmPassword,
        });
      }
    } finally {
      dispatch({ type: 'SET_SUBMITTING', payload: false });
    }
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  return (
    <Form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
      <Field.Root name="username">
        <Field.Label>{t('core.auth.register.usernameLabel')}</Field.Label>
        <Field.Control
          type="text"
          value={state.username}
          onChange={(e) => dispatch({ type: 'SET_USERNAME', payload: e.target.value })}
          disabled={state.isSubmitting}
          autoComplete="username"
          required
        />
        {state.errors.username && (
          <Field.Error match={true}>{state.errors.username}</Field.Error>
        )}
      </Field.Root>

      <Field.Root name="email">
        <Field.Label>{t('core.auth.register.emailLabel')}</Field.Label>
        <Field.Control
          type="email"
          value={state.email}
          onChange={(e) => dispatch({ type: 'SET_EMAIL', payload: e.target.value })}
          disabled={state.isSubmitting}
          autoComplete="email"
          required
        />
        {state.errors.email && (
          <Field.Error match={true}>{state.errors.email}</Field.Error>
        )}
      </Field.Root>

      <Field.Root name="password">
        <Field.Label>{t('core.auth.register.passwordLabel')}</Field.Label>
        <Field.Control
          type="password"
          value={state.password}
          onChange={(e) => dispatch({ type: 'SET_PASSWORD', payload: e.target.value })}
          disabled={state.isSubmitting}
          autoComplete="new-password"
          required
        />
        {state.errors.password && (
          <Field.Error match={true}>{state.errors.password}</Field.Error>
        )}
      </Field.Root>

      <Field.Root name="confirmPassword">
        <Field.Label>{t('core.auth.register.confirmPasswordLabel')}</Field.Label>
        <Field.Control
          type="password"
          value={state.confirmPassword}
          onChange={(e) => dispatch({ type: 'SET_CONFIRM_PASSWORD', payload: e.target.value })}
          disabled={state.isSubmitting}
          autoComplete="new-password"
          required
        />
        {state.errors.confirmPassword && (
          <Field.Error match={true}>{state.errors.confirmPassword}</Field.Error>
        )}
      </Field.Root>

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          isDisabled={state.isSubmitting}
          fullWidth
        >
          {state.isSubmitting
            ? t('core.auth.register.submitting')
            : t('core.auth.register.submitButton')}
        </Button>
      </div>

      <div className="text-center">
        <span className="text-sm text-gray-600">{t('core.auth.register.haveAccount')} </span>
        <button
          type="button"
          className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
          onClick={handleSignInClick}
          disabled={state.isSubmitting}
        >
          {t('core.auth.register.signIn')}
        </button>
      </div>
    </Form>
  );
};
