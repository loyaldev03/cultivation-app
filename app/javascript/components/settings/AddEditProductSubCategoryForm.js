import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'
import reactSelectStyle from '../utils/reactSelectStyle'
import ProductCategoryStore from '../inventory/stores/ProductCategoryStore'

const PkgUnitCheckbox = React.memo(
  ({ value, label, checked, onChange, className }) => {
    return (
      <label className={className}>
        <input
          type="checkbox"
          name={label}
          value={value}
          onChange={onChange}
          checked={checked}
        />
        <span className="ph1">{label}</span>
      </label>
    )
  }
)

const CUSTOM_PKG_PREFIX = 'custom_'

const BUILTIN_PK_UNITS = [
  { value: '3pk', label: '3pk' },
  { value: '5pk', label: '5pk' },
  { value: '12pk', label: '12pk' },
  { value: '24pk', label: '24pk' }
]

const BUILTIN_WEIGHT_UNITS = [
  { value: 'half_g', label: '1/2 gram' },
  { value: 'half_kg', label: '1/2 kg' },
  { value: 'quarter_lb', label: '1/4 lb' },
  { value: 'quarter_oz', label: '1/4 ounce' },
  { value: 'eighth', label: 'Eighth' },
  { value: 'g', label: 'Gram' },
  { value: 'half_oz', label: 'Half ounce' },
  { value: 'kg', label: 'Kg' },
  { value: 'lb', label: 'Lb' },
  { value: 'oz', label: 'Ounce' }
]

