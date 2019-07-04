import 'babel-polyfill'
import React from 'react'
import isEmpty from 'lodash.isempty'
import classNames from 'classnames'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import { toast } from '../utils/toast'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
  ActiveBadge,
  httpPostOptions,
  httpGetOptions,
  Loading,
  ListingTable
} from '../utils'

class CategoryStore {
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable searchTerm = ''
  @observable columnFilters = {}
  @observable categories = []

  async loadCategories() {
    this.isLoading = true
    const url = '/api/v1/products/item_categories'
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.categories = response.data.map(x => x.attributes)
        this.isDataLoaded = true
      } else {
        this.isDataLoaded = false
      }
    } catch (error) {
      this.categories = []
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  async updateCategory(id, isActive) {
    this.isLoading = true
    const url = `/api/v1/products/item_categories/${id}/update`
    try {
      const params = { is_active: isActive }
      const response = await (await fetch(url, httpPostOptions(params))).json()
      if (response && response.data) {
        this.categories = this.categories.map(x =>
          x.id === response.data.id ? response.data.attributes : x
        )
        const cat = {
          name: response.data.attributes.name,
          status: response.data.attributes.is_active ? 'active' : 'inactive'
        }
        toast(`${cat.name} is now ${cat.status}`, 'success')
      } else {
        console.log(response)
      }
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  /* + column filters */
  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }

  @computed
  get filteredList() {
    if (!isEmpty(this.columnFilters)) {
      return this.categories.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const nameLc = `${b.name}`.toLowerCase()
        const results = nameLc.includes(filterLc)
        return results
      })
    } else {
      return this.categories
    }
  }
  /* - column filters */
}

const store = new CategoryStore()

@observer
class ItemApp extends React.Component {
  state = {
    tabIndex: 0,
    columns: [
      {
        accessor: 'id',
        show: false
      },
      {
        headerClassName: 'tl',
        Header: 'Name',
        accessor: 'name',
        width: 300
      },
      {
        headerClassName: 'tl',
        Header: 'Category Type',
        accessor: 'product_category_type'
      },
      {
        headerClassName: 'tc',
        Header: 'Active',
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
    ]
  }

  componentDidMount() {
    store.loadCategories()
  }

  onSelectTab = tabIndex => {
    this.setState({ tabIndex })
  }

  onToggleActive = (id, value) => e => {
    store.updateCategory(id, !value)
  }

  render() {
    const { facilityId } = this.props
    const { columns, tabIndex } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="pa4">
          <div className="bg-white box--shadow pa4 fl w-100">
            <div className="fl w-70-l w-100-m">
              <h5 className="tl pa0 ma0 h5--font dark-grey ttc">
                Product Setup
              </h5>
              <p className="mt2 mb4 db body-1 grey">
                Manage your facility's product categories &amp; items
              </p>
            </div>
            <div className="fl w-70-l w-100-m">
              <Tabs
                className="react-tabs--primary react-tabs--boxed-panel"
                selectedIndex={tabIndex}
                onSelect={this.onSelectTab}
              >
                <TabList>
                  <Tab>Item Categories</Tab>
                  <Tab>Items</Tab>
                </TabList>
                <TabPanel>
                  <div className="pb4 ph3">
                    <p className="grey pt2">
                      Item categories that are defined by the State, you can
                      decide which categories your facility will be producing by
                      setting it to "Active"
                    </p>
                    <ListingTable
                      data={store.filteredList}
                      columns={columns}
                      isLoading={store.isLoading}
                    />
                  </div>
                </TabPanel>
                <TabPanel />
              </Tabs>
            </div>
          </div>
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100" />
        </div>
      </React.Fragment>
    )
  }
}

export default ItemApp
