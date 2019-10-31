import React from 'react'
import Select from 'react-select'
import isEmpty from 'lodash.isempty'
import classNames from 'classnames'
import AvatarPicker from '../utils/AvatarPicker'
import { addDays, format, subDays } from 'date-fns'
import { isEmptyString } from '../utils/StringHelper'
import UserRoleStore from './UserRoleStore'
import { toJS, autorun } from 'mobx'
import Tippy from '@tippy.js/react'
// import { ReactComponent as BlankAvatar } from '../utils/BlankAvatar.svg'
// import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { InputBarcode, CheckboxSelect } from '../utils'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import reactSelectStyle from '../utils/reactSelectStyle'
import { FieldError } from '../utils/FormHelpers'

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

class UserDetailsEditor extends React.Component {
  constructor(props) {
    super(props)
    const temp_date = this.stateTempDate()
    let array_of_weeks = this.stateArrayOfWeeks(temp_date)
    let exempt_schedules = this.stateExemptSchedules(temp_date)

    if (props.user) {
      let facilities = []
      let roles = []
      let default_facility = {}
      let reporting_manager = {}
      let user_mode = {}
      let department = {}
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
      if (props.user.department) {
        department = props.departmentsOptions.find(
          y => y.value === props.user.department
        )
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

      this.state = {
        tabs: 'General',
        userId: props.user.id,
        firstName: props.user.first_name || '',
        lastName: props.user.last_name || '',
        email: props.user.email || '',
        title: props.user.title || '',
        photoData: props.user.photo_data,
        phone_number: props.user.phone_number,
        badge_id: props.user.badge_id,
        department: department,
        photoUrl: props.user.photo_url,
        isActive: props.user.id ? props.user.is_active : true,
        isExempt: props.user.exempt || false,
        hourly_rate: props.user.hourly_rate,
        overtime_hourly_rate: props.user.overtime_hourly_rate,
        user_mode: user_mode,
        reporting_manager: reporting_manager,
        facilities,
        roles,
        default_facility,
        work_schedules: work_schedules,
        non_exempt_schedules: non_exempt_schedules,
        array_of_weeks: array_of_weeks,
        exempt_schedules: exempt_schedules,
        defaultDepartments: [],
        errors: {}
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
        badge_id: '',
        department: '',
        photoData: '',
        photoUrl: '',
        isActive: true,
        isExempt: false,
        hourly_rate: '',
        overtime_hourly_rate: '',
        facilities: [],
        roles: [],
        default_facility: {},
        work_schedules: props.companyWorkSchedules,
        non_exempt_schedules: [],
        array_of_weeks: array_of_weeks,
        exempt_schedules: exempt_schedules,
        defaultDepartments: [],
        errors: {}
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const temp_date = this.stateTempDate()
    let array_of_weeks = this.stateArrayOfWeeks(temp_date)
    let exempt_schedules = this.stateExemptSchedules(temp_date)

    if (nextProps.userroleAction === 'new') {
      this.setState({
        tabs: 'General',
        userId: '',
        firstName: '',
        lastName: '',
        email: '',
        title: '',
        photoData: '',
        phone_number: '',
        badge_id: '',
        department: '',
        photoUrl: '',
        isActive: true,
        isExempt: false,
        hourly_rate: 0,
        overtime_hourly_rate: 0,
        user_mode: null,
        reporting_manager: null,
        facilities: [],
        roles: [],
        default_facility: {},
        work_schedules: nextProps.companyWorkSchedules,
        non_exempt_schedules: [],
        array_of_weeks: array_of_weeks,
        exempt_schedules: exempt_schedules,
        defaultDepartments: [],
        errors: {}
      })
    }
  }

  stateTempDate = e => {
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    let first_day = weekday.findIndex(obj => obj === this.props.firstDayOfWeek)
    let curr_date = new Date()
    let temp_date = addDays(curr_date, (0 + first_day - curr_date.getDay()) % 7)
    return temp_date
  }

  stateArrayOfWeeks = temp_date => {
    let array_of_weeks = []
    for (let i = 0; i < 50; i++) {
      let next_seven_days = addDays(temp_date, 6)
      let args = {
        label: `${format(temp_date, 'MM/DD/YYYY')} - ${format(
          next_seven_days,
          'MM/DD/YYYY'
        )}`,
        value: temp_date
      }
      array_of_weeks.push(args)
      temp_date = addDays(temp_date, 7)
    }
    return array_of_weeks
  }

  stateExemptSchedules = temp_date => {
    let exempt_schedules = []
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]

    for (let i = 0; i <= 6; i++) {
      let args = {
        day: weekday[addDays(temp_date, i).getDay()].toLowerCase()
      }
      exempt_schedules.push(args)
    }
    return exempt_schedules
  }

  renderNonExemptSchedules = (i, data) => {
    return (
      <div className="mt2 fl w-100 flex justify-between" key={i}>
        <label className="f6 fw6 db mb1 gray ttc">
          {data.day}, {data.date ? format(data.date, 'MM/DD/YYYY') : null}
        </label>
        <div className="flex w-40 justify-between">
          <input
            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
            type="time"
            onChange={e =>
              this.onChangeNonExemptAttr(data, 'start_time', e.target.value)
            }
            value={data.start_time}
          />
          <div className="flex items-center">
            <label className="f4 db mb1 ttc">-</label>
          </div>
          <input
            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
            type="time"
            onChange={e =>
              this.onChangeNonExemptAttr(data, 'end_time', e.target.value)
            }
            value={data.end_time}
          />
        </div>
      </div>
    )
  }

  renderExemptSchedules = (i, data, find_exempt) => {
    return (
      <div className="mt2 fl w-100 flex justify-between" key={i}>
        <label className="f6 fw6 db mb1 gray ttc">{data.day}</label>
        <div className="flex w-40 justify-between">
          <input
            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
            type="time"
            onChange={e =>
              this.onChangeWorkingHourInput(data.day, 'start_time', e)
            }
            value={find_exempt.start_time}
          />
          <div className="flex items-center">
            <label className="f4 db mb1 ttc">-</label>
          </div>
          <input
            className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
            type="time"
            onChange={e =>
              this.onChangeWorkingHourInput(data.day, 'end_time', e)
            }
            value={find_exempt.end_time}
          />
        </div>
      </div>
    )
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
        this.setState({ non_exempt_schedules: [] })
        this.calculateRangeDate(options.value)
      } else {
        this.setState({ [field]: options })
      }
    } else {
      this.setState({ [field]: '' })
    }
  }

