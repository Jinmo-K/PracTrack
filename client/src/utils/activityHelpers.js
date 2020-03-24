import palette from 'google-palette';
import moment from 'moment';

/**
 * Return a sorted copy of activities by descending duration
 * @param  {Array} activities The activities to be sorted
 * @return {Array}            The sorted activites
 */
export const sortByDuration = (activities) => {
  return Array.from(activities).sort((a, b) => { return b.totalDuration - a.totalDuration });
};

/**
 * Return colour palette based on number of colours required using PaletteJS
 * @param  {Number} n The number of colours 
 * @return {Array}    The array of colours
 */
export const getColours = (n) => {
  var pal = '';
  if (n <= 1) {
    pal = 'cb-Accent';
  }
  else if (n > 1 && n <= 7) {
    pal = 'cb-GnBu'
  }
  else if (n > 7 && n <= 10) {
    pal = 'cb-Spectral'
  }
  else {
    pal = 'tol-rainbow';
  }
  return palette(pal, n).map(color => { return '#' + color }).reverse();
}

/**
 * Given logs, returns dict of durations for every date starting from earliest to latest log
 * eg. {'2020-03-17': 201203850, '2020-03-18': 0, ...}
 * @param  {Array} logs An activity's logs
 * @return {Object}     Dictionary with total durations for each date
 */
export const getTotalsPerDay = (logs) => {
  var min = moment(logs[0].start).format(moment.HTML5_FMT.DATE)
  var max = moment().format(moment.HTML5_FMT.DATE)
  // Generate the dates
  var totals = {};
  while (min <= max) {
    totals[min] = 0;
    min = moment(min).add(1, 'day').format('YYYY-MM-DD');
  }
  // Separate logs based on whether they have the same start and end date
  const sameDayLogs = logs.filter(log => {
    return moment(log.start).isSame(log.end, 'day');
  });
  const diffDayLogs = logs.filter(log => { return !sameDayLogs.includes(log) });

  // Sum the durations of logs with same start/end date
  for (let log of sameDayLogs) {
    const date = moment(log.start).format('YYYY-MM-DD');
    totals[date] += log.duration;
  }
  // Sum the durations of logs with different start/end date
  for (let log of diffDayLogs) {
    let curr = moment(log.start);
    const end = moment(log.end);

    while (!curr.isSame(end, 'day')) {
      let nextDay = moment(curr).add(1, 'day').startOf('day');
      totals[curr.format('YYYY-MM-DD')] += nextDay.diff(curr);
      curr = nextDay;
    }
    // Get the duration of the end date
    totals[curr.format('YYYY-MM-DD')] += end.diff(curr)
  }

  return totals;
}