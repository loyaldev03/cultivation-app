import React from 'react'
import {
  httpGetOptions,
  selectStyles,
  SlidePanel,
  SlidePanelHeader,
  formatDate
} from '.'
import Select from 'react-select'
import AsyncSelect from 'react-select/lib/Async'
import { observable, action, computed } from 'mobx'
import { differenceInDays } from 'date-fns'

class StorePlant {
  @observable plants = []
  @observable plant_loaded = false
  @observable isLoadingPlants = false

  @action
  async searchPlant(facility_id, search) {
    const url =
      '/api/v1/plants/' +
      search +
      '?facility_id=' +
      facility_id +
      '&limit=10&page=0'
    const response = await (await fetch(url, httpGetOptions)).json()
    if (response && response.data) {
      this.isLoadingPlants = true
      return response.data.attributes
    } else {
      return []
    }
  }

  @action
  async queryPlants(facility_id, value) {
    const url =
      '/api/v1/plants/all?facility_id=' +
      facility_id +
      '&limit=10&page=0&search=' +
      value
    const response = await (await fetch(url, httpGetOptions)).json()

    return (
      response.data.map(x => ({
        value: x.attributes.id,
        label: x.attributes.plant_id || x.attributes.plant_tag
      })) || []
    )
  }
}
const storePlant = new StorePlant()
export default class QuickSearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [],
      selected: [{ value: '', label: 'Search Plant ID ...' }],
      showPanel: false,
      plantShow: {},
      isLoading: true,
      isLoadingPlants: true
    }
  }

  onChange = async selectedPlant => {
    if (selectedPlant) {
      let plant = await storePlant.searchPlant(
        this.props.facility_id,
        selectedPlant.value
      )
      if (plant) {
        this.setState({ isLoading: false })
      }
      this.setState({
        showPanel: true,
        plantShow: plant,
        selected: { value: selectedPlant.value, label: selectedPlant.label }
      })
    } else {
      this.setState({
        selected: { value: '', label: 'Search Plant ID..' },
        showPanel: false
      })
    }
  }

  loadOptions = async inputValue => {
    return await storePlant.queryPlants(this.props.facility_id, inputValue)
  }

  handleInputChange = newValue => {
    const inputValue = newValue.replace(/\W/g, '')
    return inputValue
  }

  onClose = () => {
    this.setState({
      showPanel: false,
      selected: { value: '', label: 'Search Plant ID..' }
    })
  }

  render() {
    const { plantShow, isLoading, isLoadingPlants } = this.state
    const today = new Date()
    return (
      <React.Fragment>
        <div className="flex items-center pr2">
          <div className="grey w-30">Quick Search</div>
          <div className="grey w-70">
            <AsyncSelect
              isClearable="true"
              placeholder="Search Plant ID ..."
              styles={selectStyles}
              value={this.state.selected}
              defaultOptions={true}
              cacheOptions={false}
              loadOptions={this.loadOptions}
              onChange={this.onChange}
              onInputChange={this.handleInputChange}
            />
          </div>
        </div>
        <SlidePanel
          show={this.state.showPanel}
          renderBody={props => (
            <React.Fragment>
              <SlidePanelHeader
                onClose={this.onClose}
                title={'Quick Search Plant Result'}
              />
              <div className="pa4">
                {isLoading ? (
                  <div className="red">Loading...</div>
                ) : (
                  <React.Fragment>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Plant ID </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.plant_tag || plantShow.plant_id}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Strain </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.strain_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Batch </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.cultivation_batch || '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Grow Phase </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.current_growth_stage || '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Location Type </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.location_type || '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Location Origin </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.location_name || '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Planted Date </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.planting_date
                          ? formatDate(plantShow.planting_date)
                          : '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Batch Start Date </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.batch_start_date
                          ? formatDate(plantShow.batch_start_date)
                          : '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Phase Date </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.current_stage_start_date
                          ? formatDate(plantShow.current_stage_start_date)
                          : '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40">Est Harvest Date </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.estimated_harvest_date
                          ? formatDate(plantShow.estimated_harvest_date)
                          : '-'}
                      </div>
                    </div>
                    <div className="flex items-center f5 mt3">
                      <div className="b w-40"># of days in current stage </div>
                      <div className="ml0 pl3 w-60">
                        {plantShow.current_stage_start_date
                          ? differenceInDays(
                              today,
                              plantShow.current_stage_start_date
                            )
                          : '-'}
                      </div>
                    </div>
                  </React.Fragment>
                )}
              </div>
            </React.Fragment>
          )}
        />
      </React.Fragment>
    )
  }
}
