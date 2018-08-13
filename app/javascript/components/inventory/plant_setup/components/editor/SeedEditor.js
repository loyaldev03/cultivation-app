import React from 'react'
import DatePicker from 'react-date-picker'
import { TextInput, NumericInput } from '../../../../utils/FormHelpers'

class SeedEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: undefined,
      package_id: '',

      // Vendor/ source
      vendor_name: '',
      vendor_id: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      invoice_no: '',

      // Storage location
      room: '',
      room_id: '',
      section_name: '',
      section_id: '',
      row_id: '',
      shelf_id: '',
      tray_id: ''
    }

    this.onQuantityChanged = this.onQuantityChanged.bind(this)
    this.onPackageIdChanged = this.onPackageIdChanged.bind(this)

    // Vendor/ source
    this.onVendorNameChanged = this.onVendorNameChanged.bind(this)
    this.onVendorIDChanged = this.onVendorIDChanged.bind(this)
    this.onAddressChanged = this.onAddressChanged.bind(this)
    this.onVendorStateLicenseNumChanged = this.onVendorStateLicenseNumChanged.bind(
      this
    )
    this.onVendorStateLicenseExpirationDateChanged = this.onVendorStateLicenseExpirationDateChanged.bind(
      this
    )
    this.onVendorLocationLicenseNumChanged = this.onVendorLocationLicenseNumChanged.bind(
      this
    )
    this.onVendorLocationLicenseExpirationDateChanged = this.onVendorLocationLicenseExpirationDateChanged.bind(
      this
    )
    this.onPurchaseDateChanged = this.onPurchaseDateChanged.bind(this)
    this.onInvoiceNoChanged = this.onInvoiceNoChanged.bind(this)

    // Storage location
    this.onRoomChanged = this.onRoomChanged.bind(this)
    this.onRoomIdChanged = this.onRoomIdChanged.bind(this)
    this.onSectionNameChanged = this.onSectionNameChanged.bind(this)
    this.onSectionIdChanged = this.onSectionIdChanged.bind(this)
    this.onRowIdChanged = this.onRowIdChanged.bind(this)
    this.onShelfIdChanged = this.onShelfIdChanged.bind(this)
    this.onTrayIdChanged = this.onTrayIdChanged.bind(this)

    this.onSave = this.onSave.bind(this)
  }

  onPackageIdChanged(event) {
    this.setState({ package_id: event.target.value })
  }

  onQuantityChanged(event) {
    this.setState({ quantity: event.target.value })
  }

  onVendorNameChanged(event) {
    this.setState({ vendor_name: event.target.value })
  }

  onVendorIDChanged(event) {
    this.setState({ vendor_id: event.target.value })
  }

  onAddressChanged(event) {
    this.setState({ address: event.target.value })
  }

  onVendorStateLicenseNumChanged(event) {
    this.setState({ vendor_state_license_num: event.target.value })
  }

  onVendorStateLicenseExpirationDateChanged(date) {
    this.setState({ vendor_state_license_expiration_date: date })
  }

  onVendorLocationLicenseNumChanged(event) {
    this.setState({ vendor_location_license_num: event.target.value })
  }

  onVendorLocationLicenseExpirationDateChanged(date) {
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

  onRoomChanged(event) {
    this.setState({ room: event.target.value })
  }

  onRoomIdChanged(event) {
    this.setState({ room_id: event.target.value })
  }

  onSectionNameChanged(event) {
    this.setState({ section_name: event.target.value })
  }

  onSectionIdChanged(event) {
    this.setState({ section_id: event.target.value })
  }

  onRowIdChanged(event) {
    this.setState({ row_id: event.target.value })
  }

  onShelfIdChanged(event) {
    this.setState({ shelf_id: event.target.value })
  }

  onTrayIdChanged(event) {
    this.setState({ tray_id: event.target.value })
  }

  onSave(event) {
    const data = this.props.onValidateParent()
    console.log(data)
    event.preventDefault()
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 mt3 mb3">
          <span className="f6 fw6 dark-gray">Stock count</span>
          <p className="f7 fw4 gray mt2">
            It is recommended to add stock by invoice received.
          </p>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-60">
            <NumericInput
              label={'Quantity'}
              placeholder={'Number of seeds'}
              value={this.state.quantity}
              onChange={this.onQuantityChanged}
            />
          </div>
          <div className="w-60 pl3">
            <TextInput
              label={'Package Id'}
              value={this.state.package_id}
              onChange={this.onPackageIdChanged}
            />
          </div>
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">
            Where the seeds are sourced from?
          </span>
        </div>
        <div className="ph4 mb3 flex">
          <div className="w-100">
            <TextInput
              label={'Vendor name'}
              value={this.state.vendor_name}
              onChange={this.onVendorNameChanged}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Vendor ID'}
              value={this.state.vendor_id}
              onChange={this.onVendorIDChanged}
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
              value={this.vendor_state_license_num}
              onChange={this.onVendorStateLicenseNumChanged}
            />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Expiration date</label>
            <DatePicker
              value={this.state.vendor_state_license_expiration_date}
              onChange={this.onVendorStateLicenseExpirationDateChanged}
            />
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-50">
            <TextInput
              label={'Vendor location license #'}
              value={this.vendor_location_license_num}
              onChange={this.onVendorLocationLicenseNumChanged}
            />
          </div>
          <div className="w-50 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Expiration date</label>
            <DatePicker
              value={this.state.vendor_location_license_expiration_date}
              onChange={this.onVendorLocationLicenseExpirationDateChanged}
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

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Where are they stored?</span>
        </div>
        <div className="ph4 mb3 flex">
          <div className="w-60">
            <TextInput
              label={'Room'}
              value={this.state.room}
              onChange={this.onRoomChanged}
            />
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Room ID</label>
            <p className="i f6 fw4 black-30">Room ID</p>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-60">
            <TextInput
              label={'Section'}
              value={this.state.section_name}
              onChange={this.onSectionNameChanged}
            />
          </div>
          <div className="w-40 pl3">
            <label className="f6 fw6 db mb1 gray ttc">Section ID</label>
            <p className="i f6 fw4 black-30">Section ID</p>
          </div>
        </div>

        <div className="ph4 mb3 flex">
          <div className="w-30">
            <TextInput
              label={'Row Id'}
              value={this.state.row_id}
              onChange={this.onRowIdChanged}
            />
          </div>
          <div className="w-30 pl3">
            <TextInput
              label={'Shelf Id'}
              value={this.state.shelf_id}
              onChange={this.onShelfIdChanged}
            />
          </div>
          <div className="w-40 pl3">
            <TextInput
              label={'Tray Id'}
              value={this.state.tray_id}
              onChange={this.onTrayIdChanged}
            />
          </div>
        </div>

        <div className="w-100 mt4 pa4 bt b--black-10 flex items-center justify-between">
          <a
            className="db tr pv2 ph3 bn br2 ttu tracked link dim f6 fw6 orange"
            href="#"
            onClick={this.props.onResetEditor}
          >
            Save draft
          </a>
          <a
            className="db pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6 pointer"
            onClick={this.onSave}
          >
            Preview &amp; Save
          </a>
        </div>
      </React.Fragment>
    )
  }
}

export default SeedEditor
