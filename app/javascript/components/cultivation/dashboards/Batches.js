import 'babel-polyfill'
import React, { memo, useState, lazy, Suspense } from 'react'
import ReactTable from 'react-table'
import { observer } from 'mobx-react'
import {
  TempBatchWidgets,
  ActiveBadge,
  Loading,
  formatDate2
} from '../../utils'
import store from '../batches/BatchStore'

const CheckboxSelect = ({ values = [], options = [] }) => {
  const [expand, setExpand] = useState(false)
  return (
    <div className="f6 dark-grey bg-white pointer ba b--black-30 br2 inline-flex items-center justify-between ph2 relative">
      <span className="w4">All Columns</span>
      <i
        className="material-icons md-16 pointer"
        onClick={() => setExpand(!expand)}
      >
        filter_list
      </i>
      {!expand && (
        <div className="absolute w5 top-2 shadow-3 right-0 z-1 bg-white mt2 ba br2 b--light-grey">
          <ul className="list pl0 mv2">
            <li className="flex pv2 ph3 justify-between items-center">
              <span>Option 1</span>
              <input type="checkbox" />
            </li>
            <li className="flex pv2 ph3 justify-between items-center">
              <span>Option 1</span>
              <input type="checkbox" />
            </li>
            <li className="flex pv2 ph3 justify-between items-center">
              Options 3
              <input type="checkbox" />
            </li>
            <li className="flex pv2 ph3 justify-between items-center">
              Options 4
              <input type="checkbox" />
            </li>
            <li className="flex pv2 ph3 justify-between items-center">
              Options 5
              <input type="checkbox" />
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

class BatchListTable extends React.PureComponent {
  render() {
    const columns = [
      { accessor: 'id', show: false },
      { accessor: 'batch_no', show: false },
      {
        headerClassName: 'tl',
        Header: 'Batch ID',
        accessor: 'name',
        className: 'dark-grey pl3 fw6',
        minWidth: 130,
        Cell: props => (
          <a
            className="link dark-grey"
            href={`/cultivation/batches/${props.row.id}`}
            title={props.row.batch_no}
          >
            {props.value}
          </a>
        )
      },
      {
        headerClassName: 'tl',
        Header: 'Status',
        accessor: 'status',
        className: 'justify-center',
        width: 88,
        Cell: props => <ActiveBadge status={props.value} />
      },
      {
        headerClassName: 'tl',
        Header: 'Strain',
        accessor: 'strain_name',
        minWidth: 120
      },
      {
        headerClassName: 'tl',
        Header: '# of plants',
        Header: () => (
          <React.Fragment>
            Total # of
            <br />
            plants
          </React.Fragment>
        ),
        accessor: 'quantity',
        className: 'justify-end pr3',
        width: 80,
        Cell: props => (props.value ? props.value : '--')
      },
      {
        headerClassName: 'tl',
        Header: () => (
          <React.Fragment>
            Growth
            <br />
            Phase
          </React.Fragment>
        ),
        accessor: 'current_growth_stage',
        className: 'justify-center ttc',
        width: 75
      },
      {
        headerClassName: 'tl',
        Header: () => (
          <React.Fragment>
            Destroyed
            <br />
            plants
          </React.Fragment>
        ),
        accessor: 'destroyed_plants_count',
        className: 'justify-center',
        width: 90,
        Cell: props => (props.value ? props.value : '--')
      },
      {
        headerClassName: 'tl',
        Header: 'Location',
        accessor: 'batch_no',
        minWidth: 110
      },
      {
        headerClassName: 'tl',
        Header: 'Start Date',
        accessor: 'start_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: 'Phase Date',
        accessor: 'start_date',
        className: 'justify-end pr3',
        width: 88,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: () => (
          <React.Fragment>
            Est. Harvest
            <br />
            Date
          </React.Fragment>
        ),
        accessor: 'estimated_harvest_date',
        className: 'justify-end pr3',
        width: 98,
        Cell: props => formatDate2(props.value)
      },
      {
        headerClassName: 'tl',
        Header: () => (
          <React.Fragment>
            # of days in
            <br />
            current stage
          </React.Fragment>
        ),
        accessor: 'batch_no',
        className: 'justify-end pr3',
        width: 100
      }
    ]
    const { data, isLoading } = this.props
    return (
      <ReactTable
        className="-highlight dashboard-theme"
        columns={columns}
        data={data}
        loading={isLoading}
        pageSize={20}
        minRows={3}
        showPagination={data && data.length > 20}
      />
    )
  }
}

@observer
class Batches extends React.Component {
  componentDidMount() {
    store.loadBatches()
  }
  render() {
    const { defaultFacilityId } = this.props
    return (
      <div className="pa4 mw1200">
        <div className="flex flex-row-reverse">
          <a
            href={`/cultivation/batches/new?facility_id=${defaultFacilityId}`}
            className="btn btn--primary"
          >
            Create new batch
          </a>
        </div>
        <div className="pv4">
          <img src={TempBatchWidgets} alt="Scan barcode" />
        </div>
        <div className="flex justify-between">
          <input
            type="text"
            className="input w5"
            placeholder="Search Batch ID"
            onChange={e => {
              store.filter = e.target.value
            }}
          />
          <CheckboxSelect options={[]} />
        </div>
        <div className="pv3">
          <BatchListTable
            data={store.filteredList}
            isLoading={store.isLoading}
          />
        </div>
      </div>
    )
  }
}

export default Batches
