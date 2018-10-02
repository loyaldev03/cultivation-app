import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import saveCultivationBatch from '../actions/saveCultivationBatch'

class BatchEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()

    this.locations = this.props.locations
    this.default_batch_source = this.props.batch_source
    this.default_facility_strain_id = this.props.facility_strain_id
    this.default_grow_methods = this.props.default_grow_methods
  }

  componentDidMount() {
    // document.addEventListener('editor-sidebar-open', function() {})
  }

  resetState() {
    return {
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
      harvest_duration: '',
      curing_duration: '',
      errors: {}
    }
  }

  onChangeBatchSource = item => {
    console.log(item)
    if (item.length === 0) {
      this.setState({ batch_source: '' })
    } else {
      this.setState({ batch_source: item.value })
    }
  }

  onFacilityStrainSelected = item => {
    console.log(item)
    if (item.length === 0) {
      this.setState({ facility_strain_id: '' })
    } else {
      this.setState({ 
        facility_strain_id: item.value
      })
    }
  }

  onStartDateSelected = date => {
    this.setState({ start_date: date })
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

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onSave = event => {
    const { errors, isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      console.log(payload)
      saveCultivationBatch(payload).then(x => {
        console.log('after save....')
        console.log(x)
        // toast
        this.reset()
      })
    }

    event.preventDefault()
  }

  reset() {
    this.setState(this.resetState())
  }

  validateAndGetValues() {
    const {
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
      harvest_duration,
      curing_duration,
    } = this.state

    let errors = {}
    if (name.length <= 0) {
      errors = { ...errors, name: ['Batch name is required.']}
    }

    if (facility_strain_id.length <= 0) {
      errors = { ...errors, facility_strain_id: ['Strain is required.']}
    }

    if (batch_source.length <= 0) {
      errors = { ...errors, batch_source: ['Batch source is required.']}
    }

    if (grow_method.length <= 0) {
      errors = { ...errors, grow_method: ['Grow method is required.']}
    }

    if (start_date == null) {
      errors = { ...errors, start_date: ['Start date is required.']}
    }

    const isValid = Object.getOwnPropertyNames(errors).length === 0
    if (!isValid) {
      this.setState({ errors })
    }

    return {
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
      harvest_duration,
      curing_duration,
      isValid
    }
  }

  onDateSelected = (field, value) => {
    this.setState({ [field]: value })
  }

  render() {
    const widthStyle = this.props.isOpened
      ? { width: '500px' }
      : { width: '0px' }

    const { plants, strains, facilities, grow_methods } = this.props

    return (
      <div className="rc-slide-panel" data-role="sidebar" style={widthStyle}>
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Cultivation Batch</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Batch Source
              </label>
              <Select
                defaultValue={plants.find(x => x.value === this.default_batch_source)}
                options={plants}
                onChange={this.onChangeBatchSource}
                styles={reactSelectStyle}
              />
              <FieldError field="batch_source" errors={this.state.errors} />
            </div>
          </div>          

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Select Strain</label>
              <Select
                options={this.props.facility_strains}
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

          <div className="ph4 mt3 flex">
            <div className="w-100">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Grow Method
              </label>
              <Select
                options={grow_methods}
                defaultValue={grow_methods.find(x => x.value === this.default_grow_methods)}
                fieldname="grow_method"
                styles={reactSelectStyle}
                onChange={this.onGrowMethodSelected}
              />
              <FieldError
                errors={this.state.errors}
                field="grow_method"
              />
            </div>
          </div>

          <div className="ph4 mt3 mb2 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb2 gray ttc">
                Batch name
              </label>          
              <TextInput
                value={this.state.name}
                fieldname="name"
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
          </div>
          

          <div className="ph4 mt3 mb2 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb2 gray ttc">
                Batch start date
              </label>          
              <DatePicker
                value={this.state.start_date}
                onChange={this.onStartDateSelected}
              />
              <FieldError 
                field="start_date"
                errors={this.state.errors}
              />
            </div>
          </div>

          <div className="ph4 mt4 mb2 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray">
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
              <label className="f6 fw6 db mb2 gray ttc">
                Flower phase
              </label>              
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
              <label className="f6 fw6 db mb2 gray ttc">
                Harvest phase
              </label>              
            </div>
            <div className="w-20 flex items-center">
              <NumericInput 
                value={this.state.harvest_duration} 
                fieldname="harvest_duration"
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
              onClick={this.props.onExitCurrentEditor}
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

export default BatchEditor
