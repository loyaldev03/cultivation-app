import React from 'react'
import { render } from 'react-dom'
import { observable } from 'mobx'
import { observer, Provider } from 'mobx-react'
import { Manager, Reference, Popper, Arrow } from 'react-popper'

import TaskStore from '../stores/TaskStore'
import { editorSidebarHandler } from '../../../utils/EditorSidebarHandler'
import TaskEditor from './TaskEditor'
import updateSidebarTask from '../actions/updateSidebarTask'
import updateTask from '../actions/updateTask'
import indentTask from '../actions/indentTask'

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
.button-dropdown:hover{
  background-color: #eee;
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
    console.log(row.row.id)
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
    this.clearDropdown()
    editorSidebarHandler.open({
      width: '500px',
      data: e.row,
      action: 'update'
    })
  }

  clearDropdown() {
    this.setState(prevState => ({
      idOpen: null
    }))
  }

  renderAttributesName = row => {
    let id = row.row['id']
    let handleEdit = this.handleEdit
    let handleMouseLeave = this.handleMouseLeave
    let handleIndent = this.handleIndent
    let handleAddTask = this.handleAddTask
    return (
      <div className="flex justify-between-ns">
        <div className="">
          <div className="flex">
            <div className="w1 ml3">
              {row.row['attributes.is_phase'] === true &&
              <a
                onClick={e => {
                  handleEdit(row)
                }}
              >
                {row.value}
              </a>
            }
            </div>
            <div className="w1 ml3">
              {row.row['attributes.is_category'] === true &&
                <a
                  onClick={e => {
                    handleEdit(row)
                  }}
                >
                  {row.value}
                </a>
              }
            </div>
            <div className="w1 ml3">
              {row.row['attributes.is_phase'] === false && row.row['attributes.is_category']=== false &&
                <a
                  onClick={e => {
                    handleEdit(row)
                  }}
                >
                  {row.value}
                </a>
              }
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
                        handleAddTask(row.row.id, 'top')
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
                        handleAddTask(row.row.id, 'bottom')
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

  handleAddTask = (task_related_id, position) => {
    editorSidebarHandler.open({
      width: '500px',
      data: { task_related_id: task_related_id, position: position },
      action: 'add'
    })
  }

  mountEvents() {
    const headers = Array.prototype.slice.call(
      document.querySelectorAll('.rt-tr-group')
    )

    headers.forEach((header, i) => {
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
    })
  }

  render() {
    let tasks = TaskStore.slice()

    return (
      <React.Fragment>
        <style> {styles} </style>

        <div className=" flex">
          <div className="w-40">
            <h4 className="tl pa0 ma0 h6--font dark-grey">Task List</h4>
          </div>
        </div>
        <div className="mb3 flex">
          <div className="w-50">
            <div className=" flex">
              <div className="w-40">
                <label>Batch Source</label>
              </div>
              <div className="w-40">
                <div className="">
                  <label>{this.state.batch.batch_source}</label>
                </div>
              </div>
            </div>
            <div className=" flex">
              <div className="w-40">
                <label>Batch Id</label>
              </div>
              <div className="w-40">
                <div className="">
                  <label>{this.state.batch.batch_no}</label>
                </div>
              </div>
            </div>
            <div className=" flex">
              <div className="w-40">
                <label>Start Date</label>
              </div>
              <div className="w-40">
                <div className="">
                  <label>{this.state.batch.start_date}</label>
                </div>
              </div>
            </div>

            <div className=" flex">
              <div className="w-40">
                <label>Estimated Harvest Date</label>
              </div>
              <div className="w-40">
                <div className="">
                  <label>{this.state.batch.estimated_harvest_date}</label>
                </div>
              </div>
            </div>
          </div>
          <div className="w-50">
            <div className=" flex">
              <div className="w-20">
                <label>Grow Method</label>
              </div>
              <div className="w-40">
                <div className="">
                  <label>{this.state.batch.grow_method}</label>
                </div>
              </div>
            </div>
            <div className=" flex">
              <div className="w-20">
                <label>Strain</label>
              </div>
              <div className="w-40">
                <div className="">
                  <label>{this.state.batch.strain}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
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
              Header: 'Name',
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
              Header: 'Estimated Hours',
              accessor: 'attributes.estimated_hours',
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
                onMouseOver: (e, handleOriginal) => {
                  let button = document.getElementById(rowInfo.row.id)
                  button.style.display = 'block'
                },
                onMouseOut: (e, handleOriginal) => {
                  let button = document.getElementById(rowInfo.row.id)
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
        />
      </React.Fragment>
    )
  }
}

export default TaskList
