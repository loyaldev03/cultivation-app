import React, { lazy, Suspense } from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { Manager, Reference, Popper, Arrow } from 'react-popper'
import TaskStore from '../stores/NewTaskStore'
import UserStore from '../stores/NewUserStore'
import TaskEditor from './TaskEditor'
import InlineEditTaskNameField from './InlineEditTaskNameField'
import InlineEditTextField from './InlineEditTextField'
import InlineEditNumberField from './InlineEditNumberField'
import InlineEditDateField from './InlineEditDateField'
import Avatar from '../../../utils/Avatar'
import { formatDate2, moneyFormatter, SlidePanel } from '../../../utils'

const ReactTable = lazy(() => import('react-table'))
const AssignResourceForm = lazy(() => import('./AssignResourceForm'))
const AssignMaterialForm = lazy(() => import('./MaterialForm'))
const CultivationCalendar = lazy(() => import('./CultivationCalendar'))

const MenuButton = ({ icon, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      <i className="material-icons md-17 pr2">{icon}</i>
      <span className="pr2">{text}</span>
    </a>
  )
}

@observer
class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.dragged = null
    this.state = {
      isOpen: false,
      showTaskEditor: false,
      showStartDateCalendar: false,
      showAssignResourcePanel: false,
      showAssignMaterialPanel: false
    }
  }

  componentDidMount() {
    UserStore.loadUsers(this.props.batch.facility_id)
    // need to find after data react-table is loaded callback
    setTimeout(() => this.mountEvents(), 1000)
  }

  closeSidebar = () => {
    window.editorSidebar.close()
  }

  handleEllipsisClick = taskId => e => {
    this.setState({ idOpen: taskId, taskSelected: taskId })
  }

  handleMouseLeave = row => {
    this.clearDropdown()
  }

  handleIndent = (taskId, indentAction) => {
    this.clearDropdown()
    TaskStore.updateTaskIndent(this.props.batch.id, taskId, indentAction)
  }

  handleShowSidebar = taskId => {
    let error_container = document.getElementById('error-container')
    if (error_container) {
      error_container.style.display = 'none'
    }
    this.setState({
      taskSelected: taskId,
      taskAction: 'update',
      showTaskEditor: true
    })
    this.clearDropdown()
  }

  handleShowAssignForm = (taskId, users) => {
    this.assignResouceForm.setSelectedUsers(users)
    this.setState({
      taskSelected: taskId,
      showAssignResourcePanel: !this.state.showAssignResourcePanel
    })
  }

  handleShowMaterialForm = (taskId, items) => {
    const task = TaskStore.getTaskById(taskId)

    this.assignMaterialForm.setSelectedItems(
      this.props.batch.id,
      task,
      taskId,
      items
    )
    this.setState({
      taskSelected: taskId,
      showAssignMaterialPanel: !this.state.showAssignMaterialPanel
    })
  }

  handleAddTask = (taskId, action) => {
    this.setState({
      taskAction: action,
      taskSelected: taskId,
      showTaskEditor: true
    })
  }

  handleDelete = async row => {
    if (confirm('Are you sure you want to delete this task? ')) {
      await TaskStore.deleteTask(this.props.batch.id, row.row.id)
    }
  }

  clearDropdown() {
    this.setState({ idOpen: null })
  }

  renderDateColumn = field => data => {
    return formatDate2(data.row[field])
  }

  renderTaskNameColumn = data => {
    const { id, wbs, indent, issues } = data.row
    const batchId = this.props.batch.id
    const hasChild = TaskStore.hasChildNode(wbs)
    const isCollapsed = TaskStore.isCollapsed(wbs)
    return (
      <div className="flex flex-auto justify-between items-center h-100 hide-child">
        <InlineEditTaskNameField
          text={data.value}
          issues={issues}
          indent={indent}
          hasChild={hasChild}
          isCollapsed={isCollapsed}
          onCollapseClick={() => TaskStore.toggleCollapseNode(wbs)}
          onClick={e => this.handleShowSidebar(id)}
          onHighlight={() => this.setState({ taskSelected: id })}
          onDoneClick={value => {
            TaskStore.editTask(batchId, id, { name: value })
          }}
        />
        <Manager>
          <Reference>
            {({ ref }) => {
              return (
                <i
                  ref={ref}
                  onClick={this.handleEllipsisClick(id)}
                  className={classNames('pointer material-icons', {
                    'show-on-hover': this.state.taskSelected !== id
                  })}
                >
                  more_horiz
                </i>
              )
            }}
          </Reference>
          {this.state.idOpen === id && (
            <Popper placement="bottom-start">
              {({ ref, style, placement, arrowProps }) => (
                <div
                  ref={ref}
                  style={style}
                  data-placement={placement}
                  className="bg-white f6 flex"
                >
                  <div
                    className="db shadow-4"
                    onMouseLeave={this.handleMouseLeave}
                  >
                    <MenuButton
                      icon="format_indent_increase"
                      text="Indent In"
                      onClick={e => this.handleIndent(id, 'in')}
                    />
                    <MenuButton
                      icon="format_indent_decrease"
                      text="Indent Out"
                      onClick={e => this.handleIndent(id, 'out')}
                    />
                    <MenuButton
                      icon="vertical_align_top"
                      text="Insert Task Above"
                      onClick={e => this.handleAddTask(id, 'add-above')}
                    />
                    <MenuButton
                      icon="vertical_align_bottom"
                      text="Insert Task Below"
                      onClick={e => this.handleAddTask(id, 'add-below')}
                    />
                    <MenuButton
                      icon="edit"
                      text="Edit Task Details"
                      onClick={e => this.handleShowSidebar(id)}
                    />
                    <MenuButton
                      icon="delete_outline"
                      text="Delete Task"
                      className="red"
                      onClick={e => this.handleDelete(data)}
                    />
                  </div>
                  <div ref={arrowProps.ref} style={arrowProps.style} />
                </div>
              )}
            </Popper>
          )}
        </Manager>
      </div>
    )
  }

  handleReset = () => {
    this.setState({ taskSelected: '', taskRelatedPosition: '' })
  }

  onDragStart = index => e => {
    this.dragged = index
  }

  onDragEnd = e => {
    setTimeout(() => (this.dragged = null), 0)
  }

  onDragOver = e => {
    e.preventDefault()
  }

  onDragEnter = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  onDragLeave = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  onDragDrop = index => async e => {
    e.preventDefault()
    // e.target.closest('.rt-tr').classList.remove('bb', 'b--orange')
    if (this.dragged !== null && index !== null) {
      await TaskStore.updateTaskPosition(
        this.props.batch.id,
        TaskStore.taskList[this.dragged].id,
        TaskStore.taskList[index].id
      )
    }
  }

  mountEvents() {
    const headers = Array.prototype.slice.call(
      document.querySelectorAll('.rt-tr-group')
    )

    headers.forEach((header, index) => {
      const enableDrag = header.querySelector("div[draggable='true']")
      if (enableDrag) {
        //the dragged header
        // header.ondrag = e => e.stopPropagation
        header.ondragstart = this.onDragStart(index)
        header.ondragend = this.onDragEnd
        header.ondragover = this.onDragOver
        header.ondragenter = this.onDragEnter
        header.ondragleave = this.onDragLeave
        header.ondrop = this.onDragDrop(index)
      }
    })
  }

  checkVisibility = value => {
    return this.props.columns.includes(value)
  }

  columnsConfig = batchId => [
    {
      accessor: 'id',
      show: false
    },
    {
      accessor: 'issues',
      show: false
    },
    {
      accessor: 'haveChildren',
      show: false
    },
    {
      accessor: 'indent',
      show: false
    },
    {
      Header: 'WBS',
      accessor: 'wbs',
      headerClassName: 'f6',
      width: '85',
      show: this.checkVisibility('wbs')
    },
    {
      Header: 'Tasks',
      accessor: 'name',
      headerClassName: 'f6',
      maxWidth: '400',
      show: this.checkVisibility('name'),
      Cell: this.renderTaskNameColumn
    },
    {
      Header: 'Predecessor',
      accessor: 'depend_on',
      headerClassName: 'f6',
      width: '85',
      show: this.checkVisibility('depend_on'),
      Cell: data => {
        const { id, depend_on } = data.row
        let taskWbs = ''
        if (depend_on) {
          const dependOnTask = TaskStore.getTaskById(depend_on)
          taskWbs = dependOnTask ? dependOnTask.wbs : ''
        }
        return (
          <InlineEditTextField
            text={taskWbs}
            onHighlight={() => this.setState({ taskSelected: id })}
            onDoneClick={value => {
              const selectedTask = TaskStore.getTaskByWbs(value)
              if (selectedTask) {
                TaskStore.editTask(batchId, id, { depend_on: selectedTask.id })
              } else {
                TaskStore.editTask(batchId, id, { depend_on: null })
              }
            }}
          />
        )
      }
    },
    {
      Header: 'Start Date',
      accessor: 'start_date',
      headerClassName: 'f6',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('start_date'),
      Cell: data => {
        const { id, start_date } = data.row
        return (
          <InlineEditDateField
            text={start_date}
            onHighlight={() => this.setState({ taskSelected: id })}
            onDoneClick={value => {
              TaskStore.editStartDate(batchId, id, value)
            }}
          />
        )
      }
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
      headerClassName: 'f6',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('end_date'),
      Cell: data => {
        const { id, end_date, haveChildren } = data.row
        return (
          <InlineEditDateField
            editable={!haveChildren}
            text={end_date}
            onHighlight={() => this.setState({ taskSelected: id })}
            onDoneClick={value => {
              TaskStore.editEndDate(batchId, id, value)
            }}
          />
        )
      }
    },
    {
      Header: 'Duration',
      accessor: 'duration',
      headerClassName: 'f6',
      maxWidth: '90',
      className: 'tr',
      show: this.checkVisibility('duration'),
      Cell: data => {
        const { id, duration, haveChildren } = data.row
        return (
          <InlineEditNumberField
            editable={!haveChildren}
            text={duration}
            min="1"
            step="1"
            onHighlight={() => this.setState({ taskSelected: id })}
            onDoneClick={value => {
              TaskStore.editDuration(batchId, id, value)
            }}
          />
        )
      }
    },
    {
      Header: 'Est. Hr',
      accessor: 'estimated_hours',
      headerClassName: 'f6',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('estimated_hours'),
      Cell: data => {
        const { id, estimated_hours, haveChildren } = data.row
        return (
          <InlineEditNumberField
            editable={!haveChildren}
            text={estimated_hours}
            min="0"
            step=".25"
            onHighlight={() => this.setState({ taskSelected: id })}
            onDoneClick={value => {
              TaskStore.editEstimatedHours(batchId, id, value)
            }}
          />
        )
      }
    },
    {
      Header: 'Est. Cost',
      accessor: 'estimated_cost',
      headerClassName: 'f6',
      maxWidth: '100',
      className: 'justify-end',
      show: this.checkVisibility('estimated_cost'),
      Cell: data => moneyFormatter.format(data.row.estimated_cost)
    },
    {
      Header: 'Assigned',
      accessor: 'user_ids',
      headerClassName: 'f6',
      maxWidth: '200',
      className: 'justify-center',
      show: this.checkVisibility('resource_assigned'),
      Cell: data => {
        const { id, user_ids, wbs, haveChildren } = data.row
        if (haveChildren) {
          return null
        }
        return (
          <div
            className="flex pointer"
            onClick={() => this.handleShowAssignForm(id, user_ids)}
          >
            {user_ids &&
              user_ids.map(u => {
                const user = UserStore.getUserById(u)
                if (user) {
                  return (
                    <Avatar
                      size={24}
                      key={user.id}
                      firstName={user.first_name}
                      lastName={user.last_name}
                      photoUrl={user.photo_url}
                    />
                  )
                } else {
                  return null
                }
              })}
            <i className="ml2 material-icons icon--medium icon--rounded">
              person_add
            </i>
          </div>
        )
      }
    },
    {
      Header: 'Materials',
      accessor: 'items',
      headerClassName: 'f6',
      maxWidth: '200',
      show: this.checkVisibility('materials'),
      className: 'justify-center',
      Cell: data => {
        // console.log(toJS(data.row.items))
        const { id, items, haveChildren } = data.row
        if (haveChildren) {
          return null
        }
        return (
          <div
            className="flex pointer items-center"
            onClick={() => this.handleShowMaterialForm(id, items)}
          >
            {items && <span className="pa1">{items.length}</span>}
            <i className="ml2 material-icons icon--medium icon--rounded">add</i>
          </div>
        )
      }
    }
  ]

  render() {
    const {
      showTaskEditor,
      showStartDateCalendar,
      showAssignResourcePanel,
      showAssignMaterialPanel
    } = this.state
    const batchId = this.props.batch.id
    if (!TaskStore.isDataLoaded || !UserStore.isDataLoaded) {
      return <div>Loading...</div>
    }
    return (
      <React.Fragment>
        <SlidePanel
          width="600px"
          show={showAssignResourcePanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <AssignResourceForm
                ref={form => (this.assignResouceForm = form)}
                onClose={() =>
                  this.setState({ showAssignResourcePanel: false })
                }
                onSave={users => {
                  this.setState({ showAssignResourcePanel: false })
                  TaskStore.editAssignedUsers(
                    batchId,
                    this.state.taskSelected,
                    users
                  )
                }}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={showAssignMaterialPanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <AssignMaterialForm
                ref={form => (this.assignMaterialForm = form)}
                onClose={() =>
                  this.setState({ showAssignMaterialPanel: false })
                }
                onSave={materials => {
                  const taskId = this.state.taskSelected
                  TaskStore.editAssignedMaterial(batchId, taskId, materials)
                  this.setState({ showAssignMaterialPanel: false })
                }}
                batch_source={this.props.batch.batch_source}
                batch_id={batchId}
                facility_id={this.props.batch.facility_id}
                facility_strain_id={this.props.batch.facility_strain_id}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={showStartDateCalendar}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <CultivationCalendar
                batchId={batchId}
                facilityId={this.props.batch.facility_id}
                batchStartDate={TaskStore.batchStartDate}
                totalDuration={TaskStore.totalDuration}
                phaseDuration={TaskStore.phaseDuration}
                onClose={() => this.setState({ showStartDateCalendar: false })}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={showTaskEditor}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <TaskEditor
                onClose={() =>
                  this.setState({ showTaskEditor: false, taskAction: '' })
                }
                taskId={this.state.taskSelected}
                taskAction={this.state.taskAction}
                batchId={batchId}
              />
            </Suspense>
          )}
        />
        <Suspense fallback={<div />}>
          <ReactTable
            columns={this.columnsConfig(batchId)}
            data={TaskStore.taskList}
            loading={TaskStore.isLoading}
            showPagination={false}
            sortable={false}
            className="-highlight"
            pageSize={TaskStore.taskList.length}
            getTrProps={(state, rowInfo, column) => {
              let className = 'task-row'
              if (
                rowInfo.row &&
                this.state.taskSelected &&
                this.state.taskSelected === rowInfo.row.id
              ) {
                className = 'task-row shadow-1'
              }
              return {
                className
              }
            }}
          />
        </Suspense>
        <div className="mt3 tr">
          <input
            type="button"
            className="btn btn--primary btn--large"
            value="Save & Continue"
            onClick={() => this.setState({ showStartDateCalendar: true })}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default TaskList
