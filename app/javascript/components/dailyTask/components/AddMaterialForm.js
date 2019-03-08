import React from 'react'
import Select from 'react-select'
import { observe } from 'mobx'
import reactSelectStyle from '../../utils/reactSelectStyle'
import { httpGetOptions } from '../../utils/FetchHelper'
import sidebarStore from '../stores/SidebarStore'
import { SlidePanelHeader, SlidePanelFooter } from '../../utils/SlidePanel'

class AddMaterialForm extends React.Component {
  state = {
    availableProducts: [],
    materials: []
  }

  componentDidMount() {
    // on currentTaskId changed
    // sidebarStore.batch_id

    observe(sidebarStore, 'batchId', change => {
      console.group('observe(sidebarStore.batchId)')
      console.log(change)
      console.groupEnd()
      // if (change.newValue) {
      this.loadProducts(sidebarStore.facilityId)
      // }
      //
    })
  }

  loadProducts = async facilityId => {
    let url = `/api/v1/products/non_nutrients?facility_id=${facilityId}`
    let response = await (await fetch(url, httpGetOptions)).json()
    const products = response.data.map(x => ({
      label: x.attributes.name,
      value: x.attributes.id,
      ...x.attributes
    }))

    console.log(products)
    this.setState({ availableProducts: products })
    // return products
  }

  onClose = () => {
    sidebarStore.closeMaterialUsed()
  }

  onChangeProduct = product => {
    this.setState({ product })
  }

  onAddProduct = event => {
    const selectedProducts = [this.state.product, ...this.state.materials]
    const availableProducts = this.state.availableProducts.filter(
      x => selectedProducts.findIndex(p => p.id == x.id) < 0
    )

    this.setState({
      materials: selectedProducts,
      availableProducts,
      product: null
    })
    event.preventDefault()
  }

  onDeleteMaterial = productId => {
    const selectedProducts = this.state.materials.filter(
      x => x.value != productId
    )
    const availableProducts = this.state.availableProducts.filter(
      x => selectedProducts.findIndex(p => p.id == x.id) < 0
    )

    this.setState({
      materials: selectedProducts,
      availableProducts
    })
  }

  onSave = () => {}

  render() {
    const { materials } = this.state

    return (
      <React.Fragment>
        <div className="flex flex-column h-100">
          <SlidePanelHeader onClose={this.onClose} title="Add material" />
          <div className="ph4 mt3 flex items-center">
            <div className="w-90 mr2">
              <Select
                isClearable="true"
                placeholder="Search Product ..."
                options={this.state.availableProducts}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
            </div>
            <div className="w-10">
              <span className="pa3 pointer" onClick={this.onAddProduct}>
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
