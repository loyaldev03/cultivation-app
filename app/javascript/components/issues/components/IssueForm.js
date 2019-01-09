import React from 'react'
import Select, { components } from 'react-select'
import Uppy from '@uppy/core'
import DashboardModal from '@uppy/react/lib/DashboardModal'
import Webcam from '@uppy/webcam'
import Dropbox from '@uppy/dropbox'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

import { TextInput } from '../../utils/FormHelpers'
import reactSelectStyle from '../../utils/reactSelectStyle'
import Avatar from '../../utils/Avatar'

import saveIssue from '../actions/saveIssue'
import getIssue from '../actions/getIssue'
import loadTasks from '../actions/loadTasks'
import loadUsers from '../actions/loadUsers'
import loadLocations from '../actions/loadLocations'

import TaskOption from './TaskOption'
import LocationOption from './LocationOption'
import LocationSingleValue from './LocationSingleValue'
import UserOption from './UserOption'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const uppy = Uppy({
  meta: { type: 'avatar' },
  restrictions: { maxNumberOfFiles: 1 },
  autoProceed: true
})
uppy.use(Webcam)
uppy.use(Dropbox, { serverUrl: 'https://companion.uppy.io/' })
uppy.on('complete', result => {
  const url = result.successful[0].uploadURL
  console.log(url)
})

