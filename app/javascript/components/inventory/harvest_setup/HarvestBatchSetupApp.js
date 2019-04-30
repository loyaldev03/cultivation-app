import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import HarvestBatchEditor from './components/HarvestBatchEditor'

import harvestBatchStore from './store/HarvestBatchStore'
import loadHarvests from './actions/loadHarvests'

const columns = [
  {
    Header: 'Cultivation Batch Name',
    accessor: 'attributes.harvest_name',
    headerStyle: { textAlign: 'left' },
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
    Header: 'Strain',
    accessor: 'attributes.strain_name',
    headerStyle: { textAlign: 'left' },
    width: 160
  },

  {
    Header: 'Harvest Batch Name',
    accessor: 'attributes.cultivation_batch_name',
    headerStyle: { textAlign: 'left' }
  },
  {
    Header: '# of Plants',
    accessor: 'attributes.plant_count',
    headerStyle: { textAlign: 'right' },
    className: 'tc',
    width: 80
  },
  {
    Header: 'Locations',
    accessor: 'attributes.location',
    headerStyle: { textAlign: 'left' },
    width: 100
  },
  {
    Header: 'Harvest date',
    accessor: 'attributes.harvest_date',
    headerStyle: { textAlign: 'left' },
    width: 100,
    Cell: props => {
      if (props.value && props.value.length > 0) {
        const d = new Date(props.value)
        return (
          <span>{`${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`}</span>
        )
      } else {
        return ''
      }
    }
  },
  {
    Header: 'Total weight',
    accessor: 'attributes.total_wet_weight',
    headerStyle: { textAlign: 'right' },
    className: 'tr',
    width: 130
  },
  {
    Header: 'Status',
    accessor: 'attributes.status',
    headerStyle: { textAlign: 'left' },
    className: 'tl',
    width: 130
  }
]

function openSidebar(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class HarvestbatchSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadHarvests(this.props.facility_id)
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  render() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Harvest Batches</h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="btn btn--primary btn--small"
                onClick={this.openSidebar}
              >
                Add Harvest Batch
              </button>
            </div>
          </div>
          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={harvestBatchStore.bindableBatches}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6 -highlight"
          />
        </div>
        <HarvestBatchEditor
          cultivation_batches={this.props.cultivation_batches}
          uoms={this.props.uoms}
          facility_id={this.props.facility_id}
        />
      </React.Fragment>
    )
  }
}

export default HarvestbatchSetupApp
