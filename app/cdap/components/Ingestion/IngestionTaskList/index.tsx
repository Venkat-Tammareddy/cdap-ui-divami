/*
 * Copyright © 2018 Cask Data, Inc.
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
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import Table from 'components/Table';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import NamespaceStore from 'services/NamespaceStore';
import produce from 'immer';
import { MyPipelineApi } from 'api/pipeline';
import TaskOptions from './TaskOptions';
import TaskTags from './TaskTags';
import TaskConnections from './TaskConnections';
import history from 'services/history';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 66px)', // margin
      '& .MuiMenuItem-root': {
        marginTop: '10px',
        color: 'red',
      },
      '& .MuiMenu-list': {
        color: 'red',
        backgroundColor: 'orange',
      },
    },
    header: {
      paddingBottom: '10.5px',
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#19A347',
      lineHeight: '24px',
      backgroundColor: 'white',
      fontWeight: 'normal',
      letterSpacing: '0',
    },
    tableRow: {
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Lato',
      letterSpacing: '0',
      lineHeight: '24px',
      height: '78px',
    },
    gridItem: {
      margin: 'auto',
    },
    paper: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
      textOverflow: 'ellipsis',
    },
    paperCount: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      color: '#4285F4',
    },

    marginLeft: {
      marginLeft: '10px',
    },
    iconButton: {
      ' & button:focus': {
        outline: 'none',
      },
    },
    menuContainer: {
      border: '1px solid orange',
      color: 'red',
    },
    menuText: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      padding: '5px 20px',
    },
  };
};

interface IngestTaskListProps extends WithStyles<typeof styles> {
  searchText: String;
  data: any[];
  refetch: () => void;
}

const IngestionTaskList: React.FC<IngestTaskListProps> = ({
  classes,
  searchText,
  data,
  refetch,
}) => {
  const myimg = '/cdap_assets/img/idle-status.svg';
  const runSuccess = '/cdap_assets/img/last-run-tick.svg';
  const runError = '/cdap_assets/img/lastrun-error.svg';
  const runProgress = '/cdap_assets/img/lastrun-inprogress.svg';

  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [taskList, setTaskList] = React.useState(data);
  const [more, setMore] = React.useState(false);

  const filteredList = taskList.filter((item) =>
    item.taskName?.toLowerCase().includes(searchText?.toLowerCase())
  );

  React.useEffect(() => {
    taskList.map((item, index) => {
      MyPipelineApi.getRuns({
        namespace: currentNamespace,
        appId: item.taskName,
        programType: 'workflows',
        programName: 'DataPipelineWorkflow',
      }).subscribe((runs) => {
        setTaskList(
          produce((draft) => {
            draft[index].runs = runs.map((run) => {
              return {
                status: run.status,
                runId: run.runid,
              };
            });
          })
        );
      }),
        (err) => console.log(err);
    });
  }, []);
  return (
    <>
      <div className={classes.root}>
        {/* <DuplicateTask
          submitValues={(value) => console.log(value)}
          handleCancel={() => goToIngestionHome()}
        /> */}
        <Table columnTemplate="2fr 1fr 1fr 1fr 1fr 1fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell>{'Task status & name'}</TableCell>
              <TableCell>{'Source connection'}</TableCell>
              <TableCell>{'Target connection'}</TableCell>
              <TableCell>{'Tags'}</TableCell>
              <TableCell>{'Last 3 runs status'}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody data-cy="table-body">
            {filteredList.map((item, index) => {
              return (
                <TableRow
                  key={index}
                  className={classes.tableRow}
                  data-cy={`table-row-${item.taskName}`}
                  onClick={(e) => {
                    e.preventDefault();
                    history.push(`/ns/${currentNamespace}/ingestion/task/${item.taskName}`);
                  }}
                  // to={`/ns/${currentNamespace}/ingestion/task/${item.taskName}`}
                  // onMouseOver={() => setMore(true)}
                >
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid className={classes.gridItem} item xs={1}>
                        <Paper className={classes.paper}>
                          <img src={myimg} alt="img" height="27.2px" width="23px" />
                        </Paper>
                      </Grid>
                      <Grid item xs={11}>
                        <Paper className={classes.paper}>{item.taskName}</Paper>
                        <Paper className={classes.paper}>{item.status}</Paper>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TaskConnections taskName={item.taskName} />
                  <TableCell>
                    <TaskTags taskName={item.taskName} />
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      {item.runs.map(
                        (run, i) =>
                          i < 3 && (
                            <Grid item xs={2} key={i}>
                              <Paper className={classes.paper}>
                                <img
                                  src={
                                    (run.status === 'RUNNING' && runProgress) ||
                                    (run.status === 'COMPLETED' && runSuccess) ||
                                    (run.status === 'FAILED' && runError) ||
                                    (run.status === 'KILLED' && runError) ||
                                    runProgress
                                  }
                                  alt="img"
                                  height="20px"
                                  width="20px"
                                />
                              </Paper>
                            </Grid>
                          )
                      )}
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <TaskOptions
                      taskName={item.taskName}
                      latestRun={item.runs[0]}
                      refetch={refetch}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default withStyles(styles)(IngestionTaskList);
