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
import T from 'i18n-react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { Button, Radio, Typography } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
const I18N_PREFIX = 'features.TaskConfiguration';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 'calc(100% - 100px)', // margin
      margin: '40px 40px',
      display: 'flex',
      flexDirection: 'column',
      '& .MuiIconButton-label': {
        color: '#4285F4',
      },
    },
    radio: {
      '&$checked': {
        color: '#018786',
      },
    },
    checked: {},
    radioContainer: { flex: '1 1 0%' },
    logSection: {
      marginTop: '28px',
    },
    configOptions: {
      flex: '1 1 0%',
      display: 'flex',
      flexDirection: 'column',
    },
    preferencesSection: {
      marginTop: '38px',
    },
    buttonContainer: {
      display: 'flex',
      alignItems: 'end',
      justifyContent: 'flex-end',
    },
    submitButton: {
      textDecoration: 'none',
      backgroundColor: '#4285F4',
      outline: 'none',
      fontSize: '14px',
      letterSpacing: '1.25px',
      lineHeight: '24px',
      fontFamily: 'Lato',
    },
    headerText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      letterSpacing: '0px',
      margin: '0',
    },
    labelText: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    choices: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    cancelButton: {
      textDecoration: 'none',
      color: '#4285F4;',
      outline: 'none',
      fontSize: '14px',
      letterSpacing: '1.25px',
      lineHeight: '24px',
      fontFamily: 'Lato',
      marginRight: '30px',
    },
    overlayActive: {
      display: 'none',
    },
    modal: {
      width: '100%',
      border: '2px solid black',
    },
    modalBackdrop: {
      backgroundColor: '#FFFFFF',
    },
    infoIcon: {
      marginLeft: '10px',
      color: '#A5A5A5',
      transform: 'scale(1.3)',
    },
    radioChoice: {
      // justifyContent: 'center',
      alignItems: 'center',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  deploy: () => void;
  handleCancel: () => void;
}
const TaskConfigurationView: React.FC<IIngestionProps> = ({ classes, deploy, handleCancel }) => {
  const [logErrors, setLogErrors] = React.useState('Yes');
  const [logPreferences, setLogPreferences] = React.useState('Replace');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    deploy();
  };
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <div className={classes.configOptions}>
        <p className={classes.headerText}>{T.translate(`${I18N_PREFIX}.title`)}</p>
        <div className={classes.logSection}>
          <FormLabel className={classes.labelText}>
            {T.translate(`${I18N_PREFIX}.logText`)}
          </FormLabel>
          <RadioGroup
            row
            value={logErrors}
            onChange={(e) => setLogErrors(e.target.value)}
            className={classes.radioChoice}
          >
            <FormControlLabel
              control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
              value="Yes"
              label={<Typography className={classes.choices}>Yes</Typography>}
              className={classes.choices}
              style={{ marginRight: '24px' }}
            />
            <FormControlLabel
              control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
              value="No"
              label={<Typography className={classes.choices}>No</Typography>}
              className={classes.choices}
            />
          </RadioGroup>
        </div>

        {/* <div className={classes.preferencesSection}>
          <FormLabel className={classes.labelText}>
            {T.translate(`${I18N_PREFIX}.preferenceText`)}
          </FormLabel>
          <RadioGroup
            row
            value={logPreferences}
            onChange={(e) => setLogPreferences(e.target.value)}
            className={classes.radioChoice}
          >
            <FormControlLabel
              control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
              value="Replace"
              label={
                <Typography className={classes.choices}>
                  Replace all old records with the new ones
                </Typography>
              }
              className={classes.choices}
            />
            <FormControlLabel
              control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
              value="insertNew"
              label={
                <Typography className={classes.choices}>
                  Only insert new and updated records
                </Typography>
              }
              className={classes.choices}
            />
          </RadioGroup>
        </div> */}
      </div>

      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton} onClick={() => handleCancel()}>
          Cancel
        </Button>
        <Button variant="contained" color="primary" type="submit" className={classes.submitButton}>
          Deploy
        </Button>
      </div>
    </form>
  );
};

const TaskConfiguration = withStyles(styles)(TaskConfigurationView);
export default TaskConfiguration;
