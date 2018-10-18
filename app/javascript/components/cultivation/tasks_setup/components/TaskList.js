import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { Manager, Reference, Popper, Arrow } from 'react-popper'

import TaskStore from '../stores/TaskStore'
import UserStore from '../stores/UserStore'

import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import TaskEditor from './TaskEditor'
import updateSidebarTask from '../actions/updateSidebarTask'
import updateTask from '../actions/updateTask'
import indentTask from '../actions/indentTask'
import deleteTask from '../actions/deleteTask'

import ReactTable from 'react-table'

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

`

@observer
class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.dragged = null
    this.state = {
      isOpen: false,
      batch: this.props.batch
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
    this.setState({ taskSelected: e.row.id })
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

  // t = {12: true, 13: false} => store this in visibility store
  // t[12] get true display true

  renderAttributesName = row => {
    let id = row.row['id']
    let handleEdit = this.handleEdit
    let handleMouseLeave = this.handleMouseLeave
    let handleIndent = this.handleIndent
    let handleAddTask = this.handleAddTask
    let handleDelete = this.handleDelete
    return (
      <div className={`flex justify-between-ns ${row.row['attributes.is_phase'] === true ? '' : 'draggable' }`}>
        <div className="">
          <div className="flex">
            <div className="w1 ml3">
              {row.row['attributes.is_phase'] === true && (
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
            <div className="w1 ml3">
              {row.row['attributes.is_category'] === true && (
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
    this.setState({ taskSelected: row.row.id })
    editorSidebarHandler.open({
      width: '500px',
      data: { task_related_id: row.row.id, position: position },
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
      let enableDrag = header.querySelector('.draggable');
      if (enableDrag !== null){

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
            TaskStore.splice(i, 0, TaskStore.splice(this.dragged, 1)[0])
            updateTask.updatePosition(this.props.batch_id, i, this.dragged)
          }
        }


      }
    })
  }

  render() {
    let tasks = TaskStore.slice()
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
              // Cell: (row) => (<div>{this.renderAddButton(row)}</div>)
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
              Cell: row => <div>{this.renderAttributesName(row)}</div>
            },
            {
              Header: 'Start Date',
              accessor: 'attributes.start_date',
              maxWidth: '100'
            },
            {
              Header: 'End Date',
              accessor: 'attributes.end_date',
              maxWidth: '100'
            },
            {
              Header: 'Duration',
              accessor: 'attributes.duration',
              maxWidth: '100'
            },
            {
              Header: 'Est Hr',
              accessor: 'attributes.estimated_hours',
              maxWidth: '150'
            },
            {
              Header: 'Assigned',
              accessor: 'attributes.resources',
              maxWidth: '200'
            },
            {
              Header: 'Materials',
              accessor: 'attributes.item_display',
              maxWidth: '100'
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
          className=""
          rows={100}
          defaultPageSize={100}
          getTdProps={(state, rowInfo, column, instance) => {
            if (rowInfo) {
              return {
                onClick: (e, handleOriginal) => {
                  // if (column.id != 'button-column') {
                  //   editorSidebarHandler.open({
                  //     width: '500px',
                  //     data: rowInfo.row,
                  //     action: 'update'
                  //   })
                  // }
                }
              }
            }
            return {}
          }}
          getTrProps={(state, rowInfo, column) => {
            if (rowInfo) {
              return {
                style: {
                  boxShadow:
                    this.state.taskSelected === rowInfo.row.id
                      ? '0 0 4px 0 rgba(0,0,0,.14), 0 3px 4px 0 rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)'
                      : null
                },
                onMouseOver: (e, handleOriginal) => {
                  let button = document.getElementById(rowInfo.row.id)
                  // button.parentElement.parentElement.parentElement.parentElement.style.boxShadow =
                  //   '0 0 4px 0 rgba(0,0,0,.14), 0 3px 4px 0 rgba(0,0,0,.12), 0 1px 5px 0 rgba(0,0,0,.2)'
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
        <TaskEditor
          onClose={this.closeSidebar}
          batch_id={this.props.batch_id}
          handleReset={this.handleReset}
        />
        <div class="w-30 mt4">
          <a
            href={
              '/cultivation/batches/' + this.props.batch_id + '?type=active'
            }
            data-method="put"
            className="flex-none bg-orange link white f6 fw6 pv2 ph3 br2 dim mt3"
          >
            Save & Continue
          </a>
        </div>
      </React.Fragment>
    )
  }
}

export default TaskList
