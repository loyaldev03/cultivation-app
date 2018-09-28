import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import store from './UserRoleStore'
import reactSelectStyle from '../utils/reactSelectStyle'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { groupBy } from '../utils/ArrayHelper'
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
  async componentDidMount() {
    await store.loadUsers()
  }

  openSidebar = () => {
    if (!window.editorSidebar || !window.editorSidebar.sidebarNode) {
      window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    }
    window.editorSidebar.open({ width: '600px' })
  }

  closeSidebar = () => {
    this.setState({
      // editingPlant: {}
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
    console.log('Clicked row', userId)
    this.openSidebar()
  }

  onAddUser = () => {
    this.openSidebar()
  }

  render() {
    if (store.isLoading || !store.userRoles) {
      return <span className="grey">Loading...</span>
    }
    const { facilities, users, roles, groups } = store.userRoles.attributes
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
                      options={build_facilities_options(facilities)}
                      isClearable={true}
                      onChange={opt =>
                        this.onSelectChange('facilityFilter', opt)
                      }
                      className="mt1 w-100"
                    />
                  </div>
                  <div>
                    <label className="grey">Roles:</label>
                    <Select
                      options={build_roles_options(roles)}
                      isClearable={true}
                      onChange={opt => this.onSelectChange('roleFilter', opt)}
                      className="mt1 w-100"
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
                      <th className="pv2 ph3 subtitle-2 hark-grey tl ttu">
                        Photo
                      </th>
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
                        <td className="pv2 ph3" />
                        <td className="tl pv2 ph3">{x.first_name}</td>
                        <td className="tl pv2 ph3">{x.last_name}</td>
                        <td className="tl pv2 ph3">{x.email}</td>
                        <td className="tl pv2 ph3">{x.roles}</td>
                        <td className="tl pv2 ph3">{x.roles}</td>
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
            <UserDetailsEditor onClose={this.closeSidebar} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TeamSetttingApp
