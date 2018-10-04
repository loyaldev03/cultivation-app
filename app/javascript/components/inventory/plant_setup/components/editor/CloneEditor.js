import React from 'react'
import {
  TextInput,
  NumericInput,
  FieldError,
  CalendarPicker
} from '../../../../utils/FormHelpers'
import Select from 'react-select'
import LocationPicker from '../../../../utils/LocationPicker'
import PurchaseInfo from '../shared/PurchaseInfo'
import StrainPicker from '../shared/StrainPicker'
import setupClones from '../../actions/setupClones'
import MotherPicker from '../shared/MotherPicker'

class CloneEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',

      // source
      clone_ids: '',
      plant_qty: 0,
      location_id: '',
      planted_on: null,
      expected_harvested_on: null,
      cultivation_batch_id: '',

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
      isBought: false,
      isShowPlantIdGenerator: false,
      errors: {}
    }

    this.locations = []

    // Converting to callback ref because purchase info editor is hidding and showing.
    // This will cause the standard way to set ref to be broken / undefined.
    this.purchaseInfoEditor = null
    this.setPurchaseInfoEditor = element => {
      this.purchaseInfoEditor = element
    }

    this.cloneIdTextArea = null
    // Callback ref to get instance of html DOM: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    // Getting a ref to textarea in order to adjust height according to content.
    this.setCloneIdTextArea = element => {
      this.cloneIdTextArea = element
    }

    this.strainPicker = React.createRef()
    this.motherPicker = React.createRef()
  }

  onCloneIdsChanged = event => {
    this.setState({ clone_ids: event.target.value })
    const lines = (event.target.value.match(/\n/g) || []).length
    const node = this.cloneIdTextArea

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

  onChangeGeneratorPlantCount = event => {
    this.setState({ plant_qty: event.target.value })
    event.preventDefault()
  }

  onPlantedOnChanged = date => {
    this.setState({ planted_on: date })
  }

  onExpectedHarvestDateChanged = date => {
    this.setState({ expected_harvested_on: date })
  }

  onIsBoughtChanged = () => {
    this.setState({ isBought: !this.state.isBought })
  }

  onMotherIdChanged = event => {
    this.setState({ mother_id: event.target.value })
  }

  onMotherLocationChanged = item => {
    this.setState({ mother_location_id: item.rm_id })
  }

  onToggleGeneratePlantId = event => {
    this.setState({
      isShowPlantIdGenerator: !this.state.isShowPlantIdGenerator
    })
    if (event) event.preventDefault()
  }

  onStrainSelected = data => {
    this.setState({
      strain: data.strain,
      strain_type: data.strain_type
    })
  }

  onTraySelected = item => {
    this.setState({ location_id: item.t_id })
  }

  onCultivationBatchIdChanged = event => {
    this.setState({ cultivation_batch_id: event.target.value })
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
    this.setState({
      strain: '',
      strain_type: '',
      clone_ids: '',
      plant_qty: 0,
      location_id: '',
      planted_on: null,
      expected_harvested_on: null,
      mother_id: '',
      cultivation_batch_id: '',

      // UI states
      isShowPlantIdGenerator: false,
      isBought: false,
      errors: {}
    })

    this.strainPicker.current.reset()
  }

  validateAndGetValues() {
    let {
      strain,
      strain_type,
      clone_ids,
      plant_qty,
      cultivation_batch_id,
      isShowPlantIdGenerator,
      location_id,
      planted_on,
      expected_harvested_on,
      isBought
    } = this.state

    let errors = {}
    if (planted_on === null) {
      errors = { ...errors, planted_on: ['Planted on date is required.'] }
    }

    if (cultivation_batch_id.length === 0) {
      errors = {
        ...errors,
        cultivation_batch_id: ['Cultivation batch ID is required.']
      }
    }

    if (isShowPlantIdGenerator) {
      clone_ids = ''
      if (parseInt(plant_qty) <= 0) {
        errors = {
          ...errors,
          plant_qty: ['Number of clones must be at least 1.']
        }
      }

      if (location_id.length === 0) {
        errors = {
          ...errors,
          location_id: ['Location of the clones is required.']
        }
      }
    } else {
      plant_qty = 0
      if (clone_ids.trim().length <= 0) {
        errors = { ...errors, clone_ids: ['Plant ID is required.'] }
      }
    }

    let purchaseData = { isValid: true }
    if (isBought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    const { isValid: strainValid } = this.strainPicker.current.validate()
    const { mother_id } = this.motherPicker.current.getValues(false)
    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 &&
      strainValid &&
      purchaseData.isValid

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
    if (this.state.isShowPlantIdGenerator) return null

    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              Each clone has its own <strong>Plant ID</strong>. If you already
              have them, paste them below.
            </p>
            <textarea
              ref={this.setCloneIdTextArea}
              rows="3"
              value={this.state.clone_ids}
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
                value={this.state.cultivation_batch_id}
                onChange={this.onCultivationBatchIdChanged}
              />
              <FieldError
                errors={this.state.errors}
                field="cultivation_batch_id"
              />
            </div>
          </div>
          <div className="ph4 mt3 flex">
            <div className="w-50">
              <MotherPicker
                ref={this.motherPicker}
                strain={this.state.strain}
                key={this.state.strain}
              />
            </div>
          </div>

          <div className="ph4 mt3 mb2">
            <span className="f6 fw6 gray">Plant IDs</span>
          </div>
          {this.renderPlantIdTextArea()}

          <div className="ph4 mt3 flex">
            <div className="w-50">
              <label className="f6 fw6 db mb1 gray ttc">Planted On</label>
              <CalendarPicker
                value={this.state.planted_on}
                onChange={this.onPlantedOnChanged}
              />
              <FieldError errors={this.state.errors} field="planted_on" />
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

export default CloneEditor
