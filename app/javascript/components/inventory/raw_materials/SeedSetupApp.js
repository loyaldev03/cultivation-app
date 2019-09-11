import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import SeedEditor from './components/SeedEditor'
import rawMaterialStore from './store/RawMaterialStore'
import loadRawMaterials from './actions/loadRawMaterials'
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
          Header: 'Strain',
          accessor: 'facility_strain.strain_name',
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
          Header: 'Supplier',
          accessor: 'vendor.name',
          headerClassName: 'tl'
        },
        {
          Header: 'PO Number',
          accessor: 'purchase_order.purchase_order_no',
          headerClassName: 'tl'
        },
        {
          Header: 'Invoice No',
          accessor: 'vendor_invoice.invoice_no',
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
          accessor: 'vendor_invoice.item_price',
          show: false
        },
        {
          Header: 'Cost',
          headerClassName: 'tc',
          accessor: 'vendor_invoice.item_currency',
          Cell: record => (
            <div className="tr">
              {record.value} &nbsp;
              {(
                parseFloat(record.row.order_quantity) *
                parseFloat(record.row['vendor_invoice.item_price'])
              ).toFixed(2)}
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
    loadRawMaterials('seeds', this.props.facility_id)
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
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
              placeholder="Search Product Name/ Strain/ PO No"
              onChange={e => {
                rawMaterialStore.filter = e.target.value
              }}
            />
            {/* <CheckboxSelect options={columns} onChange={this.onToggleColumns} /> */}
          </div>

          <ListingTable
            columns={columns}
            data={rawMaterialStore.filteredList}
            className="f6 -highlight"
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
