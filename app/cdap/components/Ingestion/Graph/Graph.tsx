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
  MarkSeries,
  LineSeries,
  FlexibleWidthXYPlot,
  DiscreteColorLegend,
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
      padding: '20px',
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
  const durationArray = [];
  const colorCodes = [];

  items.runs.map((item, index) => {
    const obj = {
      x: '',
      y: '',
    };
    const timeObj = {
      id: '',
      time: '',
    };
    const durationObj = {
      x: '',
      y: 0,
      fill: '',
    };
    const colorObj = {
      x: '',
      y: '',
    };
    if (item.hasOwnProperty('runId')) {
      obj.x = item.runId;
      timeObj.id = item.runId;
      durationObj.x = item.runId;
      colorObj.x = item.runId;
      runIdArray.push(obj);
      runIdArray2.push(obj);
      if (item.hasOwnProperty('start')) {
        const humanDate = humanReadableDate(item.start, false);
        timeObj.time = humanDate;
        startTimes.push(timeObj);
        if (item.hasOwnProperty('end')) {
          const duration = item.end - item.start;
          durationObj.y = duration;
          durationArray.push(durationObj);
        }
      }

      // Get job Status
      if (item.hasOwnProperty('status')) {
        const curStatus = item.status;
        colorObj.y = curStatus;
        colorCodes.push(colorObj);
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

  const testData = [
    { x: 'job1', y: 1000, size: 20, fill: 'red' },
    { x: 'job2', y: 82, size: 40, fill: 'green' },
    { x: 'job3', y: 412, size: 31 },
    { x: 'job4', y: 62, size: 54 },
    { x: 'job5', y: 142, size: 10 },
    { x: 'job6', y: 92, size: 65 },
    { x: 'job7', y: 52, size: 53 },
    { x: 'job8', y: 102, size: 25 },
    { x: 'jobe', y: 100, size: 50 },
    { x: 'job4a', y: 62, size: 41 },
    { x: 'job7a', y: 52, size: 51 },
    { x: 'job8a', y: 102, size: 50 },
    { x: 'jobea', y: 100, size: 15 },
    { x: 'job5a', y: 142, size: 35 },
    { x: 'job82a', y: 102, size: 12 },
  ];

  const finalLineData = [];
  let finalData = [];
  durationArray.forEach((item) => {
    finalLineData.push(item);
  });

  const generateData = () => {
    // colorCodes; // x-> id, y -> status
    // finalLineData; // x->id, y-> duration, fill

    finalLineData.forEach((item) => {
      colorCodes.forEach((item2) => {
        if (item.x === item2.x) {
          if (item2.y === 'FAILED') {
            item.fill = 'red';
          } else if (item2.y === 'COMPLETED') {
            item.fill = 'green';
          } else {
            item.fill = 'red';
          }
        }
      });
    });

    return finalLineData;
  };

  finalData = generateData();

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
        {/* <VerticalBarSeries
          barWidth={0.1}
          data={durationArray}
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
        /> */}

        <LineSeries data={finalData} />
        <MarkSeries
          data={finalData}
          colorType="literal"
          strokeType="literal"
          size={5}
          fill="orange"
          fillType="literal"
          onValueMouseOver={(data, index) => {
            setValue(data);
            setCurrentHoveredElement(data);
            setShow(true);
          }}
        />
        {show && (
          <Hint value={value} className={classes.hnt}>
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
                  <p className={classes.jobInfo}>
                    {runIdArray.map(function(object, i) {
                      if (object.x === value.x) {
                        return <p className={classes.jobInfo}>{object.y} &nbsp; Records Loaded</p>;
                      }
                    })}
                  </p>
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

        {/* <VerticalBarSeries
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
        /> */}
      </FPlot>
    </div>
  );
};

const Graphs = withStyles(styles)(GraphsView);
export default Graphs;
