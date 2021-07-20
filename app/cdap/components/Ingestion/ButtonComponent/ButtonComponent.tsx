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
import { Button, Radio, Typography } from '@material-ui/core';
import { RadioGroup } from '@material-ui/core';
import { FormControlLabel } from '@material-ui/core';
import { FormLabel } from '@material-ui/core';
const I18N_PREFIX = 'features.ButtonComponent';

const styles = (): StyleRules => {
  return {
    root: {
      display: 'flex',
      gap: '50px',
      alignItems: 'end',
      justifyContent: 'flex-end',
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
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  onCancel: () => void;
  handleSubmit: (values: object) => void;
  disableSubmit: boolean;
  submitText: string;
}
const ButtonComponentView: React.FC<IIngestionProps> = ({
  classes,
  onCancel,
  handleSubmit,
  disableSubmit,
  submitText,
}) => {
  return (
    <div className={classes.root}>
      <Button className={classes.cancelButton} onClick={onCancel}>
        CANCEL
      </Button>
      <Button
        variant="contained"
        color="primary"
        className={classes.submitButton}
        type="submit"
        disabled={disableSubmit}
        onClick={handleSubmit}
      >
        {submitText}
      </Button>
    </div>
  );
};

const ButtonComponent = withStyles(styles)(ButtonComponentView);
export default ButtonComponent;
