import React from 'react'
import { TempHomeUnassignTask } from '../utils'
import Tippy from '@tippy.js/react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import WorkerCapacityChart from './WorkerCapacityChart'

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
export default class StaffCapacity extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedBatch: this.props.batches[0]
    }
  }

  onChangeWorkerCapacityBatch = batch => {
    this.setState({ selectedBatch: batch })
    ChartStore.loadWorkerCapacity(batch.id)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between mb4">
          <h1 className="f5 fw6 dark-grey">
            Staff Capacity vs Production Schedule
          </h1>

          <Tippy
            placement="bottom-end"
            trigger="click"
            duration="0"
            content={
              <div className="bg-white f6 flex">
                <div className="db shadow-4">
                  {this.props.batches.map((e, i) => (
                    <MenuButton
                      key={i}
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
                {this.state.selectedBatch ? this.state.selectedBatch.name : ''}
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
          <div>
            {this.props.batches.length > 0 ? 'loading...' : 'No active batches'}
          </div>
        )}
      </React.Fragment>
    )
  }
}
