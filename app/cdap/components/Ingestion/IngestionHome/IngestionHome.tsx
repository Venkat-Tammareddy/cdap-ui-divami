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
import Heading, { HeadingTypes } from 'components/Heading';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    content: {
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      padding: '15px 50px',
    },
  };
};

interface IIngestionHomeProps extends WithStyles<typeof styles> {}
const IngestionHomeView: React.FC<IIngestionHomeProps> = ({ classes }) => {
  return (
    <div className={classes.root}>
      <EntityTopPanel title="Ingestion Tasks" />
      <div className={classes.content}>
        <Heading type={HeadingTypes.h1} label={'Ingestion Home Page'} />
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push('ingestion/create')}
        >
          Create Ingest
        </Button>
      </div>
    </div>
  );
};

const IngestionHome = withStyles(styles)(IngestionHomeView);
export default IngestionHome;
