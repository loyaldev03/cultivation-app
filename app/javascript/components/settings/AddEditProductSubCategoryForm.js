import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'
import reactSelectStyle from '../utils/reactSelectStyle'
import ProductCategoryStore from '../inventory/stores/ProductCategoryStore'


const UOM_TYPES = [{value: 'pk', label: 'pk'}]

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
        categoryPackageUnits: selectedProductCategory.package_units,
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
      productCategoryId: selected.value,
      categoryPackageUnits: selected.package_units,
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
    const { name, selectedProductCategory, packageUnits, categoryPackageUnits } = this.state
    let groupCategoryPackageUnits = []
    if(categoryPackageUnits){
      groupCategoryPackageUnits = categoryPackageUnits.filter(e => e.is_active).map(c => {
        return {
          value: c.value,
          label: c.label,
          package_units: packageUnits.filter(e => e.category_name === c.value)
        }
      })
    }else{
      groupCategoryPackageUnits = []
    }

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
                {groupCategoryPackageUnits && groupCategoryPackageUnits
                  .map(x => {
                    return (
                      <React.Fragment>
                        <div className="f6 gray">
                          {x.label}
                        </div>
                        {x.package_units && x.package_units.map(y => {return(
                          <div
                            key={y.value}
                            className="pa2 flex items-center"
                          >
                            <div className="w-20 mr3">
                              <label className="f6 fw6 db mb1 gray ttc">
                                Quantity
                                    </label>
                              <input
                                type="text"
                                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner "
                                name={y.value}
                                value={y.label}
                                onChange={e => {
                                  console.log(e)
                                  this.setState({
                                    packageUnits: this.state.packageUnits.map(
                                      z =>
                                        z === y
                                          ? {
                                            ...z,
                                            label: e.target.value
                                          }
                                          : z
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
                                options={UOM_TYPES}
                                value={y.uom}
                                // isDisabled={built_in}
                                onChange={selected => {
                                this.setState({
                                  packageUnits: this.state.packageUnits.map(
                                    z =>
                                      z === y
                                        ? {
                                          ...z,
                                          uom: selected
                                        }
                                        : z
                                  )
                                })

                                }}
                              />
                            </div>
                            <div className="w-20 mr3">
                              <i
                                className="material-icons icon--btn red"
                                onClick={e => {
                                  if (confirm('Confirm delete?')) {
                                    this.setState({
                                      packageUnits: this.state.packageUnits.filter(z => z !== y)
                                    })
                                  }
                                }}
                              >
                                delete
                              </i>
                            </div>
                          </div>
                        )})}
                        <a
                          href="#0"
                          className="link pa2 dib f6"
                        onClick={() => {
                          this.setState({
                            packageUnits: [
                              ...packageUnits,
                              {
                                value: x.label,
                                label: '',
                                category_name: x.label,
                                uom: UOM_TYPES[0]
                              }
                            ]
                          })
                        }}
                        >
                          Add
                </a>
                      </React.Fragment>
                    )})                
                }

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
