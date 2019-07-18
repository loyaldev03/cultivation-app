import React from 'react'
import ReactTable from 'react-table'
import { observer } from 'mobx-react'

import PlantBatchStore from './PlantBatchStore'
import BatchHeader from '../cultivation/shared/BatchHeader'
import BatchTabs from '../cultivation/shared/BatchTabs'
import TaskStore from '../cultivation/tasks_setup/stores/NewTaskStore'
import { ListingTable } from '../utils'

@observer
class PlantBatchesApp extends React.Component {
  state = {
    columns: [
      { accessor: 'id', show: false },
      {
        Header: 'Lot #',
        accessor: 'lot_no',
        headerClassName: 'f6',
        className: 'tc',
        width: 80
      },
      {
        Header: 'Size',
        accessor: 'count',
        headerClassName: 'tr f6 pr3',
        className: 'tr pr3',
        width: 150
      },
      {
        Header: 'Strain Name',
        accessor: 'strain',
        headerClassName: 'tl f6',
        className: 'tl'
      },
      {
        Header: 'Metrc Tag',
        accessor: 'metrc_tag',
        headerClassName: 'tl f6',
        className: 'tl'
      }
    ]
  }

  componentDidMount() {
    if (!PlantBatchStore.isDataLoaded) {
      PlantBatchStore.loadPlantBatches(this.props.batchId)
    }
  }

  render() {
    const { batch } = this.props
    return (
      <div className="pa4 grey flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <BatchHeader
          {...batch}
          total_estimated_cost={batch.total_estimated_cost}
          total_estimated_hour={batch.total_estimated_hour}
        />
        <div className="flex justify-between">
          <BatchTabs
            batch={batch}
            currentTab="materials"
            unresolvedIssueCount={this.state.unresolvedIssueCount}
          />
        </div>
        <div className="pa4 flex flex-column justify-between bg-white box--shadow">
          <label className="pb2">Metrc Plant Batches</label>
          <ReactTable
            columns={this.state.columns}
            data={PlantBatchStore.filteredList}
            loading={PlantBatchStore.isLoading}
            minRows={3}
            showPagination={PlantBatchStore.filteredList.length > 20}
            defaultPageSize={20}
          />
        </div>
      </div>
    )
  }
}

export default PlantBatchesApp
