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
        marginLeft: '17px',
        paddingLeft: '40px',
        borderLeft: '1px solid #A5A5A5',
      },
      '& .MuiStepLabel-label': {
        fontSize: '16px',
        fontFamily: 'Lato',
        color: '#202124',
        letterSpacing: '0',
        lineHeight: '24px',
      },
      overflowY: 'auto',
      '& .MuiStepper-root': {
        padding: '36px 28px',
      },
      '& .MuiStepConnector-vertical': {
        marginLeft: '17px',
      },
      '& .MuiStepConnector-lineVertical': {
        borderLeft: '1px solid green',
        minHeight: '0px',
      },
    },
    label: {
      cursor: 'pointer',
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
      margin: '4px',
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
        border: 'none',
        height: '30px',
        width: '30px',
        fontSize: '16px',
        margin: '4px',
      },
      '&$completedIcon': {
        color: 'green',
      },
    },
    activeIcon: {},
    completedIcon: {
      margin: '4px',
    },
    stepContent: {
      wordBreak: 'break-word',
      height: '48px',
      border: '1px solid red',
    },
    '& .MuiTypography-body': {
      fontSize: '14px',
    },
  };
};

interface ITrackingWizardProps extends WithStyles<typeof styles> {
  steps: any[];
  activeStep;
  stepProgress;
  draftConfig;
  stepperNav: (step: number) => void;
}
const TrackingWizard: React.FC<ITrackingWizardProps> = ({
  classes,
  steps,
  activeStep,
  stepProgress,
  draftConfig,
  stepperNav,
}) => {
  function getStepContent(step: number) {
    switch (step) {
      case 0:
        return <p className={classes.stepContent}>{draftConfig.name}</p>;
      case 1:
        return (
          <div className={classes.stepContent}>
            <p>{draftConfig.config.stages[0]?.connectionType}</p>
            <p>{draftConfig.config.stages[0]?.name}</p>
          </div>
        );
      case 2:
        return (
          <div className={classes.stepContent}>
            <p>{draftConfig.config.stages[1]?.connectionType}</p>
            <p>{draftConfig.config.stages[1]?.name}</p>
          </div>
        );
      case 4:
        return;
      default:
        return <div className={classes.stepContent} />;
    }
  }
  const myimg = '/cdap_assets/img/side-stepper-tick.svg';
  const iconn = () => {
    return (
      <img className={classes.completedIcon} src={myimg} alt="img" height="30px" width="30px" />
    );
  };

  const Connector = withStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    // active: {
    //   '& $line': {
    //     borderLeft: '1px solid #A5A5A5',
    //   },
    // },
    // completed: {
    //   '& $line': {
    //     borderLeft: '1px solid #A5A5A5',
    //   },
    // },
    line: {
      borderLeft: '1px solid #A5A5A5',
    },
  })(StepConnector);
  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} orientation="vertical" connector={<Connector />}>
        {steps.map((label, index) => (
          <Step key={label} expanded={index < steps.length - 1}>
            <StepLabel
              className={classes.label}
              StepIconProps={{
                classes: {
                  root: classes.icon,
                  active: classes.activeIcon,
                  completed: classes.completedIcon,
                },
              }}
              StepIconComponent={
                index <= stepProgress ? (index === activeStep ? null : iconn) : null
              }
              onClick={() => stepperNav(index)}
            >
              {label}
            </StepLabel>
            <StepContent>{getStepContent(index)}</StepContent>
          </Step>
        ))}
      </Stepper>
    </div>
  );
};

const TaskTrackingWizard = withStyles(styles)(TrackingWizard);
export default TaskTrackingWizard;
