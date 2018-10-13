import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import plantStore from '../../inventory/plant_setup/store/PlantStore'
import { loadPlants } from '../../inventory/plant_setup/actions/loadPlants'
import { joinBy } from '../../utils/ArrayHelper'

const QuantityField = ({ plant, onEdit }) => {
  if (plant) {
    const text = plant.quantity ? plant.quantity : 'Set Quantity'
    return (
      <a
        href="#0"
        className="link blue pointer"
        onClick={() => onEdit(plant.id)}
      >
        {text}
      </a>
    )
  }
  return null
}

const LocationField = ({ plant, onEdit }) => {
  if (plant) {
    const text = plant.trays
      ? joinBy(plant.trays, 'tray_code')
      : 'Set Quantity & Location'
    return (
      <a
        href="#0"
        className="link blue pointer"
        onClick={() => onEdit(plant.id)}
      >
        {text}
      </a>
    )
  }
  return null
}

@observer
class BatchPlantSelectionList extends React.Component {
  componentDidMount() {
    console.log('loadPlants', this.props.plantType)
    loadPlants(this.props.plantType)
  }
  render() {
    const { isLoading, plants } = plantStore
    
    const { onEdit, getSelected, onSelectPlant } = this.props
    if (isLoading) {
      return <p className="f6">Loading....</p>
    }
    if (plants && plants.length > 0) {
      return (
        <React.Fragment>
          <table className="collapse ba br2 b--black-10 pv2 ph3 f6">
            <tbody>
              <tr className="striped--light-gray">
                <th className="w1 tc" />
                <th className="pv2 ph3 tl fw6 ttu">Plant ID</th>
                <th className="tr ttu fw6 pv2 ph3">Strain</th>
                <th className="tr ttu fw6 pv2 ph3">Status</th>
                <th className="tr ttu fw6 pv2 ph3 w4 tr">Quantiy</th>
                <th className="tr ttu fw6 pv2 ph3 w4 tr">Location</th>
              </tr>
              {plants &&
                plants.map(p => (
                  <tr
                    key={p.id}
                    className={classNames('striped--light-gray', {
                      'black-50': !getSelected(p.id)
                    })}
                  >
                    <td className="pv2 ph3 tc">
                      <input
                        type="checkbox"
                        value={p.id}
                        onChange={onSelectPlant(p.attributes.plant_id)}
                      />
                    </td>
                    <td className="pv2 ph3">{p.attributes.plant_id}</td>
                    <td className="pv2 ph3">{p.attributes.strain_name}</td>
                    <td className="pv2 ph3">{p.attributes.status}</td>
                    {getSelected(p.id) && getSelected(p.id).quantity ? (
                      <React.Fragment>
                        <td className="pv2 ph3 tr">
                          <QuantityField
                            plant={getSelected(p.id)}
                            onEdit={onEdit}
                          />
                        </td>
                        <td className="pv2 ph3 tr">
                          <LocationField
                            plant={getSelected(p.id)}
                            onEdit={onEdit}
                          />
                        </td>
                      </React.Fragment>
                    ) : (
                      <td className="pv2 ph3 tr" colSpan="2">
                        <LocationField
                          plant={getSelected(p.id)}
                          onEdit={onEdit}
                        />
                      </td>
                    )}
                  </tr>
                ))}
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
