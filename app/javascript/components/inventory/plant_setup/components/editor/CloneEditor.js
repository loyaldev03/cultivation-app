import React from 'react'
import {
  TextInput,
  NumericInput,
  FieldError,
  CalendarPicker
} from '../../../../utils/FormHelpers'
import PurchaseInfo from '../shared/PurchaseInfo'
import LocationPicker from '../shared/LocationPicker'
import StrainPicker from '../shared/StrainPicker'
import setupClones from '../../actions/setupClones'

class CloneEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',

      // source
      clone_ids: '',
      plant_qty: 0,
      tray: '',
      generator_location: '',
      last_plant_id: 0,
      planted_on: null,
      expected_harvested_on: null,
      mother_id: '',
      mother_location_id: '',

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

    this.locations = props.locations

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

    this.onCloneIdsChanged = this.onCloneIdsChanged.bind(this)
    this.onChangeGeneratorPlantCount = this.onChangeGeneratorPlantCount.bind(
      this
    )
    this.onGeneratorTraySelected = this.onGeneratorTraySelected.bind(this)
    this.onPlantedOnChanged = this.onPlantedOnChanged.bind(this)
    this.onExpectedHarvestDateChanged = this.onExpectedHarvestDateChanged.bind(
      this
    )

    this.onIsBoughtChanged = this.onIsBoughtChanged.bind(this)
    this.onMotherIdChanged = this.onMotherIdChanged.bind(this)
    this.onMotherLocationChanged = this.onMotherLocationChanged.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onToggleGeneratePlantId = this.onToggleGeneratePlantId.bind(this)
    // this.onGeneratePlantId = this.onGeneratePlantId.bind(this)
    this.onStrainSelected = this.onStrainSelected.bind(this)
  }

  onCloneIdsChanged(event) {
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

  onPlantedOnChanged(date) {
    this.setState({ planted_on: date })
  }

  onExpectedHarvestDateChanged(date) {
    this.setState({ expected_harvested_on: date })
  }

  onIsBoughtChanged(event) {
    this.setState({ isBought: !this.state.isBought })
    event.preventDefault()
  }

  onMotherIdChanged(event) {
    this.setState({ mother_id: event.target.value })
  }

  onMotherLocationChanged(item) {
    this.setState({ mother_location_id: item.rm_id })
  }

  onToggleGeneratePlantId(event) {
    this.setState({
      isShowPlantIdGenerator: !this.state.isShowPlantIdGenerator
    })
    if (event) event.preventDefault()
  }

  onChangeGeneratorPlantCount(event) {
    this.setState({ plant_qty: event.target.value })
  }

  onGeneratorTraySelected(item) {
    this.setState({ tray: item.label })
  }

  onStrainSelected(data) {
    this.setState({
      strain: data.strain,
      strain_type: data.strain_type
    })
  }

  // onGeneratePlantId(event) {
  //   event.preventDefault()
  //   if (this.state.generator_plant_count <= 0) {
  //     return
  //   }

  //   let cloneIds = ''
  //   let i = parseInt(this.state.last_plant_id)
  //   let iMax = i + parseInt(this.state.generator_plant_count)

  //   for (i; i < iMax; i++) {
  //     const serialNo =
  //       new Date().getFullYear().toString() + i.toString().padStart(6, '0')
  //     const id = `P${serialNo}, ${this.state.generator_location}\n`
  //     cloneIds += id
  //   }

  //   this.setState({
  //     clone_ids: this.state.clone_ids + cloneIds,
  //     last_plant_id: iMax
  //   })

  //   const lines = (this.state.clone_ids.match(/\n/g) || []).length

  //   if (lines >= 4 && this.cloneIdTextArea.scrollHeight < 350) {
  //     this.cloneIdTextArea.style.height = 40 + lines * 25 + 'px'
  //   } else {
  //     this.cloneIdTextArea.style.height = 'auto'
  //   }
  // }

  onSave(event) {
    const data = this.validateAndGetValues()
    const { errors, isValid, ...payload } = data

    if (isValid) {
      setupClones(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.props.onResetParent()
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
      tray: '',
      generator_location: '',
      planted_on: null,
      expected_harvested_on: null,
      mother_id: '',
      mother_location_id: '',
      // UI states
      isShowPlantIdGenerator: false,
      isBought: false,
      errors: {}
    })

    this.strainPicker.current.reset()
  }

  validateAndGetValues() {
    const {
      strain,
      strain_type,
      clone_ids,
      plant_qty,
      isShowPlantIdGenerator,
      tray,
      planted_on,
      expected_harvested_on,
      isBought,
      mother_id,
      mother_location_id
    } = this.state

    let errors = {}
    if (planted_on === null) {
      errors = { ...errors, planted_on: ['Planted on date is required.'] }
    }

    if (clone_ids.trim().length <= 0) {
      errors = { ...errors, clone_ids: ['Plant ID is required.'] }
    }

    if (isShowPlantIdGenerator) {
      if (parseInt(plant_qty) <= 0) {
        errors = {
          ...errors,
          plant_qty: ['Number of clones must be at least 1.']
        }
      }

      if (tray.length === 0) {
        errors = { ...errors, tray: ['Location of the clones is required.'] }
      }
    }

    let purchaseData = { isValid: true }
    if (!isBought) {
      if (mother_id.length <= 0) {
        errors = { ...errors, mother_id: ['Mother ID is required.'] }
      }

      if (mother_location_id.length <= 0) {
        errors = {
          ...errors,
          mother_location_id: ['Mother plant location is required.']
        }
      }
    } else {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    const { isValid: strainValid } = this.strainPicker.current.validate()
    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 &&
      strainValid &&
      purchaseData.isValid

    const data = {
      ...purchaseData,
      strain,
      strain_type,
      clone_ids,
      planted_on: planted_on && planted_on.toISOString(),
      expected_harvested_on:
        expected_harvested_on && expected_harvested_on.toISOString(),
      isBought,
      mother_id,
      mother_location_id,
      errors,
      isValid
    }

    if (!data.isValid) {
      this.setState({ errors: data.errors })
    }
    return data
  }

  renderProcurementInfo() {
    if (!this.state.isBought) {
      return (
        <React.Fragment>
          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label={'Mother plant ID'}
                value={this.state.mother_id}
                onChange={this.onMotherIdChanged}
              />
              <FieldError errors={this.state.errors} field="mother_id" />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">
                Mother location ID
              </label>
              <LocationPicker
                mode="mother"
                locations={this.locations}
                value={this.state.mother_location_name}
                onChange={this.onMotherLocationChanged}
              />
              <FieldError
                errors={this.state.errors}
                field="mother_location_id"
              />
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

  renderPlantIdGenerator() {
    if (!this.state.isShowPlantIdGenerator) return null
    return (
      <React.Fragment>
        <div className="ph4 mb2 mt0 flex">
          <div className="w-50">
            <NumericInput
              label={'Number of plants'}
              value={this.state.plant_qty}
              onChange={this.onChangeGeneratorPlantCount}
            />
            <FieldError errors={this.state.errors} field="plant_qty" />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Tray ID</label>
            <LocationPicker
              mode="clone"
              locations={this.locations}
              value={this.state.tray}
              onChange={this.onGeneratorTraySelected}
            />
            <FieldError errors={this.state.errors} field="tray" />
          </div>
        </div>
        <div className="ph4 mb3 flex justify-end">
          <a
            href="#"
            onClick={this.onToggleGeneratePlantId}
            className="fw4 f7 link dark-blue"
          >
            Cancel
          </a>
        </div>
      </React.Fragment>
    )
  }

  renderPlantIdTextArea() {
    if (this.state.isShowPlantIdGenerator) return null

    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              Each clone has its own <strong>Plant ID</strong>.
            </p>
            <p className="f7 fw4 gray mt0 mb2 pa0 lh-copy">
              If you already have them, paste Plant IDs with its corresponding
              tray ID:
            </p>
            <textarea
              ref={this.setCloneIdTextArea}
              rows="4"
              value={this.state.clone_ids}
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001, Tray0001&#10;Plant0002, Tray0001&#10;Plant0003, Tray0002&#10;Plant0004, Tray0002"
              onChange={this.onCloneIdsChanged}
            />
            <FieldError errors={this.state.errors} field="clone_ids" />
          </div>
        </div>
        <div className="ph4 mb3 flex justify-end">
          <a
            href="#"
            onClick={this.onToggleGeneratePlantId}
            className="fw4 f7 link dark-blue"
          >
            {this.state.clone_ids.length > 0
              ? 'Generate more IDs'
              : 'Don\'t have Plant ID? Click here to generate.'}
          </a>
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

        {this.renderPlantIdTextArea()}
        {this.renderPlantIdGenerator()}

        <div className="ph4 mt2 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Planted On</label>
            <CalendarPicker
              value={this.state.planted_on}
              onChange={this.onPlantedOnChanged}
            />
            <FieldError errors={this.state.errors} field="planted_on" />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">
              Expected Harvest Date
            </label>
            <CalendarPicker
              value={this.state.expected_harvested_on}
              onChange={this.onExpectedHarvestDateChanged}
            />
          </div>
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Where the clones are from?</span>
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

export default CloneEditor
