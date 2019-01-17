import React from 'react'
import { render } from 'react-dom'

import { observable, toJS } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { formatDate2, addDayToDate } from '../../utils'

import TaskStore from '../tasks_setup/stores/NewTaskStore'
import ReactGantt from './ReactGantt'
import { Manager, Reference, Popper, Arrow } from 'react-popper'
import classNames from 'classnames'

const styles = `
path.handle-arrow {
  cursor: pointer;
}
path.handle-arrow.on {
  stroke: red;
}
path.arrow{
  display: none;
}
line.line{
  stroke-width: 2.4;
}

.bar-group .bar{
  fill: #039be5;
}

circle.handle.mid {
  fill: transparent;
    cursor: pointer;
    opacity: initial;
    visibility: visible;
    -webkit-transition: opacity .3s ease;
    transition: opacity .3s ease;
}

circle.handle.mid:hover {
  fill: #666;
}

.rt-tr-group:hover{
  box-shadow: 0 0 4px 0 rgba(0,0,0,.14), 0 3px 4px 0 rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2);
}

.rt-tr-group:hover .button-dropdown{
  display: block;
}
.button-dropdown{
  display: none;
  font-size: 16px;
}

.gantt-list:nth-child(odd) {
  height: 38px;
}
.gantt-list:nth-child(even):not(:nth-child(2)) {
  height: 38px;
}
.gantt-list:nth-child(2){
  height: 38px;
}
.table-dropdown {
  box-shadow: 0 3px 10px 0 #00000087;
  top: initial;
  min-width: 200px;
}
.table-dropdown a:hover{
  background-color: #eee;
}

`

