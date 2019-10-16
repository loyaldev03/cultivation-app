import React from 'react'
import { Bar } from 'react-chartjs-2'
import DashboardIssueStore from './DashboardIssueStore'
import { observer } from 'mobx-react'
import { NoData, Loading } from '../../../utils'
import isEmpty from 'lodash.isempty'

@observer
export default class IssueByPriority extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const options = {
      responsive: true,
      maintainAspectRatio: false,
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
            barPercentage: 0.2
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
          !isEmpty(DashboardIssueStore.data_issue_by_priority) ? (
            <div style={{ overflow: 'auto', height: '320px' }}>
              <Bar
                data={DashboardIssueStore.IssueByPriority}
                options={options}
              />
            </div>
          ) : (
            <NoData />
          )
        ) : (
          <Loading />
        )}
      </React.Fragment>
    )
  }
}
