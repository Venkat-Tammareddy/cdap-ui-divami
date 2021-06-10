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
import { Button, Radio } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';

const styles = (): StyleRules => {
  return {
    root: {},
    radioContainer: {
      marginTop: '10%',
      marginLeft: '20%',
    },
    logSection: {
      marginTop: '3%',
    },
    preferencesSection: {
      marginTop: '4%',
    },
    buttonContainer: {
      marginTop: '5%',
      marginLeft: '30%',
      display: 'flex',
      gap: '50px',
    },
    submitButton: {
      backgroundColor: '#2196f3',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {}
const TaskConfigurationView: React.FC<IIngestionProps> = ({ classes }) => {
  const [logErrors, setLogErrors] = React.useState('Yes');
  const [logPreferences, setLogPreferences] = React.useState('Replace');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('log error value: ' + logErrors);
    console.log('log preferences value: ' + logPreferences);
  };
  return (
    <div className={classes.root}>
      <form className={classes.radioContainer} onSubmit={handleSubmit}>
        <p>Enter Configuration details</p>
        <div className={classes.logSection}>
          <FormLabel>Do you like to log data errors during data ingestion?</FormLabel>
          <RadioGroup row value={logErrors} onChange={(e) => setLogErrors(e.target.value)}>
            <FormControlLabel control={<Radio />} value="Yes" label="Yes" />
            <FormControlLabel control={<Radio />} value="No" label="No" />
          </RadioGroup>
        </div>

        <div className={classes.preferencesSection}>
          <FormLabel>Do you have a preference for data ingesting?</FormLabel>
          <RadioGroup value={logPreferences} onChange={(e) => setLogPreferences(e.target.value)}>
            <FormControlLabel
              control={<Radio />}
              value="Replace"
              label="Replace all old records with the new ones"
            />
            <FormControlLabel
              control={<Radio />}
              value="insertNew"
              label="Only insert new and updated records"
            />
          </RadioGroup>
        </div>
        <div className={classes.buttonContainer}>
          <Button>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className={classes.submitButton}
          >
            Deploy
          </Button>
        </div>
      </form>
    </div>
  );
};

const TaskConfiguration = withStyles(styles)(TaskConfigurationView);
export default TaskConfiguration;
