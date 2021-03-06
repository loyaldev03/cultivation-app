import React, { useEffect } from 'react'
import workerScheduleStore from './stores/WorkerScheduleStore'
import { Manager, Reference, Popper } from 'react-popper'

export default class TaskPopper extends React.Component {
  state = {
    isOpen: false,
    taskList: []
  }
  togglePopper = () => {
    const { isOpen } = this.state
    this.setState({ isOpen: !isOpen })
  }
  falsifyPopper = () => {
    this.setState({ isOpen: false })
  }
  getTaskTheDay = async date => {}
  componentWillMount = async () => {
    document.addEventListener('mousedown', this.falsifyPopper)
    this.setState({
      taskList: await workerScheduleStore.getTaskByDate(this.props.date)
    })
  }
  componentWillUnmout = () => {
    document.removeEventListener('mousedown', this.falsifyPopper)
  }
  render() {
    const { isOpen, taskList } = this.state
    const { numberOfTask } = this.props
    const label = numberOfTask && numberOfTask > 1 ? 'Tasks' : 'Task'
    return (
      <Manager>
        <Reference>
          {({ ref }) => (
            <div className="b pointer" onClick={this.togglePopper} ref={ref}>
              {numberOfTask} {label}
            </div>
          )}
        </Reference>
        {isOpen && (
          <Popper placement="left">
            {({ ref, style, placement, arrowProps }) => (
              <div
                className="bg-white gray ba b--silver w5 pa3 o-100 tl mr1"
                ref={ref}
                style={style}
                data-placement={placement}
              >
                <h4 className="ma0 mb1">Tasks</h4>
                {taskList &&
                  taskList.map(task => (
                    <div key={task.id}>
                      <div className="flex justify-between grey">
                        <span>
                          {task.attributes.name}
                          <div className="f6 lh-copy">
                            {task.attributes.location_name}
                          </div>
                        </span>
                        <span>
                          {task.attributes.work_status === 'not_started' && (
                            <i className="orange material-icons pointer md-36 dim">
                              play_circle_filled
                            </i>
                          )}
                        </span>
                      </div>
                    </div>
                  ))}
                <div ref={arrowProps.ref} style={arrowProps.style} />
              </div>
            )}
          </Popper>
        )}
      </Manager>
    )
    // <div className="b pointer"></div>
  }
}
