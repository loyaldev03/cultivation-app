import React from 'react'
import Select from 'react-select'
import { selectStyles, NUTRITION_LIST } from '../../../utils'
import NutrientEntryForm from '../../../utils/NutrientEntryForm'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  httpGetOptions
} from '../../../utils'

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
      items: [],
      nutrients: [],
      water_ph: 0
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
      if (this.state.materials.map(e => e.product_id).includes(product.id)) {
        // compare if same id existed no need to re-insert to material array
      } else {
        this.setState(previousState => ({
          materials: [
            ...previousState.materials,
            {
              product_name: product.name,
              product_id: product.id,
              category: product.catalogue.label,
              quantity: '',
              uoms: product.uoms,
              uom: product.uoms[0],
              ppm: product.ppm
            }
          ]
        }))
      }
    }
  }

  onSave = () => {
    this.props.onSave({
      nutrients: this.nutrientForm ? this.nutrientForm.getFormInputs() : null,
      materials: this.state.materials,
      water_ph: this.state.water_ph
    })
  }

  onDeleteMaterial = value => {
    if (confirm('Are you sure you want to delete this relationship? ')) {
      this.setState({
        materials: this.state.materials.filter(
          item => item.product_id !== value
        )
      })
    }
  }

  setSelectedItems(batch_id, task, task_id, items) {
    const existingList = task.add_nutrients || []
    const nutrients = NUTRITION_LIST.map(x => {
      const rec = existingList.find(y => y.element === x.element)
      if (rec) {
        return {
          id: rec.id,
          element: rec.element,
          value: rec.value
        }
      } else {
        return { id: x.id, element: x.element, value: '' }
      }
    })
    this.setState({
      task_id: task_id,
      batch_id: batch_id,
      materials: items,
      task: task,
      nutrients,
      water_ph: task.water_ph
    })
  }

  handleChangeQuantity = (id, quantity) => {
    const material = this.state.materials.find(e => e.product_id === id)
    material.quantity = quantity
    const materials = this.state.materials.map(t => {
      return t.product_id === id ? material : t
    })
    this.setState({ materials: materials })
  }

  handleChangeUom = (id, uom) => {
    const material = this.state.materials.find(e => e.product_id === id)
    material.uom = uom
    const materials = this.state.materials.map(t => {
      return t.product_id === id ? material : t
    })
    this.setState({ materials: materials })
  }

  handleChangePH = ph => {
    this.setState({ water_ph: ph })
  }

  render() {
    const { onClose } = this.props
    const { nutrients, materials, task } = this.state
    console.log(this.state)
    const task_plant = task && task.indelible === 'plants'
    const showNutrient =
      materials && materials.length > 0 && task.indelible === 'add_nutrient'
    const title =
      task && task.indelible === 'add_nutrient'
        ? `Add Nutrient . ${task.name}`
        : 'Assign Materials'
    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={onClose} title={title} />
          <div className="ph4 mt3 flex items-center">
            <div className="w-100">
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
                styles={selectStyles}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
            </div>
          </div>
          <div className="flex flex-column flex-auto justify-between">
            <div className="ph4 mt3 f6 fw6 db mb1 gray">
              <table className="w-100 ttc f6">
                <thead className="">
                  <tr>
                    <th className="bb b--light-grey tl">Product Name</th>
                    <th className="bb b--light-grey">PPM</th>
                    <th className="bb b--light-grey">Amt</th>
                    <th className="bb b--light-grey">UoM</th>
                    <th className="" />
                  </tr>
                </thead>
                <tbody className="lh-copy">
                  {materials.map((x, index) => (
                    <tr className="pointer bb" key={index}>
                      <td className="tl w5">{x.product_name}</td>
                      <td className="tr w3">{x.ppm}</td>
                      <td className="tl w3">
                        <input
                          type="number"
                          name="pin"
                          className="input w3 tr"
                          value={x.quantity}
                          onChange={e =>
                            this.handleChangeQuantity(
                              x.product_id,
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td className="tc w3">
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
                      <td className="tr w1 pt2">
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
              <div className="flex pv3 items-center">
                <i className="material-icons blue pr2">opacity</i>
                <span className="pr2">Water Ph:</span>
                <input
                  type="number"
                  name="pin"
                  value={this.state.water_ph}
                  className="input tr w3"
                  onChange={e => this.handleChangePH(e.target.value)}
                />
              </div>
            </div>
            <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
