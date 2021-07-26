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
import Dialog from '@material-ui/core/Dialog';
import { Button, DialogTitle, DialogContent, Typography, DialogActions } from '@material-ui/core';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const styles = (): StyleRules => {
  return {
    root: {
      display: 'flex',
      border: '1px solid red',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      height: '67px',
      borderBottom: '2px solid #4285F4',
      borderBottomRadius: '10px',
      alignItems: 'center',
    },
    errIcn: {
      paddingLeft: '41px',
    },
    headerText: {
      paddingLeft: '8px',
      fontSize: '18px',
      color: '#202124',
      fontFamily: 'Lato',
      marginBottom: '0',
      lineHeight: '24px',
      paddingTop: '8px',
    },
    dialog: {},
    content: {
      height: '99px',
      width: '484px',
      padding: '20px 40px 35px 40px',
      boxsizing: 'border-box',
    },
    buttons: {
      paddingRight: '40px',
      paddingTop: '0',
      paddingLeft: '40px',
      paddingBottom: '40px',
    },
  };
};

interface OverlaySmallProps extends WithStyles<typeof styles> {}
const OverlaySmallView: React.FC<OverlaySmallProps> = ({ classes }) => {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const error = 'http://0.0.0.0:8888/error-status.svg';
  const ErrorIcon = () => {
    return <img src={error} alt="err icon" height="30px" width="30px" />;
  };
  return (
    <div className={classes.root}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open dialog
      </Button>
      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={classes.dialog}
      >
        <div className={classes.header}>
          <div className={classes.errIcn}>
            <ErrorIcon />
          </div>
          <p className={classes.headerText}>Failed to connect the Studies database.</p>
        </div>
        <div className={classes.content}>
          <p>
            Please retry after some time, or continue to create the task with all tables. However,
            you can only run once the server is up.
          </p>
        </div>
        <DialogActions className={classes.buttons}>
          <ButtonComponent
            onCancel={handleClose}
            onSubmit={handleClose}
            disableSubmit={false}
            submitText="CREATE TASK"
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

const OverlaySmall = withStyles(styles)(OverlaySmallView);
export default OverlaySmall;
