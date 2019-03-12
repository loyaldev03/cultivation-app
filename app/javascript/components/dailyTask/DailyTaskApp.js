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
import IssueSidebar from '../issues/IssueSidebar'

// import AssignMaterialForm from '../cultivation/tasks_setup/components/MaterialForm'
import AddMaterialForm from './components/AddMaterialForm'

@observer
class DailyTaskApp extends React.Component {
  componentDidMount() {
    loadDailyTasks()
    materialUsedStore.loadNutrientsCatalogue(this.props.nutrient_ids)
    dailyTaskSidebarStore.facilityId = this.props.facility_id
  }

  renderSlidePanel() {
    const { showMaterialUsed, showNotes, showIssues } = dailyTaskSidebarStore

    return (
      <React.Fragment>
        <SlidePanel
          width="600px"
          show={showMaterialUsed.get()}
          renderBody={props => <AddMaterialForm />}
        />
        <SlidePanel
          width="500px"
          show={showIssues.get()}
          renderBody={props => (
            <IssueSidebar
              // batch_id={this.props.batch.id}
              // facility_id={this.props.batch.facility_id}
              // mode={this.state.mode}
              current_user_first_name={this.props.current_user_first_name}
              current_user_last_name={this.props.current_user_last_name}
              current_user_photo={this.props.current_user_photo}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={showNotes.get()}
          renderBody={props => <NoteEditor />}
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
          />
        ))}
        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default DailyTaskApp
