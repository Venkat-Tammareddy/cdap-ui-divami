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
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import { MyMetricApi } from 'api/metric';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    container: {
      padding: '16px 28px',
      borderTop: '1px solid #A5A5A5',
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'flex-end',
    },
    taskName: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      marginRight: '10px',
    },
    taskDate: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
    },
    description: {
      fontFamily: 'Lato',
      fontSize: '14px',
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
      borderBottom: '1px solid #A5A5A5',
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
      display: 'inline-flex',
      marginTop: '28px',
      marginBottom: '20px',
      paddingBottom: '20px',
      borderBottom: '1px solid #A5A5A5',
    },
    runDetailsItem: {
      marginLeft: '12px',
      marginRight: '60px',
    },
    successPercentage: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#19A347',
    },
    runDetailsTop: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
    },
    runDetailsBottom: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      opacity: '0.8',
      marginTop: '2px',
    },
  };
};

interface ITaskDetailsProps extends WithStyles<typeof styles> {
  test: string;
}
const connection = {
  name: 'Ingest oracle studies data to bigquery',
  date: '04 May 21, 07:30 pm',
  description:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam scelerisque neque odio. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  source: {
    connName: 'Oracle-global-server Connection',
    connDb: 'Studies',
  },
  target: {
    connName: 'BigQuery-global-server',
    connDb: 'StudyPerformance',
  },
  tags: ['Colleges', 'Exams', 'Tests'],
};
const TaskDetailsView: React.FC<ITaskDetailsProps> = ({ classes }) => {
  const arrowIcon = '/cdap_assets/img/arrow.svg';
  const runTaskIcon = '/cdap_assets/img/run-task-big.svg';
  const scheduleTaskIcon = '/cdap_assets/img/schedule-task-big.svg';
  const successRatePie = '/cdap_assets/img/success-rate-pie.svg';
  const clock = '/cdap_assets/img/clock-black.svg';
  const calender = '/cdap_assets/img/calendar-black.svg';
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [schedule, setSchedule] = React.useState(false);
  const [graph, setGraph] = React.useState(false);
  const [runLoading, setRunLoading] = React.useState(false);
  const params = useParams();
  const taskName = (params as any).taskName;
  const [taskDetails, setTaskDetails] = React.useState({
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
    MyPipelineApi.fetchMacros({ appId: taskName, namespace: currentNamespace }).subscribe(
      (res) => {
        console.log('res', res);
        setTaskDetails((prevData) => {
          return {
            ...prevData,
            connections: {
              sourceName: res[1].id,
              sourceDb: res[1].spec.properties.properties.connectionString?.split('/')[3],
              targetName: res[2].id,
              targetDb: res[2].spec.properties.properties.dataset,
            },
          };
        });
      },
      (err) => {
        console.log(err);
      }
    );
    MyMetadataApi.getTags({
      namespace: currentNamespace,
      entityType: 'apps',
      entityId: taskName,
    }).subscribe((tags) => {
      console.log(tags);
      setTaskDetails((prev) => {
        return {
          ...prev,
          tags: tags.tags.filter((tag) => tag.scope === 'USER').map((tag) => tag.name),
        };
      });
    });
    getRuns();
  }, []);
  const getMetrics = (runs) => {
    const postBody = {};
    runs.forEach((run) => {
      postBody[`qid_${run.runid}`] = {
        tags: {
          namespace: currentNamespace,
          app: taskName,
          workflow: 'DataPipelineWorkflow',
          run: run.runid,
        },
        metrics: [
          'user.Multiple Database Tables.records.in',
          'user.Multiple Database Tables.records.error',
          'user.Multiple Database Tables.process.time.total',
          'user.Multiple Database Tables.process.time.avg',
          'user.Multiple Database Tables.process.time.max',
          'user.Multiple Database Tables.process.time.min',
          'user.Multiple Database Tables.process.time.stddev',
          'user.Multiple Database Tables.records.out',
        ],
        timeRange: {
          aggregate: 'true',
        },
      };
    });
    MyMetricApi.query(null, postBody).subscribe(
      (data) => {
        console.log(data);
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
  const getRuns = () => {
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
      getMetrics(data);
      setRunLoading(false);
    });
  };
  const runTask = (taskName: string) => {
    setRunLoading(true);
    MyPipelineApi.run({
      namespace: currentNamespace,
      appId: taskName,
    }).subscribe(
      (message) => {
        console.log(message);
        getRuns();
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
    setSchedule(false);
  };
  const getSuccessRate = () => {
    const successRuns = taskDetails.runs.filter((run) => run.status === 'COMPLETED').length;
    const totalRuns = taskDetails.runs.length;
    return (successRuns / totalRuns) * 100;
  };
  return (
    <div className={classes.root}>
      <If condition={schedule}>
        <SheduleTask closeSchedule={closeSchedule} />
      </If>
      {runLoading && <LoadingSVGCentered />}
      <IngestionHeader
        title="Ingest Tasks"
        taskActionsBtn
        runBtn={taskDetails.runs.length !== 0}
        onRun={() => runTask(taskName)}
        onTaskActions={() => console.log('task actions')}
        navToHome={() => history.push(`/ns/${currentNamespace}/ingestion`)}
      />
      <div className={classes.container}>
        <div className={classes.flexContainer}>
          <div className={classes.taskName}>{taskName}</div>
          <div className={classes.taskDate}>- Deployed on {connection.date}</div>
        </div>
        {taskDetails.runs.length > 1 && (
          <div className={classes.runDetails}>
            <img src={successRatePie} alt="success-rate-pie" />
            <div className={classes.runDetailsItem}>
              <div className={classes.successPercentage}>{getSuccessRate()}%</div>
              <div className={classes.runDetailsBottom}>Success Rate</div>
            </div>
            <img src={calender} alt="success-rate-pie" />
            <div className={classes.runDetailsItem}>
              <div className={classes.runDetailsTop}>Every month</div>
              <div className={classes.runDetailsBottom}>Schedule Run</div>
            </div>
            <img src={clock} alt="success-rate-pie" />
            <div className={classes.runDetailsItem}>
              <div className={classes.runDetailsTop}>12 Jun 21, 09:30 pm</div>
              <div className={classes.runDetailsBottom}>Next Schedule Run</div>
            </div>
          </div>
        )}
        <div className={classes.description}>{connection.description}</div>
        <div className={classes.connectionContainer}>
          <div className={classes.taskDate}>
            {taskDetails.connections.sourceName}
            {' | '}
            {taskDetails.connections.sourceDb}
          </div>
          <img className={classes.arrow} src={arrowIcon} alt="arrow" />
          <div className={classes.taskDate}>
            {taskDetails.connections.targetName}
            {' | '}
            {taskDetails.connections.targetDb}
          </div>
        </div>
        <div className={classes.chipContainer}>
          {taskDetails.tags.map((tag) => {
            return (
              <div className={classes.chip} key={tag}>
                {tag}
              </div>
            );
          })}
        </div>
      </div>
      {taskDetails.runs.length === 0 ? (
        <>
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
                I would like to extract all columns from all tables without any custom selection.
              </div>
              <div className={classes.cardTitle}>Schedule Task</div>
              <img className={classes.cardScheduleIcon} src={scheduleTaskIcon} alt="run-task" />
            </div>
          </div>
        </>
      ) : (
        <div className={classes.runHistoryContainer}>
          <IngestionHeader title="Run History" graphicalView={true} setGraph={setGraph} />
          <IngestionJobsList
            onTaskClick={(jobId) => {
              taskDetails.runs.length !== 0 &&
                history.push(`/ns/${currentNamespace}/ingestion/task/${taskName}/job/${jobId}`);
            }}
            graph={graph}
            jobsList={taskDetails.runs}
            metrics={taskDetails.metrics}
          />
        </div>
      )}
    </div>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
