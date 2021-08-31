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
import If from 'components/If';
import Button from '@material-ui/core/Button';

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
      // border: '1px solid green',
    },
    title2: {
      // paddingLeft: '7px',
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#0E0F12',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    titleDesign: {
      marginLeft: '10px',
      marginTop: '3px',
    },
    create: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0.25px',
      lineHeight: '24px',
      cursor: 'pointer',
      marginLeft: '28px',
      display: 'flex',
      alignItems: 'center',
    },
    createIcon: {
      marginRight: '10px',
    },
    toggleButton: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center',
    },
    listIcons: {
      padding: '6px 12px 6px 12px',
      borderRight: '1px solid #A5A5A5',
      cursor: 'pointer',
    },
    graphIcons: { padding: '6px 12px 6px 12px', cursor: 'pointer' },
    buttons: {
      display: 'flex',
      border: '1px solid #A5A5A5',
      borderRadius: '23px',
      justifyContent: 'center',
      overflow: 'hidden',
      alignItems: 'center',
    },
    txt: {
      marginBottom: '0',
      fontSize: '16px',
      fontFamily: 'Lato',
      color: '#202124',
    },
    viewTxt: {
      marginLeft: '30px',
      marginBottom: '0',
      fontSize: '16px',
      fontFamily: 'Lato',
      color: '#666666',
    },
    hideThese: {
      gap: '10px',
      display: 'none',
    },
    showThese: {
      display: 'flex',
      gap: '20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    red: {
      height: '12px',
      width: '12px',
      backgroundColor: '#F8888A ',
      borderRadius: '50%',
    },
    green: {
      height: '12px',
      width: '12px',
      backgroundColor: '#74D091',
      borderRadius: '50%',
    },
    smallContainer: {
      display: 'flex',
      gap: '10px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    selected: {},
    active: {
      backgroundColor: '#ECF2FD',
      padding: '6px 12px 6px 12px',
      borderRight: '1px solid #A5A5A5',
      cursor: 'pointer',
    },
    activeChart: {
      backgroundColor: '#ECF2FD',
      padding: '6px 12px 6px 12px',
      cursor: 'pointer',
    },
    titleText: {
      marginBottom: '0px',
      paddingLeft: '9px',
      color: '#202124',
      fontFamily: 'Lato',
      fontSize: '18px',
    },
    lastIcon: {
      paddingLeft: '7px',
      paddingTop: '4px',
    },
    backArrow: {
      marginRight: '9.8px',
    },
    flex: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };
};

interface IngestionHeaderProps extends WithStyles<typeof styles> {
  title: string;
  taskName?: string;
  jobName?: string;
  createBtn?: boolean;
  onCreate?: () => void;
  runBtn?: boolean;
  onRun?: () => void;
  taskActionsBtn?: boolean;
  onTaskActions?: (any) => void;
  navToHome?: () => void;
  browseBtn?: boolean;
  onBrowse?: () => void;
  graphicalView?: boolean;
  setGraph?: any;
  taskOptions?: any[];
  backArrow?: boolean;
  addConnection?: boolean;
  createConnection?: () => void;
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
  graphicalView,
  taskName,
  jobName,
  setGraph,
  taskOptions,
  backArrow,
  addConnection,
  createConnection,
}) => {
  const titleDesignIcon = '/cdap_assets/img/title-design-bar.svg';
  const createIcon = '/cdap_assets/img/create.svg';
  const runIcon = '/cdap_assets/img/run.svg';
  const taskActionsIcon = '/cdap_assets/img/task-action.svg';
  const browseIcon = '/cdap_assets/img/browse-data.svg';
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const listView = '/cdap_assets/img/list-view.svg';
  const graphView = '/cdap_assets/img/graph-view.svg';

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const options = ['Run Task', 'Update Schedule', 'Task Configuration', 'Duplicate', 'Archive'];
  const [showRecords, setShowRecords] = React.useState(false);
  const [activIcon, setActivIcon] = React.useState('chart');
  const arrowBack = '/cdap_assets/img/arrow-back.svg';
  const arrowFront = '/cdap_assets/img/arrow-front.svg';

  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>
          <div onClick={() => (taskActionsBtn || browseBtn) && navToHome()}>
            {' '}
            {backArrow && (
              <img className={classes.backArrow} src={arrowBack} alt="nav back arrow" />
            )}
            {title}
          </div>
          {taskActionsBtn && (
            <div className={classes.title2}>
              <img src={arrowFront} alt="nav arrow" className={classes.lastIcon} />
              <div className={classes.titleText}>Task Details</div>
            </div>
          )}
          {browseBtn && (
            <>
              <div
                className={classes.title2}
                onClick={() => history.push(`/ns/${currentNamespace}/ingestion/task/${taskName}`)}
              >
                <img src={arrowFront} alt="nav arrow" className={classes.lastIcon} />
                <div className={classes.titleText}>{taskName}</div>
              </div>
              <div className={classes.flex}>
                {' '}
                <img src={arrowFront} alt="nav arrow" className={classes.lastIcon} />
                <div className={classes.titleText}>{' ' + jobName}</div>
              </div>
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
              setAnchorEl(e.currentTarget);
            }}
          >
            <img
              className={classes.createIcon}
              src={taskActionsIcon}
              alt="task-actions-ingestion"
            />
            <span style={{ textAlign: 'center' }}>Task Actions</span>
          </div>
        )}
        {browseBtn && (
          <div className={classes.create} onClick={onBrowse}>
            <img className={classes.createIcon} src={browseIcon} alt="browse-data" />
            <span>Browse</span>
          </div>
        )}
        {addConnection && (
          <div
            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            onClick={createConnection}
          >
            <img className={classes.createIcon} src={createIcon} alt="browse-data" />
            <p
              style={{
                fontSize: '16px',
                color: '#202124',
                fontFamily: 'Lato',
                marginBottom: '0px',
              }}
            >
              Add Connection
            </p>
          </div>
        )}
        {graphicalView && (
          <div className={classes.toggleButton}>
            <div className={showRecords ? classes.showThese : classes.hideThese}>
              <div className={classes.smallContainer}>
                <div className={classes.green}></div>
                <p className={classes.txt}>Records Loaded</p>
              </div>
              <div className={classes.smallContainer}>
                <div className={classes.red}></div>
                <p className={classes.txt}>Errors</p>
                <p className={classes.viewTxt}>View by</p>
              </div>
            </div>
            <div className={classes.buttons}>
              <div
                className={activIcon === 'chart' ? classes.active : classes.listIcons}
                onClick={() => {
                  setActivIcon('chart');
                  setGraph(false);
                  setShowRecords(false);
                }}
              >
                <img src={listView} height="18px" width="18px" />
              </div>
              <div
                className={activIcon === 'graph' ? classes.activeChart : classes.graphIcons}
                onClick={() => {
                  setActivIcon('graph');
                  setGraph(true);
                  setShowRecords(true);
                }}
              >
                <img src={graphView} height="15px" width="13px" />
              </div>
            </div>
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
        {taskOptions
          ? taskOptions.map((option) => (
              <MenuItem
                key={option}
                onClick={(e) => {
                  onTaskActions(option);
                  setAnchorEl(null);
                }}
              >
                {option}
              </MenuItem>
            ))
          : ''}
      </Menu>
    </>
  );
};

const IngestionHeader = withStyles(styles)(IngestionHeaderView);
export default IngestionHeader;
