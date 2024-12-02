/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import i18n from './i18n/i18n';

export interface TeamProps {
  top: number;
  height?: number;
  color?: string;
}

const Team = React.memo(({ top, height, color }: TeamProps) => {
  const language = useStore(Selector.language);

  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          borderRadius: '20px',
          border: 'thin',
          textAlign: 'center',
          left: '5%',
          right: '5%',
          top: top + 'px',
          height: (height ?? 300) + 'px',
        }}
      >
        <h2 style={{ marginTop: '20px', color: color }}>{i18n.t('aboutUs.ProductBroughtToYouBy', lang)}</h2>
        <p style={{ fontSize: '16px', color: color }}>Charles Xie and Xiaotong Ding</p>
        <p style={{ fontSize: '16px', color: color }}>Institute for Future Intelligence, Inc.</p>
        <div
          style={{
            position: 'absolute',
            marginTop: '20px',
            fontSize: '12px',
            textAlign: 'justify',
            color: color,
          }}
        >
          {i18n.t('aboutUs.Acknowledgment', lang)}: {i18n.t('aboutUs.FundingInformation', lang)}{' '}
          {i18n.t('aboutUs.Contact', lang)}
          <hr
            style={{
              width: '100%',
              marginTop: '20px',
              color: color,
            }}
          />
          <p style={{ textAlign: 'center', paddingTop: '6px', fontSize: '12px', color: color }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://intofuture.org/aims-terms.html"
              style={{ color: color, textDecoration: 'none' }}
            >
              {i18n.t('aboutUs.TermsOfService', lang)}
            </a>
            &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://intofuture.org/aims-privacy.html"
              style={{ color: color, textDecoration: 'none' }}
            >
              {i18n.t('aboutUs.PrivacyPolicy', lang)}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
});

export default Team;
