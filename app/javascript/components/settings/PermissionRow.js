import React from 'react'

const CAN_NONE = 0
const CAN_READ = 1
const CAN_UPDATE = 2
const CAN_CREATE = 4
const CAN_DELETE = 8

class PermissionRow extends React.PureComponent {
  constructor(props) {
    super(props)
    const value = props.value ? parseInt(props.value) : CAN_NONE
    this.state = {
      value: value
    }
  }

  onCheckboxChange = e => {
    const value = this.state.value ^ parseInt(e.target.value)
    this.setState({ value })
    console.log('onCheckboxChange')
    if (this.props.onChange) {
      this.props.onChange(this.props.code, value)
    }
  }

  render() {
    const { name } = this.props
    const { value } = this.state

    return (
      <tr>
        <td>
          <span className="db ml3 pv1">{name}</span>
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={CAN_READ}
            checked={(value & CAN_READ) !== CAN_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={CAN_UPDATE}
            checked={(value & CAN_UPDATE) !== CAN_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={CAN_CREATE}
            checked={(value & CAN_CREATE) !== CAN_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={CAN_DELETE}
            checked={(value & CAN_DELETE) !== CAN_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
      </tr>
    )
  }
}

export default PermissionRow
