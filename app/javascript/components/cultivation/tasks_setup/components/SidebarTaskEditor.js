import React from 'react'
import { render } from 'react-dom'
import TaskStore from '../stores/TaskStore'
import UserStore from '../stores/UserStore'
import UserRoles from '../stores/UserRoleStore'

import DatePicker from 'react-date-picker/dist/entry.nostyle'
import Select from 'react-select'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import { fadeToast, toast } from '../../../utils/toast'
import reactSelectStyle from './../../../utils/reactSelectStyle'
import { throws } from 'assert'
import updateTasks from '../actions/updateTask'

class SidebarTaskEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tabs: 'general',
      batch_id: this.props.batch_id,
      id: props.task.id,
      ...props.task.attributes,
      duration: this.props.task.attributes.duration,
      start_date: new Date(this.props.task.attributes.start_date),
      end_date: new Date(this.props.task.attributes.end_date),
      errors: '',
      estimated_hours: ''
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props
    if (props.task !== task) {
      this.setState({
        batch_id: this.props.batch_id,
        id: props.task.id,
        ...props.task.attributes,
        duration: props.task.attributes.duration,
        start_date: new Date(),
        end_date: new Date(),
        start_date: new Date(props.task.attributes.start_date),
        end_date: new Date(props.task.attributes.end_date),
        errors: '',
        estimated_hours: ''
      })
    }
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value })
  }

  handleChangeTask = event => {
    let key = event.target.attributes.fieldname.value
    let value = event.target.value
    this.setState({ [key]: value })
  }

  handleChangeDate = (key, value) => {
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
    updateTasks.updateTask(this.state)
  }

  handleChangeCheckbox = (e) => {
    const item = e.target.name;
    const isChecked = e.target.checked;
    let arrays = this.state.task_type;
    if(e.target.checked){
      arrays.push(e.target.value)
    }else{
      arrays = arrays.filter(k => k !== e.target.value);
    }
    this.setState({task_type: arrays})

    // this.setState(prevState => ({ task_type: prevState.task_type.set(item, isChecked) }));
  }

  handleChangeCheckbox2 = (e) => {
    const arrays = this.state.task_type;
    if (e.target.checked) {
      // const selectedSubject = this.state.dsSubjects.find(e => e.id === value); // find selected subject
      arrays.push({
        id: selectedSubject.id,
        code: selectedSubject.code,
        name: selectedSubject.name
      });
    } else {
      const index = arrays.findIndex(i => i.id === value);
      arrays.splice(index, 1);
    }
    this.setState({ task_type: arrays });
  };

  checkboxValue = (val) => {
    return this.state.task_type.includes(val)
  }


  render() {
    let users = UserStore.users
    let roles = UserRoles.slice()
    let isNormalTask = this.state.is_phase === false && this.state.is_category === false
    let handleChangeCheckbox = this.handleChangeCheckbox
    let checkboxValue = this.checkboxValue
    return (
      <React.Fragment>
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
          {/* <div className="w-40 pl3">
            <TextInput
              label={'Category'}
              value={this.state.task_category}
              onChange={this.handleChangeTask}
              fieldname="task_category"
              errors={this.state.errors}
              errorField="task_category"
            />
          </div> */}
        </div>

        {/* <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Instruction</label>
            <textarea
              value={this.state.instruction}
              onChange={this.handleChangeTask}
              fieldname="instruction"
              rows="2"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder=""
            />
            <FieldError errors={this.state.errors} fieldname="instruction" />
          </div>
        </div> */}
        <div className="ph4 mt3 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Start Date</label>
            <DatePicker
              value={this.state.start_date}
              fieldname="start_date"
              onChange={e => this.handleChangeDate('start_date', e)}
            />
          </div>

          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End Date</label>
            <DatePicker
              value={this.state.end_date}
              fieldname="end_date"
              onChange={e => this.handleChangeDate('end_date', e)}
            />
          </div>
        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-20">
            <NumericInput
              label={'Duration'}
              value={this.state.duration}
              onChange={this.handleChangeTask}
              fieldname="duration"
              errors={this.state.errors}
              errorField="duration"
            />
          </div>
          {isNormalTask ? (
            <div className="w-40 pl3">
              <NumericInput
                label={'Estimated Hours Needed'}
                value={this.state.estimated_hours}
                onChange={this.handleChangeTask}
                fieldname="estimated_hours"
                errors={this.state.errors}
                errorField="estimated_hours"
              />
            </div>

          ) : null 
          }


        </div>
        {isNormalTask ? (
        <div className="ph4 mt3 mb3">
          <label className="f6 fw6 db mb1 gray ttc">Task Type</label>
          <br/>
          <label className="f6 fw6 db mb1 gray ttc">
            <input type='checkbox' name='checkbox-1' class='mr2' value='assign_plant_id' onChange={handleChangeCheckbox} checked={checkboxValue('assign_plant_id')}/>
            Assign Plant id to clippings
          </label>
          <label className="f6 fw6 db mb1 gray ttc">
            <input type='checkbox' name='checkbox-1' class='mr2' value='move_plant' onChange={handleChangeCheckbox} checked={checkboxValue('move_plant')}  />
            Move plant
          </label>
          <label className="f6 fw6 db mb1 gray ttc">
            <input type='checkbox' name='checkbox-1' class='mr2' value='assign_plant_id_metrc' onChange={handleChangeCheckbox} checked={checkboxValue('assign_plant_id_metrc')} />
            Assign Plant ID with Metrc tag
          </label>
          <label className="f6 fw6 db mb1 gray ttc">
            <input type='checkbox' name='checkbox-1' class='mr2' value='create_harvest' onChange={handleChangeCheckbox} checked={checkboxValue('create_harvest')} />
            Create harvest
          </label>
          <label className="f6 fw6 db mb1 gray ttc">
            <input type='checkbox' name='checkbox-1' class='mr2' value='create_package' onChange={handleChangeCheckbox} checked={checkboxValue('create_package')} />
            Create package
          </label>
          <label className="f6 fw6 db mb1 gray ttc">
            <input type='checkbox' name='checkbox-1' class='mr2' value='finish_harvest' onChange={handleChangeCheckbox} checked={checkboxValue('finish_harvest')} />
            Finish harvest
          </label>
        </div>
        ) : null
        }
        
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
