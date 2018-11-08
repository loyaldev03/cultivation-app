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

const WAIT_INTERVAL = 1000
const ENTER_KEY = 13

@observer
class MaterialUsed extends React.Component {
  constructor(props) {
    const { dailyTask } = props
    const task = dailyTask.attributes.task

    // console.log(toJS(dailyTask))
    super(props)

    const materials = []
    // Initialize materials used data (item ID, name) from planned materials
    task.attributes.items.map((item, i) => {

      materials.push({
        task_item_id: item.id,
        catalogue_id: item.catalogue_id,
        name: item.name,
        qty: '',
        uom: item.uom,
        uoms: item.uoms.map(x => ({ value: x, label: x })),
      })
    })
    // Overwrite materials used data from store
    dailyTask.attributes.materials_used.map((material, i) => {
      const materialFound = this.findMaterial(material.catalogue_id, materials)
      if (materialFound) {
        materialFound.qty = material.qty || ''
        materialFound.uom = material.uom || ''
      } else {
        materials.push({
          catalogue_id: material.catalogue_id,
          name: material.name || '',
          qty: material.qty || '',
          uom: material.uom || '',
          uoms: material.uoms.map(x => ({ value: x, label: x }))
        })
      }
    })

    this.state = {
      materials,
      saving: false
    }

    // Exclude planned materials
    this.rawMaterialsOptions = DailyTasksStore.inventoryCatalogue
      .filter(catalogue => {
        return !this.findMaterial(catalogue.id, task.attributes.items)
      })
      .map((catalogue, i) => ({
        value: catalogue.id,
        label: catalogue.attributes.name
      }))
  }

  componentWillMount() {
    this.timer = null
  }

  resetTimer() {
    clearTimeout(this.timer)
    this.timer = setTimeout(this.autoSave, WAIT_INTERVAL)
  }

  findMaterial(catalogueId, store) {
    return store.find(material => material.catalogue_id == catalogueId)
  }

  isPlannedMaterial = catalogueId => {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    return !!this.findMaterial(catalogueId, task.attributes.items)
  }

  updateMaterialsUsedInStore() {
    const { dailyTask } = this.props
    this.state.materials.map((material, i) => {
      const materialFound = this.findMaterial(
        material.catalogue_id,
        dailyTask.attributes.materials_used
      )

      if (materialFound) {
        materialFound.qty = material.qty
        materialFound.uom = material.uom
      } else {
        dailyTask.attributes.materials_used.push({
          catalogue_id: material.catalogue_id,
          name: material.name,
          qty: material.qty,
          uom: material.uom
        })
      }
    })
  }

  handleQuantityChange = (catalogueId, inputQuantity) => {
    const materials = this.state.materials
    const currentItem = this.findMaterial(catalogueId, materials)

    currentItem.qty = inputQuantity

    this.trySync(materials)
  }

  handleUomChange = (catalogueId, selectedOption) => {
    const materials = this.state.materials
    const currentItem = this.findMaterial(catalogueId, materials)

    currentItem.uom = selectedOption.value

    this.trySync(materials)
  }

  handleItemChange = (index, selectedOption) => {
    const materials = this.state.materials
    const existingItem = this.findMaterial(selectedOption.value, materials)

    if (existingItem) {
      alert('Material already added into list')
      return false
    }

    materials[index].catalogue_id = selectedOption.value
    materials[index].name = selectedOption.label

    this.trySync(materials)
  }

  handleClear = catalogueId => {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task
    const materials = this.state.materials
    const defaultItem = this.findMaterial(
      catalogueId,
      task.attributes.items,
      'id'
    )
    const currentItem = this.findMaterial(catalogueId, materials)

    currentItem.qty = ''
    currentItem.uom = defaultItem ? defaultItem.uom : ''

    this.trySync(materials)
  }

  handleDelete = catalogueId => {
    const currentItem = this.findMaterial(catalogueId, this.state.materials)
    const materials = this.state.materials.filter(
      material => material.catalogue_id !== catalogueId
    )

    this.trySync(materials)
  }

  trySync = materials => {
    this.setState({ materials })
    this.updateMaterialsUsedInStore()
    this.resetTimer()
  }

  handleAddMaterial = () => {
    const materials = this.state.materials
    materials.push({
      catalogue_id: '',
      name: '',
      qty: '',
      uom: ''
    })
    this.setState(materials)
  }

  autoSave() {
    // const { dailyTask } = this.props
    // this.setState({ saving: true })
    // updateMaterialsUsed(dailyTask, this.state.materials).then(() =>
    //   this.setState({ saving: false })
    // )
  }

  onSave = () => {
    const { dailyTask } = this.props
    this.setState({ saving: true })

    updateMaterialsUsed(dailyTask, this.state.materials).then(() =>
      this.setState({ saving: false })
    )
  }

  render() {
    const { dailyTask } = this.props
    const task = dailyTask.attributes.task

    return (
      <div className="w-100 lh-copy black-60 f6">
        <table className="w-100">
          <tbody>
            <tr className="bb">
              <th width="45%" className="tl">
                Material Name
              </th>
              <th width="20%">Qty</th>
              <th width="20%">UOM</th>
              <th width="5%" />
            </tr>
            {this.state.materials.map((material, i) => (
              <tr className="pointer bb" key={i}>
                <td className="tl pv2 pr2">
                  {this.isPlannedMaterial(material.catalogue_id) ? (
                    material.name
                  ) : (
                    <Select
                      name="uom"
                      options={this.rawMaterialsOptions}
                      value={{
                        value: material.catalogue_id,
                        label: material.name
                      }}
                      onChange={selectedOption =>
                        this.handleItemChange(i, selectedOption)
                      }
                    />
                  )}
                </td>
                <td className="tl pv2 ph2">
                  <input
                    value={material.qty}
                    onChange={e =>
                      this.handleQuantityChange(
                        material.catalogue_id,
                        e.target.value
                      )
                    }
                    onKeyDown={e => {
                      if (e.keyCode === ENTER_KEY) {
                        this.autoSave()
                      }
                    }}
                    className="db w-100 pa2 f6 tr black ba b--black-20 br2 outline-0 no-spinner"
                    type="number"
                    step=".01"
                  />
                </td>
                <td className="tl pv2 ph2">
                  <Select
                    name="uom"
                    options={material.uoms}
                    value={{ value: material.uom, label: material.uom }}
                    onChange={selectedOption =>
                      this.handleUomChange(
                        material.catalogue_id,
                        selectedOption
                      )
                    }
                  />
                </td>
                <td className="tr pv2">
                  <i
                    className="material-icons red md-18 pointer dim"
                    onClick={() => {
                      this.isPlannedMaterial(material.catalogue_id)
                        ? this.handleClear(material.catalogue_id)
                        : this.handleDelete(material.catalogue_id)
                    }}
                  >
                    delete
                  </i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex flex-row justify-end">
          {this.state.saving && <div className="di v-btm pa2">Saving ...</div>}
          <button
            onClick={this.handleAddMaterial}
            className="ttu pointer di pv2 ph3 btn--secondary mt3 br2"
          >
            Add Material
          </button>
          <button
            onClick={this.onSave}
            className="ttu pointer di pv2 ph3 btn--primary mt3 ml3 br2"
          >
            Save
          </button>
        </div>
      </div>
    )
  }
}

export default MaterialUsed
