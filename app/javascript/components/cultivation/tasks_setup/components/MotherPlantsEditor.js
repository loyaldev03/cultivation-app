import React from 'react'
import Select from 'react-select'
import { observer } from 'mobx-react'
import loadPlants from '../../../inventory/plant_setup/actions/loadPlants'
import BatchStore from '../../batches/BatchStore'
import PlantStore from '../../../inventory/plant_setup/store/PlantStore'
import { sumBy, smallSelectStyle, AdjustmentMessage } from '../../../utils'
/**
 * This component is used in special "Clip" task in Task List
 */
@observer
export default class MotherPlantsEditor extends React.Component {
  state = {
    selectedPlantOption: {},
    selectedPlantQuantity: ''
  }
  onSubmit = e => {
    e.preventDefault()
    const { selectedPlantQuantity, selectedPlantOption } = this.state
    if (
      selectedPlantQuantity &&
      selectedPlantOption &&
      selectedPlantOption.value
    ) {
      BatchStore.addPlantToBatch(
        selectedPlantOption.value,
        selectedPlantQuantity
      )
      this.setState({
        selectedPlantOption: {},
        selectedPlantQuantity: ''
      })
    }
  }
  onDelete = plantId => {
    BatchStore.removePlantFromBatch(plantId)
  }
  onSelectPlant = plantOption => {
    this.setState({
      selectedPlantOption: plantOption
    })
  }
  validate = () => {
    if (
      BatchStore.batch &&
      BatchStore.batch.quantity &&
      BatchStore.batch.selected_plants
    ) {
      const total = sumBy(BatchStore.batch.selected_plants, 'quantity')
      return total === BatchStore.batch.quantity
    } else {
      return false
    }
  }
  async componentDidMount() {
    const { batchId, facilityStrainId } = this.props
    await Promise.all([
      BatchStore.loadBatch(batchId),
      loadPlants('mother', facilityStrainId)
    ])
  }
  render() {
    const { className = '' } = this.props
    const { selectedPlantOption, selectedPlantQuantity } = this.state
    if (BatchStore.isLoading) {
      return <div className={`${className}`}>Loading..</div>
    }
    if (!BatchStore.isDataLoaded) {
      return <div className={`${className}`}>Loading...</div>
    }
    const totalSelected = sumBy(BatchStore.batch.selected_plants, 'quantity')
    return (
      <form className={`${className}`} onSubmit={this.onSubmit}>
        <div className="mb1 f6 fw6 flex justify-between items-center">
          <span className="grey">Mother Plant(s)</span>
          <span className="grey">
            Quantity Needed: {BatchStore.batch.quantity}
          </span>
        </div>
        <AdjustmentMessage
          value={totalSelected}
          total={BatchStore.batch.quantity}
        />
        <table className="mt1 w-100 f6 fw6 gray ba b--light-grey collapse">
          <tbody>
            <tr>
              <td className="pa1 bb b--light-grey w4">Plant Id</td>
              <td className="pa1 bb b--light-grey w4 tr">#</td>
              <td className="pa1 bb b--light-grey">Location</td>
              <td className="pa1 bb b--light-grey" />
            </tr>
            {BatchStore.batch.selected_plants.map(p => {
              const plant = PlantStore.getPlantById(p.plant_id)
              if (plant && p) {
                return (
                  <tr key={p.plant_id}>
                    <td className="pa1">{plant.attributes.plant_id}</td>
                    <td className="pa1 tr">{p.quantity}</td>
                    <td className="pa1">{plant.attributes.location_name}</td>
                    <td className="pa1 flex justify-center">
                      <i
                        title="Delete"
                        className="material-icons icon--small pointer"
                        onClick={() => this.onDelete(p.plant_id)}
                      >
                        delete_outline
                      </i>
                    </td>
                  </tr>
                )
              }
            })}
            <tr>
              <td className="pa1">
                <Select
                  styles={smallSelectStyle}
                  value={selectedPlantOption}
                  options={PlantStore.getPlantsOptions()}
                  onChange={this.onSelectPlant}
                />
              </td>
              <td className="pa1 tr">
                <input
                  type="number"
                  value={selectedPlantQuantity}
                  onChange={e =>
                    this.setState({ selectedPlantQuantity: e.target.value })
                  }
                  className="w3 tr pa1 br2 ba b--light-grey"
                  min="1"
                  required={true}
                  onKeyPress={this.handleKeyPress}
                />
              </td>
              <td />
              <td className="pa1 tc">
                <button type="submit" className="bg-transparent bn pa2 pointer">
                  <i className="material-icons icon--small green pointer db">
                    add
                  </i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="tr pb1">
                Total: {totalSelected}
              </td>
              <td colSpan="2" />
            </tr>
          </tfoot>
        </table>
      </form>
    )
  }
}
