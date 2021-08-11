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
import { Grid, Menu, MenuItem, Paper } from '@material-ui/core';
import { MyPipelineApi } from 'api/pipeline';
import NamespaceStore from 'services/NamespaceStore';

const styles = (theme): StyleRules => {
  return {
    root: {
      //   border: '1px solid red',
    },
    menuItem: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      padding: '5px 20px',
    },
    marginLeft: {
      marginLeft: '10px',
    },
    paper: {
      //   border: '1px solid green',
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
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
  };
};

interface ITaskOptionsProps extends WithStyles<typeof styles> {
  taskName: string;
  latestRun: {
    status: string;
    runId: string;
  };
  refetch: () => void;
}
const TaskOptionsView: React.FC<ITaskOptionsProps> = ({
  classes,
  taskName,
  latestRun,
  refetch,
}) => {
  const namespace = NamespaceStore.getState().selectedNamespace;

  const imgStop = '/cdap_assets/img/stop.svg';
  const imgMore = '/cdap_assets/img/more.svg';
  const options = ['Run Task', 'Update Schedule', 'Task Configuration', 'Duplicate', 'Delete'];
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const optionSelect = (type: string) => {
    type === 'Delete' &&
      MyPipelineApi.delete({ namespace, appId: taskName }).subscribe((msg) => {
        console.log(taskName, 'deleted succesfully');
        refetch();
      });
    type === 'Run Task' &&
      MyPipelineApi.run({
        namespace,
        appId: taskName,
      }).subscribe((message) => {
        console.log(taskName + 'started running....');
        refetch();
      });
  };
  const stopRun = () => {
    console.log(latestRun);
    MyPipelineApi.stopRun({
      namespace,
      appId: taskName,
      programType: 'workflows',
      programName: 'DataPipelineWorkflow',
      runId: latestRun?.runId,
    }).subscribe((msg) => {
      console.log('run stopped successfully');
      refetch();
    });
  };
  return (
    <Grid container spacing={0} className={classes.root}>
      <Grid item xs={8}>
        <Paper
          className={classes.paper}
          hidden={!(latestRun?.status === 'RUNNING')}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            e.nativeEvent.stopImmediatePropagation();
            stopRun();
          }}
        >
          <img src={imgStop} alt="img" height="20px" width="20px" />
          <span className={classes.marginLeft}>Stop</span>
        </Paper>
      </Grid>
      <Grid item xs={4}>
        <Paper className={classes.paper}>
          <img
            src={imgMore}
            className={classes.optionsIcon}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              setAnchorEl(e.currentTarget);
            }}
          />
          <Menu
            id="long-menu"
            keepMounted
            anchorEl={anchorEl}
            open={open}
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
                  optionSelect(option);
                  setAnchorEl(null);
                }}
                className={classes.menuItem}
              >
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Paper>
      </Grid>
    </Grid>
  );
};

const TaskOptions = withStyles(styles)(TaskOptionsView);
export default TaskOptions;
