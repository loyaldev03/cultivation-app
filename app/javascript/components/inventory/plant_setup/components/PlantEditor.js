import React from 'react'
import AsyncSelect from 'react-select/lib/Async'
import AsyncCreatableSelect from 'react-select/lib/AsyncCreatable';
import SeedEditor from './editor/SeedEditor'
import CloneEditor from './editor/CloneEditor'
import MotherEditor from './editor/MotherEditor'
import VegGroupEditor from './editor/VegGroupEditor'

const VEG_GROUP = 'VEG_GROUP'
const SEED = 'SEED'
const CLONE = 'CLONE'
const MOTHER = 'MOTHER'

export default class PlantEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: '',
      facility_id: '',
      stockEditor: '',
      source: ''
    } // or set from props

    this.onChangeStrain = this.onChangeStrain.bind(this)
    this.onChangeStrainType = this.onChangeStrainType.bind(this)
    this.onFacilityChanged = this.onFacilityChanged.bind(this)
    this.onSetStockEditor = this.onSetStockEditor.bind(this)
    this.onResetEditor = this.onResetEditor.bind(this)
    this.onClose = this.onClose.bind(this)
  }

  get editorSelected() {
    return this.state.stockEditor.length > 0
  }

  onChangeStrain(event) {
    this.setState({ strain: event.target.value })
  }

  onChangeStrainType(event) {
    this.setState({ strain_type: event.target.value })
  }

  onFacilityChanged(event) {
    this.setState({ facility_id: event.target.value })
  }

  onSetStockEditor(event) {
    // console.log(event.target.dataset)
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

  renderEditorToggle() {
    if (this.editorSelected) return null

    return (
      <React.Fragment>
        <div className="ph4 mb3 pt3">
          <div className="flex justify-between items-center">
            <label className="f6 fw6 db dark-gray">
              I have stock for this strain...
            </label>
            {/* <div>
              <input className  ="toggle toggle-default" type="checkbox" value="1" name="room_info" id="room_info_has_sections" />
              <label className  ="toggle-button" htmlFor="room_info_has_sections"></label>
            </div> */}
          </div>
        </div>
        <div className="ph4 mb3">
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib"
            href=""
            data-editor={SEED}
            onClick={this.onSetStockEditor}
          >
            Add seed
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib"
            href=""
            data-editor={CLONE}
            onClick={this.onSetStockEditor}
          >
            Add clones
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib"
            href=""
            data-editor={MOTHER}
            onClick={this.onSetStockEditor}
          >
            Add mother
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib"
            href=""
            data-editor={VEG_GROUP}
            onClick={this.onSetStockEditor}
          >
            Add veg group
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib"
            href="#"
            data-editor={''}
            onClick={() => alert('To be implmented.')}
          >
            Add harvest yield
          </a>
          <a
            className="pv2 ph3 mb2 bg-orange white bn br2 link dim f6 fw6 mr2 dib"
            href="#"
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
    return <SeedEditor onResetEditor={this.onResetEditor} />
  }

  renderCloneEditor() {
    if (this.state.stockEditor !== CLONE) return null
    return <CloneEditor onResetEditor={this.onResetEditor} />
  }

  renderMotherEditor() {
    if (this.state.stockEditor !== MOTHER) return null
    return <MotherEditor onResetEditor={this.onResetEditor} />
  }

  renderVegGroupEditor() {
    if (this.state.stockEditor !== VEG_GROUP) return null
    return <VegGroupEditor onResetEditor={this.onResetEditor} />
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

  promiseOptions = (inputValue) => {
    // console.log(inputValue.length)
    // const filter = inputValue.length > 0 ? inputValue : this.state.strain
    
    return fetch('/api/v1/plants/strains?filter=' + inputValue, {
      credentials: 'include'  
    })
      .then(response => response.json())
      .then((data) => {
        console.log(data.data)
        return data.data.map(x => ({ 
          label: x.name, 
          value: x.name, 
          id: 5,
          strain_type: x.strain_type
        }))
      })
  }

  handleInputChange = (newValue, meta) => {
    // this.setState({ strain: newValue })
    return newValue
  };

  onStrainSelected = (item) => {
    console.log(item)
    let label = ''
    if (item) {
      label = item.label
    }
    
    this.setState({ 
      strain: label,
      strain_type: item.strain_type
    })
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
            </h1>
            {this.renderCloseSidebar()}
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-60">
              <label className="f6 fw6 db mb1 gray ttc">Strain</label>
              <AsyncCreatableSelect
                defaultOptions
                noOptionsMessage={() => 'Type to search strain...' }
                cacheOptions
                loadOptions={this.promiseOptions}
                onInputChange={this.handleInputChange}
                styles={customStyles}
                placeholder=""
                value={{ label: this.state.strain, value: this.state.strain }}
                onChange={this.onStrainSelected}
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


// const filterColors = (inputValue) => {
//   return (colourOptions.filter(i =>
//     i.label.toLowerCase().includes(inputValue.toLowerCase())
//   ))
// }

const customStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: '#fff',
    height: '30px',
    minHeight: '30px',
    borderColor: 'rgba(0, 0, 0, 0.2)'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  menu: (base, state) => ({
    ...base,
    marginTop: 2
  }),
  dropdownIndicator: () => ({
    display: 'none'
  }),
  option: (base, state) => {
    return { 
      ...base, 
      backgroundColor: (state.isFocused || state.isSelected) ? 'rgba(100, 100, 100, 0.1)' : 'transparent',
      ':active':  'rgba(100, 100, 100, 0.1)',
      WebkitTapHighlightColor: 'rgba(100, 100, 100, 0.1)',
      color: 'black',
    }
  }
}