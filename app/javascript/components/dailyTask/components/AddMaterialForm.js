import 'babel-polyfill'
import React from 'react'
import AsyncSelect from 'react-select/lib/Async'
import { observe, toJS } from 'mobx'
import reactSelectStyle from '../../utils/reactSelectStyle'
import { httpGetOptions, httpPostOptions } from '../../utils/FetchHelper'
import sidebarStore from '../stores/SidebarStore'
import dailyTaskStore from '../stores/DailyTasksStore'
import { SlidePanelHeader, SlidePanelFooter } from '../../utils/SlidePanel'
import dailyTasksStore from '../stores/DailyTasksStore'

class AddMaterialForm extends React.Component {
  state = {
    materials: [],
    product: null
  }

  componentDidMount() {
    observe(sidebarStore, 'taskId', change => {
      this.setState({ materials: [], product: null })
    })
  }

  loadProducts = async (filter = '') => {
    // console.log('calling loadProducts')
    const facilityId = sidebarStore.facilityId
    let materialIds = this.state.materials.map(x => x.id)
    materialIds = materialIds.concat(toJS(sidebarStore.omitMaterials.slice()))

    const url = `/api/v1/products/non_nutrients?facility_id=${facilityId}&filter=${filter}&exclude=${materialIds.join(
      ','
    )}`
    const response = await (await fetch(url, httpGetOptions)).json()
    const products = response.data.map(x => ({
      label: x.attributes.name,
      value: x.attributes.id,
      ...x.attributes
    }))

    return products
  }

  onClose = () => {
    this.setState({ materials: [], product: null })
    sidebarStore.closeSidebar()
  }

  onChangeProduct = product => {
    this.setState({ product })
  }

  onAddProduct = event => {
    if (!this.state.product) {
      return
    }

    const selectedProducts = [this.state.product, ...this.state.materials]
    this.setState({
      materials: selectedProducts,
      product: null
    })

    event.preventDefault()
  }

  onDeleteMaterial = productId => {
    const selectedProducts = this.state.materials.filter(
      x => x.id !== productId
    )

    this.setState({
      materials: selectedProducts
    })
  }

  onSave = async event => {
    const items = this.state.materials.map(e => ({
      product_id: e.id
    }))

    await dailyTaskStore.appendMaterialUse(
      sidebarStore.batchId,
      sidebarStore.taskId,
      items
    )
    this.setState({ materials: [], product: null })
    sidebarStore.closeSidebar()
  }

  handleInputChange = newValue => {
    const inputValue = newValue.replace(/\W/g, '')
    return inputValue
  }

  loadOptions = inputValue => {
    return this.loadProducts(inputValue)
  }

  render() {
    const { materials } = this.state
    const forceResetProducts = materials
      .map(x => x.id)
      .concat(toJS(sidebarStore.omitMaterials))
      .join('.')

    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={this.onClose} title="Add material" />
          <div className="ph4 mt3 flex items-center">
            <div className="w-100 mr2">
              <AsyncSelect
                key={forceResetProducts}
                isClearable="true"
                placeholder="Search Product ..."
                styles={reactSelectStyle}
                value={this.state.product}
                defaultOptions={true}
                cacheOptions={false}
                loadOptions={this.loadOptions}
                onChange={this.onChangeProduct}
                onInputChange={this.handleInputChange}
              />
            </div>
            <div className="flex flex-none">
              <span className="ph3 pv2 pointer" onClick={this.onAddProduct}>
                <i className="material-icons mid-gray md-18">add</i>
              </span>
            </div>
          </div>

          <div className="flex flex-column flex-auto justify-between">
            <div className="ph4 mt3 f6 fw6 db mb1 gray">
              <table className="w-100 ttc">
                <tbody>
                  <tr className="bb">
                    <th className="tl w-50">Product Name</th>
                    <th className="tl w-50">Category</th>
                    <th>&nbsp;</th>
                  </tr>
                  {materials.map((x, index) => (
                    <tr className="pointer bb" key={index}>
                      <td className="tl w-50 pv2">{x.name}</td>
                      <td className="tl w-50 pv2">{x.catalogue.label}</td>
                      <td className="tr pv2">
                        <i
                          className="material-icons red md-18 pointer dim"
                          onClick={e => this.onDeleteMaterial(x.id)}
                        >
                          delete
                        </i>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <SlidePanelFooter onSave={this.onSave} onCancel={this.onClose} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default AddMaterialForm
