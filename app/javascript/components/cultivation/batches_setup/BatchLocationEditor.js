import React from "react"


const BatchLocationEditor = ({ plant, onSave }) => {
  let quantityField = null
  let locationIdField = null
  console.log({tag:"BatchLocationEditor", plantId: plant.id, quantity: plant.quantity })
  return (
    <div>
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
        <input type="submit" value="Save" />
      </form>
    </div>
  )
}

export default BatchLocationEditor
