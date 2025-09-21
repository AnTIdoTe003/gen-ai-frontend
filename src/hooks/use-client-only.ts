import { useEffect, useState } from "react";

/**
 * Hook to ensure a component only renders on the client side
 * Useful for preventing hydration mismatches
 */
export function useClientOnly() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
}

