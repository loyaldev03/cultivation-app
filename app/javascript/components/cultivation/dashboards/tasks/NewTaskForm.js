import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  reactSelectStyle,
  TextInput,
  NumericInput
} from '../../../utils'
import Select from 'react-select'

import DatePicker from 'react-date-picker/dist/entry.nostyle'
import AssignResourceForm from '../../tasks_setup/components/AssignResourceForm'
import { addDays, differenceInCalendarDays } from 'date-fns'

const taskTypes = [
  { label: 'Normal Task', value: 'normal_task' },
  {
    label: 'Receiving Inventory Cannabis',
    value: 'receive_inventory_cannabis'
  },
  { label: 'Receiving Nutrients', value: 'receive_inventory_nutrients' },
  { label: 'Receiving Grow Medium', value: 'receive_grow_medium' },
  { label: 'Receiving Grow Lights', value: 'receive_grow_lights' },
  { label: 'Receiving Supplements', value: 'receive_supplements' },
  { label: 'Receiving other inventory', value: 'receive_others' }
]

@observer
class NewTaskForm extends React.Component {
  constructor(props) {
    super(props)
    const today = new Date()
    const tomorrow = addDays(today, 1)
    this.state = {
      name: '',
      start_date: today,
      end_date: tomorrow,
      duration: 1,
      estimated_hours: 0.0,
      facility_id: this.props.facilityId,
      instruction: ''
    }
  }

  componentDidMount() {}

  onSave = async () => {
    await this.props.onSave(this.state)
  }

  handleChange = (fieldName, value) => {
    if (fieldName === 'duration') {
      this.setState({
        end_date: addDays(this.state.start_date, value),
        duration: value
      })
    } else {
      this.setState({
        [fieldName]: value
      })
    }
  }

  handleChangeSelect = e => {
    if (e.value !== 'normal_task') {
      this.setState({
        task_type: e.value,
        name: e.label
      })
    } else {
      this.setState({
        task_type: e.value
      })
    }
  }

  handleChangeDate = (fieldName, value) => {
    console.log(value)
    if (fieldName === 'end_date' && this.state.start_date) {
      console.log(differenceInCalendarDays(value, this.state.start_date))
      this.setState({
        end_date: value,
        duration: differenceInCalendarDays(value, this.state.start_date)
      })
    } else if (fieldName === 'start_date' && this.state.end_date) {
      this.setState({
        start_date: value,
        end_date: addDays(value, this.state.duration)
      })
    }
  }

  render() {
    const { onClose } = this.props
    const {
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      instruction
    } = this.state
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc mb2">
                Select task type
              </label>
              <Select
                options={taskTypes}
                styles={reactSelectStyle}
                onChange={this.handleChangeSelect}
              />
            </div>

            <div className="w-100 mt3">
              <label className="f6 fw6 db mb1 gray ttc mb2">Task name</label>
              <input
                type="text"
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                value={name}
                onChange={e => this.handleChange('name', e.target.value)}
              />
            </div>

            <div className="flex mt2">
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
                <label className="f6 fw6 db mb1 gray ttc mb1">Duration</label>
                <input
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tr"
                  value={duration}
                  onChange={e => this.handleChange('duration', e.target.value)}
                  type="number"
                  min="1"
                  max=""
                  step=""
                />
              </div>
            </div>

            <div className="w-40 mt2">
              <label className="f6 fw6 db mb1 gray ttc mb2">
                Estimated hours
              </label>
              <input
                type="number"
                value={estimated_hours}
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tr"
                onChange={e =>
                  this.handleChange('estimated_hours', e.target.value)
                }
              />
            </div>

            <div className="w-100 mt3">
              <label className="f6 fw6 db mb1 gray ttc mb2">Instruction</label>
              <textarea
                type="text"
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                value={instruction}
                onChange={e => this.handleChange('instruction', e.target.value)}
              />
            </div>

            <div className="bt b--light-grey mt3 mb3" />

            <label className="f6 fw6 db mb1 gray ttc"> Assignee </label>

            <AssignResourceForm
              // ref={form => (this.assignResouceForm = form)}
              facilityId={this.props.facilityId}
              onClose={() => this.setState({ showAssignResourcePanel: false })}
              embeddedForm={true}
              onChangeEmbed={users => {
                this.setState({
                  user_ids: users
                })
              }}
              onSave={users => {
                // this.setState({ showAssignResourcePanel: false })
                // TaskStore.editAssignedUsers(
                //   batchId,
                //   this.state.taskSelected,
                //   users
                // )
              }}
            />
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

NewTaskForm.propTypes = {
  selectMode: PropTypes.string,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string
}

NewTaskForm.defaultProps = {
  // selectMode: 'multiple', // or 'single'
  title: 'New Task Form'
}

export default NewTaskForm
