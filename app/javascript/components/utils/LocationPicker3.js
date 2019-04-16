import React from 'react'
import isEmpty from 'lodash.isempty'
import Select from 'react-select'
import reactSelectStyle from './reactSelectStyle'
import { httpGetOptions } from './'
import { observer } from 'mobx-react'
import { observable, action, computed, toJS } from 'mobx'

class LocationStore {
  @observable locationOptions = []
  @observable selectedLocationId = ''

  @action
  async load(facilityId, purposes) {
    let url = `/api/v1/facilities/${facilityId}/locations?`
    if (purposes.includes(',')) {
      url =
        url +
        purposes
          .split(',')
          .map(p => 'purposes[]=' + p)
          .join('&')
    } else {
      url = url + 'purposes[]=' + purposes
    }
    try {
      const res = await (await fetch(url, httpGetOptions)).json()
      if (res.data) {
        this.locationOptions = res.data
      } else {
        this.locationOptions = []
      }
    } catch (error) {
      this.locationOptions = []
      console.error(error)
    }
  }

  @computed
  get selectedOption() {
    if (this.selectedLocationId) {
      return this.locationOptions.find(x => x.value === this.selectedLocationId)
    }
    return null
  }
}

const locationStore = new LocationStore()

const options = [
  { value: 'chocolate', label: 'Chocolate' },
  { value: 'strawberry', label: 'Strawberry' },
  { value: 'vanilla', label: 'Vanilla' }
]

@observer
class LocationPicker extends React.Component {
  async componentDidMount() {
    const { facility_id, purpose, location_id } = this.props
    if (facility_id && purpose) {
      await locationStore.load(facility_id, purpose)
      if (location_id) {
        locationStore.selectedLocationId = location_id
      }
    }
  }

  async componentDidUpdate(prevProps) {
    const { facility_id, purpose, location_id } = this.props
    if (facility_id && purpose !== prevProps.purpose) {
      locationStore.load(facility_id, purpose)
    }
    if (
      !isEmpty(locationStore.locationOptions) &&
      location_id !== prevProps.location_id
    ) {
      locationStore.selectedLocationId = location_id
    }
  }

  handleChange = selectedOption => {
    locationStore.selectedLocationId = selectedOption.value
    if (this.props.onChange) {
      this.props.onChange({ location_id: selectedOption.value })
    }
  }

  render() {
    if (!locationStore.locationOptions) {
      return null
    }
    return (
      <React.Fragment>
        <Select
          styles={reactSelectStyle}
          value={locationStore.selectedOption}
          onChange={this.handleChange}
          options={locationStore.locationOptions}
        />
      </React.Fragment>
    )
  }
}

export { LocationPicker }
