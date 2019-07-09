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
import { Doughnut } from 'react-chartjs-2'
import Tippy from '@tippy.js/react'

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
    this.state = {
      date: new Date(),
      batches: props.batches,
      selectedBatch: this.props.batches[0]
    }

    ChartStore.loadWorkerCapacity(props.batches[0].id)
    ChartStore.loadCostBreakdown('June', '2019')
  }

  onChangeWorkerCapacityBatch = batch => {
    this.setState({ selectedBatch: batch })
    ChartStore.loadWorkerCapacity(batch.id)
  }

  render() {
    return (
      <React.Fragment>
        <h1>Manager Dashboard App</h1>
        <OverallInfo batches={this.state.batches} />
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomeUnassignTask} />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2">
              <div className="flex justify-between mb4">
                <h1 className="f5 fw6">
                  Staff Capacity vs Production Schedule
                </h1>

                <Tippy
                  placement="bottom-end"
                  trigger="click"
                  duration="0"
                  content={
                    <div className="bg-white f6 flex">
                      <div className="db shadow-4">
                        {this.props.batches.map(e => (
                          <MenuButton
                            text={e.name}
                            className=""
                            onClick={() => this.onChangeWorkerCapacityBatch(e)}
                          />
                        ))}
                      </div>
                    </div>
                  }
                >
                  <div className="flex ba b--light-silver br2 pointer dim">
                    <h1 className="f6 fw6 ml2 grey">
                      {this.state.selectedBatch.name}
                    </h1>
                    <i className="material-icons grey mr2  md-21 mt2">
                      keyboard_arrow_down
                    </i>
                  </div>
                </Tippy>
              </div>
              {ChartStore.worker_capacity_loaded ? (
                <WorkerCapacityChart data={ChartStore.data_worker_capacity} />
              ) : (
                'loading...'
              )}
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-60">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomeSchedule} />
            </div>
          </div>
          <div className="w-40">
            <div className="ba b--light-gray pa3 bg-white br2">
              <div className="flex justify-between mb4">
                <h1 className="f5 fw6">Cost Breakdown</h1>

                <Tippy
                  placement="bottom-end"
                  trigger="click"
                  duration="0"
                  content={
                    <div className="bg-white f6 flex">
                      <div className="db shadow-4">
                        {this.props.batches.map(e => (
                          <MenuButton
                            text={e.name}
                            className=""
                            onClick={() => this.onChangeWorkerCapacityBatch(e)}
                          />
                        ))}
                      </div>
                    </div>
                  }
                >
                  <div className="flex ba b--light-silver br2 pointer dim">
                    <h1 className="f6 fw6 ml2 grey">This Month 3 months</h1>
                    <i className="material-icons grey mr2  md-21 mt2">
                      keyboard_arrow_down
                    </i>
                  </div>
                </Tippy>
              </div>
              {ChartStore.cost_breakdown_loaded ? (
                <Doughnut data={ChartStore.costBreakdown} />
              ) : (
                'loading...'
              )}
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomeIssue} height={350} />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomePerformer} height={350} />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempTestResult} height={350} />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempBatchDistribution} height={350} />
            </div>
          </div>
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomeTaskHighestCost} height={350} />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomeStrain} height={350} />
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ManagerDashboardApp
