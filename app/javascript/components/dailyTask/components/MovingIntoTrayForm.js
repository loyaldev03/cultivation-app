import React, { forwardRef, useState } from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import {
  ImgBarcode,
  ProgressBar,
  InputBarcode,
  SlidePanelHeader
} from '../../utils'
import SidebarStore from '../stores/SidebarStore'
import MovingStore from '../stores/MovingStore'
import PlantTagList from './PlantTagList'
import dailyTasksStore from '../stores/DailyTasksStore'
@observer
class MovingIntoTrayForm extends React.Component {
  componentDidUpdate(prevProps) {
    const { batchId, taskId, phase, indelible, show } = this.props
    if (batchId && taskId !== prevProps.taskId && show) {
      MovingStore.fetchMovingData(batchId, phase, indelible)
    }
  }

  parentInputRef = []

  onDoneMoveNext = rowIndex => {
    if (this.parentInputRef[rowIndex + 1]) {
      this.parentInputRef[rowIndex + 1].click()
    }
  }

  render() {
    const { batchId, taskId, phase, indelible, show = true } = this.props
    if (!show) return null
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title="Moving plants to trays"
        />
        <div className="flex flex-column flex-auto">
          <div className="flex flex-column grey relative">
            <div className="flex f6 pa2 fw7 bg-light-gray">
              <span className="ph2 flex-auto ml3">Tray ID</span>
              <span className="ph2 w-10 tc">Capacity</span>
              <span className="ph2 w3 tc">UID</span>
            </div>
            {MovingStore.isDataLoaded &&
              MovingStore.selectedLocations.map((m, i) => {
                const movement = MovingStore.getPlantMovements(
                  m.destination_code
                )
                return (
                  <ExpandableRow
                    key={m.destination_id}
                    ref={row => (this.parentInputRef[i] = row)}
                    {...m}
                    indelible={indelible}
                    rowIndex={i}
                    batchId={batchId}
                    taskId={taskId}
                    phase={phase}
                    scannedPlants={movement}
                    onDoneMoveNext={this.onDoneMoveNext}
                  />
                )
              })}
            <div
              className="ph4 pb5 f4 fw6 grey absolute flex left-0"
              style={{ bottom: '-6em' }}
            >
              <span className="pr2">Total Plants:</span>
              <span className="fw7">
                {MovingStore.totalPlants}/{MovingStore.totalCapacity}
              </span>
              {MovingStore.totalPlants === MovingStore.totalCapacity && (
                <i className="material-icons ph2 green">check_circle</i>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const ExpandableRow = forwardRef(
  (
    {
      rowIndex,
      batchId,
      taskId,
      phase,
      capacity,
      onDoneMoveNext,
      destination_id,
      destination_code,
      indelible,
      scannedPlants = []
    },
    ref
  ) => {
    let parentInput, childInput
    const [expand, setExpand] = useState(false)
    const [errors, setErrors] = useState({})
    const validateParent = () => {
      const newErrors = {}
      if (isEmpty(parentInput.value)) {
        newErrors['parentInput'] = 'Please enter Tray ID'
      } else if (parentInput.value !== destination_code) {
        newErrors['parentInput'] = 'Tray ID does not match'
      }
      setErrors(newErrors)
      return newErrors
    }
    const validateChild = () => {
      const newErrors = {}
      if (isEmpty(parentInput.value)) {
        newErrors['parentInput'] = 'Please enter Tray ID'
      }
      if (isEmpty(childInput.value)) {
        newErrors['childInput'] = 'Please enter Plant ID'
      } else if (scannedPlants.includes(childInput.value)) {
        newErrors['childInput'] = 'Plant ID was already processed'
      }
      setErrors(newErrors)
      return newErrors
    }
    const disableInputs = scannedPlants.length >= capacity
    const onScanParent = e => {
      if (e.key === 'Enter' && isEmpty(validateParent())) {
        childInput.focus()
      }
    }
    const onScanChild = async e => {
      if (e.key === 'Enter' && isEmpty(validateChild())) {
        const newPlants = [...scannedPlants, childInput.value]
        childInput.select()
        await MovingStore.updateMovings({
          batch_id: batchId,
          task_id: taskId,
          phase: phase,
          activity: indelible,
          destination_id: destination_id,
          destination_code: destination_code,
          destination_type: 'Tray',
          plants: newPlants
        })
        dailyTasksStore.updateTaskWorkIndelibleDone(
          batchId,
          taskId,
          MovingStore.taskCompleted
        )
      }
    }
    const onDeleteScan = async plant_code => {
      await MovingStore.deleteClippings({
        batch_id: batchId,
        task_id: taskId
        // mother_plant_id: plant_id,
        // mother_plant_code: plant_code,
        // clipping_code
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
          <span className="ph2 flex-auto">{destination_code}</span>
          <ProgressBar
            className="w-10 mt1"
            percent={(scannedPlants.length / capacity) * 100}
          />
          <span className="ph2 w-10 tc">
            {scannedPlants.length}/{capacity}
          </span>
          <span className="ph2 w3 flex justify-center items-center">
            {disableInputs ? (
              'DONE'
            ) : (
              <img src={ImgBarcode} alt="Scan barcode" />
            )}
          </span>
        </div>
        {expand && (
          <div className="flex ph3">
            <div className="pa3 w-100">
              <div className="pb4 pt2">
                <label className="db pb1">Scan tray: </label>
                <InputBarcode
                  ref={input => (parentInput = input)}
                  readOnly={disableInputs}
                  autoFocus={true}
                  onBarcodeScan={(q)=>console.log(q)}
                  onKeyPress={onScanParent}
                  error={errors['parentInput']}
                />
              </div>
              <div className="pb4">
                <label className="db pb1">Scan each plant: </label>
                <div className="">
                  <InputBarcode
                    ref={input => (childInput = input)}
                    readOnly={disableInputs}
                    onKeyPress={onScanChild}
                    error={errors['childInput']}
                  />
                  <input
                    type="button"
                    className="btn btn--primary btn--small fr"
                    disabled={!disableInputs}
                    onClick={onDone}
                    value="DONE"
                  />
                </div>
              </div>
              <div className="pv3">
                <label className="db pb1">Scanned Plants</label>
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

export default MovingIntoTrayForm
