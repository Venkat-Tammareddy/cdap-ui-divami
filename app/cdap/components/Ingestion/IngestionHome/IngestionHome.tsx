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
import { Route, Switch, NavLink } from 'react-router-dom';
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
  };
};

interface IIngestionHomeProps extends WithStyles<typeof styles> {}
const PREFIX = 'features.PipelineList';
const IngestionHomeView: React.FC<IIngestionHomeProps> = ({ classes }) => {
  const basepath = `/ns/:namespace/ingestion`;

  return (
    <div className={classes.root}>
      <EntityTopPanel title="Ingestion Tasks" />
      <div className={classes.content}>
        <Button
          className={classes.btn}
          variant="contained"
          color="primary"
          onClick={() => history.push('ingestion/create')}
        >
          Create Ingest
        </Button>
        <h4 className="view-header" data-cy="pipeline-list-view-header">
          <NavLink exact to={basepath} className="option" activeClassName="active">
            {T.translate(`${PREFIX}.deployed`)}
          </NavLink>

          <span className="separator">|</span>

          <NavLink exact to={`${basepath}/drafts`} className="option" activeClassName="active">
            {T.translate(`${PREFIX}.draft`)}
          </NavLink>
        </h4>
        <Switch>
          <Route
            exact
            path="/ns/:namespace/ingestion"
            component={() => {
              return (
                <ErrorBoundary>
                  <DeployedPipelineView />
                </ErrorBoundary>
              );
            }}
          />
          <Route exact path="/ns/:namespace/ingestion/drafts" component={DraftPipelineView} />
        </Switch>
      </div>
    </div>
  );
};

const IngestionHome = withStyles(styles)(IngestionHomeView);
export default IngestionHome;
