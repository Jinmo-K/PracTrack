/**
 * Takes time in ms and returns as string in hours and minutes
 * @param  {number} ms The time in ms
 * @return {string}    The time formatted as '_ hrs _ min _ sec '
 */
export function msToHrsMinSec(ms) {
  const timeInHrs = ms / 3600000;
  const hrsRemaining = Math.floor(timeInHrs);
  const minRemaining = Math.floor((timeInHrs - hrsRemaining) * 60);
  const secRemaining = Math.round((((timeInHrs - hrsRemaining) * 60) - minRemaining) * 60);
  if (secRemaining === 60) {
    secRemaining = 0;
    minRemaining++;
  }
  return ((hrsRemaining) ? (`${hrsRemaining} hr `) : ('')) 
       + ((minRemaining) ? (`${minRemaining} min `) : ('')) 
       + ((secRemaining) ? (`${secRemaining} sec `) : (''));
};

/**
 * Takes time in ms and returns as string stopwatch format hh:mm:ss
 * @param  {number} ms The time in ms
 * @return {string}    The time formatted as '_ hrs _ min _ sec '
 */
export function msToStopwatch(ms) {
  const timeInHrs = ms / 3600000;
  const hrsRemaining = Math.floor(timeInHrs);
  const minRemaining = Math.floor((timeInHrs - hrsRemaining) * 60);
  const secRemaining = Math.round((((timeInHrs - hrsRemaining) * 60) - minRemaining) * 60);

  return ((hrsRemaining < 10) ? '0' : '') + hrsRemaining + ':'
       + ((minRemaining < 10) ? '0' : '') + minRemaining + ':'
       + ((secRemaining < 10) ? '0' : '') + secRemaining;

};

export function hrToMillisec(goal) {
  return goal * 3600000;
}