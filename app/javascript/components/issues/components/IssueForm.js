import 'babel-polyfill'

import React from 'react'
import Select, { components } from 'react-select'
import Uppy from '@uppy/core'
import DashboardModal from '@uppy/react/lib/DashboardModal'
import Webcam from '@uppy/webcam'
import Dropbox from '@uppy/dropbox'
import AwsS3 from '@uppy/aws-s3'
import '@uppy/core/dist/style.css'
import '@uppy/dashboard/dist/style.css'
import '@uppy/webcam/dist/style.css'

import { TextInput } from '../../utils/FormHelpers'
import reactSelectStyle from '../../utils/reactSelectStyle'
import Avatar from '../../utils/Avatar'
import UserPicker from '../../utils/UserPicker'
import { formatDate, formatTime } from '../../utils/DateHelper'

import saveIssue from '../actions/saveIssue'
import getIssue from '../actions/getIssue'
import loadTasks from '../actions/loadTasks'
import loadUsers from '../actions/loadUsers'
import loadLocations from '../actions/loadLocations'

import TaskOption from './TaskOption'
import LocationOption from './LocationOption'
import LocationSingleValue from './LocationSingleValue'
import AttachmentPreview from './AttachmentPreview'

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
    this.setupUppy()
    this.descriptionInput = React.createRef()
  }

  setupUppy() {
    this.uppy = Uppy({
      meta: { type: 'avatar' },
      restrictions: { maxNumberOfFiles: 1 },
      autoProceed: true
    })

    this.uppy.use(Webcam)
    this.uppy.use(Dropbox, {
      serverUrl: location.protocol + '//' + location.host
    })

    this.uppy.use(AwsS3, {
      serverUrl: location.protocol + '//' + location.host
    })

    this.uppy.on('complete', result => {
      // console.log(result)

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
    })
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
    const { data } = await getIssue(this.props.issueId)
    const attr = data.data.attributes
    let locations = []

    if (attr.task) {
      locations = await loadLocations(this.props.batchId, attr.task.id)
    }

    this.setState({
      ...this.resetState(),
      id: this.props.issueId,
      title: attr.title,
      description: attr.description,
      severity: attr.severity,
      task_id: attr.task ? attr.task.id : '',
      locations,
      location_id: attr.location_id,
      location_type: attr.location_type,
      assigned_to_id: attr.assigned_to ? attr.assigned_to.id : '',
      status: attr.status,
      created_at: attr.created_at,
      reported_by: attr.reported_by,
      issue_no: attr.issue_no,
      attachments: attr.attachments
    })
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
      previewOpen: false,
      previewUrl: '',
      previewType: '',
      uppyOpen: false,
      attachments: [],
      delete_attachments: [],
      errors: {}
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

    return {
      title,
      description,
      severity,
      task_id,
      location_id,
      location_type,
      assigned_to_id,
      attachments,
      delete_attachments,
      cultivation_batch_id: this.props.batchId,
      id: this.props.issueId,
      isValid
    }
  }

  onTogglePreview = (url='', type = '') => {
    this.setState({ 
      previewOpen: !this.state.previewOpen,
      previewUrl: url,
      previewType: type
    })
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

  renderAttachments() {
    // console.log(this.state.attachments)
    const attachments = this.state.attachments.map(x => {
      if (x.mime_type.startsWith('video/')) {
        return (
          <div
            src="/"
            key={x.key}
            style={{ width: 50, height: 50 }}
            mime_type={x.mime_type}
            className="white mr1 relative hover-photo"
          >
            <div className="gray overflow-hidden   f7" style={{
              width: 50,
              height: 50 }}>
              VID - {x.filename}
            </div>
            <div 
              className="zoom-btn" 
              style={{ width: 50, height: 50 }} 
              onClick={() => this.onTogglePreview(x.url, x.mime_type)}>
              <i className="material-icons absolute">search</i>
            </div>
            <p
              style={{ width: 50, bottom: -10, fontSize: '12px' }}
              className="tc mt1 mb0 delete-btn"
            >
              <a
                href="#"
                className="link gray"
                onClick={() => this.onDeleteAttachment(x.key)}
              >
                Delete
              </a>
            </p>
          </div>
        )
      }
      return (
        <div
          src="/"
          key={x.key}
          mime_type={x.mime_type}
          style={{ width: 50, height: 70 }}
          className="mr1 overflow-hidden relative hover-photo"
        >
          <div
            style={{
              width: 50,
              height: 50,
              background: `url(${x.url}) no-repeat center center`,
              backgroundSize: 'cover'
            }}
          />
          <div 
            className="zoom-btn" 
            style={{ width: 50, height: 50 }} 
            onClick={() => this.onTogglePreview(x.url, x.mime_type)}>
            <i className="material-icons absolute">search</i>
          </div>
          <p
            style={{ width: 50, bottom: -10, fontSize: '12px' }}
            className="tc mt1 mb0 delete-btn"
          >
            <a
              href="#"
              className="link gray"
              onClick={() => this.onDeleteAttachment(x.key)}
            >
              Delete
            </a>
          </p>
        </div>
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
          <i className="material-icons white f3">attach_file</i>
        </a>
      </React.Fragment>
    )
  }

  renderReportedAt() {
    if (this.state.id.length > 0) {
      return (
        <span className="f6 grey flex f6 pt2 fw4">
          {formatDate(this.state.created_at)}, {formatTime(this.state.created_at)}
        </span>
      )
    } else {
      return (
        <span className="f6 green flex f6 green pt2 fw6">
          Today
        </span>
      )
    }
  }

  

  render() {
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
            <span className="f6 green flex f6 green pt2 fw6 ttc">
              {this.state.status || 'Open'}
            </span>
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Reported at</label>
            {this.renderReportedAt()}
          </div>
        </div>

        <div className="ph4 mb3 flex">
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

        <div className="ph4 mb3 flex">
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

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Assign to</label>
            <UserPicker
              onChange={this.onAssignedChanged}
              users={this.state.users}
              userId={assigned_to_id}
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

        <div className="ph4 mb1 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Attachments</label>
          </div>
        </div>
        <div className="ph4 mb3 flex">
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
          allowMultipleUploads={true}
          onRequestClose={this.onUppyClose}
          proudlyDisplayPoweredByUppy={false}
          plugins={['Webcam', 'Dropbox', 'AwsS3']}
        />
        <AttachmentPreview 
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
