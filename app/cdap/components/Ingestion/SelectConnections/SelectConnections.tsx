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
import { parseJdbcString } from '../helpers';
import produce from 'immer';
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
      padding: '10px 0px',
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
      padding: '12px 20px',
      cursor: 'pointer',
      fontSize: '14px',
      fontFamily: 'Lato',
      borderBottom: '1px solid #DFDFDF',
    },
    tableRowSelected: {
      padding: '10.28px 20px',
      cursor: 'pointer',
      background: 'rgb(66,133,244,.15)',
      fontSize: '14px',
      fontFamily: 'Lato',
      borderBottom: '1px solid #DFDFDF',
    },
    buttonContainer: {
      marginTop: 'auto',
      display: 'flex',
      flexDirection: 'row-reverse',
      paddingTop: '50px',
    },
    cancelButton: {
      textDecoration: 'none',
      color: '#4285F4;',
      outline: 'none',
      fontSize: '14px',
      letterSpacing: '1.25px',
      lineHeight: '24px',
      fontFamily: 'Lato',
      marginRight: '30px',
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
      marginLeft: '8px',
    },
    sortIcon: {
      marginLeft: '13.5px',
      cursor: 'pointer',
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
  setDraftConfig: (values: object) => void;
  handleNext: () => void;
  handleCancel: () => void;
  artifactsList: any[];
  draftConfig;
  connectionsList: any[];
  activeStep: number;
}

const SelectConnectionsView: React.FC<ISelectConnectionsProps> = ({
  classes,
  connectionsList = [],
  handleCancel,
  draftConfig,
  activeStep,
  artifactsList,
  handleNext,
  setDraftConfig,
}) => {
  const [search, setSearch] = React.useState('');
  const [selectedConnection, setSelectedConnection] = React.useState<any>({});
  const [sortType, setSortType] = React.useState('Down');
  const [sortNameType, setSortNameType] = React.useState('Down');
  const [sortDbNameType, setSortDbNameType] = React.useState('Down');
  const [header, setHeader] = React.useState('lastUsed');
  const selectionType = activeStep === 1 ? 'source' : 'target';
  const [showIcon, setShowIcon] = React.useState(false);
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
  const handleSubmit = () => {
    selectionType === 'source'
      ? setDraftConfig(
          produce((prevDraft) => {
            prevDraft.config.connections[0].from = selectedConnection.name;
            prevDraft.config.stages[0] = {
              name: selectedConnection.name,
              connectionType: selectedConnection.connectionType,
              plugin: {
                name: 'MultiTableDatabase',
                type: 'batchsource',
                artifact: artifactsList.find((artifact) => artifact.name === 'multi-table-plugins'),
                properties: {
                  ...selectedConnection.plugin.properties,
                  referenceName: 'ingestion-multitable-bigquery',
                },
              },
              id: selectedConnection.name,
            };
          })
        )
      : setDraftConfig(
          produce((prevDraft) => {
            prevDraft.config.connections[0].to = selectedConnection.name;
            prevDraft.config.stages[1] = {
              name: selectedConnection.name,
              connectionType: selectedConnection.connectionType,
              plugin: {
                ...selectedConnection.plugin,
                artifact: artifactsList.find((artifact) => artifact.name === 'google-cloud'),
              },
              id: selectedConnection.name,
            };
          })
        );

    handleNext();
    setSelectedConnection({});
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
    if (selectionType === 'source') {
      if (sortNameType === 'Down') {
        connectionsList.sort((a, b) =>
          parseJdbcString(
            a.plugin.properties.connectionString,
            a.plugin.properties.jdbcPluginName
          ) >
          parseJdbcString(b.plugin.properties.connectionString, b.plugin.properties.jdbcPluginName)
            ? -1
            : 1
        );
      } else {
        connectionsList.sort((a, b) =>
          parseJdbcString(
            a.plugin.properties.connectionString,
            a.plugin.properties.jdbcPluginName
          ) >
          parseJdbcString(b.plugin.properties.connectionString, b.plugin.properties.jdbcPluginName)
            ? 1
            : -1
        );
      }
      sortDbNameType === 'Down' ? setSortDbNameType('Up') : setSortDbNameType('Down');
    } else {
      if (sortNameType === 'Down') {
        connectionsList.sort((a, b) =>
          a.plugin.properties.dataset > b.plugin.properties.dataset ? -1 : 1
        );
      } else {
        connectionsList.sort((a, b) =>
          a.plugin.properties.dataset > b.plugin.properties.dataset ? 1 : -1
        );
      }
    }
    sortNameType === 'Down' ? setSortNameType('Up') : setSortNameType('Down');
  };

  const sortDownIcon = '/cdap_assets/img/sort-down-arrow.svg';
  const sortUpIcon = '/cdap_assets/img/sort-up-arrow.svg';
  const searchIcon = '/cdap_assets/img/search.svg';
  const noDatabase = '/cdap_assets/img/No database.svg';
  const tickIcon = '/cdap_assets/img/card-section-tick.svg';
  const SearchIcon = () => {
    return <img src={searchIcon} alt="icon" />;
  };

  return (
    <div className={classes.root}>
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
        <Table columnTemplate="1fr 1fr 2fr 0.4fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell onClick={() => setHeader('dbName')}>
                {T.translate(`${I18N_PREFIX}.Names.database`)}
                {header === 'dbName' && (
                  <img
                    src={sortDbNameType === 'Down' ? sortDownIcon : sortUpIcon}
                    alt="some down icon sort"
                    className={classes.sortIcon}
                    onClick={handleDbNameSort}
                  />
                )}
              </TableCell>
              <TableCell onClick={() => setHeader('connName')}>
                {T.translate(`${I18N_PREFIX}.Names.connection`)}{' '}
                {header === 'connName' && (
                  <img
                    src={sortNameType === 'Down' ? sortDownIcon : sortUpIcon}
                    alt="some down icon sort"
                    className={classes.sortIcon}
                    onClick={handleNameSort}
                  />
                )}
              </TableCell>
              <TableCell onClick={() => setHeader('lastUsed')}>
                {T.translate(`${I18N_PREFIX}.Names.lastUsedOn`)}
                {header === 'lastUsed' && (
                  <img
                    src={sortType === 'Down' ? sortDownIcon : sortUpIcon}
                    alt="some down icon sort"
                    className={classes.sortIcon}
                    onClick={handleSortToggle}
                  />
                )}
              </TableCell>
              <TableCell></TableCell>
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
                    onClick={() => {
                      setSelectedConnection(conn);
                    }}
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
                    <TableCell>
                      {selectedConnection.name === conn.name && (
                        <img
                          src={tickIcon}
                          style={{ margin: '0px', padding: '0px', height: '24px' }}
                        />
                      )}
                    </TableCell>
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
            Object.keys(selectedConnection).length !== 0 && handleSubmit();
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
