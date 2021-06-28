import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 'calc(100% - 100px)', // margin
      margin: '40px 40px',
      display: 'flex',
      flexDirection: 'column',
      // '& .MuiFormLabel-root': {
      //   color: '#202124',
      //   fontSize: '16px', // or black
      // },
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
    errorMsg:
      'Enter task name without spaces (EX: IngestOracleData, Ingest_Oracle_Data and etc...)',
  });
  const [taskTagError] = React.useState({
    error: false,
    errorMsg: 'Add tags with a comma (,) separation (ex: Studies, Courses, and etc...)',
  });

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
      <p className={classes.headerText}>Enter Task Details</p>
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
          label="Description"
          InputProps={{
            classes: {
              input: classes.resize,
            },
          }}
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
          label="Tags"
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
        <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
          CONTINUE
        </Button>
      </div>
    </form>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
