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
import IngestionHeader from '../IngestionHeader/IngestionHeader';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import Table from 'components/Table';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import { useParams } from 'react-router';
import NamespaceStore from 'services/NamespaceStore';
import { MyProgramApi } from 'api/program';
import { humanReadableDate, humanReadableDuration } from 'services/helpers';
import { MyPipelineApi } from 'api/pipeline';
import { MyMetricApi } from 'api/metric';
import produce from 'immer';
import { parseJdbcString } from '../helpers';
import history from 'services/history';
import { ConnectionsApi } from 'api/connections';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    container: {
      padding: '16px 28px',
      borderTop: '1px solid #A5A5A5',
    },
    tabsWrapper: {
      display: 'flex',
      gap: '10px',
    },
    tabItemActive: {
      borderBottom: '4px solid #4285F4',
      padding: '10px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      letterSpacing: '0.13px',
      cursor: 'pointer',
    },
    tabItemInActive: {
      padding: '10px',
      opacity: '0.7',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      letterSpacing: '0.13px',
      cursor: 'pointer',
    },
    jobInfo: {
      display: 'flex',
      // borderBottom: '1px solid #A5A5A5',
      alignItems: 'center',
      margin: '33px 28px 0px 28px',
    },
    jobDetailsTop: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
    },
    jobNames: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      marginLeft: '5px',
    },
    jobDetailsBottom: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      opacity: '0.8',
    },
    jobItem: {
      display: 'flex',
      gap: '10px',
      marginRight: '60px',
    },
    infoIcons: {
      marginRight: '10px',
    },
    arrow: {
      margin: '0px 12px',
    },
    connectionContainer: {
      display: 'flex',
      alignItems: 'center',
      margin: '72px 28px 20px 28px',
      position: 'relative',
      border: '1px solid #A5A5A5',
      borderLeft: 'none',
    },
    tablesWrapper: {
      display: 'flex',
      width: '100%',
      marginTop: '31px',
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
      fontSize: '14px',
      fontFamily: 'Lato',
      letterSpacing: '0',
      lineHeight: '24px',
      padding: '15.5px 0px',
    },
    logsWrapper: {
      margin: '10px 28px',
    },
    statusIcon: {
      marginRight: '17px',
    },
    rowText: {
      fontSize: '14px',
      color: '#202124',
    },
    selectedTableNames: {
      fontSize: '16px',
      fontFamily: 'Lato',
      color: '#202124',
    },
    table: {
      width: '100%',
      display: 'flex',
      flexWrap: 'wrap',
      fontSize: '16px',
      color: '#202124',
      fontFamily: 'Lato',
      margin: '0px 28px 30px 28px',
    },
    recordDetails: {
      display: 'flex',
      flexDirection: 'column',
    },
    connInfo: {
      display: 'flex',
    },
    smallInfo: {
      paddingLeft: '6px',
      marginBottom: '0px',
      fontSize: '16px',
      fontFamily: 'Lato',
      color: '#666666',
    },
    taskData: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      marginLeft: '8px',
      display: 'flex',
      flexDirection: 'column',
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
    containerx: {
      display: 'flex',
      marginTop: '45px',
      width: '100%',
    },
    outer: {
      display: 'flex',
      flexDirection: 'column',
    },
    listItem: {
      '&::marker': {
        color: 'red',
      },
    },
  };
};

