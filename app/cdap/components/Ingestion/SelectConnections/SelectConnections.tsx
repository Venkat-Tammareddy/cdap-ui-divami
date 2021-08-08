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
import T from 'i18n-react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import { Button, TextField } from '@material-ui/core';
import TableHeader from 'components/Table/TableHeader';
import TableRow from 'components/Table/TableRow';
import Table from 'components/Table';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import { humanReadableDate } from 'services/helpers';
import OverlaySmall from '../OverlaySmall/OverlaySmall';
import { parseJdbcString } from '../helpers';
const I18N_PREFIX = 'features.SelectConnections';

const styles = (theme): StyleRules => {
  return {
    root: {
      margin: '40px 40px',
      height: 'calc(100% - 100px)', // margin
      display: 'flex',
      flexDirection: 'column',
      color: '#202124',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderRadius: '23px',
        },
        height: '36px',
      },
      '& .MuiOutlinedInput-input': {
        textIndent: '10px',
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
        color: '#ADADAD',
        opacity: '0.5',
      },
      height: '50px',
      boxSizing: 'border-box',
    },

    header: {
      padding: '10px 20px',
      color: '#19A347',
      fontSize: '16px',
      fontFamily: 'Lato',
      fontWeight: 'normal',
      letterSpacing: '0',
      lineHeight: '24px',
      backgroundColor: 'white',
      borderRadius: '4px',
      border: 'none',
      height: '40px',
      borderBottom: '1px solid #D4D4D4',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
    },
    tableRow: {
      padding: '10px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Lato',
      letterSpacing: '0',
      lineHeight: '24px',
      border: 'none',
      borderBottom: '1px solid #DFDFDF',
    },
    tableRowSelected: {
      padding: '10px 20px',
      cursor: 'pointer',
      border: '1px solid gray',
      background: '#F0F0F0',
      fontSize: '14px',
      fontFamily: 'Lato',
    },
    buttonContainer: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'row-reverse',
      gap: '30px',
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
    headerText: {
      color: '#202124',
      fontSize: '18px',
      letterSpacing: '0',
      fontFamily: 'Lato',
      lineHeight: '24px',
      marginBottom: '0px',
      flex: '1',
    },
    emptyList: {
      textAlign: 'center',
      margin: '30px 30px',
    },
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      height: '50px',
    },
    flexHeader: {
      display: 'flex',
      gap: '10px',
    },
    sortIcon: {
      marginLeft: '13.5px',
    },
    errorContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    },
    errorIcon: {
      height: '81px',
      width: '97px',
      marginTop: '116px',
    },
    errorTitle: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      textAlign: 'center',
      marginTop: '20px',
    },
    errorTitle2: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#666666',
      lineHeight: '20px',
      marginTop: '10px',
    },
  };
};

interface ISelectConnectionsProps extends WithStyles<typeof styles> {
  selectionType: string;
  connectionsList: any[];
  submitConnection: (value: object) => void;
  handleCancel: () => void;
  draftConfig;
}

