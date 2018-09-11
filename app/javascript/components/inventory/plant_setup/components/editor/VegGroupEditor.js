import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'

import PurchaseInfo from '../shared/PurchaseInfo'
import LocationPicker from '../shared/LocationPicker'
import StrainPicker from '../shared/StrainPicker'
import {
  TextInput,
  NumericInput,
  FieldError
} from '../../../../utils/FormHelpers'
import reactSelectStyle from '../../../../utils/reactSelectStyle'
import setupVegs from '../../actions/setupVegs'
import MotherPicker from '../shared/MotherPicker'

class VegGroupEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',

      // source
      veg_ids: '',
      plant_qty: 0,
      tray: '',
      cultivation_batch_id: '',
      planted_on: null,
      expected_harvested_on: null,
      // mother_id: '',
      // mother_location: '',
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
      errors: {},
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

    this.strainPicker = React.createRef()
    this.motherPicker = React.createRef()
  }

  onTogglePlantQtyForm = (event) => {
    this.setState({ isShowPlantQtyForm: !this.state.isShowPlantQtyForm })
    event.preventDefault()
  }

  onPlantIdsChanged = (event) => {
    this.setState({ veg_ids: event.target.value })
    const node = this.plantIdsTextArea
    const lines = (event.target.value.match(/\n/g) || []).length

    if (lines < 3) {
      node.style.height = 'auto'
      node.style.minHeight = ''
    } else if (lines >= 3 && lines < 15) {
      node.style.height = 40 + lines * 25 + 'px'
      node.style.minHeight = ''
    } else {
      node.style.minHeight = 40 + 15 * 25 + 'px'
      node.style.height = 'auto'
    }
  }

  onPlantQtyChanged = (event) => {
    this.setState({ plant_qty: event.target.value })
  }

  onTraySelected = (item) => {
    this.setState({ tray: item.t_id })
  }

  onCultivationBatchIdChanged = (event) => {
    this.setState({ cultivation_batch_id: event.target.value })
  }

  onPlantedOnChanged = (date) => {
    this.setState({ planted_on: date })
  }

  onExpectedHarvestDateChanged = (date) => {
    this.setState({ expected_harvested_on: date })
  }

  onIsBoughtChanged = () => {
    this.setState({ is_bought: !this.state.is_bought })
  }

  onStrainSelected = (data) => {
    this.setState({
      strain: data.strain,
      strain_type: data.strain_type
    })
  }

  onSave = (event) => {
    const data = this.validateAndGetValues()
    const { errors, isValid, ...payload } = data
    // console.log(data)

    if (isValid) {
      setupVegs(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
        }
      })
    }

    event.preventDefault()
  }

  reset() {
    this.setState({
      strain: '',
      strain_type: '',
      veg_ids: '',
      plant_qty: 0,
      tray: '',
      cultivation_batch_id: '',
      planted_on: null,
      expected_harvested_on: null,
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
    })

    this.strainPicker.current.reset()
  }

  validateAndGetValues() {
    const {
      strain,
      strain_type,
      isShowPlantQtyForm,
      veg_ids,
      plant_qty,
      tray,
      cultivation_batch_id,
      planted_on,
      is_bought
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
      if (veg_ids.length <= 0) {
        errors = { ...errors, veg_ids: ['Plant ID is required.'] }
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

    let purchaseData = { isValid: true }
    if (is_bought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    const { isValid: strainValid } = this.strainPicker.current.validate()
    const { isValid: motherValid, mother_id } = this.motherPicker.current.getValues()

    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 &&
      strainValid &&
      purchaseData.isValid

    if (!isValid) {
      this.setState({ errors })
    }

    const data = {
      strain,
      strain_type,
      isShowPlantQtyForm,
      veg_ids,
      plant_qty,
      tray,
      cultivation_batch_id,
      planted_on,
      is_bought,
      mother_id,
      ...purchaseData,
      isValid
    }

    return data
  }

  renderPlantIdForm() {
    if (this.state.isShowPlantQtyForm) {
      return (
        <React.Fragment>
          <div className="w-100 mt2 mb3">
            <span className="f6 fw6 gray">Veg Plant IDs</span>
          </div>
          <div className="mb3 flex">
            <p className="w-100 ma0 f7 fw4 gray">
              PlantID will be generated for each plant after saving.
            </p>
          </div>
          <div className="w-100 flex">
            <div className="w-50">
              <NumericInput
                label={'Number of plant IDs to generate'}
                value={this.state.plant_qty}
                onChange={this.onPlantQtyChanged}
              />
              <FieldError errors={this.state.errors} field="plant_qty" />
            </div>
            <div className="w-50 mt0 mb2 flex pl3 items-end">
              <a
                href="#"
                onClick={this.onTogglePlantQtyForm}
                className="fw4 f7 link dark-blue"
              >
                Cancel
              </a>
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <div className="w-100 mt2 mb2">
            <span className="f6 fw6 gray">Veg Plant IDs</span>
          </div>

          <div className="w-100 mb2">
 
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              If you already have them, paste Plant IDs with its corresponding
              tray ID like below:
            </p>
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              <a
                href="#"
                onClick={this.onTogglePlantQtyForm}
                className="fw4 f7 link dark-blue"
              >
                Don't have Plant ID? Click here to generate.
              </a>
            </p>
          </div>
          
          <div className="w-100">
            <textarea
              ref={this.setPlantIdsTextArea}
              rows="3"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001&#10;Plant0002&#10;Plant0003"
              value={this.state.veg_ids}
              onChange={this.onPlantIdsChanged}
            />
            <FieldError errors={this.state.errors} field="veg_ids" />
          </div>
        </React.Fragment>
      )
    }
  }

  renderProcurementInfo() {
    if (!this.state.is_bought) {
      return null
    }
    else {     
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
        <StrainPicker
          ref={this.strainPicker}
          onStrainSelected={this.onStrainSelected}
        />
        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mt3 mb3 flex">
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
          <div className="w-50 pl3">
            <MotherPicker 
              ref={this.motherPicker} 
              strain={this.state.strain} 
              key={this.state.strain} 
            />
          </div>
        </div>

        <div className="ph4 mb3 flex flex-column">
          <div className="w-100 mb3">
            <label className="f6 fw6 db mb1 gray ttc">Tray ID</label>
            <LocationPicker
              mode="vegTray"
              locations={this.locations}
              value={this.state.tray}
              onChange={this.onTraySelected}
            />
            <FieldError errors={this.state.errors} field="tray" />
          </div>
          {this.renderPlantIdForm()}
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
              onChange={this.onExpectedHarvestDateChanged}
            />
            <FieldError
              errors={this.state.errors}
              field="expected_harvested_on"
            />
          </div>
        </div>

        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Plant Origin?</span>
        </div>
        <div className="ph4 mb3 flex justify-between">
          <label className="f6 fw6 db mb1 gray">The plants are purchased</label>
          <input
            className="toggle toggle-default"
            type="checkbox"
            value="1"
            id="is_bought_input"
            checked={this.state.is_bought}
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
      </React.Fragment>
    )
  }
}

export default VegGroupEditor
