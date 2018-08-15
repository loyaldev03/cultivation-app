import React from 'react'
import { TextInput } from '../FormHelper'

class CloneEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // source
      cloneIds: '',
      planted_on: '',
      expected_harvest_date: '',
      isBought: false,
      mother_id: '',
      clone_date: '',

      // Vendor/ source
      vendor_name: '',
      vendor_id: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: '',
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: '',
      purchase_date: '',
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

    this.onCloneIdsChanged = this.onCloneIdsChanged.bind(this)
    this.onPlantedOnChanged = this.onPlantedOnChanged.bind(this)
    this.onExpectedHarvestDateChanged = this.onExpectedHarvestDateChanged.bind(
      this
    )
    this.onCloneDateChanged = this.onCloneDateChanged.bind(this)

    this.onIsBoughtChanged = this.onIsBoughtChanged.bind(this)
    this.onMotherIdChanged = this.onMotherIdChanged.bind(this)

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

    this.showMetcMessage = this.showMetcMessage.bind(this)
  }

  onCloneIdsChanged(event) {
    this.setState({ cloneIds: event.target.value })
  }

  onPlantedOnChanged(event) {
    this.setState({ planted_on: event.target.value })
  }

  onExpectedHarvestDateChanged(event) {
    this.setState({ expected_harvest_date: event.target.value })
  }

  onCloneDateChanged(event) {
    this.setState({ clone_date: event.target.value })
  }

  onIsBoughtChanged(event) {
    console.log(event)
    this.setState({ isBought: !this.state.isBought })
  }

  onMotherIdChanged(event) {
    this.setState({ mother_id: event.target.value })
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

  onVendorStateLicenseExpirationDateChanged(event) {
    this.setState({ vendor_state_license_expiration_date: event.target.value })
  }

  onVendorLocationLicenseNumChanged(event) {
    this.setState({ vendor_location_license_num: event.target.value })
  }

  onVendorLocationLicenseExpirationDateChanged(event) {
    this.setState({
      vendor_location_license_expiration_date: event.target.value
    })
  }

  onPurchaseDateChanged(event) {
    this.setState({ purchase_date: event.target.value })
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

  showMetcMessage(event) {
    event.preventDefault()
    alert(
      'It calls on Metrc system to generate / retrieve Plant ID and populates them to text area.'
    )
  }

  renderProcurementInfo() {
    if (!this.state.isBought) {
      return (
        <React.Fragment>
          <div className="ph4 mb3 flex">
            <div className="w-60">
              <TextInput
                label={'Mother plant ID'}
                value={this.state.mother_id}
                onChange={this.onMotherIdChanged}
              />
            </div>
            {/* <div className="w-40 pl3">
              <TextInput label={'Clone date'} value={this.state.clone_date} onChange={this.onCloneDateChanged} />
            </div> */}
            <div className="w-40 pl3">
              <TextInput label={'Mother location ID'} />
            </div>
          </div>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
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
              <TextInput
                label={'Expiration date'}
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
              <TextInput
                label={'Expiration date'}
                value={this.state.vendor_location_license_expiration_date}
                onChange={this.onVendorLocationLicenseExpirationDateChanged}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-50">
              <TextInput
                label={'Purchase Date'}
                value={this.purchase_date}
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

  /* This method might be removed */
  renderStorageInfo() {
    return (
      <React.Fragment>
        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Where it is stored?</span>
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
            <TextInput
              label={'Room Id'}
              value={this.state.room_id}
              onChange={this.onRoomIdChanged}
            />
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
            <TextInput
              label={'Section Id'}
              value={this.state.section_id}
              onChange={this.onSectionIdChanged}
            />
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
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="ph4 mt3 mb3">
          <span className="f6 fw6 dark-gray">Plant IDs</span>
        </div>

        <div className="ph4 mb2 flex">
          <div className="w-100">
            <p className="f7 fw4 gray mt0 mb0 pa0 lh-copy">
              Each clone has its own <strong>Plant ID</strong>.
            </p>
            <p className="f7 fw4 gray mt0 mb2 pa0 lh-copy">
              {' '}
              If you already have them, paste Plant IDs with its corresponding
              tray ID like below:
            </p>
            <textarea
              rows="5"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Plant0001, Tray0001&#10;Plant0002, Tray0001&#10;Plant0003, Tray0002&#10;Plant0004, Tray0002"
            />
          </div>
        </div>
        <div className="ph4 mb4 flex justify-end">
          <a
            href="#"
            onClick={this.showMetcMessage}
            className="fw4 f7 link dark-blue"
          >
            Don't have Plant ID? Click here to generate.
          </a>
        </div>

        <div className="ph4 mt2 mb3 flex">
          <div className="w-60">
            <TextInput
              label={'Planted On'}
              value={this.state.planted_on}
              onChange={this.onPlantedOnChanged}
            />
          </div>
          <div className="w-40 pl3">
            <TextInput
              label={'Expected Harvest Date'}
              value={this.state.expected_harvest_date}
              onChange={this.onExpectedHarvestDateChanged}
            />
          </div>
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <div className="ph4 mb3 mt3">
          <span className="f6 fw6 dark-gray">Where the clones are from?</span>
        </div>
        <div className="ph4 mb3 flex justify-between">
          <label className="f6 fw6 db mb1 gray">Clones are purchased</label>
          <input
            className="toggle toggle-default"
            type="checkbox"
            value="1"
            id="is_bought_input"
            onChange={this.onIsBoughtChanged}
          />
          <label className="toggle-button" htmlFor="is_bought_input" />
        </div>

        {this.renderProcurementInfo()}

        <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
          <a
            className="db tr pv2 ph3 bn br2 ttu tracked link dim f6 fw6 orange"
            href="#"
            onClick={this.props.onResetEditor}
          >
            Save draft
          </a>
          <a
            className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
            href="#"
          >
            Preview &amp; Save
          </a>
        </div>
      </React.Fragment>
    )
  }
}

export default CloneEditor
