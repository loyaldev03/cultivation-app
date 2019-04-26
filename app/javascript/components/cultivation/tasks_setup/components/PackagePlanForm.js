import React from 'react'
import Select from 'react-select'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { SlidePanelHeader, toast } from '../../../utils'
import { TextInput, NumericInput, FieldError } from '../../../utils/FormHelpers'

class ProductTypeSection extends React.Component {
  state = {
    showNewRow: false,
    packageType: null,
    quantity: ''
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

  onChangePackageType = packageType => {
    this.setState({ packageType })
  }

  onChangeQuantity = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  renderAddNewRow() {
    if (!this.state.showNewRow) {
      return null
    }

    const options = PackageTypes.map(x => ({ value: x, label: x }))
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
              onChange={this.onChangeQuantity}
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
            <span className="ml3 material-icons orange dim md-18 pointer">
              delete
            </span>
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
              {productTypeData.breakdowns.map(x => (
                <tr key={x.id}>
                  <td className="pv1 w-40">{x.package_type}</td>
                  <td className="tc pv1 w-20">
                    <NumericInput value={x.quantity} />
                  </td>
                  <td className="tr pv1 w-20">{x.quantity * x.conversion}</td>
                  <td className="tc pv1">
                    <span className="material-icons orange dim md-18 pointer">
                      delete
                    </span>
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

class PackagePlanForm extends React.Component {
  state = {
    showAddProductType: false,
    productType: null,
    data: []
  }

  onAddPackage = (productType, packageType, quantity, conversion) => {
    // console.log(this.state.data)
    // console.log(productType)

    const { data } = this.state
    const index = data.findIndex(x => x.product_type === productType)
    // const productTypeData = data[index]
    // console.log(productTypeData)

    const item = {
      id: packageType,
      isNew: true,
      package_type: packageType,
      quantity,
      conversion
    }

    // console.log(item)
    data[index].breakdowns.push(item)
    this.setState({ data })
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
    const productType = this.state.productType.value
    const newEntry = {
      id: productType,
      product_type: productType,
      breakdowns: []
    }

    this.setState({
      data: [newEntry, ...this.state.data],
      productType: null,
      showAddProductType: false
    })
  }

  renderBreakdowns(data) {
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
          />
        ))}
      </div>
    )
  }

  renderAddProductType() {
    if (!this.state.showAddProductType) {
      return null
    }

    const options = ProductTypes.map(x => ({ value: x, label: x }))
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
    const { data, showAddProductType } = this.state

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
            Split into packages
            {!this.state.showAddProductType && (
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
        {this.renderBreakdowns(data)}
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
  // 'Capsule/Tablet',
  // 'Concentrate (liquid)',
  // 'Concentrate (liquid each)',
  // 'Concentrate (solid)',
  // 'Concentrate (solid each)',
  // 'Edible',
  // 'Edible (each)',
  // 'Extract (liquid)',
  // 'Extract (liquid-each)',
  // 'Extract (solid)',
  // 'Extract (solid-each)',
  // 'Flower',
  // 'Fresh Cannabis Plant',
  // 'Immature Plant',
  // 'Kief',
  // 'Leaf',
  // 'Liquid',
  // 'Liquid (each)',
  // 'Pre-Roll Flower',
  // 'Pre-Roll Leaf',
  // 'Suppository (each)',
  // 'Tincture',
  // 'Tincture (each)',
  // 'Topical',
  // 'Topical (liquid)',
  // 'Topical (liquid-each)',
  // 'Topical (solid)',
  // 'Topical (solid-each)',
  // 'Vape Oil',
  // 'Vape Oil (each)',
  // 'Wax',
  // 'Other'
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

// const data2 = [
//   {
//     id: 'x1',
//     product_type: 'shake',
//     breakdowns: [
//       {
//         id: '1.1',
//         package_type: 'Lb',
//         quantity: 12,
//         conversion: 2.5,
//       },
//       {
//         id: '1.2',
//         package_type: '0.5 oz',
//         quantity: 2,
//         conversion: 0.5,
//       }
//     ]
//   },
//   {
//     id: 'x2',
//     product_type: 'leaves',
//     breakdowns: [
//       {
//         id: '2.1',
//         package_type: 'Lb',
//         quantity: 4,
//         conversion: 2.5,
//       },
//       {
//         id: '2.2',
//         package_type: '0.5 oz',
//         quantity: 25,
//         conversion: 0.5,
//       }
//     ]
//   }
// ]
