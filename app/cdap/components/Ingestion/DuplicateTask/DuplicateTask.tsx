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

import T from 'i18n-react';
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import {
  Box,
  Grid,
  Button,
  TextField,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
} from '@material-ui/core';
import TaskInfo from '../TaskInfo/TaskInfo';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import If from 'components/If';
import CustomTableSelection from '../CustomTableSelection/CustomTableSelection';
const I18N_PREFIX = 'features.TaskInfo';

const styles = (): StyleRules => {
  return {
    root: {
      height: '100%', // margin
      background: '#9898989c',
      position: 'fixed',
      width: '100%',
      zIndex: 10,
      top: '48px',
      left: '0',
      backgroundColor: 'green',
      '& .MuiAutocomplete-tag': {
        border: '1px solid rgba(0,0,0,0.12)',
        color: '#000000',
        backgroundColor: 'transparent',
      },
      '& .MuiChip-label': {
        fontFamily: 'Lato',
        fontSize: '14px',
        letterSpacing: '0.25px',
      },
      '& .MuiInputLabel-outlined': {
        fontSize: '12px',
        color: '#202124',
      },
      '& .MuiFormLabel-root.Mui-error': {
        color: '#DB4437',
        fontSize: '12px',
      },
    },
    sdleTskWrapper: {
      width: '680px',
      height: '100%',
      border: '1px solid cyan',
      background: '#FBFBFB',
      boxShadow: '-2px 9px 26px 0 rgba(0,0,0,0.15)',
      right: '0px',
      position: 'absolute',
      padding: '30px 40px',
      fontFamily: 'Lato',
    },
    heading: {
      fontSize: '20px',
      marginBottom: '29px',
    },
    titleMsg: {
      display: 'flex',
      fontSize: '14px',
      lineHeight: '17px',
      color: '#202124',
      alignItems: 'center',
    },
    arrowImg: {
      paddingLeft: '12px',
      paddingRight: '16px',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '25px',
      height: '85%',
    },
    label: {
      fontSize: '16px',
      color: '#202124 ',
      letterSpacing: '0.25px',
    },
    headerText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      letterSpacing: '0',
      color: '#202124',
      lineHeight: '24px',
      marginBottom: '0',
    },
    textFields: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
    },
    taskName: {
      marginTop: '29px',
      width: '600px',
      height: '56px',
      boxSizing: 'border-box',
      // height: '56px',
      '& .MuiFormHelperText-root': {
        color: 'red',
      },
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    taskDescription: {
      width: '600px',
      marginTop: '28px',
      borderRadius: '4px',
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    taskTags: {
      marginTop: '28px',
      width: '600px',
      height: '56px',
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    resize: {
      height: '113px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '50px',
      alignItems: 'end',
      justifyContent: 'flex-end',
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
    submitButton: {
      backgroundColor: '#4285F4',
      letterSpacing: '1.25px',
      lineHeight: '24px',
      fontSize: '14px',
      fontFamily: 'Lato',
    },
    inputInfo: {
      color: '#666666',
      fontSize: '12px',
      height: '15px',
      letterSpacing: '0.19px',
      marginTop: '10px',
      marginLeft: '16px',
      marginBottom: '0',
      display: 'none',
    },
    errorInputInfo: {
      color: '#DB4437',
      display: 'flex',
      justifyContent: 'flex-end',
      fontFamily: 'Lato',
      marginTop: '10px',
      marginBottom: '0px',
      fontSize: '12px',
      letterSpacing: '0.19px',
    },
    tagInfo: {
      marginTop: '10px',
      height: '15px',
      letterSpacing: '0.19px',
      fontSize: '12px',
      color: '#666666',
      marginLeft: '16px',
    },
    input1: {
      height: '56px',
      boxSizing: 'border-box',
      fontSize: '16px',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    input2: {
      boxSizing: 'border-box',
      fontSize: '16px',
    },
    input3: {
      height: '56px',
      boxSizing: 'border-box',
      fontSize: '16px',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    LeftRight: {
      display: 'flex',
      flexDirection: 'row',
      flex: '1 1 0%',
    },
    infoText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      letterSpacing: '0.28px',
      lineHeight: '30px',
      color: '#4c4d4f',
      marginBottom: '0px',
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
    extraction: {
      marginTop: '38px',
      display: 'flex',
      flexDirection: 'column',
    },
    ingestionHeader: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
    },
    radioGroup: {
      display: 'flex',
      gap: '50px',
    },
    radiooo: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
    },
  };
};

interface DuplicateTaskProps extends WithStyles<typeof styles> {
  submitValues: (value: any) => void;
  handleCancel: () => void;
}

const DuplicateTaskView: React.FC<DuplicateTaskProps> = ({
  classes,
  submitValues,
  handleCancel,
}) => {
  const [taskName, setTaskName] = React.useState('');
  const [taskDescription, setTaskDescription] = React.useState('');
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg: '',
  });
  const taskSpaceError = T.translate(`${I18N_PREFIX}.Errors.taskNameFormatError`).toString();
  const taskLengthErrorMessage = T.translate(
    `${I18N_PREFIX}.Errors.taskNameLengthError`
  ).toString();
  const [autoCompleteValue, setAutoCompleteValue] = React.useState([]);
  const [extraction, setExtraction] = React.useState('No');
  const [logs, setLogs] = React.useState('No');
  const [isSubmit, setIsSubmit] = React.useState(false);

  const handleTaskNameChange = (e: React.FormEvent) => {
    const inputValue = e.target as HTMLInputElement;
    if (inputValue.value.length > 64) {
      taskNameError.error = true;
      taskNameError.errorMsg = taskLengthErrorMessage;
    } else {
      taskNameError.error = false;
      taskNameError.errorMsg = taskSpaceError;
      if (inputValue.value.includes(' ')) {
        taskNameError.error = true;
        taskNameError.errorMsg = T.translate(`${I18N_PREFIX}.Errors.errorWithOutEx`).toString();
      } else {
        taskNameError.error = false;
        taskNameError.errorMsg = T.translate(
          `${I18N_PREFIX}.Errors.taskNameFormatError`
        ).toString();
      }
    }
    setTaskNameError(taskNameError);
    setTaskName(inputValue.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (extraction === 'Yes') {
      setIsSubmit(true);
    }
    e.preventDefault();
    submitValues(e.target);
  };

  const testCancel = () => {
    setIsSubmit(false);
  };

  const tileDesignBar = '/cdap_assets/img/title-design-bar.svg';
  const titleArrow = '/cdap_assets/img/arrow.svg';

  return (
    <div className={classes.root}>
      <div className={classes.sdleTskWrapper}>
        <div className={classes.heading}>
          <Box component="span" mr={2}>
            Duplicate Task
          </Box>
          <img src={tileDesignBar} />
        </div>
        <If condition={extraction === 'No' || isSubmit === false}>
          <div className={classes.titleMsg}>
            <div className={classes.jobDetailsTop}>Study-trails-Connections | Studies</div>
            <img src={titleArrow} alt="arrow" className={classes.arrowImg} />
            <div className={classes.jobDetailsTop}>
              Study_Performance_Connection | StudyPerformance
            </div>
          </div>
          <form className={classes.container}>
            <p className={classes.headerText}>Enter Task Details</p>
            <TextField
              className={classes.taskName}
              variant="outlined"
              name={T.translate(`${I18N_PREFIX}.Name.taskName`).toString()}
              label={T.translate(`${I18N_PREFIX}.Labels.taskName`)}
              value={taskName}
              InputProps={{ classes: { input: classes.input1 } }}
              color={taskNameError.error ? 'secondary' : 'primary'}
              autoFocus={true}
              onChange={handleTaskNameChange}
              error={taskNameError.error}
            />
            <p className={taskNameError.error ? classes.errorInputInfo : classes.inputInfo}>
              {taskNameError.errorMsg}
            </p>
            <TextField
              name={T.translate(`${I18N_PREFIX}.Name.taskDescription`).toString()}
              onChange={(e) => setTaskDescription(e.target.value)}
              value={taskDescription}
              label={T.translate(`${I18N_PREFIX}.Labels.description`)}
              InputProps={{ classes: { input: classes.input2 } }}
              // InputProps={{
              //   classes: {
              //     input: classes.resize,
              //   },
              // }}
              InputLabelProps={{
                classes: {
                  root: classes.label,
                },
              }}
              multiline={true}
              rows={8}
              className={classes.taskDescription}
              variant="outlined"
            />
            <Autocomplete
              className={classes.taskTags}
              multiple
              id="tags-outlined"
              options={[]}
              freeSolo
              value={autoCompleteValue}
              onChange={(e, newval) => {
                setAutoCompleteValue(newval);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label={T.translate(`${I18N_PREFIX}.Labels.tags`).toString()}
                  name={T.translate(`${I18N_PREFIX}.Labels.tags`).toString()}
                  onKeyDown={(e: any) => {
                    if (e.keyCode === 32 && e.target.value) {
                      setAutoCompleteValue(autoCompleteValue.concat(e.target.value));
                    }
                  }}
                />
              )}
            />
            <div className={classes.radiooo}>
              <div className={classes.extraction}>
                <FormLabel className={classes.labelText}>
                  Do you like to update the source table selection for extraction?
                </FormLabel>
                <RadioGroup
                  row
                  value={extraction}
                  className={classes.radioGroup}
                  onChange={(e) => {
                    setExtraction(e.target.value);
                  }}
                >
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
              <div className={classes.ingestion}>
                <FormLabel className={classes.labelText}>
                  Do you like to log data errors during data ingestion?
                </FormLabel>
                <RadioGroup
                  row
                  value={logs}
                  className={classes.radioGroup}
                  onChange={(e) => setLogs(e.target.value)}
                >
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
            </div>
            <ButtonComponent
              onCancel={handleCancel}
              onSubmit={handleSubmit}
              disableSubmit={taskName.length === 0}
              submitText="DUPLICATE & DEPLOY TASK"
            />
          </form>
        </If>
      </div>
    </div>
  );
};

const DuplicateTask = withStyles(styles)(DuplicateTaskView);
export default DuplicateTask;
