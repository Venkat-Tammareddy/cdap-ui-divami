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
import { Menu, MenuItem, Paper } from '@material-ui/core';
import { MyMetadataApi } from 'api/metadata';
import NamespaceStore, { getCurrentNamespace } from 'services/NamespaceStore';
import history from 'services/history';
import { MyPipelineApi } from 'api/pipeline';

const styles = (theme): StyleRules => {
  return {
    paper: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      textOverflow: 'ellipsis',
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
  };
};

interface IDraftOptionsProps extends WithStyles<typeof styles> {
  draftId: string;
  deleteDraft: (draftId: string) => void;
}
const DraftOptionsView: React.FC<IDraftOptionsProps> = ({ classes, draftId, deleteDraft }) => {
  const moreImg = '/cdap_assets/img/more.svg';
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const options = ['Edit', 'Delete'];

  const optionSelect = (type: string, draftId: string) => {
    console.log('tt', draftId);
    type === 'Delete' && deleteDraft(draftId);
    type === 'Edit' && history.push(`/ns/${getCurrentNamespace()}/ingestion/create/${draftId}`);
  };
  return (
    <Paper className={classes.paper}>
      <img
        src={moreImg}
        // style={{ cursor: 'pointer' }}
        className={classes.optionsIcon}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
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
        onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          setAnchorEl(null);
        }}
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
              optionSelect(option, draftId);
              setAnchorEl(null);
            }}
            className={classes.menuItem}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </Paper>
  );
};

const DraftOptions = withStyles(styles)(DraftOptionsView);
export default DraftOptions;
