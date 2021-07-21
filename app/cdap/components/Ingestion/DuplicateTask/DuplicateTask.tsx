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
import { Box, Grid, Button } from '@material-ui/core';

const styles = (): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 48px)', // margin
      background: '#9898989c',
      position: 'fixed',
      width: '100%',
      zIndex: 10,
      top: '48px',
    },
    sdleTskWrapper: {
      width: '700px',
      height: '100%',
      background: '#FBFBFB',
      boxShadow: '-2px 9px 26px 0 rgba(0,0,0,0.15)',
      right: '0px',
      position: 'absolute',
      padding: '30px 40px',
      fontFamily: 'Lato',
    },
    heading: {
      fontSize: '20px',
      marginBottom: '29px',
    },
    titleMsg: {
      display: 'flex',
    },
  };
};

interface DuplicateTaskProps extends WithStyles<typeof styles> {}

const DuplicateTaskView: React.FC<DuplicateTaskProps> = ({ classes }) => {
  const tileDesignBar = '/cdap_assets/img/title-design-bar.svg';
  const titleArrow = '/cdap_assets/img/arrow.svg';
  return (
    <div className={classes.root}>
      <div className={classes.sdleTskWrapper}>
        <div className={classes.heading}>
          <Box component="span" mr={2}>
            Duplicate Task
          </Box>
          <img src={tileDesignBar} />
        </div>
        <div className={classes.titleMsg}>
          <p>Study-trails-Connection | Studies</p>
          <img src={titleArrow} alt="title arrow icon" />
          <p>Study_Performance_Connection | StudyPerformance</p>
        </div>
      </div>
    </div>
  );
};

const DuplicateTask = withStyles(styles)(DuplicateTaskView);
export default DuplicateTask;
