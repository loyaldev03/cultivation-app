
import isEmpty from 'lodash.isempty'
import uniq from 'lodash.uniq'
import React, { memo, useState } from 'react'
import { action, observable, computed, autorun } from 'mobx'
import { observer } from 'mobx-react'
import Tippy from '@tippy.js/react'
import PeopleDashboardStore from './PeopleDashboardStore'

import {
  decimalFormatter,
  formatDate2,
  httpGetOptions,
  ActiveBadge,
  CheckboxSelect,
  HeaderFilter,
  Loading,
  ListingTable,
  formatAgo,
  TempTaskWidgets,
  httpPostOptions
} from '../utils'
import classnames from 'classnames'

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

const range = [
{
    text: 'This Week',
    val: 'this_week'
},
{
    text: 'This Year',
    val: 'this_year'
}
]
const roleInit = {
    role_id: 'all',
    role_name: 'All Job Roles'
  }

const status = [
{
    text: 'Select Status',
    val: 'all'
},
{
    text: 'Open',
    val: 'open'
},
{
    text: 'Submitted',
    val: 'submitted'
},
{
    text: 'Approved',
    val: 'approved'
},
{
    text: 'Declined',
    val: 'declined'
}

]

class ActiveTaskStore {
  @observable tasks = []
  @observable isLoading = false
  @observable isDataLoaded = false
  @observable metadata = {}
  @observable searchTerm = ''
  @observable roleTerm = 'all'
  @observable rangeTerm = 'this_week'
  @observable statusTerm = 'all'
  @observable filter = {
    facility_id: '',
    page: 0,
    limit: 20
  }
  @observable columnFilters = {}

  constructor() {
    autorun(
      () => {
        if (this.filter.facility_id) {
          if (this.searchTerm === null) {
            this.searchTerm = ''
          }
          this.loadActiveTasks()
        }
      },
      { delay: 700 }
    )
  }

  @action
  async loadActiveTasks() {
    this.isLoading = true
    let url = `/api/v1/people/timesheet_approval?facility_id=${this.filter.facility_id}`
    url += `&page=${this.filter.page}&limit=${this.filter.limit}&range=${this.rangeTerm}&role=${this.roleTerm}&status=${this.statusTerm}&search=${
      this.searchTerm
    }`
    try {
      const response = await (await fetch(url, httpGetOptions)).json()
      if (response && response.data) {
        this.tasks = response.data
        this.metadata = Object.assign({ pages: 0 }, response.metadata)
        this.isDataLoaded = true
      } else {
        this.tasks = []
        this.metadata = { pages: 0 }
        this.isDataLoaded = false
      }
    } catch (error) {
      this.isDataLoaded = false
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }

  @action
  setFilter(filter) {
    this.filter = {
      facility_id: filter.facility_id,
      page: filter.page,
      limit: filter.limit
    }
  }

  /* + column filters */
  isFiltered = record => {
    let f = Object.keys(this.columnFilters).find(key => {
      const filter = this.columnFilters[key].filter(x => x.value === false)
      return filter.find(x => x.label === record[key])
    })
    return f ? true : false
  }

  updateFilterOptions = (propName, filterOptions) => {
    const updated = {
      ...this.columnFilters,
      [propName]: filterOptions
    }
    this.columnFilters = updated
  }

  getUniqPropValues = propName => {
    return uniq(this.filteredList.map(x => x[propName]).sort())
  }
  /* - column filters */

  @computed
  get filteredList() {
    if (!isEmpty(this.filter) || !isEmpty(this.columnFilters)) {
      return this.tasks.filter(b => {
        if (this.isFiltered(b)) {
          return false
        }
        const filterLc = this.searchTerm.toLowerCase()
        const nameLc = `${b.worker_name}`.toLowerCase()
        const nameLc2 = `${b.approver}`.toLowerCase()
        const results = nameLc.includes(filterLc) || nameLc2.includes(filterLc)
        return results
      })
    } else {
      return this.tasks
    }
  }
}

const activeTaskStore = new ActiveTaskStore()

@observer
class TimesheetApp extends React.Component {
  constructor(props) {
    super(props)
    //DashboardMetrcStore.loadMetrcs_info(this.props.facility_id)
    PeopleDashboardStore.loadRoles()
  }
  state = {
    status: {text: 'Select Status', val:'all'},
    role: {role_id: '', role_name: 'All Job Roles'},
    range: {text: 'This Week', val: 'this_week'},
    search: '',
    page: 0,
    pageSize: 20,

    columns: [
      { accessor: 'id', show: false },
      {
        headerClassName: 'tl',
        Header: 'Worker',
        accessor: 'worker_name',
        minWidth: 100,
        Cell: props => {
            return (
              <div className="flex items-center">
                <img
                  src={props.row['photo_url']}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '18px'
                  }}
                  onError={x => {
                    x.target.onerror = null
                    x.target.src = DefaultAvatar
                  }}
                />
                <span className="f6 fw6 dark-grey ml2 w-20">{props.value}</span>
              </div>
            )
          }
      },
      {
        headerClassName: 'tl justify-center',
        Header: 'Role',
        accessor: 'roles',
        minWidth: 88,
        className: 'justify-center ttu'
      },
      {
        headerClassName: 'tl justify-center',
        Header: 'Total Hours',
        accessor: 'total_hours',
        minWidth: 130,
        className: 'justify-center ttu'
      },
      {
        headerClassName: 'tl justify-center',
        Header: 'OT',
        accessor: 'total_ot',
        minWidth: 130,
        className: 'justify-center ttu',
        Cell: props => <span className="">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Approver',
        accessor: 'approver',
        minWidth: 88,
        Cell: props => <span className="ttc">{props.value}</span>
      },
      {
        headerClassName: 'tl',
        Header: 'Approve/Decline',
        accessor: 'id',
        minWidth: 88,
        Cell: props => <span className="ttc">{props.value}</span>
      },
     
    ]
  }

