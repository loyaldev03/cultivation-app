import React from 'react'
import { observer } from 'mobx-react'
import SidebarStore from '../stores/SidebarStore'
import { SlidePanelHeader, toast, SlidePanelFooter } from '../../utils'
import { InputBarcode } from '../../utils/InputBarcode'
import { ProgressBar } from '../../utils/ProgressBar'
import { httpGetOptions, httpPostOptions } from '../../utils/FetchHelper'

@observer
class CreatePackageForm extends React.Component {
  state = {
    errors: {},
    packagePlans: []
  }

  async componentDidUpdate(prevProps) {
    if (!prevProps.show && this.props.show) {
      const nestedPackagePlans = await loadPackagePlans(this.props.batchId)

      // Flatten it up
      const packagePlans = []
      nestedPackagePlans.forEach(element => {
        const { product_type, id: product_type_plan_id } = element
        element.package_plans.forEach(plan => {
          packagePlans.push({
            product_type,
            product_type_plan_id,
            id: plan.id,
            package_type: plan.package_type,
            quantity: plan.quantity
          })
        })
      })

      this.setState({ packagePlans })
    }
  }

  render() {
    const { packagePlans } = this.state

    return (
      <div className="flex flex-column h-100">
        <div id="toast" className="toast animated toast--success" />
        <SlidePanelHeader
          onClose={() => SidebarStore.closeSidebar()}
          title={'Pack the harvest'}
        />

        <div className="flex flex-column flex-auto">
          <div className="ph4 mt3 flex">
            <span className="f6 fw6 gray">Select the packing type</span>
          </div>
          <div className="mh4 mt3 flex flex-column gray mb4 ba b--black-20 br2">
            {packagePlans.map(x => (
              <PackageTracking
                key={x.id}
                product_type={x.product_type}
                package_type={x.package_type}
                quantity={x.quantity}
                batchId={this.props.batchId}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }
}

export default CreatePackageForm

class PackageTracking extends React.Component {
  state = {
    expanded: false,
    inScanMode: false,
    packageID: '',
    packageIDs: [],
    errors: null
  }

  async componentDidMount() {
    const data = await loadScannedPackages(
      this.props.batchId,
      this.props.product_type,
      this.props.package_type
    )
    const packageIDs = data.map(x => ({
      id: x.id,
      tag: x.tag
    }))

    const inScanMode = data.length > 0
    this.setState({ packageIDs, inScanMode })
  }

  onToggleExpand = event => {
    event.preventDefault()
    this.setState({ expanded: !this.state.expanded })
  }

  onEnterScanMode = event => {
    event.preventDefault()
    this.setState({
      inScanMode: true
    })
  }

  onAddPackageID = event => {
    if (event.key === 'Enter') {
      const tag = event.target.value
      const data = {
        product_type: this.props.product_type,
        package_type: this.props.package_type,
        cultivation_batch_id: this.props.batchId,
        tag
      }

      scanAndCreate(data).then(result => {
        if (result.isValid) {
          const newPackage = {
            id: result.package.id,
            tag: result.package.package_tag
          }
          this.setState({
            packageID: '',
            packageIDs: [newPackage, ...this.state.packageIDs],
            errors: null
          })
        } else {
          this.setState({ errors: result.errors })
        }
      })
    }
  }

  onChangePackageID = event => {
    const packageID = event.target.value
    this.setState({ packageID })
  }

  renderError(showScanner) {
    if (!this.state.errors) {
      return null
    }

    return <div className="f6 i red mb3">{this.state.errors}</div>
  }

  renderScanMode() {
    if (!this.state.inScanMode) {
      return null
    }

    const { packageID, packageIDs } = this.state
    const showScanner = packageIDs.length < this.props.quantity

    return (
      <div className="flex flex-column w-100 mt3 ph3">
        {showScanner && (
          <InputBarcode
            scanditLicense={'xxx'}
            autoFocus={true}
            value={packageID}
            onChange={this.onChangePackageID}
            onKeyPress={this.onAddPackageID}
            className="w-100 f6"
          />
        )}
        {showScanner && this.renderError()}
        <div
          className="overflow-y-scroll ph2"
          style={{ maxHeight: '200px', minHeight: '50px' }}
        >
          <table className="f6 gray w-100 collapse">
            <thead className="bb b--black-20">
              <tr>
                <th className="tl pa2">Package type</th>
                <th className="tl pa2">Package ID</th>
              </tr>
            </thead>
            <tbody>
              {packageIDs.map((x, index) => (
                <tr key={`${x.tag}.${index}`}>
                  <td className="pa2">{this.props.package_type}</td>
                  <td className="pa2">{x.tag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  renderExpanded() {
    if (!this.state.expanded) {
      return null
    }
    const { inScanMode } = this.state
    const percent = (this.state.packageIDs.length / this.props.quantity) * 100
    return (
      <div className="mt3 pb3 flex flex-column items-center  bb b--black-20">
        <div className="ph2 w-100">
          <ProgressBar percent={percent} height={10} className="w-100" />
        </div>
        {!inScanMode && (
          <div className="mt3 mb3">
            <a
              href="#"
              className="btn btn--primary btn-small f6"
              onClick={this.onEnterScanMode}
            >
              Confirmed packed & create ID
            </a>
          </div>
        )}
        {this.renderScanMode()}
      </div>
    )
  }

  render() {
    const { product_type, package_type, quantity } = this.props
    const { expanded, packageIDs } = this.state

    return (
      <div
        className={`flex flex-column ${expanded && 'bg-black-05'} ${!expanded &&
          'pb3'}`}
      >
        <div
          className="ph2 pt3 flex items-center pointer"
          onClick={this.onToggleExpand}
        >
          <i className="material-icons icon--medium black-20">
            {!expanded && 'keyboard_arrow_up'}
            {expanded && 'keyboard_arrow_down'}
          </i>

          <div className="f6 gray ml2 flex-auto">
            <span className="fw6 mr2">{product_type}</span>
            <span>{package_type}</span>
          </div>
          <div className="f6 gray">
            {packageIDs.length} / {quantity}
          </div>
        </div>
        {this.renderExpanded()}
      </div>
    )
  }
}

const loadPackagePlans = async batchId => {
  const url = `/api/v1/batches/${batchId}/product_plans`
  const response = await (await fetch(url, httpGetOptions)).json()
  if (response.data) {
    return response.data.map(x => x.attributes)
  } else {
    return []
  }
}

const loadScannedPackages = async (batchId, productType, packageType) => {
  const product_type = encodeURI(productType)
  const package_type = encodeURI(packageType)
  const url = `/api/v1/sales_products/harvest_products/${batchId}?product_type=${product_type}&package_type=${package_type}`
  const response = await (await fetch(url, httpGetOptions)).json()
  return response
}

const scanAndCreate = async data => {
  const url = '/api/v1/sales_products/scan_and_create'
  const response = await fetch(url, httpPostOptions(data))
  const result = await response.json()
  // console.log(result)

  if (response.ok) {
    return {
      isValid: true,
      package: { id: result.data.id, ...result.data.attributes }
    }
  } else {
    let errors = ''
    for (let attr in result.errors) {
      errors += result.errors[attr] + '. '
    }

    return {
      isValid: false,
      errors
    }
  }
}
