import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
// import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { PurchaseInfo } from '../../../utils'
import LocationPicker from '../../../utils/LocationPicker2'
import { saveRawMaterial } from '../actions/saveRawMaterial'
import { getRawMaterial } from '../actions/getRawMaterial'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

class NutrientEditor extends React.Component {
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
        getRawMaterial(id)
          .then(x => {
            const attr = x.data.data.attributes
            return attr
          })
          .then(attr => {
            const flatten_catalogues = this.props.catalogues.reduce(
              (sum, val) => sum.concat(val.children || []),
              []
            )
            const catalogue = flatten_catalogues.find(
              x => x.value == attr.catalogue_id
            )
            const nutrientType = this.props.catalogues.find(
              x => x.key == catalogue.parent_key
            )

            this.setState({
              ...this.resetState(),
              nutrientType: nutrientType,
              catalogue: catalogue,
              id: id,
              facility_id: attr.facility_id,
              qty_per_package: attr.conversion,
              product_name: attr.product_name,
              manufacturer: attr.manufacturer,
              description: attr.description,
              order_quantity: parseFloat(attr.order_quantity),
              price_per_package: parseFloat(attr.vendor_invoice.item_price),
              order_uom: { value: attr.order_uom, label: attr.order_uom },
              uom: { value: attr.uom, label: attr.uom },
              location_id: attr.location_id,
              // purchase info
              vendor: attr.vendor,
              purchase_order: attr.purchase_order,
              vendor_invoice: attr.vendor_invoice
            })
          })
      }
    })
  }

  onFacilityChanged = item => {
    this.setState({ facility_id: item.f_id })
  }

  onNutrientTypeSelected = item => {
    console.log(item)
    this.setState({
      nutrientType: item,
      catalogue: { value: '', label: '', uoms: [] }
    })
  }

  onNutrientProductSelected = item => {
    this.setState({ catalogue: item }, () => {
      this.loadProducts(
        '',
        this.state.nutrientType,
        this.state.catalogue,
        this.state.facility_id
      )
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
      qty_per_package: '',
      nutrientType: { value: '', label: '', children: [] },
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

    if (!catalogue) {
      errors.catalogue = ['Nutrient product is required.']
    }

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
      product_id,
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

  loadProducts = (inputValue, nutrientType, nutrientProduct, facility_id) => {
    inputValue = inputValue || ''
    console.log(nutrientProduct)
    console.log(nutrientType)
    return fetch(
      `/api/v1/products?type=raw_materials&category=nutrients&sub_category=${
        nutrientType.key
      }&key=${
        nutrientProduct.label
      }&facility_id=${facility_id}&filter=${inputValue}`,
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
          product_name: product.value,
          product_id: '',
          manufacturer: '',
          description: ''
        })
      } else {
        this.setState({
          product_id: product.id,
          product_name: product.name,
          manufacturer: product.manufacturer,
          description: product.description
        })
      }
    } else {
      this.setState({
        product_id: '',
        manufacturer: '',
        description: ''
      })
    }
  }

  render() {
    const { locations, catalogues } = this.props
    const nutrientProducts = this.state.nutrientType.children
    const uoms = this.state.catalogue.uoms.map(x => ({ value: x, label: x }))
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
              <label className="f6 fw6 db mb1 gray ttc">Nutrient Type</label>
              <Select
                options={catalogues}
                value={this.state.nutrientType}
                onChange={this.onNutrientTypeSelected}
                styles={reactSelectStyle}
              />
            </div>
            {nutrientProducts && (
              <div className="w-60 pl3">
                <label className="f6 fw6 db mb1 gray ttc">
                  {this.state.nutrientType.label}&nbsp;
                </label>
                <Select
                  key={this.state.nutrientType}
                  options={nutrientProducts}
                  value={this.state.catalogue}
                  onChange={this.onNutrientProductSelected}
                  styles={reactSelectStyle}
                />
                <FieldError errors={this.state.errors} field="catalogue" />
              </div>
            )}
          </div>

          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Product Name</label>
              <AsyncCreatableSelect
                isClearable
                noOptionsMessage={() => 'Type to search product...'}
                placeholder="Search..."
                defaultOptions={this.state.defaultProduct}
                loadOptions={e =>
                  this.loadProducts(
                    e,
                    this.state.nutrientType,
                    this.state.catalogue,
                    this.state.facility_id
                  )
                }
                onInputChange={handleInputChange}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
              <FieldError errors={this.state.errors} field="product" />
            </div>
          </div>
          <div className="ph4 mb3 flex">
            <div className="w-100">
              <TextInput
                label="Manufacturer"
                fieldname="manufacturer"
                value={this.state.manufacturer}
                onChange={this.onChangeGeneric}
                readOnly={hasProductId}
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
            label="How the nutrients are purchased?"
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

NutrientEditor.propTypes = {
  locations: PropTypes.array.isRequired,
  order_uoms: PropTypes.array.isRequired,
  catalogues: PropTypes.array.isRequired
}

export default NutrientEditor
