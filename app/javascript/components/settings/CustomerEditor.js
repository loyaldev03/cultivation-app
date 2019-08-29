import React from 'react'
import StrainAutoSuggest from '../../components/inventory/strains/components/StrainAutoSuggest'
import { NumericInput, FieldError } from '../utils/FormHelpers'
import saveStrain from '../../components/inventory/strains/actions/saveStrain'
import getStrain from '../../components/inventory/strains/actions/getStrain'
import CustomerStore from './CustomerStore'
import Select from 'react-select'
import countryList from 'react-select-country-list'

const defaultSelect = {
  value: '',
  label: 'Please Select..'
}

export default class CustomerEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()

    // this.state = {
    //     options: this.options,
    //     value: null
    //   }
    //this.strainPicker = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const { customer_id } = event.detail
      if (!customer_id) {
        this.reset()
        this.setState({ value: defaultSelect })
        return
      }

      CustomerStore.getCustomer(customer_id).then(data => {
        const {
          id,
          account_no,
          license_type,
          state_license,
          name
        } = CustomerStore.customer

        const {
          address,
          zipcode,
          city,
          state,
          country
        } = CustomerStore.customer.addresses[0]

        let label = countryList().getLabel(country)

        this.setState({
          id,
          account_no: account_no || '',
          license_type: license_type || '',
          state_license: state_license || '',
          name,
          address: address || '',
          zipcode: zipcode || '',
          city: city || '',
          state: state || '',
          country: country || '',
          value: { value: country || '', label: label || 'Please Select..' },
          form_type: 'Edit',
          errors: {}
        })
      })
    })
  }

  resetState() {
    return {
      id: '',
      account_no: '',
      license_type: '',
      state_license: '',
      name: '',
      address: '',
      zipcode: '',
      city: '',
      state: '',
      country: '',
      value: defaultSelect,
      form_type: 'Add',
      errors: {}
    }
  }

  changeHandler = value => {
    //this.setState({ value })
    console.log(value.value)
    this.setState({ country: value.value })
    this.setState({ value })
  }

  genericOnChange = event => {
    const key = event.target.name
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onCloseEditor = () => {
    window.editorSidebar.close()
  }

  onSave = event => {
    //this.onCloseEditor()
    const { errors, isValid, ...payload } = this.getValues()
    if (!isValid) {
      this.setState({ errors })
      return
    }

    CustomerStore.saveCustomer(payload).then(result => {
      if (result.data.errors) {
        this.setState({ errors: result.data.errors })
      } else {
        this.reset()
        this.onCloseEditor()
        CustomerStore.loadCustomer()
      }
    })
  }

  reset() {
    this.setState(this.resetState())
  }

  getValues() {
    const {
      id,
      account_no,
      license_type,
      state_license,
      name,
      address,
      zipcode,
      city,
      state,
      country
    } = this.state

    let errors = {}

    if (name.trim().length == 0) {
      errors.name = ['Name is required.']
    }
    if (state_license.trim().length == 0) {
      errors.state_license = ['State License is required.']
    }

    const isValid = Object.getOwnPropertyNames(errors).length == 0

    return {
      id,
      account_no,
      license_type,
      state_license,
      name,
      address,
      zipcode,
      city,
      state,
      country,
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
    const options = countryList().getData()

    return (
      <React.Fragment>
        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray">Account No</label>
            <input
              type="text"
              name="account_no"
              value={this.state.account_no}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
        </div>
        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">License Type</label>
            <input
              type="text"
              name="license_type"
              value={this.state.license_type}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray">State License</label>
            <input
              type="text"
              name="state_license"
              value={this.state.state_license}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
            <FieldError errors={this.state.errors} field="state_license" />
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray">Name</label>
            <input
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
            <FieldError errors={this.state.errors} field="name" />
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray">Address</label>
            <input
              type="text"
              name="address"
              value={this.state.address}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
        </div>

        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">Zipcode</label>
            <input
              type="text"
              name="zipcode"
              value={this.state.zipcode}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray">City</label>
            <input
              type="text"
              name="city"
              value={this.state.city}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
        </div>
        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">State</label>
            <input
              type="text"
              name="state"
              value={this.state.state}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray">Country</label>
            {/* <input
              type="text"
              name="country"
              value={this.state.country}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            /> */}
            <Select
              options={options}
              value={this.state.value}
              onChange={this.changeHandler}
            />
          </div>
        </div>

        <div>
          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
            <div />
            <button
              className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
              onClick={this.onSave}
            >
              Save
            </button>
          </div>
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
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              {this.state.form_type} Customer
            </h1>
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
