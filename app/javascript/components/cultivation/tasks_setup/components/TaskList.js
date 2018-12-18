import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Manager, Reference, Popper, Arrow } from 'react-popper'
import TaskStore from '../stores/TaskStore'
import DisplayTaskStore from '../stores/DisplayTaskStore'
import UserStore from '../stores/UserStore'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import {
  monthStartDate,
  monthOptionAdd,
  monthOptionToString,
  dateToMonthOption
} from '../../../utils'
import { toast } from '../../../utils/toast'
import TaskEditor from './TaskEditor'
import updateTask from '../actions/updateTask'
import indentTask from '../actions/indentTask'
import deleteTask from '../actions/deleteTask'
import updateTaskPosition from '../actions/updateTaskPosition'
import ReactTable from 'react-table'
import Calendar from 'react-calendar/dist/entry.nostyle'
import BatchSetupStore from '../../batches_setup/BatchSetupStore'

const styles = `
.table-dropdown {
  box-shadow: 0 3px 10px 0 #00000087;
  top: initial;
  min-width: 200px;
}
.table-dropdown a:hover{
  background-color: #eee;
}

.rt-tr-group:hover{
  box-shadow: 0 0 4px 0 rgba(0,0,0,.14), 0 3px 4px 0 rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2);
}
.rt-thead{
  background-color: #eee;
}

`

