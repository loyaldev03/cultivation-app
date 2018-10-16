import React from 'react'
import { render } from 'react-dom'
import Select from 'react-select'
import { TextInput, FieldError, NumericInput } from '../../../utils/FormHelpers'
import reactSelectStyle from './../../../utils/reactSelectStyle'

import LetterAvatar from '../../../utils/LetterAvatar'

import UserRoles from '../stores/UserRoleStore'
import UserStore from '../stores/UserStore'

import updateTasks from '../actions/updateTask'

export default class ResourceForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      batch_id: this.props.batch_id,
      id: props.task.id,
      ...props.task.attributes,
      resource_name: '',
      job_role: '',
      dropdown_roles: UserRoles.slice(),
      dropdown_users: this.toDropdown(UserStore.users),
      users: this.generateUser(props.task.attributes.user_ids)
    }
  }

  componentWillReceiveProps(props) {
    const { task } = this.props
    if (props.task !== task) {
      this.setState({
        batch_id: this.props.batch_id,
        id: props.task.id,
        ...props.task.attributes,
        resource_name: '',
        job_role: '',
        dropdown_roles: UserRoles.slice(),
        dropdown_users: this.toDropdown(UserStore.users),
        users: this.generateUser(props.task.attributes.user_ids)
      })
    }
  }

  generateUser(user_ids) {
    let user_filtered = UserStore.users.filter(user =>
      user_ids.includes(user.id)
    )
    let user_hashes = user_filtered.map(e => {
      let newHash = {}
      newHash['id'] = e.id
      newHash['name'] = e.attributes.full_name
      newHash['role'] = 'Availability Here'
      return newHash
    })
    return user_hashes
  }

  toDropdown(users) {
    let array_users = []
    for (var i = 0; i < users.length; i++) {
      array_users.push({
        value: users[i].id,
        label: users[i].attributes.full_name
      })
    }
    return array_users
  }

  handleChangeSelect = (key, value) => {
    this.setState({ [key]: value })
    if (key === 'job_role') {
      if (value !== null) {
        let existing_user_ids = this.state.users.map(user => user.id)
        let dropdown_users = UserStore.users.filter(
          user =>
            user.attributes.roles.includes(value.value) &&
            !existing_user_ids.includes(user.id)
        )
        dropdown_users = this.toDropdown(dropdown_users)
        this.setState({ dropdown_users: dropdown_users, resource_name: '' })
      }
    }
  }

  handleSubmit = () => {
    if (this.state.job_role === null || this.state.job_role === '') {
      alert('Please choose job role')
      return null
    }
    if (this.state.resource_name === null || this.state.resource_name === '') {
      alert('Please choose resource name')
      return null
    }

    this.setState(
      prevState => ({
        users: [
          ...prevState.users,
          {
            id: this.state.resource_name.value,
            name: this.state.resource_name.label,
            role: 'Availability Here'
          }
        ],
        resource_name: '',
        job_role: ''
      }),
      this.updateResource
    )
  }

  updateResource = () => {
    updateTasks.updateTaskResource(this.state)
  }

  handleDelete = id => {
    if (confirm('Are you sure you want to delete this material? ')) {
      this.setState(
        {
          users: this.state.users.filter(user => user.id !== id)
        },
        this.updateResource
      )
    }
  }

  render() {
    let roles = this.state.dropdown_roles
    let users = this.state.dropdown_users
    let resources = this.state.users
    return (
      <React.Fragment>
        <div className="ba b--light-gray ml4 mr4 mt4">
          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Job Role</label>
              <Select
                name="job_role"
                options={roles}
                classNamePrefix="select"
                fieldname="job_role"
                onChange={e => this.handleChangeSelect('job_role', e)}
                value={this.state.job_role}
              />
            </div>
          </div>
          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Resource Name</label>
              <Select
                name="resource_name"
                options={users}
                classNamePrefix="select"
                fieldname="resource_name"
                onChange={e => this.handleChangeSelect('resource_name', e)}
                value={this.state.resource_name}
              />
            </div>
          </div>
          <div className="pv2 w4">
            <input
              type="submit"
              className="pv2 ph3 ml4 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
              value="Assign"
              onClick={this.handleSubmit}
            />
          </div>
        </div>
        <div className="mt4 mr4 ml4 f6 fw6 db mb1 gray ttc">
          {this.state.users.length !== 0 ? <span>Resource Added</span> : null}
          <table className="w-100">
            <tbody>
              {resources.map((x, index) => (
                <tr key={index} className="pointer bb">
                  <td className="pa2 tc">
                    <LetterAvatar firstName={x.name} size={36} radius={18} />
                  </td>
                  <td className="tl pv2 ph3">{x.name}</td>
                  <td className="tl pv2 ph3">{x.role}</td>
                  <td className="tl pv2 ph3">
                    <i
                      className="material-icons red md-18 pointer dim"
                      onClick={e => this.handleDelete(x.id)}
                    >
                      delete
                    </i>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </React.Fragment>
    )
  }
}
