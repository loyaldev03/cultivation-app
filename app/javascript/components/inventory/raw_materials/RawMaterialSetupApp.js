import 'babel-polyfill'
import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import RawMaterialEditor from './components/RawMaterialEditor'
import rawMaterialStore from './store/RawMaterialStore'
import loadRawMaterials from './actions/loadRawMaterials'

const columns = raw_material_type_label => [
  {
    Header: raw_material_type_label,
    accessor: 'attributes.catalogue',
    headerClassName: 'tl ttc'
  },
  {
    Header: 'Product Name',
    accessor: 'attributes.product_name',
    headerClassName: 'tl'
  },
  {
    Header: 'Supplier',
    accessor: 'attributes.vendor.name',
    headerClassName: 'tl'
  },
  {
    Header: 'PO Number',
    accessor: 'attributes.purchase_order.purchase_order_no',
    headerClassName: 'tl'
  },
  {
    Header: 'Invoice No',
    accessor: 'attributes.vendor_invoice.invoice_no',
    headerClassName: 'tl'
  },
  {
    Header: 'Order quantity',
    headerClassName: 'tr',
    Cell: record => (
      <div className="tr">
        {record.original.attributes.order_quantity}{' '}
        {record.original.attributes.order_uom}
      </div>
    )
  },
  {
    Header: 'Quantity',
    headerClassName: 'tr',
    Cell: record => (
      <div className="tr">
        {record.original.attributes.quantity} {record.original.attributes.uom}
      </div>
    )
  },
  {
    Header: 'Cost',
    headerClassName: 'tr',
    Cell: record => (
      <div className="tr">
        {record.original.attributes.vendor_invoice.item_currency} &nbsp;
        {(
          parseFloat(record.original.attributes.order_quantity) *
          parseFloat(record.original.attributes.vendor_invoice.item_price)
        ).toFixed(2)}
      </div>
    )
  },
  {
    Header: '',
    className: 'tc',
    filterable: false,
    maxWidth: 45,
    Cell: record => (
      <a
        href="#"
        onClick={event => {
          const data = toJS(record.original.id)
          openEditor(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

const openEditor = (event, id) => {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class RawMaterialSetupApp extends React.Component {
  constructor(props) {
    super(props)
    this.label = props.raw_material_type.replace(/[_]/g, ' ')
    this.title = this.label.endsWith('s')
      ? this.label + ' inventory'
      : this.label + 's inventory'
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadRawMaterials(this.props.raw_material_type, this.props.facility_id)
  }

  openSidebar() {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  onAddRecord = () => {
    this.openSidebar()
  }

  renderList() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 grey">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray flex-auto ttc">{this.title}</h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                onClick={this.onAddRecord}
              >
                Add {this.label}
              </button>
            </div>
          </div>

          <ReactTable
            columns={columns(this.label)}
            pagination={{ position: 'top' }}
            data={rawMaterialStore.bindable}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6"
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderList()}
        <RawMaterialEditor
          order_uoms={this.props.order_uoms}
          raw_material_type={this.props.raw_material_type}
          catalogues={this.props.catalogues}
          facility_id={this.props.facility_id}
          uoms={this.props.uoms}
          scanditLicense={this.props.scanditLicense}
        />
      </React.Fragment>
    )
  }
}

export default RawMaterialSetupApp
