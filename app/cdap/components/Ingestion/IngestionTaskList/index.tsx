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
import { IconButton } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import NamespaceStore from 'services/NamespaceStore';
import DuplicateTask from '../DuplicateTask/DuplicateTask';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 66px)', // margin
    },
    header: {
      paddingBottom: '16px',
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#19A347',
      lineHeight: '24px',
      backgroundColor: 'white',
      letterSpacing: 0,
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
  };
};
const options = ['Run Task', 'Update Schedule', 'Task Configuration', 'Duplicate', 'Archive'];

interface IngestTaskListProps extends WithStyles<typeof styles> {
  searchText: String;
  data: any[];
}

const IngestionTaskList: React.FC<IngestTaskListProps> = ({ classes, searchText, data }) => {
  const myimg = '/cdap_assets/img/idle-status.svg';
  const myimg1 = '/cdap_assets/img/last-run-tick.svg';
  const imgMore = '/cdap_assets/img/more.svg';
  const imgStop = '/cdap_assets/img/stop.svg';
  const imglRun = '/cdap_assets/img/lastrun-inprogress.svg';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [taskList, setTaskList] = React.useState(
    data
    //   {
    //     runId: 1,
    //     taskName: 'one Employee performance demo task',
    //     status: 'Running',
    //     sourceConnectionDb: 'Study_trails',
    //     sourceConnection: 'Study_trails_Connection',
    //     targetConnection: 'Study_execution_connection',
    //     targetConnectionDb: 'Eduction_course_Analysis',
    //     tags: ['study_tails', 'study_1', 'study_2'],
    //     moreBtnVisible: true,
    //     stopBtn: false,
    //   },
    //   {
    //     runId: 2,
    //     taskName: 'Two Employee performance demo task',
    //     status: 'Running',
    //     sourceConnectionDb: 'Study_trails',
    //     sourceConnection: 'Study_trails_Connection',
    //     targetConnectionDb: 'Eduction_course_Analysis',
    //     tags: ['study_tails', 'study_1', 'study_2', 'hsds'],
    //     targetConnection: 'Study_execution_connection',
    //     moreBtnVisible: true,
    //     stopBtn: false,
    //   },
    //   {
    //     runId: 3,
    //     taskName: 'third Employee performance demo task',
    //     status: 'Running',
    //     sourceConnectionDb: 'Study_trails',
    //     sourceConnection: 'Study_trails_Connection',
    //     targetConnectionDb: 'Eduction_course_Analysis',
    //     tags: ['study_tails', 'study_1', 'study_2', 'hsds'],
    //     targetConnection: 'Study_execution_connection',
    //     moreBtnVisible: true,
    //     stopBtn: false,
    //   },
    //   {
    //     runId: 4,
    //     taskName: 'four Employee performance demo task',
    //     status: 'Running',
    //     sourceConnectionDb: 'Study_trails',
    //     sourceConnection: 'Study_trails_Connection',
    //     targetConnectionDb: 'Eduction_course_Analysis',
    //     tags: ['study_tails', 'study_1', 'study_2', 'hsds'],
    //     targetConnection: 'Study_execution_connection',
    //     moreBtnVisible: true,
    //     stopBtn: false,
    //   },
  );
  const onOptionSelect = (id: Number) => {
    setAnchorEl(null);
    setTaskList((oldArray) => {
      return [...oldArray].map((object) => {
        const objectCopy = { ...object };
        if (object.runId == id) {
          return {
            ...object,
            moreBtnVisible: !objectCopy.moreBtnVisible,
            stopBtn: !objectCopy.stopBtn,
          };
        } else {
          return objectCopy;
        }
      });
    });
  };

  const filteredList = taskList.filter((item) =>
    item.taskName?.toLowerCase().includes(searchText?.toLowerCase())
  );
  const goToIngestionHome = () => {
    alert('Going to home');
  };

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
                  data-cy={`table-row-${item.runId}`}
                  to={`/ns/${currentNamespace}/ingestion/detail`}
                >
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid className={classes.gridItem} item xs={1}>
                        <Paper className={classes.paper}>
                          <img src={myimg} alt="img" height="30px" width="30px" />
                        </Paper>
                      </Grid>
                      <Grid item xs={11}>
                        <Paper className={classes.paper}>{item.taskName}</Paper>
                        <Paper className={classes.paper}>{item.status}</Paper>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>{item.sourceConnectionDb}</Paper>
                        <Paper className={classes.paper}>{item.sourceConnection}</Paper>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>{item.targetConnectionDb}</Paper>
                        <Paper className={classes.paper}>{item.targetConnection}</Paper>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={12}>
                        <Paper className={classes.paper}>{item.tags[0]}</Paper>
                        {item.tags.length > 1 ? (
                          <Paper className={classes.paperCount}>+{item.tags.length - 1} more</Paper>
                        ) : (
                          ''
                        )}
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={2}>
                        <Paper className={classes.paper}>
                          <img src={myimg1} alt="img" height="20px" width="20px" />
                        </Paper>
                      </Grid>
                      <Grid item xs={2}>
                        <Paper className={classes.paper}>
                          <img src={myimg1} alt="img" height="20px" width="20px" />
                        </Paper>
                      </Grid>
                      <Grid item xs={2}>
                        <Paper className={classes.paper}>
                          <img src={myimg1} alt="img" height="20px" width="20px" />
                        </Paper>
                      </Grid>
                    </Grid>
                  </TableCell>
                  <TableCell>
                    <Grid container spacing={0}>
                      <Grid item xs={8}>
                        <Paper
                          style={{ visibility: item.stopBtn ? 'visible' : 'hidden' }}
                          className={classes.paper}
                          onClick={(e) => onOptionSelect(item.runId)}
                        >
                          <img src={imgStop} alt="img" height="20px" width="20px" />
                          <span className={classes.marginLeft}>Stop</span>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          style={{ visibility: item.moreBtnVisible ? 'visible' : 'hidden' }}
                          className={classes.paper}
                        >
                          <div>
                            <IconButton
                              aria-label="more"
                              className={classes.iconButton}
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                                setSelectedRow(item.runId);
                              }}
                            >
                              <MoreVertIcon />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              anchorEl={anchorEl}
                              keepMounted
                              open={open}
                              onClose={(e) => setAnchorEl(null)}
                              PaperProps={{
                                style: {
                                  maxHeight: 48 * 4.5,
                                  width: '20ch',
                                },
                              }}
                            >
                              {options.map((option) => (
                                <MenuItem
                                  key={option}
                                  // selected={option === 'Pyxis'}
                                  onClick={(e) => {
                                    onOptionSelect(selectedRow);
                                  }}
                                >
                                  {option}
                                </MenuItem>
                              ))}
                            </Menu>
                          </div>
                        </Paper>
                      </Grid>
                    </Grid>
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
