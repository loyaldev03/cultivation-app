import React from 'react'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Select from 'react-select'


const uom_dropdown = [
  { value: 'KG', label: 'KG' },
  { value: 'CM', label: 'CM' },
  { value: 'Inch', label: 'Inch' },
  { value: 'ML', label: 'ML' },
  { value: 'L', label: 'L' },
  { value: 'Pcs', label: 'Pcs' }
]

@observer
class MaterialUsed extends React.Component {
  constructor(props) {
    const { dailyTask } = props
    const task = dailyTask.attributes.task

    super(props);
    const quantity = {}
    const uom = {}
    task.attributes.items.map((item, i) => {
      quantity[item.id] = ''
      uom[item.id] = { value: item.uom, label: item.uom }
    })

    this.state = {
      additional_materials_used: [],
      quantity,
      uom
    };

    this.handleQuantityChange = this.handleQuantityChange.bind(this);
    this.handleUomChange = this.handleUomChange.bind(this);
    this.handleClear = this.handleClear.bind(this);
  }

  handleQuantityChange(itemId, inputQuantity) {
    const quantity = this.state.quantity
    quantity[itemId] = inputQuantity
    this.setState({ quantity })
  }

  handleUomChange(itemId, selectedOption) {
    const uom = this.state.uom
    uom[itemId] = selectedOption
    this.setState({ uom })
  }

  handleClear(itemId) {
    const quantity = this.state.quantity
    const uom = this.state.uom
    quantity[itemId] = ''
    uom[itemId] = {}
    this.setState({ quantity, uom })
  }

  render () {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    return(<div className="w-100 lh-copy black-60 f6">
      <form className="mt3" onSubmit={this.handleLogSubmit}>
        <table className="w-100">
        <tbody>
          <tr className="bb">
            <th>Material Name</th>
            <th width="15%">Qty</th>
            <th width="30%">UOM</th>
            <th />
          </tr>
          {task.attributes.items.map((item, i) => (
            <tr className="pointer bb" key={i}>
              <td className="tl pv2 ph3">{item.name}</td>
              <td className="tl pv2 ph3">
              <input
                value={this.state.quantity[item.id]}
                onChange={e => this.handleQuantityChange(item.id, e.target.value)}
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                type="number"
              /></td>
              <td className="tl pv2 ph3"><Select
                  name="uom"
                  options={uom_dropdown}
                  value={this.state.uom[item.id]}
                  onChange={selectedOption => this.handleUomChange(item.id, selectedOption)}
                />
                </td>
              <td className="tl pv2 ph3">
                <i
                  className="material-icons red md-18 pointer dim"
                  onClick={() => this.handleClear(item.id)}
                >
                  delete
                </i>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
        <input onClick={this.handleSave} className="ttu fr pointer pv3 ph5 bg-orange button--font white bn box--br3" type="submit" value="Save" />
      </form>
    </div>)
  }
}

export default MaterialUsed