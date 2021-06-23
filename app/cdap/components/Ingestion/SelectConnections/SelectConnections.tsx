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
import { Button, TextField } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import Table from 'components/Table';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import { humanReadableDate } from 'services/helpers';

const styles = (theme): StyleRules => {
  return {
    root: {
      margin: '50px 50px',
      height: 'calc(100% - 100px)', // margin
      display: 'flex',
      flexDirection: 'column',
    },
    search: {
      width: '100%',
      marginBottom: '15px',
    },
    resize: {
      fontSize: '15px',
    },
    tableWrapper: {
      marginTop: '20px',
      border: '2px solid red',
      flex: '1 1 0%',
    },
    header: {
      padding: '10px 20px',
    },
    tableRow: {
      padding: '10px 20px',
      cursor: 'pointer',
    },
    tableRowSelected: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: '1px solid gray',
      background: '#F0F0F0',
    },
    buttonContainer: {
      marginTop: '50px',
      display: 'flex',
      flexDirection: 'row-reverse',
      gap: '50px',
    },
    cancelButton: {
      textDecoration: 'none',
      color: '#2196f3',
    },
    submitButton: {
      backgroundColor: '#2196f3',
    },
  };
};

interface ISelectConnectionsProps extends WithStyles<typeof styles> {
  selectionType: string;
  connectionsList: any[];
  submitConnection: (value: object) => void;
}
const SelectConnectionsView: React.FC<ISelectConnectionsProps> = ({
  classes,
  selectionType,
  connectionsList = [],
  submitConnection,
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedConnection, setSelectedConnection] = React.useState({});

  // const filteredList = connectionsList.filter(
  //   (item) =>
  //     item.plugin.properties.referenceName.toLowerCase().includes(search.toLowerCase()) ||
  //     item.name.toLowerCase().includes(search.toLowerCase())
  // );
  return (
    <div className={classes.root}>
      {selectionType === 'target' ? (
        <h3>Select Target Database Connection</h3>
      ) : (
        <h3>Select Source Database Connection</h3>
      )}
      <TextField
        variant="outlined"
        name="taskName"
        placeholder="Search Databases & Connections"
        className={classes.search}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        InputProps={{
          endAdornment: <SearchIcon />,
          classes: {
            input: classes.resize,
          },
        }}
        autoFocus={false}
      />
      <Table columnTemplate="2fr 1fr 1fr">
        <TableHeader>
          <TableRow className={classes.header}>
            <TableCell>Database</TableCell>
            <TableCell>Connection</TableCell>
            <TableCell>Last used on</TableCell>
          </TableRow>
        </TableHeader>

        <TableBody>
          {connectionsList.map((conn) => {
            return (
              <TableRow
                key={conn.plugin.properties.referenceName}
                className={
                  selectedConnection === conn ? classes.tableRowSelected : classes.tableRow
                }
                onClick={() => setSelectedConnection(conn)}
              >
                <TableCell>
                  {conn.connectionType === 'Database'
                    ? conn.plugin.properties.referenceName
                    : conn.plugin.properties.project}
                </TableCell>
                <TableCell>{conn.name}</TableCell>
                <TableCell>{humanReadableDate(conn.updatedTimeMillis)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      <div className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            Object.keys(selectedConnection).length !== 0 &&
              (submitConnection(selectedConnection), setSelectedConnection({}));
          }}
          className={classes.submitButton}
          type="submit"
        >
          CONTINUE
        </Button>
        <Button className={classes.cancelButton}>CANCEL</Button>
      </div>
    </div>
  );
};

const SelectConnections = withStyles(styles)(SelectConnectionsView);
export default SelectConnections;
