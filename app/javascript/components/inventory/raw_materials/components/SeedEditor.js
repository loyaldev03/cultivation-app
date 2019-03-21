import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { PurchaseInfo } from '../../../utils'
import LocationPicker from '../../../utils/LocationPicker2'
import { setupSeed } from '../actions/setupSeed'
import { getRawMaterial } from '../actions/getRawMaterial'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

class SeedEditor extends React.Component {
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
        getRawMaterial(id, 'seeds')
          .then(x => {
            const attr = x.data.data.attributes
            return attr
          })
          .then(attr => {
            this.setState(
              {
                ...this.resetState(),
                id: id,
                facility_id: attr.facility_id,
                facility_strain_id: attr.facility_strain.id,
                qty_per_package: attr.conversion,
                product_id: attr.product_id,
                product_name: attr.product_name,
                product: { value: attr.product.id, label: attr.product.name },
                manufacturer: attr.manufacturer,
                description: attr.description,
                product_size: attr.product.size || '',
                product_uom: {
                  label: attr.product.common_uom,
                  value: attr.product.common_uom
                },
                product_ppm: attr.product.ppm || '',
                order_quantity: parseFloat(attr.order_quantity),
                price_per_package: parseFloat(attr.vendor_invoice.item_price),
                order_uom: { value: attr.order_uom, label: attr.order_uom },
                uom: { value: attr.uom, label: attr.uom },
                location_id: attr.location_id,
                // purchase info
                vendor: attr.vendor,
                purchase_order: attr.purchase_order,
                vendor_invoice: attr.vendor_invoice
              },
              () => {
                this.loadProducts('')
              }
            )
          })
      }
    })
  }

  onFacilityStrainChanged = item => {
    let changes = {
      facility_strain_id: item.value,
      facility_id: item.facility_id
    }

    if (this.state.product_id.length > 0) {
      changes = {
        ...changes
        // product_name: '',
        // manufacturer: '',
        // description: '',
        // product_id: '',
        // product: null,
        // defaultProduct: []
      }
    }

    this.setState(changes, () => {
      this.loadProducts('')
    })
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
      facility_strain_id: '',
      qty_per_package: '',
      product_id: '',
      product_name: '',
      product: null,
      manufacturer: '',
      description: '',
      product_size: '',
      product_uom: { label: '', value: '' },
      product_ppm: '',
      order_quantity: 0,
      price_per_package: 0,
      order_uom: { value: '', label: '' },
      uom: { value: '', label: '' },
      location_id: '',
      defaultProduct: [],

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
    const { isValid, errrors, ...payload } = this.validateAndGetValues()
    if (isValid) {
      setupSeed(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
          window.editorSidebar.close()
        }
      })
    }

    event.preventDefault()
  }

  validateAndGetValues() {
    const {
      id,
      facility_strain_id,
      uom: { value: uom },
      qty_per_package,
      product_id,
      product_name,
      manufacturer,
      description,
      product_size,
      product_ppm,
      order_quantity,
      order_uom: { value: order_uom },
      price_per_package: price,
      location_id
    } = this.state

    let errors = {}

    const quantity = parseFloat(order_quantity) * parseFloat(qty_per_package)

    if (facility_strain_id.length === 0) {
      errors.facility_strain_id = ['Strain is required.']
    }

    if (uom.length === 0) {
      errors.uom = ['Unit of measure is required.']
    }

    if (order_uom.length === 0) {
      errors.order_uom = ['Unit of measure is required.']
    }

    if (parseFloat(order_quantity) <= 0) {
      errors.order_quantity = ['Order quantity should be more than zero.']
    }

    if (parseFloat(qty_per_package) <= 0) {
      errors.qty_per_package = ['Quantity per package is required.']
    }

    if (product_name.length === 0) {
      errors.product = ['Product is required.']
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
    const product_uom = this.state.product_uom.value

    return {
      id,
      facility_strain_id,
      uom,
      quantity,
      product_id,
      product_name,
      manufacturer,
      description,
      product_size,
      product_uom,
      product_ppm,
      order_quantity,
      order_uom,
      qty_per_package,
      price,
      location_id,
      ...purchaseData,
      isValid
    }
  }

  loadProducts = inputValue => {
    inputValue = inputValue || ''
    return fetch(
      `/api/v1/products?type=raw_materials&category=seeds&facility_id=${
        this.props.facility_id
      }&filter=${inputValue}`,
      {
        credentials: 'include'
      }
    )
      .then(response => response.json())
      .then(data => {
        const products = data.data.map(x => ({
          label: x.attributes.name,
          value: x.attributes.id,
          ...x.attributes
        }))
        if (inputValue === '') {
          this.setState({ defaultProduct: products })
        }
        return products
      })
  }

  onChangeProduct = product => {
    console.log(product)
    if (product) {
      if (product.__isNew__) {
        this.setState({
          product,
          product_name: product.value,
          product_id: '',
          manufacturer: '',
          description: '',
          product_size: '',
          product_uom: { label: '', value: '' },
          product_ppm: '',
          facility_strain_id: ''
        })
      } else {
        this.setState({
          product,
          product_id: product.id,
          product_name: product.name,
          manufacturer: product.manufacturer,
          description: product.description,
          product_size: product.size || '',
          product_uom: { label: product.common_uom, value: product.common_uom },
          product_ppm: product.ppm || '',
          facility_strain_id: product.facility_strain_id
        })
      }
    } else {
      this.setState({
        product: null,
        product_id: '',
        manufacturer: '',
        description: '',
        product_size: '',
        product_uom: { label: '', value: '' },
        product_ppm: '',
        facility_strain_id: ''
      })
    }
  }

  render() {
    const { locations, facility_strains } = this.props
    let facilityStrain = facility_strains.find(
      x => x.value === this.state.facility_strain_id
    )
    const order_uoms = this.props.order_uoms.map(x => ({ value: x, label: x }))
    const uoms = this.props.uoms.map(x => ({ value: x, label: x }))

    const showTotalPrice =
      parseFloat(this.state.price_per_package) > 0 &&
      parseFloat(this.state.order_quantity) > 0

    const hasProductId = this.state.product_id

    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Seed</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mb3 mt3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Product Name</label>
              <AsyncCreatableSelect
                isClearable
                noOptionsMessage={() => 'Type to search product...'}
                placeholder={'Search...'}
                defaultOptions={this.state.defaultProduct}
                loadOptions={e => this.loadProducts(e)}
                onInputChange={handleInputChange}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
              <FieldError errors={this.state.errors} field="product" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-40">
              <TextInput
                label="Manufacturer"
                fieldname="manufacturer"
                value={this.state.manufacturer}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-20 pl3">
              <NumericInput
                label="Size"
                fieldname="product_size"
                value={this.state.product_size}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <Select
                value={this.state.product_uom}
                options={uoms}
                styles={reactSelectStyle}
                onChange={x => this.setState({ product_uom: x })}
              />
              <FieldError errors={this.state.errors} field="product_uom" />
            </div>
            <div className="w-20 pl3">
              <NumericInput
                label="PPM"
                fieldname="product_ppm"
                value={this.state.product_ppm}
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
                readOnly={hasProductId}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Select Strain</label>
              <Select
                key={this.state.facility_strain_id}
                options={facility_strains}
                noOptionsMessage={() => 'Type to search strain...'}
                styles={reactSelectStyle}
                onChange={this.onFacilityStrainChanged}
                value={facilityStrain}
              />
              <FieldError
                errors={this.state.errors}
                field="facility_strain_id"
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

          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 dark-gray">
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

          <hr className="mt3 m b--light-gray w-100" />

          <PurchaseInfo
            key={this.state.id}
            ref={this.purchaseInfoEditor}
            label="Vendor Name"
            vendor={this.state.vendor}
            purchase_order={this.state.purchase_order}
            vendor_invoice={this.state.vendor_invoice}
            showVendorLicense
          />

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                Where are they stored?
              </label>
              <LocationPicker
                key={this.props.facility_id}
                mode="storage"
                locations={locations}
                facility_id={this.props.facility_id}
                onChange={x => this.setState({ location_id: x.rm_id })}
                location_id={this.state.location_id}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

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

SeedEditor.propTypes = {
  facility_strains: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  order_uoms: PropTypes.array.isRequired,
  uoms: PropTypes.array.isRequired
}

export default SeedEditor
