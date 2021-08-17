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
import { TextField } from '@material-ui/core';
import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';
import Grid from '@material-ui/core/Grid';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '56px', // margin
      width: '320px',
      border: '1px solid #c8ccd0',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      marginBottom: '10px',
    },
    boxButton: {
      borderLeft: '1px solid #c8ccd0',
      width: '39px',
      height: '100%',
      cursor: 'pointer',
    },
    input: {
      border: 'none',
      height: '54px',
      padding: '0px 10px',
      lineHeight: '24px',
      '& ::before': {
        borderBottom: 'none',
        content: 'none',
      },
      '& ::after': {
        borderBottom: 'none',
        content: 'none',
      },
    },
    spanText: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#666666',
    },
  };
};

interface IncrementInputProps extends WithStyles<typeof styles> {
  type: string;
  handleIncremtChanges: (type: string, inputValue: string) => any;
  initialValue?: number;
}

const IncrementInput: React.FC<IncrementInputProps> = ({
  classes,
  type,
  handleIncremtChanges,
  initialValue,
}) => {
  const [inputValue, setInputValue] = React.useState(initialValue);
  const timeConsts = {
    hours: { value: 23, string: 'Hr' },
    minutes: { value: 59, string: 'Min' },
    days: { value: 31, string: 'Day' },
    weeks: { value: 4, string: 'Week' },
    months: { value: 12, string: 'Month' },
    quarters: { value: 4, string: 'Quarter' },
  };

  React.useEffect(() => {
    handleIncremtChanges(type, inputValue);
  }, [inputValue]);
  React.useEffect(() => {
    setInputValue(initialValue);
  }, [type]);

  const handleChanges = (value: string) => {
    const reg = new RegExp('^[0-9]+$');
    if (reg.test(value)) {
      if (Number(value) <= timeConsts[type].value && Number(value) > 0) {
        setInputValue(value.toString());
      }
    } else if (value == '') {
      setInputValue('');
    }
  };
  const handelIncrement = () => {
    setInputValue((preValue) => {
      if (Number(preValue) <= timeConsts[type].value - 1) {
        return (Number(preValue || 0) + 1).toString();
      } else {
        return preValue;
      }
    });
  };

  const handelDecrement = () => {
    setInputValue((preValue) => {
      if (Number(preValue) > 1) {
        return (Number(preValue) - 1).toString();
      } else {
        return preValue;
      }
    });
  };
  const onBlur = () => {
    if (inputValue == '') {
      setInputValue(initialValue);
    }
  };
  return (
    <>
      <div className={classes.root}>
        <TextField
          autoFocus={false}
          className={classes.input}
          value={inputValue}
          onChange={(e) => {
            handleChanges(e.target.value);
          }}
          onBlur={() => onBlur()}
          InputProps={{ classes: { input: classes.input } }}
        ></TextField>
        <Box mx={2} component="span" className={classes.spanText}>
          {timeConsts[type].string}
        </Box>
        <Box
          className={classes.boxButton}
          display="flex"
          justifyContent="center"
          alignItems="center"
          component="span"
          onClick={(e) => handelDecrement()}
        >
          <RemoveIcon color="primary" />
        </Box>
        <Box
          className={classes.boxButton}
          display="flex"
          justifyContent="center"
          alignItems="center"
          component="span"
          onClick={(e) => handelIncrement()}
        >
          <AddIcon color="primary" />
        </Box>
      </div>
    </>
  );
};

export default withStyles(styles)(IncrementInput);
