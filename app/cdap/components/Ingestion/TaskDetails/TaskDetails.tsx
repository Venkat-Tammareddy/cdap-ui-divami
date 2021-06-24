import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 'calc(100% - 100px)', // margin
      margin: '50px',
      display: 'flex',
      flexDirection: 'column',
      '& .MuiFormLabel-root': {
        color: '#202124',
        fontSize: '16px', // or black
      },
    },
    headerText: {
      fontFamily: 'Lato',
      fontSize: '20px',
      letterSpacing: '0',
      color: '#202124',
      height: '24px',
    },
    textFields: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
    },
    taskName: {
      marginTop: '20px',
      width: 500,
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
      width: 500,
      marginTop: '20px',
      borderRadius: '4px',
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    taskTags: {
      marginTop: '20px',
      width: 500,
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    resize: {
      fontSize: '15px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '50px',
      alignItems: 'end',
      justifyContent: 'flex-end',
      position: 'absolute',
      right: '50px',
      bottom: '100px',
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
      letterSpacing: '0.19px',
    },
    errorInputInfo: {
      color: 'red',
      fontFamily: 'Lato',
    },
  };
};

interface ITaskDetailsProps extends WithStyles<typeof styles> {
  submitValues: (values: object) => void;
}

const TaskDetailsView: React.FC<ITaskDetailsProps> = ({ classes, submitValues }) => {
  const [taskName, setTaskName] = React.useState('');
  const [taskDescription, setTaskDescription] = React.useState('');
  const [taskTags, setTaskTags] = React.useState('');
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg:
      'Enter task name without spaces (EX: IngestOracleData, Ingest_Oracle_Data and etc...)',
  });
  const [taskTagError, setTaskTagError] = React.useState({
    error: false,
    errorMsg: 'Add tags with a comma (,) separation (ex: Studies, Courses, and etc...)',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObject = {
      taskName: '',
      taskDescription: '',
      tags: [],
    };

    const arr = [];
    const tagString = `${taskTags}`;
    let tagName = '';
    for (let i = 0; i < tagString.length; i++) {
      if (tagString[i] === ',') {
        arr.push(tagName);
        tagName = '';
      }
      tagName += tagString[i];
    }
    formDataObject.taskName = `${taskName}`;
    formDataObject.taskDescription = `${taskDescription}`;
    formDataObject.tags = arr;
    submitValues(formDataObject);
  };

  const handleTaskNameChange = (e: React.FormEvent) => {
    const inputValue = e.target as HTMLInputElement;
    if (inputValue.value.length > 64) {
      taskNameError.error = true;
      taskNameError.errorMsg = 'Task name must be less than 64';
    } else {
      if (inputValue.value.includes(' ')) {
        taskNameError.error = true;
        taskNameError.errorMsg =
          'Enter task name without spaces (EX: IngestOracleData, Ingest_Oracle_Data and etc...)';
      } else {
        taskNameError.error = false;
        taskNameError.errorMsg =
          'Enter task name without spaces (EX: IngestOracleData, Ingest_Oracle_Data and etc...)';
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
      <h3 className={classes.headerText}>Enter Task Details</h3>
      <div className={classes.textFields}>
        <TextField
          required
          name="taskName"
          label="Task Name"
          value={taskName}
          className={classes.taskName}
          color={taskNameError.error ? 'secondary' : 'primary'}
          variant="outlined"
          onChange={handleTaskNameChange}
          error={taskNameError.error}
          InputProps={{
            classes: {
              input: classes.resize,
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
          label="Description"
          className={classes.taskDescription}
          multiline={true}
          rows={5}
          variant="outlined"
        />
        <TextField
          name="Tags"
          label="Tags"
          value={taskTags}
          variant="outlined"
          className={classes.taskTags}
          onChange={handleTagsChange}
          error={taskTagError.error}
        />
        <p className={classes.inputInfo}>{taskTagError.errorMsg}</p>
      </div>
      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton}>CANCEL</Button>
        <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
          CONTINUE
        </Button>
      </div>
    </form>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
