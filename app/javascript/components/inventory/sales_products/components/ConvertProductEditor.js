import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import AsyncSelect from 'react-select/lib/Async'
import {
  FieldError,
  NumericInput,
  TextInput,
  CalendarPicker
} from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import LocationPicker from '../../../utils/LocationPicker2'
import setupConvertedProduct from '../actions/setupConvertedProduct'

const coalese = option => {
  if (option === undefined || option === null || option.length <= 0) {
    return false
  }
  return option
}

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

const loadProducts = inputValue => {
  inputValue = inputValue || ''

  return fetch(
    '/api/v1/sales_products/products?type=converted_products&filter=' +
      inputValue,
    {
      credentials: 'include'
    }
  )
    .then(response => response.json())
    .then(data => {
      // console.log(data.data)
      const products = data.data.map(x => ({
        label: x.attributes.name,
        value: x.attributes.id,
        ...x.attributes
      }))

      return products
    })
}

class ConvertProductEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  resetState() {
    // return { id: '', location_id: '', product: null }
    return {
      // Product details
      product_id: '',
      product: null,
      sku: '',
      catalogue: null,
      facility_id: '',
      // Package details
      id: '',
      start_package_tag: '',
      end_package_tag: '',
      quantity: 0,
      uom: null,
      production_date: null,
      expiration_date: null,
      location_id: '',
      cost_per_unit: '',
      transaction_limit: '',
      isMultiPackage: false,
      breakdowns: [{ package_tag: '', uom: null, quantity: '' }],
      errors: {}
    }
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onChangeProduct = product => {
    if (coalese(product) !== false && product.__isNew__) {
      this.setState({
        product_id: '',
        product,
        facility_id: ''
      })
    } else if (coalese(product) !== false) {
      const fs = this.props.facility_strains.find(
        x => x.value === product.facility_strain_id
      )
      this.setState({
        product_id: product.id,
        product,
        sku: product.sku,
        catalogue: this.props.sales_catalogue.find(
          x => x.value === product.catalogue_id
        ),
        facility_id: fs.facility_id,
        transaction_limit: product.transaction_limit || ''
      })
    } else {
      this.setState({
        sku: '',
        product: null,
        product_id: '',
        transaction_limit: ''
      })
    }
  }

  onCatalogueSelected = item => this.setState({ catalogue: item })
  onFacilityChanged = item => this.setState({ facility_id: item.f_id })
  onRoomChanged = item => this.setState({ location_id: item.rm_id })
  onToggleIsMultiPackage = () => {
    this.setState({ isMultiPackage: !this.state.isMultiPackage })
  }
  onChangeUom = uom => this.setState({ uom })
  onChangeProductionDate = production_date => this.setState({ production_date })
  onChangeExpirationDate = expiration_date => this.setState({ expiration_date })

  onAddBreakdown = event => {
    const { breakdowns } = this.state
    const index = parseInt(event.target.attributes.index.value) + 1
    this.setState({
      breakdowns: [
        ...breakdowns.slice(0, index),
        { package_tag: '', uom: null, quantity: '' },
        ...breakdowns.slice(index)
      ]
    })
  }

  onRemoveBreakdown = event => {
    const { breakdowns } = this.state
    const index = parseInt(event.target.attributes.index.value)
    this.setState({
      breakdowns: [
        ...breakdowns.slice(0, index),
        ...breakdowns.slice(index + 1)
      ]
    })
  }

  onChangeBreakdownField = event => {
    const fieldAttr = event.target.attributes.fieldname.value
    const match = fieldAttr.match(/\[[\d]\]/)
    const matchedString = match[0]
    const index = matchedString.slice(1, matchedString.length - 1)
    const fieldname = fieldAttr.slice(0, match.index)
    const { breakdowns } = this.state

    breakdowns[index][fieldname] = event.target.value
    this.setState({ breakdowns: [...breakdowns] })
  }

  onBreakdownUomChanged = option => {
    const { breakdowns } = this.state
    breakdowns[option.index].uom = option
    this.setState({ breakdowns: [...breakdowns] })
  }

