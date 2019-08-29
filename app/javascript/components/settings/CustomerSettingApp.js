import React from 'react'
import { observer } from 'mobx-react'
import { HeaderFilter, ListingTable } from '../utils'
import CustomerEditor from './CustomerEditor'
import { action, observable, computed, autorun } from 'mobx'
import isEmpty from 'lodash.isempty'
import {
    decimalFormatter,
    formatDate2,
    httpGetOptions,
    ActiveBadge,
    CheckboxSelect,
    Loading,
    formatAgo,
    TempTaskWidgets,
    httpPostOptions
  } from '../utils'
import CustomerStore from './CustomerStore'

@observer
class CustomerSettingApp extends React.Component {
  state = {
    columns: [
      {
        accessor: 'id',
        show: false
      },
      {
        headerClassName: 'tl',
        Header: 'Account No',
        accessor: 'account_no',
        minWidth: 150,
        className: 'ttc',
       
     
      },
      {
        headerClassName: 'tl',
        Header: 'Name',
        accessor: 'name',
        minWidth: 150,
        className: 'ttc'
      },
      {
        Header: (
          <HeaderFilter
            title="Status"
            accessor="status"
            getOptions={CustomerStore.getUniqPropValues}
            onUpdate={CustomerStore.updateFilterOptions}
          />
        ),
        accessor: 'status'
        
      },
      {
        headerClassName: 'tl',
        Header: 'Show Details/Edit',
        accessor: 'id',
        className: 'ttc',
        Cell: props => {
            return(
                <div className="center">
                    <a href="#0" className="link orange" onClick={e => this.openCustomer(e, props.index)}>
                        <i className="material-icons md-600 md-17 ph2">
                            create
                        </i>
                    </a>
                </div>
               
            )
        }
      },
    ]
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    CustomerStore.loadCustomer()
  }

  openSidebar = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }


  openCustomer(event, index) {
    const id = CustomerStore.items.slice()[index].id
    window.editorSidebar.open({ width: '500px', customer_id: id })
    event.preventDefault()
  }

  render() {
    const { columns } = this.state
    return (
      <React.Fragment>
        <div id="toast" className="toast" />
        <div className="pa4">
          <div className="bg-white box--shadow pa4 fl w-100">
            <div className="fl w-100-l w-100-m">
              <div className="pb4 ph3">
                <div className="flex justify-between mt3 mb4">
                    <h1 className="mv0 f3 fw4 dark-gray">Customers</h1>
                    <div>
                        <button
                        className="btn btn--primary btn--small"
                        onClick={this.openSidebar}
                        >
                        Add Customer
                        </button>
                    </div>
                </div>
                <p className="grey">
                  Click on the edit icon to edit information
                </p>
                <ListingTable
                  data={CustomerStore.filteredList}
                  columns={columns}
                  isLoading={CustomerStore.isLoading}
                  showPagination={true}
                />
              </div>
            </div>
          </div>
        </div>
        <CustomerEditor
              isOpened={false}
              //facility_id={this.props.facility_id}
        />
        
      </React.Fragment>
    )
  }
}

export default CustomerSettingApp
