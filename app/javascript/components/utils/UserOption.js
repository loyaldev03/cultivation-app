import React from 'react'
import { components } from 'react-select'
import Avatar from './Avatar'

const UserOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row items-center">
      <Avatar
        firstName={props.data.first_name}
        lastName={props.data.last_name}
        photoUrl={props.data.photo}
        size="18px"
        backgroundColor="#ccc"
      />
      <span className="mh2">{children}</span>
      <span className="f7 fw6 mh1 gray">&#183;</span>
      {
        props.data.roles.map(x => (
          <span className="f7 fw6 bg-light-blue dark-blue pa--tag ttu br2" key={x}>
            {x}
          </span>
        ))
      }
    </div>
  </components.Option>
)

export default UserOption
