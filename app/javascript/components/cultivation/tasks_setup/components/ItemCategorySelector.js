import React from 'react'
import { observer } from 'mobx-react'
import CategoryStore from '../../../settings/MetrcItemCategoryStore'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import Select from 'react-select'

@observer
class ItemCategorySelector extends React.Component {
  state = {
    selectedCategory: ''
  }

  async componentDidMount() {
    await CategoryStore.loadCategories()
    if (CategoryStore.isDataLoaded && this.props.excludes) {
      CategoryStore.excludes = this.props.excludes
    }
  }

  async componentDidUpdate(prevProps) {
    const { value } = this.props
    if (value && value !== prevProps.productType) {
      const res = CategoryStore.getCategoryByName(value)
    }
  }

  onChange = selectedCategory => {
    const category = CategoryStore.getCategoryByName(selectedCategory.value)
    if (this.props.onChange) {
      this.props.onChange(selectedCategory, category.quantity_type)
    }
    this.setState({ selectedCategory })
  }

  getSelectedCategory() {
    return CategoryStore.getCategoryByName(this.state.selectedCategory.value)
  }

  render() {
    return (
      <div>
        <Select
          styles={reactSelectStyle}
          options={CategoryStore.allSelectOptions}
          value={this.state.selectedCategory}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default ItemCategorySelector
