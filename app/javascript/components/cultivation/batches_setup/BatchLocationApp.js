import 'babel-polyfill'
import { toJS } from 'mobx'
import React from 'react'
import BatchPlantSelectionList from './BatchPlantSelectionList'
import BatchLocationEditor from './BatchLocationEditor'
import {
  Modal,
  sumBy,
  formatDate,
  httpPostOptions,
  BATCH_SOURCE,
  GROWTH_PHASE
} from '../../utils'
import { toast } from './../../utils/toast'

const AdjustmentMessage = ({ value, total }) => {
  if (value >= 0 && value < total) {
    const res = +total - +value
    return (
      <div className="bg-light-yellow pa2 ba br2 b--light-yellow grey w4 tc">
        You need to select <span className="fw6 dark-grey">{res}</span> more!
      </div>
    )
  }
  if (value > 0 && value > total) {
    const res = +value - +total
    return (
      <div className="bg-washed-red pa2 ba br2 b--washed-red grey w4 tc">
        You need to remove <span className="fw6 dark-grey">{res}</span> plant.
      </div>
    )
  }
  return null
}

class BatchLocationApp extends React.Component {
  state = {
    isLoading: false,
    isNotified: false,
    selectedPlants: [],
    editingPlant: {},
    locations: this.props.locations || []
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

  onClickSelectionEdit = plant => {
    // console.log('onClickSelectionEdit', toJS(plant))
    const editingPlant = this.getSelected(plant.id)
    if (editingPlant) {
      this.setState({ editingPlant })
    } else {
      this.setState({
        editingPlant: {
          id: plant.id,
          serialNo: plant.attributes.plant_id,
          quantity: 0
        }
      })
    }
    window.editorSidebar.open({ width: '500px' })
  }

  getSelected = plantId => {
    // console.log('this.state.selectedPlants')
    // console.log(this.state.selectedPlants)
    let plant = this.state.selectedPlants.find(x => x.id === plantId)
    return plant
  }

  onButtonClick = (field, value) => e => this.setState({ [field]: value })

  onEditorSave = editingPlant => {
    console.log('onEditorSave.editingPlant', editingPlant)
    // find and update the existing record
    let plantConfig = this.getSelected(editingPlant.id)
    if (plantConfig) {
      plantConfig.quantity = editingPlant.quantity
      plantConfig.trays = editingPlant.trays
      const selectedPlants = this.state.selectedPlants.map(
        x => (x.id === plantConfig.id ? plantConfig : x)
      )
      this.setState({
        selectedPlants
      })
    } else {
      this.setState({
        selectedPlants: [...this.state.selectedPlants, editingPlant]
      })
    }
    this.closeSidebar()
  }

  // Build available locations, taking out capacity occupied by different rows
  getAvailableLocations = (plantId, locationPurpose = '') => {
    // TODO: Filter available location by purpose
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
    const locations = this.state.selectedPlants.reduce(
      (acc, val) => acc.concat(val.trays || []),
      []
    )

    try {
      await fetch(
        `/api/v1/batches/${this.props.batchInfo.id}/update_locations`,
        httpPostOptions(locations)
      )
      // navigate to next page
      window.location.replace('/cultivation/batches/' + this.props.batchId)
    } catch (error) {
      console.error(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  renderSelectLocation = (plantType, plantPhase, selectedPlants, isBalance) => (
    <React.Fragment>
      <span className="dib ttu f2 fw6 pb2 dark-grey">{plantPhase}</span>
      <BatchPlantSelectionList
        onEdit={this.onClickSelectionEdit}
        selectedPlants={selectedPlants}
        plantType={plantType}
        getSelected={this.getSelected}
        isBalance={isBalance}
      />
    </React.Fragment>
  )

  renderClonesFromMother = (plantType, selectedPlants, isBalance) => (
    <BatchPlantSelectionList
      onEdit={this.onClickSelectionEdit}
      selectedPlants={selectedPlants}
      plantType={plantType}
      getSelected={this.getSelected}
      isBalance={isBalance}
    />
  )

  renderClonesFromPurchased = (plantType, selectedPlants, isBalance) => (
    <BatchPlantSelectionList
      onEdit={this.onClickSelectionEdit}
      selectedPlants={selectedPlants}
      plantType={plantType}
      getSelected={this.getSelected}
      isBalance={isBalance}
    />
  )

  renderClonesFromSeeds = (plantType, selectedPlants, isBalance) => (
    <BatchPlantSelectionList
      onEdit={this.onClickSelectionEdit}
      selectedPlants={selectedPlants}
      plantType={plantType}
      getSelected={this.getSelected}
      isBalance={isBalance}
    />
  )

  render() {
    const { batchInfo } = this.props
    const { isLoading, isNotified, editingPlant, selectedPlants } = this.state

    console.log('batchInfo', batchInfo)
    console.log('editingPlant', editingPlant)

    const selectedCapacity = sumBy(selectedPlants, 'quantity')
    const isBalance = batchInfo.quantity === selectedCapacity
    return (
      <div className="fl w-100 ma4 pa4 bg-white cultivation-setup-container">
        <div id="toast" className="toast" />
        <form
          onSubmit={async e => {
            e.preventDefault()
            if (!this.isDisableNext()) {
              this.onSubmit()
            }
          }}
        >
          <div className="grey mb2">
            <span className="w-30 dib">Quantity Needed</span>
            <span className="w-40 dib">Strain</span>
            <span className="w-30 dib">Estimated Harvest Date</span>
          </div>
          <div className="dark-grey mb2">
            <span className="w-30 dib f2 fw6">{batchInfo.quantity}</span>
            <span className="w-40 dib f2 fw6">
              {batchInfo.strainDisplayName}
            </span>
            <span className="w-30 dib f2 fw6">
              {formatDate(batchInfo.harvestDate)}
            </span>
          </div>
          <AdjustmentMessage
            value={selectedCapacity}
            total={batchInfo.quantity}
          />
          <div className="mt3">
            {this.renderSelectLocation(
              batchInfo.cloneSelectionType,
              GROWTH_PHASE.CLONE,
              selectedPlants,
              isBalance
            )}
          </div>

          {isBalance && (
            <Modal
              show={!isNotified}
              render={() => (
                <div className="w-100 w-80-m w-60-l h-100 center flex flex-column items-center justify-center">
                  <div className="shadow-1 br2">
                    <div className="h5 bg-orange w-100" />
                    <div className="bg-white w-100 pa3 tc">
                      <p className="f4 fw6 dark-grey ma3">
                        All set up on cloning stage! Just one more thing...
                      </p>
                      <p className="grey">
                        Proceed to configure location for next phase. Proceed to
                        configure location for next phaseProceed to configure
                        location for next phaseProceed to configure location for
                        next phase
                      </p>
                      <a
                        href="#0"
                        onClick={this.onButtonClick('isNotified', true)}
                        className="dib pv2 ph3 bg-orange white bn br2 ttu tc tracked link dim f6 fw6 pointer"
                      >
                        OK, GOT IT!
                      </a>
                    </div>
                  </div>
                </div>
              )}
            />
          )}

          <div className="mt3 pv2 w4">
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
                locations={this.getAvailableLocations(editingPlant.id)}
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
