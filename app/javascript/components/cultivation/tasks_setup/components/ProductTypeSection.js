import React from 'react'
import Select from 'react-select'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { NumericInput } from '../../../utils/FormHelpers'

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
      this.state.packageType.conversion
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
      x => selectedPackageTypes.indexOf(x.value) < 0
    )

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
                    {(x.quantity * x.conversion).toFixed(4)}
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

const PackageTypes = [
  { value: '1/2 gram', label: '1/2 gram', conversion: 0.0005 },
  { value: '1/2 kg', label: '1/2 kg', conversion: 0.5 },
  { value: '1/4 Lb', label: '1/4 Lb', conversion: 0.1133981 },
  { value: '1/4 Oz', label: '1/4 Oz', conversion: 0.0035436904 },
  { value: 'Eigth', label: 'Eigth', conversion: 0.0035436904 },
  { value: 'Gram', label: 'Gram', conversion: 0.001 },
  { value: '1/2 Oz', label: '1/2 Oz', conversion: 0.0141748 },
  { value: 'Lb', label: 'Lb', conversion: 0.453592 },
  { value: 'Ounce', label: 'Ounce', conversion: 0.0283495 }
]

export default ProductTypeSection
