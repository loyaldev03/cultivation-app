import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'

import ItemStore from '../stores/ItemStore'

import deleteMaterial from '../actions/deleteMaterial'

import loadTasks from '../actions/loadTask'

const uom_dropdown = [
  { value: 'KG', label: 'KG' },
  { value: 'CM', label: 'CM' },
  { value: 'Inch', label: 'Inch' },
  { value: 'ML', label: 'ML' },
  { value: 'L', label: 'L' },
  { value: 'Pcs', label: 'Pcs' }
]

export default class MaterialForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      id: props.task.id,
      ...props.task.attributes,
      name: '',
      quantity: '',
      uom: '',
      uom_dropdown: uom_dropdown,
      materials: [],
      items: props.task.attributes.items
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props
    if (props.task !== task) {
      this.setState({
        batch_id: this.props.batch_id,
        id: props.task.id,
        ...props.task.attributes,
        name: '',
        quantity: '',
        uom: '',
        uom_dropdown: uom_dropdown,
        materials: [],
        items: props.task.attributes.items
      })
    }
  }

  handleChangeSelect = (key, value) => {
    this.setState({ [key]: value })
  }

  handleChange = (key, value) => {
    this.setState({ [key]: value.target.value })
  }

  handleSubmit = e => {
    this.sendApiCreate()
  }

  handleDelete = id => {
    this.setState(
      {
        items: this.state.items.filter(item => item.id !== id)
      },
      deleteMaterial(this.state.batch_id, this.state.id, id)
    )
  }

  sendApiDelete = async e => {}

  sendApiCreate = async e => {
    let url = `/api/v1/items?task_id=${this.state.id}`
    let data
    let item = {
      item: {
        name: this.state.name.label,
        quantity: this.state.quantity,
        uom: this.state.uom.label
      }
    }
    try {
      await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(item),
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then(response => response.json())
        .then(data => {
          if (data.data.id != null) {
            data = data.data
            this.setState(prevState => ({
              items: [
                ...prevState.items,
                {
                  id: data.id,
                  name: data.attributes.name,
                  quantity: data.attributes.quantity,
                  uom: data.attributes.uom
                }
              ],
              name: '',
              quantity: '',
              uom: ''
            }))
            loadTasks.loadbatch(this.state.batch_id)
          } else {
            data = null
          }
        })
    } catch (error) {
      console.error('Error while saving user', error)
    }
  }

  render() {
    let material_dropdown = ItemStore.slice()
    let uom_dropdown = this.state.uom_dropdown
    let materials = this.state.items
    let handleChange = this.handleChange
    let handleDelete = this.handleDelete
    return (
      <div className="ba b--light-gray ml4 mr4 mt4">
        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Material Name</label>
            <Select
              name="name"
              options={material_dropdown}
              onChange={e => this.handleChangeSelect('name', e)}
              value={this.state.name}
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
                  <td className="tl pv2 ph3">{x.name}</td>
                  <td className="tl pv2 ph3">{x.quantity}</td>
                  <td className="tl pv2 ph3">{x.uom}</td>
                  <td className="tl pv2 ph3">
                    <i
                      className="material-icons red md-18 pointer dim"
                      onClick={e => handleDelete(x.id)}
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
