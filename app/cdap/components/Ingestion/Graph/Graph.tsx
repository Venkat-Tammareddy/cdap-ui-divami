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
  VerticalBarSeries,
  LabelSeries,
  ChartLabel,
  HorizontalGridLines,
} from 'react-vis';
import '/home/seth/Desktop/cdap-final/cdap-ui-divami/node_modules/react-vis/dist/style.css';

const styles = (): StyleRules => {
  return {
    root: {
      overflowX: 'auto',
      scrollBarWidth: 'thin',
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
    { x: 'job10', y: 92 },
  ];

  return (
    <div className={classes.root}>
      <XYPlot xType="ordinal" width={1920} height={300} style={{ paddingLeft: '30px' }}>
        <HorizontalGridLines />
        <XAxis />
        <ChartLabel
          text="Records"
          className="alt-y-label"
          includeMargin={false}
          xPercent={-0.02}
          yPercent={0}
          style={{
            transform: 'rotate(-90)',
            textAnchor: 'end',
            marginLeft: '10px',
          }}
        />
        <YAxis />
        <VerticalBarSeries barWidth={0.155} data={myData} color="#74D091" />
        <VerticalBarSeries barWidth={0.155} data={myData2} color="transparent" />
        <VerticalBarSeries barWidth={0.155} data={myData2} color="#DB4437" />
      </XYPlot>
    </div>
  );
};

const Graphs = withStyles(styles)(GraphsView);
export default Graphs;
