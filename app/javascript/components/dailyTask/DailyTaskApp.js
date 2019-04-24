import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'

import dailyTaskSidebarAdaptor from './dailyTaskSidebarAdaptor'
import BatchedDailyTasks from './components/BatchedDailyTasks'
import NoteEditor from './components/NoteEditor'
import AddMaterialForm from './components/AddMaterialForm'
import ClipPotTagForm from './components/ClipPotTagForm'
import MovingIntoTrayForm from './components/MovingIntoTrayForm'
import HarvestBatchWeightForm from './components/HarvestBatchWeightForm'
import WeightForm from './components/WeightForm'

import loadDailyTasks from './actions/loadDailyTasks'
import DailyTasksStore from './stores/DailyTasksStore'
import MaterialUsedStore from './stores/MaterialUsedStore'
import SidebarStore from './stores/SidebarStore'
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
    // SidebarStore.openSidebar(
    //   'clip_pot_tag',
    //   '5c9354718c24bdc68af413bd',
    //   '5c9354728c24bdc68af413cf'
    // )
    // SidebarStore.openSidebar(
    //   'moving_to_tray',
    //   '5c9354718c24bdc68af413bd',
    //   '5c9354728c24bdc68af413d8',
    //   'clone',
    // )
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
      taskId,
      taskPhase
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
          renderBody={props => (
            <ClipPotTagForm
              scanditLicense={this.props.scanditLicense}
              show={sidebarName === 'clip_pot_tag'}
              batchId={batchId}
              taskId={taskId}
              phase={taskPhase}
              indelible={sidebarName}
            />
          )}
        />
        <SlidePanel
          width="600px"
          show={
            sidebarName === 'moving_to_tray' ||
            sidebarName === 'moving_to_next_phase'
          }
          renderBody={props => (
            <MovingIntoTrayForm
              show={
                sidebarName === 'moving_to_tray' ||
                sidebarName === 'moving_to_next_phase'
              }
              batchId={batchId}
              taskId={taskId}
              phase={taskPhase}
              indelible={sidebarName}
            />
          )}
        />
        <SlidePanel
          width="530px"
          show={sidebarName === 'measure_harvest_weight'}
          renderBody={props => (
            <HarvestBatchWeightForm
              scanditLicense={this.props.scanditLicense}
              batchId={batchId}
              show={sidebarName === 'measure_harvest_weight'}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'measure_waste_weight'}
          renderBody={props => (
            <WeightForm
              batchId={batchId}
              sidebarName={sidebarName}
              show={sidebarName === 'measure_waste_weight'}
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
