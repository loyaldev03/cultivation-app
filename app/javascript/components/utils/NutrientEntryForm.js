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
    field.checked = !field.checked
    if (this.props.onUpdateNutrients) {
      this.props.onUpdateNutrients(this.props.fields)
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
    const { className, fieldType, fields = [] } = this.props
    if (!fields || !fieldType) return null
    return (
      <div className={`${className}`}>
        <table className="w-100 ttc gray">
          <thead>
            <tr className="f6">
              <th className="tl w5">Product Name</th>
              <th className="w4 tr">PPM</th>
              <th className="w4 tr">Amt</th>
              <th className="w4 tc">UoM</th>
              <th className="" />
            </tr>
          </thead>
          <tbody className="lh-copy">
            {fields.map(f => (
              <tr key={f.id} className="nutrient-form__group">
                {fieldType === 'checkboxes' && (
                  <React.Fragment>
                    <td className="tl v-top">{f.product_name}</td>
                    <td className="tr v-top">{f.ppm}</td>
                    <td className="tr v-top">{f.quantity}</td>
                    <td className="tc v-top">{f.uom}</td>
                    <td className="v-top">
                      <input
                        type="checkbox"
                        className="nutrient-form__input"
                        onChange={this.onChangeCheckBox(f)}
                        defaultChecked={f.checked}
                      />
                    </td>
                  </React.Fragment>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
}

export default NutrientEntryForm
