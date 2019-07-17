import React from 'react'
import PropTypes from 'prop-types'
import Select from 'react-select'
import { FieldError, NumericInput, TextInput } from '../../../utils/FormHelpers'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import {
  LocationPicker,
  PurchaseInfo,
  FileUploader,
  InputBarcode
} from '../../../utils'
import { saveRawMaterial } from '../actions/saveRawMaterial'
import { getRawMaterial } from '../actions/getRawMaterial'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import UpcStore from '../store/UpcStore'
import { launchBarcodeScanner } from '../../../utils/BarcodeScanner'

const handleInputChange = newValue => {
  return newValue ? newValue : ''
}

class NutrientEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
    this.purchaseInfoEditor = React.createRef()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const id = event.detail.id
      if (this.scanner) {
        this.scanner.destroy()
      }
      if (!id) {
        this.reset()
      } else {
        getRawMaterial(id)
          .then(x => x.data.data.attributes)
          .then(attr => {
            this.setState(
              {
                ...this.resetState(),
                id: id,
                qty_per_package: attr.conversion,
                catalogue: {
                  value: attr.catalogue_id,
                  label: attr.catalogue,
                  uoms: []
                },
                product: { value: attr.product.id, label: attr.product.name },
                product_id: attr.product_id,
                product_name: attr.product_name,
                manufacturer: attr.manufacturer || '',
                description: attr.description || '',
                upc: attr.product.upc || '',
                attachments: attr.attachments || [],
                nitrogen: attr.product.nitrogen || '',
                prosphorus: attr.product.prosphorus || '',
                potassium: attr.product.potassium || '',
                nutrients: attr.product.nutrients.map(e => ({
                  nutrient_element: { label: e.element, value: e.element },
                  nutrient_value: e.value
                })),
                product_size: attr.product.size || '',
                product_uom: {
                  label: attr.product.common_uom,
                  value: attr.product.common_uom
                },
                catalogue_parent: this.props.catalogues.find(
                  a =>
                    a.children.filter(f => f.value === attr.catalogue_id)
                      .length > 0
                ),
                product_ppm: attr.product.ppm || '',
                epa_number: attr.product.epa_number || '',
                attachments: attr.product.attachments || [],
                order_quantity: parseFloat(attr.order_quantity),
                price_per_package: parseFloat(attr.vendor_invoice.item_price),
                order_uom: { value: attr.order_uom, label: attr.order_uom },
                uom: { value: attr.uom, label: attr.uom },
                location_id: attr.location_id,
                // purchase info
                vendor: attr.vendor,
                purchase_order: attr.purchase_order,
                vendor_invoice: attr.vendor_invoice
              },
              () => {
                this.loadProducts('', '')
              }
            )
          })
      }
    })
  }

  onNutrientElementSelected = item => {
    this.setState({
      nutrient_element: item
    })
  }

  onChangeGeneric = event => {
    const key = event.target.attributes.fieldname.value
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onChangeAttachments = attachments => {
    this.setState({ attachments })
  }

  resetState() {
    return {
      nutrients: [],
      nutrients_elements: [
        { label: 'Boron (B)', value: 'boron' },
        { label: 'Calcium (Ca)', value: 'calcium' },
        { label: 'Chlorine (CI)', value: 'chlorine' },
        { label: 'Cobalt (Co)', value: 'cobalt' },
        { label: 'Copper (Cu)', value: 'copper' },
        { label: 'Iron (Fe)', value: 'iron' },
        { label: 'Magnesium (Mg)', value: 'magnesium' },
        { label: 'Manganese (Mm)', value: 'manganese' },
        { label: 'Molybdenum (Mo)', value: 'molybdenum' },
        { label: 'Silicon (Si)', value: 'silicon' },
        { label: 'Sulfur (S)', value: 'sulfur' },
        { label: 'Zinc (Zn)', value: 'zinc' }
      ],
      id: '',
      qty_per_package: '',
      catalogue: { value: '', label: '', uoms: [] },
      product: { value: '', label: '' },
      product_id: '',
      product_name: '',
      manufacturer: '',
      description: '',
      upc: '',
      product_size: '',
      product_uom: { label: '', value: '' },
      product_ppm: '',
      epa_number: '',
      attachments: [],
      nutrient_value: '',
      nitrogen: '',
      prosphorus: '',
      potassium: '',
      defaultProduct: [],
      order_quantity: 0,
      price_per_package: 0,
      order_uom: { value: '', label: '' },
      uom: { value: '', label: '' },
      location_id: '',
      showScanner: false,
      scannerReady: false,
      // purchase info
      vendor: {},
      purchase_order: {},
      vendor_invoice: {},
      catalogue_parent: { label: '', value: '' },
      errors: {}
    }
  }

  reset() {
    this.setState(this.resetState())
    this.purchaseInfoEditor.current.reset()
  }

  onSave = event => {
    const { isValid, errors, ...payload } = this.validateAndGetValues()
    if (isValid) {
      saveRawMaterial(payload).then(({ status, data }) => {
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

  validateAndGetValues() {
    const {
      id,
      uom: { value: uom },
      qty_per_package,
      product_id,
      product_name,
      manufacturer,
      description,
      upc,
      order_quantity,
      order_uom: { value: order_uom },
      price_per_package: price,
      location_id,
      nitrogen,
      prosphorus,
      potassium,
      product_size,
      product_ppm,
      epa_number,
      attachments
    } = this.state

    let errors = {}

    const quantity =
      parseFloat(this.state.order_quantity) *
      parseFloat(this.state.qty_per_package)

    if (!uom) {
      errors.uom = ['Unit of measure is required.']
    }

    if (!order_uom) {
      errors.order_uom = ['Unit of measure is required.']
    }

    if (parseFloat(order_quantity) <= 0) {
      errors.order_quantity = ['Order quantity should be more than zero.']
    }

    if (parseFloat(qty_per_package) <= 0) {
      errors.qty_per_package = [
        'Quantity per package should be more than zero.'
      ]
    }

    if (!location_id) {
      errors.location_id = ['Storage location is required.']
    }

    if (!product_name) {
      errors.product = ['Product is required.']
    }

    const {
      isValid: purchaseIsValid,
      ...purchaseData
    } = this.purchaseInfoEditor.current.getValues()

    const isValid =
      Object.getOwnPropertyNames(errors).length === 0 && purchaseIsValid
    if (!isValid) {
      this.setState({ errors })
    }

    let nutrients = this.state.nutrients
    if (this.state.nutrient_element && this.state.nutrient_value) {
      if (
        !nutrients
          .map(e => e.nutrient_element.value)
          .includes(this.state.nutrient_element.value)
      ) {
        // check if current selected element exist in collection, if not insert
        nutrients.push({
          nutrient_element: this.state.nutrient_element,
          nutrient_value: this.state.nutrient_value
        })
      }
    }
    nutrients = nutrients.map(e => ({
      element: e.nutrient_element.value,
      value: e.nutrient_value
    }))

    const product_uom = this.state.product_uom.value
    const facility_id = this.props.facility_id
    return {
      id,
      facility_id,
      uom,
      quantity,
      catalogue: this.state.catalogue.value,
      product_id,
      product_name,
      manufacturer,
      upc,
      description,
      order_quantity,
      order_uom,
      qty_per_package,
      price,
      location_id,
      ...purchaseData,
      isValid,
      nitrogen,
      prosphorus,
      potassium,
      nutrients,
      product_size,
      product_uom,
      product_ppm,
      epa_number,
      attachments
    }
  }

  loadProducts = inputValue => {
    inputValue = inputValue || ''
    const { catalogue_id, facility_id } = this.props
    return fetch(
      `/api/v1/products?type=raw_materials&category=nutrients&catalogue_id=${catalogue_id}&facility_id=${facility_id}&filter=${inputValue}`,
      {
        credentials: 'include'
      }
    )
      .then(response => response.json())
      .then(data => {
        const products = data.data.map(x => ({
          label: x.attributes.name,
          value: x.attributes.id,
          ...x.attributes
        }))
        if (inputValue === '') {
          this.setState({ defaultProduct: products })
        }
        return products
      })
  }

  onChangeProduct = product => {
    if (product) {
      if (product.__isNew__) {
        this.setState({
          product,
          product_name: product.value,
          product_id: '',
          manufacturer: '',
          description: '',
          product_size: '',
          product_uom: { label: '', value: '' },
          product_ppm: '',
          epa_number: '',
          attachments: [],
          nitrogen: '',
          prosphorus: '',
          potassium: '',
          nutrients: [],
          upc: ''
        })
      } else {
        this.setState({
          product,
          product_id: product.id,
          product_name: product.name,
          manufacturer: product.manufacturer || '',
          description: product.description || '',
          product_size: product.size || '',
          product_uom: { label: product.common_uom, value: product.common_uom },
          product_ppm: product.ppm || '',
          epa_number: product.epa_number || '',
          attachments: product.attachments || [],
          nitrogen: product.nitrogen || '',
          prosphorus: product.prosphorus || '',
          potassium: product.potassium || '',
          nutrients: product.nutrients.map(e => ({
            nutrient_element: { label: e.element, value: e.element },
            nutrient_value: e.value
          })),
          upc: product.upc || ''
        })
      }
    } else {
      this.setState({
        product: { value: '', label: '' },
        product_id: '',
        product_name: '',
        manufacturer: '',
        description: '',
        product_size: '',
        product_uom: { label: '', value: '' },
        product_ppm: '',
        epa_number: '',
        attachments: [],
        nitrogen: '',
        prosphorus: '',
        potassium: '',
        nutrients: [],
        upc: ''
      })
    }
  }

  addNutrient = () => {
    if (this.state.nutrient_element && this.state.nutrient_value) {
      if (
        !this.state.nutrients
          .map(e => e.nutrient_element.value)
          .includes(this.state.nutrient_element.value)
      ) {
        // check if current selected element exist in collection, if not insert
        this.setState(previousState => ({
          nutrients: [
            ...previousState.nutrients,
            {
              nutrient_element: this.state.nutrient_element,
              nutrient_value: this.state.nutrient_value
            }
          ],
          nutrient_element: '',
          nutrient_value: ''
        }))
      }
    }
  }

  removeNutrient = element => {
    this.setState({
      nutrients: this.state.nutrients.filter(
        item => item.nutrient_element !== element
      )
    })
  }

  handleKeyPress = e => {
    if (e.key === 'Enter') {
      this.loadItemScan()
    }
  }

  loadItemScan = async e => {
    const product = await UpcStore.loadItem(this.state.upc)
    if (product.brand) {
      this.setState({
        manufacturer: product.brand,
        description: product.description,
        product: { label: product.title, value: product.title },
        product_name: product.title
      })
    }
  }

  handleChangeUpc = event => {
    this.setState({ upc: event.target.value })
  }

  onBarcodeScan = e => {
    this.setState({ upc: e }, () => {
      this.loadItemScan()
    })
  }

  onLocationChanged = event => {
    this.setState({ location_id: event.location_id })
  }

  render() {
    const { facility_id, catalogue_id, catalogues } = this.props
    const catalogue_child = this.state.catalogue_parent
      ? this.state.catalogue_parent.children
      : []
    const {
      attachments,
      nutrients_elements,
      nutrients,
      price_per_package,
      order_quantity
    } = this.state
    const all_uoms = this.props.uoms.map(x => ({ value: x, label: x }))
    const order_uoms = this.props.order_uoms.map(x => ({ value: x, label: x }))
    const showTotalPrice = price_per_package && order_quantity
    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              Add Nutrient Inventory
            </h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={() => {
                window.editorSidebar.close()
              }}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>

          <div className="ph4 mv3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Product Name</label>
              <AsyncCreatableSelect
                isClearable
                noOptionsMessage={() => 'Type to search product...'}
                placeholder={'Search...'}
                defaultOptionss={this.state.defaultProduct}
                loadOptions={e => this.loadProducts(e, '')}
                onInputChange={handleInputChange}
                styles={reactSelectStyle}
                value={this.state.product}
                onChange={this.onChangeProduct}
              />
              <FieldError errors={this.state.errors} field="product" />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-40">
              <TextInput
                label="Manufacturer"
                fieldname="manufacturer"
                value={this.state.manufacturer}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-20 pl3">
              <NumericInput
                label="Size"
                fieldname="product_size"
                value={this.state.product_size}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <Select
                value={this.state.product_uom}
                options={all_uoms}
                styles={reactSelectStyle}
                onChange={x => this.setState({ product_uom: x })}
              />
              <FieldError errors={this.state.errors} field="product_uom" />
            </div>
            <div className="w-20 pl3">
              <NumericInput
                label="PPM"
                fieldname="product_ppm"
                value={this.state.product_ppm}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">Description</label>
              <textarea
                className="db w-100 pa2 f6 black ba b--black-20 br2 mb0 outline-0 lh-copy"
                fieldname="description"
                value={this.state.description}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">UPC</label>
              <InputBarcode
                value={this.state.upc}
                onChange={this.handleChangeUpc}
                onKeyPress={this.handleKeyPress}
                scanditLicense={this.props.scanditLicense}
                onBarcodeScan={this.onBarcodeScan}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <TextInput
                label="EPA reg number"
                fieldname="epa_number"
                value={this.state.epa_number}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                Usage Instructions
              </label>
              <FileUploader
                attachments={attachments}
                onChange={this.onChangeAttachments}
                className="pa2 ba b--black-20 br2 file-uploader"
              />
            </div>
          </div>
          <hr className="mt3 m b--light-gray w-100" />
          {/* <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db dark-gray">Nutrient Type</label>
            </div>
          </div> */}
          <div className="ph4 mb3 flex mt2">
            <div className="w-50">
              <label className="f6 fw6 db mb1 gray ttc">Nutrient Type</label>
              <Select
                value={this.state.catalogue_parent}
                options={catalogues}
                styles={reactSelectStyle}
                onChange={x => this.setState({ catalogue_parent: x })}
              />
              <FieldError errors={this.state.errors} field="order_uom" />
            </div>

            <div className="w-50 pl3">
              <label className="f6 fw6 db mb1 gray ttc">
                {this.state.catalogue_parent.key} Type
              </label>
              <Select
                value={this.state.catalogue}
                options={catalogue_child}
                styles={reactSelectStyle}
                onChange={x => this.setState({ catalogue: x })}
              />
              <FieldError errors={this.state.errors} field="order_uom" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db dark-gray">Nutrients</label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-third">
              <NumericInput
                label="Nitrogen (N)"
                fieldname="nitrogen"
                value={this.state.nitrogen}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-third pl3">
              <NumericInput
                label="Prosphorus (P)"
                fieldname="prosphorus"
                value={this.state.prosphorus}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-third pl3">
              <NumericInput
                label="Potassium (K)"
                fieldname="potassium"
                value={this.state.potassium}
                onChange={this.onChangeGeneric}
              />
            </div>
          </div>

          <div className="ph4 mt2 flex">
            <div className="w-100">
              <label className="f6 fw6 db dark-gray">Micronutrients</label>
            </div>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-70">
              <label className="f6 fw6 db mb1 gray ttc">Nutrient Element</label>
              <AsyncCreatableSelect
                isClearable
                defaultOptions={nutrients_elements}
                value={this.state.nutrient_element}
                onChange={this.onNutrientElementSelected}
                styles={reactSelectStyle}
              />
            </div>
            <div className="w-20 pl3">
              <NumericInput
                label="Value (%)"
                fieldname="nutrient_value"
                value={this.state.nutrient_value}
                onChange={this.onChangeGeneric}
              />
            </div>
            <div className="w-10 pl2">
              <span className="dim pointer" onClick={this.addNutrient}>
                <i className="material-icons mid-gray md-18 mt4">add</i>
              </span>
            </div>
          </div>
          <div className="ph4 mb3 flex f6 grey">
            <div className="w-100">
              {nutrients.length > 0 && (
                <table className="collapse ba b--light-grey box--br3 pv2 ph3 f6 mt1 w-100">
                  <tbody>
                    {nutrients.map((x, index) => (
                      <tr key={index} className="">
                        <td className="pv2 ph3 w-70 ttc">
                          {x.nutrient_element.label}
                        </td>
                        <td className="pl3 w-20 tr">{x.nutrient_value}%</td>
                        <td className="ph3 w-10 tr pt1">
                          <span
                            className="dim pointer"
                            onClick={e =>
                              this.removeNutrient(x.nutrient_element)
                            }
                          >
                            <i className="material-icons red md-14">delete</i>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
          <hr className="mt3 m b--light-gray w-100" />
          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db dark-gray">Purchase details</label>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-30">
              <NumericInput
                label="Quantity"
                fieldname="order_quantity"
                value={this.state.order_quantity}
                onChange={this.onChangeGeneric}
                errors={this.state.errors}
              />
            </div>
            <div className="w-20 pl3">
              <label className="f6 fw6 db mb1 gray ttc">&nbsp;</label>
              <Select
                value={this.state.order_uom}
                options={order_uoms}
                styles={reactSelectStyle}
                onChange={x => this.setState({ order_uom: x })}
              />
              <FieldError errors={this.state.errors} field="order_uom" />
            </div>
            <div className="w-50 pl3 tr">
              <NumericInput
                label={`Price per ${this.state.order_uom &&
                  this.state.order_uom.label} before tax`}
                fieldname="price_per_package"
                value={this.state.price_per_package}
                onChange={this.onChangeGeneric}
              />
              {showTotalPrice && (
                <p className="f6 gray mb0 tr">
                  Total ${' '}
                  {(
                    parseFloat(this.state.price_per_package) *
                    parseFloat(this.state.order_quantity)
                  ).toFixed(2)}
                </p>
              )}
            </div>
          </div>

          {this.state.uom && (
            <React.Fragment>
              <hr className="mt3 m b--light-gray w-100" />
              <div className="ph4 mt3 mb3 flex">
                <div className="w-100">
                  <label className="f6 fw6 db dark-gray">
                    Amount of material in each{' '}
                    <span className="ttl">{this.state.order_uom.label}</span>
                  </label>
                </div>
              </div>

              <div className="ph4 mb3 flex">
                <div className="w-30">
                  <NumericInput
                    label="Quantity"
                    fieldname="qty_per_package"
                    value={this.state.qty_per_package}
                    onChange={this.onChangeGeneric}
                    errors={this.state.errors}
                  />
                </div>
                <div className="w-20 pl3">
                  <label className="f6 fw6 db mb1 gray ttc">UoM</label>
                  <Select
                    value={this.state.uom}
                    options={all_uoms}
                    styles={reactSelectStyle}
                    onChange={x => this.setState({ uom: x })}
                  />
                  <FieldError errors={this.state.errors} field="uom" />
                </div>
                <div className="w-50 pl4">
                  <label className="f6 fw6 db mb1 gray ttc tr">
                    Total material in {this.state.order_quantity}{' '}
                    {this.state.order_uom.label}
                  </label>
                  <div className="f6 pv2 fw6 tr">
                    {this.state.product_size &&
                      this.state.order_quantity &&
                      this.state.qty_per_package &&
                      parseFloat(this.state.product_size) *
                        parseFloat(this.state.order_quantity) *
                        parseFloat(this.state.qty_per_package)}
                    &nbsp;
                    {this.state.uom && this.state.uom.label}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )}

          <hr className="mt3 m b--light-gray w-100" />

          <PurchaseInfo
            key={this.state.id}
            ref={this.purchaseInfoEditor}
            label="Vendor Name"
            vendor={this.state.vendor}
            purchase_order={this.state.purchase_order}
            vendor_invoice={this.state.vendor_invoice}
            showVendorLicense={false}
          />

          <hr className="mt3 m b--light-gray w-100" />

          <div className="ph4 mt3 mb3 flex">
            <div className="w-100">
              <label className="f6 fw6 db mb1 gray ttc">
                Where are they stored?
              </label>
              <LocationPicker
                purpose="storage"
                facility_id={facility_id}
                location_id={this.state.location_id}
                onChange={this.onLocationChanged}
              />
              <FieldError errors={this.state.errors} field="location_id" />
            </div>
          </div>

          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-end">
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

NutrientEditor.propTypes = {
  order_uoms: PropTypes.array.isRequired
}

export default NutrientEditor
