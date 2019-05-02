import 'babel-polyfill'
import React from 'react'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import NutrientEditor from './components/NutrientEditor'
import RawMaterialStore from './store/RawMaterialStore'
import loadRawMaterials from './actions/loadRawMaterials'

const columns = [
  {
    accessor: 'attributes.catalogue',
    show: false
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
    Header: 'Quantity',
    headerClassName: 'tr',
    Cell: record => (
      <div className="w-100 tr">
        {record.original.attributes.order_quantity}{' '}
        {record.original.attributes.order_uom}
      </div>
    )
  },
  {
    Header: 'Cost',
    headerClassName: 'tr',
    Cell: record => (
      <div className="w-100 tr">
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
          openNutrient(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openNutrient(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class NutrientsSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadRawMaterials('nutrients', this.props.facility_id)
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' })
  }

  render() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3 grey">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Nutrients Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                onClick={this.onAddRecord}
              >
                Add nutrient
              </button>
            </div>
          </div>
          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={RawMaterialStore.bindable}
            loading={RawMaterialStore.isLoading}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6 -highlight"
          />
        </div>
        <NutrientEditor
          order_uoms={this.props.order_uoms}
          uoms={this.props.uoms}
          catalogue_id={this.props.catalogue_id}
          facility_id={this.props.facility_id}
          scanditLicense={this.props.scanditLicense}
        />
      </React.Fragment>
    )
  }
}

export default NutrientsSetupApp
