import { useEffect, useState } from 'react';

/**
 * Hook to determine if we're running on the client side
 * Useful for avoiding SSR issues with hooks that require client-side context
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}




