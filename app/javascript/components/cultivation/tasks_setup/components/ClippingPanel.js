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
import taskStore from '../stores/NewTaskStore'
@observer
class ClippingPanel extends React.Component {
  state = {
    roomData: null,
    traySelected: [],
    motherRoomList: [],
    trayFilterList: [],
    highlightedNode: [],
    locationFilter: [],
    locationSelected: null,
    allLocationChecked: false,
    clipNumber: 0,
    roomChoice: null,
    applyAllToggle: false,
    codeSelected: null
  }
  async componentDidMount() {
    await Promise.all([
      BatchStore.loadBatch(this.props.batchId),
      loadPlants('mother', this.props.facilityId)
    ])
    this.setState({
      roomData: await TaskStore.roomData(this.props.facilityId, 'mother'),
      locationSelected: BatchStore.batch.selected_location
    })
  }
  onClearTray = () => {
    this.setState({ traySelected: [], codeSelected: null })
  }
  onChoosen = (data, code) => {
    if (code === 'shelf') {
      this.setState({
        highlightedNode: [data.meta.row_code, data.meta.shelf_code]
      })
    } else {
    }
  }
  onAddTray = async element => {
    this.state.traySelected.push(element)
    taskStore.updateSunburstIsSelected()
    let temp = await TaskStore.getPlantOnSelect(
      this.props.facilityId,
      this.props.strainId,
      element.id
    )
    temp = temp
      .map(x => {
        x.quantity = 0
        BatchStore.getSelected().forEach(element => {
          if (element.plant_id === x.plant_id) x.quantity = element.quantity
        })
        return x
      })
      .filter(a => a.quantity > 0)

    let uniqueLocationCode = temp.map(x => {
      return { code: x.location_code, ticked: true }
    })
    this.setState({
      traySelected: temp,
      codeSelected: element.name,
      locationSelected: element.id,
      trayFilterList: this.uniqBy(uniqueLocationCode, 'code'),
      allLocationChecked: true
    })
  }
  onUpdateOnePlant = (id, e) => {
    this.state.traySelected.map(plant => {
      if (plant.plant_id === id) {
        plant.quantity = e.target.value
      }
      return plant
    })
    this.setState({ traySelected: this.state.traySelected })
  }
  uniqBy = (arr, comp) => {
    const unique = arr
      .map(e => e[comp])
      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)
      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e])

    return unique
  }

  onUpdatePlant = () => {
    BatchStore.setAllPlants(this.state.traySelected)
    if (
      this.state.traySelected.reduce(
        (a, b) => a + (Number(b['quantity']) || 0),
        0
      ) <= BatchStore.batch.quantity
    )
      BatchStore.updateBatchSelectedPlants(
        this.props.batchId,
        this.state.locationSelected
      )
  }

  onFilterLocation = (e, locationCode) => {
    let { trayFilterList } = this.state
    trayFilterList = trayFilterList.map(element => {
      if (element.code === locationCode.code) {
        element.ticked = !element.ticked
      }
      return element
    })

    this.setState({
      trayFilterList: trayFilterList,
      allLocationChecked: trayFilterList.every(v => v.ticked === true)
        ? true
        : false
    })
  }

  onShowAllLocation = () => {
    let { allLocationChecked, trayFilterList } = this.state
    if (allLocationChecked === false) {
      trayFilterList = trayFilterList.map(element => {
        element.ticked = true
        return element
      })
    }
    this.setState({
      trayFilterList: trayFilterList,
      allLocationChecked: trayFilterList.every(v => v.ticked === true)
        ? true
        : false
    })
  }
  onApplyAllClipping = e => {
    this.setState({ clipNumber: e.target.value })
    if (this.state.applyAllToggle === true) {
      let temp = this.state.traySelected.map(x => {
        x.quantity = e.target.value
        return x
      })
      this.setState({ traySelected: temp })
    }
  }

  changeRoom = roomName => {
    this.setState({ roomChoice: roomName })
  }
  render() {
    const { onClose } = this.props
    const {
      roomData,
      traySelected,
      trayFilterList,
      motherRoomList,
      clipNumber,
      roomChoice,
      locationSelected,
      codeSelected,
      applyAllToggle,
      highlightedNode,
      allLocationChecked
    } = this.state
    let totalPlantOnForm = traySelected.reduce(
      (a, b) => a + (Number(b['quantity']) || 0),
      0
    )
    return (
      <div>
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        <div className="flex justify-center tc mt3">
          {motherRoomList.map(card => (
            <div
              className={`flex flex-column f6 lh-copy ba br2 b--light-grey pa2 ml1 pointer ${card ===
                roomChoice && 'orange b'}`}
              onClick={e => this.changeRoom(card)}
            >
              {card}
              <img src={RoomIcon} className="h2" />
            </div>
          ))}
        </div>
        <div className="ph4 pb4 pt3">
          <span className="orange">Sage</span> mother plants are located in the
          sections highlighted in orange. Select the area of the mother plants
          you’d like to clip
        </div>
        {roomData ? (
          <div className="w-100 tc">
            <ErrorBoundary>
              <Sunburst
                data={roomData.filter(node => node.room_name === roomChoice)}
                locationSelected={locationSelected}
                onClearTray={this.onClearTray}
                onAddTray={this.onAddTray}
                roomChoice={roomChoice}
                onChoosen={this.onChoosen}
                highlightedNode={highlightedNode}
                width="300"
                height="300"
              />
            </ErrorBoundary>
          </div>
        ) : null}
        {codeSelected && (
          <div className="orange tc mt4">
            You’ve selected all mother plants located in {codeSelected} in{' '}
            {roomChoice}
          </div>
        )}
        {traySelected && traySelected.length > 0 ? (
          <React.Fragment>
            <div className="pa3">
              {totalPlantOnForm > BatchStore.batch.quantity ? (
                <div className="dib bg-washed-red pa2 ba br2 b--washed-red grey w-4 tc">
                  please remove{' '}
                  <span className="b">
                    {totalPlantOnForm - BatchStore.batch.quantity}
                  </span>{' '}
                  plant
                </div>
              ) : (
                <div>
                  <div className="flex justify-between">
                    <div>Total clones to create</div>
                    <div>
                      {totalPlantOnForm}/{BatchStore.batch.quantity}
                    </div>
                  </div>
                  <ProgressBar
                    percent={
                      (totalPlantOnForm / BatchStore.batch.quantity) * 100
                    }
                    height={15}
                  />
                </div>
              )}
              <div className="mt4 subtitle-2">
                You selected mother plants at:
                <br />
                <div className="bg-light-gray  grey f5 flex justify-between items-center pa1 pv2">
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
                          Tips: If selected, all mother plants in this are will
                          be clipped by the number you indicated above. You may
                          also select the specific mother plants in specific
                          locations and indicate a different number of clipping
                          for each one
                        </div>
                      }
                    >
                      <i className="material-icons icon--small pointer">help</i>
                    </Tippy>
                    <label className="switch">
                      <input
                        type="checkbox"
                        checked={applyAllToggle}
                        onChange={e =>
                          this.setState({ applyAllToggle: !applyAllToggle })
                        }
                      />
                      <span className="slider round" />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <div>
                  Total Mother plants selected:
                  <span className="orange">{traySelected.length}</span>
                </div>
                {applyAllToggle && (
                  <input
                    type="number"
                    className="input w-10 tr"
                    value={clipNumber}
                    maxLength="2"
                    onChange={this.onApplyAllClipping}
                  />
                )}
              </div>

              <div className="mt3">
                <div className="w-100">
                  <div className="fl w-25  pt2 bb b--light-silver">
                    <Tippy
                      trigger="click"
                      content={
                        <div className="bg-white ba b--light-silver br2 ml1 w5 grey overflow-y-auto">
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
                    >
                      <i className="material-icons icon--small pointer">
                        filter_list
                      </i>
                    </Tippy>
                    Location Code
                  </div>
                  <div className="fl w-25  pt2 bb b--light-silver">
                    Plant ID
                  </div>
                  <div
                    className={`fl w-20  pt2 bb b--light-silver ${applyAllToggle &&
                      'flex justify-between'}`}
                  >
                    <span className="pl2"># of clipping</span>
                  </div>
                  <div className="fl w-25  pt2 bb b--light-silver">
                    Total Clone {totalPlantOnForm}
                  </div>
                </div>
                <div className="w-100 h5 overflow-y-auto">
                  {traySelected.map(tray => {
                    let show = trayFilterList.find(
                      x => x.code === tray.location_code
                    )
                    return show && show.ticked ? (
                      <div className="fl w-100" key={tray.plant_id}>
                        <div className="fl w-25 pa1">{tray.location_code}</div>
                        <div className="fl w-25 pa1">{tray.plant_code}</div>
                        <div className="fl w-20 pa1 tc">
                          <input
                            type="number"
                            className="input w-40 tr"
                            value={tray.quantity}
                            maxLength="2"
                            onChange={e =>
                              this.onUpdateOnePlant(tray.plant_id, e)
                            }
                          />
                        </div>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </React.Fragment>
        ) : (
          <div className="tc pa5">
            <i className="material-icons md-17 orange">help</i>Tip: You can
            select the entire area, or you can select individual location of the
            mother plants. You can also select{' '}
            <span className="b">Apply All</span> if you want to have the same
            number of clippings per mother plant in the entire area selected.
          </div>
        )}
        {codeSelected && (
          <SlidePanelFooter onSave={this.onUpdatePlant} onClose={onClose} />
        )}
      </div>
    )
  }
}
export default ClippingPanel
