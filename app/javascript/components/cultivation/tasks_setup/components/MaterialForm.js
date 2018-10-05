import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import reactSelectStyle from './../../../utils/reactSelectStyle'



export default class MaterialForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      id: props.task.id,
      ...props.task.attributes
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props
    if (props.task !== task) {
      this.setState({
        batch_id: this.props.batch_id,
        id: props.task.id,
        ...props.task.attributes
      })
    }
  }

  render(){
    return(
      <div className="ph4 mt3 mb3 flex">
        <div className="w-40">
          <label className="f6 fw6 db mb1 gray ttc">Material Name</label>
          <Select
            isMulti
            name="colors"
            options={[
              { value: 'Fathi', label: 'Fathi' },
              { value: 'Andy', label: 'Andy' },
              { value: 'Karg', label: 'Karg' },
              { value: 'Allison', label: 'Allison' }
            ]}
            className="basic-multi-select"
            classNamePrefix="select"
            styles={reactSelectStyle}
          />
        </div>
        <div className="w-30 pl3">
          <NumericInput
            label={'Quantity'}
            value={this.state.quantity}
            onChange={this.handleChangeTask}
            fieldname="quantity"
            errors={this.state.errors}
            errorField="quantity"
          />
        </div>
        <div className="w-30 pl3">
          <TextInput
            label={'Unit Of Measure'}
            value={this.state.uom}
            onChange={this.handleChangeTask}
            fieldname="uom"
            errors={this.state.errors}
            errorField="uom"
          />
        </div>
      </div>
      )
  }
}
