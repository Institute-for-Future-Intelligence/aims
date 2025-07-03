/*
 * @Copyright 2024-2025. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import styled from 'styled-components';
import Team from './team';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';

const Container = styled.div`
  position: absolute;
  top: 80px;
  left: 10px;
  display: flex;
  width: 600px;
  height: 360px;
  flex-direction: column;
  align-items: center;
  z-index: 1001;
  border-radius: 10px;
  background: dimgray;
  box-shadow: 3px 3px 3px 3px black;
`;

const About = React.memo(({ close }: { close: () => void }) => {
  const language = useStore(Selector.language);
  const { t } = useTranslation();
  return (
    <Container>
      <Team top={10} color={'antiquewhite'} />
      <div
        style={{
          position: 'absolute',
          fontSize: 'small',
          color: 'antiquewhite',
          cursor: 'pointer',
          bottom: '10px',
        }}
        onMouseDown={() => {
          close();
        }}
      >
        {t('word.Close', { lng: language })}
      </div>
    </Container>
  );
});

export default About;
