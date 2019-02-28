import React from 'react'

class NutrientEntryForm extends React.Component {
  render() {
    const { className, fieldType, fields = [] } = this.props
    if (!fields || !fieldType) return null
    return (
      <div className={`${className}`}>
        {fields.map(f => (
          <div key={f.id} className="nutrient-form__group">
            <label className="nutrient-form__label">
              {fieldType === 'checkboxes' && (
                <React.Fragment>
                  <span className="nutrient-name">{f.name}</span>
                  <span className="nutrient-quantity">
                    {f.quantity} {f.uom}
                  </span>
                  <input type="checkbox" className="nutrient-form__input" />
                </React.Fragment>
              )}
              {fieldType === 'textboxes' && (
                <React.Fragment>
                  <span className="nutrient-name">{f.name} ({f.uom})</span>
                  <input type="number" className="nutrient-form__input input tr" />
                </React.Fragment>
              )}
            </label>
          </div>
        ))}
      </div>
    )
  }
}

export default NutrientEntryForm
