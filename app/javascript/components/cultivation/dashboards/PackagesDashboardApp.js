import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import { differenceInDays } from 'date-fns'
import { observer } from 'mobx-react'
import {
  decimalFormatter,
  formatDate2,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  TempPackagesWidgets
} from '../../utils'
import BatchStore from '../batches/BatchStore'

const dummyData = [

  { package: 'CAMPOS DE KUSH', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'God Bud', genome: 'indica', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: ''},
  { package: 'SKUNKWORX PACKAGING', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'GLASS VIAL WITH BLACK CHILD RESISTANT CAP', genome: 'indica', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: 'PHYTO ALASKAN', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Alaskan Thunder Fuck', genome: 'sativa', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: 'CREAM OF THE CROP GARDENS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Do Si Dos', genome: 'indica', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: 'CANNASOL FARMS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Alaskan Thunder Fuck', genome: 'sativa', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: 'ARTIZEN CANNABIS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Allen Wrench', genome: 'sativa', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: 'LAUGHING MAN FARMS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Allen Wrench', genome: 'sativa', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: 'CANNASOL FARMS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Allen Wrench', genome: 'sativa', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: '' },
  { package: '7 POINTS OREGON', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Cherry Pie', genome: 'hybrid', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: ''},
  { package: 'SPINACH CANNABIS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Dancehall', genome: 'hybrid', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: ''},
  { package: 'DOUBLE DUTCH FARMS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Dutch Treat', genome: 'hybrid', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: ''},
  { package: 'TKO RESERVE', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Gelato', genome: 'hyrbid', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: ''},
  { package: 'LAZY BEE GARDENS', package_id: 'PCK94457', group: 'pre-rolls', type: 'lb', package_date: '11/12/2019', use_type: 'medical', strain: 'Gelato', genome: 'hybrid', thc: '9%', cbd: '8%', total_qty: '', qty_hold: '', unsold: ''},
]

@observer
class PackageDashboardApp extends React.Component {
  state = {
    columns: [
      {
        headerClassName: 'pl3 tl',
        Header: 'Package',
        accessor: 'package',
        className: 'dark-grey pl3 fw6',
        minWidth: 150,
        Cell: props => (
          <a
            className="link dark-grey truncate"
            href={`/cultivation/batches/${props.row.id}`}
            title={props.row.batch_no}
          >
            {props.value}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: (
          <HeaderFilter
            title="Package ID"
            accessor="package_id"
            // getOptions={BatchStore.getUniqPropValues}
            // onUpdate={BatchStore.updateFilterOptions}
          />
        ),
        accessor: 'package_id',
        minWidth: 120,
        Cell: props => <span className="truncate">{props.value}</span>
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Group',
        accessor: 'group',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Type',
        accessor: 'type',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Package Date',
        accessor: 'package_date',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Use Type',
        accessor: 'use_type',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Strain',
        accessor: 'strain',
        className: ' pr3',
        width: 120
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Genome',
        accessor: 'genome',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: '% THC',
        accessor: 'thc',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: '% CBD',
        accessor: 'cbd',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Total Qty',
        accessor: 'total_qty',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Qty On Hold',
        accessor: 'qty_hold',
        className: ' pr3',
        width: 110
      },
      {
        headerClassName: 'tr pr3',
        Header: 'Unsold',
        accessor: 'unsold',
        className: ' pr3',
        width: 110
      },
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
        <div className="flex flex-row-reverse">
        </div>
        <div className="pv4">
          <img src={TempPackagesWidgets} />
        </div>
        <div className="flex justify-end">
          {/* <input
            type="text"
            className="input w5"
            placeholder="Search"
            // onChange={e => {
            //   BatchStore.filter = e.target.value
            // }}
          /> */}
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

export default PackageDashboardApp
