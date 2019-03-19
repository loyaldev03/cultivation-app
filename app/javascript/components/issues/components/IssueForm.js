import 'babel-polyfill'

import React from 'react'
import Select from 'react-select'
import CreatableSelect from 'react-select/lib/Creatable'

import DashboardModal from '@uppy/react/lib/DashboardModal'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'
import setupUppy from '../../utils/setupUppy'

import { TextInput } from '../../utils/FormHelpers'
import reactSelectStyle from '../../utils/reactSelectStyle'
import UserPicker from '../../utils/UserPicker'
import AttachmentPopup from '../../utils/AttachmentPopup'
import AttachmentThumbnail from '../../utils/AttachmentThumbnail'
import { formatDate, formatTime } from '../../utils/DateHelper'

import saveIssue from '../actions/saveIssue'
import loadTasks from '../actions/loadTasks'
import loadUsers from '../actions/loadUsers'
import loadLocations from '../actions/loadLocations'

import currentIssueStore from '../store/CurrentIssueStore'

import TaskOption from './TaskOption'
import LocationOption from './LocationOption'
import LocationSingleValue from './LocationSingleValue'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

class IssueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ...this.resetState(),
      tasks: [],
      users: [],
      locations: []
    }
    this.uppy = setupUppy(this.onUppyComplete)
    this.descriptionInput = React.createRef()
  }

  componentDidMount() {
    // Call setState only once
    Promise.all([
      loadTasks(this.props.batchId),
      loadUsers(this.props.facilityId)
    ]).then(result => {
      const tasks = result[0]
      const users = result[1].data
      this.setState({
        tasks,
        users
      })
    })
  }

  async componentDidUpdate(prevProps) {
    // Comparing state.id to workaround this component that is initialized with
    // an issueId, which in this case prevProp.issueId same as this.props.issueId.
    //
    // To solve this problem, the code needs to check if new issueId has been assigned to state.id
    // If it is the same then it is assumed the component has loaded the issue.
    if (
      prevProps.issueId === this.props.issueId &&
      this.props.issueId === this.state.id
    ) {
      return
    } else if (
      this.props.issueId.length > 0 &&
      this.state.id !== this.props.issueId
    ) {
      this.loadIssue()
    } else {
      this.setState(this.resetState())
    }
  }

  async loadIssue() {
    const issue = currentIssueStore.issue
    let locations = []

    if (issue.task) {
      locations = await loadLocations(this.props.batchId, issue.task.id)
    }

    this.setState(
      {
        ...this.resetState(),
        ...issue,

        locations,
        task_id: issue.task ? issue.task.id : '',
        assigned_to_id: issue.assigned_to ? issue.assigned_to.id : ''
      },
      this.resizeDescriptionInput
    )
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
      tags: [],
      // read only
      status: '',
      created_at: null,
      reported_by: { first_name: '', lastName: '', photo: null },
      issue_no: '',
      // UI states
      previewOpen: false,
      previewUrl: '',
      previewType: '',
      uppyOpen: false,
      attachments: [],
      delete_attachments: [],
      errors: {}
    }
  }

  onUppyComplete = result => {
    if (result.successful) {
      let attachments = this.state.attachments
      const newAttachments = result.successful.map(file => {
        return {
          id: '',
          key: file.meta.key,
          filename: file.meta.name,
          url: file.preview,
          mime_type: file.type,
          data: JSON.stringify({
            id: file.meta.key.match(/^cache\/(.+)/)[1],
            storage: 'cache',
            metadata: {
              size: file.size,
              filename: file.name,
              mime_type: file.type
            }
          })
        }
      })
      attachments = [...attachments, ...newAttachments]
      this.setState({ attachments })
    }
  }

  onUppyOpen = () => {
    window.editorSidebar.scrollToTop()
    this.setState({ uppyOpen: !this.state.uppyOpen })
  }

  onUppyClose = () => {
    this.setState({ uppyOpen: false })
    this.uppy.reset()
  }

  onDeleteAttachment = key => {
    const result = confirm('Remove attachment?')
    if (result) {
      const attachment = this.state.attachments.find(x => x.key == key)
      this.setState({
        attachments: this.state.attachments.filter(x => x.key != key),
        delete_attachments: [...this.state.delete_attachments, key]
      })
    }
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onTaskChanged = task => {
    if (!task) {
      this.setState({
        task_id: '',
        location_id: '',
        location_type: '',
        locations: []
      })
    } else {
      loadLocations(this.props.batchId, task.value).then(result => {
        this.setState({
          task_id: task.value,
          locations: result,
          location_id: '',
          location_type: ''
        })
      })
    }
  }
  onSeverityChanged = severity => {
    this.setState({ severity: severity.value })
  }
  onAssignedChanged = user => {
    if (!user) {
      this.setState({ assigned_to_id: '' })
    } else {
      this.setState({ assigned_to_id: user.value })
    }
  }
  onLocationChanged = location => {
    if (!location) {
      this.setState({ location_id: '', location_type: '' })
    } else {
      this.setState({
        location_id: location.id,
        location_type: location.location_type
      })
    }
  }

  onDescriptionChanged = event => {
    this.setState(
      { description: event.target.value },
      this.resizeDescriptionInput
    )
  }

  resizeDescriptionInput = () => {
    // Reset field height
    const field = this.descriptionInput.current
    field.style.height = 'inherit'

    // Get the computed styles for the element
    const computed = window.getComputedStyle(field)

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue('border-top-width'), 10) +
      parseInt(computed.getPropertyValue('padding-top'), 10) +
      field.scrollHeight +
      parseInt(computed.getPropertyValue('padding-bottom'), 10) +
      parseInt(computed.getPropertyValue('border-bottom-width'), 10)

    field.style.height = height + 'px'
  }

  onSave = event => {
    const { isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      saveIssue(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          // this.setState(this.resetState()) //causing memory leaks
          data.data.attributes.tags = data.data.attributes.tags.map(e => ({
            label: e,
            value: e
          }))
          currentIssueStore.setIssue(data.data.attributes)
          this.props.onClose()

          // Pass newly created issue back to parent.
          if (this.props.onCreated) {
            this.props.onCreated(data.data.attributes)
          }
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
      assigned_to_id,
      attachments,
      delete_attachments
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
    const tags = this.state.tags.map(e => e.value)

    return {
      title,
      description,
      severity,
      task_id,
      location_id,
      location_type,
      assigned_to_id,
      tags,
      attachments,
      delete_attachments,
      cultivation_batch_id: this.props.batchId,
      id: this.props.issueId,

      // TODO: This should be daily_task if issues are raise at daily task screen
      issue_type: 'planning',
      isValid
    }
  }

  onTogglePreview = (url = '', type = '', filename) => {
    this.setState({
      previewOpen: !this.state.previewOpen,
      previewUrl: url,
      previewType: type
    })
  }

  onClose = () => {
    if (this.props.issueId.length > 0) {
      this.props.onToggleMode()
    } else {
      this.props.onClose()
    }
  }

  renderTitle() {
    if (this.props.mode === 'edit') {
      return (
        <div className="flex w-100 ph3 mt3 mb2">
          <a
            href="#"
            onClick={this.props.onToggleMode}
            className="link orange f6"
          >
            &lt; Back
          </a>
        </div>
      )
    } else {
      return (
        <React.Fragment>
          <div
            className="ph3 pv2 bb b--light-gray flex items-center"
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

  renderAttachments() {
    const attachments = this.state.attachments.map(x => {
      return (
        <AttachmentThumbnail
          key={x.key}
          id={x.key}
          url={x.url}
          preview={x.url}
          type={x.mime_type}
          filename=""
          onClick={() => this.onTogglePreview(x.url, x.mime_type)}
          showDelete={true}
          onDelete={() => this.onDeleteAttachment(x.key)}
        />
      )
    })

    return (
      <React.Fragment>
        {attachments}
        <a
          key="add"
          href="#"
          style={{ width: 50, height: 50 }}
          className="bg-black-20 white flex justify-center items-center link"
          onClick={this.onUppyOpen}
        >
          <i className="material-icons white f3">add</i>
        </a>
      </React.Fragment>
    )
  }

  renderReportedAt() {
    if (this.state.id.length > 0) {
      return (
        <span className="f6 grey flex f6 pt2 fw4">
          {formatDate(this.state.created_at)},{' '}
          {formatTime(this.state.created_at)}
        </span>
      )
    } else {
      return <span className="f6 green flex f6 green pt2 fw6">Today</span>
    }
  }

  handleChange = (newValue, actionMeta) => {
    this.setState({ tags: newValue })
  }

  render() {
    const {
      severity,
      task_id,
      location_id,
      assigned_to_id,
      description,
      tags
    } = this.state
    const task = task_id
      ? this.state.tasks.find(x => x.value === task_id)
      : null
    const location = location_id
      ? this.state.locations.find(x => x.id === location_id)
      : null
    const severityOption = severity
      ? severityOptions.find(x => x.value === severity)
      : null

    return (
      <React.Fragment>
        {this.renderTitle()}

        <div className="ph3 mt3 mb3 flex">
          <div className="w-100">
            <TextInput
              label="Title"
              fieldname="title"
              value={this.state.title}
              onChange={this.onChangeGeneric}
            />
          </div>
        </div>

        <div className="ph3 mb3 flex">
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
            <span className="f6 green flex f6 green pt2 fw6 ttc">
              {this.state.status || 'Open'}
            </span>
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Reported at</label>
            {this.renderReportedAt()}
          </div>
        </div>

        <div className="ph3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Tags</label>
            <CreatableSelect
              isMulti
              onChange={this.handleChange}
              styles={reactSelectStyle}
              value={tags}
            />
          </div>
        </div>

        <div className="ph3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Task</label>
            <Select
              isClearable
              isSearchable
              options={this.state.tasks}
              onChange={this.onTaskChanged}
              value={task}
              styles={reactSelectStyle}
              components={{ Option: TaskOption }}
            />
          </div>
        </div>

        <div className="ph3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Location</label>
            <Select
              isSearchable
              isClearable
              options={this.state.locations}
              onChange={this.onLocationChanged}
              value={location}
              styles={reactSelectStyle}
              getOptionLabel={x => x.searchable}
              getOptionValue={x => x.id}
              components={{
                Option: LocationOption,
                SingleValue: LocationSingleValue
              }}
              filterOption={(option, input) => {
                const words = input.toLowerCase().split(/\s/)
                return words.every(
                  x => option.data.searchable.toLowerCase().indexOf(x) >= 0
                )
              }}
            />
          </div>
        </div>

        <div className="ph3 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Assign to</label>
            <UserPicker
              onChange={this.onAssignedChanged}
              users={this.state.users}
              userId={assigned_to_id}
            />
          </div>
        </div>

        <div className="ph3 mb3 flex">
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

        <div className="ph3 mb1 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Attachments</label>
          </div>
        </div>
        <div className="ph3 mb3 flex">
          <div className="w-100 flex flex-wrap">{this.renderAttachments()}</div>
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
          uppy={this.uppy}
          closeModalOnClickOutside
          open={this.state.uppyOpen}
          onRequestClose={this.onUppyClose}
          proudlyDisplayPoweredByUppy={false}
          plugins={['Webcam', 'Dropbox', 'AwsS3']}
        />
        <AttachmentPopup
          open={this.state.previewOpen}
          key={this.state.previewUrl}
          url={this.state.previewUrl}
          type={this.state.previewType}
          onClose={this.onTogglePreview}
        />
      </React.Fragment>
    )
  }
}

export default IssueForm
