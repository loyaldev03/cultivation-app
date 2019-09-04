import React from 'react'
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import classNames from 'classnames'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import { toast } from '../utils/toast'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { HeaderFilter, ListingTable } from '../utils'
import CategoryStore from './ItemCategoryStore'
import ItemStore from './ItemStore'

@observer
class ItemApp extends React.Component {
  state = {
    tabIndex: 0,
    categoryColumns: [
      {
        accessor: 'id',
        show: false
      },
      {
        headerClassName: 'tl',
        Header: 'Name',
        accessor: 'name',
        minWidth: 250
      },
      {
        Header: (
          <HeaderFilter
            title="Category Type"
            accessor="product_category_type"
            getOptions={CategoryStore.getUniqPropValues}
            onUpdate={CategoryStore.updateFilterOptions}
          />
        ),
        minWidth: 180,
        accessor: 'product_category_type'
      },
      {
        Header: (
          <HeaderFilter
            title="Active"
            accessor="is_active"
            getOptions={CategoryStore.getUniqPropValues}
            onUpdate={CategoryStore.updateFilterOptions}
          />
        ),
        accessor: 'is_active',
        width: 100,
        Cell: props => {
          return (
            <div className="center">
              <input
                type="checkbox"
                className="toggle toggle-default"
                onChange={() => {}}
                checked={props.value}
              />
              <label
                className="toggle-button"
                onClick={this.onToggleActive(props.row.id, props.value)}
              />
            </div>
          )
        }
      }
    ],
    itemColumns: [
      {
        accessor: 'id',
        show: false
      },
      {
        headerClassName: 'tl',
        Header: 'Name',
        accessor: 'name',
        minWidth: 250
      },
      {
        Header: (
          <HeaderFilter
            title="Item Category"
            accessor="product_category_name"
            getOptions={ItemStore.getUniqPropValues}
            onUpdate={ItemStore.updateFilterOptions}
          />
        ),
        accessor: 'product_category_name',
        minWidth: 150
      },
      {
        Header: (
          <HeaderFilter
            title="Strain"
            accessor="strain_name"
            getOptions={ItemStore.getUniqPropValues}
            onUpdate={ItemStore.updateFilterOptions}
          />
        ),
        accessor: 'strain_name',
        minWidth: 200
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Unit of Measure"
            accessor="uom_name"
            getOptions={ItemStore.getUniqPropValues}
            onUpdate={ItemStore.updateFilterOptions}
          />
        ),
        accessor: 'uom_name',
        minWidth: 120
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Quantity Type"
            accessor="quantity_type"
            getOptions={ItemStore.getUniqPropValues}
            onUpdate={ItemStore.updateFilterOptions}
          />
        ),
        accessor: 'quantity_type',
        minWidth: 120
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Added to Metrc"
            accessor="updated_metrc"
            getOptions={ItemStore.getUniqPropValues}
            onUpdate={ItemStore.updateFilterOptions}
          />
        ),
        accessor: 'updated_metrc',
        minWidth: 120,
        className: 'justify-end pr3',
        Cell: props => {
          return props.value ? 'Yes' : 'No'
        }
      }
    ]
  }

  componentDidMount() {
    CategoryStore.loadCategories()
    ItemStore.loadItems(this.props.facilityId)
  }

  onSelectTab = tabIndex => {
    this.setState({ tabIndex })
  }

  onToggleActive = (id, value) => e => {
    CategoryStore.updateCategory(id, !value)
  }

  render() {
    const { facilityId } = this.props
    const { itemColumns, categoryColumns, tabIndex } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="mt0 ba b--light-grey pa3">
          <p className="mt2 mb4 db body-1 grey">
            Manage your product types &amp; subcategory
          </p>
          {/* <div className="fl w-80-l w-100-m"> */}
          <Tabs
            className="react-tabs--primary"
            selectedIndex={tabIndex}
            onSelect={this.onSelectTab}
          >
            <TabList>
              <Tab>Product Type</Tab>
              <Tab>Product Subcategory</Tab>
            </TabList>
            <TabPanel>
              <div className="pb4 ph3">
                <ListingTable
                  data={CategoryStore.filteredList}
                  columns={categoryColumns}
                  isLoading={CategoryStore.isLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="pb4 ph3">
                <ListingTable
                  data={ItemStore.filteredList}
                  columns={itemColumns}
                  isLoading={ItemStore.isLoading}
                />
              </div>
            </TabPanel>
          </Tabs>
          {/* </div> */}

          <div data-role="sidebar" className="rc-slide-panel">
            <div className="rc-slide-panel__body h-100" />
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default ItemApp
