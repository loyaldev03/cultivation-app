import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import PropTypes from 'prop-types'
import { TextInput, FieldError } from '../../../../utils/FormHelpers'

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
      purchase_order_no: props.purchase_order_no,
      errors: {}
    }
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
      invoice_no,
      purchase_order_no
    } = this.state

    if (!isDraft) {
      if (vendor_name === undefined || vendor_name.length <= 0) {
        errors = { ...errors, vendor_name: ['Vendor name is required.'] }
      }

      if (
        this.props.vendorLicense && (
        vendor_state_license_num === undefined ||
        vendor_state_license_num.length <= 0)
      ) {
        errors = {
          ...errors,
          vendor_state_license_num: ['State license # is required.']
        }
      }

      if (this.props.vendorLicense && vendor_state_license_expiration_date === null) {
        errors = {
          ...errors,
          vendor_state_license_expiration_date: [
            'License expiration date is required.'
          ]
        }
      }

      if (
        this.props.vendorLicense && (
        vendor_location_license_num === undefined ||
        vendor_location_license_num.length <= 0)
      ) {
        errors = {
          ...errors,
          vendor_location_license_num: ['Location license # is required.']
        }
      }

      if (this.props.vendorLicense && vendor_location_license_expiration_date === null) {
        errors = {
          ...errors,
          vendor_location_license_expiration_date: [
            'License expiration date is required.'
          ]
        }
      }

      this.setState({ errors })

      let licenseData = {}
      if (this.props.vendorLicense) {
        licenseData = {
          vendor_state_license_num,
          vendor_state_license_expiration_date: vendor_state_license_expiration_date
            ? vendor_state_license_expiration_date.toISOString()
            : null,
          vendor_location_license_num,
          vendor_location_license_expiration_date: vendor_location_license_expiration_date
            ? vendor_location_license_expiration_date.toISOString()
            : null
        }
      }

      return {
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
      purchase_order_no,
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
              onChange={this.onChangeGeneric}
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

        {this.props.vendorLicense && (
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

        {this.props.vendorLicense && (
          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label={'Vendor location license #'}
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
              fieldname="purchase_order_no"
              label={'PO Number'}
              value={this.state.purchase_order_no}
              onChange={this.onChangeGeneric}
            />
          </div>
        </div>
        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              fieldname="invoice_no"
              label={'Invoice no'}
              value={this.state.invoice_no}
              onChange={this.onChangeGeneric}
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
  purchase_order_no: PropTypes.string,
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  vendorLicense: PropTypes.bool
}

PurchaseInfo.defaultProps = {
  vendor_state_license_expiration_date: null,
  vendor_location_license_expiration_date: null,
  purchase_date: null,
  showLabel: true,
  purchase_order_no: '',
  invoice_no: '',
  label: 'Where the seeds are sourced from?',
  vendorLicense: true
}

export default PurchaseInfo
