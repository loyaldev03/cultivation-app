import React from 'react'
import MaterialUsedRow from './MaterialUsedRow'
import NoteList from './NoteList'
import DailyTaskStore from '../stores/DailyTasksStore'

const rightBorder = { borderRight: '1px solid #ccc' }

class ExpandedRow extends React.Component {
  onToggleAddIssue = event => {
    this.props.onToggleAddIssue(this.props.taskId)
    event.preventDefault()
  }

  onToggleAddMaterial = event => {
    this.props.onToggleAddMaterial(this.props.taskId)
    event.preventDefault()
  }

  onToggleAddNotes = event => {
    this.props.onToggleAddNotes(this.props.taskId)
    event.preventDefault()
  }

  onDeleteNote = noteId => {
    const result = confirm('Confirm delete this note?')
    if (result) {
      DailyTaskStore.deleteNote(this.props.taskId, noteId)
    }
  }

  onEditNote = (noteId, body) => {
    this.props.onToggleAddNotes(this.props.taskId, noteId, body)
  }

  render() {
    const { taskIndelible, notes } = this.props
    return (
      <React.Fragment>
        <div className="flex justify-between pv3 ph3">
          <div className="flex">TODO: Task Related form: {taskIndelible}</div>
          <div>
            <a
              href="#"
              className="btn btn--primary mr2"
              onClick={e => this.props.onClickStatus('done')}
            >
              Done
            </a>
            <a
              href="#"
              className="btn btn--secondary"
              onClick={e => this.props.onClickStatus('stuck')}
            >
              I'm stuck
            </a>
          </div>
        </div>
        <div className="flex ba b--black-20 ma2 br2 mb3">
          <div className="w-60 ph2 pt2 pb3" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Materials</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={this.onToggleAddIssue}
              >
                Add
              </a>
            </div>
            <MaterialUsedRow
              material="Bloodmeal Max Nutrient 360"
              expected="5"
              uom="lb"
              actual=""
              wasted=""
            />
            <MaterialUsedRow
              material="Quick Cup, Set of 5"
              expected="500"
              uom="ea"
              actual=""
              wasted=""
            />
            <MaterialUsedRow
              material="Std glove"
              expected="500"
              uom="ea"
              actual=""
              wasted=""
            />
          </div>

          <div className="w-30 ph2 pt2 pb3" style={rightBorder}>
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Issues</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={this.onToggleAddMaterial}
              >
                Add
              </a>
            </div>
          </div>

          <div className="w-30 ph2 pt2 pb3">
            <div className="flex items-center justify-between mb3">
              <span className="gray fw6 f6">Notes</span>
              <a
                href="#"
                className="btn btn--secondary f6"
                onClick={this.onToggleAddNotes}
              >
                Add
              </a>
            </div>
            <NoteList
              show={true}
              notes={notes}
              onEdit={this.onEditNote}
              onDelete={this.onDeleteNote}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ExpandedRow
