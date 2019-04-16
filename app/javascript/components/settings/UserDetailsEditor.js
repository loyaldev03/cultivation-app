import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import AvatarPicker from '../utils/AvatarPicker'
import { ReactComponent as BlankAvatar } from '../utils/BlankAvatar.svg'

const styles = `

.active{
    display: inline-block;
    position: relative;
    border-bottom: 3px solid var(--orange);
    padding-bottom: 16px;
}

.active:after {
  position: absolute;
  content: '';
  width: 70%;
  transform: translateX(-50%);
  bottom: -15px;
  left: 50%;
}

`

const user_modes = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Worker', value: 'worker' }
]

class UserDetailsEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.user) {
      let facilities = []
      let roles = []
      let default_facility = {}
      if (props.user.facilities && props.facilitiesOptions) {
        facilities = props.user.facilities.map(id =>
          props.facilitiesOptions.find(y => y.value === id)
        )
      }
      if (props.user.roles && props.rolesOptions) {
        roles = props.user.roles.map(id =>
          props.rolesOptions.find(y => y.value === id)
        )
      }
      if (props.user.default_facility_id) {
        default_facility = props.facilitiesOptions.find(
          y => y.value === props.user.default_facility_id
        )
      }
      let user_mode
      props.user.user_mode = props.user.user_mode
        ? props.user.user_mode
        : 'worker'

