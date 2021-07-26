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
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { Button, Select, TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';

const styles = (): StyleRules => {
  return {
    root: {
      display: 'flex',
      height: 'calc(100% - 100px)', // margin
      margin: '23px 28px 20px 40px',
      flexDirection: 'column',
      '& .MuiTypography-body1': {
        fontSize: '14px',
        color: '#202124',
        lineHeight: '24px',
        fontFamily: 'Lato',
      },
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderRadius: '23px',
        },
        height: '36px',
      },
    },
    selectAndTextfield: {
      display: 'flex',
      marginTop: '20px',
      alignItems: 'center',
      border: '2px solid #202124',
      borderRadius: '4px',
      gap: '20px',
      padding: '12px 17.5px 14px 16px',
    },
    searchBox: {
      display: 'flex',
      gap: '10px',
      border: 'none',
    },
    searchTextField: {
      width: '100%',
      flex: '1',
      paddingRight: '17.5px',
    },
    buttonContainer: {
      display: 'flex',
      gap: '30px',
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
    details: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '10px',
    },
    selectHeader: {
      fontSize: '20px',
      color: '#202124',
      letterSpacing: '0',
      fontFamily: 'Lato',
      marginBottom: '0',
      flex: '1',
      minWidth: 'max-content',
    },
    tableCount: {
      fontSize: '14px',
      color: '#666666',
      letterSpacing: '0',
      fontFamily: 'Lato',
      minWidth: 'max-content',
    },
    selectAllText: {
      fontSize: '14px',
      color: '#4285F4',
      letterSpacing: '1.25px',
      lineHeight: '24px',
      fontFamily: 'Lato',
      minWidth: 'max-content',
    },
    select: {
      width: '10%',
    },
    selectLabel: {
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0.15px',
      fontFamily: 'Lato',
    },
    separator: {
      width: '2px',
      borderLeft: 'solid #979797 2px',
      display: 'inline-block',
      height: '30px',
    },
    container: {
      flex: '1 1 0%',
    },
    search: {
      width: '276px',
      height: '36px',
    },
    resize: {
      fontSize: '14px',
      '&::placeholder': {
        fontFamily: 'Lato',
        color: '#666666',
        paddingLeft: '11px',
        opacity: '0.5',
      },
      height: '50px',
      boxSizing: 'border-box',
    },
    headerText: {
      color: '#202124',
      fontSize: '18px',
      letterSpacing: '0.45px',
      fontFamily: 'Lato',
      marginBottom: '0px',
      paddingTop: '7px',
      flex: '1',
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '50px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    box: {
      marginTop: '30px',
    },
    gridbox: {
      borderBottom: '1px solid #D4D4D4',
    },
    filterIcon: {
      marginLeft: '10px',
    },
    checkboxes: { margin: '0', padding: '0' },
    labelText: {
      margin: '0',
      paddingTop: '9.5px',
      paddingBottom: '7.5px',
      paddingLeft: '21px',
      fontSize: '14px',
      fontFamily: 'Lato',
      color: '#202124',
      letterSpacing: '0',
      lineHeight: '24px',
      cursor: 'pointer',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  submitValues: ([]) => void;
  handleCancel: () => void;
}

const CustomTableSelectionView: React.FC<IIngestionProps> = ({
  classes,
  submitValues,
  handleCancel,
}) => {
  const tableMockData = [
    'table_one',
    'table_two',
    'table_three',
    'table_four',
    'table_five',
    'table_six',
    'table_seven',
    'table_eight',
    'table_nine',
    'table_ten',
    'table_eleven',
    'table_twelve',
    'table_thirteen',
    'table_fourteen',
    'table_fifteen',
    'table_sixteen',
    'table_seventeen',
    'table_eighteen',
  ];

  const [checkedItems, setCheckedItems] = React.useState<any>({});
  const [currentChecked, setCurrentChecked] = React.useState<string[]>([]);
  const filterIcon = '/cdap_assets/img/filter.svg';
  const checkBoxActiv = '/cdap_assets/img/check-box-active.svg';
  const search = '/cdap_assets/img/search.svg';
  const checkbox = '/cdap_assets/img/checkbox-normal.svg';

  React.useEffect(() => {
    if (Object.keys(checkedItems).length !== 0) {
      const result = Object.keys(checkedItems).filter((item) => checkedItems[item] === true);
      setCurrentChecked(result);
    }
  }, [checkedItems]);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    submitValues(currentChecked);
  };
  const handleOnChange = (e: any) => {
    setCheckedItems({
      ...checkedItems,
      [e.target.name]: e.target.checked,
    });
  };

  const CheckedIcon = () => {
    return <img src={checkBoxActiv} alt="icon" height="18px" width="18px" />;
  };
  const SearchIconn = () => {
    return <img src={search} alt="icon" height="18px" width="18px" />;
  };

  const CheckboxNormal = () => {
    return <img src={checkbox} alt="icon" height="18px" width="18px" />;
  };
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <div className={classes.container}>
        <div className={classes.headerContainer}>
          <p className={classes.headerText}>Select Tables to Ingest</p>
          <TextField
            variant="outlined"
            placeholder="Search tables"
            className={classes.search}
            InputProps={{
              startAdornment: <SearchIconn />,
              classes: {
                input: classes.resize,
              },
            }}
            autoFocus={false}
            data-cy="connections-search"
          />
          <img
            src={filterIcon}
            alt="filter icon"
            height="17.1px"
            width="18px"
            className={classes.filterIcon}
          />
        </div>
        <Box className={classes.box}>
          <Grid container spacing={2}>
            {tableMockData.map((item) => (
              <Grid item xs={4} className={classes.gridbox}>
                <Checkbox
                  checked={checkedItems[item]}
                  onChange={handleOnChange}
                  name={item}
                  className={classes.checkboxes}
                  icon={<CheckboxNormal />}
                  checkedIcon={<CheckedIcon />}
                />
                <label className={classes.labelText}>{item}</label>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton} onClick={handleCancel}>
          CANCEL
        </Button>
        <Button variant="contained" color="primary" className={classes.submitButton} type="submit">
          CONTINUE
        </Button>
      </div>
    </form>
  );
};

const CustomTableSelection = withStyles(styles)(CustomTableSelectionView);
export default CustomTableSelection;
