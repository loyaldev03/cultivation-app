import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  HeaderFilter,
  ActiveBadge,
  TempPackagesHistory
} from '../../utils'
import classNames from 'classnames'
import uniq from 'lodash.uniq'
import PackageOrderStore from './PackageOrderStore'

class OrderStore {
  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(PackageOrderStore.package_orders.map(x => x[propName]).sort())
  }
}

const orderStore = new OrderStore()

@observer
class OrdersDashboardApp extends React.Component {
  state = {
    columns: [
      {
        headerClassName: 'pl3 tl',
        Header: 'Order ID',
        accessor: 'order_no',
        className: 'dark-grey pl3 fw6',
        minWidth: 150
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Status"
            accessor="status"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'status',
        className: 'justify-center',
        minWidth: 88,
        Cell: props => (
          <span
            className={classNames(`f7 fw6 ph3 pv1 ba br2 dib tc `, {
              'bg-green b--green white': props.value === 'Delivered',
              'bg-orange b--orange white': props.value === 'Fulfilled'
            })}
          >
            {props.value}
          </span>
        )
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Use Type"
            accessor="use_type"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'use_type',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Order Date"
            accessor="order_date"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'order_date',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Fullfilment Date"
            accessor="fulfilment_date"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'fulfilment_date',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Delivery Date"
            accessor="delivery_date"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'delivery_date',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Total Items Ordered',
        accessor: 'total_items_ordered',
        className: ' pr3 justify-center',
        width: 120
      },
      {
        headerClassName: '',
        Header: 'Total Net Weight',
        accessor: 'total_net_weight',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Total Revenue',
        accessor: 'total_revenue',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Customer"
            accessor="customer"
            getOptions={orderStore.getUniqPropValues}
            onUpdate={orderStore.updateFilterOptions}
          />
        ),
        accessor: 'customer',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Manifest',
        accessor: 'manifest',
        className: ' pr3 justify-center',
        width: 190,
        Cell: props => (
          <div>
            {
              props.value ? 
                props.value
                : <a className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer">Create manifest</a>
            }
          </div>
        )
      }
    ]
  }
  componentDidMount() {
    PackageOrderStore.loadPackageOrder()
  }

  onToggleColumns = (header, value) => {
    const column = this.state.columns.find(x => x.Header === header)
    if (column) {
      column.show = value
      this.setState({
        columns: this.state.columns.map(x =>
          x.Header === column.Header ? column : x
        )
      })
    }
  }

  render() {
    const { columns } = this.state
    return (
      <div className="pa4">
        <div className="flex flex-row-reverse" />
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search"
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={PackageOrderStore.package_orders}
            columns={columns}
            SubComponent={v => 
            {
              return (
              <div style={{ padding: '10px' }}>
                <img src={TempPackagesHistory} />
              </div>
              )}
            }
          />
        </div>
      </div>
    )
  }
}

export default OrdersDashboardApp
