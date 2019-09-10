import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../utils'
import CategoryStore from '../inventory/stores/ProductCategoryStore'
import ItemCategorySelector from '../cultivation/tasks_setup/components/ItemCategorySelector'

@observer
class AddEditProductCategoryForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      metrc_item_category: ''
    }
  }

  async componentDidUpdate(prevProps) {
    const { mode, editCategory } = this.props
    if (mode && mode !== prevProps.mode) {
      this.setState({
        name: '',
        metrc_item_category: ''
      })
    }
    if (editCategory && editCategory !== prevProps.editCategory) {
      const category = CategoryStore.getCategoryByName(editCategory)
      const metrcItem = category.metrc_item_category || ''
      this.setState({
        name: editCategory,
        metrc_item_category: metrcItem
      })
    }
  }

  onSubmit = e => {
    e.preventDefault()
    const formData = {
      name: this.state.name,
      metrc_item_category: this.state.metrc_item_category
    }
    if (this.props.onSave) {
      this.props.onSave(formData)
    }
  }

  render() {
    const { onClose, onSave, mode = 'add', formData } = this.props
    const { name, metrc_item_category } = this.state

    if (!mode) {
      return null
    }

    return (
      <div className="h-100 flex flex-auto flex-column">
        <SlidePanelHeader
          onClose={onClose}
          title={
            mode == 'add' ? 'Add Product Category' : 'Edit Product Category'
          }
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
                  ref={input => (this.nameInput = input)}
                  value={name}
                  onChange={e => this.setState({ name: e.target.value })}
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  required={true}
                />
              </div>
            </div>
            <div className="mt3 fl w-100">
              <div className="w-100 fl">
                <label className="f6 fw6 db gray ttc">
                  METRC Item Category
                </label>
                <span className="f6 grey pv2 dib">
                  Map this product category to corresponding Item Category on
                  METRC. This list is provided by the state.
                </span>
                <ItemCategorySelector
                  ref={select => (this.categorySelector = select)}
                  value={metrc_item_category}
                  onChange={selected => {
                    this.setState({
                      metrc_item_category: selected.value
                    })
                  }}
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

export default AddEditProductCategoryForm
