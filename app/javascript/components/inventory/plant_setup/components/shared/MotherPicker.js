import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'

import reactSelectStyle from '../../../../utils/reactSelectStyle'
import { FieldError } from '../../../../utils/FormHelpers'
import plantStore from '../../store/PlantStore'

@observer
class MotherPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mother_id: props.mother_id,
      motherOptions: this.buildOptions(),
      mother: { value: props.mother_id, label: props.mother_label },
      facility_id: '',
      errors: {}
    }
  }

  buildOptions() {
    const motherOptions = plantStore.plants
      .slice()
      .filter(x => {
        if (this.props.mode == 'veg') {
          return (
            (x.attributes.plant_status === 'veg' ||
              x.attributes.plant_status === 'veg1' ||
              x.attributes.plant_status === 'veg2') &&
            x.attributes.item_name === this.props.strain
          )
        } else {
          return (
            x.attributes.plant_status === 'mother' &&
            x.attributes.item_name === this.props.strain
          )
        }
      })
      .map(x => ({
        label: `${toJS(x.attributes.serial_no)} - ${
          x.attributes.facility_name
        }`,
        value: toJS(x.attributes.id),
        ...x
      }))

    return motherOptions
  }

  onMotherIdChanged = item => {
    this.setState({
      mother_id: item.id,
      mother: item,
      facility_id: item.facility_id
    })
  }

  getValues(validate = true) {
    let errors = {}
    if (validate) {
      if (this.state.mother_id.length === 0) {
        errors = { mother_id: ['Mother ID is required.'] }
        this.setState({ errors })
      }
    }

    return {
      mother_id: this.state.mother_id || null,
      isValid: Object.getOwnPropertyNames(errors).length == 0
    }
  }

  render() {
    return (
      <React.Fragment>
        <label className="f6 fw6 db mb1 gray ttc">
          {this.props.mode === 'veg' ? 'Plant Source' : 'Mother plant ID'}
        </label>
        <Select
          options={this.state.motherOptions}
          onChange={this.onMotherIdChanged}
          styles={reactSelectStyle}
        />
        <FieldError errors={this.state.errors} field="mother_id" />
      </React.Fragment>
    )
  }
}

MotherPicker.propTypes = {
  facility_strain_id: PropTypes.string.isRequired,
  strain: PropTypes.string.isRequired,
  value: PropTypes.string
}

MotherPicker.defaultProps = {
  value: ''
}

export default MotherPicker
