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
import { Grid, Paper } from '@material-ui/core';
import { MyMetadataApi } from 'api/metadata';
import NamespaceStore from 'services/NamespaceStore';

const styles = (theme): StyleRules => {
  return {
    paper: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124',
      lineHeight: '24px',
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      textOverflow: 'ellipsis',
    },
    paperCount: {
      boxShadow: 'none',
      backgroundColor: 'rgb(255 255 255 / 0%)',
      color: '#4285F4',
    },
    flex: {
      display: 'flex',
    },
  };
};

interface ITaskTagsProps extends WithStyles<typeof styles> {
  taskName: string;
}
const TaskTagsView: React.FC<ITaskTagsProps> = ({ classes, taskName }) => {
  const namespace = NamespaceStore.getState().selectedNamespace;
  const [tags, setTags] = React.useState([]);
  const [viewMore, setViewMore] = React.useState(true);
  React.useEffect(() => {
    MyMetadataApi.getTags({
      namespace,
      entityType: 'apps',
      entityId: taskName,
    }).subscribe((tags) => {
      console.log(tags);
      setTags(tags.tags.filter((tag) => tag.scope === 'USER').map((tag) => tag.name));
      {
        tags.tags.length < 1 && setViewMore(false);
      }
    });
  }, []);

  return (
    <Grid container spacing={0}>
      <Grid item xs={12}>
        {tags.length === 0 && (
          <p style={{ color: '#202124', fontSize: '14px', fontFamily: 'Lato' }}>- -</p>
        )}
        {viewMore ? (
          <>
            <Paper className={classes.paper}>{tags[0]}</Paper>
            {tags.length > 1 ? (
              <Paper
                className={classes.paperCount}
                onClick={(e) => {
                  e.stopPropagation();
                  setViewMore(false);
                }}
              >
                +{tags.length - 1} more
              </Paper>
            ) : (
              ''
            )}
          </>
        ) : (
          <div className={classes.flex}>
            {tags.map((tag, index) => (
              <Paper key={tag} className={classes.paper}>
                {(index ? ', ' : '') + tag}
              </Paper>
            ))}
          </div>
        )}

        {/* <Paper className={classes.paper}>{tags[0]}</Paper>
        {tags.length > 1 ? (
          <Paper className={classes.paperCount}>+{tags.length - 1} more</Paper>
        ) : (
          ''
        )} */}
      </Grid>
    </Grid>
  );
};

const TaskTags = withStyles(styles)(TaskTagsView);
export default TaskTags;
