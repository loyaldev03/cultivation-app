import React from 'react'
import PropTypes from 'prop-types'
import {
  TextInput,
  NumericInput,
  FieldError,
  CalendarPicker
} from '../../../../utils/FormHelpers'
import Select from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import LocationPicker from '../../../../utils/LocationPicker2'
import PurchaseInfo from '../shared/PurchaseInfo'
import setupClones from '../../actions/setupClones'
import reactSelectStyle from '../../../../utils/reactSelectStyle'
import { searchPlants } from '../../actions/loadPlants'

class CloneEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.batches = this.props.cultivation_batches.map(x => ({
      id: x.id,
      ...x.attributes
    }))
    this.locations = this.props.locations

    // Converting to callback ref because purchase info editor is hidding and showing.
    // This will cause the standard way to set ref to be broken / undefined.
    this.purchaseInfoEditor = null
    this.setPurchaseInfoEditor = element => {
      this.purchaseInfoEditor = element
    }

    this.cloneIdTextArea = React.createRef()
    // Callback ref to get instance of html DOM: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    // Getting a ref to textarea in order to adjust height according to content.
    // this.setCloneIdTextArea = element => {
    //   this.cloneIdTextArea = element
    // }
  }

  resetState() {
    return {
      cultivation_batch_id: '',
      facility_strain_id: '',
      facility_id: '',
      plant_ids: '',
      plant_qty: 0,

      location_id: '',
      planting_date: null,
      // purchase info
      vendor_name: '',
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: '',
      invoice_no: '',

      // UI states
      strain_name: '',
      start_date: '',
      facility: '',
      isBought: false,
      // isShowPlantIdGenerator: false,
      errors: {}
    }
  }

  onCloneIdsChanged = event => {
    this.setState({ plant_ids: event.target.value })
    const lines = (event.target.value.match(/\n/g) || []).length
    const node = event.target

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

  onLocationChanged = event => {
    this.setState({ location_id: event.value })
  }

  onPlantedOnChanged = date => {
    this.setState({ planting_date: date })
  }

  onIsBoughtChanged = () => {
    this.setState({ isBought: !this.state.isBought })
  }

  onCultivationBatchIdChanged = item => {
    console.log(item)
    let { planting_date } = this.state
    if (!planting_date) {
      planting_date = new Date(item.start_date)
    }

    this.setState({
      cultivation_batch_id: item.value,
      facility_id: item.facility_id,
      facility_strain_id: item.facility_strain_id,
      strain_name: item.strain_name,
      start_date: new Date(item.start_date).toLocaleDateString(),
      facility: item.facility,
      mother_id: '',
      planting_date
    })
  }

  onMotherIdChanged = item => {
    this.setState({ mother_id: item.value })
  }

  onSave = event => {
    const data = this.validateAndGetValues()
    const { errors, isValid, ...payload } = data

    if (isValid) {
      setupClones(payload).then(({ status, data }) => {
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
    this.setState(this.resetState())
    this.strainPicker.current.reset()
  }

  validateAndGetValues() {
    let {
      cultivation_batch_id,
      plant_ids,
      location_id,
      planting_date,
      vendor_name,
      vendor_no,
      address,
      vendor_state_license_num,
      vendor_state_license_expiration_date,
      vendor_location_license_num,
      vendor_location_license_expiration_date,
      purchase_date,
      invoice_no,
      isBought
    } = this.state

    let errors = {}

    if (cultivation_batch_id.length === 0) {
      errors = {
        ...errors,
        cultivation_batch_id: ['Cultivation batch ID is required.']
      }
    }

    if (plant_ids.trim().length <= 0) {
      errors = {
        ...errors,
        plant_ids: ['Plant ID is required.']
      }
    }

    if (planting_date === null) {
      errors = { ...errors, planted_on: ['Planted on date is required.'] }
    }

    if (location_id.length === 0) {
      errors = {
        ...errors,
        location_id: ['Location of the clones is required.']
      }
    }

    const { mother_id } = this.motherPicker.current.getValues(false)

    let purchaseData = { isValid: true }
    if (isBought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 && purchaseData.isValid

    // Purchase data should have:
    //
    // vendor_name: '',
    // vendor_no: '',
    // address: '',
    // vendor_state_license_num: '',
    // vendor_state_license_expiration_date: null,
    // vendor_location_license_num: '',
    // vendor_location_license_expiration_date: null,
    // purchase_date: '',
    // invoice_no: '',

    const data = {
      ...purchaseData,
      strain,
      strain_type,
      cultivation_batch_id,
      clone_ids,
      location_id,
      plant_qty,
      mother_id,
      planted_on: planted_on && planted_on.toISOString(),
      expected_harvested_on:
        expected_harvested_on && expected_harvested_on.toISOString(),
      isBought,
      errors,
      isValid
    }

    if (!data.isValid) {
      this.setState({ errors: data.errors })
    }
    return data
  }

  renderProcurementInfo() {
    if (!this.state.isBought) return null
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

  renderPlantIdTextArea() {
    let style = {}
    if (this.state.isShowPlantIdGenerator) {
      style = { display: 'none' }
    }

    return (
      <React.Fragment>
        <div className="ph4 mt3 mb1" style={style}>
          <span className="f6 fw6 gray">Plant IDs</span>
        </div>
        <div className="ph4 mb2 flex" style={style}>
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb2 pa0 lh-copy">
              Each clone has its own <strong>Plant ID</strong>. If you already
              have them, paste them below.
            </p>
            <textarea
              rows="3"
              value={this.state.plant_ids}
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001&#10;Plant0002&#10;Plant0003"
              onChange={this.onCloneIdsChanged}
            />
            <FieldError errors={this.state.errors} field="clone_ids" />
          </div>
        </div>
      </React.Fragment>
    )
  }

  renderBatchDetails() {
    if (
      !this.state.cultivation_batch_id ||
      this.state.cultivation_batch_id.length <= 0
    )
      return null

    return (
      <React.Fragment>
        <div className="ph4 mt3 flex">
          <div className="w-60">
            <label className="f6 fw6 db mb1 gray ttc">Strain</label>
            <p className="f6 mt0 mb2">{this.state.strain_name}</p>
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc tr">
              Batch start date
            </label>
            <p className="f6 mt0 mb2 tr">{this.state.start_date}</p>
          </div>
        </div>
        <hr className="mt3 m b--black-10 w-100" />
      </React.Fragment>
    )
  }

  loadMothers = inputValue => {
    if (this.state.facility_strain_id.length <= 0) {
      return new Promise(resolve => resolve([]))
    }

    return searchPlants(
      'mother',
      this.state.facility_strain_id,
      inputValue
    ).then(data => {
      return data.data.map(x => ({
        label: x.attributes.plant_id,
        value: x.id
      }))
    })
  }

  render() {
    const widthStyle = this.props.isOpened
      ? { width: '500px' }
      : { width: '0px' }

    return (
      <div className="rc-slide-panel" data-role="sidebar" style={widthStyle}>
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Clone</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                Cultivation Batch
              </label>
              <Select
                label={'Cultivation Batch ID'}
                options={this.batches}
                key={this.state.cultivation_batch_id}
                defaultValue={this.batches.find(
                  x => x.value === this.state.cultivation_batch_id
                )}
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
          {this.renderPlantIdTextArea()}
          <div className="ph4 mt3 flex">
            <div className="w-100">
              <LocationPicker
                key={this.state.facility_id}
                mode="clone"
                facility_id={this.state.facility_id}
                onChange={this.onLocationChanged}
                locations={this.locations}
              />
            </div>
          </div>
          <div className="ph4 mt3 flex">
            <div className="w-50">
              <label className="f6 fw6 db mb1 gray ttc">Planted On</label>
              <CalendarPicker
                value={this.state.planting_date}
                onChange={this.onPlantedOnChanged}
              />
              <FieldError errors={this.state.errors} field="planting_date" />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Mother Plant</label>
              <AsyncSelect
                isDisabled={this.state.facility_strain_id.length <= 0}
                key={this.state.cultivation_batch_id}
                loadOptions={this.loadMothers}
                defaultOptions
                onChange={this.onMotherIdChanged}
                styles={reactSelectStyle}
              />
              <FieldError errors={this.state.errors} field="mother_id" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mb3 mt3">
            <span className="f6 fw6 dark-gray">Plant Origin?</span>
          </div>
          <div className="ph4 mb3 flex justify-between">
            <label className="f6 fw6 db mb1 gray">Clones are purchased</label>
            <input
              className="toggle toggle-default"
              type="checkbox"
              value="1"
              id="is_bought_input"
              checked={this.state.isBought}
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
        </div>
      </div>
    )
  }
}

CloneEditor.propTypes = {
  cultivation_batches: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired
}

export default CloneEditor
