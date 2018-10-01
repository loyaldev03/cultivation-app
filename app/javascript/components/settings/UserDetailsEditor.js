import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'

class UserDetailsEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.user) {
      this.state = {
        userId: props.user.id,
        firstName: props.user.first_name || '',
        lastName: props.user.last_name || '',
        email: props.user.email || '',
        title: props.user.title || '',
        isActive: props.user.is_active || false
      }
    } else {
      this.state = {
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        isActive: false
      }
    }
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onChangeToggle = field => e => this.setState({ [field]: e.target.checked })

  onSelectChange = (field, option) => {
    if (option) {
      this.setState({ [field]: option.value })
    } else {
      this.setState({ [field]: '' })
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const userDetails = {
      user_update: {
        user_id: this.state.userId,
        first_name: this.state.firstName,
        last_name: this.state.lastName
      }
    }
    this.props.onSave(userDetails)
  }

  render() {
    const { onClose, facilitiesOptions, rolesOptions, isSaving } = this.props
    const {
      firstName,
      lastName,
      email,
      title,
      isActive,
      facilities,
      roles
    } = this.state

    const saveButtonText = isSaving ? 'Saving...' : 'Save'

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
        <form
          className="pv3 h-100 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4 flex-auto flex flex-column">
            <div className="mt2">
              <label className="f6 fw6 db mb0 dark-gray ttc">Basic Info</label>
            </div>
            <div className="mt3">
              <div className="w-50 fl pr3">
                <label className="f6 fw6 db mb1 gray ttc">First Name</label>
                <input
                  className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('firstName')}
                  value={firstName}
                  required={true}
                />
              </div>
              <div className="w-50 fr pl3">
                <label className="f6 fw6 db mb1 gray ttc">Last Name</label>
                <input
                  className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('lastName')}
                  value={lastName}
                  required={true}
                />
              </div>
            </div>
            <div className="mt3 mb2">
              <div className="w-50 fl pr3">
                <label className="f6 fw6 db mb1 gray ttc">Email</label>
                <input
                  className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('email')}
                  value={email}
                  required={true}
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
            <div className="mv2">
              <label className="f6 fw6 db mb0 dark-gray ttc">
                Access Control
              </label>
            </div>
            <div className="mt2">
              <label className="f6 fw6 db mb1 gray ttc">Facilities</label>
              <Select
                options={facilitiesOptions}
                isMulti={true}
                isClearable={true}
                onChange={opt => this.onSelectChange('facilities', opt)}
                className="mt1 w-100 f6"
              />
            </div>
            <div className="mt3 mb2">
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
            <div className="mv2">
              <label className="f6 fw6 db mb0 dark-gray ttc">
                Account Status
              </label>
            </div>
            <div className="mt2">
              <label
                className={classNames('f6 fw6 mb1 ttu', {
                  green: isActive,
                  gray: !isActive
                })}
              >
                {isActive ? 'Active' : 'Deactivated'}
              </label>
              <input
                id="is_active"
                type="checkbox"
                className="toggle toggle-default"
                onChange={this.onChangeToggle('isActive')}
                checked={this.isActive}
              />
              <label className="toggle-button mt1 fr" htmlFor="is_active" />
              <p className="gray f6 db mv1">
                Only active user are allowed to access the system.
              </p>
            </div>
          </div>

          <div className="bt b--light-grey pt3 ph4">
            <input
              type="submit"
              value={saveButtonText}
              className="fr ph3 pv2 bg-orange button--font white bn box--br3 ttu link dim pointer"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default UserDetailsEditor
