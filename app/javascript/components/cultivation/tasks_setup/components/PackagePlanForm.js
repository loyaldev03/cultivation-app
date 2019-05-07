import React from 'react'
import Select from 'react-select'
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  toast,
  httpPostOptions
} from '../../../utils'
import { httpGetOptions } from '../../../utils/FormHelpers'
import ProductTypeSection from './ProductTypeSection'
// import { TextInput, NumericInput, FieldError } from '../../../utils/FormHelpers'

class PackagePlanForm extends React.Component {
  state = {
    showAddProductType: false,
    productType: null,
    data: [],
    foo: null,
    showing: false
  }

  async componentDidMount() {
    const data = await loadPackagePlans(this.props.batchId)
    this.setState({ data })
  }

  async componentDidUpdate(prevProps, prevState) {
    if (!prevProps.show && this.props.show) {
      const data = await loadPackagePlans(this.props.batchId)
      this.setState({ data })
    }
  }

  onPickProductType = productType => {
    this.setState({ productType })
  }

  onShowAddProductType = event => {
    event.preventDefault()
    this.setState({ showAddProductType: !this.state.showAddProductType })
  }

  onCancelAddProductType = event => {
    event.preventDefault()
    this.setState({
      productType: null,
      showAddProductType: !this.state.showAddProductType
    })
  }

  onAddProductType = event => {
    event.preventDefault()
    const product_type = this.state.productType.value

    this.setState({
      data: [
        ...this.state.data,
        { product_type, id: product_type, package_plans: [] }
      ],
      productType: null,
      showAddProductType: false
    })
  }

  onAddPackage = (productType, packageType, quantity, conversion) => {
    const { data } = this.state
    const index = data.findIndex(x => x.product_type === productType)

    const item = {
      id: packageType,
      isNew: true,
      package_type: packageType,
      quantity,
      conversion
    }

    data[index].package_plans.push(item)
    this.setState({ data })
  }

  onEditPackage = (quantity, product_type, package_type) => {
    const { data } = this.state
    const index = data.findIndex(x => x.product_type === product_type)
    const packageIndex = data[index].package_plans.findIndex(
      x => x.package_type == package_type
    )
    data[index].package_plans[packageIndex].quantity = quantity
    this.setState({ data })
  }

  onRemovePackage = (product_type, package_type) => {
    const { data } = this.state
    const index = data.findIndex(x => x.product_type === product_type)
    data[index].package_plans = data[index].package_plans.filter(
      x => x.package_type !== package_type
    )
    this.setState({ data })
  }

  onRemoveProductType = product_type => {
    const { data } = this.state
    this.setState({ data: data.filter(x => x.product_type !== product_type) })
  }

  onSave = event => {
    event.preventDefault()
    savePackagePlans(this.props.batchId, this.state.data)
  }

  renderBreakdowns() {
    const { data } = this.state
    if (data.length == 0) {
      return null
    }

    return (
      <div className="mt4">
        {data.map(productTypeData => (
          <ProductTypeSection
            productTypeData={productTypeData}
            key={productTypeData.id}
            onAddPackage={this.onAddPackage}
            onEditPackage={this.onEditPackage}
            onRemovePackage={this.onRemovePackage}
            onRemoveProductType={this.onRemoveProductType}
          />
        ))}
      </div>
    )
  }

  renderAddProductType() {
    if (!this.state.showAddProductType) {
      return null
    }

    const selectedProductTypes = this.state.data.map(x => x.product_type)
    const options = ProductTypes.filter(
      x => selectedProductTypes.indexOf(x) < 0
    ).map(x => ({ value: x, label: x }))

    return (
      <div className="ph4 mt2 flex">
        <div className="w-100 flex bg-black-05 pa3 items-center">
          <div className="w-60">
            <Select
              options={options}
              styles={reactSelectStyle}
              value={this.state.productType}
              onChange={this.onPickProductType}
            />
          </div>
          <div className="w-30 pl3">
            <a
              href="#"
              className="btn btn--primary btn--small"
              onClick={this.onAddProductType}
            >
              Save
            </a>
          </div>
          <div>
            <a
              href="#"
              className="f6 orange link"
              onClick={this.onCancelAddProductType}
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { onClose } = this.props
    const { showAddProductType } = this.state

    return (
      <div>
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader onClose={onClose} title="Create Package Plan" />
        <div className="ph4 mv3 flex">
          <div className="w-70 f4 fw6">Batch 45V</div>
          <div className="w-30 tr f6">0 / 30kg allocated</div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-100 f6">
            Split into packages {this.state.foo}
            {!showAddProductType && (
              <a
                href="#"
                className="ml3 link orange"
                onClick={this.onShowAddProductType}
              >
                Add product type
              </a>
            )}
          </div>
        </div>

        {this.renderAddProductType()}
        {this.renderBreakdowns()}
        <div className="ph4 mv3 flex" />
        <SlidePanelFooter onSave={this.onSave} />
      </div>
    )
  }
}

export default PackagePlanForm

const ProductTypes = [
  'Whole plant',
  'Flowers (buds)',
  'Kief',
  'Shakes',
  'Trims',
  'Pre-rolls'
]


const loadPackagePlans = async batchId => {
  const url = `/api/v1/batches/${batchId}/product_plans`
  const response = await (await fetch(url, httpGetOptions)).json()
  if (response.data) {
    console.log(response.data)
    const d = response.data.map(x => x.attributes)
    return d
  } else {
    console.error(response.errors)
    return []
  }
}

const savePackagePlans = async (batchId, productPlans) => {
  const url = `/api/v1/batches/${batchId}/save_product_plans`
  const response = await (await fetch(
    url,
    httpPostOptions({ product_plans: productPlans })
  )).json()
  if (response.data) {
    console.log(response.data)
    // const d = response.data.map(x => x.attributes)
    return response.data
  } else {
    console.error(response.errors)
    return []
  }
}

// When saving new package:
// From packageplans -> lookup product -> if product not exists, create product -> attach new package to the product
