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
    },
    gridItem: {
      margin: 'auto',
    },
    paper: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
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
  };
};

interface DraftsListProps extends WithStyles<typeof styles> {
  searchText: String;
}

const DraftsList: React.FC<DraftsListProps> = ({ classes, searchText }) => {
  const [draftsList, setDraftsList] = React.useState([
    {
      pipeLineName: 'one task',
      type: 'Batch',
      lastSaved: '07-09-2021 07:55:34 AM',
    },
    {
      pipeLineName: 'two task',
      type: 'Batch',
      lastSaved: '07-09-2021 07:55:34 AM',
    },
    {
      pipeLineName: 'Three task',
      type: 'Batch',
      lastSaved: '07-09-2021 07:55:34 AM',
    },
  ]);

  const filteredList = draftsList.filter((item) =>
    item.pipeLineName.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <div className={classes.root}>
        <Table columnTemplate="2fr 1fr 1fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell>{'Pipleline name'}</TableCell>
              <TableCell>{'Type'}</TableCell>
              <TableCell>{'Last saved'}</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody data-cy="table-body">
            {filteredList.map((item, index) => {
              return (
                <TableRow key={index} className={classes.tableRow} data-cy={`table-row-${item.pipeLineName}`}>
                  <TableCell>{item.pipeLineName}</TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.lastSaved}</TableCell>
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
