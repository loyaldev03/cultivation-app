import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import Calendar from 'react-calendar/dist/entry.nostyle'
import {
  GroupBox,
  dateToMonthOption,
  monthOptionAdd,
  monthOptionToString,
  monthStartDate,
  httpPostOptions
} from './../../utils'
import { toast } from './../../utils/toast'
import batchSetupStore from './BatchSetupStore'
import BatchSetupEditor from './BatchSetupEditor'
import { observer } from 'mobx-react'

class CapacityTile extends React.PureComponent {
  render() {
    const { startDate, duration } = this.props
    return (
      <span className="react-calendar__tile__content">
        {batchSetupStore.getCapacity(startDate, duration)}
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

const PhaseDurationInput = ({ text, onChange }) => {
  return (
    <div className="fl w-70 mt1">
      <div className="fl w-20 pa2">
        <label className="black-50">{text}</label>
      </div>
      <div className="fr tr w-20 mh3">
        <input
          type="number"
          min="1"
          onChange={onChange}
          className="w-50 tr pa2 f6 black ba b--black-20 br2 outline-0"
        />
        <span className="ml1 gray f6">days</span>
      </div>
      <div className="fr w-50 pt1 mt3 b--black-10 bb bt-0 bl-0 br-0 b--dotted" />
    </div>
  )
}

class CalendarTitleBar extends React.PureComponent {
  render() {
    const { onPrev, onNext, month } = this.props
    return (
      <div className="availabilty-calendar-title">
        <button
          onClick={onPrev}
          className="fl fw4 ph2 br-100 pointer bg-white ml2"
        >
          &#171;
        </button>
        {monthOptionToString(month)}
        <button
          onClick={onNext}
          className="fr fw4 ph2 br-100 pointer bg-white mr2"
        >
          &#187;
        </button>
      </div>
    )
  }
}

@observer
class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      showValidation: false,
      batchFacility: props.defaultFacility || '',
      batchSource: '',
      searchMonth: dateToMonthOption(new Date()),
      phaseDuration: {},
      batchStartDate: '',
      batchStrain: '',
      batchGrowMethod: '',
      batchQuantity: 0,
      isLoading: false
    }
  }

  componentDidMount() {
    // Setup sidebar editor
    window.editorSidebar.setup(document.querySelector('[data-role=sidebar]'))

    // TODO: DELETE AFTER DEVELOPMENT
    // setTimeout(() => {
    //   this.setState({
    //     batchStrain: '5bac2e7a49a934664ea63242',
    //     phaseDuration: {
    //       clone: 15,
    //       veg: 90,
    //       veg1: 45,
    //       veg2: 45,
    //       flower: 60,
    //       dry: 5,
    //       cure: 2
    //     }
    //   })
    // }, 300)
  }

  closeSidebar = () => {
    window.editorSidebar.close()
  }

  handleDatePick = date => {
    this.setState({ batchStartDate: date })
    window.editorSidebar.open({ width: '500px' })
  }

