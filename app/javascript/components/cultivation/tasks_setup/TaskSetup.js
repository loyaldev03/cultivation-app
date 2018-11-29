import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'

import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'

import loadTasks from './actions/loadTask'
import loadUsers from './actions/loadUsers'
import loadUserRoles from './actions/loadUserRoles'
import loadItems from './actions/loadItems'
import loadDisplayTaskStore from './actions/loadDisplayTaskStore'
import { formatDate2 } from '../../utils'

import TaskList from './components/TaskList'

import Select from 'react-select'
import reactSelectStyle from '../../utils/reactSelectStyle'
import { Manager, Reference, Popper, Arrow } from 'react-popper'

const styles = `
.columnDropdown{
  z-index: 300;
}
button.react-calendar__tile:disabled {
    background-color: #aaa;
}
`

class TaskSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch: props.batch,
      columns: [
        'name',
        'start_date',
        'end_date',
        'duration',
        'estimated_hour',
        'estimated_cost',
        'resource_assigned',
        'materials'
      ],
      columnOpen: false
    }
  }

  async componentDidMount() {
    await loadTasks.loadbatch(this.props.batch_id)
    loadDisplayTaskStore()
    loadUsers()
    loadUserRoles()
    loadItems(this.props.batch.facility_id)
    document.addEventListener('mousedown', this.handleOutsideClick, false)
  }

  onChangeFilterColumns = value => {
    this.setState({ columns: value })
  }

  handleClick = () => {
    this.setState({ columnOpen: !this.state.columnOpen })
  }

  handleChangeCheckbox = e => {
    let arrays = [...this.state.columns]
    if (e.target.checked) {
      arrays.push(e.target.value)
    } else {
      arrays = arrays.filter(k => k !== e.target.value)
    }
    this.setState({ columns: arrays })
  }

  checkboxValue = val => {
    return this.state.columns.includes(val)
  }

  handleOutsideClick = e => {
    if (this.node && !this.node.contains(e.target)) {
      this.hideDropdown()
    }
  }

  hideDropdown = () => {
    this.setState({ columnOpen: false })
  }

  render() {
    let handleChangeCheckbox = this.handleChangeCheckbox
    let checkboxValue = this.checkboxValue
    let activeTabs =
      'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    let inactiveTabs =
      'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    return (
      <React.Fragment>
        <style>{styles}</style>
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
                        <label>{this.state.batch.total_estimated_hour}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                </div>

                <div className="w-30 ml5">
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Estimated Harvest Date </label>
                    </div>
                    <div className="w-50">
                      <div className="">
                        <label>
                          {formatDate2(this.state.batch.estimated_harvest_date)}
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
        <div className="flex justify-between">
          <div className="flex mt4">
            <a
              href={'/cultivation/batches/' + this.state.batch.id}
              className={activeTabs}
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
              href={
                '/cultivation/batches/' + this.state.batch.id + '/locations'
              }
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
          <div className="flex mt4">
            <div className="mr2 mt2">
              <i className="material-icons" style={{ fontSize: '.875rem' }}>
                filter_list
              </i>
              <span className="grey f6 ml2">Filter</span>
            </div>
            <Manager>
              <Reference>
                {({ ref }) => (
                  <a
                    className="f6 link ba b--gray ph3 pv2 mb3 dib grey pointer bg-white"
                    ref={ref}
                    onClick={this.handleClick}
                  >
                    All Collumns
                    <i
                      className="material-icons ml2"
                      style={{ fontSize: '.875rem' }}
                    >
                      expand_more
                    </i>
                  </a>
                )}
              </Reference>
              {this.state.columnOpen && (
                <Popper placement="bottom" style={{ borderColor: 'red' }}>
                  {({ ref, style, placement, arrowProps }) => (
                    <div
                      ref={ref}
                      className="columnDropdown"
                      style={style}
                      data-placement={placement}
                    >
                      <div
                        id="myDropdown"
                        ref={node => (this.node = node)}
                        style={{ zIndex: '30000', marginRight: '-65px' }}
                        className="table-dropdown dropdown-content box--shadow-header show mt2"
                      >
                        <div className="ph4 mt3 mb3">
                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="name"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('name')}
                            />
                            Name
                          </label>

                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="start_date"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('start_date')}
                            />
                            Start Date
                          </label>

                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="end_date"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('end_date')}
                            />
                            End Date
                          </label>

                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="duration"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('duration')}
                            />
                            Duration
                          </label>

                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="estimated_hour"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('estimated_hour')}
                            />
                            Estimated Hour
                          </label>
                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="estimated_cost"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('estimated_cost')}
                            />
                            Estimated Cost
                          </label>
                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="resource_assigned"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('resource_assigned')}
                            />
                            Resource Assigned
                          </label>
                          <label className="f6 fw6 db mb1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="materials"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('materials')}
                            />
                            Materials
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </Popper>
              )}
            </Manager>
          </div>
        </div>

        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <TaskList
                batch_id={this.props.batch_id}
                batch={this.props.batch}
                columns={this.state.columns}
              />
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

export default TaskSetup
