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
        <StyledWorkPanel className="fl outline w-100 pa2 ma1" />
        {DailyTasksStore.editingPanel ? <StyledEditingPanel className="outline fixed w-40 bg-white"></StyledEditingPanel> : false}
      </React.Fragment>
    )
  }
}

const DateFormatted = ({ date }) => {
  const dateMoment = moment(date, "YYYY-MM-DD");
  const dateFormatted = dateMoment.format("ddd, D MMM YYYY");
  return (
    <h1 className="fl f4 outline w-100 pa2 ma1 bg-white lh-title">{dateFormatted}</h1>
  );
}

const EditingPanel = observer((allProps) => {
  const {className, ...props} = allProps
  return (
    <div className={`flex flex-column ${className}`} {...props}>
      <div className="w-100 tr pa2"><a href="#" onClick={() => { DailyTasksStore.editingPanel = null }}>X</a></div>
      <div className="w-100">
        {DailyTasksStore.editingPanel}
      </div>
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
