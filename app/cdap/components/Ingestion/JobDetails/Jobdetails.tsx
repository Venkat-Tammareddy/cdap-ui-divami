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
import { humanReadableDate } from 'services/helpers';
import { MyPipelineApi } from 'api/pipeline';

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
      paddingBottom: '25px',
      borderBottom: '1px solid #A5A5A5',
      alignItems: 'center',
      margin: '33px 28px 20px 28px',
    },
    jobDetailsTop: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
    },
    jobDetailsBottom: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      opacity: '0.8',
    },
    jobItem: {
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
      margin: '0px 28px 20px 28px',
    },
    tablesWrapper: {
      display: 'flex',
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
  };
};

interface IJobDetailsProps extends WithStyles<typeof styles> {}
const JobDetailsView: React.FC<IJobDetailsProps> = ({ classes }) => {
  const [displaySummary, setDisplaySummary] = React.useState(true);
  const greenTickIcon = '/cdap_assets/img/side-stepper-tick.svg';
  const arrowIcon = '/cdap_assets/img/arrow.svg';
  const timeInfoIcon = '/cdap_assets/img/info-infographic.svg';
  const infoIcon = '/cdap_assets/img/info.svg';
  const errorIcon = '/cdap_assets/img/error.svg';
  const warningIcon = '/cdap_assets/img/Warning.svg';
  const params = useParams();
  const taskName = (params as any).taskName;
  const jobId = (params as any).jobId;

  const tables = [
    'Table_one',
    'Table_two',
    'Table_three',
    'Table_four',
    'Table_five',
    'Table_six',
    'Table_seven',
    'Table_eight',
    'Table_nine',
    'Table_ten',
  ];

  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [logs, setLogs] = React.useState([]);
  const [jobDetails, setJobDetails] = React.useState({
    jobConfig: {
      sourceConnection: '',
      sourceDb: '',
      targetConnection: '',
      targetDb: '',
    },
  });
  React.useEffect(() => {
    MyPipelineApi.fetchMacros({ appId: taskName, namespace: currentNamespace }).subscribe(
      (res) => {
        console.log('res', res);
        setJobDetails((prevData) => {
          return {
            ...prevData,
            jobConfig: {
              ...prevData.jobConfig,
              sourceConnection: res[1].id,
              sourceDb: res[1].spec.properties.properties.connectionString?.split('/')[3],
              targetConnection: res[2].id,
              targetDb: res[2].spec.properties.properties.dataset,
            },
          };
        });
      },
      (err) => {
        console.log(err);
      }
    );
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
            <img
              className={classes.infoIcons}
              src={greenTickIcon}
              alt="job-details"
              width="33px"
              height="33px"
            />
            <div className={classes.jobItem}>
              <div className={classes.jobDetailsTop}>Job 3</div>
              <div className={classes.jobDetailsBottom}>by Sanjith at 9 May’21, 9:30 pm </div>
            </div>
            <div className={classes.jobItem}>
              <div className={classes.jobDetailsTop} style={{ color: '#19A347' }}>
                5675
              </div>
              <div className={classes.jobDetailsBottom}>Records Inserted</div>
            </div>
            <div className={classes.jobItem}>
              <div className={classes.jobDetailsTop} style={{ color: '#DB4437' }}>
                305
              </div>
              <div className={classes.jobDetailsBottom}>Records with Errors </div>
            </div>
            <img
              className={classes.infoIcons}
              src={timeInfoIcon}
              alt="job-details"
              width="33px"
              height="33px"
            />
            <div className={classes.jobItem}>
              <div className={classes.jobDetailsTop}>15 min</div>
              <div className={classes.jobDetailsBottom}>Execution time</div>
            </div>
          </div>
          <IngestionHeader title="Job Configuration" />
          <div className={classes.connectionContainer}>
            <div className={classes.jobDetailsTop}>
              {jobDetails.jobConfig.sourceConnection + ' | ' + jobDetails.jobConfig.sourceDb}
            </div>
            <img className={classes.arrow} src={arrowIcon} alt="arrow" />
            <div className={classes.jobDetailsTop}>
              {jobDetails.jobConfig.targetConnection + ' | ' + jobDetails.jobConfig.targetDb}
            </div>
          </div>
          <div className={classes.tablesWrapper}>
            <div>
              <IngestionHeader title="Source Tables" />
              <div className={classes.table}>
                <ul
                  style={{
                    color: '#D8D8D8',
                    columnCount: 2,
                  }}
                >
                  {tables.map((item) => {
                    return (
                      <li style={{ marginRight: '120px' }}>
                        <span className={classes.jobDetailsTop}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div>
              <IngestionHeader title="Target Tables" />
              <div className={classes.table}>
                <ul
                  style={{
                    color: '#D8D8D8',
                    columnCount: 2,
                  }}
                >
                  {tables.map((item) => {
                    return (
                      <li style={{ marginRight: '120px' }}>
                        <span className={classes.jobDetailsTop}>{item}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
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
                    <TableCell>{humanReadableDate(item.log.timestamp, true)}</TableCell>
                    <TableCell>{item.log.message}</TableCell>
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
