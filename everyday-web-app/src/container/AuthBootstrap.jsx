import { useEffect, useState } from 'react';
import { useAuthStore } from '@store/useAuthStore';
import { authApi } from '@api/auth.api';

const VERIFY_TIMEOUT_MS = 8000;

/**
 * Hydration-then-verify: waits for the persisted Zustand auth state to
 * rehydrate from localStorage, then confirms it against /gateway/me. A
 * timeout falls back to "unauthenticated" so a slow/dead gateway never
 * blocks the UI indefinitely — see MONOREPO-ARCHITECTURE-TEMPLATE.md §10.5.
 */
const AuthBootstrap = ({ children }) => {
  const isHydrated = useAuthStore((state) => state.isHydrated);
  const setUser = useAuthStore((state) => state.setUser);
  const clear = useAuthStore((state) => state.clear);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    if (!isHydrated) return undefined;

    let settled = false;
    const timeoutId = setTimeout(() => {
      if (!settled) {
        settled = true;
        setIsVerifying(false);
      }
    }, VERIFY_TIMEOUT_MS);

    authApi
      .me()
      .then((data) => setUser(data.user))
      .catch(() => clear())
      .finally(() => {
        if (!settled) {
          settled = true;
          clearTimeout(timeoutId);
          setIsVerifying(false);
        }
      });

    return () => clearTimeout(timeoutId);
  }, [isHydrated, setUser, clear]);

  if (!isHydrated || isVerifying) return null;
  return children;
};

export default AuthBootstrap;
