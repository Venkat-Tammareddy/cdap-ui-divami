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
import { DialogActions } from '@material-ui/core';
import ButtonComponent from '../ButtonComponent/ButtonComponent';

const styles = (): StyleRules => {
  return {
    root: {
      display: 'flex',
      flexDirection: 'column',
    },
    header: {
      display: 'flex',
      height: '67px',
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
    descriptionText: {
      fontSize: '14px',
      fontFamily: 'Lato',
      color: '#202124',
    },
    flexLines: {
      display: 'flex',
      height: 'max-content',
    },
    hr1: {
      width: '5%',
      marginTop: '0px',
      border: '2px solid #F4B400',
      borderRadius: '0px 1.5px 1.5px 0px',
    },
    hr2: {
      width: '95%',
      marginTop: '0px',
      marginLeft: '4px',
      border: '2px solid #4285F4',
      borderRadius: '1.5px 0px 0px 1.5px',
    },
  };
};

interface OverlaySmallProps extends WithStyles<typeof styles> {
  open: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  title: string;
  description: string;
  submitText: string;
  errorType?: boolean;
}
const OverlaySmallView: React.FC<OverlaySmallProps> = ({
  classes,
  open,
  onCancel,
  title,
  description,
  onSubmit,
  submitText,
  errorType,
}) => {
  const error = '/cdap_assets/img/error-status.svg';
  const ErrorIcon = () => {
    return <img src={error} alt="err icon" height="30px" width="30px" />;
  };
  return (
    <div className={classes.root}>
      {/* <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Open dialog
      </Button> */}
      <Dialog
        onClose={onCancel}
        aria-labelledby="customized-dialog-title"
        open={open}
        className={classes.dialog}
      >
        <div className={classes.header}>
          <div className={classes.errIcn}>{errorType && <ErrorIcon />}</div>
          <p className={classes.headerText}>{title}</p>
        </div>
        <div className={classes.flexLines}>
          <hr className={classes.hr1} />
          <hr className={classes.hr2} />
        </div>
        <div className={classes.content}>
          <p className={classes.descriptionText}>{description}</p>
        </div>
        <DialogActions className={classes.buttons}>
          <ButtonComponent
            onCancel={onCancel}
            onSubmit={onSubmit}
            disableSubmit={false}
            submitText={submitText}
          />
        </DialogActions>
      </Dialog>
    </div>
  );
};

const OverlaySmall = withStyles(styles)(OverlaySmallView);
export default OverlaySmall;
