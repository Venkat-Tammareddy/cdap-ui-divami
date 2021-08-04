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
import ListAltIcon from '@material-ui/icons/ListAlt';
import If from 'components/If';
import Graphs from '../Graph/Graph';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 66px)', // margin
      margin: '0px 28px',
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
  };
};

interface IngestJobsListProps extends WithStyles<typeof styles> {
  graph?: boolean;
  onTaskClick: (jobId: string) => void;
  jobsList: any[];
}

const IngestionJobsList: React.FC<IngestJobsListProps> = ({
  classes,
  onTaskClick,
  jobsList,
  graph,
}) => {
  const progressIcon = '/cdap_assets/img/Inprogress.svg';
  const imgStop = '/cdap_assets/img/stop.svg';
  const successIcon = '/cdap_assets/img/success-status.svg';
  const failedIcon = '/cdap_assets/img/error-status.svg';
  // const [Graph, setGraph] = React.useState(true);

  const runningList = [
    {
      jobId: 'Job 01',
      status: 'Running',
      executedOn: '20 May 21 IST, 09:30 PM',
      duration: '15',
      loadedRecords: '98989',
      errorRecords: '3131',
    },
  ];
  const successList = [
    {
      jobId: 'Job 02',
      status: 'Success',
      executedOn: '20 May 21 IST, 09:30 PM',
      duration: '25',
      loadedRecords: '98989',
      errorRecords: '3131',
    },
    {
      jobId: 'Job 03',
      status: 'Failed',
      executedOn: '20 May 21 IST, 09:30 PM',
      duration: '30',
      loadedRecords: '--',
      errorRecords: '--',
    },
    {
      jobId: 'Job 04',
      status: 'Success',
      executedOn: '20 May 21 IST, 09:30 PM',
      duration: '15',
      loadedRecords: '98989',
      errorRecords: '3131',
    },
  ];

  const onOptionSelect = (id: number) => {
    // setAnchorEl(null);
    // setTaskList((oldArray) => {
    //   return [...oldArray].map((object) => {
    //     const objectCopy = { ...object };
    //     if (object.runId == id) {
    //       return {
    //         ...object,
    //         moreBtnVisible: !objectCopy.moreBtnVisible,
    //         stopBtn: !objectCopy.stopBtn,
    //       };
    //     } else {
    //       return objectCopy;
    //     }
    //   });
    // });
  };

  const runType = false;
  return (
    <>
      <div className={classes.root}>
        <If condition={graph}>
          <Graphs />
        </If>
        <If condition={!graph}>
          <Table columnTemplate="1fr 1fr 1fr 1fr 1fr 1fr 2fr">
            <TableHeader data-cy="table-header">
              <TableRow className={classes.header} data-cy="table-row">
                <TableCell>Status</TableCell>
                <TableCell>Job ID</TableCell>
                <TableCell>Executed on</TableCell>
                <TableCell>{!runType && 'Executed on'}</TableCell>
                <TableCell>{!runType && 'Records Loaded'}</TableCell>
                <TableCell>{!runType && 'Error Records'}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHeader>
            <TableBody data-cy="table-body">
              {jobsList.map((item, index) => {
                return (
                  <TableRow
                    key={index}
                    className={classes.tableRow}
                    data-cy={`table-row-${item.jobId}`}
                    onClick={() => onTaskClick(item.jobId)}
                  >
                    <TableCell>
                      {runType ? (
                        <img
                          className={classes.statusIcon}
                          src={progressIcon}
                          alt="img"
                          height="30px"
                          width="30px"
                        />
                      ) : (
                        <img
                          className={classes.statusIcon}
                          src={item.status === 'Failed' ? failedIcon : successIcon}
                          alt="img"
                          height="30px"
                          width="30px"
                        />
                      )}

                      {item.status}
                    </TableCell>
                    <TableCell>{item.jobId}</TableCell>
                    <TableCell>{item.executedOn}</TableCell>
                    <TableCell>{!runType && item.duration}</TableCell>
                    <TableCell>{!runType && item.loadedRecords}</TableCell>
                    <TableCell>{!runType && item.errorRecords}</TableCell>
                    <TableCell>
                      {runType && (
                        <>
                          <img src={imgStop} alt="img" height="20px" width="20px" />
                          <span className={classes.marginLeft}>Stop</span>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </If>
      </div>
    </>
  );
};

export default withStyles(styles)(IngestionJobsList);
// const IngestionHome = withStyles(styles)(IngestionTaskList);
