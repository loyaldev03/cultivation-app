import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import reactSelectStyle from '../../../utils/reactSelectStyle'
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
import getHarvestPackage from '../../../inventory/sales_products/actions/getHarvestPackage'

class ConvertPackagePlanForm extends React.Component {
  state = {
    showAddProductType: false,
    showing: false,
    productPackage: null,
    data: [],
    assign_to: null,
    start_date: new Date()
  }

  async componentDidUpdate(prevProps, prevState) {
    if (!prevProps.show && this.props.show) {
      const packageResponse = await getHarvestPackage(this.props.packageId)
      const result = await loadPackagePlans(this.props.packageId)

      // Group plans for package type by its product type
      const packagePlans = result.product_plans.reduce((sum, item) => {
        const index = sum.findIndex(x => x.product_type == item.product_type)
        let t = null
        if (index < 0) {
          t = { product_type: item.product_type, package_plans: [] }
          t.package_plans.push(item)
          sum.push(t)
        } else {
          t = sum[index]
          t.package_plans.push(item)
          sum[index] = t
        }
        return sum
      }, [])

      if (packageResponse.status === 200) {
        let assign_to = null,
          start_date = null
        if (result.task) {
          const user = this.props.users.find(
            x => x.id === result.task.assign_to
          )
          if (user) {
            assign_to = { value: user.id, label: user.name }
          }

          // console.log(result.task.start_date)
          if (result.task.start_date) {
            start_date = new Date(result.task.start_date)
            // console.log(start_date)
          }
        }

        this.setState({
          productPackage: {
            id: packageResponse.data.data.id,
            ...packageResponse.data.data.attributes
          },
          data: packagePlans,
          assign_to,
          start_date
        })
      }
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
    const product_type = this.state.productType.label

    this.setState({
      data: [...this.state.data, { product_type, package_plans: [] }],
      productType: null,
      showAddProductType: false
    })
  }

  onAddPackage = (productType, packageType, quantity, converted_qty, uom) => {
    // console.log(productType, packageType, quantity, converted_qty)
    const { data } = this.state
    const index = data.findIndex(x => x.product_type === productType)

    const item = {
      id: packageType,
      isNew: true,
      package_type: packageType,
      quantity: parseFloat(quantity),
      uom: uom,
      converted_qty
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

  onSelectUser = assign_to => {
    this.setState({ assign_to })
  }

  onChangeStartDate = start_date => {
    this.setState({ start_date })
  }

  onSave = event => {
    event.preventDefault()
    const { data, assign_to, start_date } = this.state
    const assign_to_value = assign_to ? assign_to.value : null
    saveConvertPackagePlans(
      this.props.packageId,
      data,
      assign_to_value,
      start_date
    ).then(result => {
      if (result.length > 0) {
        this.props.onSave({
          toast: { message: 'Package plan created.', type: 'success' },
          hideSidebar: true
        })
      } else {
        this.props.onSave({
          toast: { message: 'Failed to create package plan.', type: 'error' }
        })
      }
    })
  }

  renderBreakdowns() {
    const { data, productPackage } = this.state
    if (data.length == 0) {
      return null
    }

    return (
      <div className="mt4">
        {data.map(x => (
          <ProductTypeSection
            productTypeData={x}
            key={x.product_type}
            harvestBatchUom={productPackage.uom}
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
    const options = this.props.sales_catalogue.filter(
      x => selectedProductTypes.indexOf(x.label) < 0
    )

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

  totalPlannedWeight = () => {
    return this.state.data.reduce((sum, x) => {
      return (
        sum +
        x.package_plans.reduce((innerSum, y) => {
          const converted_qty = convertToHarvestBatchUom(
            y.package_type,
            y.quantity,
            this.state.productPackage.uom
          )
          return innerSum + converted_qty
        }, 0)
      )
    }, 0)
  }

  render() {
    const { onClose } = this.props
    const assignees = this.props.users.map(x => ({
      value: x.id,
      label: x.name
    }))

    const {
      showAddProductType,
      productPackage,
      assign_to,
      start_date
    } = this.state

    // console.log(start_date)

    const totalQty = productPackage ? productPackage.quantity : 0
    const uom = productPackage ? productPackage.uom : ''
    const productName = productPackage ? productPackage.catalogue.label : ''
    const packageTag = productPackage ? productPackage.package_tag : ''

    return (
      <div>
        <SlidePanelHeader onClose={onClose} title="Create Package Plan" />
        <div className="mh4 mt3 pb3 flex bb b--black-10">
          <div className="w-60 f5 fw6">
            {productPackage && productPackage.catalogue.label}
          </div>
          <div className="w-40 tr fw4 f5">
            {this.totalPlannedWeight().toFixed(2)} / {totalQty} {uom} allocated
          </div>
        </div>
        <div className="mh4 pb3 pt3 flex bb b--black-10">
          <div className="w-50 f6 gray flex flex-column">
            <label className="fw6 mb1">Convert from</label>
            {productName} {uom}
          </div>
          <div className="w-50 f6 gray flex flex-column tr">
            <label className="fw6 mb1">Package ID</label>
            {packageTag}
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-100 f6">
            Split into packages
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

        <div className="mt3 ph4 pt3 flex flex-column bt b--black-10">
          <label className="f6 fw6 db mb1 gray ttc">Assign to</label>
          <Select
            key={this.props.packageId}
            options={assignees}
            isClearable={true}
            onChange={this.onSelectUser}
            value={assign_to}
            className="mt1 w-100 f6"
          />
        </div>
        <div className="mt3 ph4 mb4 flex flex-column">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Start At</label>
            <DatePicker value={start_date} onChange={this.onChangeStartDate} />
          </div>
        </div>

        <SlidePanelFooter onSave={this.onSave} />
      </div>
    )
  }
}

export default ConvertPackagePlanForm

const ProductTypes = [
  'Whole plant',
  'Flowers (buds)',
  'Kief',
  'Shakes',
  'Trims',
  'Pre-rolls'
]

const loadPackagePlans = async packageId => {
  const url = `/api/v1/sales_products/${packageId}/product_plans`
  const response = await (await fetch(url, httpGetOptions)).json()
  // console.log(response)
  return response
}

const saveConvertPackagePlans = async (
  packageId,
  productPlans,
  assign_to,
  start_date
) => {
  const url = `/api/v1/sales_products/${packageId}/save_product_plans`
  const response = await (await fetch(
    url,
    httpPostOptions({
      product_plans: productPlans,
      assign_to,
      start_date
    })
  )).json()
  try {
    return response
  } catch (error) {
    console.error(error)
    return []
  }
}
