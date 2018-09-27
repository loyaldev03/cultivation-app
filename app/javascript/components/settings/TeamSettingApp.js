import 'babel-polyfill'
import React from 'react'
import store from './UserRoleStore'
import { observer } from 'mobx-react'

@observer
class TeamSetttingApp extends React.Component {
  async componentDidMount() {
    await store.loadUsers()
  }
  render() {
    return (
      <React.Fragment>
        <div className="pa4">
          <div className="flex flex-column justify-between bg-white box--shadow">
            <div className="pa4 min-h-600">
              <div className="fl w-70-l w-100 flex flex-column width-100">
                <h5 className="tl pa0 ma0 h5--font dark-grey ttc">
                  Team Settings
                </h5>
                <p className="mt2 body-1 grey">
                  Browses through your team's information here.
                </p>
                {store.isLoading && <span className="grey">Loading...</span>}
              </div>
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
