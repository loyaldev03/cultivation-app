import isEmpty from 'lodash.isempty'
import { observable, action, computed, toJS, set } from 'mobx'
import {
  httpGetOptions,
  httpPostOptions,
  httpPutOptions,
  httpDeleteOptions
} from '../utils'

function parseTask(taskAttributes) {
  return Object.assign(taskAttributes)
}

class FacilityDashboardStore {
  @observable data_facility_overview = []
  @observable data_rooms_capacity = []
  @observable data_list_rooms = []
  @observable data_room_detail = []
  @observable current_room_purpose = ''
  @observable rooms_detail_loaded = false
  @observable strain_distribution_loaded = false
  @observable rooms_capacity_loaded = false
  @observable facility_overview_loaded = false

  @action
  async loadRoomsDetail(facility_id, purpose, full_code, name) {
    this.isLoading = true
    this.rooms_detail_loaded = false
    this.strain_distribution_loaded = false
    const url = `/api/v1/facility_dashboard_charts/room_detail?facility_id=${facility_id}&purpose=${purpose}&full_code=${full_code}&name=${name}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_room_detail = response
        this.rooms_detail_loaded = true
        if (this.data_room_detail.strain_distribution.length > 0) {
          this.strain_distribution_loaded = true
        }
      } else {
        this.data_room_detail = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  async loadRoomsCapacity(facility_id) {
    this.isLoading = true
    this.rooms_capacity_loaded = false
    const url = `/api/v1/facility_dashboard_charts/rooms_capacity?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_rooms_capacity = response
        this.rooms_capacity_loaded = true
      } else {
        this.data_rooms_capacity = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }

  @action
  setRoomPupose(purpose) {
    this.data_list_rooms = this.data_rooms_capacity.find(
      e => e.purpose == purpose
    )
    this.current_room_purpose = purpose
  }

  @computed get RoomPupose() {
    let data = []
    let count = this.data_list_rooms.total_rooms
    for (var i = 0; i < count; i++) {
      data.push(1)
    }
    let final_result = {
      labels: this.data_list_rooms.rooms.map(e => e.room_code),
      datasets: [
        {
          type: 'doughnut',
          data: data,
          labels: this.data_list_rooms.rooms.map(e => e.room_code),
          backgroundColor: this.data_list_rooms.color,
          hoverBackgroundColor: this.data_list_rooms.color
        }
      ]
    }

    return final_result
  }

  @action
  async loadFacilityOverview(facility_id) {
    this.isLoading = true
    this.facility_overview_loaded = false
    const url = `/api/v1/facility_dashboard_charts/facility_overview?facility_id=${facility_id}`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response) {
        this.data_facility_overview = response
        this.facility_overview_loaded = true
      } else {
        this.data_facility_overview = []
      }
    } catch (error) {
      console.error(error)
    } finally {
    }
  }
}

const facilityDashboard = new FacilityDashboardStore()

export default facilityDashboard
