import React from 'react'
import { Line } from 'react-chartjs-2'
import DashboardIssueStore from './DashboardIssueStore'
import { observer } from 'mobx-react'
import isEmpty from 'lodash.isempty'
import { Loading, NoData } from '../../../utils'
@observer
export default class IssueByGroup extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const options = {
      maintainAspectRatio: false,
      responsive: true,
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
          !isEmpty(DashboardIssueStore.data_issue_by_group) ? (
            <div style={{ overflow: 'auto', height: '320px' }}>
              <Line data={DashboardIssueStore.IssueByGroup} options={options} />
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
