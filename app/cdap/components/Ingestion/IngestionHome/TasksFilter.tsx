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
import { Button, Checkbox, Menu, MenuItem } from '@material-ui/core';
import { CheckboxNormal, CheckedIcon } from '../CustomTableSelection/CustomTableSelection';

const styles = (theme): StyleRules => {
  return {
    filterIcn: {
      paddingTop: '10px',
      cursor: 'pointer',
    },

    checkbox: {
      margin: '0',
    },
    filterTitle: {
      fontFamily: 'Lato',
      color: '#202124',
      fontSize: '18px',
      letterSpacing: '0',
      marginLeft: '19px',
      marginTop: '20px',
      marginBottom: '2',
    },
    applyButton: {
      marginLeft: '62px',
      width: '80px',
      fontSize: '14px',
      marginTop: '6px',
      '&:focus': {
        outline: 'none',
      },
    },
    menuItem: {
      height: '34px',
      paddingTop: '11px',
      fontSize: '16px',
      fontFamily: 'Lato',
    },
    hrLine: {
      width: '90%',
      borderTop: '1px solid #A5A5A5',
    },
  };
};

interface ITasksFilterProps extends WithStyles<typeof styles> {
  filters: string[];
  applyFilters: (filters: string[]) => void;
}
const TasksFilterView: React.FC<ITasksFilterProps> = ({ classes, filters, applyFilters }) => {
  const filterIcon = '/cdap_assets/img/filter.svg';
  const list = ['DEPLOYED', 'COMPLETED', 'FAILED', 'KILLED'];
  const [filterOptions, setFilterOptions] = React.useState(
    list.map((item) => ({
      value: item,
      selected: filters.includes(item),
    }))
  );

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const isAllSelected = filterOptions.every((item) => item.selected);
  return (
    <>
      <img
        src={filterIcon}
        className={classes.filterIcn}
        alt="get a good browser"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          setAnchorEl(e.currentTarget);
        }}
      />
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={open}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          setAnchorEl(null);
        }}
        PaperProps={{
          style: {
            height: '327px',
            width: '204px',
            marginTop: '20px',
          },
        }}
      >
        <p className={classes.filterTitle}>Filter by Status</p>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            setFilterOptions((prev) => {
              return prev.map((item) => {
                return {
                  ...item,
                  selected: isAllSelected ? false : true,
                };
              });
            });
          }}
          className={classes.menuItem}
        >
          <Checkbox
            className={classes.checkbox}
            checked={isAllSelected}
            name="All"
            icon={<CheckboxNormal />}
            checkedIcon={<CheckedIcon />}
            color="primary"
          />
          All
        </MenuItem>
        {filterOptions.map((option) => (
          <MenuItem
            key={option.value}
            onClick={(e) => {
              e.preventDefault();
              setFilterOptions((prev) => {
                return prev.map((item) => {
                  return {
                    ...item,
                    selected: option.value === item.value ? !item.selected : item.selected,
                  };
                });
              });
            }}
            className={classes.menuItem}
          >
            <Checkbox
              className={classes.checkbox}
              checked={option.selected}
              name={option.value}
              icon={<CheckboxNormal />}
              checkedIcon={<CheckedIcon />}
              color="primary"
            />
            {option.value}
          </MenuItem>
        ))}
        <hr className={classes.hrLine} />
        <Button
          disabled={filterOptions.every((item) => item.selected === false)}
          variant="contained"
          color="primary"
          className={classes.applyButton}
          onClick={() =>
            applyFilters(filterOptions.filter((item) => item.selected).map((item) => item.value))
          }
        >
          APPLY
        </Button>
      </Menu>
    </>
  );
};

const TasksFilter = withStyles(styles)(TasksFilterView);
export default TasksFilter;
