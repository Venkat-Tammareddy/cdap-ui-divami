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
import { EntityTopPanel } from 'components/EntityTopPanel';
import { Button } from '@material-ui/core';
import history from 'services/history';
import ErrorBoundary from 'components/ErrorBoundary';
import DeployedPipelineView from 'components/PipelineList/DeployedPipelineView';
import DraftPipelineView from 'components/PipelineList/DraftPipelineView';
import IngestionTaskList from 'components/Ingestion/IngestionTaskList/index';
import DraftsList from 'components/Ingestion/DraftsList/DraftsList';
import SheduleTask from 'components/Ingestion/SheduleTask/SheduleTask';
import T from 'i18n-react';
import SearchIcon from '@material-ui/icons/Search';
import { TextField } from '@material-ui/core';
import IngestionHeader from '../IngestionHeader/IngestionHeader';
import { getCurrentNamespace } from 'services/NamespaceStore';
import { gql } from 'apollo-boost';
import LoadingSVGCentered from 'components/LoadingSVGCentered';
import { useQuery } from '@apollo/react-hooks';
import { categorizeGraphQlErrors } from 'services/helpers';
import If from 'components/If';
import ErrorBanner from 'components/ErrorBanner';
import { MyPipelineApi } from 'api/pipeline';
import { humanReadableDate } from 'services/helpers';
import { MyMetadataApi } from 'api/metadata';

const I18N_PREFIX = 'features.PipelineList.DeployedPipelineView';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
    },
    content: {
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      padding: '15px 50px',
    },
    tabbleViewWrpr: {
      padding: '0px 18px',
      height: 'calc(100% - 112px)',
      borderTop: '1px solid #A5A5A5',
    },
    tabsWrapper: {
      padding: '18px 0px',
      display: 'grid',
      gridTemplateColumns: '0.1fr 1fr 0fr',
    },
    tabContainer: {
      height: '80px',
      // display: 'grid',
      // gridTemplateColumns: '0fr 1fr 0fr',
    },
    tabs: {
      minWidth: '30px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: ' #202124;',
      letterSpacing: '0.13px',
      padding: '7.5px',
      marginRight: '22.5px',
      cursor: 'pointer',
      // '&:active': {
      //   textDecoration: 'underline',
      // },
    },
    search: {
      width: '276px',
      height: '36px',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderRadius: '23px',
        },
        height: '36px',
      },
      '& .MuiOutlinedInput-adornedStart ': {
        padding: '8px',
      },
      '& .MuiOutlinedInput-input': {
        padding: '0px',
        textIndent: '10px',
      },
    },
    homeHeaders: {
      display: 'flex',
      gap: '500px',
    },
  };
};

interface IIngestionHomeProps extends WithStyles<typeof styles> {}
const PREFIX = 'features.PipelineList';
const IngestionHomeView: React.FC<IIngestionHomeProps> = ({ classes }) => {
  const [displayDrafts, setDisplayDrafts] = React.useState(false);
  const [draftsList, setDraftsList] = React.useState([]);
  const [search, setSearch] = React.useState('');
  const namespace = getCurrentNamespace();

  React.useEffect(() => {
    MyPipelineApi.getDrafts({
      context: namespace,
    }).subscribe(
      (list) => {
        console.log('h', list);
        setDraftsList(list);
      },
      (err) => {
        console.log('err', err);
      }
    );
  }, []);

  const QUERY = gql`
  {
    pipelines(namespace: "${getCurrentNamespace()}") {
      name,
      description,
      artifact {
        name
      },
      runs {
        runid,
        status,
        starting,
        start,
        end,
        profileId
      },
      totalRuns,
      nextRuntime {
        id,
        time
      }
    }
  }
`;

  const { loading, error, data, refetch, networkStatus } = useQuery(QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });
  if (loading || networkStatus === 4) {
    return <LoadingSVGCentered />;
  }
  const setIngestionTaskList = () => {
    console.log('mytest', data.pipelines);
    return data.pipelines.map((ele) => {
      return {
        runId: ele.runs.runid,
        taskName: ele.name,
        status: ele.runs.length === 0 ? '' : ele.runs[0].status,
        sourceConnectionDb: '',
        sourceConnection: '',
        targetConnection: '',
        targetConnectionDb: '',
        tags: [],
        runs: [],
        moreBtnVisible: true,
        stopBtn: ele.runs.length === 0 ? false : ele.runs[0].status === 'RUNNING' && true,
      };
    });
  };
  let bannerMessage = '';
  if (error) {
    const errorMap = categorizeGraphQlErrors(error);
    // Errors thrown here will be caught by error boundary
    // and will show error to the user within pipeline list view

    // Each error type could have multiple error messages, we're using the first one available
    if (errorMap.hasOwnProperty('pipelines')) {
      throw new Error(errorMap.pipelines[0]);
    } else if (errorMap.hasOwnProperty('network')) {
      throw new Error(errorMap.network[0]);
    } else if (errorMap.hasOwnProperty('generic')) {
      throw new Error(errorMap.generic[0]);
    } else {
      if (Object.keys(errorMap).length > 1) {
        // If multiple services are down
        const message = T.translate(`${I18N_PREFIX}.graphQLMultipleServicesDown`).toString();
        throw new Error(message);
      } else {
        // Pick one of the leftover errors to show in the banner;
        bannerMessage = Object.values(errorMap)[0][0];
      }
    }
  }

  const mapDratsList = () => {
    return draftsList.map((ele) => {
      return {
        pipeLineName: ele.name,
        type: 'Batch',
        lastSaved: humanReadableDate(ele.updatedTimeMillis),
      };
    });
  };
  return (
    <>
      {/* <SheduleTask /> */}
      <If condition={!!error && !!bannerMessage}>
        <ErrorBanner error={bannerMessage} />
      </If>
      <div className={classes.root}>
        <IngestionHeader
          title="Ingest Tasks"
          createBtn
          onCreate={() => history.push('ingestion/create')}
        />
        <div className={classes.tabbleViewWrpr}>
          <div className={classes.tabsWrapper}>
            <div>
              <span
                className={classes.tabs}
                onClick={() => setDisplayDrafts(false)}
                style={{
                  borderBottom: !displayDrafts ? '4px solid #4285F4' : 'none',
                  opacity: displayDrafts ? '0.7' : '',
                }}
              >
                TASKS ({data.pipelines.length})
              </span>
            </div>
            <div>
              <span
                className={classes.tabs}
                onClick={() => setDisplayDrafts(true)}
                style={{
                  borderBottom: displayDrafts ? '4px solid #4285F4' : 'none',
                  opacity: !displayDrafts ? '0.7' : '',
                }}
              >
                DRAFTS ({draftsList.length})
              </span>
            </div>
            <TextField
              variant="outlined"
              placeholder={'search tasks'}
              className={classes.search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              autoFocus={false}
              data-cy="connections-search"
            />
          </div>
          {displayDrafts ? (
            <DraftsList data={mapDratsList()} searchText={search} />
          ) : (
            <IngestionTaskList searchText={search} data={setIngestionTaskList()} />
          )}
        </div>
      </div>
    </>
  );
};

const IngestionHome = withStyles(styles)(IngestionHomeView);
export default IngestionHome;
