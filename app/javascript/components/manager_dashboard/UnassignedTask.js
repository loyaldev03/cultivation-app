import React from 'react'
import ChartStore from './ChartStore'
import { observer } from 'mobx-react'
import { formatDate } from '../utils/DateHelper'
import isEmpty from 'lodash.isempty'
import { Loading, NoData } from '../utils'

const DataTaskList = ({idx, name, batch_name, start_date, end_date}) => {
  return (
    <div className="flex grey tl mb3" key={idx}>
      <div className="fl w-60">
        <span className="f5">{name}</span>
        <br />
        <span className="f7 mt1 b">{batch_name}</span>
      </div>
      <div className="fl f5 w-20">{formatDate(start_date)}</div>
      <div className="fl f5 w-20">{formatDate(end_date)}</div>
    </div>
  )
}

@observer
export default class UnassignedTask extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <h3 className="f5 fw6 dark-grey">Unassigned Task</h3>
        <div className="overflow-y-scroll" style={{ height: '310px' }}>
          {ChartStore.unassigned_task_loaded ? (
            !isEmpty(ChartStore.data_unassigned_task) ? (
              <React.Fragment>
                <div className="flex mb2 grey b tl">
                  <div className="fl w-60">Task Name</div>
                  <div className="fl w-20">Start Date</div>
                  <div className="fl w-20">End Date</div>
                </div>
                {ChartStore.data_unassigned_task.map((e, y) => (
                  <DataTaskList
                    key={`${y}-${e.name}`}
                    idx={y}
                    name={e.name}
                    batch_name={e.batch_name}
                    start_date={e.start_date}
                    end_date={e.end_date}
                  />
                ))}
              </React.Fragment>
            ) : (
              <NoData />
            )
          ) : (
            <Loading />
          )}
        </div>
      </React.Fragment>
    )
  }
}
