import React from 'react'
import classNames from 'classnames'
import { groupBy } from '../../utils/ArrayHelper'

const LabelWithChangeEvent = ({ isSelecting, value, onClick }) => {
  if (isSelecting) {
    return <span className="dib orange pointer">-- Select --</span>
  } else {
    return (
      <span className="dib blue pointer" onClick={onClick}>
        {value ? value : '-- Select --'}
      </span>
    )
  }
}

class BatchLocationEditor extends React.PureComponent {
  state = {
    selectedRoom: '',
    selectedRow: ''
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

  onSelectTray = value => e => {
    this.setState({
      selectedTray: value,
      showTrayList: false
    })
  }

  onChange = (field, value) => e => this.setState({ [field]: value })

  getLocationName = (locations, location_type, id) => {
    if (!id) {
      return "-- Select --"
    }
    const found = locations.find(x=> x[location_type + '_id'] === id)
    return found ? (found[location_type + '_name'] || found[location_type + '_code']) : "Unnamed"
  }

  sumOfShelvesCapacity = records => {
    return records.reduce((acc, obj) => acc + (obj.shelf_capacity || 0), 0)
  }

  render() {
    const { plant, locations, onSave, onClose } = this.props
    const {
      showRoomList,
      showRowList,
      showShelfList,
      showTrayList,
      selectedRoom,
      selectedRow,
      selectedShelf,
      selectedTray
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
              locationId: this.locationIdField.value
            }
            console.log({ updatePlant })
            onSave(updatePlant)
          }}
        >
          <p>PlantID: {plant.id}</p>

          <div className="mt2">
            <label>
              Quantity:
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
            <label>
              Location:
              <input
                type="text"
                defaultValue={plant.locationId || ''}
                ref={input => (this.locationIdField = input)}
              />
            </label>
          </div>

          <div className="mt2 db">
            <span className="db">Choose location:</span>
            <span className="mt2 dib mr2">Select room:</span>
            <LabelWithChangeEvent
              isSelecting={this.state.showRoomList}
              value={this.getLocationName(locations, 'room', selectedRoom)}
              onClick={this.onChange('showRoomList', true)}
            />
            <br />

            {this.state.showRoomList && (
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
              isSelecting={this.state.showRowList}
              value={this.getLocationName(locations, 'row', selectedRow)}
              onClick={this.onChange('showRowList', true)}
            />
            <br />

            {this.state.showRowList && (
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
              isSelecting={this.state.showShelfList}
              value={this.getLocationName(locations, 'shelf', selectedShelf)}
              onClick={this.onChange('showShelfList', true)}
            />
            <br />

            {this.state.showShelfList && (
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
              isSelecting={this.state.showTrayList}
              value={selectedTray}
              onClick={this.onChange('showTrayList', true)}
            />
            <br />

            {this.state.showTrayList && (
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
                      className={classNames('ba b--gray pa2 pointer h4', {
                        'bg-orange white bn': selectedTray === tray.tray_id
                      })}
                    >
                      <span className="dib">{tray.tray_code}</span><br />
                      <span className="">Capacity: {tray.capacity || 0}/{tray.tray_capacity || "N/A"} </span><br />
                      <button onClick={this.onSelectTray(tray.tray_id)}>Done</button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="mt2">
            <a href="#0" className="link btn mr2" onClick={onClose}>Cancel</a>
            <input type="submit" value="Save" className="btn btn--primary dim" />
          </div>
        </form>
      </div>
    )
  }
}

export default BatchLocationEditor
