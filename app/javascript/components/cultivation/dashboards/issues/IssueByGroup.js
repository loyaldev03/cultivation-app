import React from 'react'
import { Line } from 'react-chartjs-2'
import DashboardIssueStore from './DashboardIssueStore'
import { observer } from 'mobx-react'

@observer
export default class IssueByGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const options = {
      legend: {
        position: 'bottom'
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false
            },
            ticks: {
              display: false
            }
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
            <h1 className="f5 fw6 dark-grey">Group</h1>
          </div>
        </div>
        {DashboardIssueStore.issue_by_group_loaded ? (
          DashboardIssueStore.data_issue_by_group.length > 0 ? (
            <Line data={DashboardIssueStore.IssueByGroup} options={options} />
          ) : (
            'Graph is not available'
          )
        ) : (
          'loading...'
        )}
      </React.Fragment>
    )
  }
}
