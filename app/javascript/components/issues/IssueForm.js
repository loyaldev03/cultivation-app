import React from 'react'
import Select from 'react-select'
import { TextInput } from '../utils/FormHelpers'
import reactSelectStyle from '../utils/reactSelectStyle'

const severityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'normal', label: 'Normal' },
  { value: 'high', label: 'High' }
]
const taskTypeOptions = [
  { value: 'planning', label: 'Planning' },
  { value: 'daily_task', label: 'Daily Task' }
]

class IssueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  resetState = () => {
    return {
      title: '',
      description: ''
    }
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSave = event => {}

  render() {
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
              fieldname="product_name"
              value={this.state.title}
              onChange={this.onChangeGeneric}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Severity</label>
            <Select options={severityOptions} styles={reactSelectStyle} />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Status</label>
            <span className="f6 green flex f6 green pt2 fw6">Open</span>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Issue type</label>
            <Select options={taskTypeOptions} styles={reactSelectStyle} />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Reported at</label>
            <span className="f6 green flex f6 green pt2 fw6">Today</span>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Task</label>
            <Select options={[]} styles={reactSelectStyle} />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Location</label>
            <Select options={[]} styles={reactSelectStyle} />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Assign to</label>
            <Select options={[]} styles={reactSelectStyle} />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Details</label>
            <textarea className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy" />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray ttc">Attachments</label>
            <a
              href="#"
              style={{ width: 50, height: 50 }}
              className="bg-black-20 white flex justify-center items-center link"
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
      </React.Fragment>
    )
  }
}

export default IssueForm
