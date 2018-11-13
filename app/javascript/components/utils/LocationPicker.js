/** To be removed */
import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import reactSelectStyle from './reactSelectStyle'

const VEG_TRAY_PURPOSES = ['veg', 'veg1', 'veg2']

class LocationPicker extends React.Component {
  constructor(props) {
    super(props)

    this.mode = props.mode
    this.facilities = props.locations
      .filter(this.isFacilityOnly)
      .map(x => ({ ...x, label: `${x.f_name} - ${x.f_code}` }))

    const facility = this.findFacility(
      this.facilities,
      props.filter_facility_id
    )

    const locations = this.filterLocationByFacility(
      this.props.filter_facility_id
    )

    this.state = {
      location_id: props.location_id || '',
      facility,
      locations
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    let hasNewState = false
    let newState = {}

    if (nextProps.location_id !== prevState.location_id) {
      newState = { location_id: nextProps.location_id }
      hasNewState = true
    }

    if (hasNewState) {
      return newState
    }

    return null
  }

  isFacilityOnly(item) {
    return item.f_id.length > 0 && item.rm_id.length <= 0
  }

  isClone(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        item.rm_purpose === 'clone' &&
        item.f_id === facility_id
    } else {
      return item => item.t_id.length > 0 && item.rm_purpose === 'clone'
    }
  }

  isMother(facility_id) {
    if (facility_id) {
      return item =>
        item.rm_id.length > 0 &&
        item.rw_id.length === 0 &&
        item.rm_purpose === 'mother' &&
        item.f_id === facility_id
    } else {
      return item =>
        item.rm_id.length > 0 &&
        item.rw_id.length === 0 &&
        item.rm_purpose === 'mother'
    }
  }

