import React from 'react'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable'
import SeedEditor from './editor/SeedEditor'
import CloneEditor from './editor/CloneEditor'
import MotherEditor from './editor/MotherEditor'
import VegGroupEditor from './editor/VegGroupEditor'
import { FieldError } from '../../../utils/FormHelpers'
import reactSelectStyle from './shared/reactSelectStyle'

const VEG_GROUP = 'VEG_GROUP'
const SEED = 'SEED'
const CLONE = 'CLONE'
const MOTHER = 'MOTHER'

export default class PlantEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = { stockEditor: '' }

    this.locations = props.locations
    this.onSetStockEditor = this.onSetStockEditor.bind(this)
    this.onExitCurrentEditor = this.onExitCurrentEditor.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onValidateParent = this.onValidateParent.bind(this)
    this.onResetParent = this.onResetParent.bind(this)
  }

  get editorSelected() {
    return this.state.stockEditor.length > 0
  }

  // TODO:  May need more logic to add newly created item into the async list: https://react-select.com/props#creatable-props
  // At the moment, newly created item does not appear on suggestion list.
  // onStrainSelected(item) {
  //   this.setState(
  //     {
  //       strain: item.label,
  //       strain_type: item.strain_type || this.state.strain_type,
  //       errors: {}
  //     } /*, () => console.log(this.state.strain_type)*/
  //   )
  // }

  // onChangeStrainType(event) {
  //   this.setState({ strain_type: event.target.value })
  // }

  onSetStockEditor(event) {
    this.setState({ stockEditor: event.target.dataset.editor })
    event.preventDefault()
  }

  onExitCurrentEditor(event) {
    this.setState({ stockEditor: '' })
    event.preventDefault()
  }

  onClose() {
    // reset everything before close.
    this.props.onClose()
  }

  onValidateParent() {
    return { isValid: true }
  }

  onResetParent() {
    this.setState({
      errors: {}
    })
  }

  renderEditorToggle() {
    if (this.editorSelected) return null

    return (
      <React.Fragment>
        <div
          className="ph4 mt4 mb3"
          style={{ width: '500px', overflow: 'hidden' }}
        >
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib pointer"
            data-editor={MOTHER}
            onClick={this.onSetStockEditor}
          >
            Add mother
          </a>
          {/* <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib pointer"
            data-editor={SEED}
            onClick={this.onSetStockEditor}
          >
            Add seed
          </a> */}
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib pointer"
            data-editor={CLONE}
            onClick={this.onSetStockEditor}
          >
            Add clones
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib pointer"
            data-editor={VEG_GROUP}
            onClick={this.onSetStockEditor}
          >
            Add veg group
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib pointer"
            data-editor={''}
            onClick={() => alert('To be implmented.')}
          >
            Add harvest yield
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib pointer"
            data-editor={''}
            onClick={() => alert('To be implmented.')}
          >
            Add waste
          </a>
        </div>
      </React.Fragment>
    )
  }

  renderSeedEditor() {
    if (this.state.stockEditor !== SEED) return null

    // Instead of parent level calling save, the child take input from parent
    // by calling onValidateParent and follow up the save process itself.
    return (
      <SeedEditor
        onExitCurrentEditor={this.onExitCurrentEditor}
        onResetParent={this.onResetParent}
        locations={this.locations}
      />
    )
  }

  renderCloneEditor() {
    if (this.state.stockEditor !== CLONE) return null
    return (
      <CloneEditor
        onExitCurrentEditor={this.onExitCurrentEditor}
        onResetParent={this.onResetParent}
        locations={this.locations}
      />
    )
  }

  renderMotherEditor() {
    if (this.state.stockEditor !== MOTHER) return null
    return (
      <MotherEditor
        onExitCurrentEditor={this.onExitCurrentEditor}
        onResetParent={this.onResetParent}
        locations={this.locations}
      />
    )
  }

  renderVegGroupEditor() {
    if (this.state.stockEditor !== VEG_GROUP) return null
    return (
      <VegGroupEditor
        onExitCurrentEditor={this.onExitCurrentEditor}
        onResetParent={this.onResetParent}
        locations={this.locations}
      />
    )
  }

  renderTitle() {
    let title = ''
    if (this.state.stockEditor === VEG_GROUP) {
      title = 'Add Veg Group'
    } else if (this.state.stockEditor === SEED) {
      title = 'Add Seed'
    } else if (this.state.stockEditor === CLONE) {
      title = 'Add Clone'
    } else if (this.state.stockEditor === MOTHER) {
      title = 'Add Mother Plant'
    } else {
      title = 'Add Active Plant'
    }

    if (title === 'Add Active Plant') {
      return (
        <div
          className="ph4 pv2 bb b--light-gray flex items-center"
          style={{ height: '51px' }}
        >
          <h1 className="f4 fw6 ma0 flex flex-auto ttc">{title}</h1>
          <span
            className="rc-slide-panel__close-button dim"
            onClick={this.onClose}
          >
            <i className="material-icons mid-gray md-18">close</i>
          </span>
        </div>
      )
    } else {
      return (
        <div className="ph4 pt2 bb b--light-gray flex flex-column items-start">
          <div
            className="dim gray f7 pv1 flex fw4 pointer ttu mb2 flex items-center"
            onClick={this.onExitCurrentEditor}
          >
            <i className="material-icons mid-gray md-18 mr2">
              keyboard_backspace
            </i>
            Back
          </div>
          <h1 className="f4 fw6 ma0 flex flex-auto ttc mb3">{title}</h1>
        </div>
      )
    }
  }

  render() {
    const widthStyle = this.props.isOpened
      ? { width: '500px' }
      : { width: '0px' }

    return (
      <div className="rc-slide-panel" data-role="sidebar" style={widthStyle}>
        <div className="rc-slide-panel__body flex flex-column">
          {this.renderTitle()}
          {this.renderEditorToggle()}
          {this.renderSeedEditor()}
          {this.renderCloneEditor()}
          {this.renderMotherEditor()}
          {this.renderVegGroupEditor()}
        </div>
      </div>
    )
  }
}
