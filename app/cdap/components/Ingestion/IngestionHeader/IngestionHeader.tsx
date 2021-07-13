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

const styles = (theme): StyleRules => {
  return {
    root: {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      margin: '0px 28px',
    },
    title: {
      fontFamily: 'Lato',
      fontSize: '18px',
      color: '#202124',
      letterSpacing: '0',
    },
    titleDesign: {
      marginLeft: '10px',
      marginRight: 'auto',
    },
    create: {
      fontFamily: 'Lato',
      fontSize: '16px',
      color: '#202124',
      letterSpacing: '0.25px',
      lineHeight: '24px',
      cursor: 'pointer',
    },
    createIcon: {
      marginRight: '10px',
    },
  };
};

interface IngestionHeaderProps extends WithStyles<typeof styles> {
  title: string;
  create?: boolean;
  onCreate?: () => void;
}
const IngestionHeaderView: React.FC<IngestionHeaderProps> = ({
  classes,
  title,
  create,
  onCreate,
}) => {
  const titleDesignIcon = '/cdap_assets/img/title-design-bar.svg';
  const createIcon = '/cdap_assets/img/create.svg';

  return (
    <>
      <div className={classes.root}>
        <div className={classes.title}>{title}</div>
        <img className={classes.titleDesign} src={titleDesignIcon} alt="Ingestion" />
        {create && (
          <div className={classes.create} onClick={onCreate}>
            <img className={classes.createIcon} src={createIcon} alt="create-ingestion" />
            <span>Create</span>
          </div>
        )}
      </div>
    </>
  );
};

const IngestionHeader = withStyles(styles)(IngestionHeaderView);
export default IngestionHeader;
