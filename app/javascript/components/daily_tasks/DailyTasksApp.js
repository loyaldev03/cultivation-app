import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'

import DailyTasksStore from './store/DailyTasksStore'
import { formatDate3 } from '../utils/DateHelper'
import Batch from './components/Batch'

@observer
class WorkDashboardApp extends React.Component {
  componentDidMount() {
    DailyTasksStore.dailyTasksByBatch = this.props.tasks_by_batch
    DailyTasksStore.date = this.props.date
    DailyTasksStore.inventoryCatalogue = this.props.inventory_catalogue
  }

  render() {
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <DateFormatted date={this.props.date} />

        <div className="f5 flex mt4">
          <div className="bg-white tab tab--active">To Dos</div>
          <div className="bg-black-5 tab">Issues</div>
        </div>
        <div className="bg-white box--shadow pa4 fl w-100">
          <div className="fl w-100 ma1">
            <div className="flex flex-column">
              {DailyTasksStore.dailyTasksByBatch.map((taskBatch, i) => (
                <Batch item={taskBatch} key={i} />
              ))}
            </div>
          </div>
        </div>

        {DailyTasksStore.editingPanel ? (
          <StyledEditingPanel className="b--light-gray bl bw1 fixed w-40 bg-white" />
        ) : (
          false
        )}
      </React.Fragment>
    )
  }
}

const DateFormatted = ({ date }) => {
  const dateFormatted = formatDate3(date)
  return (
    <h5 className="tl ph3 pv4 ma1 h5--font dark-grey ttc bg-white">
      {dateFormatted}
    </h5>
  )
}

const EditingPanel = observer(allProps => {
  const { className, ...props } = allProps
  return (
    <div className={className} {...props}>
      {DailyTasksStore.editingPanel}
    </div>
  )
})

const StyledEditingPanel = styled(EditingPanel)`
  top: 0;
  right: 0;
  height: 100%;
  min-width: 500px;
`

export default WorkDashboardApp
