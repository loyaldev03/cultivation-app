import React, { useState, forwardRef } from 'react'
import isEmpty from 'lodash.isempty'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import ClippingStore from '../stores/ClippingStore'
import { InputBarcode, SlidePanelHeader } from '../../utils'

@observer
class ClipPotTagForm extends React.Component {
  componentDidUpdate(prevProps) {
    const { batchId, taskId, indelible } = this.props
    if (batchId && taskId !== prevProps.taskId) {
      ClippingStore.fetchClippingData(batchId)
    }
  }

  plantRefs = []

  onDoneMoveNext = rowIndex => {
    if (this.plantRefs[rowIndex + 1]) {
      this.plantRefs[rowIndex + 1].click()
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
            <div className="flex justify-end items-center pt3">
              <i className="material-icons orange pointer pa1 mh2">
                error_outline
              </i>
              <a href="#0" className="btn btn--secondary btn--small">
                Add Issue
              </a>
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
            {ClippingStore.motherPlants.map((m, i) => (
              <MotherPlantRow
                key={m.plant_id}
                ref={row => (this.plantRefs[i] = row)}
                {...m}
                rowIndex={i}
                batchId={batchId}
                taskId={taskId}
                scanditLicense={scanditLicense}
                onDoneMoveNext={this.onDoneMoveNext}
              />
            ))}
            <div
              className="ph4 pb5 f4 fw6 grey absolute left-0"
              style={{ bottom: '-6em' }}
            >
              <span className="pr2">Total Clippings:</span>
              <span className="fw7">15/25</span>
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
    const [plants, setPlants] = useState(scannedPlants)
    const onScanMother = e => {
      if (e.key === 'Enter') {
        clippingInput.focus()
      }
    }
    const onScanClipping = async e => {
      if (
        e.key === 'Enter' &&
        clippingInput.value &&
        !plants.includes(clippingInput.value)
      ) {
        const newPlants = [...plants, clippingInput.value]
        setPlants(newPlants)
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
    const onDeleteScan = plant_code => {
      setPlants(plants.filter(t => t !== plant_code))
      ClippingStore.updateClippings(clippingInput.value, newPlants)
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
            {plants.length}/{quantity}
          </span>
          <span className="ph2 w3 tc">
            {plants.length >= quantity ? 'DONE' : 'SCAN'}
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
                />
              </div>
              <div className="pb4">
                <label className="db pb1">Scan each clipping: </label>
                <div className="flex justify-between">
                  <InputBarcode
                    scanditLicense={scanditLicense}
                    ref={input => (clippingInput = input)}
                    onKeyPress={onScanClipping}
                  />
                  <a
                    href="#0"
                    className="btn btn--primary btn--small"
                    onClick={onDone}
                  >
                    DONE
                  </a>
                </div>
              </div>
              <div className="pv3">
                <label className="db pb1">Clippings Scanned</label>
                <PlantTagList plantTags={plants} onDelete={onDeleteScan} />
              </div>
            </div>
          </div>
        )}
      </React.Fragment>
    )
  }
)

const PlantTagList = ({ onDelete, plantTags = [] }) => {
  if (isEmpty(plantTags)) {
    return <p className="mv1 i light-grey">Nothing yet.</p>
  }
  return (
    <ol className="pl3 mv1">
      {plantTags.map(tag => (
        <li key={tag} className="ph2 pv1 hide-child">
          <span className="flex items-center">
            {tag}
            <i
              className="ml2 material-icons md-16 child pointer"
              onClick={() => onDelete(tag)}
            >
              delete_outline
            </i>
          </span>
        </li>
      ))}
    </ol>
  )
}

export default ClipPotTagForm
