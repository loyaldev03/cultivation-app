import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import UserStore from '../stores/NewUserStore'
import { SlidePanelHeader, SlidePanelFooter } from '../../../utils'
import Avatar from '../../../utils/Avatar'

const RoleTag = React.memo(({ name, onClick }) => {
  return (
    <a
      href="#0"
      className="link mr1 f7 fw6 bg-light-blue dark-blue pa--tag ttu br2"
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
      UserStore.loadUsers(this.props.facilityId)
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
    let { selectedUsers } = this.state
    const { selectMode } = this.props
    const found = selectedUsers.find(x => x === id)
    if (found) {
      this.setState(
        { selectedUsers: selectedUsers.filter(x => x !== id) },
        () => {
          this.onToggleEmbed()
        }
      )
    } else {
      if (selectMode === 'multiple') {
        selectedUsers.push(id)
      } else {
        selectedUsers = [id]
      }

      this.setState({ selectedUsers }, () => {
        this.onToggleEmbed()
      })
    }
  }
  onSave = async () => {
    await this.props.onSave(this.state.selectedUsers)
  }

  onToggleEmbed = () => {
    //if embedded form true, pass changes everytime selected
    if (this.props.embeddedForm) {
      this.onChangeEmbed()
    }
  }

  onChangeEmbed = async () => {
    await this.props.onChangeEmbed(this.state.selectedUsers)
  }

  render() {
    const { onClose } = this.props
    const { selectedUsers } = this.state
    const searchResult = UserStore.searchResult
    const filterRoles = UserStore.filterRoles
    const showResult = searchResult && searchResult.length
    return (
      <div className="flex flex-column h-100">
        {!this.props.embeddedForm ? (
          <SlidePanelHeader onClose={onClose} title={this.props.title} />
        ) : null}
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
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
                    <RoleTag
                      key={role.id}
                      name={role.name}
                      onClick={() => this.onToggleRole(role.id, role.name)}
                    />
                  )
                })}
            </div>
            {!showResult ? (
              <span className="mt2 pv2 red">No Result</span>
            ) : (
              <ul className="pa2 list mt2 flex-auto ba br2 b--light-grey overflow-auto">
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
          {!this.props.embeddedForm ? (
            <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
          ) : null}
        </div>
      </div>
    )
  }
}

AssignResourceForm.propTypes = {
  selectMode: PropTypes.string,
  facilityId: PropTypes.string.isRequired,
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  embeddedForm: PropTypes.bool,
  onChangeEmbed: PropTypes.func,
  title: PropTypes.string
}

AssignResourceForm.defaultProps = {
  selectMode: 'multiple', // or 'single'
  title: 'Assign Resources',
  embeddedForm: false
}

export default AssignResourceForm