  handleSubmit = event => {
    this.setState({ isLoading: true })
    const url = '/api/v1/batches'
    fetch(
      url,
      httpPostOptions({
        facility_id: this.state.batchFacility,
        batch_source: this.state.batchSource,
        facility_strain_id: this.state.batchStrain,
        start_date: this.state.batchStartDate,
        grow_method: this.state.batchGrowMethod,
        phase_duration: this.state.phaseDuration,
        quantity: this.state.batchQuantity
      })
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ isLoading: false, errors: {} })
        if (data.data && data.data.id) {
          toast('Batch Created', 'success')
          window.location.replace(`/cultivation/batches/${data.data.id}?select_location=1`)
        } else {
          this.setState({ errors: data.errors })
          toast('Please check the errors and try again', 'Warning')
        }
      })
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value })
  }

  handleChangeDuration = phase => e => {
    const phaseDuration = {
      ...this.state.phaseDuration,
      [phase]: e.target.value
    }
    this.setState({ phaseDuration })
  }

  handleSearch(searchMonth) {
    batchSetupStore.clearSearch()
    if (!this.state.showValidation) {
      this.setState({ showValidation: true })
    }
    if (this.state.searchMonth !== searchMonth) {
      this.setState({ searchMonth })
    }
    const { batchFacility, phaseDuration } = this.state
    const totalDuration = this.calculateTotalDuration()
    if (batchFacility && searchMonth && totalDuration > 0) {
      const searchParams = {
        facility_id: batchFacility,
        search_month: searchMonth,
        total_duration: totalDuration
      }
      batchSetupStore.search(searchParams, phaseDuration)
    }
  }

  calculateTotalDuration = () => {
    const { phaseDuration } = this.state
    let total = 0
    Object.keys(phaseDuration).forEach(p => (total += +phaseDuration[p]))
    return total
  }

  render() {
    const { plantSources, strains, facilities, growMethods } = this.props
    const {
      showValidation,
      batchFacility,
      batchStrain,
      searchMonth,
      batchStartDate,
      errors,
      isLoading
    } = this.state

    const batchFacilityValue = facilities.find(f => f.value === batchFacility)
    const batchStrainValue = strains.find(f => f.value === batchStrain)
    const totalDuration = this.calculateTotalDuration()

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
                  onChange={this.handleChangeDuration('clone')}
                />
                <PhaseDurationInput
                  text="Veg Phase"
                  onChange={this.handleChangeDuration('veg')}
                />
                <PhaseDurationInput
                  text="Veg 1 Phase"
                  onChange={this.handleChangeDuration('veg1')}
                />
                <PhaseDurationInput
                  text="Veg 2 Phase"
                  onChange={this.handleChangeDuration('veg2')}
                />
                <PhaseDurationInput
                  text="Flower Phase"
                  onChange={this.handleChangeDuration('flower')}
                />
                <PhaseDurationInput
                  text="Dry Phase"
                  onChange={this.handleChangeDuration('dry')}
                />
                <PhaseDurationInput
                  text="Cure Phase"
                  onChange={this.handleChangeDuration('cure')}
                />

                <div className="fl w-70 tr gray pr3 pv1">
                  Total Duration:{' '}
                  <span className="w3 tr dib pa1">{totalDuration}</span> days
                </div>

                <div className="fl tr w-20 absolute right-0 bottom-0">
                  <button
                    className="btn btn--primary"
                    onClick={e => this.handleSearch(searchMonth)}
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
            searchMonth &&
            batchSetupStore.isReady && (
              <div className="fl w-100">
                <CalendarTitleBar
                  month={searchMonth}
                  onPrev={e =>
                    this.handleSearch(monthOptionAdd(searchMonth, -1))
                  }
                  onNext={e =>
                    this.handleSearch(monthOptionAdd(searchMonth, 1))
                  }
                />
                {!batchSetupStore.isLoading ? (
                  <Calendar
                    activeStartDate={monthStartDate(searchMonth)}
                    className="availabilty-calendar"
                    showNavigation={false}
                    onChange={this.handleDatePick}
                    tileContent={({ date, view }) => (
                      <CapacityTile startDate={date} duration={totalDuration} />
                    )}
                  />
                ) : (
                  <div style={{ minHeight: '362px' }}>
                    <span className="dib pa2">Searching...</span>
                  </div>
                )}
              </div>
            )}
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {showValidation &&
              totalDuration &&
              batchStartDate &&
              batchSetupStore.isReady && (
                <BatchSetupEditor
                  batchStrain={batchStrainValue ? batchStrainValue.label : ''}
                  plantSources={plantSources}
                  growMethods={growMethods}
                  batchSchedule={batchSetupStore.getSchedule(
                    batchStartDate,
                    totalDuration
                  )}
                  maxCapacity={batchSetupStore.getCapacity(
                    batchStartDate,
                    totalDuration
                  )}
                  startDate={batchStartDate}
                  onChange={this.handleChange}
                  onClose={this.closeSidebar}
                  onSave={this.handleSubmit}
                  isLoading={isLoading}
                  errors={errors}
                />
              )}
          </div>
        </div>
      </div>
    )
  }
}

export default BatchSetupApp
