// TODO: Move this to common
import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import PropTypes from 'prop-types'
import { TextInput, FieldError } from '../../../utils/FormHelpers'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import reactSelectStyle from '../../../utils/reactSelectStyle'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

class PurchaseInfoV2 extends React.Component {
  constructor(props) {
    super(props)

    let state = {
      // Placeholders
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,        
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      vendor: { value: '', label: '' },
      purchase_order: { value: '', label: ''},
      invoice: { value: '', label: '' },
      errors: {}
    }

    if (props.vendor) {
      state.vendor = { value: props.vendor.id, label: props.vendor.name }
      state.address = props.vendor.address
      state.vendor_no = props.vendor.vendor_no
      state.vendor_state_license_num = (props.vendor.state_license_num || '')
      state.vendor_state_license_expiration_date = (!props.vendor.state_license_expiration_date ? null : new Date(props.state_license_expiration_date))
      state.vendor_location_license_num = (props.vendor.location_license_num || '')
      state.vendor_location_license_expiration_date = (!props.vendor.location_license_expiration_date ? null : new Date(props.location_license_expiration_date))
    }

    if (props.purchase_order) {
      state.purchase_order = { value: props.purchase_order.id, label: props.purchase_order.purchase_order_no }
      state.purchase_date = (!props.purchase_order.purchase_order_date ? null : new Date(props.purchase_order.purchase_order_date))
    }

    if (props.vendor_invoice) {
      state.invoice = { value: props.vendor_invoice.id, label: props.vendor_invoice.invoice_no }
    }

    this.state = state
  }

  reset() {
    this.setState({
      // Placeholders for onChange event
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null, 
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      // Should be from props
      vendor: { value: '', label: '' },
      purchase_order: { value: '', label: ''},
      invoice: { value: '', label: '' },
      errors: {}
    })
  }

  loadVendors = inputValue => {
    return fetch('/api/v1/vendors?filter=' + inputValue, {
      credentials: 'include'
    }).then(response => response.json())
  }  

  loadPOs = inputValue => {
    const vendor_id = this.state.vendor.value
    if (!vendor_id) {
      return Promise.resolve([])
    }

    return fetch(`/api/v1/purchase_orders?vendor_id=${vendor_id}&filter=${inputValue}`, {
      credentials: 'include'
    }).then(response => response.json())
  }

  loadInvoices = inputValue => {
    const purchase_order_id = this.state.purchase_order.value

    if (!purchase_order_id) {
      return Promise.resolve([])
    }

    return fetch(`/api/v1/vendor_invoices?purchase_order_id=${purchase_order_id}&filter=${inputValue}`, {
      credentials: 'include'
    }).then(response => response.json())
  }

  onStateLicenseExpirationDateChanged = date => {
    this.setState({ vendor_state_license_expiration_date: date })
  }

  onLocationLicenseExpirationDateChanged = date => {
    this.setState({
      vendor_location_license_expiration_date: date
    })
  }

