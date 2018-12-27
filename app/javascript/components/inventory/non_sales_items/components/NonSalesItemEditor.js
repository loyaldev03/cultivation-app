import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { PurchaseInfo } from '../../../utils'
import LocationPicker from '../../../utils/LocationPicker2'
import { saveNonSalesItem } from '../actions/saveNonSalesItem'
// import { getNonSalesItem } from '../actions/getNonSalesItem'

class NonSalesItemEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.purchaseInfoEditor = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (!id) {
        this.reset()
      } else {
        // get data
      }
    })
  }

  onFacilityChanged = item => {
    this.setState({ facility_id: item.f_id })
  }

  onNonSalesItemTypeSelected = item => {
    this.setState({ catalogue: item })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  resetState() {
    return {
      id: '',
      facility_id: '',
      qty_per_package: '',
      nonSalesItemType: { value: '', label: '', children: [] },
      catalogue: { value: '', label: '', uoms: [] },
      product_name: '',
      manufacturer: '',
      description: '',
      order_quantity: 0,
      price_per_package: 0,
      order_uom: { value: '', label: '' },
      uom: { value: '', label: '' },
      location_id: '',

      // purchase info
      vendor: null,
      purchase_order: null,
      vendor_invoice: null,
      errors: {}
    }
  }

  reset() {
    this.setState(this.resetState())
    this.purchaseInfoEditor.current.reset()
  }

  onSave = event => {
    const payload = this.validateAndGetValues()
    if (payload.isValid) {
      saveNonSalesItem(payload).then(() => {
        this.reset()
        window.editorSidebar.close()
      })
    }

    event.preventDefault()
  }

  validateAndGetValues() {
    const {
      id,
      facility_id,
      uom: { value: uom },
      qty_per_package,
      catalogue: { value: catalogue },
      product_name,
      manufacturer,
      description,
      order_quantity,
      order_uom: { value: order_uom },
      price_per_package: price,
      location_id
    } = this.state

    let errors = {}

    const quantity =
      parseFloat(this.state.order_quantity) *
      parseFloat(this.state.qty_per_package)

    if (facility_id.length === 0) {
      errors.facility_id = ['Facility is required.']
    }

    if (uom.length === 0) {
      errors.uom = ['Unit of measure is required.']
    }

    if (order_uom.length === 0) {
      errors.order_uom = ['Unit of measure is required.']
    }

    if (parseFloat(order_quantity) === 0) {
      errors.order_quantity = ['Order quantity is required.']
    }

    if (parseFloat(qty_per_package) === 0) {
      errors.qty_per_package = ['Quantity per package is required.']
    }

    // if (!catalogue) {
    //   errors.catalogue = ['Non-sales item product is required.']
    // }

    if (location_id.length === 0) {
      errors.location_id = ['Storage location is required.']
    }

    const {
      isValid: purchaseIsValid,
      ...purchaseData
    } = this.purchaseInfoEditor.current.getValues()

    const isValid =
      Object.getOwnPropertyNames(errors).length === 0 && purchaseIsValid

    if (!isValid) {
      this.setState({ errors })
    }

    return {
      id,
      facility_id,
      uom,
      quantity,
      catalogue,
      product_name,
      manufacturer,
      description,
      order_quantity,
      order_uom,
      qty_per_package,
      price,
      location_id,
      ...purchaseData,
      isValid
    }
  }

  render() {
    const { locations, catalogues } = this.props
    const catalogueOptions = catalogues.result.map(x => ({ value: x.value, label: x.label, uoms: x.uoms }))
    const uoms = this.state.catalogue.uoms.map(x => ({ value: x, label: x }))
    const order_uoms = this.props.order_uoms.map(x => ({ value: x, label: x }))

    const showTotalPrice =
      parseFloat(this.state.price_per_package) > 0 &&
      parseFloat(this.state.order_quantity) > 0

    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Item</h1>
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
              <LocationPicker
                mode="facility"
                onChange={this.onFacilityChanged}
                locations={locations}
                facility_id={this.state.facility_id}
                location_id={this.state.facility_id}
              />
              <FieldError errors={this.state.errors} field="facility_id" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-40">
              <label className="f6 fw6 db mb1 gray ttc">
                Non-sales Item Type
              </label>
              <Select
                options={catalogueOptions}
                value={this.state.catalogue}
                onChange={this.onNonSalesItemTypeSelected}
                styles={reactSelectStyle}
              />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <TextInput
                label="Product Name"
                fieldname="product_name"
                value={this.state.product_name}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <TextInput
                label="Manufacturer"
                fieldname="manufacturer"
                value={this.state.manufacturer}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Description</label>
              <textarea
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                fieldname="description"
                value={this.state.description}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db dark-gray">Purchase details</label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-30">
              <NumericInput
                label="Quantity"
                fieldname="order_quantity"
                value={this.state.order_quantity}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <Select
                value={this.state.order_uom}
                options={order_uoms}
                styles={reactSelectStyle}
                onChange={x => this.setState({ order_uom: x })}
              />
              <FieldError errors={this.state.errors} field="order_uom" />
            </div>
            <div className="w-50 pl3">
              <NumericInput
                label={`Price per ${this.state.order_uom &&
                  this.state.order_uom.label} before tax`}
                fieldname="price_per_package"
                value={this.state.price_per_package}
                onChange={this.onChangeGeneric}
              />
              {showTotalPrice && (
                <p className="f6 gray mb0">
                  Total ${' '}
                  {(
                    parseFloat(this.state.price_per_package) *
                    parseFloat(this.state.order_quantity)
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
                  <label className="f6 fw6 db dark-gray">
                    Amount of material in each{' '}
                    {this.state.order_uom.label.toLowerCase()}
                  </label>
                </div>
              </div>

              <div className="ph4 mb3 flex">
                <div className="w-30">
                  <NumericInput
                    label="Quantity"
                    fieldname="qty_per_package"
                    value={this.state.qty_per_package}
                    onChange={this.onChangeGeneric}
                    errors={this.state.errors}
                  />
                </div>
                <div className="w-20 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">UoM</label>
                  <Select
                    value={this.state.uom}
                    options={uoms}
                    styles={reactSelectStyle}
                    onChange={x => this.setState({ uom: x })}
                  />
                  <FieldError errors={this.state.errors} field="uom" />
                </div>
                <div className="w-50 pl4">
                  <label className="f6 fw6 db mb1 gray ttc">
                    Total material in {this.state.order_quantity}{' '}
                    {this.state.order_uom.label}
                  </label>
                  <div className="f6 pv2 fw6">
                    {this.state.order_quantity &&
                      this.state.qty_per_package &&
                      parseFloat(this.state.order_quantity) *
                        parseFloat(this.state.qty_per_package)}
                    &nbsp;
                    {this.state.uom && this.state.uom.label}
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
              <LocationPicker
                mode="storage"
                locations={locations}
                facility_id={this.state.facility_id}
                onChange={x => this.setState({ location_id: x.rm_id })}
                location_id={this.state.location_id}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <PurchaseInfo
            key={this.state.id}
            ref={this.purchaseInfoEditor}
            label="How the items are purchased?"
            vendor={this.state.vendor}
            purchase_order={this.state.purchase_order}
            vendor_invoice={this.state.vendor_invoice}
            showVendorLicense={false}
          />

          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-end">
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

export default NonSalesItemEditor
