import React from 'react'
import AsyncSelect from 'react-select/lib/Async'
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
    this.loadProducts('')
  }

  loadProducts = async inputValue => {
    let url
    if (
      this.state.task &&
      this.state.task.indelible &&
      this.state.task.indelible === 'add_nutrient'
    ) {
      url = `/api/v1/products?type=raw_materials&category=nutrients&facility_id=${facility_id}`
    } else {
      url = `/api/v1/products?facility_id=${
        this.state.facility_id
      }&filter=${inputValue}`
    }
    let response = await (await fetch(url, httpGetOptions)).json()
    const products = response.data.map(x => ({
      label: x.attributes.name,
      value: x.attributes.id,
      ...x.attributes
    }))
    this.setState({ defaultProduct: products })

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

  handleInputChange = newValue => {
    return newValue ? newValue : ''
  }

  render() {
    const { onClose } = this.props
    const { nutrients, materials, task } = this.state
    const showNutrient =
      materials && materials.length > 0 && task.indelible === 'add_nutrient'
    const title =
      task && task.indelible === 'add_nutrient'
        ? `Add Nutrient ${task.name == 'Add nutrients' ? '' : '. ' + task.name}`
        : 'Assign Materials'
    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={onClose} title={title} />
          <div className="ph4 mt3 flex items-center">
            <div className="w-100">
              <AsyncSelect
                placeholder="Search Product ..."
                isClearable="true"
                cacheOptions
                loadOptions={e => this.loadProducts(e, '')}
                defaultOptions={this.state.defaultProduct}
                onInputChange={this.handleInputChange}
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
                    <tr className="pointer bb hide-child" key={index}>
                      <td className="tl w5">{x.product_name}</td>
                      <td className="tr w3 tc">{x.ppm}</td>
                      <td className="tl w3 grey tc">
                        <input
                          type="number"
                          name="pin"
                          className="input w3 tr tc"
                          value={x.quantity}
                          onChange={e =>
                            this.handleChangeQuantity(
                              x.product_id,
                              e.target.value
                            )
                          }
                          style={{ height: 30 + 'px' }}
                        />
                      </td>
                      <td className="tc w3 grey tc">
                        <select
                          value={x.uom}
                          onChange={e =>
                            this.handleChangeUom(x.product_id, e.target.value)
                          }
                          style={{ minWidth: 60 + 'px' }}
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
                          className="material-icons gray md-18 pointer dim child"
                          onClick={e => this.onDeleteMaterial(x.product_id)}
                        >
                          delete_outline
                        </i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {task && task.indelible === 'add_nutrient' && (
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
              )}
            </div>
            <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
