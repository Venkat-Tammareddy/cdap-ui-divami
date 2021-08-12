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
import { any } from 'prop-types';
import { humanReadableDate } from 'services/helpers';
import { MyMetricApi } from 'api/metric';
import produce from 'immer';
import { parseJdbcString } from '../helpers';
import LoadingSVGCentered from 'components/LoadingSVGCentered';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    container: {
      padding: '16px 28px 0px 28px',
      borderTop: '1px solid #A5A5A5',
    },
    flexContainer: {
      display: 'flex',
      alignItems: 'center',
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
      width: '100%',
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
      // border: '1px solid red',
      marginTop: '0px',
      padding: '0px',
    },
    hide: {
      display: 'none',
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

  const [taskDetails, setTaskDetails] = React.useState({
    taskName,
    description: '',
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
    setSchedule(false);
  };
  const getSuccessRate = () => {
    const successRuns = taskDetails.runs.filter((run) => run.status === 'COMPLETED').length;
    const totalRuns = taskDetails.runs.length;
    return ((successRuns / totalRuns) * 100).toFixed(2);
  };
  return (
    <div className={classes.root}>
      <If condition={schedule}>
        <SheduleTask closeSchedule={closeSchedule} />
      </If>
      <If condition={loading}>
        <LoadingSVGCentered />
      </If>
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
          <div className={classes.taskDate}>- Deployed on 04 May 21, 07:30 pm</div>
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
        <div>
          {' '}
          <div className={classes.description}>{taskDetails.description}</div>
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
