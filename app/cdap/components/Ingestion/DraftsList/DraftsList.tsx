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
import { MyPipelineApi } from 'api/pipeline';
import TableRow from 'components/Table/TableRow';
import Table from 'components/Table';
import NamespaceStore from 'services/NamespaceStore';
import TableCell from 'components/Table/TableCell';
import TableBody from 'components/Table/TableBody';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { Paper, Menu, MenuItem } from '@material-ui/core';
import history from 'services/history';
import DraftOptions from './DraftOptions';
import OverlaySmall from '../OverlaySmall/OverlaySmall';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 66px)', // margin
    },
    header: {
      paddingBottom: '10.5px',
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#19A347',
      lineHeight: '24px',
      backgroundColor: 'white',
      letterSpacing: 0,
      fontWeight: 'normal',
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
      fontSize: '16px',
      color: '#202124',
      padding: '5px 20px',
    },
    firstColumn: {
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
    },
  };
};

interface DraftsListProps extends WithStyles<typeof styles> {
  searchText: String;
  data: any[];
  reFetchDrafts: () => void;
}

const DraftsList: React.FC<DraftsListProps> = ({ classes, searchText, data, reFetchDrafts }) => {
  const [alert, setAlert] = React.useState<string | null>(null);
  const filteredList = data.filter((item) =>
    item.pipeLineName.toLowerCase().includes(searchText.toLowerCase())
  );
  const namespace = NamespaceStore.getState().selectedNamespace;
  const deleteDraft = () => {
    MyPipelineApi.deleteDraft({
      context: namespace,
      draftId: alert,
    }).subscribe(
      (message) => {
        reFetchDrafts();
      },
      (err) => {
        console.log('d-e', err);
      }
    );
  };
  return (
    <>
      <div className={classes.root}>
        <OverlaySmall
          onCancel={() => setAlert(null)}
          open={!!alert}
          title="Confirm delete"
          description={`Are you sure you want to delete this pipeline draft?`}
          onSubmit={() => deleteDraft()}
          submitText="Delete"
        />
        <Table columnTemplate="2fr 2fr 2fr 1fr">
          <TableHeader data-cy="table-header">
            <TableRow className={classes.header} data-cy="table-row">
              <TableCell>{'Pipeline name'}</TableCell>
              <TableCell>{'Type'}</TableCell>
              <TableCell>{'Last saved'}</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHeader>
          <TableBody data-cy="table-body">
            {filteredList.map((item) => {
              return (
                <TableRow
                  key={item.id}
                  className={classes.tableRow}
                  data-cy={`table-row-${item.pipeLineName}`}
                  to={`/ns/${getCurrentNamespace()}/ingestion/create/${item.id}`}
                >
                  <TableCell className={classes.firstColumn} title={item.pipeLineName}>
                    {item.pipeLineName}
                  </TableCell>
                  <TableCell>{item.type}</TableCell>
                  <TableCell>{item.lastSaved}</TableCell>
                  <TableCell>
                    <DraftOptions draftId={item.id} deleteDraft={(draftId) => setAlert(draftId)} />
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
