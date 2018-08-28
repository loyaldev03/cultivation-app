
import React from "react";
import { render } from "react-dom";
import update from 'immutability-helper'
import taskStore from '../stores/TaskStore'
import DatePicker from 'react-date-picker'
import Select from 'react-select';
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import reactSelectStyle from './../../../utils/reactSelectStyle'
import { throws } from "assert";


class SidebarTaskEditor extends React.Component {
  constructor(props){
    super(props)
    this.state ={
      id: props.task.id,
      ...props.task.attributes,
      days: '',
      start_date: new Date(),
      end_date: new Date(),
      errors: '',
      estimated_hours: '',
      assigned_employee: []
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props;
    if (props.task !== task) {
      this.setState({
        id: props.task.id,
        ...props.task.attributes
      })
    }
  }

  handleChangeTask = (event) => {
    console.log(event[0].value)
    let key = event.target.attributes.fieldname.value
    let value = event.target.value
    this.setState({ [key]: value });
  }

  handleChangeDate =(key, value) => {
    console.log(value)
    this.setState({ [key]: value})
  }

  handleChangeSelect = (value, { action, removedValue }) => {
    console.log(value)
    let arr = this.state.assigned_employee
    switch (action) {
      case 'select-option':
        // arr.push(value[0])
        // console.log(value[0].value)
        break;
      case 'remove-value':
        // console.log(removedValue.value)
        const index = arr.indexOf(removedValue);
        arr.splice(index, 1);
        break;
    }
    this.setState({ assigned_employee: value})
    // value = orderOptions(value);
    // this.setState({ value: value });
  }


  render() {
    return (
      <React.Fragment>
        <div className="ph4 mt3 mb3 flex">
          <div className="w-60">
            <TextInput
              label={'Task'}
              value={this.state.name}
              onChange={this.handleChangeTask}
              fieldname="name"
              errors={this.state.errors}
              errorField="name"
            />
          </div>
          <div className="w-40 pl3">
            <TextInput
              label={'Category'}
              value={this.state.task_category}
              onChange={this.handleChangeTask}
              fieldname="task_category"
              errors={this.state.errors}
              errorField="task_category"
            />
          </div>
        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Instruction</label>
            <textarea
              value={this.state.instructions}
              onChange={this.handleChangeTask}
              fieldname="instruction"
              rows="5"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001, Tray0001&#10;Plant0002, Tray0001&#10;Plant0003, Tray0002&#10;Plant0004, Tray0002"
            />
            <FieldError errors={this.state.errors} fieldname="instruction" />
          </div>
        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-20">
            <NumericInput
              label={'Days'}
              value={this.state.days}
              onChange={this.handleChangeTask}
              fieldname="days"
              errors={this.state.errors}
              errorField="days"
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Start Date</label>
            <DatePicker
              value={this.state.start_date}
              fieldname="start_date"
              onChange={(e) => this.handleChangeDate('start_date', e)}
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End Date</label>
            <DatePicker
              value={this.state.end_date}
              fieldname="end_date"
              onChange={(e) => this.handleChangeDate('end_date', e)}
            />
          </div>

        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">

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
        <div className="ph4 mt3 mb3 flex">
          <div className="w-60">
            <label className="f6 fw6 db mb1 gray ttc">Assigned Employees</label>
            <Select
              isMulti
              name="colors"
              options={[{ value: 'Fathi', label: 'Fathi' }, { value: 'Andy', label: 'Andy' }, { value: 'Karg', label: 'Karg' }, { value: 'Allison', label: 'Allison' }]}
              className="basic-multi-select"
              classNamePrefix="select"
              fieldname="assigned_employee"
              onChange={this.handleChangeSelect}
              value={this.state.assigned_employee}
              styles={reactSelectStyle}
            />
          </div>
        </div>


        <div className="ph4 mt3 mb3 flex">
          <div className="w-60">
            <label className="f6 fw6 db mb1 gray ttc">Material Suggested</label>
            <Select
              isMulti
              name="colors"
              options={[{ value: 'Fathi', label: 'Fathi' }, { value: 'Andy', label: 'Andy' }, { value: 'Karg', label: 'Karg' }, { value: 'Allison', label: 'Allison' }]}
              className="basic-multi-select"
              classNamePrefix="select"
              styles={reactSelectStyle}
            />
          </div>
        </div>

      </React.Fragment>

    )
  }
}

export default SidebarTaskEditor