@observer
class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.dragged = null
    const batchStartDate = props.batch.start_date || new Date()
    this.state = {
      isOpen: false,
      batch: this.props.batch,
      collapseIds: DisplayTaskStore,
      showStartDateCalendar: false,
      searchMonth: dateToMonthOption(batchStartDate)
    }
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    let _this = this
    // need to find after data react-table is loaded callback
    setTimeout(function() {
      _this.mountEvents()
    }, 5000)
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

  renderPhaseColumn = row => {
    let handleEdit = this.handleEdit
    if (row.row['attributes.is_phase'] == true) {
      return (
        <a
          onClick={e => {
            handleEdit(row)
          }}
        >
          {row.value}
        </a>
      )
    }
  }

  renderCategoryColumn = row => {
    let handleEdit = this.handleEdit
    if (row.row['attributes.is_category'] == true) {
      return (
        <a
          onClick={e => {
            handleEdit(row)
          }}
        >
          {row.value}
        </a>
      )
    }
  }

  handleMouseLeave = row => {
    this.setState(prevState => ({
      idOpen: null
    }))
  }

  handleIndent = (row, action) => {
    this.clearDropdown()
    indentTask(this.props.batch_id, row.row, action)
  }

  handleClick = e => {
    e.persist()
    if (e.target && e.target !== null) {
      this.setState(prevState => ({
        idOpen: e.target.id
      }))
    }
  }

  handleEdit = e => {
    this.setState({ taskSelected: e.row.id, showStartDateCalendar: false })
    let error_container = document.getElementById('error-container')
    if (error_container) {
      error_container.style.display = 'none'
    }
    this.clearDropdown()
    editorSidebarHandler.open({
      width: '500px',
      data: e.row,
      action: 'update'
    })
  }

  handleDelete = row => {
    deleteTask(this.props.batch_id, row.row)
  }

  clearDropdown() {
    this.setState(prevState => ({
      idOpen: null
    }))
  }

  toggleCollapse = id => {
    let array = []
    let children_ids = TaskStore.filter(e => e.attributes.parent_id === id).map(
      e => e.id
    )
    let new_ids, old_id
    if (this.state.collapseIds.includes(id)) {
      let i
      let tempCollapseId = this.state.collapseIds
      old_id = DisplayTaskStore.slice()

      //loop through children
      for (i = 0; i < children_ids.length; i++) {
        tempCollapseId = tempCollapseId.filter(e => e !== children_ids[i])
        let current_children_id = TaskStore.filter(
          e => e.attributes.parent_id === children_ids[i]
        ).map(e => e.id)
        old_id = old_id.filter(e => !current_children_id.includes(e))
      }

      this.setState({ collapseIds: tempCollapseId.filter(e => e !== id) })
      new_ids = old_id.filter(e => !children_ids.includes(e))
    } else {
      this.setState(prevState => ({
        collapseIds: [...prevState.collapseIds, id]
      }))
      old_id = DisplayTaskStore.slice()
      new_ids = old_id.concat(children_ids)
    }

    DisplayTaskStore.replace(new_ids)
    this.mountEvents()
  }

  renderAttributesName = row => {
    let id = row.row['id']
    let handleEdit = this.handleEdit
    let handleMouseLeave = this.handleMouseLeave
    let handleIndent = this.handleIndent
    let handleAddTask = this.handleAddTask
    let handleDelete = this.handleDelete
    let toggleCollapse = this.toggleCollapse
    return (
      <div
        className={`flex justify-between-ns ${
          row.row['attributes.is_phase'] === true ||
          row.row['attributes.is_category'] === true
            ? ''
            : 'draggable'
        }`}
      >
        <div className="">
          <div className="flex">
            <div className="w1 ml3">
              {row.row['attributes.is_phase'] === true && (
                <div>
                  <i
                    className="material-icons dim grey f7 pointer"
                    style={{ fontSize: '18px' }}
                    onClick={e => toggleCollapse(row.row.id)}
                  >
                    {this.state.collapseIds.includes(row.row.id)
                      ? 'arrow_drop_up'
                      : 'arrow_drop_down'}
                  </i>
                  <a
                    className="pointer"
                    style={{ color: '#ff5722' }}
                    onClick={e => {
                      handleEdit(row)
                    }}
                  >
                    {row.value}
                  </a>
                </div>
              )}
            </div>
            <div className="w1 ml3">
              {row.row['attributes.is_category'] === true && (
                <div>
                  <i
                    className="material-icons dim grey f7 pointer"
                    style={{ fontSize: '18px' }}
                    onClick={e => toggleCollapse(row.row.id)}
                  >
                    {this.state.collapseIds.includes(row.row.id)
                      ? 'arrow_drop_up'
                      : 'arrow_drop_down'}
                  </i>
                  <a
                    className="pointer"
                    style={{ color: '#ff5722' }}
                    onClick={e => {
                      handleEdit(row)
                    }}
                  >
                    {row.value}
                  </a>
                </div>
              )}
            </div>
            <div className="w1 ml3">
              {row.row['attributes.is_phase'] === false &&
                row.row['attributes.is_category'] === false && (
                  <a
                    className="pointer"
                    onClick={e => {
                      handleEdit(row)
                    }}
                  >
                    {row.value}
                  </a>
                )}
            </div>
          </div>
        </div>

        <Manager>
          <Reference>
            {({ ref }) => (
              <i
                ref={ref}
                id={row.row['id']}
                onClick={this.handleClick}
                className="material-icons ml2 pointer button-dropdown"
                style={{ display: 'none', fontSize: '18px' }}
              >
                more_horiz
              </i>
            )}
          </Reference>
          {this.state.idOpen === id && (
            <Popper placement="bottom" style={{ borderColor: 'red' }}>
              {({ ref, style, placement, arrowProps }) => (
                <div
                  ref={ref}
                  id={'dropdown-' + row.row['id']}
                  style={style}
                  data-placement={placement}
                >
                  <div
                    id="myDropdown"
                    onMouseLeave={handleMouseLeave}
                    className="table-dropdown dropdown-content box--shadow-header show"
                  >
                    <a
                      className="ttc pv2 tc flex pointer"
                      style={{ display: 'flex' }}
                      onClick={e => {
                        handleIndent(row, 'in')
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">
                        format_indent_increase
                      </i>
                      Indent In
                    </a>
                    <a
                      className="ttc pv2 tc flex pointer"
                      style={{ display: 'flex' }}
                      onClick={e => {
                        handleIndent(row, 'out')
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">
                        format_indent_decrease
                      </i>
                      Indent Out
                    </a>
                    {row.row['attributes.is_phase'] !== true && (
                      <a
                        className="ttc pv2 tc flex pointer"
                        style={{ display: 'flex' }}
                        onClick={e => {
                          handleAddTask(row, 'top')
                        }}
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
                      onClick={e => {
                        handleAddTask(row, 'bottom')
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">
                        vertical_align_bottom
                      </i>
                      Insert Task Below
                    </a>
                    <a
                      className="ttc pv2 tc flex pointer"
                      style={{ display: 'flex' }}
                      onClick={e => {
                        handleEdit(row)
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">edit</i>
                      Edit
                    </a>
                    <a
                      className="ttc pv2 tc flex pointer"
                      style={{ display: 'flex' }}
                      onClick={e => {
                        handleDelete(row)
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">
                        delete_outline
                      </i>
                      Delete
                    </a>
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

  handleAddTask = (row, position) => {
    this.setState({ taskSelected: row.row.id, showStartDateCalendar: false })
    editorSidebarHandler.open({
      width: '500px',
      data: {
        task_related_id: row.row.id,
        position: position,
        task_related_parent_id: row.row['attributes.parent_id']
      },
      action: 'add'
    })
  }

  handleReset = () => {
    this.setState({ taskSelected: '', taskRelatedPosition: '' })
  }

  mountEvents() {
    const headers = Array.prototype.slice.call(
      document.querySelectorAll('.rt-tr-group')
    )

    headers.forEach((header, i) => {
      const enableDrag = header.querySelector('.draggable')
      if (enableDrag) {
        header.setAttribute('draggable', true)
        //the dragged header
        header.ondragstart = e => {
          e.stopPropagation()
          this.dragged = i
        }

        header.ondrag = e => e.stopPropagation

        header.ondragend = e => {
          e.stopPropagation()
          setTimeout(() => (this.dragged = null), 1000)
        }

        //the dropped header
        header.ondragover = e => {
          e.preventDefault()
        }

        header.ondragenter = e => {
          e.target.closest('.rt-tr-group').style.borderBottomColor =
            'rgb(255,112,67)'
        }

        header.ondragleave = e => {
          e.target.closest('.rt-tr-group').style.borderBottomColor = ''
        }

        header.ondrop = e => {
          e.preventDefault()
          e.target.closest('.rt-tr-group').style.borderBottomColor = ''
          if (this.dragged !== null && i !== null) {
            const taskDragged = toJS(TaskStore)[this.dragged]
            const newPosition = i + 1
            updateTaskPosition(this.props.batch_id, taskDragged, newPosition)
          }
        }
      }
    })
  }

  filterTask = () => {
    let ids = DisplayTaskStore
    let filteredTasks = TaskStore.slice().filter(e => ids.includes(e.id))
    return filteredTasks
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

  buildPhaseDuration = tasks => {
    // Build phase schedule from current Task List
    const facilityPhases = this.props.batch.cultivation_phases
    const phaseTasks = tasks.filter(
      t =>
        t.attributes.is_phase &&
        facilityPhases.some(p => p === t.attributes.phase)
    )
    const phaseDuration = {}
    phaseTasks.forEach(t => {
      phaseDuration[t.attributes.phase] = t.attributes.duration
    })
    return phaseDuration
  }

  onSearch(searchMonth) {
    BatchSetupStore.clearSearch()
    this.setState({ searchMonth })
    const { facility_id } = this.props.batch
    const tasks = toJS(TaskStore)
    const phaseDuration = this.buildPhaseDuration(tasks)
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

  render() {
    const { showStartDateCalendar, searchMonth, selectedStartDate } = this.state
    const phaseDuration = this.buildPhaseDuration(toJS(TaskStore))
    const totalDuration = this.calculateTotalDuration(phaseDuration)
    let tasks = this.filterTask()
    let users = UserStore
    return (
      <React.Fragment>
        <style> {styles} </style>
        <ReactTable
          columns={[
            {
              Header: 'Id',
              accessor: 'id',
              maxWidth: '100',
              show: false
            },
            {
              Header: '',
              accessor: 'attributes.is_category',
              maxWidth: '50',
              id: 'button-column',
              show: false
            },
            {
              Header: 'Phase',
              accessor: 'attributes.phase',
              maxWidth: '100',
              show: false,
              Cell: row => <div>{this.renderPhaseColumn(row)}</div>
            },
            {
              Header: 'Category',
              accessor: 'attributes.task_category',
              maxWidth: '100',
              show: false,
              Cell: row => <div>{this.renderCategoryColumn(row)}</div>
            },
            {
              Header: 'Tasks',
              accessor: 'attributes.name',
              maxWidth: '500',
              show: this.checkVisibility('name'),
              Cell: row => <div>{this.renderAttributesName(row)}</div>
            },
            {
              Header: 'Start Date',
              accessor: 'attributes.start_date',
              maxWidth: '100',
              show: this.checkVisibility('start_date')
            },
            {
              Header: 'End Date',
              accessor: 'attributes.end_date',
              maxWidth: '100',
              show: this.checkVisibility('end_date')
            },
            {
              Header: 'Duration',
              accessor: 'attributes.duration',
              maxWidth: '90',
              show: this.checkVisibility('duration')
            },
            {
              Header: 'Est Hr',
              accessor: 'attributes.estimated_hours',
              maxWidth: '100',
              show: this.checkVisibility('estimated_hour')
            },
            {
              Header: 'Est Cost ($)',
              accessor: 'attributes.estimated_cost',
              maxWidth: '100',
              show: this.checkVisibility('estimated_cost')
            },
            {
              Header: 'Assigned',
              accessor: 'attributes.resources',
              maxWidth: '200',
              show: this.checkVisibility('resource_assigned')
            },
            {
              Header: 'Materials',
              accessor: 'attributes.item_display',
              maxWidth: '100',
              show: this.checkVisibility('materials')
            },
            {
              Header: 'Parent',
              accessor: 'attributes.parent_id',
              show: false
            },
            {
              Header: 'Depend On',
              accessor: 'attributes.depend_on',
              show: false
            },
            {
              Header: 'Category?',
              accessor: 'attributes.is_category',
              show: false
            },
            {
              Header: 'Phase?',
              accessor: 'attributes.is_phase',
              show: false
            }
          ]}
          data={tasks}
          showPagination={false}
          className=""
          defaultPageSize={-1}
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo) {
              return {
                style: {
                  boxShadow:
                    this.state.taskSelected === rowInfo.row.id
                      ? '0 0 4px 0 rgba(0,0,0,.14), 0 3px 4px 0 rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)'
                      : null,
                  backgroundColor:
                    rowInfo.row['attributes.is_phase'] === true
                      ? '#FAEFEE'
                      : null
                },
                onMouseOver: (e, handleOriginal) => {
                  let button = document.getElementById(rowInfo.row.id)
                  button.style.display = 'block'
                },
                onMouseOut: (e, handleOriginal) => {
                  let button = document.getElementById(rowInfo.row.id)
                  if (this.state.taskSelected !== rowInfo.row.id) {
                    button.parentElement.parentElement.parentElement.parentElement.style.boxShadow =
                      ''
                  }
                  button.style.display = 'none'
                }
              }
            }
            return {}
          }}
        />
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
                batch_id={this.props.batch_id}
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
