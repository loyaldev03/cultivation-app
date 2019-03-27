import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
// import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { PurchaseInfo, InputBarcode } from '../../../utils'
import LocationPicker from '../../../utils/LocationPicker2'
import { saveRawMaterial } from '../actions/saveRawMaterial'
import { getRawMaterial } from '../actions/getRawMaterial'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import UpcStore from '../store/UpcStore'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}
class RawMaterialEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.purchaseInfoEditor = React.createRef()
    this.label = props.raw_material_type.replace(/[_]/g, ' ')
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (!id) {
        this.reset()
      } else {
        getRawMaterial(id)
          .then(x => x.data.data.attributes)
          .then(attr => {
            const catalogue = this.props.catalogues.find(
              x => x.id == attr.catalogue_id
            )

            this.setState(
              {
                ...this.resetState(),
                catalogue: catalogue,
                id: id,
                facility_id: attr.facility_id,
                qty_per_package: attr.conversion,
                product_id: attr.product_id,
                product_name: attr.product_name,
                product: { value: attr.product.id, label: attr.product.name },
                manufacturer: attr.manufacturer,
                description: attr.description,
                upc: attr.product.upc || '',
                product_size: attr.product.size || '',
                product_uom: {
                  label: attr.product.common_uom,
                  value: attr.product.common_uom
                },
                product_ppm: attr.product.ppm || '',
                epa_number: attr.product.epa_number || '',
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

  onFacilityChanged = item => {
    let changes = { facility_id: item.f_id, defaultProduct: [] }
    // When facility changed, current selected product should not be valid
    // because that product belongs to another facility.
    if (this.state.product_id.length > 0) {
      changes = {
        ...changes,
        product: null,
        manufacturer: '',
        description: '',
        product_id: '',
        product_name: ''
      }
    }

    this.setState(changes, () => {
      this.loadProducts('')
    })
  }

  onCatalogueSelected = item => {
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
      facility_id: this.props.facility_id,
      qty_per_package: '',
      catalogue: { value: '', label: '', uoms: [] },
      product: { value: '', label: '' },
      product_id: '',
      product_name: '',
      manufacturer: '',
      upc: '',
      description: '',
      product_size: '',
      product_uom: { label: '', value: '' },
      product_ppm: '',
      epa_number: '',
      order_quantity: 0,
      price_per_package: 0,
      order_uom: { value: '', label: '' },
      uom: { value: '', label: '' },
      location_id: '',

      // Default product list
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
    const payload = this.validateAndGetValues()
    if (payload.isValid) {
      saveRawMaterial(payload).then(({ status, data }) => {
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
      facility_id,
      uom: { value: uom },
      qty_per_package,
      catalogue: { value: catalogue },
      product_id,
      product_name,
      manufacturer,
      description,
      upc,
      product_size,
      product_ppm,
      epa_number,
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

    if (parseFloat(order_quantity) <= 0) {
      errors.order_quantity = ['Order quantity should be more than zero.']
    }

    if (parseFloat(qty_per_package) <= 0) {
      errors.qty_per_package = [
        'Quantity per package should be more than zero.'
      ]
    }

    if (catalogue.length === 0) {
      errors.catalogue = [`${this.label} product is required.`]
    }

    if (location_id.length === 0) {
      errors.location_id = ['Storage location is required.']
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
      facility_id,
      uom,
      quantity,
      catalogue,
      product_id,
      product_name,
      manufacturer,
      upc,
      product_size,
      product_uom,
      product_ppm,
      epa_number,
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

  loadProducts = inputValue => {
    inputValue = inputValue || ''

    return fetch(
      `/api/v1/products?type=raw_materials&category=${
        this.props.raw_material_type
      }&facility_id=${this.props.facility_id}&filter=${inputValue}`,
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
          epa_number: '',
          upc: ''
        })
      } else {
        const catalogue = this.props.catalogues.find(
          x => x.id == product.catalogue_id
        )
        this.setState({
          product,
          product_id: product.id,
          product_name: product.name,
          manufacturer: product.manufacturer,
          description: product.description,
          product_size: product.size || '',
          product_uom: { label: product.common_uom, value: product.common_uom },
          product_ppm: product.ppm || '',
          catalogue: catalogue,
          epa_number: product.epa_number || '',
          upc: product.upc || ''
        })
      }
    } else {
      this.setState({
        product: { value: '', label: '' },
        product_id: '',
        manufacturer: '',
        description: '',
        product_size: '',
        product_uom: { label: '', value: '' },
        product_ppm: '',
        epa_number: '',
        upc: ''
      })
    }
  }

  handleKeyPress = async e => {
    if (e.key === 'Enter') {
      const product = await UpcStore.loadItem(this.state.upc)
      if (product.brand) {
        this.setState({
          manufacturer: product.brand,
          description: product.description,
          product: { label: product.title, value: product.title },
          product_name: product.title
        })
      }
    }
  }

  handleChangeUpc = event => {
    this.setState({ upc: event.target.value })
  }

  render() {
    const { locations, facility_id } = this.props
    const uoms = this.props.uoms.map(x => ({ value: x, label: x }))
    const order_uoms = this.props.order_uoms.map(x => ({ value: x, label: x }))

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
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add {this.label}</h1>
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
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">UPC</label>
              <InputBarcode
                value={this.state.upc}
                onChange={this.handleChangeUpc}
                onKeyPress={this.handleKeyPress}
              />
            </div>
          </div>

          {this.props.raw_material_type === 'supplements' && (
            <div className="ph4 mb3 flex">
              <div className="w-100">
                <TextInput
                  label="EPA reg number"
                  fieldname="epa_number"
                  value={this.state.epa_number}
                  onChange={this.onChangeGeneric}
                />
              </div>
            </div>
          )}

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                {this.label} Type
              </label>
              <Select
                options={this.props.catalogues}
                value={this.state.catalogue}
                onChange={this.onCatalogueSelected}
                styles={reactSelectStyle}
              />
              <FieldError errors={this.state.errors} field="catalogue" />
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
                  <label className="f6 fw6 db mb1 gray ttc">Unit</label>
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
          <PurchaseInfo
            key={this.state.id}
            ref={this.purchaseInfoEditor}
            label={`Vendor Name`}
            showVendorLicense={false}
            vendor={this.state.vendor}
            purchase_order={this.state.purchase_order}
            vendor_invoice={this.state.vendor_invoice}
          />

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                Where are they stored?
              </label>
              <LocationPicker
                key={facility_id}
                mode="storage"
                locations={locations}
                facility_id={facility_id}
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

RawMaterialEditor.propTypes = {
  locations: PropTypes.array.isRequired,
  order_uoms: PropTypes.array.isRequired,
  raw_material_type: PropTypes.string.isRequired
}

export default RawMaterialEditor
