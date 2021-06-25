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
import TaskTrackingWizard from '../IngestTaskWizard/TaskTrackingWizard';
import { Button, Paper, Typography } from '@material-ui/core';
import { EntityTopPanel } from 'components/EntityTopPanel';
import TaskDetails from '../TaskDetails/TaskDetails';
import SelectConnections from '../SelectConnections/SelectConnections';
import TaskConfiguration from '../TaskConfiguration/TaskConfiguration';
import MappingLayout from '../MappingLayout/MappingLayout';
import uuidV4 from 'uuid/v4';
import { MyPipelineApi } from 'api/pipeline';
import { ConnectionsApi } from 'api/connections';
import NamespaceStore from 'services/NamespaceStore';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    wizardAndContentWrapper: {
      display: 'grid',
      gridTemplateColumns: '250px 1fr',
      gridTemplateRows: '100%',
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      overflowY: 'hidden',
    },
    wizard: {
      boxShadow: ' 0px -1px 10px 0.5px gray',
    },
    content: {},
  };
};

interface ICreateIngestionProps extends WithStyles<typeof styles> {
  test: string;
}
const CreateIngestionView: React.FC<ICreateIngestionProps> = ({ classes }) => {
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const [connections, setConnections] = React.useState([]);
  const [draftId] = React.useState(uuidV4());
  const [draftConfig, setDraftConfig] = React.useState({
    name: '',
    description: '',
    artifact: {
      name: 'cdap-data-pipeline',
      version: '6.5.0-SNAPSHOT',
      scope: 'SYSTEM',
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
      stages: [],
      transformationPushdown: null,
      schedule: '0 * * * *',
      engine: 'spark',
      numOfRecordsPreview: 100,
      maxConcurrentRuns: 1,
    },
  });
  const isFirstRun = React.useRef(true);
  React.useEffect(() => {
    ConnectionsApi.listConnections({
      context: currentNamespace,
    }).subscribe(
      (message) => {
        console.log('connections', message);
        setConnections(message);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);
  React.useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    submitDraft();
    console.log(draftConfig);
  }, [draftConfig]);
  const submitDraft = () => {
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
      (message) => {
        console.log('draft-deleted', message);
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const deployPipeline = () => {
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
      },
      (err) => {
        console.log(err);
      }
    );
  };
  const steps = [
    'Task Details',
    'Source Connection',
    'Target Connection',
    'Target Mapping',
    'Configuration',
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const Content = () => {
    switch (activeStep) {
      case 0:
        return (
          <TaskDetails
            submitValues={(details: any) => {
              setDraftConfig((prevDraftConfig) => {
                return {
                  ...prevDraftConfig,
                  name: details.taskName,
                  description: details.taskDescription,
                };
              });
              handleNext();
            }}
            handleCancel={(cancelEvent: any) => {
              console.log(cancelEvent);
            }}
          />
        );
      case 1:
        return (
          <SelectConnections
            selectionType="source"
            connectionsList={connections}
            submitConnection={(a: any) => {
              console.log(a);
              setDraftConfig((prevDraftConfig) => {
                return {
                  ...prevDraftConfig,
                  config: {
                    ...prevDraftConfig.config,
                    connections: [
                      {
                        from: a.name,
                        to: '',
                      },
                    ],
                    stages: [
                      {
                        name: a.name,
                        plugin: {
                          ...a.plugin,
                          name: 'MultiTableDatabase',
                          type: 'batchsource',
                          label: 'Multiple Database Tables',
                          artifact: {
                            name: 'multi-table-plugins',
                            version: '1.1.0',
                            scope: 'USER',
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
                    ],
                  },
                };
              });
              console.log(draftConfig);
              handleNext();
            }}
            handleCancel={(cancelEvent: any) => {
              console.log(cancelEvent);
            }}
          />
        );
      case 2:
        return (
          <SelectConnections
            selectionType="target"
            connectionsList={connections}
            submitConnection={(a: any) => {
              console.log(a);
              setDraftConfig((prevDraftConfig) => {
                return {
                  ...prevDraftConfig,
                  config: {
                    ...prevDraftConfig.config,
                    connections: [{ ...prevDraftConfig.config.connections[0], to: a.name }],
                    stages: [
                      ...prevDraftConfig.config.stages,
                      {
                        name: a.name,
                        plugin: {
                          name: 'BigQueryMultiTable',
                          type: 'batchsink',
                          label: 'BigQuery Multi Table',
                          artifact: {
                            name: 'google-cloud',
                            version: '0.18.0-SNAPSHOT',
                            scope: 'SYSTEM',
                          },
                          properties: {
                            ...a.plugin.properties,
                            dataset: 'ForHari',
                            referenceName: a.name,
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
                    ],
                  },
                };
              });
              handleNext();
            }}
            handleCancel={(cancelEvent: any) => {
              console.log(cancelEvent);
            }}
          />
        );
      case 3:
        return (
          <MappingLayout
            submitMappingType={(mappingType) => {
              console.log(mappingType);
              handleNext();
            }}
            handleCancel={(cancelEvent: any) => {
              console.log(cancelEvent);
            }}
          />
        );
      case 4:
        return <TaskConfiguration deploy={() => deployPipeline()} />;
      default:
        return (
          <>
            {activeStep < steps.length ? (
              <div className={classes.actionsContainer}>
                <Button disabled={activeStep === 0} onClick={handleBack} className={classes.button}>
                  Back
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleNext}
                  className={classes.button}
                >
                  {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                </Button>
              </div>
            ) : (
              <Paper square elevation={0} className={classes.resetContainer}>
                <Typography>All steps completed - you&apos;re finished</Typography>
                <Button onClick={handleReset} className={classes.button}>
                  Reset
                </Button>
              </Paper>
            )}
          </>
        );
    }
  };
  return (
    <div className={classes.root}>
      <EntityTopPanel title="Create Ingestion Task" />
      <div className={classes.wizardAndContentWrapper}>
        <div className={classes.wizard}>
          <TaskTrackingWizard steps={steps} activeStep={activeStep} draftConfig={draftConfig} />
        </div>
        <div className={classes.content}>{Content()}</div>
      </div>
    </div>
  );
};

const CreateIngestion = withStyles(styles)(CreateIngestionView);
export default CreateIngestion;
