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
import { Redirect, Route, Switch } from 'react-router-dom';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { Theme } from 'services/ThemeHelper';
import Helmet from 'react-helmet';
import { getCurrentNamespace } from 'services/NamespaceStore';
import CreateIngestion from './CreateIngestion/CreateIngestion';
import IngestionHome from './IngestionHome/IngestionHome';
import TaskDetails from './TaskDetails/TaskDetails';
import JobDetails from './JobDetails/Jobdetails';
import { AppProvider } from 'components/Ingestion/ingestionContext';

const styles = (theme): StyleRules => {
  return {
    root: {},
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  test: string;
  pluginsMap: any;
}
export const basepath = '/ns/:namespace/ingestion';

const IngestionView: React.FC<IIngestionProps> = ({ classes }) => {
  const pageTitle = `${Theme.productName} | Ingestion`;

  return (
    <>
      <Helmet title={pageTitle} />
      <AppProvider>
        <Switch>
          <Route path={`${basepath}/create`} component={CreateIngestion} />
          <Route exact path={`${basepath}/task/:taskName`} component={TaskDetails} />
          <Route path={`${basepath}/task/:taskName/job/:jobId`} component={JobDetails} />
          <Route path={basepath} component={IngestionHome} />
          <Route
            render={() => {
              return <Redirect to={`/ns/${getCurrentNamespace()}/ingestion`} />;
            }}
          />
        </Switch>
      </AppProvider>
    </>
  );
};

const Ingestion = withStyles(styles)(IngestionView);
export default Ingestion;
