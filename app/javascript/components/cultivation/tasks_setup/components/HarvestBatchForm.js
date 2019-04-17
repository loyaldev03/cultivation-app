import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { TextInput, NumericInput, FieldError } from '../../../utils/FormHelpers'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  LocationPicker
} from '../../../utils'

import reactSelectStyle from '../../../utils/reactSelectStyle'
import saveHarvestBatch from '../actions/saveHarvestBatch'
import loadHarvestBatch from '../actions/loadHarvestBatch'

class HarvestBatchForm extends React.Component {
  state = {
    harvest_name: '',
    location_id: '',
    uom: '',
    errors: {}
  }

  loadData() {
    loadHarvestBatch(this.props.batchId).then(x => {
      if (x.status === 200 && x.data.data) {
        // console.log(x.data.data)
        const attr = x.data.data.attributes
        this.setState({
          harvest_name: attr.harvest_name,
          uom: { value: attr.uom, label: attr.uom },
          location_id: attr.location_id
        })
      }
    })
  }

  onSave = event => {
    event.preventDefault()
    const { errors, isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      saveHarvestBatch(this.props.batchId, payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
          this.props.onClose()
        }
      })
    }

    event.preventDefault()
  }

  validateAndGetValues = () => {
    const { harvest_name, location_id, uom } = this.state
    const uom_value = uom ? uom.value : ''
    let errors = {}

    if (harvest_name.length <= 0) {
      errors.harvest_name = ['Harvest batch name is required.']
    }

    if (location_id.length <= 0) {
      errors.location_id = ['Harvest room is required.']
    }

    if (uom.length <= 0) {
      errors.uom = ['Uom is required.']
    }
    const isValid = Object.getOwnPropertyNames(errors).length === 0

    if (!isValid) {
      this.setState({ errors })
    }

    return {
      harvest_name,
      location_id,
      uom: uom_value,
      errors,
      isValid
    }
  }

  reset = () => {
    this.setState({
      harvest_name: '',
      location_id: null,
      uom: null,
      errors: {}
    })
  }

  onValueChanged = fieldName => e => {
    this.setState({
      [fieldName]: e.target.value
    })
  }

  onUomChanged = uom => {
    this.setState({ uom })
  }

  onLocationChanged = location => {
    this.setState({ location_id: location.location_id })
  }

  render() {
    const { onClose } = this.props
    const { harvest_name, location_id, errors, uom } = this.state
    const uomOptions = ['g', 'lb'].map(x => ({ label: x, value: x }))

    console.log(errors)
    return (
      <div>
        <SlidePanelHeader onClose={onClose} title="Create Harvest" />

        <div className="ph4 mv3 flex">
          <div className="w-100">
            <TextInput
              label={'Harvest batch name'}
              value={harvest_name}
              onChange={this.onValueChanged('harvest_name')}
              errors={errors}
              fieldname="harvest_name"
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
            <FieldError errors={errors} field="uom" />
          </div>
        </div>

        <div className="ph4 mt3 mb4 flex flex-column">
          <label className="subtitle-2 grey fl pb2">Harvest room</label>
          <div className="w-100 flex flex-column">
            <LocationPicker
              purpose="harvest"
              facility_id={this.props.facilityId}
              location_id={location_id}
              onChange={this.onLocationChanged}
            />
            <FieldError errors={errors} field="location_id" />
          </div>
        </div>
        <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
      </div>
    )
  }
}
export default HarvestBatchForm
