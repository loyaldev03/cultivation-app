import React from 'react'
import { observer } from 'mobx-react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import {
  formatDate3,
  SlidePanel,
  SlidePanelFooter,
  HeaderFilter,
  ListingTable
} from '../utils'
import MetrcItemStore from './ItemStore'
import CategoryStore from '../inventory/stores/ProductCategoryStore'
import AddEditProductCategoryForm from './AddEditProductCategoryForm'

@observer
class ProductCategoryApp extends React.Component {
  constructor(props) {
    super(props)
    CategoryStore.setDefaults(this.props.defaultCategories)
  }

  state = {
    tabIndex: 0,
    showEditPanel: false,
    editPanelMode: '',
    editCategory: '',
    categoryColumns: [
      {
        accessor: 'id',
        show: false
      },
      {
        headerClassName: 'tl',
        Header: 'Name',
        accessor: 'name',
        minWidth: 250,
        Cell: props => {
          return (
            <a
              href="#0"
              className="ph2 w-100 dark-gray link"
              onClick={e => this.onEdit(props.row.name)}
            >
              {props.value}
            </a>
          )
        }
      },
      {
        headerClassName: 'tl',
        Header: 'METRC Item Category',
        accessor: 'metrc_item_category',
        maxWidth: 250,
        Cell: props => {
          return (
            <a
              href="#0"
              className="ph2 w-100 dark-gray link"
              onClick={e => this.onEdit(props.row.name)}
            >
              {props.value ? props.value : '--'}
            </a>
          )
        }
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
                onClick={this.onToggleActive(props.row)}
              />
            </div>
          )
        }
      },
      {
        Header: '',
        accessor: 'name',
        width: 80,
        className: 'justify-center',
        Cell: props => {
          return (
            <a href="#0" onClick={e => this.onDelete(e, props.value)}>
              <i className="material-icons red">delete</i>
            </a>
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
            getOptions={MetrcItemStore.getUniqPropValues}
            onUpdate={MetrcItemStore.updateFilterOptions}
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
            getOptions={MetrcItemStore.getUniqPropValues}
            onUpdate={MetrcItemStore.updateFilterOptions}
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
            getOptions={MetrcItemStore.getUniqPropValues}
            onUpdate={MetrcItemStore.updateFilterOptions}
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
            getOptions={MetrcItemStore.getUniqPropValues}
            onUpdate={MetrcItemStore.updateFilterOptions}
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
            getOptions={MetrcItemStore.getUniqPropValues}
            onUpdate={MetrcItemStore.updateFilterOptions}
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
    MetrcItemStore.loadItems(this.props.facilityId)
  }

  onSelectTab = tabIndex => {
    this.setState({ tabIndex })
  }

  onToggleActive = data => _e => {
    CategoryStore.updateCategory(data.name, {
      is_active: !data.is_active
    })
  }

  onSave = formData => {
    CategoryStore.updateCategory(formData.name, formData)
    this.setState({
      showEditPanel: false
    })
  }

  onEdit = name => {
    this.setState({
      showEditPanel: true,
      editPanelMode: 'edit',
      editCategory: name
    })
  }

  onDelete = (e, record) => {
    e.stopPropagation()
    const result = confirm(`Confirm delete product category ${record}?`)
    if (result) {
      CategoryStore.updateCategory(record, { deleted: true })
    }
  }

  render() {
    const {
      itemColumns,
      categoryColumns,
      tabIndex,
      showEditPanel,
      editPanelMode,
      editCategory
    } = this.state
    const { facilityId } = this.props
    console.warn('FIXME: Wrong facilityId when selecting All')
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <SlidePanel
          width="500px"
          show={showEditPanel}
          renderBody={props =>
            <AddEditProductCategoryForm
              ref={form => (this.editForm = form)}
              mode={editPanelMode}
              onClose={() => this.setState({ showEditPanel: false })}
              onSave={this.onSave}
            />
          }
        />
        <div className="mt0 ba b--light-grey pa3">
          <p className="mt2 mb4 db body-1 grey">
            Manage your product types &amp; subcategory
          </p>
          <Tabs
            className="react-tabs--primary react-tabs--boxed-panel react-tabs--no-float"
            selectedIndex={tabIndex}
            onSelect={this.onSelectTab}
          >
            <TabList>
              <Tab>Product Category</Tab>
              <Tab>Subcategory</Tab>
            </TabList>
            <TabPanel>
              <div className="pa3 tr">
                <a
                  href="#0"
                  className="btn btn--primary"
                  onClick={() =>
                    this.setState({
                      showEditPanel: true,
                      editPanelMode: 'add'
                    })
                  }
                >
                  + Add New
                </a>
              </div>
              <div className="pb4 ph3">
                <ListingTable
                  data={CategoryStore.filteredList}
                  columns={categoryColumns}
                  isLoading={CategoryStore.isLoading}
                />
              </div>
            </TabPanel>
            <TabPanel>
              <div className="pv4 ph3">
                <ListingTable
                  data={MetrcItemStore.filteredList}
                  columns={itemColumns}
                  isLoading={MetrcItemStore.isLoading}
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

export default ProductCategoryApp
