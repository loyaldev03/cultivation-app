import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import store from './store/CultivationBatchStore'
import loadCultivationBatch from './actions/loadCultivationBatch'
import BatchEditor from './components/BatchEditor'

const columns = [
  {
    Header: '',
    accessor: 'attributes.is_active',
    filterable: false,
    width: 30,
    Cell: props => {
      let color = 'red'
      if (props.value === true) {
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
    Header: 'Batch No',
    accessor: 'attributes.batch_no',
    headerClassName: 'tl',
    width: 70
  },
  {
    Header: 'Batch name',
    accessor: 'attributes.name',
    headerClassName: 'tl'
  },
  {
    Header: 'Start date',
    accessor: 'attributes.start_date',
    headerClassName: 'tc',
    className: 'tc',
    Cell: props => {
      return <span>{new Date(props.value).toLocaleDateString()}</span>
    }
  },
  {
    Header: 'Phase',
    accessor: 'attributes.current_growth_stage',
    headerClassName: 'tc',
    className: 'tc',
    width: 80
  },
  {
    Header: 'Plant Count',
    accessor: 'attributes.plant_count',
    headerClassName: 'tc',
    className: 'tc',
    width: 100
  },
  {
    Header: 'Batch Source',
    accessor: 'attributes.batch_source',
    headerClassName: 'tl',
    Cell: props => {
      if (props.value) {
        return (
          <span>
            {props.value.charAt(0).toUpperCase() + props.value.substr(1)}
          </span>
        )
      }
      return null
    }
  },
  {
    Header: 'Facility',
    accessor: 'attributes.facility',
    headerClassName: 'tl'
  },
  {
    Header: '',
    className: 'tc',
    filterable: false,
    maxWidth: 45,
    Cell: record => (
      <a
        href="#"
        onClick={event => {
          const data = toJS(record.original)
          openBatch(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openBatch(event, data) {
  console.log(data)
  window.editorSidebar.open({ width: '500px', data })
  event.preventDefault()
}

@observer
class SimpleCultivationBatchSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadCultivationBatch()
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onAddBatch = () => {
    this.openSidebar()
  }

  renderBatchList() {
    return (
      <React.Fragment>
        <div className="w-80 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Cultivation Batches
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttc tracked link dim f6 fw6 pointer"
                onClick={this.onAddBatch}
              >
                Add batch
              </button>
            </div>
          </div>

          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={store.bindableBatches}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6"
            showPagination={store.bindableBatches.length > 30}
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderBatchList()}
        <BatchEditor
          facility_strains={this.props.facility_strains}
          batch_sources={this.props.batch_sources}
          grow_methods={this.props.grow_methods}
        />
      </React.Fragment>
    )
  }
}

export default SimpleCultivationBatchSetupApp
