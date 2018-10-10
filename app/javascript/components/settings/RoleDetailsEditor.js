import React from 'react'
import PermissionRow from './PermissionRow'

const SUPER_ADMIN = 'Super Admin'

class RoleDetailsEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.role) {
      this.state = {
        roleId: props.role.id,
        name: props.role.name || '',
        desc: props.role.desc || '',
        permissions: props.role.permissions || [],
        isSuperAdmin: props.role.name === SUPER_ADMIN
      }
    } else {
      this.state = {
        roleId: '',
        name: '',
        desc: '',
        permissions: [],
        isSuperAdmin: false
      }
    }
  }

  getPermission = code => {
    if (this.state.isSuperAdmin) {
      return { code, value: 15 }
    }
    const p = this.state.permissions.find(x => x.code === code)
    return p || { code, value: 0 }
  }

  setPermission = (code, value) => {
    const found = this.state.permissions.findIndex(p0 => p0.code === code)
    const p1 = { code, value }
    let permissions = []
    if (found > -1) {
      permissions = this.state.permissions.map(
        p0 => (p0.code === code ? p1 : p0)
      )
    } else {
      permissions = [...this.state.permissions, p1]
    }
    this.setState({ permissions })
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onSubmit = e => {
    e.preventDefault()
    const roleDetails = {
      role: {
        id: this.state.roleId,
        name: this.state.name,
        desc: this.state.desc,
        permissions: this.state.permissions
      }
    }
    this.props.onSave(roleDetails)
  }

  onDelete = e => {
    const result = confirm('Confirm delete this role?')
    if (result) {
      this.props.onDelete(this.state.roleId)
    }
  }

  render() {
    const { onClose, isSaving, modules } = this.props
    const { name, desc, isSuperAdmin } = this.state
    const saveButtonText = isSaving ? 'Saving...' : 'Save'
    return (
      <div className="h-100 flex flex-auto flex-column">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">Role Details</h5>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <form
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4">
            <div className="mt2 fl w-100">
              <div className="w-100 fl pr3">
                <label className="f6 fw6 db mb1 gray ttc">Name</label>
                <input
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('name')}
                  value={name}
                  required={true}
                />
              </div>
            </div>
            <div className="mt2 fl w-100">
              <div className="w-100 fl">
                <label className="f6 fw6 db mb1 gray ttc">Description</label>
                <textarea
                  className="db w-100 h3 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('desc')}
                  value={desc}
                />
              </div>
            </div>
            <div className="mt3 fl w-100">
              <table className="w-100 f6">
                <tbody>
                  <tr className="pv2">
                    <th className="bb b--light-grey dark-gray">Permission</th>
                    <th className="bb b--light-grey dark-gray">View</th>
                    <th className="bb b--light-grey dark-gray">Edit</th>
                    <th className="bb b--light-grey dark-gray">Create</th>
                    <th className="bb b--light-grey dark-gray">Delete</th>
                  </tr>
                  {modules.map(mod => (
                    <React.Fragment key={mod.code}>
                      <tr>
                        <td colSpan="5" className="pt2">
                          <span className="underline b">{mod.name}</span>
                        </td>
                      </tr>
                      {mod.features.map(feat => (
                        <PermissionRow
                          key={feat.code}
                          code={feat.code}
                          name={feat.name}
                          value={this.getPermission(feat.code).value}
                          isReadOnly={isSuperAdmin}
                          onChange={this.setPermission}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {!isSuperAdmin ? (
            <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
              <a
                href="#0"
                className="fl ph3 pv2 button--font bn box--br3 ttu link dim pointer"
                onClick={this.onDelete}
              >
                Delete
              </a>
              <input
                type="submit"
                value={saveButtonText}
                className="fr ph3 pv2 bg-orange button--font white bn box--br3 ttu link dim pointer"
              />
            </div>
          ) : (
            <div className="pt4" />
          )}
        </form>
      </div>
    )
  }
}

export default RoleDetailsEditor
