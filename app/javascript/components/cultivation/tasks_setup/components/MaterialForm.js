import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'

import ItemStore from '../stores/ItemStore'

import deleteMaterial from '../actions/deleteMaterial'

import loadTasks from '../actions/loadTask'

import { groupBy } from '../../../utils/ArrayHelper'

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
        items: props.task.attributes.items,
        selectedCategory: '',
        selectedSubCategory: '',
        selectedThirdDropdown: '',
        showThirdDropdown: false
      })
    }
  }

  handleChangeSelect = (key, value) => {
    this.setState({ [key]: value })

    if (key === 'selectedCategory') {
      this.setState({
        selectedSubCategory: '',
        selectedThirdDropdown: '',
        name: value.value
      })
    }
    if (key === 'selectedSubCategory') {
      this.setState({
        selectedThirdDropdown: '',
        name: value.value
      })
    }
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
        name: this.state.name,
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
    let material_2 = ItemStore.slice()

    let category_dropdown = groupBy(material_2, 'category')

    let subcategory_dropdown
    let showThirdDropdown = false
    if (this.state.selectedCategory) {
      subcategory_dropdown =
        category_dropdown[this.state.selectedCategory.value]

      // subcategory_dropdown = groupBy(
      //     category_dropdown[this.state.selectedCategory.value],
      //     'sub_category'
      //   )
      let subcategory_keys = Object.keys(
        groupBy(subcategory_dropdown, 'sub_category')
      )
      if (subcategory_keys.length > 1) {
        subcategory_dropdown = subcategory_keys.map(f => ({
          value: f,
          label: f
        }))
        showThirdDropdown = true
      } else {
        subcategory_dropdown = subcategory_dropdown.map(f => ({
          value: f.name,
          label: f.name
        }))
      }
    }
    let third_dropdown
    if (this.state.selectedSubCategory && showThirdDropdown) {
      console.log(this.state.selectedSubCategory)
      console.log()
      let third_level = groupBy(
        category_dropdown[this.state.selectedCategory.value],
        'sub_category'
      )[this.state.selectedSubCategory.value]
      third_dropdown = third_level.map(f => ({
        value: f.name,
        label: f.name
      }))
    }

    category_dropdown = Object.keys(category_dropdown).map(f => ({
      value: f,
      label: f
    }))

    let uom_dropdown = this.state.uom_dropdown
    let materials = this.state.items
    let handleChange = this.handleChange
    let handleDelete = this.handleDelete
    return (
      <React.Fragment>
        <div className="ba b--light-gray ml4 mr4 mt4">
          <div className="ph4 mt3 flex">
            <div className="w-100">
              {/* {JSON.stringify(subcategory_dropdown['Potassium'])} */}

              {/* {JSON.stringify(this.state.selectedCategory)} */}
              {/* {JSON.stringify(category_dropdown)} */}
              {/* {JSON.stringify(category_dropdown)} */}
              <label className="f6 fw6 db mb1 gray ttc">Material Name</label>
              <Select
                name="selectedCategory"
                options={category_dropdown}
                onChange={e => this.handleChangeSelect('selectedCategory', e)}
                value={this.state.selectedCategory}
              />
            </div>
          </div>
          {subcategory_dropdown &&
            subcategory_dropdown.length > 1 && (
              <div className="ph4 mt3 flex">
                <div className="w-100">
                  <label className="f6 fw6 db mb1 gray ttc">
                    {this.state.selectedCategory.label}
                  </label>
                  <Select
                    name="selectedSubCategory"
                    options={subcategory_dropdown}
                    onChange={e =>
                      this.handleChangeSelect('selectedSubCategory', e)
                    }
                    value={this.state.selectedSubCategory}
                  />
                </div>
              </div>
            )}
          {third_dropdown && (
            <div className="ph4 mt3 flex">
              <div className="w-100">
                <label className="f6 fw6 db mb1 gray ttc">
                  {this.state.selectedSubCategory.label}
                </label>
                <Select
                  name="selectedThirdDropdown"
                  options={third_dropdown}
                  onChange={e =>
                    this.handleChangeSelect('selectedThirdDropdown', e)
                  }
                  value={this.state.selectedThirdDropdown}
                />
              </div>
            </div>
          )}
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
        </div>
        <div className="mt4 mr4 ml4 f6 fw6 db mb1 gray ttc">
          <table className="w-100">
            <tbody>
              <tr className="">
                <th>Material Name</th>
                <th>Quantity</th>
                <th>Unit of Measurment</th>
                <th />
              </tr>
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
      </React.Fragment>
    )
  }
}
