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
import { Checkbox, Menu, MenuItem, Radio } from '@material-ui/core';
import { CheckboxNormal, CheckedIcon } from './CustomTableSelection';

const styles = (theme): StyleRules => {
  return {
    root: {
      border: '1px solid red',
    },
    filterIcon: {
      marginLeft: '10px',
      cursor: 'pointer',
    },
  };
};

interface ICustomTableFilterProps extends WithStyles<typeof styles> {
  test?: string;
  radioValue: string;
  setRadioValue: (value: string) => void;
}
const CustomTableFilterView: React.FC<ICustomTableFilterProps> = ({
  classes,
  radioValue,
  setRadioValue,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const filterIcon = '/cdap_assets/img/filter.svg';
  const options = ['All', 'Selected', 'Unselected'];
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
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
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {options.map((option) => (
          <MenuItem
            key={option}
            onClick={(e) => {
              handleClose();
              setRadioValue(option);
            }}
          >
            <Checkbox
              className={classes.checkbox}
              checked={radioValue === 'All' || option === radioValue}
              name={option}
              icon={<CheckboxNormal />}
              checkedIcon={<CheckedIcon />}
              color="primary"
            />
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const CustomTableFilter = withStyles(styles)(CustomTableFilterView);
export default CustomTableFilter;
