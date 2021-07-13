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
import Modal from '@material-ui/core/Modal';
import { Button, Card, CardContent, Typography } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const styles = (): StyleRules => {
  return {
    root: {},
    paper: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      marginTop: '100px',
      width: '100%',
      backgroundColor: 'white',
      boxShadow: 'grey',
      padding: '5px',
    },
    container: {
      // padding: '10px',
      flex: '1 1 0%',
      marginLeft: '11%',
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
      width: '90%',
    },
    mappingCard: {
      flex: '1 1 0%',
      width: '40%',
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
      width: '90%',
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
      '& .ConfigurationConfigurationModalView - mappingIcons - 650': {},
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
    overlayActive: {
      display: 'none',
    },
    overlayClose: { display: 'flex' },
    closeIcon: {
      height: '30px',
      width: '30px',
      color: '#9E9E9E',
      marginLeft: '100px',
    },
  };
};

interface ConfigurationModalProps extends WithStyles<typeof styles> {
  closeModal: () => void;
  runTask: () => void;
  scheduleTask: () => void;
}
const ConfigurationModalView: React.FC<ConfigurationModalProps> = ({
  classes,
  closeModal,
  runTask,
  scheduleTask,
}) => {
  const [open, setOpen] = React.useState(false);
  const [cardSelected, setSelected] = React.useState('none');

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const setPointer = (e) => {
    e.target.style.cursor = 'pointer';
  };

  const runTaskImg = '/cdap_assets/img/runTask.svg';
  const scheduleTaskImg = '/cdap_assets/img/scheduleTask.svg';
  return (
    <div className={classes.paper}>
      <div className={classes.container}>
        <div className={classes.overlayClose}>
          <div className={classes.successMsg}>
            <p className={classes.successMsgText}>
              Successfully Deployed Task. Ingest oracle studies data to bigquery
            </p>
          </div>
          <CloseIcon
            onMouseOver={setPointer}
            className={classes.closeIcon}
            onClick={() => closeModal()}
          />
        </div>

        <Typography className={classes.title}>What would you like to do?</Typography>
        <div className={classes.mappingTypes}>
          <Card
            className={classes.mappingCard}
            variant="outlined"
            onMouseOver={setPointer}
            onClick={() => {
              runTask();
            }}
          >
            <div className={classes.mappingInfo}>
              <div className={classes.mappingIcons}>
                <img src={runTaskImg} alt="some text" />
              </div>
              <CardContent className={classes.label}>
                <p className={classes.labelText}>Run Task</p>
              </CardContent>
              <CardContent className={classes.descriptionContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  Lorem ipsum dolor sit amet consectetur.
                </Typography>
              </CardContent>
            </div>
          </Card>
          <Card
            className={classes.mappingCard}
            variant="outlined"
            onMouseOver={setPointer}
            onClick={() => {
              scheduleTask();
            }}
          >
            <div className={classes.mappingInfo}>
              <div className={classes.mappingIcons}>
                <img src={scheduleTaskImg} alt="some text" />
              </div>
              <CardContent className={classes.label}>
                <p className={classes.labelText}>Schedule Task</p>
              </CardContent>
              <CardContent className={classes.descriptionContainer}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                >
                  Lorem ipsum dolor sit amet consectetur.
                </Typography>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const ConfigurationModal = withStyles(styles)(ConfigurationModalView);
export default ConfigurationModal;
