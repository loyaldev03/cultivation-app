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
import CategoryStore from '../inventory/stores/ProductCategoryStore'
import MetrcItemCategoryStore from './MetrcItemCategoryStore'
import AddEditProductCategoryForm from './AddEditProductCategoryForm'
import AddEditProductSubCategoryForm from './AddEditProductSubCategoryForm'

@observer
class ProductCategoryApp extends React.Component {
  constructor(props) {
    super(props)
    CategoryStore.setDefaults(this.props.defaultCategories)
  }

  state = {
    tabIndex: 0,
    showEditPanel: false, // Category
    editPanelMode: '', // Category
    editCategory: '', // Category
    showEditSubCategoryPanel: false, // SubCategory
    editSubCategoryPanelMode: '', // SubCategory
    editSubCategory: {}, // SubCategory
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
    subCategoryColumns: [
      {
        accessor: 'product_category_id',
        show: false
      },
      {
        accessor: 'package_units',
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
              onClick={e =>
                this.onEditSubcategory({
                  id: props.row.id,
                  name: props.row.name,
                  productCategoryId: props.row.product_category_id,
                  packageUnits: props.row.package_units
                })
              }
            >
              {props.value}
            </a>
          )
        }
      },
      {
        headerClassName: 'tl',
        Header: 'Product Category',
        accessor: 'product_category_name',
        minWidth: 200,
        Cell: props => {
          return (
            <a
              href="#0"
              className="ph2 w-100 dark-gray link"
              onClick={e =>
                this.onEditSubcategory({
                  id: props.row.id,
                  name: props.row.name,
                  productCategoryId: props.row.product_category_id,
                  packageUnits: props.row.package_units
                })
              }
            >
              {props.value}
            </a>
          )
        }
      },
      {
        Header: '',
        accessor: 'id',
        width: 80,
        className: 'justify-center',
        Cell: props => {
          const record = {
            id: props.row.id,
            name: props.row.name
          }
          return (
            <a href="#0" onClick={e => this.onDeleteSubcategory(e, record)}>
              <i className="material-icons red">delete</i>
            </a>
          )
        }
      }
    ]
  }

  async componentDidMount() {
    await Promise.all([
      CategoryStore.loadCategories(),
      MetrcItemCategoryStore.loadCategories()
    ])

    // TODO: For DEVELOPMENT USE ONLY
    this.setState({
      tabIndex: 1,
      showEditSubCategoryPanel: true,
      editSubCategoryPanelMode: 'add'
    })
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
      showEditPanel: false,
      editPanelMode: '',
      editCategory: ''
    })
  }

  onSaveSubcategory = formData => {
    CategoryStore.updateSubCategory(formData.productCategory, formData)
    this.setState({
      showEditSubCategoryPanel: false,
      editSubCategoryPanelMode: '',
      editSubCategory: {}
    })
  }

  onEdit = name => {
    this.setState({
      showEditPanel: true,
      editPanelMode: 'edit',
      editCategory: name
    })
  }

  onEditSubcategory = subCategory => {
    this.setState({
      showEditSubCategoryPanel: true,
      editSubCategoryPanelMode: 'edit',
      editSubCategory: subCategory
    })
  }

  onDelete = (e, record) => {
    e.stopPropagation()
    const result = confirm(`Confirm delete product category ${record}?`)
    if (result) {
      CategoryStore.updateCategory(record, { deleted: true })
    }
  }

  onDeleteSubcategory = (e, record) => {
    e.stopPropagation()
    const result = confirm(`Confirm delete subcategory ${record.name}?`)
    if (result) {
      CategoryStore.updateSubCategory(null, {
        id: record.id,
        deleted: true
      })
    }
  }

  render() {
    const {
      categoryColumns,
      subCategoryColumns,
      tabIndex,
      showEditPanel,
      editPanelMode,
      editCategory,
      showEditSubCategoryPanel,
      editSubCategoryPanelMode,
      editSubCategory
    } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <SlidePanel
          width="500px"
          show={showEditPanel}
          renderBody={props => (
            <AddEditProductCategoryForm
              ref={form => (this.editForm = form)}
              mode={editPanelMode}
              editCategory={editCategory}
              onClose={() => this.setState({ showEditPanel: false })}
              onSave={this.onSave}
            />
          )}
        />
        <SlidePanel
          width="500px"
          show={showEditSubCategoryPanel}
          renderBody={props => (
            <AddEditProductSubCategoryForm
              mode={editSubCategoryPanelMode}
              editSubCategory={editSubCategory}
              onClose={() => this.setState({ showEditSubCategoryPanel: false })}
              onSave={this.onSaveSubcategory}
            />
          )}
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
              <div className="pa3 tr">
                <a
                  href="#0"
                  className="btn btn--primary"
                  onClick={() =>
                    this.setState({
                      showEditSubCategoryPanel: true,
                      editSubCategoryPanelMode: 'add'
                    })
                  }
                >
                  + Add New
                </a>
              </div>
              <div className="pb4 ph3">
                <ListingTable
                  data={CategoryStore.filteredListSubCategories}
                  columns={subCategoryColumns}
                  isLoading={CategoryStore.isLoading}
                />
              </div>
            </TabPanel>
          </Tabs>
        </div>
      </React.Fragment>
    )
  }
}

export default ProductCategoryApp
