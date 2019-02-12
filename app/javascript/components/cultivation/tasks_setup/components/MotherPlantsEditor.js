import React from 'react'
import Select from 'react-select'
import { observer } from 'mobx-react'
import loadPlants from '../../../inventory/plant_setup/actions/loadPlants'
import BatchStore from '../../batches/BatchStore'
import PlantStore from '../../../inventory/plant_setup/store/PlantStore'
import { sumBy, smallSelectStyle } from '../../../utils'
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
    console.log('onDelete', plantId)
    BatchStore.removePlantFromBatch(plantId)
  }
  onSelectPlant = plantOption => {
    this.setState({
      selectedPlantOption: plantOption
    })
  }
  async componentDidMount() {
    const { batchId, facilityStrainId } = this.props
    await Promise.all([
      BatchStore.loadBatch(batchId),
      loadPlants('mother', facilityStrainId)
    ])
  }
  render() {
    const { quantityRequired, className = '' } = this.props
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
        {this.props.renderLabel(this.props)}
        <SmallAdjustmentMessage value={totalSelected} total={quantityRequired} />
        <table className="w-100 f6 fw6 gray ba b--light-grey collapse">
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
                        className="material-icons icon--small red pointer"
                        onClick={() => this.onDelete(p.plant_id)}
                      >
                        delete
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

const SmallAdjustmentMessage = React.memo(({ value, total }) => {
  if (value >= 0 && value < total) {
    const res = +total - +value
    return (
      <div className="dib bg-light-yellow pa2 ba br2 b--light-yellow grey w-4 mb1 tc">
        You need to select <span className="fw6 dark-grey">{res}</span> more!
      </div>
    )
  }
  if (value > 0 && value > total) {
    const res = +value - +total
    return (
      <div className="dib bg-washed-red pa2 ba br2 b--washed-red grey w-4 mb1 tc">
        You need to remove <span className="fw6 dark-grey">{res}</span> plant(s).
      </div>
    )
  }
  return null
})
