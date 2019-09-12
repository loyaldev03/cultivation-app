import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'
import reactSelectStyle from '../utils/reactSelectStyle'
import ProductCategoryStore from '../inventory/stores/ProductCategoryStore'

const PackageUnitCheckbox = ({ value, checked }) => {
  return <span />
}

const CUSTOM_PKG_PREFIX = 'custom_'

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

  onChangeCb = value => e => {
    let packageUnits
    if (e.target.checked) {
      const unit = { value: e.target.value, label: e.target.name }
      const found = this.state.packageUnits.find(x => x.value === unit.value)
      if (found) {
        packageUnits = this.state.packageUnits.map(x =>
          x.value === unit.value ? unit : x
        )
      } else {
        packageUnits = [...this.state.packageUnits, unit]
      }
    } else {
      packageUnits = this.state.packageUnits.filter(
        x => x.value !== e.target.name
      )
    }
    // console.log(`${value} - ${e.target.name} checked: `, e.target.checked)
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
                <div>
                  <label className="ph2 pv2 dib">
                    <input
                      type="checkbox"
                      name="3pk"
                      value="3pk"
                      onChange={this.onChangeCb('3pk')}
                    />{' '}
                    3pk{' '}
                  </label>
                  <label className="ph2 pv2 dib">
                    <input
                      type="checkbox"
                      name="5pk"
                      value="5pk"
                      onChange={this.onChangeCb('5pk')}
                    />{' '}
                    5pk{' '}
                  </label>
                  <label className="ph2 pv2 dib">
                    <input
                      type="checkbox"
                      name="12pk"
                      value="12pk"
                      onChange={this.onChangeCb('12pk')}
                    />{' '}
                    12pk{' '}
                  </label>
                  <label className="ph2 pv2 dib">
                    <input
                      type="checkbox"
                      name="24pk"
                      value="24pk"
                      onChange={this.onChangeCb('24pk')}
                    />{' '}
                    24pk{' '}
                  </label>
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
                  <label className="pa2 db">
                    <input type="checkbox" value="half_g" /> 1/2 gram{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="half_kg" /> 1/2 kg{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="quarter_lb" /> 1/4 lb{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="quarter_oz" /> 1/4 ounce{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="eighth" /> Eighth{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="g" /> Gram{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="half_oz" /> Half ounce{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="kg" /> Kg{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="lb" /> Lb{' '}
                  </label>
                  <label className="pa2 db">
                    <input type="checkbox" value="oz" /> Ounce{' '}
                  </label>
                </div>
              </div>
              <div className="grey f6">
                <span className="fw6 mt2 dib">Custom Units:</span>
                <div>
                  {packageUnits
                    .filter(u => u.value.includes(CUSTOM_PKG_PREFIX))
                    .map(x => {
                      return (
                        <div
                          key={x.value}
                          className="ph2 pt2 pb1 flex items-center"
                        >
                          <input
                            type="text"
                            className="input w4"
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
                          <i
                            className="material-icons icon--btn red"
                            onClick={() => {
                              this.setState({
                                packageUnits: this.state.packageUnits.filter(
                                  y => y.value !== x.value
                                )
                              })
                            }}
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
                      const customIdx = packageUnits.length + 1
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
