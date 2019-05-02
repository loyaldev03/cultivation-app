import React from 'react'
import { observer } from 'mobx-react'
import BatchStore from '../../batches/BatchStore'
import TaskStore from '../stores/NewTaskStore'
import loadPlants from '../../../inventory/plant_setup/actions/loadPlants'
import {
  SlidePanelHeader,
  SlidePanelFooter,
  ProgressBar,
  ErrorBoundary,
  RoomIcon
} from '../../../utils'
import Sunburst from './Sunburst'
import TablePlantViewer from './TablePlantViewer'
import Tippy from '@tippy.js/react'

@observer
class ClippingPanel extends React.Component {
  state = {
    motherRoomList: [],
    roomChoice: null,
    roomData: [],
    locationSelected: null,
    codeSelected: null,
    motherPlantList: [],
    hasSection: false,
    isHasMotherPlant:true,
  }
  async componentDidMount() {
    await Promise.all([
      BatchStore.loadBatch(this.props.batchId),
      loadPlants('mother', this.props.facilityId)
    ])
    let roomData = await TaskStore.roomData(this.props.facilityId, 'mother')
    let motherRoomList = roomData.map(e => {
      return e.room_name
    })
    motherRoomList = [...new Set(motherRoomList)]
    let hasSection = roomData[0].section_code !== null
    let motherPlantList = await TaskStore.getPlantOnSelect(
      this.props.facilityId,
      this.props.strainId,
      BatchStore.batch.selected_location
    )
    let isHasMotherPlant = motherPlantList.length > 0;    
    let codeSelected = motherRoomList.map(x => {
      if (x.room_id === BatchStore.batch.selected_location) {
        return x.room_id
      }
      if (x.section_id === BatchStore.batch.selected_location) {
        return x.section_id
      }
      if (x.row_id === BatchStore.batch.selected_location) {
        return x.row_id
      }
      if (x.shelf_id === BatchStore.batch.selected_location) {
        return x.shelf_id
      }
      if (x.tray_id === BatchStore.batch.selected_location) {
        return x.tray_id
      }
    })
    codeSelected = codeSelected[0]

    let currentplant = BatchStore.batch.selected_plants.reduce(
      (a, b) => a + (Number(b['quantity']) || 0),
      0
    )
    this.setState({
      motherRoomList,
      roomChoice: motherRoomList[0],
      roomData,
      hasSection,
      codeSelected,
      isHasMotherPlant,
      locationSelected: BatchStore.batch.selected_location,
      currentplant,
      maxQuantity: BatchStore.batch.quantity,
      motherPlantList
    })
  }
  changeRoom = roomName => {
    this.setState({ roomChoice: roomName })
  }
  onCodeSelect = async element => {
    let { roomChoice, roomData } = this.state
    let motherPlantList = await TaskStore.getPlantOnSelect(
      this.props.facilityId,
      this.props.strainId,
      element.data.id
    )
    // console.log(motherPlantList)
    let isHasMotherPlant = motherPlantList.length > 0;
    let hasSection =
      roomData.filter(node => node.room_name === roomChoice)[0].section_code !==
      null
    this.setState({
      codeSelected: element.data.name,
      roomSelected: element.meta ? `in ${element.meta.room_name}` : '',
      motherPlantList,
      locationSelected: element.data.id,
      selectedId: element.data.id,
      isHasMotherPlant,
      hasSection
    })
  }
  onUpdateOnePlant = (id, e) => {
    this.state.motherPlantList.map(plant => {
      if (plant.plant_id === id) {
        plant.quantity = e.target.value
      }
      return plant
    })
    BatchStore.setOnePlant(id, e.target.value)
    let currentplant = BatchStore.batch.selected_plants.reduce(
      (a, b) => a + (Number(b['quantity']) || 0),
      0
    )
    this.setState({ motherPlantList: this.state.motherPlantList, currentplant })
  }
  onUpdatePlant = () => {
    BatchStore.setAllPlants(this.state.motherPlantList)
    let currentplant = BatchStore.batch.selected_plants.reduce(
      (a, b) => a + (Number(b['quantity']) || 0),
      0
    )
    console.log(currentplant,BatchStore.batch.selected_plants)
    if (currentplant === BatchStore.batch.quantity)
      BatchStore.updateBatchSelectedPlants(
        this.props.batchId,
        this.state.locationSelected
      )
  }
  render() {
    const { onClose, show } = this.props
    const {
      roomChoice,
      roomData,
      motherRoomList,
      locationSelected,
      codeSelected,
      roomSelected,
      motherPlantList,
      hasSection,
      isHasMotherPlant,
      currentplant,
      maxQuantity
    } = this.state

    if (!show) {
      return null
    }

    return (
      roomData.length > 0 && (
        <div>
          <SlidePanelHeader onClose={onClose} title={this.props.title} />
          <div className="flex justify-center tc mt3">
            {motherRoomList.map(card => (
              <div
                className={`flex flex-column f6 lh-copy ba br2 pa2 ml1 pointer ${
                  card === roomChoice ? 'orange b b--orange' : 'b--light-grey'
                }`}
                key={card}
                onClick={e => this.changeRoom(card)}
              >
                {card}
                <img src={RoomIcon} className="h2" />
              </div>
            ))}
          </div>
          <div className="ph4 pb4 pt3" />
          {/* <div className="ph4 pb4 pt3">
            <span className="orange">Sage</span> mother plants are located in
            the sections highlighted in orange. Select the area of the mother
            plants you’d like to clip
          </div> */}
          {roomData.length > 0 ? (
            <div className="w-100 tc">
              <ErrorBoundary>
                <Sunburst
                  data={roomData.filter(node => node.room_name === roomChoice)}
                  roomChoice={roomChoice}
                  locationSelected={locationSelected}
                  onCodeSelect={this.onCodeSelect}
                  width="300"
                  height="300"
                />
              </ErrorBoundary>
            </div>
          ) : null}
          
     
          { !isHasMotherPlant && <div className="orange tc mt4">
             There's no mother plant in this room or section.
            </div>}
          { motherPlantList.length>0 ?
          <div>
            {codeSelected && (
            <div className="orange tc mt4">
              You’ve selected all mother plants located in {codeSelected}{' '}
              {roomSelected}
            </div>
          )}
          <div className="pa3">
            <div className="flex justify-between mb1">
              <div>Total clones to create</div>
              <div>
                {currentplant}/{maxQuantity}
              </div>
            </div>
            {currentplant <= maxQuantity ? (
              <ProgressBar
                percent={(currentplant / maxQuantity) * 100}
                height={15}
              />
            ) : (
              <div className="dib bg-washed-red pa2 ba br2 b--washed-red grey w-4 tc">
                please remove{' '}
                <span className="b">{currentplant - maxQuantity}</span> plant
              </div>
            )}
          </div>

          <div className="pa3 h5 overflow-y-auto">
            <div className="mb1 b">You selected mother plants at:</div>
            <ErrorBoundary>
            <TableSection
              data={motherPlantList}
              onUpdateOnePlant={this.onUpdateOnePlant}
              codeSelected={codeSelected}
              hasSection={hasSection}
            />
            </ErrorBoundary>
          </div>
          </div>:<div className="tc pa5">
            <i className="material-icons md-17 orange">help</i>Tip: You can
            select the entire area, or you can select individual location of the
            mother plants. You can also select{' '}
            <span className="b">Apply All</span> if you want to have the same
            number of clippings per mother plant in the entire area selected.
          </div>
          }
          <SlidePanelFooter onSave={this.onUpdatePlant} onClose={onClose} />
        </div>
      )
    )
  }
}
export default ClippingPanel

