import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2 } from '../../utils'
import GanttChart from './GanttChart'
import loadTasks from './loadTask'
import TaskStore from './TaskStore'

@observer
class GanttSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      tasks: props.tasks
    }
  }

  async componentDidMount() {
    // await loadTasks.loadbatch(this.props.batch_id)
    await TaskStore.loadTasks(this.props.batch_id)
    console.log('after await')
    console.log(TaskStore.getTasks())
  }

  render() {
    let tasks = TaskStore.getTasks()
    console.log('setup render ', tasks)
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
                        <label>
                          {formatDate2(this.state.batch.start_date)}
                        </label>
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
                        <label>
                          {formatDate2(this.state.batch.start_date)}
                        </label>
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
            className={activeTabs}
          >
            Gantt Chart
          </a>
          <a
            href={'/cultivation/batches/' + this.state.batch.id + '/locations'}
            className={inactiveTabs}
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
              <GanttChart tasks={tasks} />
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

export default GanttSetup
