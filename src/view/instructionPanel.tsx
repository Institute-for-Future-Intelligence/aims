/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import React from 'react';
import { useStore } from '../stores/common';
import styled from 'styled-components';
import i18n from '../i18n/i18n';
import * as Selector from '../stores/selector';
import { Util } from '../Util';
import { useLanguage } from '../hooks';

const Container = styled.div`
  position: absolute;
  top: 65px;
  left: 60px;
  margin: auto;
  display: flex;
  justify-content: left;
  align-self: flex-start;
  align-content: flex-start;
  align-items: start;
  padding: 16px;
  opacity: 100%;
  user-select: none;
  pointer-events: none;
  tab-index: -1; // set to be not focusable
  z-index: 7; // must be less than other panels
`;

const ColumnWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  align-self: flex-start;
  align-content: flex-start;
  align-items: flex-start;
  margin: auto;
  width: 310px;
  padding-bottom: 10px;
  display: flex;
  font-size: 12px;
  flex-direction: column;
  opacity: 100%;
`;

const InstructionPanel = React.memo(() => {
  const navigation = useStore(Selector.navigationView) ?? false;
  const lang = useLanguage();
  const color = 'navajowhite';

  const isMac = Util.isMac();

  return (
    <Container>
      <ColumnWrapper style={{ color: color, fontSize: navigation ? '10px' : '9px' }}>
        <span>
          <b>{i18n.t(navigation ? 'instructionPanel.DisableNavigation' : 'instructionPanel.EnableNavigation', lang)}</b>
          : {i18n.t('word.Press', lang)} {isMac ? '⌘' : 'Ctrl'}+U
        </span>
        {navigation && (
          <>
            <span>
              <b>{i18n.t('instructionPanel.MoveForwardBack', lang)}</b>:{' '}
              {i18n.t('instructionPanel.MoveForwardBackInstruction', lang)}
            </span>
            <span>
              <b>{i18n.t('instructionPanel.MoveLeftRight', lang)}</b>:{' '}
              {i18n.t('instructionPanel.MoveLeftRightInstruction', lang)}
            </span>
            <span>
              <b>{i18n.t('instructionPanel.MoveUpDown', lang)}</b>:{' '}
              {i18n.t('instructionPanel.MoveUpDownInstruction', lang)}
            </span>
            <span>
              <b>{i18n.t('instructionPanel.Turn', lang)}</b>: {i18n.t('instructionPanel.TurnInstruction', lang)}
            </span>
          </>
        )}
        {!navigation && (
          <span>
            <b>{i18n.t('instructionPanel.Rotate', lang)}</b>: {i18n.t('instructionPanel.DragMouse', lang)}
          </span>
        )}
        {!navigation && (
          <>
            <span>
              <b>{i18n.t('instructionPanel.Zoom', lang)}</b>:{' '}
              {i18n.t(isMac ? 'instructionPanel.MouseWheelOrKeysMac' : 'instructionPanel.MouseWheelOrKeys', lang)}
            </span>
            <span>
              <b>{i18n.t('instructionPanel.Pan', lang)}</b>:{' '}
              {i18n.t(isMac ? 'instructionPanel.HoldMetaDragMouse' : 'instructionPanel.HoldCtrlDragMouse', lang)}
            </span>
          </>
        )}
      </ColumnWrapper>
    </Container>
  );
});

export default InstructionPanel;
