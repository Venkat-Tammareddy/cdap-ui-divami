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
import { MyMetadataApi } from 'api/metadata';
import produce from 'immer';
import { MyPipelineApi } from 'api/pipeline';
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
      paddingBottom: '16px',
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
const options = ['Run Task', 'Update Schedule', 'Task Configuration', 'Duplicate', 'Archive'];

interface IngestTaskListProps extends WithStyles<typeof styles> {
  searchText: String;
  data: any[];
}

const IngestionTaskList: React.FC<IngestTaskListProps> = ({ classes, searchText, data }) => {
  const myimg = '/cdap_assets/img/idle-status.svg';
  const runSuccess = '/cdap_assets/img/last-run-tick.svg';
  const runError = '/cdap_assets/img/lastrun-error.svg';
  const runProgress = '/cdap_assets/img/lastrun-inprogress.svg';
  const imgMore = '/cdap_assets/img/more.svg';
  const imgStop = '/cdap_assets/img/stop.svg';
  const imglRun = '/cdap_assets/img/lastrun-inprogress.svg';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [selectedRow, setSelectedRow] = React.useState(0);
  const [taskList, setTaskList] = React.useState(data);
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

  React.useEffect(() => {
    taskList.map((item, index) => {
      MyPipelineApi.fetchMacros({
        appId: item.taskName,
        namespace: currentNamespace,
      }).subscribe(
        (res) => {
          setTaskList(
            produce((draft) => {
              (draft[
                index
              ].sourceConnectionDb = res[1].spec.properties.properties.connectionString?.split(
                '/'
              )[3]),
                (draft[index].sourceConnection = res[1].id),
                (draft[index].targetConnection = res[2].id),
                (draft[index].targetConnectionDb = res[2].spec.properties.properties.dataset);
            })
          );
        },
        (err) => {
          console.log(err);
        }
      );
      MyMetadataApi.getTags({
        namespace: currentNamespace,
        entityType: 'apps',
        entityId: item.taskName,
      }).subscribe((tags) => {
        console.log(tags);
        setTaskList(
          produce((draft) => {
            draft[index].tags = tags.tags
              .filter((tag) => tag.scope === 'USER')
              .map((tag) => tag.name);
          })
        );
      });
      MyPipelineApi.getRuns({
        namespace: currentNamespace,
        appId: item.taskName,
        programType: 'workflows',
        programName: 'DataPipelineWorkflow',
      }).subscribe((runs) => {
        setTaskList(
          produce((draft) => {
            draft[index].runs = runs.map((run) => run.status);
            console.log('test', draft);
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
                  to={`/ns/${currentNamespace}/ingestion/task/${item.taskName}`}
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
                        {item.tags.length === 0 && (
                          <p style={{ color: '#202124', fontSize: '14px', fontFamily: 'Lato' }}>
                            - -
                          </p>
                        )}
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
                      {item.runs.map(
                        (run, i) =>
                          i < 3 && (
                            <Grid item xs={2}>
                              <Paper className={classes.paper}>
                                <img
                                  src={
                                    (run === 'RUNNING' && runProgress) ||
                                    (run === 'COMPLETED' && runSuccess) ||
                                    (run === 'FAILED' && runError)
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
                    <Grid container spacing={0}>
                      <Grid item xs={8}>
                        <Paper
                          style={{
                            visibility: item.stopBtn ? 'visible' : 'hidden',
                          }}
                          className={classes.paper}
                          onClick={(e) => onOptionSelect(item.runId)}
                        >
                          <img src={imgStop} alt="img" height="20px" width="20px" />
                          <span className={classes.marginLeft}>Stop</span>
                        </Paper>
                      </Grid>
                      <Grid item xs={4}>
                        <Paper
                          style={{
                            visibility: item.moreBtnVisible ? 'visible' : 'hidden',
                          }}
                          className={classes.paper}
                        >
                          <div>
                            <IconButton
                              aria-label="more"
                              className={classes.iconButton}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setAnchorEl(e.currentTarget);
                                setSelectedRow(item.runId);
                              }}
                            >
                              <img src={imgMore} />
                            </IconButton>
                            <Menu
                              id="long-menu"
                              anchorEl={anchorEl}
                              keepMounted
                              elevation={0}
                              open={open}
                              onClose={(e) => setAnchorEl(null)}
                              PaperProps={{
                                style: {
                                  height: '220px',
                                  width: '157px',
                                  border: '1px solid #A5A5A5',
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
                                  className={classes.menuText}
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
