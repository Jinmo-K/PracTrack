import React, { useEffect } from 'react';
import Chart from 'chart.js';
import PropTypes from 'prop-types';
// Functions
import { msToHrsMinSec } from '../../../utils/timeFunctions';
import { getTotalsPerDay } from '../../../utils/activityHelpers';


/** 
 * ============================================
 *  Chart displaying activity's logs over time
 * ============================================
 */
const ActivityChart = ({ logs }) => {
  useEffect(() => {
    const totals = getTotalsPerDay(logs);
    const data = Object.values(totals).map(dur => {
      return (dur / 3600000).toFixed(2);
    })
    new Chart(document.getElementById("graph"), {
      type: 'line',
      data: {
        labels: Object.keys(totals),
        datasets: [{
          data: data,
          label: "Duration",
          borderColor: "#3e95cd",
          fill: true,
          backgroundColor: '#3e96cd3d'
        }],
      },
      options: {
        title: {
          display: true,
          text: 'Total durations per day'
        },
        legend: { display: false },
        // Custom axes
        scales: {
          xAxes: [{
            type: "time",
            time: {
              unit: 'day'
            },
            ticks: {
              min: Object.keys(totals)[0]
            }
          }],
          yAxes: [{
            ticks: {
              beginAtZero: true,   
              stepSize: 0.5,
              callback: function (label, index, labels) {
                return msToHrsMinSec(label * 3600000);
              }
            }
          }]
        },
        // Custom tooltip 
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data['labels'][tooltipItem[0]['index']];
            },
            label: function (tooltipItem, data) {
              return msToHrsMinSec(Object.values(totals)[tooltipItem['index']]);
            }
          }
        }

      }
    });
  }, [logs]);

  return <canvas id="graph" width="400" height="200"></canvas>;
};

ActivityChart.propTypes = {
  logs: PropTypes.array.isRequired,
}

export default ActivityChart;
