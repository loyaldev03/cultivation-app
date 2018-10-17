import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import Calendar from 'react-calendar/dist/entry.nostyle'
import {
  GroupBox,
  monthsOptions,
  monthOptionToString,
  monthStartDate
} from './../../utils'
import { toast } from './../../utils/toast'
import batchSetupStore from './BatchSetupStore'
import { observer } from 'mobx-react'
import BatchSetupEditor from './BatchSetupEditor'

@observer
class CapacityTile extends React.Component {
  render() {
    return (
      <span className="react-calendar__tile__content">
        {batchSetupStore.getCapacity(this.props.date)}
      </span>
    )
  }
}

const ValidationMessage = ({ enable, show, text }) => {
  if (enable && show) {
    return <span className="red f7 absolute">{text}</span>
  } else {
    return null
  }
}

class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      showValidation: false,
      batchFacility: props.defaultFacility || '',
      batchSource: '',
      searchMonth: '',
      batchStartDate: '',
      batchStrain: '',
      batchGrowMethod: '',
      isLoading: false
    }
  }

  componentDidMount() {
    // Setup sidebar editor
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))
  }

  closeSidebar = () => {
    window.editorSidebar.close()
  }

  handleDatePick = date => {
    console.log('DatePicker picked', date)
    this.setState({ batchStartDate: date })
    window.editorSidebar.open({ width: '500px' })
  }

  handleSubmit = event => {
    this.setState({ isLoading: true })
    const url = '/api/v1/batches'
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        batch_source: this.state.batchSource,
        facility_id: this.state.batchFacility,
        facility_strain_id: this.state.batchStrain,
        start_date: this.state.batchStartDate.toDateString(),
        grow_method: this.state.batchGrowMethod
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        this.setState({ isLoading: false })
        if (data.data && data.data.id) {
          toast('Batch Created', 'success')
          window.location.replace(`/cultivation/batches/${data.data.id}?step=1`)
        } else {
          toast('Error creating batch', 'error')
        }
      })
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value })
  }

  handleChangeMonth = (field, value) => {
    this.setState({ [field]: value })
    batchSetupStore.clearSearch()
    if (this.state.batchFacility && this.state.searchMonth) {
      batchSetupStore.search(this.state.batchFacility, value)
    }
  }

  handleChangeInput = e => {
    let key = e.target.attributes.fieldname.value
    let value = e.target.value
    this.setState({ [key]: value })
  }

  handleSearch = e => {
    this.setState({ showValidation: true })
    const { batchFacility, searchMonth, batchSource } = this.state
    if (batchFacility && batchSource && searchMonth) {
      batchSetupStore.search(batchFacility, searchMonth)
    }
  }

  renderDateTile = ({ date, view }) => <CapacityTile date={date} />

  render() {
    const { plantSources, strains, facilities, growMethods } = this.props
    const {
      showValidation,
      batchFacility,
      batchStrain,
      batchSource,
      searchMonth,
      batchStartDate,
      isLoading
    } = this.state

    const batchFacilityValue = facilities.find(f => f.value === batchFacility)
    const batchStrainValue = strains.find(f => f.value === batchStrain)

    return (
      <div className="fl w-100 ma4 pa4 bg-white cultivation-setup-container">
        <div id="toast" className="toast" />
        <h5 className="tl pa0 ma0 h5--font dark-grey">Cultivation Setup</h5>
        <p className="mt2 body-1 grey">
          Search to display available quantity on specific date.
        </p>
        <GroupBox
          title="Search"
          className="mt3 fl w-100"
          render={() => (
            <div className="fl w-100 relative">
              <div className="fl w-100">
                <div className="fl w-third pr2">
                  <label className="subtitle-2 grey db mb1">Facility</label>
                  <Select
                    options={facilities}
                    value={batchFacilityValue}
                    onChange={e => this.handleChange('batchFacility', e.value)}
                  />
                  <ValidationMessage
                    text="Select Facility"
                    enable={showValidation}
                    show={!batchFacility}
                  />
                </div>
                <div className="fl w-third pr2">
                  <label className="subtitle-2 grey db mb1">Batch Source</label>
                  <Select
                    options={plantSources}
                    onChange={e => this.handleChange('batchSource', e.value)}
                  />
                  <ValidationMessage
                    text="Select Batch Srouce"
                    enable={showValidation}
                    show={!batchSource}
                  />
                </div>
                <div className="fl w-20">
                  <label className="subtitle-2 grey db mb1">Month</label>
                  <Select
                    options={monthsOptions(new Date(2018, 1, 1), 18)}
                    onChange={e =>
                      this.handleChangeMonth('searchMonth', e.value)
                    }
                  />
                  <ValidationMessage
                    text="Select Month"
                    enable={showValidation}
                    show={!searchMonth}
                  />
                </div>
                <div className="fl tr w-20 absolute right-0 bottom-0">
                  <button
                    className="btn btn--primary"
                    onClick={this.handleSearch}
                  >
                    Search
                  </button>
                </div>
              </div>
            </div>
          )}
        />
        <div className="fl w-100 mt3">
          {showValidation &&
            searchMonth && (
              <div className="fl w-100">
                <span className="availabilty-calendar-title">
                  {monthOptionToString(searchMonth)}
                </span>
                <Calendar
                  activeStartDate={monthStartDate(searchMonth)}
                  className="availabilty-calendar"
                  showNavigation={false}
                  onChange={this.handleDatePick}
                  tileContent={this.renderDateTile}
                />
              </div>
            )}
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            <BatchSetupEditor
              strains={strains}
              batchStrain={batchStrainValue}
              growMethods={growMethods}
              startDate={batchStartDate}
              onChange={this.handleChange}
              onClose={this.closeSidebar}
              onSave={this.handleSubmit}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default BatchSetupApp