const SelectConnectionsView: React.FC<ISelectConnectionsProps> = ({
  classes,
  selectionType = 'source',
  connectionsList = [],
  submitConnection,
  handleCancel,
  draftConfig,
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedConnection, setSelectedConnection] = React.useState<any>({});
  const [sortType, setSortType] = React.useState('Down');
  const [sortNameType, setSortNameType] = React.useState('Down');
  const [sortDbNameType, setSortDbNameType] = React.useState('Down');
  const [currentSortType, setCurrentSortType] = React.useState('name');
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    selectionType === 'source'
      ? setSelectedConnection(draftConfig.config.stages[0])
      : setSelectedConnection(draftConfig.config.stages[1]);
    return setSearch('');
  }, [selectionType]);

  const filteredList = connectionsList.filter(
    (item) =>
      (item.name.toLowerCase().includes(search.toLowerCase()) ||
        parseJdbcString(
          item.plugin.properties.connectionString,
          item.plugin.properties.jdbcPluginName
        )
          ?.toLowerCase()
          .includes(search.toLowerCase()) ||
        item.plugin.properties.dataset?.toLowerCase().includes(search.toLowerCase())) &&
      ((selectionType === 'source' && item.connectionType.includes('Database')) ||
        (selectionType === 'target' && item.plugin.type.includes('batchsink')))
  );

  const onCancel = (e: React.FormEvent) => {
    handleCancel();
  };

  const changeCursor = (e) => {
    e.target.style.cursor = 'pointer';
  };

  const handleSortToggle = (e) => {
    sortType === 'Down' ? setSortType('Up') : setSortType('Down');
    if (sortType === 'Down') {
      connectionsList.sort((a, b) => (a.createdTimeMillis > b.createdTimeMillis ? -1 : 1));
    } else {
      connectionsList.sort((a, b) => (a.createdTimeMillis > b.createdTimeMillis ? 1 : -1));
    }
  };

  const handleNameSort = (e) => {
    sortNameType === 'Down' ? setSortNameType('Up') : setSortNameType('Down');
    if (sortNameType === 'Down') {
      connectionsList.sort((a, b) => (a.name > b.name ? -1 : 1));
    } else {
      connectionsList.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  };

  const handleDbNameSort = (e) => {
    sortDbNameType === 'Down' ? setSortDbNameType('Up') : setSortDbNameType('Down');
    if (sortNameType === 'Down') {
      connectionsList.sort((a, b) => (a.name > b.name ? -1 : 1));
    } else {
      connectionsList.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
  };

  const sortDownIcon = '/cdap_assets/img/sort-down-arrow.svg';
  const sortUpIcon = '/cdap_assets/img/sort-up-arrow.svg';
  const searchIcon = '/cdap_assets/img/search.svg';
  const noDatabase = '/cdap_assets/img/No database.svg';
  const SearchIcon = () => {
    return <img src={searchIcon} alt="icon" />;
  };
  return (
    <div className={classes.root}>
      <OverlaySmall onCancel={() => setIsOpen(false)} open={isOpen} />
      <div className={classes.headerContainer}>
        {selectionType === 'target' ? (
          <p className={classes.headerText}>{T.translate(`${I18N_PREFIX}.Headers.targetHeader`)}</p>
        ) : (
          <p className={classes.headerText}>{T.translate(`${I18N_PREFIX}.Headers.sourceHeader`)}</p>
        )}
        <TextField
          variant="outlined"
          placeholder={T.translate(`${I18N_PREFIX}.placeholders`).toString()}
          className={classes.search}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: <SearchIcon />,
            classes: {
              input: classes.resize,
            },
          }}
          autoFocus={false}
          data-cy="connections-search"
        />
      </div>

      {filteredList.length === 0 && search.length === 0 ? (
        <div className={classes.errorContainer}>
          <img src={noDatabase} alt="no-database" className={classes.errorIcon} />
          <div className={classes.errorTitle}>
            Looks like you do not have access to the <br /> database connections.
          </div>
          <div className={classes.errorTitle2}>Please check with the IT team</div>
        </div>
      ) : (
        <Table columnTemplate="1fr 1fr 1fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell>
                {T.translate(`${I18N_PREFIX}.Names.database`)}
                <img
                  src={sortDbNameType === 'Down' ? sortDownIcon : sortUpIcon}
                  alt="some down icon sort"
                  height="14px"
                  className={classes.sortIcon}
                  onMouseOver={changeCursor}
                  onClick={handleDbNameSort}
                />{' '}
              </TableCell>
              <TableCell>
                {T.translate(`${I18N_PREFIX}.Names.connection`)}{' '}
                <img
                  src={sortNameType === 'Down' ? sortDownIcon : sortUpIcon}
                  alt="some down icon sort"
                  height="14px"
                  className={classes.sortIcon}
                  onMouseOver={changeCursor}
                  onClick={handleNameSort}
                />
              </TableCell>
              <TableCell>
                <div className="flexHeader">
                  {T.translate(`${I18N_PREFIX}.Names.lastUsedOn`)}
                  <img
                    src={sortType === 'Down' ? sortDownIcon : sortUpIcon}
                    alt="some down icon sort"
                    height="14px"
                    className={classes.sortIcon}
                    onMouseOver={changeCursor}
                    onClick={handleSortToggle}
                  />
                </div>
              </TableCell>
            </TableRow>
          </TableHeader>

          <TableBody data-cy="table-body">
            {filteredList.length === 0 ? (
              <h3 className={classes.emptyList}>
                {search.length === 0
                  ? ''
                  : `There are no databases and connections matching your search '${search}'`}
              </h3>
            ) : (
              filteredList.map((conn, index) => {
                return (
                  <TableRow
                    data-cy={`table-row-${conn.name}`}
                    key={index}
                    className={
                      selectedConnection.name === conn.name
                        ? classes.tableRowSelected
                        : classes.tableRow
                    }
                    onClick={() => setSelectedConnection(conn)}
                  >
                    <TableCell>
                      {selectionType === 'source'
                        ? parseJdbcString(
                            conn.plugin.properties.connectionString,
                            conn.plugin.properties.jdbcPluginName
                          )
                        : conn.plugin.properties.dataset}
                    </TableCell>
                    <TableCell>{conn.name}</TableCell>
                    <TableCell>{humanReadableDate(conn.updatedTimeMillis, true)}</TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      )}
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
          disabled={Object.keys(selectedConnection).length === 0}
        >
          CONTINUE
        </Button>
        <Button className={classes.cancelButton} onClick={onCancel}>
          CANCEL
        </Button>
      </div>
    </div>
  );
};

const SelectConnections = withStyles(styles)(SelectConnectionsView);
export default SelectConnections;
