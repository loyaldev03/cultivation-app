import React from 'react'
import { observer } from 'mobx-react'
import UserStore from '../stores/NewUserStore'
import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'
import Avatar from '../../../utils/Avatar'

const PersonRow = React.memo(
  ({ firstName, lastName, photoUrl, email, roles, onClick, isSelected }) => (
    <li className="">
      <a
        className="flex grey link items-center justify-between f5 pa1"
        href="#0"
        onClick={onClick}
      >
        <div className="flex items-center">
          <Avatar
            firstName={firstName}
            lastName={lastName}
            photoUrl={photoUrl}
          />
          <span className="w4 flex flex-column ph2">
            <span className="f5">
              {firstName} {lastName}
            </span>
            <span className="f7 fw4 pv1 w2 tc">{roles}</span>
          </span>
          <span className="f5">{email}</span>
        </div>
        {isSelected ? (
          <i className="material-icons icon--small icon--rounded green ba b--green">
            check
          </i>
        ) : (
          <i className="material-icons icon--small icon--rounded ba b--light-grey">
            add
          </i>
        )}
      </a>
    </li>
  )
)

@observer
class AssignResourceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedUsers: []
    }
  }
  componentDidMount() {
    UserStore.loadUsers()
  }
  setSelectedUsers(users = []) {
    this.setState({
      selectedUsers: users
    })
  }
  onSearch = e => {
    UserStore.searchKeyword = e.target.value
  }
  onSelect = id => e => {
    const { selectedUsers } = this.state
    const found = selectedUsers.find(x => x === id)
    if (found) {
      this.setState({ selectedUsers: selectedUsers.filter(x => x !== id) })
    } else {
      selectedUsers.push(id)
      this.setState({ selectedUsers })
    }
  }
  onSave = () => {
    this.props.onSave(this.state.selectedUsers)
  }

  render() {
    const { onClose } = this.props
    const { selectedUsers } = this.state
    const searchResult = UserStore.searchResult
    const showResult = searchResult && searchResult.length
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title="Assign Resources" />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3">
            <input
              autoFocus
              className="w-100 pa2"
              type="search"
              placeholder="Search by name, role, skill..."
              onChange={this.onSearch}
            />
            {!showResult ? (
              <span className="mt2 pv2 red">No Result</span>
            ) : (
              <ul className=" list mt2 ph2 pv1 ba br1 b--light-grey">
                {UserStore.searchResult.map(user => {
                  const isSelected = selectedUsers.includes(user.id)
                  return (
                    <PersonRow
                      key={user.id}
                      id={user.id}
                      onClick={this.onSelect(user.id)}
                      email={user.email}
                      firstName={user.first_name}
                      lastName={user.last_name}
                      photoUrl={user.photo_url}
                      isSelected={isSelected}
                    />
                  )
                })}
              </ul>
            )}
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

export default AssignResourceForm
