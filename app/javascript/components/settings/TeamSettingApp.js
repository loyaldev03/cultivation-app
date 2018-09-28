import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import store from './UserRoleStore'
import reactSelectStyle from '../utils/reactSelectStyle'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { groupBy } from '../utils/ArrayHelper'

const build_facilities_options = facilities =>
  facilities.map(f => ({
    value: f.id,
    label: `${f.name} (${f.code})`
  }))

@observer
class TeamSetttingApp extends React.Component {
  async componentDidMount() {
    await store.loadUsers()
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
            <div className="fl w-70-l w-100 flex flex-column width-100">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">
                Team Settings
              </h5>
              <p className="mt2 body-1 grey">
                Browses through your team's information here.
              </p>

              <label className="grey">Facility:</label>
              <Select
                options={build_facilities_options(facilities)}
                isClearable={true}
                className="measure mt1"
              />

              <label className="grey mt3">Users:</label>
              <table className="collapse ba br2 b--black-10 pv2 ph3 f6 mt1">
                <tbody>
                  <tr className="striped--light-gray">
                    <th className="pv2 ph3 tl fw6 ttu">First Name</th>
                    <th className="tl ttu fw6 pv2 ph3">Last name</th>
                    <th className="tl ttu fw6 pv2 ph3">Email</th>
                    <th>Title</th>
                  </tr>
                  {users.map(x => (
                    <tr key={x.id} className="striped--light-gray">
                      <td className="tl pv2 ph3">{x.first_name}</td>
                      <td className="tl pv2 ph3">{x.last_name}</td>
                      <td className="tl pv2 ph3">{x.email}</td>
                      <td className="pv2 ph3">{x.title}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <h3>Groups</h3>
              {groups.map(x => {
                return <span key={x.id}>{x.name}</span>
              })}

              <h3>Roles</h3>
              {roles.map(x => {
                return <span key={x.id}>{x.name}</span>
              })}

              <h3>Users</h3>
            </div>
          </div>
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body">Side panel</div>
        </div>
      </React.Fragment>
    )
  }
}

export default TeamSetttingApp
