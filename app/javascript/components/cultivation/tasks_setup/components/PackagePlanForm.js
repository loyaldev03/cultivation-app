import React from 'react'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  toast,
  httpPostOptions
} from '../../../utils'
import { httpGetOptions } from '../../../utils/FormHelpers'
import ProductTypeSection, {
  convertToHarvestBatchUom
} from './ProductTypeSection'
import loadHarvestBatch from '../actions/loadHarvestBatch'
import ItemCategorySelector from './ItemCategorySelector'
import { toJS } from 'mobx'
class PackagePlanForm extends React.Component {
  state = {
    showAddProductType: false,
    productType: null,
    data: [],
    showing: false,
    harvestBatch: { harvest_name: '', uom: '', total_cure_weight: 0 }
  }

  async componentDidUpdate(prevProps, prevState) {
    if (!prevProps.show && this.props.show) {
      const data = await loadPackagePlans(this.props.batchId)
      const hbResponse = await loadHarvestBatch(this.props.batchId)
      let harvestBatch = { harvest_name: '', uom: 'lb', total_cure_weight: 0 }
      if (hbResponse.status === 200 && hbResponse.data.data) {
        const {
          harvest_name,
          uom,
          total_cure_weight
        } = hbResponse.data.data.attributes
        harvestBatch = { harvest_name, uom, total_cure_weight }
      }
      this.setState({ data, harvestBatch })
    }
  }

  onPickProductType = (productType, quantityType) => {
    this.setState({ productType, quantityType })
  }

  onShowAddProductType = event => {
    this.setState({ showAddProductType: !this.state.showAddProductType })
  }

  onCancelAddProductType = event => {
    this.setState({
      productType: '',
      showAddProductType: !this.state.showAddProductType
    })
  }

  onAddProductType = event => {
    if (this.state.productType) {
      const product_type = this.state.productType.value
      const quantity_type = this.state.quantityType
      const sub_categories = this.state.productType.sub_categories
      this.setState({
        data: [
          ...this.state.data,
          {
            product_type,
            quantity_type,
            id: product_type,
            package_plans: [],
            sub_categories: sub_categories
          }
        ],
        productType: '',
        quantityType: '',
        showAddProductType: false
      })
    }
  }

  onAddPackage = (
    productType,
    packageType,
    quantity,
    converted_qty,
    harvest_batch_uom,
    uom,
    quantity_in_uom
  ) => {
    const { data } = this.state
    const harvest_uom = this.state.harvestBatch.uom
    const index = data.findIndex(x => x.product_type === productType)
    const item = {
      id: packageType,
      isNew: true,
      package_type: packageType,
      quantity: parseFloat(quantity),
      uom: harvest_uom,
      conversion: converted_qty,
      uom,
      quantity_in_uom
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
    data[index].package_plans[packageIndex].quantity = Math.floor(quantity)
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
    let { data } = this.state
    data = data.filter(x => x.product_type !== product_type)
    this.setState({ data })
  }

  onSave = event => {
    savePackagePlans(this.props.batchId, this.state.data).then(result => {
      if (result.length > 0) {
        toast('Package plan created.', 'success')
      } else {
        toast('Failed to create package plan.', 'error')
      }
    })
  }

  renderBreakdowns() {
    const { data, harvestBatch } = this.state
    if (data.length == 0) {
      return null
    }

    return (
      <div className="mt4">
        {data.map(productTypeData => (
          <ProductTypeSection
            productTypeData={productTypeData}
            key={productTypeData.id}
            harvestBatchUom={harvestBatch.uom}
            onAddPackage={this.onAddPackage}
            onEditPackage={this.onEditPackage}
            onRemovePackage={this.onRemovePackage}
            onRemoveProductType={this.onRemoveProductType}
            packageTypeOptions={productTypeData.sub_categories}
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

    return (
      <div className="ph4 mt2 flex">
        <div className="w-100 flex bg-black-05 pa3 items-center">
          <div className="w-60">
            <ItemCategorySelector
              ref={select => (this.categorySelector = select)}
              value={this.state.productType}
              excludes={selectedProductTypes}
              onChange={this.onPickProductType}
            />
          </div>
          <div className="w-30 pl3">
            <a
              href="#0"
              className="btn btn--primary btn--small"
              onClick={this.onAddProductType}
            >
              Save
            </a>
          </div>
          <div>
            <a
              href="#0"
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

  totalPlannedWeight = () => {
    const total = this.state.data.reduce((sum, x) => {
      return (
        sum +
        x.package_plans.reduce((innerSum, y) => {
          const converted_qty = convertToHarvestBatchUom(
            y.package_type,
            y.quantity || 0,
            this.state.harvestBatch.uom,
            x.quantity_type,
            y.uom,
            y.quantity_in_uom
          )

          return innerSum + converted_qty
        }, 0)
      )
    }, 0)
    return total.toFixed(2)
  }

  render() {
    const { onClose } = this.props
    const { showAddProductType, harvestBatch } = this.state

    return (
      <div>
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader onClose={onClose} title="Create Package Plan" />
        <div className="ph4 mv3 flex">
          <div className="w-60 f4 fw6">{harvestBatch.harvest_name}</div>
          <div className="w-40 tr fw4 f5">
            {this.totalPlannedWeight()} / {harvestBatch.total_cure_weight}{' '}
            {harvestBatch.uom} allocated
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-100 f6">
            Split into packages
            {!showAddProductType && (
              <a
                href="#0"
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

// TODO: ProductTypes or Item Category
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
    return response.data.map(x => x.attributes)
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
    return response.data
  } else {
    console.error(response.errors)
    return []
  }
}

// When saving new package:
// From packageplans -> lookup product -> if product not exists, create product -> attach new package to the product
