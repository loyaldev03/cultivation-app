import 'babel-polyfill'

import React from 'react'
import Select from 'react-select'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  httpGetOptions
} from '../../../utils'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

export default class MaterialForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      facility_id: this.props.facility_id,
      facility_strain_id: this.props.facility_strain_id,
      catalogue_id: '',
      name: '',
      quantity: '',
      uom: '',
      materials: [],
      items: []
    }
    this.loadProducts(
      this.state.batch_id,
      this.state.facility_id,
      this.state.facility_strain_id
    )
  }

  loadProducts = async (batch_id, facility_id, facility_strain_id) => {
    let url = `/api/v1/products?batch_id=${batch_id}`
    let response = await (await fetch(url, httpGetOptions)).json()
    const products = response.data.map(x => ({
      label: x.attributes.name,
      value: x.attributes.id,
      ...x.attributes
    }))
    let plant_products = []
    if (this.props.batch_source === 'clones_purchased') {
      url = `/api/v1/products?type=raw_materials&category=purchased_clone&facility_id=${facility_id}&facility_strain_id=${facility_strain_id}&filter=`
      response = await (await fetch(url, httpGetOptions)).json()
      plant_products = response.data.map(x => ({
        label: x.attributes.name,
        value: x.attributes.id,
        ...x.attributes
      }))
    }
    if (this.props.batch_source === 'seeds') {
      url = `/api/v1/products?type=raw_materials&category=seeds&facility_id=${facility_id}&facility_strain_id=${facility_strain_id}&filter=`
      response = await (await fetch(url, httpGetOptions)).json()
      plant_products = response.data.map(x => ({
        label: x.attributes.name,
        value: x.attributes.id,
        ...x.attributes
      }))
    }

    this.setState({ defaultProduct: products, plantProduct: plant_products })
    return products
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
      } else {
        this.setState(previousState => ({
          materials: [
            ...previousState.materials,
            {
              product_name: this.state.product.name,
              product_id: this.state.product.id,
              category: this.state.product.catalogue.label,
              quantity: '',
              uoms: this.state.product.uoms
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

  setSelectedItems(batch_id, task, task_id, items) {
    this.setState({
      task_id: task_id,
      batch_id: batch_id,
      materials: items,
      task: task
    })
  }

  handleChangeQuantity = (id, quantity) => {
    let material = this.state.materials.find(e => e.product_id === id)
    material.quantity = quantity
    let materials = this.state.materials.map(t => {
      return t.product_id === id ? material : t
    })
    this.setState({ materials: materials })
  }

  handleChangeUom = (id, uom) => {
    let material = this.state.materials.find(e => e.product_id === id)
    material.uom = uom
    let materials = this.state.materials.map(t => {
      return t.product_id === id ? material : t
    })
    this.setState({ materials: materials })
  }

  render() {
    let materials = this.state.materials
    const { onClose } = this.props
    let task_plant = this.state.task && this.state.task.indelible === 'plants'
    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={onClose} title="Assign Materials" />
          <div className="ph4 mt3 flex">
            <div className="w-80">
              <Select
                isClearable="true"
                placeholder={
                  task_plant ? 'Search Strain ...' : 'Search Product ...'
                }
                options={
                  task_plant
                    ? this.state.plantProduct
                    : this.state.defaultProduct
                }
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
                      <td className="tl pv2" width="90%" align="left">
                        {x.product_name}
                      </td>
                      <td className="tl pv2 ph3">{x.category}</td>
                      <td className="tl pv2 ph3" width="10%">
                        <input
                          type="text"
                          name="pin"
                          size="2"
                          style={{ height: 30 + 'px' }}
                          className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                          value={x.quantity}
                          onChange={e =>
                            this.handleChangeQuantity(
                              x.product_id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="tl pv2 ph3">
                        <select
                          value={x.uom}
                          onChange={e =>
                            this.handleChangeUom(x.product_id, e.target.value)
                          }
                        >
                          {x.uoms &&
                            x.uoms.map((y, index) => (
                              <option key={index} value={y}>
                                {y}
                              </option>
                            ))}
                        </select>
                      </td>
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
