import React from 'react'
import StrainAutoSuggest from './StrainAutoSuggest'
import { NumericInput, FieldError } from '../../../utils/FormHelpers'
import saveStrain from '../actions/saveStrain'
import getStrain from '../actions/getStrain'

export default class StrainEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.strainPicker = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const { facility_strain_id } = event.detail

      if (!facility_strain_id) {
        this.reset()
        return
      }

      getStrain(facility_strain_id).then(data => {
        const {
          id,
          strain_name,
          strain_type,
          facility_id,
          thc,
          cbd,
          indica_makeup,
          sativa_makeup,
          testing_status
        } = data.data.attributes

        this.setState({
          id,
          strain_name,
          strain_type,
          facility_id,
          thc: thc || '',
          cbd: cbd || '',
          indica_makeup: indica_makeup || '',
          sativa_makeup: sativa_makeup || '',
          testing_status,
          errors: {}
        })
      })
    })
  }

  resetState() {
    return {
      id: '',
      strain_name: '',
      strain_type: '',
      facility_id: this.props.facility_id || '',
      thc: '',
      cbd: '',
      indica_makeup: 0,
      sativa_makeup: 0,
      testing_status: 'third_party',
      errors: {}
    }
  }

  genericOnChange = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
    
    if(key == "indica_makeup"){
      this.setState({sativa_makeup: 100 - value});
    }else if(key == "sativa_makeup"){
      this.setState({indica_makeup: 100 - value});

    }
  }

  onFacilityChanged = data => {
    this.setState({ facility_id: data.f_id })
  }

  onStrainSelected = ({ strain, strain_type }) => {
    this.setState({
      strain_name: strain,
      strain_type
    })
  }

  onCloseEditor = () => {
    window.editorSidebar.close()
  }

  onSaveForLater = () => {
    window.editorSidebar.close()
  }

  onSave = event => {
    const { errors, isValid, ...payload } = this.getValues()
    if (!isValid) {
      this.setState({ errors })
      return
    }

    saveStrain(payload).then(result => {
      if (result.data.errors) {
        this.setState({ errors: result.data.errors })
      } else {
        this.reset()
        this.onCloseEditor()
      }
    })

    event.preventDefault()
  }

  reset() {
    this.setState(this.resetState())
  }

  getValues() {
    const {
      id,
      strain_name,
      strain_type,
      facility_id,
      thc,
      cbd,
      indica_makeup,
      sativa_makeup,
      testing_status
    } = this.state

    let errors = {}

    if (facility_id.trim().length == 0) {
      errors.facility_id = ['Facility is required.']
    }

    const isValid =
      Object.getOwnPropertyNames(errors).length == 0 &&
      this.strainPicker.current.validate().isValid

    return {
      id,
      strain_name,
      strain_type,
      facility_id,
      thc,
      cbd,
      indica_makeup,
      sativa_makeup,
      testing_status,
      isValid,
      errors
    }
  }

  renderForm() {
    const percentageOptions = []
    for (let i = 0; i <= 20; i++) {
      percentageOptions.push(
        <option key={i} value={i * 5}>
          {i * 5} %
        </option>
      )
    }

    return (
      <React.Fragment>
        <StrainAutoSuggest
          ref={this.strainPicker}
          key={this.state.strain_name}
          strain_name={this.state.strain_name}
          strain_type={this.state.strain_type}
          onStrainSelected={this.onStrainSelected}
        />
        <div className="ph4">
          <FieldError errors={this.state.errors} field="strain_name" />
        </div>

        <hr className="mt3 m b--light-gray w-100" />

        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb0 dark-gray ttc">
              Strain details
            </label>
            <p className="i f7 gray mt1">
              Remember to complete the following before synchronize to Metrc.
            </p>
          </div>
        </div>
        <div className="ph4 mt3 flex">
          <div className="w-50">
            <NumericInput
              label="THC content"
              fieldname="thc"
              value={this.state.thc}
              onChange={this.genericOnChange}
            />
            <p className="i f7 gray mt1">
              This is a 2 year average of testing.
            </p>
          </div>
          <div className="w-50 pl3">
            <NumericInput
              label="CBD content"
              fieldname="cbd"
              value={this.state.cbd}
              onChange={this.genericOnChange}
            />
            <p className="i f7 gray mt1">
              This is a 2 year average of testing.
            </p>
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Indica makeup</label>
            <select
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
              fieldname="indica_makeup"
              value={this.state.indica_makeup}
              onChange={this.genericOnChange}
            >
              {percentageOptions}
            </select>
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Sativa makeup</label>
            <select
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
              fieldname="sativa_makeup"
              value={this.state.sativa_makeup}
              onChange={this.genericOnChange}
            >
              {percentageOptions}
            </select>
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Testing status</label>
            <select
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
              fieldname="testing_status"
              value={this.state.testing_status}
              onChange={this.genericOnChange}
            >
              <option value="ThirdParty">Third party</option>
              <option value="InHouse">In House</option>
              <option value="None">None</option>
            </select>
          </div>
        </div>

        <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
          <a
            className="db tr pv2 ph0 bn br2 ttu tracked link dim f6 fw6 orange"
            href="#"
            onClick={this.onSaveForLater}
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
      </React.Fragment>
    )
  }

  render() {
    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Strain</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={this.onCloseEditor}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>
          {this.renderForm()}
        </div>
      </div>
    )
  }
}
