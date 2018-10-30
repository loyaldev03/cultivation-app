import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

class LocationsSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch
    }
  }

  render() {
    let activeTabs =
      'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    let inactiveTabs =
      'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    return (
      <React.Fragment>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <div className=" flex">
                <div className="w-40">
                  <h4 className="tl pa0 ma0 h6--font dark-grey">
                    Batch {this.state.batch.batch_no}
                  </h4>
                </div>
              </div>
              <div className="mb3 flex">
                <div className="w-30">
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Batch Source</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.batch_source}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Batch Name</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.name}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Strain</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.strain}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Grow Method</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.grow_method}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Start Date </label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>{this.state.batch.start_date}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>{this.state.batch.total_estimated_cost}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Hours</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>???</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Estimated Harvest Dat </label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>{this.state.batch.start_date}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>???</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Hour</label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>???</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex mt4">
          <a
            href={'/cultivation/batches/' + this.state.batch.id}
            className={inactiveTabs}
          >
            Tasks List
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/gantt'}
            className={inactiveTabs}
          >
            Gantt Chart
          </a>
          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/locations'}
            className={activeTabs}
          >
            Location
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/issues'}
            className={inactiveTabs}
          >
            Issues
          </a>

          <a
            href={
              '/cultivation/batches/' + this.state.batch.id + '/secret_sauce'
            }
            className={inactiveTabs}
          >
            Secret Sauce
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/resource'}
            className={inactiveTabs}
          >
            Resource
          </a>

          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/material'}
            className={inactiveTabs}
          >
            Material
          </a>
        </div>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <h2>Location is here</h2>
            </div>
          </div>
        </div>

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
        <br />
      </React.Fragment>
    )
  }
}

export default LocationsSetup
