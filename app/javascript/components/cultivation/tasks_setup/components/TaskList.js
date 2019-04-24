import React, { lazy, Suspense } from 'react'
import classNames from 'classnames'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import TaskStore from '../stores/NewTaskStore'
import UserStore from '../stores/NewUserStore'
import TaskEditor from './TaskEditor'
import InlineEditTaskNameField from './InlineEditTaskNameField'
import InlineEditTextField from './InlineEditTextField'
import InlineEditNumberField from './InlineEditNumberField'
import InlineEditDateField from './InlineEditDateField'
import Avatar from '../../../utils/Avatar'
import { formatDate2, moneyFormatter, SlidePanel } from '../../../utils'
import MyImage from 'images/BagOfSeeds.png'
import currentIssueStore from '../../../issues/store/CurrentIssueStore'
import getIssue from '../../../issues/actions/getIssue'
import loadHarvestBatch from '../actions/loadHarvestBatch'

const ReactTable = lazy(() => import('react-table'))
const ClippingPanel = lazy(() => import('./ClippingPanel'))
const AssignResourceForm = lazy(() => import('./AssignResourceForm'))
const AssignMaterialForm = lazy(() => import('./MaterialForm'))
const CultivationCalendar = lazy(() => import('./CultivationCalendar'))
const HarvestBatchForm = lazy(() => import('./HarvestBatchForm'))
const PackagePlanForm = lazy(() => import('./PackagePlanForm'))

