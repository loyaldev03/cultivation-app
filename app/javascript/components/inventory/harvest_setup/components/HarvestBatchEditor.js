import React from 'react'
import isEmpty from 'lodash.isempty'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import { TextInput, NumericInput, FieldError } from '../../../utils/FormHelpers'
import { toast } from '../../../utils'
import { LocationPicker, PurchaseInfo, formatDate } from '../../../utils'
import setupHarvestBatch from '../actions/setupHarvestBatch'
import getHarvestBatch from '../actions/getHarvestBatch'

export default class HarvestBatchEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.batches = props.cultivation_batches.map(x => ({
      id: x.id,
      ...x.attributes
    }))
    this.purchaseInfoEditor = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id

      if (!id) {
        this.setState(this.resetState())
      } else {
        getHarvestBatch(
          id,
          'plants, vendor_invoice, vendor, purchase_order'
        ).then(({ status, data }) => {
          if (status != 200) {
            alert('Something wrong')
            return
          }
          const attr = data.data.attributes
          const uom = this.props.uoms.find(x => x == attr.uom)
          const plants = isEmpty(attr.plants)
            ? [{ id: '', plant_id: '', wet_weight: '', wet_waste_weight: '' }]
            : attr.plants

          this.setState({
            ...this.resetState(),
            id,
            cultivation_batch: this.batches.find(
              x => x.id == attr.cultivation_batch_id
            ),
            harvest_name: attr.harvest_name,
            harvest_date: new Date(attr.harvest_date),
            location_id: attr.location_id,
            plant_uom: { value: uom, label: uom },
            plants,
            vendor: attr.vendor,
            purchase_order: attr.purchase_order,
            vendor_invoice: attr.vendor_invoice
          })
        })
      }
    })
  }

  resetState() {
    return {
      id: '',
      cultivation_batch: null,
      harvest_name: '',
      plants: [{ id: '', plant_id: '', wet_weight: '', wet_waste_weight: '' }],
      delete_plants: [],
      plant_uom: null,
      harvest_date: null,
      location_id: '',
      vendor: null,
      purchase_order: null,
      vendor_invoice: null,
      errors: {},

      // Purchase info
      vendor_id: '',
      vendor_name: '',
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      purchase_order_no: '',
      invoice_no: ''
    }
  }

  reset = () => {
    this.setState(this.resetState())
  }

  onCultivationBatchIdChanged = option => {
    this.setState({ cultivation_batch: option })
  }

  onHarvestedOnChanged = value => {
    this.setState({ harvest_date: value })
  }

  onInputChanged = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onLocationChanged = event => {
    this.setState({ location_id: event.location_id })
  }

  onAddPlant = event => {
    this.setState({
      plants: [
        ...this.state.plants,
        {
          id: '',
          plant_id: '',
          wet_weight: '',
          wet_waste_weight: ''
        }
      ]
    })
    event.preventDefault()
  }

  onRemovePlant = event => {
    const index = event.target.attributes.index.value
    if (this.state.plants.length === 1) {
      this.setState({
        plants: [{ plant_id: '', weight: '', uom: null }]
      })
    } else {
      const plant = this.state.plants[index]
      const delete_plants = this.state.delete_plants

      if (plant.id !== '') {
        delete_plants.push(plant.id)
      }

      this.state.plants.splice(index, 1)
      this.setState({
        plants: [...this.state.plants],
        delete_plants: [...delete_plants]
      })
    }
    event.preventDefault()
  }

  onPlantIdChanged = (event, index) => {
    const plants = [...this.state.plants]
    plants[index].plant_id = event.target.value
    this.setState({ plants })
  }

  onPlantWeightChanged = (event, index) => {
    const plants = [...this.state.plants]
    plants[index].wet_weight = event.target.value
    this.setState({ plants })
  }

  onPlantWasteWeightChanged = (event, index) => {
    const plants = [...this.state.plants]
    plants[index].wet_waste_weight = event.target.value
    this.setState({ plants })
  }

  onUomChanged = option => {
    this.setState({ plant_uom: option })
  }

  calculateTotalWeight = plants => {
    return plants.reduce(
      (total, x) => total + (parseFloat(x.wet_weight) || 0),
      0
    )
  }

  onSave = event => {
    const { errors, isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      setupHarvestBatch(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
          toast('Harvest Batch added.', 'success')
          window.editorSidebar.close()
          this.props.onSave(payload)
        }
      })
    }

    event.preventDefault()
  }

  validatePlants(row) {
    return row.plant_id.length > 0 && row.wet_weight > 0
  }

  validateAndGetValues() {
    const {
      id,
      harvest_name,
      cultivation_batch,
      plants,
      plant_uom,
      total_weight,
      harvest_date,
      location_id,
      delete_plants
    } = this.state

    let errors = {},
      cultivation_batch_id = ''

    if (harvest_name.length === 0) {
      errors.harvest_name = ['Harvest name/ ID is required.']
    }

    if (!cultivation_batch) {
      errors.cultivation_batch = ['Cultivation batch is required.']
    } else {
      cultivation_batch_id = cultivation_batch.id
    }

    if (!harvest_date) {
      errors.harvest_date = ['Harvest date is required.']
    }

    const plantsValid = plants.every(
      x => x.plant_id.length > 0 && x.wet_weight > 0
    )
    if (!plantsValid) {
      errors.plants = ['Plant ID is required.']
    }

    if (location_id.length === 0) {
      errors.location_id = ['Location ID is required.']
    }

    if (!plant_uom || !plant_uom.value) {
      errors.plant_uom = ['Weight Unit of Measure is required.']
    }

    let purchaseInfo = {},
      isPurchaseInfoValid = true
    if (
      cultivation_batch &&
      cultivation_batch.batch_source === 'clones_purchased'
    ) {
      ;({
        isValid: isPurchaseInfoValid,
        ...purchaseInfo
      } = this.purchaseInfoEditor.current.getValues())
    }

    const isValid =
      Object.getOwnPropertyNames(errors).length === 0 && isPurchaseInfoValid

    if (!isValid) {
      this.setState({ errors })
    }

    return {
      id,
      harvest_name,
      cultivation_batch_id,
      plants,
      delete_plants,
      uom: plant_uom ? plant_uom.value : '',
      total_weight,
      harvest_date,
      location_id,
      ...purchaseInfo,
      isValid
    }
  }

  renderPlantIdFields(plant, index) {
    const uoms = this.props.uoms.map(x => ({ value: x, label: x }))
    return (
      <div className="ph4 mb2 flex" key={index}>
        <div className="w-40">
          <TextInput
            fieldname="plant_ids"
            onChange={event => this.onPlantIdChanged(event, index)}
            value={plant.plant_id}
          />
        </div>
        <div className="w-20 pl2">
          <NumericInput
            fieldname="wet_weight"
            min={0}
            onChange={event => this.onPlantWeightChanged(event, index)}
            value={plant.wet_weight}
          />
        </div>
        <div className="w-20 pl2">
          <NumericInput
            fieldname="waste_weight"
            min={0}
            onChange={event => this.onPlantWasteWeightChanged(event, index)}
            value={plant.wet_waste_weight || 0}
          />
        </div>
        <div className="w-20 pl2">
          <Select
            options={uoms}
            value={this.state.plant_uom}
            styles={reactSelectStyle}
            onChange={this.onUomChanged}
          />
        </div>

        <div className="pl2 flex-column flex justify-end">
          <a
            href="#"
            style={{ height: '34px', width: '25px', lineHeight: '2.5em' }}
          >
            <i
              className="material-icons gray md-18 pointer dim child"
              index={index}
              onClick={this.onRemovePlant}
            >
              delete_outline
            </i>
          </a>
        </div>
      </div>
    )
  }

  renderBatchDetails() {
    if (!this.state.cultivation_batch) {
      return null
    }

    const {
      strain_name,
      start_date,
      batch_source
    } = this.state.cultivation_batch

    return (
      <React.Fragment>
        <div className="ph4  flex">
          <div className="w-60">
            <label className="f6 fw6 db mb1 gray ttc">Strain</label>
            <p className="f6 mt0 mb2">{strain_name}</p>
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc tr">
              Batch start date
            </label>
            <p className="f6 mt0 mb2 tr">{formatDate(start_date)}</p>
          </div>
        </div>
        <div className="ph4 mt2 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Batch source</label>
            <p className="f6 mt0 mb2">{batch_source}</p>
          </div>
        </div>
        <hr className="mt3 mb3 b--black-10 w-100" />
      </React.Fragment>
    )
  }

  renderProcurementInfo(cultivation_batch) {
    if (
      !cultivation_batch ||
      cultivation_batch.batch_source !== 'clones_purchased'
    ) {
      return null
    }

    return (
      <React.Fragment>
        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mt3">
          <span className="f6 fw6 dark-gray">Plant Purchase Info</span>
        </div>

        <PurchaseInfo
          key={cultivation_batch.id}
          ref={this.purchaseInfoEditor}
          label={`How the plants are purchased?`}
          showVendorLicense={true}
          vendor={this.state.vendor}
          purchase_order={this.state.purchase_order}
          vendor_invoice={this.state.vendor_invoice}
        />
      </React.Fragment>
    )
  }

  render() {
    const { id, plants, cultivation_batch, plant_uom } = this.state
    const { canUpdate, canCreate } = this.props
    let facility_id = '',
      facility_strain_id = ''

    if (cultivation_batch) {
      facility_id = cultivation_batch.facility_id
      facility_strain_id = cultivation_batch.facility_strain_id
    }

    const title = id ? 'Edit Harvest Batch' : 'Add Harvest Batch'
    const uom = plant_uom ? plant_uom.label : ''
    const total_weight = this.calculateTotalWeight(plants)
    const displayTotalWeight =
      total_weight <= 0 || !total_weight ? '--' : total_weight.toFixed(3)

    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">{title}</h1>
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
              <label className="f6 fw6 db mb1 gray ttc">
                Source cultivation Batch
              </label>
              <Select
                label={'Cultivation Batch ID'}
                options={this.batches}
                value={this.state.cultivation_batch}
                onChange={this.onCultivationBatchIdChanged}
                styles={reactSelectStyle}
              />
              <FieldError
                errors={this.state.errors}
                field="cultivation_batch_id"
              />
            </div>
          </div>

          {this.renderBatchDetails()}

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <TextInput
                label="Harvest Name"
                fieldname="harvest_name"
                value={this.state.harvest_name}
                onChange={this.onInputChanged}
                errors={this.state.errors}
              />
            </div>
          </div>

          <div className="ph4 mt0 mb3 flex">
            <div className="w-50">
              <label className="f6 fw6 db mb1 gray">Harvest Date</label>
              <DatePicker
                value={this.state.harvest_date}
                onChange={this.onHarvestedOnChanged}
              />
              <FieldError errors={this.state.errors} field="harvest_date" />
            </div>
          </div>
          <hr className="mt3 b--light-gray w-100" />

          <div className="ph4 mt3 mb0 flex">
            <div className="w-40">
              <label className="f6 fw6 db mb1 gray">Plant ID</label>
            </div>
            <div className="w-20 pl2">
              <label className="f6 fw6 db mb1 gray">Wet Wt</label>
            </div>
            <div className="w-20 pl2">
              <label className="f6 fw6 db mb1 gray">Waste Wt</label>
            </div>
            <div className="w-20 pl2 pr2" style={{ marginRight: '34px' }}>
              <label className="f6 fw6 db mb1 gray">UoM</label>
            </div>
          </div>

          {plants.map((x, index) => this.renderPlantIdFields(x, index))}

          <div className="ph4 mb2 mt0 flex">
            <div className="w-100 tr">
              <a
                className="link orange f6"
                href="#"
                style={{ height: '34px', lineHeight: '2em' }}
                onClick={this.onAddPlant}
              >
                Add plant
              </a>
            </div>
          </div>

          {(this.state.errors.plants || this.state.errors.plant_uom) && (
            <div className="ph4 mb3 flex">
              <div className="w-100">
                <FieldError errors={this.state.errors} field="plants" />
                <FieldError errors={this.state.errors} field="plant_uom" />
              </div>
            </div>
          )}

          <div className="ph4 mb3 mt2 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Total weight</label>
              <p className="f6 mt1 mb0">
                {displayTotalWeight} {uom}
              </p>
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex flex-column">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray">Location</label>
              <LocationPicker
                purpose="dry"
                facility_id={this.props.facility_id}
                location_id={this.state.location_id}
                onChange={this.onLocationChanged}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          {this.renderProcurementInfo(cultivation_batch)}
          {(canUpdate || canCreate) && (
            <React.Fragment>
              <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-end">
                <a
                  className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
                  href="#"
                  onClick={this.onSave}
                >
                  Save
                </a>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}
