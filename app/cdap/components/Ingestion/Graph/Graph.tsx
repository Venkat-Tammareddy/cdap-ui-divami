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
import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  LineSeries,
  FlexibleWidthXYPlot,
  Hint,
  VerticalBarSeries,
  LabelSeries,
  ChartLabel,
  HorizontalGridLines,
} from 'react-vis';
import '../../../../../node_modules/react-vis/dist/style.css';
import { CardContent, Typography } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import If from 'components/If';
const styles = (): StyleRules => {
  return {
    root: {
      overflowX: 'auto',
      scrollBarWidth: 'thin',
      height: '500px',
      width: '1280px',
    },
    croot: {
      padding: '24px',
    },
    title: {
      fontSize: '18px',
      fontFamily: 'Lato',
      paddingLeft: '0',
      color: '#202124',
      whitespace: 'nowrap',
      // overflow: 'hidden',
      marginBottom: '0px',
    },
    up: {
      display: 'flex',
      borderBottom: '2px solid grey',
      // marginTop: '-10px',
      gap: '85px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    successText: {
      fontFamily: 'Lato',
      backgroundColor: '#0F9D58',
      borderRadius: '16px',
      color: '#FFFFFF',
      padding: '2px 10px 5px 10px',
      fontSize: '14px',
      marginBottom: '9.5px',
    },
    info: {
      display: 'flex',
      flexDirection: 'column',
      marginTop: '15.5px',
      gap: '15px',
      color: '#202124',
      fontSize: '14px',
    },
    hnt: {
      width: '261px',
      height: '181px',
    },
    jobInfo: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124;',
    },
  };
};

interface GraphsProps extends WithStyles<typeof styles> {}
const GraphsView: React.FC<GraphsProps> = ({ classes }) => {
  const myData = [
    { x: 'job1', y: 45 },
    { x: 'job2', y: 77 },
    { x: 'job3', y: 15 },
    { x: 'job4', y: 20 },
    { x: 'job5', y: 25 },
    { x: 'job6', y: 30 },
    { x: 'job7', y: 80 },
    { x: 'job8', y: 42 },
    { x: 'job9', y: 99 },
    { x: 'job10', y: 90 },
  ];

  const myData2 = [
    { x: 'job1', y: 29 },
    { x: 'job2', y: 56 },
    { x: 'job3', y: 20 },
    { x: 'job4', y: 35 },
    { x: 'job5', y: 40 },
    { x: 'job6', y: 45 },
    { x: 'job7', y: 60 },
    { x: 'job8', y: 47 },
    { x: 'job9', y: 99 },
    { x: 'job10', y: 150 },
  ];
  const [value, setValue] = React.useState({});

  return (
    <div className={classes.root}>
      <FlexibleWidthXYPlot xType="ordinal" width={1280} height={300} margin={{ left: 100 }}>
        <HorizontalGridLines />
        <XAxis />
        <ChartLabel
          text="Records"
          className="alt-y-label"
          includeMargin={false}
          xPercent={-0.03}
          yPercent={0.5}
          style={{
            transform: 'rotate(-90)',
            textAnchor: 'end',
            marginLeft: '10px',
          }}
        />
        <YAxis />
        <VerticalBarSeries
          barWidth={0.2}
          data={myData}
          color="#74D091"
          onMouseover={() => alert('1')}
          style={{ cursor: 'pointer' }}
          onValueMouseOver={(d) => {
            setValue(d);
          }}
        />
        {value && (
          <Hint
            value={value}
            align={{ vertical: 'bottom', horizontal: 'right' }}
            className={classes.hnt}
          >
            <Card className={classes.croot} variant="outlined">
              <div className={classes.container}>
                <div className={classes.up}>
                  <p className={classes.title}>Job 04</p>
                  <div className={classes.successText}>Success</div>
                </div>
                <div className={classes.info}>
                  <p className={classes.jobInfo}>02 May 21, 07:30 pm</p>
                  <p className={classes.jobInfo}>3820 Records Loaded</p>
                  <p className={classes.jobInfo}>976 Error Records</p>
                </div>
              </div>
            </Card>
          </Hint>
        )}

        <VerticalBarSeries
          barWidth={0.1}
          data={myData2}
          color="transparent"
          style={{ cursor: 'pointer' }}
        />
        <VerticalBarSeries
          barWidth={0.2}
          data={myData2}
          color="#DB4437"
          style={{ cursor: 'pointer' }}
          onValueMouseOver={(d) => {
            setValue(d);
          }}
        />
      </FlexibleWidthXYPlot>
    </div>
  );
};

const Graphs = withStyles(styles)(GraphsView);
export default Graphs;
