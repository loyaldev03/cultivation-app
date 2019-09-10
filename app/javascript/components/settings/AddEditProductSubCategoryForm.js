import React from 'react'
import { observer } from 'mobx-react'
import Select from 'react-select'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'
import reactSelectStyle from '../utils/reactSelectStyle'
import CategoryStore from '../inventory/stores/ProductCategoryStore'

@observer
class AddEditProductSubCategoryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      name: '',
      productCategoryId: '',
      selectedProductCategory: {}
    }
  }

  async componentDidUpdate(prevProps) {
    const { mode, editSubCategory, editProductCategory } = this.props
    if (mode && mode !== prevProps.mode) {
      this.setState({
        name: '',
        productCategoryId: '',
        selectedProductCategory: {}
      })
    }
    if (editSubCategory && editSubCategory !== prevProps.editSubCategory) {
      const selectedOption = CategoryStore.categoryOptions.find(
        x => x.name === editSubCategory.name
      )
      this.setState({
        id: editSubCategory.id,
        name: editSubCategory.name,
        productCategoryId: editProductCategory,
        selectedProductCategory: selectedOption
      })
    }
  }

  onChangeCategory = selectedOption => {
    this.setState({
      selectedProductCategory: selectedOption,
      productCategoryId: selectedOption.value
    })
  }

  onSubmit = e => {
    e.preventDefault()
    const formData = {
      id: this.state.id,
      name: this.state.name,
      product_category_id: this.state.productCategoryId
    }
    if (this.props.onSave) {
      this.props.onSave(formData)
    }
  }

  render() {
    const { onClose, onSave, mode = 'add' } = this.props
    const { name, selectedProductCategory } = this.state

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
                  styles={reactSelectStyle}
                  options={CategoryStore.categoryOptions}
                  value={this.state.selectedProductCategory}
                  onChange={selected => this.onChangeCategory(selected)}
                />
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
