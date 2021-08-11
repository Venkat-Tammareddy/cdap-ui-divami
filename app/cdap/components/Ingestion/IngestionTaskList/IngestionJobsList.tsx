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
import { humanReadableDate, humanReadableDuration } from 'services/helpers';
import Graphs from '../Graph/Graph';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { Tooltip } from '@material-ui/core';
import { MyPipelineApi } from 'api/pipeline';
import NamespaceStore from 'services/NamespaceStore';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 66px)', // margin
      margin: '0px 28px',
    },
    header: {
      paddingBottom: '0px',
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
    iconButton: {
      ' & button:focus': {
        outline: 'none',
      },
    },
    statusIcon: {
      marginRight: '17px',
    },
    marginLeft: {
      marginLeft: '10px',
    },
    toggleView: {
      display: 'flex',
      flexDirection: 'row-reverse',
    },
    listIcon: {
      border: '1px solid blue',
      borderRadiusTopLeft: '10px',
      borderTopLeftRadius: '23px',
      borderBottomLeftRadius: '23px',
      borderRadiusBottomLeft: '23px',
      height: '18px',
      width: '18px',
    },
    graphIcn: {
      cursor: 'pointer',
    },
    failedTooltipIcon: {
      fill: '#4285F4',
      height: '20px',
      width: '20px',
    },
    failedTooltipInfo: {},
  };
};
const TextOnlyTooltip = withStyles({
  tooltip: {
    borderRadius: '15.5px',
    color: '#DB4437',
    backgroundColor: 'FDF5F5',
    fontSize: '14px',
    height: '32px',
  },
})(Tooltip);
interface IngestJobsListProps extends WithStyles<typeof styles> {
  graph?: boolean;
  onTaskClick: (jobId: string) => void;
  taskDetails: any;
  setLoading: () => void;
}

const IngestionJobsList: React.FC<IngestJobsListProps> = ({
  classes,
  onTaskClick,
  graph,
  taskDetails,
  setLoading,
}) => {
  const progressIcon = '/cdap_assets/img/Inprogress.svg';
  const failedIcon = '/cdap_assets/img/error-status.svg';
  const imgStop = '/cdap_assets/img/stop.svg';
  const successIcon = '/cdap_assets/img/success-status.svg';
  const namespace = NamespaceStore.getState().selectedNamespace;
  const stopRun = (runId: string) => {
    setLoading();
    MyPipelineApi.stopRun({
      namespace,
      appId: taskDetails?.taskName,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
      runid: runId,
    }).subscribe((msg) => {
      console.log('run stopped successfully');
    });
  };

  return (
    <>
      <div className={classes.root}>
        {graph ? (
          <Graphs />
        ) : (
          <Table columnTemplate="1fr 1fr 1fr 1fr 1fr 1fr 2fr 1fr">
            <TableHeader data-cy="table-header">
              <TableRow className={classes.header} data-cy="table-row">
                <TableCell>Status</TableCell>
                <TableCell>Job ID</TableCell>
                <TableCell>Executed on</TableCell>
                <TableCell>Duration</TableCell>
                <TableCell>Records Loaded</TableCell>
                <TableCell>Error Records</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody data-cy="table-body">
              {taskDetails.runs.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={classes.tableRow}
                    data-cy={`table-row-${item.runid}`}
                    onClick={() => onTaskClick(item.runId)}
                  >
                    <TableCell>
                      <img
                        className={classes.statusIcon}
                        src={
                          (item.status === 'COMPLETED' && successIcon) ||
                          (item.status === 'FAILED' && failedIcon) ||
                          (item.status === 'KILLED' && failedIcon) ||
                          progressIcon
                        }
                        alt="img"
                        height="30px"
                        width="30px"
                      />
                      {item.status}
                    </TableCell>
                    <TableCell style={{ color: '#202124' }}>{item.runId}</TableCell>
                    <TableCell>{humanReadableDate(item.start, false)}</TableCell>
                    <TableCell>
                      {item.status !== 'RUNNING' &&
                        humanReadableDuration(item.end - item.start, false)}
                    </TableCell>
                    <TableCell>
                      {taskDetails.metrics[`qid_${item.runId}`]?.series?.find(
                        (item) =>
                          item.metricName ===
                          `user.${taskDetails.connections.sourceName}.records.in`
                      )?.data[0].value
                        ? taskDetails.metrics[`qid_${item.runId}`]?.series?.find(
                            (item) =>
                              item.metricName ===
                              `user.${taskDetails.connections.sourceName}.records.in`
                          )?.data[0].value
                        : '0'}
                    </TableCell>
                    <TableCell>
                      {taskDetails.metrics[`qid_${item.runId}`]?.series?.find(
                        (item) =>
                          item.metricName ===
                          `user.${taskDetails.connections.sourceName}.records.error`
                      )?.data[0].value
                        ? taskDetails.metrics[`qid_${item.runId}`]?.series?.find(
                            (item) =>
                              item.metricName ===
                              `user.${taskDetails.connections.sourceName}.records.error`
                          )?.data[0].value
                        : '0'}
                    </TableCell>
                    <TableCell>
                      {item.status === 'RUNNING' && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            stopRun(item.runId);
                            console.log('stop');
                          }}
                        >
                          <img src={imgStop} alt="img" height="20px" width="20px" />
                          <span className={classes.marginLeft}>Stop</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.status === 'FAILED' ? (
                        <TextOnlyTooltip
                          placement="left"
                          title="Check execution logs for more details"
                          className={classes.failedTooltipInfo}
                        >
                          <InfoOutlinedIcon className={classes.failedTooltipIcon} />
                        </TextOnlyTooltip>
                      ) : (
                        ''
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </>
  );
};

export default withStyles(styles)(IngestionJobsList);
// const IngestionHome = withStyles(styles)(IngestionTaskList);
