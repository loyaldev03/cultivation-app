import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import PropTypes from 'prop-types'
import { TextInput, FieldError } from '../../../../utils/FormHelpers'

// Need default props
class PurchaseInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      vendor_name: props.vendor_name,
      vendor_no: props.vendor_no,
      address: props.address,
      vendor_state_license_num: props.vendor_state_license_num,
      vendor_state_license_expiration_date:
        props.vendor_state_license_expiration_date,
      vendor_location_license_num: props.vendor_location_license_num,
      vendor_location_license_expiration_date:
        props.vendor_location_license_expiration_date,
      purchase_date: props.purchase_date,
      invoice_no: props.invoice_no,
      errors: {}
    }

    // Vendor/ source
    this.onNameChanged = this.onNameChanged.bind(this)
    this.onVendorNoChanged = this.onVendorNoChanged.bind(this)
    this.onAddressChanged = this.onAddressChanged.bind(this)
    this.onStateLicenseChanged = this.onStateLicenseChanged.bind(this)
    this.onStateLicenseExpirationDateChanged = this.onStateLicenseExpirationDateChanged.bind(
      this
    )
    this.onLocationLicenseChanged = this.onLocationLicenseChanged.bind(this)
    this.onLocationLicenseExpirationDateChanged = this.onLocationLicenseExpirationDateChanged.bind(
      this
    )
    this.onPurchaseDateChanged = this.onPurchaseDateChanged.bind(this)
    this.onInvoiceNoChanged = this.onInvoiceNoChanged.bind(this)
  }

  onNameChanged(event) {
    this.setState({ vendor_name: event.target.value })
  }

  onVendorNoChanged(event) {
    this.setState({ vendor_no: event.target.value })
  }

  onAddressChanged(event) {
    this.setState({ address: event.target.value })
  }

  onStateLicenseChanged(event) {
    this.setState({ vendor_state_license_num: event.target.value })
  }

  onStateLicenseExpirationDateChanged(date) {
    this.setState({ vendor_state_license_expiration_date: date })
  }

  onLocationLicenseChanged(event) {
    this.setState({ vendor_location_license_num: event.target.value })
  }

  onLocationLicenseExpirationDateChanged(date) {
    this.setState({
      vendor_location_license_expiration_date: date
    })
  }

  onPurchaseDateChanged(date) {
    this.setState({ purchase_date: date })
  }

  onInvoiceNoChanged(event) {
    this.setState({ invoice_no: event.target.value })
  }

  getValues(isDraft = false) {
    let errors = {}
    const {
      vendor_name,
      vendor_no,
      address,
      vendor_state_license_num,
      vendor_state_license_expiration_date,
      vendor_location_license_num,
      vendor_location_license_expiration_date,
      purchase_date,
      invoice_no
    } = this.state

    if (!isDraft) {
      if (vendor_name === undefined || vendor_name.length <= 0) {
        errors = { ...errors, vendor_name: ['Vendor name is required.'] }
      }

      if (
        vendor_state_license_num === undefined ||
        vendor_state_license_num.length <= 0
      ) {
        errors = {
          ...errors,
          vendor_state_license_num: ['State license # is required.']
        }
      }

      if (vendor_state_license_expiration_date === null) {
        errors = {
          ...errors,
          vendor_state_license_expiration_date: [
            'License expiration date is required.'
          ]
        }
      }

      if (
        vendor_location_license_num === undefined ||
        vendor_location_license_num.length <= 0
      ) {
        errors = {
          ...errors,
          vendor_location_license_num: ['Location license # is required.']
        }
      }

      if (vendor_location_license_expiration_date === null) {
        errors = {
          ...errors,
          vendor_location_license_expiration_date: [
            'License expiration date is required.'
          ]
        }
      }

      this.setState({ errors })

      return {
        vendor_name,
        vendor_no,
        address,
        vendor_state_license_num,
        vendor_state_license_expiration_date: vendor_state_license_expiration_date.toISOString(),
        vendor_location_license_num,
        vendor_location_license_expiration_date: vendor_location_license_expiration_date.toISOString(),
        purchase_date,
        invoice_no,
        errors,
        isValid: Object.getOwnPropertyNames(errors).length === 0
      }
    }

    return {
      vendor_name,
      vendor_no,
      address,
      vendor_state_license_num,
      vendor_state_license_expiration_date,
      vendor_location_license_num,
      vendor_location_license_expiration_date,
      purchase_date,
      invoice_no,
      errors
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.showLabel && (
          <div className="ph4 mb3 mt3">
            <span className="f6 fw6 dark-gray">{this.props.label}</span>
          </div>
        )}
        <div className="ph4 mb3 flex">
          <div className="w-100">
            <TextInput
              label={'Vendor name'}
              value={this.state.vendor_name}
              onChange={this.onNameChanged}
              errors={this.state.errors}
              fieldname="vendor_name"
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Vendor No'}
              value={this.state.vendor_no}
              onChange={this.onVendorNoChanged}
              errors={this.state.errors}
              fieldname="vendor_no"
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-100">
            <TextInput
              label={'Address'}
              value={this.state.address}
              onChange={this.onAddressChanged}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Vendor State License #'}
              value={this.state.vendor_state_license_num}
              onChange={this.onStateLicenseChanged}
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

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Vendor location license #'}
              value={this.state.vendor_location_license_num}
              onChange={this.onLocationLicenseChanged}
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

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray ttc">Purchase date</label>
            <DatePicker
              value={this.state.purchase_date}
              onChange={this.onPurchaseDateChanged}
            />
          </div>
          <div className="w-50 pl3">
            <TextInput
              label={'Invoice no'}
              value={this.state.invoice_no}
              onChange={this.onInvoiceNoChanged}
            />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

PurchaseInfo.propTypes = {
  vendor_name: PropTypes.string,
  vendor_no: PropTypes.string,
  address: PropTypes.string,
  vendor_state_license_num: PropTypes.string,
  vendor_state_license_expiration_date: PropTypes.instanceOf(Date),
  vendor_location_license_num: PropTypes.string,
  vendor_location_license_expiration_date: PropTypes.instanceOf(Date),
  purchase_date: PropTypes.instanceOf(Date),
  invoice_no: PropTypes.string,
  showLabel: PropTypes.bool,
  label: PropTypes.string
}

PurchaseInfo.defaultProps = {
  vendor_state_license_expiration_date: null,
  vendor_location_license_expiration_date: null,
  purchase_date: null,
  showLabel: true,
  label: 'Where the seeds are sourced from?'
}

export default PurchaseInfo