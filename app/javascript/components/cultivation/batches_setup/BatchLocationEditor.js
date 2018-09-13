import React from 'react'
import classNames from 'classnames'
import { groupBy, sumBy, joinBy } from '../../utils/ArrayHelper'

const SelectWithRange = ({ min, max, onChange, selectedValue = 0 }) => {
  let children = []
  for (let i = min; i <= max; i++) {
    children.push(<option value={i} key={i}>{i}</option>)
  }
  return (
    <select onChange={onChange} value={selectedValue}>{children}</select>
  )
}

const LocationBox = ({ highlighted, onClick, isSelected, name, code, remainingCapacity = 0, selectedCapacity = 0, totalCapacity = 0}) => (
  <a
    href="#0"
    className={classNames('db f6 link ba b--gray pa2 pointer relative br2', {
      'bg-orange white bn': highlighted
    })}
    style={{ "height": "100px", "width": "95px" }}
    onClick={onClick}
  >
    <span className="ttc db">{name}</span>
    { !!code &&
      <span className="db ttu">ID: {code} </span>
    }
    { (!!totalCapacity && totalCapacity > 0) &&
      <span className="db">Capacity: {selectedCapacity + remainingCapacity}/{totalCapacity}</span>
    }
    { (!!isSelected && selectedCapacity > 0) &&
      <span className="bg-green h1 db absolute top-0 right-0 w1 br3 ma1 tc white f7">Capacity: {selectedCapacity}</span>
    }
  </a>
)

const LabelWithChangeEvent = ({ isSelecting, value, onClick }) => {
  if (isSelecting) {
    return null
  } else {
    return (
      <span className="db blue pointer" onClick={onClick}>
        {value ? value : '-- Select --'}
      </span>
    )
  }
}

