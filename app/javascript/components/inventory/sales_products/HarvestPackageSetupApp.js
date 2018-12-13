import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import { formatDate } from '../../utils/DateHelper'
import HarvestPackageEditor from './components/HarvestPackageEditor'
import harvestPackageStore from './store/HarvestPackageStore'
import loadHarvestPackages from './actions/loadHarvestPackages'

const resolveBatchName = (harvest_batch_id, other_harvest_batch, batches) => {
  if (harvest_batch_id.length > 0) {
    const result = batches.find(x => x.id === harvest_batch_id)
    if (result) {
      return `${result.attributes.harvest_name} (${
        result.attributes.strain_name
      })`
    } else {
      return 'N/A'
    }
  } else {
    return other_harvest_batch
  }
}
const columns = (locations, harvest_batches) => [
  {
    Header: 'Package Tag',
    accessor: 'attributes.package_tag',
    headerClassName: 'tl'
  },
  {
    Header: 'Product Name',
    accessor: 'attributes.product.name',
    headerClassName: 'tl'
  },
  {
    Header: 'Product Code/ SKU',
    accessor: 'attributes.product.sku',
    headerClassName: 'tl'
  },
  {
    Header: 'Product Type',
    accessor: 'attributes.catalogue.label',
    headerClassName: 'tl'
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
    Header: 'Location',
    headerClassName: 'tl',
    Cell: record => (
      <div className="tl">
        {
          locations.find(x => x.rm_id == record.original.attributes.location_id)
            .rm_name
        }
      </div>
    )
  },
  {
    Header: 'Harvest batch',
    headerClassName: 'tl',
    Cell: record => (
      <div className="tl">
        {resolveBatchName(
          record.original.attributes.harvest_batch_id,
          record.original.attributes.other_harvest_batch,
          harvest_batches
        )}
      </div>
    )
  },
  {
    Header: 'Production',
    headerClassName: 'tr',
    Cell: record => (
      <div className="tr">
        {formatDate(record.original.attributes.production_date)}
      </div>
    )
  },
  {
    Header: 'Expiration',
    headerClassName: 'tr',
    Cell: record => (
      <div className="tr">
        {formatDate(record.original.attributes.expiration_date)}
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
          openHarvestPackage(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openHarvestPackage(event, id) {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class HarvestPackageSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadHarvestPackages()
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
            columns={columns(this.props.locations, this.props.harvest_batches)}
            pagination={{ position: 'top' }}
            data={harvestPackageStore.bindable}
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
