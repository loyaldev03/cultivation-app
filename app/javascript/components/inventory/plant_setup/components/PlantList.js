import React from 'react'
import ReactTable from 'react-table'
import plantStore from '../store/PlantStore'
import { observer } from 'mobx-react'

const columns = [
  {
    Header: '',
    accessor: 'attributes.status',
    filterable: false,
    width: 30,
    Cell: props => {
      let color = 'red'
      if (props.value === 'available') {
        color = '#00cc77'
      }
      return (
        <div className="flex justify-center items-center h-100">
          <span
            style={{
              width: '8px',
              height: '8px',
              color: 'green',
              borderRadius: '50%',
              backgroundColor: color
            }}
          />
        </div>
      )
    }
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
    Cell: props => (
      <span>{props.value.charAt(0).toUpperCase() + props.value.substr(1)}</span>
    )
  },
  {
    Header: 'Planted On',
    accessor: 'attributes.planted_on',
    headerStyle: { textAlign: 'left' },
    Cell: props => {
      const d = new Date(props.value)
      if (props.value || props.value.length > 0) {
        return (
          <span>{`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`}</span>
        )
      } else {
        return ''
      }
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
  }
]

@observer
class PlantList extends React.Component {
  render() {
    return (
      <ReactTable
        columns={columns}
        pagination={{ position: 'top' }}
        data={plantStore.plants.slice()}
        showPagination={false}
        pageSize={30}
        minRows={30}
        filterable
        className="f6"
        showPagination={plantStore.plants.length > 30}
      />
    )
  }
}

export default PlantList
