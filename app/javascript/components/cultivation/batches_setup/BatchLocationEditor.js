import React from "react"
import { groupBy } from '../../utils/ArrayHelper'

const BatchLocationEditor = ({ plant, locations, onSave }) => {
  let quantityField = null
  let locationIdField = null
  let rooms = groupBy(locations, 'room_id')
  console.log(rooms)
  return (
    <div className="pa2">
      <p>Set Quantity and Location</p>
      <form
        onSubmit={e => {
          e.preventDefault()
          const updatePlant = {
            id: plant.id,
            quantity: quantityField.value,
            locationId: locationIdField.value
          }
          console.log({ updatePlant })
          onSave(updatePlant)
        }}
      >
        <p>PlantID: {plant.id}</p>

        <div className="mt2">
          <label>Quantity:
            <input
              type="number"
              defaultValue={plant.quantity || ''}
              min="0"
              step="1"
              ref={input => quantityField = input}
            />
          </label>
        </div>

        <div className="mt2">
          <label>Location:
            <input
              type="text"
              defaultValue={plant.locationId || ''}
              ref={input => locationIdField = input}
            />
          </label>
        </div>

        <div className="mt2">
          <span className="">Choose location:</span>
          <div className="">
            <label className="db">Select room:</label>
            { Object.keys(rooms).map(roomId => {
                const firstRoom = rooms[roomId][0]
                console.log({ firstRoom, code: firstRoom.facility_code })
                return (
                  <div key={roomId} className="pa2 bg-yellow fl">
                    <span>{firstRoom.facility_code}</span>
                  </div>
                )
              })
            }
          </div>
        </div>

        <div>
          <input type="submit" value="Save" />
        </div>
      </form>
    </div>
  )
}

export default BatchLocationEditor
