import React from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { ImgPlant, GROWTH_PHASE } from '../../utils'
import plantStore from '../../inventory/plant_setup/store/PlantStore'
import loadPlants from '../../inventory/plant_setup/actions/loadPlants'

const QuantityField = React.memo(({ plant, onClick }) => {
  if (plant) {
    return (
      <a href="#0" className="link grey pointer" onClick={onClick}>
        {plant.quantity}
      </a>
    )
  }
  return null
})

const LocationField = React.memo(({ plant, onClick }) => {
  if (plant) {
    return (
      <a href="#0" className="link" onClick={onClick}>
        {plant &&
          plant.trays &&
          plant.trays.map(t => (
            <span
              key={t.tray_id}
              className="dib mr1 ph2 pv1 bg-orange white br2"
            >
              {t.tray_code}
            </span>
          ))}
      </a>
    )
  }
  return null
})

@observer
class BatchPlantSelectionList extends React.Component {
  componentDidMount() {
    if (this.props.plantType) {
      loadPlants(this.props.plantType)
    }
  }

  renderMotherCloneBookingTable = (motherPlants, phase) => {
    return (
      <table className="collapse br2 f5 w-100">
        <tbody>
          <tr className="striped--light-gray grey f5">
            <th className="pv2 ph3">
              <span className="pv1 dib fw6 w4 tl">Plant ID</span>
            </th>
            <th className="tr pv2 ph3 fw6 w4">Quantiy</th>
            <th className="tl pv2 ph3 fw6 w5">Location</th>
            <th className="tr pv2 ph3 fw6 w5">Action</th>
          </tr>
          {motherPlants &&
            motherPlants.map(p => {
              const selectedPlant = this.props.getSelected(p.id)
              if (this.props.isBalance && !selectedPlant) {
                return null
              }
              return (
                <tr
                  key={p.id}
                  className={classNames('bb b--light-gray', {
                    'black-50': !selectedPlant
                  })}
                >
                  <td className="pv2 ph3 flex items-center">
                    <img src={ImgPlant} style={{ width: '24px' }} />
                    <span className="ml2 pa1 dib dark-grey">
                      {p.attributes.plant_id}
                    </span>
                  </td>
                  {selectedPlant && selectedPlant.quantity ? (
                    <React.Fragment>
                      <td className="tr pr3">
                        <QuantityField
                          plant={selectedPlant}
                          onClick={e => this.props.onEdit(phase, p)}
                        />
                      </td>
                      <td className="tl pl3">
                        <LocationField
                          plant={selectedPlant}
                          onClick={e => this.props.onEdit(phase, p)}
                        />
                      </td>
                    </React.Fragment>
                  ) : (
                    <td className="tr" colSpan="2" />
                  )}
                  <td className="tr pr3">
                    {!(selectedPlant && selectedPlant.quantity) && (
                      <a
                        href="#0"
                        className="link orange"
                        onClick={e => this.props.onEdit(phase, p)}
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
    )
  }

  renderBookingTable = (bookings, phase) => {
    return (
      <table className="collapse br2 f5">
        <tbody>
          <tr className="striped--light-gray grey f5">
            <th className="pv2 ph3">
              <span className="pa1 dib fw6 w4 tl">#</span>
            </th>
            <th className="tr pv2 ph3 fw6 w4">Quantiy</th>
            <th className="tl pv2 ph3 fw6 w5">Location</th>
            <th className="tr pv2 ph3 fw6 w5">Action</th>
          </tr>
          {bookings &&
            bookings.map(b => (
              <tr key={b.id}>
                <td className="pv2 flex justify-center items-center">
                  <span className="pa1 dib w4 tl grey">{b.serialNo}</span>
                </td>
                <td className="tr pr3">
                  <QuantityField
                    plant={b}
                    onClick={e => this.props.onEdit(phase, b)}
                  />
                </td>
                <td className="tl pl3">
                  <LocationField
                    plant={b}
                    onClick={e => this.props.onEdit(phase, b)}
                  />
                </td>
                <td className="tl pl3" />
                <td />
              </tr>
            ))}
          <tr>
            <td className="tr pr3 w5" colSpan="4">
              <a
                href="#0"
                className="pv2 dib link orange"
                onClick={e => this.props.onEdit(phase)}
              >
                Set quantity &amp; location
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }

  render() {
    const { phase, plantType, bookings } = this.props
    const { plants } = plantStore
    // console.log('bookings', bookings)
    if (plantStore.isLoading) {
      return <p className="f6">Loading....</p>
    }
    if (plantType === GROWTH_PHASE.MOTHER && phase === GROWTH_PHASE.CLONE) {
      if (plants && plants.length > 0)
        return this.renderMotherCloneBookingTable(plants, phase)
      else {
        return (
          <p className="f5 red">
            Oops! It seem like you don't have the necessary plants available.
            You can add plants to your inventory{' '}
            <a href="/inventory/setup">here</a>.
          </p>
        )
      }
    }

    if (!plantType && phase !== GROWTH_PHASE.CLONE) {
      return this.renderBookingTable(bookings, phase)
    }

    return <div>WIP</div>
  }
}

export default BatchPlantSelectionList
