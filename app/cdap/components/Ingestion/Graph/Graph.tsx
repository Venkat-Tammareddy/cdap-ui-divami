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
import { humanReadableDate } from 'services/helpers';
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
      fontSize: '16px',
      fontFamily: 'Lato',
      paddingLeft: '0',
      color: '#202124',
      marginBottom: '0px',
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
  // const myData = [
  //   { x: 'job1', y: 45 },
  //   { x: 'job2', y: 77 },
  //   { x: 'job3', y: 15 },
  //   { x: 'job4', y: 20 },
  //   { x: 'job5', y: 25 },
  //   { x: 'job6', y: 30 },
  //   { x: 'job7', y: 80 },
  //   { x: 'job8', y: 42 },
  //   { x: 'job9', y: 99 },
  //   { x: 'job10', y: 90 },
  // ];
  const myData = [];

  const myData2 = [
    { x: '531eb9f3-0730-11ec-ae15-a29c59b15d41', y: 29 },
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
  const [value, setValue] = React.useState({ x: '', y: '', time: '', test: '' });
  let runIdArray = [];
  const [currentHoveredElement, setCurrentHoveredElement] = React.useState(null);
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
      console.log('PLZ WORK' + item.runId);
      if (item.hasOwnProperty('start')) {
        const humanDate = humanReadableDate(item.start, false);
        timeObj.time = humanDate;
        startTimes.push(timeObj);
      }
    }
  });

  console.log('START TIMESSS' + JSON.stringify(startTimes[0]));

  // Records in
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

  runIdArray2 = runIdArray2.map((item, index) => {
    return { x: item.x, y: out[index] };
  });

  const arr3 = [{ x: '531eb9f3-0730-11ec-ae15-a29c59b15d41', y: 40 }];
  const renderTime = (id) => {
    // startTimes.forEach((item, index) => {
    //   if (item.id === id) {
    //     return (
    //       <div>
    //         <p>TIMEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE</p>
    //       </div>
    //     );
    //   }
    // });
    return <p>WE HATTTTT</p>;
  };

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
          }}
        />
        <YAxis />
        <VerticalBarSeries
          barWidth={0.2}
          data={runIdArray}
          color="#74D091"
          onMouseover={() => alert('1')}
          style={{ cursor: 'pointer' }}
          onValueMouseOver={(data, index) => {
            data.test = 'apple';
            setValue(data);
            setCurrentHoveredElement(data);
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
                  <p className={classes.title}>{value.x}</p>
                  <div className={classes.successText}>Success</div>
                </div>
                <div className={classes.info}>
                  <p className={classes.jobInfo}>
                    {startTimes.map(function(object, i) {
                      if (object.id === value.x) {
                        return <p>{object.time}</p>;
                      }
                    })}
                  </p>
                  <p className={classes.jobInfo}>{value.y} Records Loaded</p>
                  <p className={classes.jobInfo}>
                    {runIdArray2.map(function(object, i) {
                      if (object.x === value.x) {
                        return <p>{object.y}Errors Loaded</p>;
                      }
                    })}
                  </p>
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
          barWidth={0.2}
          data={runIdArray2}
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
