import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'

class UserDetailsEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.user) {
      this.state = {
        firstName: props.user.first_name || '',
        lastName: props.user.last_name || '',
        email: props.user.email || '',
        title: props.user.title || ''
      }
    } else {
      this.state = {
        firstName: '',
        lastName: '',
        email: '',
        title: ''
      }
    }
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onSelectChange = (field, option) => {
    if (option) {
      this.setState({ [field]: option.value })
    } else {
      this.setState({ [field]: '' })
    }
  }

  render() {
    const { onClose, facilitiesOptions, rolesOptions } = this.props
    const { firstName, lastName, email, title, facilities, roles } = this.state

    return (
      <div className="h-100 flex flex-column">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">User Details</h5>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <div className="ph4 mt3">
          <label className="f6 fw6 db mb0 dark-gray ttc">Basic Info</label>
        </div>
        <div className="ph4 mt3">
          <div className="w-50 fl pr3">
            <label className="f6 fw6 db mb1 gray ttc">First Name</label>
            <input
              className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
              onChange={this.onChangeInput('firstName')}
              value={firstName}
            />
          </div>
          <div className="w-50 fr pl3">
            <label className="f6 fw6 db mb1 gray ttc">Last Name</label>
            <input
              className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
              onChange={this.onChangeInput('lastName')}
              value={lastName}
            />
          </div>
        </div>

        <div className="ph4 mt3">
          <div className="w-50 fl pr3">
            <label className="f6 fw6 db mb1 gray ttc">Email</label>
            <input
              className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
              onChange={this.onChangeInput('email')}
              value={email}
            />
          </div>
          <div className="w-50 fr pl3">
            <label className="f6 fw6 db mb1 gray ttc">Title</label>
            <input
              className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
              onChange={this.onChangeInput('title')}
              value={title}
            />
          </div>
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mv2">
          <label className="f6 fw6 db mb0 dark-gray ttc">Access Control</label>
        </div>
        <div className="ph4 mt2">
          <label className="f6 fw6 db mb1 gray ttc">Facilities</label>
          <Select
            options={facilitiesOptions}
            isMulti={true}
            isClearable={true}
            onChange={opt => this.onSelectChange('facilities', opt)}
            className="mt1 w-100 f6"
          />
        </div>

        <div className="ph4 mt3">
          <label className="f6 fw6 db mb1 gray ttc">Roles</label>
          <Select
            options={rolesOptions}
            isMulti={true}
            isClearable={true}
            onChange={opt => this.onSelectChange('roles', opt)}
            className="mt1 w-100 f6"
          />
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mv2">
          <label className="f6 fw6 db mb0 dark-gray ttc">Account Status</label>
        </div>
      </div>
    )
  }
}

export default UserDetailsEditor
