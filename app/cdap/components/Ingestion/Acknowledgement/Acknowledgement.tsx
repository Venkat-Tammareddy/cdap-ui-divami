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
import { Card, CardContent } from '@material-ui/core';

const styles = (): StyleRules => {
  return {
    root: {
      display: 'flex',
      margin: '40px',
      flexDirection: 'column',
      '& .MuiCardContent-root': {
        padding: '0',
      },
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'Lato',
      fontSize: '18px',
    },
    ackOptions: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '86px',
    },
    optionsMessage: {
      display: 'flex',
      marginBottom: '0',
    },
    options: {
      display: 'flex',
      gap: '40px',
      justifyContent: 'center',
      marginTop: '40px',
    },
    optionCard: {
      display: 'flex',
      height: '116px',
      width: '236px',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      border: '1px solid #aaaaac',
      borderRadius: '4px',
    },
    optionIcon: {
      marginTop: '20px',
    },
    optionText: {
      marginTop: '12px',
    },
    ackMessage: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    ackMsg: {
      margin: '0',
      marginTop: '29px',
      color: '#0F9D58 ',
    },
    ackText: {
      margin: '0',
      marginTop: '8px',
    },
    test: {
      display: 'flex',
      flexDirection: 'row',
      gap: '20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    line: {
      width: '120px',
      borderTop: '1px solid #979797',
      height: '1px',
    },
  };
};

interface AcknowledgementProps extends WithStyles<typeof styles> {
  gotoTasks: () => void;
  // gotoSchedule: () => void;
}

const toggleCursor = (e: any) => {
  e.target.style.cursor = 'pointer';
};

const ackIcon = '/cdap_assets/img/success-message-tick.svg';
const runTaskIcon = '/cdap_assets/img/run.svg';
const scheduleTaskIcon = '/cdap_assets/img/schedule-task.svg';
const taskListIcon = '/cdap_assets/img/task-list.svg';
const configIcon = '/cdap_assets/img/view-task.svg';
const AcknowledgementView: React.FC<AcknowledgementProps> = ({
  classes,
  gotoTasks,
  // gotoSchedule,
}) => {
  return (
    <div className={classes.root}>
      <div className={classes.ackMessage}>
        <img src={ackIcon} alt="ack icon" height="92px" width="130px" />
        <p className={classes.ackMsg}>Successfully Deployed Task</p>
        <p className={classes.ackText}>Ingest oracle studies data to big query</p>
      </div>
      <div className={classes.ackOptions}>
        <div className={classes.test}>
          <div className={classes.line}> </div>
          <p className={classes.optionsMessage}>How would you like to proceed from here?</p>
          <div className={classes.line}> </div>
        </div>
        <div className={classes.options}>
          <Card className={classes.optionCard} onMouseOver={toggleCursor}>
            <CardContent>
              <img
                src={runTaskIcon}
                alt="run icon text"
                height="38px"
                width="38px"
                className={classes.optionIcon}
              />
            </CardContent>
            <CardContent>
              <p className={classes.optionText}>Run Task</p>
            </CardContent>
          </Card>
          <Card className={classes.optionCard} onMouseOver={toggleCursor}>
            <CardContent>
              <img
                src={scheduleTaskIcon}
                alt="run icon text"
                height="38px"
                width="38px"
                className={classes.optionIcon}
              />
            </CardContent>
            <CardContent>
              <p className={classes.optionText}>Schedule Task</p>
            </CardContent>
          </Card>
          <Card className={classes.optionCard} onMouseOver={toggleCursor} onClick={gotoTasks}>
            <CardContent>
              <img
                src={taskListIcon}
                alt="run icon text"
                height="38px"
                width="38px"
                className={classes.optionIcon}
              />
            </CardContent>
            <CardContent>
              <p className={classes.optionText}>Go to Task List</p>
            </CardContent>
          </Card>
          <Card className={classes.optionCard} onMouseOver={toggleCursor}>
            <CardContent>
              <img
                src={configIcon}
                alt="run icon text"
                height="38px"
                width="38px"
                className={classes.optionIcon}
              />
            </CardContent>
            <CardContent>
              <p className={classes.optionText}>View Task Configurations</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Acknowledgement = withStyles(styles)(AcknowledgementView);
export default Acknowledgement;
