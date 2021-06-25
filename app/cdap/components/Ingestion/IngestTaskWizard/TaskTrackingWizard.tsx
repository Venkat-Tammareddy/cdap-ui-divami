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
import { Step, StepContent, StepLabel, Stepper, Typography } from '@material-ui/core';
import { StepConnector } from '@material-ui/core';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
      '& .MuiStepContent-root': {
        borderLeft: '1px solid green',
      },
      '& .MuiStepLabel-label': {
        fontSize: '16px',
        fontFamily: 'Lato',
        color: '#202124',
        letterSpacing: '0',
        lineHeight: '24px',
      },
    },
    button: {
      marginTop: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    actionsContainer: {
      marginBottom: theme.spacing(2),
    },
    resetContainer: {
      padding: theme.spacing(3),
    },
    icon: {
      '& .MuiStepIcon-text': {
        fontSize: '14px',
        fontFamily: 'Lato',
        fill: '#78909C',
      },
      color: '#FFFFFF',
      height: '30px',
      width: '30px',
      border: '1px solid #78909c',
      borderRadius: '50%',
      '&$activeIcon': {
        '& .MuiStepIcon-text': {
          fontSize: '16px',
          fontFamily: 'Lato ',
          fill: '#FFFFFF',
        },
        color: '#4285F4',
        border: '1px solid #4285F4',
        borderRadius: '50%',
        height: '38px',
        width: '38px',
        padding: '4px',
        fontSize: '14px',
        letterSpacing: '0',
      },
      '&$completedIcon': {
        color: 'green',
      },
    },
    activeIcon: {},
    completedIcon: {},
  };
};

interface ITrackingWizardProps extends WithStyles<typeof styles> {
  steps: any[];
  activeStep;
  draftConfig;
}
const TrackingWizard: React.FC<ITrackingWizardProps> = ({
  classes,
  steps,
  activeStep,
  draftConfig,
}) => {
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return draftConfig.name;
      case 1:
        return (
          <div>
            studies
            <div>oracle-global-server</div>
          </div>
        );
      case 2:
        return (
          <div>
            StudyPerformance
            <div>bigquery-global-server</div>
          </div>
        );
      default:
        return;
    }
  }
  const myimg = '/cdap_assets/img/stepperIcon.svg';
  const iconn = () => {
    return (
      <div>
        <img src={myimg} alt="img" height="30px" width="30px" />
      </div>
    );
  };

  const QontoConnector = withStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    active: {
      '& $line': {
        borderColor: '#4285F4',
      },
    },
    completed: {
      '& $line': {
        borderColor: 'green',
      },
    },
    line: {
      borderColor: 'green',
      borderTopWidth: 3,
      borderRadius: 1,
    },
  })(StepConnector);
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical" connector={<QontoConnector />}>
        {steps.map((label, index) => (
          <Step key={label} expanded={index < activeStep}>
            <StepLabel
              onClick={() => console.log(index)}
              className={classes.label}
              StepIconProps={{
                classes: {
                  root: classes.icon,
                  active: classes.activeIcon,
                  completed: classes.completedIcon,
                },
              }}
              StepIconComponent={index < activeStep ? iconn : null}
            >
              {label}
            </StepLabel>
            <StepContent>
              <Typography component={'span'}>{getStepContent(index)}</Typography>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

const TaskTrackingWizard = withStyles(styles)(TrackingWizard);
export default TaskTrackingWizard;
