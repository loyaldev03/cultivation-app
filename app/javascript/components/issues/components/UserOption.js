import React from 'react'
import { components } from 'react-select'

const UserOption = ({ children, ...props }) => (
  <components.Option {...props}>
    {console.log(props)}
    <div className="flex flex-row items-center">
      {props.data.photo && (
        <img
          src={props.data.photo}
          className="white bg-black-70 tc mr2 flex flex-none justify-center items-center"
        />
      )}
      {!props.data.photo && (
        <span
          className="white bg-black-50 tc mr2 f7 fw6 flex flex-none justify-center items-center"
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            flexShrink: 0
          }}
        >
          {props.data.fallback_photo}
        </span>
      )}
      <span>{children}</span>
    </div>
  </components.Option>
)

export default UserOption
