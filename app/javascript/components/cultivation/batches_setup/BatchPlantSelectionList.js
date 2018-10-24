import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import plantStore from '../../inventory/plant_setup/store/PlantStore'
import loadPlants from '../../inventory/plant_setup/actions/loadPlants'
import { joinBy } from '../../utils/ArrayHelper'

const QuantityField = ({ plant, onClick }) => {
  if (plant) {
    const text = plant.quantity ? plant.quantity : 'Set Quantity'
    return (
      <a href="#0" className="link grey pointer" onClick={onClick}>
        {text}
      </a>
    )
  }
  return null
}

const LocationField = ({ plant, onClick }) => {
  if (plant) {
    return (
      <a href="#0" className="link" onClick={onClick}>
        {plant &&
          plant.trays &&
          plant.trays.map(t => (
            <span key={t.tray_id} className="mr1 ph2 pv1 bg-orange white br2">
              {t.tray_code}
            </span>
          ))}
      </a>
    )
  }
  return null
}

@observer
class BatchPlantSelectionList extends React.Component {
  componentDidMount() {
    loadPlants(this.props.plantType)
  }
  render() {
    const { isLoading, plants } = plantStore
    const { onEdit, getSelected, isBalance = false } = this.props
    if (isLoading) {
      return <p className="f6">Loading....</p>
    }
    if (plants && plants.length > 0) {
      return (
        <React.Fragment>
          <table className="collapse br2 f5">
            <tbody>
              <tr className="striped--light-gray grey f5">
                <th className="pv2 ph3">
                  <span className="pa1 dib fw6 w4">Plant ID</span>
                </th>
                <th className="tr pv2 ph3 fw6 w4">Quantiy</th>
                <th className="tl pv2 ph3 fw6 w5">Location</th>
                <th className="tr pv2 ph3 fw6 w5">Action</th>
              </tr>
              {plants &&
                plants.map(p => {
                  const selectedPlant = getSelected(p.id)
                  if (isBalance && !selectedPlant) {
                    return null
                  }
                  return (
                    <tr
                      key={p.id}
                      className={classNames('bb b--light-gray', {
                        'black-50': !selectedPlant
                      })}
                    >
                      <td className="pa2 flex justify-center items-center">
                        <span className="w2 h2 bg-moon-gray dib br-100" />
                        <span className="ml2 pa1 dib dark-grey">
                          {p.attributes.plant_id}
                        </span>
                      </td>
                      {selectedPlant && selectedPlant.quantity ? (
                        <React.Fragment>
                          <td className="tr pr3">
                            <QuantityField
                              plant={selectedPlant}
                              onClick={e => onEdit(p)}
                            />
                          </td>
                          <td className="tl pl3">
                            <LocationField
                              plant={selectedPlant}
                              onClick={e => onEdit(p)}
                            />
                          </td>
                        </React.Fragment>
                      ) : (
                        <td className=" tr" colSpan="2" />
                      )}
                      <td className="tr pr3">
                        {!(selectedPlant && selectedPlant.quantity) && (
                          <a
                            href="#0"
                            className="link orange"
                            onClick={e => onEdit(p)}
                          >
                            Set quantity &amp; location
                          </a>
                        )}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </React.Fragment>
      )
    } else {
      return (
        <p className="f5 red">
          Oops! It seem like you don't have the necessary plants available. You
          can add plants to your inventory <a href="/inventory/setup">here</a>.
        </p>
      )
    }
  }
}

export default BatchPlantSelectionList
