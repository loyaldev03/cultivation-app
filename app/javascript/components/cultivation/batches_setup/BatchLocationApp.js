import classNames from 'classnames'
import React from 'react'
import BatchPlantSelectionList from './BatchPlantSelectionList'
import BatchLocationEditor from './BatchLocationEditor'
import isEmpty from 'lodash.isempty'
import {
  Modal,
  sumBy,
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
        You need to remove <span className="fw6 dark-grey">{res}</span> tray(s)
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
    quantity: this.props.batchInfo.quantity || '',
    locations: this.props.locations || []
  }

  componentDidMount() {
    // Setup sidebar editor
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
    setTimeout(() => {
      const hasStartDate = window.location.href.includes('start_date')
      const hasQuantity = window.location.href.includes('quantity')
      if (hasStartDate && hasQuantity) {
        const firstPhase = this.props.phases[0]
        this.onClickSelectionEdit(firstPhase)
      }
    })
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
    // find and update the existing record
    const plantConfig = this.getSelected(editingPlant.id)

    if (plantConfig) {
      plantConfig.quantity = editingPlant.quantity
      plantConfig.trays = editingPlant.trays
      const selectedPlants = this.state.selectedPlants.map(x =>
        x.id === plantConfig.id ? plantConfig : x
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
    const { selectedPlants, locations } = this.state
    const allPlantsTrays = selectedPlants
      .filter(p => p.id !== plantId)
      .reduce((acc, val) => acc.concat(val.trays || []), [])
    const remainingLocations = locations
      .filter(loc => loc.tray_purpose === phase)
      .map(loc => {
        const found = allPlantsTrays.filter(t => t.tray_id === loc.tray_id)
        if (isEmpty(found)) {
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

  isDisableNext = phases => {
    if (isEmpty(this.state.selectedPlants)) {
      // toast('Please select plants & locations to continue.', 'warning')
      // Plants Location & Quantity is required
      return true
    }

    if (!this.state.isNotified) {
      return true
    }

    const quantity = +this.state.quantity

    const hasIncomplete = phases.some(x => {
      const sum = sumBy(this.getBookingsByPhase(x), 'quantity')
      return sum !== quantity
    })

    return hasIncomplete
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
    try {
      const res = await fetch(
        `/api/v1/batches/${id}/update_locations`,
        httpPostOptions({
          plans: this.state.selectedPlants,
          quantity: this.state.quantity
        })
      )
      if (res) {
        // navigate to batch overview
        window.location.replace('/cultivation/batches/' + id)
      }
    } catch (error) {
      console.error(error)
    }
    this.setState({ isLoading: false })
  }

  // plantType = the type plant for location selection
  // when it's 'mother', let user select the mother plant during clone location selection
  renderBookingsForPhase = (phase, strainId, quantity = 0, plantType = '') => {
    const bookings = this.getBookingsByPhase(phase)
    const selectedCapacity = sumBy(bookings, 'quantity')
    const isBalance = quantity === selectedCapacity && quantity > 0
    return (
      <React.Fragment>
        <div className="flex items-center pb2 w-100">
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
          strainId={strainId}
        />
      </React.Fragment>
    )
  }

  remainingPhases = (firstPhase, phases) => {
    const hasMultipleVeg =
      phases.includes(GROWTH_PHASE.VEG1) && phases.includes(GROWTH_PHASE.VEG2)
    if (hasMultipleVeg) {
      if (firstPhase === GROWTH_PHASE.CLONE) {
        return [GROWTH_PHASE.VEG1, GROWTH_PHASE.VEG2, GROWTH_PHASE.FLOWER]
      }
      if (firstPhase === GROWTH_PHASE.VEG1) {
        return [GROWTH_PHASE.VEG2, GROWTH_PHASE.FLOWER]
      }
      if (firstPhase === GROWTH_PHASE.VEG2) {
        return [GROWTH_PHASE.FLOWER]
      }
      return []
    } else {
      if (firstPhase === GROWTH_PHASE.CLONE) {
        return [GROWTH_PHASE.VEG, GROWTH_PHASE.FLOWER]
      }
      if (firstPhase === GROWTH_PHASE.VEG) {
        return [GROWTH_PHASE.FLOWER]
      }
      return []
    }
  }

  render() {
    const { batchInfo, phases } = this.props
    const firstPhase = this.props.phases[0]
    const { isLoading, isNotified, editingPlant, quantity } = this.state
    const sumOfFirstPhase = sumBy(
      this.getBookingsByPhase(firstPhase),
      'quantity'
    )
    const otherPhases = this.remainingPhases(firstPhase, phases)
    const isFirstBalance = isNotified ? true : +quantity === sumOfFirstPhase
    const isDisableSubmit = this.isDisableNext(otherPhases)
    return (
      <div className="fl ma4 pa4 bg-white" style={{ width: '800px' }}>
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
            <span className="w-70 dib">Strain</span>
          </div>
          <div className="dark-grey mb2">
            <div className="w-30 dib fl">
              <div
                className={classNames('fl pv1', {
                  'bg-orange ph1 br1': !quantity
                })}
              >
                <input
                  type="number"
                  className="dark-grey bn f2 fw6 w4 h2"
                  autoFocus={true}
                  value={quantity}
                  onChange={e => this.setState({ quantity: e.target.value })}
                />
              </div>
            </div>
            <span className="w-70 dib f2 fw6 fl">
              {batchInfo.strainDisplayName}
            </span>
          </div>

          {+quantity > 0 && (
            <React.Fragment>
              <div className="mt3 dib w-100">
                {this.renderBookingsForPhase(
                  firstPhase,
                  batchInfo.strainId,
                  quantity,
                  batchInfo.cloneSelectionType
                )}
              </div>

              {isNotified && (
                <React.Fragment>
                  {otherPhases.map(phase => (
                    <div className="mt4">
                      {this.renderBookingsForPhase(
                        phase,
                        batchInfo.strainId,
                        quantity
                      )}
                    </div>
                  ))}
                </React.Fragment>
              )}

              {isFirstBalance && (
                <Modal
                  show={!isNotified}
                  render={() => (
                    <div className="w-100 w-80-m w-60-l h-100 center flex flex-column items-center justify-center">
                      <div className="shadow-1 br2 min-w800">
                        <div className="h5 bg-orange w-100 flex justify-center">
                          <img src={ImgPlantGrowth} />
                        </div>
                        <div className="bg-white w-100 pa3 tc">
                          <p className="f3 fw6 dark-grey ma3">
                            All set up on {firstPhase} stage!{' '}
                            {!isEmpty(otherPhases) && (
                              <span>Just one more thing...</span>
                            )}
                          </p>
                          {!isEmpty(otherPhases) && (
                            <p className="grey ph5">
                              Proceed to configure location for next phase.
                            </p>
                          )}
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
                  SKIP
                </a>
              </div>
            </React.Fragment>
          )}
        </form>

        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {editingPlant.id && (
              <BatchLocationEditor
                key={editingPlant.id}
                phases={phases}
                plantConfig={editingPlant}
                batchId={batchInfo.id}
                quantity={quantity}
                startDate={batchInfo.startDate}
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
