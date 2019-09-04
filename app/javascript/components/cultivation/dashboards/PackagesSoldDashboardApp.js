import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  TempPackagesSoldWidgets,
  TempPackagesHistory,
  HeaderFilter
} from '../../utils'
import uniq from 'lodash.uniq'
import classNames from 'classnames'

const dummyData = [
  {
    package: 'CAMPOS DE KUSH',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    status: 'Delivered',
    order_date: '03/12/2019',
    manifest: 'IS12345',
    strain: 'God Bud',
    order_id: 'ORD12333',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    qty_sold: '20',
    use_type: 'medical',
    total_net_weight: '230lbs',
    price_per_unit: '$200',
    total_price: '$20,000',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'SKUNKWORX PACKAGING',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    status: 'Delivered',
    order_date: '11/12/2019',
    manifest: 'IS12345',
    strain: 'GLASS VIAL WITH BLACK CHILD RESISTANT CAP',
    order_id: 'ORD12333',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    qty_sold: '12',
    use_type: 'medical',
    total_net_weight: '230lbs',
    price_per_unit: '$120',
    total_price: '$16,800',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'PHYTO ALASKAN',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    status: 'Delivered',
    order_date: '12/2/2019',
    manifest: 'IS12333',
    strain: 'Alaskan Thunder Fuck',
    order_id: 'ORD12333',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '18',
    use_type: 'medical',
    total_net_weight: '270lbs',
    price_per_unit: '$70',
    total_price: '$3500',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'CREAM OF THE CROP GARDENS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    status: 'Delivered',
    order_date: '21/6/2019',
    manifest: 'IS12333',
    strain: 'Do Si Dos',
    order_id: 'ORD12333',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    qty_sold: '28',
    use_type: 'medical',
    total_net_weight: '18lbs',
    price_per_unit: '$20',
    total_price: '$400',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'CANNASOL FARMS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    status: 'Delivered',
    order_date: '11/1/2019',
    manifest: 'IS12333',
    strain: 'Alaskan Thunder Fuck',
    order_id: 'ORD12333',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '19',
    use_type: 'medical',
    total_net_weight: '120lbs',
    price_per_unit: '$20',
    total_price: '$1,800',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'ARTIZEN CANNABIS',
    package_id: 'PCK94457',
    group: 'kief',
    type: 'lb',
    status: 'Delivered',
    order_date: '19/3/2019',
    manifest: 'IS12333',
    strain: 'Allen Wrench',
    order_id: 'ORD12333',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '10',
    use_type: 'medical',
    total_net_weight: '329lbs',
    price_per_unit: '$30',
    total_price: '$5,700',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'LAUGHING MAN FARMS',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    status: 'Delivered',
    order_date: '26/5/2019',
    manifest: 'IS12333',
    strain: 'Allen Wrench',
    order_id: 'ORD12333',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '10',
    use_type: 'medical',
    total_net_weight: '20lbs',
    price_per_unit: '$12',
    total_price: '$120',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'CANNASOL FARMS',
    package_id: 'PCK94457',
    group: 'kief',
    type: 'lb',
    status: 'Delivered',
    order_date: '18/9/2019',
    manifest: 'IS12333',
    strain: 'Allen Wrench',
    order_id: 'ORD12333',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    qty_sold: '12',
    use_type: 'medical',
    total_net_weight: '250lbs',
    price_per_unit: '$120',
    total_price: '$2,400',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: '7 POINTS OREGON',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    status: 'Delivered',
    order_date: '10/11/2019',
    manifest: 'IS12333',
    strain: 'Cherry Pie',
    order_id: 'ORD12333',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '25',
    use_type: 'medical',
    total_net_weight: '240lbs',
    price_per_unit: '$50',
    total_price: '$1700',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'SPINACH CANNABIS',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    status: 'Delivered',
    order_date: '11/12/2019',
    manifest: 'IS12333',
    strain: 'Dancehall',
    order_id: 'ORD12333',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '21',
    use_type: 'medical',
    total_net_weight: '90lbs',
    price_per_unit: '40',
    total_price: '$1,200',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'DOUBLE DUTCH FARMS',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    status: 'Delivered',
    order_date: '26/3/2019',
    manifest: 'IS12345',
    strain: 'Dutch Treat',
    order_id: 'ORD12333',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '33',
    use_type: 'IS12333',
    total_net_weight: '30lbs',
    price_per_unit: '40',
    total_price: '$2,000',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'TKO RESERVE',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    status: 'Delivered',
    order_date: '29/1/2019',
    manifest: 'IS12333',
    strain: 'Gelato',
    order_id: 'ORD12333',
    genome: 'hyrbid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '22',
    use_type: 'IS12333',
    total_net_weight: '90lbs',
    price_per_unit: '30',
    total_price: '$1,500',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  },
  {
    package: 'LAZY BEE GARDENS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    status: 'Delivered',
    order_date: '11/4/2019',
    manifest: 'IS12345',
    strain: 'Gelato',
    order_id: 'ORD12333',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    qty_sold: '14',
    use_type: 'medical',
    total_net_weight: '160lbs',
    price_per_unit: '70',
    total_price: '$6,300',
    fullfilment_date: '20/11/2019',
    location: 'Package Room'
  }
]

class PackageStore {
  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(dummyData.map(x => x[propName]).sort())
  }
}
const packageStore = new PackageStore()

@observer
class PackageDashboardApp extends React.Component {
  state = {
    columns: [
      {
        headerClassName: 'pl3 tl',
        Header: 'Package Name',
        accessor: 'package',
        className: 'dark-grey pl3 fw6',
        minWidth: 150
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Package Group"
            accessor="group"
            getOptions={packageStore.getUniqPropValues}
            onUpdate={packageStore.updateFilterOptions}
          />
        ),
        accessor: 'group',
        minWidth: 150
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Package Type"
            accessor="type"
            getOptions={packageStore.getUniqPropValues}
            onUpdate={packageStore.updateFilterOptions}
          />
        ),
        accessor: 'type',
        className: ' pr3 justify-center',
        width: 110
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
        Header: (
          <HeaderFilter
            title="Use Type"
            accessor="use_type"
            getOptions={packageStore.getUniqPropValues}
            onUpdate={packageStore.updateFilterOptions}
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
            title="Strain"
            accessor="strain"
            getOptions={packageStore.getUniqPropValues}
            onUpdate={packageStore.updateFilterOptions}
          />
        ),
        accessor: 'strain',
        className: ' pr3 justify-center',
        width: 120
      },
      {
        headerClassName: '',
        Header: (
          <HeaderFilter
            title="Genome Type"
            accessor="genome"
            getOptions={packageStore.getUniqPropValues}
            onUpdate={packageStore.updateFilterOptions}
          />
        ),
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
        Header: 'Total Revenue',
        accessor: 'total_price',
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
        Header: 'Order #',
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
        Header: (
          <HeaderFilter
            title="Status"
            accessor="status"
            getOptions={packageStore.getUniqPropValues}
            onUpdate={packageStore.updateFilterOptions}
          />
        ),
        accessor: 'status',
        className: ' pr3 justify-center',
        width: 110,
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
        Header: 'Fullfilment Date',
        accessor: 'fullfilment_date',
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
      <div className="pa4">
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
        <div className="pv4">
          <ListingTable
            data={dummyData}
            columns={columns}
            SubComponent={v => (
              <div style={{ padding: '10px' }}>
                <img src={TempPackagesHistory} />
              </div>
            )}
            // isLoading={BatchStore.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default PackageDashboardApp
