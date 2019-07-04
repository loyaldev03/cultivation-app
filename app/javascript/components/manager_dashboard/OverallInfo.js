import React from 'react'
import { TempHomeUnassignTask} from '../utils'
import WorkerCapacityChart from './WorkerCapacityChart'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'

let data = [
  {
    actual: 12,
    needed: 10,
    stage: 'Stage 1',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 1,
  },
  {
    actual: 25,
    needed: 22,
    stage: 'Stage 2',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 2,
  },
  {
    actual: 19,
    needed: 5,
    stage: 'Stage 3',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 3,
  },
  {
    actual: 21,
    needed: 21,
    stage: 'Stage 4',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 4,
  },
  {
    actual: 17,
    needed: 17,
    stage: 'Stage 5',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 5,
  },
  {
    actual: 22,
    needed: 20,
    stage: 'Stage 6',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 6,
  },
  {
    actual: 16,
    needed: 13,
    stage: 'Stage 7',
    actualColor: '#f86822',
    neededColor: '#4a65b3',
    index: 7,
  },
]

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
export default class OverallInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedBatch: this.props.batches[0],
    };
  }


  onChangeWorkerCapacityBatch = (batch) => {
    this.setState({selectedBatch: batch})
    ChartStore.loadWorkerCapacity(batch.id)
  }

  render() {
    return (
      <React.Fragment>
        <div className="ba b--light-gray pa3 bg-white br2">
          <div className="flex justify-between">
            <div>
              <h1 className="f5 fw6 ml4">Overall Info</h1>
            </div>
            <div className="flex ba b--light-silver br2 pointer dim">
              <h1 className="f6 fw6 ml2 grey">This Month</h1>
              <i className="material-icons grey mr2  md-21 mt2">
                keyboard_arrow_down
              </i>
            </div>
            
          </div>

          <div className="flex justify-between mt2">
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                check_circle
              </i>
              <div>
                <h1 className="f5 fw6 grey">Total plants</h1>
                <b className="f3 fw6">1,532</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                location_on
              </i>
              <div>
                <h1 className="f5 fw6 grey">Total yield</h1>
                <b className="f3 fw6">5,990lb</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                assignment
              </i>
              <div>
                <h1 className="f5 fw6 grey">Projected yield</h1>
                <b className="f3 fw6">1,000lb</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                assignment_turned_in
              </i>
              <div>
                <h1 className="f5 fw6 grey">Active batches cost to date</h1>
                <b className="f3 fw6">$10,042</b>
              </div>
            </div>
            <div className="flex" style={{ flex: ' 1 1 auto' }}>
              <i className="material-icons mt3  orange mr3 dim md-48 pointer mt2">
                home
              </i>
              <div>
                <h1 className="f5 fw6 grey">Facility capacity</h1>
                <b className="f3 fw6">74%</b>
              </div>
            </div>
          </div>  
        </div>
        <div className="flex mt4 h-50">
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2 mr3">
              <img src={TempHomeUnassignTask} />
            </div>
          </div>
          <div className="w-50">
            <div className="ba b--light-gray pa3 bg-white br2">
              <div className="flex justify-between mb4">
                <h1 className="f5 fw6">Staff Capacity vs Production Schedule</h1>

                <Tippy
                  placement="bottom-end"
                  trigger="click"
                  duration="0"
                  content={
                    <div className="bg-white f6 flex">
                      <div className="db shadow-4">
                        {this.props.batches.map(e =>
                          <MenuButton
                            // icon="delete_outline"
                            text={e.name}
                            className=""
                            onClick={() => this.onChangeWorkerCapacityBatch(e)}
                          />
                          
                        )}

                      </div>
                    </div>
                  }
                >
                  <div className="flex ba b--light-silver br2 pointer dim">
                    <h1 className="f6 fw6 ml2 grey">{this.state.selectedBatch.name}</h1>
                    <i className="material-icons grey mr2  md-21 mt2">
                      keyboard_arrow_down
                  </i>
                  </div>
                </Tippy>
              </div>
              {ChartStore.worker_capacity_loaded ?
                (
                  <WorkerCapacityChart data={ChartStore.data_worker_capacity} />
                )
                :
                'loading...'
              }
            </div>
          </div>

        </div>
      </React.Fragment>
    )
  }
}
