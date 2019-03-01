import React from 'react'
import { decimalFormatter } from '../utils'

class NutrientEntryForm extends React.Component {
  state = {
    nutrients: {}
  }
  onChangeTextInput = field => e => {
    const { nutrients } = this.state
    nutrients[field] = e.target.value
    this.setState({
      nutrients
    })
  }
  getFormInputs = () => {
    const nutrients = this.props.fields.map(x => {
      const updated = this.state.nutrients[x.element]
      if (updated) {
        return {
          element: x.element,
          value: updated
        }
      } else {
        return x
      }
    })
    return nutrients
  }
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
                  <span className="nutrient-name">{f.element}</span>
                  <span className="nutrient-quantity">
                    {decimalFormatter.format(f.value)}%
                  </span>
                  <input type="checkbox" className="nutrient-form__input" />
                </React.Fragment>
              )}
              {fieldType === 'textboxes' && (
                <React.Fragment>
                  <span className="nutrient-name">
                    {f.element} ({f.uom})
                  </span>
                  <input
                    type="number"
                    className="nutrient-form__input input tr"
                    defaultValue={f.value}
                    onChange={this.onChangeTextInput(f.element)}
                  />
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
