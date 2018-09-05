import React from 'react'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import { FieldError } from '../../../../utils/FormHelpers'
import reactSelectStyle from './reactSelectStyle'

export default class StrainPicker extends React.Component {
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
          <AsyncCreatableSelect
            defaultOptions
            noOptionsMessage={() => 'Type to search strain...'}
            cacheOptions
            loadOptions={this.loadStrainOptions}
            onInputChange={this.handleInputChange}
            styles={reactSelectStyle}
            placeholder=""
            value={{ label: this.state.strain, value: this.state.strain }}
            onChange={this.onStrainSelected}
          />
          <FieldError errors={this.state.errors} field="strain" />
        </div>
        <div className="w-40 pl3">
          <label className="f6 fw6 db mb1 gray ttc">Strain type</label>
          <select
            className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
            onChange={this.onChangeStrainType}
            value={this.state.strain_type}
          >
            <option value="hybrid" key="hybrid">Hybrid</option>
            <option value="indica" key="indica">Indica</option>
            <option value="sativa" key="sativa">Sativa</option>
          </select>
          <FieldError errors={this.state.errors} field="strain_type" />
        </div>
      </div>
    )
  }
}