import React from 'react'
// import { observer } from 'mobx-react'
import HeaderRow from './components/HeaderRow'
import TaskRow from './components/TaskRow'

const tasks = [
  { id: 1, wbs: '1.1', task: 'Add nutrient', location: 'Clone Room A', status: 'not started', issueCount: 0 },
  { id: 2, wbs: '2.1', task: 'Clean', location: 'Clone Room A', status: 'not started', issueCount: 2 }
]

class DailyTaskApp extends React.Component {
  
  render() {
    return (
      <React.Fragment>
        <div className="flex items-end justify-start mb3">
          <h1 className="f3 ma0 pa0 black-90 fw6">Today</h1>
          <span className="f6 pv1 ph2 br2 ba b--black-20 black-60 bg-white ml2">Fri, 15 Feb 2019</span>
        </div>

        <div className="box--shadow bg-white pb3 mb4">
          <div className="ph3 pb3 pt4">
            <h3 className="f3 gray ma0 pa0 fw4">Batch Yoda</h3>
          </div>
          <HeaderRow />
          { tasks.map(x => (
            <TaskRow key={x.id} {...x} />
          ))}
        </div>

        <div className="box--shadow bg-white pb3 mb4">
          <div className="ph3 pb3 pt4">
            <h3 className="f3 gray ma0 pa0 fw4">Batch Jedi</h3>
          </div>
          <HeaderRow />
          { tasks.map(x => (
            <TaskRow key={x.id} {...x} />
          ))}
        </div>
      </React.Fragment>
    )
  }
}

export default DailyTaskApp