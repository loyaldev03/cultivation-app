import React from 'react'
import { observer } from 'mobx-react'
import styled from 'styled-components'

import TaskRow from './TaskRow'

const TasksList = observer(({ tasks }) => {
  return (
    <GridContainer>
      <HeaderRow />
      {tasks.map((task, i) => (
        <TaskRow dailyTask={task} index={i} key={i} />
      ))}
    </GridContainer>
  )
})

const HeaderRow = () => {
  const classes = 'pa2 bg-black-05 black-50 tc b'
  return (
    <React.Fragment>
      <div className={classes}>#</div>
      <div className={classes}>Issue</div>
      <div className={classes} style={{ textAlign: 'left' }}>
        Task Name
      </div>
      <div className={classes}>Start Date</div>
      <div className={classes}>End Date</div>
      <div className={classes}>Time Spent Today</div>
      <div className={classes}>Start/End</div>
      <div className={classes}>Status</div>
    </React.Fragment>
  )
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: 40px 80px auto 120px 120px 160px 150px 150px;
  grid-template-rows: auto;
`

export default TasksList
