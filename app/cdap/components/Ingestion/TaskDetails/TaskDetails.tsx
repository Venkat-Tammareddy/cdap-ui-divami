import { TextField } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { useState } from 'react';

const styles = (): StyleRules => {
  return {
    root: {
      borderRadius: 3,
      height: 48,
      marginLeft: '10%',
      marginTop: '2%',
    },
    textFields: {
      display: 'flex',
      flexDirection: 'column',
    },
    taskName: {
      width: 550,
      '& .MuiFormHelperText-root': {
        color: 'red',
      },
    },
    taskDescription: {
      width: 550,
      marginTop: 10,
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '15%',
      marginLeft: '60%',
      gap: '50px',
      alignItems: 'center',
    },
    cancelButton: {
      textDecoration: 'none',
      color: '#2196f3',
    },
    submitButton: {
      backgroundColor: '#2196f3',
    },
    inputInfo: {
      color: 'green',
    },
    errorInputInfo: {
      color: 'red',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  submitValues: (values: object) => void;
}

const TaskDetailsView: React.FC<IIngestionProps> = ({ classes, submitValues }) => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskNameError, setTaskNameError] = useState({ error: false, errorMsg: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formDataObject = {
      taskName: '',
      taskDescription: '',
    };

    formDataObject.taskName = `${taskName}`;
    formDataObject.taskDescription = `${taskDescription}`;
    submitValues(formDataObject);
  };

  const handleTaskNameChange = (e: React.FormEvent) => {
    const inputValue = e.target as HTMLInputElement;
    if (inputValue.value.length > 5) {
      taskNameError.error = true;
      taskNameError.errorMsg = 'Task name must be less than 64';
    } else {
      if (inputValue.value.includes(' ')) {
        taskNameError.error = true;
        taskNameError.errorMsg =
          'Enter task name without spaces (EX: IngestOracleData, Ingest_Oracle_Data and etc...)';
      } else {
        taskNameError.error = false;
        taskNameError.errorMsg = '';
      }
    }

    setTaskNameError(taskNameError);
    setTaskName(inputValue.value);
  };

  return (
    <div className={classes.root}>
      <form onSubmit={handleSubmit}>
        <p>Enter Task Details</p>
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
            helperText={taskNameError.errorMsg}
          />
          <TextField
            required
            name="taskDescription"
            onChange={(e) => setTaskDescription(e.target.value)}
            value={taskDescription}
            label="Description"
            className={classes.taskDescription}
            multiline={true}
            rows={5}
            variant="outlined"
          />
        </div>
        <div className={classes.buttonContainer}>
          <Button className={classes.cancelButton}>CANCEL</Button>
          <Button
            variant="contained"
            color="primary"
            className={classes.submitButton}
            type="submit"
          >
            CONTINUE
          </Button>
        </div>
      </form>
    </div>
  );
};

const TaskDetails = withStyles(styles)(TaskDetailsView);
export default TaskDetails;
