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
import { Typography, Button } from '@material-ui/core';
import T from 'i18n-react';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import CustomTableSelection from '../CustomTableSelection/CustomTableSelection';
import NamespaceStore from 'services/NamespaceStore';
import { ConnectionsApi } from 'api/connections';
import { exploreConnection } from 'components/Connections/Browser/GenericBrowser/apiHelpers';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import produce from 'immer';
const I18N_PREFIX = 'features.MappingLayout';
const styles = (): StyleRules => {
  return {
    root: {
      margin: '40px 40px',
      height: 'calc(100% - 100px)', // margin
      display: 'flex',
      flexDirection: 'column',
    },
    container: {
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
      height: '272px',
      borderRadius: '4px',
    },
    selectedCard: {
      width: '497px',
      height: '272px',
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      marginRight: '40px',
      cursor: 'pointer',
      border: '2px solid #4285F4',
      borderRadius: '4px',
      position: 'relative',
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
      padding: '10px',
    },
    mappingIcons: {
      '& .MappingView - mappingIcons - 650': {},
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
      gap: '30px',
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
      color: '#666666',
    },
    mappingDescription2: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#666666',
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
    title: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      letterSpacing: '0.45px',
    },
    cardsContainer: {
      display: 'flex',
      margin: '20px 0px',
      flex: '1 1 0%',
    },
    card: {
      border: '1px solid #aaaaac',
      borderRadius: '4px',
      width: '497px',
      height: '272px',
      display: 'flex',
      flexDirection: 'column-reverse',
      alignItems: 'center',
      marginRight: '40px',
      cursor: 'pointer',
    },
    cardRunIcon: {
      marginBottom: '40.5px',
    },
    cardScheduleIcon: {
      marginBottom: '40px',
    },
    cardTitle: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      textAlign: 'center',
      marginBottom: '10px',
    },
    cardDescription: {
      width: '302px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#666666',
      textAlign: 'center',
      lineHeight: '20px',
      marginBottom: '33px',
    },
    emptyList: {
      textAlign: 'center',
      margin: '30px 30px',
    },
  };
};

interface IIngestionProps extends WithStyles<typeof styles> {
  setDraftConfig: (values: object) => void;
  handleCancel: () => void;
  draftConfig;
  cardSelected: string;
  setCardSelected: (type: string) => void;
  handleNext: () => void;
}
const MappingView: React.FC<IIngestionProps> = ({
  classes,
  cardSelected,
  setCardSelected,
  handleNext,
  setDraftConfig,
  handleCancel,
  draftConfig,
}) => {
  const allTables = '/cdap_assets/img/data-base-big.svg';
  const customTable = '/cdap_assets/img/custom-selection.svg';
  const successCardTick = '/cdap_assets/img/card-section-tick.svg';
  const [customTablesSelection, setCustomTablesSelection] = React.useState(false);

  React.useEffect(() => {
    getTablesList();
    setLoading(true);
  }, []);
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [items, setItems] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const getTablesList = () => {
    ConnectionsApi.exploreConnection(
      {
        context: currentNamespace,
        connectionid: draftConfig.config.stages[0].name,
      },
      {
        path: '/public',
        limit: 1000,
      }
    ).subscribe(
      (message) => {
        setItems(
          message.entities.map((item) => {
            if (
              draftConfig.config.stages[0].plugin.properties.whitelist
                ?.split(',')
                .includes(item.name)
            ) {
              return {
                tableName: item.name,
                selected: true,
              };
            } else {
              return {
                tableName: item.name,
                selected: false,
              };
            }
          })
        );
        setLoading(false);
      },
      (err) => {
        console.log('TablesList-err', err);
      }
    );
  };
  const onSubmit = (list) => {
    setDraftConfig(
      produce((state) => {
        state.config.stages[0].plugin.properties.whitelist = list;
      })
    );
  };
  const handleSubmit = () => {
    const submitList = items
      .filter((item) => item.selected)
      .map((item) => item.tableName)
      .join();
    if (cardSelected === 'custom') {
      setCustomTablesSelection(true);
      if (submitList !== '' && customTablesSelection) {
        onSubmit(submitList);
        handleNext();
      }
      return;
    }
    onSubmit('');
    handleNext();
  };
  const onCancel = () => {
    customTablesSelection ? setCustomTablesSelection(false) : handleCancel();
  };
  return (
    <div className={classes.root}>
      {items.length === 0 ? (
        loading ? (
          <LoadingSVGCentered />
        ) : (
          <h3 className={classes.emptyList}>There are no tables available ...</h3>
        )
      ) : customTablesSelection ? (
        <CustomTableSelection
          tablesList={items}
          handleChange={(tableName) => {
            setItems((prev) => {
              const index = prev.findIndex((item) => item.tableName === tableName);
              return [
                ...prev.slice(0, index),
                {
                  ...prev[index],
                  tableName,
                  selected: !prev[index].selected,
                },
                ...prev.slice(index + 1),
              ];
            });
            console.log(items);
          }}
        />
      ) : (
        <>
          <Typography className={classes.title}>How Would You Like to Proceed?</Typography>
          <div className={classes.cardsContainer}>
            <div
              className={cardSelected === 'all' ? classes.selectedCard : classes.card}
              onClick={() => {
                setCardSelected('all');
                console.log(cardSelected);
              }}
            >
              <div className={classes.cardDescription}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                  data-cy="b1"
                >
                  {T.translate(`${I18N_PREFIX}.AllTables.description`)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                  data-cy="b1"
                >
                  {T.translate(`${I18N_PREFIX}.AllTables.description2`)}
                </Typography>
              </div>
              <div className={classes.cardTitle}>
                {T.translate(`${I18N_PREFIX}.AllTables.title`) + ` (${items.length})`}
              </div>
              <img className={classes.cardRunIcon} src={allTables} alt="run-task" />
              {cardSelected === 'all' && (
                <img
                  className={classes.cardRunIcon}
                  src={successCardTick}
                  alt="card-selected"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '20px',
                  }}
                />
              )}
            </div>
            <div
              className={cardSelected === 'custom' ? classes.selectedCard : classes.card}
              onClick={() => {
                setCardSelected('custom');
              }}
            >
              <div className={classes.cardDescription}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                  data-cy="desc2"
                >
                  {T.translate(`${I18N_PREFIX}.CustomTables.description`)}
                </Typography>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  component="p"
                  className={classes.mappingDescription}
                  data-cy="desc2"
                >
                  {T.translate(`${I18N_PREFIX}.CustomTables.description2`)}
                </Typography>
              </div>
              <div className={classes.cardTitle}>
                {T.translate(`${I18N_PREFIX}.CustomTables.title`)}
              </div>
              <img className={classes.cardScheduleIcon} src={customTable} alt="run-task" />
              {cardSelected === 'custom' && (
                <img
                  className={classes.cardRunIcon}
                  src={successCardTick}
                  alt="card-selected"
                  style={{
                    position: 'absolute',
                    right: '20px',
                    top: '20px',
                  }}
                />
              )}
            </div>
          </div>
        </>
      )}
      {!loading && (
        <ButtonComponent
          onCancel={onCancel}
          onSubmit={handleSubmit}
          disableSubmit={
            (customTablesSelection ? items.every((a) => a.selected === false) : false) ||
            cardSelected === 'none'
          }
          submitText="CONTINUE"
        />
      )}
    </div>
  );
};

const MappingLayout = withStyles(styles)(MappingView);
export default MappingLayout;
