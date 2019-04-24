import React from 'react'
import Select from 'react-select'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import {
  SlidePanelHeader,
  toast
} from '../../../utils'
import { TextInput, NumericInput, FieldError } from '../../../utils/FormHelpers'


class ProductTypeSection extends React.Component {
  state = {
    showNewRow: false
  }

  onShowNewRow = event => {
    event.preventDefault()
    this.setState({ showNewRow: !this.state.showNewRow })
  }

  onAddRow = () => {
    const quantity = 0
    this.props.onAddPackage(this.props.productType, 'package type here', quantity)
  }

  renderAddNewRow() {
    if (!this.state.showNewRow) {
      return null
    }

    const options = PackageTypes.map(x => ({ value: x, label: x }))
    return (
      <div className="ph4 mt2 flex items-center">
        <div className="w-40 pr2">
          <Select options={options} styles={reactSelectStyle}/>
        </div>
        <div className="w-20">
          <NumericInput />
        </div>
        <div className="w-20 pl2">
          <a href="#" className="btn btn--primary btn--small" onClick={this.onAddProductType}>Save</a>
        </div>
        <div className="w-20 pl1 tc">
          <a href="#" className="f6 orange link">Cancel</a>
        </div>
      </div>
    )
  }

  render() {
    const { productType } = this.props
    return (
      <React.Fragment>
        <div className="ph4 mt3 flex">
          <div className="w-100 fw6 f5 ph1 ttc">
            {productType.product_type}
            <span className="ml3">X</span>
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <table className="w-100 f6">
            <thead>
              <tr>
                <th className="tl bb b--black-10 pb2 gray">Package type</th>
                <th className="tc bb b--black-10 pb2 gray">Quantity</th>
                <th className="tr bb b--black-10 pb2 gray">Total</th>
                <th className="tr bb b--black-10 pb2 gray"></th>
              </tr>
            </thead>
            <tbody>
              { productType.breakdowns.map(x => (
                <tr key={x.id}>
                  <td className="pv1 w-40">{x.package_type}</td>
                  <td className="tc pv1 w-20">
                    <NumericInput value={x.quantity} />
                  </td>
                  <td className="tr pv1 w-20">{x.quantity * x.conversion}</td>
                  <td className="tc pv1 w-20">X</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        { this.state.showNewRow && this.renderAddNewRow() }
        {
          !this.state.showNewRow && (
          <div className="ph4 mt3 flex">
            <a href="#" className="orange tc f6 w-100" onClick={this.onShowNewRow}>
              + Add more package
            </a>
          </div>
          )
        }
        
      </React.Fragment>
    )
  }
}


class PackagePlanForm extends React.Component {

  state = {
    showAddProductType: false,
    data: []
  }

  onShowAddProductType = event => {
    event.preventDefault()
    this.setState({ showAddProductType: !this.state.showAddProductType })
  }

  onAddProductType = event => {
    event.preventDefault()
    const newProductType = {
      id: 'x1',
      product_type: 'shake',
      breakdowns: [
        {
          id: '1.1',
          package_type: 'Lb',
          quantity: 12,
          conversion: 2.5,
        },
        {
          id: '1.2',
          package_type: '0.5 oz',
          quantity: 2,
          conversion: 0.5,
        }
      ]
    }

    this.setState({
      data: [newProductType, ...this.state.data]
    })
  }

  renderBreakdowns(data) {
    if (data.length == 0) {
      return null
    }

    return (
      <div className="mt4">
        { data.map(productType => <ProductTypeSection productType={productType} key={productType.id} />)}
      </div>
    )
  }


  renderAddProductType() {
    if (!this.state.showAddProductType) {
      return null
    }

    const options = PackageTypes.map(x => ({ value: x, label: x }))
    return (
      <div className="ph4 mv3 flex">
        <div className="w-80">
          <Select options={options} styles={reactSelectStyle}/>
        </div>
        <div className="w-20 pl3">
          <a href="#" className="btn btn--primary btn--small" onClick={this.onAddProductType}>Save</a>
        </div>
      </div>
    )
  }

  render() {

    const { onClose } = this.props
    const { data } = this.state
 
    return (
      <div>
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader onClose={onClose} title="Create Package Plan" />
        <div className="ph4 mv3 flex">
          <div className="w-70 f4 fw6">
            Batch 45V
          </div>
          <div className="w-30 tr f6">
            0 / 30kg allocated
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-100 f6">
            Split into packages
            <a href="#" className="ml3 link orange" onClick={this.onShowAddProductType}>
              Add product type
            </a>
          </div>
        </div>

        { this.renderAddProductType() }
        { this.renderBreakdowns(data) }

        
      </div>
    )
  }
}

export default PackagePlanForm


const ProductTypes = [
  'Capsule/Tablet',
  'Concentrate (liquid)',
  'Concentrate (liquid each)',
  'Concentrate (solid)',
  'Concentrate (solid each)',
  'Edible',
  'Edible (each)',
  'Extract (liquid)',
  'Extract (liquid-each)',
  'Extract (solid)',
  'Extract (solid-each)',
  'Flower',
  'Fresh Cannabis Plant',
  'Immature Plant',
  'Kief',
  'Leaf',
  'Liquid',
  'Liquid (each)',
  'Pre-Roll Flower',
  'Pre-Roll Leaf',
  'Suppository (each)',
  'Tincture',
  'Tincture (each)',
  'Topical',
  'Topical (liquid)',
  'Topical (liquid-each)',
  'Topical (solid)',
  'Topical (solid-each)',
  'Vape Oil',
  'Vape Oil (each)',
  'Wax',
  'Other'
]

const PackageTypes = [
  '1/4 oz',
  '1/8 oz',
  'Assorted Box',
  'Case ',
  'Catridge',
  'Gram',
  'Half gr.',
  'Kg',
  'Ounce',
  'Pound',
  'Quarter Lb',
  'Sumpin',
  'Unit'
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
