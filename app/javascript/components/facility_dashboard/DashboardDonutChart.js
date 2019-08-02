import React, { memo, useState, lazy, Suspense } from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import FacilityDashboardStore from './FacilityDashboardStore'
import { Doughnut } from 'react-chartjs-2'
import { FacilityDonutChartWidget } from '../utils'
import 'chartjs-plugin-labels'

@observer
class DashboardDonutChart extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const options = {
      hover: {
        events: ['mousemove'], // this is needed, otherwise onHover is not fired
        onHover: (event, chartElement) => {
          event.target.style.cursor = chartElement[0] ? 'pointer' : 'default'
        }
      },
      plugins: {
        labels: {
          render: 'label',
          overlap: true,
          fontSize: 14,
          fontStyle: 'bold',
          fontColor: 'white'
        }
      },
      title: {
        display: true
      },
      tooltips: {
        displayColors: false,
        callbacks: {
          label: function(tooltipItem, data) {
            // return data.labels[tooltipItem.index]
            return 'Click for more details'
          }
        }
      },
      legend: {
        display: false
      }
    }
    return (
      <React.Fragment>
        <div className="flex justify-between">
          <h1 className="f5 fw6 dark-grey ttc">
            {FacilityDashboardStore.current_room_purpose} -{' '}
            {FacilityDashboardStore.data_list_rooms.total_rooms} Rooms
          </h1>
        </div>
        <Doughnut
          data={FacilityDashboardStore.RoomPupose}
          options={options}
          cursor={'pointer'}
          onElementsClick={e => {
            let room = FacilityDashboardStore.data_list_rooms.rooms[e[0]._index]
            FacilityDashboardStore.loadRoomsDetail(
              this.props.facility_id,
              room.purpose,
              room.room_code,
              room.room_name
            )
          }}
        />
      </React.Fragment>
    )
  }
}

export default DashboardDonutChart
