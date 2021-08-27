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
import { useContext } from 'react';

import T from 'i18n-react';
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import TaskTrackingWizard from '../IngestTaskWizard/TaskTrackingWizard';
import uuidV4 from 'uuid/v4';
import { MyPipelineApi } from 'api/pipeline';
import { ConnectionsApi } from 'api/connections';
import NamespaceStore from 'services/NamespaceStore';
import history from 'services/history';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
const I18N_PREFIX = 'features.CreateIngestion';
import Acknowledgement from '../Acknowledgement/Acknowledgement';
import IngestionHeader from '../IngestionHeader/IngestionHeader';
import { MyArtifactApi } from 'api/artifact';
import { ingestionContext } from 'components/Ingestion/ingestionContext';
import { MyMetadataApi } from 'api/metadata';
import { useParams } from 'react-router';
import OverlaySmall from '../OverlaySmall/OverlaySmall';
import StepperContent from './StepperContent/StepperContent';
import Steps from './Steps/Steps';

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
  connectionType: string;
  id: string;
  plugin: {
    name: string;
    type: string;
    label?: string;
    artifact: {};
    properties: {
      referenceName: string;
      connectionString: string;
      jdbcPluginName: string;
      user: string;
      password: string;
      whitelist?: string;
    };
  };
}
export interface IDraftConfigInterface {
  name: string;
  description: string;
  artifact: {
    name: string;
    version: string;
    scope: string;
    label: string;
  };
  config: {
    resources: {
      memoryMB: number;
      virtualCores: number;
    };
    driverResources: {
      memoryMB: number;
      virtualCores: number;
    };
    connections: [
      {
        from: string;
        to: string;
      }
    ];
    comments: [];
    postActions: [];
    properties: {};
    processTimingEnabled: boolean;
    stageLoggingEnabled: boolean;
    pushdownEnabled: boolean;
    stages: IStagesInterface[];
    transformationPushdown: null;
    schedule: string;
    engine: string;
    numOfRecordsPreview: number;
    maxConcurrentRuns: number;
  };
}
interface ICreateIngestionProps extends WithStyles<typeof styles> {}
const CreateIngestionView: React.FC<ICreateIngestionProps> = ({ classes }) => {
  const currentNamespace = NamespaceStore.getState().selectedNamespace;
  const { setDraftObjfn } = useContext(ingestionContext);
  const [deployLoader, setDeployLoader] = React.useState(true);
  const [ack, setAck] = React.useState(false);
  const [connections, setConnections] = React.useState([]);
  const { id } = useParams<{ id: string }>();
  const [draftId, setDraftId] = React.useState(uuidV4());
  const [artifactsList, setArtifactsList] = React.useState([]);
  const [tags, setTags] = React.useState([]);
  const [alert, setAlert] = React.useState({
    show: false,
    title: '',
    description: '',
    type: 'error',
  });
  const [draftConfig, setDraftConfig] = React.useState<IDraftConfigInterface>({
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
    if (id) {
      MyPipelineApi.getDraftDetails({ context: currentNamespace, draftId: id }).subscribe(
        (data) => {
          setDraftId(id);
          setDraftConfig(data);
          setDeployLoader(false);
        }
      );
    } else {
      setDeployLoader(false);
    }
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
    console.log('mytags', tags);
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
    MyPipelineApi.list({
      namespace: currentNamespace,
    }).subscribe((list) => {
      list.some((item) => item.name === draftConfig.name)
        ? (console.log('pipeline name already exists ...'),
          setAlert(() => {
            return {
              show: true,
              title: 'Pipeline name already exists',
              description: `The pipeline with name "${draftConfig.name}" already exists, please enter a new name to create this pipeline`,
              type: 'duplicate-name',
            };
          }),
          setActiveStep(0),
          setDeployLoader(false))
        : MyPipelineApi.publish(
            {
              namespace: currentNamespace,
              appId: draftConfig.name,
            },
            draftConfig
          ).subscribe(
            (message) => {
              console.log('deploy', message);
              setDraftObjfn(draftConfig);
              deleteDraft();
              setDeployLoader(false);
              setAck(true);
              console.log('mytest', draftConfig);
              addTags(draftConfig.name);
            },
            (err) => {
              console.log(err);
              setDeployLoader(false);
            }
          );
    });
  };
  const addTags = (entityId) => {
    const params = {
      namespace: currentNamespace,
      entityType: 'apps',
      entityId,
    };
    MyMetadataApi.addTags(params, tags).subscribe(
      (message) => {
        console.log('tags updated');
      },
      (error) => {
        console.log('tags-error', error);
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
  const [cardSelected, setCardSelected] = React.useState('all');

  const handleNext = () => {
    activeStep === stepProgress && setStepProgress((prev) => prev + 1);
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleCancel = () => {
    setAlert(() => {
      return {
        show: true,
        title: 'Confirm exit',
        description: 'Are you sure you want to exit?',
        type: 'exit',
      };
    });
  };

  return (
    <div className={classes.root}>
      <OverlaySmall
        onCancel={() =>
          alert.type === 'exit'
            ? setAlert((prev) => {
                return {
                  ...prev,
                  show: false,
                };
              })
            : goToIngestionHome()
        }
        open={alert.show}
        title={alert.title}
        description={alert.description}
        onSubmit={() =>
          alert.type === 'exit'
            ? goToIngestionHome()
            : setAlert((prev) => {
                return {
                  ...prev,
                  show: false,
                };
              })
        }
        submitText={alert.type === 'exit' ? 'Exit' : 'Change name'}
        errorType
      />
      {deployLoader ? (
        <LoadingSVGCentered />
      ) : (
        <>
          {ack ? (
            <Acknowledgement gotoTasks={() => goToIngestionHome()} />
          ) : (
            <>
              <IngestionHeader title={T.translate(`${I18N_PREFIX}.createIngest`).toString()} />
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
                <div className={classes.content}>
                  <StepperContent
                    draftConfig={draftConfig}
                    activeStep={activeStep}
                    steps={Steps}
                    handleNext={handleNext}
                    tags={tags}
                    setTags={setTags}
                    setDraftConfig={setDraftConfig}
                    handleCancel={handleCancel}
                    artifactsList={artifactsList}
                    connectionsList={connections}
                    cardSelected={cardSelected}
                    setCardSelected={setCardSelected}
                    deploy={() => deployPipeline()}
                  />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

const CreateIngestion = withStyles(styles)(CreateIngestionView);
export default CreateIngestion;
