import React from 'react';

export interface CloudflareTurnstileProps {
  onSuccess?: (token: string) => void;
  onError?: (error: string) => void;
  onExpire?: () => void;
  siteKey?: string;
  theme?: 'light' | 'dark' | 'auto';
  size?: 'normal' | 'compact' | 'flexible';
  className?: string;
}

export const CloudflareTurnstile: React.FC<CloudflareTurnstileProps> = () => {
  return null;
};

export default CloudflareTurnstile;
