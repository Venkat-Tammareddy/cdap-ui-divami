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
      color: 'grey',
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
  const [Error, setError] = useState(false);

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

  const handleChange = (e: React.FormEvent) => {
    console.log('something changed');
    const inputValue = e.target as HTMLInputElement;
    if (inputValue.value.includes(' ')) {
      setError(true);
    } else {
      setError(false);
    }
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
            color={Error ? 'secondary' : 'primary'}
            variant="outlined"
            onChange={handleChange}
          />
          <p className={Error ? classes.errorInputInfo : classes.inputInfo}>
            <small>
              Enter task name without spaces (EX: IngestOracleData, Ingest_Oracle_Data, and etc...)
            </small>
          </p>
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
