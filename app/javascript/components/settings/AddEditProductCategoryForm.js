import React from 'react'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import Select from 'react-select'
import reactSelectStyle from '../utils/reactSelectStyle'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'
import ProductCategoryStore from '../inventory/stores/ProductCategoryStore'
import MetrcItemCategoryStore from './MetrcItemCategoryStore'
import ItemCategorySelector from '../cultivation/tasks_setup/components/ItemCategorySelector'

const QUANTITY_TYPES = [
  {
    value: 'CountBased',
    label: 'Count Based'
  },
  {
    value: 'VolumeBased',
    label: 'Volume Based'
  },
  {
    value: 'WeightBased',
    label: 'Weight Based'
  }
]

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

const CUSTOM_PKG_PREFIX = 'custom_'

const styles = `
.active{
    display: inline-block;
    position: relative;
    border-bottom: 3px solid var(--orange);
    padding-bottom: 16px;
}

.active:after {
  position: absolute;
  content: '';
  width: 70%;
  transform: translateX(-50%);
  bottom: -15px;
  left: 50%;
}
`

@observer
class AddEditProductCategoryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      metrc_item_category: '',
      selectedQuantityType: {},
      tab: 'general',
      packageUnits: []
    }
  }

  async componentDidMount() {
    await MetrcItemCategoryStore.loadCategories()
  }

  async componentDidUpdate(prevProps) {
    const { mode, editCategory } = this.props
    if (mode && mode !== prevProps.mode) {
      this.setState({
        name: '',
        metrc_item_category: '',
        selectedQuantityType: {},
        packageUnits: []
      })
    }
    if (editCategory && editCategory !== prevProps.editCategory) {
      const category = ProductCategoryStore.getCategoryByName(editCategory)
      const metrcItem = category.metrc_item_category || ''
      this.setState({
        name: editCategory,
        built_in: category.built_in,
        metrc_item_category: metrcItem,
        packageUnits: category.package_units
      })
      if (MetrcItemCategoryStore.isDataLoaded) {
        const metrcCategory = MetrcItemCategoryStore.getCategoryByName(
          metrcItem
        )
        if (metrcItem && metrcCategory) {
          const quantityType = QUANTITY_TYPES.find(
            x => x.value === metrcCategory.quantity_type
          )
          this.setState({
            metrc_item_category: metrcCategory.name,
            selectedQuantityType: quantityType
          })
        } else {
          const quantityType = QUANTITY_TYPES.find(
            x => x.value === category.quantity_type
          )
          this.setState({
            metrc_item_category: '',
            selectedQuantityType: quantityType
          })
        }
      }
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const formData = {
      name: this.state.name,
      metrc_item_category: this.state.metrc_item_category,
      package_units: this.state.packageUnits
    }
    if (this.props.onSave) {
      this.props.onSave(formData)
    }
  }

  onChangeTab = tab => {
    this.setState({
      tab: tab
    })
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

  render() {
    const { onClose, onSave, mode = 'add' } = this.props
    const {
      name,
      metrc_item_category,
      built_in,
      selectedQuantityType,
      packageUnits
    } = this.state

    if (!mode) {
      return null
    }

    return (
      <div className="h-100 flex flex-auto flex-column">
        <style>{styles}</style>
        <div>
          <div className="">
            {mode == 'add' ? (
              <React.Fragment>
                <div className="ph4 pv3 bb b--light-grey">
                  <h1 className="h6--font dark-grey ma0">
                    Add Product Category
                  </h1>
                </div>
                <a
                  href="#0"
                  className="slide-panel__close-button dim"
                  onClick={onClose}
                >
                  <i className="material-icons mid-gray md-18 pa1">close</i>
                </a>
              </React.Fragment>
            ) : (
              <div className="ph4 bb b--light-grey">
                <div className="mt3 flex content-stretch">
                  <div
                    className={`ph4 pointer dim grey ${
                      this.state.tab && this.state.tab === 'general'
                        ? 'active'
                        : ''
                    }`}
                    onClick={e => this.onChangeTab('general')}
                  >
                    General
                  </div>
                  <div
                    className={`pl3 ph4 pointer dim grey ${
                      this.state.tab && this.state.tab === 'metrc'
                        ? 'active'
                        : ''
                    }`}
                    onClick={e => this.onChangeTab('metrc')}
                  >
                    METRC
                  </div>
                </div>
                <a
                  href="#0"
                  className="slide-panel__close-button dim"
                  onClick={onClose}
                >
                  <i className="material-icons mid-gray md-18 pa1">close</i>
                </a>
              </div>
            )}
          </div>
        </div>
        <form
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4">
            {this.state.tab === 'general' && (
              <React.Fragment>
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
                <div className="mt2 fl w-100">
                  <div className="w-100 mt1 fl">
                    <label className="f6 fw6 db mb1 gray ttc">
                      Quantity Type
                    </label>
                  </div>
                  <div>
                    <Select
                      styles={reactSelectStyle}
                      options={QUANTITY_TYPES}
                      value={selectedQuantityType}
                      isDisabled={built_in}
                      onChange={selected => {
                        this.setState({
                          selectedQuantityType: selected
                        })
                      }}
                    />
                  </div>
                </div>
                {selectedQuantityType &&
                  selectedQuantityType.value === 'WeightBased' && (
                    <React.Fragment>
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
                                <div
                                  key={x.value}
                                  className="pa2 flex items-center"
                                >
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
                                        console.log(e)
                                        this.setState({
                                          packageUnits: this.state.packageUnits.map(
                                            y =>
                                              y.value === e.target.name
                                                ? {
                                                    ...y,
                                                    label: e.target.value
                                                  }
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
                                          packageUnits: this.state.packageUnits.map(
                                            y =>
                                              y.value === x.value
                                                ? { ...y, uom: e }
                                                : y
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
                                          packageUnits: this.state.packageUnits.map(
                                            y =>
                                              y.value === e.target.name
                                                ? {
                                                    ...y,
                                                    quantity: e.target.value
                                                  }
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
                    </React.Fragment>
                  )}

                {selectedQuantityType &&
                  selectedQuantityType.value === 'CountBased' && (
                    <React.Fragment>
                      {packageUnits.length > 0 && (
                        <React.Fragment>
                          {packageUnits.map(x => {
                            return (
                              <div className="pa2 flex items-center grey mt4">
                                <div className="w-20 mr3">{x.value}</div>
                                <div className="w-20 mr3" />
                                <div className="w-20 mr3" />
                                <i class="material-icons icon--btn red">
                                  delete
                                </i>
                              </div>
                            )
                          })}
                        </React.Fragment>
                      )}
                    </React.Fragment>
                  )}
              </React.Fragment>
            )}
            {this.state.tab === 'metrc' && (
              <div className="mt3 fl w-100">
                <div className="w-100 fl">
                  <label className="f6 fw6 db gray ttc">Item Category</label>
                  <span className="f6 grey pv2 dib">
                    Map product category to corresponding Item Category on
                    METRC. This list is provided by the state.
                  </span>
                  <ItemCategorySelector
                    ref={select => (this.categorySelector = select)}
                    quantityType={selectedQuantityType.value}
                    value={metrc_item_category}
                    onChange={selected => {
                      this.setState({
                        metrc_item_category: selected.value
                      })
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
            <input type="submit" value="Save" className="fr btn btn--primary" />
          </div>
        </form>
      </div>
    )
  }
}

export default AddEditProductCategoryForm
