import React from 'react'
import Select from 'react-select'
import reactSelectStyle from '../../utils/reactSelectStyle'
import { TextInput, FieldError } from '../../utils/FormHelpers'
import Avatar from '../../utils/Avatar'

class ResolveIssueForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      reason: null,
      otherReason: '',
      notes: '',
      errors: {}
    }
    this.notesTextArea = React.createRef()
  }
  getValues() {
    let reason = this.state.otherReason

    if (reason.length == 0) {
      reason = this.state.reason ? this.state.reason.value : ''
    }

    return {
      reason: reason,
      notes: this.state.notes
    }
  }

  get showOthers() {
    const reason = this.state.reason ? this.state.reason.value : ''
    return reason === 'Other'
  }

  onReasonChanged = reason => {
    this.setState({ reason })
  }

  onNotesChanged = event => {
    this.setState({ notes: event.target.value })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSave = event => {
    this.props.onSubmit(this.getValues())
    event.preventDefault()
  }

  onCancel = event => {
    this.props.onSubmit({ cancel: true })
    event.preventDefault()
  }

  render() {
    let options = ['Insufficient materials ', 'Insufficient resources', 'Other']
    if (this.props.issueType == 'daily_task') {
      options = [
        'Mold',
        'Overwater',
        'Light burn',
        'Nutrient deficiency',
        'Other'
      ]
    }
    return (
      <div className="flex ph3 mb3">
        <div>
          <Avatar
            firstName={this.props.firstName}
            lastName={this.props.lastName}
            size={25}
            photoUrl={this.props.photoUrl}
          />
        </div>

        <div className="flex flex-column flex-auto ph3 ml2 bg-black-05 pt3 br2">
          <div className="mb3">
            <label className="f6 fw6 db mb1 gray ttc">Issue Reason</label>
            <Select
              options={options.map(x => ({ value: x, label: x }))}
              styles={reactSelectStyle}
              onChange={this.onReasonChanged}
              value={this.state.reason}
            />
            <FieldError errors={this.state.errors} field="reason" />
          </div>
          { this.showOthers && (
            <div className="mb3">
              <TextInput 
                value={this.state.otherReason}
                onChange={this.onChangeGeneric}
                placeholder="Please specify"
                fieldname="otherReason"
                errors={this.state.errors} 
                />
            </div>
          )}
          <div className=" mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Notes</label>
              <textarea
                rows="3"
                ref={this.notesTextArea}
                value={this.state.notes}
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                onChange={this.onNotesChanged}
              />
              <FieldError errors={this.state.errors} field="notes" />
            </div>
          </div>
          <div className="mt3 mb3 flex justify-between">
            <a
              href="#"
              onClick={this.onSave}
              className="btn btn--primary f6"
            >
              Submit
            </a>
            <a
              href="#"
              onClick={this.onCancel}
              className="link orange f6"
            >
              Cancel
            </a>
          </div>
        </div>
      </div>
    )
  }
}

export default ResolveIssueForm
