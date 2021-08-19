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
import { useContext } from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import history from 'services/history';
import { Typography } from '@material-ui/core';
import IngestionHeader from '../IngestionHeader/IngestionHeader';
import IngestionJobsList from '../IngestionTaskList/IngestionJobsList';
import NamespaceStore from 'services/NamespaceStore';
import If from 'components/If';
import SheduleTask from '../SheduleTask/SheduleTask';
import { useParams } from 'react-router';
import { MyPipelineApi } from 'api/pipeline';
import { MyMetadataApi } from 'api/metadata';
import { ingestionContext } from 'components/Ingestion/ingestionContext';
import { MyMetricApi } from 'api/metric';
import produce from 'immer';
import { parseJdbcString } from '../helpers';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import { humanReadableDate } from 'services/helpers';
import DuplicateTask from '../DuplicateTask/DuplicateTask';
import { isNumeric } from 'services/helpers';
import { wholeArrayIsNumeric } from 'services/helpers';
import moment from 'moment';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    container: {
      padding: '0px 28px 0px 28px',
      borderTop: '1px solid #A5A5A5',
      display: 'flex',
      gap: '350px',
    },
    flexContainer: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1',
    },
    taskName: {
      fontFamily: 'Lato',
      position: 'absolute',
      top: '-18px',
      backgroundColor: '#FFFFFF',
      fontSize: '18px',
      color: '#202124',
      '&:after': {
        content: '',
        display: 'inline-block',
        width: '50%',
        margin: '0 .5em 0 -55 %',
        verticalAlign: 'middle',
        borderBottom: '1px solid',
      },
      paddingRight: '20px',
    },
    taskDate: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      marginTop: '10px',
    },
    description: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      lineHeight: '20px',
      maxWidth: '615px',
      marginTop: '13px',
    },
    connectionContainer: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '32px',
    },
    arrow: {
      margin: '0px 12px',
      paddingTop: '2px',
    },
    chip: {
      border: '1px solid #E0E0E0',
      borderRadius: '16px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      padding: '0px 12px',
      marginRight: '6px',
    },
    chipContainer: {
      display: 'flex',
      alignItems: 'flex-end',
      marginTop: '16px',
      paddingBottom: '21px',
    },
    title: {
      marginTop: '32px',
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      letterSpacing: '0.45px',
      marginLeft: '28px',
    },
    cardsContainer: {
      display: 'flex',
      margin: '20px 0px 20px 28px',
    },
    card: {
      border: '1px solid #aaaaac',
      borderRadius: '4px',
      width: '497px',
      height: '272px',
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      marginRight: '40px',
      cursor: 'pointer',
    },
    cardRunIcon: {
      marginBottom: '30px',
    },
    cardScheduleIcon: {
      marginBottom: '45.5px',
    },
    cardTitle: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      textAlign: 'center',
      marginBottom: '10px',
    },
    cardDescription: {
      width: '302px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#666666',
      textAlign: 'center',
      lineHeight: '20px',
      marginBottom: '33px',
    },
    runHistoryContainer: {
      paddingTop: '26px',
    },
    runDetails: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '28px',
      marginBottom: '20px',
      paddingBottom: '20px',
      width: '100%',
    },
    runDetailsItem: {
      display: 'flex',
      gap: '20px',
    },
    successPercentage: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      opacity: '0.8',
    },
    runDetailsTop: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      opacity: '0.8',
    },
    runDetailsBottom: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      opacity: '0.8',
    },
    detailHeader: {
      cursor: 'pointer',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#4285F4 ',
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    detailContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    arrowIcons: {
      fill: '#4285F4 ',
      alignItems: 'center',
      cursor: 'pointer',
    },
    detailHeaderText: {
      marginBottom: '0px',
    },
    wrapper: {
      marginTop: '0px',
      padding: '0px',
    },
    hide: {
      display: 'none',
    },
    left: {},
    right: {},
    scheduleContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
    },
    successContainer: {
      display: 'flex',
      marginTop: '16.9px',
      gap: '20px',
    },
    taskData: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      marginLeft: '5px',
    },
    fullWidth: {
      padding: '0px 28px 0px 28px',
      borderTop: '1px solid #A5A5A5',
    },
    leftFullWidth: {
      // borderRight: '1px solid #A5A5A5',
    },
    chipFullWidth: {
      display: 'flex',
      alignItems: 'flex-end',
      marginTop: '16px',
      paddingBottom: '21px',
    },
    taskDetailContainer: {
      display: 'flex',
      border: '1px solid #A5A5A5',
      borderLeft: 'none',
      gap: '350px',
      width: '100%',
      marginTop: '38px',
      position: 'relative',
    },
  };
};

