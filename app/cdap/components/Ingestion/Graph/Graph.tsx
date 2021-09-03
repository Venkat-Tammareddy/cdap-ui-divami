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
  makeVisFlexible,
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
import { humanReadableDate } from 'services/helpers';
const styles = (): StyleRules => {
  return {
    root: {
      overflowX: 'auto',
      scrollBarWidth: 'thin',
      height: '500px',
    },
    croot: {
      padding: '24px',
    },
    title: {
      fontSize: '16px',
      fontFamily: 'Lato',
      paddingLeft: '0',
      color: '#202124',
      marginBottom: '0px',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
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
      marginLeft: '0px',
    },
    jobInfo: {
      fontFamily: 'Lato',
      fontSize: '14px',
      color: '#202124;',
      marginBottom: '0',
    },
  };
};

interface GraphsProps extends WithStyles<typeof styles> {
  items: any;
  metrix: any;
}
const GraphsView: React.FC<GraphsProps> = ({ classes, items, metrix }) => {
  const [value, setValue] = React.useState({ x: '', y: '', time: '', test: '' });
  let runIdArray = [];
  const [currentHoveredElement, setCurrentHoveredElement] = React.useState(null);
  const [show, setShow] = React.useState(false);

  let runIdArray2 = [];
  const startTimes = [];
  const errorRecords = [];
  items.runs.map((item, index) => {
    const obj = { x: '', y: '' };
    const timeObj = { id: '', time: '' };
    if (item.hasOwnProperty('runId')) {
      obj.x = item.runId;
      timeObj.id = item.runId;
      runIdArray.push(obj);
      runIdArray2.push(obj);
      if (item.hasOwnProperty('start')) {
        const humanDate = humanReadableDate(item.start, false);
        timeObj.time = humanDate;
        startTimes.push(timeObj);
      }
    }
  });

  // Records in and Records out for Hint
  const inn = [];
  const out = [];
  const Ins = items.runs.map((item, index) => {
    const data1 = metrix[`qid_${item.runId}`]?.series?.find(
      (item) => item.metricName === `user.${items.connections.sourceName}.records.in`
    )?.data[0].value
      ? metrix[`qid_${item.runId}`]?.series?.find(
          (item) => item.metricName === `user.${items.connections.sourceName}.records.in`
        )?.data[0].value
      : '0';

    inn.push(data1);
    const data2 = metrix[`qid_${item.runId}`]?.series?.find(
      (item) => item.metricName === `user.${items.connections.sourceName}.records.error`
    )?.data[0].value
      ? metrix[`qid_${item.runId}`]?.series?.find(
          (item) => item.metricName === `user.${items.connections.sourceName}.records.error`
        )?.data[0].value
      : '0';
    out.push(data2);
  });

  runIdArray = runIdArray.map((item, index) => {
    return { x: item.x, y: inn[index] };
  });

  // Show only first 100 runs
  if (runIdArray.length > 100) {
    runIdArray.length = 100;
  }

  runIdArray2 = runIdArray2.map((item, index) => {
    return { x: item.x, y: out[index] };
  });

  // Show only first 100 runs
  if (runIdArray2.length > 100) {
    runIdArray2.length = 100;
  }

  // Use flexible width graph
  const FPlot = makeVisFlexible(XYPlot);

  // const testData = [
  //   { x: 'job1', y: 1000 },
  //   { x: 'job2', y: 82 },
  //   { x: 'job3', y: 412 },
  //   { x: 'job4', y: 62 },
  //   { x: 'job5', y: 142 },
  //   { x: 'job6', y: 92 },
  //   { x: 'job7', y: 52 },
  //   { x: 'job8', y: 102 },
  //   { x: 'jobe', y: 100 },
  //   { x: 'job4a', y: 62 },
  //   { x: 'job5a', y: 142 },
  //   { x: 'job6a', y: 92 },
  //   { x: 'job7a', y: 52 },
  //   { x: 'job8a', y: 102 },
  //   { x: 'jobea', y: 100 },
  //   { x: 'job4a', y: 62 },
  //   { x: 'job5a', y: 142 },
  //   { x: 'job6a', y: 92 },
  //   { x: 'job7a', y: 52 },
  //   { x: 'job8a', y: 102 },
  //   { x: 'jobea', y: 100 },
  // ];
  // const testData404 = [
  //   { x: 'job1', y: 1000 },
  //   { x: 'job2', y: 82 },
  //   { x: 'job3', y: 412 },
  //   { x: 'job4', y: 62 },
  //   { x: 'job5', y: 142 },
  //   { x: 'job6', y: 92 },
  //   { x: 'job7', y: 52 },
  //   { x: 'job8', y: 102 },
  //   { x: 'jobe', y: 100 },
  // ];

  return (
    <div className={classes.root}>
      <FPlot height={300} xType="ordinal" margin={{ left: 100 }}>
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
          }}
        />
        <YAxis />
        <VerticalBarSeries
          barWidth={0.3}
          data={runIdArray}
          color="#74D091"
          style={{ cursor: 'pointer' }}
          onValueMouseOver={(data, index) => {
            setValue(data);
            setCurrentHoveredElement(data);
            setShow(true);
          }}
          onValueMouseOut={(data, index) => {
            setShow(false);
          }}
        />
        {show && (
          <Hint
            value={value}
            align={{ vertical: 'bottom', horizontal: 'right' }}
            className={classes.hnt}
          >
            <Card className={classes.croot} variant="outlined">
              <div className={classes.container}>
                <div className={classes.up}>
                  <p className={classes.title}>{value.x}</p>
                  <div className={classes.successText}>Success</div>
                </div>
                <div className={classes.info}>
                  {startTimes.map(function(object, i) {
                    if (object.id === value.x) {
                      return <p className={classes.jobInfo}>{object.time}</p>;
                    }
                  })}
                  <p className={classes.jobInfo}>{value.y} &nbsp; Records Loaded</p>
                  {runIdArray2.map(function(object, i) {
                    if (object.x === value.x) {
                      return <p className={classes.jobInfo}>{object.y} &nbsp; Error Records</p>;
                    }
                  })}
                </div>
              </div>
            </Card>
          </Hint>
        )}

        <VerticalBarSeries
          barWidth={0.1}
          data={runIdArray}
          color="transparent"
          style={{ cursor: 'pointer' }}
        />
        <VerticalBarSeries
          barWidth={0.3}
          data={runIdArray2}
          color="#DB4437"
          style={{ cursor: 'pointer' }}
          onValueMouseOver={(d) => {
            setValue(d);
          }}
        />
      </FPlot>
    </div>
  );
};

const Graphs = withStyles(styles)(GraphsView);
export default Graphs;
