import React from 'react'
import { Bar } from 'react-chartjs-2'
import DashboardIssueStore from './DashboardIssueStore'
import { observer } from 'mobx-react'

@observer
export default class IssueByPriority extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const options = {
      legend: {
        display: false
      },
      tooltips: {
        mode: 'index',
        intersect: false,
        custom: function(tooltip) {
          if (!tooltip) return
          // disable displaying the color box;
          tooltip.displayColors = false
        },
        callbacks: {
          label: function(t) {
            if (t.datasetIndex === 0) {
              return 'Count: ' + t.yLabel.toString()
            } else if (t.datasetIndex === 1) {
              return 'Count: ' + t.yLabel.toString()
            }
          }
        }
      },
      showLines: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            barPercentage: 0.3
          }
        ],
        yAxes: [
          {
            gridLines: {
              display: false
            }
          }
        ]
      }
    }
    return (
      <React.Fragment>
        <div className="flex justify-between mb3">
          <div>
            <h1 className="f5 fw6 dark-grey">Priority</h1>
          </div>
        </div>
        {DashboardIssueStore.issue_by_priority_loaded ? (
          <Bar data={DashboardIssueStore.IssueByPriority} options={options} />
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
