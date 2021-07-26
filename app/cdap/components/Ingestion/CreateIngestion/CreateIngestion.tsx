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
import TaskTrackingWizard from '../IngestTaskWizard/TaskTrackingWizard';
import If from 'components/If';
import TaskInfo from '../TaskInfo/TaskInfo';
import SelectConnections from '../SelectConnections/SelectConnections';
import TaskConfiguration from '../TaskConfiguration/TaskConfiguration';
import MappingLayout from '../MappingLayout/MappingLayout';
import uuidV4 from 'uuid/v4';
import { MyPipelineApi } from 'api/pipeline';
import { ConnectionsApi } from 'api/connections';
import NamespaceStore from 'services/NamespaceStore';
import history from 'services/history';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
const I18N_PREFIX = 'features.CreateIngestion';
import Acknowledgement from '../Acknowledgement/Acknowledgement';
import IngestionHeader from '../IngestionHeader/IngestionHeader';
import CustomTablesSelection from '../CustomTableSelection/CustomTableSelection';
import { MyArtifactApi } from 'api/artifact';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    wizardAndContentWrapper: {
      display: 'grid',
      gridTemplateColumns: '252px 1fr',
      gridTemplateRows: '100%',
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      overflowY: 'hidden',
      borderTop: '1px solid #A5A5A5',
    },
    wizard: {
      boxShadow: '-2px 0 16px 0 rgba(0,0,0,0.15)',
    },
    content: {
      overflowY: 'auto',
    },
  };
};
export interface IStagesInterface {
  name: string;
  plugin: {
    name: string;
    type: string;
    label?: string;
    properties: {
      referenceName: string;
      connectionString: string;
      jdbcPluginName: string;
      user: string;
      password: string;
      whitelist: string;
    };
  };
}
interface ICreateIngestionProps extends WithStyles<typeof styles> {}
const CreateIngestionView: React.FC<ICreateIngestionProps> = ({ classes }) => {
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [deployLoader, setDeployLoader] = React.useState(false);
  const [ack, setAck] = React.useState(false);
  const [connections, setConnections] = React.useState([]);
  const [draftId] = React.useState(uuidV4());
  const [artifactsList, setArtifactsList] = React.useState([]);
  const [draftConfig, setDraftConfig] = React.useState({
    name: '',
    description: '',
    artifact: {
      name: '',
      version: '',
      scope: '',
      label: 'Data Pipeline - Batch',
    },
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
  });

  React.useEffect(() => {
    ConnectionsApi.listConnections({
      context: currentNamespace,
    }).subscribe(
      (message) => {
        setConnections(message);
      },
      (err) => {
        console.log(err);
      }
    );
    MyArtifactApi.list({ namespace: currentNamespace }).subscribe(
      (message) => {
        setArtifactsList(message);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    saveDraft();
  }, [draftConfig]);

  const saveDraft = () => {
    MyPipelineApi.saveDraft(
      {
        context: currentNamespace,
        draftId,
      },
      draftConfig
    ).subscribe(
      (message) => {
        console.log('draft', message);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const deleteDraft = () => {
    MyPipelineApi.deleteDraft({
      context: currentNamespace,
      draftId,
    }).subscribe(
      (message) => {},
      (err) => {
        console.log(err);
      }
    );
  };

  const deployPipeline = () => {
    setDeployLoader(true);
    MyPipelineApi.publish(
      {
        namespace: currentNamespace,
        appId: draftConfig.name,
      },
      draftConfig
    ).subscribe(
      (message) => {
        console.log('deploy', message);
        deleteDraft();
        setDeployLoader(false);
        setAck(true);
        console.log('mytest', draftConfig);
      },
      (err) => {
        console.log(err);
        setDeployLoader(false);
      }
    );
  };

  const goToIngestionHome = () => {
    history.replace(`/ns/${currentNamespace}/ingestion`);
  };
  const steps = [
    T.translate(`${I18N_PREFIX}.Steps.taskDetails`),
    T.translate(`${I18N_PREFIX}.Steps.source`),
    T.translate(`${I18N_PREFIX}.Steps.target`),
    T.translate(`${I18N_PREFIX}.Steps.mapping`),
    T.translate(`${I18N_PREFIX}.Steps.configuration`),
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [stepProgress, setStepProgress] = React.useState(0);
  const [customTablesSelection, setCustomTablesSelection] = React.useState(false);
  const [cardSelected, setCardSelected] = React.useState('none');

  const handleNext = () => {
    activeStep === stepProgress && setStepProgress((prev) => prev + 1);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const Content = () => {
    switch (activeStep) {
      case 0:
        return (
          <TaskInfo
            draftConfig={draftConfig}
            submitValues={(details: any) => {
              setDraftConfig((prevDraftConfig) => {
                return {
                  ...prevDraftConfig,
                  name: details.taskName,
                  description: details.taskDescription,
                  artifact: {
                    ...prevDraftConfig.artifact,
                    ...artifactsList.find((artifact) => artifact.name === 'cdap-data-pipeline'),
                  },
                };
              });
              handleNext();
            }}
            handleCancel={() => {
              goToIngestionHome();
            }}
          />
        );
      case 1:
        return (
          <SelectConnections
            selectionType={T.translate(`${I18N_PREFIX}.SelectConnections.source`).toString()}
            connectionsList={connections}
            draftConfig={draftConfig}
            submitConnection={(a: any) => {
              setDraftConfig((prevDraftConfig) => {
                return {
                  ...prevDraftConfig,
                  config: {
                    ...prevDraftConfig.config,
                    connections: [
                      {
                        ...prevDraftConfig.config.connections[0],
                        from: a.name,
                      },
                    ],
                    stages: [
                      {
                        name: a.name,
                        connectionType: a.connectionType,
                        plugin: {
                          name: 'MultiTableDatabase',
                          type: 'batchsource',
                          artifact: artifactsList.find(
                            (artifact) => artifact.name === 'multi-table-plugins'
                          ),
                          properties: {
                            ...a.plugin.properties,
                            referenceName: 'ingestion-multitable-bigquery',
                            whitelist: '',
                          },
                        },
                        outputSchema: [
                          {
                            name: 'etlSchemaBody',
                            schema: '',
                          },
                        ],
                        id: a.name,
                      },
                      prevDraftConfig.config.stages[1],
                    ],
                  },
                };
              });
              handleNext();
            }}
            handleCancel={() => {
              goToIngestionHome();
            }}
          />
        );
      case 2:
        return (
          <SelectConnections
            selectionType={T.translate(`${I18N_PREFIX}.SelectConnections.target`).toString()}
            connectionsList={connections}
            draftConfig={draftConfig}
            submitConnection={(a: any) => {
              setDraftConfig((prevDraftConfig) => {
                return {
                  ...prevDraftConfig,
                  config: {
                    ...prevDraftConfig.config,
                    connections: [{ ...prevDraftConfig.config.connections[0], to: a.name }],
                    stages: [
                      prevDraftConfig.config.stages[0],
                      {
                        name: a.name,
                        connectionType: a.connectionType,
                        plugin: {
                          ...a.plugin,
                          artifact: artifactsList.find(
                            (artifact) => artifact.name === 'google-cloud'
                          ),
                        },
                        outputSchema: [
                          {
                            name: 'etlSchemaBody',
                            schema: '',
                          },
                        ],
                        id: a.name,
                      },
                    ],
                  },
                };
              });
              handleNext();
            }}
            handleCancel={() => {
              goToIngestionHome();
            }}
          />
        );
      case 3:
        return (
          <>
            {customTablesSelection ? (
              <CustomTablesSelection
                submitValues={(list) => {
                  setCustomTablesSelection(false);
                  setDraftConfig(
                    (prevDraftConfig) => {
                      return {
                        ...prevDraftConfig,
                        config: {
                          ...prevDraftConfig.config,
                          stages: [
                            {
                              ...prevDraftConfig.config.stages[0],
                              plugin: {
                                ...prevDraftConfig.config.stages[0].plugin,
                                properties: {
                                  ...prevDraftConfig.config.stages[0].plugin.properties,
                                  whitelist: list,
                                },
                              },
                            },
                            prevDraftConfig.config.stages[1],
                          ],
                        },
                      };
                    }
                    // produce((state) => {
                    //   state.config.stages[0].plugin.properties.whitelist = list.join();
                    // })
                  );
                  handleNext();
                }}
                handleCancel={() => goToIngestionHome()}
                connectionId={draftConfig.config.stages[0].name}
              />
            ) : (
              <MappingLayout
                cardSelected={cardSelected}
                setCardSelected={setCardSelected}
                submitMappingType={(mappingType) => {
                  mappingType === 'custom' ? setCustomTablesSelection(true) : handleNext();
                }}
                handleCancel={() => goToIngestionHome()}
              />
            )}
          </>
        );
      case 4:
        return (
          <TaskConfiguration
            deploy={() => {
              deployPipeline();
            }}
            onCancel={() => goToIngestionHome()}
          />
        );
      default:
        return;
    }
  };
  return (
    <div className={classes.root}>
      <IngestionHeader title={T.translate(`${I18N_PREFIX}.createIngest`).toString()} />
      <If condition={deployLoader}>
        <LoadingSVGCentered />
      </If>
      {ack ? (
        <Acknowledgement gotoTasks={() => goToIngestionHome()} />
      ) : (
        <div className={classes.wizardAndContentWrapper}>
          <div className={classes.wizard}>
            <TaskTrackingWizard
              steps={steps}
              activeStep={activeStep}
              draftConfig={draftConfig}
              stepProgress={stepProgress}
              stepperNav={(step) => step <= stepProgress && setActiveStep(step)}
            />
          </div>
          <div className={classes.content}>{Content()}</div>
        </div>
      )}
    </div>
  );
};

const CreateIngestion = withStyles(styles)(CreateIngestionView);
export default CreateIngestion;
