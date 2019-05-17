import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import classNames from 'classnames'
import AvatarPicker from '../utils/AvatarPicker'
import { ReactComponent as BlankAvatar } from '../utils/BlankAvatar.svg'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { addDays } from 'date-fns'
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
      


      // if (props.user.non_exempt_schedules) {
      //   non_exempt_schedules = props.user.non_exempt_schedules.map(e => {
      //     e.start_date = new Date(e.start_date)
      //     e.end_date = new Date(e.end_date)
      //     return e
      //   })
      // }
      let sundaySelected = { label: '', value: ''}
      non_exempt_schedules = [
        { day: 'sunday', date: '', start_time: '08:00', end_time: '' },
        { day: 'monday', date: '', start_time: '', end_time: '' },
        { day: 'tuesday', date: '', start_time: '', end_time: '' },
        { day: 'wednesday', date: '', start_time: '', end_time: '' },
        { day: 'thursday', date: '', start_time: '', end_time: '' },
        { day: 'friday', date: '', start_time: '', end_time: '' },
        { day: 'saturday', date: '', start_time: '', end_time: '' },
      ]


      let a = { label: '5/19/2019 - 5/25/2019', value: new Date(2019, 4, 19) }
      let b = { label: '5/26/2019 - 6/1/2019', value: new Date(2019, 4, 26) }
      let c = { label: '6/2/2019 - 6/8/2019', value: new Date(2019, 5, 2) }
      let array_of_sundays = [a, b, c]

      // let curr_date = new Date()
      // curr_date.setDate(curr_date.getDate() + (0 + 7 - curr_date.getDay()) % 7);
      // array_of_sundays.push(curr_date)
      // let a = curr_date
      // for(let i = 0; i < 5; i++){
      //   if (curr_date instanceof Date){
      //     a.setDate(a.getDate() + 7)
      //     console.log(a)
      //     const date = a
      //     array_of_sundays.push(date)
      //     curr_date = a
      //   }
      // }
      // console.log(array_of_sundays)


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
        array_of_sundays: array_of_sundays,
        sundaySelected: sundaySelected
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
    console.log(value)
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
      if (field === 'sundaySelected'){
        this.setState({ [field]: options }, () => {
          this.calculateRangeDate(options.value)
        })
      }else {
        this.setState({ [field]: options })
      }
    } else {
      this.setState({ [field]: '' })
    }
  }

  calculateRangeDate = (date) => {
    for(let i = 0; i < 7; i++){
      console.log(addDays(date, i))
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
        exempt: isExempt || false,
        facilities: newFacilities,
        roles: newRoles,
        reporting_manager_id: reporting_manager_id,
        default_facility_id: defaultFacilityId,
        work_schedules: work_schedules,
        non_exempt_schedules: non_exempt_schedules
      }
    }
    this.props.onSave(userDetails)
  }

  changeTabs = value => {
    this.setState({ tabs: value })
  }

  onAddNonExemptSchedule = event => {
    const newSchedule = {
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: ''
    }
    const newNonExemptSchedules = [
      ...this.state.non_exempt_schedules,
      newSchedule
    ]
    this.setState({
      non_exempt_schedules: newNonExemptSchedules
    })

    event.preventDefault()
  }

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
    console.log(value)
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
      roles,
      default_facility,
      hourly_rate,
      user_mode,
      reporting_manager,
      overtime_hourly_rate,
      array_of_sundays, 
      sundaySelected
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


    const nonExemptSunday = this.state.non_exempt_schedules.find(e => e.day === 'sunday') || {}
    const nonExemptMonday = this.state.non_exempt_schedules.find(e => e.day === 'monday') || {}
    const nonExemptTuesday = this.state.non_exempt_schedules.find(e => e.day === 'tuesday') || {}
    const nonExemptWednesday = this.state.non_exempt_schedules.find(e => e.day === 'wednesday') || {}
    const nonExemptThursday = this.state.non_exempt_schedules.find(e => e.day === 'thursday') || {}
    const nonExemptFriday = this.state.non_exempt_schedules.find(e => e.day === 'friday') || {}
    const nonExemptSaturday = this.state.non_exempt_schedules.find(e => e.day === 'saturday') || {}

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
                this.state.tabs === 'Wages' ? 'active' : ''
              }`}
              onClick={() => this.changeTabs('Wages')}
            >
              Wages
            </div>
            <div
              className={`pl3 ph4 pointer dim ${
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
                    <img src={photoUrl} className="fl h4 w4" />
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
                  <div onChange={e => this.onChangeExempt(true)}>
                    <label className="f6 grey mr2 mt2 pointer">
                      Exempt
                      <input
                        value="exempt"
                        type="radio"
                        checked={isExempt === true}
                        className="ml2"
                      />
                    </label>
                  </div>
                  <div onChange={e => this.onChangeExempt(false)}>
                    <label className="f6 grey mr2 ml2 pointer">
                      Non-exempt
                      <input
                        value="non-exempt"
                        type="radio"
                        checked={isExempt === false}
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
                    <i className="material-icons grey pointer mt2">chevron_left</i>
                    <div className="w-60 flex">
                      <div className="w-90">
                        <Select
                          options={array_of_sundays}
                          isClearable={true}
                          onChange={opt => this.onSelectChange('sundaySelected', opt)}
                          className="mt1 w-100 f6"
                          value={sundaySelected}
                        />
                      </div>
                      <div className="w-10 ml3">
                        <i className="material-icons grey pointer mt2">file_copy</i>
                      </div>
                    </div>
                    <i className="material-icons grey pointer mt2">chevron_right</i>
                  </div>


                  <div className="mt3">
                    <div className="mt2 fl w-100 flex justify-between">
                      <label className="f6 fw6 db mb1 gray ttc">Sunday, 05/19/2019</label>
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
                        <label className="f6 fw6 db mb1 gray ttc">Monday, 06/19/2019</label>
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
                        <label className="f6 fw6 db mb1 gray ttc">Tuesday, 07/19/2019</label>
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
                        <label className="f6 fw6 db mb1 gray ttc">Wednesday, 08/19/2019</label>
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
                        <label className="f6 fw6 db mb1 gray ttc">Thursday, 09/19/2019</label>
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
                        <label className="f6 fw6 db mb1 gray ttc">Friday, 10/19/2019</label>
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
                        <label className="f6 fw6 db mb1 gray ttc">Saturday, 11/19/2019</label>
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
