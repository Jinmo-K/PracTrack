import React from 'react';
import moment from 'moment';
// Functions
import { msToHrsMinSec } from '../../../utils/timeFunctions';


/** 
 * ============================================
 *   An entry of a logs table
 * ============================================
 */
const LogItem = ({ start, end, duration, comments }) => (
  <tr className='app-text'>
    <td>{moment(start).format(moment.HTML5_FMT.DATE)}</td>
    <td>{moment(end).format(moment.HTML5_FMT.DATE)}</td>
    <td>{msToHrsMinSec(duration)}</td>
    <td>{comments}</td>
    <td><i className='material-icons'>edit</i></td>
  </tr>
);

export default LogItem;