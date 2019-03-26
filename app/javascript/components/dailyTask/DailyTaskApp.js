import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import BatchedDailyTasks from './components/BatchedDailyTasks'
import NoteEditor from './components/NoteEditor'
import AddMaterialForm from './components/AddMaterialForm'
import ClipPotTagForm from './components/ClipPotTagForm'
import loadDailyTasks from './actions/loadDailyTasks'
import DailyTasksStore from './stores/DailyTasksStore'
import MaterialUsedStore from './stores/MaterialUsedStore'
import SidebarStore from './stores/SidebarStore'
import dailyTaskSidebarAdaptor from './dailyTaskSidebarAdaptor'
import IssueSidebar from '../issues/IssueSidebar2'
import NutrientEntryForm from '../utils/NutrientEntryForm'
import {
  formatDate3,
  SlidePanel,
  SlidePanelHeader,
  SlidePanelFooter
} from '../utils'

@observer
class DailyTaskApp extends React.Component {
  constructor(props) {
    super(props)
    MaterialUsedStore.loadNutrientsCatalogue(this.props.nutrient_ids)
    SidebarStore.facilityId = this.props.facility_id
    loadDailyTasks()
  }
  componentDidMount() {
    SidebarStore.openSidebar(
      'clip_pot_tag',
      '5c9354718c24bdc68af413bd',
      '5c9354728c24bdc68af413cf'
    )
  }
  onUpdateNutrients = nutrients => {
    const { batchId, taskId } = SidebarStore
    DailyTasksStore.updateNutrients(batchId, taskId, nutrients)
  }
  renderSlidePanel() {
    const {
      showMaterialUsed,
      showNotes,
      showIssues,
      sidebarName,
      batchId,
      taskId
    } = SidebarStore
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
          show={sidebarName === 'add_nutrient'}
          renderBody={props => {
            if (sidebarName === 'add_nutrient') {
              return (
                <div className="flex flex-column h-100">
                  <SlidePanelHeader
                    onClose={() => SidebarStore.closeSidebar()}
                    title={'Add Nutrients:'}
                  />
                  <div className="flex flex-column flex-auto justify-between">
                    <NutrientEntryForm
                      className="ph4 pv3 w-100"
                      fields={DailyTasksStore.getNutrientsByTask(
                        batchId,
                        taskId
                      )}
                      fieldType="checkboxes"
                      onUpdateNutrients={this.onUpdateNutrients}
                    />

                    <SlidePanelFooter
                      onSave={() => SidebarStore.closeSidebar()}
                      onCancel={() => SidebarStore.closeSidebar()}
                    />
                  </div>
                </div>
              )
            }
          }}
        />
        <SlidePanel
          width="600px"
          show={sidebarName === 'clip_pot_tag'}
          renderBody={props => {
            return batchId && taskId && sidebarName === 'clip_pot_tag' ? (
              <ClipPotTagForm batchId={batchId} taskId={taskId} />
            ) : null
          }}
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
        {DailyTasksStore.batches.map(batch => (
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
