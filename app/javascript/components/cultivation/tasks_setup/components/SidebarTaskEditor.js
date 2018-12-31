import React from 'react'
import UserStore from '../stores/UserStore'
import UserRoles from '../stores/UserRoleStore'

import DatePicker from 'react-date-picker/dist/entry.nostyle'
import Select from 'react-select'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import reactSelectStyle from './../../../utils/reactSelectStyle'
import { throws } from 'assert'
import updateTasks from '../actions/updateTask'
import ErrorStore from '../stores/ErrorStore'

class SidebarTaskEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: 'general',
      batch_id: this.props.batch_id,
      id: props.task.id,
      ...props.task,
      duration: this.props.task.duration,
      start_date: this.initialize_date(this.props.task.start_date),
      end_date: this.initialize_date(this.props.task.end_date),
      errors: ''
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props
    if (props.task !== task) {
      this.setState({
        batch_id: this.props.batch_id,
        id: props.task.id,
        ...props.task.attributes,
        duration: props.task.duration,
        start_date: this.initialize_date(props.task.start_date),
        end_date: this.initialize_date(props.task.end_date),
        errors: ''
      })
    }
  }

  initialize_date(date) {
    if (date) {
      return new Date(date)
    } else {
      return ''
    }
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleChangeTask = event => {
    let key = event.target.fieldname.value
    let value = event.target.value
    if (key === 'duration' && value && this.state.start_date) {
      let new_end_date = new Date(this.state.start_date)
      new_end_date.setDate(new_end_date.getDate() + parseInt(value) - 1)
      this.setState({ end_date: new_end_date, [key]: value })
    } else {
      this.setState({ [key]: value })
    }
  }

  handleChangeDate = (key, value) => {
    if (key === 'end_date' && this.state.start_date) {
      let one_day = 1000 * 60 * 60 * 24
      let duration = new Date(value) - new Date(this.state.start_date)
      this.setState({ [key]: value, duration: duration / one_day + 1 })
    } else if (key === 'start_date' && this.state.end_date) {
      let one_day = 1000 * 60 * 60 * 24
      let duration = new Date(this.state.end_date) - new Date(value)
      this.setState({ [key]: value, duration: duration / one_day + 1 })
    } else {
      this.setState({ [key]: value })
    }
  }

  handleChangeSelect = (value, { action, removedValue }) => {
    let arr = this.state.assigned_employee
    switch (action) {
      case 'select-option':
        // arr.push(value[0])
        // console.log(value[0].value)
        break
      case 'remove-value':
        // console.log(removedValue.value)
        const index = arr.indexOf(removedValue)
        arr.splice(index, 1)
        break
    }
    this.setState({ assigned_employee: value })
    // value = orderOptions(value);
    // this.setState({ value: value });
  }

  handleSubmit = event => {
    updateTasks.updateTask(this.state)
  }

  handleChangeCheckbox = e => {
    const item = e.target.name
    const isChecked = e.target.checked
    let arrays = this.state.task_type
    if (e.target.checked) {
      arrays.push(e.target.value)
    } else {
      arrays = arrays.filter(k => k !== e.target.value)
    }
    this.setState({ task_type: arrays })
  }

  checkboxValue = val => {
    return this.state.task_type.includes(val)
  }

  render() {
    let users = UserStore.users
    let roles = UserRoles.slice()
    let isNormalTask =
      this.state.is_phase === false && this.state.is_category === false
    let isNotNormalTask =
      this.state.is_phase === true || this.state.is_category === true
    let handleChangeCheckbox = this.handleChangeCheckbox
    let checkboxValue = this.checkboxValue
    // let errorMessage = ErrorStore.slice()
    return (
      <React.Fragment>
        <div
          className="ph4 mt3 mb3 flex"
          id="error-container"
          style={{ display: 'none' }}
        >
          <div className="w-100 ba br2 orange pa3">
            <label className="f6 fw6 db">
              <b>Warning: </b>
              <span id="error-message" />
            </label>
          </div>
        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <TextInput
              label={'Task'}
              value={this.state.name}
              onChange={this.handleChangeTask}
              fieldname="name"
              errors={this.state.errors}
              errorField="name"
            />
          </div>
        </div>
        <div className="ph4 flex">
          <div className="w-40">
            <label className="f6 fw6 db mb1 gray ttc">Start At</label>
            <DatePicker
              value={this.state.start_date}
              fieldname="start_date"
              onChange={e => this.handleChangeDate('start_date', e)}
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End At</label>
            <DatePicker
              value={this.state.end_date}
              fieldname="end_date"
              onChange={e => this.handleChangeDate('end_date', e)}
            />
          </div>
          <div className="w-20 pl3">
            <NumericInput
              label={'Duration'}
              value={this.state.duration}
              onChange={this.handleChangeTask}
              fieldname="duration"
              errors={this.state.errors}
              errorField="duration"
            />
          </div>
        </div>

        {isNormalTask ? (
          <div className="ph4 mt3 mb3 flex">
            <div className="w-40">
              <NumericInput
                label={'Estimated Hours Needed'}
                value={this.state.estimated_hours}
                onChange={this.handleChangeTask}
                fieldname="estimated_hours"
                errors={this.state.errors}
                errorField="estimated_hours"
              />
            </div>
          </div>
        ) : null}

        {isNormalTask ? (
          <div>
            <hr className="mt3 m b--light-gray w-100" />

            <div className="ph4 mt3 mb3">
              <label className="f6 fw6 db mb1 ttc">
                Please select special task that related to daily task
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  name="checkbox-1"
                  className="mr2"
                  value="assign_plant_id"
                  onChange={handleChangeCheckbox}
                  checked={checkboxValue('assign_plant_id')}
                />
                Assign Plant id to clippings
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  name="checkbox-1"
                  className="mr2"
                  value="move_plant"
                  onChange={handleChangeCheckbox}
                  checked={checkboxValue('move_plant')}
                />
                Move plant
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  name="checkbox-1"
                  className="mr2"
                  value="assign_plant_id_metrc"
                  onChange={handleChangeCheckbox}
                  checked={checkboxValue('assign_plant_id_metrc')}
                />
                Assign Plant ID with Metrc tag
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  name="checkbox-1"
                  className="mr2"
                  value="create_harvest"
                  onChange={handleChangeCheckbox}
                  checked={checkboxValue('create_harvest')}
                />
                Create harvest
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  name="checkbox-1"
                  className="mr2"
                  value="create_package"
                  onChange={handleChangeCheckbox}
                  checked={checkboxValue('create_package')}
                />
                Create package
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  name="checkbox-1"
                  className="mr2"
                  value="finish_harvest"
                  onChange={handleChangeCheckbox}
                  checked={checkboxValue('finish_harvest')}
                />
                Finish harvest
              </label>
            </div>
          </div>
        ) : null}

        {isNotNormalTask ? (
          <div className="">
            <hr className="mt3 m b--light-gray w-100" />
            <div className="ph4 mt3 mb3">
              <div className="flex">
                <div className="w-40">
                  <label className="f6 fw6 db mb1 gray ttc">
                    Estimated Hours
                  </label>
                  <label className="f6 fw6 db mb1 gray ttc">
                    {this.state.estimated_hours}
                  </label>
                </div>
                <div className="w-40 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">Actual Hours</label>
                  <label className="f6 fw6 db mb1 gray ttc">
                    {this.state.actual_hours}
                  </label>
                </div>
              </div>
              <div className="flex mt3">
                <div className="w-40">
                  <label className="f6 fw6 db mb1 gray ttc">
                    Estimated Cost
                  </label>
                  <label className="f6 fw6 db mb1 gray ttc">0.0</label>
                </div>
                <div className="w-40 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">Actual Cost</label>
                  <label className="f6 fw6 db mb1 gray ttc">0.0</label>
                </div>
              </div>
            </div>
          </div>
        ) : null}
        <div className="w-100 pa4 bt b--light-grey absolute right-0 bottom-0 flex items-center justify-between">
          <button
            name="commit"
            type="submit"
            value="continue"
            className="ttu db tr pa3 bg-orange button--font white bn box--br3 ttu link dim pointer"
            onClick={this.handleSubmit}
          >
            Update
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default SidebarTaskEditor