@observer
class AddEditProductSubCategoryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      productCategoryId: '',
      selectedProductCategory: {},
      packageUnits: []
    }
  }

  async componentDidUpdate(prevProps) {
    const { mode, editSubCategory } = this.props
    if (mode && mode !== prevProps.mode) {
      this.setState({
        id: '',
        name: '',
        productCategoryId: '',
        selectedProductCategory: {},
        packageUnits: []
      })
    }
    if (
      editSubCategory &&
      prevProps.editSubCategory &&
      editSubCategory.id != prevProps.editSubCategory.id
    ) {
      let selectedProductCategory = {}
      let productCategoryId = ''
      let packageUnits = editSubCategory.packageUnits || []
      if (editSubCategory.productCategoryId) {
        selectedProductCategory =
          ProductCategoryStore.categoryOptions.find(
            x => x.value === editSubCategory.productCategoryId
          ) || {}
        productCategoryId = editSubCategory.productCategoryId
      }
      this.setState({
        id: editSubCategory.id || '',
        name: editSubCategory.name || '',
        productCategoryId,
        selectedProductCategory,
        packageUnits
      })
    }
  }

  onChangeCb = e => {
    let packageUnits
    if (e.target.checked) {
      const pkgUnit = { value: e.target.value, label: e.target.name }
      const found = this.state.packageUnits.find(x => x.value === pkgUnit.value)
      if (found) {
        packageUnits = this.state.packageUnits.map(x =>
          x.value === pkgUnit.value ? pkgUnit : x
        )
      } else {
        packageUnits = [...this.state.packageUnits, pkgUnit]
      }
    } else {
      packageUnits = this.state.packageUnits.filter(
        x => x.value !== e.target.value
      )
    }
    this.setState({
      packageUnits
    })
  }

  onChangeProductCategory = selected => {
    this.setState({
      selectedProductCategory: selected,
      productCategoryId: selected.value
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const formData = {
      id: this.state.id,
      name: this.state.name,
      product_category_id: this.state.productCategoryId,
      package_units: this.state.packageUnits
    }
    if (this.props.onSave) {
      this.props.onSave(formData)
    }
  }

  isChecked = value => {
    const res = this.state.packageUnits.findIndex(x => x.value === value)
    return res >= 0
  }

  onDelete = value => e => {
    if (confirm('Confirm delete?')) {
      this.setState({
        packageUnits: this.state.packageUnits.filter(x => x.value !== value)
      })
    }
  }

  render() {
    const { onClose, onSave, mode = 'add' } = this.props
    const { name, selectedProductCategory, packageUnits } = this.state

    if (!mode) {
      return null
    }

    return (
      <div className="h-100 flex flex-auto flex-column">
        <SlidePanelHeader
          onClose={onClose}
          title={mode == 'add' ? 'Add Subcategory' : 'Edit Subcategory'}
        />
        <form
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4">
            <div className="mt2 fl w-100">
              <div className="w-100 fl pr3">
                <label className="f6 fw6 db mb1 gray ttc">Name</label>
                <input
                  value={name}
                  onChange={e => this.setState({ name: e.target.value })}
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  required={true}
                />
              </div>
            </div>
            <div className="mt3 fl w-100">
              <div className="w-100 fl">
                <label className="f6 fw6 db mb1 gray ttc">
                  Product Category
                </label>
              </div>
              <div>
                <Select
                  isDisabled={mode === 'edit'}
                  styles={reactSelectStyle}
                  options={ProductCategoryStore.categoryOptions}
                  value={this.state.selectedProductCategory}
                  onChange={selected => this.onChangeProductCategory(selected)}
                />
              </div>
            </div>
            <div className="mt3 fl w-100">
              <div className="w-100 fl">
                <label className="f6 fw6 db mb1 gray ttc">
                  Packaging Unit Types
                </label>
              </div>
              <div className="grey f6">
                <span className="fw6 mt2 dib">Package:</span>
                <div className="pa2">
                  {BUILTIN_PK_UNITS.map(pkgUnit => {
                    return (
                      <PkgUnitCheckbox
                        className="pv1 pr3 dib"
                        key={pkgUnit.value}
                        label={pkgUnit.label}
                        value={pkgUnit.value}
                        onChange={this.onChangeCb}
                        checked={this.isChecked(pkgUnit.value)}
                      />
                    )
                  })}
                </div>
              </div>
              <div className="grey f6">
                <span className="fw6 mt2 dib">Weight:</span>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr'
                  }}
                >
                  {BUILTIN_WEIGHT_UNITS.map(pkgUnit => (
                    <PkgUnitCheckbox
                      className="pa2"
                      key={pkgUnit.value}
                      label={pkgUnit.label}
                      value={pkgUnit.value}
                      onChange={this.onChangeCb}
                      checked={this.isChecked(pkgUnit.value)}
                    />
                  ))}
                </div>
              </div>
              <div className="grey f6">
                <span className="fw6 mt2 dib">Custom Units:</span>
                <div>
                  {packageUnits
                    .filter(u => u.value.includes(CUSTOM_PKG_PREFIX))
                    .map(x => {
                      return (
                        <div key={x.value} className="pa2 flex items-center">
                          <div className="w-20 mr3">
                            <label className="f6 fw6 db mb1 gray ttc">
                              Label
                            </label>
                            <input
                              type="text"
                              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner "
                              name={x.value}
                              value={x.label}
                              onChange={e => {
                                this.setState({
                                  packageUnits: this.state.packageUnits.map(y =>
                                    y.value === e.target.name
                                      ? { ...y, label: e.target.value }
                                      : y
                                  )
                                })
                              }}
                            />
                          </div>
                          <div className="w-20 mr3">
                            <label className="f6 fw6 db mb1 gray ttc">
                              Uom
                            </label>
                            <Select
                              styles={reactSelectStyle}
                              options={[
                                { label: 'Ounce', value: 'ounce' },
                                { label: 'Gram', value: 'gram' }
                              ]}
                              value={x.uom}
                              onChange={e => {
                                this.setState({
                                  packageUnits: this.state.packageUnits.map(y =>
                                    y.value === x.value ? { ...y, uom: e } : y
                                  )
                                })
                              }}
                            />
                          </div>
                          <div className="w-20 mr2">
                            <label className="f6 fw6 db mb1 gray ttc">
                              Quantity
                            </label>
                            <input
                              type="text"
                              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner "
                              name={x.value}
                              value={x.quantity}
                              onChange={e => {
                                this.setState({
                                  packageUnits: this.state.packageUnits.map(y =>
                                    y.value === e.target.name
                                      ? { ...y, quantity: e.target.value }
                                      : y
                                  )
                                })
                              }}
                            />
                          </div>
                          <i
                            className="material-icons icon--btn red"
                            onClick={this.onDelete(x.value)}
                          >
                            delete
                          </i>
                        </div>
                      )
                    })}
                  <a
                    href="#0"
                    className="link pa2 dib"
                    onClick={() => {
                      const customIdx = new Date().getTime()
                      this.setState({
                        packageUnits: [
                          ...packageUnits,
                          {
                            value: `${CUSTOM_PKG_PREFIX}${customIdx}`,
                            label: ''
                          }
                        ]
                      })
                    }}
                  >
                    Add
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
            <input type="submit" value="Save" className="fr btn btn--primary" />
          </div>
        </form>
      </div>
    )
  }
}

export default AddEditProductSubCategoryForm
