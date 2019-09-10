import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanelHeader, SlidePanelFooter, reactSelectStyle } from '../../utils'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import CustomerStore from '../../settings/CustomerStore'
import { toJS } from 'mobx'

@observer
class CreateOrderSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customer: '',
      selectedUsers: []
    }
  }
  componentDidMount() {
  }

  setPackages = (packages) => {
    console.log(packages)
    this.setState({
      packages: packages
    })
  }

  onDeletePackage = (p) =>{
    this.setState({
      packages: this.state.packages.filter(e => e !== p)
    })
  }

  onSave = async () => {
    await this.props.onSave(this.state)
  }

  onChangeCustomer = (customer) => {
    console.log('change')

    if (customer) {
      if (customer.__isNew__) {
        console.log('customer new')
        this.setState({
          customer,
          customer_id: '',
          state_license: '',
          address: '',
          mobile_number: ''
        })
      } else {
        console.log('customer exist clicked')
        console.log(customer)
        const cust = CustomerStore.items.find(e => e.id === customer.value)
        this.setState({
          customer,
          customer_id: cust.id,
          state_license: cust.state_license,
          address: cust.addresses[0].address,
          mobile_number: cust.addresses[0].mobile_number
        })
      }
    } else {
      this.setState({
        customer,
        customer_id: '',
        state_license: '',
        address: '',
        mobile_number: ''
      })
    }


  }


  onChange = (key, e) => {
    this.setState({[key]: e.target.value})
  }

  render() {
    const { onClose } = this.props
    const { state_license, address, mobile_number} = this.state
    const customers = CustomerStore.items.map(e => ({label: e.name, value: e.id}))
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="flex flex-column">
            <h1 className="pa3 f4">Order #1283619</h1>
            <div className="pa3 flex justify-between bg-light-gray ">
              <label>Package selected </label>
              <label>{this.state.packages ? this.state.packages.length : '0'} items</label>
            </div>

            <div className="pa2 mt3">
              <div className="pa2 flex mb2 bb b--light-silver">
                <label className="w-30 f6">Package Name </label>
                <label className="w-30 f6">Package Type </label>
                <label className="w-30 f6">Package ID/Tag </label>
                <label className="w-20 f6">Qty</label>
                <label className="w-10 f6"> </label>
              </div>
              {this.state.packages &&
                this.state.packages.map(e => (
                  <div className="pa2 flex">
                    <label className="w-30 f6">{e.product.name}</label>
                    <label className="w-30 f6">{e.uom} </label>
                    <label className="w-30 f6">{e.package_tag} </label>
                    <label className="w-20 f6">{e.quantity}</label>
                    <label className="w-10 f6">
                      <i 
                        className="material-icons red pointer f6"
                        onClick={f => this.onDeletePackage(e)}
                      >
                        delete
                      </i>
                    </label>

                  </div>
                ))
                }
            </div>

            <div className="pa3 flex justify-between bg-light-gray mt5">
              <label>Customer Info </label>
            </div>

            <div className="pa3">
              <div className="flex mt3">
                <div className="w-20">
                  <label className="f6">Customer Name</label>
                </div>
                <div className="w-50">
                  <AsyncCreatableSelect
                    isClearable
                    noOptionsMessage={() => 'Type to search customers ...'}
                    placeholder={'Search...'}
                    defaultOptions={customers}
                    styles={reactSelectStyle}
                    value={this.state.customer}
                    onChange={this.onChangeCustomer}
                  />
                </div>
              </div>
              <div className="flex mt4">
                <div className="w-20">
                  <label className="f6">State License #</label>
                </div>
                <div className="w-50">
                  <input
                    value={state_license}
                    className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
                    type="text"
                    onChange={e => this.onChange('state_license', e)}
                  />
                </div>
              </div>



              <div className="flex mt4">
                <div className="w-20">
                  <label className="f6">Address</label>
                </div>
                <div className="w-50">
                  <input
                    value={address}
                    className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
                    type="text"
                    onChange={e => this.onChange('address', e)}
                  />
                </div>
              </div>


              <div className="flex mt4">
                <div className="w-20">
                  <label className="f6">Phone</label>
                </div>
                <div className="w-50">
                  <input
                    value={mobile_number}
                    className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
                    type="text"
                    onChange={e => this.onChange('mobile_number', e)}
                  />
                </div>
              </div>
            </div>
            

          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

export default CreateOrderSidebar
