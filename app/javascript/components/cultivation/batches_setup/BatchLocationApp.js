import 'babel-polyfill'
import React from 'react'
import BatchPlantSelectionList from './BatchPlantSelectionList'
import BatchLocationEditor from './BatchLocationEditor'
import { sumBy } from '../../utils/ArrayHelper'
import { toast } from './../../utils/toast'
import { submitBatchLocations } from '../actions/submitBatchLocations'

class BatchLocationApp extends React.Component {
  state = {
    isLoading: false,
    selectedPlants: [],
    editingPlant: {},
    totalAvailableCapacity: sumBy(this.props.locations, 'remaining_capacity'),
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
    const editingPlant = this.getSelected(plantId)
    this.setState({ editingPlant })
    window.editorSidebar.open({ width: '500px' })
  }

  getSelected = plantId => {
    const found = this.state.selectedPlants.find(x => x.id === plantId)
    return found
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onEditorSave = plantConfig => {
    // find and update the corresponding record in memory
    const found = this.getSelected(plantConfig.id)
    found.quantity = plantConfig.quantity
    found.trays = plantConfig.trays
    const selectedPlants = this.state.selectedPlants.map(
      x => (x.id === found.id ? found : x)
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
    if (!this.state.quantity) {
      // Quantity is required
      return true
    }
    if (!this.state.selectedPlants || !this.state.selectedPlants.length) {
      toast('Please select plants & locations to continue.', 'warning')
      // Plants Location & Quantity is required
      return true
    }
    const totalSelectedQuantity = sumBy(this.state.selectedPlants, 'quantity')
    if (parseInt(this.state.quantity) !== totalSelectedQuantity) {
      toast(
        '"Total Quantity Selected" does not match "Quantity Needed".',
        'warning'
      )
      // Total quanty has to match with needed quantity
      return true
    }
    // if there's a missing data, disable next step
    const missed = this.state.selectedPlants.find(x => !x.quantity || !x.trays)
    return !!missed
  }

  onSubmit = async () => {
    this.setState({ isLoading: true })
    // TODO: Submit selected plants's quantity & locations
    const locations = this.state.selectedPlants.reduce(
      (acc, val) => acc.concat(val.trays || []),
      []
    )

    // Calling the update_location api
    const payload = {
      batch_id: this.props.batchId,
      locations
    }

    try {
      const response = await (await fetch(
        `/api/v1/batches/${this.props.batchId}/update_locations`,
        {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )).json()
      console.log('onSubmit::update_locations:', response)
    } catch (error) {
      console.error('onSubmit::update_locations:', error)
    }
    this.setState({ isLoading: false })

    // TODO: Navigate to next page
    // window.location.replace('/cultivation/batches/' + this.props.batchId)
  }

  renderClonesFromMother = (plantType, selectedPlants) => (
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
    </React.Fragment>
  )

  render() {
    const { plantType, batchSource } = this.props
    const {
      isLoading,
      editingPlant,
      selectedPlants,
      totalAvailableCapacity
    } = this.state

    // build available locations, taking out capacity occupied by different rows
    const availableLocations = this.getAvailableLocations(editingPlant.id)

    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <form
          onSubmit={async e => {
            e.preventDefault()
            if (!this.isDisableNext()) {
              this.onSubmit()
            }
          }}
        >
          <div className="dark-grey mb2">
            <span className="w5 dib">Available Capacity</span>
            <input
              className="dib w4 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tr"
              type="number"
              value={totalAvailableCapacity}
              readOnly
            />
          </div>
          <div className="dark-grey mb2">
            <span className="w5 dib">Quantity Needed</span>
            <input
              className="dib w4 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tr"
              type="number"
              onChange={this.onChangeInput('quantity')}
              required
              min={1}
              max={totalAvailableCapacity}
            />
          </div>
          <div className="dark-grey mb4">
            <span className="w5 dib">Total Quantity Selected</span>
            <input
              className="dib w4 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tr"
              type="number"
              value={sumBy(selectedPlants, 'quantity')}
              readOnly
            />
          </div>
          {batchSource === 'clones_from_mother' &&
            this.renderClonesFromMother(plantType, selectedPlants)}
          <div className="pv2 w4">
            <input
              type="submit"
              className="pv2 ph3 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
              value={isLoading ? 'Saving...' : 'Save & Continue'}
            />
          </div>
        </form>

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
      </React.Fragment>
    )
  }
}

export default BatchLocationApp