      if (props.user.user_mode) {
        user_mode = {
          label:
            props.user.user_mode.substr(0, 1).toUpperCase() +
            props.user.user_mode.substr(1).toLowerCase(), // Upcase first letter
          value: props.user.user_mode
        }
      }
      this.state = {
        tabs: 'General',
        userId: props.user.id,
        firstName: props.user.first_name || '',
        lastName: props.user.last_name || '',
        email: props.user.email || '',
        title: props.user.title || '',
        photoData: props.user.photo_data,
        photoUrl: props.user.photo_url,
        isActive: props.user.is_active || false,
        hourly_rate: props.user.hourly_rate,
        overtime_hourly_rate: props.user.overtime_hourly_rate,
        user_mode: user_mode,
        facilities,
        roles,
        default_facility
      }
    } else {
      this.state = {
        tabs: 'General',
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        photoData: '',
        photoUrl: '',
        isActive: false,
        hourly_rate: '',
        overtime_hourly_rate: '',
        facilities: [],
        roles: [],
        default_facility: {}
      }
    }
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onChangeToggle = field => e => this.setState({ [field]: e.target.checked })

  onSelectChange = (field, options) => {
    if (options && (options.value || options.length)) {
      this.setState({ [field]: options })
    } else {
      this.setState({ [field]: '' })
    }
  }

  onUploadAvatarSuccess = photoData => {
    const photoUrl = `/uploads/${photoData.storage}/${photoData.id}`
    this.setState({ photoUrl, photoData })
  }

  onSubmit = e => {
    e.preventDefault()
    const {
      userId,
      firstName,
      lastName,
      email,
      password,
      title,
      facilities,
      default_facility,
      roles,
      photoData,
      hourly_rate,
      overtime_hourly_rate,
      user_mode,
      isActive
    } = this.state
    const newRoles = roles ? roles.map(x => x.value) : []
    const newFacilities = facilities ? facilities.map(x => x.value) : []
    const defaultFacilityId = default_facility ? default_facility.value : null
    const photo_data = photoData ? JSON.stringify(photoData) : null
    const newUserMode = user_mode ? user_mode.value : null
    const userDetails = {
      user: {
        id: userId,
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        title: title,
        photo_data: photo_data,
        hourly_rate: hourly_rate,
        overtime_hourly_rate: overtime_hourly_rate,
        user_mode: newUserMode,
        is_active: isActive || false,
        facilities: newFacilities,
        roles: newRoles,
        default_facility_id: defaultFacilityId
      }
    }
    this.props.onSave(userDetails)
  }

  changeTabs = value => {
    this.setState({ tabs: value })
  }

  render() {
    const {
      onClose,
      facilitiesOptions,
      rolesOptions,
      isSaving,
      user
    } = this.props
    const {
      firstName,
      lastName,
      email,
      title,
      photoUrl,
      isActive,
      facilities,
      roles,
      default_facility,
      hourly_rate,
      user_mode,
      overtime_hourly_rate
    } = this.state

    const saveButtonText = isSaving ? 'Saving...' : 'Save'

    return (
      <div className="h-100 flex flex-auto flex-column">
        <style> {styles} </style>
        <div className="ph4 bb b--light-grey">
          <div className="mt3 flex content-stretch">
            <div
              className={`ph4 pointer dim ${
                this.state.tabs === 'General' ? 'active' : ''
              }`}
              onClick={() => this.changeTabs('General')}
            >
              General
            </div>
            <div
              className={`pl3 ph4 pointer dim ${
                this.state.tabs === 'Costing' ? 'active' : ''
              }`}
              onClick={() => this.changeTabs('Costing')}
            >
              Costing
            </div>
          </div>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <form
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          {this.state.tabs === 'General' && (
            <div className="ph4">
              <div className="mt1">
                <label className="f6 fw6 db mb0 dark-gray ttc">
                  Basic Info
                </label>
              </div>
              <div className="mt2 fl w-100">
                <div className="w-100 fl pr3">
                  <label className="f6 fw6 db mb1 gray ttc">Photo</label>
                  <div
                    className={classNames('hide-child relative tc fl mb2', {
                      'w4 h4 bg-black-10': !photoUrl
                    })}
                  >
                    <img src={photoUrl} className="fl" />
                    <AvatarPicker
                      key={photoUrl}
                      onUploadSuccess={this.onUploadAvatarSuccess}
                    />
                  </div>
                </div>
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
              <div className="mt2 fl w-100">
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
              <div className="mt2 fl w-100 mb2">
                <div className="w-100 fl pr3">
                  <label className="f6 fw6 dib mb1 gray ttc">Password</label>
                  <span className="f6 gray ml2">
                    (This would change the user's password)
                  </span>
                  <input
                    className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('password')}
                    type="password"
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 mb2">
                <label className="f6 fw6 db mb1 gray ttc">User mode</label>
                <Select
                  options={user_modes}
                  isClearable={true}
                  onChange={opt => this.onSelectChange('user_mode', opt)}
                  value={user_mode}
                  className="mt1 w-100 f6"
                />
              </div>
              <div className="mt3 fl w-100 pt3 bt b--light-gray">
                <label className="f6 fw6 db mb0 dark-gray ttc">
                  Access Control
                </label>
              </div>
              <div className="mt2 fl w-100">
                <label className="f6 fw6 db mb1 gray ttc">Facilities</label>
                <Select
                  options={facilitiesOptions}
                  isMulti={true}
                  isClearable={true}
                  onChange={opt => this.onSelectChange('facilities', opt)}
                  value={facilities}
                  className="mt1 w-100 f6"
                />
              </div>
              <div className="mt2 fl w-100">
                <label className="f6 fw6 db mb1 gray ttc">
                  Default Facility
                </label>
                <Select
                  options={facilitiesOptions}
                  isClearable={true}
                  onChange={opt => this.onSelectChange('default_facility', opt)}
                  value={default_facility}
                  className="mt1 w-100 f6"
                />
              </div>
              <div className="mt2 fl w-100 mb2">
                <label className="f6 fw6 db mb1 gray ttc">Roles</label>
                <Select
                  options={rolesOptions}
                  isMulti={true}
                  isClearable={true}
                  onChange={opt => this.onSelectChange('roles', opt)}
                  value={roles}
                  className="mt1 w-100 f6"
                />
              </div>
              <div className="mt3 fl w-100 pt3 bt b--light-gray">
                <label className="f6 fw6 db mb0 dark-gray ttc">
                  Account Status
                </label>
              </div>
              <div className="mt2 fl w-100">
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
                  checked={isActive}
                />
                <label className="toggle-button mt1 fr" htmlFor="is_active" />
                <p className="gray f6 db mv1">
                  Only active user are allowed to access the system.
                </p>
              </div>
            </div>
          )}

          {this.state.tabs === 'Costing' && (
            <div className="ph4">
              <div className="mt2 fl w-100">
                <div className="w-50 fl pr3">
                  <label className="f6 fw6 db mb1 gray ttc">Hourly Rate</label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('hourly_rate')}
                    value={hourly_rate}
                    required={true}
                  />
                </div>
                <div className="w-50 fl pl3">
                  <label className="f6 fw6 db mb1 gray ttc">
                    Overtime Hourly Rate
                  </label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('overtime_hourly_rate')}
                    value={overtime_hourly_rate}
                    required={true}
                  />
                </div>
              </div>
            </div>
          )}
          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
            <input
              type="submit"
              value={saveButtonText}
              className="fr btn btn--primary"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default UserDetailsEditor