onChangeRoles = role => {
    this.setState({ role: role }, () => {
        activeTaskStore.roleTerm = role.role_id
        activeTaskStore.loadActiveTasks()
    })
}
onChangeStatus = status => {
    this.setState({ status: status }, () => {
        activeTaskStore.statusTerm = status.val
        activeTaskStore.loadActiveTasks()
    })
}
onChangeRange = range => {
    this.setState({ range: range }, () => {
        activeTaskStore.rangeTerm = range.val
        activeTaskStore.loadActiveTasks()
    })
}
onChangeSearch = search => {
    this.setState({ search: search }, () => {
        activeTaskStore.searchTerm = search 
        //activeTaskStore.loadActiveTasks()
    })
}


  onFetchData = (state, instance) => {
    activeTaskStore.setFilter({
      facility_id: this.props.currentFacilityId,
      page: state.page,
      limit: state.pageSize
    })
    //activeTaskStore.loadActiveTasks()
  }

  onToggleColumns = (header, value) => {
    const column = this.state.columns.find(x => x.Header === header)
    if (column) {
      column.show = value
      this.setState({
        columns: this.state.columns.map(x =>
          x.Header === column.Header ? column : x
        )
      })
    }
  }

  

  render() {
    const { columns, showEditor } = this.state
    return (
      <div className="w-100 bg-white pa3">
        <div className="flex mb4 mt2">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Timesheets Approval</h1>
        </div>


        <div className="flex justify-between pb3">
          <input
            type="text"
            className="input w5"
            placeholder="Search Worker/Approver"
            onChange={e => {
              activeTaskStore.searchTerm = e.target.value
            }}
          />
          <div className="flex justify-between">
             <Tippy
                placement="bottom-end"
                trigger="click"
                duration="0"
                content={
                    <div className="bg-white f6 flex">
                    <div className="db shadow-4">
                        <MenuButton
                        key={1}
                        text={'All Job Roles'}
                        className=""
                        onClick={() => this.onChangeRoles(roleInit)}
                        />
                        {PeopleDashboardStore.roles_loaded
                        ? PeopleDashboardStore.data_roles.map(d => (
                            <MenuButton
                                key={d.role_id}
                                text={d.role_name}
                                className=""
                                onClick={() => this.onChangeRoles(d)}
                            />
                            ))
                        : 'loading...'}
                    </div>
                    </div>
                }
                >
                <div className="flex ba b--light-silver br2 pointer dim">
                    <h1 className="f6 fw6 ml2 grey ttc">
                    {this.state.role.role_name}
                    </h1>
                    <i className="material-icons grey mr2  md-21 mt2">
                    keyboard_arrow_down
                    </i>
                </div>
                </Tippy>
                <Tippy
                placement="bottom-end"
                trigger="click"
                duration="0"
                content={
                    <div className="bg-white f6 flex">
                    <div className="db shadow-4">
                        {status.map(d => (
                        <MenuButton
                            key={d.val}
                            text={d.text}
                            className=""
                            onClick={() => this.onChangeStatus(d)}
                        />
                        ))}
                        
                    </div>
                    </div>
                }
                >
                <div className="flex ba b--light-silver br2 pointer dim">
                    <h1 className="f6 fw6 ml2 grey ttc">{this.state.status.text}</h1>
                    <i className="material-icons grey mr2  md-21 mt2">
                    keyboard_arrow_down
                    </i>
                </div>
                </Tippy>
            <Tippy
                placement="bottom-end"
                trigger="click"
                duration="0"
                content={
                    <div className="bg-white f6 flex">
                    <div className="db shadow-4">
                        {range.map(d => (
                        <MenuButton
                            key={d.val}
                            text={d.text}
                            className=""
                            onClick={() => this.onChangeRange(d)}
                        />
                        ))}
                    </div>
                    </div>
                }
                >
                <div className="flex ba b--light-silver br2 pointer dim">
                    <h1 className="f6 fw6 ml2 grey ttc">{this.state.range.text}</h1>
                    <i className="material-icons grey mr2  md-21 mt2">
                    keyboard_arrow_down
                    </i>
                </div>
                </Tippy>
            {/* <CheckboxSelect options={columns} onChange={this.onToggleColumns} /> */}
            </div>
        </div>

        <ListingTable
          ajax={true}
          onFetchData={this.onFetchData}
          data={activeTaskStore.filteredList}
          pages={activeTaskStore.metadata.pages}
          columns={columns}
          isLoading={activeTaskStore.isLoading}
        />
      </div>
    )
  }
}





