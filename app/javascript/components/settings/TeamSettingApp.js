import React from 'react'
import store from './UserRoleStore'
import { observer } from 'mobx-react'
import { groupBy } from '../utils/ArrayHelper'
import LetterAvatar from '../utils/LetterAvatar'
import UserDetailsEditor from './UserDetailsEditor'
import RoleDetailsEditor from './RoleDetailsEditor'
import { toast } from '../utils/toast'
import classNames from 'classnames'
import { DefaultAvatar, NoPermissionMessage } from '../utils'
import GridGroupEmblem from '../utils/GridGroupEmblem'

const build_facilities_options = facilities =>
  facilities.map(f => ({
    value: f.id,
    label: `${f.name} (${f.code})`
  }))

const build_user_manager_options = users =>
  users
    .filter(e => e.user_mode === 'manager' && e.is_active)
    .map(f => ({ value: f.id, label: `${f.first_name} ${f.last_name}` }))

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
    activeTab: 'rolesTab',
    isListView: true
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

  onDeleteRole = (e, x) => {
    e.stopPropagation()
    const result = confirm('Confirm delete this role?')
    if (result) {
      this.onRoleDelete(x)
    }
  }

  openSidebar = () => {
    if (!window.editorSidebar || !window.editorSidebar.sidebarNode) {
      window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    }
    window.editorSidebar.open({ width: '700px' })
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
          this.closeSidebar()
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
          this.closeSidebar()
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
    const { facilities, users, roles, modules, companyWorkSchedules } = store
    const {
      editingUser,
      editingRole,
      isSaving,
      activeTab,
      isListView
    } = this.state
    const facilitiesOptions = build_facilities_options(facilities)
    const userManagerOptions = build_user_manager_options(users)
    const rolesOptions = build_roles_options(roles)
    const {
      userId,
      setting_role_permissions,
      setting_user_permissions
    } = this.props
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
                <React.Fragment>
                  {setting_user_permissions.read && (
                    <div className="mt0 ba b--light-grey pa3">
                      <div className="pb2 db tr">
                        {setting_user_permissions.create && (
                          <a
                            href="#0"
                            className="btn btn--primary"
                            onClick={this.onAddNew}
                          >
                            New User
                          </a>
                        )}
                      </div>
                      <div className="pb2 db tr pa2">
                        <i
                          className={`material-icons ${!isListView &&
                            'gray'} md-21  pointer`}
                          onClick={e => {
                            this.setState({ isListView: true })
                          }}
                        >
                          view_list
                        </i>

                        <i
                          className={`material-icons ${isListView &&
                            'gray'} md-21  pointer`}
                          onClick={e => {
                            this.setState({ isListView: false })
                          }}
                        >
                          grid_on
                        </i>
                      </div>
                      {isListView ? (
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
                                    <div>
                                      <img
                                        src={x.photo_url}
                                        style={{
                                          width: '36px',
                                          height: '36px',
                                          borderRadius: '18px'
                                        }}
                                        onError={e => {
                                          e.target.onerror = null
                                          e.target.src = DefaultAvatar
                                        }}
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
                                  {x.roles.map(r => (
                                    <RoleTag key={r} id={r} />
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="flex flex-wrap justify-around box--br3 pv2 ph3 f6 mt1 w-100 mr4 ">
                          {roles.map(x => (
                            <div className="mb4 w-100">
                              <div
                                className="w-100  bb bw2 b--light-gray"
                                style={{ marginBottom: '2em' }}
                              >
                                <GridGroupEmblem size={56} />
                                <span className="pl3 f3 lh-title gray">
                                  {x.name}
                                </span>
                              </div>
                              <div className="flex flex-wrap">
                                {users
                                  .filter(word => {
                                    let filterRole = word.roles.filter(
                                      role => store.getRoleName(role) == x.name
                                    )
                                    return filterRole.length > 0
                                  })
                                  .map(x => (
                                    <div className="br2 ba dark-gray b--black-10 mv1 pv4 ph2 mw5 mh2 w4">
                                      <div className="db w-100 br2 br--top tc ">
                                        {x.photo_url ? (
                                          <div>
                                            <img
                                              src={x.photo_url}
                                              style={{
                                                width: '36px',
                                                height: '36px',
                                                borderRadius: '18px'
                                              }}
                                              onError={e => {
                                                e.target.onerror = null
                                                e.target.src = DefaultAvatar
                                              }}
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
                                      </div>
                                      <div className="w-100 tc mt3 f6 lh-copy measure  mid-gray">
                                        {x.first_name} {x.last_name}
                                      </div>
                                      <div
                                        className="w-100 tc "
                                        style={{ wordBreak: 'break-all' }}
                                      >
                                        {x.email}
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          ))}
                          <div className="b-orange w-100">
                            <div
                              className="w-100  bb bw2 b--light-gray"
                              style={{ marginBottom: '2em' }}
                            >
                              <GridGroupEmblem size={56} />
                              <span className="pl3 f3 lh-title gray">
                                Unassigned
                              </span>
                            </div>
                            <div className="flex flex-wrap">
                              {users
                                .filter(x => x.roles.length === 0)
                                .map(x => (
                                  <div className="br2 ba dark-gray b--black-10 mv1 pv4 ph2 mw5 mh2 w4">
                                    <div className="db w-100 br2 br--top tc ">
                                      {x.photo_url ? (
                                        <div>
                                          <img
                                            src={x.photo_url}
                                            style={{
                                              width: '36px',
                                              height: '36px',
                                              borderRadius: '18px'
                                            }}
                                            onError={e => {
                                              e.target.onerror = null
                                              e.target.src = DefaultAvatar
                                            }}
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
                                    </div>
                                    <div className="w-100 tc mt3 f6 lh-copy measure  mid-gray">
                                      {x.first_name} {x.last_name}
                                    </div>
                                    <div
                                      className="w-100 tc"
                                      style={{ wordBreak: 'break-all' }}
                                    >
                                      {x.email}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {!setting_user_permissions.read && (
                    <div className="mt0 ba b--light-grey pa3">
                      <NoPermissionMessage />
                    </div>
                  )}
                </React.Fragment>
              )}
              {activeTab === 'rolesTab' && (
                <React.Fragment>
                  {setting_role_permissions.read && (
                    <div className="mt0 ba b--light-grey pa3">
                      <div className="pb2 db tr">
                        {setting_role_permissions.create && (
                          <a
                            href="#0"
                            className="btn btn--primary"
                            onClick={this.onAddNew}
                          >
                            New Role
                          </a>
                        )}
                      </div>
                      <table className="std-table pv2 ph3 f6 mt1 w-100">
                        <tbody>
                          <tr>
                            <th>Role</th>
                            <th>Description</th>
                            <th />
                          </tr>
                          {roles.map(x => (
                            <tr
                              key={x.id}
                              className="pointer"
                              onClick={this.onClickRoleEdit(x.id)}
                            >
                              <td className="tl w5">
                                {x.name}
                                {x.built_in && (
                                  <span className="f7 bg-light-gray gray br2 ml2 ph2">
                                    Built-In
                                  </span>
                                )}
                              </td>
                              <td className="tl pv2 ph3">{x.desc}</td>

                              <td className="tl pv2 ph3 fr">
                                {!x.built_in && (
                                  <i
                                    className="material-icons md-15 orange dim pointer"
                                    onClick={e => this.onDeleteRole(e, x.id)}
                                  >
                                    delete
                                  </i>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {!setting_role_permissions.read && (
                    <div className="mt0 ba b--light-grey pa3">
                      <NoPermissionMessage />
                    </div>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {activeTab === 'usersTab' && (
              <UserDetailsEditor
                key={editingUser.id}
                firstDayOfWeek={this.props.first_day_of_week}
                currentId={userId}
                user={editingUser}
                onSave={this.onUserSave}
                onClose={this.closeSidebar}
                facilitiesOptions={facilitiesOptions}
                userManagerOptions={userManagerOptions}
                rolesOptions={rolesOptions}
                isSaving={isSaving}
                companyWorkSchedules={companyWorkSchedules}
                canUpdate={setting_user_permissions.update}
              />
            )}
            {activeTab === 'rolesTab' && (
              <RoleDetailsEditor
                key={editingRole.id}
                role={editingRole}
                onSave={this.onRoleSave}
                // onDelete={this.onRoleDelete}
                onClose={this.closeSidebar}
                modules={modules}
                isSaving={isSaving}
                canUpdate={setting_role_permissions.update}
                canDelete={setting_role_permissions.delete}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TeamSetttingApp
