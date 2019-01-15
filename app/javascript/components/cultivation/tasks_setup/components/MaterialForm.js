import 'babel-polyfill'

import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'
import { toJS } from 'mobx'
import { groupBy, httpPostOptions } from '../../../utils'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

export default class MaterialForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      catalogue_id: '',
      name: '',
      quantity: '',
      uom: '',
      materials: [],
      items: []
    }
    this.loadProducts(this.state.batch_id)
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

  onSubmitItem = () => {
    if (this.state.product && this.state.product.value) {
      if (
        this.state.materials
          .map(e => e.product_id)
          .includes(this.state.product.value)
      ) {
        // compare if same id existed no need to re-insert to material array
        console.log('Id Existed')
      } else {
        console.log(this.state.product)
        this.setState(previousState => ({
          materials: [
            ...previousState.materials,
            {
              product_name: this.state.product.name,
              product_id: this.state.product.id,
              category: this.state.product.catalogue.category,
              quantity: ''
            }
          ],
          product: { value: '', label: '' }
        }))
      }
    }
  }

  onSave = () => {
    this.props.onSave(this.state.materials)
  }

  onDeleteMaterial = value => {
    this.setState({
      materials: this.state.materials.filter(item => item.product_id !== value)
    })
  }

  setSelectedItems(batch_id, task_id, items) {
    this.setState({
      task_id: task_id,
      batch_id: batch_id,
      materials: items
    })
  }

  handleChangeQuantity = (id, quantity) => {
    let material = this.state.materials.find(e => e.product_id === id)
    material.quantity = quantity
    let tasks = this.state.materials.map(t => {
      return t.product_id === id ? material : t
    })
  }

  render() {
    let materials = this.state.materials
    const { onClose } = this.props

    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={onClose} title="Assign Materials" />
          <div className="ph4 mt3 flex">
            <div className="w-80">
              <Select
                isClearable="true"
                placeholder="Search Product ..."
                options={this.state.defaultProduct}
                onInputChange={handleInputChange}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
            </div>
            <div className="w-20">
              <i
                className="material-icons icon--btn child orange ml3"
                onClick={this.onSubmitItem}
              >
                add
              </i>
            </div>
          </div>
          <div className="flex flex-column flex-auto justify-between">
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
                        {x.product_name}
                      </td>
                      <td className="tl pv2 ph3">{x.category}</td>
                      <td className="tl pv2 ph3" width="10%">
                        <input
                          type="text"
                          name="pin"
                          maxLength="4"
                          size="4"
                          defaultValue={x.quantity}
                          onChange={e =>
                            this.handleChangeQuantity(
                              x.product_id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="tl pv2 ph3">{x.uom}</td>
                      <td className="tl pv2 ph3">
                        <i
                          className="material-icons red md-18 pointer dim"
                          onClick={e => this.onDeleteMaterial(x.product_id)}
                        >
                          delete
                        </i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
