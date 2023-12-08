/*
 * @Copyright 2023. Institute for Future Intelligence, Inc.
 */

import React, {useMemo} from 'react';
import './App.css';
import i18n from './i18n/i18n';
import {useStore} from "./stores/common";
import * as Selector from './stores/selector';
import {visitHomepage} from "./helpers";

const App= () => {

    const language = useStore(Selector.language);

    const lang = useMemo(() => {
        return {lng: language};
    }, [language]);

    return (
        <div className="App">
            <div
                style={{
                    backgroundColor: 'lightblue',
                    height: '72px',
                    paddingTop: '10px',
                    textAlign: 'start',
                    userSelect: 'none',
                    fontSize: '30px',
                }}
            >
        <span
            style={{
                marginLeft: '120px',
                verticalAlign: 'middle',
                cursor: 'pointer',
                userSelect: 'none',
            }}
            title={i18n.t('tooltip.visitAIMSHomePage', lang)}
            onClick={visitHomepage}
        >
          {`${i18n.t('name.AIMS', lang)}`}
        </span>
            </div>
        </div>
    );
}

export default React.memo(App);
