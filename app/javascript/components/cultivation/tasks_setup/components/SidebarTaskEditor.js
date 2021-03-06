import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { LocationPicker } from '../../../utils'
import { TextInput, NumericInput } from '../../../utils/FormHelpers'
import MotherPlantsEditor from './MotherPlantsEditor'
import { addDays, differenceInCalendarDays } from 'date-fns'

const GET_DEFAULT_STATE = (start_date = null) => {
  const today = start_date ? start_date : new Date()
  const tomorrow = addDays(today, 1)
  return {
    id: '',
    name: '',
    start_date: today,
    end_date: tomorrow,
    duration: 1,
    phase: '',
    estimated_hours: 0.0,
    indelible: '',
    is_parent: false,
    instruction: ''
  }
}

class SidebarTaskEditor extends React.Component {
  state = GET_DEFAULT_STATE()

  setEditingTask = async (task, start_date) => {
    if (task) {
      this.setState({
        id: task.id,
        name: task.name,
        start_date: task.start_date,
        end_date: task.end_date,
        duration: task.duration,
        phase: task.phase,
        estimated_hours: task.estimated_hours || '',
        indelible: task.indelible,
        is_parent: task.is_parent,
        instruction: task.instruction || '',
        location_id: task.location_id || ''
      })
    } else {
      this.setState({ ...GET_DEFAULT_STATE(start_date) })
    }
  }

  getEditingTask() {
    const {
      id,
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      location_id,
      instruction
    } = this.state
    return {
      id,
      name,
      start_date,
      end_date,
      duration,
      estimated_hours,
      instruction,
      location_id: location_id
    }
  }

  validate = () => {
    if (this.motherPlantsEditor) {
      return this.motherPlantsEditor.validate()
    }
    return true
  }

  handleChangeText = fieldName => e => {
    if (fieldName === 'duration') {
      this.setState({
        end_date: addDays(this.state.start_date, e.target.value),
        duration: e.target.value
      })
    } else {
      this.setState({
        [fieldName]: e.target.value
      })
    }
  }

  handleChangeDate = (fieldName, value) => {
    if (fieldName === 'end_date' && this.state.start_date) {
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

  handleChangeLocation = event => {
    this.setState({ location_id: event.location_id })
  }

  render() {
    const { batchId, facilityStrainId, facilityId } = this.props
    const {
      id,
      name,
      start_date,
      end_date,
      duration,
      phase,
      estimated_hours,
      indelible,
      actual_hours,
      is_parent,
      location_id,
      instruction,
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
        <div className="ph4 mv3 flex">
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
        <div className="ph4 mb3 flex">
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
        {indelible === 'clip_mother_plant' && (
          <div className="ph4 mb3 flex flex-column">
            <MotherPlantsEditor
              ref={editor => (this.motherPlantsEditor = editor)}
              batchId={batchId}
              facilityStrainId={facilityStrainId}
              onAddItem={newItem => console.log('onAddItem')}
              onDeleteItem={itemId => console.log('onDeleteItem')}
            />
          </div>
        )}
        {indelible !== 'clip_mother_plant' && !is_parent && (
          <div className="ph4 mb3 flex flex-column">
            <label className="f6 fw6 db mb1 gray ttc">Location</label>
            <LocationPicker
              purpose={phase}
              facility_id={facilityId}
              location_id={location_id}
              onChange={this.handleChangeLocation}
            />
          </div>
        )}

        {!is_parent && (
          <div className="ph4 mb3 flex flex-column">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc mb2">Instruction</label>
              <textarea
                type="text"
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                value={instruction}
                onChange={this.handleChangeText('instruction')}
              />
            </div>
          </div>
        )}

        {!is_parent ? (
          <div className="ph4 mb3 flex flex-column">
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
        {!!is_parent ? (
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
      </React.Fragment>
    )
  }
}

export default SidebarTaskEditor
