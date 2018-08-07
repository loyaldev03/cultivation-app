import React from 'react'

export default class PlantEditor extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      strain: '',
      strain_type: ''
    } // or set from props

    this.onChangeStrain = this.onChangeStrain.bind(this)
    this.onChangeStrainType = this.onChangeStrainType.bind(this)
  }

  onChangeStrain(event) {
    this.setState({ strain: event.target.value })
  }

  onChangeStrainType(event) {
    console.log(event.target.value)
    this.setState({ strain_type: event.target.value })
  }

  render() {
    return (
      <div
        className="rc-slide-panel animated slideOutRight"
        data-role="sidebar">
        <span className="rc-slide-panel__close-button dim" onClick={this.props.onClose}>
          <i className="material-icons mid-gray md-18">close</i>
        </span>
        <div className="rc-slide-panel__body"> 
          <div className="ph4 pv3 bb b--light-gray">
            <h1 className="f4 fw5 ma0">Add Plant</h1>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-60">
              <label className="f6 fw5 db mb1 gray ttc">Strain</label>
              <input 
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" 
                onChange={this.onChangeStrain}
                value={this.state.strain}
                type="text"/>
            </div>
            <div className="w-40 pl3">
              <label className="f6 fw5 db mb1 gray ttc">Strain type</label>
              <select 
                name="room_info[purpose]" id="room_info_purpose"
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

          {/* <hr className="mb3 m b--light-gray w-100" /> */}

          <div className="ph4 mb3 pt3">
            <div className="flex justify-between items-center">
              <label className="f6 fw5 db black">I have stock for this strain:</label>
              {/* <div>
                <input className  ="toggle toggle-default" type="checkbox" value="1" name="room_info" id="room_info_has_sections" />
                <label className  ="toggle-button" htmlFor="room_info_has_sections"></label>
              </div> */}
            </div>
          </div>
        
          <div className="ph4 mb3">
            <div className="flex flex-wrap">
            <a className="pv2 ph3 mb2 bg-green white bn br2 link dim f6 fw6 mr2" href="">Add seed</a>
            <a className="pv2 ph3 mb2 bg-green white bn br2 link dim f6 fw6 mr2" href="">Add clones</a>
            <a className="pv2 ph3 mb2 bg-green white bn br2 link dim f6 fw6 mr2" href="">Add mother</a>
            <a className="pv2 ph3 mb2 bg-green white bn br2 link dim f6 fw6 mr2" href="">Add veg group</a>
            </div>
            {/* <select 
              name="room_info[purpose]" id="room_info_purpose"
              className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" >
              <option value="seed">Seed</option>
              <option value="clone">Clone</option>
              <option value="mother">Mother plan</option>
              <option value="mother">Veg group</option>
            </select> */}
          </div>

          <div className="ph4 mt3 mb3">
            <hr className="mb3 mt4 m b--light-gray w-100" />
            <span className="f6 fw6 gray">Veg group</span>
          </div>
          <div className="ph4 mt3 mb3 flex">
            <div className="w-50">
              <label className="f6 fw5 db mb1 gray ttc">Planted on</label>
              <input value="" 
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" 
                type="text"/>
            </div>
            <div className="w-50 pl3">
              <label className="f6 fw5 db mb1 gray ttc">Expected harvest date</label>
              <input value="" 
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" 
                type="text"/>
            </div>
          </div>

          <div className="ph4 mt3 mb3 flex">
            <div className="w-50">
              <label className="f6 fw5 db mb1 gray ttc">Location ID (Tray ID)</label>
              <input value="" 
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" 
                type="text"/>
            </div>
          </div>

          <div className="ph4 mt3 mb3">
            <hr className="mb3 mt4 m b--light-gray w-100" />
            <span className="f6 fw6 gray">Origin</span>
          </div>
          <div className="ph4 mt3 mb3 flex">
            <div className="w-50">
              <label className="f6 fw5 db mb1 gray ttc">Mother ID</label>
              <input value="" 
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" 
                type="text"/>
            </div>
          </div>

          <div className="ph4 mt3 mb3">
            <hr className="mb3 mt4 m b--light-gray w-100" />
            <span className="f6 fw6 gray">Who you bought from?</span>
          </div>
          <div className="ph4 mt3 mb3 flex">
            <div className="w-50">
              <label className="f6 fw5 db mb1 gray ttc">Supplier</label>
              <input value="" 
                className="db w-100 pa2 f6 black ba b--black-20 br2 outline-0" 
                type="text"/>
            </div>
          </div>
        </div>

        <div className="w-100 mt5 pa4 bt b--black-10 flex items-center justify-between">
          <a className="db tr pv2 ph3 bg-green white bn br2 ttu tracked link dim f6 fw6">Save</a>
        </div>
      </div>
    )
  }
}