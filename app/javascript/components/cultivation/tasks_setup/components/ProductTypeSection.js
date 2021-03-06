import React from 'react'
import Select from 'react-select'
import convert from 'convert-units'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { NumericInput } from '../../../utils/FormHelpers'
import {
  PACKAGE_TYPES_WEIGHT,
  PACKAGE_TYPES_VOLUME,
  PACKAGE_TYPES_COUNT
} from '../../../utils'

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
    if (!this.props.harvestBatchUom) {
      console.warn('Missing harvest batch / uom', this.props.harvestBatchUom)
    }
    const converted_qty = convertToHarvestBatchUom(
      this.state.packageType.value,
      this.state.quantity,
      this.props.harvestBatchUom,
      this.props.productTypeData.quantity_type,
      this.state.packageType.uom,
      this.state.packageType.quantity_in_uom
    )

    this.props.onAddPackage(
      this.props.productTypeData.product_type,
      this.state.packageType.label,
      this.state.quantity,
      converted_qty,
      this.props.harvestBatchUom,
      this.state.packageType.uom,
      this.state.packageType.quantity_in_uom
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

  getOptionsByQuantityType = quantityType => {
    // package type that already added previously
    const selectedPackageTypes = this.props.productTypeData.package_plans.map(
      x => x.package_type
    )
    const packageTypes = getProductTypesByQuantityType(quantityType)
    return packageTypes.filter(x => !selectedPackageTypes.includes(x.value))
  }

  renderAddNewRow() {
    if (!this.state.showNewRow) {
      return null
    }

    const quantityType = this.props.productTypeData.quantity_type
    const unitOptions = this.getOptionsByQuantityType(quantityType)
    const packageTypeOptions = this.props.packageTypeOptions
    return (
      <div className="ph4 mt2 flex items-center">
        <div className="w-100 pa2 bg-black-05 flex items-center">
          <div className="w-40 pr2">
            <Select
              options={packageTypeOptions}
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
    const { productTypeData, harvestBatchUom } = this.props
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
                      min={0}
                      step="1"
                      fieldname="quantity"
                    />
                  </td>
                  <td className="tr pv1 w-20">
                    {convertToHarvestBatchUom(
                      x.package_type,
                      x.quantity,
                      harvestBatchUom,
                      productTypeData.quantity_type,
                      x.uom,
                      x.quantity_in_uom
                    ).toFixed(2)}
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

const getProductTypesByQuantityType = quantityType => {
  if (quantityType === 'CountBased') {
    return PACKAGE_TYPES_COUNT
  } else if (quantityType === 'VolumeBased') {
    return PACKAGE_TYPES_VOLUME
  } else {
    // default to WeightBased
    return PACKAGE_TYPES_WEIGHT
  }
}

const convertToHarvestBatchUom = (
  packageType,
  quantity,
  harvestBatchUom,
  quantityType,
  uom,
  quantity_in_uom
) => {
  if (quantity_in_uom) {
    const total_qty = quantity_in_uom * +quantity
    return total_qty
  } else {
    return 0
  }
}

export default ProductTypeSection
export { convertToHarvestBatchUom }