export default TimesheetApp

// import React from 'react'
// import { observer } from 'mobx-react'
// import {
//   ActiveBadge,
//   CheckboxSelect,
//   TempIssueWidgets,
//   HeaderFilter,
//   ListingTable,
//   DefaultAvatar
// } from '../utils'
// import classNames from 'classnames'
// import Tippy from '@tippy.js/react'

// import timesheetStore from './TimesheetStore';
// import PeopleDashboardStore from './PeopleDashboardStore'
// const MenuButton = ({ icon, text, onClick, className = '' }) => {
//     return (
//       <a
//         className={`pa2 flex link dim pointer items-center ${className}`}
//         onClick={onClick}
//       >
//         <i className="material-icons md-17 pr2">{icon}</i>
//         <span className="pr2">{text}</span>
//       </a>
//     )
//   }

// const range = [
// {
//     text: 'This Week',
//     val: 'this_week'
// },
// {
//     text: 'This Year',
//     val: 'this_year'
// }
// ]
// const roleInit = {
//     role_id: 'all',
//     role_name: 'All Job Roles'
//   }

// const status = [
// {
//     text: 'Select Status',
//     val: 'all'
// },
// {
//     text: 'Open',
//     val: 'open'
// },
// {
//     text: 'Submitted',
//     val: 'submitted'
// },
// {
//     text: 'Approved',
//     val: 'approved'
// },
// {
//     text: 'Declined',
//     val: 'declined'
// }

// ]

// @observer
// class TimesheetApp extends React.Component {
//   constructor(props) {
//     super(props)
//     //timesheetStore.loadActiveTasks()
//     timesheetStore.loadRoles()
//   }
//   state = {
//     status: {text: 'Select Status', val:'all'},
//     role: {role_id: '', role_name: 'All Job Roles'},
//     range: {text: 'This Week', val: 'this_week'},
//     search: '',
//     page: 0,
//     pageSize: 20,

//     columns: [
//       { accessor: 'id', show: false },
//       {
//         headerClassName: 'tl',
//         Header: 'Worker',
//         accessor: 'worker_name',
//         minWidth: 100,
//         Cell: props => {
//             return (
//               <div className="flex items-center">
//                 <img
//                   src={props.row['photo_url']}
//                   style={{
//                     width: '36px',
//                     height: '36px',
//                     borderRadius: '18px'
//                   }}
//                   onError={x => {
//                     x.target.onerror = null
//                     x.target.src = DefaultAvatar
//                   }}
//                 />
//                 <span className="f6 fw6 dark-grey ml2 w-20">{props.value}</span>
//               </div>
//             )
//           }
//       },
//       {
//         headerClassName: 'tl justify-center',
//         Header: 'Role',
//         accessor: 'roles',
//         minWidth: 88,
//         className: 'justify-center ttu'
//       },
//       {
//         headerClassName: 'tl justify-center',
//         Header: 'Total Hours',
//         accessor: 'total_hours',
//         minWidth: 130,
//         className: 'justify-center ttu'
//       },
//       {
//         headerClassName: 'tl justify-center',
//         Header: 'OT',
//         accessor: 'total_ot',
//         minWidth: 130,
//         className: 'justify-center ttu',
//         Cell: props => <span className="">{props.value}</span>
//       },
//       {
//         headerClassName: 'tl',
//         Header: 'Approver',
//         accessor: 'approver',
//         minWidth: 88,
//         Cell: props => <span className="ttc">{props.value}</span>
//       },
//       {
//         headerClassName: 'tl',
//         Header: 'Approve/Decline',
//         accessor: 'id',
//         minWidth: 88,
//         Cell: props => <span className="ttc">{props.value}</span>
//       },
     
