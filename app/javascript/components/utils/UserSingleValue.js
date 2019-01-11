import React from 'react'
import { components } from 'react-select'
import Avatar from './Avatar'

const UserOption = ({ children, ...props }) => (
  <components.SingleValue {...props}>
    <div className="flex flex-row items-center" style={{height: '26px'}}>
      <Avatar
        firstName={props.data.first_name}
        lastName={props.data.last_name}
        photoUrl={props.data.photo}
        size="18px"
        backgroundColor="#ccc"
      />
      <span className="mh2">{children}</span>
      {
        props.data.roles.map(x => (
          <span className="f7 fw6 bg-light-blue dark-blue pa--tag ttu br2" key={x}>
            {x}
          </span>
        ))
      }
    </div>
  </components.SingleValue>
)

export default UserOption
