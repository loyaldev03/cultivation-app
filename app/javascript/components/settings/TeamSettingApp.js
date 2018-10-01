import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import store from './UserRoleStore'
import reactSelectStyle from '../utils/reactSelectStyle'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { groupBy } from '../utils/ArrayHelper'
import LetterAvatar from '../utils/LetterAvatar'
import UserDetailsEditor from './UserDetailsEditor'

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

@observer
class TeamSetttingApp extends React.Component {
  state = {
    editingUser: {}
  }
  async componentDidMount() {
    await store.loadUsers()

    // TODO: TESTING MODE
    this.setState({
      editingUser: store.getUser('5b63cd7149a93423dd399949')
    })
    this.openSidebar()
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

  onClickSelectionEdit = userId => e => {
    const editingUser = store.getUser(userId)
    if (editingUser) {
      this.setState({ editingUser })
      this.openSidebar()
    }
  }

  onAddUser = () => {
    this.setState({ editingUser: {} })
    this.openSidebar()
  }

  onEditorSave = userDetails => {
    console.log('onEditorSave', userDetails)
  }

  render() {
    if (store.isLoading || !store.userRoles) {
      return <span className="grey">Loading...</span>
    }
    const { facilities, users, roles, groups } = store.userRoles.attributes
    const { editingUser } = this.state
    const facilitiesOptions = build_facilities_options(facilities)
    const rolesOptions = build_roles_options(roles)

    return (
      <React.Fragment>
        <div className="pa4">
          <div className="bg-white box--shadow pa4 min-h-600">
            <div className="fl w-70-l w-100 width-100">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">
                Team Settings
              </h5>
              <p className="mt2 mb4 db body-1 grey">
                Browses through your team's information here.
              </p>

              <label className="mv0 f5 fw6 dark-gray dib bt bl br b--light-grey pv2 ph3">
                Users
              </label>
              <label className="mv0 f5 fw6 dark-gray dib bt br b--light-grey pv2 ph3 bg-light-gray">
                Roles &amp; Permissions
              </label>
              <div className="mt0 ba b--light-grey pa3">
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridColumnGap: '3em'
                  }}
                >
                  <div>
                    <label className="grey">Facility:</label>
                    <Select
                      options={facilitiesOptions}
                      isClearable={true}
                      onChange={opt =>
                        this.onSelectChange('facilityFilter', opt)
                      }
                      className="mt1 w-100 f6"
                    />
                  </div>
                  <div>
                    <label className="grey">Roles:</label>
                    <Select
                      options={rolesOptions}
                      isClearable={true}
                      onChange={opt => this.onSelectChange('roleFilter', opt)}
                      className="mt1 w-100 f6"
                    />
                  </div>
                </div>

                <div className="pt4 pb2 db tr">
                  <a
                    href="#0"
                    className="dib pv2 ph3 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
                    onClick={this.onAddUser}
                  >
                    New User
                  </a>
                </div>
                <table className="collapse ba b--light-grey box--br3 pv2 ph3 f6 mt1 w-100">
                  <tbody>
                    <tr className="striped--light-gray">
                      <th className="pv2 ph3 subtitle-2 hark-grey tl ttu"></th>
                      <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                        First Name
                      </th>
                      <th className="pv2 ph3 subtitle-2 dark-grey tl ttu">
                        Last name
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
                        className="striped--light-gray dim pointer"
                        onClick={this.onClickSelectionEdit(x.id)}
                      >
                        <td className="pv2 ph3">
                          <LetterAvatar firstName={x.first_name} lastName={x.last_name} size={36} radius={18} />
                        </td>
                        <td className="tl pv2 ph3">{x.first_name}</td>
                        <td className="tl pv2 ph3">{x.last_name}</td>
                        <td className="tl pv2 ph3">{x.email}</td>
                        <td className="tl pv2 ph3">{x.roles}</td>
                        <td className="tl pv2 ph3">{x.id}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body">
            <UserDetailsEditor
              key={editingUser.id}
              user={editingUser}
              onSave={this.onEditorSave}
              onClose={this.closeSidebar}
              facilitiesOptions={facilitiesOptions}
              rolesOptions={rolesOptions}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TeamSetttingApp
