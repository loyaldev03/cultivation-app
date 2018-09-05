import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { NumericInput, FieldError } from '../../../../utils/FormHelpers'
import StorageInfo from '../shared/StorageInfo'
import PurchaseInfo from '../shared/PurchaseInfo'
import setupMother from '../../actions/setupMother'
import StrainPicker from '../shared/StrainPicker'

class MotherEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',

      // source
      plant_ids: '',
      plant_qty: 0,
      planted_on: null,
      // mother_id: '',

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

      // Storage location
      room: '',
      room_id: '',
      section_name: '',
      section_id: '',

      // UI states
      isShowPlantQtyForm: false,
      isBought: false,
      errors: {}
    }

    this.plantIdsTextArea = null
    // Callback ref to get instance of html DOM: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    // Getting a ref to textarea in order to adjust height according to content.
    this.setPlantIdsTextArea = element => {
      this.plantIdsTextArea = element
    }

    this.purchaseInfoEditor = null
    this.setPurchaseInfoEditor = element => {
      this.purchaseInfoEditor = element
    }

    this.storageInfoEditor = React.createRef()
    this.strainPicker = React.createRef()

    this.onChangePlantIds = this.onChangePlantIds.bind(this)
    this.onChangeGeneratorPlantQty = this.onChangeGeneratorPlantQty.bind(this)
    this.onPlantedOnChanged = this.onPlantedOnChanged.bind(this)
    this.onToggleGeneratePlantId = this.onToggleGeneratePlantId.bind(this)
    this.onIsBoughtChanged = this.onIsBoughtChanged.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onStrainSelected = this.onStrainSelected.bind(this)
  }

  onChangePlantIds(event) {
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

  onPlantedOnChanged(date) {
    this.setState({ planted_on: date })
  }

  onChangeGeneratorPlantQty(event) {
    this.setState({ plant_qty: event.target.value })
  }

  onToggleGeneratePlantId(event) {
    this.setState({
      isShowPlantQtyForm: !this.state.isShowPlantQtyForm
    })
    if (event) event.preventDefault()
  }

  onStrainSelected(data) {
    this.setState({
      strain: data.strain,
      strain_type: data.strain_type
    })
  }

  onIsBoughtChanged() {
    this.setState({ isBought: !this.state.isBought })
  }

  onSave() {
    const { errors, isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      setupMother(payload).then(({ status, data }) => {
        // console.log(data)
        // console.log(status)
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
      plant_ids: '',
      plant_qty: 0,
      planted_on: null,
      // mother_id: '',
      vendor_name: '',
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      invoice_no: '',
      room: '',
      room_id: '',
      section_name: '',
      section_id: '',
      isShowPlantQtyForm: false,
      isBought: false,
      errors: {}
    })

    this.storageInfoEditor.current.reset()
    this.strainPicker.current.reset()
  }

  validateAndGetValues() {
    const {
      isShowPlantQtyForm,
      strain,
      strain_type,
      plant_ids,
      plant_qty,
      planted_on,
      isBought
    } = this.state

    let errors = {}

    if (isShowPlantQtyForm) {
      if (parseInt(plant_qty) <= 0) {
        errors = { ...errors, plant_qty: ['Quantity must be at least 1.'] }
      }
    } else if (plant_ids.length <= 0) {
      errors = { ...errors, plant_ids: ['Plant ID is required.'] }
    }

    if (planted_on === null) {
      errors = { ...errors, planted_on: ['Planted on date is required.'] }
    }

    let purchaseData = { isValid: true }
    if (isBought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    const locationData = this.storageInfoEditor.current.getValues()

    // console.log(`strainData.isValid: ${strainData.isValid}`)
    // console.log(`purchaseData.isValid: ${purchaseData.isValid}`)
    // console.log(`locationData.isValid: ${locationData.isValid}`)

    const { isValid: strainValid } = this.strainPicker.current.validate()

    const isValid =
      strainValid &&
      purchaseData.isValid &&
      locationData.isValid &&
      Object.getOwnPropertyNames(errors).length === 0

    if (!isValid) {
      this.setState({ errors })
    }

    const data = {
      ...purchaseData,
      ...locationData,
      strain,
      strain_type,
      plant_ids,
      plant_qty,
      planted_on: planted_on && planted_on.toISOString(),
      isBought,
      isValid
    }
    return data
  }

  renderPlantQtyForm() {
    if (!this.state.isShowPlantQtyForm) return null
    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-40">
            <NumericInput
              label={'Number of plants'}
              value={this.state.plant_qty}
              onChange={this.onChangeGeneratorPlantQty}
            />
            <FieldError errors={this.state.errors} field="plant_qty" />
          </div>
          <div className="w-60 pl3">
            <label className="f6 fw6 db mb1 gray">Planted On</label>
            <DatePicker
              value={this.state.planted_on}
              onChange={this.onPlantedOnChanged}
            />
            <FieldError errors={this.state.errors} field="planted_on" />
          </div>
        </div>
        <div className="ph4 mb2 flex justify-end">
          <a
            href="#"
            onClick={this.onToggleGeneratePlantId}
            className="fw4 f7 link dark-blue"
          >
            Cancel
          </a>
        </div>
        <div className="ph4 mb2 flex">
          <p className="w-100 ma0 f7 fw4 gray">
            PlantID will be generated for each plant after saving.
          </p>
        </div>
      </React.Fragment>
    )
  }

  renderPlantIdForm() {
    if (this.state.isShowPlantQtyForm) return null
    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              Each mother plant has its own <strong>Plant ID</strong>.
            </p>
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              If you already have them, paste Plant IDs like below.
            </p>
            <p className="f7 fw4 gray mt0 mb2 pa0 lh-copy">
              <a
                href="#"
                onClick={this.onToggleGeneratePlantId}
                className="fw4 f7 link dark-blue"
              >
                Don't have Plant ID? Let us generate for you.
              </a>
            </p>
            <textarea
              ref={this.setPlantIdsTextArea}
              rows="5"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Mother0001&#10;Mother0002&#10;Mother0003&#10;Mother0004"
              value={this.state.plant_ids}
              onChange={this.onChangePlantIds}
            />
            <FieldError errors={this.state.errors} field="plant_ids" />
          </div>
        </div>
        <div className="ph4 mt0 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">Planted On</label>
            <DatePicker
              value={this.state.planted_on}
              onChange={this.onPlantedOnChanged}
            />
            <FieldError errors={this.state.errors} field="planted_on" />
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <StrainPicker
          ref={this.strainPicker}
          onStrainSelected={this.onStrainSelected}
        />
        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mt3 mb3">
          <span className="f6 fw6 dark-gray">Plant IDs</span>
        </div>

        {this.renderPlantIdForm()}
        {this.renderPlantQtyForm()}

        <hr className="mt3 m b--light-gray w-100" />
        <StorageInfo
          ref={this.storageInfoEditor}
          mode="mother"
          locations={this.props.locations}
          room_id={this.state.room_id}
          section_name={this.state.section_name}
          section_id={this.state.section_id}
        />

        <hr className="mt3 mb3 b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">
            Plant Origin?
          </span>
        </div>
        <div className="ph4 mb3 flex justify-between">
          <label className="f6 fw6 db mb1 gray">
            Mother plants are purchased
          </label>
          <input
            className="toggle toggle-default"
            type="checkbox"
            value="1"
            checked={this.state.isBought}
            id="is_bought_input"
            onChange={this.onIsBoughtChanged}
          />
          <label className="toggle-button" htmlFor="is_bought_input" />
        </div>
        {this.state.isBought && (
          <PurchaseInfo
            showLabel={false}
            ref={this.setPurchaseInfoEditor}
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
        )}

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

export default MotherEditor
