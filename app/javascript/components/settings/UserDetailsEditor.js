import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import AvatarPicker from '../utils/AvatarPicker'
import { addDays, format, subDays } from 'date-fns'
import UserRoleStore from './UserRoleStore'
import { toJS } from 'mobx'
import Tippy from '@tippy.js/react'
import { ReactComponent as BlankAvatar } from '../utils/BlankAvatar.svg'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { DefaultAvatar } from '../utils'
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

.sunday-work:after {
    background-color: #F66830;
    border-radius: 10px;
    content: " ";
    display: block;
    margin-left: 10px;
    margin-top: 3px;
    height: 10px;
    width: 10px;
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
      let work_schedules = []
      let non_exempt_schedules = []
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
        work_schedules = props.user.work_schedules
      } else {
        work_schedules = props.companyWorkSchedules
      }

      if (props.user.id) {
        UserRoleStore.getWeekWorkSchedule(props.user.id)
      }

      let sundaySelected = { label: '', value: '' }
      let copySundaySelected = { label: '', value: '' }
      non_exempt_schedules = [
        {
          day_id: 0,
          day: 'sunday',
          date: '',
          start_time: '',
          end_time: ''
        },
        {
          day_id: 1,
          day: 'monday',
          date: '',
          start_time: '',
          end_time: ''
        },
        {
          day_id: 2,
          day: 'tuesday',
          date: '',
          start_time: '',
          end_time: ''
        },
        {
          day_id: 3,
          day: 'wednesday',
          date: '',
          start_time: '',
          end_time: ''
        },
        {
          day_id: 4,
          day: 'thursday',
          date: '',
          start_time: '',
          end_time: ''
        },
        {
          day_id: 5,
          day: 'friday',
          date: '',
          start_time: '',
          end_time: ''
        },
        {
          day_id: 6,
          day: 'saturday',
          date: '',
          start_time: '',
          end_time: ''
        }
      ]

      let array_of_sundays = []

      let curr_date = new Date()
      let temp_date = addDays(curr_date, (0 + 7 - curr_date.getDay()) % 7)
      for (let i = 0; i < 50; i++) {
        let next_seven_days = addDays(temp_date, 6)
        let args = {
          label: `${format(temp_date, 'MM/DD/YYYY')} - ${format(
            next_seven_days,
            'MM/DD/YYYY'
          )}`,
          value: temp_date
        }
        array_of_sundays.push(args)
        temp_date = addDays(temp_date, 7)
      }
      this.state = {
        tabs: 'General',
        userId: props.user.id,
        firstName: props.user.first_name || '',
        lastName: props.user.last_name || '',
        email: props.user.email || '',
        title: props.user.title || '',
        photoData: props.user.photo_data,
        phone_number: props.user.phone_number,
        photoUrl: props.user.photo_url,
        isActive: props.user.is_active || false,
        isExempt: props.user.exempt || false,
        hourly_rate: props.user.hourly_rate,
        overtime_hourly_rate: props.user.overtime_hourly_rate,
        user_mode: user_mode,
        reporting_manager: reporting_manager,
        facilities,
        roles,
        default_facility,
        work_schedules: work_schedules,
        non_exempt_schedules: non_exempt_schedules || [],
        array_of_sundays: array_of_sundays
        // sundaySelected: sundaySelected,
        // copySundaySelected: copySundaySelected
      }
    } else {
      this.state = {
        tabs: 'General',
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        phone_number: '',
        photoData: '',
        photoUrl: '',
        isActive: false,
        isExempt: false,
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

  onChangeExempt = value => {
    this.setState({ isExempt: value })
  }

  onChangeWorkingHourInput = (day, time, e) => {
    let temp_work_schedules = this.state.work_schedules
    let temp_day = temp_work_schedules.find(e => e.day === day)
    if (temp_day) {
      temp_day[time] = e.target.value
    }
    temp_work_schedules.map(e => e.day === day)
    temp_work_schedules = temp_work_schedules.map(s => {
      if (s.day === day) {
        s = temp_day
      }
      return s
    })
    this.setState({ work_schedules: temp_work_schedules })
  }

  onSelectChange = (field, options) => {
    if (options && (options.value || options.length)) {
      if (field === 'sundaySelected') {
        this.calculateRangeDate(options.value)
      } else {
        this.setState({ [field]: options })
      }
    } else {
      this.setState({ [field]: '' })
    }
  }

  calculateRangeDate = async date => {
    await UserRoleStore.getSchedulesByDate(this.state.userId, date)
    const schedules = toJS(UserRoleStore.nonExemptSchedules)

    const updated_schedules = this.state.non_exempt_schedules

    for (let i = 0; i < schedules.length; i++) {
      updated_schedules.map(t => {
        let updated = updated_schedules.find(e => e.day_id === i)
        updated.date = schedules[i].date
        updated.start_time = schedules[i].start_time
        updated.end_time = schedules[i].end_time
        return t.day_id === i ? updated : t
      })
    }
    let sundaySelected = {
      value: date,
      label: `${updated_schedules[0].date} - ${updated_schedules[6].date}`
    }
    this.setState({
      sundaySelected: sundaySelected,
      non_exempt_schedules: updated_schedules
    })
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
      phone_number,
      facilities,
      default_facility,
      roles,
      photoData,
      hourly_rate,
      overtime_hourly_rate,
      user_mode,
      reporting_manager,
      work_schedules,
      non_exempt_schedules,
      isActive,
      isExempt
    } = this.state
    const newRoles = roles ? roles.map(x => x.value) : []
    const newFacilities = facilities ? facilities.map(x => x.value) : []
    const defaultFacilityId = default_facility ? default_facility.value : null
    const photo_data = photoData ? JSON.stringify(photoData) : null
    const newUserMode = user_mode ? user_mode.value : null
    const reporting_manager_id = reporting_manager
      ? reporting_manager.value
      : null
    const updated_non_exempt_schedules = non_exempt_schedules.map(t => {
      t.date = format(t.date, 'DD/MM/YYYY')
      return t
    })

    const userDetails = {
      user: {
        id: userId,
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
        phone_number: phone_number,
        title: title,
        photo_data: photo_data,
        hourly_rate: hourly_rate,
        overtime_hourly_rate: overtime_hourly_rate,
        user_mode: newUserMode,
        is_active: isActive || false,
        exempt: isExempt || false,
        facilities: newFacilities,
        roles: newRoles,
        reporting_manager_id: reporting_manager_id,
        default_facility_id: defaultFacilityId,
        work_schedules: work_schedules,
        non_exempt_schedules: updated_non_exempt_schedules
      }
    }
    this.props.onSave(userDetails)
  }

  changeTabs = value => {
    this.setState({ tabs: value })
  }

  // onAddNonExemptSchedule = event => {
  //   const newSchedule = {
  //     start_date: '',
  //     end_date: '',
  //     start_time: '',
  //     end_time: ''
  //   }
  //   const newNonExemptSchedules = [
  //     ...this.state.non_exempt_schedules,
  //     newSchedule
  //   ]
  //   this.setState({
  //     non_exempt_schedules: newNonExemptSchedules
  //   })

  //   event.preventDefault()
  // }

  // onRemoveNonExemptSchedule = e => {
  //   if (confirm('Are you sure?')) {
  //     this.setState({
  //       non_exempt_schedules: this.state.non_exempt_schedules.filter(
  //         a => a !== e
  //       )
  //     })
  //   }
  // }

  onChangeNonExemptAttr = (record, key, value) => {
    let updated_schedule = this.state.non_exempt_schedules.find(
      e => e === record
    )
    updated_schedule[key] = value

    const updated_schedules = this.state.non_exempt_schedules.map(t => {
      return t === record ? updated_schedule : t
    })

    this.setState({
      non_exempt_schedules: updated_schedules
    })
  }

  onNextWeek = () => {
    if (this.state.sundaySelected.value) {
      let nextWeekDate = addDays(this.state.sundaySelected.value, 7)
      this.calculateRangeDate(nextWeekDate)
    } else {
      alert('Please select current week first')
    }
  }

  onPreviousWeek = () => {
    if (this.state.sundaySelected.value) {
      let previousWeekDate = subDays(this.state.sundaySelected.value, 7)
      this.calculateRangeDate(previousWeekDate)
    } else {
      alert('Please select current week first')
    }
  }

  onCreate = tippy => {
    this.tippy = tippy
  }

  copyWeekScedule = async () => {
    if (
      this.state.sundaySelected.value &&
      this.state.copySundaySelected.value
    ) {
      this.tippy.hide()
      await UserRoleStore.copyScheduleWeek(
        this.state.userId,
        this.state.sundaySelected.value,
        this.state.copySundaySelected.value
      )
    } else {
      alert('Please select week to copy from')
    }
  }

  formatOptionLabel = ({ value, label, customAbbreviation }) => (
    <div
      className={classNames('', {
        'sunday-work': UserRoleStore.getWeekWithWorkSchedule().includes(label)
      })}
      style={{ display: 'flex' }}
    >
      <div>{label}</div>
    </div>
  )

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
      isExempt,
      facilities,
      phone_number,
      roles,
      default_facility,
      hourly_rate,
      user_mode,
      reporting_manager,
      overtime_hourly_rate,
      array_of_sundays,
      sundaySelected, //used for date selection in non exempt schedule
      copySundaySelected // used for date selection in copy section
    } = this.state

    const sunday = this.state.work_schedules.find(e => e.day === 'sunday') || {}
    const monday = this.state.work_schedules.find(e => e.day === 'monday') || {}
    const tuesday =
      this.state.work_schedules.find(e => e.day === 'tuesday') || {}
    const wednesday =
      this.state.work_schedules.find(e => e.day === 'wednesday') || {}
    const thursday =
      this.state.work_schedules.find(e => e.day === 'thursday') || {}
    const friday = this.state.work_schedules.find(e => e.day === 'friday') || {}
    const saturday =
      this.state.work_schedules.find(e => e.day === 'saturday') || {}

    const nonExemptSunday =
      this.state.non_exempt_schedules.find(e => e.day === 'sunday') || {}
    const nonExemptMonday =
      this.state.non_exempt_schedules.find(e => e.day === 'monday') || {}
    const nonExemptTuesday =
      this.state.non_exempt_schedules.find(e => e.day === 'tuesday') || {}
    const nonExemptWednesday =
      this.state.non_exempt_schedules.find(e => e.day === 'wednesday') || {}
    const nonExemptThursday =
      this.state.non_exempt_schedules.find(e => e.day === 'thursday') || {}
    const nonExemptFriday =
      this.state.non_exempt_schedules.find(e => e.day === 'friday') || {}
    const nonExemptSaturday =
      this.state.non_exempt_schedules.find(e => e.day === 'saturday') || {}

    const saveButtonText = isSaving ? 'Saving...' : 'Save'

    const isSameUser = this.props.currentId === this.props.user.id
    return (
      <div className="h-100 flex flex-auto flex-column">
        <style> {styles} </style>
        <div className="ph4 bb b--light-grey">
          <div className="mt3 flex content-stretch">
            <div
              className={`ph4 pointer dim grey ${
                this.state.tabs === 'General' ? 'active' : ''
              }`}
              onClick={() => this.changeTabs('General')}
            >
              General
            </div>
            <div
              className={`pl3 ph4 pointer dim grey ${
                this.state.tabs === 'Wages' ? 'active' : ''
              }`}
              onClick={() => this.changeTabs('Wages')}
            >
              Wages
            </div>
            <div
              className={`pl3 ph4 pointer dim grey ${
                this.state.tabs === 'Work Schedules' ? 'active' : ''
              }`}
              onClick={() => this.changeTabs('Work Schedules')}
            >
              Work Schedules
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
                    <img
                      src={photoUrl}
                      className="fl h4 w4"
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = DefaultAvatar
                      }}
                    />
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
                    disabled={isSameUser}
                  />
                </div>
                <div className="w-50 fr pl3">
                  <label className="f6 fw6 db mb1 gray ttc">Last Name</label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('lastName')}
                    value={lastName}
                    required={true}
                    disabled={isSameUser}
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
              <div className="mt2 fl w-100">
                <div className="w-50 fl pr3">
                  <label className="f6 fw6 db mb1 gray ttc">Phone</label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('phone_number')}
                    value={phone_number}
                  />
                </div>
                <div className="w-50 fr pl3" />
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
                <label className="f6 fw6 db mb1 gray ttc">Landing Page</label>
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

          {this.state.tabs === 'Wages' && (
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

          {this.state.tabs === 'Work Schedules' && (
            <div className="ph4">
              <div className="mt2 fl w-100" />
              <div className="mt2 fl w-100">
                <label className="f6 fw6 mb1 grey mr3">Employee Type</label>
                <br />
                <div className="flex mt2">
                  <div>
                    <label className="f6 grey mr2 mt2 pointer">
                      Exempt
                      <input
                        value="exempt"
                        type="radio"
                        checked={isExempt}
                        onChange={e => this.onChangeExempt(true)}
                        className="ml2"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="f6 grey mr2 ml2 pointer">
                      Non-exempt
                      <input
                        value="non-exempt"
                        type="radio"
                        checked={!isExempt}
                        onChange={e => this.onChangeExempt(false)}
                        className="ml2"
                      />
                    </label>
                  </div>
                </div>
              </div>
              {isExempt ? (
                <div>
                  <div className="mt3 fl w-100 pt3 bt b--light-gray">
                    <label className="f6 fw6 db mb0 dark-gray ttc">
                      Work Schedules Exempt
                    </label>
                  </div>
                  <div className="mt2 fl w-100 flex justify-between">
                    <label className="f6 fw6 db mb1 gray ttc">Sunday</label>
                    <div className="flex w-40 justify-between">
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'sunday',
                            'start_time',
                            e
                          )
                        }
                        value={sunday.start_time}
                      />
                      <div className="flex items-center">
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
                    <div className="flex w-40 justify-between">
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'monday',
                            'start_time',
                            e
                          )
                        }
                        value={monday.start_time}
                      />
                      <div className="flex items-center">
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
                    <div className="flex w-40 justify-between">
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'tuesday',
                            'start_time',
                            e
                          )
                        }
                        value={tuesday.start_time}
                      />
                      <div className="flex items-center">
                        <label className="f4 db mb1 ttc">-</label>
                      </div>
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'tuesday',
                            'end_time',
                            e
                          )
                        }
                        value={tuesday.end_time}
                      />
                    </div>
                  </div>
                  <div className="mt2 fl w-100 flex justify-between">
                    <label className="f6 fw6 db mb1 gray ttc">Wednesday</label>
                    <div className="flex w-40 justify-between">
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
                      <div className="flex items-center">
                        <label className="f4 db mb1 ttc">-</label>
                      </div>
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'wednesday',
                            'end_time',
                            e
                          )
                        }
                        value={wednesday.end_time}
                      />
                    </div>
                  </div>
                  <div className="mt2 fl w-100 flex justify-between">
                    <label className="f6 fw6 db mb1 gray ttc">Thursday</label>
                    <div className="flex w-40 justify-between">
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'thursday',
                            'start_time',
                            e
                          )
                        }
                        value={thursday.start_time}
                      />
                      <div className="flex items-center">
                        <label className="f4 db mb1 ttc">-</label>
                      </div>
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'thursday',
                            'end_time',
                            e
                          )
                        }
                        value={thursday.end_time}
                      />
                    </div>
                  </div>
                  <div className="mt2 fl w-100 flex justify-between">
                    <label className="f6 fw6 db mb1 gray ttc">Friday</label>
                    <div className="flex w-40 justify-between">
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'friday',
                            'start_time',
                            e
                          )
                        }
                        value={friday.start_time}
                      />
                      <div className="flex items-center">
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
                    <div className="flex w-40 justify-between">
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'saturday',
                            'start_time',
                            e
                          )
                        }
                        value={saturday.start_time}
                      />
                      <div className="flex items-center">
                        <label className="f4 db mb1 ttc">-</label>
                      </div>
                      <input
                        className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                        type="time"
                        onChange={e =>
                          this.onChangeWorkingHourInput(
                            'saturday',
                            'end_time',
                            e
                          )
                        }
                        value={saturday.end_time}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt2 fl w-100">
                  <div className="mt3 mb3 fl w-100 pt3 bt b--light-gray">
                    <label className="f6 fw6 db mb0 dark-gray ttc">
                      Work Schedules Non-Exempt
                    </label>
                  </div>
                  <div className="mt3 w-100 flex justify-between">
                    <i
                      className="material-icons grey pointer mt2"
                      onClick={e => this.onPreviousWeek()}
                    >
                      chevron_left
                    </i>
                    <div className="w-60 flex justify-center">
                      <div className="w-60">
                        <Select
                          options={array_of_sundays}
                          formatOptionLabel={this.formatOptionLabel}
                          isClearable={true}
                          onChange={opt =>
                            this.onSelectChange('sundaySelected', opt)
                          }
                          placeholder="Please select current week"
                          className="mt1 w-100 f6"
                          defaultValue={null}
                          value={sundaySelected}
                        />
                      </div>
                      <div className="w-10 ml3">
                        <Tippy
                          placement="top-start"
                          trigger="click"
                          arrow={true}
                          interactive={true}
                          onCreate={this.onCreate}
                          content={
                            <div className="bg-white f6 flex">
                              <div
                                className="db shadow-4 pa3 flex justify-between"
                                style={{ width: 20 + 'rem' }}
                              >
                                <Select
                                  options={array_of_sundays}
                                  isClearable={true}
                                  onChange={opt =>
                                    this.onSelectChange(
                                      'copySundaySelected',
                                      opt
                                    )
                                  }
                                  className="mt1 w-70 f6"
                                  value={copySundaySelected}
                                />
                                <a
                                  className="btn btn--primary btn--small ml2 w-30 mt2"
                                  onClick={e => this.copyWeekScedule()}
                                >
                                  Copy
                                </a>
                              </div>
                            </div>
                          }
                        >
                          <i className={'material-icons grey pointer mt2'}>
                            file_copy
                          </i>
                        </Tippy>
                      </div>
                    </div>
                    <i
                      className="material-icons grey pointer mt2"
                      onClick={e => this.onNextWeek()}
                    >
                      chevron_right
                    </i>
                  </div>
                  {UserRoleStore.isLoadingSchedule ? (
                    <div>loading</div>
                  ) : (
                    <div className="mt3">
                      <div className="mt2 fl w-100 flex justify-between">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Sunday,{' '}
                          {nonExemptSunday.date
                            ? format(nonExemptSunday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptSunday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptSunday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptSunday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptSunday.end_time}
                          />
                        </div>
                      </div>
                      <div className="mt2 fl w-100 flex justify-between">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Monday,{' '}
                          {nonExemptMonday.date
                            ? format(nonExemptMonday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptMonday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptMonday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptMonday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptMonday.end_time}
                          />
                        </div>
                      </div>
                      <div className="mt2 fl w-100 flex justify-between">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Tuesday,{' '}
                          {nonExemptTuesday.date
                            ? format(nonExemptTuesday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptTuesday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptTuesday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptTuesday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptTuesday.end_time}
                          />
                        </div>
                      </div>
                      <div className="mt2 fl w-100 flex justify-between">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Wednesday,{' '}
                          {nonExemptWednesday.date
                            ? format(nonExemptWednesday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptWednesday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptWednesday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptWednesday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptWednesday.end_time}
                          />
                        </div>
                      </div>
                      <div className="mt2 fl w-100 flex justify-between">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Thursday,{' '}
                          {nonExemptThursday.date
                            ? format(nonExemptThursday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptThursday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptThursday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptThursday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptThursday.end_time}
                          />
                        </div>
                      </div>
                      <div className="mt2 fl w-100 flex justify-between">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Friday,{' '}
                          {nonExemptFriday.date
                            ? format(nonExemptFriday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptFriday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptFriday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptFriday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptFriday.end_time}
                          />
                        </div>
                      </div>
                      <div className="mt2 fl w-100 flex justify-between mb4">
                        <label className="f6 fw6 db mb1 gray ttc">
                          Saturday,{' '}
                          {nonExemptSaturday.date
                            ? format(nonExemptSaturday.date, 'MM/DD/YYYY')
                            : null}
                        </label>
                        <div className="flex w-40 justify-between">
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptSaturday,
                                'start_time',
                                e.target.value
                              )
                            }
                            value={nonExemptSaturday.start_time}
                          />
                          <div className="flex items-center">
                            <label className="f4 db mb1 ttc">-</label>
                          </div>
                          <input
                            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                            type="time"
                            onChange={e =>
                              this.onChangeNonExemptAttr(
                                nonExemptSaturday,
                                'end_time',
                                e.target.value
                              )
                            }
                            value={nonExemptSaturday.end_time}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
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
