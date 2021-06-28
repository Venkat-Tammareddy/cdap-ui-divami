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
import T from 'i18n-react';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    content: {
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      padding: '15px 50px',
    },
    btn: {
      margin: '15px',
    },
    btnWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
    },
    tabs: {
      cursor: 'pointer',
      margin: '0px 10px',
      '&:hover': {
        textDecoration: 'underline',
      },
    },
  };
};

interface IIngestionHomeProps extends WithStyles<typeof styles> {}
const PREFIX = 'features.PipelineList';
const IngestionHomeView: React.FC<IIngestionHomeProps> = ({ classes }) => {
  const [displayDrafts, setDisplayDrafts] = React.useState(false);
  return (
    <div className={classes.root}>
      <EntityTopPanel title="Ingestion Tasks" />
      <div className={classes.content}>
        <div className={classes.btnWrapper}>
          <Button
            className={classes.btn}
            variant="contained"
            color="primary"
            onClick={() => history.push('ingestion/create')}
          >
            Create Ingest
          </Button>
        </div>

        <h4>
          <span className={classes.tabs} onClick={() => setDisplayDrafts(false)}>
            {T.translate(`${PREFIX}.deployed`)}
          </span>
          <span className="separator">|</span>
          <span className={classes.tabs} onClick={() => setDisplayDrafts(true)}>
            {T.translate(`${PREFIX}.draft`)}
          </span>
        </h4>
        {displayDrafts ? (
          <DraftPipelineView />
        ) : (
          <ErrorBoundary>
            <DeployedPipelineView />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
};

const IngestionHome = withStyles(styles)(IngestionHomeView);
export default IngestionHome;
