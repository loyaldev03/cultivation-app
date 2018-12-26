import React from 'react'
import classNames from 'classnames'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import { Manager, Reference, Popper, Arrow } from 'react-popper'
import TaskStore from '../stores/NewTaskListStore'
import UserStore from '../stores/UserStore'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import {
  monthStartDate,
  monthOptionAdd,
  monthOptionToString,
  formatDate2,
  dateToMonthOption
} from '../../../utils'
import { toast } from '../../../utils/toast'
import TaskEditor from './TaskEditor'
import updateTask from '../actions/updateTask'
import indentTask from '../actions/indentTask'
import deleteTask from '../actions/deleteTask'
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
      showStartDateCalendar: false,
      searchMonth: dateToMonthOption(batchStartDate)
    }
  }

  componentDidMount() {
    TaskStore.loadTasks(this.props.batch.id)
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

  handleMouseLeave = row => {
    this.setState(prevState => ({
      idOpen: null
    }))
  }

  handleIndent = (row, action) => {
    this.clearDropdown()
    indentTask(this.props.batch.id, row.row, action)
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
    deleteTask(this.props.batch.id, row.row)
  }

  clearDropdown() {
    this.setState(prevState => ({
      idOpen: null
    }))
  }

  renderDateColumn = field => data => {
    return formatDate2(data.row[field])
  }

  renderTaskNameColumn = data => {
    const { id, wbs, indent } = data.row
    return (
      <div className="flex justify-between items-center draggable">
        <span
          className={classNames(`dib flex items-center indent--${indent}`, {
            orange: TaskStore.hasChildNode(wbs)
          })}
        >
          {TaskStore.hasChildNode(wbs) && (
            <i
              className="material-icons dim grey f7 pointer"
              onClick={e => TaskStore.toggleCollapseNode(wbs)}
            >
              {TaskStore.isCollapsed(wbs) ? 'arrow_right' : 'arrow_drop_down'}
            </i>
          )}
          {data.value}
        </span>
        <Manager>
          <Reference>
            {({ ref }) => (
              <i
                ref={ref}
                id={id}
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
                  id={'dropdown-' + id}
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
                      onClick={e => {
                        this.handleIndent(data, 'in')
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
                        this.handleIndent(data, 'out')
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">
                        format_indent_decrease
                      </i>
                      Indent Out
                    </a>
                    {indent > 0 && (
                      <a
                        className="ttc pv2 tc flex pointer"
                        style={{ display: 'flex' }}
                        onClick={e => {
                          this.handleAddTask(data, 'top')
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
                        this.handleAddTask(data, 'bottom')
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
                        this.handleEdit(data)
                      }}
                    >
                      <i className="material-icons md-600 md-17 ph2">edit</i>
                      Edit
                    </a>
                    <a
                      className="ttc pv2 tc flex pointer"
                      style={{ display: 'flex' }}
                      onClick={e => {
                        this.handleDelete(data)
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

  handleAddTask = (data, position) => {
    const { id, parent_id } = data.row
    console.log({ action: 'handleAddTask', id, parent_id })
    this.setState({ taskSelected: id, showStartDateCalendar: false })
    editorSidebarHandler.open({
      width: '500px',
      data: {
        task_related_id: id,
        position: position,
        task_related_parent_id: parent_id
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
          setTimeout(() => (this.dragged = null), 300)
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

        header.ondrop = async e => {
          e.preventDefault()
          e.target.closest('.rt-tr-group').style.borderBottomColor = ''
          if (this.dragged !== null && i !== null) {
            await TaskStore.updateTaskPosition(
              this.props.batch.id,
              TaskStore.taskList[this.dragged].id,
              TaskStore.taskList[i].id
            )
          }
        }
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

  columnsConfig = () => [
    {
      accessor: 'id',
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
      accessor: 'depend_on',
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
      Header: 'Start Date',
      accessor: 'start_date',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('start_date'),
      Cell: this.renderDateColumn('start_date')
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('end_date'),
      Cell: this.renderDateColumn('end_date')
    },
    {
      Header: 'Duration',
      accessor: 'duration',
      maxWidth: '90',
      className: 'tr',
      show: this.checkVisibility('duration')
    },
    {
      Header: 'Est Hr',
      accessor: 'estimated_hours',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('estimated_hour')
    },
    {
      Header: 'Est Cost ($)',
      accessor: 'estimated_cost',
      maxWidth: '100',
      className: 'tr',
      show: this.checkVisibility('estimated_cost')
    },
    {
      Header: 'Assigned',
      accessor: 'resources',
      maxWidth: '200',
      show: this.checkVisibility('resource_assigned')
    },
    {
      Header: 'Materials',
      accessor: 'item_display',
      maxWidth: '100',
      show: this.checkVisibility('materials')
    }
  ]

  render() {
    const { showStartDateCalendar, searchMonth, selectedStartDate } = this.state
    const phaseDuration = this.buildPhaseDuration(TaskStore.tasks)
    const totalDuration = this.calculateTotalDuration(phaseDuration)
    let users = UserStore
    return (
      <React.Fragment>
        <ReactTable
          columns={this.columnsConfig()}
          data={TaskStore.taskList}
          loading={TaskStore.isLoading}
          showPagination={false}
          sortable={false}
          className="-highlight"
          pageSize={TaskStore.taskList.length}
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo) {
              return {
                style: {
                  boxShadow:
                    this.state.taskSelected === rowInfo.row.id
                      ? '0 0 4px 0 rgba(0,0,0,.14), 0 3px 4px 0 rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)'
                      : null,
                  backgroundColor:
                    rowInfo.row['indent'] === 0 ? '#FAEFEE' : null
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
                batch_id={this.props.batch.id}
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
