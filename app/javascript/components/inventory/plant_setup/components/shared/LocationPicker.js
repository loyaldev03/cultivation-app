import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import reactSelectStyle from '../../../../utils/reactSelectStyle'

const VEG_TRAY_PURPOSES = ['veg', 'veg1', 'veg2']

class LocationPicker extends React.Component {
  constructor(props) {
    super(props)

    if (props.mode === 'clone') {
      this.trays = props.locations.filter(
        x => x.t_id.length > 0 && x.rm_purpose === 'clone'
      )
    } else if (props.mode === 'vegTray') {
      this.trays = props.locations.filter(
        x => x.t_id.length > 0 && VEG_TRAY_PURPOSES.indexOf(x.rm_purpose) >= 0
      )
    } else if (props.mode === 'mother') {
      this.trays = props.locations.filter(
        x =>
          x.rm_id.length > 0 &&
          x.rw_id.length === 0 &&
          x.rm_purpose === 'mother'
      )
    } else if (props.mode === 'room') {
      this.trays = props.locations.filter(
        x => x.rm_id.length > 0 && x.rw_id.length === 0
      )
    } else {
      this.trays = props.locations
    }
    // console.log(this.trays)
    const item = this.trays.find(x => x.value === props.value) || null
    this.state = { value: item }

    this.onChange = this.onChange.bind(this)
  }

  onChange(item) {
    this.props.onChange(item)
    this.setState({ value: { value: item.value, label: item.label } })
  }

  render() {
    return (
      <Select
        styles={reactSelectStyle}
        placeholder="Type to search location..."
        options={this.trays}
        onChange={this.onChange}
        value={this.state.value}
        filterOption={(option, input) => {
          const words = input.toLowerCase().split(/\s/)
          return words.every(x => option.label.toLowerCase().indexOf(x) >= 0)
        }}
      />
    )
  }
}

LocationPicker.propTypes = {
  mode: PropTypes.string.isRequired,
  locations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
}

LocationPicker.defaultProps = {
  mode: 'tray',
  value: ''
}

export default LocationPicker
