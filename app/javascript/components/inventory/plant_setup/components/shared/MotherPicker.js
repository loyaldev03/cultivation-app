import React from 'react'
import PropTypes from 'prop-types'
import CreatableSelect from 'react-select/lib/Creatable'
import reactSelectStyle from './reactSelectStyle'
import { FieldError } from '../../../../utils/FormHelpers'

class MotherPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mother_id: props.mother_id || '',
      motherName: ''
    }
  }

  onMotherSelected = (item) => {
    this.setState({ mother_id: item.value, motherName: item.label })
    this.props.onMotherSelected(item.value)
  }

  handleInputChange = newValue => {
    return newValue
  }

  loadMotherOptions = () => {
    // call base on current state
  }

  render() {
    return (
      <div className="ph4 mt3 mb3 flex">
        <div className="w-60">
          <label className="f6 fw6 db mb1 gray ttc">Mother ID</label>
          <CreatableSelect
            defaultOptions
            noOptionsMessage={() => 'Type to search strain...'}
            cacheOptions
            loadOptions={this.loadMotherOptions}
            onInputChange={this.handleInputChange}
            styles={reactSelectStyle}
            placeholder=""
            value={{ label: this.state.motherName, value: this.state.mother_id }}
            onChange={this.onMotherSelected}
          />
          <FieldError errors={this.state.errors} field="strain" />
        </div>
      </div>
    )
  }
}

MotherPicker.propTypes = {
  onMotherSelected: PropTypes.func,
  strain: PropTypes.string.isRequired
}

MotherPicker.defaultProps = {
  onMotherSelected: () => {},
  strain: ''
}

export default MotherPicker