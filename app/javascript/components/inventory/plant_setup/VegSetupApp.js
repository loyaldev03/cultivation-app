import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import PlantEditor from './components/editor/PlantEditor'
import plantStore from './store/PlantStore'
import loadPlants from './actions/loadPlants'

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
    accessor: 'attributes.plant_id',
    headerStyle: { textAlign: 'left' },
    width: 180,
    Cell: x => (
      <a
        href="#0"
        className="link grey"
        onClick={event => openSidebar(event, x.original.id)}
      >
        {x.value}
      </a>
    )
  },
  {
    Header: 'Batch',
    accessor: 'attributes.cultivation_batch',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: 'Strain',
    accessor: 'attributes.strain_name',
    headerStyle: { textAlign: 'left' },
    width: 180
  },
  {
    Header: 'Clone date',
    accessor: 'attributes.planting_date',
    headerStyle: { textAlign: 'left' },
    width: 100,
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
    headerStyle: { textAlign: 'left' },
    width: 180
  }
]

function openSidebar(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class VegSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadPlants('veg', '', this.props.facility_id)
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  render() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Vegs</h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="btn btn--primary btn--small"
                onClick={this.openSidebar}
              >
                Add vegs
              </button>
            </div>
          </div>

          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={plantStore.bindablePlants}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6 -highlight"
            showPagination={plantStore.bindablePlants.length > 30}
          />
        </div>
        <PlantEditor
          growth_stage="veg"
          cultivation_batches={this.props.cultivation_batches}
          scanditLicense={this.props.scanditLicense}
          facility_id={this.props.facility_id}
        />
      </React.Fragment>
    )
  }
}

export default VegSetupApp
