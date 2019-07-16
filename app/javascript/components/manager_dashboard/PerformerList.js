import React from 'react'
import { TempHomePerformer, ProgressBar } from '../utils'
import Tippy from '@tippy.js/react'
import ChartStore from './ChartStore'
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
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      order: 'top',
      type: 'yield'
    }
  }


  onChangeOrder = (order) => {
    ChartStore.loadPerformerList(order, this.state.type)
    this.setState({
      order: order
    })
  }

  onChangeType = (order_type) => {
    ChartStore.loadPerformerList(this.state.order, order_type)
    this.setState({
      type: order_type
    })
  }


  getProgressBarColor (dry_weight) {
    if (dry_weight < 100){
      return 'bg-red'
    }
    if (dry_weight > 100 && dry_weight < 200) {
      return 'bg-yellow'
    }
    if (dry_weight > 200 ) {
      return 'bg-green'
    }
  }

  render() {
    return (
      <React.Fragment>
        {/* <img src={TempHomePerformer} height={350} /> */}
        <div className="flex justify-between mb2">
          <h1 className="f5 fw6">Performers</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      text={'Top'}
                      className=""
                      onClick={() => this.onChangeOrder('top')}
                    />
                    <MenuButton
                      text={'Worse'}
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
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    <MenuButton
                      text={'By Yield'}
                      className=""
                      onClick={() => this.onChangeType('yield')}
                    />
                    <MenuButton
                      text={'By Revenue'}
                      className=""
                      onClick={() => this.onChangeType('revenue')}
                    />
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim ml2">
                <h1 className="f6 fw6 ml2 grey ttc">by {this.state.type}</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>
        </div>
          {ChartStore.performer_list_loaded ?
            (
              <div className="overflow-y-scroll" style={{ height: 340 + 'px' }}>
                {ChartStore.performer_list.map(e => (
                  <div className='flex items-center'>
                    <h1 className="f6 fw6 w-20">{e.batch_name}</h1>
                    <ProgressBar percent={e.percentage} height={10} className='w-60 mr2' barColor={this.getProgressBarColor(e.total_dry_weight)} />
                    <h1 className="f6 fw6 w-20">
                      {this.state.type === 'yield' ? (
                          <span>{e.total_dry_weight}lb</span>
                          )
                        :
                          (
                            <span>${e.revenue}</span>
                          )
                      }
                    </h1>
                  </div>
                ))}
              </div>
            )
          :
            (
              <div>Loading ... </div>
            )
          }
      </React.Fragment>
    )
  }
}
