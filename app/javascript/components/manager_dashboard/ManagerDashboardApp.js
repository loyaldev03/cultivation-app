import React from 'react'
import { observer } from 'mobx-react'
import { subMonths, startOfMonth, endOfMonth } from 'date-fns'

import OverallInfo from './OverallInfo'
import ChartStore from './ChartStore'
import UnassignedTask from './UnassignedTask'
import StaffCapacity from './StaffCapacity'
import ScheduleList from './ScheduleList'
import CostBreakdown from './CostBreakdown'

import IssueList from './IssueList'
import PerformerList from './PerformerList'
import TestResultList from './TestResultList'
import BatchDistribution from './BatchDistribution'
import HighestCostTaskList from './HighestCostTaskList'
import StrainDistribution from './StrainDistribution'

import { formatYDM } from '../utils'

@observer
class ManagerDashboardApp extends React.Component {
  constructor(props) {
    super(props)

    let current_month = new Date().toLocaleString('en-us', { month: 'long' })
    let current_year = new Date().getFullYear()
    let arr_months = [
      { month: current_month, year: current_year, label: 'This Month' }
    ]
    let arr_batch_months = [
      { date: new Date(), label: 'This Year' },
      { date: new Date(), label: 'This Month' },
      { date: new Date(), label: 'This Week' },
      { date: new Date(), label: 'All' }
    ]
    for (let i = 0; i < 2; i++) {
      let month_subtracted = subMonths(new Date(), i + 1)
      let month = month_subtracted.toLocaleString('en-us', { month: 'long' })
      let year = month_subtracted.getFullYear()
      arr_months.push({
        month: month,
        year: year,
        label: `${month} ${year}`
      })
    }

    this.state = {
      date: new Date(),
      batches: props.batches,
      selectedBatch: this.props.batches[0],
      arr_months: arr_months,
      arr_batch_months: arr_batch_months
    }

    let start_of_month = startOfMonth(new Date())
    let end_of_month = endOfMonth(new Date())
    if (props.batches[0]) {
      ChartStore.loadWorkerCapacity(props.batches[0].id)
    }
    ChartStore.loadCostBreakdown(current_month, current_year)
    //ChartStore.loadBatchDistribution('This Year', this.props.facilityId)
    ChartStore.unassignedTask(this.props.facilityId)
    ChartStore.highestCostTask('all', this.props.facilityId)
    ChartStore.cultivationInfo(this.props.facilityId, 'all')
    ChartStore.issueList(this.props.facilityId)
    ChartStore.loadScheduleList(formatYDM(new Date()))
    ChartStore.loadScheduleDateRange(
      formatYDM(start_of_month),
      formatYDM(end_of_month)
    )
    ChartStore.loadPerformerList()
    ChartStore.loadBatchTestResult()
  }

  onChangeWorkerCapacityBatch = batch => {
    this.setState({ selectedBatch: batch })
    ChartStore.loadWorkerCapacity(batch.id)
  }

  render() {
    const { cost_permission } = this.props
    return (
      <React.Fragment>
        <OverallInfo
          batches={this.state.batches}
          arr_months={this.state.arr_months}
          facility_id={this.props.facilityId}
          cost_permission={cost_permission}
        />
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <UnassignedTask />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2"
              style={{ height: 420 + 'px' }}
            >
              <StaffCapacity batches={this.props.batches} />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div
            className={
              cost_permission && cost_permission == true ? 'w-60' : 'w-100'
            }
          >
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <ScheduleList />
            </div>
          </div>
          {cost_permission && cost_permission == true ? (
            <div className="w-40">
              <div
                className="ba b--light-gray pa3 bg-white br2"
                style={{ height: 420 + 'px' }}
              >
                <CostBreakdown
                  batches={this.props.batches}
                  arr_months={this.state.arr_months}
                />
              </div>
            </div>
          ) : (
            ''
          )}
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <IssueList />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <PerformerList />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <TestResultList />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <BatchDistribution
                arr_months={this.state.arr_batch_months}
                facility_id={this.props.facilityId}
              />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              style={{ height: 420 + 'px' }}
            >
              <HighestCostTaskList
                cost_permission={cost_permission}
                facility_id={this.props.facilityId}
              />
            </div>
          </div>
          <div className="w-50">
            <div
              className="ba b--light-gray pa3 bg-white br2 mr3"
              id="strain_chart"
              style={{ height: 420 + 'px' }}
            >
              <h1 className="f5 fw6 dark-grey">Strain Distribution</h1>
              <StrainDistribution
                url={`/api/v1/dashboard_charts/strain_distribution?facility_id=${
                  this.props.facilityId
                }`}
              />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ManagerDashboardApp
