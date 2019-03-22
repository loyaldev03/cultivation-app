import React from 'react'
import Select, { components } from 'react-select'
import PropTypes from 'prop-types'
import { httpGetOptions } from '.'
import reactSelectStyle from './reactSelectStyle'

class LocationSelector extends React.PureComponent {
  render() {
    const {
      onChange,
      value,
      locationOptions = [],
      show = true,
      readOnly = false
    } = this.props
    if (!show) {
      return null
    }
    if (readOnly) {
      return <div>{value.label}</div>
    }
    return (
      <Select
        isSearchable
        isClearable
        options={locationOptions}
        onChange={onChange}
        value={value}
        styles={reactSelectStyle}
        getOptionLabel={x => x.searchable}
        getOptionValue={x => x.id}
        components={{
          Option: LocationOption,
          SingleValue: LocationSingleValue
        }}
        filterOption={(option, input) => {
          const words = input.toLowerCase().split(/\s/)
          return words.every(
            x => option.data.searchable.toLowerCase().indexOf(x) >= 0
          )
        }}
      />
    )
  }
}

const LocationOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row items-center">
      {props.data.facility_id && props.data.room_id.length <= 0 && (
        <span className="f7 fw6 bg-light-blue dark-blue ph2 pv1 ttu br2">
          {props.data.facility_name} - {props.data.facility_code}
        </span>
      )}
      {props.data.room_id && (
        <span className="f7 fw6 bg-light-green dark-gray ph2 pv1 ttu br2">
          {props.data.room_name} - {props.data.room_code}
        </span>
      )}
      {props.data.row_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-light-red white ph2 pv1 ttu br2">
            {props.data.row_name} - {props.data.row_code}
          </span>
        </span>
      )}
      {props.data.section_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-red white ph2 pv1 ttu br2">
            {props.data.section_code}
          </span>
        </span>
      )}
      {props.data.shelf_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-black-10 dark-gray ph2 pv1 ttu br2">
            {props.data.shelf_code}
          </span>
        </span>
      )}
      {props.data.tray_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 ba b--black-10 dark-gray ph2 pv1 ttu br2">
            {props.data.tray_code}
          </span>
        </span>
      )}
    </div>
  </components.Option>
)

const LocationSingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex flex-row items-center" style={{ height: '26px' }}>
      {props.data.facility_id && props.data.room_id.length <= 0 && (
        <span className="f7 fw6 bg-light-blue dark-blue pa--tag ttu br2">
          {props.data.facility_name} - {props.data.facility_code}
        </span>
      )}
      {props.data.room_id && (
        <span className="f7 fw6 bg-light-green dark-gray pa--tag ttu br2">
          {props.data.room_name} - {props.data.room_code}
        </span>
      )}
      {props.data.row_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-light-red white pa--tag ttu br2">
            {props.data.row_name} - {props.data.row_code}
          </span>
        </span>
      )}
      {props.data.section_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-red white pa--tag ttu br2">
            {props.data.section_code}
          </span>
        </span>
      )}
      {props.data.shelf_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-black-10 dark-gray pa--tag ttu br2">
            {props.data.shelf_code}
          </span>
        </span>
      )}
      {props.data.tray_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 ba b--black-10 dark-gray pa--tag ttu br2">
            {props.data.tray_code}
          </span>
        </span>
      )}
    </div>
  </components.SingleValue>
)

LocationSelector.propTypes = {
  onChange: PropTypes.func.isRequired,
  value: PropTypes.object
}

const loadTaskLocations = async (batchId, taskId) => {
  if (!batchId || !taskId) {
    return Promise.resolve([])
  }
  const locations = await (await fetch(
    `/api/v1/batches/${batchId}/tasks/${taskId}/locations`,
    httpGetOptions
  )).json()
  return locations || []
}

export { loadTaskLocations, LocationSelector }