class TableSection extends React.Component {
  state = {
    selectedPlant: [],
    plantList: [],
    codeSelected: null
  }
  componentDidMount() {
    const listSelected =
      BatchStore.batch.selected_plants.map(x => x.plant_id) || []
    let plantList = this.props.data
      .map(plant => {
        plant.quantity = 0
        if (listSelected.indexOf(plant.plant_id) >= 0) {
          plant.quantity =
            BatchStore.batch.selected_plants[
              listSelected.indexOf(plant.plant_id)
            ].quantity
        }
        return plant
      })
      .filter(a => a.quantity > 0)
    let getSection = plantList.map(x => {
      let { location_code } = x
      let name = location_code.split(/[..]/)
      if (name[1] === undefined) return name[0]
      else return name[1]
    })
    getSection = [...new Set(getSection)]
    getSection = getSection.map(x => {
      return {
        name: x,
        data: plantList.filter(plant => plant.location_code.indexOf(x) >= 0)
      }
    })
    this.setState({
      plantList: getSection
    })
  }
  componentDidUpdate(prevProps) {
    if (prevProps.codeSelected !== this.props.codeSelected) {
      const listSelected = BatchStore.batch.selected_plants.map(x => x.plant_id)
      let plantList = this.props.data
        .map(plant => {
          plant.quantity = 0
          if (listSelected.indexOf(plant.plant_id) >= 0) {
            plant.quantity =
              BatchStore.batch.selected_plants[
                listSelected.indexOf(plant.plant_id)
              ].quantity
          }
          return plant
        })
        .filter(a => a.quantity > 0)

      let getSection = plantList.map(x => {
        let { location_code } = x
        let name = location_code.split(/[..]/)
        if (name[1] === undefined) return name[0]
        else return name[1]
      })
      getSection = [...new Set(getSection)]
      getSection = getSection.map(x => {
        return {
          name: x,
          data: plantList.filter(plant => plant.location_code.indexOf(x) >= 0)
        }
      })
      this.setState({
        plantList: getSection
      })
    }
  }
  render() {
    const { plantList } = this.state
    return (
      <div>
        {plantList.map(section => (
          <TablePlantViewer
            key={section.name}
            data={section}
            onUpdateOnePlant={this.props.onUpdateOnePlant}
          />
        ))}
      </div>
    )
  }
}
