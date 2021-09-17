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
import { TextField } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import Box from '@material-ui/core/Box';
import CustomTableFilter from './CustomTableFilter';

const styles = (): StyleRules => {
  return {
    root: {
      display: 'flex',
      height: 'calc(100% - 100px)', // margin
      margin: '23px 28px 20px 40px',
      flexDirection: 'column',
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
      flex: '1',
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '50px',
      alignItems: 'center',
    },
    box: {
      marginTop: '30px',
    },
    gridbox: {
      borderBottom: '1px solid #D4D4D4',
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
    selectAll: {
      textDecoration: 'underline',
      color: '#4285F4',
      marginRight: '10px',
      cursor: 'pointer',
      fontSize: '14px',
    },
  };
};
interface ITableItem {
  tableName: string;
  selected: boolean;
}
interface IIngestionProps extends WithStyles<typeof styles> {
  tablesList: ITableItem[];
  setItems: (items: any) => void;
}

const checkBoxActiv = '/cdap_assets/img/check-box-active.svg';
const checkbox = '/cdap_assets/img/checkbox-normal.svg';
export const CheckedIcon = () => {
  return <img src={checkBoxActiv} alt="icon" height="18px" width="18px" />;
};
export const CheckboxNormal = () => {
  return <img src={checkbox} alt="icon" height="18px" width="18px" />;
};

const CustomTableSelectionView: React.FC<IIngestionProps> = ({
  classes,
  tablesList = [],
  setItems,
}) => {
  const searchIcon = '/cdap_assets/img/search.svg';
  const [search, setSearch] = React.useState('');
  const [radioValue, setRadioValue] = React.useState('All');

  const filteredList = tablesList
    .filter((item) => item.tableName?.toLowerCase().includes(search.toLowerCase()))
    .filter((item) => {
      return (
        (radioValue === 'Selected' && item.selected) ||
        (radioValue === 'Unselected' && !item.selected) ||
        (radioValue === 'All' && true)
      );
    });
  const SearchIconn = () => {
    return <img src={searchIcon} alt="icon" />;
  };
  const isSelectAll = tablesList.every((item) => item.selected);
  const handleChange = (tableName: string) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.tableName === tableName);
      return [
        ...prev.slice(0, index),
        {
          ...prev[index],
          tableName,
          selected: !prev[index].selected,
        },
        ...prev.slice(index + 1),
      ];
    });
  };
  return (
    <div className={classes.container}>
      <div className={classes.headerContainer}>
        <p className={classes.headerText}>Select Tables to Ingest</p>
        <div
          className={classes.selectAll}
          onClick={() => {
            setItems((prev) => {
              return prev.map((item) => ({
                tableName: item.tableName,
                selected: isSelectAll ? false : true,
              }));
            });
          }}
        >
          {isSelectAll ? 'Select None' : ' Select All'}
        </div>
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
        <CustomTableFilter radioValue={radioValue} setRadioValue={setRadioValue} />
      </div>
      <Box className={classes.box}>
        <Grid container spacing={2} data-cy="checkboxes">
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
