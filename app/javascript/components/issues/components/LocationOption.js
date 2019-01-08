import React from 'react'
import { components } from 'react-select'

const LocationOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row items-center">
      {props.data.f_id && props.data.rm_id.length <= 0 && (
        <span className="f7 fw6 bg-light-blue dark-blue ph2 pv1 ttu br2">
          {props.data.f_name} - {props.data.f_code}
        </span>
      )}
      {props.data.rm_id && (
        <span className="f7 fw6 bg-light-green dark-gray ph2 pv1 ttu br2">
          {props.data.rm_name} - {props.data.rm_code}
        </span>
      )}
      {props.data.rw_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-light-red white ph2 pv1 ttu br2">
            {props.data.rw_name} - {props.data.rw_code}
          </span>
        </span>
      )}
      {props.data.t_id && (
        <span>
          <span className="f7 fw6 mh1 gray">&#183;</span>
          <span className="f7 fw6 bg-black-10 dark-gray ph2 pv1 ttu br2">
            {props.data.t_code}
          </span>
        </span>
      )}
    </div>
  </components.Option>
)

export default LocationOption
