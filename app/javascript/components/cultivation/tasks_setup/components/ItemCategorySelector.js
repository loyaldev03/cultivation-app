import React from 'react'
import { observer } from 'mobx-react'
import CategoryStore from '../../../settings/MetrcItemCategoryStore'
import reactSelectStyle from '../../../utils/reactSelectStyle'
import Select from 'react-select'

@observer
class ItemCategorySelector extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedCategory: {},
      value: ''
    }
  }

  async componentDidMount() {
    await CategoryStore.loadCategories()
    if (CategoryStore.isDataLoaded) {
      if (this.props.excludes) {
        CategoryStore.excludes = this.props.excludes
      }
      CategoryStore.quantityTypeFilter = this.props.quantityType
      const selected =
        CategoryStore.metrcItemCategoryOptions.find(
          x => x.value === this.props.value
        ) || {}
      this.setState({ selectedCategory: selected, value: this.props.value })
    }
  }

  async componentDidUpdate(prevProps) {
    if (!CategoryStore.isDataLoaded) {
      return null
    }
    const { value, quantityType } = this.props
    if (quantityType !== prevProps.quantityType) {
      CategoryStore.quantityTypeFilter = quantityType
      this.setState({ selectedCategory: {} })
    }
    if (value !== prevProps.value) {
      const selected =
        CategoryStore.metrcItemCategoryOptions.find(x => x.value === value) ||
        {}
      this.setState({ selectedCategory: selected })
    }
  }

  onChange = selectedCategory => {
    if (this.props.onChange) {
      this.props.onChange(selectedCategory)
    }
    this.setState({ selectedCategory })
  }

  render() {
    return (
      <div>
        <Select
          styles={reactSelectStyle}
          options={CategoryStore.metrcItemCategoryOptions}
          value={this.state.selectedCategory}
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default ItemCategorySelector
