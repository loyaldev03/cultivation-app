import React from 'react'
import classNames from 'classnames'
import BatchLocationEditor from './BatchLocationEditor'
import { joinBy } from '../../utils/ArrayHelper'

const QuantityField = ({ plant, onEdit }) => {
  if (plant) {
    const text = plant.quantity ? plant.quantity : 'Set Quantity'
    return (
      <span className="blue pointer" onClick={() => onEdit(plant.id)}>
        {text}
      </span>
    )
  }
  return null
}

const LocationField = ({ plant, onEdit }) => {
  if (plant) {
    const text = plant.trays ? joinBy(plant.trays, 'tray_code') : 'Set Location'
    return (
      <a href="#0" className="link blue pointer" onClick={() => onEdit(plant.id)}>
        {text}
      </a>
    )
  }
  return null
}

class BatchLocationApp extends React.Component {
  state = {
    fromMotherPlant: true,
    selectedPlants: [],
    editingPlant: {},
    dummyPlants: [
      { id: 'P0001', code: 'ABCD-001', name: 'AK-47' },
      { id: 'P0002', code: 'ABCD-002', name: 'AK-47' },
      { id: 'P0003', code: 'ABCD-003', name: 'AK-47' }
    ],
    locations: this.props.locations,
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

  onSelectPlant = e => {
    const plantId = e.target.value
    const found = this.getSelected(plantId)
    if (e.target.checked && !found) {
      const plant = { id: plantId, quantity: 0 }
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
    this.setState({
      selectedPlants: this.state.selectedPlants.map(
        x => (x.id === plantConfig.id ? plantConfig : x)
      )
    })
    // TODO: Update remaining count in this.state.locations
  }

  isDisableNext = () => {
    if (!this.state.selectedPlants || !this.state.selectedPlants.length) {
      return true
    }
    // if there's a missing data, disable next step
    const missed = this.state.selectedPlants.find(
      x => !x.quantity || !x.trays
    )
    return !!missed
  }

  gotoNext = () => {
    window.location.replace("/cultivation/batches/" + this.props.batch_id)
  }

  render() {
    const plants = this.state.dummyPlants
    const { locations, editingPlant } = this.state
    return (
      <div>
        {this.state.fromMotherPlant && (
          <div>
            <span className="db dark-grey mb2">
              Please select the mother plant source:
            </span>
            <table className="collapse ba br2 b--black-10 pv2 ph3">
              <tbody>
                <tr className="striped--light-gray">
                  <th className="pv2 ph3 tl f6 fw6 ttu">Plant ID</th>
                  <th className="tr f6 ttu fw6 pv2 ph3">Strain</th>
                  <th className="tr f6 ttu fw6 pv2 ph3 w4 tr">Quantiy</th>
                  <th className="tr f6 ttu fw6 pv2 ph3 w4 tr">Location</th>
                  <th className="w1 tc" />
                </tr>
                {plants &&
                  plants.length &&
                  plants.map(p => (
                    <tr
                      key={p.id}
                      className={classNames('striped--light-gray', {
                        'black-50': !this.getSelected(p.id)
                      })}
                    >
                      <td className="pv2 ph3">{p.code}</td>
                      <td className="pv2 ph3">{p.name}</td>
                      <td className="pv2 ph3 tr">
                        <QuantityField
                          plant={this.getSelected(p.id)}
                          onEdit={this.onClickSelectionEdit}
                        />
                      </td>
                      <td className="pv2 ph3 tr">
                        <LocationField
                          plant={this.getSelected(p.id)}
                          onEdit={this.onClickSelectionEdit}
                        />
                      </td>
                      <td className="pv2 ph3 tc">
                        {' '}
                        <input
                          type="checkbox"
                          value={p.id}
                          onChange={this.onSelectPlant}
                        />{' '}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <div className="pv2">
              <button className="btn" disabled={this.isDisableNext()} onClick={this.gotoNext}>
                Next
              </button>
            </div>
          </div>
        )}

        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {editingPlant.id && (
              <BatchLocationEditor
                key={editingPlant.id}
                plant={editingPlant}
                locations={this.props.locations}
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
