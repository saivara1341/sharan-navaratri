import React, { createContext, useContext } from 'react';

interface TurnstileContextValue {
  isVerified: boolean;
  token: string | null;
  status: 'verifying' | 'verified' | 'failed' | 'idle';
  refreshChallenge: () => void;
  siteKey: string;
}

const TurnstileContext = createContext<TurnstileContextValue>({
  isVerified: true,
  token: 'bypassed',
  status: 'verified',
  refreshChallenge: () => {},
  siteKey: '',
});

export const useTurnstileSecurity = () => useContext(TurnstileContext);

export const SiteWideTurnstileProtection: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <TurnstileContext.Provider
      value={{
        isVerified: true,
        token: 'bypassed',
        status: 'verified',
        refreshChallenge: () => {},
        siteKey: '',
      }}
    >
      {children}
    </TurnstileContext.Provider>
  );
};
