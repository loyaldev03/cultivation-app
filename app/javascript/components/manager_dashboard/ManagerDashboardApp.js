import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import OverallInfo from './OverallInfo'
import ChartStore from './ChartStore'
import {
  TempHomeUnassignTask,
  TempHomeSchedule,
  TempHomeIssue,
  TempHomePerformer,
  TempTestResult,
  TempBatchDistribution,
  TempHomeTaskHighestCost,
  TempHomeStrain
} from '../utils'
import WorkerCapacityChart from './WorkerCapacityChart'
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
import { subMonths } from 'date-fns'

const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
}

@observer
class ManagerDashboardApp extends React.Component {
  constructor(props) {
    super(props)

    let current_month = new Date().toLocaleString('en-us', { month: 'long' })
    let current_year = new Date().getFullYear()
    let arr_months = [{ month: current_month, year: current_year, label: 'This Month' }]
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
      arr_months: arr_months
    }

    ChartStore.loadWorkerCapacity(props.batches[0].id)
    ChartStore.loadCostBreakdown(current_month, current_year)
  }

  onChangeWorkerCapacityBatch = batch => {
    this.setState({ selectedBatch: batch })
    ChartStore.loadWorkerCapacity(batch.id)
  }

  render() {
    return (
      <React.Fragment>
        <h1>Manager Dashboard App</h1>
        <OverallInfo batches={this.state.batches} arr_months={this.state.arr_months} />
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <UnassignedTask />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2">
              <StaffCapacity batches={this.props.batches} />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-60">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <ScheduleList />
            </div>
          </div>
          <div className="w-40">
            <div className="ba b--light-gray pa3 bg-white br2">
              <CostBreakdown batches={this.props.batches} arr_months={this.state.arr_months} />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <IssueList />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <PerformerList />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <TestResultList />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <BatchDistribution />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <HighestCostTaskList />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <StrainDistribution />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ManagerDashboardApp
