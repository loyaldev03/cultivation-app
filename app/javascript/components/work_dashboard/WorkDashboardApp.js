import React from 'react'
import TodoList from './components/TodoList'
import DoneList from './components/DoneList'

class WorkDashboardApp extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <React.Fragment>
        <TodoList />
        <DoneList />
      </React.Fragment>
    )
  }
}

export default WorkDashboardApp
