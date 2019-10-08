import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'

import dailyTaskSidebarAdaptor from './dailyTaskSidebarAdaptor'
import BatchedDailyTasks from './components/BatchedDailyTasks'
import NoteEditor from './components/NoteEditor'
import AddMaterialForm from './components/AddMaterialForm'
import ClipPotTagForm from './components/ClipPotTagForm'
import MovingIntoTrayForm from './components/MovingIntoTrayForm'
import HarvestBatchWeightForm from './components/HarvestBatchWeightForm'
import WeightForm from './components/WeightForm'
import CreatePackageForm from './components/CreatePackageForm'
import ConvertPackageForm from './components/ConvertPackageForm'
import ReceiveCannabisForm from './components/ReceiveCannabisForm'
import NutrientEditor from '../inventory/raw_materials/components/NutrientEditor'
import RawMaterialEditor from '../inventory/raw_materials/components/RawMaterialEditor'

import loadDailyTasks, { loadAllDailyTasks } from './actions/loadDailyTasks'
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
    loadAllDailyTasks()
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
      SidebarStore.taskId,
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
        <SlidePanel
          width="500px"
          show={sidebarName === 'create_package_plan'}
          renderBody={props => (
            <CreatePackageForm
              batchId={batchId}
              facilityId={this.props.facility_id}
              sidebarName={sidebarName}
              show={sidebarName === 'create_package_plan'}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'convert_product'}
          renderBody={props => (
            <ConvertPackageForm
              facilityId={this.props.facility_id}
              sidebarName={sidebarName}
              taskId={taskId}
              show={sidebarName === 'convert_product'}
            />
          )}
        />
        <SlidePanel
          width="700px"
          show={sidebarName === 'receive_inventory_cannabis'}
          renderBody={props => (
            <ReceiveCannabisForm
              // scanditLicense={this.props.scanditLicense}
              show={sidebarName === 'receive_inventory_cannabis'}
              batchId={batchId}
              taskId={taskId}
              phase={taskPhase}
              indelible={sidebarName}
              facilityId={this.props.facility_id}
              growth_stages={this.props.growth_stages}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'receive_inventory_nutrients'}
          renderBody={props => (
            <NutrientEditor
              order_uoms={this.props.order_uoms}
              uoms={this.props.uoms}
              catalogue_id={this.props.catalogue_id}
              catalogues={this.props.catalogues}
              facility_id={this.props.facility_id}
              // scanditLicense={this.props.scanditLicense}
              canUpdate={true}
              canCreate={true}
              sharedEditor={true}
              onClose={() => SidebarStore.closeSidebar()}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'receive_grow_medium'}
          renderBody={props => (
            <RawMaterialEditor
              order_uoms={this.props.order_uoms}
              raw_material_type="grow_medium"
              catalogues={this.props.grow_medium_catalogues}
              facility_id={this.props.facility_id}
              uoms={this.props.uoms}
              scanditLicense={this.props.scanditLicense}
              canUpdate={true}
              canCreate={true}
              sharedEditor={true}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'receive_grow_lights'}
          renderBody={props => (
            <RawMaterialEditor
              order_uoms={this.props.order_uoms}
              raw_material_type="grow_light"
              catalogues={this.props.grow_light_catalogues}
              facility_id={this.props.facility_id}
              uoms={this.props.uoms}
              scanditLicense={this.props.scanditLicense}
              canUpdate={true}
              canCreate={true}
              sharedEditor={true}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'receive_supplements'}
          renderBody={props => (
            <RawMaterialEditor
              order_uoms={this.props.order_uoms}
              raw_material_type="supplements"
              catalogues={this.props.supplement_catalogues}
              facility_id={this.props.facility_id}
              uoms={this.props.uoms}
              scanditLicense={this.props.scanditLicense}
              canUpdate={true}
              canCreate={true}
              sharedEditor={true}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={sidebarName === 'receive_others'}
          renderBody={props => (
            <RawMaterialEditor
              order_uoms={this.props.order_uoms}
              raw_material_type="others"
              catalogues={this.props.other_catalogues}
              facility_id={this.props.facility_id}
              uoms={this.props.uoms}
              scanditLicense={this.props.scanditLicense}
              canUpdate={true}
              canCreate={true}
              sharedEditor={true}
            />
          )}
        />
      </React.Fragment>
    )
  }

  onShowAllTasks = () => {
    DailyTasksStore.toggleShowAllTasks()
    loadAllDailyTasks(DailyTasksStore.isShowAllTasks)
  }

  render() {
    const { today } = this.props
    const otherTasks = toJS(DailyTasksStore.otherTasks)
    return (
      <React.Fragment>
        <div id="toast" className="toast animated toast--success" />
        <div className="flex items-center justify-end pv2">
          <label className="grey ph2 f6 pointer" htmlFor="show_all_tasks">
            Show all
          </label>
          <input
            className="toggle toggle-default"
            id="show_all_tasks"
            type="checkbox"
            value={DailyTasksStore.isShowAllTasks}
            onChange={this.onShowAllTasks}
          />
          <label className="toggle-button" htmlFor="show_all_tasks" />
        </div>
        {DailyTasksStore.batches.length == 0 &&
        DailyTasksStore.isShowAllTasks == false ? (
          <div className="ba b--black-20 br2 flex-auto bg-white pa3">
            <span className="gray fw6 f5 tc ml3 i">
              No task assigned to you.
            </span>
          </div>
        ) : (
          <React.Fragment>
            {DailyTasksStore.batches.map(batch => (
              <BatchedDailyTasks
                key={batch.id}
                batchId={batch.id}
                batchNo={batch.batch_no}
                batchName={batch.name}
                tasks={batch.tasks}
              />
            ))}
          </React.Fragment>
        )}

        {Object.keys(otherTasks).length > 0 && (
          <BatchedDailyTasks
            type="others"
            batchId="others"
            batchNo=""
            batchName={otherTasks.name}
            tasks={otherTasks.tasks}
          />
        )}
        {this.renderSlidePanel()}
      </React.Fragment>
    )
  }
}

export default DailyTaskApp
