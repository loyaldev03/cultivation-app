import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import updateTasks from '../actions/updateTask'
import { addDays, differenceInCalendarDays, parse } from 'date-fns'
import ErrorStore from '../stores/ErrorStore'

const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000

class SidebarTaskEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.task) {
      const {
        id,
        name,
        start_date,
        end_date,
        duration,
        estimated_hours,
        task_type
      } = props.task
      this.state = {
        id,
        name,
        start_date: start_date ? parse(start_date) : '',
        end_date: end_date ? parse(end_date) : '',
        duration,
        estimated_hours: estimated_hours || '',
        task_type: task_type || [],
        tabs: 'general'
      }
    } else {
      const today = new Date()
      const tomorrow = addDays(today, 1)
      this.state = {
        id: '',
        name: '',
        duration: '',
        start_date: today,
        end_date: tomorrow,
        estimated_hours: '',
        task_type: [],
        tabs: 'general'
      }
    }
  }

  handleChangeText = fieldName => e => {
    if (fieldName === 'duration') {
      this.setState({
        end_date: addDays(this.state.start_date, e.target.value),
        [fieldName]: e.target.value
      })
      return
    }
    this.setState({
      [fieldName]: e.target.value
    })
  }

  handleChangeDate = (fieldName, value) => {
    if (fieldName === 'end_date' && this.state.start_date) {
      this.setState({
        duration: differenceInCalendarDays(value, this.state.start_date),
        [fieldName]: value
      })
      return
    }
    if (fieldName === 'start_date' && this.state.end_date) {
      this.setState({
        duration: differenceInCalendarDays(this.state.start_date, value),
        [fieldName]: value
      })
      return
    } else {
      this.setState({ [fieldName]: value })
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
    const {
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      task_type
    } = this.state
    const changedTask = {
      ...this.props.task,
      batch_id: this.props.batchId,
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      task_type
    }
    updateTasks.updateTask(changedTask)
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
    const { showEstimatedHoursField } = this.props
    // let isNotNormalTask =
    //   this.state.is_phase === true || this.state.is_category === true
    let handleChangeCheckbox = this.handleChangeCheckbox
    let checkboxValue = this.checkboxValue
    // let errorMessage = ErrorStore.slice()
    const { name } = this.state
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
              onChange={this.handleChangeText('name')}
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
              onChange={value => this.handleChangeDate('start_date', value)}
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End At</label>
            <DatePicker
              value={this.state.end_date}
              fieldname="end_date"
              onChange={value => this.handleChangeDate('end_date', value)}
            />
          </div>
          <div className="w-20 pl3">
            <NumericInput
              label={'Duration'}
              min="1"
              value={this.state.duration}
              onChange={this.handleChangeText('duration')}
              errors={this.state.errors}
              errorField="duration"
            />
          </div>
        </div>

        {showEstimatedHoursField ? (
          <div className="ph4 mt3 mb3 flex">
            <div className="w-40">
              <NumericInput
                label={'Estimated Hours Needed'}
                min="0"
                value={this.state.estimated_hours}
                onChange={this.handleChangeText('estimated_hours')}
                errors={this.state.errors}
                errorField="estimated_hours"
              />
            </div>
          </div>
        ) : null}

        {showEstimatedHoursField ? (
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

        {!showEstimatedHoursField ? (
          <div className="mt3">
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
            className="btn btn--primary btn--large"
            onClick={this.handleSubmit}
          >
            Save
          </button>
        </div>
      </React.Fragment>
    )
  }
}

export default SidebarTaskEditor
