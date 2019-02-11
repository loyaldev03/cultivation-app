import 'babel-polyfill'
import React from 'react'
import Select from 'react-select'
import { httpPostOptions, selectStyles } from './../../utils'
import { toast } from './../../utils/toast'
import { TextInput } from '../../utils/FormHelpers'

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
      facilityId: props.facilityId || '',
      batchSource: '',
      batchStrain: '',
      batchGrowMethod: '',
      isLoading: false
    }
  }

  validateInputs = () => {
    this.setState({ showValidation: true })
    const { facilityId, batchStrain, batchSource, batchGrowMethod } = this.state
    return facilityId && batchStrain && batchSource && batchGrowMethod
  }

  handleSubmit = event => {
    if (!this.validateInputs()) {
      return false
    }
    this.setState({ isLoading: true })
    fetch(
      '/api/v1/batches',
      httpPostOptions({
        facility_id: this.state.facilityId,
        batch_source: this.state.batchSource,
        facility_strain_id: this.state.batchStrain,
        grow_method: this.state.batchGrowMethod,
        name: this.state.name
      })
    )
      .then(response => response.json())
      .then(data => {
        this.setState({ isLoading: false, errors: {} })
        if (data.data) {
          toast('Batch Created', 'success')
          // Redirect to Batch Location Planning
          window.location.replace(
            `/cultivation/batches/${data.data}?select_location=1`
          )
        } else {
          this.setState({ isLoading: false, errors: data.errors })
          toast('Please check the errors and try again', 'error')
        }
      })
      .catch(error => {
        console.error('catch:', error)
        this.setState({ isLoading: false })
      })
  }

  handleChange = (field, value) => {
    this.setState({ [field]: value })
  }

  switchFacility = facilityId => {
    window.location.replace(
      `/cultivation/batches/new?facility_id=${facilityId}`
    )
  }

  render() {
    const {
      plantSources,
      strains,
      phases,
      growMethods,
      facilities = []
    } = this.props
    const {
      showValidation,
      facilityId,
      batchStrain,
      batchSource,
      batchGrowMethod,
      errors,
      isLoading,
      name
    } = this.state

    const hasVeg2phase = phases.includes('veg2')
    const batchFacilityValue = facilities.find(f => f.value === facilityId)
    const batchStrainValue = strains.find(f => f.value === batchStrain)
    const saveButtonText = isLoading ? 'Saving...' : 'Save and Continue'

    return (
      <div className="fl w-100 ma4 pa4 bg-white" style={{ width: '600px' }}>
        <div id="toast" className="toast" />
        <h5 className="tl pa0 ma0 h5--font dark-grey">Cultivation Setup</h5>
        <p className="mt2 body-1 grey">
          Select strain, batch source and grow method to begin.
        </p>
        <form
          className="fl w-100 relative mt3"
          onSubmit={e => {
            e.preventDefault()
            this.handleSubmit()
          }}
        >
          {facilities.length > 1 && (
            <div className="fl w-100 mb3">
              <label className="subtitle-2 grey fl pv2">Facility</label>
              <div className="fr w-100 measure-narrow">
                <Select
                  styles={selectStyles}
                  options={facilities}
                  value={batchFacilityValue}
                  onChange={e => this.switchFacility(e.value)}
                />
                <ValidationMessage
                  text="Select Facility"
                  enable={showValidation}
                  show={!facilityId}
                />
              </div>
            </div>
          )}
          <div className="fl w-100 mt1 mb3">
            <label className="subtitle-2 grey fl pv2">Batch Name </label>
            <div className="fr w-100 measure-narrow">
              <TextInput
                value={name}
                onChange={e => this.handleChange('name', e.target.value)}
              />
              <ValidationMessage
                text="Input Name"
                enable={showValidation}
                show={!name}
              />
            </div>
          </div>
          <div className="fl w-100 mt1 mb3">
            <label className="subtitle-2 grey fl pv2">Strains </label>
            <div className="fr w-100 measure-narrow">
              <Select
                styles={selectStyles}
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
          <div className="fl w-100 mt1 mb3">
            <label className="subtitle-2 grey fl pv2">Batch Source</label>
            <div className="fr w-100 measure-narrow">
              <Select
                styles={selectStyles}
                options={plantSources}
                className="w-100"
                onChange={e => this.handleChange('batchSource', e.value)}
              />
              <ValidationMessage
                text="Select Batch Source"
                enable={showValidation}
                show={!batchSource}
              />
            </div>
          </div>
          <div className="fl w-100 mt1 mb3">
            <label className="subtitle-2 grey fl pv2">Grow Method</label>
            <div className="fr w-100 measure-narrow">
              <Select
                styles={selectStyles}
                options={growMethods}
                className="w-100"
                onChange={e => this.handleChange('batchGrowMethod', e.value)}
              />
              <ValidationMessage
                text="Select Grow Method"
                enable={showValidation}
                show={!batchGrowMethod}
              />
            </div>
          </div>
          <div className="tr fl w-100">
            <input
              type="submit"
              disabled={isLoading}
              className="btn btn--primary"
              value={saveButtonText}
            />
          </div>
        </form>
      </div>
    )
  }
}

export default BatchSetupApp
