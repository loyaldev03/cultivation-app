import React from 'react'
import {
  TextInput,
  NumericInput,
  FieldError
} from '../../../../utils/FormHelpers'
import PurchaseInfo from '../shared/PurchaseInfo'
import StorageInfo from '../shared/StorageInfo'

class SeedEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      quantity: '',
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
      room_id: '',
      section_name: '',
      section_id: '',
      row_id: '',
      shelf_id: '',
      tray_id: '',
      facility_id: '',

      // Validation errors outside of custom components
      errors: {}
    }

    this.purchaseInfoEditor = React.createRef()
    this.storageInfoEditor = React.createRef()

    this.onQuantityChanged = this.onQuantityChanged.bind(this)
    this.onPackageIdChanged = this.onPackageIdChanged.bind(this)
    this.onSave = this.onSave.bind(this)
    this.onSaveDraft = this.onSaveDraft.bind(this)
  }

  onPackageIdChanged(event) {
    this.setState({ package_id: event.target.value })
  }

  onQuantityChanged(event) {
    this.setState({ quantity: event.target.value })
  }

  onSave(event) {
    const strainData = this.props.onValidateParent()
    // console.log(strainData)

    const purchaseData = this.purchaseInfoEditor.current.getValues()
    // console.log(purchaseData)

    const storageInfo = this.storageInfoEditor.current.getValues()
    // console.log(storageInfo)

    if (this.validate()) {
      const data = {
        ...strainData,
        ...purchaseData,
        ...storageInfo,
        quantity: this.state.quantity,
        package_id: this.state.package_id
      }

      console.log(data)
      // call save by passing data
      // saveSeed(data).then( x => afterSave(x) )
    }

    event.preventDefault()
  }

  onSaveDraft(event) {
    const strainData = this.props.onValidateParent(true)
    const purchaseData = this.purchaseInfoEditor.current.getValues(true)
    const storageInfo = this.storageInfoEditor.current.getValues(true)
    const data = {
      ...strainData,
      ...purchaseData,
      ...storageInfo,
      quantity: this.state.quantity,
      package_id: this.state.package_id
    }
    console.log(data)
    event.preventDefault()
  }

  validate() {
    let errors = {}
    if (this.state.quantity <= 0 || !this.state.quantity) {
      errors = { ...errors, quantity: ['Quantity must be at least 1.'] }
    }

    if (this.state.package_id.length <= 0) {
      errors = { ...errors, package_id: ['Package ID must be present.'] }
    }

    this.setState({ errors })
    return Object.getOwnPropertyNames(errors).length === 0
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
            <FieldError errors={this.state.errors} field="quantity" />
          </div>
          <div className="w-60 pl3">
            <TextInput
              label={'Package Id'}
              value={this.state.package_id}
              onChange={this.onPackageIdChanged}
            />
            <FieldError errors={this.state.errors} field="package_id" />
          </div>
        </div>

        <hr className="mt3 m b--light-gray w-100" />
        <PurchaseInfo
          ref={this.purchaseInfoEditor}
          vendor_name={this.state.vendor_name}
          vendor_id={this.state.vendor_id}
          address={this.state.address}
          vendor_state_license_num={this.state.vendor_state_license_num}
          vendor_state_license_expiration_date={
            this.state.vendor_state_license_expiration_date
          }
          vendor_location_license_num={this.state.vendor_location_license_num}
          vendor_location_license_expiration_date={
            this.state.vendor_location_license_expiration_date
          }
          purchase_date={this.state.purchase_date}
          invoice_no={this.state.invoice_no}
        />

        <hr className="mt3 m b--light-gray w-100" />
        <StorageInfo
          ref={this.storageInfoEditor}
          mode="storage"
          locations={this.props.locations}
          room_id={this.state.room_id}
          section_name={this.state.section_name}
          section_id={this.state.section_id}
        />

        <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
          <a
            className="db tr pv2 ph3 bn br2 ttu tracked link dim f6 fw6 orange"
            href="#"
            onClick={this.props.onSaveDraft}
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
