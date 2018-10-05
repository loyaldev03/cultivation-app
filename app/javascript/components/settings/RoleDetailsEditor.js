import 'babel-polyfill'
import React from 'react'

const permissionOptions = [
  { category: 'Finance', permission: 'Invoices' },
  { category: 'Finance', permission: 'Purchase Order' },
  { category: 'Finance', permission: 'Manifest' },
  { category: 'Finance', permission: 'Cost' },
  { category: 'Finance', permission: 'User costs' },
  { category: 'Finance', permission: 'Expenses' },
  { category: 'Finance', permission: 'Product Sales' },
  { category: 'Finance', permission: 'All users payroll' },
  { category: 'Finance', permission: 'My Direct Reports payroll' },
  { category: 'Finance', permission: 'My Payroll' }
]

const permission2Options = [
  { category: 'Inventory', permission: 'Inventory type' },
  { category: 'Inventory', permission: 'Active plants' },
  { category: 'Inventory', permission: 'Sales Products' },
  { category: 'Inventory', permission: 'Non-sales items' },
  { category: 'Inventory', permission: 'Strain type' }
]

const permission3Options = [
  { category: 'Cultivation', permission: 'Templates' },
  { category: 'Cultivation', permission: 'All batches' },
  {
    category: 'Cultivation',
    permission: 'Batch assigned to my direct reports'
  },
  { category: 'Cultivation', permission: 'Batch assigned to me' },
  { category: 'Cultivation', permission: 'Asssign tasks to all users' },
  {
    category: 'Cultivation',
    permission: 'Assign tasks only to my direct reports'
  },
  { category: 'Cultivation', permission: 'All Tasks' },
  {
    category: 'Cultivation',
    permission: 'Tasks assigned to my direct reports'
  },
  { category: 'Cultivation', permission: 'Tasks assigned to me' },
  { category: 'Cultivation', permission: 'All hours worked' },
  {
    category: 'Cultivation',
    permission: 'Hours assigned to my direct reports'
  },
  { category: 'Cultivation', permission: 'My hours worked ' }
]

const permission4Options = [
  { category: 'Issues', permission: 'All issues' },
  { category: 'Issues', permission: 'Issues reported by my direct reports' },
  { category: 'Issues', permission: 'Issues reported by me' },
  { category: 'Issues', permission: 'Assign tasks to all issues' },
  {
    category: 'Issues',
    permission: 'Assign tasks to issues reported by my direct report'
  }
]

class RoleDetailsEditor extends React.PureComponent {
  constructor(props) {
    super(props)
    if (props.role) {
      this.state = {
        roleId: props.role.id,
        name: props.role.name || '',
        desc: props.role.desc || ''
      }
    } else {
      this.state = {
        roleId: '',
        name: '',
        desc: ''
      }
    }
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  onSubmit = e => {
    e.preventDefault()
    console.log('Submit clicked')
    // TODO: Call props onSave
  }

  render() {
    const { onClose, isSaving } = this.props
    const { name, desc } = this.state
    const saveButtonText = isSaving ? 'Saving...' : 'Save'
    return (
      <div className="h-100 flex flex-auto flex-column">
        <div className="ph4 pv3 bb b--light-grey">
          <h5 className="h6--font dark-grey ma0">Role Details</h5>
          <a
            href="#0"
            className="slide-panel__close-button dim"
            onClick={onClose}
          >
            <i className="material-icons mid-gray md-18 pa1">close</i>
          </a>
        </div>
        <form
          className="pt3 flex-auto flex flex-column justify-between"
          onSubmit={this.onSubmit}
        >
          <div className="ph4">
            <div className="mt2 fl w-100">
              <div className="w-100 fl pr3">
                <label className="f6 fw6 db mb1 gray ttc">Name</label>
                <input
                  className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('name')}
                  value={name}
                  required={true}
                />
              </div>
            </div>
            <div className="mt2 fl w-100">
              <div className="w-100 fl">
                <label className="f6 fw6 db mb1 gray ttc">Description</label>
                <textarea
                  className="db w-100 h3 pa2 f6 black ba b--black-20 br2 outline-0 no-spinner"
                  onChange={this.onChangeInput('desc')}
                  value={desc}
                />
              </div>
            </div>
            <div className="mt3 fl w-100">
              <table className="w-100 f6">
                <tbody>
                  <tr className="pv2">
                    <th className="bb b--light-grey dark-gray">Permission</th>
                    <th className="bb b--light-grey dark-gray">View</th>
                    <th className="bb b--light-grey dark-gray">Edit</th>
                    <th className="bb b--light-grey dark-gray">Create</th>
                    <th className="bb b--light-grey dark-gray">Delete</th>
                  </tr>
                  <tr>
                    <td colSpan="5" className="pt2">
                      <span className="underline b">Finance</span>
                    </td>
                  </tr>
                  {permissionOptions.map(p => (
                    <tr key={p.permission}>
                      <td>
                        <span className="db ml3 pv1">{p.permission}</span>
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="pt2">
                      <span className="underline b">Inventory</span>
                    </td>
                  </tr>
                  {permission2Options.map(p => (
                    <tr key={p.permission}>
                      <td>
                        <span className="db ml3 pv1">{p.permission}</span>
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan="5" className="pt2">
                      <span className="underline b">Cultivation</span>
                    </td>
                  </tr>
                  {permission3Options.map(p => (
                    <tr key={p.permission}>
                      <td>
                        <span className="db ml3 pv1">{p.permission}</span>
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                    </tr>
                  ))}

                  <tr>
                    <td colSpan="5" className="pt2">
                      <span className="underline b">Issues</span>
                    </td>
                  </tr>
                  {permission4Options.map(p => (
                    <tr key={p.permission}>
                      <td>
                        <span className="db ml3 pv1">{p.permission}</span>
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                      <td className="tc">
                        <input type="checkbox" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mv3 bt fl w-100 b--light-grey pt3 ph4">
            <input
              type="submit"
              value={saveButtonText}
              className="fr ph3 pv2 bg-orange button--font white bn box--br3 ttu link dim pointer"
            />
          </div>
        </form>
      </div>
    )
  }
}

export default RoleDetailsEditor
