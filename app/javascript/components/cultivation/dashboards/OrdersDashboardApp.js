import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  HeaderFilter,
  ActiveBadge
} from '../../utils'
import classNames from 'classnames'

const dummyData = [
  {
    order_id: 'ORD12333',
    status: 'Delivered',
    use_type: 'Medical',
    order_date: '02/12/2019',
    fulfilment_date: '03/12/2019',
    delivery_date: '07/12/2019',
    total_items_ordered: '41',
    total_net_weight: '73lbs',
    total_revenue: '$1,300',
    customer: 'ABC Distributor',
    manifest: 'MON198'
  },
  {
    order_id: 'ORD14499',
    status: 'Fulfilled',
    use_type: 'Medical',
    order_date: '12/03/2019',
    fulfilment_date: '13/03/2019',
    delivery_date: '17/03/2019',
    total_items_ordered: '29',
    total_net_weight: '89lbs',
    total_revenue: '$7,300',
    customer: 'MNC Distributor',
    manifest: 'MON201'
  },
  {
    order_id: 'ORD13490',
    status: 'Fulfilled',
    use_type: 'Recreational',
    order_date: '09/06/2019',
    fulfilment_date: '18/06/2019',
    delivery_date: '21/06/2019',
    total_items_ordered: '200',
    total_net_weight: '230lbs',
    total_revenue: '$11,880',
    customer: 'PEL Distributor',
    manifest: 'MON301'
  },
  {
    order_id: 'ORD15871',
    status: 'Delivered',
    use_type: 'Medical',
    order_date: '07/07/2019',
    fulfilment_date: '19/07/2019',
    delivery_date: '22/07/2019',
    total_items_ordered: '56',
    total_net_weight: '140lbs',
    total_revenue: '$2,100',
    customer: 'LKO Distributor',
    manifest: 'MON126'
  },
  {
    order_id: 'ORD17833',
    status: 'Fulfilled',
    use_type: 'Recreational',
    order_date: '02/01/2019',
    fulfilment_date: '03/01/2019',
    delivery_date: '07/01/2019',
    total_items_ordered: '77',
    total_net_weight: '300lbs',
    total_revenue: '$3,399',
    customer: 'ABC Distributor',
    manifest: 'MON156'
  },
  {
    order_id: 'ORD19999',
    status: 'Delivered',
    use_type: 'Medical',
    order_date: '02/08/2019',
    fulfilment_date: '03/08/2019',
    delivery_date: '07/08/2019',
    total_items_ordered: '10',
    total_net_weight: '30lbs',
    total_revenue: '$1,910',
    customer: 'LLP Distributor',
    manifest: 'MON200'
  },
  {
    order_id: 'ORD11890',
    status: 'Fulfilled',
    use_type: 'Medical',
    order_date: '02/02/2019',
    fulfilment_date: '03/02/2019',
    delivery_date: '07/02/2019',
    total_items_ordered: '41',
    total_net_weight: '73lbs',
    total_revenue: '$1,999',
    customer: '888 Distributor',
    manifest: 'MON130'
  },
  {
    order_id: 'ORD12387',
    status: 'Delivered',
    use_type: 'Recreational',
    order_date: '11/09/2019',
    fulfilment_date: '17/09/2019',
    delivery_date: '21/09/2019',
    total_items_ordered: '90',
    total_net_weight: '193lbs',
    total_revenue: '$5,300',
    customer: 'BLU Distributor',
    manifest: 'MON120'
  },
  {
    order_id: 'ORD1299',
    status: 'Fulfilled',
    use_type: 'Medical',
    order_date: '09/11/2019',
    fulfilment_date: '10/11/2019',
    delivery_date: '20/11/2019',
    total_items_ordered: '11',
    total_net_weight: '20lbs',
    total_revenue: '$900',
    customer: 'JME Distributor',
    manifest: 'MON198'
  },
  {
    order_id: 'ORD19850',
    status: 'Delivered',
    use_type: 'Medical',
    order_date: '12/12/2019',
    fulfilment_date: '18/12/2019',
    delivery_date: '23/12/2019',
    total_items_ordered: '50',
    total_net_weight: '129lbs',
    total_revenue: '$4,300',
    customer: 'LES Distributor',
    manifest: 'MON281'
  },
  {
    order_id: 'ORD1211',
    status: 'Fulfilled',
    use_type: 'Medical',
    order_date: '02/12/2019',
    fulfilment_date: '03/12/2019',
    delivery_date: '07/12/2019',
    total_items_ordered: '41',
    total_net_weight: '73lbs',
    total_revenue: '$1,300',
    customer: 'NPE Distributor',
    manifest: 'MON198'
  },
  {
    order_id: 'ORD12881',
    status: 'Delivered',
    use_type: 'Recreational',
    order_date: '02/12/2019',
    fulfilment_date: '03/12/2019',
    delivery_date: '07/12/2019',
    total_items_ordered: '41',
    total_net_weight: '73lbs',
    total_revenue: '$1,300',
    customer: 'LAKSA Distributor',
    manifest: 'MON198'
  },
  {
    order_id: 'ORD12775',
    status: 'Delivered',
    use_type: 'Medical',
    order_date: '02/12/2019',
    fulfilment_date: '03/12/2019',
    delivery_date: '07/12/2019',
    total_items_ordered: '41',
    total_net_weight: '73lbs',
    total_revenue: '$1,300',
    customer: 'ABC Distributor',
    manifest: 'MON198'
  }
]

@observer
class OrdersDashboardApp extends React.Component {
  state = {
    columns: [
      {
        headerClassName: 'pl3 tl',
        Header: 'Order ID',
        accessor: 'order_id',
        className: 'dark-grey pl3 fw6',
        minWidth: 150,
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Status"
            accessor="status"
            // getOptions={BatchStore.getUniqPropValues}
            // onUpdate={BatchStore.updateFilterOptions}
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
        Header: 'Use Type',
        accessor: 'use_type',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Order Date',
        accessor: 'order_date',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Fulfilment Date',
        accessor: 'fulfilment_date',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Delivery Date',
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
        Header: 'Customer',
        accessor: 'customer',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Manifest',
        accessor: 'manifest',
        className: ' pr3 justify-center',
        width: 110
      }
    ]
  }
  componentDidMount() {
    // BatchStore.loadBatches()
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
    // const { defaultFacilityId } = this.props
    const { columns } = this.state
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse" />
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search"
            // onChange={e => {
            //   BatchStore.filter = e.target.value
            // }}
          />
          <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
        </div>
        <div className="pv3">
          <ListingTable
            data={dummyData}
            columns={columns}
            // isLoading={BatchStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default OrdersDashboardApp
