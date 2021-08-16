import { isNumeric } from 'services/helpers';
import { wholeArrayIsNumeric } from 'services/helpers';
import moment from 'moment';
const setSelectedItem = (sheduleString) => {
  const cron = sheduleString.split(' ');
  if (
    cron[0] === '*/5' &&
    cron[1] === '*' &&
    cron[2] === '*' &&
    cron[3] === '*' &&
    cron[4] === '*'
  ) {
    return { item: 'Every 5 min' };
  }
  if (
    cron[0] === '*/10' &&
    cron[1] === '*' &&
    cron[2] === '*' &&
    cron[3] === '*' &&
    cron[4] === '*'
  ) {
    return { item: 'Every 10 min' };
  }
  if (
    cron[0] === '*/30' &&
    cron[1] === '*' &&
    cron[2] === '*' &&
    cron[3] === '*' &&
    cron[4] === '*'
  ) {
    return { item: 'Every 30 min' };
  }
  if (
    isNumeric(cron[0]) &&
    cron[1].indexOf('/') !== -1 &&
    cron[2] === '*' &&
    cron[3] === '*' &&
    cron[4] === '*'
  ) {
    return {
      item: 'Hourly',
      initialSheduleObj: {
        hours: parseInt(cron[1].split('/')[1], 10),
        minutes: parseInt(cron[0], 10),
      },
    };
  }

  if (
    wholeArrayIsNumeric(cron.slice(0, 2)) &&
    cron[2].indexOf('/') !== -1 &&
    cron[3] === '*' &&
    cron[4] === '*'
  ) {
    const converted12HourFormat = moment().hour(parseInt(cron[1], 10));
    return {
      item: 'Daily',
      initialSheduleObj: {
        days: parseInt(cron[2].split('/')[1], 10),
      },
      seletedTime: moment(
        `${parseInt(converted12HourFormat.format('h'), 10)}:${parseInt(
          cron[0],
          10
        )} ${converted12HourFormat.format('A')}`,
        'hh:mm A'
      ).format('YYYY-MM-DDTHH:mm'),
    };
  }

  if (
    wholeArrayIsNumeric(cron.slice(0, 2)) &&
    cron[2] === '*' &&
    cron[3] === '*' &&
    (cron[4].indexOf(',') !== -1 || isNumeric(cron[4]))
  ) {
    const converted12HourFormat = moment().hour(parseInt(cron[1], 10));
    console.log(
      'weekly',
      cron[4].split(',').map((val) => parseInt(val), 10)
    );

    const weekDays = {
      Sun: false,
      Mon: false,
      Tue: false,
      Wed: false,
      Thu: false,
      Fri: false,
      Sat: false,
    };
    const weekIndexes = cron[4].split(',').map((val) => parseInt(val), 10);
    Object.keys(weekDays).forEach((ele, index) => {
      if (weekIndexes.includes(index + 1)) {
        weekDays[ele] = true;
      }
    });

    return {
      item: 'Weekly',
      initialSheduleObj: { weekDays },
      seletedTime: moment(
        `${parseInt(converted12HourFormat.format('h'), 10)}:${parseInt(
          cron[0],
          10
        )} ${converted12HourFormat.format('A')}`,
        'hh:mm A'
      ).format('YYYY-MM-DDTHH:mm'),
    };
  }
  if (wholeArrayIsNumeric(cron.slice(0, 3)) && cron[3] === '*' && cron[4] === '*') {
    const converted12HourFormat = moment().hour(parseInt(cron[1], 10));
    return {
      item: 'Monthly',
      initialSheduleObj: {
        days: parseInt(cron[2], 10),
      },
      seletedTime: moment(
        `${parseInt(converted12HourFormat.format('h'), 10)}:${parseInt(
          cron[0],
          10
        )} ${converted12HourFormat.format('A')}`,
        'hh:mm A'
      ).format('YYYY-MM-DDTHH:mm'),
    };
  }
};

export default setSelectedItem;
