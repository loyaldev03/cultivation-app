import React from 'react'
import classNames from 'classnames'
import { groupBy, sumBy, joinBy } from '../../utils/ArrayHelper'

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
      className={classNames('', { white: !!selectedValue })}
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
      'db f6 link ba b--gray pa2 pointer relative br2 dim',
      {
        'bg-orange white bn': highlighted,
        'bg-light-gray black-50 bn': plannedCapacity == totalCapacity
      }
    )}
    style={{ height: '100px' }}
    onClick={plannedCapacity == totalCapacity ? null : onClick}
  >
    {!!name && <span className="ttc db">{name}</span>}
    {!!code && <span className="db ttu">ID: {code} </span>}
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

const LabelWithChangeEvent = ({ isSelecting, value, onClick }) => {
  if (isSelecting) {
    return null
  } else {
    return (
      <span className="db blue pointer f6" onClick={onClick}>
        {value ? value : '-- Select --'}
      </span>
    )
  }
}

class BatchLocationEditor extends React.PureComponent {
  state = {
    locations: this.props.locations || [], // all available tray locations from database
    selectedTrays: this.props.plant.trays || []
  }

  onShowAddLocation = () => {
    this.setState({
      showAddLocation: true
    })
  }

  onSelectRoom = value => e => {
    this.setState({
      selectedLocation: this.getSelectedLocation('room', value),
      selectedRoom: value,
      selectedRow: null,
      selectedShelf: null,
      showRoomList: false
    })
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
        plant_id: this.props.plant.id,
        room_id: selectedLocation.room_id,
        row_id: selectedLocation.row_id,
        shelf_id: selectedLocation.shelf_id,
        tray_id: selectedLocation.tray_id,
        tray_code: selectedLocation.tray_code,
        tray_capacity: e.target.value
      }