class BatchLocationEditor extends React.PureComponent {
  state = {
    locations: this.props.locations || [], // all available tray locations from database
    selectedTrays: this.props.plant.trays || [],
    selectedQuantity: this.props.plant.quantity || 0
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
      showRoomList: false,
      showRowList: true
    })
  }

  onSelectRow = value => e => {
    this.setState({
      selectedLocation: this.getSelectedLocation('row', value),
      selectedRow: value,
      showRowList: false,
      showShelfList: true
    })
  }

  onSelectShelf = value => e => {
    this.setState({
      selectedLocation: this.getSelectedLocation('shelf', value),
      selectedShelf: value,
      showShelfList: false,
      showTrayList: true
    })
  }

  onSelectTray = trayId => e => {
    const selectedLocation = this.getSelectedLocation('tray', trayId)
    const traySel = this.state.selectedTrays.find(t => t.tray_id === trayId)
    if (selectedLocation) {
      const trayObj = {
        room_id: selectedLocation.room_id,
        shelf_id: selectedLocation.shelf_id,
        tray_id: trayId,
        tray_code: selectedLocation.tray_code,
        tray_capacity: e.target.value,
      }
      const selectedTrays = traySel ?
        this.state.selectedTrays.map(t => t.tray_id === trayId ? trayObj : t) :
        this.state.selectedTrays.concat([trayObj])
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
      showTrayList: false,
    })
  }

  onDoneSelectTray = () => {
    this.setState({
      selectedRoom: '',
      selectedRow: '',
      selectedShelf: '',
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
    if (trayId && this.state.selectedTrays && this.state.selectedTrays.length > 0) {
      const tray = this.state.selectedTrays.find(t => t.tray_id === trayId)
      return tray ? tray.tray_capacity : 0
    }
    return 0
  }

  getSelectedLocation = (location_type, id) => {
    if (location_type && id) {
      const found = this.state.locations.find(x => x[location_type + '_id'] === id)
      return found
    }
    return null
  }

  getLocationName = (location_type, id) => {
    if (!id || !location_type) {
      return "-- Select --"
    }
    const found = this.state.locations.find(x => x[location_type + '_id'] === id)
    return found ? (found[location_type + '_name'] || found[location_type + '_code']) : "Unnamed"
  }

  isSelected = (id, type) => {
    if (id && type && this.state.selectedTrays && this.state.selectedTrays.length > 0) {
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
      selectedLocation,
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

    console.log({selectedLocation})

    const selectedQuantity = parseInt(this.state.selectedQuantity ? this.state.selectedQuantity : 0)
    const selectedTraysCapacity = parseInt(selectedTrays.reduce((a, v) => a + parseInt(v.tray_capacity), 0))

    return (
      <div className="h-100">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">Quantity &amp; Location</h5>
        </div>
        <div className="ph4 pv3 h-100">
          <form
            className="flex flex-column justify-between"
            onSubmit={e => {
              e.preventDefault()
              const updatePlant = {
                id: plant.id,
                quantity: selectedQuantity,
                trays: selectedTrays,
              }
              console.log({ updatePlant })
              onSave(updatePlant)
            }}
          >
            <span className="subtitle-2 grey db mt3 mb1">PlantID: {plant.id}</span>

            <div className="mt2">
              <label className="subtitle-2 grey db mb1">
                Quantity: <br />
                <input
                  className="tr db measure mt1 pa2 grey ba b--light-grey box--br3 outline-0"
                  type="number"
                  defaultValue={plant.quantity || ''}
                  min="0"
                  step="1"
                  required={true}
                  onChange={this.onChangeInput('selectedQuantity')}
                />
              </label>
            </div>

            <div className="mt2">
              <label className="subtitle-2 grey db mb1">Locations:</label>
              {selectedTrays && selectedTrays.length > 0 &&
                <table className="collapse ba br2 b--black-10 pv2 ph3 f6">
                  <tbody>
                    <tr className="striped--light-gray">
                      <td className="pv2 ph3">#</td>
                      <td className="pv2 ph3">Location</td>
                      <td className="pv2 ph3 tr">Quantity</td>
                      <td></td>
                    </tr>
                    {selectedTrays.map((tray, index) => (
                      <tr key={tray.tray_id}>
                        <td className="pv2 ph3">{index + 1}</td>
                        <td className="pv2 ph3 w4">
                          <a href="#0" onClick={this.onEditLocation(tray.tray_id)} className="link">
                            {this.getLocationName('tray', tray.tray_id)}
                          </a>
                        </td>
                        <td className="pv2 ph3 tr w3">{tray.tray_capacity}</td>
                        <td className="pv2 ph2 w3">
                          {!showAddLocation &&
                            <a href="#0" onClick={this.onRemoveSelectedTray(tray.tray_id)}>Remove</a>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="bt b--light-gray">
                      <td className="pv2 tr" colSpan={2}>Total</td>
                      <td className={classNames("pv2 ph3 tr", {
                        "red": (selectedQuantity === 0 || selectedTraysCapacity > selectedQuantity || selectedTraysCapacity < selectedQuantity),
                        "green": selectedTraysCapacity === selectedQuantity,
                      })}>
                        {selectedTraysCapacity}/{selectedQuantity}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              }
              {!showAddLocation &&
                <a href="#0" className="link dib mt2 f6 fw6 orange tc" onClick={this.onShowAddLocation}>
                  + Add Location
                </a>
              }
            </div>

            {showAddLocation &&
              <div className="mt2 db ba ph3 pt2 pb3 b--light-gray">
                <label className="mt2 dib mr2">Select room:</label>
                <div
                  className="mt1 f6"
                  style={{
                    display: 'grid',
                    gridColumnGap: '10px',
                    gridRowGap: '10px',
                    gridTemplateColumns: '1fr 1fr 1fr'
                  }}
                >
                  {!showRoomList ?
                    <LocationBox
                      highlighted={!!selectedRoom}
                      onClick={this.onChange('showRoomList', true)}
                      isSelected={this.isSelected(selectedRoom, 'room')}
                      name={!!selectedLocation ? selectedLocation.room_name : 'Choose Room'}
                      code={!!selectedLocation ? selectedLocation.room_code : null }
                    /> :
                    <React.Fragment>
                      {Object.keys(rooms).map(roomId => {
                        const firstRoom = rooms[roomId][0]
                        const roomCapacity = sumBy(rooms[roomId], 'shelf_capacity')
                        const selectedCapacity = sumBy(selectedTrays.filter(t => t.room_id === roomId), 'tray_capacity')
                        // console.log({ where: "Room", rows: rooms[roomId], roomCapacity })
                        // console.log({ where: "firstRoom", firstRoom, roomCapacity, selectedCapacity })
                        return (
                          <LocationBox
                            key={roomId}
                            highlighted={roomId === selectedRoom}
                            onClick={this.onSelectRoom(roomId)}
                            isSelected={this.isSelected(roomId, 'room')}
                            name={firstRoom.room_name}
                            code={firstRoom.room_code}
                            remainingCapacity={0}
                            selectedCapacity={selectedCapacity}
                            totalCapacity={roomCapacity}
                          />
                        )
                      })}
                    </React.Fragment>
                  }
                </div>

                <label className="mt2 dib mr2">Select row:</label>
                <LabelWithChangeEvent
                  isSelecting={showRowList}
                  value={this.getLocationName('row', selectedRow)}
                  onClick={this.onChange('showRowList', true)}
                />

                {showRowList && (
                  <div
                    className="mt1 f6"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gridRowGap: '10px',
                    }}
                  >
                    {Object.keys(rows).map(rowId => {
                      const firstRow = rows[rowId][0]
                      const rowCapacity = sumBy(rows[rowId], 'shelf_capacity')
                      console.log({ where: "Row", shelves: rows[rowId] })
                      return (
                        <div
                          key={rowId}
                          className={classNames('ba b--gray pa2 pointer h3', {
                            'bg-orange white bn': selectedRow === rowId
                          })}
                          onClick={this.onSelectRow(rowId)}
                        >
                          <span className="ttc">{firstRow.row_name}</span><br />
                          <span className="dib">Row ID: {firstRow.row_code}</span><br />
                          <span className="">Capacity: {firstRow.capacity || 0}/{rowCapacity || "N/A"} </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <label className="mt2 dib mr2">Select shelf:</label>
                <LabelWithChangeEvent
                  isSelecting={showShelfList}
                  value={this.getLocationName('shelf', selectedShelf)}
                  onClick={this.onChange('showShelfList', true)}
                />

                {showShelfList && (
                  <div
                    className="mt1 f6"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gridRowGap: '10px',
                    }}
                  >
                    {Object.keys(shelves).map(shelfId => {
                      const firstShelf = shelves[shelfId][0]
                      const shelfCapacity = firstShelf.shelf_capacity
                      console.log({ firstShelf, code: firstShelf.shelf_code })
                      return (
                        <div
                          key={shelfId}
                          className={classNames('ba b--gray pa2 pointer h3', {
                            'bg-orange white bn': selectedShelf === shelfId
                          })}
                          onClick={this.onSelectShelf(shelfId)}
                        >
                          <span className="dib">{firstShelf.shelf_code}</span><br />
                          <span className="">Capacity: {firstShelf.capacity || 0}/{shelfCapacity || "N/A"} </span>
                        </div>
                      )
                    })}
                  </div>
                )}

                <label className="mt2 dib mr2">Select Tray:</label>
                <LabelWithChangeEvent
                  isSelecting={showTrayList}
                  value={joinBy(trays, 'tray_code')}
                  onClick={this.onChange('showTrayList', true)}
                />

                {showTrayList && (
                  <div
                    className="mt1 f6"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr',
                      gridRowGap: '10px',
                    }}
                  >
                    {trays.map(tray => {
                      return (
                        <div
                          key={tray.tray_id}
                          className={classNames('ba b--gray pa2 pointer', {
                            'bg-orange white bn': this.isSelected(tray.tray_id, 'tray')
                          })}
                        >
                          <span className="">{tray.tray_code}</span><br />
                          <span className="">Capacity: {tray.planned_capacity}/{tray.tray_capacity} </span><br />
                          <span className="dib">Select Capacity:</span>
                          <SelectWithRange
                            min={0}
                            max={tray.remaining_capacity}
                            selectedValue={this.getSelectedTrayCapacity(tray.tray_id)}
                            onChange={this.onSelectTray(tray.tray_id)}
                          />
                        </div>
                      )
                    })}
                  </div>
                )}
                <a href="#0" className="link ph2 pv1 ba bg-gray db w3 mt2 tc center f6 br2 white" onClick={this.onDoneSelectTray}>Close</a>
              </div>
            }
            {!showAddLocation && selectedQuantity === selectedTraysCapacity &&
              <div className="mt3">
                <input type="submit" value="Save" className="btn btn--primary dim br2" />
                <a href="#0" className="link btn mr2" onClick={onClose}>Cancel</a>
              </div>
            }
          </form>
        </div>
      </div>
    )
  }
}

export default BatchLocationEditor
