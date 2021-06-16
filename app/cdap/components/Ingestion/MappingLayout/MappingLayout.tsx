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
      margin: '50px',
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
      padding: '10px',
      flex: '1 1 0%',
    },
    successMsg: {
      display: 'flex',
      fontFamily: 'Roboto',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      backgroundColor: '#EFF9F0',
      color: '#346246',
      width: '920px',
    },
    mappingCard: {
      flex: '1 1 0%',
    },
    selectedCard: {
      flex: '1 1 0%',
      border: '1px solid green',
    },
    mappingTypes: {
      display: 'flex',
      flexDirection: 'row',
      gap: '15px',
    },
    mappingInfo: {
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '400px',
      marginTop: '60px',
      padding: '0',
      marginLeft: '25px',
    },
    mappingIcons: {
      height: '30px',
      width: '30px',
    },
    title: {
      marginTop: '40px',
    },
    label: {
      padding: '0',
    },
    buttonContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: '10px',
      marginLeft: '72%',
      gap: '50px',
      alignItems: 'center',
    },
    cancelButton: {
      textDecoration: 'none',
      color: '#2196f3',
    },
    submitButton: {
      minWidth: '131px',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  submitMappingType: (values: object) => void;
}
const MappingView: React.FC<IIngestionProps> = ({ classes, submitMappingType }) => {
  const [cardSelected, setSelected] = React.useState({ cardType: '' });
  const handleClick = (e: any) => {
    if (e.target.textContent[0] === 'S') {
      setSelected({ cardType: 'All' });
    } else {
      setSelected({ cardType: 'Custom' });
    }
  };

  const submitMapping = () => {
    submitMappingType(cardSelected);
  };
  const imageUrl = 'https://img.icons8.com/pastel-glyph/2x/blood-sample.png';
  return (
    <div className={classes.root}>
      <div className={classes.container}>
        <div className={classes.successMsg}>
          <p>Successfully connected to the Studies database</p>
        </div>
        <Typography gutterBottom variant="h6" component="h6" className={classes.title}>
          How Would You Like to Proceed?
        </Typography>
        <div className={classes.mappingTypes}>
          <Card
            className={cardSelected.cardType === 'All' ? classes.selectedCard : classes.mappingCard}
            variant="outlined"
            onClick={handleClick}
          >
            <div className={classes.mappingInfo}>
              <CardContent className={classes.label}>
                <Typography gutterBottom variant="h6" component="h6">
                  Select all tables & columns
                </Typography>
              </CardContent>
              <CardContent>
                <img className={classes.mappingIcons} src={imageUrl} alt="some text" />
              </CardContent>
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  I would like to extract all columns from all tables
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  without any custom selection.
                </Typography>
              </CardContent>
            </div>
          </Card>
          <Card
            className={
              cardSelected.cardType === 'Custom' ? classes.selectedCard : classes.mappingCard
            }
            variant="outlined"
            onClick={handleClick}
          >
            <div className={classes.mappingInfo}>
              <CardContent className={classes.label}>
                <Typography gutterBottom variant="h6" component="h6">
                  Custom selection of table & columns
                </Typography>
              </CardContent>
              <img src={imageUrl} className={classes.mappingIcons} alt="some icon" />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  I would like to extract the tables and columns
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  I am interested in.
                </Typography>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
      <div className={classes.buttonContainer}>
        <Button className={classes.cancelButton}>CANCEL</Button>
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
