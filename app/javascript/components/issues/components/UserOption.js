import React from 'react'
import { components } from 'react-select'
import Avatar from '../../utils/Avatar'

const UserOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <div className="flex flex-row items-center">
      <Avatar 
        firstName={props.data.first_name} 
        lastName={props.data.last_name} 
        photoUrl={props.data.photo} 
        size='18px' 
        backgroundColor="#ccc"
      />
      <span className="ml2">{children}</span>
    </div>
  </components.Option>
)

export default UserOption
