import React from 'react'
import { components } from 'react-select'

const TaskOption = ({ children, ...props }) => (
  <components.Option {...props}>
    <div
      className="flex flex-row items-center"
      style={{ marginLeft: props.data.indent * 15 }}
    >
      {children}
    </div>
  </components.Option>
)

export default TaskOption
