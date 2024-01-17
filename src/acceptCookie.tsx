/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import CookieConsent from 'react-cookie-consent';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';

const AcceptCookie = () => {
  const language = useStore(Selector.language);
  const lang = { lng: language };
  const { t } = useTranslation();
  return (
    <CookieConsent
      location="bottom"
      buttonText={t('cookie.Accept', lang)}
      cookieName="AIMSCookieName"
      style={{ background: '#2B373B', textAlign: 'center', zIndex: 99999 }}
      buttonStyle={{ color: '#4e503b', fontSize: '12px' }}
      expires={150}
    >
      {t('cookie.Statement', lang)}
    </CookieConsent>
  );
};

export default AcceptCookie;
