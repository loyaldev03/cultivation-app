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
  onChangeCheckBox = field => e => {
    const { nutrients } = this.state
    nutrients[field] = e.target.checked
    this.setState({
      nutrients
    })
    if (this.props.onUpdateNutrients) {
      this.props.onUpdateNutrients(nutrients)
    }
  }
  getFormInputs = () => {
    const updatedElements = Object.keys(this.state.nutrients)
    const nutrients = this.props.fields.map(x => {
      const value = this.state.nutrients[x.element]
      if (updatedElements.includes(x.element)) {
        return {
          element: x.element,
          value
        }
      } else {
        return x
      }
    })
    return nutrients
  }
  render() {
    console.log(this.props)
    const { className, fieldType, fields = [] } = this.props
    if (!fields || !fieldType) return null
    return (
      <div className={`${className}`}>
        {fields.map(f => (
          <div key={f.id} className="nutrient-form__group">
            <label className="nutrient-form__label">
              {fieldType === 'checkboxes' && (
                <React.Fragment>
                  <span className="nutrient-name">{f.product_name}</span>

                  <span className="nutrient-ppm">{f.ppm}</span>

                  <span className="nutrient-quantity">{f.quantity}</span>
                  <span className="nutrient-oum">{f.uom}</span>
                  <input
                    type="checkbox"
                    className="nutrient-form__input"
                    onChange={this.onChangeCheckBox(f.element)}
                    defaultChecked={f.checked}
                  />
                </React.Fragment>
              )}
              {fieldType === 'textboxes' && (
                <React.Fragment>
                  <span className="nutrient-name">{f.element} (%)</span>
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
