import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanel, formatDate3 } from '../utils/'
import BatchedDailyTasks from './components/BatchedDailyTasks'
import loadDailyTasks from './actions/loadDailyTasks'
import editNote from './actions/editNote'
import dailyTasksStore from './stores/DailyTasksStore'
import NoteEditor from './components/NoteEditor'

@observer
class DailyTaskApp extends React.Component {
  state = {
    showAddIssue: false,
    showAddMaterial: false,
    showAddNotes: false,
    currentTaskId: '',
    currentNoteId: ''
  }

  componentDidMount() {
    loadDailyTasks()
  }

  onToggleAddIssue = (taskId = null) => {
    this.setState({
      showAddIssue: !this.state.showAddIssue,
      currentTaskId: taskId
    })
  }

  onToggleAddMaterial = (taskId = null) => {
    this.setState({
      showAddMaterial: !this.state.showAddMaterial,
      currentTaskId: taskId
    })
  }

  onToggleAddNotes = (taskId, noteId = '', body = '') => {
    // console.log({taskId, noteId, body})
    if (taskId) {
      this.setState({
        showAddNotes: true,
        currentTaskId: taskId,
        currentNoteId: noteId
      })
      this.noteEditor.setBody(body)
    } else {
      this.setState({
        showAddNotes: false,
        currentTaskId: '',
        currentNoteId: ''
      })
      this.noteEditor.setBody('')
    }
  }

  renderSlidePanel() {
    const {
      currentTaskId,
      currentNoteId,
      showAddMaterial,
      showAddIssue,
      showAddNotes
    } = this.state
    return (
      <React.Fragment>
        <SlidePanel
          width="600px"
          show={showAddMaterial}
          renderBody={props => (
            <div>
              <h3>Add material here...</h3>
              <a
                href="#"
                onClick={event => {
                  this.onToggleAddMaterial()
                  event.preventDefault()
                }}
              >
                Close
              </a>
            </div>
          )}
        />
        <SlidePanel
          width="600px"
          show={showAddIssue}
          renderBody={props => (
            <div>
              <h3>Add issue here...</h3>
              <a
                href="#"
                onClick={event => {
                  this.onToggleAddIssue()
                  event.preventDefault()
                }}
              >
                Close
              </a>
            </div>
          )}
        />
        <SlidePanel
          width="500px"
          show={showAddNotes}
          renderBody={props => (
            <NoteEditor
              ref={editor => (this.noteEditor = editor)}
              title={currentNoteId ? 'Update Note' : 'Add Note'}
              onClose={() => this.onToggleAddNotes('')}
              onSave={body => {
                editNote(currentTaskId, currentNoteId, body)
              }}
            />
          )}
        />
      </React.Fragment>
    )
  }

  render() {
    const { today } = this.props
    return (
      <React.Fragment>
        <div id="toast" className="toast animated toast--success" />
        <div className="flex items-end justify-start mb3">
          <h1 className="f3 ma0 pa0 black-90 fw6">Today</h1>
          <span className="f6 pv1 ph2 br2 ba b--black-20 black-60 bg-white ml2">
            {formatDate3(today)}
          </span>
        </div>
        {dailyTasksStore.bindable.map(batch => (
          <BatchedDailyTasks
            key={batch.id}
            batchId={batch.id}
            batchNo={batch.batch_no}
            batchName={batch.name}
            tasks={batch.tasks}
            onToggleAddIssue={this.onToggleAddIssue}
            onToggleAddMaterial={this.onToggleAddMaterial}
            onToggleAddNotes={this.onToggleAddNotes}
          />
        ))}

        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default DailyTaskApp
