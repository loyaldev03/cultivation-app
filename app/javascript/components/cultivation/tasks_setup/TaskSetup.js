import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import TaskList from './components/TaskList'
import TaskStore from './stores/NewTaskStore'
import BatchHeader from '../shared/BatchHeader'
import BatchTabs from '../shared/BatchTabs'
import loadUnresolvedIssueCount from '../../issues/actions/loadUnresolvedIssueCount'
import IssueSidebar from '../../issues/IssueSidebar2'
import currentIssueStore from '../../issues/store/CurrentIssueStore'
import { SlidePanel } from '../../utils'

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
        'actual_cost',
        'actual_hours',
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
  }

  componentDidMount() {
    loadUnresolvedIssueCount(this.props.batch.id).then(x => {
      this.setState({ unresolvedIssueCount: x.count })
    })
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
    const showIssues =
      currentIssueStore.mode === 'details' || currentIssueStore.mode === 'edit'

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
          <div className="flex mt4">
            <div className="mr2 mt2">
              <i className="material-icons icon--small pointer">filter_list</i>
              <span className="grey f6 ml2">Filter</span>
            </div>

            <Tippy
              placement="bottom-end"
              trigger="click"
              duration="0"
              content={
                <div className="">
                  <div
                    id="myDropdown"
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
                          value="actual_hours"
                          onChange={handleChangeCheckbox}
                          checked={checkboxValue('actual_hours')}
                        />
                        Actual Hour
                      </label>
                      <label className="dim f6 fw6 db pv1 gray ttc">
                        <input
                          type="checkbox"
                          name="checkbox-1"
                          className="mr2"
                          value="actual_cost"
                          onChange={handleChangeCheckbox}
                          checked={checkboxValue('actual_cost')}
                        />
                        Actual Cost
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
              }
            >
              <span className="f6 link ba b--light-grey ph3 pv2 mb3 flex justify-center dib grey pointer">
                Show Columns
                <i className="material-icons icon--small pointer ml2">
                  expand_more
                </i>
              </span>
            </Tippy>
          </div>
        </div>

        <div className="pa4 flex flex-column justify-between bg-white box--shadow">
          <TaskList batch={batch} columns={this.state.columns} />
        </div>
        <SlidePanel
          width="500px"
          show={showIssues}
          renderBody={props => (
            <IssueSidebar
              batch_id={batch.id}
              facility_id={batch.facility_id}
              mode={this.state.mode}
              current_user_first_name={this.props.current_user_first_name}
              current_user_last_name={this.props.current_user_last_name}
              current_user_photo={this.props.current_user_photo}
              onClose={() => {}}
            />
          )}
        />
      </div>
    )
  }
}

export default TaskSetup