const MenuButton = ({ icon, indelible, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      {icon ? (
        <i className="material-icons md-17 pr2">{icon}</i>
      ) : indelible == 'add_nutrient' ? (
        <img src={MyImage} style={{ width: '2em' }} />
      ) : (
        ''
      )}
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
      isClicked: false,
      showTaskEditor: false,
      showClippingPanel: false,
      showStartDateCalendar: false,
      showAssignResourcePanel: false,
      showAssignMaterialPanel: false,
      showHarvestBatchForm: false,
      showPackagePlanForm: false
    }
  }

  componentDidMount() {
    UserStore.loadUsers(this.props.batch.facility_id)
    // need to find after data react-table is loaded callback
    setTimeout(() => this.mountEvents(), 1500)
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

  handleShowClippingPanel = (taskId, item) => {
    this.setState({
      taskSelected: taskId,
      showClippingPanel: !this.state.showClippingPanel
    })
  }

  handleShowHarvestBatchForm = (taskId, item) => {
    if (!this.state.showHarvestBatchForm) {
      this.harvestBatchForm.loadData(this.props.batch.id)
    }
    this.setState({ showHarvestBatchForm: !this.state.showHarvestBatchForm })
  }

  handleShowPackagePlanForm = (taskId, item) => {
    if (!this.state.showPackagePlanForm) {
      // this.packagePlanForm.loadData(this.props.batch.id)
    }
    this.setState({ showPackagePlanForm: !this.state.showPackagePlanForm })
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
    const { id, wbs, indent, issues, deletable, indelible, items } = data.row
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
          onClick={e => {
            this.handleShowSidebar(id)
          }}
          onHighlight={() => this.setState({ taskSelected: id })}
          onDoneClick={value => {
            TaskStore.editTask(batchId, id, { name: value })
          }}
        />
        <Tippy
          placement="bottom-end"
          trigger="click"
          content={
            this.state.idOpen === id ? (
              <div className="bg-white f6 flex grey">
                <div className="db shadow-4">
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
                  {deletable ? (
                    <MenuButton
                      icon="delete_outline"
                      text="Delete Task"
                      className="red"
                      onClick={e => this.handleDelete(data)}
                    />
                  ) : null}
                  {indelible === 'add_nutrient' ? (
                    <div className="bt bw1">
                      <p className="i tc silver">Special Task</p>

                      <MenuButton
                        text="Add nutrients"
                        indelible={indelible}
                        onClick={() => this.handleShowMaterialForm(id, items)}
                      />
                    </div>
                  ) : (
                    ''
                  )}
                  {indelible === 'clip_mother_plant' ? (
                    <div className="bt bw1">
                      <p className="i tc silver">Special Task</p>

                      <MenuButton
                        text="Select Mother"
                        indelible={indelible}
                        onClick={() => this.handleShowClippingPanel(id, items)}
                      />
                    </div>
                  ) : (
                    ''
                  )}

                  {indelible === 'create_harvest_batch' ? (
                    <div className="bt bw1">
                      <p className="i tc silver">Create batch ID</p>

                      <MenuButton
                        text="Create batch ID"
                        indelible={indelible}
                        onClick={() =>
                          this.handleShowHarvestBatchForm(id, items)
                        }
                      />
                    </div>
                  ) : (
                    ''
                  )}

                  {indelible === 'create_package_plan' ? (
                    <div className="bt bw1">
                      <p className="i tc silver">Create packages</p>

                      <MenuButton
                        text="Create batch ID"
                        indelible={indelible}
                        onClick={() =>
                          this.handleShowPackagePlanForm(id, items)
                        }
                      />
                    </div>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            ) : (
              ''
            )
          }
        >
          <i
            onClick={this.handleEllipsisClick(id)}
            className={classNames('pointer material-icons', {
              'show-on-hover': this.state.taskSelected !== id
            })}
          >
            more_horiz
          </i>
        </Tippy>
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
      accessor: 'deletable',
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
      accessor: 'indelible',
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
      Header: '',
      accessor: 'issues',
      Cell: row => (
        <React.Fragment>
          {row.value.length > 0 ? (
            <Tippy
              placement="top"
              interactive={true}
              content={
                <div className="bg-white f6 flex">
                  <div className="db shadow-4 grey pa2">
                    <span>
                      Issues
                      <span className="b--orange ba orange f7 fw4 ph1 br2 ml1">
                        {row.value.length}
                      </span>
                    </span>
                    <ul className="pa2 list mt2 flex-auto br2 overflow-auto tl">
                      {row.value.map((i, key) => (
                        <li
                          key={key}
                          className="pointer br2 dim--grey pa1"
                          onClick={e => this.openSidebar(e, i.id, 'details')}
                        >
                          {i.title}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              }
            >
              <i className="material-icons icon--small red pointer">error</i>
            </Tippy>
          ) : null}
        </React.Fragment>
      ),
      headerClassName: 'f6',
      maxWidth: '30',
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
                TaskStore.editTask(
                  batchId,
                  id,
                  { depend_on: selectedTask.id },
                  true
                )
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
      Header: 'Actual Hours',
      accessor: 'actual_hours',
      headerClassName: 'f6',
      width: '85',
      show: this.checkVisibility('actual_hours')
    },
    {
      Header: 'Actual Cost',
      accessor: 'actual_cost',
      headerClassName: 'f6',
      width: '85',
      show: this.checkVisibility('actual_cost')
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

  openSidebar = (event, id = null, mode = null) => {
    this.setState({
      issueSelected: id,
      showIssues: true
    })

    currentIssueStore.reset()
    currentIssueStore.mode = mode

    if (id) {
      getIssue(id)
    }

    event.preventDefault()
  }

  render() {
    const {
      showTaskEditor,
      showStartDateCalendar,
      showAssignResourcePanel,
      showAssignMaterialPanel,
      showClippingPanel,
      showHarvestBatchForm,
      showPackagePlanForm,
      harvestBatch
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
                facilityId={this.props.batch.facility_id}
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
                facilityId={this.props.batch.facility_id}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="600px"
          show={showClippingPanel}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <ClippingPanel
                title="Clip"
                batchId={this.props.batch.id}
                facilityId={this.props.batch.facility_id}
                strainId={this.props.batch.facility_strain_id}
                onClose={() => this.setState({ showClippingPanel: false })}
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
                onSave={({ materials, nutrients, water_ph }) => {
                  const taskId = this.state.taskSelected
                  TaskStore.editAssignedMaterial(
                    batchId,
                    taskId,
                    materials,
                    nutrients || [],
                    water_ph
                  )
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
                facilityStrainId={this.props.batch.facility_strain_id}
                facilityId={this.props.batch.facility_id}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={showHarvestBatchForm}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <HarvestBatchForm
                onClose={() =>
                  this.setState({ showHarvestBatchForm: false, taskAction: '' })
                }
                ref={form => (this.harvestBatchForm = form)}
                batchId={batchId}
                facilityId={this.props.batch.facility_id}
              />
            </Suspense>
          )}
        />
        <SlidePanel
          width="500px"
          show={showPackagePlanForm}
          renderBody={props => (
            <Suspense fallback={<div />}>
              <PackagePlanForm
                onClose={() =>
                  this.setState({ showPackagePlanForm: false, taskAction: '' })
                }
                // ref={form => (this.harvestBatchForm = form)}
                // batchId={batchId}
                // facilityId={this.props.batch.facility_id}
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
            value="Schedule & Verify"
            onClick={() => this.setState({ showStartDateCalendar: true })}
          />
        </div>
      </React.Fragment>
    )
  }
}

export default TaskList
