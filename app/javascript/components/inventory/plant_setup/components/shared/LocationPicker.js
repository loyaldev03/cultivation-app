import React from 'react'
import Select from 'react-select'
import PropTypes from 'prop-types'
import reactSelectStyle from './reactSelectStyle'

class LocationPicker extends React.Component {
  constructor(props) {
    super(props)

    if (props.mode === 'tray') {
      this.trays = props.locations.filter(x => x.t_id.length > 0)
    } else if (props.mode === 'room') {
      this.trays = props.locations.filter(x => x.rm_id.length > 0 && x.rw_id.length === 0)
    } else {
      this.trays = props.locations
    }

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