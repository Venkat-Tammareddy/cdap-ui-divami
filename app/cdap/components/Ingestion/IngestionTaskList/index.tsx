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
import TaskOptions from './TaskOptions';
import TaskTags from './TaskTags';
import TaskConnections from './TaskConnections';
import history from 'services/history';
import DuplicateTask from '../DuplicateTask/DuplicateTask';
import If from 'components/If';
import SheduleTask from '../SheduleTask/SheduleTask';
import setStringtoTime from './stringToTime';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import { MyPipelineApi } from 'api/pipeline';
import OverlaySmall from '../OverlaySmall/OverlaySmall';

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
      fontSize: '16px',
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
      fontSize: '16px',
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
    taskNameText: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '16px',
      color: '#202124',
      textOverflow: 'ellipsis',
      paddingLeft: '29px',
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
  const progressIcon = '/cdap_assets/img/Inprogress.svg';
  const [duplicate, setDuplicate] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [taskList, setTaskList] = React.useState(data);
  const [schedule, setSchedule] = React.useState(false);
  const [sheduleObj, setSheduleObj] = React.useState({ taskName: '', selectItem: {} });
  const filteredList = taskList.filter((item) =>
    item.taskName?.toLowerCase().includes(searchText?.toLowerCase())
  );
  const [alert, setAlert] = React.useState<string | null>(null);
  const inProgress = '/cdap_assets/img/inprogress.svg';
  const errorIcon = '/cdap_assets/img/error.svg';
  const successIcon = '/cdap_assets/img/sucess.svg';
  const closeSchedule = () => {
    // setLoading(true);
    setSchedule(false);
  };
  const sheduleTask = (type, taskName, cronExpression) => {
    setLoading(true);
    if (type == 'Suspend') {
      MyPipelineApi.suspend({
        namespace: NamespaceStore.getState().selectedNamespace,
        appId: taskName,
        scheduleId: 'dataPipelineSchedule',
      }).subscribe(
        (message) => {
          console.log('shedule', message);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      setSchedule(true);
      setSheduleObj({ taskName, selectItem: setStringtoTime(cronExpression) });
    }
  };
  const deletePipeline = () => {
    MyPipelineApi.delete({ namespace: currentNamespace, appId: alert }).subscribe((msg) => {
      console.log(alert, 'deleted successfully');
      refetch();
    });
    setAlert(null);
  };
  return (
    <>
      <OverlaySmall
        onCancel={() => setAlert(null)}
        open={!!alert}
        title="Confirm delete"
        description={`Are you sure you want to delete pipeline ${alert}?`}
        onSubmit={() => deletePipeline()}
        submitText="Delete"
      />
      <If condition={loading}>
        <LoadingSVGCentered />
      </If>
      <If condition={schedule}>
        <SheduleTask
          closeSchedule={closeSchedule}
          setLoadingtl={setLoading}
          // sheduleString={sheduleString}
          taskName={sheduleObj.taskName}
          selectItem={sheduleObj.selectItem}
        />
      </If>
      <div className={classes.root}>
        {duplicate && (
          <DuplicateTask
            duplicateTaskName={duplicate}
            closePopup={(isDuplicated) => {
              isDuplicated && refetch();
              setDuplicate(null);
            }}
          />
        )}
        <Table columnTemplate="2fr 1fr 1fr 1fr 1fr 1fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell>{'Task status & name'}</TableCell>
              <TableCell>{'Source Database'}</TableCell>
              <TableCell>{'Source connection'}</TableCell>
              <TableCell>{'Target Database'}</TableCell>
              <TableCell>{'Target connection'}</TableCell>
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
                >
                  {/* <TableCell>
                    <Grid container spacing={0}>
                      <Grid className={classes.gridItem} item xs={1}>
                        <Paper className={classes.paper}>
                          <img
                            // src={(item.status === 'RUNNING' && progressIcon) || myimg}
                            src={
                              (item.status === 'RUNNING' && inProgress) ||
                              (item.status === 'COMPLETED' && successIcon) ||
                              (item.status === 'FAILED' && errorIcon) ||
                              (item.status === 'KILLED' && errorIcon) ||
                              inProgress
                            }
                            alt="img"
                            height="27.2px"
                            width="23px"
                          />
                        </Paper>
                      </Grid>
                      <Grid item xs={11}>
                        <Paper className={classes.taskNameText}>{item.taskName}</Paper>
                      </Grid>
                    </Grid>
                  </TableCell> */}
                  <TaskOptions
                    setLoadingtl={setLoading}
                    taskName={item.taskName}
                    sheduleTask={(type, taskName, cronExpression) =>
                      sheduleTask(type, taskName, cronExpression)
                    }
                    runs={item.runs}
                    setRuns={(runs) =>
                      setTaskList(
                        produce((draft) => {
                          draft[index].runs = runs;
                        })
                      )
                    }
                    deletePipeline={(taskName) => {
                      setAlert(taskName);
                    }}
                    setDuplicate={(value) => setDuplicate(value)}
                  />
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
