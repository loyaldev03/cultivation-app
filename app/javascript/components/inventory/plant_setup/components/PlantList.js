import React from 'react'
import ReactTable from 'react-table'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'

// const columns = [{
//   title: 'Name',
//   dataIndex: 'name',
//   key: 'name',
//   render: text => (<a href="javascript:;" onClick={(e) => editorSidebarHandler.open() }>{text}</a>),
// }, {
//   title: 'Age',
//   dataIndex: 'age',
//   key: 'age',
// }, {
//   title: 'Address',
//   dataIndex: 'address',
//   key: 'address',
// }]

const columns = [
  {
    Header: 'Plant type',
    accessor: 'storage_type', // String-based value accessors!
    Cell: props => (
      <a href="javascript:;" className="ttc link" onClick={e => editorSidebarHandler.open({ width: '500px'})}>
        {props.value}
      </a>
    )
  },
  {
    Header: 'Quantity',
    accessor: 'total_quantity',
    Cell: props => <span className="tr">{props.value}</span> // Custom cell components!
  },
  {
    id: 'facility', // Required because our accessor is not a string
    Header: 'Facility',
    accessor: 'facility'
  }
]

// const users = [
//   {
//     key: '1',
//     name: 'John Brown',
//     age: 32,
//     address: 'New York No. 1 Lake Park'
//   },
//   {
//     key: '2',
//     name: 'Jim Green',
//     age: 42,
//     address: 'London No. 1 Lake Park'
//   },
//   {
//     key: '3',
//     name: 'Joe Black',
//     age: 32,
//     address: 'Sidney No. 1 Lake Park'
//   }
// ]

// field :name, type: String
//     field :code, type: String # part no
//     field :desc, type: String
//     field :uom, type: String # unit of measure
//     field :storage_type, type: String  # plant (seed, mother, clone), harvest, sale item, consumable, others, waste }
//     field :strain, type: String

const plants = [
  {
    id: '1',
    storage_type: 'mother',
    type: 'Seed',
    total_quantity: 1000,
    facility: 'Farm 1'
  },
  {
    id: '2',
    storage_type: 'seed',
    type: 'Plant',
    total_quantity: 500,
    facility: 'Farm 1'
  },
  {
    id: '2',
    storage_type: 'clone',
    strain: 'OG Kush',
    type: 'Plant',
    total_quantity: 8000,
    facility: 'Farm 1'
  },
  {
    id: '2',
    storage_type: 'veg',
    strain: 'OG Kush',
    type: 'Plant',
    total_quantity: 16000,
    facility: 'Farm 1'
  },
  {
    id: '2',
    storage_type: 'harvest',
    strain: 'OG Kush',
    type: 'Plant',
    total_quantity: 16000,
    facility: 'Farm 1'
  },
  {
    id: '2',
    storage_type: 'flowers',
    strain: 'OG Kush',
    type: 'Plant',
    total_quantity: 1000,
    facility: 'Farm 1'
  }

]

export default class PlantList extends React.Component {
  render() {
    return (
      <div>
        <h1 className="f3 fw4 dib">OG Kush</h1>
        <ReactTable
          columns={columns}
          pagination={{ position: 'top' }}
          data={plants}
          showPagination={false}
          pageSize={5}
        />

        <hr className="hr b--white mv3" />

        <h1 className="f3 fw4 dib">OMango Kush</h1>
        <ReactTable
          columns={columns}
          pagination={{ position: 'top' }}
          data={plants}
          showPagination={false}
          pageSize={5}
        />
      </div>
    )
  }
}
