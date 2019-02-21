import React from 'react'
// import { observer } from 'mobx-react'
import HeaderRow from './components/HeaderRow'
import TaskRow from './components/TaskRow'
import { SlidePanel } from '../utils/'

const tasks = [
  {
    id: 1,
    wbs: '1.1',
    task: 'Add nutrient',
    location: 'Clone Room A',
    status: 'not started',
    issueCount: 0
  },
  {
    id: 2,
    wbs: '2.1',
    task: 'Clean',
    location: 'Clone Room A',
    status: 'not started',
    issueCount: 2
  }
]

class DailyTaskApp extends React.Component {

  state = {
    showAddIssue: false,
    showAddMaterial: false,
    showAddNotes: false,
    currentTaskId: null
  }

  onToggleAddIssue = (taskId = null) => {
    console.log('on add issue')
    this.setState({ 
      showAddIssue: !this.state.showAddIssue,
      currentTaskId: taskId
    })
  }

  onToggleAddMaterial = (taskId = null) => {
    this.setState({ 
      showAddMaterial: !this.state.showAddMaterial,
      currentTaskId: taskId
    })
  }

  onToggleAddNotes = (taskId = null) => {
    this.setState({ 
      showAddNotes: !this.state.showAddNotes,
      currentTaskId: taskId 
    })
  }

  renderSlidePanel() {
    const { showAddMaterial, showAddIssue, showAddNotes } = this.state 
    return (
      <React.Fragment>
       
        <SlidePanel
          width="600px"
          show={showAddMaterial}
          renderBody={props => (
            <div>
              <h3>Add material here...</h3>
              <a href="#" onClick={event => { this.onToggleAddMaterial(); event.preventDefault() }}>Close</a>
            </div>
          )}
        />
        <SlidePanel
          width="600px"
          show={showAddIssue}
          renderBody={props => (
            <div>
              <h3>Add issue here...</h3>
              <a href="#" onClick={event => { this.onToggleAddIssue(); event.preventDefault() }}>Close</a>
            </div>
          )}
        />
        <SlidePanel
          width="600px"
          show={showAddNotes}
          renderBody={props => (
            <div>
              <h3>Add notes here...</h3>
              <a href="#" onClick={event => { this.onToggleAddNotes(); event.preventDefault() }}>Close</a>
            </div>
          )}
        />
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex items-end justify-start mb3">
          <h1 className="f3 ma0 pa0 black-90 fw6">Today</h1>
          <span className="f6 pv1 ph2 br2 ba b--black-20 black-60 bg-white ml2">
            Fri, 15 Feb 2019
          </span>
        </div>

        <div className="box--shadow bg-white pb3 mb4">
          <div className="ph3 pb3 pt4">
            <h3 className="f3 gray ma0 pa0 fw4">Batch Yoda</h3>
          </div>
          <HeaderRow/>
          {tasks.map(x => (
            <TaskRow 
              key={x.id} {
              ...x} 
              onToggleAddIssue={this.onToggleAddIssue} 
              onToggleAddMaterial={this.onToggleAddMaterial}
              onToggleAddNotes={this.onToggleAddNotes}
            />
          ))}
        </div>

        <div className="box--shadow bg-white pb3 mb4">
          <div className="ph3 pb3 pt4">
            <h3 className="f3 gray ma0 pa0 fw4">Batch Jedi</h3>
          </div>
          <HeaderRow />
          {tasks.map(x => (
            <TaskRow 
              key={x.id} 
              {...x} 
              onToggleAddIssue={this.onToggleAddIssue} 
              onToggleAddMaterial={this.onToggleAddMaterial}
              onToggleAddNotes={this.onToggleAddNotes}
            />
          ))}
        </div>
        { this.renderSlidePanel() }
      </React.Fragment>
    )
  }
}

export default DailyTaskApp
