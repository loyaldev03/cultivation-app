import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

import loadTasks from './actions/loadTask'
import loadUsers from './actions/loadUsers'
import loadUserRoles from './actions/loadUserRoles'
import loadItems from './actions/loadItems'

import TaskList from './components/TaskList'
import GanttChartList from './components/GanttChartList'
import IssuesList from './components/IssuesList'
import ResourceList from './components/ResourceList'
import SecretSauce from './components/SecretSauce'

class TaskSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      tabs: 'task_list'
    }
  }

  componentDidMount() {
    loadTasks.loadbatch(this.props.batch_id)
    loadUsers()
    loadUserRoles()
    loadItems()
  }

  handleChangeTabs = value => {
    this.setState({ tabs: value })
  }

  renderBatchInfo() {
    if (this.state.tabs === 'task_list') {
      return (
        <TaskList batch_id={this.props.batch_id} batch={this.props.batch} />
      )
    }
    if (this.state.tabs === 'gantt_chart') {
      return (
        <GanttChartList
          batch_id={this.props.batch_id}
          batch={this.props.batch}
        />
      )
    }
    if (this.state.tabs === 'issues') {
      return (
        <IssuesList batch_id={this.props.batch_id} batch={this.props.batch} />
      )
    }
    if (this.state.tabs === 'secret_sauce') {
      return (
        <SecretSauce batch_id={this.props.batch_id} batch={this.props.batch} />
      )
    }
    if (this.state.tabs === 'resource') {
      return (
        <ResourceList batch_id={this.props.batch_id} batch={this.props.batch} />
      )
    }
  }

  renderTabsClass = value => {
    if (this.state.tabs === value) {
      return 'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    } else {
      return 'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    }
  }

  render() {
    let handleChangeTabs = this.handleChangeTabs
    let renderTabsClass = this.renderTabsClass
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
                      <label>Batch Id</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{this.state.batch.id}</label>
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
                        <label>???</label>
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
            className={renderTabsClass('task_list')}
            onClick={e => handleChangeTabs('task_list')}
          >
            Tasks List
          </a>

          <a
            className={renderTabsClass('gantt_chart')}
            onClick={e => handleChangeTabs('gantt_chart')}
          >
            Gantt Chart
          </a>

          <a
            className={renderTabsClass('issues')}
            onClick={e => handleChangeTabs('issues')}
          >
            Issues
          </a>

          <a
            className={renderTabsClass('secret_sauce')}
            onClick={e => handleChangeTabs('secret_sauce')}
          >
            Secret Sauce
          </a>

          <a
            className={renderTabsClass('resource')}
            onClick={e => handleChangeTabs('resource')}
          >
            Resource
          </a>
        </div>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              {this.renderBatchInfo()}
            </div>
          </div>
        </div>

        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>
        <br />
        <a
          href={'/cultivation/batches/' + this.props.batch_id + '?type=active'}
          data-method="put"
          className="flex-none bg-orange link white f6 fw6 pv2 ph3 br2 dim mt3"
        >
          Save & Continue
        </a>
      </React.Fragment>
    )
  }
}

export default TaskSetup
