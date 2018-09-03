import React from 'react'
import ReactTable from 'react-table'
import 'react-table/react-table.css'
import plantStore from '../store/PlantStore'
import { observer } from 'mobx-react'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'


// const columns = [
//   {
//     Header: 'Plant type',
//     headerClassName: 'tl pl3',
//     accessor: 'storage_type', // String-based value accessors!
//     Cell: props => (
//       <a
//         href="javascript:;"
//         className="ttc link"
//         onClick={e => editorSidebarHandler.open({ width: '500px' })}
//       >
//         {props.value}
//       </a>
//     )
//   },
//   {
//     Header: 'Stock count',
//     accessor: 'total_quantity',
//     headerClassName: 'tr pr3',
//     Cell: props => <div className="tr pr3">{props.value}</div> // Custom cell components!
//   },
//   {
//     Header: 'Stock intakes/ Batches',
//     accessor: 'intake_count',
//     headerClassName: 'tr pr3',
//     Cell: props => (
//       <div className="tr pr3">
//         <a
//           href="javascript:;"
//           className="ttc link"
//           onClick={e =>
//             alert('expands the row to show latest 5-9 stock intakes')
//           }
//         >
//           {props.value}
//         </a>
//       </div>
//     )
//   },
//   {
//     id: 'facility', // Required because our accessor is not a string
//     Header: 'Facility',
//     headerClassName: 'tl pl3',
//     accessor: 'facility'
//   }
// ]

const columns = [
  {
    Header: 'ID',
    accessor: 'id',
    show: false
  },
  {
    Header: 'Plant ID',
    accessor: 'attributes.serial_no',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Strain',
    accessor: 'attributes.item_name',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Growth stage',
    accessor: 'attributes.plant_status',
    headerStyle: { textAlign: 'left' },
    Cell: props => <span>{props.value.charAt(0).toUpperCase() + props.value.substr(1)}</span>
  },
  {
    Header: 'Planted On',
    accessor: 'attributes.planted_on',
    headerStyle: { textAlign: 'left' },
    Cell: props => {
      const d = new Date(props.value)
      return <span>{`${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`}</span> // Custom cell components!
    }
  },
  {
    Header: 'Location',
    accessor: 'attributes.location_name',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Cultivation batch',
    accessor: 'attributes.cultivation_batch_name',
    headerStyle: { textAlign: 'left' }
  },
]

@observer
class PlantList extends React.Component {
  render() {
    return (
      <div className="bg-white">
        <ReactTable
          columns={columns}
          pagination={{ position: 'top' }}
          data={plantStore.plants.slice()}
          showPagination={false}
          pageSize={50}
        />

        {/* <hr className="hr b--white mv3" /> */}
      </div>
    )
  }
}

export default PlantList