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
    hasSection: false
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
    let codeSelected = motherRoomList.map(x=> {
        if (x.room_id===BatchStore.batch.selected_location){
            return x.room_id
        }
        if (x.section_id===BatchStore.batch.selected_location){
            return x.section_id
        }
        if (x.row_id===BatchStore.batch.selected_location){
            return x.row_id
        }
        if (x.shelf_id===BatchStore.batch.selected_location){
            return x.shelf_id
        }
        if (x.tray_id===BatchStore.batch.selected_location){
            return x.tray_id
        }
    })
    codeSelected = codeSelected[0]
    this.setState({
      motherRoomList,
      roomChoice: motherRoomList[0],
      roomData,
      hasSection,
      codeSelected,
      locationSelected: BatchStore.batch.selected_location,
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
    let hasSection =
      roomData.filter(node => node.room_name === roomChoice)[0].section_code !==
      null
    this.setState({
      codeSelected: element.data.name,
      roomSelected: element.meta ? `in ${element.meta.room_name}` : '',
      motherPlantList,
      locationSelected: element.data.id,
      selectedId: element.data.id,
      hasSection
    })
  }
  onUpdatePlant = () => {
    BatchStore.updateBatchSelectedPlants(
      this.props.batchId,
      this.state.locationSelected
    )
  }
  render() {
    const { onClose } = this.props
    const {
      roomChoice,
      roomData,
      motherRoomList,
      locationSelected,
      codeSelected,
      roomSelected,
      motherPlantList,
      hasSection
    } = this.state
    let totalPlantOnForm = roomData
      .filter(node => node.room_name === roomChoice)
      .reduce((a, b) => a + (Number(b['remaining_capacity']) || 0), 0)
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
          <div className="ph4 pb4 pt3">
            <span className="orange">Sage</span> mother plants are located in
            the sections highlighted in orange. Select the area of the mother
            plants you’d like to clip
          </div>
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
                {20}/{40}
              </div>
            </div>
            <ProgressBar percent={(20 / 40) * 100} height={15} />
          </div>
          <div className="pa3 h5 overflow-y-auto">
            <div className="mb1 b">You selected mother plants at:</div>
            <TableSection
              data={motherPlantList}
              codeSelected={codeSelected}
              hasSection={hasSection}
            />
          </div>
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
    codeSelected: null,
  }
  componentDidMount() {
    console.log(this.props.hasSection, BatchStore.batch.selected_plants)
    const listSelected = BatchStore.batch.selected_plants.map(x => x.plant_id)
    let plantList = this.props.data
      .map(plant => {
        plant.quantity = 0
        if (listSelected.indexOf(plant.plant_id) > 0) {
          plant.quantity =
            BatchStore.batch.selected_plants[
              listSelected.indexOf(plant.plant_id)
            ].quantity
        }
        return plant
      })
      .filter(a => a.quantity > 0)
    let codeSelected = plantList[0].location_code;
    
    const regex=/[a-zA-Z 0-9]*\./m;
    codeSelected = regex.exec(codeSelected)[0]
    this.setState({
      selectedPlant: BatchStore.batch.selected_plants,
      plantList,
      codeSelected
    })
  }
  componentDidUpdate(prevProps) {
    if (prevProps.codeSelected !== this.props.codeSelected) {
      const listSelected = BatchStore.batch.selected_plants.map(x => x.plant_id)
      let plantList = this.props.data
        .map(plant => {
          plant.quantity = 0
          if (listSelected.indexOf(plant.plant_id) > 0) {
            plant.quantity =
              BatchStore.batch.selected_plants[
                listSelected.indexOf(plant.plant_id)
              ].quantity
          }
          return plant
        })
        .filter(a => a.quantity > 0)
      this.setState({ plantList })
      console.log(
        'things changes',
        this.props.data,
        BatchStore.batch.selected_plants
      )
    }
  }
  render() {
    const { plantList, codeSelected } = this.state
    return (
      <div>
        <div className="bg-light-gray  grey f5 flex justify-between items-center pa1 pv2 mb1">
          <div className="b flex flex-start items-center pl2">
            {codeSelected} > tray{' '}
            <i className="material-icons icon--small">delete</i>
          </div>
          <div className="flex justify-between items-center">
            Apply to all{' '}
            <Tippy
              placement="bottom-end"
              content={
                <div className="inline_calendar grey ">
                  Tips: If selected, all mother plants in this are will be
                  clipped by the number you indicated above. You may also select
                  the specific mother plants in specific locations and indicate
                  a different number of clipping for each one
                </div>
              }
            >
              <i className="material-icons icon--small pointer">help</i>
            </Tippy>
            <label className="switch">
              <input
                type="checkbox"
                checked={true}
                // onChange={e =>
                //   this.setState({ applyAllToggle: !applyAllToggle })
                // }
              />
              <span className="slider round" />
            </label>
          </div>
        </div>
        <div className="mt2">
          <div className="w-100 flex">
            <div className=" w-25  pt2 bb b--light-gray pb1 mb1">
              {/* <Tippy
              trigger="click"
              content={
                <div className="bg-white ba b--light-gray br2 ml1 w5 grey overflow-y-auto">
                  <div className="bg-light-gray pa1">
                    <input
                      type="checkbox"
                      checked={allLocationChecked}
                      onChange={e => this.onShowAllLocation()}
                    />{' '}
                    All
                  </div>
                  {trayFilterList.map(x => (
                    <div className="pa1" key={x.code}>
                      <input
                        type="checkbox"
                        checked={x.ticked}
                        onChange={e => this.onFilterLocation(e, x)}
                      />
                      {x.code}
                    </div>
                  ))}
                </div>
              }
            > */}
              <i className="material-icons icon--small pointer">filter_list</i>
              {/* </Tippy> */}
              Location Code
            </div>
            <div className=" w-25  pt2 bb b--light-gray pb1 mb1">Plant ID</div>
            <div
              className={`fl w-25  pt2 bb b--light-gray  pb1 mb1 ${true &&
                'flex justify-between'}`}
            >
              <span className="">Number of clipping</span>
            </div>
            <div className="w-25  pt2 bb b--light-gray pb1 mb1">
              Total Clone
              {/* {totalPlantOnForm} */}
            </div>
          </div>

          {plantList.map(tray => (
            <div className="flex w-100" key={tray.plant_id}>
              <div className="w-25 pa1">{tray.location_code}</div>
              <div className="w-25 pa1">{tray.plant_code}</div>
              <div className="w-20 pa1 tc">
                <input
                  type="number"
                  className="gray w-80 tr b--none"
                  value={tray.quantity}
                  maxLength="2"
                  readOnly
                  // onChange={e =>
                  //   this.onUpdateOnePlant(tray.plant_id, e)
                  // }
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }
}
