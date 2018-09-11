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

  render() {
    const { plant, locations, onSave } = this.props
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
            trays = groupBy(shelves[selectedShelf], 'tray_id')
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
              value={selectedRoom}
              onClick={this.onChange('showRoomList', true)}
            />
            <br />

            {this.state.showRoomList && (
              <div
                className="mt1"
                style={{
                  display: 'grid',
                  gridColumnGap: '10px',
                  gridRowGap: '10px',
                  gridTemplateColumns: '1fr 1fr 1fr'
                }}
              >
                {Object.keys(rooms).map(roomId => {
                  const firstRoom = rooms[roomId][0]
                  console.log({ firstRoom, code: firstRoom.facility_code })
                  return (
                    <div
                      key={roomId}
                      className={classNames('ba b--gray pa2 pointer h3', {
                        'bg-orange white bn': selectedRoom === roomId
                      })}
                      onClick={this.onSelectRoom(roomId)}
                    >
                      <span>
                        {firstRoom.room_name} / {firstRoom.room_code}
                      </span>
                    </div>
                  )
                })}
              </div>
            )}

            <span className="mt2 dib mr2">Select row:</span>
            <LabelWithChangeEvent
              isSelecting={this.state.showRowList}
              value={selectedRow}
              onClick={this.onChange('showRowList', true)}
            />
            <br />

            {this.state.showRowList && (
              <div>
                {Object.keys(rows).map(rowId => {
                  const firstRow = rows[rowId][0]
                  console.log({ firstRow, code: firstRow.row_code })
                  return (
                    <div
                      key={rowId}
                      className={classNames('ba b--gray pa2 pointer h3', {
                        'bg-orange white bn': selectedRow === rowId
                      })}
                      onClick={this.onSelectRow(rowId)}
                    >
                      <span className="dib">{firstRow.row_code}</span>
                    </div>
                  )
                })}
              </div>
            )}

            <span className="mt2 dib mr2">Select shelf:</span>
            <LabelWithChangeEvent
              isSelecting={this.state.showShelfList}
              value={selectedShelf}
              onClick={this.onChange('showShelfList', true)}
            />
            <br />

            {this.state.showShelfList && (
              <div>
                {Object.keys(shelves).map(shelfId => {
                  const firstShelf = shelves[shelfId][0]
                  console.log({ firstShelf, code: firstShelf.shelf_code })
                  return (
                    <div
                      key={shelfId}
                      className={classNames('ba b--gray pa2 pointer h3', {
                        'bg-orange white bn': selectedShelf === shelfId
                      })}
                      onClick={this.onSelectShelf(shelfId)}
                    >
                      <span className="dib">{firstShelf.shelf_code}</span>
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
              <div>
                {Object.keys(trays).map(trayId => {
                  const firstTray = trays[trayId][0]
                  console.log({ firstTray, code: firstTray.tray_code })
                  return (
                    <div
                      key={trayId}
                      className={classNames('ba b--gray pa2 pointer h3', {
                        'bg-orange white bn': selectedTray === trayId
                      })}
                      onClick={this.onSelectTray(trayId)}
                    >
                      <span className="dib">{firstTray.tray_code}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="mt2">
            <input type="submit" value="Save" className="btn btn--primary" />
          </div>
        </form>
      </div>
    )
  }
}

export default BatchLocationEditor
