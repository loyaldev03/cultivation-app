import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import classNames from 'classnames'
import loadUsers from './actions/loadUsers'
import loadUserRoles from './actions/loadUserRoles'
import loadItems from './actions/loadItems'
import { formatDate2, ActiveBadge } from '../../utils'
import TaskList from './components/TaskList'
import Select from 'react-select'
import reactSelectStyle from '../../utils/reactSelectStyle'
import { Manager, Reference, Popper } from 'react-popper'
import TaskStore from './stores/NewTaskStore'

@observer
class TaskSetup extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        'wbs',
        'name',
        'start_date',
        'end_date',
        'duration',
        'estimated_hours',
        'estimated_cost',
        'resource_assigned',
        'materials',
        'depend_on'
      ],
      columnOpen: false
    }

    if (!TaskStore.isDataLoaded) {
      TaskStore.loadTasks(props.batch_id)
      TaskStore.facilityPhases = props.batch.cultivation_phases
    }
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
    const { batch } = this.props
    const batchSource = batch.batch_source
      ? batch.batch_source.replace(/_/g, ' ')
      : ''
    const batchQuantity = batch.quantity ? batch.quantity : 0
    let handleChangeCheckbox = this.handleChangeCheckbox
    let checkboxValue = this.checkboxValue
    let activeTabs =
      'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
    let inactiveTabs =
      'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'
    return (
      <React.Fragment>
        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <div className="flex">
                <div className="w-30">
                  <h4 className="tl pa0 ma0 h6--font dark-grey">
                    Batch {batch.batch_no}
                    <ActiveBadge className="fr" isActive={batch.is_active} />
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
                      <div className="ttc">
                        <label>{batchSource}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  {batchQuantity > 0 ? (
                    <div className="flex">
                      <div className="w-40">
                        <label>Batch Name</label>
                      </div>
                      <div className="w-40">
                        <div className="">
                          <label>{batch.name}</label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex">
                      <div className="w-40">Missing Quantity</div>
                      <div className="w-40">
                        <a
                          href={`/cultivation/batches/${
                            batch.id
                          }?select_location=1`}
                          className="link red"
                        >
                          Set location &amp; quantity
                        </a>
                      </div>
                    </div>
                  )}
                  <hr />
                  <div className=" flex">
                    <div className="w-40">
                      <label>Strain</label>
                    </div>
                    <div className="w-40">
                      <div className="">
                        <label>{batch.strain}</label>
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
                        <label>{batch.grow_method}</label>
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
                      <div className="tr">
                        <label>{formatDate2(batch.start_date)}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Cost</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>{TaskStore.totalEstimatedCost}</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Estimation Hours</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>{TaskStore.totalEstimatedHours}</label>
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
                      <div className="tr">
                        <label>
                          {formatDate2(batch.estimated_harvest_date)}
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
                      <div className="tr">
                        <label>--</label>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className=" flex">
                    <div className="w-50">
                      <label>Total Actual Hour</label>
                    </div>
                    <div className="w-50">
                      <div className="tr">
                        <label>--</label>
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
            <a href={'/cultivation/batches/' + batch.id} className={activeTabs}>
              Tasks List
            </a>

            <a
              href={'/cultivation/batches/' + batch.id + '/gantt'}
              className={inactiveTabs}
            >
              Gantt Chart
            </a>
            <a
              href={'/cultivation/batches/' + batch.id + '/locations'}
              className={inactiveTabs}
            >
              Location
            </a>

            <a
              href={'/cultivation/batches/' + batch.id + '/issues'}
              className={inactiveTabs}
            >
              Issues
            </a>

            <a
              href={'/cultivation/batches/' + batch.id + '/secret_sauce'}
              className={inactiveTabs}
            >
              Secret Sauce
            </a>

            <a
              href={'/cultivation/batches/' + batch.id + '/resource'}
              className={inactiveTabs}
            >
              Resource
            </a>

            <a
              href={'/cultivation/batches/' + batch.id + '/material'}
              className={inactiveTabs}
            >
              Material
            </a>
          </div>
          <Manager>
            <div className="flex mt4">
              <div className="mr2 mt2">
                <i className="material-icons icon--small pointer">
                  filter_list
                </i>
                <span className="grey f6 ml2">Filter</span>
              </div>
              <Reference>
                {({ ref }) => (
                  <a
                    className="f6 link ba b--light-grey ph3 pv2 mb3 flex justify-center dib grey pointer"
                    ref={ref}
                    onClick={this.handleClick}
                  >
                    Show Columns
                    <i className="material-icons icon--small pointer ml2">
                      expand_more
                    </i>
                  </a>
                )}
              </Reference>
              {this.state.columnOpen && (
                <Popper placement="bottom-end">
                  {({ ref, style, placement, arrowProps }) => (
                    <div
                      ref={ref}
                      className="z-1"
                      style={style}
                      data-placement={placement}
                    >
                      <div
                        id="myDropdown"
                        ref={node => (this.node = node)}
                        className="pa2 bg-white ba b--light-grey br1"
                      >
                        <div className="">
                          <label className="dim f6 fw6 db pv1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="wbs"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('wbs')}
                            />
                            WBS
                          </label>

                          <label className="dim f6 fw6 db pv1 gray ttc">
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

                          <label className="dim f6 fw6 db pv1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="depend_on"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('depend_on')}
                            />
                            Predecessor
                          </label>

                          <label className="dim f6 fw6 db pv1 gray ttc">
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

                          <label className="dim f6 fw6 db pv1 gray ttc">
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

                          <label className="dim f6 fw6 db pv1 gray ttc">
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

                          <label className="dim f6 fw6 db pv1 gray ttc">
                            <input
                              type="checkbox"
                              name="checkbox-1"
                              className="mr2"
                              value="estimated_hours"
                              onChange={handleChangeCheckbox}
                              checked={checkboxValue('estimated_hours')}
                            />
                            Estimated Hour
                          </label>
                          <label className="dim f6 fw6 db pv1 gray ttc">
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
                          <label className="dim f6 fw6 db pv1 gray ttc">
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
                          <label className="dim f6 fw6 db pv1 gray ttc">
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
            </div>
          </Manager>
        </div>

        <div className="flex flex-column justify-between bg-white box--shadow">
          <div className="pa4">
            <div className="fl w-100 flex flex-column">
              <TaskList batch={this.props.batch} columns={this.state.columns} />
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
