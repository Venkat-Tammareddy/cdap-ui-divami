/*
 * Copyright © 2018 Cask Data, Inc.
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
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import IncrementInput from 'components/Ingestion/commonUtils/IncrementInput';
import { Radio } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import SearchIcon from '@material-ui/icons/Search';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import 'date-fns';
import { ingestionContext } from 'components/Ingestion/ingestionContext';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import { MyPipelineApi } from 'api/pipeline';
import NamespaceStore from 'services/NamespaceStore';
import { useContext } from 'react';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import If from 'components/If';

import { StringifyOptions } from 'query-string';
import moment from 'moment';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 48px)', // margin
      left: '0px',
      background: '#9898989c',
      position: 'fixed',
      width: '100%',
      zIndex: 10,
      top: '48px',
      '& .MuiInputBase-input': {
        fontSize: '16px',
      },
    },
    sdleTskWrapper: {
      width: '524px',
      height: '100%',
      background: '#FBFBFB',
      boxShadow: '-2px 9px 26px 0 rgba(0,0,0,0.15)',
      right: '0px',
      position: 'absolute',
      padding: '30px 40px',
      fontFamily: 'Lato',
      overflowY: 'auto',
    },
    heading: {
      fontSize: '20px',
      marginBottom: '29px',
    },
    btnFooter: {
      display: 'flex',
      marginTop: '38px',
      alignItems: 'center',
    },
    picker: {
      width: '320px',
      height: '56px',
      borderRadius: '4px',
      background: '#FBFBFB',
    },
    sheduleString: {
      fontSize: '14px',
      padding: '0',
    },
    msgName: {
      minWidth: '390px',
      minHeight: '32px',
      background: '#dcedf5',
      borderRadius: '15.5px',
      marginTop: '0px',
    },
    timePicker: {
      border: '1px solid #c8ccd0',
      margin: '0',
      width: 320,
      padding: '12px 10px',
      borderRadius: '4px',
      '& ::before': {
        borderBottom: 'none',
        content: 'none',
      },
      '& ::after': {
        borderBottom: 'none',
        content: 'none',
      },
    },
    cancelButton: {
      height: '36px',
      paddingLeft: '0px',
      textDecoration: 'none',
      color: '#4285F4 ',
      outline: 'none',
      border: 'none',
      paddingRight: '0px',
      fontFamily: 'Lato',
      fontSize: '14px',
      marginLeft: '80px',
    },
    scheduleButton: {
      height: '36px',
      backgroundColor: '#4285F4',
      // letterSpacing: '1.25px',
      lineHeight: '24px',
      fontSize: '14px',
      fontFamily: 'Lato',
      whiteSpace: 'nowrap',
    },
    scheduleSubHeader: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
    },
    optionsLabel: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      letterSpacing: '0.13px',
    },
    optionsLabel2: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      letterSpacing: '0.13px',
      marginBottom: '0px',
    },
    container: {
      display: 'flex',
      marginTop: '30px',
      flexDirection: 'column',
    },
    foorm: {
      marginBottom: '80px',
    },
    shedulemsg: {
      paddingLeft: '22px',
    },
    radioButtons: {
      marginLeft: '0px',
    },
    scheduleHeader: {
      color: '#202124',
    },
    timerIcon: {
      paddingLeft: '8px',
    },
    radioContainer: {
      marginLeft: '-10px',
    },
  };
};
const recurOptions = [
  'Every 5 min',
  'Every 10 min',
  'Every 30 min',
  'Hourly',
  'Daily',
  'Weekly',
  'Monthly',
  // 'Yearly',
];

// const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const initialWeekDays = {
  Sun: true,
  Mon: false,
  Tue: false,
  Wed: false,
  Thu: false,
  Fri: false,
  Sat: false,
};
interface SheduleTaskProps extends WithStyles<typeof styles> {
  closeSchedule: () => void;
  taskName?: string;
  selectItem?: any;
  setLoadingtl?;
  scheduleSuccess?: () => void;
}

const SheduleTask: React.FC<SheduleTaskProps> = ({
  classes,
  closeSchedule,
  taskName,
  selectItem,
  setLoadingtl,
  scheduleSuccess,
}) => {
  const tileDesignBar = '/cdap_assets/img/title-design-bar.svg';
  const calendar = '/cdap_assets/img/calendar.svg';
  const timer = '/cdap_assets/img/timer.svg';

  const [checkedItem, setCheckedItem] = React.useState(
    selectItem ? selectItem.item : 'Every 5 min'
  );
  const onItemChecked = (item: string) => {
    setCheckedItem(item);
    setSheduleObj(initialSheduleObj);
  };
  const pickerImage = () => {
    return <img src={calendar} />;
  };
  const { draftObj }: any = useContext(ingestionContext);
  const [selectedTime, setSelectedTime] = React.useState(
    selectItem
      ? selectItem.seletedTime
        ? new Date(selectItem.seletedTime)
        : new Date()
      : new Date()
  );
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date());
  const [loading, setLoading] = React.useState(false);
  const initialSheduleObj = {
    hours: 1,
    minutes: 1,
    days: 1,
    weeks: 1,
    weekDays: initialWeekDays,
    months: 1,
    quarters: 1,
  };
  const [sheduleObj, setSheduleObj] = React.useState(
    selectItem
      ? selectItem.initialSheduleObj
        ? selectItem.initialSheduleObj
        : initialSheduleObj
      : initialSheduleObj
  );

  const handleTimeChange = (date: Date | null) => {
    const datee = new Date();
    if (date === null) {
      setSelectedTime(datee);
    }
    setSelectedTime(date);
  };
  const handleDateChange = (date: Date | null) => {
    if (date === null) {
      setSelectedDate(new Date(0));
    }
    setSelectedDate(date);
  };
  // React.useEffect(() => {
  //   setSheduleObj(initialSheduleObj);
  // }, [checkedItem]);

  const calenderIcon = '/cdap_assets/img/calendar.svg';

  const Calender = () => {
    return <img src={calenderIcon} alt="calenderIcon" />;
  };
  const formatAMPM = (date: Date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    return strTime;
  };
  const formatDateSuffix = (date: Date) => {
    return date.getDate() + 'th';
  };

  const handleIncremtChanges = (type, inputValue) => {
    setSheduleObj((preState) => {
      const copyObj = { ...preState };
      copyObj[type] = inputValue;
      return copyObj;
    });
  };
  const onWeekDayChecked = (e, item) => {
    setSheduleObj((preState) => {
      const copyObj = { ...preState };
      const copyweekObj = { ...copyObj.weekDays };
      copyweekObj[item] = !copyweekObj[item];
      return { ...copyObj, weekDays: copyweekObj };
    });
  };
  const setTimeString = () => {
    switch (checkedItem) {
      case 'Every 5 min': {
        return `*/5 * * * *`;
      }
      case 'Every 10 min': {
        return `*/10 * * * *`;
      }
      case 'Every 30 min': {
        return `*/30 * * * *`;
      }
      case 'Hourly':
        {
          return `${sheduleObj.minutes} */${sheduleObj.hours} * * *`;
        }
        break;
      case 'Daily':
        {
          return `${selectedTime.getMinutes()} ${selectedTime.getHours()} */${sheduleObj.days} * *`;
        }
        break;
      case 'Weekly':
        {
          return `${selectedTime.getMinutes()} ${selectedTime.getHours()} * * ${Object.values(
            sheduleObj.weekDays
          )
            .map((ele, index) => {
              if (ele) {
                return index + 1;
              }
            })
            .join()}`;
        }
        break;
      case 'Monthly': {
        return `${selectedTime.getMinutes()} ${selectedTime.getHours()} ${sheduleObj.days} * *`;
      }
      default:
        break;
    }
  };

  const saveAndShedule = (shedule) => {
    // setLoading(true);
    setLoadingtl(true);
    const sheduleBody = {
      namespace: 'default',
      application: taskName ? taskName : draftObj.name,
      applicationVersion: '-SNAPSHOT',
      name: 'dataPipelineSchedule',
      description: 'Data pipeline schedule',
      program: {
        programName: 'DataPipelineWorkflow',
        programType: 'WORKFLOW',
      },
      properties: {
        'system.profile.name': 'SYSTEM:native',
      },
      trigger: {
        cronExpression: setTimeString(),
        type: 'TIME',
      },
      constraints: [
        {
          maxConcurrency: 1,
          type: 'CONCURRENCY',
          waitUntilMet: false,
        },
      ],
      timeoutMillis: 86400000,
      status: 'SUSPENDED',
      lastUpdateTime: 1628031868239,
    };
    MyPipelineApi.scheduleUpdate(
      {
        namespace: NamespaceStore.getState().selectedNamespace,
        appId: taskName ? taskName : draftObj.name,
        scheduleId: 'dataPipelineSchedule',
      },
      sheduleBody
    ).subscribe(
      (message) => {
        console.log('sheduleUpdate', message);
        if (shedule) {
          MyPipelineApi.schedule(
            {
              namespace: NamespaceStore.getState().selectedNamespace,
              appId: taskName ? taskName : draftObj.name,
              scheduleId: 'dataPipelineSchedule',
            },
            sheduleBody
          ).subscribe(
            (message) => {
              // setLoading(false);
              console.log('shedule', message);
              scheduleSuccess();
            },
            (err) => {
              console.log(err);
            }
          );
        } else {
          setLoading(false);
          scheduleSuccess();
        }
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const renderForm = () => {
    switch (checkedItem) {
      case 'Hourly': {
        return (
          <Box mb={4}>
            <Box mb={1} className={classes.optionsLabel}>
              At what frequency is the event likely repeat?
            </Box>
            <IncrementInput
              initialValue={sheduleObj.hours}
              handleIncremtChanges={(type, inputValue) => handleIncremtChanges(type, inputValue)}
              type={'hours'}
            />
            <div className={classes.container}>
              <Box mb={1} className={classes.optionsLabel2} style={{ marginBottom: '10px' }}>
                When do you want to start this event?{' '}
              </Box>
              <IncrementInput
                initialValue={sheduleObj.minutes}
                handleIncremtChanges={(type, inputValue) => handleIncremtChanges(type, inputValue)}
                type={'minutes'}
              />
            </div>
          </Box>
        );
      }

      case 'Daily': {
        return (
          <Box mb={4}>
            <Box mb={1} className={classes.optionsLabel}>
              At what frequency is the event likely repeat?
            </Box>
            <IncrementInput
              handleIncremtChanges={(type, inputValue) => handleIncremtChanges(type, inputValue)}
              initialValue={sheduleObj.days}
              type={'days'}
            />
            <Box mb={1} className={classes.optionsLabel}>
              When do you want to start this event? ?
            </Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                className={classes.timePicker}
                margin="normal"
                id="time-picker"
                value={selectedTime}
                onChange={handleTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        );
      }

      case 'Weekly':
        {
          return (
            <Box mb={4}>
              <Box mb={1} className={classes.optionsLabel}>
                At what frequency is the event likely repeat?
              </Box>
              <Box mb={2}>
                <Grid container spacing={1}>
                  {Object.keys(sheduleObj.weekDays).map((item, index) => (
                    <Grid item xs={3} key={index}>
                      <Checkbox
                        checked={sheduleObj.weekDays[item]}
                        onChange={(e) => onWeekDayChecked(e, item)}
                        name="checkedB"
                        color="primary"
                      />
                      <label>{item}</label>
                    </Grid>
                  ))}
                </Grid>
              </Box>

              <Box mb={1} className={classes.optionsLabel}>
                When do you want to start this event?
              </Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  className={classes.timePicker}
                  margin="normal"
                  id="time-picker"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
          );
        }
        break;
      case 'Monthly':
        {
          return (
            <Box mb={4}>
              <Box mb={1} className={classes.optionsLabel}>
                At what frequency is the event likely repeat?
              </Box>
              <IncrementInput
                handleIncremtChanges={(type, inputValue) => handleIncremtChanges(type, inputValue)}
                initialValue={sheduleObj.days}
                type={'days'}
              />
              {/* <Box mb={1}>Select date of month?</Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardDatePicker
                  margin="normal"
                  className={classes.timePicker}
                  id="date-picker-dialog"
                  format="MM/dd/yyyy"
                  value={selectedDate}
                  onChange={handleDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
              </MuiPickersUtilsProvider> */}

              <Box mb={1} className={classes.optionsLabel}>
                When do you want to start this event?
              </Box>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <KeyboardTimePicker
                  className={classes.timePicker}
                  margin="normal"
                  id="time-picker"
                  value={selectedTime}
                  onChange={handleTimeChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </MuiPickersUtilsProvider>
            </Box>
          );
        }
        break;
      case 'Yearly': {
        return (
          <Box mb={4}>
            <Box mb={1}>At what frequency is the event likely repeat?</Box>
            <Box mb={1}>Select date of month?</Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardDatePicker
                margin="normal"
                className={classes.timePicker}
                id="date-picker-dialog"
                format="MM/dd/yyyy"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>

            <Box mb={1} className={classes.optionsLabel}>
              When do you want to start this event?
            </Box>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <KeyboardTimePicker
                className={classes.timePicker}
                margin="normal"
                id="time-picker"
                value={selectedTime}
                onChange={handleTimeChange}
                KeyboardButtonProps={{
                  'aria-label': 'change time',
                }}
              />
            </MuiPickersUtilsProvider>
          </Box>
        );
      }

      default:
        break;
    }
  };

  const sheduleLable = () => {
    const string = `The task is scheduled to run every  `;
    switch (checkedItem) {
      case 'Every 5 min': {
        return <span className={classes.sheduleString}>{string} 5 minutes</span>;
      }
      case 'Every 10 min': {
        return <span className={classes.sheduleString}>{string} 10 minutes</span>;
      }
      case 'Every 30 min': {
        return <span className={classes.sheduleString}>{string} 30 minutes</span>;
      }
      case 'Hourly':
        {
          return (
            <span className={classes.sheduleString}>
              {string + (sheduleObj.hours == 1 ? ' hour at ' : sheduleObj.hours + ' hours at  ')}
              {sheduleObj.minutes} minutes past the hour
            </span>
          );
        }
        break;
      case 'Daily':
        {
          return (
            <span className={classes.sheduleString}>
              {string + (sheduleObj.days == 1 ? ' day at ' : sheduleObj.days + ' days at ')}
              {formatAMPM(selectedTime)}
            </span>
          );
        }
        break;
      case 'Weekly':
        {
          return (
            <span className={classes.sheduleString}>
              {string}
              {Object.keys(sheduleObj.weekDays).map((ele) => {
                if (sheduleObj.weekDays[ele]) {
                  return ele + ',';
                }
              })}
              {' at ' + formatAMPM(selectedTime)}
            </span>
          );
        }
        break;
      case 'Monthly':
        {
          return (
            <span className={classes.sheduleString}>
              {string + sheduleObj.days}
              {/* {' on ' + formatDateSuffix(selectedDate)} */}
              {' day of the month, at ' + formatAMPM(selectedTime)}
            </span>
          );
        }
        break;
      case 'Quarterly': {
        return (
          <span className={classes.sheduleString}>
            {string + (sheduleObj.quarters == 1 ? ' quarter ' : sheduleObj.quarters + ' quarters ')}
            {' on ' + formatDateSuffix(selectedDate)}
            {' at ' + formatAMPM(selectedTime)}
          </span>
        );
      }

      default:
        break;
    }
  };

  return (
    <>
      <If condition={loading}>
        <LoadingSVGCentered />
      </If>
      <div className={classes.root}>
        <div className={classes.sdleTskWrapper} data-cy="schedule-wrapper">
          <div className={classes.heading}>
            <Box component="span" mr={2} className={classes.scheduleHeader}>
              Schedule Task
            </Box>
            <img src={tileDesignBar}></img>
          </div>
          <Box mb={2}>
            <Box mb={1} className={classes.scheduleSubHeader}>
              How often will it recur?
            </Box>
            <Grid container className={classes.radioContainer}>
              {recurOptions.map((item, index) => (
                <Grid item xs={4} className={classes.radioButtons} key={index}>
                  <Radio
                    onClick={(e) => {
                      onItemChecked(item);
                    }}
                    checked={checkedItem === item ? true : false}
                    color="primary"
                    size="medium"
                  />
                  <label className={classes.optionsLabel}>{item}</label>
                </Grid>
              ))}
            </Grid>
          </Box>
          <div className={classes.foorm}>{renderForm()}</div>
          <Box
            mt={2}
            display="flex"
            alignItems="center"
            // justifyContent="space-evenly"
            className={classes.msgName}
          >
            <img src={timer} className={classes.timerIcon} />
            <span className={classes.shedulemsg}>{sheduleLable()}</span>
          </Box>
          <div className={classes.btnFooter}>
            {/* <Grid container spacing={0}> */}
            {/* <Grid className={classes.gridItem} item xs={2}> */}
            <Button
              size="medium"
              color="primary"
              onClick={closeSchedule}
              className={classes.cancelButton}
              style={{ marginRight: '30px' }}
            >
              CANCEL
            </Button>
            {/* </Grid> */}
            {/* <Grid className={classes.gridItem} item xs={2}> */}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              className={classes.scheduleButton}
              onClick={(e) => {
                closeSchedule();
                saveAndShedule(false);
              }}
              style={{ marginRight: '30px' }}
            >
              SAVE
            </Button>
            {/* </Grid> */}
            {/* <Grid className={classes.gridItem} item xs={4}> */}
            <Button
              variant="contained"
              size="medium"
              color="primary"
              className={classes.scheduleButton}
              onClick={(e) => {
                closeSchedule();
                saveAndShedule(true);
              }}
            >
              SAVE & SCHEDULE
            </Button>
            {/* </Grid> */}
            {/* </Grid> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default withStyles(styles)(SheduleTask);
