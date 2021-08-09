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
import TableCell from 'components/Table/TableCell';
import { Grid, Paper } from '@material-ui/core';
import { MyPipelineApi } from 'api/pipeline';
import NamespaceStore from 'services/NamespaceStore';

const styles = (theme): StyleRules => {
  return {
    root: {
      border: '1px solid red',
    },
    paper: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
      textOverflow: 'ellipsis',
    },
  };
};

interface ITaskConnectionsProps extends WithStyles<typeof styles> {
  taskName: string;
}
const TaskConnectionsView: React.FC<ITaskConnectionsProps> = ({ classes, taskName }) => {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const [connections, setConnections] = React.useState({
    sourceName: '',
    sourceDb: '',
    targetName: '',
    targetDb: '',
  });
  React.useEffect(() => {
    MyPipelineApi.fetchMacros({
      appId: taskName,
      namespace,
    }).subscribe(
      (res) => {
        setConnections({
          sourceName: res[1].id,
          sourceDb: res[1].spec.properties.properties.connectionString?.split('/')[3],
          targetName: res[2].id,
          targetDb: res[2].spec.properties.properties.dataset,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  return (
    <>
      <TableCell>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>{connections.sourceDb}</Paper>
            <Paper className={classes.paper}>{connections.sourceName}</Paper>
          </Grid>
        </Grid>
      </TableCell>
      <TableCell>
        <Grid container spacing={0}>
          <Grid item xs={12}>
            <Paper className={classes.paper}>{connections.targetDb}</Paper>
            <Paper className={classes.paper}>{connections.targetName}</Paper>
          </Grid>
        </Grid>
      </TableCell>
    </>
  );
};

const TaskConnections = withStyles(styles)(TaskConnectionsView);
export default TaskConnections;
