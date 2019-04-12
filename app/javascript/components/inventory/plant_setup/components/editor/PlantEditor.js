import React from 'react'
import PropTypes from 'prop-types'


import {
  TextInput,
  FieldError,
  CalendarPicker
} from '../../../../utils/FormHelpers'
import Select from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'

import PurchaseInfo from '../shared/PurchaseInfo'
import setupPlants from '../../actions/setupPlants'
import reactSelectStyle from '../../../../utils/reactSelectStyle'
import getPlant from '../../actions/getPlant'
import searchPlants from '../../actions/searchPlants'
import { LocationPicker, BATCH_SOURCE } from '../../../../utils'
import { launchBarcodeScanner } from '../../../../utils/BarcodeScanner'

class PlantEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.scanner = null

    if (props.growth_stage === 'veg') {
      this.batches = this.props.cultivation_batches
        .filter(
          x =>
            ['veg', 'veg1', 'veg2'].indexOf(
              x.attributes.current_growth_stage
            ) >= 0
        )
        .map(x => ({ id: x.id, ...x.attributes }))
    } else {
      this.batches = this.props.cultivation_batches
        .filter(
          x => x.attributes.current_growth_stage === this.props.growth_stage
        )
        .map(x => ({ id: x.id, ...x.attributes }))
    }

    this.locations = this.props.locations.filter(x => x.t_id.length > 0)

    // Converting to callback ref because purchase info editor is hidding and showing.
    // This will cause the standard way to set ref to be broken / undefined.
    this.purchaseInfoEditor = null
    this.setPurchaseInfoEditor = element => {
      this.purchaseInfoEditor = element
    }

    this.plantIDTextArea = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-close', () => {
      if (this.scanner) {
        this.scanner.destroy()
      }
    })

    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id

      if (!id) {
        this.setState(this.resetState())
      } else {
        getPlant(id, 'vendor_invoice, vendor, purchase_order, mother').then(
          ({ status, data }) => {
            if (status != 200) {
              return
            }

            const invoice = data.attributes.vendor_invoice
            const purchase_order = data.attributes.purchase_order
            let invoice_attr = {}
            if (invoice) {
              invoice_attr = {
                purchase_date: new Date(invoice.invoice_date),
                invoice_no: invoice.invoice_no,
                purchase_order_no: purchase_order.purchase_order_no
              }
            }

            const vendor = data.attributes.vendor
            let vendor_attr = {}
            if (vendor) {
              vendor_attr = {
                vendor_id: vendor.id,
                vendor_name: vendor.name,
                vendor_no: vendor.vendor_no,
                address: vendor.address,
                vendor_state_license_num: vendor.state_license_num,
                vendor_state_license_expiration_date: new Date(
                  vendor.state_license_expiration_date
                ),
                vendor_location_license_num: vendor.location_license_num,
                vendor_location_license_expiration_date: new Date(
                  vendor.location_license_expiration_date
                )
              }
            }

            const batch = this.batches.find(
              x => x.id === data.attributes.cultivation_batch_id
            )

            let motherOption = null
            if (data.attributes.mother) {
              motherOption = {
                value: data.attributes.mother.id,
                label: data.attributes.mother.plant_id
              }
            }

            let lot_number = null
            if (data.attributes.lot_number) {
              lot_number = {
                value: data.attributes.lot_number,
                label: data.attributes.lot_number
              }
            }

            this.setState({
              ...this.resetState(),
              id: data.id,
              cultivation_batch_id: batch.id,
              facility_strain_id: batch.facility_strain_id,
              facility_id: batch.facility_id,
              plant_ids: data.attributes.plant_id,
              plant_qty: 0,
              location_id: data.attributes.location_id,
              planting_date: new Date(data.attributes.planting_date),
              motherOption: motherOption,
              lot_number,

              // UI states
              strain_name: batch.strain_name,
              start_date: new Date(batch.start_date),
              facility: batch.facility,
              batch_source: batch.batch_source,
              isBought: batch.batch_source === BATCH_SOURCE.PURCHASED,

              // relationships
              ...vendor_attr,
              ...invoice_attr
            })

            this.loadLotNumbers(batch.id)
          }
        )
      }
    })
  }

  resetState() {
    return {
      id: '',
      cultivation_batch_id: '',
      facility_strain_id: '',
      facility_id: '',
      plant_ids: '',
      plant_qty: 0,
      location_id: '',
      planting_date: null,
      lot_number: null,
      defaultLotNumbers: [],
      // purchase info
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
      invoice_no: '',

      // UI states
      strain_name: '',
      start_date: '',
      batch_source: '',
      facility: '',
      isBought: false,
      errors: {},
      motherOption: {},
      showScanner: false,
      scannerReady: false
    }
  }

  onCloneIdsChanged = event => {
    this.setState({ plant_ids: event.target.value }, this.resizePlantIDTextArea)
  }

  resizePlantIDTextArea = () => {
    const lines = (this.state.plant_ids.match(/\n/g) || []).length
    const node = this.plantIDTextArea.current

    if (!node) {
      return
    }

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
    this.setState({ location_id: event.location_id })
  }

  onPlantedOnChanged = date => {
    this.setState({ planting_date: date })
  }

  onIsBoughtChanged = () => {
    this.setState({ isBought: !this.state.isBought })
  }

  onCultivationBatchIdChanged = item => {
    let { planting_date } = this.state
    if (!planting_date) {
      planting_date = new Date(item.start_date)
    }

    this.setState({
      cultivation_batch_id: item.value,
      facility_id: item.facility_id,
      facility_strain_id: item.facility_strain_id,
      strain_name: item.strain_name,
      start_date: new Date(item.start_date),
      facility: item.facility,
      planting_date,
      motherOption: null,
      batch_source: item.batch_source,
      isBought: item.batch_source === BATCH_SOURCE.PURCHASED,
      showScanner: false
    })

    this.loadLotNumbers(item.value)
  }

  loadLotNumbers = batchId => {
    const payload = {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({ batch_id: batchId }),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }

    fetch('/api/v1/plants/lot_numbers', payload)
      .then(x => x.json())
      .then(data => {
        const defaultLotNumbers = data.lot_numbers.map(x => ({
          value: x,
          label: x
        }))
        this.setState({ defaultLotNumbers })
      })
  }

  onloadLotNumbers = () => {
    this.loadLotNumbers(this.state.cultivation_batch_id)
  }

  onMotherIdChanged = item => {
    if (item === []) {
      this.setState({ motherOption: null })
    } else {
      this.setState({ motherOption: item })
    }
  }

  onLotNoChanged = lot_number => {
    this.setState({ lot_number })
  }

  onSave = event => {
    const data = this.validateAndGetValues()
    const { errors, isValid, ...payload } = data

    if (isValid) {
      setupPlants(payload).then(({ status, data }) => {
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

  reset() {
    this.setState(this.resetState())
  }

  validateAndGetValues() {
    const {
      id,
      cultivation_batch_id,
      plant_ids,
      location_id,
      planting_date,
      isBought,
      motherOption,
      vendor_id
    } = this.state

    let { lot_number } = this.state

    const mother_id = motherOption ? motherOption.value : ''
    lot_number = lot_number ? lot_number.value : ''

    let errors = {}

    if (cultivation_batch_id.length === 0) {
      errors.cultivation_batch_id = ['Cultivation batch ID is required.']
    }

    if (plant_ids.trim().length <= 0) {
      errors.plant_ids = ['Plant ID is required.']
    }

    if (planting_date === null) {
      errors.planting_date = ['Planted on date is required.']
    }

    if (location_id.length === 0) {
      errors.location_id = ['Location of the clones is required.']
    }

    let purchaseData = { isValid: true }
    if (isBought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 && purchaseData.isValid

    const data = {
      ...purchaseData,
      vendor_id,
      id,
      cultivation_batch_id,
      plant_ids,
      location_id,
      planting_date: planting_date && planting_date.toISOString(),
      mother_id,
      isBought,
      lot_number,
      errors,
      isValid
    }

    if (!data.isValid) {
      this.setState({ errors: data.errors })
    }
    return data
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
      const mothers = data.data.map(x => ({
        label: x.attributes.plant_id,
        value: x.id
      }))

      return mothers
    })
  }

  renderProcurementInfo() {
    if (!this.state.isBought) return null
    return (
      <React.Fragment>
        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Clone Purchase Info</span>
        </div>

        <PurchaseInfo
          key={this.state.id}
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
          purchase_order_no={this.state.purchase_order_no}
        />
      </React.Fragment>
    )
  }

  renderPlantIdTextArea() {
    let style = {}
    if (this.state.isShowPlantIdGenerator) {
      style = { display: 'none' }
    }

    if (this.state.id.length > 0) {
      return (
        <div className="ph4 mb2 flex" style={style}>
          <div className="w-100">
            <TextInput
              label="Plant ID"
              fieldname="plant_ids"
              onChange={this.onCloneIdsChanged}
              value={this.state.plant_ids}
              errors={this.state.errors}
            />
          </div>
        </div>
      )
    }

    return (
      <React.Fragment>
        <div className="ph4 mt3 mb1" style={style}>
          <span className="f6 fw6 dark-gray">Plant IDs</span>
        </div>
        <div className="ph4 mb2 flex" style={style}>
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb2 pa0 lh-copy">
              Each clone has its own <strong>Plant ID</strong>. If you already
              have them, paste them below.
            </p>
            <textarea
              rows="3"
              ref={this.plantIDTextArea}
              value={this.state.plant_ids}
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001&#10;Plant0002&#10;Plant0003"
              onChange={this.onCloneIdsChanged}
            />
            <FieldError errors={this.state.errors} field="plant_ids" />
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
            <p className="f6 mt0 mb2 tr">
              {this.state.start_date.toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="ph4 mt2 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Batch source</label>
            <p className="f6 mt0 mb2">{this.state.batch_source}</p>
          </div>
        </div>
        <hr className="mt3 m b--black-10 w-100" />
      </React.Fragment>
    )
  }

  onShowScanner = e => {
    this.setState(
      { showScanner: !this.state.showScanner, scannerReady: false },
      () => {
        if (this.state.showScanner) {
          launchBarcodeScanner({
            licenseKey: this.props.scanditLicense,
            targetId: 'scandit-barcode-picker',
            onScan: result => {
              this.setState({
                plant_ids: result + '\n' + this.state.plant_ids
              })
              this.resizePlantIDTextArea()
            },
            onReady: () => {
              this.setState({ scannerReady: true })
            }
          }).then(scanner => (this.scanner = scanner))
        } else {
          this.scanner.destroy()
        }
      }
    )

    e.preventDefault()
  }

  renderTitle() {
    if (this.props.growth_stage === 'clone') {
      return 'Add Clone'
    } else if (['veg', 'veg1', 'veg2'].indexOf(this.props.growth_stage) >= 0) {
      return 'Add Vegs'
    } else if (this.props.growth_stage === 'flower') {
      return 'Add Flowers'
    }
    return ''
  }

  locationPurpose = () => {
    if (this.props.growth_stage.startsWith('veg')) {
      return 'veg,veg1,veg2'
    }
    return this.props.growth_stage
  }

  render() {
    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              {this.renderTitle()}
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

          <div className="ph4 mt3 mb3 flex flex-column">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Lot No</label>
              <AsyncCreatableSelect
                isClearable
                placeholder="Search lot no..."
                onChange={this.onLotNoChanged}
                value={this.state.lot_number}
                styles={reactSelectStyle}
                defaultOptions={this.state.defaultLotNumbers}
              />
            </div>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray">Location</label>
              <LocationPicker
                purpose={this.locationPurpose()}
                facility_id={this.props.facility_id}
                location_id={this.state.location_id}
                onChange={this.onLocationChanged}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          {this.renderPlantIdTextArea()}

          <div className="ph4 mt0 flex flex-column">
            <div className="w-100 mb2 flex justify-end">
              <a
                href=""
                onClick={this.onShowScanner}
                className="ph2 pv2 btn--secondary f6 link"
              >
                {this.state.showScanner ? 'Hide scanner' : 'Scan Plant ID'}
              </a>
            </div>
            <div className="w-100">
              <div id="scandit-barcode-picker" className="scanner" />
            </div>
            <div className="w-100 tc">
              {this.state.showScanner && this.state.scannerReady && (
                <div className="f7 gray">Scanner is ready!</div>
              )}
              {this.state.showScanner && !this.state.scannerReady && (
                <div className="f7 gray">Loading scanner...</div>
              )}
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
                value={this.state.motherOption}
                styles={reactSelectStyle}
              />
              <FieldError errors={this.state.errors} field="mother_id" />
            </div>
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

PlantEditor.propTypes = {
  cultivation_batches: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  growth_stage: PropTypes.string.isRequired,
  scanditLicense: PropTypes.string.isRequired
}

export default PlantEditor
