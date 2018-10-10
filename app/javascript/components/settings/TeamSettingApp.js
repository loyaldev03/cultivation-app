import 'babel-polyfill'
import React from 'react'
import store from './UserRoleStore'
import { observer } from 'mobx-react'
import { groupBy } from '../utils/ArrayHelper'
import LetterAvatar from '../utils/LetterAvatar'
import UserDetailsEditor from './UserDetailsEditor'
import RoleDetailsEditor from './RoleDetailsEditor'
import { toast } from '../utils/toast'
import classNames from 'classnames'

const build_facilities_options = facilities =>
  facilities.map(f => ({
    value: f.id,
    label: `${f.name} (${f.code})`
  }))

const build_roles_options = roles =>
  roles.map(f => ({
    value: f.id,
    label: `${f.name}`
  }))

const TabButton = ({ title, onClick, isActive }) => (
  <a
    href="#0"
    className={classNames('tab', { 'tab--active': isActive })}
    onClick={onClick}
  >
    {title}
  </a>
)

const FacilityTag = ({ id }) => (
  <span className="f7 bg-blue pv1 ph2 white ma1 dib">
    {store.getFacilityCode(id)}
  </span>
)

const RoleTag = ({ id }) => (
  <span className="f7 bg-blue pv1 ph2 white ma1 dib">
    {store.getRoleName(id)}
  </span>
)

@observer
class TeamSetttingApp extends React.Component {
  state = {
    editingUser: {},
    editingRole: {},
    activeTab: 'rolesTab'
  }
  async componentDidMount() {
    await store.loadUsers(true)

    // TODO: TESTING MODE
    // this.setState({
    //   activeTab: 'rolesTab',
    //   editingRole: store.getRole('5bb41e1c49a9346d67fc9b19')
    // })
    // this.openSidebar()
    // TODO: TESTING MODE
  }

  openSidebar = () => {
    if (!window.editorSidebar || !window.editorSidebar.sidebarNode) {
      window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    }
    window.editorSidebar.open({ width: '500px' })
  }

  closeSidebar = () => {
    this.setState({
      editingUser: {}
    })
    window.editorSidebar.close()
  }

  onSelectChange = (field, option) => {
    if (option) {
      this.setState({ [field]: option.value })
    } else {
      this.setState({ [field]: '' })
    }
  }

  onClickUserEdit = userId => e => {
    const editingUser = store.getUser(userId)
    if (editingUser) {
      this.setState({ editingUser })
      this.openSidebar()
    }
  }

  onClickRoleEdit = roleId => e => {
    const editingRole = store.getRole(roleId)
    if (editingRole) {
      this.setState({ editingRole })
      this.openSidebar()
    }
  }

  onAddNew = () => {
    this.setState({ editingUser: {}, editingRole: {} })
    this.openSidebar()
  }

  onUserSave = async userDetails => {
    this.setState({ isSaving: true })
    try {
      const response = await (await fetch('/api/v1/user_roles/update_user', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
      })).json()
      if (response && response.data) {
        store.updateUser({ id: response.data.id, ...response.data.attributes })
        if (userDetails.user.id) {
          toast('User updated.', 'success')
        } else {
          toast('User created', 'success')
          this.closeSidebar()
        }
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error('Error while saving user', error)
    }
    this.setState({ isSaving: false })
  }

  onRoleSave = async roleDetails => {
    this.setState({ isSaving: true })
    try {
      const response = await (await fetch('/api/v1/user_roles/update_role', {
        method: 'POST',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(roleDetails)
      })).json()
      if (response && response.data) {
        store.updateRole({ id: response.data.id, ...response.data.attributes })
        if (roleDetails.role.id) {
          toast('Role updated', 'success')
        } else {
          toast('Role created', 'success')
          this.closeSidebar()
        }
      } else {
        toast(`Update error: ${response.error}`, 'error')
      }
    } catch (error) {
      console.error('Error while saving role', error)
    }
    this.setState({ isSaving: false })
  }

