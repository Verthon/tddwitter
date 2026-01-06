import { type ReactNode } from 'react';

import { useAuth } from '../useAuth';

interface SignedOutProps {
  children: ReactNode;
}

export const SignedOut = ({ children }: SignedOutProps) => {
  const { authorizationStatus } = useAuth();

  if (authorizationStatus === 'authenticated') {
    return null;
  }

  return <>{children}</>;
};
