import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import PurchaseInfo from '../shared/PurchaseInfo'
import LocationPicker from '../shared/LocationPicker'
import {
  TextInput,
  NumericInput,
  FieldError
} from '../../../../utils/FormHelpers'

class VegGroupEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // source
      plant_ids: '',
      plant_qty: 0,
      tray: '',
      cultivation_batch_id: '',
      planted_on: null,
      expected_harvested_on: null,
      mother_id: '',
      mother_location: '',
      is_bought: false,

      // Vendor/ source
      vendor_name: '',
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      invoice_no: '',

      // UI state
      isShowPlantQtyForm: false,
      errors: {}
    }

    this.locations = props.locations

    this.plantIdsTextArea = null
    this.setPlantIdsTextArea = element => {
      this.plantIdsTextArea = element
    }

    this.purchaseInfoEditor = null
    this.setPurchaseInfoEditor = element => {
      this.purchaseInfoEditor = element
    }

    this.onPlantIdsChanged = this.onPlantIdsChanged.bind(this)
    this.onTogglePlantQtyForm = this.onTogglePlantQtyForm.bind(this)
    this.onPlantQtyChanged = this.onPlantQtyChanged.bind(this)
    this.onTraySelected = this.onTraySelected.bind(this)
    this.onCultivationBatchIdChanged = this.onCultivationBatchIdChanged.bind(
      this
    )
    this.onPlantedOnChanged = this.onPlantedOnChanged.bind(this)
    this.onExpectedHarvestDateChanged = this.onExpectedHarvestDateChanged.bind(
      this
    )

    this.onIsBoughtChanged = this.onIsBoughtChanged.bind(this)
    this.onMotherIdChanged = this.onMotherIdChanged.bind(this)
    this.onMotherLocationChanged = this.onMotherLocationChanged.bind(this)
    this.onSave = this.onSave.bind(this)
  }

  onTogglePlantQtyForm() {
    this.setState({ isShowPlantQtyForm: !this.state.isShowPlantQtyForm })
  }

  onPlantIdsChanged(event) {
    this.setState({ plant_ids: event.target.value })
    const node = this.plantIdsTextArea
    const lines = (event.target.value.match(/\n/g) || []).length

    if (lines < 5) {
      node.style.height = 'auto'
      node.style.minHeight = ''
    } else if (lines >= 5 && lines < 15) {
      node.style.height = 40 + lines * 25 + 'px'
      node.style.minHeight = ''
    } else {
      node.style.minHeight = 40 + 15 * 25 + 'px'
      node.style.height = 'auto'
    }
  }

  onPlantQtyChanged(event) {
    this.setState({ plant_qty: event.target.value })
  }

  onTraySelected(item) {
    this.setState({ tray: item.t_id })
  }

  onCultivationBatchIdChanged(event) {
    this.setState({ cultivation_batch_id: event.target.value })
  }

  onPlantedOnChanged(date) {
    this.setState({ planted_on: date })
  }

  onExpectedHarvestDateChanged(date) {
    this.setState({ expected_harvested_on: date })
  }

  onIsBoughtChanged() {
    this.setState({ is_bought: !this.state.is_bought })
  }

  onMotherIdChanged(event) {
    this.setState({ mother_id: event.target.value })
  }

  onMotherLocationChanged(item) {
    this.setState({ mother_location: item.rm_id })
  }

  onSave(event) {
    const data = this.validateAndGetValues()
    if (data.isValid) {
      // alert('not valid')
      // call API
    }

    event.preventDefault()
  }

  validateAndGetValues() {
    const {
      isShowPlantQtyForm,
      plant_ids,
      plant_qty,
      tray,
      cultivation_batch_id,
      planted_on,
      is_bought,
      mother_id,
      mother_location
    } = this.state

    let errors = {}

    if (isShowPlantQtyForm) {
      if (parseInt(plant_qty) <= 0) {
        errors = {
          ...errors,
          plant_qty: ['Number of plant must be at least 1.']
        }
      }

      if (tray.length <= 0) {
        errors = { ...errors, tray: ['Plant location is required.'] }
      }
    } else {
      if (plant_ids.length <= 0) {
        errors = { ...errors, plant_ids: ['Plant ID is required.'] }
      }
    }

    if (cultivation_batch_id.length <= 0) {
      errors = {
        ...errors,
        cultivation_batch_id: ['Cultivation batch ID is required.']
      }
    }

    if (planted_on === null) {
      errors = { ...errors, planted_on: ['Planted date is required.'] }
    }

    const strainData = this.props.onValidateParent()

    let purchaseData = { idValid: true }
    if (is_bought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    } else {
      if (mother_id.length <= 0) {
        errors = { ...errors, mother_id: ['Mother ID is required.'] }
      }

      if (mother_location.length <= 0) {
        errors = {
          ...errors,
          mother_location: ['Mother plant location is required.']
        }
      }
    }

    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 &&
      strainData.isValid &&
      purchaseData.isValid

    if (!isValid) {
      this.setState({ errors })
    }

    const data = {
      ...purchaseData,
      isValid
    }

    return data
  }

  renderPlantIdForm() {
    if (this.state.isShowPlantQtyForm) return null
    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              If you have multiple batches for the same strain, you can create
              another entry for next batch. Each plant has its own{' '}
              <strong>Plant ID</strong>.
            </p>
            <p className="f7 fw4 gray mt0 mb2 pa0 lh-copy">
              If you already have them, paste Plant IDs with its corresponding
              tray ID like below:
            </p>
            <textarea
              ref={this.setPlantIdsTextArea}
              rows="5"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001, Tray0001&#10;Plant0002, Tray0001&#10;Plant0003, Tray0002&#10;Plant0004, Tray0002"
              value={this.state.plant_ids}
              onChange={this.onPlantIdsChanged}
            />
            <FieldError errors={this.state.errors} field="plant_ids" />
          </div>
        </div>
        <div className="ph4 mb4 flex justify-end">
          <a
            href="#"
            onClick={this.onTogglePlantQtyForm}
            className="fw4 f7 link dark-blue"
          >
            Don't have Plant ID? Click here to generate.
          </a>
        </div>
      </React.Fragment>
    )
  }

  renderPlantQtyForm() {
    if (!this.state.isShowPlantQtyForm) return null
    return (
      <React.Fragment>
        <div className="ph4 mb2 mt0 flex">
          <div className="w-50">
            <NumericInput
              label={'Number of plants'}
              value={this.state.plant_qty}
              onChange={this.onPlantQtyChanged}
            />
            <FieldError errors={this.state.errors} field="plant_qty" />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Tray ID</label>
            <LocationPicker
              mode="vegTray"
              locations={this.locations}
              value={this.state.tray}
              onChange={this.onTraySelected}
            />
            <FieldError errors={this.state.errors} field="tray" />
          </div>
        </div>
        <div className="ph4 mb2 flex justify-end">
          <a
            href="#"
            onClick={this.onTogglePlantQtyForm}
            className="fw4 f7 link dark-blue"
          >
            Cancel
          </a>
        </div>
        <div className="ph4 mb4 flex">
          <p className="w-100 ma0 f7 fw4 gray">
            PlantID will be generated for each plant after saving.
          </p>
        </div>
      </React.Fragment>
    )
  }

  renderProcurementInfo() {
    if (!this.state.is_bought) {
      return (
        <React.Fragment>
          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label={'Mother plant ID'}
                value={this.state.mother_id}
                onChange={this.onMotherIdChanged}
                errors={this.state.errors}
                errorField="mother_id"
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">
                Mother location ID
              </label>
              <LocationPicker
                mode="mother"
                locations={this.locations}
                value={this.state.mother_location}
                onChange={this.onMotherLocationChanged}
              />
              <FieldError errors={this.state.errors} field="mother_location" />
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <PurchaseInfo
          ref={this.setPurchaseInfoEditor}
          showLabel={false}
          vendor_name={this.state.vendor_name}
          vendor_no={this.state.vendor_no}
          address={this.state.address}
          vendor_state_license_num={this.state.vendor_state_license_num}
          vendor_state_license_expiration_date={
            this.state.vendor_state_license_expiration_date
          }
          vendor_location_license_num={this.state.vendor_location_license_num}
          vendor_location_license_expiration_date={
            this.state.vendor_location_license_expiration_date
          }
          purchase_date={this.state.purchase_date}
          invoice_no={this.state.invoice_no}
        />
      )
    }
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 mt3 mb3">
          <span className="f6 fw6 dark-gray">Plant IDs</span>
        </div>

        {this.renderPlantIdForm()}
        {this.renderPlantQtyForm()}

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Cultivation Batch ID'}
              value={this.state.cultivation_batch_id}
              onChange={this.onCultivationBatchIdChanged}
            />
            <FieldError
              errors={this.state.errors}
              field="cultivation_batch_id"
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">Planted On</label>
            <DatePicker
              value={this.state.planted_on}
              onChange={this.onPlantedOnChanged}
            />
            <FieldError errors={this.state.errors} field="planted_on" />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray">Expected Harvest Date</label>
            <DatePicker
              value={this.state.expected_harvested_on}
              onChange={this.expected_harvested_on}
            />
          </div>
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">
            Where the mother plants are from?
          </span>
        </div>
        <div className="ph4 mb3 flex justify-between">
          <label className="f6 fw6 db mb1 gray">The plants are purchased</label>
          <input
            className="toggle toggle-default"
            type="checkbox"
            value="1"
            id="is_bought_input"
            onChange={this.onIsBoughtChanged}
          />
          <label className="toggle-button" htmlFor="is_bought_input" />
        </div>

        {this.renderProcurementInfo()}

        <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
          <a
            className="db tr pv2 ph3 bn br2 ttu tracked link dim f6 fw6 orange"
            href="#"
            onClick={this.props.onExitCurrentEditor}
          >
            Save draft
          </a>
          <a
            className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
            href="#"
            onClick={this.onSave}
          >
            Preview &amp; Save
          </a>
        </div>
      </React.Fragment>
    )
  }
}

export default VegGroupEditor
