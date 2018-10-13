import React from 'react'
import Select from 'react-select'
import { render } from 'react-dom'

import DatePicker from 'react-date-picker/dist/entry.nostyle'
import reactSelectStyle from './../../utils/reactSelectStyle'
import { toast } from './../../utils/toast'
import { TextInput, NumericInput, FieldError } from './../../utils/FormHelpers'

class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      batch_source: '',
      start_date: null,
      grow_method: '',
      facility_strains: [],
      facility_strain: null,
      errors: {},
      isLoading: false
    }
  }

  componentDidMount() {
    // loadTasks.loadbatch(this.props.batch_id)
    this.loadFacilityStrains()
  }

  handleSubmit = event => {
    this.setState({ isLoading: true })
    fetch('/api/v1/batches', {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        batch_source: this.state.batch_source,
        facility_strain_id: this.state.facility_strain.id,
        start_date: this.state.start_date.toISOString(),
        grow_method: this.state.grow_method
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

  handleChangeInput = event => {
    // console.log(event[0].value)
    let key = event.target.attributes.fieldname.value
    let value = event.target.value
    this.setState({ [key]: value })
  }

  setDateValue = event => {}

  loadFacilityStrains = () => {
    fetch('/api/v1/strains', {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        return response.json().then(data => {
          return {
            status: response.status,
            data: data.data
          }
        })
      })
      .then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ facility_strains: [] })
        } else {
          this.setState({ facility_strains: data })
        }
      })
  }

  render() {
    const { plants: batch_sources, grow_methods } = this.props

    return (
      <React.Fragment>
        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>

        <h5 className="tl pa0 ma0 h5--font dark-grey">Cultivation Setup</h5>
        <p className="mt2 body-1 grey">Some cultivation setup here</p>
        <form>
          <div className="w-100">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Batch Source
              </label>
              <Select
                options={batch_sources}
                onChange={e => this.handleChange('batch_source', e.value)}
                styles={reactSelectStyle}
              />
            </div>
          </div>

          <div className="w-100 mt3">
            <label
              className="f6 fw6 db mb1 gray ttc"
              htmlFor="record_batch_source"
            >
              Select Facility
            </label>
            <Select
              options={this.state.facility_strains}
              noOptionsMessage={() => 'Type to search strain...'}
              getOptionLabel={option => option.attributes.label}
              getOptionValue={option => option.attributes.id}
              onChange={e => this.setState({ facility_strain: e })}
              value={this.state.facility_strain}
              styles={reactSelectStyle}
            />
            <FieldError errors={this.state.errors} field="facility_strain_id" />
          </div>

          <div className="w-100">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Grow Method
              </label>
              <Select
                options={grow_methods}
                styles={reactSelectStyle}
                onChange={e => this.handleChange('grow_method', e.value)}
              />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Start Date
              </label>
              <DatePicker
                value={this.state.start_date}
                onChange={e => this.handleChange('start_date', e)}
              />
            </div>
          </div>

          <div className="w-100 flex justify-end mt3">
            <a
              className="pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6 pointer"
              onClick={this.handleSubmit}
            >
              {this.state.isLoading ? 'Saving...' : 'Save & Continue'}
            </a>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default BatchSetupApp
