import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import {
  FieldError,
  NumericInput,
  TextInput,
  CalendarPicker
} from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import LocationPicker from '../../../utils/LocationPicker2'
import { formatDate } from '../../../utils'
import setupHarvestPackage from '../actions/setupHarvestPackage'
import getHarvestPackage from '../actions/getHarvestPackage'

// TODO: this function need to re-evaluate if it is still useful
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

  return fetch('/api/v1/sales_products/products?filter=' + inputValue, {
    credentials: 'include'
  })
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

class HarvestPackageEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  resetState() {
    return {
      // Product details
      product_id: '',
      product: null,
      sku: '',
      catalogue: null,
      facility_strain: '',
      facility_id: '',
      // Package details
      id: '',
      package_tag: '',
      quantity: 0,
      uom: null,
      production_date: null,
      expiration_date: null,
      location_id: '',
      // Harvest info
      harvest_batch: null,
      other_harvest_batch: '',
      drawdown_quantity: 0,
      drawdown_uom: null,
      cost_per_unit: '',
      transaction_limit: '',
      errors: {}
    }
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (!id) {
        this.setState(this.resetState())
      } else {
        getHarvestPackage(id)
          .then(x => ({
            id: x.data.data.id,
            ...x.data.data.attributes
          }))
          .then(attr => {
            console.log(attr)

            const fs = this.props.facility_strains.find(
              x => x.value === attr.product.facility_strain_id
            )

            const catalogue = this.props.sales_catalogue.find(
              x => x.value == attr.catalogue.id
            )

            let harvest_batch = this.props.harvest_batches
              .map(x => ({ id: x.id, ...x.attributes }))
              .find(
                x =>
                  x.facility.id === fs.facility_id &&
                  x.id === attr.harvest_batch_id
              )

            if (harvest_batch) {
              harvest_batch = {
                value: harvest_batch.id,
                label: `${harvest_batch.harvest_name} (${
                  harvest_batch.strain_name
                })`,
                ...harvest_batch
              }
            } else {
              harvest_batch = {
                value: attr.other_harvest_batch,
                label: attr.other_harvest_batch
              }
            }

            let drawdown_uom = null,
              uom = null
            if (attr.drawdown_uom) {
              drawdown_uom = {
                value: attr.drawdown_uom,
                label: attr.drawdown_uom
              }
            }

            if (attr.uom) {
              uom = { value: attr.uom, label: attr.uom }
            }

            this.setState({
              ...this.resetState(),
              product_id: attr.product.id,
              product: { value: attr.product.id, label: attr.product.name },
              sku: attr.product.sku,
              transaction_limit: attr.product.transaction_limit || '',
              catalogue: catalogue,
              facility_strain: fs,
              facility_id: fs.facility_id,
              id: attr.id,
              package_tag: attr.package_tag,
              quantity: attr.quantity,
              uom: uom,
              production_date: new Date(attr.production_date),
              expiration_date: new Date(attr.expiration_date),
              location_id: attr.location_id,
              harvest_batch: harvest_batch,
              other_harvest_batch: attr.other_harvest_batch,
              drawdown_quantity: attr.drawdown_quantity,
              drawdown_uom,
              cost_per_unit: attr.cost_per_unit || ''
            })
          })
      }
    })
  }

  onChangeProduct = product => {
    console.log(product)

    if (coalese(product) !== false && product.__isNew__) {
      this.setState({
        product_id: '',
        product,
        facility_strain: null,
        facility_id: '',
        harvest_batch: null,
        other_harvest_batch: '',
        drawdown_quantity: '',
        drawdown_uom: ''
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
        facility_strain: fs,
        facility_id: fs.facility_id,
        harvest_batch: null,
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

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onChangeFacilityStrain = facility_strain => {
    this.setState({
      facility_strain,
      facility_id: facility_strain.facility_id,
      harvest_batch: null
    })
  }

  onCatalogueSelected = item =>
    this.setState({ catalogue: item, drawdown_uom: null })
  onChangeUom = uom => this.setState({ uom })
  onChangeProductionDate = production_date => this.setState({ production_date })
  onChangeExpirationDate = expiration_date => this.setState({ expiration_date })
  onRoomChanged = item => this.setState({ location_id: item.rm_id })
  onHarvestBatchChanged = harvest_batch => {
    if (harvest_batch && harvest_batch.__isNew__) {
      this.setState({
        harvest_batch,
        other_harvest_batch: harvest_batch.value
      })
    } else {
      this.setState({
        harvest_batch,
        other_harvest_batch: ''
      })
    }
  }
  onChangeDrawdownUom = drawdown_uom => this.setState({ drawdown_uom })

  onSave = event => {
    const payload = this.validateAndGetValues()
    setupHarvestPackage(payload).then(({ status, data }) => {
      if (status >= 400) {
        this.setState({ errors: data.errors })
      } else {
        this.setState(this.resetState())
        window.editorSidebar.close()
      }
    })
    event.preventDefault()
  }

  validateAndGetValues() {
    let {
      product,
      sku,
      catalogue,
      facility_strain,
      id,
      package_tag,
      quantity,
      uom,
      production_date,
      expiration_date,
      location_id,
      harvest_batch,
      other_harvest_batch,
      drawdown_quantity,
      drawdown_uom,
      cost_per_unit,
      transaction_limit
    } = this.state

    const facility_strain_id = coalese(facility_strain)
      ? facility_strain.value
      : ''
    const catalogue_id = coalese(catalogue) ? catalogue.id : ''
    let harvest_batch_id = ''

    if (other_harvest_batch.length > 0) {
      other_harvest_batch = other_harvest_batch
      harvest_batch_id = ''
    } else if (coalese(harvest_batch)) {
      harvest_batch_id = harvest_batch.value
    }

    production_date = production_date ? production_date.toISOString() : ''
    expiration_date = expiration_date ? expiration_date.toISOString() : ''
    uom = coalese(uom) ? uom.value : ''
    drawdown_uom = coalese(drawdown_uom) ? drawdown_uom.value : ''

    let name = '',
      product_id = ''
    product = coalese(product)

    if (product !== false) {
      name = product.label
      if (!product.__isNew__) {
        product_id = product.value
      }
    }

    return {
      product_id,
      name,
      sku,
      catalogue_id,
      facility_strain_id,
      id,
      package_tag,
      quantity,
      uom,
      production_date,
      expiration_date,
      location_id,
      harvest_batch_id,
      other_harvest_batch,
      drawdown_quantity,
      drawdown_uom,
      cost_per_unit,
      transaction_limit
    }
  }

  renderBatchInfo() {
    if (
      this.state.other_harvest_batch.length > 0 ||
      this.state.harvest_batch == null
    ) {
      return null
    } else if (
      this.state.harvest_batch.value === this.state.other_harvest_batch
    ) {
      // added this condition for showing other batch
      return null
    } else {
      return (
        <React.Fragment>
          <div className="ph4 mt2 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc">Strain</label>
              <p className="f6 mt0 mb2">
                {this.state.harvest_batch.strain_name}
              </p>
            </div>
            <div className="w-40 pl3">
              <label className="f6 fw6 db mb1 gray ttc tr">Harvest date</label>
              <p className="f6 mt0 mb2 tr">
                {formatDate(this.state.harvest_batch.harvest_date)}
              </p>
            </div>
          </div>
          <div className="ph4 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc">
                Remaining quantity
              </label>
              <p className="f6 mt0 mb2">25.6 lb</p>
            </div>
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    const {
      locations,
      harvest_batches,
      facility_strains,
      sales_catalogue
    } = this.props
    const uoms = this.state.catalogue
      ? this.state.catalogue.uoms.map(x => ({ value: x, label: x }))
      : []
    const drawdown_uoms = this.props.drawdown_uoms.map(x => ({
      value: x,
      label: x
    }))

    const harvestOptions = harvest_batches
      .map(x => ({ id: x.id, ...x.attributes }))
      .filter(x => x.facility.id === this.state.facility_id)
      .map(x => ({
        value: x.id,
        label: `${x.harvest_name} (${x.strain_name})`,
        ...x
      }))

    const hasProductId = this.state.product && this.state.product_id.length > 0

    console.log(`this.state.product.id: ${this.state.product_id}`)

    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              Add Harvests Package
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
              <label className="f6 fw6 db mb1 gray ttc">Strain</label>
              <Select
                options={facility_strains}
                styles={reactSelectStyle}
                value={this.state.facility_strain}
                onChange={this.onChangeFacilityStrain}
                isDisabled={hasProductId}
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
              <label className="f6 fw6 db dark-gray">Package Details</label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-70">
              <TextInput
                label="Package Tag"
                fieldname="package_tag"
                value={this.state.package_tag}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-30 pl2">
              <label className="f6 fw6 db dark-gray">&nbsp;</label>
              <a href="" className="orange btn--secondary f6 btn">
                Scan
              </a>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-50">
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
          </div>
          <div className="ph4 mb3 flex">
            <div className="w-50">
              <NumericInput
                label="Cost per unit, $"
                fieldname="cost_per_unit"
                value={this.state.cost_per_unit}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <p className="f6 black mt2 mb0">
                Total Cost, $
                {(this.state.cost_per_unit * this.state.quantity).toFixed(2)}
              </p>
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
              <label className="f6 fw6 db mb1 dark-gray ttc">Source</label>
            </div>
          </div>

          <div className="ph4 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Harvest name</label>
              <Creatable
                isClearable
                key={this.state.facility_id}
                options={harvestOptions}
                value={this.state.harvest_batch}
                onChange={this.onHarvestBatchChanged}
                styles={reactSelectStyle}
              />
              <FieldError errors={this.state.errors} field="harvest_batch" />
            </div>
          </div>

          {this.renderBatchInfo()}

          <div className="ph4 mt3 mb3 flex">
            <div className="w-50">
              <NumericInput
                label="Qty used, dry weight"
                fieldname="drawdown_quantity"
                value={this.state.drawdown_quantity}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Unit</label>
              <Select
                value={this.state.drawdown_uom}
                options={drawdown_uoms}
                styles={reactSelectStyle}
                onChange={this.onChangeDrawdownUom}
              />
              <FieldError errors={this.state.errors} field="drawdown_uom" />
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

HarvestPackageEditor.propTypes = {
  locations: PropTypes.array.isRequired,
  drawdown_uoms: PropTypes.array.isRequired,
  harvest_batches: PropTypes.array.isRequired,
  sales_catalogue: PropTypes.array.isRequired
}

export default HarvestPackageEditor
