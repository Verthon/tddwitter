import { type ReactNode } from 'react';

import { useAuth } from '../useAuth';

interface SignedInProps {
  children: ReactNode;
}

export const SignedIn = ({ children }: SignedInProps) => {
  const { authorizationStatus } = useAuth();

  if (authorizationStatus !== 'authenticated') {
    return null;
  }

  return <>{children}</>;
};
