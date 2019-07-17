import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import store from './store/CultivationBatchStore'
import loadCultivationBatch from './actions/loadCultivationBatch'
import BatchEditor from './components/BatchEditor'

const columns = [
  {
    Header: 'Batch No',
    accessor: 'attributes.batch_no',
    headerClassName: 'tl',
    width: 70,
    Cell: record => (
      <a
        href="#0"
        className="link grey"
        onClick={event => {
          const data = toJS(record.original)
          openBatch(event, data)
        }}
      >
        {record.value}
      </a>
    )
  },
  {
    Header: 'Batch name',
    accessor: 'attributes.name',
    headerClassName: 'tl',
    Cell: record => (
      <a
        href="#0"
        className="link grey"
        onClick={event => {
          const data = toJS(record.original)
          openBatch(event, data)
        }}
      >
        {record.value}
      </a>
    )
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
  }
]

function openBatch(event, data) {
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

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  renderBatchList() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Cultivation Batches
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="btn btn--primary btn--small"
                onClick={this.onAddRecord}
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
            className="f6 -highlight"
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
