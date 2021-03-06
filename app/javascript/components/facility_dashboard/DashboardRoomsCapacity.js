import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import FacilityDashboardStore from './FacilityDashboardStore'
import DashboardDonutChart from './DashboardDonutChart'
import DashboardRoomDetails from './DashboardRoomDetails'

const RoomCapcitySpot = ({ text, height, purpose, rooms, color, onClick }) => {
  return (
    <div
      href="#"
      className="grow dib mr4"
      onClick={onClick}
      style={{ cursor: 'pointer', width: '70px' }}
    >
      <div className="tc" style={{ height: '120px', background: `${color}` }}>
        {text == 'ROOM_ONLY_SETUP' ? (
          <div
            className="tc"
            style={{ height: `${height}%`, background: 'white', opacity: 0.5 }}
          />
        ) : (
          <React.Fragment>
            <div
              className="tc"
              style={{
                height: `${height}%`,
                background: 'white',
                opacity: 0.5
              }}
            >
              {height > 60.5 ? (
                <span className="f6 fw6 black tc pa1 ">{text} spots free</span>
              ) : (
                ''
              )}
            </div>
            {height <= 60.5 ? (
              <span className="f6 fw6 white tc pa1">{text} spots free</span>
            ) : (
              ''
            )}
          </React.Fragment>
        )}
      </div>

      <div>
        <h1 className="f5 fw6 grey ttc tc">{purpose}</h1>
        <h1 className="f5 fw6 grey tc">{rooms} rooms</h1>
      </div>
    </div>
  )
}

@observer
class DashboardRoomsCapacity extends React.Component {
  constructor(props) {
    super(props)
  }
  setRoomPurpose = e => {
    FacilityDashboardStore.setRoomPupose(e.purpose)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey pb3">Rooms Capacity</h1>
        </div>
        <div className="flex justify-center mb3">
          {FacilityDashboardStore.data_rooms_capacity.map((e, i) => (
            <RoomCapcitySpot
              key={i}
              text={e.available_spots}
              height={e.available_spots_percentage + 0.5}
              purpose={e.purpose}
              color={e.color}
              rooms={e.total_rooms}
              onClick={() => this.setRoomPurpose(e)}
            />
          ))}
        </div>
        <div className="flex mb4">
          <div className="min-w300 w-30">
            {FacilityDashboardStore.current_room_purpose && (
              <DashboardDonutChart facility_id={this.props.facility_id} />
            )}
          </div>
          <div className="ph4 flex flex-column">
            {FacilityDashboardStore.rooms_detail_loaded && (
              <DashboardRoomDetails facility_id={this.props.facility_id} />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DashboardRoomsCapacity
