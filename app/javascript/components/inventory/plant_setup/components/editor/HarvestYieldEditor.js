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
import MotherPicker from '../shared/MotherPicker'

export default class HarvestYieldEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',
      cultivation_batch_id: '',
      location_id: '',
      yield_type: '',

      // UI
      errors: {}
    }
    this.locations = props.locations
    this.strainPicker = React.createRef()
    this.motherPicker = React.createRef()
  }

  onStrainSelected = data => {
    this.setState({
      strain: data.strain,
      strain_type: data.strain_type
    })
  }

  onCultivationBatchIdChanged = event => {
    this.setState({ cultivation_batch_id: event.target.value })
  }

  onLocationSelected = () => {}

  onSave = () => {}

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
            />
            <FieldError
              errors={this.state.errors}
              field="cultivation_batch_id"
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
            <FieldError errors={this.state.errors} field="location_id" />
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Weight Type</label>
            <select className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select">
              <option key="dry" value="dry">
                Dry
              </option>
              <option key="wet" value="wet">
                Wet
              </option>
            </select>
          </div>
          <div className="w-20 pl3">
            <NumericInput label="Weight" errors={this.state.errors} />
          </div>
          <div className="w-30 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Weight Unit</label>
            <select className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select">
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

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">Harvested On</label>
            <CalendarPicker />
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