interface IJobDetailsProps extends WithStyles<typeof styles> {}
const JobDetailsView: React.FC<IJobDetailsProps> = ({ classes }) => {
  const [displaySummary, setDisplaySummary] = React.useState(true);
  const greenTickIcon = '/cdap_assets/img/side-stepper-tick.svg';
  const progressIcon = '/cdap_assets/img/Inprogress.svg';
  const failedIcon = '/cdap_assets/img/error-status.svg';
  const arrowIcon = '/cdap_assets/img/arrow.svg';
  const timeInfoIcon = '/cdap_assets/img/info-infographic.svg';
  const infoIcon = '/cdap_assets/img/info.svg';
  const errorIcon = '/cdap_assets/img/error-status.svg';
  const warningIcon = '/cdap_assets/img/Warning.svg';
  const sourceIcon = '/cdap_assets/img/source-connection.svg';
  const targetIcon = '/cdap_assets/img/target-connection.svg';
  const calenderIcon = '/cdap_assets/img/schedule-task-big.svg';
  const recordsInserted = '/cdap_assets/img/records-inserted.svg';
  const timeIcon = '/cdap_assets/img/execution-time.svg';
  const successSvg = '/cdap_assets/img/success.svg';
  const params = useParams();
  const taskName = (params as any).taskName;
  const jobId = (params as any).jobId;

  const listt = [
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
    'fasf',
  ];

  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [logs, setLogs] = React.useState([]);
  const [jobDetails, setJobDetails] = React.useState({
    status: '',
    duration: '',
    jobConfig: {
      sourceConnection: '',
      sourceDb: '',
      targetConnection: '',
      targetDb: '',
    },
    records: {
      in: 0,
      out: 0,
      error: 0,
    },
    sourceList: [],
    targetList: [],
  });
  React.useEffect(() => {
    MyPipelineApi.getRunDetails({
      namespace: currentNamespace,
      appId: taskName,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
      runid: jobId,
    }).subscribe((data) => {
      console.log('aaa', data);
      setJobDetails(
        produce((prev) => {
          prev.status = data.status;
          prev.duration = humanReadableDuration(data.end - data.starting, false);
        })
      );
    });
    MyPipelineApi.get({ namespace: currentNamespace, appId: taskName }).subscribe((data) => {
      console.log('get', data);
      const draftObj = JSON.parse(data.configuration);
      setJobDetails(
        produce((prev) => {
          prev.jobConfig.sourceConnection = draftObj.stages[0].name;
          prev.jobConfig.sourceDb = parseJdbcString(
            draftObj.stages[0].plugin.properties.connectionString,
            draftObj.stages[0].plugin.properties.jdbcPluginName
          );
          prev.jobConfig.targetConnection = draftObj.stages[1].name;
          prev.jobConfig.targetDb = draftObj.stages[1].plugin.properties.dataset;
        })
      );
      setJobDetails(
        produce((draft) => {
          draft.targetList = [draftObj.stages[1].plugin.properties.dataset];
        })
      );
      {
        draftObj.stages[0].plugin.properties.whitelist === ''
          ? ConnectionsApi.exploreConnection(
              {
                context: currentNamespace,
                connectionid: draftObj.stages[0].name,
              },
              {
                path: '/public',
                limit: 1000,
              }
            ).subscribe(
              (message) => {
                console.log(message);
                setJobDetails(
                  produce((draft) => {
                    draft.sourceList = message.entities?.map((item) => item.name);
                  })
                );
              },
              (err) => {
                console.log('TablesList-err', err);
              }
            )
          : setJobDetails(
              produce((draft) => {
                draft.sourceList = draftObj.stages[0].plugin.properties.whitelist?.split(',');
              })
            );
      }
      MyMetricApi.query(null, {
        qid: {
          tags: {
            namespace: currentNamespace,
            app: taskName,
            workflow: 'DataPipelineWorkflow',
            run: jobId,
          },
          metrics: [
            `user.${draftObj.stages[0].name}.records.in`,
            `user.${draftObj.stages[0].name}.records.error`,
            // 'user.Multiple Database Tables.process.time.total',
            // 'user.Multiple Database Tables.process.time.avg',
            // 'user.Multiple Database Tables.process.time.max',
            // 'user.Multiple Database Tables.process.time.min',
            // 'user.Multiple Database Tables.process.time.stddev',
            `user.${draftObj.stages[0].name}.records.out`,
          ],
          timeRange: {
            aggregate: 'true',
          },
        },
      }).subscribe((data) =>
        setJobDetails(
          produce((prev) => {
            prev.records.in = data.qid.series?.find(
              (item) => item.metricName === `user.${draftObj.stages[0].name}.records.in`
            )?.data[0].value;
            prev.records.error = data.qid.series?.find(
              (item) => item.metricName === `user.${draftObj.stages[0].name}.records.error`
            )?.data[0].value;
            prev.records.out = data.qid.series?.find(
              (item) => item.metricName === `user.${draftObj.stages[0].name}.records.out`
            )?.data[0].value;
          })
        )
      );
    });
  }, []);

  function mylogs() {
    MyProgramApi.prevLogs({
      namespace: currentNamespace,
      appId: taskName,
      programType: 'workflows',
      programId: 'DataPipelineWorkflow',
      runId: jobId,
      format: 'json',
      filter:
        'loglevel=INFO AND .origin=plugin OR MDC:eventType=lifecycle OR MDC:eventType=userLog',
    }).subscribe(
      (message) => {
        console.log('mylogs', message);
        setLogs(message);
      },
      (err) => {
        console.log(err);
      }
    );
  }

  return (
    <div className={classes.root}>
      <IngestionHeader
        title="Ingest Tasks"
        taskName={taskName}
        jobName={jobId}
        browseBtn
        onBrowse={() => console.log('browse data')}
        navToHome={() => history.push(`/ns/${currentNamespace}/ingestion`)}
      />
      <div className={classes.container}>
        <div className={classes.tabsWrapper}>
          <div
            className={displaySummary ? classes.tabItemActive : classes.tabItemInActive}
            onClick={() => setDisplaySummary(true)}
          >
            SUMMARY
          </div>
          <div
            className={!displaySummary ? classes.tabItemActive : classes.tabItemInActive}
            onClick={() => {
              setDisplaySummary(false);
              mylogs();
            }}
          >
            EXECUTION LOGS
          </div>
        </div>
      </div>
      {displaySummary ? (
        <>
          <div className={classes.jobInfo}>
            <div className={classes.jobItem}>
              <img
                className={classes.infoIcons}
                src={
                  (jobDetails.status === 'COMPLETED' && successSvg) ||
                  (jobDetails.status === 'FAILED' && failedIcon) ||
                  (jobDetails.status === 'KILLED' && failedIcon) ||
                  progressIcon
                }
                alt="job-details"
              />
              <div className={classes.jobDetails}>
                <div className={classes.jobDetailsTop}>Job</div>
                <div className={classes.jobDetailsBottom}>{jobId}</div>
              </div>
            </div>
            <div className={classes.jobItem}>
              <img src={recordsInserted} alt="records inserted" />
              <div className={classes.recordDetails}>
                <div className={classes.jobDetailsTop}>
                  {jobDetails.records.in ? jobDetails.records.in : 0}
                </div>
                <div className={classes.jobDetailsBottom}>Records Inserted</div>
              </div>
            </div>
            <div className={classes.jobItem}>
              <img src={recordsInserted} alt="records inserted" />
              <div className={classes.jobDetails}>
                <div className={classes.jobDetailsTop}>
                  {jobDetails.records.error ? jobDetails.records.error : 0}
                </div>
                <div className={classes.jobDetailsBottom}>Records with Errors </div>
              </div>
            </div>
            <div className={classes.jobItem}>
              <img src={timeIcon} alt="time icon" />
              <div className={classes.recordDetails}>
                <div className={classes.jobDetailsTop}>{jobDetails.duration}</div>
                <div className={classes.jobDetailsBottom}>Execution time</div>
              </div>
            </div>
          </div>
          {/* <IngestionHeader title="Job Configuration" /> */}
          <div className={classes.connectionContainer}>
            <p className={classes.taskName}>Job Configuration</p>

            <div className={classes.outer}>
              {' '}
              <div className={classes.containerx}>
                <img
                  src={sourceIcon}
                  alt="Icon"
                  style={{
                    backgroundColor: '#FACE75',
                    height: '40px',
                    width: '40px',
                    borderRadius: '50%',
                    padding: '5px',
                    fill: 'white',
                  }}
                />
                <div className={classes.taskData}>
                  <div className={classes.connInfo}>
                    {jobDetails.jobConfig.sourceConnection}
                    <p className={classes.smallInfo}>(Connection)</p>
                  </div>
                  <div className={classes.connInfo}>
                    {jobDetails.jobConfig.sourceDb}
                    <p className={classes.smallInfo}>(Database)</p>
                  </div>
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
                  <div className={classes.connInfo}>
                    {jobDetails.jobConfig.targetConnection}
                    <p className={classes.smallInfo}>(Connection)</p>
                  </div>
                  <div className={classes.connInfo}>
                    {jobDetails.jobConfig.targetDb}
                    <p className={classes.smallInfo}>(Database)</p>
                  </div>
                </div>
                {/* <img
              src={sourceIcon}
              alt="Icon"
              style={{
                backgroundColor: '#FACE75',
                height: '40px',
                width: '40px',
                borderRadius: '50%',
                padding: '5px',
                fill: 'white',
              }}
            />
            <div className={classes.taskData}>
              <div className={classes.connInfo}>
                {jobDetails.jobConfig.sourceConnection}
                <p className={classes.smallInfo}>(Connection)</p>
              </div>
              <div className={classes.connInfo}>
                {jobDetails.jobConfig.sourceDb}
                <p className={classes.smallInfo}>(Database)</p>
              </div>
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
              <div className={classes.connInfo}>
                {jobDetails.jobConfig.sourceConnection}
                <p className={classes.smallInfo}>(Connection)</p>
              </div>
              <div className={classes.connInfo}>
                {jobDetails.jobConfig.sourceDb}
                <p className={classes.smallInfo}>(Database)</p>
              </div> */}
              </div>
              <div className={classes.tablesWrapper}>
                <div>
                  <IngestionHeader title="Selected tables" />
                  <div className={classes.table}>
                    {listt.map((item) => {
                      return (
                        <>
                          <div
                            style={{
                              marginRight: '30px',
                              listStyle: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                            }}
                            key={item}
                          >
                            <div
                              style={{
                                height: '6px',
                                width: '6px',
                                backgroundColor: '#D8D8D8',
                                borderRadius: '50%',
                              }}
                            />
                            <span className={classes.selectedTableNames}>{item}</span>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <hr className={classes.hrLine} />
          </div>
        </>
      ) : (
        <div className={classes.logsWrapper}>
          <Table columnTemplate="1fr 1fr 5fr">
            <TableHeader data-cy="table-header">
              <TableRow className={classes.header} data-cy="table-row">
                <TableCell>Log Type</TableCell>
                <TableCell>Timestamp</TableCell>
                <TableCell>Message</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody data-cy="table-body">
              {logs.map((item, index) => {
                return (
                  <TableRow key={index} className={classes.tableRow} data-cy={`table-row-${index}`}>
                    <TableCell>
                      <img
                        className={classes.statusIcon}
                        src={
                          (item.log.logLevel === 'INFO' && infoIcon) ||
                          (item.log.logLevel === 'ERROR' && errorIcon) ||
                          (item.log.logLevel === 'WARN' && warningIcon)
                        }
                        alt="img"
                        height="30px"
                        width="30px"
                      />
                      {item.log.logLevel}
                    </TableCell>
                    <TableCell className={classes.rowText}>
                      {humanReadableDate(item.log.timestamp, true)}
                    </TableCell>
                    <TableCell className={classes.rowText}>{item.log.message}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

const JobDetails = withStyles(styles)(JobDetailsView);
export default JobDetails;
