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
import { Card, CardContent, Typography, CardActions, Button } from '@material-ui/core';

const styles = (): StyleRules => {
  return {
    root: {
      margin: '40px 40px',
      height: 'calc(100% - 100px)',
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
      // padding: '10px',
      flex: '1 1 0%',
    },
    successMsg: {
      display: 'flex',
      height: '70px',
      fontFamily: 'Lato',
      fontSize: '20px',
      letterSpacing: '0',
      color: '#137333',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#eff8f2',
      borderRadius: '4px',
    },
    mappingCard: {
      flex: '1 1 0%',
    },
    selectedCard: {
      flex: '1 1 0%',
      border: '1px solid #0F9D58',
      borderRadius: '4px',
    },
    mappingTypes: {
      display: 'flex',
      flexDirection: 'row',
      gap: '50px',
      marginTop: '10px',
    },
    mappingInfo: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // marginTop: '60px',
      // marginLeft: '25px',
      padding: '10px',
    },
    mappingIcons: {
      '& .MappingView - mappingIcons - 650': {},
    },
    title: {
      fontFamily: 'Lato',
      color: '#202124',
      letterSpacing: '0',
      fontSize: '20px',
      marginTop: '40px',
    },
    label: {
      padding: '0',
      fontFamily: 'Lato',
      color: '#202124',
      letterSpacing: '0',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '50px',
      marginTop: '50px',
      alignItems: 'center',
      justifyContent: 'flex-end',
    },
    cancelButton: {
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
    mappingDescription: {
      fontFamily: 'Lato',
      fontSize: '14px',
    },
    labelText: {
      fontSize: '20px',
      fontFamily: 'Lato',
      letterSpacing: '0',
      color: '#202124;',
      marginBottom: '0',
    },
    descriptionContainer: {
      padding: '0px',
      display: 'flex',
      fontSize: '14px',
      color: '#666666',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10px',
    },
    successIcon: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    successMsgText: {
      marginLeft: '10px',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  submitMappingType: (values: string) => void;
  handleCancel: (value: object) => void;
}
const MappingView: React.FC<IIngestionProps> = ({ classes, submitMappingType, handleCancel }) => {
  const [cardSelected, setSelected] = React.useState('none');

  const submitMapping = () => {
    submitMappingType(cardSelected);
  };

  const onCancel = (e: React.FormEvent) => {
    handleCancel({ name: 'cancel' });
  };

  const allTables = '/cdap_assets/img/select-all-tables-infographic.svg';
  const customTable = '/cdap_assets/img/custom-selection-table-infographic.svg';
  const successMsgIcon = '/cdap_assets/img/success-state-tick.svg';
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.successMsg}>
          <img src={successMsgIcon} className={classes.successIcon} alt="success icon" />
          <p className={classes.successMsgText}>Successfully connected to the Studies database</p>
        </div>
        <Typography className={classes.title}>How Would You Like to Proceed?</Typography>
        <div className={classes.mappingTypes}>
          <Card
            className={cardSelected === 'All' ? classes.selectedCard : classes.mappingCard}
            variant="outlined"
            onClick={() => {
              setSelected('All');
            }}
          >
            <div className={classes.mappingInfo}>
              <img className={classes.mappingIcons} src={allTables} alt="some text" />
              <CardContent className={classes.label}>
                <p className={classes.labelText}>Select all tables & columns</p>
              </CardContent>
              <CardContent className={classes.descriptionContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  I would like to extract all columns from all tables
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  without any custom selection.
                </Typography>
              </CardContent>
            </div>
          </Card>
          <Card
            className={cardSelected === 'Custom' ? classes.selectedCard : classes.mappingCard}
            variant="outlined"
            onClick={() => {
              setSelected('Custom');
            }}
          >
            <div className={classes.mappingInfo}>
              <img src={customTable} className={classes.mappingIcons} alt="some icon" />
              <CardContent className={classes.label}>
                <p className={classes.labelText}>Custom selection of table & columns</p>
              </CardContent>
              <CardContent className={classes.descriptionContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  I would like to extract the tables and columns
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  I am interested in.
                </Typography>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton} onClick={onCancel}>
          CANCEL
        </Button>
        <Button
          variant="contained"
          color="primary"
          className={classes.submitButton}
          type="submit"
          onClick={submitMapping}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

const MappingLayout = withStyles(styles)(MappingView);
export default MappingLayout;
