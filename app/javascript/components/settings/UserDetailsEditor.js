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
      let reporting_manager = {}
      let user_mode = {}
      let working_hours = []
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

      if (props.user.reporting_manager_id) {
        reporting_manager = props.userManagerOptions.find(
          y => y.value === props.user.reporting_manager_id
        )
      }

      if (props.user.user_mode) {
        user_mode = user_modes.find(y => y.value === props.user.user_mode)
      }

      if (props.user.work_schedules) {
        working_hours = props.user.work_schedules
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
        reporting_manager: reporting_manager,
        facilities,
        roles,
        default_facility,
        working_hours: working_hours
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

  onChangeWorkingHourInput = (day, time, e) => {
    let temp_working_hours = this.state.working_hours
    let temp_day = temp_working_hours.find(e => e.day === day)
    if (temp_day) {
      temp_day[time] = e.target.value
    }
    temp_working_hours.map(e => e.day === day)
    temp_working_hours = temp_working_hours.map(s => {
      if (s.day === day) {
        s = temp_day
      }
      return s
    })
    this.setState({ working_hours: temp_working_hours })
  }

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
      reporting_manager,
      working_hours,
      isActive
    } = this.state
    const newRoles = roles ? roles.map(x => x.value) : []
    const newFacilities = facilities ? facilities.map(x => x.value) : []
    const defaultFacilityId = default_facility ? default_facility.value : null
    const photo_data = photoData ? JSON.stringify(photoData) : null
    const newUserMode = user_mode ? user_mode.value : null
    const reporting_manager_id = reporting_manager
      ? reporting_manager.value
      : null

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
        reporting_manager_id: reporting_manager_id,
        default_facility_id: defaultFacilityId,
        work_schedules: working_hours
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
      userManagerOptions,
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
      reporting_manager,
      overtime_hourly_rate
    } = this.state

    const sunday = this.state.working_hours.find(e => e.day === 'sunday') || {}
    const monday = this.state.working_hours.find(e => e.day === 'monday') || {}
    const tuesday =
      this.state.working_hours.find(e => e.day === 'tuesday') || {}
    const wednesday =
      this.state.working_hours.find(e => e.day === 'wednesday') || {}
    const thursday =
      this.state.working_hours.find(e => e.day === 'thursday') || {}
    const friday = this.state.working_hours.find(e => e.day === 'friday') || {}
    const saturday =
      this.state.working_hours.find(e => e.day === 'saturday') || {}

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
                    <img src={photoUrl} className="fl h4 w4"  />
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
              <div className="mt2 fl w-100 mb2">
                <label className="f6 fw6 db mb1 gray ttc">
                  Reporting Manager
                </label>
                <Select
                  options={userManagerOptions}
                  isClearable={true}
                  onChange={opt =>
                    this.onSelectChange('reporting_manager', opt)
                  }
                  value={reporting_manager}
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
                  Working Hours
                </label>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Sunday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('sunday', 'start_time', e)
                    }
                    value={sunday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('sunday', 'end_time', e)
                    }
                    value={sunday.end_time}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Monday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('monday', 'start_time', e)
                    }
                    value={monday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('monday', 'end_time', e)
                    }
                    value={monday.end_time}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Tuesday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('tuesday', 'start_time', e)
                    }
                    value={tuesday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('tuesday', 'end_time', e)
                    }
                    value={tuesday.end_time}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Wednesday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput(
                        'wednesday',
                        'start_time',
                        e
                      )
                    }
                    value={wednesday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('wednesday', 'end_time', e)
                    }
                    value={wednesday.end_time}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Thursday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('thursday', 'start_time', e)
                    }
                    value={thursday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('thursday', 'end_time', e)
                    }
                    value={thursday.end_time}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Friday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('friday', 'start_time', e)
                    }
                    value={friday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('friday', 'end_time', e)
                    }
                    value={friday.end_time}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100 flex justify-between">
                <label className="f6 fw6 db mb1 gray ttc">Saturday</label>
                <div class="flex w-60 justify-between">
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('saturday', 'start_time', e)
                    }
                    value={saturday.start_time}
                  />
                  <div class="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <input
                    className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                    type="time"
                    onChange={e =>
                      this.onChangeWorkingHourInput('saturday', 'end_time', e)
                    }
                    value={saturday.end_time}
                  />
                </div>
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
