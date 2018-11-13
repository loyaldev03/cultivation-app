import React from 'react'
import classNames from 'classnames'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
  groupBy,
  sumBy,
  joinBy,
  ImgAdd,
  ImgDelete,
  ImgTriangle
} from '../../utils'

const gridStyles = {
  display: 'grid',
  gridColumnGap: '10px',
  gridRowGap: '10px',
  gridTemplateColumns: '1fr 1fr 1fr'
}

const SelectWithRange = ({ min, max, onChange, selectedValue = 0 }) => {
  let children = []
  for (let i = min; i <= max; i++) {
    children.push(
      <option value={i} key={i}>
        {i}
      </option>
    )
  }
  return (
    <select
      onChange={onChange}
      value={selectedValue}
      className="bg-white b--white"
    >
      {children}
    </select>
  )
}

const BadgeNumber = ({ show, value = 0 }) => {
  if (show && value > 0) {
    return <span className="badge badge--green">{value}</span>
  }
  return null
}

const LocationBox = ({
  highlighted,
  onClick,
  isSelected,
  name,
  code,
  showChangeText,
  plannedCapacity = 0,
  selectedCapacity = 0,
  totalCapacity = 0
}) => (
  <a
    href="#0"
    className={classNames(
      'db f6 link ba b--silver pa2 pointer relative br2 dim gray',
      {
        'bg-orange white bn': highlighted,
        'bg-light-gray black-50 bn': plannedCapacity == totalCapacity
      }
    )}
    style={{ height: '100px' }}
    onClick={plannedCapacity == totalCapacity ? null : onClick}
  >
    {!!name && <span className="ttc db f5 fw6">{name}</span>}
    {!!code && <span className="db f5 fw6 ttu">ID: {code} </span>}
    <span className="db">Planned: {plannedCapacity}</span>
    <span className="db">Total: {totalCapacity}</span>

    <BadgeNumber show={isSelected} value={selectedCapacity} />

    {showChangeText && (
      <span className="db hide-child">
        <span>Change</span>
      </span>
    )}
  </a>
)

const LabelWithChangeEvent = ({ isSelecting, value, onClick, label }) => {
  if (isSelecting) {
    return <label className="mt2 db mr2 gray fw6">{label}</label>
  } else {
    return (
      <React.Fragment>
        <label className="mt2 db mr2 gray fw6">{label}</label>
        <span className="db orange pointer f5" onClick={onClick}>
          {value ? value : '-- Select --'}
        </span>
      </React.Fragment>
    )
  }
}

class BatchLocationEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    const rooms = groupBy(props.locations, 'room_id')
    const selectedRoom = Object.keys(rooms)[0]
    const selectedLocation = props.locations.find(
      x => x['room_id'] === selectedRoom
    )
    this.state = {
      tabIndex: 0,
      showAddLocation: false,
      showRowList: true,
      rooms,
      selectedRoom,
      selectedLocation,
      selectedTrays: props.plantConfig.trays || []
    }
  }

  onShowAddLocation = () => {
    this.setState({
      showAddLocation: true
    })
  }

  onSelectRoomTab = tabIndex => {
    const rooms = groupBy(this.props.locations, 'room_id')
    const roomId = Object.keys(rooms)[tabIndex]
    this.onSelectRoom(roomId)
  }

  onSelectRow = value => e => {
    this.setState({
      selectedLocation: this.getSelectedLocation('row', value),
      selectedRow: value,
      selectedShelf: null,
      showRowList: false
    })
  }

  onSelectShelf = value => e => {
    this.setState({
      selectedLocation: this.getSelectedLocation('shelf', value),
      selectedShelf: value,
      showShelfList: false
    })
  }

  onSelectTray = trayId => e => {
    const selectedLocation = this.getSelectedLocation('tray', trayId)
    const traySel = this.state.selectedTrays.find(t => t.tray_id === trayId)
    if (selectedLocation) {
      const trayObj = {
        plant_id: this.props.plantConfig.id,
        room_id: selectedLocation.room_id,
        row_id: selectedLocation.row_id,
        shelf_id: selectedLocation.shelf_id,
        tray_id: selectedLocation.tray_id,
        tray_code: selectedLocation.tray_code,
        tray_capacity: e.target.value
      }
      const selectedTrays = traySel
        ? this.state.selectedTrays.map(t =>
            t.tray_id === trayId ? trayObj : t
          )
        : this.state.selectedTrays.concat([trayObj])
      this.setState({
        selectedTrays,
        selectedLocation
      })
    }
  }

  onRemoveSelectedTray = trayId => e => {
    this.setState({
      selectedTrays: this.state.selectedTrays.filter(t => t.tray_id !== trayId)
    })
  }

  onEditLocation = trayId => e => {
    const loc = this.getSelectedLocation('tray', trayId)
    this.setState({
      selectedRow: loc.row_id,
      selectedShelf: loc.shelf_id,
      selectedLocation: loc,
      showAddLocation: true,
      showRowList: true,
      showShelfList: true,
      showTrayList: true
    })
  }

  onDoneSelectTray = () => {
    this.setState({
      selectedRow: '',
      selectedShelf: '',
      selectedLocation: null,
      showAddLocation: false,
      showRowList: false,
      showShelfList: false,
      showTrayList: false
    })
  }

  onChange = (field, value) => e => this.setState({ [field]: value })

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  getSelectedTrayCapacity = trayId => {
    if (
      trayId &&
      this.state.selectedTrays &&
      this.state.selectedTrays.length > 0
    ) {
      const tray = this.state.selectedTrays.find(t => t.tray_id === trayId)
      return tray ? tray.tray_capacity : 0
    }
    return 0
  }

  getSelectedLocation = (location_type, id) => {
    if (location_type && id) {
      const found = this.props.locations.find(
        x => x[location_type + '_id'] === id
      )
      return found
    }
    return null
  }

  getLocationName = (location_type, id) => {
    if (!id || !location_type) {
      return ''
    }
    const found = this.props.locations.find(
      x => x[location_type + '_id'] === id
    )

    if (found && location_type === 'tray') {
      return `${found['shelf_code']}.${found['tray_code']}`
    }
    return found
      ? found[location_type + '_name'] || found[location_type + '_code']
      : 'Unnamed'
  }

  isSelected = (id, type) => {
    if (
      id &&
      type &&
      this.state.selectedTrays &&
      this.state.selectedTrays.length > 0
    ) {
      const record = this.state.selectedTrays.find(r => r[type + '_id'] === id)
      return !!record
    }
    return false
  }

  render() {
    const { locations, plantConfig, onSave, onClose } = this.props
    const {
      tabIndex,
      showRowList,
      showShelfList,
      showTrayList,
      showAddLocation,
      selectedRoom,
      selectedRow,
      selectedShelf,
      selectedTrays
    } = this.state
    let rooms = []
    let rows = []
    let shelves = []
    let trays = []

    console.log('locations:', locations)
    const plannedRows = groupBy(selectedTrays, 'row_id')
    console.log({ selectedRow, plannedRows })

    if (locations && locations.length > 0) {
      rooms = groupBy(locations, 'room_id')

      if (selectedRoom && rooms[selectedRoom]) {
        rows = groupBy(rooms[selectedRoom], 'row_id')

        if (selectedRow && rows[selectedRow]) {
          shelves = groupBy(rows[selectedRow], 'shelf_id')

          if (selectedShelf && shelves[selectedShelf]) {
            // There's no need to group trays, as it's already filter by shelf_id
            trays = shelves[selectedShelf]
          }
        }
      }
    }

    const selectedTraysCapacity = parseInt(
      selectedTrays.reduce((a, v) => a + parseInt(v.tray_capacity), 0)
    )

    return (
      <div className="h-100 flex flex-column">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">Quantity &amp; Location</h5>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <form
          className="pv3 h-100 flex-auto flex flex-column justify-between"
          onSubmit={e => {
            e.preventDefault()
            const updatePlant = {
              id: plantConfig.id,
              serialNo: plantConfig.serialNo,
              quantity: selectedTraysCapacity,
              trays: selectedTrays,
              phase: plantConfig.phase
            }
            onSave(updatePlant)
          }}
        >
          <Tabs
            className="react-tabs--primary"
            selectedIndex={tabIndex}
            onSelect={this.onSelectRoomTab}
          >
            <TabList>
              {Object.keys(rooms).map(roomId => {
                const firstRoom = rooms[roomId][0]
                return <Tab key={roomId}>{firstRoom.room_name}</Tab>
              })}
            </TabList>
            {Object.keys(rooms).map(roomId => {
              return (
                <TabPanel key={roomId} className="ph4 pb4">
                  <div className="pb3">
                    {selectedTrays && selectedTrays.length > 0 && (
                      <React.Fragment>
                        <div className="flex flex-column bb b--light-grey pb3">
                          <div className="flex flex-auto pv2">
                            <span className="w-20 gray f5 fw6">#</span>
                            <span className="w-30 gray f5 fw6">Location</span>
                            <span className="w-20 gray f5 fw6 tr">
                              Quantity
                            </span>
                            <span className="w-30 gray f5 fw6" />
                          </div>
                          {Object.keys(plannedRows).map((rowId, index) => {
                            const plannedTrays = plannedRows[rowId]
                            return (
                              <React.Fragment key={rowId}>
                                <div className="pv1 flex justify-between items-center">
                                  <span className="f4 fw6 dib gray">
                                    Row {index + 1}
                                  </span>
                                  <a href="#0" className="link">
                                    <img src={ImgTriangle} className="w1" />
                                  </a>
                                </div>
                                <ul className="list pl0 ma0">
                                  {plannedTrays.map(t => (
                                    <li
                                      key={t.tray_id}
                                      className="pa0 ma0 flex"
                                    >
                                      <i className="w-20" />
                                      <a
                                        href="#0"
                                        className="w-30 orange f5 pa1"
                                        onClick={this.onEditLocation(t.tray_id)}
                                      >
                                        {this.getLocationName(
                                          'tray',
                                          t.tray_id
                                        )}
                                      </a>
                                      <span className="w-20 gray f5 pa1 fw6 tr">
                                        {t.tray_capacity}
                                      </span>
                                      <span className="w-20 ph3 f5 tc pa1 h1">
                                        {!showAddLocation && (
                                          <a
                                            href="#0"
                                            onClick={this.onRemoveSelectedTray(
                                              t.tray_id
                                            )}
                                          >
                                            <img
                                              src={ImgDelete}
                                              className="w1"
                                            />
                                          </a>
                                        )}
                                      </span>
                                    </li>
                                  ))}
                                </ul>
                              </React.Fragment>
                            )
                          })}
                        </div>
                      </React.Fragment>
                    )}
                    {!showAddLocation && (
                      <a
                        href="#0"
                        onClick={this.onShowAddLocation}
                        className="flex flex-row items-center link mt3"
                      >
                        <i className="material-icons orange md-18">
                          add_circle_outline
                        </i>
                        <span className="ml2 orange">Add Location</span>
                      </a>
                    )}
                  </div>

                  {showAddLocation && (
                    <React.Fragment>
                      {/* SELECT ROW */}
                      <LabelWithChangeEvent
                        label={'Select Row:'}
                        isSelecting={showRowList}
                        value={this.getLocationName('row', selectedRow)}
                        onClick={this.onChange('showRowList', true)}
                      />
                      <div className="mt1 f6" style={gridStyles}>
                        {showRowList && (
                          <React.Fragment>
                            {Object.keys(rows).map(rowId => {
                              const firstRow = rows[rowId][0]
                              const rowCapacity = sumBy(
                                rows[rowId],
                                'tray_capacity'
                              )
                              const plannedCapacity = sumBy(
                                rows[rowId],
                                'planned_capacity'
                              )
                              const selectedCapacity = sumBy(
                                selectedTrays.filter(t => t.row_id === rowId),
                                'tray_capacity'
                              )
                              return (
                                <LocationBox
                                  key={rowId}
                                  highlighted={selectedRow === rowId}
                                  onClick={this.onSelectRow(rowId)}
                                  isSelected={this.isSelected(rowId, 'row')}
                                  name={firstRow.row_name}
                                  code={firstRow.row_code}
                                  plannedCapacity={plannedCapacity}
                                  selectedCapacity={selectedCapacity}
                                  totalCapacity={rowCapacity}
                                />
                              )
                            })}
                          </React.Fragment>
                        )}
                      </div>

                      {/* SELECT SHELF */}

                      <LabelWithChangeEvent
                        label={'Select Shelf:'}
                        isSelecting={showShelfList}
                        value={this.getLocationName('shelf', selectedShelf)}
                        onClick={this.onChange('showShelfList', true)}
                      />
                      <div className="mt1 f6" style={gridStyles}>
                        {showShelfList && (
                          <React.Fragment>
                            {Object.keys(shelves).map(shelfId => {
                              const firstShelf = shelves[shelfId][0]
                              const shelfCapacity = firstShelf.shelf_capacity
                              const plannedCapacity = sumBy(
                                shelves[shelfId],
                                'planned_capacity'
                              )
                              const selectedCapacity = sumBy(
                                selectedTrays.filter(
                                  t => t.shelf_id === shelfId
                                ),
                                'tray_capacity'
                              )
                              return (
                                <LocationBox
                                  key={shelfId}
                                  highlighted={selectedShelf === shelfId}
                                  onClick={this.onSelectShelf(shelfId)}
                                  isSelected={this.isSelected(shelfId, 'shelf')}
                                  code={firstShelf.shelf_code}
                                  plannedCapacity={plannedCapacity}
                                  selectedCapacity={selectedCapacity}
                                  totalCapacity={shelfCapacity}
                                />
                              )
                            })}
                          </React.Fragment>
                        )}
                      </div>

                      {/* SELECT TRAYS */}

                      <LabelWithChangeEvent
                        label={'Select Tray:'}
                        isSelecting={showTrayList}
                        value={joinBy(
                          selectedTrays.filter(
                            t => t.shelf_id === selectedShelf
                          ),
                          'tray_code'
                        )}
                        onClick={this.onChange('showTrayList', true)}
                      />
                      <div className="mt1 f6" style={gridStyles}>
                        {showTrayList && (
                          <React.Fragment>
                            {trays.map(tray => {
                              const plannedCapacity = sumBy(
                                trays,
                                'planned_capacity'
                              )
                              const isSelected = this.isSelected(
                                tray.tray_id,
                                'tray'
                              )
                              const selectedCapacity = this.getSelectedTrayCapacity(
                                tray.tray_id
                              )
                              return (
                                <a
                                  href="#0"
                                  key={tray.tray_id}
                                  className={classNames(
                                    'db f6 link ba b--silver pa2 pointer relative br2 dim gray',
                                    {
                                      'bg-orange white bn': isSelected
                                    }
                                  )}
                                  style={{ height: '100px' }}
                                >
                                  <BadgeNumber
                                    show={isSelected}
                                    value={selectedCapacity}
                                  />
                                  <span className="db f5 fw6">
                                    {tray.tray_code}
                                  </span>
                                  <span className="db">
                                    Planned: {plannedCapacity}
                                  </span>
                                  <span className="db pb1">
                                    Select Capacity:
                                  </span>
                                  <SelectWithRange
                                    min={0}
                                    max={tray.remaining_capacity}
                                    selectedValue={selectedCapacity}
                                    onChange={this.onSelectTray(tray.tray_id)}
                                  />
                                  <span> / {tray.tray_capacity}</span>
                                </a>
                              )
                            })}
                          </React.Fragment>
                        )}
                      </div>
                      <div className="pa2 mt3 tc">
                        <a
                          href="#0"
                          className="link ph3 pv1 br2 grey ba b--light-grey"
                          onClick={this.onDoneSelectTray}
                        >
                          <img
                            src={ImgTriangle}
                            className="mr2 w1 rotate-180"
                          />
                          Cancel
                        </a>
                      </div>
                    </React.Fragment>
                  )}
                </TabPanel>
              )
            })}
          </Tabs>

          <div className="bt b--light-grey tr pv3 ph4">
            <input type="submit" value="Save" className="btn btn--primary" />
          </div>
        </form>
      </div>
    )
  }
}

export default BatchLocationEditor
