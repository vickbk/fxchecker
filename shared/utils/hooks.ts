import { useState, useEffect } from "react";
export const useHydrated = <T>(hook: T) => {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === undefined) return;
    (() => {
      setHydrated(true);
    })();
  }, []);

  return { hydrated, hook };
};
