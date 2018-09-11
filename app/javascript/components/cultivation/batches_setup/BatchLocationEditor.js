import React from 'react'
import classNames from 'classnames'
import { groupBy } from '../../utils/ArrayHelper'

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
    selectedRoom: '',
    selectedRow: '',
    selectedTrays: [],
  }

  onShowAddLocation = () => {
    console.log('clicked')
    this.setState({
      showAddLocation: true
    })
  }

  onSelectRoom = value => e => {
    this.setState({
      selectedRoom: value,
      showRoomList: false,
      showRowList: true
    })
  }

  onSelectRow = value => e => {
    this.setState({
      selectedRow: value,
      showRowList: false,
      showShelfList: true
    })
  }

  onSelectShelf = value => e => {
    this.setState({
      selectedShelf: value,
      showShelfList: false,
      showTrayList: true
    })
  }

  onSelectTray = trayId => e => {
    const trayObj = {
      id: trayId,
      capacity: e.target.value,
    }
    const found = this.state.selectedTrays.find(t => t.id === trayId)
    const selectedTrays = found ?
      this.state.selectedTrays.map(t => t.id === trayId ? trayObj : t) :
      this.state.selectedTrays.concat([trayObj])
    this.setState({
      selectedTrays,
    })
  }

  onRemoveSelectedTray = trayId => e => {
    this.setState({
      selectedTrays: this.state.selectedTrays.filter(t => t.id !== trayId)
    })
  }

  onDoneSelectTray = () => {
    this.setState({
      showAddLocation: false,
      showRoomList: false,
      showRowList: false,
      showShelfList: false,
      showTrayList: false
    })
  }

  onChange = (field, value) => e => this.setState({ [field]: value })

  getLocationName = (locations, location_type, id) => {
    if (!id) {
      return "-- Select --"
    }
    const found = locations.find(x => x[location_type + '_id'] === id)
    return found ? (found[location_type + '_name'] || found[location_type + '_code']) : "Unnamed"
  }

  sumOfShelvesCapacity = records => {
    return records.reduce((acc, obj) => acc + (obj.shelf_capacity || 0), 0)
  }

  isSelectedTray = trayId => {
    const found = this.state.selectedTrays.find(t => t.id === trayId)
    !!found
  }

  render() {
    const { plant, locations, onSave, onClose } = this.props
    const {
      showRoomList,
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

    if (locations) {
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

    return (
      <div className="pa2">
        <p>Set Quantity and Location</p>
        <form
          onSubmit={e => {
            e.preventDefault()
            const updatePlant = {
              id: plant.id,
              quantity: this.quantityField.value,
            }
            console.log({ updatePlant })
            onSave(updatePlant)
          }}
        >
          <p>PlantID: {plant.id}</p>

          <div className="mt2">
            <label>
              Quantity: <br />
              <input
                type="number"
                defaultValue={plant.quantity || ''}
                min="0"
                step="1"
                ref={input => (this.quantityField = input)}
              />
            </label>
          </div>

          <div className="mt2">
            <span className="db">Locations:</span>
            <table className="collapse ba br2 b--black-10 pv2 ph3">
              <tbody>
                <tr className="striped--light-gray">
                  <td className="pv2 ph3">Location</td>
                  <td className="pv2 ph3 tr">Quantity</td>
                  <td></td>
                </tr>
                { selectedTrays.map(tray => (
                  <tr key={tray.id}>
                    <td className="pv2 ph3">{this.getLocationName(locations, 'tray', tray.id)}</td>
                    <td className="pv2 ph3">{tray.capacity}</td>
                    <td className="pv2 ph3">
                      {!showAddLocation &&
                        <a href="#0" onClick={this.onRemoveSelectedTray(tray.id)}>Remove</a>
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!showAddLocation &&
              <a href="#0" className="link mt2" onClick={this.onShowAddLocation}>
                + Add Quantity &amp; Location
              </a>
            }
          </div>

          {showAddLocation &&
            <div className="mt2 db">
              <span className="mt2 dib mr2">Select room:</span>
              <LabelWithChangeEvent
                isSelecting={showRoomList}
                value={this.getLocationName(locations, 'room', selectedRoom)}
                onClick={this.onChange('showRoomList', true)}
              />

              {showRoomList && (
                <div
                  className="mt1 f6"
                  style={{
                    display: 'grid',
                    gridColumnGap: '10px',
                    gridRowGap: '10px',
                    gridTemplateColumns: '1fr 1fr 1fr'
                  }}
                >
                  {Object.keys(rooms).map(roomId => {
                    const firstRoom = rooms[roomId][0]
                    const roomCapacity = this.sumOfShelvesCapacity(rooms[roomId])
                    console.log({ where: "Room", rows: rooms[roomId], roomCapacity })
                    // console.log({ firstRoom, code: firstRoom.facility_code })
                    return (
                      <div
                        key={roomId}
                        className={classNames('ba b--gray pa2 pointer h3', {
                          'bg-orange white bn': selectedRoom === roomId
                        })}
                        onClick={this.onSelectRoom(roomId)}
                      >
                        <span className="ttc">{firstRoom.room_name}</span><br />
                        <span className="">Room ID: {firstRoom.room_code} </span><br />
                        <span className="">Capacity: {firstRoom.capacity || 0}/{roomCapacity || "N/A"} </span>
                      </div>
                    )
                  })}
                </div>
              )}

              <span className="mt2 dib mr2">Select row:</span>
              <LabelWithChangeEvent
                isSelecting={showRowList}
                value={this.getLocationName(locations, 'row', selectedRow)}
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
                    const rowCapacity = this.sumOfShelvesCapacity(rows[rowId])
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

              <span className="mt2 dib mr2">Select shelf:</span>
              <LabelWithChangeEvent
                isSelecting={showShelfList}
                value={this.getLocationName(locations, 'shelf', selectedShelf)}
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

              <span className="mt2 dib mr2">Select Tray:</span>
              <LabelWithChangeEvent
                isSelecting={showTrayList}
                value={selectedTrays.length}
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
                          'bg-orange white bn': this.isSelectedTray(tray.tray_id)
                        })}
                      >
                        <span className="">{tray.tray_code}</span><br />
                        <span className="">Capacity: {tray.planned_capacity}/{tray.tray_capacity} </span><br />
                        <span className="dib">Select Capacity: </span>
                        <input type="number" max={tray.remaining_capacity} onChange={this.onSelectTray(tray.tray_id)} />
                      </div>
                    )
                  })}
                  <a href="#0" onClick={this.onDoneSelectTray}>Add</a>
                </div>
              )}
            </div>
          }
          {!showAddLocation &&
            <div className="mt2">
              <a href="#0" className="link btn mr2" onClick={onClose}>Cancel</a>
              <input type="submit" value="Save" className="btn btn--primary dim" />
            </div>
          }
        </form>
      </div>
    )
  }
}

export default BatchLocationEditor
