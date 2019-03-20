import React from 'react'
import Select from 'react-select'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { NumericInput, FieldError } from '../../../../utils/FormHelpers'
import LocationPicker from '../../../../utils/LocationPicker2'
import PurchaseInfo from '../shared/PurchaseInfo'
import setupMother from '../../actions/setupMother'
import getPlant from '../../actions/getPlant'
import reactSelectStyle from '../../../../utils/reactSelectStyle'
import { launchBarcodeScanner } from '../../../../utils/BarcodeScanner'

class MotherEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.scanner = null
    this.locations = this.props.locations

    // Callback ref to get instance of html DOM: https://reactjs.org/docs/refs-and-the-dom.html#callback-refs
    // Getting a ref to textarea in order to adjust height according to content.
    this.plantIdsTextArea = null
    this.setPlantIdsTextArea = element => {
      this.plantIdsTextArea = element
    }

    this.purchaseInfoEditor = null
    this.setPurchaseInfoEditor = element => {
      this.purchaseInfoEditor = element
    }
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-close', () => {
      if (this.scanner) {
        this.scanner.destroy()
      }
    })

    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (!id) {
        this.setState(this.resetState())
        return
      }

      getPlant(event.detail.id, 'vendor_invoice, vendor, purchase_order').then(
        ({ status, data }) => {
          if (status != 200) {
            alert('something wrong')
            return
          }
          const invoice = data.attributes.vendor_invoice
          const purchase_order = data.attributes.purchase_order
          let invoice_attr = {}
          if (invoice) {
            invoice_attr = {
              purchase_date: new Date(invoice.invoice_date),
              invoice_no: invoice.invoice_no,
              purchase_order_no: purchase_order.purchase_order_no
            }
          }

          const vendor = data.attributes.vendor
          let vendor_attr = {}
          if (vendor) {
            vendor_attr = {
              vendor_id: vendor.id,
              vendor_name: vendor.name,
              vendor_no: vendor.vendor_no,
              address: vendor.address,
              vendor_state_license_num: vendor.state_license_num,
              vendor_state_license_expiration_date: new Date(
                vendor.state_license_expiration_date
              ),
              vendor_location_license_num: vendor.location_license_num,
              vendor_location_license_expiration_date: new Date(
                vendor.location_license_expiration_date
              )
            }
          }

          const attrs = data.attributes
          const strainOption = this.props.facilityStrains.find(
            x => x.value === attrs.facility_strain_id
          )

          this.setState({
            ...this.resetState(),
            id: data.id,
            facility_strain_id: attrs.facility_strain_id,
            facility_id: strainOption.facility_id,
            strain_name: strainOption.label,
            plant_ids: attrs.plant_id,
            location_id: attrs.location_id,
            planted_on: new Date(attrs.planting_date),
            isBought: Object.getOwnPropertyNames(vendor_attr).length > 0,
            ...vendor_attr,
            ...invoice_attr
          })
        }
      )
    })
  }

  resetState() {
    return {
      id: '',
      strainOptions: this.props.facilityStrains,
      facility_strain_id: '',
      facility_id: '',
      strain_name: '',
      planted_on: null,
      // source
      plant_ids: '',
      location_id: '',
      // Vendor/ source
      vendor_id: '',
      vendor_name: '',
      vendor_no: '',
      address: '',
      vendor_state_license_num: '',
      vendor_state_license_expiration_date: null,
      vendor_location_license_num: '',
      vendor_location_license_expiration_date: null,
      purchase_date: null,
      invoice_no: '',
      purchase_order_no: '',
      // UI states
      isBought: false,
      showScanner: false,
      scannerReady: false,
      errors: {}
    }
  }

  onChangePlantIds = event => {
    this.setState({ plant_ids: event.target.value }, this.resizePlantIDTextArea)
  }

  resizePlantIDTextArea = () => {
    const lines = (this.state.plant_ids.match(/\n/g) || []).length
    const node = this.plantIdsTextArea

    if (!node) {
      return
    }

    if (lines < 3) {
      node.style.height = 'auto'
      node.style.minHeight = ''
    } else if (lines >= 3 && lines < 15) {
      node.style.height = 40 + lines * 25 + 'px'
      node.style.minHeight = ''
    } else {
      node.style.minHeight = 40 + 15 * 25 + 'px'
      node.style.height = 'auto'
    }
  }

  onPlantedOnChanged = date => {
    this.setState({ planted_on: date })
  }

  onChangeGeneratorPlantQty = event => {
    this.setState({ plant_qty: event.target.value })
  }

  onToggleGeneratePlantId = event => {
    this.setState({
      isShowPlantQtyForm: !this.state.isShowPlantQtyForm
    })
    if (event) event.preventDefault()
  }

  onStrainSelected = data => {
    this.setState({
      facility_strain_id: data.value,
      facility_id: data.facility_id,
      strain_name: data.label
    })
  }

  onLocationChanged = ({ location_id }) => {
    this.setState({ location_id })
  }

  onIsBoughtChanged = () => {
    this.setState({ isBought: !this.state.isBought })
  }

  onSave = event => {
    const { errors, isValid, ...payload } = this.validateAndGetValues()

    if (isValid) {
      setupMother(payload).then(({ status, data }) => {
        if (status >= 400) {
          this.setState({ errors: data.errors })
        } else {
          this.reset()
          window.editorSidebar.close()
        }
      })
    }

    event.preventDefault()
  }

  onShowScanner = e => {
    this.setState(
      { showScanner: !this.state.showScanner, scannerReady: false },
      () => {
        if (this.state.showScanner) {
          launchBarcodeScanner({
            licenseKey: this.props.scanditLicense,
            targetId: 'scandit-barcode-picker',
            onScan: result => {
              this.setState({
                plant_ids: result + '\n' + this.state.plant_ids
              })
              this.resizePlantIDTextArea()
            },
            onReady: () => {
              this.setState({ scannerReady: true })
            }
          }).then(scanner => (this.scanner = scanner))
        } else {
          this.scanner.destroy()
        }
      }
    )

    e.preventDefault()
  }

  reset() {
    this.setState(this.resetState())
  }

  validateAndGetValues() {
    let {
      id,
      facility_strain_id,
      plant_ids,
      planted_on,
      isBought,
      location_id //
    } = this.state

    let errors = {}

    if (facility_strain_id.length <= 0) {
      errors.facility_strain_id = ['Strain is required.']
    }

    if (plant_ids.length <= 0) {
      errors.plant_ids = ['Plant ID is required.']
    }

    if (planted_on === null) {
      errors.planted_on = ['Planted on date is required.']
    }

    let purchaseData = { isValid: true }
    if (isBought) {
      purchaseData = this.purchaseInfoEditor.getValues()
    }

    if (!location_id) {
      errors.location_id = ['Please select location of the mother plant.']
    }

    const isValid =
      purchaseData.isValid && Object.getOwnPropertyNames(errors).length === 0

    if (!isValid) {
      this.setState({ errors })
    }

    const data = {
      ...purchaseData,
      id,
      facility_strain_id,
      plant_ids,
      planted_on: planted_on && planted_on.toISOString(),
      location_id,
      isBought,
      isValid
    }
    return data
  }

  renderPlantIdForm() {
    if (this.state.isShowPlantQtyForm) return null
    return (
      <React.Fragment>
        <div className="ph4 mb2 flex">
          <div className="w-100">
            <p className="f6 fw4 gray mt0 mb2 pa0 lh-copy">
              Each mother plant has its own <strong>Plant ID</strong>. If you
              already have them, paste Plant IDs like below.
            </p>
            <textarea
              ref={this.setPlantIdsTextArea}
              rows="3"
              className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
              placeholder="Mother0001&#10;Mother0002&#10;Mother0003"
              value={this.state.plant_ids}
              onChange={this.onChangePlantIds}
            />
            <FieldError errors={this.state.errors} field="plant_ids" />
          </div>
        </div>
        <div className="ph4 mt0 mb3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray">Planted On</label>
            <DatePicker
              value={this.state.planted_on}
              onChange={this.onPlantedOnChanged}
            />
            <FieldError errors={this.state.errors} field="planted_on" />
          </div>
          <div className="w-50 flex justify-end items-end">
            <a
              href=""
              onClick={this.onShowScanner}
              className="ph2 pv2 btn--secondary f6 link"
            >
              {this.state.showScanner ? 'Hide scanner' : 'Scan Plant ID'}
            </a>
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
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">Add Mother</h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Select Strain</label>
              <Select
                options={this.state.strainOptions}
                noOptionsMessage={() => 'Type to search strain...'}
                onChange={this.onStrainSelected}
                value={{
                  label: this.state.strain_name,
                  value: this.state.facility_strain_id
                }}
                styles={reactSelectStyle}
              />
              <FieldError
                errors={this.state.errors}
                field="facility_strain_id"
              />
            </div>
          </div>
          <hr className="mt3 b--light-gray w-100" />
          <div className="ph4 mt3 mb1">
            <span className="f6 fw6 dark-gray">Plant IDs</span>
          </div>

          {this.renderPlantIdForm()}

          <div className="ph4 mt0 flex flex-column">
            <div className="w-100">
              <div id="scandit-barcode-picker" className="scanner" />
            </div>
            <div className="w-100 tc">
              {this.state.showScanner && this.state.scannerReady && (
                <div className="f7 gray">Scanner is ready!</div>
              )}
              {this.state.showScanner && !this.state.scannerReady && (
                <div className="f7 gray">Loading scanner...</div>
              )}
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mt3 mb3 flex flex-column">
            <div className="w-100">
              {console.log('Need to change this to tray level not room.')}
              <LocationPicker
                key={`${this.props.facility_id}.${this.state.location_id}`}
                mode="mother"
                facility_id={this.props.facility_id}
                locations={this.locations}
                location_id={this.state.location_id}
                onChange={this.onLocationChanged}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          <hr className="mt3 mb3 b--light-gray w-100" />
          <div className="ph4 mb3 mt2">
            <span className="f6 fw6 dark-gray">Plant Origin?</span>
          </div>
          <div className="ph4 mb3 flex justify-between">
            <label className="f6 fw6 db mb1 gray">
              Mother plants are purchased
            </label>
            <input
              className="toggle toggle-default"
              type="checkbox"
              value="1"
              checked={this.state.isBought}
              id="is_bought_input"
              onChange={this.onIsBoughtChanged}
            />
            <label className="toggle-button" htmlFor="is_bought_input" />
          </div>
          {this.state.isBought && (
            <PurchaseInfo
              key={this.state.id}
              showLabel={false}
              ref={this.setPurchaseInfoEditor}
              vendor_name={this.state.vendor_name}
              vendor_no={this.state.vendor_no}
              address={this.state.address}
              vendor_state_license_num={this.state.vendor_state_license_num}
              vendor_state_license_expiration_date={
                this.state.vendor_state_license_expiration_date
              }
              vendor_location_license_num={
                this.state.vendor_location_license_num
              }
              vendor_location_license_expiration_date={
                this.state.vendor_location_license_expiration_date
              }
              purchase_date={this.state.purchase_date}
              invoice_no={this.state.invoice_no}
              purchase_order_no={this.state.purchase_order_no}
            />
          )}

          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
            <a
              className="db tr pv2 bn br2 ttu tracked link dim f6 fw6 orange"
              href="#"
              onClick={this.props.onExitCurrentEditor}
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
        </div>
      </div>
    )
  }
}

export default MotherEditor
