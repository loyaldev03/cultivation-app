import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import Creatable from 'react-select/lib/Creatable'
import {
  FieldError,
  NumericInput,
  TextInput,
  CalendarPicker
} from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import LocationPicker from '../../../utils/LocationPicker2'
import { formatDate } from '../../../utils'
import saveHarvestPackage from '../actions/setupHarvestPackage'
import getHarvestPackage from '../actions/getHarvestPackage'

const coalese = option => {
  if (option === null || option.length <= 0) {
    return false
  }
  return option
}

class HarvestPackageEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      console.log(id)
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

            console.log(fs)

            const catalogue = this.props.sales_catalogue.find(
              x => x.value == attr.catalogue.id 
            )

            this.setState({
              ...this.resetState(),
              product_id: attr.product.id,
              product: { value: attr.product.id , label: attr.product.name },
              sku: attr.product.sku,
              catalogue: catalogue,
              facility_strain: fs,
              facility_id: fs.facility_id,
              id: attr.id,
              package_tag: attr.package_tag,
              quantity: attr.quantity,
              uom: attr.uom,
              production_date: attr.production_date,
              expiration_date: attr.expiration_date,
              location_id: attr.location_id,
              harvest_batch: null,
              other_harvest_batch: '',
              drawdown_quantity: attr.drawdown_quantity,
              drawdown_uom: attr.drawdown_uom
            })
          })
      //       const catalogue = this.props.catalogues.find(
      //         x => x.id == attr.catalogue_id
      //       )
      //       this.setState({
      //         ...this.resetState(),
      //         catalogue: catalogue,
      //         id: id,
      //         facility_id: attr.facility_id,
      //         qty_per_package: attr.conversion,
      //         product_name: attr.product_name,
      //         manufacturer: attr.manufacturer,
      //         description: attr.description,
      //         order_quantity: parseFloat(attr.order_quantity),
      //         price_per_package: parseFloat(attr.vendor_invoice.item_price),
      //         order_uom: { value: attr.order_uom, label: attr.order_uom },
      //         uom: { value: attr.uom, label: attr.uom },
      //         location_id: attr.location_id,
      //         // purchase info
      //         vendor: attr.vendor,
      //         purchase_order: attr.purchase_order,
      //         vendor_invoice: attr.vendor_invoice
      //       })
      //     })
      // })
      }
    })
  }

  onChangeProduct = product => {
    if (coalese(product) !== null && product.__isNew__) {
      this.setState({
        product_id: '',
        product
      })
    } else if (coalese(product) !== null) {
      const fs = this.props.facility_strains.find(
        x => x.value === product.facility_strain_id
      )
      this.setState({
        product,
        sku: product.sku,
        catalogue: this.props.sales_catalogue.find(
          x => x.value === product.catalogue_id
        ),
        facility_strain: fs,
        facility_id: fs.facility_id,
        harvest_batch: null
      })
    } else {
      this.setState({
        sku: '',
        product: null
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
    console.log(harvest_batch)
    this.setState({ harvest_batch }) 
  }
  onChangeDrawdownUom = drawdown_uom => this.setState({ drawdown_uom })

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
      errors: {}
    }
  }

  onSave = event => {
    const payload = this.validateAndGetValues()
    console.log(payload)
    saveHarvestPackage(payload).then(({ status, result }) => {})
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
      drawdown_uom
    } = this.state

    const facility_strain_id = coalese(facility_strain)
      ? facility_strain.value
      : ''
    const catalogue_id = coalese(catalogue) ? catalogue.id : ''
    let harvest_batch_id = (other_harvest_batch = '')

    // console.log(harvest_batch)
    // console.log(!coalese(harvest_batch))

    if (!coalese(harvest_batch) && harvest_batch.__isNew__) {
      other_harvest_batch = harvest_batch.value
    } else if (coalese(harvest_batch)) {
      harvest_batch_id = harvest_batch.value
    }

    production_date = production_date ? production_date.toISOString() : ''
    expiration_date = expiration_date ? expiration_date.toISOString() : ''
    uom = coalese(uom) ? uom.value : ''
    drawdown_uom = coalese(drawdown_uom) ? drawdown_uom.value : ''
    
    let name, product_id = ''
    product = coalese(product)

    if (product !== null) {
      name = product.label
      if (!product.__isNew__) {
        product_id = product.value
      }  
    }
    
    // console.group('onsave')
    // console.log(name)
    // console.log(product_id)
    // console.log(`facility_strain_id: ${facility_strain_id}`)
    // console.log(`catalogue_id: ${catalogue_id}`)
    // console.log(`harvest_batch_id: ${harvest_batch_id}`)
    // console.groupEnd()

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
      drawdown_uom
    }
  }

  renderBatchInfo() {
    if (
      !coalese(this.state.harvest_batch) ||
      this.state.harvest_batch.__isNew__
    ) {
      return null
    }

    return (
      <React.Fragment>
        <div className="ph4 mt2 flex">
          <div className="w-60">
            <label className="f6 fw6 db mb1 gray ttc">Strain</label>
            <p className="f6 mt0 mb2">{this.state.harvest_batch.strain_name}</p>
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
            <label className="f6 fw6 db mb1 gray ttc">Remaining quantity</label>
            <p className="f6 mt0 mb2">25.6 lb</p>
          </div>
        </div>
      </React.Fragment>
    )
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
      .map(x => ({id: x.id, ...x.attributes }))
      .filter(x => x.facility.id === this.state.facility_id)
      .map(x => ({
        value: x.id,
        label: `${x.harvest_name} (${x.strain_name})`,
        ...x
      }))

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
              <Creatable
                options={[]}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label="Product code/ SKU"
                fieldname="sku"
                value={this.state.sku}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Product type</label>
              <Select
                options={sales_catalogue}
                value={this.state.catalogue}
                onChange={this.onCatalogueSelected}
                styles={reactSelectStyle}
              />
              <FieldError errors={this.state.errors} field="catalogue" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Strain</label>
              <Creatable
                options={facility_strains}
                styles={reactSelectStyle}
                value={this.state.facility_strain}
                onChange={this.onChangeFacilityStrain}
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
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
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
              <label className="f6 fw6 db mb1 gray ttc">Production date</label>
              <CalendarPicker
                value={this.state.production_date}
                onChange={this.onChangeProductionDate}
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Expiration date</label>
              <CalendarPicker
                value={this.state.expiration_date}
                onChange={this.onChangeExpirationDate}
              />
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
              <FieldError errors={this.state.errors} field="facility_id" />
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
                key={this.state.facility_id}
                options={harvestOptions}
                value={this.state.harvest_batch}
                onChange={this.onHarvestBatchChanged}
                styles={reactSelectStyle}
              />
              <FieldError errors={this.state.errors} field="catalogue" />
            </div>
          </div>

          {this.renderBatchInfo()}

          <div className="ph4 mt3 mb3 flex">
            <div className="w-50">
              <NumericInput
                label="Qty used (dry weight)"
                fieldname="drawdown_quantity"
                value={this.state.drawdown_quantity}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <Select
                value={this.state.drawdown_uom}
                options={drawdown_uoms}
                styles={reactSelectStyle}
                onChange={this.onChangeDrawdownUom}
              />
              <FieldError errors={this.state.errors} field="uom" />
            </div>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <p className="gray f6 i">Cost info coming soon...</p>
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
