import React from 'react'
import { TempHomePerformer } from '../utils'
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

export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <img src={TempHomePerformer} height={350} />
        <div className="flex justify-between">
          <h1 className="f5 fw6">Performers</h1>
          <div className="flex">
            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4">
                    {/* {arr_months.map(e => (
                      <MenuButton
                        text={e.label}
                        className=""
                        onClick={() => this.onChangeWorkerCapacityBatch(e)}
                      />
                    ))} */}
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim">
                <h1 className="f6 fw6 ml2 grey">Top</h1>
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
                    {/* {arr_months.map(e => (
                      <MenuButton
                        text={e.label}
                        className=""
                        onClick={() => this.onChangeWorkerCapacityBatch(e)}
                      />
                    ))} */}
                  </div>
                </div>
              }
            >
              <div className="flex ba b--light-silver br2 pointer dim ml2">
                <h1 className="f6 fw6 ml2 grey">By Yield</h1>
                <i className="material-icons grey mr2  md-21 mt2">
                  keyboard_arrow_down
                </i>
              </div>
            </Tippy>
          </div>
        </div>
      </React.Fragment>
    )
  }
}
