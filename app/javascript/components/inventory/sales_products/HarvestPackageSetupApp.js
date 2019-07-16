import React from 'react'
import PropTypes from 'prop-types'
import { toJS } from 'mobx'
import { observer } from 'mobx-react'
import ReactTable from 'react-table'
import Tippy from '@tippy.js/react'
import { toast } from '../../utils'
import { formatDate } from '../../utils/DateHelper'
import HarvestPackageEditor from './components/HarvestPackageEditor'
import harvestPackageStore from './store/HarvestPackageStore'
import loadHarvestPackages from './actions/loadHarvestPackages'

import ConvertPackagePlanForm from '../../cultivation/tasks_setup/components/ConvertPackagePlanForm'
import { SlidePanel } from '../../utils'

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

const MenuButton = ({ icon, indelible, text, onClick, className = '' }) => {
  return (
    <a
      className={`pa2 flex link dim pointer items-center ${className}`}
      onClick={onClick}
    >
      {icon ? (
        <i className="material-icons md-17 pr2">{icon}</i>
      ) : indelible == 'add_nutrient' ? (
        <img src={MyImage} style={{ width: '2em' }} />
      ) : (
        ''
      )}
      <span className="pr2">{text}</span>
    </a>
  )
}

@observer
class HarvestPackageSetupApp extends React.Component {
  state = {
    idOpen: '',
    showCreatePackagePlan: false,
    showEditor: false
  }

  componentDidMount() {
    const sidebarNode = document.querySelector('[data-role=sidebar]')
    // window.editorSidebar.setup(sidebarNode)
    loadHarvestPackages(this.props.facility_id)
  }

  openHarvestPackage = (event, id) => {
    this.setState({ showEditor: true, idOpen: id })
    event.preventDefault()
  }

  onAddRecord = e => {
    // window.editorSidebar.open({ width: '500px' }) // this is a very awkward way to set default sidepanel width
    this.setState({ showEditor: true })
    e.preventDefault()
  }

  onShowCreatePackagePlan = id => {
    // somehow pass the id into the form
    this.setState({ showCreatePackagePlan: true, idOpen: id })
  }

  tableColumns = (locations, harvest_batches) => [
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
      Header: 'Product Type',
      accessor: 'attributes.catalogue.label',
      headerClassName: 'tl'
    },
    {
      Header: 'Strain',
      accessor: 'attributes.catalogue.label',
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
      Cell: this.renderActions
    }
  ]

  renderActions = record => {
    const id = toJS(record.original.id)

    return (
      <span className="pointer">
        <Tippy
          placement="bottom-end"
          trigger="click"
          content={
            this.state.idOpen === record.id ? (
              <div className="bg-white f6 flex grey">
                <div className="db shadow-4">
                  <MenuButton
                    icon="edit"
                    text="Edit"
                    onClick={e => {
                      this.openHarvestPackage(event, id)
                    }}
                  />
                  <MenuButton
                    icon="settings"
                    text="Convert product"
                    onClick={e => this.onShowCreatePackagePlan(id)}
                  />
                </div>
              </div>
            ) : (
              ''
            )
          }
        >
          <i
            onClick={() => {
              this.setState({ idOpen: record.id })
            }}
            className="material-icons gray"
          >
            more_horiz
          </i>
        </Tippy>
      </span>
    )
  }

  onSave = data => {
    if (data.toast) {
      toast(data.toast.message, data.toast.type)
    }

    if (data.hideSidebar) {
      this.setState({ showCreatePackagePlan: false })
    }
  }

  render() {
    const { locations, harvest_batches } = this.props
    const { showEditor, showCreatePackagePlan, idOpen } = this.state

    return (
      <React.Fragment>
        <div id="toast" className="toast animated toast--success" />
        <div className="w-100 bg-white pa3">
          <div className="flex mb4 mt2">
            <h1 className="mv0 f3 fw4 dark-gray  flex-auto">
              Package Inventory
            </h1>
            <div style={{ justifySelf: 'end' }}>
              <button
                className="pv2 ph3 bg-orange white bn br2 ttu link dim f6 fw6 pointer"
                onClick={this.onAddRecord}
              >
                Add Package
              </button>
            </div>
          </div>

          <ReactTable
            columns={this.tableColumns(locations, harvest_batches)}
            pagination={{ position: 'top' }}
            data={harvestPackageStore.bindable}
            showPagination={false}
            pageSize={30}
            minRows={5}
            filterable
            className="f6 -highlight"
          />
          <SlidePanel
            width="500px"
            show={showEditor}
            renderBody={props => (
              <HarvestPackageEditor
                packageId={idOpen}
                facility_strains={this.props.facility_strains}
                drawdown_uoms={this.props.drawdown_uoms}
                harvest_batches={this.props.harvest_batches}
                sales_catalogue={this.props.sales_catalogue}
                facility_id={this.props.facility_id}
                onClose={() => {
                  this.setState({ showEditor: false, idOpen: '' })
                }}
              />
            )}
          />
          <SlidePanel
            width="500px"
            show={showCreatePackagePlan}
            renderBody={props => (
              <ConvertPackagePlanForm
                show={showCreatePackagePlan}
                packageId={idOpen}
                users={this.props.users}
                onClose={() => this.setState({ showCreatePackagePlan: false })}
                sales_catalogue={this.props.sales_catalogue}
                onSave={this.onSave}
              />
            )}
          />
        </div>
      </React.Fragment>
    )
  }
}

HarvestPackageSetupApp.propTypes = {
  facility_strains: PropTypes.array.isRequired,
  harvest_batches: PropTypes.array.isRequired,
  sales_catalogue: PropTypes.array.isRequired,
  drawdown_uoms: PropTypes.array.isRequired,
  users: PropTypes.array.isRequired
}

export default HarvestPackageSetupApp
