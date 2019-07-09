import React from 'react'
import { observer } from 'mobx-react'
import CategoryStore from '../../../settings/ItemCategoryStore'
import { selectStyles } from '../../../utils'
import Select from 'react-select'

@observer
class ItemCategorySelector extends React.Component {
  state = {
    selectedCategory: ''
  }

  componentDidMount() {
    CategoryStore.loadCategories()
  }

  onChange = selectedCategory => {
    this.setState({ selectedCategory })
  }

  getSelectedCategory() {
    return CategoryStore.getCategoryByName(this.state.selectedCategory.label)
  }

  render() {
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
