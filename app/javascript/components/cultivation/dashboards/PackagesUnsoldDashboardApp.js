import React, { lazy, Suspense } from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import { toast, ListingTable, CheckboxSelect } from '../../utils'
import harvestPackageStore from '../../inventory/sales_products/store/HarvestPackageStore'
import ConvertPackagePlanForm from '../../cultivation/tasks_setup/components/ConvertPackagePlanForm'
import { SlidePanel, HeaderFilter } from '../../utils'

const CreateOrderSidebar = lazy(() => import('./CreateOrderSidebar'))

import CustomerStore from '../../settings/CustomerStore'

const MenuButton = ({ icon, indelible, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      {icon ? (
        <i className="material-icons md-17 pr2">{icon}</i>
      ) : indelible == 'add_nutrient' ? (
        <img src={MyImage} style={{ width: '2em' }} />
      ) : (
        ''
      )}
      <span className="pr2">{text}</span>
    </a>
  )
}

@observer
class HarvestPackageSetupApp extends React.Component {
  state = {
    idOpen: '',
    showCreatePackagePlan: false,
    showEditor: false,
    checkedPackageIds: [],
    showCreateOrderSidebar: false
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    harvestPackageStore.loadHarvestPackages()
    CustomerStore.loadCustomer()
  }

  openHarvestPackage = (event, id) => {
    this.setState({ showEditor: true, idOpen: id })
    event.preventDefault()
  }

  onCreateOrder = e => {
    if (this.state.checkedPackageIds.length > 0) {
      const packages = harvestPackageStore.harvestPackages.filter(e =>
        this.state.checkedPackageIds.includes(e.id)
      )
      this.createOrderSidebar.setPackages(packages)
      this.setState({
        showCreateOrderSidebar: !this.state.showCreateOrderSidebar
      })
    } else {
      alert('please select one package to create order')
    }
  }

  onShowCreatePackagePlan = id => {
    // somehow pass the id into the form
    this.setState({ showCreatePackagePlan: true, idOpen: id })
  }

  onCheckPackageId = id => {
    let newCheckedPackageIds = []
    if (!this.state.checkedPackageIds.includes(id)) {
      //checked if doesnt exist
      console.log('check')
      newCheckedPackageIds = [...this.state.checkedPackageIds, id]
    } else {
      //uncheck if already exist
      console.log('uncheck')
      newCheckedPackageIds = this.state.checkedPackageIds.filter(a => a !== id)
    }
    this.setState({
      checkedPackageIds: newCheckedPackageIds
    })
  }

  tableColumns = (locations, harvest_batches) => [
    {
      Header: '',
      headerClassName: '',
      Cell: props => {
        console.log(props.row.id)
        return (
          <input
            type="checkbox"
            // checked={!isActive}
            onChange={e => this.onCheckPackageId(props.row.id)}
          />
        )
      }
    },
    {
      Header: 'Package Name',
      accessor: 'package_name',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: (
        <HeaderFilter
          title="Package Group"
          accessor="label"
          getOptions={harvestPackageStore.getUniqPropValues}
          onUpdate={harvestPackageStore.updateFilterOptions}
        />
      ),
      accessor: 'label',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: (
        <HeaderFilter
          title="Package Type"
          accessor="uom"
          getOptions={harvestPackageStore.getUniqPropValues}
          onUpdate={harvestPackageStore.updateFilterOptions}
        />
      ),
      accessor: 'uom',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Package ID',
      accessor: 'package_tag',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: (
        <HeaderFilter
          title="Use Type"
          accessor="use_type"
          getOptions={harvestPackageStore.getUniqPropValues}
          onUpdate={harvestPackageStore.updateFilterOptions}
        />
      ),
      accessor: 'use_type',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: (
        <HeaderFilter
          title="Strain"
          accessor="strain"
          getOptions={harvestPackageStore.getUniqPropValues}
          onUpdate={harvestPackageStore.updateFilterOptions}
        />
      ),
      accessor: 'strain',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: (
        <HeaderFilter
          title="Genome Type"
          accessor="genome_type"
          getOptions={harvestPackageStore.getUniqPropValues}
          onUpdate={harvestPackageStore.updateFilterOptions}
        />
      ),
      accessor: 'genome_type',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: '% THC',
      accessor: 'thc',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: '% CBD',
      accessor: 'cbd',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Qty Sold',
      accessor: 'qty_sold',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Qty Unsold',
      accessor: 'qty_unsold',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Total Net Weight',
      accessor: 'quantity',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Price per Unit',
      accessor: 'cost_per_unit',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Total Revenue',
      accessor: 'total_revenue',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Order Date',
      accessor: 'order_date',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Order #',
      accessor: 'order_id',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Manifest #',
      accessor: 'manifest_id',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: (
        <HeaderFilter
          title="Status"
          accessor="status"
          getOptions={harvestPackageStore.getUniqPropValues}
          onUpdate={harvestPackageStore.updateFilterOptions}
        />
      ),
      accessor: 'status',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Fullfilment Date',
      accessor: 'fullfilment_date',
      headerClassName: 'tl',
      Cell: props => {
        return <span>{props.value ? props.value : '-'}</span>
      }
    },
    {
      Header: 'Actions',
      className: 'tc',
      accessor: 'id',
      filterable: false,
      maxWidth: 45,
      Cell: this.renderActions
    }
  ]