@observer
class GanttChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewMode: 'Day',
      collapseIds: [],
      updateTask: true
    }
  }

  changeView = view => {
    this.setState({
      viewMode: view
    })
  }

  onClickTask = task => {
    const bar = document.querySelector(`g[data-id="${task.id}"]`)
    const position = bar.getBBox()
    let el = document.querySelector('.gantt-container')
    el.scrollLeft = position.x - 400
    el.scrollTop = position.top
  }

  handleDropdown = id => {
    this.setState({ idOpen: id })
  }

  handleMouseLeave = row => {
    this.setState(prevState => ({
      idOpen: null
    }))
  }

  onDateChange = async task => {
    let el = document.querySelector('.gantt-container')
    let scrollLeft = el.scrollLeft
    let scrollTop = el.scrollTop
    await TaskStore.updateTask(this.props.batch_id, task)
    el.scrollLeft = scrollLeft
    el.scrollTop = scrollTop
  }

  onLoad = e => {
    console.log('gantt chart loaded ')

    const headers = Array.prototype.slice.call(
      document.querySelectorAll('.rt-tr-group')
    )

    headers.forEach((header, i) => {
      const enableDrag = header.querySelector('.draggable')
      // if (enableDrag) {
      header.setAttribute('draggable', true)
      //the dragged header
      header.ondragstart = e => {
        e.stopPropagation()
        this.dragged = i
      }

      header.ondrag = e => e.stopPropagation

      header.ondragend = e => {
        e.stopPropagation()
        setTimeout(() => (this.dragged = null), 300)
      }

      //the dropped header
      header.ondragover = e => {
        e.preventDefault()
      }

      header.ondragenter = e => {}

      header.ondragleave = e => {}

      header.ondrop = async e => {
        e.preventDefault()
        // e.target.closest('.rt-tr-group').style.borderBottomColor = ''
        if (this.dragged !== null && i !== null) {
          let el = document.querySelector('.gantt-container')
          const scrollLeft = el.scrollLeft
          const scrollTop = el.scrollTop
          await TaskStore.updateTaskPosition(
            this.props.batch_id,
            TaskStore.taskList[this.dragged].id,
            TaskStore.taskList[i].id
          )
          el.scrollLeft = scrollLeft
          el.scrollTop = scrollTop
          console.log('fix the scroll')
        }
      }
      // }
    })
  }

  onDragRelationShip = async (destination_id, source_id) => {
    let el = document.querySelector('.gantt-container')
    let scrollLeft = el.scrollLeft
    let scrollTop = el.scrollTop

    await TaskStore.updateDependency(
      this.props.batch_id,
      destination_id,
      source_id
    )
    el.scrollLeft = scrollLeft
    el.scrollTop = scrollTop
  }

  onDeleteRelationship = async (destination_id, source_id) => {
    if (confirm('Are you sure you want to delete this relationship? ')) {
      await TaskStore.deleteRelationship(this.props.batch_id, destination_id)
    }
  }

  render() {
    return (
      <React.Fragment>
        <style>{styles}</style>
        {TaskStore.isDataLoaded && (
          <div className="flex">
            <div className="w-30 bt br bl b--black-10">
              <table className="collapse pv2 ph3 f6 w-100 mb2">
                <tbody>
                  <tr style={{ height: 3.6 + 'rem' }}>
                    <th className=" gray bb b--black-10 fw6 f6" width="10">
                      WBS
                    </th>
                    <th className=" gray bb b--black-10 fw6 f6">Name</th>
                  </tr>
                  {TaskStore.taskList.map((task, i) => (
                    <tr
                      className="pointer rt-tr-group gantt-list"
                      key={task.id}
                      onClick={e => this.onClickTask(task)}
                    >
                      <td className="pv2 ph3 dark-grey tl ttc">{task.wbs}</td>
                      <td className="pv2 ph3 dark-grey tl ttc">
                        <div className="flex justify-between-ns">
                          <span
                            className={classNames(
                              `dib flex items-center indent--${task.indent}`,
                              {
                                orange: TaskStore.hasChildNode(task.wbs)
                              }
                            )}
                          >
                            {TaskStore.hasChildNode(task.wbs) && (
                              <i
                                className="material-icons dim grey f7 pointer"
                                style={{ fontSize: 16 + 'px' }}
                                onClick={e =>
                                  TaskStore.toggleCollapseNode(task.wbs)
                                }
                              >
                                {TaskStore.isCollapsed(task.wbs)
                                  ? 'arrow_right'
                                  : 'arrow_drop_down'}
                              </i>
                            )}
                            {task.name.substring(0, 20)}
                          </span>

                          <Manager>
                            <Reference>
                              {({ ref }) => (
                                <i
                                  ref={ref}
                                  id={task.id}
                                  onClick={e => this.handleDropdown(task.id)}
                                  className="material-icons ml2 pointer button-dropdown"
                                >
                                  more_horiz
                                </i>
                              )}
                            </Reference>
                            {this.state.idOpen === task.id && (
                              <Popper
                                placement="bottom"
                                style={{ borderColor: 'red' }}
                              >
                                {({ ref, style, placement, arrowProps }) => (
                                  <div
                                    ref={ref}
                                    id={'dropdown-' + task.id}
                                    style={style}
                                    data-placement={placement}
                                  >
                                    <div
                                      id="myDropdown"
                                      onMouseLeave={this.handleMouseLeave}
                                      className="table-dropdown dropdown-content box--shadow-header show"
                                    >
                                      <a
                                        className="ttc pv2 tc flex pointer"
                                        style={{ display: 'flex' }}
                                        // onClick={e => {
                                        //   handleIndent(row, 'in')
                                        // }}
                                      >
                                        <i className="material-icons md-600 md-17 ph2">
                                          format_indent_increase
                                        </i>
                                        Indent In
                                      </a>
                                      <a
                                        className="ttc pv2 tc flex pointer"
                                        style={{ display: 'flex' }}
                                        // onClick={e => {
                                        //   handleIndent(row, 'out')
                                        // }}
                                      >
                                        <i className="material-icons md-600 md-17 ph2">
                                          format_indent_decrease
                                        </i>
                                        Indent Out
                                      </a>
                                      {task.is_phase !== true && (
                                        <a
                                          className="ttc pv2 tc flex pointer"
                                          style={{ display: 'flex' }}
                                          // onClick={e => {
                                          //   handleAddTask(row, 'top')
                                          // }}
                                        >
                                          <i className="material-icons md-600 md-17 ph2">
                                            vertical_align_top
                                          </i>
                                          Insert Task Above
                                        </a>
                                      )}

                                      <a
                                        className="ttc pv2 tc flex pointer"
                                        style={{ display: 'flex' }}
                                        // onClick={e => {
                                        //   handleAddTask(row, 'bottom')
                                        // }}
                                      >
                                        <i className="material-icons md-600 md-17 ph2">
                                          vertical_align_bottom
                                        </i>
                                        Insert Task Below
                                      </a>
                                      <a
                                        className="ttc pv2 tc flex pointer"
                                        style={{ display: 'flex' }}
                                        // onClick={e => {
                                        //   handleEdit(row)
                                        // }}
                                      >
                                        <i className="material-icons md-600 md-17 ph2">
                                          edit
                                        </i>
                                        Edit
                                      </a>
                                      <a
                                        className="ttc pv2 tc flex pointer"
                                        style={{ display: 'flex' }}
                                        // onClick={e => {
                                        //   handleDelete(row)
                                        // }}
                                      >
                                        <i className="material-icons md-600 md-17 ph2">
                                          delete_outline
                                        </i>
                                        Delete
                                      </a>
                                    </div>
                                    <div
                                      ref={arrowProps.ref}
                                      style={arrowProps.style}
                                    />
                                  </div>
                                )}
                              </Popper>
                            )}
                          </Manager>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="w-70">
              <ReactGantt
                tasks={TaskStore.getGanttTasks()}
                viewMode={this.state.viewMode}
                // onClick={this._func}
                onLoad={this.onLoad}
                onDragRelationShip={this.onDragRelationShip}
                onDateChange={this.onDateChange}
                onDeleteRelationship={this.onDeleteRelationship}
                // onProgressChange={this._func}
                // onViewChange={this._func}
                // customPopupHtml={this._html_func}
              />
            </div>
          </div>
        )}
        {!TaskStore.isDataLoaded && <div className="grey"> Loading...</div>}
      </React.Fragment>
    )
  }
}

export default GanttChart
