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
import TaskTrackingWizard from '../IngestTaskWizard/TaskTrackingWizard';
import { Button, Paper, Typography } from '@material-ui/core';
import { EntityTopPanel } from 'components/EntityTopPanel';
import TaskDetails from '../TaskDetails/TaskDetails';
import SelectConnections from '../SelectConnections/SelectConnections';
import TaskConfiguration from '../TaskConfiguration/TaskConfiguration';
import MappingLayout from '../MappingLayout/MappingLayout';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
      // overflow: 'hidden',
      border: '2px solid red',
    },
    wizardAndContentWrapper: {
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gridTemplateRows: '100%',
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      overflowY: 'hidden',
      border: '2px solid green',
    },
    wizard: {
      boxShadow: ' 0px -1px 10px 0.5px gray',
    },
    content: {},
  };
};

interface ICreateIngestionProps extends WithStyles<typeof styles> {
  test: string;
}
const CreateIngestionView: React.FC<ICreateIngestionProps> = ({ classes }) => {
  const steps = [
    'Task Details',
    'Source Connection',
    'Target Connection',
    'Target Mapping',
    'Task Configuration',
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const connections = [
    {
      database: 'mydataset',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'alpha',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'bravo',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'charlie',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'delta',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'tony_stark',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'thor',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'iron_man',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'captain_america',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
    {
      database: 'spider_man',
      connection: 'oracle-connection',
      dateAndTime: '07 apr 21 2:30pm',
    },
  ];
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const Content = () => {
    switch (activeStep) {
      case 0:
        return (
          <TaskDetails
            submitValues={(details) => {
              console.log(details);
              handleNext();
            }}
          />
        );
      case 1:
        return (
          <SelectConnections
            selectionType="source"
            connectionsList={connections}
            submitConnection={(a) => {
              console.log(a);
              handleNext();
            }}
          />
        );
      case 2:
        return (
          <SelectConnections
            selectionType="target"
            connectionsList={connections}
            submitConnection={(a) => {
              console.log(a);
              handleNext();
            }}
          />
        );
      case 3:
        return (
          <MappingLayout
            submitMappingType={(mappingType) => {
              console.log(mappingType);
              handleNext();
            }}
          />
        );
      case 4:
        return <TaskConfiguration />;
      default:
        return (
          <>
            {activeStep < steps.length ? (
              <div className={classes.actionsContainer}>
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            ) : (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </Paper>
            )}
          </>
        );
    }
  };
  return (
    <div className={classes.root}>
      <EntityTopPanel title="Create Ingestion Task" />
      <div className={classes.wizardAndContentWrapper}>
        <div className={classes.wizard}>
          <TaskTrackingWizard steps={steps} activeStep={activeStep} />
        </div>
        <div className={classes.content}>{Content()}</div>
      </div>
    </div>
  );
};

const CreateIngestion = withStyles(styles)(CreateIngestionView);
export default CreateIngestion;
