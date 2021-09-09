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
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import TaskInfoFields from './TaskInfoFields';
import produce from 'immer';
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
        color: '#202124',
      },
      '& .MuiFormLabel-root.Mui-error': {
        color: '#DB4437',
        fontSize: '12px',
      },
      '& .MuiAutocomplete-input': {
        fontSize: '16px',
      },
      '& .MuiFormHelperText-root.Mui-error': {
        color: '#DB4437',
        fontSize: '12px',
        fontFamily: 'Lato',
        marginRight: '0px',
        display: 'flex',
        justifyContent: 'flex-end',
      },
      '& .MuiOutlinedInput-input': {
        fontSize: '16px',
      },
      '& .MuiInputLabel-shrink': {
        fontSize: '14px',
      },
    },
    label: {
      color: '#202124 ',
      fontSize: '16px',
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
      marginBottom: '20px',
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      height: '318px',
      width: '320px',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      marginTop: '53px',
      marginLeft: '50px',
      marginRight: 'auto',
      border: '1px solid #4285F4',
      borderRadius: '4px',
    },
    infoText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      letterSpacing: '0.28px',
      lineHeight: '30px',
      // color: '#4c4d4f',
      color: '#202124',
      opacity: '0.8',
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
  setDraftConfig: (values: object) => void;
  handleNext: () => void;
  handleCancel: () => void;
  draftConfig;
  tags: string[];
  setTags: (values: string[]) => void;
  artifactsList: any[];
}

const TaskInfoView: React.FC<ITaskInfoProps> = ({
  classes,
  setDraftConfig,
  handleCancel,
  draftConfig,
  tags,
  setTags,
  handleNext,
  artifactsList,
}) => {
  const [taskName, setTaskName] = React.useState(draftConfig?.name);
  const [taskDescription, setTaskDescription] = React.useState(draftConfig?.description);
  const [infoMessage, setInfoMessage] = React.useState('Enter task name');
  const [secondInfoMessage, setSecondInfoMessage] = React.useState('without spaces');
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg: '',
  });
  const [taskTagError, setTaskTagError] = React.useState({
    error: false,
    errorMsg: T.translate(`${I18N_PREFIX}.Errors.taskTagError`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // const formDataObject = {
    //   taskName,
    //   taskDescription,
    //   tags: [],
    // };

    // formDataObject.taskName = `${taskName}`;
    // formDataObject.taskDescription = `${taskDescription}`;
    // formDataObject.tags = tags;
    // submitValues(formDataObject);
    setDraftConfig(
      produce((prevDraft) => {
        prevDraft.name = taskName;
        prevDraft.description = taskDescription;
        prevDraft.artifact = artifactsList.find(
          (artifact) => artifact.name === 'cdap-data-pipeline'
        );
      })
    );
    handleNext();
  };

  const handleFocus = (e: React.FormEvent) => {
    const currentElement = e.target as HTMLInputElement;
    const name = currentElement.name;
    if (name === 'taskName') {
      setInfoMessage('Task Name');
      setSecondInfoMessage('Please ensure that there are no spaces in the task name. ');
    }
    if (name === 'Tags') {
      setInfoMessage('Tags');
      setSecondInfoMessage('Please enter tag label and click enter to add multiple tags.');
    }
    if (name === 'taskDescription') {
      setInfoMessage('Description');
      setSecondInfoMessage('Please briefly describe the objectives of the task. ');
    }
  };

  const infoIcon = '/cdap_assets/img/info-infographic.svg';
  return (
    <form onSubmit={handleSubmit} className={classes.root}>
      <div className={classes.LeftRight}>
        <TaskInfoFields
          taskName={taskName}
          taskDescription={taskDescription}
          tags={tags}
          setTaskName={setTaskName}
          setTags={setTags}
          setTaskDescription={setTaskDescription}
          handleFocus={handleFocus}
          setTaskNameError={setTaskNameError}
          setTaskTagError={setTaskTagError}
          taskNameError={taskNameError}
          taskTagError={taskTagError}
        />
        <div className={classes.info}>
          <img src={infoIcon} alt="some icon text" height="75.4px" width="74px" />
          <div className={classes.infoContainer}>
            <p className={classes.infoText}>{infoMessage}</p>
            <p className={classes.infoText} style={{ fontSize: '14px', lineHeight: '20px' }}>
              {secondInfoMessage}
            </p>
          </div>
        </div>
      </div>
      <ButtonComponent
        onCancel={handleCancel}
        onSubmit={handleSubmit}
        disableSubmit={taskNameError.error || taskName.length === 0 || taskTagError.error}
        submitText="CONTINUE"
      />
    </form>
  );
};

const TaskInfo = withStyles(styles)(TaskInfoView);
export default TaskInfo;
