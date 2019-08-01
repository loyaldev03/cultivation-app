import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import { FacilityRoomDetailsWidget } from '../utils'
import FacilityDashboardStore from './FacilityDashboardStore'
import {numberFormatter} from '../utils'

const RoomDetailWidget = ({
  title,
  count,
  className= '',
  icon = 'access_time'
}) => {
  return (
    <div className="flex items-center br2 mr1 mb1 "
    style={{ height: 70 + 'px', width: '50%' }}
    >
      <div className="flex" style={{ flex: ' 1 1 auto' }}>
        <i
          className={`material-icons white bg-orange md-36 mt3 ${className}`}
          style={{ borderRadius: '50%', height: '100% '}}
        >{icon}
        </i>
        <div className="tc">
          <h1 className="f6 fw6 grey">{title}</h1>
          <b className="f3 fw6 dark-grey">{count}</b>
        </div>
      </div>
    </div>
  )
}


@observer
class DashboardRoomsDetails extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey">Room Details</h1>
        </div>
        <div
          className="pa3 bg-light-gray"
        >
          < div className="flex justify-between">
            <div><h1 className="f5 fw6 dark-grey ttc">{FacilityDashboardStore.data_room_detail.purpose} {FacilityDashboardStore.data_room_detail.room_name}</h1></div>
            <div>
              <h1 className="f5 fw6 dark-grey dib">{numberFormatter.format(FacilityDashboardStore.data_room_detail.section_count)}</h1>
              <h1 className="f6 fw6 grey dib pl1">Sections</h1>
            </div>
            <div>
              <h1 className="f5 fw6 dark-grey dib">{numberFormatter.format(FacilityDashboardStore.data_room_detail.row_count)}</h1>
              <h1 className="f6 fw6 grey dib pl1">Rows</h1>
            </div>
            <div>
              <h1 className="f5 fw6 dark-grey dib">{numberFormatter.format(FacilityDashboardStore.data_room_detail.shelf_count)}</h1>
              <h1 className="f6 fw6 grey dib pl1">Shelves</h1>
            </div>
            <div>
              <h1 className="f5 fw6 dark-grey dib">{numberFormatter.format(FacilityDashboardStore.data_room_detail.tray_count)}</h1>
              <h1 className="f6 fw6 grey dib pl1">Trays</h1>
            </div>
          </div>
          < div className="flex justify-between">
            <RoomDetailWidget
              title="# of active plants "
              count={
                numberFormatter.format(FacilityDashboardStore.data_room_detail.active_plants)}
              className="mr2"
            />
            <RoomDetailWidget
              title="Total capacity"
              count={numberFormatter.format(FacilityDashboardStore.data_room_detail.total_capacity)}
              className="mr2"
            />
            <RoomDetailWidget
              title="Available spots"
              count={
                numberFormatter.format(FacilityDashboardStore.data_room_detail.available_capacity)}
              className="mr2"
            />
          </ div>
          < div className="flex justify-between">
            <div>
              <h1 className="f5 fw6 dark-grey dib">{FacilityDashboardStore.data_room_detail.room_temperature} F</h1>
              <h1 className="f6 fw6 grey dib pl1">Room Temperature</h1>
            </div>
            <div>
              <h1 className="f5 fw6 dark-grey dib">{FacilityDashboardStore.data_room_detail.humidity} %</h1>
              <h1 className="f6 fw6 grey dib pl1">Humidity</h1>
            </div>
            <div>
              <h1 className="f5 fw6 dark-grey dib">{FacilityDashboardStore.data_room_detail.light_hours} h</h1>
              <h1 className="f6 fw6 grey dib pl1">Light Hours</h1>
            </div>
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default DashboardRoomsDetails
