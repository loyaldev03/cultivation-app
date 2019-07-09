import React from 'react'
import { observer } from 'mobx-react'
import CategoryStore from '../../../settings/ItemCategoryStore'
import { selectStyles } from '../../../utils'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import Select from 'react-select'

@observer
class ItemCategorySelector extends React.Component {
  state = {
    selectedCategory: ''
  }

  async componentDidMount() {
    await CategoryStore.loadCategories()
    if (CategoryStore.isDataLoaded) {
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
    if (this.props.onChange) {
      this.props.onChange(selectedCategory)
    }
    this.setState({ selectedCategory })
  }

  getSelectedCategory() {
    return CategoryStore.getCategoryByName(this.state.selectedCategory.label)
  }

  render() {
    const { excludes } = this.props
    return (
      <div>
        <Select
          styles={selectStyles}
          options={CategoryStore.selectOptions}
          value={this.state.selectedCategory}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default ItemCategorySelector
