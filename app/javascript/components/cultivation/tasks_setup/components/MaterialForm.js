import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'

const uom_dropdown = [
  { value: 'Fathi', label: 'KG' },
  { value: 'Andy', label: 'CM' },
  { value: 'Karg', label: 'Inch' },
  { value: 'Allison', label: 'ML' }
]

const material_dropdown = [
  { value: 'Fathi', label: 'Fathi' },
  { value: 'Andy', label: 'Andy' },
  { value: 'Karg', label: 'Karg' },
  { value: 'Allison', label: 'Allison' }
]

export default class MaterialForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      id: props.task.id,
      ...props.task.attributes,
      material_name: '',
      quantity: '',
      uom: '',
      uom_dropdown: uom_dropdown,
      material_dropdown: material_dropdown,
      materials: []
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

  handleChangeSelect = (key, value) => {
    this.setState({ [key]: value })
  }

  handleChange = (key, value) => {
    console.log(key)

    console.log(value)
    this.setState({ [key]: value.target.value })
  }

  handleSubmit = e => {
    this.setState(prevState => ({
      materials: [
        ...prevState.materials,
        {
          material_name: this.state.material_name.value,
          quantity: this.state.quantity,
          uom: this.state.uom.label
        }
      ],
      material_name: '',
      quantity: '',
      uom: ''
    }))
  }

  handleDelete = id => {
    let materials = this.state.materials
    materials.splice(id, 1)
    this.setState({
      materials: materials
    })
  }

  render() {
    let material_dropdown = this.state.material_dropdown
    let uom_dropdown = this.state.uom_dropdown
    let materials = this.state.materials
    let handleChange = this.handleChange
    let handleDelete = this.handleDelete
    return (
      <div className="ba b--light-gray ml4 mr4 mt4">
        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Material Name</label>
            <Select
              name="material_name"
              options={material_dropdown}
              onChange={e => this.handleChangeSelect('material_name', e)}
              value={this.state.material_name}
            />
          </div>
        </div>
        <div className="ph4 mt3 flex">
          <div className="w-100">
            <NumericInput
              label={'Quantity'}
              value={this.state.quantity}
              onChange={e => handleChange('quantity', e)}
              fieldname="quantity"
              errors={this.state.errors}
              errorField="quantity"
            />
          </div>
        </div>
        <div className="ph4 mt3 flex mb3 ">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Unit Of Measure</label>
            <Select
              name="uom"
              options={uom_dropdown}
              onChange={e => this.handleChangeSelect('uom', e)}
              value={this.state.uom}
            />
          </div>
        </div>
        <div className="pv2 w4">
          <input
            type="submit"
            className="pv2 ph3 ml4 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
            value="Add Material"
            onClick={this.handleSubmit}
          />
        </div>
        <div className="mt4 mr4 ml4 f6 fw6 db mb1 gray ttc">
          {this.state.materials.length !== 0 ? (
            <span>Materials Added</span>
          ) : null}
          <table className="w-100">
            <tbody>
              {materials.map((x, index) => (
                <tr className="pointer bb" key={index}>
                  <td className="tl pv2 ph3">{x.material_name}</td>
                  <td className="tl pv2 ph3">{x.quantity}</td>
                  <td className="tl pv2 ph3">{x.uom}</td>
                  <td className="tl pv2 ph3">
                    <i
                      className="material-icons red md-18 pointer dim"
                      onClick={e => handleDelete(index)}
                    >
                      delete
                    </i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}
