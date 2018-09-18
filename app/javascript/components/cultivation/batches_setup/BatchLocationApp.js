import React from 'react'
import BatchPlantSelectionList from './BatchPlantSelectionList'
import BatchLocationEditor from './BatchLocationEditor'
import { sumBy } from '../../utils/ArrayHelper'

class BatchLocationApp extends React.Component {
  state = {
    fromMotherPlant: true,
    selectedPlants: [],
    editingPlant: {},
    locations: this.props.locations
  }

  componentDidMount() {
    // Setup sidebar editor
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
  }

  closeSidebar = () => {
    this.setState({
      editingPlant: {}
    })
    window.editorSidebar.close()
  }

  onSelectPlant = serialNo => e => {
    const plantId = e.target.value
    const found = this.getSelected(plantId)
    if (e.target.checked && !found) {
      const plant = { id: plantId, serialNo, quantity: 0 }
      this.setState({
        selectedPlants: [...this.state.selectedPlants, plant]
      })
    } else if (found) {
      this.setState({
        selectedPlants: this.state.selectedPlants.filter(x => x.id !== plantId)
      })
    }
    // Close the sidebar when user changing selected plant
    this.closeSidebar()
  }

  onClickSelectionEdit = plantId => {
    this.setState({
      editingPlant: this.getSelected(plantId)
    })
    window.editorSidebar.open({ width: '500px' })
  }

  getSelected = plantId => {
    const found = this.state.selectedPlants.find(x => x.id === plantId)
    return found
  }

  onEditorSave = plantConfig => {
    // find and update the corresponding record in memory
    const found = this.getSelected(plantConfig.id)
    found.quantity = plantConfig.quantity
    found.trays = plantConfig.trays
    const selectedPlants = this.state.selectedPlants.map(
      x => (x.id === plantConfig.id ? plantConfig : x)
    )
    this.setState({
      selectedPlants
    })
  }

  getAvailableLocations = plantId => {
    const { selectedPlants, locations } = this.state
    const allPlantsTrays = selectedPlants
      .filter(p => p.id !== plantId)
      .reduce((acc, val) => acc.concat(val.trays || []), [])
    const remainingLocations = locations.map(loc => {
      const found = allPlantsTrays.filter(t => t.tray_id === loc.tray_id)
      if (found && found.length > 0) {
        const newTrayPlannedCapacity =
          parseInt(loc.planned_capacity) + sumBy(found, 'tray_capacity')
        const newLoc = {
          ...loc,
          planned_capacity: newTrayPlannedCapacity,
          remaining_capacity:
            parseInt(loc.tray_capacity) - newTrayPlannedCapacity
        }
        return newLoc
      }
      return loc
    })
    return remainingLocations
  }

  isDisableNext = () => {
    if (!this.state.selectedPlants || !this.state.selectedPlants.length) {
      return true
    }
    // if there's a missing data, disable next step
    const missed = this.state.selectedPlants.find(x => !x.quantity || !x.trays)
    return !!missed
  }

  gotoNext = () => {
    window.location.replace('/cultivation/batches/' + this.props.batchId)
  }

  render() {
    const plantType = this.props.plantType
    const { editingPlant, selectedPlants } = this.state
    const availableLocations = this.getAvailableLocations(editingPlant.id)
    return (
      <div>
        {this.state.fromMotherPlant && (
          <React.Fragment>
            <span className="db dark-grey mb2">
              Please select the mother plant source:
            </span>
            <BatchPlantSelectionList
              onEdit={this.onClickSelectionEdit}
              selectedPlants={selectedPlants}
              plantType={plantType}
              getSelected={this.getSelected}
              onSelectPlant={this.onSelectPlant}
            />
            <div className="pv2">
              <button
                className="btn"
                disabled={this.isDisableNext()}
                onClick={this.gotoNext}
              >
                Next
              </button>
            </div>
          </React.Fragment>
        )}

        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {editingPlant.id && (
              <BatchLocationEditor
                key={editingPlant.id}
                plant={editingPlant}
                locations={availableLocations}
                onSave={this.onEditorSave}
                onClose={this.closeSidebar}
              />
            )}
          </div>
        </div>
      </div>
    )
  }
}

export default BatchLocationApp
