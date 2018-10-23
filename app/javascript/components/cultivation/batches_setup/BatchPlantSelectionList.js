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
      <a href="#0" className="link blue pointer" onClick={onClick}>
        {text}
      </a>
    )
  }
  return null
}

const LocationField = ({ plant, onClick }) => {
  if (plant) {
    const text = plant.trays ? joinBy(plant.trays, 'tray_code') : 'Set Location'
    return (
      <a href="#0" className="link blue pointer" onClick={onClick}>
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
    const { onEdit, getSelected } = this.props
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
                <th className="tr pv2 ph3 fw6 w4 tr">Quantiy</th>
                <th className="tr pv2 ph3 fw6 w4 tr">Location</th>
                <th className="tr pv2 ph3 fw6 w5 tr">Action</th>
              </tr>
              {plants &&
                plants.map(p => (
                  <tr
                    key={p.id}
                    className={classNames('bb b--black-10', {
                      'black-50': !getSelected(p.id)
                    })}
                  >
                    <td className="pa2 flex justify-center items-center">
                      <span className="w2 h2 bg-black-20 dib br4" />
                      <span className="ml2 pa1 dib dark-grey">
                        {p.attributes.plant_id}
                      </span>
                    </td>
                    {getSelected(p.id) && getSelected(p.id).quantity ? (
                      <React.Fragment>
                        <td className=" tr">
                          <QuantityField
                            plant={getSelected(p.id)}
                            onClick={e => onEdit(p)}
                          />
                        </td>
                        <td className=" tr">
                          <LocationField
                            plant={getSelected(p.id)}
                            onClick={e => onEdit(p)}
                          />
                        </td>
                      </React.Fragment>
                    ) : (
                      <td className=" tr" colSpan="2" />
                    )}
                    <td className="tr pr3">
                      <a
                        href="#0"
                        className="link orange"
                        onClick={e => onEdit(p)}
                      >
                        Set quantity &amp; location
                      </a>
                    </td>
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