  isVeg(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        VEG_TRAY_PURPOSES.indexOf(item.rm_purpose) >= 0 &&
        item.f_id === facility_id
    } else {
      return item =>
        item.t_id.length > 0 && VEG_TRAY_PURPOSES.indexOf(item.rm_purpose) >= 0
    }
  }

  isDry(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        item.rm_purpose === 'dry' &&
        item.f_id === facility_id
    } else {
      return item => item.t_id.length > 0 && item.rm_purpose === 'dry'
    }
  }

  isFlower(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        item.rm_purpose === 'flower' &&
        item.f_id === facility_id
    } else {
      return item => item.t_id.length > 0 && item.rm_purpose === 'flower'
    }
  }

  isRoomOnly(facility_id) {
    if (facility_id) {
      return item =>
        item.rm_id.length > 0 &&
        item.rw_id.length === 0 &&
        item.f_id === facility_id
    } else {
      return item => item.rm_id.length > 0 && item.rw_id.length === 0
    }
  }

  get isFacilitySet() {
    return (
      this.props.filter_facility_id && this.props.filter_facility_id.length > 0
    )
  }

  filterLocationByFacility = facility_id => {
    if (
      this.mode !== 'facility' &&
      (facility_id === null || facility_id.length <= 0)
    ) {
      return []
    }

    let _locations = []
    const { mode, locations } = this.props
    // console.log(locations)

    if (mode === 'clone') {
      _locations = locations.filter(this.isClone(facility_id))
    } else if (mode === 'vegTray') {
      _locations = locations.filter(this.isVeg(facility_id))
    } else if (mode === 'mother') {
      _locations = locations.filter(this.isMother(facility_id))
    } else if (mode === 'room') {
      _locations = locations.filter(this.isRoomOnly(facility_id))
    } else if (mode === 'flower') {
      _locations = locations.filter(this.isFlower(facility_id))
    } else if (mode === 'dry') {
      _locations = locations.filter(this.isDry(facility_id))
    } else if (mode === 'facility') {
      _locations = locations.filter(this.isFacilityOnly).map(x => ({
        ...x,
        label: `${x.f_name} - ${x.f_code}`,
        value: x.f_id
      }))
    } else {
      _locations = locations
    }
    return _locations
  }

  /* Utility method to find item from location id & mode combination */
  findLocation(locations, location_id) {
    const mode = this.mode
    let item = null
    if (mode === 'mother' || mode === 'room') {
      item = locations.find(x => x.rm_id === location_id)
    } else if (['clone', 'vegTray', 'flower', 'dry'].indexOf(mode) >= 0) {
      item = locations.find(x => x.t_id === location_id)
    } else if (mode === 'facility') {
      item = locations.find(x => x.f_id === location_id)
    }
    return item
  }

  findFacility(locations, facility_id) {
    return locations.find(x => x.f_id === facility_id)
  }

  /* Utility method to extract location id & mode combination from item */
  extractLocationId(selectedItem) {
    const mode = this.mode
    if (mode === 'mother' || mode === 'room') {
      return {
        location_id: selectedItem.rm_id,
        location_type: selectedItem.rm_purpose
      }
    } else if (['clone', 'vegTray', 'flower', 'dry'].indexOf(mode) >= 0) {
      return {
        location_id: selectedItem.t_id,
        location_type: selectedItem.rm_purpose
      }
    } else if (mode === 'facility') {
      return {
        location_id: selectedItem.f_id,
        location_type: selectedItem.f_name
      }
    } else {
      return {
        location_id: '',
        location_type: ''
      }
    }
  }

  onChangeFacility = item => {
    this.setState({
      facility: { value: item.f_id, label: item.label },
      value: { value: '', label: '' },
      locations: this.filterLocationByFacility(item.f_id)
    })
  }

  onChange = item => {
    // console.log(item)
    const locationData = this.extractLocationId(item, this.props.mode)
    this.props.onChange({ ...item, ...locationData })
    this.setState({ value: { value: item.value, label: item.label } })
  }

  reset() {
    this.setState({ value: null })
  }

  get label() {
    if (this.mode === 'clone') {
      return 'Tray ID'
    } else if (this.mode === 'vegTray') {
      return 'Tray ID'
    } else if (this.mode === 'mother') {
      return 'Mother room ID'
    } else if (this.mode === 'room') {
      return 'Room ID'
    } else if (this.mode === 'flower') {
      return 'Flower room ID'
    } else if (this.mode === 'dry') {
      return 'Dry room ID'
    } else if (this.mode === 'facility') {
      return 'Facility'
    } else {
      return 'Location ID'
    }
  }

  get selectedLocation() {
    return this.findLocation(this.state.locations, this.state.location_id)
  }

  render() {
    return (
      <React.Fragment>
        {!this.isFacilitySet && this.mode !== 'facility' && (
          <div className="mb3">
            <label className="f6 fw6 db mb1 gray ttc">Facility ID</label>
            <Select
              styles={reactSelectStyle}
              placeholder="Type to search facility..."
              options={this.facilities}
              onChange={this.onChangeFacility}
              value={this.state.facility}
              filterOption={(option, input) => {
                const words = input.toLowerCase().split(/\s/)
                return words.every(
                  x => option.label.toLowerCase().indexOf(x) >= 0
                )
              }}
            />
          </div>
        )}
        <label className="f6 fw6 db mb1 gray ttc">{this.label}</label>
        <Select
          key={this.state.facility}
          styles={reactSelectStyle}
          placeholder="Search location within your facility"
          options={this.state.locations}
          onChange={this.onChange}
          value={this.selectedLocation}
          filterOption={(option, input) => {
            const words = input.toLowerCase().split(/\s/)
            return words.every(x => option.label.toLowerCase().indexOf(x) >= 0)
          }}
        />
      </React.Fragment>
    )
  }
}

LocationPicker.propTypes = {
  mode: PropTypes.string.isRequired,
  locations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  location_id: PropTypes.string,
  filter_facility_id: PropTypes.string
}

LocationPicker.defaultProps = {
  mode: 'tray',
  location_id: '',
  filter_facility_id: null
}

export default LocationPicker
