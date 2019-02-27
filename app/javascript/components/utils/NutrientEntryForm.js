import React from 'react'

const sampleData = [
  {
    id: 1,
    nutrient: 'Nitrogen',
    uom: '%'
  },
  {
    id: 1,
    nutrient: 'Prosphorus',
    uom: '%'
  },
  {
    id: 1,
    nutrient: 'Potassium',
    uom: '%'
  },
  {
    id: 1,
    nutrient: 'Iron',
    uom: '%'
  },
  {
    id: 1,
    nutrient: 'Molybdenum',
    uom: '%'
  }
]
class NutrientEntryForm extends React.Component {
  render() {
    return (
      <div className="nutrient-form">
        <div className="">
          <label className="">Nitrogen (%)</label>
          <input className="" type="number" />
        </div>
        <div className="">
          <label className="">Prosphorus (%)</label>
          <input className="" type="number" />
        </div>
        <div className="">
          <label className="">Potassium (%)</label>
          <input className="" type="number" />
        </div>
      </div>
    )
  }
}

export default NutrientEntryForm
