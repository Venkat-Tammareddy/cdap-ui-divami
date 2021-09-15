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
import Modal from '@material-ui/core/Modal';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  TextField,
  Typography,
} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
const I18N_PREFIX = 'features.TaskInfo';

const styles = (): StyleRules => {
  return {
    root: {},
    dialog: { padding: '50px' },
    errorInputInfo: {
      color: '#DB4437',
      display: 'flex',
      fontFamily: 'Lato',
      marginBottom: '0px',
      fontSize: '12px',
      letterSpacing: '0.19px',
    },
  };
};

interface IDuplicatepopupProps extends WithStyles<typeof styles> {
  open: boolean;
  taskName: string;
  onSubmit: () => void;
  onClose: () => void;
  setTaskName: (taskName: string) => void;
}

const DuplicatepopupView: React.FC<IDuplicatepopupProps> = ({
  classes,
  open,
  taskName,
  onSubmit,
  onClose,
  setTaskName,
}) => {
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg: '',
  });
  const taskSpaceError = T.translate(`${I18N_PREFIX}.Errors.taskNameFormatError`).toString();
  const taskLengthErrorMessage = T.translate(
    `${I18N_PREFIX}.Errors.taskNameLengthError`
  ).toString();
  const handleTaskNameChange = (e: React.FormEvent) => {
    const inputValue = e.target as HTMLInputElement;
    const taskNameError = {
      error: false,
      errorMsg: '',
    };
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
        taskNameError.errorMsg = '';
      }
    }
    setTaskNameError(taskNameError);
    setTaskName(inputValue.value);
  };
  return (
    <Dialog
      open={open}
      style={{
        border: '1px solid red',
      }}
    >
      <div
        style={{
          width: '400px',
          height: '240px',
          display: 'flex',
          flexDirection: 'column',
          margin: '40px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '16px',
            fontFamily: 'Lato',
            color: '#202124',
          }}
        >
          <p style={{ marginBottom: '0px' }}>Sorry! There is already a task with this name.</p>
          <p>Please rename it.</p>
        </div>
        <TextField
          label="Task Name*"
          variant="outlined"
          style={{ width: '380px', marginTop: '30px' }}
          value={taskName}
          onChange={(e) => handleTaskNameChange(e)}
        />
        <p className={taskNameError.error ? classes.errorInputInfo : classes.inputInfo}>
          {taskNameError.errorMsg}
        </p>
        <div style={{ marginTop: 'auto' }}>
          <ButtonComponent
            submitText="Deploy"
            onCancel={onClose}
            onSubmit={onSubmit}
            disableSubmit={taskName === '' || taskNameError.error}
          />
        </div>
      </div>
    </Dialog>
  );
};

const Duplicatepopup = withStyles(styles)(DuplicatepopupView);
export default Duplicatepopup;
