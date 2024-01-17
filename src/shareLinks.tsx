/*
 * @Copyright 2023-2024. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import styled from 'styled-components';
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
  XIcon,
} from 'react-share';
import { HOME_URL } from './programmaticConstants';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';

const ShareLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 999;
`;

export interface ShareLinkProps {
  style?: object;
  size: number;
  margin: string;
  round?: boolean;
  handleShareWindowClose?: () => void;
}

const ShareLinks = ({ style, size, margin, round, handleShareWindowClose }: ShareLinkProps) => {
  const user = useStore(Selector.user);
  const language = useStore(Selector.language);
  const currentTitle = useStore(Selector.projectState).title;

  const { t } = useTranslation();
  const params = new URLSearchParams(window.location.search);
  const userid = params.get('userid');
  const lang = { lng: language };
  const title = currentTitle ?? t('name.Tagline', lang);
  const via = 'aimsIFI ' + (currentTitle ? t('name.Tagline', lang) : '');
  let url = HOME_URL;
  if (currentTitle) {
    // only a cloud file is sharable
    if (userid) {
      // since this may be other people's document, keep its original user id
      url += '?userid=' + userid + '&title=' + encodeURIComponent(currentTitle);
    } else if (user.uid) {
      // otherwise, this is the current user's document
      url += '?userid=' + user.uid + '&title=' + encodeURIComponent(currentTitle);
    }
  }

  return (
    <ShareLinkContainer style={style}>
      <EmailShareButton url={url} subject={title}>
        <EmailIcon size={size} round={round} />
      </EmailShareButton>
      <TwitterShareButton
        url={url}
        title={title}
        via={via}
        style={{ paddingRight: margin }}
        onShareWindowClose={handleShareWindowClose}
      >
        <XIcon size={size} round={round} />
      </TwitterShareButton>
      <FacebookShareButton url={url} style={{ paddingRight: margin }} onShareWindowClose={handleShareWindowClose}>
        <FacebookIcon size={size} round={round} />
      </FacebookShareButton>
      <RedditShareButton
        url={url}
        title={title}
        style={{ paddingRight: margin }}
        onShareWindowClose={handleShareWindowClose}
      >
        <RedditIcon size={size} round={round} />
      </RedditShareButton>
      <TelegramShareButton
        url={url}
        title={title}
        style={{ paddingRight: margin }}
        onShareWindowClose={handleShareWindowClose}
      >
        <TelegramIcon size={size} round={round} />
      </TelegramShareButton>
      <LineShareButton
        url={url}
        title={title}
        style={{ paddingRight: margin }}
        onShareWindowClose={handleShareWindowClose}
      >
        <LineIcon size={size} round={round} />
      </LineShareButton>
      <LinkedinShareButton
        url={url}
        title={title}
        summary={via}
        source={t('name.IFI', lang)}
        style={{ paddingRight: margin }}
        onShareWindowClose={handleShareWindowClose}
      >
        <LinkedinIcon size={size} round={round} />
      </LinkedinShareButton>
      <WhatsappShareButton url={url} title={title} separator=":: " onShareWindowClose={handleShareWindowClose}>
        <WhatsappIcon size={size} round={round} />
      </WhatsappShareButton>
    </ShareLinkContainer>
  );
};

export default React.memo(ShareLinks);
