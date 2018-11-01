import 'babel-polyfill'
import React from 'react'
import BatchPlantSelectionList from './BatchPlantSelectionList'
import BatchLocationEditor from './BatchLocationEditor'
import {
  Modal,
  sumBy,
  formatDate,
  httpPostOptions,
  ImgPlantGrowth,
  GROWTH_PHASE
} from '../../utils'

const AdjustmentMessage = React.memo(({ value, total }) => {
  if (value >= 0 && value < total) {
    const res = +total - +value
    return (
      <div className="dib bg-light-yellow ml2 pa2 ba br2 b--light-yellow grey w4 tc">
        You need to select <span className="fw6 dark-grey">{res}</span> more!
      </div>
    )
  }
  if (value > 0 && value > total) {
    const res = +value - +total
    return (
      <div className="dib bg-washed-red ml2 pa2 ba br2 b--washed-red grey w4 tc">
        You need to remove <span className="fw6 dark-grey">{res}</span> plant.
      </div>
    )
  }
  return null
})

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

  onClickSelectionEdit = (phase, plant = null) => {
    const editingPlant = plant ? this.getSelected(plant.id) : null
    if (editingPlant) {
      this.setState({ editingPlant })
    } else {
      // If plant is not previously selected. Create an object for the sidebar
      if (plant) {
        this.setState({
          editingPlant: {
            id: plant.id,
            serialNo: plant.attributes.plant_id,
            quantity: 0,
            phase
          }
        })
      } else {
        const plantsInPhase = this.getBookingsByPhase(phase)
        const plantCount = plantsInPhase.length + 1
        const plantId = `${phase}#${plantCount}`
        this.setState({
          editingPlant: {
            id: plantId, // Use phase as id
            serialNo: plantCount,
            quantity: 0,
            phase
          }
        })
      }
    }
    window.editorSidebar.open({ width: '560px' })
  }

  getSelected = plantId => {
    let plant = this.state.selectedPlants.find(b => b.id === plantId)
    return plant
  }

  getBookingsByPhase = phase => {
    return this.state.selectedPlants.filter(
      b => b.phase === phase && b.quantity > 0
    )
  }

  onButtonClick = (field, value) => e => this.setState({ [field]: value })

  onEditorSave = editingPlant => {
    // console.log('onEditorSave.editingPlant', editingPlant)
    // find and update the existing record
    const plantConfig = this.getSelected(editingPlant.id)

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
  getAvailableLocations = (plantId, phase) => {
    // console.log('getAvailableLocations:', phase)
    const { selectedPlants, locations } = this.state
    const allPlantsTrays = selectedPlants
      .filter(p => p.id !== plantId)
      .reduce((acc, val) => acc.concat(val.trays || []), [])
    const remainingLocations = locations
      .filter(loc => loc.tray_purpose === phase)
      .map(loc => {
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
      // toast('Please select plants & locations to continue.', 'warning')
      // Plants Location & Quantity is required
      return true
    }

    const { quantity } = this.props.batchInfo
    const selectedCloneQuantity = sumBy(
      this.getBookingsByPhase(GROWTH_PHASE.CLONE),
      'quantity'
    )
    const selectedVeg1Quantity = sumBy(
      this.getBookingsByPhase(GROWTH_PHASE.VEG1),
      'quantity'
    )
    const selectedVeg2Quantity = sumBy(
      this.getBookingsByPhase(GROWTH_PHASE.VEG2),
      'quantity'
    )
    const selectedFlowerQuantity = sumBy(
      this.getBookingsByPhase(GROWTH_PHASE.FLOWER),
      'quantity'
    )
    const selectedDryQuantity = sumBy(
      this.getBookingsByPhase(GROWTH_PHASE.DRY),
      'quantity'
    )
    const selectedCureQuantity = sumBy(
      this.getBookingsByPhase(GROWTH_PHASE.CURE),
      'quantity'
    )
    if (
      selectedCloneQuantity === quantity &&
      selectedVeg1Quantity === quantity &&
      selectedVeg2Quantity === quantity &&
      selectedFlowerQuantity === quantity &&
      selectedDryQuantity === quantity &&
      selectedCureQuantity === quantity
    ) {
      return false
    } else {
      return true
    }
  }

  locationResolver = (locationType, id) => {
    if (!id || !locationType) {
      return { error: 'Invalid Location Type or ID' }
    }
    const found = this.props.locations.find(x => x[locationType + '_id'] === id)
    return found ? found : { error: 'Invalid Location' }
  }

  onSubmit = async () => {
    this.setState({ isLoading: true })
    const { id } = this.props.batchInfo
    const payload = {
      plans: this.state.selectedPlants
    }
    try {
      await fetch(
        `/api/v1/batches/${id}/update_locations`,
        httpPostOptions(payload)
      )
      // navigate to next page
      window.location.replace('/cultivation/batches/' + id)
    } catch (error) {
      console.error(error)
    } finally {
      this.setState({ isLoading: false })
    }
  }

  renderBookingsForPhase = (phase, quantity = 0, plantType = '') => {
    const bookings = this.getBookingsByPhase(phase)
    const selectedCapacity = sumBy(bookings, 'quantity')
    const isBalance = quantity === selectedCapacity && quantity > 0
    return (
      <React.Fragment>
        <div className="flex items-center pb2">
          <span className="dib ttu f2 fw6 pb2 dark-grey w4">{phase}</span>
          <AdjustmentMessage value={selectedCapacity} total={quantity} />
        </div>
        <BatchPlantSelectionList
          onEdit={this.onClickSelectionEdit}
          bookings={bookings}
          quantity={quantity}
          plantType={plantType}
          phase={phase}
          getSelected={this.getSelected}
          isBalance={isBalance}
          locationResolver={this.locationResolver}
        />
      </React.Fragment>
    )
  }

  render() {
    const { batchInfo } = this.props
    const { isLoading, isNotified, editingPlant } = this.state
    const isFirstBalance = isNotified
      ? true
      : batchInfo.quantity ===
        sumBy(this.getBookingsByPhase(GROWTH_PHASE.CLONE), 'quantity')
    // console.log('batchInfo', batchInfo)
    // console.log('editingPlant', editingPlant)
    // console.log('isDisabled', this.isDisableNext())
    const isDisableSubmit = this.isDisableNext()
    return (
      <div className="fl w-100 ma4 pa4 bg-white cultivation-setup-container">
        <div id="toast" className="toast" />
        <form
          onSubmit={async e => {
            e.preventDefault()
            if (!isDisableSubmit) {
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
          <div className="mt3">
            {this.renderBookingsForPhase(
              GROWTH_PHASE.CLONE,
              batchInfo.quantity,
              batchInfo.cloneSelectionType
            )}
          </div>

          {isNotified && (
            <React.Fragment>
              <div className="mt4">
                {this.renderBookingsForPhase(
                  GROWTH_PHASE.VEG1,
                  batchInfo.quantity
                )}
              </div>

              <div className="mt4">
                {this.renderBookingsForPhase(
                  GROWTH_PHASE.VEG2,
                  batchInfo.quantity
                )}
              </div>

              <div className="mt4">
                {this.renderBookingsForPhase(
                  GROWTH_PHASE.FLOWER,
                  batchInfo.quantity
                )}
              </div>

              <div className="mt4">
                {this.renderBookingsForPhase(
                  GROWTH_PHASE.DRY,
                  batchInfo.quantity
                )}
              </div>

              <div className="mt4">
                {this.renderBookingsForPhase(
                  GROWTH_PHASE.CURE,
                  batchInfo.quantity
                )}
              </div>
            </React.Fragment>
          )}

          {isFirstBalance && (
            <Modal
              show={!isNotified}
              render={() => (
                <div className="w-100 w-80-m w-60-l h-100 center flex flex-column items-center justify-center">
                  <div className="shadow-1 br2">
                    <div className="h5 bg-orange w-100 flex justify-center">
                      <img src={ImgPlantGrowth} />
                    </div>
                    <div className="bg-white w-100 pa3 tc">
                      <p className="f3 fw6 dark-grey ma3">
                        All set up on cloning stage! Just one more thing...
                      </p>
                      <p className="grey ph5">
                        Proceed to configure location for next phase. Proceed to
                        configure location for next phaseProceed to configure
                        location for next phaseProceed to configure location for
                        next phase
                      </p>
                      <a
                        href="#0"
                        onClick={this.onButtonClick('isNotified', true)}
                        className="btn btn--primary btn--large"
                      >
                        OK, GOT IT!
                      </a>
                    </div>
                  </div>
                </div>
              )}
            />
          )}

          <div className="pt4">
            <input
              disabled={isDisableSubmit}
              type="submit"
              className="btn btn--primary btn--large"
              value={isLoading ? 'Saving...' : 'Save & Continue'}
            />
            <a
              href={`/cultivation/batches/${this.props.batchInfo.id}`}
              className="link orange tr dib pa3 fr"
            >
              SKIP - TODO: REMOVE THIS
            </a>
          </div>
        </form>

        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {editingPlant.id && (
              <BatchLocationEditor
                key={editingPlant.id}
                plantConfig={editingPlant}
                locations={this.getAvailableLocations(
                  editingPlant.id,
                  editingPlant.phase
                )}
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
