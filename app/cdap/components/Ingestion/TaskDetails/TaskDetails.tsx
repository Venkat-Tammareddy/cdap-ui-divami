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
import { EntityTopPanel } from 'components/EntityTopPanel';
import { Card, CardContent, Typography } from '@material-ui/core';
import IngestionHeader from '../IngestionHeader/IngestionHeader';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    container: {
      margin: '16px 28px',
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
    },
    cardsContainer: {
      display: 'flex',
      margin: '20px 0px',
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
      border: '1px solid green',
      paddingTop: '24px',
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

  const [temp, setTemp] = React.useState(true);
  return (
    <div className={classes.root}>
      <EntityTopPanel title="test123" />
      <div className={classes.container}>
        <div className={classes.flexContainer}>
          <div className={classes.taskName}>{connection.name}</div>
          <div className={classes.taskDate}>- Deployed on {connection.date}</div>
        </div>
        <div className={classes.description}>{connection.description}</div>
        <div className={classes.connectionContainer}>
          <div className={classes.taskDate}>
            {connection.source.connName}
            {' | '}
            {connection.source.connName}
          </div>
          <img className={classes.arrow} src={arrowIcon} alt="arrow" />
          <div className={classes.taskDate}>
            {connection.target.connName}
            {' | '}
            {connection.target.connDb}
          </div>
        </div>
        <div className={classes.chipContainer}>
          {connection.tags.map((tag) => {
            return <div className={classes.chip}>{tag}</div>;
          })}
        </div>
      </div>
      {temp ? (
        <>
          <Typography className={classes.title}>How Would You Like to Proceed?</Typography>
          <div className={classes.cardsContainer}>
            <div className={classes.card}>
              <div className={classes.cardDescription}>
                I would like to extract all columns from all tables without any custom selection.
              </div>
              <div className={classes.cardTitle}>Run Task</div>
              <img className={classes.cardRunIcon} src={runTaskIcon} alt="run-task" />
            </div>
            <div className={classes.card}>
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
          <IngestionHeader title="Run History" />
          <div>table</div>
        </div>
      )}
    </div>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