  renderActions = record => {
    const id = toJS(record.original.id)

    return (
      <span className="pointer">
        <Tippy
          placement="bottom-end"
          trigger="click"
          content={
            this.state.idOpen === record.id ? (
              <div className="bg-white f6 flex grey">
                <div className="db shadow-4">
                  <MenuButton
                    icon="edit"
                    text="Edit"
                    onClick={e => {
                      this.openHarvestPackage(event, id)
                    }}
                  />
                  <MenuButton
                    icon="settings"
                    text="Convert product"
                    onClick={e => this.onShowCreatePackagePlan(id)}
                  />
                </div>
              </div>
            ) : (
              ''
            )
          }
        >
          <i
            onClick={() => {
              this.setState({ idOpen: record.id })
            }}
            className="material-icons gray"
          >
            more_horiz
          </i>
        </Tippy>
      </span>
    )
  }

  onFetchData = (state, instance) => {
    harvestPackageStore.setFilter({
      facility_id: this.props.facility_id
    })
    harvestPackageStore.loadHarvestPackages()
  }

  onSave = data => {
    console.log(data)
    if (data.toast) {
      toast(data.toast.message, data.toast.type)
    }

    if (data.hideSidebar) {
      this.setState({ showCreatePackagePlan: false, showEditor: false })
    }
  }

  render() {
    const { locations, harvest_batches, salesProductPermission } = this.props
    const {
      showEditor,
      showCreatePackagePlan,
      idOpen,
      columns,
      showCreateOrderSidebar
    } = this.state

    return (
      <React.Fragment>
        <div id="toast" className="toast animated toast--success" />
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Package Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              {salesProductPermission.create && <React.Fragment />}
            </div>
          </div>

          <div className="flex justify-between pb3">
            <input
              type="text"
              className="input w5"
              placeholder="Search Package Name"
              onChange={e => {
                harvestPackageStore.searchTerm = e.target.value
              }}
            />
            <button
              className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
              onClick={this.onCreateOrder}
            >
              Create order
            </button>
          </div>

          <ListingTable
            columns={this.tableColumns(locations, harvest_batches)}
            className="-highlight std-table"
            ajax={true}
            onFetchData={this.onFetchData}
            isLoading={harvestPackageStore.isLoading}
            data={harvestPackageStore.filteredList}
            pageSize={20}
            minRows={5}
            className="f6 -highlight"
          />
          <SlidePanel
            width="600px"
            show={showCreateOrderSidebar}
            renderBody={props => (
              <Suspense fallback={<div />}>
                <CreateOrderSidebar
                  ref={form => (this.createOrderSidebar = form)}
                  title={'Create new order package'}
                  // facilityId={this.props.batch.facility_id}
                  onClose={() =>
                    this.setState({ showCreateOrderSidebar: false })
                  }
                  onSave={data => {
                    harvestPackageStore.createOrder(data)
                    this.setState({
                      showCreateOrderSidebar: false,
                      checkedPackageIds: []
                    })
                    // TaskStore.editAssignedUsers(
                    //   batchId,
                    //   this.state.taskSelected,
                    //   users
                    // )
                  }}
                />
              </Suspense>
            )}
          />
        </div>
      </React.Fragment>
    )
  }
}

HarvestPackageSetupApp.propTypes = {
  facility_strains: PropTypes.array.isRequired,
  harvest_batches: PropTypes.array.isRequired,
  sales_catalogue: PropTypes.array.isRequired,
  drawdown_uoms: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired
}

export default HarvestPackageSetupApp
