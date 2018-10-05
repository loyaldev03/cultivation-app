import React from 'react'

const PERMISSION_NONE = 0
const PERMISSION_READ = 1
const PERMISSION_UPDATE = 2
const PERMISSION_CREATE = 4
const PERMISSION_DELETE = 8

class PermissionRow extends React.PureComponent {
  render() {
    const { code, name, value } = this.props
    const valueInt = parseInt(value)
    return (
      <tr>
        <td>
          <span className="db ml3 pv1">{name}</span>
        </td>
        <td className="tc">
          <input
            type="checkbox"
            name={code}
            value={PERMISSION_READ}
            checked={(valueInt & PERMISSION_READ) !== PERMISSION_NONE}
            onChange={() => {}}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            name={code}
            value={PERMISSION_UPDATE}
            checked={(valueInt & PERMISSION_UPDATE) !== PERMISSION_NONE}
            onChange={() => {}}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            name={code}
            value={PERMISSION_CREATE}
            checked={(valueInt & PERMISSION_CREATE) !== PERMISSION_NONE}
            onChange={() => {}}
          />
        </td>
        <td className="tc">
          <input
            type="checkbox"
            name={code}
            value={PERMISSION_DELETE}
            checked={(valueInt & PERMISSION_DELETE) !== PERMISSION_NONE}
            onChange={() => {}}
          />
        </td>
      </tr>
    )
  }
}

export default PermissionRow
