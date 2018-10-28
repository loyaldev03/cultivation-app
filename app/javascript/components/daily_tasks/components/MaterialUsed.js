import React from 'react'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Select from 'react-select'

import DailyTasksStore from '../store/DailyTasksStore'
import { updateMaterialsUsed } from '../actions/taskActions'

const uom_dropdown = [
  { value: 'KG', label: 'KG' },
  { value: 'CM', label: 'CM' },
  { value: 'Inch', label: 'Inch' },
  { value: 'ML', label: 'ML' },
  { value: 'L', label: 'L' },
  { value: 'Pcs', label: 'Pcs' }
]

const WAIT_INTERVAL = 1000;
const ENTER_KEY = 13;

@observer
class MaterialUsed extends React.Component {
  constructor(props) {
    const { dailyTask } = props
    const task = dailyTask.attributes.task

    super(props)

    const materials = []
    // Initialize materials used data (item ID, name) from planned materials
    task.attributes.items.map((item, i) => {
      materials.push({
        item_id: item.id,
        raw_material_id: item.raw_material_id,
        name: item.name,
        qty: '',
        uom: item.uom
      })
    })
    // Overwrite materials used data from store
    console.log(toJS(dailyTask.attributes.materials_used))
    dailyTask.attributes.materials_used.map((material, i) => {
      const materialFound = this.findMaterial(material.raw_material_id, materials)
      if (materialFound) {
        materialFound.qty = material.qty
        materialFound.uom = material.uom
      } else {
        materials.push({
          raw_material_id: material.raw_material_id,
          name: material.name,
          qty: material.qty,
          uom: material.uom
        })
      }
    })

    this.state = {
      materials,
      saving: false
    }

    // Exclude planned materials
    this.rawMaterialsOptions = DailyTasksStore.rawMaterials
                                .filter(rawMaterial => {
                                  return !(this.findMaterial(rawMaterial.id, task.attributes.items))
                                })
                                .map((item, i) => ({ value: item.id, label: item.attributes.name }))

    this.handleQuantityChange = this.handleQuantityChange.bind(this)
    this.handleUomChange = this.handleUomChange.bind(this)
    this.handleItemChange = this.handleItemChange.bind(this)
    this.handleClear = this.handleClear.bind(this)
    this.autoSave = this.autoSave.bind(this)
    this.updateMaterialsUsedInStore = this.updateMaterialsUsedInStore.bind(this)
    this.handleAddMaterial = this.handleAddMaterial.bind(this)
    this.isPlannedMaterial = this.isPlannedMaterial.bind(this)
    this.trySync = this.trySync.bind(this)
  }

  componentWillMount() {
    this.timer = null;
  }

  resetTimer() {
    clearTimeout(this.timer);
    this.timer = setTimeout(this.autoSave, WAIT_INTERVAL);
  }

  findMaterial(itemId, store) {
    return store.find(
      material => (material.raw_material_id == itemId)
    )
  }

  isPlannedMaterial(rawMaterialId) {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    return !!(this.findMaterial(rawMaterialId, task.attributes.items))
  }

  updateMaterialsUsedInStore() {
    const { dailyTask } = this.props
    this.state.materials.map((material, i) => {
      const materialFound = this.findMaterial(material.raw_material_id, dailyTask.attributes.materials_used)

      if (materialFound) {
        materialFound.qty = material.qty
        materialFound.uom = material.uom
      } else {
        dailyTask.attributes.materials_used.push({
          raw_material_id: material.raw_material_id,
          name: material.name,
          qty: material.qty,
          uom: material.uom
        })
      }
    })
  }

  handleQuantityChange(itemId, inputQuantity) {
    const materials = this.state.materials
    const currentItem = this.findMaterial(itemId, materials)

    currentItem.qty = inputQuantity

    this.trySync(materials)
  }

  handleUomChange(itemId, selectedOption) {
    const materials = this.state.materials
    const currentItem = this.findMaterial(itemId, materials)

    currentItem.uom = selectedOption.value

    this.trySync(materials)
  }

  handleItemChange(index, selectedOption) {
    const materials = this.state.materials
    const existingItem = this.findMaterial(selectedOption.value, materials)

    if (existingItem) {
      alert("Material already added into list")
      return false
    }

    materials[index].raw_material_id = selectedOption.value
    materials[index].name = selectedOption.label

    this.trySync(materials)
  }

  handleClear(itemId) {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task
    const materials = this.state.materials
    const defaultItem = this.findMaterial(itemId, task.attributes.items, 'id')
    const currentItem = this.findMaterial(itemId, materials)

    currentItem.qty = ''
    currentItem.uom = defaultItem ? defaultItem.uom : ''

    this.trySync(materials)
  }

  handleDelete(itemId) {
    const currentItem = this.findMaterial(itemId, this.state.materials)
    const materials = this.state.materials.filter(material => material.raw_material_id !== itemId)

    this.trySync(materials)
  }

  trySync(materials) {
    this.setState({ materials })
    this.updateMaterialsUsedInStore()
    this.resetTimer()
  }

  handleAddMaterial() {
    const materials = this.state.materials
    materials.push({
      raw_material_id: '',
      name: '',
      qty: '',
      uom: ''
    })
    this.setState(materials)
  }

  autoSave() {
    const { dailyTask } = this.props
    this.setState({ saving: true })

    updateMaterialsUsed(dailyTask, this.state.materials)
      .then(() => this.setState({ saving: false }))
  }

  render() {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    return (
      <div className="w-100 lh-copy black-60 f6">
        <table className="w-100">
          <tbody>
            <tr className="bb">
              <th>Material Name</th>
              <th width="20%">Qty</th>
              <th width="30%">UOM</th>
              <th />
            </tr>
            {this.state.materials.map((material, i) => (
              <tr className="pointer bb" key={i}>
                <td className="tl pv2 ph3">
                {
                  this.isPlannedMaterial(material.raw_material_id) ? material.name :
                    <Select
                      name="uom"
                      options={this.rawMaterialsOptions}
                      value={{ value: material.raw_material_id, label: material.name }}
                      onChange={selectedOption =>
                        this.handleItemChange(i, selectedOption)
                      }
                    />
                }
                </td>
                <td className="tl pv2 ph3">
                  <input
                    value={material.qty}
                    onChange={e =>
                      this.handleQuantityChange(material.raw_material_id, e.target.value)
                    }
                    onKeyDown={e => {
                      if (e.keyCode === ENTER_KEY) {
                        this.autoSave();
                      }
                    }}
                    className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                    type="number"
                    step=".01"
                  />
                </td>
                <td className="tl pv2 ph3">
                  <Select
                    name="uom"
                    options={uom_dropdown}
                    value={{ value: material.uom, label: material.uom }}
                    onChange={selectedOption =>
                      this.handleUomChange(material.raw_material_id, selectedOption)
                    }
                  />
                </td>
                <td className="tl pv2 ph3">
                  <i
                    className="material-icons red md-18 pointer dim"
                    onClick={() => {
                      this.isPlannedMaterial(material.raw_material_id) ?
                        this.handleClear(material.raw_material_id) : this.handleDelete(material.raw_material_id)
                    }}
                  >
                    delete
                  </i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={this.handleAddMaterial}
          className="ttu pointer di pv3 ph5 bg-orange button--font white bn box--br3"
        >Add Material</button>
        {this.state.saving && <div className="di v-btm pa2">Saving ...</div>}
      </div>
    )
  }
}

export default MaterialUsed
