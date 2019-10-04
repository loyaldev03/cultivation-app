import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import SeedEditor from './components/SeedEditor'
import rawMaterialStore from './store/RawMaterialStore'
//import loadRawMaterials from './actions/loadRawMaterials'
import {
  ListingTable,
  HeaderFilter,
  formatDate2,
  CheckboxSelect
} from '../../utils'

const openEditor = (event, id) => {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class SeedSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      columns: [
        {
          accessor: 'order_uom',
          show: false
        },
        {
          Header: (
            <HeaderFilter
              title="Strain"
              accessor="strain_name"
              getOptions={rawMaterialStore.getUniqPropValues}
              onUpdate={rawMaterialStore.updateFilterOptions}
            />
          ),
          accessor: 'strain_name',
          headerClassName: 'tl ttc'
        },
        {
          Header: (
            <HeaderFilter
              title="Facility"
              accessor="facility_name"
              getOptions={rawMaterialStore.getUniqPropValues}
              onUpdate={rawMaterialStore.updateFilterOptions}
            />
          ),
          accessor: 'facility_name',
          headerClassName: 'tl'
        },
        {
          Header: (
            <HeaderFilter
              title="Product Name"
              accessor="product_name"
              getOptions={rawMaterialStore.getUniqPropValues}
              onUpdate={rawMaterialStore.updateFilterOptions}
            />
          ),
          accessor: 'product_name',
          headerClassName: 'tl'
        },
        {
          Header: (
            <HeaderFilter
              title="Supplier"
              accessor="supplier"
              getOptions={rawMaterialStore.getUniqPropValues}
              onUpdate={rawMaterialStore.updateFilterOptions}
            />
          ),
          accessor: 'supplier',
          headerClassName: 'tl'
        },
        {
          Header: 'PO Number',
          accessor: 'po_number',
          headerClassName: 'tl'
        },
        {
          Header: 'Invoice No',
          accessor: 'invoice_number',
          headerClassName: 'tl'
        },
        {
          Header: 'Order quantity',
          headerClassName: 'tl',
          accessor: 'order_quantity',
          className: 'justify-end pr3',
          Cell: record => (
            <div className="tc">
              {record.value} {record.row.order_uom}
            </div>
          )
        },
        {
          accessor: 'uom',
          show: false
        },
        {
          Header: 'Quantity',
          headerClassName: 'tl',
          className: 'justify-end pr3',
          accessor: 'quantity',
          Cell: record => (
            <div className="tr">
              {record.value} {record.row.uom}
            </div>
          )
        },
        {
          accessor: 'currency',
          show: false
        },
        {
          Header: 'Cost',
          headerClassName: 'tc',
          accessor: 'cost',
          className: 'justify-end pr3',
          Cell: record => (
            <div className="tr">
              {record.row.currency}{' '}
              {record.value ? record.value.toFixed(2) : 0.0}
            </div>
          )
        },
        {
          Header: '',
          className: 'tc',
          filterable: false,
          accessor: 'id',
          maxWidth: 45,
          Cell: record => (
            <a
              href="#"
              onClick={event => {
                const data = toJS(record.value)
                openEditor(event, data)
              }}
            >
              <i className="material-icons gray">more_horiz</i>
            </a>
          )
        }
      ]
    }
  }
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    //loadRawMaterials('seeds', this.props.facility_id)
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }
  onFetchData = (state, instance) => {
    rawMaterialStore.setFilter({
      facility_id: this.props.facility_id,
      type: this.props.type,
      page: state.page,
      limit: state.pageSize
    })
  }
  onSave = payload => {
    if (payload) {
      rawMaterialStore.loadRawMaterials()
    }
  }

  renderList() {
    const { columns } = this.state
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 grey">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray flex-auto ttc">
              Seeds Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              {this.props.plantPermission.create && (
                <div>
                  <button
                    className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                    onClick={this.onAddRecord}
                  >
                    Add Seed
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between pb2">
            <input
              type="text"
              className="input w5"
              placeholder="Search Product/Invoice/PO"
              onChange={e => {
                rawMaterialStore.searchTerm = e.target.value
              }}
            />
            {/* <CheckboxSelect options={columns} onChange={this.onToggleColumns} /> */}
          </div>

          <ListingTable
            ajax={true}
            onFetchData={this.onFetchData}
            data={rawMaterialStore.filteredList}
            pages={rawMaterialStore.metadata.pages}
            columns={columns}
            isLoading={rawMaterialStore.loading}
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderList()}
        <SeedEditor
          facility_strains={this.props.facility_strains}
          order_uoms={this.props.order_uoms}
          uoms={this.props.uoms}
          onSave={this.onSave}
          facility_id={this.props.facility_id}
          scanditLicense={this.props.scanditLicense}
          canUpdate={this.props.plantPermission.update}
          canCreate={this.props.plantPermission.create}
        />
      </React.Fragment>
    )
  }
}

export default SeedSetupApp
