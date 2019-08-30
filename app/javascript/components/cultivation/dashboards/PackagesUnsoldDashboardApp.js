import React, { memo, useState, lazy, Suspense } from 'react'
import { observer } from 'mobx-react'
import {
  CheckboxSelect,
  ListingTable,
  TempPackagesWidgets,
  HeaderFilter
} from '../../utils'
import uniq from 'lodash.uniq'

const dummyData = [
  {
    package: 'CAMPOS DE KUSH',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    order_id: '03/12/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'God Bud',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'SKUNKWORX PACKAGING',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    order_id: '11/12/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'GLASS VIAL WITH BLACK CHILD RESISTANT CAP',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'PHYTO ALASKAN',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '12/2/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Alaskan Thunder Fuck',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'CREAM OF THE CROP GARDENS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '21/6/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Do Si Dos',
    genome: 'indica',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'CANNASOL FARMS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '11/1/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Alaskan Thunder Fuck',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'ARTIZEN CANNABIS',
    package_id: 'PCK94457',
    group: 'kief',
    type: 'lb',
    order_id: '19/3/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Allen Wrench',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'LAUGHING MAN FARMS',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    order_id: '26/5/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Allen Wrench',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'CANNASOL FARMS',
    package_id: 'PCK94457',
    group: 'kief',
    type: 'lb',
    order_id: '18/9/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Allen Wrench',
    genome: 'sativa',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: '7 POINTS OREGON',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '10/11/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Cherry Pie',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'SPINACH CANNABIS',
    package_id: 'PCK94457',
    group: 'pre-rolls',
    type: 'lb',
    order_id: '11/12/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Dancehall',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'DOUBLE DUTCH FARMS',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    order_id: '26/3/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Dutch Treat',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'TKO RESERVE',
    package_id: 'PCK94457',
    group: 'leaves',
    type: 'lb',
    order_id: '29/1/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Gelato',
    genome: 'hyrbid',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
  },
  {
    package: 'LAZY BEE GARDENS',
    package_id: 'PCK94457',
    group: 'buds',
    type: 'lb',
    order_id: '11/4/2019',
    manifest: 'medical',
    use_type: 'medical',
    strain: 'Gelato',
    genome: 'hybrid',
    thc: '9%',
    cbd: '8%',
    total_net_weight: '',
    price_per_unit: '',
    total_price: '',
    location: ''
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
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Package ID',
        accessor: 'package_id',
        className: ''
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
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Package Date',
        accessor: 'order_id',
        className: ' pr3 justify-center'
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
        className: ' pr3 justify-center'
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
        className: ' pr3 justify-center'
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
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: '% THC',
        accessor: 'thc',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: '% CBD',
        accessor: 'cbd',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Qty',
        accessor: 'qty',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Total Net Weight',
        accessor: 'total_net_weight',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Price per unit ',
        accessor: 'price_per_unit',
        className: ' pr3 justify-center'
      },
      {
        headerClassName: '',
        Header: 'Total Est Revenue',
        accessor: 'total_price',
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
      <div className="pa4">
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
          <div className="flex">
            <a className="btn btn--primary ml2">Create new order</a>
            <a className="btn btn--primary ml2 mr2 ">Convert package</a>
            <CheckboxSelect options={columns} onChange={this.onToggleColumns} />
          </div>
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
