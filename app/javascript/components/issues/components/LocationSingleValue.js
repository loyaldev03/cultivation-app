import React from 'react'
import { components } from 'react-select'

const LocationSingleValue = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex flex-row items-center" style={{ height: '26px'}}>
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

export default LocationSingleValue
