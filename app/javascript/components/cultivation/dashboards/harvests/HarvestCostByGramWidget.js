import React from 'react'
import { ProgressBar } from '../../../utils'
import Tippy from '@tippy.js/react'
import HarvestStore from './HarvestStore'
import { observer } from 'mobx-react'

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
export default class HarvestCostByGramWidget extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'top'
    }
    HarvestStore.loadHarvestCost('top', this.props.facility_id)
  }

  onChangeOrder = order => {
    HarvestStore.loadHarvestCost(order, this.props.facility_id)
    this.setState({
      order: order
    })
  }

  getProgressBarColor(cost) {
    if (cost < 100) {
      return 'bg-red'
    }
    if (cost > 100 && cost < 200) {
      return 'bg-yellow'
    }
    if (cost > 200) {
      return 'bg-green'
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* <img src={TempHomePerformer} height={350} /> */}
        <div className="flex justify-between mb2">
          <h1 className="f5 fw6 dark-grey">Cost Per Gram</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      text="Top"
                      className=""
                      onClick={() => this.onChangeOrder('top')}
                    />
                    <MenuButton
                      text="Worse"
                      className=""
                      onClick={() => this.onChangeOrder('worse')}
                    />
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey ttc">{this.state.order}</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>
        </div>
        {HarvestStore.harvest_cost_list_loaded ? (
          <div className="overflow-y-scroll" style={{ height: 340 + 'px' }}>
            {HarvestStore.harvest_cost_list.map((e, i) => (
              <div className="flex items-center" key={i}>
                <h1 className="f6 fw6 w-20 dark-grey">{e.harvest_batch}</h1>
                <ProgressBar
                  percent={e.cost}
                  height={10}
                  className="w-60 mr2"
                  barColor={this.getProgressBarColor(e.cost)}
                />
                <h1 className="f6 fw6 w-20 dark-grey">
                  <span>$ {e.cost}</span>
                </h1>
              </div>
            ))}
          </div>
        ) : (
          <div>Loading ... </div>
        )}
      </React.Fragment>
    )
  }
}
