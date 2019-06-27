import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  TempPackagesSoldWidgets
} from '../../utils'

const dummyData = [
  {
    package: 'CAMPOS DE KUSH',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    order_id: '03/12/2019',
    manifest: 'medical',
    strain: 'God Bud',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    qty_sold: '20',
    total_net_weight: '230lbs',
    price_per_unit: '$200',
    total_price: '$20,000',
    location: 'Package Room'
  },
  {
    package: 'SKUNKWORX PACKAGING',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    order_id: '11/12/2019',
    manifest: 'medical',
    strain: 'GLASS VIAL WITH BLACK CHILD RESISTANT CAP',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    qty_sold: '12',
    total_net_weight: '230lbs',
    price_per_unit: '$120',
    total_price: '$16,800',
    location: 'Package Room'
  },
  {
    package: 'PHYTO ALASKAN',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '12/2/2019',
    manifest: 'medical',
    strain: 'Alaskan Thunder Fuck',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '18',
    total_net_weight: '270lbs',
    price_per_unit: '$70',
    total_price: '$3500',
    location: 'Package Room'
  },
  {
    package: 'CREAM OF THE CROP GARDENS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '21/6/2019',
    manifest: 'medical',
    strain: 'Do Si Dos',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    qty_sold: '28',
    total_net_weight: '18lbs',
    price_per_unit: '$20',
    total_price: '$400',
    location: 'Package Room'
  },
  {
    package: 'CANNASOL FARMS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '11/1/2019',
    manifest: 'medical',
    strain: 'Alaskan Thunder Fuck',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '19',
    total_net_weight: '120lbs',
    price_per_unit: '$20',
    total_price: '$1,800',
    location: 'Package Room'
  },
  {
    package: 'ARTIZEN CANNABIS',
    package_id: 'PCK94457',
    group: 'kief',
    type: 'lb',
    order_id: '19/3/2019',
    manifest: 'medical',
    strain: 'Allen Wrench',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '10',
    total_net_weight: '329lbs',
    price_per_unit: '$30',
    total_price: '$5,700',
    location: 'Package Room'
  },
  {
    package: 'LAUGHING MAN FARMS',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    order_id: '26/5/2019',
    manifest: 'medical',
    strain: 'Allen Wrench',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '10',
    total_net_weight: '20lbs',
    price_per_unit: '$12',
    total_price: '$120',
    location: 'Package Room'
  },
  {
    package: 'CANNASOL FARMS',
    package_id: 'PCK94457',
    group: 'kief',
    type: 'lb',
    order_id: '18/9/2019',
    manifest: 'medical',
    strain: 'Allen Wrench',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '12',
    total_net_weight: '250lbs',
    price_per_unit: '$120',
    total_price: '$2,400',
    location: 'Package Room'
  },
  {
    package: '7 POINTS OREGON',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '10/11/2019',
    manifest: 'medical',
    strain: 'Cherry Pie',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '25',
    total_net_weight: '240lbs',
    price_per_unit: '$50',
    total_price: '$1700',
    location: 'Package Room'
  },
  {
    package: 'SPINACH CANNABIS',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    order_id: '11/12/2019',
    manifest: 'medical',
    strain: 'Dancehall',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '21',
    total_net_weight: '90lbs',
    price_per_unit: '40',
    total_price: '$1,200',
    location: 'Package Room'
  },
  {
    package: 'DOUBLE DUTCH FARMS',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    order_id: '26/3/2019',
    manifest: 'medical',
    strain: 'Dutch Treat',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '33',
    total_net_weight: '30lbs',
    price_per_unit: '40',
    total_price: '$2,000',
    location: 'Package Room'
  },
  {
    package: 'TKO RESERVE',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    order_id: '29/1/2019',
    manifest: 'medical',
    strain: 'Gelato',
    genome: 'hyrbid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '22',
    total_net_weight: '90lbs',
    price_per_unit: '30',
    total_price: '$1,500',
    location: 'Package Room'
  },
  {
    package: 'LAZY BEE GARDENS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '11/4/2019',
    manifest: 'medical',
    strain: 'Gelato',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '14',
    total_net_weight: '160lbs',
    price_per_unit: '70',
    total_price: '$6,300',
    location: 'Package Room'
  }
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
      },
      {
        headerClassName: '',
        Header: 'Package ID',
        accessor: 'package_id',
        className: '',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Group',
        accessor: 'group',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Type',
        accessor: 'type',
        className: ' pr3 justify-center',
        width: 110
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
        Header: 'Manifest',
        accessor: 'manifest',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Strain',
        accessor: 'strain',
        className: ' pr3 justify-center',
        width: 120
      },
      {
        headerClassName: '',
        Header: 'Genome',
        accessor: 'genome',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: '% THC',
        accessor: 'thc',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: '% CBD',
        accessor: 'cbd',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Qty Sold',
        accessor: 'qty_sold',
        className: ' pr3 justify-center',
        width: 110
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
        Header: 'Price per unit',
        accessor: 'price_per_unit',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Total Price',
        accessor: 'total_price',
        className: ' pr3 justify-center',
        width: 110
      },
      {
        headerClassName: '',
        Header: 'Location',
        accessor: 'location',
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
        <div className="pv4">
          <img src={TempPackagesSoldWidgets} />
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
