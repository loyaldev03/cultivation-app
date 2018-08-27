
import React from "react";
import { render } from "react-dom";
import update from 'immutability-helper'
import taskStore from '../stores/TaskStore'
import DatePicker from 'react-date-picker'
import Select from 'react-select';


class SidebarTaskEditor extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      task: this.props.task
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props;
    if (props.task !== task) {
      this.setState({task: props.task})
    }
  }

  

  handleChangeTask = (event) => {
    console.log(event.target.attributes.fieldName.value)
    let oldContents = this.state.task;
    let newContents = update(oldContents, { attributes: {[key]: { $set: value } } } );
    this.handleChange('task', newContents);
  }

  handleChange = (key, value) => {
    this.setState({
     task: {...this.state.task,
       [key]: value
     } 
    })

    // this.setState(prevState => ({
    //   [key]: value
    // }))
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 mt3 mb3 flex">
          <div className="w-60">
            <label className="f6 fw6 db mb1 gray ttc">Task</label>
            <input
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
              fieldName="name"
              onChange={this.handleChangeTask}
              // onChange={(e) => { this.handleChangeTask('name', e.target.value) }}
              value={this.state.task.attributes.name}
              type="text"
            />
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Category</label>
            <input
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
              fieldName="task_category"
              onChange={this.handleChangeTask}
              // onChange={(e) => { this.handleChangeTask('task_category', e.target.value) }}
              value={this.state.task.attributes.task_category}
              type="text"
            />
          </div>
        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Instruction</label>
            <textarea
              value={this.state.task.attributes.instructions}
              onChange={(e) => { this.handleChangeTask('instructions', e.target.value) }}
              rows="5"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001, Tray0001&#10;Plant0002, Tray0001&#10;Plant0003, Tray0002&#10;Plant0004, Tray0002"
            />
          </div>
        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-20">
            <label className="f6 fw6 db mb1 gray ttc">Days</label>
            <input
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
              fieldName="days"
              // onChange={(e) => { this.handleChangeTask('days', e.target.value) }}
              onChange={this.handleChangeTask}
              value={this.state.task.attributes.days}
              type="text"
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Start Date</label>
            <DatePicker
              value={this.state.start_date}
              onChange={(e) => this.handleChangeTask('start_date', e)}
            />
          </div>

          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">End Date</label>
            <DatePicker
              value={this.state.start_date}
              onChange={(e) => this.handleChangeTask('end_date', e)}
            />
          </div>

        </div>

        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Estimated Hours Needed</label>
            <input
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
              onChange={(e) => { this.handleChangeTask('estimated_hours', e.target.value) }}
              value={this.state.task.attributes.estimated_hours}
              type="text"
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
              styles={customStyles}
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
              styles={customStyles}
            />
          </div>
        </div>

      </React.Fragment>

    )
  }
}

const customStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: '#fff',
    height: '30px',
    minHeight: '30px',
    borderColor: 'rgba(0, 0, 0, 0.2)'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  menu: (base, state) => ({
    ...base,
    marginTop: 2
  }),
  dropdownIndicator: () => ({
    display: 'none'
  }),
  option: (base, state) => {
    return {
      ...base,
      backgroundColor:
        state.isFocused || state.isSelected
          ? 'rgba(100, 100, 100, 0.1)'
          : 'transparent',
      ':active': 'rgba(100, 100, 100, 0.1)',
      WebkitTapHighlightColor: 'rgba(100, 100, 100, 0.1)',
      color: 'black'
    }
  }
}

export default SidebarTaskEditor
