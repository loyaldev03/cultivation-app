import React from 'react'
import { httpGetOptions, SlidePanel, SlidePanelHeader, formatDate } from '.'
import AsyncSelect from 'react-select/lib/Async'
import { observable, action, computed } from 'mobx'
import { differenceInDays } from 'date-fns'

const searchBoxSelect = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    boxShadow: 'none',
    backgroundColor: state.isDisabled ? '#eee' : '#fff',
    height: '34px',
    minHeight: '34px',
    borderColor: state.isFocused ? '#F66830' : '#C7C7C7',
    ':hover': {
      borderColor: '#F66830'
    }
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  menu: (base, state) => ({
    ...base,
    marginTop: 2
  }),
  dropdownIndicator: () => ({
    display: 'inline-block',
    color: 'rgba(100,100,100, 0.2)',
    width: '30px'
  }),
  option: (base, state) => {
    return {
      ...base,
      backgroundColor:
        state.isFocused || state.isSelected
          ? 'rgba(100, 100, 100, 0.1)'
          : 'transparent',
      ':active': 'rgba(100, 100, 100, 0.1)',
      WebkitTapHighlightColor: 'rgba(100, 100, 100, 0.1)',
      color: '#707A8B',
      fontSize: '0.875rem'
    }
  },
  singleValue: base => ({
    ...base,
    color: '#707A8B'
  })
}

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
    const { plantShow, isLoading, showPanel } = this.state
    const today = new Date()
    return (
      <React.Fragment>
        <div className="flex-auto ph2 grey">
          <AsyncSelect
            isClearable="true"
            placeholder="Search Plant ID ..."
            styles={searchBoxSelect}
            value={this.state.selected}
            defaultOptions={false}
            cacheOptions={false}
            loadOptions={this.loadOptions}
            onChange={this.onChange}
            onInputChange={this.handleInputChange}
          />
        </div>
        {showPanel && (
          <SlidePanel
            show={showPanel}
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
                      <div className="flex items-center f6">
                        <span className="w-40 dark-grey">Plant ID </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.plant_tag || plantShow.plant_id}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Strain </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.strain_name || '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Batch </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.cultivation_batch || '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Grow Phase </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.current_growth_stage || '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Location Type </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.location_type || '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Location Origin </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.location_name || '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Planted Date </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.planting_date
                            ? formatDate(plantShow.planting_date)
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">
                          Batch Start Date{' '}
                        </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.batch_start_date
                            ? formatDate(plantShow.batch_start_date)
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">Phase Date </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.current_stage_start_date
                            ? formatDate(plantShow.current_stage_start_date)
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">
                          Est Harvest Date{' '}
                        </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.estimated_harvest_date
                            ? formatDate(plantShow.estimated_harvest_date)
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center f6 mt3">
                        <span className="w-40 dark-grey">
                          # of days in current stage{' '}
                        </span>
                        <span className="ml0 pl3 w-60">
                          {plantShow.current_stage_start_date
                            ? differenceInDays(
                                today,
                                plantShow.current_stage_start_date
                              )
                            : '-'}
                        </span>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </React.Fragment>
            )}
          />
        )}
      </React.Fragment>
    )
  }
}
