import { QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';
import { queryClient } from './queryClient';

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => {
  // Ensure a stable QueryClient instance across hot reloads
  const [client] = useState(() => queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  );
};