import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import Select from 'react-select'
import { TextInput, NumericInput } from '../../../utils/FormHelpers'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  LocationPicker
} from '../../../utils'

import reactSelectStyle from '../../../utils/reactSelectStyle'

class HarvestBatchForm extends React.Component {
  state = {
    name: '',
    location: null,
    locationId: '',
    uom: null,
    errors: {}
  }

  componentDidMount() {
    // retrieve harvest batch
  }

  onSave = () => {
    console.log('on save')
  }

  validate = () => {}

  onValueChanged = fieldName => e => {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  onUomChanged = uom => {
    this.setState({ uom })
  }

  onLocationChanged = location => {
    this.setState({ location })
  }

  render() {
    const { onClose } = this.props
    const { name, location, errors, uom } = this.state
    const uomOptions = ['g', 'lb'].map(x => ({ label: x, value: x }))

    return (
      <div>
        <SlidePanelHeader onClose={onClose} title="Create Harvest" />

        <div className="ph4 mv3 flex">
          <div className="w-100">
            <TextInput
              label={'Harvest batch name'}
              value={name}
              onChange={this.onValueChanged('name')}
              errors={errors}
              errorField="name"
            />
          </div>
        </div>
        <div className="ph4 mv3 flex flex-column">
          <label className="subtitle-2 grey fl pb2">Unit of measure</label>
          <div className="w-100 flex flex-column">
            <Select
              options={uomOptions}
              value={uom}
              onChange={this.onUomChanged}
              styles={reactSelectStyle}
            />
          </div>
        </div>

        <div className="ph4 mt3 mb4 flex flex-column">
          <label className="subtitle-2 grey fl pb2">Harvest room</label>
          <div className="w-100 flex flex-column">
            <LocationPicker
              purpose="harvest"
              value={location}
              facility_id={this.props.facilityId}
              location_id={this.state.locationId}
              onChange={this.onLocationChanged}
            />
          </div>
        </div>
        <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}
export default HarvestBatchForm