  onSave = event => {
    const { isValid, ...payload } = this.validateAndGetValues()
    if (isValid) {
      setupConvertedProduct(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.setState(this.resetState())
          window.editorSidebar.close()
        }
      })
      event.preventDefault()
    }
  }

  validateAndGetValues = () => {
    const {
      id,
      sku,
      catalogue,
      facility_id,
      start_package_tag,
      quantity,
      uom,
      production_date,
      expiration_date,
      location_id,
      cost_per_unit,
      transaction_limit,
      isMultiPackage
    } = this.state

    let { product, product_id, end_package_tag, breakdowns } = this.state
    let name = '',
      errors = {}
    const catalogue_id = catalogue ? catalogue.value : ''

    if (isMultiPackage) {
      end_package_tag = start_package_tag
    }

    if (coalese(product) !== false) {
      name = product.label
      if (!product.__isNew__) {
        product_id = product.value
      }
    }

    breakdowns.forEach((item, index) => {
      if (
        item.package_tag.length === 0 &&
        item.quantity.length <= 0 &&
        !item.uom
      ) {
        return
      }

      if (item.package_tag.length === 0) {
        errors[`package_tag[${index}]`] = ['Package tag is required.']
      }

      if (item.quantity.length <= 0) {
        errors[`quantity[${index}]`] = ['Quantity is required.']
      }

      if (item.uom === null) {
        errors[`uom[${index}]`] = ['Unit is required.']
      }
    })

    alert('product must have at least one component product tag!')

    const isValid = Object.getOwnPropertyNames(errors).length === 0
    if (!isValid) {
      this.setState({ errors })
    } else {
      breakdowns = breakdowns
        .filter(
          item =>
            item.package_tag.length > 0 && item.quantity.length > 0 && item.uom
        )
        .map(item => ({
          package_tag: item.package_tag,
          quantity: item.quantity,
          uom: item.uom.value
        }))
    }

    return {
      id,
      product_id,
      name,
      sku,
      catalogue_id,
      facility_id,
      start_package_tag,
      end_package_tag,
      quantity,
      uom,
      production_date,
      expiration_date,
      location_id,
      cost_per_unit,
      transaction_limit,
      breakdowns,
      isValid
    }
  }

  renderPackageBreakdowns = () => {
    const uoms = this.props.breakdown_uoms.map(x => ({ value: x, label: x }))

    const inputs = this.state.breakdowns.map((item, index) => {
      const isLast = index === this.state.breakdowns.length - 1
      if (index === 0) {
        return this.renderBreakdown(
          true,
          'Package Tag/ ID',
          item,
          uoms,
          index,
          isLast
        )
      } else {
        return this.renderBreakdown(
          false,
          'Package Tag/ ID',
          item,
          uoms,
          index,
          isLast
        )
      }
    })
    return inputs
  }

  renderBreakdown = (
    showLabel = true,
    productLabel,
    item,
    uoms,
    index,
    isLast
  ) => {
    productLabel = showLabel ? productLabel : ''
    uoms = uoms.map(x => ({ index: index, ...x }))

    return (
      <div className="ph4 mb2 flex" key={`breakdown_${index}`}>
        <div className="w-50">
          <TextInput
            label={productLabel}
            fieldname={`package_tag[${index}]`}
            value={item.package_tag}
            onChange={this.onChangeBreakdownField}
          />
          <FieldError
            errors={this.state.errors}
            field={`package_tag[${index}]`}
          />
        </div>

        <div className="w-20 pl3">
          <NumericInput
            label={showLabel && 'Qty'}
            fieldname={`quantity[${index}]`}
            value={item.quantity}
            onChange={this.onChangeBreakdownField}
          />
          <FieldError errors={this.state.errors} field={`quantity[${index}]`} />
        </div>

        <div className="w-20 pl3">
          {showLabel && <label className="f6 fw6 db mb1 gray ttc">Unit</label>}
          <Select
            value={item.uom}
            options={uoms}
            styles={reactSelectStyle}
            fieldname={`uom[${index}]`}
            onChange={this.onBreakdownUomChanged}
          />
          <FieldError errors={this.state.errors} field={`uom[${index}]`} />
        </div>

        {isLast && (
          <div className="w-10 pl3">
            {showLabel && (
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
            )}
            <a
              href="#"
              index={index}
              onClick={this.onAddBreakdown}
              className="f6 flex justify-center pa2 btn--secondary link"
            >
              +
            </a>
          </div>
        )}

        {!isLast && (
          <div className="w-10 pl3">
            {showLabel && (
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
            )}
            <a
              href="#"
              index={index}
              onClick={this.onRemoveBreakdown}
              className="f6 flex justify-center pa2 btn--secondary link"
            >
              -
            </a>
          </div>
        )}
      </div>
    )
  }

  renderPackageTag() {
    if (this.state.isMultiPackage) {
      return (
        <div className="ph4 mt3 mb3 flex">
          <div className="w-50">
            <TextInput
              label="METRC Start Tag"
              fieldname="start_package_tag"
              value={this.state.start_package_tag}
              onChange={this.onChangeGeneric}
              errors={this.state.errors}
            />
          </div>
          <div className="w-50 pl3">
            <TextInput
              label="METRC End Tag"
              fieldname="end_package_tag"
              value={this.state.end_package_tag}
              onChange={this.onChangeGeneric}
              errors={this.state.errors}
            />
          </div>
        </div>
      )
    } else {
      return (
        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <TextInput
              label="METRC Tag"
              fieldname="start_package_tag"
              value={this.state.start_package_tag}
              onChange={this.onChangeGeneric}
              errors={this.state.errors}
            />
          </div>
        </div>
      )
    }
  }

  render() {
    const { locations, sales_catalogue } = this.props

    const uoms = this.state.catalogue
      ? this.state.catalogue.uoms.map(x => ({ value: x, label: x }))
      : []

    const hasProductId = this.state.product && this.state.product_id.length > 0

    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              Add Convert Product
            </h1>
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
              <label className="f6 fw6 db dark-gray">Product Info</label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Product Name</label>
              <AsyncCreatableSelect
                defaultOptions
                isClearable
                noOptionsMessage={() => 'Type to search product...'}
                placeholder="Search..."
                loadOptions={loadProducts}
                onInputChange={handleInputChange}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
              <FieldError errors={this.state.errors} field="product" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label="Product code/ SKU"
                fieldname="sku"
                value={this.state.sku}
                onChange={this.onChangeGeneric}
                readOnly={hasProductId}
                errors={this.state.errors}
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Product type</label>
              <Select
                options={sales_catalogue}
                value={this.state.catalogue}
                onChange={this.onCatalogueSelected}
                styles={reactSelectStyle}
                isDisabled={hasProductId}
              />
              <FieldError errors={this.state.errors} field="catalogue_id" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <LocationPicker
                mode="facility"
                onChange={this.onFacilityChanged}
                locations={locations}
                facility_id={this.state.facility_id}
                location_id={this.state.facility_id}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db dark-gray">Package Details</label>
            </div>
          </div>

          <div className="ph4 mb3 flex justify-between">
            <label className="f6 fw6 db mb1 gray">
              I am adding more than one package with the same information.
            </label>
            <input
              className="toggle toggle-default"
              type="checkbox"
              value="1"
              checked={this.state.isMultiPackage}
              id="is_bought_input"
              onChange={this.onToggleIsMultiPackage}
            />
            <label className="toggle-button" htmlFor="is_bought_input" />
          </div>

          {this.renderPackageTag()}

          <div className="ph4 mb3 flex">
            <div className="w-30">
              <NumericInput
                label="Quantity per pkg"
                fieldname="quantity"
                value={this.state.quantity}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Unit</label>
              <Select
                options={uoms}
                value={this.state.uom}
                styles={reactSelectStyle}
                onChange={this.onChangeUom}
              />
              <FieldError errors={this.state.errors} field="uom" />
            </div>
            <div className="w-50 pl3">
              <NumericInput
                label="Cost per package, $"
                fieldname="cost_per_unit"
                value={this.state.cost_per_unit}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-50">
              <label className="f6 fw6 db mb1 gray ttc">Production date</label>
              <CalendarPicker
                value={this.state.production_date}
                onChange={this.onChangeProductionDate}
              />
              <FieldError errors={this.state.errors} field="production_date" />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Expiration date</label>
              <CalendarPicker
                value={this.state.expiration_date}
                onChange={this.onChangeExpirationDate}
              />
              <FieldError errors={this.state.errors} field="expiration_date" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb1 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb3 dark-gray ttc">
                Package breakdown
              </label>
              <p className="f6 fw6 db mt0 mb3 gray">
                Report breakdown if this package composes from other tagged
                package.
              </p>
            </div>
          </div>
          {this.renderPackageBreakdowns()}

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 dark-gray ttc">Storage</label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <LocationPicker
                mode="storage"
                onChange={this.onRoomChanged}
                locations={locations}
                facility_id={this.state.facility_id}
                location_id={this.state.location_id}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 dark-gray">
                Is there a transaction limit on this item?
              </label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-60">
              <NumericInput
                label="If Yes, please provide transaction limit"
                fieldname="transaction_limit"
                value={this.state.transaction_limit}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
                readOnly={hasProductId}
              />
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

export default ConvertProductEditor
