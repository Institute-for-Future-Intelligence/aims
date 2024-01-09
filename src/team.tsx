/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React, { useMemo } from 'react';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';

export interface TeamProps {
  top: number;
  height?: number;
  color?: string;
}

const Team = ({ top, height, color }: TeamProps) => {
  const language = useStore(Selector.language);

  const { t } = useTranslation();
  const lang = useMemo(() => {
    return { lng: language };
  }, [language]);

  const linePos = top + 64 + 'px';
  const top100 = top + 120 + 'px';
  const top200 = top + 205 + 'px';

  return (
    <div>
      <div
        style={{
          position: 'absolute',
          borderRadius: '20px',
          border: 'thin',
          textAlign: 'center',
          left: '15%',
          right: '15%',
          top: top + 'px',
          height: (height ?? 300) + 'px',
        }}
      >
        <h2 style={{ marginTop: '20px', color: color }}>{t('aboutUs.ProductBroughtToYouBy', lang)}</h2>
        <p style={{ fontSize: '12px', color: color, paddingTop: '20px' }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://intofuture.org/aims-terms.html"
            style={{ color: color, textDecoration: 'none' }}
          >
            {t('aboutUs.TermsOfService', lang)}
          </a>
          &nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://intofuture.org/aims-privacy.html"
            style={{ color: color, textDecoration: 'none' }}
          >
            {t('aboutUs.PrivacyPolicy', lang)}
          </a>
        </p>
      </div>
      <div>
        <hr
          style={{
            position: 'absolute',
            left: '10%',
            width: '80%',
            marginTop: linePos,
            color: color,
          }}
        />
        <table
          style={{
            position: 'absolute',
            border: 'none',
            top: top100,
            left: '10%',
            width: '80%',
            fontSize: 'small',
            color: color,
          }}
        >
          <tbody>
            <tr
              style={{
                verticalAlign: 'top',
              }}
            >
              <td>
                <h3 style={{ color: color }}>{t('aboutUs.Software', lang)}</h3>
                Xiaotong Ding
                <br />
                Charles Xie
                <br />
              </td>
              <td>
                <h3 style={{ color: color }}>{t('aboutUs.Content', lang)}</h3>
                Dylan Bulseco
                <br />
                Charles Xie
                <br />
              </td>
              <td>
                <h3 style={{ color: color }}>{t('aboutUs.Support', lang)}</h3>
                Elena Sereiviene
                <br />
                Charles Xie
                <br />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div
        style={{
          position: 'absolute',
          left: '10%',
          marginRight: '10%',
          top: top200,
          fontSize: '12px',
          textAlign: 'justify',
          color: color,
        }}
      >
        {t('aboutUs.Acknowledgment', lang)}: {t('aboutUs.FundingInformation', lang)} {t('aboutUs.Contact', lang)}
      </div>
    </div>
  );
};

export default React.memo(Team);