  calculateRangeDate = async date => {
    let schedules = []
    const weekday = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]
    // const updated_schedules = this.state.non_exempt_schedules
    let week_schedule = []
    if (isEmptyString(this.state.userId)) {
      for (let i = 0; i < 7; i++) {
        let args = {
          day_id: i,
          day: weekday[addDays(date, i).getDay()].toLowerCase(),
          date: format(addDays(date, i), 'MM/DD/YYYY'),
          start_time: '',
          end_time: ''
        }
        week_schedule.push(args)
      }
    } else {
      await UserRoleStore.getSchedulesByDate(this.state.userId, date)
      schedules = toJS(UserRoleStore.nonExemptSchedules)
      for (let i = 0; i < schedules.length; i++) {
        let args = {
          day_id: i,
          day: weekday[addDays(date, i).getDay()].toLowerCase(),
          date: schedules[i].date,
          start_time: schedules[i].start_time,
          end_time: schedules[i].end_time
        }
        week_schedule.push(args)
        // updated_schedules.map(t => {
        //   let updated = updated_schedules.find(e => e.day_id === i)
        //   updated.date = schedules[i].date
        //   updated.start_time = schedules[i].start_time
        //   updated.end_time = schedules[i].end_time
        //   return t.day_id === i ? updated : t
        // })
      }
    }
    let sundaySelected = {
      value: date,
      label: `${week_schedule[0].date} - ${week_schedule[6].date}`
    }
    this.setState({
      sundaySelected: sundaySelected,
      non_exempt_schedules: week_schedule
    })
  }

  onUploadAvatarSuccess = photoData => {
    this.setState({ photoData: JSON.stringify(photoData) })
  }

  onAvatarPreviewUpdate = preview => {
    this.setState({ photoUrl: preview })
  }

  validateAndGetValues() {
    const { lastName, firstName, email } = this.state
    let errors = {}

    if (firstName.length === 0) {
      errors.firstName = ['First Name is required']
    }

    if (lastName.length === 0) {
      errors.lastName = ['Last Name is required']
    }

    if (email.length === 0) {
      errors.email = ['Email is required']
    }

    if (
      this.props.existingEmail.includes(email) &&
      this.props.userroleAction === 'new'
    ) {
      errors.email = ['Email is already taken']
    }

    const isValid = Object.getOwnPropertyNames(errors).length === 0
    if (!isValid) {
      this.setState({ errors })
    }

    return {
      isValid,
      lastName,
      firstName,
      email
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const { email, firstName, lastName, isValid } = this.validateAndGetValues()
    if (!isValid) {
      return
    }

    const {
      userId,
      password,
      title,
      phone_number,
      badge_id,
      department,
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
    const newFacilities = isEmpty(facilities)
      ? []
      : facilities.map(x => x.value)
    const defaultFacilityId = default_facility ? default_facility.value : null
    const photo_data = photoData ? photoData : null
    const newUserMode = user_mode ? user_mode.value : null
    const newDepartment = department ? department.value : null
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
        badge_id: badge_id,
        department: newDepartment,
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

  find_work_schedules = day => {
    return this.state.work_schedules.find(e => e.day === day)
  }

  onChangeNonExemptAttr = (record, key, value) => {
    record[key] = value
    const records = this.state.non_exempt_schedules.map(t => {
      return t === record ? record : t
    })

    this.setState({
      non_exempt_schedules: records
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
        'sunday-work':
          UserRoleStore.getWeekWithWorkSchedule() &&
          UserRoleStore.getWeekWithWorkSchedule().includes(label)
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
      departmentsOptions,
      isSaving,
      userManagerOptions,
      user,
      canUpdate
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
      badge_id,
      department,
      roles,
      default_facility,
      hourly_rate,
      user_mode,
      reporting_manager,
      overtime_hourly_rate,
      array_of_weeks,
      exempt_schedules,
      sundaySelected, //used for date selection in non exempt schedule
      copySundaySelected, // used for date selection in copy section
      defaultDepartments,
      errors
    } = this.state

    const saveButtonText = isSaving ? 'Saving...' : 'Save'

    const isSameUser = this.props.currentId === this.props.user.id

    const { wagesPermission } = this.props
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
                  <AvatarPicker
                    defaultUrl={photoUrl}
                    onPreviewUpdate={this.onAvatarPreviewUpdate}
                    onUploadSuccess={this.onUploadAvatarSuccess}
                  />
                </div>
                <div className="w-100 fl pr3">
                  <label className="f6 fw6 db mb1 gray ttc">Badge ID</label>
                  <InputBarcode
                    className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    name={'badge_id'}
                    value={badge_id}
                    onChange={this.onChangeInput('badge_id')}
                  />
                </div>
              </div>
              <div className="mt2 fl w-100">
                <div className="w-50 fl pr3">
                  <label className="f6 fw6 db mb1 gray ttc">First Name</label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('firstName')}
                    value={firstName}
                    // required={true}
                    // disabled={isSameUser}
                  />
                  <FieldError errors={this.state.errors} field="firstName" />
                </div>
                <div className="w-50 fr pl3">
                  <label className="f6 fw6 db mb1 gray ttc">Last Name</label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('lastName')}
                    value={lastName}
                    // required={true}
                    // error={errors['lastName']}
                    // disabled={isSameUser}
                  />
                  <FieldError errors={this.state.errors} field="lastName" />
                </div>
              </div>
              <div className="mt2 fl w-100">
                <div className="w-50 fl pr3">
                  <label className="f6 fw6 db mb1 gray ttc">Email</label>
                  <input
                    className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    onChange={this.onChangeInput('email')}
                    value={email}
                    // error={errors['email']}
                    // required={true}
                  />
                  <FieldError errors={this.state.errors} field="email" />
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
              {roles && !isEmpty(roles.find(v => v.label == 'Manager')) ? (
                <div className="mt2 fl w-100 mb2">
                  <label className="f6 fw6 db mb1 gray ttc">Department</label>
                  <AsyncCreatableSelect
                    isClearable
                    placeholder="Search Department..."
                    onChange={opt => this.onSelectChange('department', opt)}
                    value={department}
                    styles={reactSelectStyle}
                    defaultOptions={departmentsOptions}
                  />
                </div>
              ) : (
                ''
              )}

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
                  {isActive ? 'Active' : 'Deactivate'}
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
                  User will be deactivated from accessing the system if
                  selected.
                </p>
              </div>
            </div>
          )}

          {this.state.tabs === 'Wages' && (
            <div className="ph4">
              {wagesPermission.read ? (
                <div className="mt2 fl w-100">
                  <div className="w-50 fl pr3">
                    <label className="f6 fw6 db mb1 gray ttc">
                      Hourly Rate
                    </label>
                    {console.log(`${wagesPermission.update}`)}
                    <input
                      className="db w-90 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                      onChange={this.onChangeInput('hourly_rate')}
                      value={hourly_rate}
                      required={true}
                      readOnly={wagesPermission.update ? false : true}
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
                      readOnly={wagesPermission.update ? false : true}
                    />
                  </div>
                </div>
              ) : (
                <div className="mt2 fl w-100">
                  <p className="pa3 bg-light-yellow ba br2 b--light-grey flex items-center">
                    <i className="orange material-icons">
                      notification_important
                    </i>
                    <span className="pl2">
                      You don't have permissions to access this section.
                    </span>
                  </p>
                </div>
              )}
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
                  {this.state.exempt_schedules.map((e, i) =>
                    this.renderExemptSchedules(
                      i,
                      e,
                      this.find_work_schedules(e.day)
                    )
                  )}
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
                          options={array_of_weeks}
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
                                className="db shadow-4 pa3 overflow-y-scroll"
                                style={{ width: 13 + 'rem', height: '320px' }}
                              >
                                {array_of_weeks.map(e => (
                                  <label className="dim db pv1 gray ttc">
                                    <input
                                      key={e.label}
                                      type="checkbox"
                                      options={e}
                                      onChange={opt =>
                                        this.onSelectChange(
                                          'copySundaySelected',
                                          opt
                                        )
                                      }
                                      className="mr3"
                                      value={copySundaySelected}
                                    />
                                    {e.label}
                                  </label>
                                ))}
                                <div class="flex center">
                                  <a
                                    className="btn btn--primary btn--small ml2 mt2"
                                    onClick={e => this.copyWeekScedule()}
                                  >
                                    Copy
                                  </a>
                                </div>
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
                      {this.state.non_exempt_schedules.map((e, i) =>
                        this.renderNonExemptSchedules(i, e)
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
            {canUpdate && (
              <input
                type="submit"
                value={saveButtonText}
                className="fr btn btn--primary"
              />
            )}
          </div>
        </form>
      </div>
    )
  }
}

export default UserDetailsEditor