      const selectedTrays = traySel
        ? this.state.selectedTrays.map(
            t => (t.tray_id === trayId ? trayObj : t)
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
      selectedRoom: loc.room_id,
      selectedRow: loc.row_id,
      selectedShelf: loc.shelf_id,
      selectedLocation: loc,
      showAddLocation: true,
      showRoomList: true,
      showRowList: true,
      showShelfList: true,
      showTrayList: true
    })
  }

  onDoneSelectTray = () => {
    this.setState({
      selectedRoom: '',
      selectedRow: '',
      selectedShelf: '',
      selectedLocation: null,
      showAddLocation: false,
      showRoomList: false,
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
      const found = this.state.locations.find(
        x => x[location_type + '_id'] === id
      )
      return found
    }
    return null
  }

  getLocationName = (location_type, id) => {
    if (!id || !location_type) {
      return '-- Select --'
    }
    const found = this.state.locations.find(
      x => x[location_type + '_id'] === id
    )
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
    const { plant, onSave, onClose } = this.props
    const {
      locations,
      showRoomList,
      showRowList,
      showShelfList,
      showTrayList,
      showAddLocation,
      selectedRoom,
      selectedRow,
      selectedShelf,
      selectedTrays,
      selectedLocation
    } = this.state
    let rooms = []
    let rows = []
    let shelves = []
    let trays = []

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
        </div>
        <form
          className="ph4 pv3 h-100 flex-auto flex flex-column justify-between"
          onSubmit={e => {
            e.preventDefault()
            const updatePlant = {
              id: plant.id,
              quantity: selectedTraysCapacity,
              trays: selectedTrays
            }
            onSave(updatePlant)
          }}
        >
          <div>
            <div className="mt2">
              <span className="subtitle-2 grey db mt3 mb1">
                PlantID: {plant.id}
              </span>

              <label className="subtitle-2 grey db mb1">Locations:</label>
              {selectedTrays &&
                selectedTrays.length > 0 && (
                  <table className="collapse ba br2 b--black-10 pv2 ph3 f6 w-100">
                    <tbody>
                      <tr className="striped--light-gray">
                        <td className="pv2 ph3 w1">#</td>
                        <td className="pv2 ph3">Location</td>
                        <td className="pv2 ph3 tr">Quantity</td>
                        <td style={{ width: '50px' }} />
                      </tr>
                      {selectedTrays.map((tray, index) => (
                        <tr key={tray.tray_id}>
                          <td className="pv2 ph3 w1">{index + 1}</td>
                          <td className="pv2 ph3 w4">
                            <a
                              href="#0"
                              onClick={this.onEditLocation(tray.tray_id)}
                              className="link"
                            >
                              {this.getLocationName('tray', tray.tray_id)}
                            </a>
                          </td>
                          <td className="pv2 ph3 tr w3">
                            {tray.tray_capacity}
                          </td>
                          <td className="tc">
                            {!showAddLocation && (
                              <a
                                href="#0"
                                onClick={this.onRemoveSelectedTray(
                                  tray.tray_id
                                )}
                              >
                                Remove
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bt b--light-gray">
                        <td className="pv2 tr" colSpan={2}>
                          Total
                        </td>
                        <td className="pv2 ph3 tr">{selectedTraysCapacity}</td>
                        <td />
                      </tr>
                    </tfoot>
                  </table>
                )}
              {!showAddLocation && (
                <a
                  href="#0"
                  className="link dib mt2 f6 fw6 orange tc"
                  onClick={this.onShowAddLocation}
                >
                  + Add Location
                </a>
              )}
            </div>

            {showAddLocation && (
              <div className="mt2 db ba ph3 pt2 pb3 b--light-gray">
                <label className="mt2 db mr2">Select room:</label>
                <LabelWithChangeEvent
                  isSelecting={showRoomList}
                  value={this.getLocationName('room', selectedRoom)}
                  onClick={this.onChange('showRoomList', true)}
                />
                <div className="mt1 f6" style={gridStyles}>
                  {showRoomList && (
                    <React.Fragment>
                      {Object.keys(rooms).map(roomId => {
                        const firstRoom = rooms[roomId][0]
                        const roomCapacity = sumBy(
                          rooms[roomId],
                          'tray_capacity'
                        )
                        const plannedCapacity = sumBy(
                          rooms[roomId],
                          'planned_capacity'
                        )
                        const selectedCapacity = sumBy(
                          selectedTrays.filter(t => t.room_id === roomId),
                          'tray_capacity'
                        )
                        return (
                          <LocationBox
                            key={roomId}
                            highlighted={roomId === selectedRoom}
                            onClick={this.onSelectRoom(roomId)}
                            isSelected={this.isSelected(roomId, 'room')}
                            name={firstRoom.room_name}
                            code={firstRoom.room_code}
                            plannedCapacity={plannedCapacity}
                            selectedCapacity={selectedCapacity}
                            totalCapacity={roomCapacity}
                          />
                        )
                      })}
                    </React.Fragment>
                  )}
                </div>

                <label className="mt2 db mr2">Select row:</label>
                <LabelWithChangeEvent
                  isSelecting={showRowList}
                  value={this.getLocationName('row', selectedRow)}
                  onClick={this.onChange('showRowList', true)}
                />
                <div className="mt1 f6" style={gridStyles}>
                  {showRowList && (
                    <React.Fragment>
                      {Object.keys(rows).map(rowId => {
                        const firstRow = rows[rowId][0]
                        const rowCapacity = sumBy(rows[rowId], 'tray_capacity')
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

                <label className="mt2 dib mr2">Select shelf:</label>
                <LabelWithChangeEvent
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
                          selectedTrays.filter(t => t.shelf_id === shelfId),
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

                <label className="mt2 dib mr2">Select Tray:</label>
                <LabelWithChangeEvent
                  isSelecting={showTrayList}
                  value={joinBy(
                    selectedTrays.filter(t => t.shelf_id === selectedShelf),
                    'tray_code'
                  )}
                  onClick={this.onChange('showTrayList', true)}
                />
                <div className="mt1 f6" style={gridStyles}>
                  {showTrayList && (
                    <React.Fragment>
                      {trays.map(tray => {
                        const plannedCapacity = sumBy(trays, 'planned_capacity')
                        const isSelected = this.isSelected(tray.tray_id, 'tray')
                        const selectedCapacity = this.getSelectedTrayCapacity(
                          tray.tray_id
                        )
                        return (
                          <a
                            href="#0"
                            key={tray.tray_id}
                            className={classNames(
                              'db f6 link ba b--gray pa2 pointer relative br2 dim',
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
                            <span className="db">{tray.tray_code}</span>
                            <span className="db">
                              Planned: {plannedCapacity}
                            </span>
                            <span className="dib">Select Capacity:</span>
                            <SelectWithRange
                              min={0}
                              max={tray.remaining_capacity}
                              selectedValue={selectedCapacity}
                              onChange={this.onSelectTray(tray.tray_id)}
                            /> / <span>{tray.tray_capacity}</span>
                          </a>
                        )
                      })}
                    </React.Fragment>
                  )}
                </div>
                <a
                  href="#0"
                  className="link ph2 pv1 ba bg-gray db w3 mt2 tc center f6 br2 white"
                  onClick={this.onDoneSelectTray}
                >
                  Close
                </a>
              </div>
            )}
          </div>
          <div className="mt3 tr">
            <a href="#0" className="link btn mr2" onClick={onClose}>
              Cancel
            </a>
            <input
              type="submit"
              value="Save"
              className="btn btn--primary dim br2"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default BatchLocationEditor
