import React from 'react'
import { observer, Provider } from "mobx-react";
import sidebarTask from '../stores/SidebarTaskStore'

@observer
export default class TaskEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',
      facility_id: '',
      stockEditor: '',
      source: ''
    } // or set from props

    this.onResetEditor = this.onResetEditor.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  get editorSelected() {
    return this.state.stockEditor.length > 0
  }

  onResetEditor(event) {
    this.setState({ stockEditor: '' })
    event.preventDefault()
  }

  onClose() {
    // reset everything before close.
    this.props.onClose()
  }

  renderTitle() {
    return 'Add Plant'
  }

  renderCloseSidebar() {
    if (this.editorSelected) {
      return (
        <div
          className="dim gray f7 pv1 flex fw4 pointer ttu"
          onClick={this.onResetEditor}
        >
          Cancel
        </div>
      )
    } else {
      return (
        <span
          className="rc-slide-panel__close-button dim"
          onClick={this.onClose}
        >
          <i className="material-icons mid-gray md-18">close</i>
        </span>
      )
    }
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
              {this.renderTitle()}
              {sidebarTask.name}
            </h1>
            {this.renderCloseSidebar()}
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc">Strain</label>
              <input
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
                onChange={this.onChangeStrain}
                value={this.state.strain}
                type="text"
              />
            </div>
            <div className="w-40 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Strain type</label>
              <select
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
                onChange={this.onChangeStrainType}
                value={this.state.strain_type}
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Indica">Indica</option>
                <option value="Sativa">Sativa</option>
              </select>
            </div>
          </div>

          <div className="ph4 mb3 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc">Facility</label>
              <select
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0"
                onChange={this.onFacilityChanged}
                value={this.state.facility_id}
              >
                <option value="farm1">Farm 1</option>
                <option value="farm2">Farm 2</option>
                <option value="farm3">Farm 3</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