//     ]
//   }


// onChangeRoles = role => {
//     this.setState({ role: role }, () => {
//         timesheetStore.roleTerm = role.role_id
//         timesheetStore.loadActiveTasks()
//     })
// }
// onChangeStatus = status => {
//     this.setState({ status: status }, () => {
//         timesheetStore.statusTerm = status.val
//         timesheetStore.loadActiveTasks()
//     })
// }
// onChangeRange = range => {
//     this.setState({ range: range }, () => {
//         timesheetStore.rangeTerm = range.val
//         timesheetStore.loadActiveTasks()
//     })
// }
// onChangeSearch = search => {
//     this.setState({ search: search }, () => {
//         timesheetStore.searchTerm = search 
//         timesheetStore.loadActiveTasks()
//     })
// }

// onFetchData = (state, instance) => {
//     timesheetStore.setFilter({
//         facility_id: this.props.currentFacilityId,
//         page: state.page,
//         limit: state.pageSize

//       })
//   }

//   render() {
//     const { columns } = this.state
//     return (
//       <div className="pa4 mw1200 bg-white">
//        <div className="flex justify-between">
//             <input
//                 type="text"
//                 className="input w5"
//                 placeholder="Search Worker/Approver"
//                 onChange={e => this.onChangeSearch(e.target.value)}
//             />
//         <div className="flex justify-between">
//             <Tippy
//                 placement="bottom-end"
//                 trigger="click"
//                 duration="0"
//                 content={
//                     <div className="bg-white f6 flex">
//                     <div className="db shadow-4">
//                         <MenuButton
//                         key={1}
//                         text={'All Job Roles'}
//                         className=""
//                         onClick={() => this.onChangeRoles(roleInit)}
//                         />
//                         {timesheetStore.roles_loaded
//                         ? timesheetStore.data_roles.map(d => (
//                             <MenuButton
//                                 key={d.role_id}
//                                 text={d.role_name}
//                                 className=""
//                                 onClick={() => this.onChangeRoles(d)}
//                             />
//                             ))
//                         : 'loading...'}
//                     </div>
//                     </div>
//                 }
//                 >
//                 <div className="flex ba b--light-silver br2 pointer dim">
//                     <h1 className="f6 fw6 ml2 grey ttc">
//                     {this.state.role.role_name}
//                     </h1>
//                     <i className="material-icons grey mr2  md-21 mt2">
//                     keyboard_arrow_down
//                     </i>
//                 </div>
//                 </Tippy>
//                 <Tippy
//                 placement="bottom-end"
//                 trigger="click"
//                 duration="0"
//                 content={
//                     <div className="bg-white f6 flex">
//                     <div className="db shadow-4">
//                         {status.map(d => (
//                         <MenuButton
//                             key={d.val}
//                             text={d.text}
//                             className=""
//                             onClick={() => this.onChangeStatus(d)}
//                         />
//                         ))}
                        
//                     </div>
//                     </div>
//                 }
//                 >
//                 <div className="flex ba b--light-silver br2 pointer dim">
//                     <h1 className="f6 fw6 ml2 grey ttc">{this.state.status.text}</h1>
//                     <i className="material-icons grey mr2  md-21 mt2">
//                     keyboard_arrow_down
//                     </i>
//                 </div>
//                 </Tippy>
//             <Tippy
//                 placement="bottom-end"
//                 trigger="click"
//                 duration="0"
//                 content={
//                     <div className="bg-white f6 flex">
//                     <div className="db shadow-4">
//                         {range.map(d => (
//                         <MenuButton
//                             key={d.val}
//                             text={d.text}
//                             className=""
//                             onClick={() => this.onChangeRange(d)}
//                         />
//                         ))}
//                     </div>
//                     </div>
//                 }
//                 >
//                 <div className="flex ba b--light-silver br2 pointer dim">
//                     <h1 className="f6 fw6 ml2 grey ttc">{this.state.range.text}</h1>
//                     <i className="material-icons grey mr2  md-21 mt2">
//                     keyboard_arrow_down
//                     </i>
//                 </div>
//                 </Tippy>
//             {/* <CheckboxSelect options={columns} onChange={this.onToggleColumns} /> */}
//             </div>
//        </div>
        
//         <div className="pv3">
//           <ListingTable
//             ajax={true}
//             onFetchData={this.onFetchData}
//             data={timesheetStore.filteredList}
//             pages={timesheetStore.metadata.pages}
//             columns={columns}
//             isLoading={timesheetStore.isLoading}
//           />
//         </div>
//       </div>
//     )
//   }
// }
// export default TimesheetApp

