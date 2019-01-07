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
import { saveIssue } from '../actions/saveIssue'
import loadTasks from '../actions/loadTasks'
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

class IssueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.descriptionInput = React.createRef()
  }

  componentDidMount() {
    loadTasks(this.props.batch.id).then(tasks => this.setState({ tasks }))
    this.loadUsers()
    this.loadLocations()

    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (id) {
        // TODO: Load data for editing here
      }
    })
  }

  resetState = () => {
    return {
      title: '',
      description: '',
      status: '',
      issue_type: '',
      location_type: '',
      resolution_notes: '',
      reason: '',
      resolved_at: '',
      errors: {},
      severity: null,
      task_id: '',
      location_id: '',
      assigned_to_id: '',
      description: '',
      tasks: [],
      users: [],
      locations: [],
      modalOpen: false
    }
  }

  onUppyOpen = () => {
    this.setState({ modalOpen: !this.state.modalOpen })
  }

  onUppyClose = () => {
    this.setState({ modalOpen: false })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSave = event => {
    const payload = this.validateAndGetValues()

    if (payload.isValid) {
      saveIssue(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
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
      status,
      issue_type,
      location_id,
      location_type,
      resolution_notes,
      reason,
      resolved_at
    } = this.state

    const batch_id = this.props.batch.id

    // TODO: Do validation here
    const isValid = true

    return {
      title,
      description,
      severity,
      status,
      issue_type,
      location_id,
      location_type,
      resolution_notes,
      reason,
      resolved_at,
      batch_id,
      isValid
    }
  }

  onTaskChanged = option => {}

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
      node.style.height = 40 + lines * 20 + 'px'
      node.style.minHeight = ''
    } else {
      node.style.minHeight = 40 + 15 * 20 + 'px'
      node.style.height = 'auto'
    }
  }

  onSeverityChanged = severity => {
    this.setState({ severity })
  }

  loadLocations = inputValue => {
    inputValue = inputValue || ''

    return fetch(
      `/api/v1/facilities/${
        this.props.batch.facility_id
      }/search_locations?filter=${inputValue}`,
      { credentials: 'include' }
    )
      .then(response => response.json())
      .then(data => {
        // console.log(data.data)
        this.setState({ locations: data.data })
      })
  }

  loadUsers = inputValue => {
    inputValue = inputValue || ''

    return fetch(
      `/api/v1/users/by_facility/${
        this.props.batch.facility_id
      }?filter=${inputValue}`,
      { credentials: 'include' }
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ users: data.data })
      })
  }

  render() {
    const { severity, task_id, location_id, assigned_to_id, tasks } = this.state
    const task = tasks.find(x => x.id === task_id)

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
              value={severity}
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
              styles={reactSelectStyle}
              components={{ Option: LocationOption, SingleValue: LocationSingleValue }}
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
              options={this.state.users}
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
          open={this.state.modalOpen}
          onRequestClose={this.onUppyClose}
          plugins={['Webcam', 'Dropbox']}
        />
      </React.Fragment>
    )
  }
}


export default IssueForm
