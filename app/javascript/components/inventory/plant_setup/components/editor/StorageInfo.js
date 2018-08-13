import React from 'react'
import Async from 'react-select/lib/Async'
import { TextInput } from '../../../../utils/FormHelpers'

export default class StorageInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // Storage location
      room: props.room || '',
      room_id: props.room_id || '',
      section_name: props.section_name || '',
      section_id: props.section_id || '',
      row_id: props.row_id || '',
      shelf_id: props.shelf_id || '',
      tray_id: props.tray_id || '',
      errors: {}
    }

    // Storage location
    this.onRoomChanged = this.onRoomChanged.bind(this)
    this.onRoomIdChanged = this.onRoomIdChanged.bind(this)
    this.onSectionNameChanged = this.onSectionNameChanged.bind(this)
    this.onSectionIdChanged = this.onSectionIdChanged.bind(this)
    this.onRowIdChanged = this.onRowIdChanged.bind(this)
    this.onShelfIdChanged = this.onShelfIdChanged.bind(this)
    this.onTrayIdChanged = this.onTrayIdChanged.bind(this)
  }

  getValues(isDraft = false) {
    if (isDraft) {
    }
    return {}
  }

  onRoomChanged(event) {
    this.setState({ room: event.target.value })
  }

  onRoomIdChanged(event) {
    this.setState({ room_id: event.target.value })
  }

  onSectionNameChanged(event) {
    this.setState({ section_name: event.target.value })
  }

  onSectionIdChanged(event) {
    this.setState({ section_id: event.target.value })
  }

  onRowIdChanged(event) {
    this.setState({ row_id: event.target.value })
  }

  onShelfIdChanged(event) {
    this.setState({ shelf_id: event.target.value })
  }

  onTrayIdChanged(event) {
    this.setState({ tray_id: event.target.value })
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Where are they stored?</span>
          {this.props.rooms.join(', ')}
        </div>
        <div className="ph4 mb3 flex">
          <div className="w-60">
            <TextInput
              label={'Room'}
              value={this.state.room}
              onChange={this.onRoomChanged}
            />
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Room ID</label>
            <p className="i f6 fw4 black-30">Room ID</p>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-60">
            <TextInput
              label={'Section'}
              value={this.state.section_name}
              onChange={this.onSectionNameChanged}
            />
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Section ID</label>
            <p className="i f6 fw4 black-30">Section ID</p>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-30">
            <TextInput
              label={'Row Id'}
              value={this.state.row_id}
              onChange={this.onRowIdChanged}
            />
          </div>
          <div className="w-30 pl3">
            <TextInput
              label={'Shelf Id'}
              value={this.state.shelf_id}
              onChange={this.onShelfIdChanged}
            />
          </div>
          <div className="w-40 pl3">
            <TextInput
              label={'Tray Id'}
              value={this.state.tray_id}
              onChange={this.onTrayIdChanged}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}
