import React from 'react'
import Select from 'react-select'
import { render } from 'react-dom'

import DatePicker from 'react-date-picker/dist/entry.nostyle'
import reactSelectStyle from './../../utils/reactSelectStyle'
import { toast } from './../../utils/toast'
import { TextInput, NumericInput, FieldError } from './../../utils/FormHelpers'

const styles = `

.DayPickerInput input{
  border-radius: .25rem;
  margin-bottom: .5rem;
  padding-left: .5rem;
  padding-right: .5rem;
  padding-top: .25rem;
  padding-bottom: .25rem;
color: #777;
    width: 70%;
    border-color: rgba(0, 0, 0, 0.2);
    border-style: solid;
    border-width: 1px;
}
.DayPickerInput {
    display: initial;
}
`

class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      plants: this.props.plants,
      strains: this.props.strains,
      facilities: this.props.facilities,
      id: '',
      plant: '',
      facility: '',
      strain: '',
      start_date: '',
      quantity: '',
      grow_method: ''
    }
  }

  componentDidMount() {
    // loadTasks.loadbatch(this.props.batch_id)
  }

  handleSubmit = event => {
    let url = '/api/v1/batches'
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        batch_source: this.state.plant,
        facility: this.state.facility,
        strain: this.state.strain,
        start_date: this.state.start_date,
        quantity: this.state.quantity,
        grow_method: this.state.grow_method
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data)
        if (data.data.id != null) {
          toast('Batch Created', 'success')
          document.location.href = `/cultivation/batches/${data.data.id}?step=1`
        } else {
          alert('something is wrong')
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

  render() {
    let plants = this.state.plants
    let strains = this.state.strains
    let facilities = this.state.facilities
    return (
      <React.Fragment>
        <style>{styles}</style>
        <div id="toast" className="toast animated toast--success">
          Row Saved
        </div>

        <h5 className="tl pa0 ma0 h5--font dark-grey">Cultivation Setup</h5>
        <p className="mt2 body-1 grey">Some cultivation setup here</p>
        <form>
          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Batch Source
              </label>
              <Select
                options={plants}
                onChange={e => this.handleChange('plant', e.value)}
                styles={reactSelectStyle}
              />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Facility
              </label>
              <Select
                options={facilities}
                styles={reactSelectStyle}
                onChange={e => this.handleChange('facility', e.value)}
              />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Strains
              </label>
              <Select
                options={strains}
                styles={reactSelectStyle}
                onChange={e => this.handleChange('strain', e.value)}
              />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label
                className="f6 fw6 db mb1 gray ttc"
                htmlFor="record_batch_source"
              >
                Select Grow Method
              </label>
              <Select
                options={strains}
                styles={reactSelectStyle}
                onChange={e => this.handleChange('grow_method', e.value)}
              />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <TextInput
                label={'Quantity (Capacity)'}
                value={this.state.quantity}
                onChange={this.handleChangeInput}
                fieldname="quantity"
                errors={this.state.errors}
                errorField="quantity"
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

          <div className="w-100 flex justify-end">
            <a
              className="pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6 pointer"
              onClick={this.handleSubmit}
            >
              Submit
            </a>
          </div>
        </form>
      </React.Fragment>
    )
  }
}

export default BatchSetupApp
