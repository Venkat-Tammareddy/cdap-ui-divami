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
import { Menu, MenuItem, Radio, TextField } from '@material-ui/core';
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
      cursor: 'pointer',
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
interface ITableItem {
  tableName: string;
  selected: boolean;
}
interface IIngestionProps extends WithStyles<typeof styles> {
  tablesList: ITableItem[];
  handleChange: (tableName: string) => void;
}

const CustomTableSelectionView: React.FC<IIngestionProps> = ({
  classes,
  tablesList = [],
  handleChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const filterIcon = '/cdap_assets/img/filter.svg';
  const checkBoxActiv = '/cdap_assets/img/check-box-active.svg';
  const searchIcon = '/cdap_assets/img/search.svg';
  const checkbox = '/cdap_assets/img/checkbox-normal.svg';
  const options = ['All', 'Selected', 'Unselected'];
  const [radioValue, selectedRadioValue] = React.useState('all');
  const [search, setSearch] = React.useState('');
  const filteredList = tablesList.filter((item) =>
    item.tableName?.toLowerCase().includes(search.toLowerCase())
  );
  const CheckedIcon = () => {
    return <img src={checkBoxActiv} alt="icon" height="18px" width="18px" />;
  };
  const SearchIconn = () => {
    return <img src={searchIcon} alt="icon" height="18px" width="18px" />;
  };

  const CheckboxNormal = () => {
    return <img src={checkbox} alt="icon" height="18px" width="18px" />;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRadioChange = (e) => {
    selectedRadioValue(e.target.value);
  };

  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <p className={classes.headerText}>Select Tables to Ingest</p>
        <TextField
          variant="outlined"
          placeholder="Search tables"
          className={classes.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          onClick={(e) => setAnchorEl(e.currentTarget)}
        />
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {options.map((option) => (
            <MenuItem
              key={option}
              onClick={(e) => {
                handleClose();
              }}
            >
              <Radio checked={radioValue === option} onChange={handleRadioChange} value={option} />
              {option}
            </MenuItem>
          ))}
        </Menu>
      </div>
      <Box className={classes.box}>
        <Grid container spacing={2}>
          {filteredList.length === 0 ? (
            <h3 className={classes.emptyList}>
              {search.length === 0 ? '' : `There are no tables matching your search '${search}'`}
            </h3>
          ) : (
            filteredList.map((item) => (
              <Grid item xs={4} className={classes.gridbox} key={item.tableName}>
                <Checkbox
                  checked={item.selected}
                  onChange={() => handleChange(item.tableName)}
                  name={item.tableName}
                  className={classes.checkboxes}
                  icon={<CheckboxNormal />}
                  checkedIcon={<CheckedIcon />}
                  color="primary"
                />
                <label className={classes.labelText}>{item.tableName}</label>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </div>
  );
};

const CustomTableSelection = withStyles(styles)(CustomTableSelectionView);
export default CustomTableSelection;
