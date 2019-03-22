import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanel, formatDate3 } from '../utils/'

import BatchedDailyTasks from './components/BatchedDailyTasks'
import NoteEditor from './components/NoteEditor'
import AddMaterialForm from './components/AddMaterialForm'

import loadDailyTasks from './actions/loadDailyTasks'

import dailyTasksStore from './stores/DailyTasksStore'
import dailyTaskSidebarStore from './stores/SidebarStore'
import materialUsedStore from './stores/MaterialUsedStore'

import dailyTaskSidebarAdaptor from './dailyTaskSidebarAdaptor'
import IssueSidebar from '../issues/IssueSidebar2'
import DailyTaskStore from './stores/DailyTasksStore'
import NutrientEntryForm from '../utils/NutrientEntryForm'
import { SlidePanelHeader, SlidePanelFooter } from '../utils'


@observer
class DailyTaskApp extends React.Component {
  constructor(props) {
    super(props)
    materialUsedStore.loadNutrientsCatalogue(this.props.nutrient_ids)
    dailyTaskSidebarStore.facilityId = this.props.facility_id
    loadDailyTasks()
  }
  onUpdateNutrients = nutrients => {
    const {batchId, taskId } = dailyTaskSidebarStore
    DailyTaskStore.updateNutrients(
      batchId, 
      taskId,
      nutrients
    )
  }
  renderSlidePanel() {
    const { showMaterialUsed, showNotes, showIssues, showAddNutrients, batchId, taskId } = dailyTaskSidebarStore
    const IssueSideBarWithStore = dailyTaskSidebarAdaptor(
      IssueSidebar,
      this.props
    )
    return (
      <React.Fragment>
        <SlidePanel
          width="500px"
          show={showMaterialUsed}
          renderBody={props => <AddMaterialForm />}
        />
        <SlidePanel
          width="500px"
          show={showIssues}
          renderBody={props => <IssueSideBarWithStore />}
        />
        <SlidePanel
          width="500px"
          show={showNotes}
          renderBody={props => <NoteEditor />}
        />
        <SlidePanel
          width="500px"
          show={showAddNutrients}
          renderBody={props => 
            { if(showAddNutrients){
              return <div className="flex flex-column h-100">
              <SlidePanelHeader onClose={()=>dailyTaskSidebarStore.closeIssues()} title={'Add Nutrients:'} />
              <div className="flex flex-column flex-auto justify-between">
              <NutrientEntryForm
                className="ma2 w-100"
                fields={DailyTaskStore.getNutrientsByTask(batchId, taskId)}
                fieldType="checkboxes"
                onUpdateNutrients={this.onUpdateNutrients}
              />
              
              <SlidePanelFooter onSave={()=>dailyTaskSidebarStore.closeIssues()} onCancel={()=>dailyTaskSidebarStore.closeIssues()} />
              </div>
            </div>
            }
              }
         }
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