  onRoleDelete = async roleId => {
    this.setState({ isSaving: true })
    try {
      const response = await (await fetch('/api/v1/user_roles/destroy_role', {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: { id: roleId } })
      })).json()
      if (response && response.data) {
        store.deleteRole(roleId)
        toast('Role deleted.', 'success')
        this.closeSidebar()
      } else {
        toast(`Error deleting role: ${response.error}`, 'error')
      }
    } catch (error) {
      console.error('Error while deleting role', error)
    }
    this.setState({ isSaving: false })
  }

  onToggleTab = tabName => e => {
    this.setState({ activeTab: tabName })
  }

  render() {
    if (store.isLoading) {
      return <p className="orange ph4 pt3">Loading...</p>
    }
    if (!store.isDataLoaded) {
      return <p className="orange ph4 pt3">No data available...</p>
    }
    const { facilities, users, roles, modules } = store
    const { editingUser, editingRole, isSaving, activeTab } = this.state
    const facilitiesOptions = build_facilities_options(facilities)
    const rolesOptions = build_roles_options(roles)

    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="pa4">
          <div className="bg-white box--shadow pa4 fl w-100">
            <div className="fl w-80-l w-100-m">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">
                Team Settings
              </h5>
              <p className="mt2 mb4 db body-1 grey">
                Browses through your team's information here.
              </p>
              <TabButton
                title="Roles & Permissions"
                isActive={activeTab === 'rolesTab'}
                onClick={this.onToggleTab('rolesTab')}
              />
              <TabButton
                title="Users"
                isActive={activeTab === 'usersTab'}
                onClick={this.onToggleTab('usersTab')}
              />
              {activeTab === 'usersTab' && (
                <div className="mt0 ba b--light-grey pa3">
                  <div className="pb2 db tr">
                    <a
                      href="#0"
                      className="dib pv2 ph3 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
                      onClick={this.onAddNew}
                    >
                      New User
                    </a>
                  </div>
                  <table className="collapse ba b--light-grey box--br3 pv2 ph3 f6 mt1 w-100">
                    <tbody>
                      <tr className="striped--light-gray">
                        <th />
                        <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                          Name
                        </th>
                        <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                          Email
                        </th>
                        <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                          Facility
                        </th>
                        <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                          Role
                        </th>
                      </tr>
                      {users.map(x => (
                        <tr
                          key={x.id}
                          className={classNames(
                            'striped--light-gray dim pointer',
                            { grey: !x.is_active }
                          )}
                          onClick={this.onClickUserEdit(x.id)}
                        >
                          <td className="pa2 tc">
                            {x.photo_url ? (
                              <div
                                style={{
                                  height: '36px',
                                  borderRadius: '36px',
                                  overflow: 'hidden'
                                }}
                              >
                                <img
                                  src={x.photo_url}
                                  style={{ height: '100%' }}
                                />
                              </div>
                            ) : (
                              <LetterAvatar
                                firstName={x.first_name}
                                lastName={x.last_name}
                                size={36}
                                radius={18}
                              />
                            )}
                          </td>
                          <td className="tl pv2 ph3">
                            {x.first_name} {x.last_name}
                            <span
                              className={classNames('db f7', {
                                green: x.is_active
                              })}
                            >
                              {x.is_active ? 'Active' : 'Deactivated'}
                            </span>
                          </td>
                          <td className="tl pv2 ph3">{x.email}</td>
                          <td className="tl pv2 ph3">
                            {x.facilities.map(f => (
                              <FacilityTag key={f} id={f} />
                            ))}
                          </td>
                          <td className="tl pv2 ph3">
                            {x.roles.map(r => <RoleTag key={r} id={r} />)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {activeTab === 'rolesTab' && (
                <div className="mt0 ba b--light-grey pa3">
                  <div className="pb2 db tr">
                    <a
                      href="#0"
                      className="dib pv2 ph3 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
                      onClick={this.onAddNew}
                    >
                      New Role
                    </a>
                  </div>
                  <table className="collapse ba b--light-grey box--br3 pv2 ph3 f6 mt1 w-100">
                    <tbody>
                      <tr className="striped--light-gray">
                        <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                          Role
                        </th>
                        <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                          Description
                        </th>
                      </tr>
                      {roles.map(x => (
                        <tr
                          key={x.id}
                          className={'striped--light-gray dim pointer'}
                          onClick={this.onClickRoleEdit(x.id)}
                        >
                          <td className="tl pv2 ph3 w5">
                            {x.name}
                            { x.readonly && <span className="f7 bg-light-gray gray br2 ml2 ph2">Built-In</span> }
                          </td>
                          <td className="tl pv2 ph3">{x.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {activeTab === 'usersTab' && (
              <UserDetailsEditor
                key={editingUser.id}
                user={editingUser}
                onSave={this.onUserSave}
                onClose={this.closeSidebar}
                facilitiesOptions={facilitiesOptions}
                rolesOptions={rolesOptions}
                isSaving={isSaving}
              />
            )}
            {activeTab === 'rolesTab' && (
              <RoleDetailsEditor
                key={editingRole.id}
                role={editingRole}
                onSave={this.onRoleSave}
                onDelete={this.onRoleDelete}
                onClose={this.closeSidebar}
                modules={modules}
                isSaving={isSaving}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TeamSetttingApp
