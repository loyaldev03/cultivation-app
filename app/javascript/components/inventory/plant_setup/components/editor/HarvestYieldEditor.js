import React from 'react'
import {
  TextInput,
  NumericInput,
  FieldError,
  CalendarPicker
} from '../../../../utils/FormHelpers'
import LocationPicker from '../../../../utils/LocationPicker'
import PurchaseInfo from '../shared/PurchaseInfo'
import StrainPicker from '../shared/StrainPicker'
import MotherPicker from '../shared/MotherPicker'
import setupHarvestYield from '../../actions/setupHarvestYield'

export default class HarvestYieldEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',
      cultivation_batch_id: '',
      location_id: '',
      yield_type: 'flower',
      weight_type: 'dry',
      weight: 0,
      weight_unit: 'g',
      harvested_on: null,

      // UI
      errors: {}
    }
    this.locations = props.locations
    this.locationPicker = React.createRef()
    this.strainPicker = React.createRef()
    this.motherPicker = React.createRef()
  }

  onStrainSelected = ({ strain, strain_type }) => {
    this.setState({ strain, strain_type })
  }

  onCultivationBatchIdChanged = event => {
    this.setState({ cultivation_batch_id: event.target.value })
  }

  onLocationSelected = ({ location_id }) => {
    this.setState({ location_id })
  }

  onYieldTypeChanged = event => {
    this.setState({ yield_type: event.target.value })
  }

  onWeightTypeChanged = event => {
    this.setState({ weight_type: event.target.value })
  }

  onWeightChanged = event => {
    this.setState({ weight: event.target.value })
  }

  onWeightUnitChanged = event => {
    this.setState({ weight_unit: event.target.value })
  }

  onHarvestDateChanged = date => {
    this.setState({ harvested_on: date })
  }

  onSave = () => {
    const { errors, isValid, ...payload } = this.validateAndGetValues()
    if (isValid) {
      setupHarvestYield(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          // toast message here...
          this.reset()
        }
      })
    }
  }

  validateAndGetValues() {
    const {
      strain,
      strain_type,
      cultivation_batch_id,
      location_id,
      yield_type,
      weight_type,
      weight,
      weight_unit,
      harvested_on
    } = this.state

    const {
      mother_id,
      isValid: isMotherValid
    } = this.motherPicker.current.getValues()
    const { isValid: isStrainValid } = this.strainPicker.current.validate()

    let errors = {}

    if (strain.length == 0) {
      errors = { ...errors, strain: ['Strain is required.'] }
    }

    if (cultivation_batch_id.length == 0) {
      errors = {
        ...errors,
        cultivation_batch_id: ['Cultivation Batch ID is required.']
      }
    }

    if (weight <= 0) {
      errors = { ...errors, weight: ['Weight must be more than zero.'] }
    }

    if (harvested_on === null) {
      errors = { ...errors, harvested_on: ['Harvested date is required.'] }
    }

    if (location_id.length <= 0) {
      errors = {
        ...errors,
        location_id: ['Harvest yield location is required.']
      }
    }

    const isValid =
      Object.getOwnPropertyNames(errors).length === 0 &&
      isMotherValid &&
      isStrainValid

    console.log(`isValid: ${isValid}`)
    if (!isValid) {
      this.setState({ errors })
    } else {
      this.setState({ errors: {} })
    }

    const data = {
      strain,
      strain_type,
      cultivation_batch_id,
      mother_id,
      location_id,
      yield_type,
      weight_type,
      weight,
      weight_unit,
      harvested_on: harvested_on && harvested_on.toISOString(),
      isValid,
      errors
    }

    // console.log(data)

    return data
  }

  reset() {
    this.setState({
      strain: '',
      strain_type: '',
      cultivation_batch_id: '',
      location_id: '',
      yield_type: 'flower',
      weight_type: 'dry',
      weight: '',
      weight_unit: 'g',
      harvested_on: null
    })

    this.strainPicker.current.reset()
    this.locationPicker.current.reset()
  }

  renderYieldType() {
    const options = [
      ['Flower', 'flower'],
      ['Shakes', 'shakes'],
      ['Trim', 'trim'],
      ['Waste', 'waste'],
      ['Wet Plant', 'wet'],
      ['Other', 'other']
    ]

    const htmlOptions = options.map(x => (
      <option value={x[1]} key={x[1]}>
        {x[0]}
      </option>
    ))
    return (
      <select
        className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
        value={this.state.yield_type}
        onChange={this.onYieldTypeChanged}
      >
        {htmlOptions}
      </select>
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
        <div className="ph4 mt3 flex">
          <div className="w-50">
            <TextInput
              label={'Cultivation Batch ID'}
              value={this.state.cultivation_batch_id}
              onChange={this.onCultivationBatchIdChanged}
              errors={this.state.errors}
              fieldname="cultivation_batch_id"
            />
          </div>
          <div className="w-50 pl3">
            <MotherPicker
              mode="veg"
              ref={this.motherPicker}
              strain={this.state.strain}
              key={this.state.strain}
            />
          </div>
        </div>
        <div className="ph4 mt3 flex flex-column">
          <div className="w-100">
            <LocationPicker
              ref={this.locationPicker}
              mode="dry"
              filter_facility_id=""
              locations={this.locations}
              location_id={this.state.location_id}
              onChange={this.onLocationSelected}
            />
            <FieldError errors={this.state.errors} field="location_id" />
          </div>
        </div>
        <hr className="mt4 m b--light-gray w-100" />

        <div className="ph4 mt3 flex flex-column">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Yield Type</label>
            {this.renderYieldType()}
            <FieldError errors={this.state.errors} field="yield_type" />
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Weight Type</label>
            <select
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
              value={this.state.weight_type}
              onChange={this.onWeightTypeChanged}
            >
              <option key="dry" value="dry">
                Dry
              </option>
              <option key="wet" value="wet">
                Wet
              </option>
            </select>
          </div>
          <div className="w-50 pl3">
            <div className="flex">
              <div className="w-50">
                <NumericInput
                  value={this.state.weight}
                  label="Weight"
                  onChange={this.onWeightChanged}
                />
              </div>
              <div className="w-50 pl3">
                <label className="f6 fw6 db mb1 gray ttc">Weight Unit</label>
                <select
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
                  onChange={this.onWeightUnitChanged}
                >
                  <option key="g" value="g">
                    g
                  </option>
                  <option key="kg" value="kg">
                    kg
                  </option>
                  <option key="lb" value="lb">
                    lb
                  </option>
                  <option key="oz" value="wet">
                    oz
                  </option>
                </select>
              </div>
            </div>
            <FieldError errors={this.state.errors} field="weight" />
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">Harvested On</label>
            <CalendarPicker
              value={this.state.harvested_on}
              onChange={this.onHarvestDateChanged}
            />
            <FieldError errors={this.state.errors} field="harvested_on" />
          </div>
        </div>

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
