
import { useState, useEffect } from 'react';

export type CookieConsent = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  hasConsented: boolean;
};

const defaultConsent: CookieConsent = {
  necessary: true, // Always required
  analytics: false,
  marketing: false,
  hasConsented: false,
};

export const useCookieConsent = () => {
  const [consent, setConsent] = useState<CookieConsent>(defaultConsent);
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('cookie-consent');
    if (savedConsent) {
      const parsedConsent = JSON.parse(savedConsent);
      setConsent(parsedConsent);
      setShowBanner(false);
    } else {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const saveConsent = (newConsent: CookieConsent) => {
    const consentToSave = { ...newConsent, hasConsented: true };
    setConsent(consentToSave);
    localStorage.setItem('cookie-consent', JSON.stringify(consentToSave));
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    saveConsent({
      necessary: true,
      analytics: true,
      marketing: true,
      hasConsented: true,
    });
  };

  const acceptNecessary = () => {
    saveConsent({
      necessary: true,
      analytics: false,
      marketing: false,
      hasConsented: true,
    });
  };

  const updateConsent = (updates: Partial<CookieConsent>) => {
    const newConsent = { ...consent, ...updates };
    saveConsent(newConsent);
  };

  const resetConsent = () => {
    localStorage.removeItem('cookie-consent');
    setConsent(defaultConsent);
    setShowBanner(true);
  };

  return {
    consent,
    showBanner,
    showSettings,
    setShowSettings,
    acceptAll,
    acceptNecessary,
    updateConsent,
    resetConsent,
  };
};
