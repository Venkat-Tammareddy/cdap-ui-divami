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
import { Step, StepContent, StepLabel, Stepper, Tooltip, Typography } from '@material-ui/core';
import { StepConnector } from '@material-ui/core';
import { parseJdbcString } from '../helpers';

const styles = (theme): StyleRules => {
  return {
    root: {
      boxShadow: '-2px 0 16px 0 rgba(0,0,0,0.15);',
      height: '100%',
      '& .MuiStepContent-root': {
        marginLeft: '15px',
        paddingLeft: '30px',
        borderLeft: '1px solid #A5A5A5',
      },
      '& .MuiStepLabel-label': {
        fontSize: '16px',
        fontFamily: 'Lato',
        color: '#202124',
        letterSpacing: '0',
        lineHeight: '24px',
        marginLeft: '8px',
      },
      overflowY: 'auto',
      '& .MuiStepper-root': {
        padding: '28px',
      },
      '& .MuiStepConnector-vertical': {
        marginLeft: '17px',
      },
      '& .MuiStepConnector-lineVertical': {
        minHeight: '0px',
      },
      '& .MuiStepLabel-completed': {
        cursor: 'pointer',
      },
      '& .MuiTooltip-tooltip': {
        fontSize: '20px',
      },
    },
    label: {
      cursor: 'pointer',
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0',
      lineHeight: '24px',
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
        textAlign: 'center',
        verticalAlign: 'middle',
        lineHeight: '30px',
      },
      // margin: '4px',
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
        // margin: '4px',
      },
      '&$completedIcon': {
        color: 'green',
      },
    },
    activeIcon: {},
    completedIcon: {
      // margin: '4px',
      cursor: 'pointer',
    },
    stepContent: {
      fontFamily: 'Lato',
      marginTop: '-7px',
      marginLeft: '1px',
      fontSize: '16px',
      color: '#666666',
      letterSpacing: '0',
      lineHeight: '24px',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      textOverflow: 'ellipsis',
    },
    stepContentWrapper: {
      height: '48px',
    },
    stepContentInfo: {
      display: '-webkit-box',
      marginTop: '-7px',
      marginLeft: '2px',
      wordBreak: 'break-word',
      height: '48px',
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#666666',
      letterSpacing: '0',
      lineHeight: '24px',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    },
    '& .MuiTypography-body': {
      fontSize: '14px',
    },
    tooltip: {
      fontsize: '4em',
      color: 'red',
      backgroundColor: '#A5A5A5',
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
        return (
          <div title={draftConfig.name} className={classes.stepContentInfo}>
            {draftConfig.name}
          </div>
        );
      case 1:
        return (
          <div className={classes.stepContentWrapper}>
            <div
              title={parseJdbcString(
                draftConfig.config.stages[0]?.plugin?.properties.connectionString,
                draftConfig.config.stages[0]?.plugin?.properties.jdbcPluginName
              )}
              className={classes.stepContent}
            >
              {parseJdbcString(
                draftConfig.config.stages[0]?.plugin?.properties.connectionString,
                draftConfig.config.stages[0]?.plugin?.properties.jdbcPluginName
              )}
            </div>
            <div title={draftConfig.config.stages[0]?.name} className={classes.stepContent}>
              {draftConfig.config.stages[0]?.name}
            </div>
          </div>
        );
      case 2:
        return (
          <div className={classes.stepContentWrapper}>
            <div
              title={draftConfig.config.stages[1]?.plugin?.properties.dataset}
              className={classes.stepContent}
            >
              {draftConfig.config.stages[1]?.plugin?.properties.dataset}
            </div>
            <div title={draftConfig.config.stages[1]?.name} className={classes.stepContent}>
              {draftConfig.config.stages[1]?.name}
            </div>
          </div>
        );
      case 4:
        return;
      default:
        return <div className={classes.stepContentInfo} />;
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

  const BlueOnGreenTooltip = withStyles({
    tooltip: {
      color: '#A5A5A5',
      fontSize: '20px',
    },
  })(Tooltip);
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
