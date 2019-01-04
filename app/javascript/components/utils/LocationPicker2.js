import React from 'react'
import Select from 'react-select'
import { httpGetOptions } from './FetchHelper'
import PropTypes from 'prop-types'
import reactSelectStyle from './reactSelectStyle'

const VEG_TRAY_PURPOSES = ['veg', 'veg1', 'veg2']

class LocationPicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      locations: []
    }
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
    }
    return () => false
  }

  isMother(facility_id) {
    if (facility_id) {
      return item =>
        item.rm_id.length > 0 &&
        item.rw_id.length === 0 &&
        item.rm_purpose === 'mother' &&
        item.f_id === facility_id
    }
    return () => false
  }

  isVeg(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        VEG_TRAY_PURPOSES.indexOf(item.rm_purpose) >= 0 &&
        item.f_id === facility_id
    }
    return () => false
  }

  isDry(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        item.rm_purpose === 'dry' &&
        item.f_id === facility_id
    }
    return () => false
  }

  isFlower(facility_id) {
    if (facility_id) {
      return item =>
        item.t_id.length > 0 &&
        item.rm_purpose === 'flower' &&
        item.f_id === facility_id
    }
    return () => false
  }

  isRoomOnly(facility_id) {
    if (facility_id) {
      return item =>
        item.rm_id.length > 0 &&
        item.rw_id.length === 0 &&
        item.f_id === facility_id
    }
    return () => false
  }

  isStorage(facility_id) {
    if (facility_id) {
      return item =>
        item.rm_id.length > 0 &&
        item.rw_id.length === 0 &&
        item.rm_purpose === 'storage' &&
        item.f_id === facility_id
    }
    return () => false
  }

  isAll() {
    return true
  }

  filterLocationByFacility = facility_id => {
    let _locations = []
    const { mode } = this.props
    const { locations } = this.state

    if (mode === 'clone') {
      _locations = locations.filter(this.isClone(facility_id))
    } else if (mode === 'veg') {
      _locations = locations.filter(this.isVeg(facility_id))
    } else if (mode === 'mother') {
      _locations = locations.filter(this.isMother(facility_id))
    } else if (mode === 'room') {
      _locations = locations.filter(this.isRoomOnly(facility_id))
    } else if (mode === 'flower') {
      _locations = locations.filter(this.isFlower(facility_id))
    } else if (mode === 'dry') {
      _locations = locations.filter(this.isDry(facility_id))
    } else if (mode === 'storage') {
      _locations = locations.filter(this.isStorage(facility_id))
    } else if (mode === 'facility') {
      _locations = locations.filter(this.isFacilityOnly).map(x => ({
        ...x,
        label: `${x.f_name} - ${x.f_code}`,
        value: x.f_id
      }))
    } else {
      _locations = locations
    }
    console.log(_locations)
    return _locations
  }

  /* Utility method to find item from location id & mode combination */
  findLocation(locations, location_id) {
    const { mode } = this.props
    let item = { value: '', label: '' }
    if (mode === 'mother' || mode === 'room' || mode === 'storage') {
      item = locations.find(x => x.rm_id === location_id)
    } else if (['clone', 'veg', 'flower', 'dry'].indexOf(mode) >= 0) {
      item = locations.find(x => x.t_id === location_id)
    } else if (mode === 'facility') {
      item = locations.find(x => x.f_id === location_id)
    } else if (mode === 'all') {
      item = locations.find(x => x.id === location_id) //
    }

    if (!item) {
      return { value: '', label: '' }
    }
    return item
  }

  /* Utility method to extract location id & mode combination from item */
  extractLocationId(selectedItem) {
    const { mode } = this.props
    if (mode === 'mother' || mode === 'room') {
      return {
        location_id: selectedItem.rm_id,
        location_type: selectedItem.rm_purpose
      }
    } else if (['clone', 'veg', 'flower', 'dry'].indexOf(mode) >= 0) {
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

  onChange = item => {
    const locationData = this.extractLocationId(item, this.props.mode)
    this.props.onChange({ ...item, ...locationData })
  }

  get label() {
    const { mode } = this.props
    if (mode === 'clone') {
      return 'Tray ID'
    } else if (mode === 'veg') {
      return 'Tray ID'
    } else if (mode === 'mother') {
      return 'Mother room ID'
    } else if (mode === 'room') {
      return 'Room ID'
    } else if (mode === 'flower') {
      return 'Flower room ID'
    } else if (mode === 'dry') {
      return 'Location in Dry/ Cure Room'
    } else if (mode === 'facility') {
      return 'Facility'
    } else {
      return 'Location ID'
    }
  }

  componentDidMount() {
    fetch(
      `/api/v1/facilities/search_locations?facility_id=${
        this.props.facility_id
      }`,
      httpGetOptions
    ).then(response => {
      return response.json().then(locations => {
        console.log(locations)
        this.setState({ locations })
      })
    })
  }

  render() {
    // const locations = this.filterLocationByFacility(this.props.facility_id)
    const locations = this.state.locations
    const selectedLocation = this.findLocation(
      locations,
      this.props.location_id || ''
    )

    const isDisabled = this.props.isDisabled || false

    return (
      <React.Fragment>
        <label className="f6 fw6 db mb1 gray ttc">{this.label}</label>
        <Select
          isDisabled={isDisabled}
          styles={reactSelectStyle}
          placeholder="Search location within the facility"
          options={locations}
          onChange={this.onChange}
          value={selectedLocation}
          filterOption={(option, input) => {
            const words = input.toLowerCase().split(/\s/)
            return words.every(x => option.label.toLowerCase().indexOf(x) >= 0)
          }}
        />
        {/* <AsyncSelect
          isDisabled={isDisabled}
          loadOptions={this.loadLocations}
          defaultOptions
          placeholder="Search location within the facility"
          onChange={this.onChange}
          value={selectedLocation}
          styles={reactSelectStyle}
          filterOption={(option, input) => {
            const words = input.toLowerCase().split(/\s/)
            return words.every(x => option.label.toLowerCase().indexOf(x) >= 0)
          }}
        /> */}
      </React.Fragment>
    )
  }
}

LocationPicker.propTypes = {
  mode: PropTypes.string.isRequired,
  // locations: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  location_id: PropTypes.string,
  facility_id: PropTypes.string
}

LocationPicker.defaultProps = {
  mode: 'tray',
  location_id: '',
  facility_id: null,
  locations: []
}

export default LocationPicker
