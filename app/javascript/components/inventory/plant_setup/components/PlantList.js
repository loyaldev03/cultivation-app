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
    Header: 'Name',
    accessor: 'name', // String-based value accessors!
    Cell: props => (
      <a href="javascript:;" onClick={e => editorSidebarHandler.open()}>
        {props.value}
      </a>
    )
  },
  {
    Header: 'Age',
    accessor: 'age',
    Cell: props => <span className="number">{props.value}</span> // Custom cell components!
  },
  {
    id: 'friendName', // Required because our accessor is not a string
    Header: 'Address',
    accessor: 'address'
  }
]

const users = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park'
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park'
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sidney No. 1 Lake Park'
  }
]

// field :name, type: String
//     field :code, type: String # part no
//     field :desc, type: String
//     field :uom, type: String # unit of measure
//     field :storage_type, type: String  # plant (seed, mother, clone), harvest, sale item, consumable, others, waste } 
//     field :strain, type: String

const plants = [
  {
    id: '1',
    storage_type: 'seed',
    strain: 'OG Kush',
    type: 'Seed',
    total_quantity: 1000,
    intakes: []
  },
  {
    id: '2',
    strain: 'OG Kush',
    type: 'Plant',
    total_quantity: 5000,
    intakes: []
  }
]

export default class PlantList extends React.Component {
  render() {
    return (
      <div>
        <ReactTable
          columns={columns}
          pagination={{ position: 'top' }}
          data={users}
        />
      </div>
    )
  }
}
