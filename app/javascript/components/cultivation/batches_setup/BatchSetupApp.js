import React from 'react'
import Select from 'react-select'
import { render } from 'react-dom'

import DatePicker from 'react-date-picker/dist/entry.nostyle'
import reactSelectStyle from './../../utils/reactSelectStyle'
import { GroupBox } from './../../utils'
import { toast } from './../../utils/toast'
import { TextInput, NumericInput, FieldError } from './../../utils/FormHelpers'

class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      plant: '',
      facility: '',
      strain: '',
      start_date: '',
      grow_method: '',
      isLoading: false
    }
  }

  componentDidMount() {
    // loadTasks.loadbatch(this.props.batch_id)
  }

  handleSubmit = event => {
    this.setState({ isLoading: true })
    const url = '/api/v1/batches'
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        batch_source: this.state.plant,
        facility_id: this.state.facility,
        strain_id: this.state.strain,
        start_date: this.state.start_date.toDateString(),
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

  render() {
    const { plants, strains, facilities, grow_methods } = this.props
    console.log('plants', plants)
    return (
      <div className="fl w-90 w-60-l ma4 pa4 bg-white">
        <div id="toast" className="toast" />
        <h5 className="tl pa0 ma0 h5--font dark-grey">Cultivation Setup</h5>
        <p className="mt2 body-1 grey">Search to display available quantity on specific date.</p>
        <GroupBox
          title="Search"
          className="fl w-100 cultivation-setup-container"
          render={() => (
            <React.Fragment>
              <div className="fl w-50 pr3">
                <label className="subtitle-2 grey db mb1">Batch Source</label>
                <Select
                  options={plants}
                  onChange={e => this.handleChange('plant', e.value)}
                  styles={reactSelectStyle}
                />
              </div>
              <div className="fr w-50">
                <label className="subtitle-2 grey db mb1">Date</label>
                <Select
                  options={plants}
                  onChange={e => this.handleChange('plant', e.value)}
                  styles={reactSelectStyle}
                />
              </div>
            </React.Fragment>
          )}
        />
      </div>
    )
  }
}

export default BatchSetupApp
