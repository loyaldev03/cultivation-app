import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import reactSelectStyle from '../../../../utils/reactSelectStyle'

const VEG_TRAY_PURPOSES = ['veg', 'veg1', 'veg2']

class LocationPicker extends React.Component {
  constructor(props) {
    super(props)

    this.facilities = props.locations.filter(this.isFacilityOnly).map(x => ({...x, label: `${x.f_name} - ${x.f_code}` }))
    const facility = this.findFacility(this.facilities, props.filter_facility_id)

    const locations = this.filterLocationByFacility(this.props.filter_facility_id)
    const location = this.findLocation(locations, props.location_id)

    this.state = { 
      value: location,
      facility,
      locations,
    }

    this.mode = props.mode
  }

  isFacilityOnly(item) {
    return item.f_id.length > 0 && item.rm_id.length <= 0
  }

  isClone(facility_id) {
    if (facility_id) {
      return item => item.t_id.length > 0 && item.rm_purpose === 'clone' && item.f_id === facility_id
    } else {
      return item => item.t_id.length > 0 && item.rm_purpose === 'clone'
    }
  }

  isMother(facility_id) {
    if (facility_id) {
      return item =>  item.rm_id.length > 0 &&
                      item.rw_id.length === 0 &&
                      item.rm_purpose === 'mother' &&
                      item.f_id === facility_id
    } else {
      return item =>  item.rm_id.length > 0 &&
                      item.rw_id.length === 0 &&
                      item.rm_purpose === 'mother'
    }
  }

  isVeg(facility_id) {
    if (facility_id) {
      return item =>  item.t_id.length > 0 && 
                      VEG_TRAY_PURPOSES.indexOf(item.rm_purpose) >= 0 &&
                      item.f_id === facility_id
    } else {
      return item =>  item.t_id.length > 0 && 
                      VEG_TRAY_PURPOSES.indexOf(item.rm_purpose) >= 0
    }
  }

  isRoomOnly(facility_id) {
    if (facility_id) {
      return item =>  item.rm_id.length > 0 && 
                      item.rw_id.length === 0 &&
                      item.f_id === facility_id
    } else {
      return item =>  item.rm_id.length > 0 && 
                      item.rw_id.length === 0
    }
  }

  get isFacilitySet() {
    return this.props.filter_facility_id || this.props.filter_facility_id.length > 0
  }

  filterLocationByFacility = (facility_id) => {
    if (facility_id === null || facility_id.length <= 0) {
      return []
    }

    let _locations = []
    const { mode, locations } = this.props
    if (mode === 'clone') {
      _locations = locations.filter(this.isClone(facility_id))
    } else if (mode === 'vegTray') {
      _locations = locations.filter(this.isVeg(facility_id))
    } else if (mode === 'mother') {
      _locations = locations.filter(this.isMother(facility_id))
    } else if (mode === 'room') {
      _locations = locations.filter(this.isRoomOnly(facility_id))
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
    } else if (mode === 'clone' || mode === 'vegTray') {
      item = locations.find(x => x.t_id === location_id)
    }
    //return item ? item : { value: '', label: '' }
    return item
  }

  findFacility(locations, facility_id) {
    return locations.find(x => x.f_id === facility_id )
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
      return {
        location_id: '',
        location_type: ''
      }
    }
  }

  onChangeFacility = item => {
    console.log('onChangeFacility')
    console.log(item)
    this.setState({ 
      facility: { value: item.f_id, label: item.label },
      value: { value: '', label: '' },
      locations: this.filterLocationByFacility(item.f_id)
    })
  }

  onChange = item => {
    console.log(item)
    const locationData = this.extractLocationId(item, this.props.mode)
    this.props.onChange({ ...item, ...locationData })
    this.setState({ value: { value: item.value, label: item.label } })
  }

  reset() {
    this.setState({ value: null })
  }

  render() {
    return (
      <React.Fragment>
        { !this.isFacilitySet && 
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
                return words.every(x => option.label.toLowerCase().indexOf(x) >= 0)
              }}
            />
          </div>
        }
        <label className="f6 fw6 db mb1 gray ttc">Tray ID</label>
        <Select
          key={this.state.facility}
          styles={reactSelectStyle}
          placeholder="Search location within your facility"
          options={this.state.locations}
          onChange={this.onChange}
          value={this.state.value}
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
