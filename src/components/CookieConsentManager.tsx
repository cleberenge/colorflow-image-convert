
import React from 'react';
import { useCookieConsent } from '@/hooks/useCookieConsent';
import CookieBanner from './CookieBanner';
import CookieSettings from './CookieSettings';

const CookieConsentManager = () => {
  const {
    consent,
    showBanner,
    showSettings,
    setShowSettings,
    acceptAll,
    acceptNecessary,
    updateConsent,
  } = useCookieConsent();

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCloseSettings = () => {
    setShowSettings(false);
  };

  const handleCloseBanner = () => {
    // If user closes banner without choosing, accept only necessary cookies
    acceptNecessary();
  };

  return (
    <>
      {showBanner && (
        <CookieBanner
          onAcceptAll={acceptAll}
          onAcceptNecessary={acceptNecessary}
          onShowSettings={handleShowSettings}
          onClose={handleCloseBanner}
        />
      )}
      
      <CookieSettings
        isOpen={showSettings}
        onClose={handleCloseSettings}
        consent={consent}
        onSave={updateConsent}
      />
    </>
  );
};

export default CookieConsentManager;
