import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import updateTasks from '../actions/updateTask'
import { addDays, differenceInCalendarDays, parse } from 'date-fns'
import ErrorStore from '../stores/ErrorStore'

class SidebarTaskEditor extends React.Component {
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
    const { taskAction, batchId, task } = this.props
    const changedTask = {
      ...task,
      action: taskAction,
      batch_id: batchId,
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      task_type
    }
    updateTasks.updateTask(changedTask)
  }

  handleChangeCheckbox = fieldName => e => {
    let { task_type } = this.state
    if (e.target.checked) {
      task_type.push(fieldName)
    } else {
      task_type = task_type.filter(k => k !== fieldName)
    }
    this.setState({ task_type })
  }

  checkboxValue = field => {
    return this.state.task_type.includes(field)
  }

  render() {
    const { showEstimatedHoursField } = this.props
    // let errorMessage = ErrorStore.slice()
    const {
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      actual_hours,
      task_type,
      errors
    } = this.state
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
              value={name}
              onChange={this.handleChangeText('name')}
              errors={errors}
              errorField="name"
            />
          </div>
        </div>
        <div className="ph4 flex">
          <div className="w-40">
            <label className="f6 fw6 db mb1 gray ttc">Start At</label>
            <DatePicker
              value={start_date}
              fieldname="start_date"
              onChange={value => this.handleChangeDate('start_date', value)}
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End At</label>
            <DatePicker
              value={end_date}
              fieldname="end_date"
              onChange={value => this.handleChangeDate('end_date', value)}
            />
          </div>
          <div className="w-20 pl3">
            <NumericInput
              label={'Duration'}
              min="1"
              value={duration}
              onChange={this.handleChangeText('duration')}
              errors={errors}
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
                value={estimated_hours}
                onChange={this.handleChangeText('estimated_hours')}
                errors={errors}
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
                  className="mr2"
                  onChange={this.handleChangeCheckbox('assign_plant_id')}
                  checked={this.checkboxValue('assign_plant_id')}
                />
                Assign Plant id to clippings
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  className="mr2"
                  onChange={this.handleChangeCheckbox('move_plant')}
                  checked={this.checkboxValue('move_plant')}
                />
                Move plant
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  className="mr2"
                  onChange={this.handleChangeCheckbox('assign_plant_id_metrc')}
                  checked={this.checkboxValue('assign_plant_id_metrc')}
                />
                Assign Plant ID with Metrc tag
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  className="mr2"
                  onChange={this.handleChangeCheckbox('create_harvest')}
                  checked={this.checkboxValue('create_harvest')}
                />
                Create harvest
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  className="mr2"
                  onChange={this.handleChangeCheckbox('create_package')}
                  checked={this.checkboxValue('create_package')}
                />
                Create package
              </label>
              <label className="f6 fw6 db mb1 gray ttc">
                <input
                  type="checkbox"
                  className="mr2"
                  onChange={this.handleChangeCheckbox('finish_harvest')}
                  checked={this.checkboxValue('finish_harvest')}
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
                    {estimated_hours}
                  </label>
                </div>
                <div className="w-40 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">Actual Hours</label>
                  <label className="f6 fw6 db mb1 gray ttc">
                    {actual_hours}
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
