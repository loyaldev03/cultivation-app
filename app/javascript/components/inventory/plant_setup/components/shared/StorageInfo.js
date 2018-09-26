import React from 'react'
import PropTypes from 'prop-types'
import { FieldError } from '../../../../utils/FormHelpers'
import LocationPicker from '../../../../utils/LocationPicker'

class StorageInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      facility_id: '',
      facility_code: '',
      facility_name: '',
      room_code: '',
      room_name: '',
      room_purpose: '',
      section_code: '',
      section_name: '',
      row_code: '',
      shelf_code: '',
      tray_code: '',
      tray_capacity: '',
      location_id: '',
      location_type: '',
      errors: {}
    }

    // Accepts either 'all' or 'storage', in the future to be enhanced by storage_types.
    this.mode = props.mode || 'storage'

    // Storage location
    this.onSearchFound = this.onSearchFound.bind(this)
    this.locationPicker = React.createRef()
  }

  onComponentDidMount() {
    const location = this.locationPicker.current.findLocation(
      this.props.location_id
    )
    const state = {
      ...this.state,
      facility_id: location.f_id,
      facility_code: location.f_code,
      facility_name: location.f_name,
      room_id: location.rm_id,
      room_code: location.rm_code,
      room_name: location.rm_name,
      room_purpose: location.rm_purpose,
      section_code: location.s_code,
      section_name: location.s_name,
      row_id: location.rw_id,
      row_code: location.rw_code,
      shelf_id: location.sf_id,
      shelf_code: location.sf_code,
      tray_id: location.t_id,
      tray_code: location.t_code,
      tray_capacity: location.t_capacity
    }
    this.setState({ state })
  }

  get isStorageMode() {
    return this.mode === 'storage'
  }

  get isMotherMode() {
    return this.mode === 'mother'
  }

  getValues(isDraft = false) {
    let errors = {}

    if (!isDraft) {
      if (this.isStorageMode || this.isMotherMode) {
        errors = this.validateStorage()
      } else {
        errors = this.validateAll()
      }
      this.setState({ errors })
    }

    const {
      facility_id,
      room_id,
      row_id,
      shelf_id,
      tray_id,
      location_id,
      location_type
    } = this.state
    return {
      facility_id,
      room_id,
      row_id,
      shelf_id,
      tray_id,
      location_id,
      location_type,
      errors,
      isValid: Object.getOwnPropertyNames(errors).length === 0
    }
  }

  reset() {
    this.setState({
      facility_id: '',
      facility_code: '',
      facility_name: '',
      room_code: '',
      room_name: '',
      room_purpose: '',
      section_code: '',
      section_name: '',
      row_code: '',
      shelf_code: '',
      tray_code: '',
      tray_capacity: '',
      location_id: '',
      location_type: '',
      errors: {}
    })

    this.locationPicker.current.reset()
  }

  validateAll() {
    let errors = this.validateStorage()
    const { row_id, shelf_id, tray_id } = this.state

    if (row_id.length <= 0) {
      errors = { ...errors, row: ['Row is required.'] }
    }

    if (shelf_id.length <= 0) {
      errors = { ...errors, shelf: ['Shelf is required.'] }
    }

    if (tray_id.length <= 0) {
      errors = { ...errors, tray: ['Tray is required.'] }
    }

    return errors
  }

  validateStorage() {
    let errors = {}
    const { facility_id, room_id } = this.state
    if (facility_id.length <= 0) {
      errors = { location: ['Room is required.'] }
    }

    if (room_id.length <= 0) {
      errors = { ...errors, room: ['Room is required.'] }
    }

    return errors
  }

  onSearchFound(item) {
    this.setState({
      facility_id: item.f_id,
      facility_code: item.f_code.length > 0 ? item.f_code : '--',
      facility_name: item.f_name,

      room_id: item.rm_id,
      room_code: item.rm_code.length > 0 ? item.rm_code : '--',
      room_name: item.rm_name,
      room_purpose: item.rm_purpose,

      // section_id: item.s_id,
      section_code: item.s_code.length > 0 ? item.s_code : '--',
      section_name: item.s_name,

      row_id: item.rw_id,
      row_code: item.rw_code.length > 0 ? item.rw_code : '--',

      shelf_id: item.sf_id,
      shelf_code: item.sf_code.length > 0 ? item.sf_code : '--',

      tray_id: item.t_id,
      tray_code: item.t_code.length > 0 ? item.t_code : '--',
      tray_capacity: item.t_capacity,

      location_id: item.location_id,
      location_type: item.location_type,
      errors: {}
    })
  }

  renderFacilityRoom() {
    if (this.state.facility_id.length <= 0) {
      return null
    }

    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-20 flex flex-column justify-end">
            <label className="f6 fw6 db mb1 gray ttc">Facility</label>
            <p className="f6 fw4 black mb0 mt0">{this.state.facility_code}</p>
          </div>
          <div className="w-80 pl3 flex items-end">
            <p className="f6 fw4 black mb0 mt0">{this.state.facility_name}</p>
          </div>
        </div>

        <div className="mb2 pt2 bt b--black-10 ">
          <div className="ph4 flex">
            <div className="w-20 flex flex-column justify-end">
              <label className="f6 fw6 db mb1 gray ttc">Room</label>
              <p className="f6 fw4 black mb0 mt0">{this.state.room_code}</p>
            </div>
            <div className="w-40 pl3 flex items-end pl3">
              <p className="f6 fw4 black mb0 mt0">{this.state.room_name}</p>
            </div>
            <div className="w-40 pl3 flex items-end pl3">
              <p className="f6 fw4 black mb0 mt0 ttc">
                {this.state.room_purpose}
              </p>
            </div>
          </div>
          <FieldError
            errors={this.state.errors}
            className="ph4 mb1"
            field="room"
          />
        </div>
      </React.Fragment>
    )
  }

  renderRowSectionShelfTray() {
    if (this.isStorageMode || this.isMotherMode) return null

    return (
      <React.Fragment>
        <div className="mb2 pt2 bt b--black-10 ">
          <div className="ph4 flex">
            <div className="w-20 flex flex-column justify-end">
              <label className="f6 fw6 db mb1 gray ttc">Row Code</label>
              <p className="f6 fw4 black mb0 mt0">{this.state.row_code}</p>
            </div>
            <div className="w-40 pl3 flex flex-column justify-end pl3">
              <label className="f6 fw6 db mb1 gray ttc">Section</label>
              <p className="f6 fw4 black mb0 mt0">{this.state.section_code}</p>
            </div>
            <div className="w-40 pl3 items-end">
              <p className="f6 fw4 black mb0 mt0">{this.state.section_name}</p>
            </div>
          </div>
          <FieldError
            errors={this.state.errors}
            className="ph4 mb1"
            field="row"
          />
        </div>

        <div className="mb2 pt2 bt b--black-10 ">
          <div className="ph4 flex">
            <div className="w-20 flex-column justify-end">
              <label className="f6 fw6 db mb1 gray ttc">Shelf</label>
              <p className="f6 fw4 black mb0 mt0">{this.state.shelf_code}</p>
            </div>
            <div className="w-40 flex-column justify-end pl3">
              <label className="f6 fw6 db mb1 gray ttc">Tray</label>
              <p className="f6 fw4 black mb0 mt0">{this.state.tray_code}</p>
            </div>
            <div className="w-40 flex-column justify-end pl3">
              <label className="f6 fw6 db mb1 gray ttc">Tray capacity</label>
              <p className="f6 fw4 black mb0 mt0">
                {this.state.tray_capacity || '--'}
              </p>
            </div>
          </div>
          <FieldError
            errors={this.state.errors}
            className="ph4 mb1"
            field="shelf"
          />
          <FieldError
            errors={this.state.errors}
            className="ph4 mb1"
            field="tray"
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Where are they stored?</span>
        </div>
        <div className="ph4 mb3 flex">
          <div className="w-100">
            <LocationPicker
              ref={this.locationPicker}
              filter_facility_id={this.props.filter_facility_id}
              locations={this.props.locations}
              onChange={this.onSearchFound}
              mode={this.props.mode}
              location_id={this.props.location_id}
            />
            <FieldError errors={this.state.errors} field="location" />
          </div>
        </div>
        {this.renderFacilityRoom()}
        {this.renderRowSectionShelfTray()}
      </React.Fragment>
    )
  }
}

StorageInfo.propTypes = {
  mode: PropTypes.string.isRequired,
  location_id: PropTypes.string,
  filter_facility_id: PropTypes.string
}

StorageInfo.defaultProps = {
  mode: 'all',
  location_id: '',
  filter_facility_id: ''
}

export default StorageInfo
