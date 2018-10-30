import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { format } from 'date-fns'

import DailyTasksStore from './store/DailyTasksStore'
import WorkDayEditor from './components/WorkDayEditor'
import WorkPanel from './components/WorkPanel'

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
        <StyledWorkPanel className="fl w-100 ma1" />
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
  const dateFormatted = format(date, 'ddd, D MMM YYYY')
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

const StyledWorkPanel = styled(WorkPanel)`
  min-width: 300px;
`

export default WorkDashboardApp
