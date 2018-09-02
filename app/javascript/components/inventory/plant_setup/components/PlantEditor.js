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
    this.state = {
      strain: '',
      strain_type: props.strainTypes[0].code,
      stockEditor: '',
      errors: {}
    }

    this.locations = props.locations
    this.strainTypes = props.strainTypes

    this.onStrainSelected = this.onStrainSelected.bind(this)
    this.onChangeStrainType = this.onChangeStrainType.bind(this)
    this.onSetStockEditor = this.onSetStockEditor.bind(this)
    this.onResetEditor = this.onResetEditor.bind(this)
    this.onClose = this.onClose.bind(this)
    this.onValidateParent = this.onValidateParent.bind(this)
  }

  get editorSelected() {
    return this.state.stockEditor.length > 0
  }

  componentDidMount() {
    // console.log(this.props.locations)
  }

  // TODO:  May need more logic to add newly created item into the async list: https://react-select.com/props#creatable-props
  // At the moment, newly created item does not appear on suggestion list.
  onStrainSelected(item) {
    this.setState(
      {
        strain: item.label,
        strain_type: item.strain_type || this.state.strain_type,
        errors: {}
      } /*, () => console.log(this.state.strain_type)*/
    )
  }

  onChangeStrainType(event) {
    this.setState({ strain_type: event.target.value })
  }

  onSetStockEditor(event) {
    this.setState({ stockEditor: event.target.dataset.editor })
    event.preventDefault()
  }

  onResetEditor(event) {
    this.setState({ stockEditor: '' })
    event.preventDefault()
  }

  onClose() {
    // reset everything before close.
    this.props.onClose()
  }

  onValidateParent(isDraft = false) {
    const { strain, strain_type, stockEditor: plant_type } = this.state
    let errors = {}
    if (strain === undefined || strain.length <= 0) {
      errors = { ...errors, strain: ['Please select a strain.'] }
    }

    if (strain_type === undefined || strain_type.length <= 0) {
      errors = { ...errors, strain_type: ['Please select a strain type.'] }
    }

    // if (!isDraft && (facility_id === undefined || facility_id.length <= 0)) {
    //   errors = { ...errors, facility_id: ['Please select a facility.'] }
    // }

    if (!isDraft && Object.getOwnPropertyNames(errors).length > 0) {
      this.setState({ errors })
    }

    return {
      strain,
      strain_type,
      plant_type,
      errors,
      isValid: Object.getOwnPropertyNames(errors).length === 0
    }
  }

  renderEditorToggle() {
    if (this.editorSelected) return null

    return (
      <React.Fragment>
        <div
          className="ph4 mb3 pt3"
          style={{ width: '500px', overflow: 'hidden' }}
        >
          <div className="flex justify-between items-center">
            <label className="f6 fw6 db dark-gray">
              I have stock for this strain...
            </label>
          </div>
        </div>
        <div className="ph4 mb3" style={{ width: '500px', overflow: 'hidden' }}>
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
        onResetEditor={this.onResetEditor}
        onValidateParent={this.onValidateParent}
        locations={this.locations}
      />
    )
  }

  renderCloneEditor() {
    if (this.state.stockEditor !== CLONE) return null
    return (
      <CloneEditor
        onResetEditor={this.onResetEditor}
        onValidateParent={this.onValidateParent}
        locations={this.locations}
      />
    )
  }

  renderMotherEditor() {
    if (this.state.stockEditor !== MOTHER) return null
    return (
      <MotherEditor
        onResetEditor={this.onResetEditor}
        onValidateParent={this.onValidateParent}
        locations={this.locations}
      />
    )
  }

  renderVegGroupEditor() {
    if (this.state.stockEditor !== VEG_GROUP) return null
    return (
      <VegGroupEditor
        onResetEditor={this.onResetEditor}
        onValidateParent={this.onValidateParent}
        locations={this.locations}
      />
    )
  }

  renderTitle() {
    if (this.state.stockEditor === VEG_GROUP) {
      return 'Add Veg Group'
    } else if (this.state.stockEditor === SEED) {
      return 'Add seed'
    } else if (this.state.stockEditor === CLONE) {
      return 'Add clone'
    } else if (this.state.stockEditor === MOTHER) {
      return 'Add mother plant'
    } else {
      return 'Add Plant'
    }
  }

  renderCloseSidebar() {
    if (this.editorSelected) {
      return (
        <div
          className="dim gray f7 pv1 flex fw4 pointer ttu"
          onClick={this.onResetEditor}
        >
          Back
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

  // Should refactor this to ./actions
  loadStrainOptions = inputValue => {
    return fetch('/api/v1/plants/strains?filter=' + inputValue, {
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => {
        // console.log(data.data)
        return data.data.map(x => ({
          label: x.name,
          value: x.name,
          id: 5,
          strain_type: x.strain_type
        }))
      })
  }

  handleInputChange = newValue => {
    return newValue
  }

  render() {
    const widthStyle = this.props.isOpened
      ? { width: '500px' }
      : { width: '0px' }

    return (
      <div className="rc-slide-panel" data-role="sidebar" style={widthStyle}>
        <div className="rc-slide-panel__body flex flex-column">
          <div
            className="ph4 pv2 bb b--light-gray flex items-center"
            style={{ height: '51px' }}
          >
            <h1 className="f4 fw6 ma0 flex flex-auto ttc">
              {this.renderTitle()}
            </h1>
            {this.renderCloseSidebar()}
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc">Strain</label>
              <AsyncCreatableSelect
                defaultOptions
                noOptionsMessage={() => 'Type to search strain...'}
                cacheOptions
                loadOptions={this.loadStrainOptions}
                onInputChange={this.handleInputChange}
                styles={reactSelectStyle}
                placeholder=""
                value={{ label: this.state.strain, value: this.state.strain }}
                onChange={this.onStrainSelected}
              />
              <FieldError errors={this.state.errors} field="strain" />
            </div>
            <div className="w-40 pl3">
              <label className="f6 fw6 db mb1 gray ttc">Strain type</label>
              <select
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0 select"
                onChange={this.onChangeStrainType}
                value={this.state.strain_type}
              >
                {this.strainTypes.map(x => (
                  <option value={x.code} key={x.code}>
                    {x.name}
                  </option>
                ))}
              </select>
              <FieldError errors={this.state.errors} field="strain_type" />
            </div>
          </div>

          <hr className="mt3 m b--light-gray w-100" />

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
