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
const I18N_PREFIX = 'features.TaskDetails';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 'calc(100% - 100px)', // margin
      margin: '40px 40px',
      display: 'flex',
      flexDirection: 'column',
    },
    label: {
      fontSize: '16px',
      color: '#202124 ',
      letterSpacing: '0.25px',
    },
    headerText: {
      fontFamily: 'Lato',
      fontSize: '20px',
      letterSpacing: '0',
      color: '#202124',
      lineHeight: '24px',
    },
    textFields: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
    },
    taskName: {
      marginTop: '20px',
      width: '500px',
      height: '56px',
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
      width: '500px',
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
      width: '500px',
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
      marginBottom: '0',
    },
    errorInputInfo: {
      color: 'red',
      fontFamily: 'Lato',
      marginTop: '10px',
    },
    tagInfo: {
      marginTop: '10px',
      height: '15px',
      letterSpacing: '0.19px',
      fontSize: '12px',
      color: '#666666',
    },
  };
};

interface ITaskDetailsProps extends WithStyles<typeof styles> {
  submitValues: (values: object) => void;
  handleCancel: () => void;
  draftConfig;
}

const TaskDetailsView: React.FC<ITaskDetailsProps> = ({
  classes,
  submitValues,
  handleCancel,
  draftConfig,
}) => {
  const [taskName, setTaskName] = React.useState(draftConfig.name);
  const [taskDescription, setTaskDescription] = React.useState(draftConfig.description);
  const [taskTags, setTaskTags] = React.useState('');
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg: T.translate(`${I18N_PREFIX}.Errors.taskNameFormatError`),
  });
  const [taskTagError] = React.useState({
    error: false,
    errorMsg: T.translate(`${I18N_PREFIX}.Errors.taskTagError`),
  });
  const taskLengthErrorMessage = T.translate(`${I18N_PREFIX}.Errors.taskNameLengthError`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObject = {
      taskName,
      taskDescription,
      tags: [],
    };

    let arr = [];
    const tagString = `${taskTags}`;
    const tagName = '';
    arr = tagString.split(',');
    formDataObject.taskName = `${taskName}`;
    formDataObject.taskDescription = `${taskDescription}`;
    formDataObject.tags = arr;
    submitValues(formDataObject);
  };

  const onCancel = (e: React.FormEvent) => {
    handleCancel();
  };

  const handleTaskNameChange = (e: React.FormEvent) => {
    const inputValue = e.target as HTMLInputElement;
    if (inputValue.value.length > 64) {
      taskNameError.error = true;
      taskNameError.errorMsg = taskLengthErrorMessage;
    } else {
      if (inputValue.value.includes(' ')) {
        taskNameError.error = true;
        taskNameError.errorMsg = taskNameError.errorMsg;
      } else {
        taskNameError.error = false;
        taskNameError.errorMsg = taskNameError.errorMsg;
      }
    }
    setTaskNameError(taskNameError);
    setTaskName(inputValue.value);
  };

  const handleTagsChange = (e: React.FormEvent) => {
    const tags = e.target as HTMLInputElement;
    setTaskTags(tags.value);
  };

  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <p className={classes.headerText}>Enter Task Details</p>
      <div className={classes.textFields}>
        <TextField
          required
          name="taskName"
          label={T.translate(`${I18N_PREFIX}.Labels.taskName`)}
          value={taskName}
          className={classes.taskName}
          color={taskNameError.error ? 'secondary' : 'primary'}
          variant="outlined"
          onChange={handleTaskNameChange}
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
          name="taskDescription"
          onChange={(e) => setTaskDescription(e.target.value)}
          value={taskDescription}
          label={T.translate(`${I18N_PREFIX}.Labels.description`)}
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
          className={classes.taskDescription}
          multiline={true}
          rows={5}
          variant="outlined"
        />
        <TextField
          name="Tags"
          label={T.translate(`${I18N_PREFIX}.Labels.tags`)}
          value={taskTags}
          variant="outlined"
          className={classes.taskTags}
          onChange={handleTagsChange}
          error={taskTagError.error}
          InputLabelProps={{
            classes: {
              root: classes.label,
            },
          }}
        />
        <p className={taskTagError.error ? classes.tagErrorInfo : classes.tagInfo}>
          {taskTagError.errorMsg}
        </p>
      </div>
      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton} onClick={onCancel}>
          CANCEL
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          type="submit"
          disabled={taskNameError.error}
        >
          CONTINUE
        </Button>
      </div>
    </form>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
