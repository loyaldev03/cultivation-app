import React from 'react'
import PermissionRow from './PermissionRow'
import isEmpty from 'lodash.isempty'

class RoleDetailsEditor extends React.Component {
  constructor(props) {
    super(props)
    if (props.userroleAction === 'edit') {
      let permissions = props.role.permissions || []
      let selectAll = []
      if (!props.role.builtIn) {
        let children = []
        let count = []
        props.modules.map(mod => {
          children = mod.features.map(x => x.code)
          if (!isEmpty(permissions)) {
            count = permissions.filter(
              p0 => children.includes(p0.code) && p0.value === 15
            ).length
            if (count === children.length) {
              selectAll.push(mod.code)
            }
          }
        })
      }

      this.state = {
        roleId: props.role.id,
        name: props.role.name || '',
        desc: props.role.desc || '',
        permissions: permissions,
        builtIn: props.role.built_in || false,
        selectAll: selectAll
      }
    } else {
      this.state = {
        roleId: '',
        name: '',
        desc: '',
        permissions: [],
        builtIn: false,
        selectAll: []
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userroleAction === 'edit') {
      let selectAll = []
      if (!nextProps.role.builtIn) {
        let children = []
        let count = []
        nextProps.modules.map(mod => {
          children = mod.features.map(x => x.code)
          if (!isEmpty(nextProps.role.permissions)) {
            count = nextProps.role.permissions.filter(
              p0 => children.includes(p0.code) && p0.value === 15
            ).length
            if (count === children.length) {
              selectAll.push(mod.code)
            }
          }
        })
      }

      this.setState({
        roleId: nextProps.role.id,
        name: nextProps.role.name,
        desc: nextProps.role.desc,
        permissions: nextProps.role.permissions,
        builtIn: nextProps.role.built_in,
        selectAll: selectAll
      })
    } else {
      this.setState({
        roleId: '',
        name: '',
        desc: '',
        permissions: [],
        builtIn: false,
        selectAll: []
      })
    }
  }

  getPermission = code => {
    if (this.state.builtIn) {
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
      permissions = this.state.permissions.map(p0 =>
        p0.code === code ? p1 : p0
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

  selectAllPermission = (children, parent) => {
    let selectAll = this.state.selectAll
    if (isEmpty(selectAll)) {
      selectAll = [parent]
      this.setAllPermission(children, 15)
    } else {
      if (selectAll.includes(parent)) {
        let index = selectAll.indexOf(parent)
        if (index !== -1) {
          selectAll.splice(index, 1)
        }
        this.setAllPermission(children, 0)
      } else {
        selectAll.push(parent)
        this.setAllPermission(children, 15)
      }
    }
    this.setState({ selectAll })
  }

  setAllPermission = (codes, value) => {
    let permissions = this.state.permissions
    codes.map(code => {
      let found = permissions.findIndex(p0 => p0.code === code)
      let p1 = { code, value }
      if (found > -1) {
        permissions = permissions.map(p0 => (p0.code === code ? p1 : p0))
      } else {
        permissions = [...permissions, p1]
      }
    })
    this.setState({ permissions })
  }

  render() {
    const {
      onClose,
      isSaving,
      modules,
      canUpdate,
      canDelete,
      userroleAction
    } = this.props
    const { name, desc, builtIn, selectAll } = this.state
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
                    <th
                      className="bb b--light-grey bg-white dark-gray"
                      style={{ position: 'sticky', top: 0 }}
                    >
                      Permission
                    </th>
                    <th
                      className="bb b--light-grey bg-white dark-gray"
                      style={{ position: 'sticky', top: 0 }}
                    >
                      View
                    </th>
                    <th
                      className="bb b--light-grey bg-white dark-gray"
                      style={{ position: 'sticky', top: 0 }}
                    >
                      Edit
                    </th>
                    <th
                      className="bb b--light-grey bg-white dark-gray"
                      style={{ position: 'sticky', top: 0 }}
                    >
                      Create
                    </th>
                    <th
                      className="bb b--light-grey bg-white dark-gray"
                      style={{ position: 'sticky', top: 0 }}
                    >
                      Delete
                    </th>
                  </tr>
                  {modules.map(mod => (
                    <React.Fragment key={mod.code}>
                      <tr>
                        <td colSpan="2" className="pt2">
                          <span className="underline b">{mod.name}</span>
                        </td>
                        <td colSpan="3" className="pt2">
                          {!builtIn ? (
                            <a
                              className={`pa2 flex link dim pointer items-center red`}
                              onClick={() => {
                                this.selectAllPermission(
                                  mod.features.map(x => x.code),
                                  mod.code
                                )
                              }}
                            >
                              {selectAll.includes(mod.code)
                                ? 'Unselect All'
                                : 'Select All'}
                            </a>
                          ) : (
                            ''
                          )}
                        </td>
                      </tr>
                      {mod.features.map(feat => (
                        <PermissionRow
                          key={feat.code}
                          code={feat.code}
                          name={feat.name}
                          value={this.getPermission(feat.code).value}
                          isReadOnly={builtIn}
                          action={userroleAction}
                          onChange={this.setPermission}
                        />
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {!builtIn ? (
            <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
              {/* {canDelete && (
                <a
                  href="#0"
                  className="btn btn--secondary"
                  onClick={this.onDelete}
                >
                  Delete
                </a>
              )} */}
              {canUpdate && (
                <input
                  type="submit"
                  value={saveButtonText}
                  className="fr btn btn--primary"
                />
              )}
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
