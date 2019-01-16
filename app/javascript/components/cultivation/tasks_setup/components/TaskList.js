import React, { lazy, Suspense } from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import { Manager, Reference, Popper, Arrow } from 'react-popper'
import TaskStore from '../stores/NewTaskStore'
import UserStore from '../stores/NewUserStore'
import TaskEditor from './TaskEditor'
import BatchSetupStore from '../../batches_setup/BatchSetupStore'
import InlineEditTaskNameField from './InlineEditTaskNameField'
import InlineEditTextField from './InlineEditTextField'
import InlineEditNumberField from './InlineEditNumberField'
import InlineEditDateField from './InlineEditDateField'
import Avatar from '../../../utils/Avatar'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import { toast } from '../../../utils/toast'
import {
  monthStartDate,
  monthOptionAdd,
  monthOptionToString,
  formatDate2,
  dateToMonthOption,
  SlidePanel
} from '../../../utils'
const Calendar = lazy(() => import('react-calendar/dist/entry.nostyle'))
const ReactTable = lazy(() => import('react-table'))
const AssignResourceForm = lazy(() => import('./AssignResourceForm'))
const AssignMaterialForm = lazy(() => import('./MaterialForm'))

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

const MoneyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2
})

@observer
class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.dragged = null
    const batchStartDate = props.batch.start_date || new Date()
    this.state = {
      isOpen: false,
      batch: this.props.batch,
      showStartDateCalendar: false,
      showAssignResourcePanel: false,
      showAssignMaterialPanel: false,
      searchMonth: dateToMonthOption(batchStartDate)
    }
  }

  async componentDidMount() {
    await TaskStore.loadTasks(this.props.batch.id)
    await UserStore.loadUsers(this.props.batch.facility_id)
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    // need to find after data react-table is loaded callback
    setTimeout(() => this.mountEvents(), 100)
  }

  openSidebar = () => {
    window.editorSidebar.open({ width: '500px' })
  }

  closeSidebar = () => {
    window.editorSidebar.close()
  }

  renderAddButton = row => {
    if (row.value == true) {
      return (
        <div>
          <i
            className="material-icons md-600 md-gray md-17 ph2 pointer"
            onClick={e => {
              this.handleAddTask(row)
            }}
          >
            add
          </i>
        </div>
      )
    }
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
    this.setState({
      taskSelected: taskId,
      taskAction: 'update',
      showStartDateCalendar: false
    })
    let error_container = document.getElementById('error-container')
    if (error_container) {
      error_container.style.display = 'none'
    }
    this.clearDropdown()
    editorSidebarHandler.open({
      width: '500px',
      taskId: taskId,
      action: 'update'
    })
  }

  handleShowAssignForm = (taskId, users) => {
    this.assignResouceForm.setSelectedUsers(users)
    this.setState({
      taskSelected: taskId,
      showAssignResourcePanel: !this.state.showAssignResourcePanel
    })
  }

  handleShowMaterialForm = (taskId, items) => {
    this.assignMaterialForm.setSelectedItems(this.props.batch.id, taskId, items)
    this.setState({
      taskSelected: taskId,
      showAssignMaterialPanel: !this.state.showAssignMaterialPanel
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
    const { id, wbs, indent } = data.row
    const batchId = this.props.batch.id
    const hasChild = TaskStore.hasChildNode(wbs)
    const isCollapsed = TaskStore.isCollapsed(wbs)
    return (
      <div
        className="flex flex-auto justify-between items-center h-100 hide-child"
        draggable={true}
      >
        <InlineEditTaskNameField
          text={data.value}
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

  handleAddTask = (taskId, action) => {
    this.setState({
      taskAction: action,
      taskSelected: taskId,
      showStartDateCalendar: false
    })
    editorSidebarHandler.open({
      width: '500px',
      taskId: taskId,
      action: action
    })
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

  // when user hit the Save and Continue button below the table
  handleSave = () => {
    this.setState({
      showStartDateCalendar: true
    })
    this.onSearch(this.state.searchMonth)
    this.openSidebar()
  }

  // when user hit the Schedule batch button from the sidebar
  handleSubmit = async () => {
    const response = await BatchSetupStore.activateBatch(
      this.props.batch.id,
      this.state.selectedStartDate
    )
    if (response.errors) {
      const err1 = Object.keys(response.errors)[0]
      toast(response.errors[err1], 'error')
    } else {
      toast('Batch saved successfully', 'success')
      setTimeout(() => {
        window.location.reload()
      }, 800)
    }
  }

  handleDatePick = selectedStartDate => {
    this.setState({ selectedStartDate })
  }

  calculateTotalDuration = phaseDuration => {
    // Culculate total number of days for all cultivation phases that
    // need locations booking
    let total = 0
    Object.keys(phaseDuration).forEach(key => {
      total += phaseDuration[key]
    })
    return total
  }

  buildPhaseDuration = (tasks = []) => {
    // Build phase schedule from current Task List
    const facilityPhases = this.props.batch.cultivation_phases
    const phaseTasks = tasks.filter(
      t => t.indent > 0 && facilityPhases.some(p => p === t.phase)
    )
    const phaseDuration = {}
    phaseTasks.forEach(t => {
      phaseDuration[t.phase] = t.duration
    })
    return phaseDuration
  }

  onSearch(searchMonth) {
    BatchSetupStore.clearSearch()
    this.setState({ searchMonth })
    const { facility_id } = this.props.batch
    const phaseDuration = this.buildPhaseDuration(TaskStore.tasks)
    const totalDuration = this.calculateTotalDuration(phaseDuration)
    if (facility_id && searchMonth && totalDuration > 0) {
      const searchParams = {
        facility_id,
        search_month: searchMonth,
        total_duration: totalDuration
      }
      BatchSetupStore.search(searchParams, phaseDuration)
    }
  }

  columnsConfig = batchId => [
    {
      accessor: 'id',
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
      accessor: 'parent_id',
      show: false
    },
    {
      Header: 'WBS',
      accessor: 'wbs',
      maxWidth: '70',
      show: this.checkVisibility('wbs')
    },
    {
      Header: 'Tasks',
      accessor: 'name',
      maxWidth: '400',
      show: this.checkVisibility('name'),
      Cell: this.renderTaskNameColumn
    },
    {
      Header: 'Predecessor',
      accessor: 'depend_on',
      maxWidth: '100',
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
      maxWidth: '100',
      className: 'justify-end',
      show: this.checkVisibility('estimated_cost'),
      Cell: data => MoneyFormatter.format(data.row.estimated_cost)
    },
    {
      Header: 'Assigned',
      accessor: 'user_ids',
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
      showStartDateCalendar,
      showAssignResourcePanel,
      showAssignMaterialPanel,
      searchMonth,
      selectedStartDate
    } = this.state
    const batchId = this.props.batch.id
    const phaseDuration = this.buildPhaseDuration(TaskStore.tasks)
    const totalDuration = this.calculateTotalDuration(phaseDuration)
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
                batch_id={this.props.batch.id}
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
            onClick={() => this.handleSave()}
          />
        </div>
        <div data-role="sidebar" className="rc-slide-panel">
          <div className="rc-slide-panel__body h-100">
            {showStartDateCalendar ? (
              <div className="w-100 ph3">
                <div className="ph4 pv3 h3">
                  <a
                    href="#0"
                    className="slide-panel__close-button dim"
                    onClick={() => this.closeSidebar()}
                  >
                    <i className="material-icons mid-gray md-18 pa1">close</i>
                  </a>
                </div>
                <p className="tc">Select a Start Date for the batch</p>
                {!BatchSetupStore.isLoading ? (
                  <React.Fragment>
                    <CalendarTitleBar
                      month={searchMonth}
                      onPrev={e =>
                        this.onSearch(monthOptionAdd(searchMonth, -1))
                      }
                      onNext={e =>
                        this.onSearch(monthOptionAdd(searchMonth, 1))
                      }
                    />
                    <Suspense fallback={<div />}>
                      <Calendar
                        activeStartDate={monthStartDate(searchMonth)}
                        className="availabilty-calendar"
                        showNavigation={false}
                        onChange={this.handleDatePick}
                        tileContent={({ date, view }) => (
                          <CapacityTile
                            startDate={date}
                            duration={totalDuration}
                          />
                        )}
                      />
                    </Suspense>
                  </React.Fragment>
                ) : (
                  <div style={{ minHeight: '362px' }}>
                    <span className="dib pa2">Searching...</span>
                  </div>
                )}
                <div className="mt2 w-100 tr">
                  <input
                    type="button"
                    disabled={!selectedStartDate}
                    value="Schedule Batch"
                    className="btn btn--primary btn--large"
                    onClick={() => this.handleSubmit()}
                  />
                </div>
              </div>
            ) : (
              <TaskEditor
                onClose={this.closeSidebar}
                taskId={this.state.taskSelected}
                taskAction={this.state.taskAction}
                batchId={this.props.batch.id}
                handleReset={this.handleReset}
              />
            )}
          </div>
        </div>
      </React.Fragment>
    )
  }
}

export default TaskList

class CalendarTitleBar extends React.PureComponent {
  render() {
    const { onPrev, onNext, month } = this.props
    return (
      <div className="availabilty-calendar-title">
        <button
          onClick={onPrev}
          className="fl fw4 ph2 br-100 pointer bg-white ml2"
        >
          &#171;
        </button>
        {monthOptionToString(month)}
        <button
          onClick={onNext}
          className="fr fw4 ph2 br-100 pointer bg-white mr2"
        >
          &#187;
        </button>
      </div>
    )
  }
}

class CapacityTile extends React.PureComponent {
  render() {
    const { startDate, duration } = this.props
    return (
      <span className="react-calendar__tile__content">
        {BatchSetupStore.getCapacity(startDate, duration)}
      </span>
    )
  }
}
