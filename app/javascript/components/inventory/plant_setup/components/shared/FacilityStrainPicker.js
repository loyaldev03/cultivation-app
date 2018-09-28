import React from 'react'
import Select from 'react-select'
import { FieldError } from '../../../../utils/FormHelpers'
import reactSelectStyle from '../../../../utils/reactSelectStyle'

export default class FacilityStrainPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: 'hybrid',
      errors: {}
    }
    this.onStrainSelected = this.onStrainSelected.bind(this)
    this.onChangeStrainType = this.onChangeStrainType.bind(this)
  }

  // Should refactor this to ./actions
  loadStrainOptions = inputValue => {
    return fetch('/api/v1/plants/strains?filter=' + inputValue, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data.data)
        return data.data.map(x => ({
          label: x.name,
          value: x.name,
          strain_type: x.strain_type
        }))
      })
  }

  handleInputChange = newValue => {
    return newValue
  }

  onStrainSelected(item) {
    const strain = item.label
    const strain_type = item.strain_type || this.state.strain_type
    this.setState({
      strain,
      strain_type,
      errors: {}
    })

    this.props.onStrainSelected({ strain, strain_type })
  }

  onChangeStrainType(event) {
    this.setState({ strain_type: event.target.value })
  }

  reset() {
    this.setState({
      strain: '',
      strain_type: 'hybrid',
      errors: {}
    })
  }

  validate(isDraft = false) {
    let errors = {}
    const { strain, strain_type } = this.state

    if (!isDraft) {
      if (strain.length <= 0) {
        errors = { ...errors, strain: ['Strain is required.'] }
      }

      if (strain_type.length <= 0) {
        errors = { ...errors, strain_type: ['Strain type is required.'] }
      }
    }

    this.setState({ errors })
    return {
      errors: errors,
      isValid: Object.getOwnPropertyNames(errors).length === 0
    }
  }

  render() {
    return (
      <div className="ph4 mt3 mb3 flex">
        <div className="w-60">
          <label className="f6 fw6 db mb1 gray ttc">Strain</label>
          <Select
            options={this.state.motherOptions}
            noOptionsMessage={() => 'Type to search strain...'}
            onChange={() => {}}
            value={{ label: this.state.strain_name, value: this.state.facility_strain_id }}
            styles={reactSelectStyle}
          />
          <FieldError errors={this.state.errors} field="facility_strain_id" />
        </div>
      </div>
    )
  }
}
