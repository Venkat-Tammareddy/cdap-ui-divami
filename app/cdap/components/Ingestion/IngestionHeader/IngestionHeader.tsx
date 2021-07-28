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
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import history from 'services/history';
import NamespaceStore from 'services/NamespaceStore';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      margin: '0px 28px',
    },
    title: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      letterSpacing: '0',
      marginRight: 'auto',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
    },
    title2: {
      borderLeft: '1.8px solid #A5A5A5',
      paddingLeft: '10px',
      marginLeft: '10px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#0E0F12',
      lineHeight: '17px',
    },
    titleDesign: {
      marginLeft: '10px',
    },
    create: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0.25px',
      lineHeight: '24px',
      cursor: 'pointer',
      marginLeft: '28px',
    },
    createIcon: {
      marginRight: '10px',
    },
  };
};

interface IngestionHeaderProps extends WithStyles<typeof styles> {
  title: string;
  createBtn?: boolean;
  onCreate?: () => void;
  runBtn?: boolean;
  onRun?: () => void;
  taskActionsBtn?: boolean;
  onTaskActions?: () => void;
  navToHome?: () => void;
  browseBtn?: boolean;
  onBrowse?: () => void;
}
const IngestionHeaderView: React.FC<IngestionHeaderProps> = ({
  classes,
  title,
  createBtn,
  onCreate,
  runBtn,
  onRun,
  taskActionsBtn,
  onTaskActions,
  navToHome,
  browseBtn,
  onBrowse,
}) => {
  const titleDesignIcon = '/cdap_assets/img/title-design-bar.svg';
  const createIcon = '/cdap_assets/img/create.svg';
  const runIcon = '/cdap_assets/img/run.svg';
  const taskActionsIcon = '/cdap_assets/img/task-action.svg';
  const browseIcon = '/cdap_assets/img/browse-data.svg';
  const currentNamespace = NamespaceStore.getState().selectedNamespace;

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const options = ['Run Task', 'Update Schedule', 'Task Configuration', 'Duplicate', 'Archive'];
  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          <div onClick={() => taskActionsBtn && navToHome()}>{title}</div>
          {taskActionsBtn && <div className={classes.title2}>Task Details</div>}
          {browseBtn && (
            <>
              <div
                className={classes.title2}
                onClick={() => history.push(`/ns/${currentNamespace}/ingestion/task`)}
              >
                {' '}
                Ingest oracle studies data to bigquery
              </div>
              <div className={classes.title2}> Job 01</div>
            </>
          )}
          {!taskActionsBtn && !browseBtn && (
            <img className={classes.titleDesign} src={titleDesignIcon} alt="Ingestion" />
          )}
        </div>
        {createBtn && (
          <div className={classes.create} onClick={onCreate}>
            <img className={classes.createIcon} src={createIcon} alt="create-ingestion" />
            <span>Create</span>
          </div>
        )}
        {runBtn && (
          <div className={classes.create} onClick={onRun}>
            <img className={classes.createIcon} src={runIcon} alt="run-ingestion" />
            <span>Run</span>
          </div>
        )}
        {taskActionsBtn && (
          <div
            className={classes.create}
            onClick={(e) => {
              onTaskActions();
              setAnchorEl(e.currentTarget);
            }}
          >
            <img
              className={classes.createIcon}
              src={taskActionsIcon}
              alt="task-actions-ingestion"
            />
            <span>Task Actions</span>
          </div>
        )}
        {browseBtn && (
          <div className={classes.create} onClick={onBrowse}>
            <img className={classes.createIcon} src={browseIcon} alt="browse-data" />
            <span>Browse</span>
          </div>
        )}
      </div>

      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
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
            // selected={option === 'Pyxis'}
            onClick={(e) => {
              // onOptionSelect(selectedRow);
            }}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

const IngestionHeader = withStyles(styles)(IngestionHeaderView);
export default IngestionHeader;
