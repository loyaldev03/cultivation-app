import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  HeaderFilter,
  ActiveBadge
} from '../../utils'

const dummyData = [
  {
    manifest_id: 'IS12333',
    order_id: 'ORD12333',
    date_created: '02/12/2019',
    date_delivered: '03/12/2019',
    customer: 'AMD Distributor',
    revenue: '$54,300',
    tax: '$41',
    sub_total: '$54,300',
    payment_date: '07/12/2019'
  },
  {
    manifest_id: 'IS14499',
    order_id: 'ORD14499',
    date_created: '12/03/2019',
    date_delivered: '13/03/2019',
    customer: 'GG Distributor',
    revenue: '$7,300',
    tax: '$29',
    sub_total: '$7,300',
    payment_date: '17/03/2019'
  },
  {
    manifest_id: 'IS13490',
    order_id: 'ORD13490',
    date_created: '09/06/2019',
    date_delivered: '18/06/2019',
    customer: 'WIM Distributor',
    revenue: '$11,880',
    tax: '$200',
    sub_total: '$11,880',
    payment_date: '20/06/2019'
  },
  {
    manifest_id: 'IS15871',
    order_id: 'ORD15871',
    date_created: '07/07/2019',
    date_delivered: '19/07/2019',
    customer: 'Lakeside Distributor',
    revenue: '$2,100',
    tax: '$56',
    sub_total: '$2,100',
    payment_date: '22/07/2019'
  },
  {
    manifest_id: 'IS17833',
    order_id: 'ORD17833',
    date_created: '02/01/2019',
    date_delivered: '03/01/2019',
    customer: 'ADF Distributor',
    revenue: '$3,399',
    tax: '$77',
    sub_total: '$3,399',
    payment_date: '07/01/2019'
  },
  {
    manifest_id: 'IS19999',
    order_id: 'ORD19999',
    date_created: '02/08/2019',
    date_delivered: '03/08/2019',
    customer: 'LENS Distributor',
    revenue: '$1,910',
    tax: '$10',
    sub_total: '$1,910',
    payment_date: '07/08/2019'
  },
  {
    manifest_id: 'IS11890',
    order_id: 'ORD11890',
    date_created: '02/02/2019',
    date_delivered: '03/02/2019',
    customer: 'HOLA Distributor',
    revenue: '$1,999',
    tax: '$41',
    sub_total: '$1,999',
    payment_date: '07/02/2019'
  },
  {
    manifest_id: 'IS12387',
    order_id: 'ORD12387',
    date_created: '11/09/2019',
    date_delivered: '17/09/2019',
    customer: 'WP Distributor',
    revenue: '$5,300',
    tax: '$90',
    sub_total: '$5,300',
    payment_date: '21/09/2019'
  },
  {
    manifest_id: 'IS1299',
    order_id: 'ORD1299',
    date_created: '09/11/2019',
    date_delivered: '10/11/2019',
    customer: 'ZSH Distributor',
    revenue: '$900',
    tax: '$11',
    sub_total: '$900',
    payment_date: '20/11/2019'
  },
  {
    manifest_id: 'IS19850',
    order_id: 'ORD19850',
    date_created: '12/12/2019',
    date_delivered: '18/12/2019',
    customer: 'Cap Distributor',
    revenue: '$4,300',
    tax: '$50',
    sub_total: '$4,300',
    payment_date: '23/12/2019'
  },
  {
    manifest_id: 'IS1211',
    order_id: 'ORD1211',
    date_created: '02/12/2019',
    date_delivered: '03/12/2019',
    customer: 'Mina Distributor',
    revenue: '$1,300',
    tax: '$41',
    sub_total: '$1,300',
    payment_date: '07/12/2019'
  },
  {
    manifest_id: 'IS12881',
    order_id: 'ORD12881',
    date_created: '02/12/2019',
    date_delivered: '03/12/2019',
    customer: 'Arcana Distributor',
    revenue: '$1,300',
    tax: '$41',
    sub_total: '$1,300',
    payment_date: '07/12/2019'
  },
  {
    manifest_id: 'IS12775',
    order_id: 'ORD12775',
    date_created: '02/12/2019',
    date_delivered: '03/12/2019',
    customer: 'PA Distributor',
    revenue: '$1,300',
    tax: '$41',
    sub_total: '$1,300',
    payment_date: '07/12/2019'
  }
]

@observer
class ManifestsDashboardApp extends React.Component {
  state = {
    columns: [
      {
        headerClassName: 'pl3 tl',
        Header: 'Manifest ID',
        accessor: 'manifest_id',
        className: 'dark-grey pl3 fw6',
        width: 120
      },
      {
        headerClassName: '',
        Header: 'Order ID',
        accessor: 'order_id',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Date Created',
        accessor: 'date_created',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Date Delivered',
        accessor: 'date_delivered',
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
        Header: 'Revenue',
        accessor: 'revenue',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Tax',
        accessor: 'tax',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Subtotal',
        accessor: 'sub_total',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Payment Date',
        accessor: 'payment_date',
        className: ' pr3 justify-center'
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

export default ManifestsDashboardApp
