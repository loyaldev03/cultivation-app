import 'babel-polyfill'
import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import { formatDate } from '../../utils/DateHelper'
import ConvertProductEditor from './components/ConvertProductEditor'
import loadProducts from './actions/loadConvertedProducts'
import convertedProductStore from './store/ConvertedProductStore'

const columns = locations => [
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
    Header: 'Location',
    accessor: 'attributes.location_name',
    headerClassName: 'tl'
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
          openConvertProduct(event, data)
        }}
      >
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

const openConvertProduct = (event, id) => {
  window.editorSidebar.open({ width: '500px', id })
  event.preventDefault()
}

@observer
class ConvertProductSetupApp extends React.Component {
  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    window.editorSidebar.setup(sidebarNode)
    loadProducts(this.props.facility_id)
  }

  onAddRecord = () => {
    window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
  }

  render() {
    return (
      <div className="w-100 bg-white pa3">
        <div className="flex mb4 mt2">
          <h1 className="mv0 f3 fw4 dark-gray  flex-auto">Converted Product</h1>
          <div style={{ justifySelf: 'end' }}>
            <button
              className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
              onClick={this.onAddRecord}
            >
              Add Converted Product
            </button>
          </div>
        </div>

        <ReactTable
          columns={columns(this.props.locations)}
          pagination={{ position: 'top' }}
          data={convertedProductStore.bindable}
          showPagination={false}
          pageSize={30}
          minRows={5}
          filterable
          className="f6"
        />
        <ConvertProductEditor
          sales_catalogue={this.props.sales_catalogue}
          breakdown_uoms={this.props.breakdown_uoms}
          scanditLicense={this.props.scanditLicense}
          facility_id={this.props.facility_id}
        />
      </div>
    )
  }
}

ConvertProductSetupApp.propTypes = {
  sales_catalogue: PropTypes.array.isRequired,
  breakdown_uoms: PropTypes.array.isRequired,
  scanditLicense: PropTypes.string.isRequired
}

export default ConvertProductSetupApp
