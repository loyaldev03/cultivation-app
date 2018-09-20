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

import ReactTable from 'react-table'

const styles = `
.table-dropdown {
  box-shadow: 0 3px 10px 0 #00000087;
  top: initial;
  min-width: 200px;
}
#myDropdown a:hover{
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
    if (row.row['attributes.isPhase'] == true) {
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
    if (row.row['attributes.isCategory'] == true) {
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
  handleMouseOver = row => {
    console.log(row)
  }

  handleMouseLeave = row => {
    this.setState(prevState => ({
      idOpen: null
    }))
  }


  renderAttributesName = row => {
    let id = row.row['id']
    let handleEdit = this.handleEdit
    let handleMouseLeave = this.handleMouseLeave
    return (
      <div className="flex justify-between-ns">
        <a
          onClick={e => {
            handleEdit(row)
          }}
        >
          {row.value}
        </a>

        <Manager>
          <Reference>
            {({ ref }) => (
              <i
                ref={ref}
                id={row.row['id']}
                onClick={this.handleClick}
                onMouseOver={this.handleMouseOver}
                className="material-icons dim grey ml2 pointer button-dropdown"
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
                    <a className="ttc pv2 tc flex pointer" style={{ display: 'flex' }}>
                      <i className="material-icons md-600 md-17 ph2">
                        format_indent_increase
                      </i>
                      Indent In
                    </a>
                    <a className="ttc pv2 tc flex pointer" style={{ display: 'flex' }}>
                      <i className="material-icons md-600 md-17 ph2">
                        format_indent_decrease
                      </i>
                      Indent Out
                    </a>
                    <a className="ttc pv2 tc flex pointer" style={{ display: 'flex' }}>
                      <i className="material-icons md-600 md-17 ph2">
                        vertical_align_top
                      </i>
                      Insert Task Above
                    </a>
                    <a className="ttc pv2 tc flex pointer" style={{ display: 'flex' }}>
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
                      <i className="material-icons md-600 md-17 ph2">
                        edit
                      </i>
                      Edit
                    </a>
                    <a className="ttc pv2 tc flex pointer" style={{ display: 'flex' }}>
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

  handleAddTask = row => {
    editorSidebarHandler.open({ width: '500px', data: {}, action: 'add' })
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

  handleClick = e => {
    e.persist()
    if (e.target && e.target !== null) {
      this.setState(prevState => ({
        idOpen: e.target.id
      }))
    }
  }

  handleEdit = e => {
    this.setState(prevState => ({
      idOpen: null
    }))
    editorSidebarHandler.open({
      width: '500px',
      data: e.row,
      action: 'update'
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
          <div className="w-40">
            <div className="mb4 mt2">
              <a
                className="flex-none bg-orange link white f6 fw6 pv2 ph3 br2 dim"
                onClick={this.handleAddTask}
              >
                New Task
              </a>
            </div>
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
                  <label>{this.state.batch.id}</label>
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
              accessor: 'attributes.isCategory',
              maxWidth: '50',
              id: 'button-column',
              show: false
              // Cell: (row) => (<div>{this.renderAddButton(row)}</div>)
            },
            {
              Header: 'Phase',
              accessor: 'attributes.phase',
              maxWidth: '100',
              Cell: row => <div>{this.renderPhaseColumn(row)}</div>
            },
            {
              Header: 'Category',
              accessor: 'attributes.task_category',
              maxWidth: '100',
              Cell: row => <div>{this.renderCategoryColumn(row)}</div>
            },
            {
              Header: 'Name',
              accessor: 'attributes.name',
              maxWidth: '300',
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
              accessor: 'attributes.days',
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
              accessor: 'attributes.isCategory',
              show: false
            },
            {
              Header: 'Phase?',
              accessor: 'attributes.isPhase',
              show: false
            }
          ]}
          data={tasks}
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
