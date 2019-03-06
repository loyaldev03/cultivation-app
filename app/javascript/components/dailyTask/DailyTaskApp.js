import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanel, formatDate3 } from '../utils/'
import BatchedDailyTasks from './components/BatchedDailyTasks'
import loadDailyTasks from './actions/loadDailyTasks'
import dailyTasksStore from './stores/DailyTasksStore'
import NoteEditor from './components/NoteEditor'
import dailyTaskSidebarStore from './stores/SidebarStore'
import materialUsedStore from './stores/MaterialUsedStore'

@observer
class DailyTaskApp extends React.Component {
  state = {
    showAddIssue: false,
    showAddMaterial: false,
    currentTaskId: '',
    currentNoteId: ''
  }

  componentDidMount() {
    loadDailyTasks()
    materialUsedStore.loadNutrientsCatalogue(this.props.nutrient_ids)
  }

  onToggleAddIssue = (batchId = null, taskId = null) => {
    this.setState({
      showAddIssue: !this.state.showAddIssue,
      currentTaskId: taskId
    })
  }

  // onToggleAddNotes = (batchId = null, taskId, noteId = '', body = '') => {
  //   console.log({batchId, taskId, noteId, body})
  //   if (taskId) {
  //     this.setState({
  //       showAddNotes: true,
  //       currentTaskId: taskId,
  //       currentNoteId: noteId
  //     })
  //     this.noteEditor.setBody(body)
  //   } else {
  //     this.setState({
  //       showAddNotes: false,
  //       currentTaskId: '',
  //       currentNoteId: ''
  //     })
  //     this.noteEditor.setBody('')
  //   }
  // }

  renderSlidePanel() {
    const { showMaterialUsed, showNotes } = dailyTaskSidebarStore

    const {
      currentTaskId,
      currentNoteId,
      showAddIssue,
    } = this.state

    return (
      <React.Fragment>
        <SlidePanel
          width="600px"
          show={showMaterialUsed}
          renderBody={props => (
            <div>
              <h3>Add material here...</h3>
              <a
                href="#"
                onClick={event => {
                  dailyTaskSidebarStore.closeMaterialUsed()
                  event.preventDefault()
                }}
              >
                Close
              </a>
              <div>Task ID: {dailyTaskSidebarStore.taskId}</div>
              <div>Batch ID: {dailyTaskSidebarStore.batchId}</div>
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
          show={showNotes.get()}
          renderBody={props => (
            <NoteEditor/>
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
        {dailyTasksStore.batches.map(batch => (
          <BatchedDailyTasks
            key={batch.id}
            batchId={batch.id}
            batchNo={batch.batch_no}
            batchName={batch.name}
            tasks={batch.tasks}
            onToggleAddIssue={this.onToggleAddIssue}
          />
        ))}

        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default DailyTaskApp
