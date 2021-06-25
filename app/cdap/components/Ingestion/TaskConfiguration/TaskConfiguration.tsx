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
import { Button, Radio, Typography } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 'calc(100% - 100px)', // margin
      margin: '40px 40px',
      display: 'flex',
      flexDirection: 'column',
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
      // marginTop: '5%',
      // marginLeft: '30%',
      // display: 'flex',
      // gap: '50px',
      display: 'flex',
      gap: '50px',
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
      fontSize: '20px',
      color: '#202124',
      letterSpacing: '0px',
      margin: '0',
    },
    labelText: {
      fontFamily: 'Lato',
      fontSize: '16px',
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
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  deploy: () => void;
}
const TaskConfigurationView: React.FC<IIngestionProps> = ({ classes, deploy }) => {
  const [logErrors, setLogErrors] = React.useState('Yes');
  const [logPreferences, setLogPreferences] = React.useState('Replace');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('log error value: ' + logErrors);
    console.log('log preferences value: ' + logPreferences);
    deploy();
  };
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <div className={classes.configOptions}>
        <p className={classes.headerText}>Enter Configuration details</p>
        <div className={classes.logSection}>
          <FormLabel className={classes.labelText}>
            Do you like to log data errors during data ingestion?
          </FormLabel>
          <InfoOutlinedIcon />
          <RadioGroup row value={logErrors} onChange={(e) => setLogErrors(e.target.value)}>
            <FormControlLabel
              control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
              value="Yes"
              label={<Typography className={classes.choices}>Yes</Typography>}
              className={classes.choices}
            />
            <FormControlLabel
              control={<Radio classes={{ root: classes.radio, checked: classes.checked }} />}
              value="No"
              label={<Typography className={classes.choices}>No</Typography>}
              className={classes.choices}
            />
          </RadioGroup>
        </div>

        <div className={classes.preferencesSection}>
          <FormLabel className={classes.labelText}>
            Do you have a preference for data ingesting?
          </FormLabel>
          <InfoOutlinedIcon />
          <RadioGroup
            row
            value={logPreferences}
            onChange={(e) => setLogPreferences(e.target.value)}
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
        </div>
      </div>

      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton}>Cancel</Button>
        <Button variant="contained" color="primary" type="submit" className={classes.submitButton}>
          Deploy
        </Button>
      </div>
    </form>
  );
};

const TaskConfiguration = withStyles(styles)(TaskConfigurationView);
export default TaskConfiguration;
