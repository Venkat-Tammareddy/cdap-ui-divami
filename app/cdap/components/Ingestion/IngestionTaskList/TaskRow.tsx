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
import { CircularProgress, Grid, Menu, MenuItem, Paper } from '@material-ui/core';
import { MyPipelineApi } from 'api/pipeline';
import NamespaceStore from 'services/NamespaceStore';
import LoadingSVG from 'components/LoadingSVG';
import TableCell from 'components/Table/TableCell';
import IconSVG from 'components/IconSVG';
import TaskConnections from './TaskConnections';
import TaskTags from './TaskTags';
import history from 'services/history';

const styles = (theme): StyleRules => {
  return {
    root: {
      //   border: '1px solid red',
    },
    menuItem: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      padding: '5px 20px',
    },
    marginLeft: {
      marginLeft: '10px',
    },
    paper: {
      //   border: '1px solid green',
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
      textOverflow: 'ellipsis',
    },
    optionsIcon: {
      //   border: '2px solid blue',
      padding: '6px 12px',
      borderRadius: '99px',
      '&:hover': {
        backgroundColor: '#A5A5A5',
      },
    },
    gridItem: {
      margin: 'auto',
    },
    taskNameText: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
      textOverflow: 'ellipsis',
      paddingLeft: '29px',
    },
  };
};
interface IRunsProps {
  status: string;
  runId: string;
}
interface ITaskRowProps extends WithStyles<typeof styles> {
  taskName: string;
  setDuplicate: (value: string) => void;
  sheduleTask?: (type: string, taskName: string, cronExpression: string) => void;
  setLoadingtl?;
  deletePipeline: (taskName: string) => void;
  refetchSchedule: boolean;
}
const TaskRowView: React.FC<ITaskRowProps> = ({
  classes,
  taskName,
  setDuplicate,
  sheduleTask,
  setLoadingtl,
  deletePipeline,
  refetchSchedule,
}) => {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const [runs, setRuns] = React.useState([]);
  const latestRun = runs[0];
  const imgStop = '/cdap_assets/img/stop.svg';
  const imgMore = '/cdap_assets/img/more.svg';
  const runSuccess = '/cdap_assets/img/last-run-tick.svg';
  const runError = '/cdap_assets/img/lastrun-error.svg';
  const killedIcon = '/cdap_assets/img/killed.svg';
  const inProgress = '/cdap_assets/img/inprogress.svg';
  const runProgress = '/cdap_assets/img/Inprogress.svg';
  const errorIcon = '/cdap_assets/img/error.svg';
  const successIcon = '/cdap_assets/img/sucess.svg';
  const deployedIcon = '/cdap_assets/img/not started.svg';
  const [options, setOptions] = React.useState([
    'Run Task',
    'Update Schedule',
    'Task Configuration',
    'Duplicate',
    'Delete',
  ]);
  const [loading, setLoading] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [cronExpression, setCronExpression] = React.useState('');
  const open = Boolean(anchorEl);
  const optionSelect = (type: string) => {
    type === 'Delete' && deletePipeline(taskName);
    type === 'Run Task' &&
      (MyPipelineApi.run({
        namespace,
        appId: taskName,
      }).subscribe((message) => {
        console.log(taskName + 'started running....');
        setLoading(true);
      }),
      setLoading(true));
    type === 'Duplicate' && setDuplicate(taskName);
    type === 'Task Configuration' && history.push(`/ns/${namespace}/ingestion/task/${taskName}`);

    (type == 'Reschedule' || type == 'Suspend' || type == 'Schedule') &&
      sheduleTask(type, taskName, cronExpression);
  };
  const stopRun = (runId: string) => {
    console.log(latestRun);
    setLoading(true);
    MyPipelineApi.stopRun({
      namespace,
      appId: taskName,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
      runid: runId,
    }).subscribe((msg) => {
      console.log('run stopped successfully');
      setLoading(true);
    });
  };
  const fetchScheduleDetails = () => {
    setLoadingtl(true);
    MyPipelineApi.scheduleDetails({
      namespace: NamespaceStore.getState().selectedNamespace,
      appId: taskName,
      scheduleId: 'dataPipelineSchedule',
    }).subscribe((message) => {
      setCronExpression(message.trigger.cronExpression);
      if (message.status == 'SUSPENDED' && message.trigger.cronExpression == '0 * * * *') {
        setOptions((prev) => {
          const options = prev.slice(0);
          options[1] = 'Schedule';
          return options;
        });
      } else if (message.status == 'SUSPENDED') {
        setOptions((prev) => {
          const options = prev.slice(0);
          options[1] = 'Reschedule';
          return options;
        });
      } else {
        setOptions((prev) => {
          const options = prev.slice(0);
          options[1] = 'Suspend';
          return options;
        });
      }
      setLoadingtl(false);
    });
  };
  React.useEffect(() => {
    MyPipelineApi.pollRuns({
      namespace,
      appId: taskName,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
    }).subscribe(
      (runs) => {
        setRuns(
          runs.map((run) => {
            return {
              status: run.status,
              runId: run.runid,
            };
          })
        );
      },
      (err) => console.log(err)
    );
  }, [taskName]);
  React.useEffect(() => {
    fetchScheduleDetails();
  }, [refetchSchedule]);
  React.useEffect(() => setLoading(false), [runs]);
  return (
    <>
      <TableCell>
        <Grid container spacing={0}>
          <Grid className={classes.gridItem} item xs={1}>
            <Paper className={classes.paper}>
              <img
                // src={(item.status === 'RUNNING' && progressIcon) || myimg}
                src={
                  runs.length === 0
                    ? deployedIcon
                    : (latestRun?.status === 'RUNNING' && inProgress) ||
                      (latestRun?.status === 'COMPLETED' && successIcon) ||
                      (latestRun?.status === 'FAILED' && errorIcon) ||
                      (latestRun?.status === 'KILLED' && killedIcon) ||
                      inProgress
                }
                alt="img"
                height="27.2px"
                width="23px"
              />
            </Paper>
          </Grid>
          <Grid item xs={11}>
            <Paper className={classes.taskNameText}>{taskName}</Paper>
          </Grid>
        </Grid>
      </TableCell>

      <TaskConnections taskName={taskName} />
      <TableCell>
        <TaskTags taskName={taskName} />
      </TableCell>
      <TableCell>
        <Grid container spacing={0}>
          {runs.map(
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
        <Grid container spacing={0} className={classes.root}>
          <Grid item xs={8}>
            {loading ? (
              <LoadingSVG />
            ) : (
              <Paper
                className={classes.paper}
                hidden={!(latestRun?.status === 'RUNNING')}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  stopRun(latestRun?.runId);
                }}
              >
                <img src={imgStop} alt="img" height="20px" width="20px" />
                <span className={classes.marginLeft}>Stop</span>
              </Paper>
            )}
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <img
                src={imgMore}
                className={classes.optionsIcon}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setAnchorEl(e.currentTarget);
                }}
              />
              <Menu
                id="long-menu"
                keepMounted
                anchorEl={anchorEl}
                open={open}
                getContentAnchorEl={null}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setAnchorEl(null);
                }}
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
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      optionSelect(option);
                      setAnchorEl(null);
                    }}
                    className={classes.menuItem}
                  >
                    {option}
                  </MenuItem>
                ))}
              </Menu>
            </Paper>
          </Grid>
        </Grid>
      </TableCell>
    </>
  );
};

const TaskRow = withStyles(styles)(TaskRowView);
export default TaskRow;
