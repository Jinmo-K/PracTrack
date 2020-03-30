import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
// Components
import Chart from 'chart.js';
// Functions
import { sortByDuration, getColours } from '../../../utils/activityHelpers';
import { msToHrsMinSec } from '../../../utils/timeFunctions';


/** 
 * ============================================
 *   Pie chart of user's activities with top 3
 * ============================================
 */
const PieChart = ({ activities, location }) => {
  const [sorted, setSorted] = useState(sortByDuration(activities));
  const currTotal = activities.reduce((acc, x) => { return acc + x.totalDuration }, 0);
  const [total, setTotal] = useState(currTotal);
  const [chart, setChart] = useState(undefined);
  const colors = getColours(activities.length);

  // Only re-render the chart if an activity duration or number of activities has changed
  if (currTotal !== total || sorted.length !== activities.length) {
    // Update the total duration, and re-sort the activities
    setTotal(currTotal);
    setSorted(sortByDuration(activities));
  }

  // Function to display user's top 3 activities
  const displayTop = () => {
    return (sorted.slice(0, 3).map((activity, i) => {
      return <li className='list-group-item' key={activity._id}>
        <Link className='text-reset top-3' to={'/activities/' + activity._id}>
          <div className='m-0 d-inline-block' style={{ 'backgroundColor': colors[i], 'width': '20px', 'height': '10px' }}></div>
          <span className='ml-2'>
            <strong>{activity.title} {((activity.totalDuration / total) * 100).toFixed(1)} %</strong>
          </span>
        </Link>
      </li>
    }));
  };

  useEffect(() => {
    // Destroy previous chart to prevent drawing over it
    if (chart !== undefined) {
      chart.destroy()
    }
    var canvas = document.getElementById("pieChart");
    if (canvas) {
      setChart(new Chart(document.getElementById("pieChart"), {
        type: 'doughnut',
        data: {
          labels: sorted.map(activity => { return activity.title }),
          datasets: [{
            data: sorted.map(activity => {
              return ((activity.totalDuration / total) * 100).toFixed(2);
            }),
            backgroundColor: colors
          }],
          fillOpacity: 0.3
        },
        options: {
          responsive: true,
          legend: {
            display: false
          },
          aspectRatio: 1,
          maintainAspectRatio: true,
          tooltips: {
            callbacks: {
              title: function (tooltipItem, data) {
                return data['labels'][tooltipItem[0]['index']];
              },
              label: function (tooltipItem, data) {
                return ' ' + msToHrsMinSec(sorted[tooltipItem['index']]['totalDuration']);
              }
            }
          }
        },

      }));
    }
  }, [total, sorted]);

  return (
    <div>
      {(currTotal > 0)
        ? <div className='row justify-content-center align-items-center mt-4'
               style={{ 'display': location.pathname === '/' ? 'flex' : 'none' }}>
            <div className='col-5 col-sm-5 col-md-4 col-lg-3 col-xl-3-pie p-4 mx-0'>
              <canvas id="pieChart"></canvas>
            </div>
            <div className='col-sm-7 col-md-5 col-lg-4 p-4 ml-3 ml-sm-0'>
              <h3>Your top activities:</h3>
              <ul className='list-group list-group-flush'>
                {displayTop()}
              </ul>
            </div>
          </div>
        : null
      }
    </div>
  );
};

PieChart.propTypes = {
  activities: PropTypes.array.isRequired,
  location: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => ({
  activities: state.activities
});

export default withRouter(connect(
  mapStateToProps
)(PieChart));