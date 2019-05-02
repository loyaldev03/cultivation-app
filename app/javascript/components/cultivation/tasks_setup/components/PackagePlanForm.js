import React from 'react'
import Select from 'react-select'
import { observable, toJS } from 'mobx'
import { observer } from 'mobx-react'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { SlidePanelHeader, SlidePanelFooter, toast, httpPostOptions } from '../../../utils'
import { httpGetOptions } from '../../../utils/FormHelpers'
import { TextInput, NumericInput, FieldError } from '../../../utils/FormHelpers'

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
        <div className="ph4 mv3 flex"></div>
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

const PackageTypes = [
  '1/2 gram',
  '1/2 kg',
  '1/4 Lb',
  '1/4 Oz',
  'Eigth',
  'Gram',
  '1/2 Oz',
  'Lb',
  'Ounce'
]

class ProductTypeSection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      showNewRow: false,
      packageType: null,
      quantity: ''
    }
  }

  onShowNewRow = event => {
    event.preventDefault()
    this.setState({ showNewRow: !this.state.showNewRow })
  }

  onHideNewRow = event => {
    event.preventDefault()
    this.setState({
      showNewRow: false,
      packageType: null,
      quantity: ''
    })
  }

  onAddRow = event => {
    event.preventDefault()

    this.props.onAddPackage(
      this.props.productTypeData.product_type,
      this.state.packageType.value,
      this.state.quantity,
      1
    )

    this.setState({
      showNewRow: false,
      packageType: null,
      quantity: ''
    })
  }

  onRemoveRow = (event, package_type) => {
    event.preventDefault()
    this.props.onRemovePackage(
      this.props.productTypeData.product_type,
      package_type
    )
  }

  onChangePackageType = packageType => {
    this.setState({ packageType })
  }

  onChangeNewQuantity = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onRemoveProductType = event => {
    event.preventDefault()
    this.props.onRemoveProductType(this.props.productTypeData.product_type)
  }

  renderAddNewRow() {
    if (!this.state.showNewRow) {
      return null
    }

    const selectedPackageTypes = this.props.productTypeData.package_plans.map(
      x => x.package_type
    )
    const options = PackageTypes.filter(
      x => selectedPackageTypes.indexOf(x) < 0
    ).map(x => ({ value: x, label: x }))

    return (
      <div className="ph4 mt2 flex items-center">
        <div className="w-100 pa2 bg-black-05 flex items-center">
          <div className="w-40 pr2">
            <Select
              options={options}
              styles={reactSelectStyle}
              value={this.state.packageType}
              onChange={this.onChangePackageType}
            />
          </div>
          <div className="w-20">
            <NumericInput
              value={this.state.quantity}
              onChange={this.onChangeNewQuantity}
              fieldname="quantity"
            />
          </div>
          <div className="w-20 pl2">
            <a
              href="#"
              className="btn btn--primary btn--small"
              onClick={this.onAddRow}
            >
              Save
            </a>
          </div>
          <div className="w-20 pl1 tc">
            <a href="#" className="f6 orange link" onClick={this.onHideNewRow}>
              Cancel
            </a>
          </div>
        </div>
      </div>
    )
  }

  render() {
    const { productTypeData } = this.props
    return (
      <div className="mb4">
        <div className="ph4 mt3 flex">
          <div className="w-100 fw6 f5 ph1 ttc flex items-center">
            {productTypeData.product_type}
            <a href="#" onClick={this.onRemoveProductType}>
              <span className="ml3 material-icons orange dim md-18 pointer">
                delete
              </span>
            </a>
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <table className="w-100 f6">
            <thead>
              <tr>
                <th className="tl bb b--black-10 pb2 gray w-40">
                  Package type
                </th>
                <th className="tc bb b--black-10 pb2 gray w-20">Quantity</th>
                <th className="tr bb b--black-10 pb2 gray w-20">Total</th>
                <th className="tr bb b--white pb2" />
              </tr>
            </thead>
            <tbody>
              {productTypeData.package_plans.map(x => (
                <tr key={x.package_type}>
                  <td className="pv1 w-40">{x.package_type}</td>
                  <td className="tc pv1 w-20">
                    <NumericInput
                      value={x.quantity}
                      onChange={event => {
                        this.props.onEditPackage(
                          event.target.value,
                          productTypeData.product_type,
                          x.package_type
                        )
                      }}
                      fieldname="quantity"
                    />
                  </td>
                  <td className="tr pv1 w-20">
                    {(x.quantity * x.conversion).toFixed(2)}
                  </td>
                  <td className="tc pv1">
                    <a
                      href="#"
                      onClick={event => this.onRemoveRow(event, x.package_type)}
                    >
                      <span className="material-icons orange dim md-18 pointer">
                        delete
                      </span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {this.state.showNewRow && this.renderAddNewRow()}
        {!this.state.showNewRow && (
          <div className="ph4 mt2 flex">
            <a
              href="#"
              className="orange tc f6 w-100 link"
              onClick={this.onShowNewRow}
            >
              + Add more package
            </a>
          </div>
        )}
      </div>
    )
  }
}

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
  const response = await (await fetch(url, httpPostOptions({ product_plans: productPlans }))).json()
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