import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import Calendar from 'react-calendar/dist/entry.nostyle'
import {
  GroupBox,
  dateToMonthOption,
  monthOptionAdd,
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

const PhaseDurationInput = ({ text, value, onChange, field }) => {
  return (
    <div className="fl w-70 mt1">
      <div className="fl w-20 pa2">
        <label className="black-50">{text}</label>
      </div>
      <div className="fr tr w-20 mh3">
        <input
          type="number"
          min="0"
          value={value}
          onChange={e => onChange(field, e.target.value)}
          className="w-50 tr pa2 f6 black ba b--black-20 br2 outline-0"
        />
        <span className="ml1 gray f6">days</span>
      </div>
      <div className="fr w-50 pt1 mt3 b--black-10 bb bt-0 bl-0 br-0 b--dotted" />
    </div>
  )
}

class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      showValidation: false,
      batchFacility: props.defaultFacility || '',
      batchSource: '',
      searchMonth: dateToMonthOption(new Date()),
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

  handleSearch() {
    batchSetupStore.clearSearch()
    if (!this.state.showValidation) {
      this.setState({ showValidation: true })
    }
    const {
      batchFacility,
      searchMonth,
      cloneDuration,
      vegDuration,
      veg1Duration,
      veg2Duration,
      flowerDuration,
      dryDuration
    } = this.state
    if (batchFacility && searchMonth && this.totalDuration()) {
      const searchParams = {
        facility_id: batchFacility,
        search_month: searchMonth,
        clone: cloneDuration,
        veg: vegDuration,
        veg1: veg1Duration,
        veg2: veg2Duration,
        flower: flowerDuration,
        dry: dryDuration
      }
      console.log('Handle Serch', searchParams)
      batchSetupStore.search(searchParams)
    }
  }

  handleSearchMonth = increment => e => {
    const searchMonth = monthOptionAdd(this.state.searchMonth, increment)
    this.setState({ searchMonth })
    this.handleSearch()
  }

  renderDateTile = ({ date, view }) => <CapacityTile date={date} />

  totalDuration = () => {
    const {
      cloneDuration,
      vegDuration,
      veg1Duration,
      veg2Duration,
      flowerDuration,
      dryDuration
    } = this.state
    let total = 0
    if (cloneDuration) total += +cloneDuration
    if (vegDuration) total += +vegDuration
    if (veg1Duration) total += +veg1Duration
    if (veg2Duration) total += +veg2Duration
    if (flowerDuration) total += +flowerDuration
    if (dryDuration) total += +dryDuration
    return total
  }

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
                <div className="fl w-third pr2 ml3">
                  <label className="subtitle-2 grey db mb1">Strains</label>
                  <Select
                    options={strains}
                    value={batchStrainValue}
                    onChange={e => this.handleChange('batchStrain', e.value)}
                  />
                  <ValidationMessage
                    text="Select Strain"
                    enable={showValidation}
                    show={!batchStrain}
                  />
                </div>
              </div>
              <div className="fl w-100 mt3">
                <label className="subtitle-2 grey db mb1">
                  Batch Durations
                </label>

                <PhaseDurationInput
                  text="Close Phase"
                  onChange={this.handleChange}
                  field="cloneDuration"
                />
                <PhaseDurationInput
                  text="Veg Phase"
                  onChange={this.handleChange}
                  field="vegDuration"
                />
                <PhaseDurationInput
                  text="Veg 1 Phase"
                  onChange={this.handleChange}
                  field="veg1Duration"
                />
                <PhaseDurationInput
                  text="Veg 2 Phase"
                  onChange={this.handleChange}
                  field="veg2Duration"
                />
                <PhaseDurationInput
                  text="Flower Phase"
                  onChange={this.handleChange}
                  field="flowerDuration"
                />
                <PhaseDurationInput
                  text="Dry Phase"
                  onChange={this.handleChange}
                  field="dryDuration"
                />

                <div className="fl w-70 tr dark-gray pr3 pv1">
                  Total Duration:{' '}
                  <span className="w3 tr dib pa1">{this.totalDuration()}</span>{' '}
                  days
                </div>

                <div className="fl tr w-20 absolute right-0 bottom-0">
                  <button
                    className="btn btn--primary"
                    onClick={e => this.handleSearch()}
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
                  <button
                    onClick={this.handleSearchMonth(-1)}
                    className="fl fw4 ph2 br4 pointer bg-white ml2"
                  >
                    &#171;
                  </button>
                  {monthOptionToString(searchMonth)}
                  <button
                    onClick={this.handleSearchMonth(1)}
                    className="fr fw4 ph2 br4 pointer bg-white mr2"
                  >
                    &#187;
                  </button>
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
