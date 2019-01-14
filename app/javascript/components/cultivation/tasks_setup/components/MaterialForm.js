import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'

import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'

import ItemStore from '../stores/ItemStore'

import deleteMaterial from '../actions/deleteMaterial'

import TaskStore from '../stores/NewTaskStore'
import { groupBy, httpPostOptions } from '../../../utils'

import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import reactSelectStyle from '../../../utils/reactSelectStyle'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

export default class MaterialForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      task_id: props.task.id,
      ...props.task,
      catalogue_id: '',
      name: '',
      quantity: '',
      uom: '',
      materials: [],
      items: props.task.items
    }
    this.loadProducts(this.state.batch_id)
  }

  componentWillReceiveProps(props) {
    const { task } = this.props
    if (props.task !== task) {
      this.setState({
        batch_id: this.props.batch_id,
        task_id: props.task.id,
        ...props.task,
        name: '',
        quantity: '',
        uom: '',
        materials: [],
        items: props.task.items,
        selectedCategory: '',
        selectedSubCategory: '',
        selectedThirdDropdown: '',
        showThirdDropdown: false
      })
    }
  }

  handleChangeSelect = (key, value) => {
    this.setState({ [key]: value })
    let raw_material = ItemStore.slice().find(e => e.name === value.value)

    if (key === 'selectedCategory') {
      this.setState({
        selectedSubCategory: '',
        selectedThirdDropdown: '',
        name: value.value,
        catalogue_id: raw_material ? raw_material.id : null
      })
    }
    if (key === 'selectedSubCategory') {
      this.setState({
        selectedThirdDropdown: '',
        name: value.value,
        catalogue_id: raw_material ? raw_material.id : null
      })
    }
    if (key === 'selectedThirdDropdown') {
      this.setState({
        name: value.value,
        catalogue_id: raw_material ? raw_material.id : null
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

  sendApiCreate = async e => {
    let url = `/api/v1/items?task_id=${this.state.task_id}`
    let data

    fetch(
      url,
      httpPostOptions({
        catalogue_id: this.state.catalogue_id,
        quantity: this.state.quantity,
        uom: this.state.uom.value
      })
    )
      .then(response => response.json())
      .then(data => {
        if (data.data.id != null) {
          data = data.data
          this.setState(prevState => ({
            items: [
              ...prevState.items,
              {
                id: data.id,
                name: data.name,
                quantity: data.quantity,
                uom: data.uom
              }
            ],
            name: '',
            quantity: '',
            uom: ''
          }))
          TaskStore.loadTasks(this.state.batch_id)
        } else {
          data = null
        }
      })
  }

  loadProducts = batch_id => {
    return fetch(`/api/v1/products?batch_id=${batch_id}`, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        const products = data.data.map(x => ({
          label: x.attributes.name,
          value: x.attributes.id,
          ...x.attributes
        }))
        this.setState({ defaultProduct: products })
        return products
      })
  }

  onChangeProduct = product => {
    if (product) {
      this.setState({
        product: { value: product.id, label: product.name, ...product }
      })
    }
  }

  onSave = () => {
    if (this.state.product && this.state.product.value) {
      if (
        this.state.materials
          .map(e => e.value)
          .includes(this.state.product.value)
      ) {
        // compare if same id existed no need to re-insert to material array
        console.log('Id Existed')
      } else {
        this.setState(previousState => ({
          materials: [...previousState.materials, this.state.product],
          product: { value: '', label: '' }
        }))
      }
    }
  }

  onDeleteMaterial = value => {
    this.setState({
      materials: this.state.materials.filter(item => item.value !== value)
    })
  }

  render() {
    let material_2 = ItemStore.slice()

    let category_dropdown = groupBy(material_2, 'category')

    let subcategory_dropdown
    let showThirdDropdown = false
    if (this.state.selectedCategory) {
      subcategory_dropdown =
        category_dropdown[this.state.selectedCategory.value]
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
      label: f.replace(/_/g, ' ')
    }))
    let catalogue = ItemStore.slice().find(
      e => e.id === this.state.catalogue_id
    )
    let uom_dropdown = catalogue ? catalogue.uoms : [{ label: '', value: '' }]
    let materials = this.state.materials
    let handleChange = this.handleChange
    let handleDelete = this.handleDelete

    return (
      <React.Fragment>
        <div className="">
          {/* <div className="ph4 mt3 flex">
            <div className="w-100 ttc">
              <label className="f6 fw6 db mb1 gray ttc">Material Name</label>
              <Select
                name="selectedCategory"
                options={category_dropdown}
                onChange={e => this.handleChangeSelect('selectedCategory', e)}
                value={this.state.selectedCategory}
              />
            </div>
          </div>
          {subcategory_dropdown && subcategory_dropdown.length > 1 && (
            <div className="ph4 mt3 flex">
              <div className="w-100 ttc">
                <label className="f6 fw6 db mb1 gray ttc">
                  Please select {this.state.selectedCategory.label} Type
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
              <div className="w-100 ttc">
                <label className="f6 fw6 db mb1 gray ttc">
                  Please select {this.state.selectedSubCategory.label} Product
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
          )} */}

          <div className="ph4 mt3 flex">
            <div className="w-80">
              <Select
                isClearable
                placeholder={'Search Product ...'}
                options={this.state.defaultProduct}
                onInputChange={handleInputChange}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
              {/* <FieldError errors={this.state.errors} field="product" /> */}
            </div>
            <div className="w-20">
              <i
                className="material-icons icon--btn child orange ml3"
                onClick={this.onSave}
              >
                add
              </i>
            </div>
          </div>
          {/* <div className="ph4 mt3 flex">
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
            <div className="w-100 ttc">
              <label className="f6 fw6 db mb1 gray ttc">Unit Of Measure</label>
              <Select
                name="uom"
                options={uom_dropdown}
                onChange={e => this.handleChangeSelect('uom', e)}
                value={this.state.uom}
              />
            </div>
          </div> */}
          {/* <div className="pv2 w4">
            <input
              type="submit"
              className="pv2 ph3 ml4 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
              value="Add Material"
              onClick={this.handleSubmit}
            />
          </div> */}
        </div>
        <div className="ph4 mt3 flex f6 fw6 db mb1 gray ttc">
          <table className="w-100">
            <tbody>
              <tr className="bb">
                <th align="left" width="90%">
                  Product Name
                </th>
                <th>Category</th>
                <th width="10%">Qty</th>
                <th>UOM</th>
                <th />
              </tr>
              {materials.map((x, index) => (
                <tr className="pointer bb" key={index}>
                  <td className="tl pv2 ph3" width="90%" align="left">
                    {x.name}
                  </td>
                  <td className="tl pv2 ph3">{x.catalogue.category}</td>
                  <td className="tl pv2 ph3" width="10%">
                    {/* <input type="text" class="flex-auto b--grey link" value="" maxlength="5" size="5"></input> */}
                    <input type="text" name="pin" maxLength="4" size="4" />
                  </td>
                  <td className="tl pv2 ph3">{x.uom}</td>
                  <td className="tl pv2 ph3">
                    <i
                      className="material-icons red md-18 pointer dim"
                      onClick={e => this.onDeleteMaterial(x.value)}
                    >
                      delete
                    </i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt3 tr mr3">
          <input
            type="submit"
            className="pv2 ph3 ml4 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
            value="Save"
            // onClick={this.handleSubmit}
          />
        </div>
        {/* <div class="w-100 pa4 bt b--light-grey absolute right-0 bottom-0 flex items-center justify-between">
          <button
            name="commit"
            type="submit"
            value="continue"
            class="pv2 ph3 ml4 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
          >
            Save
          </button>
        </div> */}
    </React.Fragment>
    )
  }
}
