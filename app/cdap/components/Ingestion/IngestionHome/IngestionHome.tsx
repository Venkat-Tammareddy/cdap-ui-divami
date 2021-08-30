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
import withStyles, { WithStyles, StyleRules } from '@material-ui/core/styles/withStyles';
import history from 'services/history';
import IngestionTaskList from 'components/Ingestion/IngestionTaskList/index';
import DraftsList from 'components/Ingestion/DraftsList/DraftsList';
import T from 'i18n-react';
import { Button, Checkbox, Menu, MenuItem, Paper, TextField } from '@material-ui/core';
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
import { ingestionContext } from 'components/Ingestion/ingestionContext';
import OverlaySmall from '../OverlaySmall/OverlaySmall';
import Pagination from '@material-ui/lab/Pagination';

const I18N_PREFIX = 'features.PipelineList.DeployedPipelineView';

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '100%',
      '& .MuiPaginationItem-root': {
        height: '24px',
        minWidth: '24px',
        fontFamily: 'Lato',
        fontSize: '14px',
        lineHeight: '24px',
        '&:focus': {
          outline: 'none',
        },
      },
    },
    content: {
      height: 'calc(100% - 50px)', // 100% - height of EntityTopPanel
      padding: '15px 50px',
      display: 'flex',
      flexDirection: 'column',
    },
    tabbleViewWrpr: {
      padding: '0px 18px',
      // height: 'calc(100% - 112px)',
      borderTop: '1px solid #A5A5A5',
      display: 'flex',
      flexDirection: 'column',
    },
    tabsWrapper: {
      padding: '18px 0px',
      display: 'grid',
      gridTemplateColumns: '0.1fr 1fr 0fr 0fr 0fr',
    },
    tabContainer: {
      height: '80px',
      display: 'grid',
      gridTemplateColumns: '0fr 1fr 0fr',
    },
    tabs: {
      minWidth: '30px',
      maxWidth: '70px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: ' #202124;',
      letterSpacing: '0.13px',
      padding: '7.5px',
      marginRight: '22.5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      // '&:active': {
      //   textDecoration: 'underline',
      // },
    },
    draftTabs: {
      minWidth: '30px',
      fontFamily: 'Lato',
      fontSize: '14px',
      color: ' #202124;',
      letterSpacing: '0.13px',
      paddingBottom: '10px',
      // marginRight: '22.5px',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
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
      paddingRight: '5px',
    },
    homeHeaders: {
      display: 'flex',
      gap: '500px',
    },
    paginationWrapper: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      margin: '19.5px 0px',
    },
    filterIcn: {
      paddingTop: '10px',
      cursor: 'pointer',
    },
    paper: {
      //   border: '1px solid green',
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      fontSize: '14px',
      color: '#202124',
      textOverflow: 'ellipsis',
    },
    checkbox: {
      margin: '0',
    },
    filterTitle: {
      fontFamily: 'Lato',
      color: '#202124',
      fontSize: '18px',
      letterSpacing: '0',
      marginLeft: '19px',
      marginTop: '20px',
      marginBottom: '2',
    },
    applyButton: {
      marginLeft: '62px',
      width: '80px',
      fontSize: '14px',
      marginTop: '6px',
    },
    menuItem: {
      height: '34px',
      paddingTop: '11px',
      fontSize: '16px',
      fontFamily: 'Lato',
    },
    hrLine: {
      width: '90%',
      borderTop: '1px solid #A5A5A5',
    },
  };
};

