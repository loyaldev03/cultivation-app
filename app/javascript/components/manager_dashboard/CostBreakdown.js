import React from 'react'
import Tippy from '@tippy.js/react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { Doughnut } from 'react-chartjs-2'


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
export default class CostBreakdown extends React.Component {
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
        {
          ChartStore.cost_breakdown_loaded ? (
            <Doughnut data={ChartStore.costBreakdown} />
          ) : (
              'loading...'
            )
        }
      </React.Fragment>
    )
  }
}