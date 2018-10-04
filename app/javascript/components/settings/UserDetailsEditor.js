import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import AvatarPicker from '../utils/AvatarPicker'
import { ReactComponent as BlankAvatar } from '../utils/BlankAvatar.svg'

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
      this.state = {
        userId: props.user.id,
        firstName: props.user.first_name || '',
        lastName: props.user.last_name || '',
        email: props.user.email || '',
        title: props.user.title || '',
        photoData: props.user.photo_data,
        photoUrl: props.user.photo_url,
        isActive: props.user.is_active || false,
        facilities,
        roles,
        default_facility
      }
    } else {
      this.state = {
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        photoData: '',
        photoUrl: '',
        isActive: false,
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
    console.log({ photoUrl })
    this.setState({ photoUrl, photoData })
  }

  onSubmit = e => {
    e.preventDefault()
    const roles = this.state.roles ? this.state.roles.map(x => x.value) : []
    const facilities = this.state.facilities
      ? this.state.facilities.map(x => x.value)
      : []
    const default_facility_id = this.state.default_facility
      ? this.state.default_facility.value
      : null
    const userDetails = {
      user: {
        id: this.state.userId,
        email: this.state.email,
        password: this.state.password,
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        title: this.state.title,
        photo_data: JSON.stringify(this.state.photoData),
        is_active: this.state.isActive || false,
        facilities,
        roles,
        default_facility_id
      }
    }
    this.props.onSave(userDetails)
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
      default_facility
    } = this.state

    const saveButtonText = isSaving ? 'Saving...' : 'Save'

    return (
      <div className="h-100 flex flex-auto flex-column">
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
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4">
            <div className="mt1">
              <label className="f6 fw6 db mb0 dark-gray ttc">Basic Info</label>
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
              <label className="f6 fw6 db mb1 gray ttc">Default Facility</label>
              <Select
                options={facilities || []}
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

          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
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
