import React from 'react'
import { observer } from 'mobx-react'
import UserStore from '../stores/NewUserStore'
import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'
import Avatar from '../../../utils/Avatar'

const RoleTag = React.memo(({ id, name, onClick }) => {
  return (
    <a
      href="#0"
      className="link ma1 pa1 f7 bg-blue white br1 dim"
      onClick={onClick}
    >
      {name}
    </a>
  )
})

const CheckIcon = React.memo(({ checked, onClick }) => {
  if (checked) {
    return (
      <i
        className="material-icons pointer icon--small icon--rounded white bg-green ba b--green"
        onClick={onClick}
      >
        check
      </i>
    )
  } else {
    return (
      <i
        className="material-icons pointer icon--small icon--rounded ba b--light-grey"
        onClick={onClick}
      >
        add
      </i>
    )
  }
})

const PersonRow = React.memo(
  ({
    firstName,
    lastName,
    photoUrl,
    email,
    roles,
    onClick,
    onToggleRole,
    isSelected
  }) => (
    <li className="br2 dim--grey">
      <div className="flex grey items-center justify-between f5 pa1" href="#0">
        <div className="flex items-center">
          <Avatar
            firstName={firstName}
            lastName={lastName}
            photoUrl={photoUrl}
            size={30}
          />
          <span className="w4 flex flex-column ph2">
            <span className="f6">
              {firstName} {lastName}
            </span>
            <span className="f7 fw4 pv1 w2 tc">{email}</span>
          </span>
          {roles &&
            roles.map(role => {
              if (role.id) {
                return (
                  <RoleTag
                    key={role.id}
                    id={role.id}
                    name={role.name}
                    onClick={() => onToggleRole(role.id, role.name)}
                  />
                )
              }
              return null
            })}
        </div>
        <CheckIcon onClick={onClick} checked={isSelected} />
      </div>
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
    if (!UserStore.isDataLoaded) {
      UserStore.loadUsers()
    }
  }
  setSelectedUsers(users = []) {
    this.setState({
      selectedUsers: users
    })
  }
  onToggleRole = (roleId, roleName) => {
    UserStore.toggleRoleFilter(roleId, roleName)
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
  onSave = async () => {
    await this.props.onSave(this.state.selectedUsers)
  }

  render() {
    const { onClose } = this.props
    const { selectedUsers } = this.state
    const searchResult = UserStore.searchResult
    const filterRoles = UserStore.filterRoles
    const showResult = searchResult && searchResult.length
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title="Assign Resources" />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3">
            <input
              className="w-100 pa2"
              type="search"
              placeholder="Search by name, role, skill..."
              onChange={this.onSearch}
            />
            <div className="pt1">
              {filterRoles &&
                filterRoles.map(role => {
                  return (
                    <span
                      key={role.id}
                      onClick={() => this.onToggleRole(role.id, role.name)}
                      className="dib pointer bg-blue f7 white pa1 mr1 br1"
                    >
                      {role.name}
                    </span>
                  )
                })}
            </div>
            {!showResult ? (
              <span className="mt2 pv2 red">No Result</span>
            ) : (
              <ul className="pa2 list mt2 ba br2 b--light-grey">
                {UserStore.searchResult.map(user => {
                  const isSelected = selectedUsers.includes(user.id)
                  return (
                    <PersonRow
                      key={user.id}
                      id={user.id}
                      onToggleRole={this.onToggleRole}
                      onClick={this.onSelect(user.id)}
                      email={user.email}
                      firstName={user.first_name}
                      lastName={user.last_name}
                      roles={user.roles}
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
