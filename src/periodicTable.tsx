/*
 * @Copyright 2025. Institute for Future Intelligence, Inc.
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { useStore } from './stores/common';
import * as Selector from './stores/selector';
import { useTranslation } from 'react-i18next';
import PeriodicTableData from './assets/periodic-table.json';
import './assets/periodic-table-styles.css';
import { Space } from 'antd';

const Container = styled.div`
  position: absolute;
  top: 90px;
  left: calc(50% - 480px);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 1001;
  background: white;
  border: 1px solid gray;
`;

const cell = (props: any) => {
  return (
    <div
      key={props.number}
      className="cell"
      data-category={props.category}
      title={
        props.name + '\nAtomic Mass: ' + props.atomic_mass + '\nElectron Configuration: ' + props.electron_configuration
      }
      style={{
        gridRowStart: props.ypos,
        gridColumnStart: props.xpos,
        visibility: props.visible ? 'visible' : 'hidden',
      }}
    >
      <span className="number">{props.number}</span>
      <span className="symbol">{props.symbol}</span>
      <span className="name">{props.name}</span>
    </div>
  );
};

const PeriodicTable = React.memo(({ close }: { close: () => void }) => {
  const language = useStore(Selector.language);
  const { t } = useTranslation();
  const showCheckboxes = false;

  const [state, setState] = useState(
    PeriodicTableData.elements.reduce(
      (state: any, { category }: { category: any }) => Object.assign(state, { [category]: true }),
      {},
    ),
  );

  return (
    <Container>
      <div className="table">
        <div className="cells">
          {PeriodicTableData.elements.map((e) =>
            cell({
              ...e,
              visible: state[e.category],
            }),
          )}
        </div>
        {showCheckboxes && (
          <div className="categories">
            {Object.keys(state).map((category) => (
              <span key={category}>
                <input
                  key={category}
                  type="checkbox"
                  name={category}
                  checked={state[category]}
                  onChange={(event) =>
                    setState({
                      ...state,
                      ...{ [category]: event.target.checked },
                    })
                  }
                />
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
      <div
        style={{
          position: 'absolute',
          fontSize: 'small',
          color: 'dimgray',
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

export default PeriodicTable;
