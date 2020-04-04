import React, { useEffect, useState } from 'react';
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
const ActivityChart = ({ logs:nextLogs }) => {
  const [logs, setLogs] = useState(nextLogs);
  const [, setChart] = useState(undefined);

  // Check if logs have changed => re-render chart
  useEffect(() => {
    if (
        (nextLogs.length !== logs.length) || 
        (nextLogs.length && logs.length && (nextLogs[nextLogs.length-1].duration !== logs[logs.length-1].duration))
      ) {
      setLogs(nextLogs);
    }
  }, [nextLogs, logs])

  useEffect(() => {
    if (logs.length) {
      const totals = getTotalsPerDay(logs);
      const data = Object.values(totals).map(dur => {
        return (dur / 3600000).toFixed(2);
      })
      setChart(chart => {
        // Destroy previous chart to prevent drawing over it
        if (chart !== undefined) {
          chart.destroy()
        }
        return new Chart(document.getElementById("graph"), {
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
        })
      });
    }
  }, [logs]);

  return <canvas id="graph" width="400" height="200"></canvas>;
};

ActivityChart.propTypes = {
  logs: PropTypes.array.isRequired,
}


export default ActivityChart;