const resolveLocationType = location => {
  if (location.t_id.length > 0) {
    return 'Tray'
  } else if (location.sf_id.length > 0) {
    return 'Shelf'
  } else if (location.rw_id.length > 0) {
    return 'Row'
  } else if (location.s_id.length > 0) {
    return 'Section'
  } else if (location.rm_id.length > 0) {
    return 'Room'
  } else if (location.f_id.length > 0) {
    return 'Facility'
  }
}
class IssueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.resetState(),
      tasks: [],
      users: [],
      locations: []
    }
    this.descriptionInput = React.createRef()
  }

  componentDidMount() {
    // Call setState only once
    Promise.all([
      loadTasks(this.props.batchId),
      loadUsers(this.props.facilityId),
      loadLocations(this.props.facilityId) // to be rewritten to pass in selected task id
    ]).then(result => {
        const tasks = result[0]
        const users = result[1].data
        const locations = result[2].data

        this.setState({
          tasks,
          users,
          locations
        })
      })
  }

  componentDidUpdate(prevProps, prevState) {
    // Comparing state.id to workaround this component that is initialized with 
    // an issueId, which in this case prevProp.issueId same as this.props.issueId.
    // 
    // To solve this problem, the code needs to check if new issueId has been assigned to state.id
    // If it is the same then it is assumed the component has loaded the issue.
    if(prevProps.issueId === this.props.issueId && this.props.issueId === this.state.id){
      return
    }
    else if (this.props.issueId.length > 0 && this.state.id !== this.props.issueId) {
      getIssue(this.props.issueId).then(({ data }) => {
        const attr = data.data.attributes
        this.setState({
          ...this.resetState(),
          id: this.props.issueId,
          title: attr.title,
          description: attr.description,
          severity: attr.severity,
          task_id: attr.task ? attr.task.id : '',
          location_id: attr.location_id,
          location_type: attr.location_type,
          assigned_to_id: attr.assigned_to ? attr.assigned_to.id : '',
          status: attr.status,
          created_at: attr.created_at,
          reported_by: attr.reported_by,
          issue_no: attr.issue_no
        })
      })
    } else {
      // console.log('should reset here')
      this.setState(this.resetState())
    }
  }

  resetState = () => {
    return {
      id: '',
      title: '',
      description: '',
      severity: '',
      task_id: '',
      location_id: '',
      location_type: '',
      assigned_to_id: '',
      // read only
      status: '',
      created_at: null,
      reported_by: { first_name: 'J', lastName: 'D', photo: null },
      issue_no: '',
      // UI states
      uppyOpen: false,
      errors: {}
    }
  }

  onUppyOpen = () => {
    this.setState({ uppyOpen: !this.state.uppyOpen })
  }

  onUppyClose = () => {
    this.setState({ uppyOpen: false })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }
  onTaskChanged = task => {
    this.setState({ task_id: task.value })
  }
  onSeverityChanged = severity => {
    this.setState({ severity: severity.value })
  }
  onAssignedChanged = user => {
    this.setState({ assigned_to_id: user.value })
  }
  onLocationChanged = location => {
    this.setState({
      location_id: location.id,
      location_type: resolveLocationType(location)
    })
  }

  onDescriptionChanged = event => {
    this.setState(
      { description: event.target.value },
      this.resizeDescriptionInput
    )
  }

  resizeDescriptionInput = () => {
    const lines = (this.state.description.match(/\n/g) || []).length
    const node = this.descriptionInput.current

    if (!node) {
      return
    }

    if (lines < 3) {
      node.style.height = 'auto'
      node.style.minHeight = ''
    } else if (lines >= 3 && lines < 15) {
      node.style.height = 40 + lines * 23 + 'px'
      node.style.minHeight = ''
    } else {
      node.style.minHeight = 40 + 15 * 20 + 'px'
      node.style.height = 'auto'
    }
  }

  onSave = event => {
    const { isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      saveIssue(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.setState(this.resetState())
          window.editorSidebar.close()
        }
      })
    }

    event.preventDefault()
  }

  validateAndGetValues() {
    const {
      title,
      description,
      severity,
      task_id,
      location_id,
      location_type,
      assigned_to_id
    } = this.state

    const errors = {}
    if (title.length <= 0) {
      errors.title = ['Issue title is required']
    }

    if (severity.length <= 0) {
      errors.severity = ['Severity is required']
    }
    const isValid = Object.getOwnPropertyNames(errors).length == 0

    if (!isValid) {
      this.setState({ errors })
    }

    return {
      title,
      description,
      severity,
      task_id,
      location_id,
      location_type,
      assigned_to_id,
      cultivation_batch_id: this.props.batchId,
      id: this.props.issueId,
      isValid
    }
  }

  renderTitle() {
    if (this.props.mode === 'edit') {
      return (
        <React.Fragment>
          <div className="flex w-100 ph4 items-center pt3">
            <div className="w-auto">
              <Avatar
                firstName={this.state.reported_by.first_name}
                lastName={this.state.reported_by.last_name}
                photoUrl={this.state.reported_by.photo}
                size={25}
              />
            </div>
            <div className="f7 fw6 gray w-auto ph2 mr1">
              ISSUE #{this.state.issue_no.toString().padStart(5, '0')}
            </div>
            <div className="f7 fw6 green flex f6 green fw6 w-auto">OPEN</div>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={this.props.onClose}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>
          <div className="flex w-100 ph4 mt4 mb2">
            <a
              href="#"
              onClick={this.props.onToggleMode}
              className="link orange f6"
            >
              &lt; Back
            </a>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Submit an issue</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={this.props.onClose}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>
        </React.Fragment>
      )
    }
  }

  render() {
    console.log(`this.props.issueId: ${this.props.issueId}`)
    const {
      severity,
      task_id,
      location_id,
      assigned_to_id,
      description
    } = this.state
    const task = task_id
      ? this.state.tasks.find(x => x.value === task_id)
      : null
    const location = location_id
      ? this.state.locations.find(x => x.id === location_id)
      : null
    const assigned_to = assigned_to_id
      ? this.state.users.find(x => x.value === assigned_to_id)
      : null
    const severityOption = severity
      ? severityOptions.find(x => x.value === severity)
      : null

    return (
      <React.Fragment>
        {this.renderTitle()}

        <div className="ph4 mt3 mb3 flex">
          <div className="w-100">
            <TextInput
              label="Title"
              fieldname="title"
              value={this.state.title}
              onChange={this.onChangeGeneric}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-30">
            <label className="f6 fw6 db mb1 gray ttc">Severity</label>
            <Select
              options={severityOptions}
              styles={reactSelectStyle}
              onChange={this.onSeverityChanged}
              value={severityOption}
            />
          </div>
          <div className="w-30 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Status</label>
            <span className="f6 green flex f6 green pt2 fw6">Open</span>
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Reported at</label>
            <span className="f6 green flex f6 green pt2 fw6">Today</span>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Task</label>
            <Select
              options={this.state.tasks}
              onChange={this.onTaskChanged}
              value={task}
              styles={reactSelectStyle}
              components={{ Option: TaskOption }}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Location</label>
            <Select
              isSearchable
              options={this.state.locations}
              onChange={this.onLocationChanged}
              value={location}
              styles={reactSelectStyle}
              components={{
                Option: LocationOption,
                SingleValue: LocationSingleValue
              }}
              filterOption={(option, input) => {
                const words = input.toLowerCase().split(/\s/)
                return words.every(
                  x => option.label.toLowerCase().indexOf(x) >= 0
                )
              }}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Assign to</label>
            <Select
              isSearchable
              options={this.state.users}
              onChange={this.onAssignedChanged}
              value={assigned_to}
              styles={reactSelectStyle}
              components={{ Option: UserOption }}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Details</label>
            <textarea
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              ref={this.descriptionInput}
              onChange={this.onDescriptionChanged}
              value={description}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Attachments</label>
            <a
              href="#"
              style={{ width: 50, height: 50 }}
              className="bg-black-20 white flex justify-center items-center link"
              onClick={this.onUppyOpen}
            >
              <i className="material-icons white f3">attach_file</i>
            </a>
          </div>
        </div>

        <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-end">
          <a
            className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
            href="#"
            onClick={this.onSave}
          >
            Save
          </a>
        </div>
        <DashboardModal
          uppy={uppy}
          closeModalOnClickOutside
          open={this.state.uppyOpen}
          onRequestClose={this.onUppyClose}
          plugins={['Webcam', 'Dropbox']}
        />
      </React.Fragment>
    )
  }
}

export default IssueForm
