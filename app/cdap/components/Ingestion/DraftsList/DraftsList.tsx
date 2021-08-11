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
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import Table from 'components/Table';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { IconButton } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 66px)', // margin
    },
    header: {
      paddingBottom: '16px',
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#19A347',
      lineHeight: '24px',
      backgroundColor: 'white',
      letterSpacing: 0,
    },
    tableRow: {
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Lato',
      letterSpacing: '0',
      lineHeight: '24px',
      height: '78px',
      color: '#202124',
    },
    gridItem: {
      margin: 'auto',
    },
    paper: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
      textOverflow: 'ellipsis',
    },
    paperCount: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      color: '#4285F4',
    },

    marginLeft: {
      marginLeft: '10px',
    },
    iconButton: {
      ' & button:focus': {
        outline: 'none',
      },
    },
    optionsIcon: {
      //   border: '2px solid blue',
      padding: '6px 12px',
      borderRadius: '99px',
      '&:hover': {
        backgroundColor: '#A5A5A5',
      },
    },
    menuItem: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      boxShadow: 'none',
      lineHeight: '24px',
      padding: '5px 20px',
    },
  };
};

interface DraftsListProps extends WithStyles<typeof styles> {
  searchText: String;
  data: any[];
}

const DraftsList: React.FC<DraftsListProps> = ({ classes, searchText, data }) => {
  const [draftsList, setDraftsList] = React.useState(data);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const filteredList = draftsList.filter((item) =>
    item.pipeLineName.toLowerCase().includes(searchText.toLowerCase())
  );

  const options = ['Edit', 'Delete'];
  const moreImg = '/cdap_assets/img/more.svg';

  return (
    <>
      <div className={classes.root}>
        <Table columnTemplate="2fr 1fr 1fr 1fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell>{'Pipleline name'}</TableCell>
              <TableCell>{'Type'}</TableCell>
              <TableCell>{'Last saved'}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody data-cy="table-body">
            {filteredList.map((item, index) => {
              return (
                <TableRow
                  key={index}
                  className={classes.tableRow}
                  data-cy={`table-row-${item.pipeLineName}`}
                >
                  <TableCell>{item.pipeLineName}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.lastSaved}</TableCell>
                  <TableCell>
                    <Paper className={classes.paper}>
                      <img
                        src={moreImg}
                        // style={{ cursor: 'pointer' }}
                        className={classes.optionsIcon}
                        onClick={(e) => {
                          e.preventDefault();
                          setAnchorEl(e.currentTarget);
                        }}
                      />
                      <Menu
                        id="long-menu"
                        keepMounted
                        anchorEl={anchorEl}
                        open={open}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        onClose={(e) => setAnchorEl(null)}
                        PaperProps={{
                          style: {
                            maxHeight: 48 * 4.5,
                            width: '20ch',
                            marginTop: '40px',
                          },
                        }}
                      >
                        {options.map((option) => (
                          <MenuItem
                            key={option}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              e.nativeEvent.stopImmediatePropagation();
                              // optionSelect(option);
                              setAnchorEl(null);
                            }}
                            className={classes.menuItem}
                          >
                            {option}
                          </MenuItem>
                        ))}
                      </Menu>
                    </Paper>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
};

export default withStyles(styles)(DraftsList);
