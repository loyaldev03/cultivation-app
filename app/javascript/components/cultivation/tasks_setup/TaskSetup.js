import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import { Manager, Reference, Popper } from 'react-popper'
import TaskList from './components/TaskList'
import TaskStore from './stores/NewTaskStore'
import LocationStore from './stores/LocationStore'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import loadUnresolvedIssueCount from '../../issues/actions/loadUnresolvedIssueCount'
import IssueSidebar from '../../issues/IssueSidebar'
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
      columnOpen: false,
      unresolvedIssueCount: 0
    }

    if (!TaskStore.isDataLoaded) {
      TaskStore.loadTasks(props.batch_id)
      TaskStore.facilityPhases = props.batch.cultivation_phases
    }

    if (!LocationStore.isDataLoaded) {
      LocationStore.loadLocations(props.batch.facility_id)
    }
  }

  componentDidMount() {
    loadUnresolvedIssueCount(this.props.batch.id).then(x => {
      this.setState({ unresolvedIssueCount: x.count })
    })
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
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
    let handleChangeCheckbox = this.handleChangeCheckbox
    let checkboxValue = this.checkboxValue
    return (
      <div className="pa4 grey flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <BatchHeader
          batch_no={batch.batch_no}
          batch_source={batch.batch_source}
          quantity={batch.quantity}
          status={batch.status}
          name={batch.name}
          id={batch.id}
          strain={batch.strain}
          grow_method={batch.grow_method}
          start_date={batch.start_date}
          total_estimated_cost={TaskStore.totalEstimatedCost}
          total_estimated_hour={TaskStore.totalEstimatedHours}
          estimated_harvest_date={batch.estimated_harvest_date}
        />
        <div className="flex justify-between">
          <BatchTabs
            batch={batch}
            currentTab="taskList"
            unresolvedIssueCount={this.state.unresolvedIssueCount}
          />
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
                            Task
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

        <div className="pa4 flex flex-column justify-between bg-white box--shadow">
          <TaskList batch={batch} columns={this.state.columns} />
        </div>
        <IssueSidebar
          batch_id={batch.id}
          facility_id={batch.facility_id}
          mode={this.state.mode}
          current_user_first_name={this.props.current_user_first_name}
          current_user_last_name={this.props.current_user_last_name}
          current_user_photo={this.props.current_user_photo}
        />
      </div>
    )
  }
}

export default TaskSetup
