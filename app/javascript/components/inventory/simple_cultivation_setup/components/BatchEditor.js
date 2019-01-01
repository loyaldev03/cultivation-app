import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import saveCultivationBatch from '../actions/saveCultivationBatch'

class BatchEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      if (!event.detail.data) {
        this.setState(this.resetState())
      } else {
        const newState = {
          ...this.resetState(),
          ...event.detail.data.attributes,
          id: event.detail.data.id,
          start_date: new Date(event.detail.data.attributes.start_date),
          current_growth_stage_disabled:
            event.detail.data.attributes.plant_count > 0
        }
        this.setState(newState)
      }
    })
  }

  resetState() {
    return {
      id: '',
      name: '',
      facility_strain_id: '',
      strain_name: '',
      batch_source: '',
      grow_method: '',
      start_date: null,
      clone_duration: '',
      veg_duration: '',
      veg1_duration: '',
      veg2_duration: '',
      flower_duration: '',
      dry_duration: '',
      current_growth_stage: 'clone',
      current_growth_stage_disabled: false,
      errors: {}
    }
  }

  onChangeBatchSource = item => {
    if (item.length === 0) {
      this.setState({ batch_source: '' })
    } else {
      this.setState({ batch_source: item.value })
    }
  }

  onFacilityStrainSelected = item => {
    if (item.length === 0) {
      this.setState({ facility_strain_id: '' })
    } else {
      this.setState({
        facility_strain_id: item.value
      })
    }
  }

  onStartDateSelected = start_date => {
    this.setState({ start_date })
  }

  onGrowMethodSelected = item => {
    if (item.length === 0) {
      this.setState({ grow_method: '' })
    } else {
      this.setState({
        grow_method: item.value
      })
    }
  }

  onCurrentGrowthPhaseSelected = event => {
    this.setState({ current_growth_stage: event.target.value })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSave = event => {
    const { errors, isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      saveCultivationBatch(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
          window.editorSidebar.close()
        }
      })
    }

    event.preventDefault()
  }

  reset() {
    this.setState(this.resetState())
  }

  validateAndGetValues() {
    const {
      id,
      name,
      facility_strain_id,
      batch_source,
      grow_method,
      start_date,
      clone_duration,
      veg_duration,
      veg1_duration,
      veg2_duration,
      flower_duration,
      dry_duration,
      curing_duration,
      current_growth_stage
    } = this.state

    let errors = {}
    if (name.length <= 0) {
      errors.name = ['Batch name is required.']
    }

    if (facility_strain_id.length <= 0) {
      errors.facility_strain_id = ['Strain is required.']
    }

    if (batch_source.length <= 0) {
      errors.batch_source = ['Batch source is required.']
    }

    if (grow_method.length <= 0) {
      errors.grow_method = ['Grow method is required.']
    }

    if (start_date == null) {
      errors.start_date = ['Start date is required.']
    }

    if (current_growth_stage.length <= 0) {
      errors.current_growth_stage = ['Current growth phase is required.']
    }

    const isValid = Object.getOwnPropertyNames(errors).length === 0
    if (!isValid) {
      this.setState({ errors })
    }

    return {
      id,
      name,
      facility_strain_id,
      batch_source,
      grow_method,
      start_date,
      clone_duration,
      veg_duration,
      veg1_duration,
      veg2_duration,
      flower_duration,
      dry_duration,
      curing_duration,
      current_growth_stage,
      isValid
    }
  }

  render() {
    const { batch_sources, facility_strains, grow_methods } = this.props

    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              Add Cultivation Batch
            </h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Select Strain</label>
              <Select
                key={this.state.facility_strain_id}
                options={facility_strains}
                defaultValue={facility_strains.find(
                  x => x.value === this.state.facility_strain_id
                )}
                noOptionsMessage={() => 'Type to search strain...'}
                onChange={this.onFacilityStrainSelected}
                styles={reactSelectStyle}
              />
              <FieldError
                errors={this.state.errors}
                field="facility_strain_id"
              />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Batch Source
              </label>
              <Select
                key={this.state.batch_source}
                defaultValue={batch_sources.find(
                  x => x.value === this.state.batch_source
                )}
                options={batch_sources}
                onChange={this.onChangeBatchSource}
                styles={reactSelectStyle}
              />
              <FieldError field="batch_source" errors={this.state.errors} />
            </div>
          </div>

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Grow Method
              </label>
              <Select
                key={this.state.grow_method}
                options={grow_methods}
                defaultValue={grow_methods.find(
                  x => x.value === this.state.grow_method
                )}
                fieldname="grow_method"
                styles={reactSelectStyle}
                onChange={this.onGrowMethodSelected}
              />
              <FieldError errors={this.state.errors} field="grow_method" />
            </div>
          </div>

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb2 gray ttc">Batch name</label>
              <TextInput
                value={this.state.name}
                fieldname="name"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
          </div>

          <div className="ph4 mt3 mb2 flex">
            <div className="w-60 pr3">
              <label className="f6 fw6 db mb2 gray ttc">Batch start date</label>
              <DatePicker
                value={this.state.start_date}
                onChange={this.onStartDateSelected}
              />
              <FieldError field="start_date" errors={this.state.errors} />
            </div>

            <div className="w-40">
              <label className="f6 fw6 db mb2 gray ttc">
                Current growth phase
              </label>
              <select
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
                disabled={this.state.current_growth_stage_disabled}
                onChange={this.onCurrentGrowthPhaseSelected}
                value={this.state.current_growth_stage}
              >
                <option value="clone" key="clone">
                  Clone
                </option>
                <option value="veg" key="veg">
                  Veg
                </option>
                <option value="veg1" key="veg1">
                  Veg 1
                </option>
                <option value="veg2" key="veg2">
                  Veg 2
                </option>
                <option value="flower" key="flower">
                  Flower
                </option>
                <option value="dry" key="dry">
                  Dry
                </option>
                <option value="cure" key="cure">
                  Cure
                </option>
              </select>
              <FieldError
                field="current_growth_stage"
                errors={this.state.errors}
              />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb2 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 dark-gray">
                Specify duration for each phase
              </label>
            </div>
          </div>

          <div className="ph4 mt3 flex items-center">
            <div className="w-50">
              <label className="f6 fw6 db mb2 gray ttc">
                Clone phase duration
              </label>
            </div>
            <div className="w-20 flex items-center">
              <NumericInput
                value={this.state.clone_duration}
                fieldname="clone_duration"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
              <span className="f6 gray pl2">days</span>
            </div>
          </div>

          <div className="ph4 mt3 flex items-center">
            <div className="w-50">
              <label className="f6 fw6 db mb2 gray ttc">
                Veg phase duration
              </label>
            </div>
            <div className="w-20 flex items-center">
              <NumericInput
                value={this.state.veg_duration}
                fieldname="veg_duration"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
              <span className="f6 gray pl2">days</span>
            </div>
          </div>

          <div className="ph4 mt3 flex items-center">
            <div className="w-50">
              <label className="f6 fw6 db mb2 gray ttc">
                Veg 1 phase duration
              </label>
            </div>
            <div className="w-20 flex items-center">
              <NumericInput
                value={this.state.veg1_duration}
                fieldname="veg1_duration"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
              <span className="f6 gray pl2">days</span>
            </div>
          </div>

          <div className="ph4 mt3 flex items-center">
            <div className="w-50">
              <label className="f6 fw6 db mb2 gray ttc">
                Veg 2 phase duration
              </label>
            </div>
            <div className="w-20 flex items-center">
              <NumericInput
                value={this.state.veg2_duration}
                fieldname="veg2_duration"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
              <span className="f6 gray pl2">days</span>
            </div>
          </div>

          <div className="ph4 mt3 flex items-center">
            <div className="w-50">
              <label className="f6 fw6 db mb2 gray ttc">Flower phase</label>
            </div>
            <div className="w-20 flex items-center">
              <NumericInput
                value={this.state.flower_duration}
                fieldname="flower_duration"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
              <span className="f6 gray pl2">days</span>
            </div>
          </div>

          <div className="ph4 mt3 flex items-center">
            <div className="w-50">
              <label className="f6 fw6 db mb2 gray ttc">Dry phase</label>
            </div>
            <div className="w-20 flex items-center">
              <NumericInput
                value={this.state.dry_duration}
                fieldname="dry_duration"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
              <span className="f6 gray pl2">days</span>
            </div>
          </div>

          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
            <a
              className="db tr pv2 bn br2 ttu tracked link dim f6 fw6 orange"
              href="#"
              onClick={this.props.onSave}
            >
              Save for later
            </a>
            <a
              className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
              href="#"
              onClick={this.onSave}
            >
              Save
            </a>
          </div>
        </div>
      </div>
    )
  }
}

BatchEditor.propTypes = {
  batch_sources: PropTypes.array.isRequired,
  facility_strains: PropTypes.array.isRequired,
  grow_methods: PropTypes.array.isRequired
}

export default BatchEditor
