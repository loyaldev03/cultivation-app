import React from 'react'
import { NumericInput, FieldError } from '../utils/FormHelpers'
import GrowPhaseStore from './GrowPhaseStore'
import { toast } from '../utils'

export default class GrowPhaseEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = this.resetState()
  }

  componentDidMount() {
    document.addEventListener('editor-sidebar-open', event => {
      const { grow_phase_id } = event.detail
      if (!grow_phase_id) {
        this.reset()
        return
      }

      GrowPhaseStore.getGrowPhase(grow_phase_id).then(data => {
        const {
          id,
          name,
          number_of_days,
          is_active,
        } = GrowPhaseStore.grow_phase

        this.setState({
          id,
          name,
          number_of_days: number_of_days || '',
          is_active,
          form_type: 'Edit',
          errors: {}
        })
      })
    })
  }

  resetState() {
    return {
      id: '',
      name: '',
      is_active: true,
      number_of_days: '',
      form_type: 'Add',
      errors: {}
    }
  }

  genericOnChange = event => {
    const key = event.target.name
    const value = event.target.value
    this.setState({ [key]: value })
  }

  onCloseEditor = () => {
    window.editorSidebar.close()
  }

  onSave = event => {
    //this.onCloseEditor()
    const { errors, isValid, ...payload } = this.getValues()
    if (!isValid) {
      this.setState({ errors })
      return
    }

    GrowPhaseStore.saveGrowPhase(payload).then(result => {
      if (result.data.errors) {
        this.setState({ errors: result.data.errors })
        toast('Grow Phase cannot be saved.', 'error')
      } else {
        this.reset()
        this.onCloseEditor()
        toast('Grow Phase has been saved.', 'success')
        GrowPhaseStore.loadGrowPhase()
      }
    })
  }

  reset() {
    this.setState(this.resetState())
  }

  getValues() {
    const {
      id,
      name,
      number_of_days,
      is_active,
    } = this.state

    let errors = {}

    if (name.trim().length == 0) {
      errors.name = ['Name is required.']
    }

    const isValid = Object.getOwnPropertyNames(errors).length == 0

    return {
      id,
      name,
      number_of_days,
      is_active,
      errors,
      isValid
    }
  }

  renderForm() {
    const percentageOptions = []
    for (let i = 0; i <= 20; i++) {
      percentageOptions.push(
        <option key={i} value={i * 5}>
          {i * 5} %
        </option>
      )
    }

    return (
      <React.Fragment>
        <div className="ph4 mt3 flex">
          <div className="w-100">
            <label className="f6 fw6 db mb1 gray">Name</label>
            <input readOnly
              type="text"
              name="name"
              value={this.state.name}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
        </div>
        <div className="ph4 mt3 flex">
          <div className="w-50">
            <label className="f6 fw6 db mb1 gray"># of Days Propagation </label>
            <input
              type="text"
              name="number_of_days"
              value={this.state.number_of_days}
              onChange={this.genericOnChange}
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
            />
          </div>
        </div>

        <div>
          <div className="w-100 mt4 pa4 bt b--light-grey flex items-center justify-between">
            <div />
            <button
              className="db tr pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6"
              onClick={this.onSave}
            >
              Save
            </button>
          </div>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <div className="rc-slide-panel" data-role="sidebar">
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              {this.state.form_type} Grow Phase
            </h1>
            <span
              className="rc-slide-panel__close-button dim"
              onClick={this.onCloseEditor}
            >
              <i className="material-icons mid-gray md-18">close</i>
            </span>
          </div>
          {this.renderForm()}
        </div>
      </div>
    )
  }
}
