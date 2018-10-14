import React from 'react'
import Select from 'react-select'

import { render } from 'react-dom'
import { reactSelectStyleChip } from './../../utils/reactSelectStyle'
import { GroupBox, monthsOptions } from './../../utils'
import { toast } from './../../utils/toast'
import { TextInput, NumericInput, FieldError } from './../../utils/FormHelpers'

class BatchSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      searchFacility: '',
      searchSource: '',
      searchMonth: '',
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

  handleChangeInput = e => {
    let key = e.target.attributes.fieldname.value
    let value = e.target.value
    this.setState({ [key]: value })
  }

  handleSearch = e => {
    console.log(
      'Search Params',
      this.state.searchFacility,
      this.state.searchSource,
      this.state.searchMonth
    )
  }

  setDateValue = event => {}

  render() {
    const { plantSources, strains, facilities, growMethods } = this.props
    console.log('plantSources', plantSources)
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
                    onChange={e => this.handleChange('searchFacility', e.value)}
                  />
                </div>
                <div className="fl w-third pr2">
                  <label className="subtitle-2 grey db mb1">Batch Source</label>
                  <Select
                    options={plantSources}
                    onChange={e => this.handleChange('searchSource', e.value)}
                  />
                </div>
                <div className="fl w-20">
                  <label className="subtitle-2 grey db mb1">Month</label>
                  <Select
                    options={monthsOptions()}
                    onChange={e => this.handleChange('searchMonth', e.value)}
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
      </div>
    )
  }
}

export default BatchSetupApp
