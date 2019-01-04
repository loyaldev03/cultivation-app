import React from 'react'
import { render } from 'react-dom'
import UserStore from '../stores/UserStore'
import TaskStore from '../stores/NewTaskStore'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import Select from 'react-select'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import { fadeToast, toast } from '../../../utils/toast'
import reactSelectStyle from './../../../utils/reactSelectStyle'
import { throws } from 'assert'
import createTask from '../actions/createTask'
import { addDays, differenceInCalendarDays, parse } from 'date-fns'

class AddTaskForm extends React.Component {
  constructor(props) {
    super(props)
    const today = new Date()
    const tomorrow = addDays(today, 1)
    this.state = {
      name: '',
      start_date: today,
      end_date: tomorrow,
      duration: '',
      estimated_hours: '',
      assigned_employee: [],
      errors: ''
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

  handleChangeTask = event => {
    let key = event.target.attributes.fieldname.value
    let value = event.target.value
    this.setState({ [key]: value })
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
    createTask.createTask(this.state)
    this.clearState()
    this.props.handleReset()
  }

  clearState = event => {
    this.setState({
      parent_id: '',
      name: '',
      duration: '',
      task_category: '',
      start_date: new Date(),
      end_date: new Date(),
      errors: '',
      estimated_hours: '',
      assigned_employee: []
    })
  }

  render() {
    let users = UserStore.users
    const relativeTask = TaskStore.getTaskById(this.props.relativeTaskId)
    const {
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      errors
    } = this.state
    return (
      <React.Fragment>
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
            <label className="f6 fw6 db mb1 gray ttc">Start Date</label>
            <DatePicker
              value={start_date}
              fieldname="start_date"
              onChange={e => this.handleChangeDate('start_date', e)}
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End Date</label>
            <DatePicker
              value={end_date}
              fieldname="end_date"
              onChange={e => this.handleChangeDate('end_date', e)}
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

export default AddTaskForm