interface IIngestionHomeProps extends WithStyles<typeof styles> {}
const IngestionHomeView: React.FC<IIngestionHomeProps> = ({ classes }) => {
  const { setIngestionListfn } = useContext(ingestionContext);
  const [displayDrafts, setDisplayDrafts] = React.useState(false);
  const [draftsList, setDraftsList] = React.useState([]);
  const [tasksList, setTasksList] = React.useState([]);
  const [loader, setLoader] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const namespace = getCurrentNamespace();
  const [pageNo, setPageNo] = React.useState(1);

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [filterOptions, setFilterOptions] = React.useState([]);
  React.useEffect(() => {
    MyPipelineApi.getDrafts({
      context: namespace,
    }).subscribe(
      (list) => {
        console.log('h', list);
        setDraftsList(list);
        setLoader(false);
      },
      (err) => {
        console.log('err', err);
      }
    );
  }, [loader]);

  const QUERY = gql`
  {
    pipelines(namespace: "${getCurrentNamespace()}") {
      name
    }
  }
`;

  const { loading, data, refetch, networkStatus } = useQuery(QUERY, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    notifyOnNetworkStatusChange: true,
  });
  React.useEffect(() => {
    if (loading === false) {
      setIngestionListfn(data.pipelines);
      setTasksList(() => {
        return data.pipelines.map((ele) => {
          return {
            taskName: ele.name,
            // sourceConnectionDb: '',
            // sourceConnection: '',
            // targetConnection: '',
            // targetConnectionDb: '',
            // tags: [],
            // runs: [],
            // moreBtnVisible: true,
          };
        });
      });
    }
  }, [loading]);
  if (loading || loader || networkStatus === 4) {
    return <LoadingSVGCentered />;
  }
  // const setIngestionTaskList = () => {
  //   console.log('mytest', data.pipelines);
  //   setIngestionListfn(data.pipelines);
  //   return tasksList.map((ele) => {
  //     return {
  //       taskName: ele.name,
  //       sourceConnectionDb: '',
  //       sourceConnection: '',
  //       targetConnection: '',
  //       targetConnectionDb: '',
  //       tags: [],
  //       runs: [],
  //       moreBtnVisible: true,
  //     };
  //   });
  // };
  // const bannerMessage = '';
  // if (error) {
  //   const errorMap = categorizeGraphQlErrors(error);
  //   // Errors thrown here will be caught by error boundary
  //   // and will show error to the user within pipeline list view

  //   // Each error type could have multiple error messages, we're using the first one available
  //   if (errorMap.hasOwnProperty('pipelines')) {
  //     throw new Error(errorMap.pipelines[0]);
  //   } else if (errorMap.hasOwnProperty('network')) {
  //     throw new Error(errorMap.network[0]);
  //   } else if (errorMap.hasOwnProperty('generic')) {
  //     throw new Error(errorMap.generic[0]);
  //   } else {
  //     if (Object.keys(errorMap).length > 1) {
  //       // If multiple services are down
  //       const message = T.translate(`${I18N_PREFIX}.graphQLMultipleServicesDown`).toString();
  //       throw new Error(message);
  //     } else {
  //       // Pick one of the leftover errors to show in the banner;
  //       bannerMessage = Object.values(errorMap)[0][0];
  //     }
  //   }
  // }

  const searchIcon = '/cdap_assets/img/search.svg';
  const filterIcon = '/cdap_assets/img/filter.svg';

  const SearchIcon = () => {
    return <img src={searchIcon} alt="icon" />;
  };

  const options = ['All', 'Running', 'Success', 'Failed', 'Killed'];

  const mapDratsList = () => {
    return draftsList.map((ele) => {
      return {
        id: ele.id,
        pipeLineName: ele.name,
        type: 'Batch',
        lastSaved: humanReadableDate(ele.updatedTimeMillis),
      };
    });
  };
  const paginatedList = (list: any[]) => {
    const lastIndex = pageNo * 10;
    const firstIndex = lastIndex - 10;
    return list.slice(firstIndex, lastIndex);
  };
  // const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
  //   setPageNo(value);
  // };

  return (
    <>
      {/* <If condition={!!error && !!bannerMessage}>
        <ErrorBanner error={bannerMessage} />
      </If> */}
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
                onClick={() => {
                  setPageNo(1);
                  setDisplayDrafts(false);
                }}
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
                onClick={() => {
                  setPageNo(1);
                  setDisplayDrafts(true);
                }}
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
              placeholder={displayDrafts ? 'Search drafts' : 'Search tasks'}
              className={classes.search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon />,
              }}
              autoFocus={false}
              data-cy="connections-search"
            />
            <Paper className={classes.paper}>
              <img
                src={filterIcon}
                className={classes.filterIcn}
                alt="get a good browser"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setAnchorEl(e.currentTarget);
                }}
              />
              <Menu
                keepMounted
                anchorEl={anchorEl}
                open={open}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                onClose={(e: React.MouseEvent<HTMLButtonElement>) => {
                  e.preventDefault();
                  e.stopPropagation();
                  e.nativeEvent.stopImmediatePropagation();
                  setAnchorEl(null);
                }}
                PaperProps={{
                  style: {
                    height: '327px',
                    width: '204px',
                  },
                }}
              >
                <p className={classes.filterTitle}>Filter by Status</p>
                {options.map((option) => (
                  <MenuItem
                    key={option}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      e.nativeEvent.stopImmediatePropagation();
                      // optionSelect(option);
                    }}
                    className={classes.menuItem}
                  >
                    <Checkbox className={classes.checkbox} /> {option}
                  </MenuItem>
                ))}
                <hr className={classes.hrLine} />
                <Button variant="contained" color="primary" className={classes.applyButton}>
                  APPLY
                </Button>
              </Menu>
            </Paper>
          </div>
          {displayDrafts ? (
            <DraftsList
              data={paginatedList(mapDratsList())}
              searchText={search}
              reFetchDrafts={() => {
                setLoader(true);
              }}
            />
          ) : (
            <IngestionTaskList
              searchText={search}
              data={paginatedList(tasksList)}
              refetch={refetch}
            />
          )}
          <div className={classes.paginationWrapper}>
            <Pagination
              count={Math.ceil(displayDrafts ? draftsList.length / 10 : tasksList.length / 10)}
              color="primary"
              page={pageNo}
              onChange={(event, value) => {
                setPageNo(value);
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

const IngestionHome = withStyles(styles)(IngestionHomeView);
export default IngestionHome;
