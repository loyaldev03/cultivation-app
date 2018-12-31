import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import NonSalesItemEditor from './components/NonSalesItemEditor'
import nonSalesItemStore from './store/NonSalesItemStore'
import loadNonSalesItems from './actions/loadNonSalesItems'

const columns = [
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
        {record.original.attributes.order_quantity}{' '}
        {record.original.attributes.order_uom}
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
          openItem(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openItem(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class NonSalesItemsSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadNonSalesItems()
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  renderNonSalesItemsList() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Non-Sales Item Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                onClick={this.onAddRecord}
              >
                Add item
              </button>
            </div>
          </div>

          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={nonSalesItemStore.bindable}
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
        {this.renderNonSalesItemsList()}
        <NonSalesItemEditor
          locations={this.props.locations}
          order_uoms={this.props.order_uoms}
          catalogues={this.props.catalogues}
        />
      </React.Fragment>
    )
  }
}

export default NonSalesItemsSetupApp