interface ITaskDetailsProps extends WithStyles<typeof styles> {
  test: string;
}
const TaskDetailsView: React.FC<ITaskDetailsProps> = ({ classes }) => {
  const arrowIcon = '/cdap_assets/img/arrow.svg';
  const runTaskIcon = '/cdap_assets/img/run-task-big.svg';
  const scheduleTaskIcon = '/cdap_assets/img/schedule-task-big.svg';
  const successRatePie = '/cdap_assets/img/Success Rate.svg';
  const clock = '/cdap_assets/img/Time.svg';
  const calender = '/cdap_assets/img/Schedule.svg';
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [schedule, setSchedule] = React.useState(false);
  const [graph, setGraph] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const { ingestionTasklList } = useContext(ingestionContext);
  const params = useParams();
  const taskName = (params as any).taskName;
  const [duplicate, setDuplicate] = React.useState(false);
  const [sheduleString, setSheduleString] = React.useState('');
  const [taskOptions, setTaskOptions] = React.useState([
    'Run Task',
    'update Schedule',
    'Task Configuration',
    'Duplicate',
    'Delete',
  ]);
  const [taskDetails, setTaskDetails] = React.useState({
    taskName,
    description: '',
    createdOn: '',
    tags: [],
    runs: [],
    connections: {
      sourceName: '',
      sourceDb: '',
      targetName: '',
      targetDb: '',
    },
    metrics: {},
  });
  React.useEffect(() => {
    MyPipelineApi.scheduleDetails({
      namespace: NamespaceStore.getState().selectedNamespace,
      appId: taskName,
      scheduleId: 'dataPipelineSchedule',
    }).subscribe(
      (message) => {
        console.log('Shedulemessage', message);
        setLoading(false);
        setSheduleString(message.trigger.cronExpression);
        if (message.status == 'SUSPENDED' && message.trigger.cronExpression == '0 * * * *') {
          setTaskOptions((prev) => {
            const options = prev.slice(0);
            options[1] = 'Shedule';
            return options;
          });
        } else if (message.status == 'SUSPENDED') {
          setTaskOptions((prev) => {
            const options = prev.slice(0);
            options[1] = 'Reshedule';
            return options;
          });
        } else {
          setTaskOptions((prev) => {
            const options = prev.slice(0);
            options[1] = 'Suspend';
            return options;
          });
        }
      },
      (err) => {
        console.log(err);
      }
    );

    MyPipelineApi.get({ namespace: currentNamespace, appId: taskName }).subscribe((data) => {
      console.log('get', data);
      const draftObj = JSON.parse(data.configuration);
      setTaskDetails(
        produce((prev) => {
          prev.description = data.description;
          prev.connections.sourceName = draftObj.stages[0].name;
          prev.connections.sourceDb = parseJdbcString(
            draftObj.stages[0].plugin.properties.connectionString,
            draftObj.stages[0].plugin.properties.jdbcPluginName
          );
          prev.connections.targetName = draftObj.stages[1].name;
          prev.connections.targetDb = draftObj.stages[1].plugin.properties.dataset;
        })
      );
      getRuns(draftObj.stages[0].name);
    });
    MyMetadataApi.getMetadata({
      namespace: currentNamespace,
      entityType: 'apps',
      entityId: taskName,
    }).subscribe((metaData) => {
      console.log(metaData);

      // setTaskDetails((prev) => {
      //   return {
      //     ...prev,
      //     tags: tags.tags.filter((tag) => tag.scope === 'USER').map((tag) => tag.name),
      //   };
      // });
      setTaskDetails(
        produce((draft) => {
          draft.tags = metaData.find((item) => item.scope === 'USER').tags;
          draft.createdOn = humanReadableDate(
            metaData.find((item) => item.scope === 'SYSTEM').properties['creation-time'],
            false
          );
        })
      );
    });
  }, []);
  const getMetrics = (runs, connectionName) => {
    const postBody = {};
    runs.forEach((run) => {
      postBody[`qid_${run.runid}`] = {
        tags: {
          namespace: currentNamespace,
          app: taskName,
          workflow: 'DataPipelineWorkflow',
          run: run.runid,
        },
        metrics: [`user.${connectionName}.records.in`, `user.${connectionName}.records.error`],
        timeRange: {
          aggregate: 'true',
        },
      };
    });
    console.log('bbb', postBody);
    MyMetricApi.query(null, postBody).subscribe(
      (data) => {
        console.log('mmm', data);
        setTaskDetails((prev) => {
          return {
            ...prev,
            metrics: data,
          };
        });
      },
      (err) => console.log(err)
    );
  };
  const getRuns = (connectionName?: any) => {
    MyPipelineApi.pollRuns({
      namespace: currentNamespace,
      appId: taskName,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
    }).subscribe((data) => {
      console.log('runs', data);
      setTaskDetails((prev) => {
        return {
          ...prev,
          runs: data.map((run) => {
            return {
              runId: run.runid,
              start: run.starting,
              end: run.end,
              status: run.status,
            };
          }),
        };
      });
      getMetrics(data, connectionName);
    });
  };
  React.useEffect(() => {
    setLoading(false);
  }, [taskDetails.runs]);
  const runTask = (taskName: string) => {
    setLoading(true);
    MyPipelineApi.run({
      namespace: currentNamespace,
      appId: taskName,
    }).subscribe(
      (message) => {
        console.log(message);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const toggleSchedule = () => {
    setSchedule(true);
  };

  const closeSchedule = () => {
    setLoading(true);
    setSchedule(false);
  };
  const handleTaskAtions = (option) => {
    if (option == 'Shedule') {
      setSchedule(true);
    }

    if (option == 'Reshedule') {
      setSchedule(true);
    }
    if (option == 'Suspend') {
      setLoading(true);
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
    }
    if (option === 'Duplicate') {
      setDuplicate(true);
    }
  };

  const setSelectedItem = () => {
    const cron = sheduleString.split(' ');
    if (
      cron[0] === '*/5' &&
      cron[1] === '*' &&
      cron[2] === '*' &&
      cron[3] === '*' &&
      cron[4] === '*'
    ) {
      return { item: 'Every 5 min' };
    }
    if (
      cron[0] === '*/10' &&
      cron[1] === '*' &&
      cron[2] === '*' &&
      cron[3] === '*' &&
      cron[4] === '*'
    ) {
      return { item: 'Every 10 min' };
    }
    if (
      cron[0] === '*/30' &&
      cron[1] === '*' &&
      cron[2] === '*' &&
      cron[3] === '*' &&
      cron[4] === '*'
    ) {
      return { item: 'Every 30 min' };
    }
    if (
      isNumeric(cron[0]) &&
      cron[1].indexOf('/') !== -1 &&
      cron[2] === '*' &&
      cron[3] === '*' &&
      cron[4] === '*'
    ) {
      return {
        item: 'Hourly',
        initialSheduleObj: {
          hours: parseInt(cron[1].split('/')[1], 10),
          minutes: parseInt(cron[0], 10),
        },
      };
    }

    if (
      wholeArrayIsNumeric(cron.slice(0, 2)) &&
      cron[2].indexOf('/') !== -1 &&
      cron[3] === '*' &&
      cron[4] === '*'
    ) {
      const converted12HourFormat = moment().hour(parseInt(cron[1], 10));
      return {
        item: 'Daily',
        initialSheduleObj: {
          days: parseInt(cron[2].split('/')[1], 10),
        },
        seletedTime: moment(
          `${parseInt(converted12HourFormat.format('h'), 10)}:${parseInt(
            cron[0],
            10
          )} ${converted12HourFormat.format('A')}`,
          'hh:mm A'
        ).format('YYYY-MM-DDTHH:mm'),
      };
    }

    if (
      wholeArrayIsNumeric(cron.slice(0, 2)) &&
      cron[2] === '*' &&
      cron[3] === '*' &&
      (cron[4].indexOf(',') !== -1 || isNumeric(cron[4]))
    ) {
      const converted12HourFormat = moment().hour(parseInt(cron[1], 10));
      console.log(
        'weekly',
        cron[4].split(',').map((val) => parseInt(val), 10)
      );

      const weekDays = {
        Sun: false,
        Mon: false,
        Tue: false,
        Wed: false,
        Thu: false,
        Fri: false,
        Sat: false,
      };
      const weekIndexes = cron[4].split(',').map((val) => parseInt(val), 10);
      Object.keys(weekDays).forEach((ele, index) => {
        if (weekIndexes.includes(index + 1)) {
          weekDays[ele] = true;
        }
      });

      return {
        item: 'Weekly',
        initialSheduleObj: { weekDays },
        seletedTime: moment(
          `${parseInt(converted12HourFormat.format('h'), 10)}:${parseInt(
            cron[0],
            10
          )} ${converted12HourFormat.format('A')}`,
          'hh:mm A'
        ).format('YYYY-MM-DDTHH:mm'),
      };
    }
    if (wholeArrayIsNumeric(cron.slice(0, 3)) && cron[3] === '*' && cron[4] === '*') {
      const converted12HourFormat = moment().hour(parseInt(cron[1], 10));
      return {
        item: 'Monthly',
        initialSheduleObj: {
          days: parseInt(cron[2], 10),
        },
        seletedTime: moment(
          `${parseInt(converted12HourFormat.format('h'), 10)}:${parseInt(
            cron[0],
            10
          )} ${converted12HourFormat.format('A')}`,
          'hh:mm A'
        ).format('YYYY-MM-DDTHH:mm'),
      };
    }
  };
  const getSuccessRate = () => {
    const successRuns = taskDetails.runs.filter((run) => run.status === 'COMPLETED').length;
    const totalRuns = taskDetails.runs.length;
    return ((successRuns / totalRuns) * 100).toFixed(2);
  };

  const sourceIcon = '/cdap_assets/img/source-connection.svg';
  const targetIcon = '/cdap_assets/img/target-connection.svg';
  const calenderIcon = '/cdap_assets/img/schedule-task-big.svg';

  return (
    <div className={classes.root}>
      <If condition={schedule}>
        <SheduleTask
          closeSchedule={closeSchedule}
          sheduleString={sheduleString}
          taskName={taskName}
          selectItem={setSelectedItem()}
        />
      </If>
      {duplicate && (
        <DuplicateTask
          duplicateTaskName={taskName}
          closePopup={(isDuplicated) => {
            setDuplicate(false);
          }}
        />
      )}
      <If condition={loading}>
        <LoadingSVGCentered />
      </If>
      <IngestionHeader
        title="Ingest Tasks"
        taskActionsBtn
        taskOptions={taskOptions}
        runBtn={taskDetails.runs.length !== 0}
        onRun={() => runTask(taskName)}
        onTaskActions={(e) => handleTaskAtions(e)}
        navToHome={() => history.push(`/ns/${currentNamespace}/ingestion`)}
      />
      <div className={taskDetails.runs.length === 0 ? classes.fullWidth : classes.container}>
        <div className={classes.taskDetailContainer}>
          <div className={taskDetails.runs.length === 0 ? classes.leftFullWidth : classes.left}>
            <div className={classes.flexContainer}>
              <div className={classes.taskName}>{taskName}</div>
              <div className={classes.taskDate}>Deployed on 04 May 21, 07:30 pm</div>
            </div>
            <div>
              <div className={classes.description}>{taskDetails.description}</div>
              <div className={classes.connectionContainer}>
                <img
                  src={sourceIcon}
                  alt="Icon"
                  style={{
                    backgroundColor: '#FACE75',
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    padding: '5px',
                  }}
                />
                <div className={classes.taskData}>
                  {taskDetails.connections.sourceName}
                  {' | '}
                  {taskDetails.connections.sourceDb}
                </div>
                <img className={classes.arrow} src={arrowIcon} alt="arrow" />
                <img
                  src={targetIcon}
                  alt="Icon"
                  style={{
                    backgroundColor: '#FACE75',
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    padding: '5px',
                  }}
                />
                <div className={classes.taskData}>
                  {taskDetails.connections.targetName}
                  {' | '}
                  {taskDetails.connections.targetDb}
                </div>
              </div>
              <div
                className={
                  taskDetails.runs.length === 0 ? classes.chipContainer : classes.chipFullWidth
                }
              >
                {taskDetails.tags.map((tag) => {
                  return (
                    <div className={classes.chip} key={tag}>
                      {tag}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className={classes.right}>
            {taskDetails.runs.length > 1 && (
              <div className={classes.runDetails}>
                <img src={calenderIcon} alt="success-rate-pie" height="35.1px" width="40px" />
                <div className={classes.successContainer}>
                  <div className={classes.successPercentage}>Sucess Rate</div>
                  <div className={classes.successPercentage}>{getSuccessRate()}%</div>
                </div>
                <div className={classes.scheduleContainer}>
                  <div className={classes.runDetailsTop}>Schedule Run</div>
                  <div className={classes.runDetailsBottom}>Every Month</div>
                </div>
                <div className={classes.runDetailsItem}>
                  <div className={classes.runDetailsTop}>Next Run</div>
                  <div className={classes.runDetailsBottom}>12 Jun 21, 09:30 pm</div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <div className={taskDetails.runs.length === 0 ? classes.leftFullWidth : classes.left}>
          <div className={classes.flexContainer}>
            <div className={classes.taskName}>{taskName}</div>
            <div className={classes.taskDate}>Deployed on 04 May 21, 07:30 pm</div>
          </div>
          <div>
            <div className={classes.description}>{taskDetails.description}</div>
            <div className={classes.connectionContainer}>
              <img
                src={sourceIcon}
                alt="Icon"
                style={{
                  backgroundColor: 'orange',
                  fill: 'red',
                  height: '40px',
                  width: '40px',
                  borderRadius: '50%',
                  padding: '5px',
                }}
              />
              <div className={classes.taskData}>
                {taskDetails.connections.sourceName}
                {' | '}
                {taskDetails.connections.sourceDb}
              </div>
              <img className={classes.arrow} src={arrowIcon} alt="arrow" />
              <img
                src={targetIcon}
                alt="Icon"
                style={{
                  backgroundColor: 'orange',
                  fill: 'red',
                  height: '40px',
                  width: '40px',
                  borderRadius: '50%',
                  padding: '5px',
                }}
              />
              <div className={classes.taskData}>
                {taskDetails.connections.targetName}
                {' | '}
                {taskDetails.connections.targetDb}
              </div>
            </div>
            <div
              className={
                taskDetails.runs.length === 0 ? classes.chipContainer : classes.chipFullWidth
              }
            >
              {taskDetails.tags.map((tag) => {
                return (
                  <div className={classes.chip} key={tag}>
                    {tag}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className={classes.right}>
          {taskDetails.runs.length > 1 && (
            <div className={classes.runDetails}>
              <img src={calenderIcon} alt="success-rate-pie" height="35.1px" width="40px" />
              <div className={classes.successContainer}>
                <div className={classes.successPercentage}>Sucess Rate</div>
                <div className={classes.successPercentage}>{getSuccessRate()}%</div>
              </div>
              <div className={classes.scheduleContainer}>
                <div className={classes.runDetailsTop}>Schedule Run</div>
                <div className={classes.runDetailsBottom}>Every Month</div>
              </div>
              <div className={classes.runDetailsItem}>
                <div className={classes.runDetailsTop}>Next Run</div>
                <div className={classes.runDetailsBottom}>12 Jun 21, 09:30 pm</div>
              </div>
            </div>
          )}
        </div> */}
      </div>
      {taskDetails.runs.length === 0 ? (
        <div className={classes.wrapper}>
          <Typography className={classes.title}>How Would You Like to Proceed?</Typography>
          <div className={classes.cardsContainer}>
            <div className={classes.card} onClick={() => runTask(taskName)}>
              <div className={classes.cardDescription}>
                I would like to extract all columns from all tables without any custom selection.
              </div>
              <div className={classes.cardTitle}>Run Task</div>
              <img className={classes.cardRunIcon} src={runTaskIcon} alt="run-task" />
            </div>
            <div className={classes.card} onClick={toggleSchedule}>
              <div className={classes.cardDescription}>
                I would like to extract the tables and columns I am interested in.
              </div>
              <div className={classes.cardTitle}>Schedule Task</div>
              <img className={classes.cardScheduleIcon} src={scheduleTaskIcon} alt="run-task" />
            </div>
          </div>
        </div>
      ) : (
        <div className={classes.runHistoryContainer}>
          <IngestionHeader title="Run History" graphicalView={true} setGraph={setGraph} />
          <IngestionJobsList
            onTaskClick={(jobId) => {
              taskDetails.runs.length !== 0 &&
                history.push(`/ns/${currentNamespace}/ingestion/task/${taskName}/job/${jobId}`);
            }}
            graph={graph}
            taskDetails={taskDetails}
            setLoading={() => setLoading(true)}
          />
        </div>
      )}
    </div>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
