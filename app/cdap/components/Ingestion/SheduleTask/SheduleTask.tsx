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
import { TimePicker } from 'antd';
import 'antd/dist/antd.css';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 48px)', // margin
      background: '#9898989c',
      position: 'fixed',
      width: '100%',
      zIndex: 10,
      top: '48px',
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
    },
    heading: {
      fontSize: '20px',
      marginBottom: '29px',
    },
    btnFooter: {
      position: 'absolute',
      width: '100%',
      bottom: '51px',
      paddingRight: '36px',
    },
    timePicker: {
      border: '1px solid #c8ccd0',
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
  };
};
const recurOptions = [
  // 'Every 5 min',
  // 'Every 10 min',
  // 'Every 30 min',
  'Hourly',
  'Daily',
  'Weekly',
  'Monthly',
  'Yearly',
];

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
interface SheduleTaskProps extends WithStyles<typeof styles> {}

const SheduleTask: React.FC<SheduleTaskProps> = ({ classes }) => {
  const tileDesignBar = '/cdap_assets/img/title-design-bar.svg';

  const [checkedItem, setCheckedItem] = React.useState('Hourly');
  const onItemChecked = (item: string) => {
    setCheckedItem(item);
  };

  const renderForm = () => {
    switch (checkedItem) {
      case 'Hourly': {
        return (
          <Box mb={4}>
            <Box mb={2}>At what frequency is the event likely repeat?</Box>
            <IncrementInput type={'hour'} />
            <Box mb={2}>When do you want to start this event? ?</Box>
            <TimePicker
              style={{ width: '320px', height: '56px', borderRadius: '4px' }}
              use12Hours
              format="h:mm a"
              // onChange={onChange}
            />
          </Box>
        );
      }

      case 'Daily' || 'Monthly':
        {
          return (
            <Box mb={4}>
              <Box mb={2}>At what frequency is the event likely repeat?</Box>
              <IncrementInput type={'days'} />
              <Box mb={2}>Starting At ?</Box>
              <TextField
                id="time"
                type="time"
                defaultValue="07:40"
                className={classes.timePicker}
                InputLabelProps={{
                  shrink: true,
                }}
                inputProps={{
                  endAdornment: <SearchIcon />,
                  step: 300, // 5 min
                }}
              />
            </Box>
          );
        }
        break;

      case 'Weekly': {
      }

      default:
        break;
    }
  };

  return (
    <>
      <div className={classes.root}>
        <div className={classes.sdleTskWrapper}>
          <div className={classes.heading}>
            <Box component="span" mr={2}>
              Shedule Task
            </Box>
            <img src={tileDesignBar}></img>
          </div>
          <Box mb={2}>
            <Box mb={1}>How often will it recur?</Box>
            <Grid container spacing={1}>
              {recurOptions.map((item, index) => (
                <Grid item xs={4}>
                  <Radio
                    onClick={(e) => {
                      onItemChecked(item);
                    }}
                    checked={checkedItem == item ? true : false}
                    size="medium"
                    color="primary"
                  />
                  <label>{item}</label>
                </Grid>
              ))}
            </Grid>
          </Box>
          {renderForm()}
          <Box className={classes.btnFooter}>
            <Grid container spacing={0}>
              <Grid className={classes.gridItem} item xs={6}></Grid>
              <Grid className={classes.gridItem} item xs={3}>
                <Button variant="outlined" size="medium" color="primary" className={classes.margin}>
                  CANCEL
                </Button>
              </Grid>
              <Grid className={classes.gridItem} item xs={3}>
                <Button
                  variant="contained"
                  size="medium"
                  color="primary"
                  className={classes.margin}
                >
                  SHEDULE
                </Button>
              </Grid>
            </Grid>
          </Box>
        </div>
      </div>
    </>
  );
};

export default withStyles(styles)(SheduleTask);
