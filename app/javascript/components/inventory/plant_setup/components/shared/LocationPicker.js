import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import reactSelectStyle from '../../../../utils/reactSelectStyle'

const VEG_TRAY_PURPOSES = ['veg', 'veg1', 'veg2']

class LocationPicker extends React.Component {
  constructor(props) {
    super(props)

    if (props.mode === 'clone') {
      this.locations = props.locations.filter(this.isClone)
    } else if (props.mode === 'vegTray') {
      this.locations = props.locations.filter(this.isVeg)
    } else if (props.mode === 'mother') {
      this.locations = props.locations.filter(this.isMother)
    } else if (props.mode === 'room') {
      this.locations = props.locations.filter(this.isRoomOnly)
    } else {
      this.locations = props.locations
    }
    this.mode = props.mode

    console.log(`props.location_id: ${props.location_id}`)
    const item = this.findLocation(props.location_id)
    this.state = { value: item }
  }

  isClone(item) {
    return item.t_id.length > 0 && item.rm_purpose === 'clone'
  }

  isMother(item) {
    return (
      item.rm_id.length > 0 &&
      item.rw_id.length === 0 &&
      item.rm_purpose === 'mother'
    )
  }

  isVeg(item) {
    return (
      item.t_id.length > 0 && VEG_TRAY_PURPOSES.indexOf(item.rm_purpose) >= 0
    )
  }

  isRoomOnly(item) {
    return item.rm_id.length > 0 && item.rw_id.length === 0
  }

  /* Utility method to find item from location id & mode combination */
  findLocation(location_id) {
    const mode = this.mode
    let item = null
    if (mode === 'mother' || mode === 'room') {
      item = this.locations.find(x => x.rm_id === location_id)
    } else if (mode === 'clone' || mode === 'vegTray') {
      item = this.locations.find(x => x.t_id === location_id)
    }
    return item ? item : { value: '', label: '' }
  }

  /* Utility method to extract location id & mode combination from item */
  extractLocationId(selectedItem) {
    const mode = this.mode
    if (mode === 'mother' || mode === 'room') {
      return {
        location_id: selectedItem.rm_id,
        location_type: selectedItem.rm_purpose
      }
    } else if (mode === 'clone' || mode === 'vegTray') {
      return {
        location_id: selectedItem.t_id,
        location_type: selectedItem.rm_purpose
      }
    } else {
      console.log('Unable find location id for selected item and mode.')
      return {
        location_id: '',
        location_type: ''
      }
    }
  }

  onChange = item => {
    const locationData = this.extractLocationId(item, this.props.mode)
    this.props.onChange({ ...item, ...locationData })
    this.setState({ value: { value: item.value, label: item.label } })
  }

  reset() {
    this.setState({ value: { value: '', label: '' } })
  }

  render() {
    return (
      <Select
        styles={reactSelectStyle}
        placeholder="Type to search location..."
        options={this.locations}
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
  location_id: PropTypes.string
}

LocationPicker.defaultProps = {
  mode: 'tray',
  location_id: ''
}

export default LocationPicker
