import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
// import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import PurchaseInfo from '../../plant_setup/components/shared/PurchaseInfo'

class NutrientEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {})
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  resetState() {
    return {
      id: '',
      uom: { value: 'Bag', label: 'Bag' },
      qty_per_package: '',
      quantity: '',
      errors: {}
    }
  }

  reset() {
    this.setState(this.resetState())
  }

  validateAndGetValues() {
    const { id } = this.state

    let errors = {}

    const isValid = Object.getOwnPropertyNames(errors).length === 0
    if (!isValid) {
      this.setState({ errors })
    }

    return {
      id,
      isValid
    }
  }

  render() {
    const widthStyle = this.props.isOpened
      ? { width: '500px' }
      : { width: '0px' }

    return (
      <div className="rc-slide-panel" data-role="sidebar" style={widthStyle}>
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Nutrient</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <TextInput
                label="Product Name"
                fieldname="name"
                value={this.state.name}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-30">
              <label className="f6 fw6 db mb1 gray ttc">Nutrient Type</label>
              <Select
                options={['Blend', 'Nitrogen', 'Phosphate', 'Potassium'].map(
                  x => ({ value: x, label: x })
                )}
                styles={reactSelectStyle}
              />
            </div>
            <div className="w-70 pl3">
              <label className="f6 fw6 db mb1 gray ttc">
                Nitrogen Products
              </label>
              <Select
                options={[
                  'Ammonia (NH3)',
                  'Blood Meal',
                  'Cottonseed Meal',
                  'Fish Emulsion',
                  'Urea'
                ].map(x => ({ value: x, label: x }))}
                styles={reactSelectStyle}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <TextInput label="Manufacturer" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Description</label>
              <textarea className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mb3 mt3 flex">
            <div className="w-30">
              <NumericInput
                label="Quantity"
                fieldname="quantity"
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <Select
                value={this.state.uom}
                options={['Bag', 'Box', 'Pack', 'Pc', 'Unit'].map(x => ({
                  value: x,
                  label: x
                }))}
                styles={reactSelectStyle}
                onChange={x => this.setState({ uom: x })}
              />
            </div>
            <div className="w-50 pl3">
              <NumericInput
                label={`Price per ${this.state.uom &&
                  this.state.uom.label} before tax`}
                fieldname="price_per_package"
                onChange={this.onChangeGeneric}
              />

              {this.state.price_per_package &&
                this.state.quantity && (
                  <p className="f6 gray mb0">
                    Total ${' '}
                    {(
                      parseFloat(this.state.price_per_package) *
                      parseFloat(this.state.quantity)
                    ).toFixed(2)}
                  </p>
                )}
            </div>
          </div>

          {this.state.uom && (
            <React.Fragment>
              <hr className="mt3 m b--light-gray w-100" />
              <div className="ph4 mt3 mb3 flex">
                <div className="w-100">
                  <label className="f6 fw6 db mb1 dark-gray">
                    Amount of material in each{' '}
                    {this.state.uom.label.toLowerCase()}
                  </label>
                </div>
              </div>

              <div className="ph4 mb3 flex">
                <div className="w-30">
                  <NumericInput
                    label="Quantity"
                    fieldname="qty_per_package"
                    onChange={this.onChangeGeneric}
                  />
                </div>
                {/* <div className="w-30 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">Dimension</label>
                  <Select
                    options={['weight', 'volume', 'pcs'].map(x => ({ value: x, label: x }))}
                    styles={reactSelectStyle}
                  />
                </div> */}
                <div className="w-20 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">UoM</label>
                  <Select
                    placeholder=""
                    options={['kg', 'g', 'lb', 'oz', 'pcs'].map(x => ({
                      value: x,
                      label: x
                    }))}
                    styles={reactSelectStyle}
                    onChange={x => this.setState({ uom_per_package: x })}
                  />
                </div>
                <div className="w-50 pl4">
                  <label className="f6 fw6 db mb1 gray ttc">
                    Total material in {this.state.quantity}{' '}
                    {this.state.uom.label}
                  </label>
                  <div className="f6 pv2 fw6">
                    {this.state.quantity &&
                      this.state.qty_per_package &&
                      parseInt(this.state.quantity) *
                        parseInt(this.state.qty_per_package)}
                    &nbsp;
                    {this.state.uom_per_package &&
                      this.state.uom_per_package.label}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                Where are they stored?
              </label>
              <Select styles={reactSelectStyle} />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <PurchaseInfo
            label="How the nutrients are purchased?"
            vendorLicense={false}
          />

          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
            <a
              className="db tr pv2 bn br2 ttu tracked link dim f6 fw6 orange"
              href="#"
              onClick={this.props.onSave}
            >
              Save for later
            </a>
            <a
              className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
              href="#"
              onClick={this.onSave}
            >
              Save
            </a>
          </div>
        </div>
      </div>
    )
  }
}

// PO Number
// Product Name

// Quantity
// Qty per unit
// Total Quantity

// Cost
// cost per box
// Total Cost

// Supplier
// Location

// Do you use storage cabinets/shelves to store your items?
// Is yes, please indicate Shelf/row ID:

// NutrientEditor.propTypes = {
//   batch_sources: PropTypes.array.isRequired,
//   facility_strains: PropTypes.array.isRequired,
//   grow_methods: PropTypes.array.isRequired
// }

export default NutrientEditor
