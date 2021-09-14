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

import T from 'i18n-react';
import * as React from 'react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import {
  Box,
  TextField,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Typography,
  Dialog,
} from '@material-ui/core';
import TaskInfo from '../TaskInfo/TaskInfo';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import If from 'components/If';
import CustomTableSelection from '../CustomTableSelection/CustomTableSelection';
import IngestionHeader from '../IngestionHeader/IngestionHeader';
import { MyPipelineApi } from 'api/pipeline';
import NamespaceStore from 'services/NamespaceStore';
import produce from 'immer';
import { parseJdbcString } from '../helpers';
import TaskInfoFields from '../TaskInfo/TaskInfoFields';
import { MyMetadataApi } from 'api/metadata';
import { getClonePipelineName } from 'services/PipelineUtils';
import { ConnectionsApi } from 'api/connections';
import { IStagesInterface } from '../CreateIngestion/CreateIngestion';
const I18N_PREFIX = 'features.TaskInfo';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import Alert from 'components/Alert';
import OverlaySmall from '../OverlaySmall/OverlaySmall';
import Button from '@material-ui/core/Button';
import Duplicatepopup from '../commonUtils/Duplicatepopup';

const styles = (): StyleRules => {
  return {
    root: {
      height: 'calc(100% - 50px)',
      background: '#9898989c',
      position: 'fixed',
      width: '100%',
      zIndex: 10,
      top: '48px',
      left: '0',
      '& .MuiAutocomplete-tag': {
        border: '1px solid rgba(0,0,0,0.12)',
        color: '#000000',
        backgroundColor: 'transparent',
      },
      '& .MuiChip-label': {
        fontFamily: 'Lato',
        fontSize: '14px',
        letterSpacing: '0.25px',
      },
      '& .MuiInputLabel-outlined': {
        fontSize: '12px',
        color: '#202124',
      },
      '& .MuiFormLabel-root.Mui-error': {
        color: '#DB4437',
        fontSize: '12px',
      },
      '& .MuiOutlinedInput-input': {
        textIndent: '10px',
      },
    },
    sdleTskWrapper: {
      width: '680px',
      height: '100%',
      background: '#FBFBFB',
      boxShadow: '-2px 9px 26px 0 rgba(0,0,0,0.15)',
      right: '0px',
      position: 'absolute',
      padding: '18px 12px',
      fontFamily: 'Lato',
      overflowY: 'auto',
    },
    heading: {
      fontSize: '20px',
      marginBottom: '29px',
    },
    titleMsg: {
      display: 'flex',
      fontSize: '14px',
      lineHeight: '17px',
      color: '#202124',
      alignItems: 'center',
    },
    arrowImg: {
      paddingLeft: '12px',
      paddingRight: '16px',
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '25px',
      height: '85%',
      padding: '0px 28px 12px 28px',
    },
    label: {
      fontSize: '16px',
      color: '#202124 ',
      letterSpacing: '0.25px',
    },
    headerText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      letterSpacing: '0',
      color: '#202124',
      lineHeight: '24px',
      marginBottom: '0',
    },
    textFields: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
    },
    taskName: {
      marginTop: '29px',
      width: '600px',
      height: '56px',
      boxSizing: 'border-box',
      // height: '56px',
      '& .MuiFormHelperText-root': {
        color: 'red',
      },
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    taskDescription: {
      width: '600px',
      marginTop: '28px',
      borderRadius: '4px',
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    taskTags: {
      marginTop: '28px',
      width: '600px',
      height: '56px',
      '& label.Mui-focused': {
        color: '#4285F4',
        fontSize: '12px',
        letterSpacing: '0.4px',
        lineHeight: '16px',
      },
    },
    resize: {
      height: '113px',
    },
    buttonContainer: {
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
    inputInfo: {
      color: '#666666',
      fontSize: '12px',
      height: '15px',
      marginBottom: '0',
    },
    errorInputInfo: {
      color: '#DB4437',
      display: 'flex',
      fontFamily: 'Lato',
      marginBottom: '0px',
      fontSize: '12px',
      letterSpacing: '0.19px',
    },
    tagInfo: {
      marginTop: '10px',
      height: '15px',
      letterSpacing: '0.19px',
      fontSize: '12px',
      color: '#666666',
      marginLeft: '16px',
    },
    input1: {
      height: '56px',
      boxSizing: 'border-box',
      fontSize: '16px',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    input2: {
      boxSizing: 'border-box',
      fontSize: '16px',
    },
    input3: {
      height: '56px',
      boxSizing: 'border-box',
      fontSize: '16px',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    LeftRight: {
      display: 'flex',
      flexDirection: 'row',
      flex: '1 1 0%',
    },
    infoText: {
      fontFamily: 'Lato',
      fontSize: '18px',
      letterSpacing: '0.28px',
      lineHeight: '30px',
      color: '#4c4d4f',
      marginBottom: '0px',
    },
    labelText: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    choices: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0.15px',
      lineHeight: '24px',
    },
    extraction: {
      marginTop: '38px',
      display: 'flex',
      flexDirection: 'column',
    },
    ingestionHeader: {
      marginTop: '30px',
      display: 'flex',
      flexDirection: 'column',
    },
    radioGroup: {
      display: 'flex',
      gap: '50px',
    },
    radiooo: {
      display: 'flex',
      flexDirection: 'column',
      flex: '1 1 0%',
    },
    taskDate: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
    },
    connectionContainer: {
      display: 'flex',
      alignItems: 'center',
      paddingTop: '15px',
      padding: '15px 28px 0px 28px',
    },
    arrow: {
      margin: '0px 12px',
      paddingTop: '2px',
    },
    headerWrapper: {
      display: 'flex',
      borderBottom: '1px solid rgba(165, 165, 165, .5)',
    },
    emptyList: {
      textAlign: 'center',
      margin: '30px 30px',
      marginBottom: 'auto',
    },
  };
};

interface DuplicateTaskProps extends WithStyles<typeof styles> {
  duplicateTaskName: string;
  closePopup: (isDeployed: boolean) => void;
}

const DuplicateTaskView: React.FC<DuplicateTaskProps> = ({
  duplicateTaskName,
  classes,
  closePopup,
}) => {
  const [loading, setLoading] = React.useState(false);
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [taskDetails, setTaskDetails] = React.useState({
    config: {
      resources: {
        memoryMB: 2048,
        virtualCores: 1,
      },
      driverResources: {
        memoryMB: 2048,
        virtualCores: 1,
      },
      connections: [
        {
          from: '',
          to: '',
        },
      ],
      comments: [],
      postActions: [],
      properties: {},
      processTimingEnabled: true,
      stageLoggingEnabled: false,
      pushdownEnabled: false,
      stages: [{}, {}] as IStagesInterface[],
      transformationPushdown: null,
      schedule: '0 * * * *',
      engine: 'spark',
      numOfRecordsPreview: 100,
      maxConcurrentRuns: 1,
    },
    connections: {
      sourceName: '',
      sourceDb: '',
      targetName: '',
      targetDb: '',
    },
    tags: [],
    artifact: {},
  });

  React.useEffect(() => {
    MyPipelineApi.get({ namespace: currentNamespace, appId: duplicateTaskName }).subscribe(
      (data) => {
        const draftObj = JSON.parse(data.configuration);
        setTaskDetails(
          produce((prev) => {
            prev.connections.sourceName = draftObj.stages[0].name;
            prev.connections.sourceDb = parseJdbcString(
              draftObj.stages[0].plugin.properties.connectionString,
              draftObj.stages[0].plugin.properties.jdbcPluginName
            );
            prev.connections.targetName = draftObj.stages[1].name;
            prev.connections.targetDb = draftObj.stages[1].plugin.properties.dataset;
            prev.config = draftObj;
            prev.artifact = data.artifact;
          })
        );
        setTaskDescription(data.description);
        getTablesList(draftObj.stages[0].name, draftObj.stages[0].plugin.properties.whitelist);
      }
    );
    MyMetadataApi.getMetadata({
      namespace: currentNamespace,
      entityType: 'apps',
      entityId: duplicateTaskName,
    }).subscribe((metaData) => {
      console.log(metaData);
      setTaskDetails(
        produce((draft) => {
          draft.tags = metaData.find((item) => item.scope === 'USER').tags;
        })
      );
    });
  }, []);

  const addTags = (entityId) => {
    const params = {
      namespace: currentNamespace,
      entityType: 'apps',
      entityId,
    };
    MyMetadataApi.addTags(params, taskDetails.tags).subscribe(
      (message) => {
        console.log('tags updated');
      },
      (error) => {
        console.log('tags-error', error);
      }
    );
  };

  const deployPipeline = () => {
    setLoading(true);
    MyPipelineApi.list({
      namespace: currentNamespace,
    }).subscribe((list) => {
      list.some((item) => item.name === taskName)
        ? (console.log('pipeline name already exists ...'),
          setLoading(false),
          setAlert(() => {
            return {
              show: true,
              message: 'pipeline name already exists ...',
              type: 'error',
            };
          }))
        : MyPipelineApi.publish(
            {
              namespace: currentNamespace,
              appId: taskName,
            },
            {
              name: taskName,
              description: taskDescription,
              artifact: taskDetails.artifact,
              config: taskDetails.config,
            }
          ).subscribe(
            (message) => {
              console.log('deploy', message);
              console.log('mytest', taskDetails.config);
              addTags(taskName);
              setLoading(false);
              closePopup(true);
            },
            (err) => {
              console.log(err.response);
              console.log('mytest', taskDetails.config);
            }
          );
    });
  };
  const [items, setItems] = React.useState([]);
  const getTablesList = (connectionId: string, selectedList: string) => {
    ConnectionsApi.exploreConnection(
      {
        context: currentNamespace,
        connectionid: connectionId,
      },
      {
        path: '/public',
        limit: 1000,
      }
    ).subscribe(
      (message) => {
        setItems(
          message.entities.map((item) => {
            if (selectedList.split(',').includes(item.name)) {
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
      },
      (err) => {
        console.log('TablesList-err', err);
      }
    );
  };
  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    setTaskDetails(
      produce((prev) => {
        prev.config.stages[0].plugin.properties.whitelist = items
          .filter((item) => item.selected)
          .map((item) => item.tableName)
          .join();
      })
    );
  }, [items]);
  const [taskName, setTaskName] = React.useState(getClonePipelineName(duplicateTaskName));
  const [taskDescription, setTaskDescription] = React.useState('');
  const [taskNameError, setTaskNameError] = React.useState({
    error: false,
    errorMsg: '',
  });
  const [extraction, setExtraction] = React.useState('No');
  const [logs, setLogs] = React.useState('No');
  const [customTablesSelection, setCustomTableSelection] = React.useState(false);
  const [taskTagError, setTaskTagError] = React.useState({
    error: false,
    errorMsg: T.translate(`${I18N_PREFIX}.Errors.taskTagError`),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (extraction === 'Yes' && customTablesSelection === false) {
      setCustomTableSelection(true);
    } else {
      deployPipeline();
    }
  };

  const taskSpaceError = T.translate(`${I18N_PREFIX}.Errors.taskNameFormatError`).toString();
  const taskLengthErrorMessage = T.translate(
    `${I18N_PREFIX}.Errors.taskNameLengthError`
  ).toString();
  const arrowIcon = '/cdap_assets/img/arrow.svg';
  const arrowBack = '/cdap_assets/img/arrow-back.svg';
  const [alert, setAlert] = React.useState({
    show: false,
    message: '',
    type: 'error',
  });
  return (
    <div className={classes.root}>
      {loading && (
        <div>
          <div style={{ height: '50px', backgroundColor: 'rgba(255, 255, 255, 0.7)' }}></div>
          <LoadingSVGCentered />
        </div>
      )}
      <Duplicatepopup
        open={alert.show}
        taskName={taskName}
        onSubmit={(newName) => {
          setTaskName(newName);
          deployPipeline();
        }}
        onClose={() => closePopup(false)}
      />
      {/* <OverlaySmall
        onCancel={() => closePopup(false)}
        open={alert.show}
        title="Pipeline name already exists"
        description={`The pipeline with name "${taskName}" already exists, please enter a new name to create this pipeline`}
        onSubmit={() => {
          setAlert((prev) => {
            return {
              ...prev,
              show: false,
            };
          });
          setCustomTableSelection(false);
        }}
        submitText="Change name"
        errorType
      /> */}
      <div className={classes.sdleTskWrapper} data-cy="duplicate-container">
        <div className={classes.headerWrapper}>
          {customTablesSelection && (
            <img
              src={arrowBack}
              alt="back arrow"
              style={{ paddingLeft: '8px', marginRight: '-22px', cursor: 'pointer' }}
              onClick={() => setCustomTableSelection(false)}
            />
          )}
          <IngestionHeader title="Duplicate Task" />
        </div>

        {!customTablesSelection && (
          <div className={classes.connectionContainer}>
            <div className={classes.taskDate}>
              {taskDetails.connections.sourceName}
              {' | '}
              {taskDetails.connections.sourceDb}
            </div>
            <img className={classes.arrow} src={arrowIcon} alt="arrow" />
            <div className={classes.taskDate}>
              {taskDetails.connections.targetName}
              {' | '}
              {taskDetails.connections.targetDb}
            </div>
          </div>
        )}
        <div className={classes.container}>
          {customTablesSelection ? (
            items.length ? (
              <CustomTableSelection tablesList={items} setItems={setItems} />
            ) : (
              <h3 className={classes.emptyList}>There are no tables available ...</h3>
            )
          ) : (
            <>
              <TaskInfoFields
                taskName={taskName}
                taskDescription={taskDescription}
                tags={taskDetails.tags}
                setTaskName={setTaskName}
                setTags={(tags) =>
                  setTaskDetails(
                    produce((prev) => {
                      prev.tags = tags;
                    })
                  )
                }
                setTaskDescription={setTaskDescription}
                setTaskNameError={setTaskNameError}
                setTaskTagError={setTaskTagError}
                taskNameError={taskNameError}
                taskTagError={taskTagError}
              />
              <div className={classes.radiooo}>
                <div className={classes.extraction}>
                  <FormLabel className={classes.labelText}>
                    Do you like to update the source table selection for extraction?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={extraction}
                    className={classes.radioGroup}
                    onChange={(e) => {
                      setExtraction(e.target.value);
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          classes={{ root: classes.radio, checked: classes.checked }}
                          color="primary"
                        />
                      }
                      value="Yes"
                      label={<Typography className={classes.choices}>Yes</Typography>}
                      className={classes.choices}
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          classes={{ root: classes.radio, checked: classes.checked }}
                          color="primary"
                        />
                      }
                      value="No"
                      label={<Typography className={classes.choices}>No</Typography>}
                      className={classes.choices}
                    />
                  </RadioGroup>
                </div>
                <div className={classes.ingestion}>
                  <FormLabel className={classes.labelText}>
                    Do you like to log data errors during data ingestion?
                  </FormLabel>
                  <RadioGroup
                    row
                    value={logs}
                    className={classes.radioGroup}
                    onChange={(e) => setLogs(e.target.value)}
                  >
                    <FormControlLabel
                      control={
                        <Radio
                          classes={{ root: classes.radio, checked: classes.checked }}
                          color="primary"
                        />
                      }
                      value="Yes"
                      label={<Typography className={classes.choices}>Yes</Typography>}
                      className={classes.choices}
                    />
                    <FormControlLabel
                      control={
                        <Radio
                          classes={{ root: classes.radio, checked: classes.checked }}
                          color="primary"
                        />
                      }
                      value="No"
                      label={<Typography className={classes.choices}>No</Typography>}
                      className={classes.choices}
                    />
                  </RadioGroup>
                </div>
              </div>
            </>
          )}
          <ButtonComponent
            onCancel={() => closePopup(false)}
            onSubmit={handleSubmit}
            disableSubmit={
              taskNameError.error ||
              taskName.length === 0 ||
              taskTagError.error ||
              (customTablesSelection && !items.length) ||
              (customTablesSelection ? items.every((a) => a.selected === false) : false)
            }
            submitText={
              extraction === 'Yes' && customTablesSelection === false
                ? 'Next'
                : 'DUPLICATE & DEPLOY TASK'
            }
          />
        </div>
      </div>
    </div>
  );
};

const DuplicateTask = withStyles(styles)(DuplicateTaskView);
export default DuplicateTask;
