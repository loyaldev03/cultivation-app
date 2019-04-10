import React, { useState, forwardRef } from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import ClippingStore from '../stores/ClippingStore'
import PlantTagList from './PlantTagList'
import { AdjustmentMessage, InputBarcode, SlidePanelHeader } from '../../utils'
import dailyTasksStore from '../stores/DailyTasksStore'

@observer
class ClipPotTagForm extends React.Component {
  componentDidUpdate(prevProps) {
    const { batchId, taskId, phase, indelible, show } = this.props
    if (batchId && taskId !== prevProps.taskId && show) {
      ClippingStore.fetchClippingData(batchId, phase, indelible)
    }
  }

  plantRefs = []

  onNewIssue = event => {
    SidebarStore.openIssues(
      null,
      'create',
      true,
      this.props.taskId,
      this.props.batchId
    )
  }

  onShowIssue = issue => {
    SidebarStore.openIssues(
      null,
      'details',
      true,
      this.props.taskId,
      this.props.batchId
    )
  }

  onDoneMoveNext = rowIndex => {
    if (this.plantRefs[rowIndex + 1]) {
      this.plantRefs[rowIndex + 1].click()
    }
    if (ClippingStore.taskCompleted) {
      dailyTasksStore.updateTaskWorkStatus()
    }
  }

  render() {
    const { batchId, taskId, scanditLicense, show = true } = this.props
    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <div>
          <div className="ph4 pv3">
            <h1 className="h6--font dark-grey ma0">
              Create plant ID after clipping
            </h1>
            <div className="flex justify-between items-center pt3">
              <AdjustmentMessage
                value={ClippingStore.totalClippings}
                total={ClippingStore.totalQuantity}
              />
              <div className="flex">
                <i
                  className="material-icons grey pointer pa1 mh2"
                  onClick={this.onShowIssue}
                >
                  error_outline
                </i>
                <a
                  href="#0"
                  className="btn btn--secondary btn--small"
                  onClick={this.onNewIssue}
                >
                  Add Issue
                </a>
              </div>
            </div>
          </div>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={() => SidebarStore.closeSidebar()}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <div className="flex flex-column flex-auto">
          <div className="flex flex-column grey relative">
            <div className="flex f6 pa2 fw7 bg-light-gray">
              <span className="ph2 w-30 ml3">Mother Plant ID</span>
              <span className="ph2 w-30">Location</span>
              <span className="ph2 w-20 tc"># of clippings</span>
              <span className="ph2 w3 tc">UID</span>
            </div>
            {ClippingStore.isDataLoaded &&
              ClippingStore.motherPlants.map((m, i) => {
                const movement = ClippingStore.getPlantMovements(m.plant_code)
                return (
                  <MotherPlantRow
                    key={m.plant_id}
                    ref={row => (this.plantRefs[i] = row)}
                    {...m}
                    rowIndex={i}
                    batchId={batchId}
                    taskId={taskId}
                    scanditLicense={scanditLicense}
                    scannedPlants={movement}
                    onDoneMoveNext={this.onDoneMoveNext}
                  />
                )
              })}
            <div
              className="ph4 pb5 f4 fw6 grey absolute flex left-0"
              style={{ bottom: '-6em' }}
            >
              <span className="pr2">Total Clippings:</span>
              <span className="fw7">
                {ClippingStore.totalClippings}/{ClippingStore.totalQuantity}
              </span>
              {ClippingStore.totalClippings === ClippingStore.totalQuantity && (
                <i className="material-icons ph2 green">check_circle</i>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const MotherPlantRow = forwardRef(
  (
    {
      onDoneMoveNext,
      rowIndex,
      batchId,
      taskId,
      plant_id,
      plant_code,
      plant_location,
      quantity,
      scanditLicense,
      scannedPlants = []
    },
    ref
  ) => {
    let motherInput, clippingInput
    const [expand, setExpand] = useState(false)
    const [errors, setErrors] = useState({})
    // TODO: Split into 2 like in MovingIntoTrayForm
    const validates = () => {
      const newErrors = {}
      if (isEmpty(motherInput.value)) {
        newErrors['motherInput'] = 'Please enter mother Plant ID'
      } else if (motherInput.value !== plant_code) {
        newErrors['motherInput'] = 'Mother Plant ID does not match'
      }
      if (motherInput.value && isEmpty(clippingInput.value)) {
        newErrors['clippingInput'] = 'Please enter Plant ID'
      } else if (scannedPlants.includes(clippingInput.value)) {
        newErrors['clippingInput'] = 'Plant ID was already processed'
      }
      setErrors(newErrors)
      return newErrors
    }
    const onScanMother = e => {
      if (e.key === 'Enter' && isEmpty(validates())) {
        clippingInput.focus()
      }
    }
    const onScanClipping = async e => {
      if (e.key === 'Enter' && clippingInput.value && isEmpty(validates())) {
        const newPlants = [...scannedPlants, clippingInput.value]
        clippingInput.select()
        await ClippingStore.updateClippings({
          batch_id: batchId,
          task_id: taskId,
          mother_plant_id: plant_id,
          mother_plant_code: plant_code,
          plants: newPlants
        })
      }
    }
    const onDeleteScan = async clipping_code => {
      await ClippingStore.deleteClippings({
        batch_id: batchId,
        task_id: taskId,
        mother_plant_id: plant_id,
        mother_plant_code: plant_code,
        clipping_code
      })
    }
    const onDone = e => {
      setExpand(false)
      onDoneMoveNext(rowIndex)
    }
    const onExpand = e => {
      setExpand(!expand)
    }
    return (
      <React.Fragment>
        <div
          ref={ref}
          className="flex items-center pv3 ph2 pointer"
          onClick={onExpand}
        >
          <i className="material-icons md-16">
            {expand ? 'keyboard_arrow_down' : 'keyboard_arrow_right'}
          </i>
          <span className="ph2 w-30">{plant_code}</span>
          <span className="ph2 w-30">{plant_location}</span>
          <span className="ph2 w-20 tc">
            {scannedPlants.length}/{quantity}
          </span>
          <span className="ph2 w3 tc">
            {scannedPlants.length >= quantity ? 'DONE' : 'SCAN'}
          </span>
        </div>
        {expand && (
          <div className="flex ph3">
            <div className="pa3 w-100">
              <div className="pb4 pt2">
                <label className="db pb1">Scan mother plant: </label>
                <InputBarcode
                  scanditLicense={scanditLicense}
                  autoFocus={true}
                  ref={input => (motherInput = input)}
                  onKeyPress={onScanMother}
                  error={errors['motherInput']}
                />
              </div>
              <div className="pb4">
                <label className="db pb1">Scan each clipping: </label>
                <div className="">
                  <InputBarcode
                    scanditLicense={scanditLicense}
                    ref={input => (clippingInput = input)}
                    onKeyPress={onScanClipping}
                    error={errors['clippingInput']}
                  />
                  <a
                    href="#0"
                    className="btn btn--primary btn--small fr"
                    onClick={onDone}
                  >
                    DONE
                  </a>
                </div>
              </div>
              <div className="pv3">
                <label className="db pb1">Clippings Scanned</label>
                <PlantTagList
                  plantTags={scannedPlants}
                  onDelete={onDeleteScan}
                />
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
)

export default ClipPotTagForm