  onPurchaseDateChanged = date => {
    this.setState({ purchase_date: date })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  getValues(isDraft = false) {
    const {
      vendor_no,
      address,
      purchase_date,
      vendor: { value: vendor_id, label: vendor_name },
      purchase_order: { value: purchase_order_id, label: purchase_order_no },
      invoice: { value: invoice_id, label: invoice_no }
    } = this.state

    let errors = {}
    
    if (vendor_name.length <= 0) {
      errors.vendor = ['Vendor is required.']
    }

    if (purchase_order_no.length <= 0) {
      errors.purchase_order = ['Purchase order is required.']
    }

    if (invoice_no.length <= 0) {
      errors.invoice = ['Invoice is required.']
    }

    let { licenseData, errors: licenseError } = this.validateVendorLicense()
    errors = { ...errors, ...licenseError }
    

    if (!isDraft) {
      this.setState({ errors })
    }
    
    const data = {
      vendor_id,
      purchase_order_id,
      invoice_id,
      vendor_name,
      vendor_no,
      address,
      purchase_date,
      invoice_no,
      purchase_order_no,
      errors,
      ...licenseData,
      isValid: Object.getOwnPropertyNames(errors).length === 0
    }

    console.log(data)
    return data
  }

  validateVendorLicense() {
    if (!this.props.showVendorLicense) {
      return {}
    }

    let errors = {}
    let {
      vendor_state_license_num,
      vendor_state_license_expiration_date,
      vendor_location_license_num,
      vendor_location_license_expiration_date,
    } = this.state

    if (!vendor_state_license_num) {
      errors.vendor_state_license_num = ['State license # is required.']
    }

    if (!vendor_state_license_expiration_date) {
      errors.vendor_state_license_expiration_date = ['License expiration date is required.']
    }

    if (!vendor_location_license_num) {
      errors.vendor_location_license_num = ['Location license # is required.']
    }

    if (!vendor_location_license_expiration_date) {
      errors.vendor_location_license_expiration_date = ['License expiration date is required.']
    }

    if (vendor_state_license_expiration_date) {
      vendor_state_license_expiration_date = vendor_state_license_expiration_date.toISOString()
    }

    if (vendor_location_license_expiration_date) {
      vendor_location_license_expiration_date = vendor_location_license_expiration_date.toISOString()
    }

    return {
      vendor_state_license_num,
      vendor_state_license_expiration_date,
      vendor_location_license_num,
      vendor_location_license_expiration_date,
      ...errors
    }
  }

  onSelectVendor = item => {
    if (!item) {
      this.setState({ 
        vendor: { value: '', label: item.label },
        purchase_order: { value: '', label: '' },
        invoice: { value: '', label: '' }
      })
    } else if (item.__isNew__) {
      this.setState({ 
        vendor: { value: '', label: item.label },
        vendor_no: '',
        address: '',
        vendor_state_license_num: '',
        vendor_state_license_expiration_date: null,
        vendor_location_license_num: '',
        vendor_location_license_expiration_date: null,
        purchase_order: { value: '', label: '' },
        invoice: { value: '', label: '' }
      })
    } else {
      let state_license_expiration_date = null
      let location_license_expiration_date = null

      if (item.state_license_expiration_date) {
        state_license_expiration_date = new Date(item.state_license_expiration_date)
      }

      if (item.location_license_expiration_date) {
        location_license_expiration_date = new Date(item.location_license_expiration_date)
      }
      
      this.setState({ 
        vendor: { value: item.value, label: item.label },
        vendor_no: item.vendor_no,
        address: item.address,
        vendor_state_license_num: item.state_license_num,
        vendor_state_license_expiration_date: state_license_expiration_date,
        vendor_location_license_num: item.location_license_num,
        vendor_location_license_expiration_date: location_license_expiration_date,
        purchase_order: { value: '', label: '' },
        invoice: { value: '', label: '' }
      })
    }
  }



  onSelectPO = item => {
    const data = { 
      invoice: { value: '', label: '' },
      purchase_order: { value: '', label: '' }
    }

    if (item.__isNew__) {
      data.purchase_order = { value: '', label: item.label }
    } else {
      data.purchase_order = { value: item.value, label: item.label }
      data.purchase_date = new Date(item.purchase_order_date)
    }

    this.setState(data)
  }

  onSelectInvoice = item => {
    if (item.__isNew__) {
      this.setState({
        invoice: { value: '', label: item.label }
      })
    } else {
      this.setState({
        invoice: { value: item.value, label: item.label }
      })
    }
  }
  
  // Check this data
  // for item tx id: 5be17569edfdb21becf3aef9
  // 
  // address: "5, Earwood St"
  // errors: {}
  // invoice_id: "5bdb4031edfdb2aa8eb8a4e3"
  // invoice_no: "IV 312"
  // isValid: true
  // purchase_date: Wed Nov 07 2018 00:00:00 GMT+0800 (Malaysia Time) {}
  // purchase_order_id: "5bdb4031edfdb2aa8eb8a4e1"
  // purchase_order_no: "po 656"
  // vendor_id: "5bd87939edfdb269078b2269"
  // vendor_name: "v2"
  // vendor_no: "v2"

  renderEditableFields() {
    return (
      <React.Fragment>
        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Vendor No'}
              value={this.state.vendor_no}
              onChange={this.onChangeGeneric}
              errors={this.state.errors}
              fieldname="vendor_no"
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <TextInput
              fieldname="address"
              label={'Address'}
              value={this.state.address}
              onChange={this.onChangeGeneric}
            />
          </div>
        </div>

        {this.props.showVendorLicense && (
          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label={'Vendor State License #'}
                value={this.state.vendor_state_license_num}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
                fieldname="vendor_state_license_num"
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Expiration date</label>
              <DatePicker
                value={this.state.vendor_state_license_expiration_date}
                onChange={this.onStateLicenseExpirationDateChanged}
              />
              <FieldError
                errors={this.state.errors}
                field="vendor_state_license_expiration_date"
              />
            </div>
          </div>
        )}

        {this.props.showVendorLicense && (
          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label={'Vendor Location License #'}
                value={this.state.vendor_location_license_num}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
                fieldname="vendor_location_license_num"
              />
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Expiration date</label>
              <DatePicker
                value={this.state.vendor_location_license_expiration_date}
                onChange={this.onLocationLicenseExpirationDateChanged}
              />
              <FieldError
                errors={this.state.errors}
                field="vendor_location_license_expiration_date"
              />
            </div>
          </div>
        )}
      </React.Fragment>)
  }

  render() {
    const vendorSelected = this.state.vendor.value || this.state.vendor.label
    const poSelected = this.state.purchase_order.value || this.state.purchase_order.label

    return (
      <React.Fragment>
        {this.props.showLabel && (
          <div className="ph4 mb3 mt3">
            <span className="f6 fw6 dark-gray">{this.props.label}</span>
          </div>
        )}
        <div className="ph4 mb3 flex">
          <div className="w-100">
            <AsyncCreatableSelect
              defaultOptions
              cacheOptions
              noOptionsMessage={() => 'Type to search vendor...'}
              loadOptions={this.loadVendors}
              onInputChange={handleInputChange}
              styles={reactSelectStyle}
              placeholder=""
              value={this.state.vendor}
              onChange={this.onSelectVendor}
            />
            <FieldError field="vendor" errors={this.state.errors} />
          </div>
        </div>
      

        {this.renderEditableFields()}

        <div className="ph4 mb3 flex">
          <div className="w-50">
          <label className="f6 fw6 db mb1 gray ttc">PO Number</label>
            <AsyncCreatableSelect
              cacheOptions
              noOptionsMessage={() => 'Type to search PO...'}
              loadOptions={this.loadPOs}
              onInputChange={handleInputChange}
              styles={reactSelectStyle}
              placeholder=""
              value={this.state.purchase_order}
              onChange={this.onSelectPO}
              isDisabled={!vendorSelected}
            />
            <FieldError field="purchase_order" errors={this.state.errors} />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Purchase date</label>
            <DatePicker
              value={this.state.purchase_date}
              onChange={this.onPurchaseDateChanged}
            />
          </div>
        </div>
        <div className="ph4 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Invoice No</label>
            <AsyncCreatableSelect
              cacheOptions
              noOptionsMessage={() => 'Type to search invoice...'}
              loadOptions={this.loadInvoices}
              onInputChange={handleInputChange}
              styles={reactSelectStyle}
              placeholder=""
              value={this.state.invoice}
              onChange={this.onSelectInvoice}
              isDisabled={!poSelected}
            />
            <FieldError field="invoice" errors={this.state.errors} />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

PurchaseInfoV2.propTypes = {
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  showVendorLicense: PropTypes.bool,
  vendor: PropTypes.object,
  purchase_order: PropTypes.object,
  vendor_invoice: PropTypes.object,
}

PurchaseInfoV2.defaultProps = {
  showLabel: true,
  label: 'Where the seeds are sourced from?',
  showVendorLicense: true,
  vendor: null,
  purchase_order: null,
  vendor_invoice: null,
}

export default PurchaseInfoV2
