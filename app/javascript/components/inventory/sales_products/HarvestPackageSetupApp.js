import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import HarvestPackageEditor from './components/HarvestPackageEditor'

const columns = [
  {
    Header: 'Package Tag',
    accessor: 'attributes.catalogue',
    headerClassName: 'tl'
  },
  {
    Header: 'Name',
    accessor: 'attributes.vendor.name',
    headerClassName: 'tl'
  },
  {
    Header: 'Item/ Type',
    accessor: 'attributes.product_name',
    headerClassName: 'tl'
  },
  {
    Header: 'Quantity',
    accessor: 'attributes.purchase_order.purchase_order_no',
    headerClassName: 'tr',
    Cell: record => (
      <div className="tr">
        {record.original.attributes.order_quantity}{' '}
        {record.original.attributes.order_uom}
      </div>
    )
  },
  {
    Header: 'Harvest name',
    accessor: 'attributes.vendor_invoice.invoice_no',
    headerClassName: 'tl'
  },
  {
    Header: 'Price',
    headerClassName: 'tr',
    accessor: 'attributes.vendor_invoice.price'
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
class HarvestPackageSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    // loadRawMaterials('nutrients')
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  renderSalesProductList() {
    return (
      <React.Fragment>
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Harvest Package Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                onClick={this.onAddRecord}
              >
                Add Harvest Package
              </button>
            </div>
          </div>

          <ReactTable
            columns={columns}
            pagination={{ position: 'top' }}
            data={[]}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6"
          />
          <HarvestPackageEditor 
            facility_strains={this.props.facility_strains}
            locations={this.props.locations}
            drawdown_uoms={this.props.drawdown_uoms}
            harvest_batches={this.props.harvest_batches}
            sales_catalogue={this.props.sales_catalogue}
          />
        </div>
      </React.Fragment>
    )
  }

  render() {
    return <React.Fragment>{this.renderSalesProductList()}</React.Fragment>
  }
}


HarvestPackageSetupApp.propTypes = {
  facility_strains: PropTypes.array.isRequired,
  locations: PropTypes.array.isRequired,
  harvest_batches: PropTypes.array.isRequired,
  sales_catalogue: PropTypes.array.isRequired,
  drawdown_uoms: PropTypes.array.isRequired
}


export default HarvestPackageSetupApp
