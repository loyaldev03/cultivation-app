import React from 'react'
import styled from 'styled-components'
import { observer } from 'mobx-react'
import { toJS } from 'mobx'
import moment from 'moment'

import DailyTasksStore from './store/DailyTasksStore'
import WorkDayEditor from './components/WorkDayEditor'
import WorkPanel from './components/WorkPanel'

@observer
class WorkDashboardApp extends React.Component {
  componentDidMount() {
    DailyTasksStore.dailyTasksByBatch = this.props.tasks_by_batch
    DailyTasksStore.date = this.props.date
  }

  render() {
    return (
      <React.Fragment>
        <DateFormatted date={this.props.date}></DateFormatted>
        <StyledWorkPanel className="fl w-100 ma1" />
        {DailyTasksStore.editingPanel ? <StyledEditingPanel className="outline fixed w-40 bg-white"></StyledEditingPanel> : false}
      </React.Fragment>
    )
  }
}

const DateFormatted = ({ date }) => {
  const dateMoment = moment(date, "YYYY-MM-DD");
  const dateFormatted = dateMoment.format("ddd, D MMM YYYY");
  return (
    <h5 className="tl ph3 pv4 ma1 h5--font dark-grey ttc bg-white">{dateFormatted}</h5>
  );
}

const EditingPanel = observer((allProps) => {
  const {className, ...props} = allProps
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

const NoTasksSelected = () => (
  <div className="outline w-50 tc pa2">
    There are no tasks selected.<br />
    Perhaps you want to try select a task on the left?
  </div>
)


const StyledWorkPanel = styled(WorkPanel)`
  min-width: 300px;
`

const StyledNoTasksSelected = styled(NoTasksSelected)`
  min-width: 300px;
`

export default WorkDashboardApp
