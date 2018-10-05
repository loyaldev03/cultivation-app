import React from 'react'

const PERMISSION_NONE = 0
const PERMISSION_READ = 1
const PERMISSION_UPDATE = 2
const PERMISSION_CREATE = 4
const PERMISSION_DELETE = 8

class PermissionRow extends React.PureComponent {
  constructor(props) {
    super(props)
    const value = props.value ? parseInt(props.value) : PERMISSION_NONE
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
            value={PERMISSION_READ}
            checked={(value & PERMISSION_READ) !== PERMISSION_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={PERMISSION_UPDATE}
            checked={(value & PERMISSION_UPDATE) !== PERMISSION_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={PERMISSION_CREATE}
            checked={(value & PERMISSION_CREATE) !== PERMISSION_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            value={PERMISSION_DELETE}
            checked={(value & PERMISSION_DELETE) !== PERMISSION_NONE}
            onChange={this.onCheckboxChange}
          />
        </td>
      </tr>
    )
  }
}

export default PermissionRow
