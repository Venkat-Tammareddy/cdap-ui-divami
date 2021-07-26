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
import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const I18N_PREFIX = 'features.TaskInfo';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 'calc(100% - 100px)', // margin
      margin: '40px 40px',
      display: 'flex',
      flexDirection: 'column',
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
        fontSize: '16px',
        color: '#202124',
      },
      '& .MuiFormLabel-root.Mui-error': {
        color: '#DB4437',
        fontSize: '12px',
      },
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
    info: {
      display: 'flex',
      flexDirection: 'column',
      height: '200px',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '83px',
      marginLeft: 'auto',
      marginRight: 'auto',
    },
    infoText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      letterSpacing: '0.28px',
      lineHeight: '30px',
      color: '#4c4d4f',
      marginBottom: '0px',
    },
    infoContainer: {
      display: 'flex',
      flexDirection: 'column',
      height: '60px',
      marginTop: '22.2px',
      width: '208px',
    },
  };
};

interface ITaskInfoProps extends WithStyles<typeof styles> {
  submitValues: (values: object) => void;
  handleCancel: () => void;
  draftConfig;
}

const TaskInfoView: React.FC<ITaskInfoProps> = ({
  classes,
  submitValues,
  handleCancel,
  draftConfig,
}) => {
  const [taskName, setTaskName] = React.useState(draftConfig.name);
  const [taskDescription, setTaskDescription] = React.useState(draftConfig.description);
  const [taskTags, setTaskTags] = React.useState('');
  const taskSpaceError = T.translate(`${I18N_PREFIX}.Errors.taskNameFormatError`).toString();
  const taskLengthErrorMessage = T.translate(
    `${I18N_PREFIX}.Errors.taskNameLengthError`
  ).toString();
  const [infoMessage, setInfoMessage] = React.useState('Enter task name');
  const [secondInfoMessage, setSecondInfoMessage] = React.useState('without spaces');
  const [autoCompleteValue, setAutoCompleteValue] = React.useState([]);
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg: '',
  });
  const [taskTagError] = React.useState({
    error: false,
    errorMsg: T.translate(`${I18N_PREFIX}.Errors.taskTagError`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObject = {
      taskName,
      taskDescription,
      tags: [],
    };

    formDataObject.taskName = `${taskName}`;
    formDataObject.taskDescription = `${taskDescription}`;
    formDataObject.tags = autoCompleteValue;
    console.log(formDataObject);
    submitValues(formDataObject);
  };

  // const onCancel = (e: React.FormEvent) => {
  //   handleCancel();
  // };

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

  const handleTagsChange = (e: React.FormEvent) => {
    const tags = e.target as HTMLInputElement;
    setTaskTags(tags.value);
  };

  const handleFocus = (e: React.FormEvent) => {
    const currentElement = e.target as HTMLInputElement;
    const name = currentElement.name;
    if (name === 'taskName') {
      setInfoMessage('Enter task name');
      setSecondInfoMessage('without spaces');
    }
    if (name === 'Tags') {
      setInfoMessage('Enter multiple tags');
      setSecondInfoMessage('with spaces');
    }
  };

  const infoIcon = '/cdap_assets/img/info-infographic.svg';
  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <div className={classes.LeftRight}>
        <div className={classes.left}>
          <p className={classes.headerText}>Enter Task Details</p>
          <div className={classes.textFields}>
            <TextField
              required
              name={T.translate(`${I18N_PREFIX}.Name.taskName`).toString()}
              label={T.translate(`${I18N_PREFIX}.Labels.taskName`)}
              value={taskName}
              className={classes.taskName}
              InputProps={{ classes: { input: classes.input1 } }}
              color={taskNameError.error ? 'secondary' : 'primary'}
              variant="outlined"
              autoFocus={true}
              onChange={handleTaskNameChange}
              onFocus={handleFocus}
              error={taskNameError.error}
              InputLabelProps={{
                classes: {
                  root: classes.label,
                },
              }}
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
            {/* <TextField
              name="Tags"
              label={T.translate(`${I18N_PREFIX}.Labels.tags`)}
              value={taskTags}
              variant="outlined"
              InputProps={{ classes: { input: classes.input3 } }}
              className={classes.taskTags}
              onChange={handleTagsChange}
              onFocus={handleFocus}
              error={taskTagError.error}
              InputLabelProps={{
                classes: {
                  root: classes.label,
                },
              }}
            />
            <p className={taskTagError.error ? classes.tagErrorInfo : classes.tagInfo}>
              {taskTagError.errorMsg}
            </p> */}
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
                  onFocus={handleFocus}
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
          </div>
        </div>
        <div className={classes.info}>
          <img src={infoIcon} alt="some icon text" height="75.4px" width="74px" />
          <div className={classes.infoContainer}>
            <p className={classes.infoText}>{infoMessage}</p>
            <p className={classes.infoText}>{secondInfoMessage}</p>
          </div>
        </div>
      </div>
      <ButtonComponent
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        disableSubmit={taskNameError.error || taskName.length === 0}
        submitText="CONTINUE"
      />
    </form>
  );
};

const TaskInfo = withStyles(styles)(TaskInfoView);
export default TaskInfo;
