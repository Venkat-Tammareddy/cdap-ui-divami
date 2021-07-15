/*
 * Copyright © 2020 Cask Data, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not
 * use this file except in compliance with the License. You may obtain a copy of
 * the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations under
 * the License.
 */

import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { EntityTopPanel } from 'components/EntityTopPanel';
import { Button } from '@material-ui/core';
import history from 'services/history';
import ErrorBoundary from 'components/ErrorBoundary';
import DeployedPipelineView from 'components/PipelineList/DeployedPipelineView';
import DraftPipelineView from 'components/PipelineList/DraftPipelineView';
import IngestionTaskList from 'components/Ingestion/IngestionTaskList/index';
import DraftsList from 'components/Ingestion/DraftsList/DraftsList';
import SheduleTask from 'components/Ingestion/SheduleTask/SheduleTask';
import T from 'i18n-react';
import SearchIcon from '@material-ui/icons/Search';
import { TextField } from '@material-ui/core';
import IngestionHeader from '../IngestionHeader/IngestionHeader';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    content: {
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      padding: '15px 50px',
    },
    tabbleViewWrpr: {
      padding: '0px 18px',
      height: 'calc(100% - 112px)',
      borderTop: '1px solid #A5A5A5',
    },
    tabsWrapper: {
      padding: '18px 0px',
      display: 'grid',
      gridTemplateColumns: '0fr 1fr 0fr',
    },
    tabContainer: {
      height: '80px',
      // display: 'grid',
      // gridTemplateColumns: '0fr 1fr 0fr',
    },
    tabs: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: ' #202124;',
      letterSpacing: '0.13px',
      padding: '7.5px',
      marginRight: '22.5px',
      cursor: 'pointer',
      // '&:active': {
      //   textDecoration: 'underline',
      // },
    },
    search: {
      width: '256px',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderRadius: `25px`,
          height: '36px',
        },
      },
      '& .MuiOutlinedInput-adornedStart ': {
        padding: '7px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '0px',
      },
    },
  };
};

interface IIngestionHomeProps extends WithStyles<typeof styles> {}
const PREFIX = 'features.PipelineList';
const IngestionHomeView: React.FC<IIngestionHomeProps> = ({ classes }) => {
  const [displayDrafts, setDisplayDrafts] = React.useState(false);
  const [search, setSearch] = React.useState('');
  return (
    <>
      {/* <SheduleTask /> */}
      <div className={classes.root}>
        <IngestionHeader
          title="Ingest Tasks"
          create
          onCreate={() => history.push('ingestion/create')}
        />
        <div className={classes.tabbleViewWrpr}>
          <div className={classes.tabsWrapper}>
            <div>
              <span
                className={classes.tabs}
                onClick={() => setDisplayDrafts(false)}
                style={{ borderBottom: !displayDrafts ? '4px solid #4285F4' : 'none' }}
              >
                TASKS(22)
              </span>
            </div>
            <div>
              <span
                className={classes.tabs}
                onClick={() => setDisplayDrafts(true)}
                style={{ borderBottom: displayDrafts ? '4px solid #4285F4' : 'none' }}
              >
                DRAFTS(44)
              </span>
            </div>
            <TextField
              variant="outlined"
              placeholder={'search tasks'}
              className={classes.search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              autoFocus={false}
              data-cy="connections-search"
            />
          </div>
          {displayDrafts ? (
            <DraftsList searchText={search} />
          ) : (
            <IngestionTaskList searchText={search} />
          )}
        </div>
      </div>
    </>
  );
};

const IngestionHome = withStyles(styles)(IngestionHomeView);
export default IngestionHome;
