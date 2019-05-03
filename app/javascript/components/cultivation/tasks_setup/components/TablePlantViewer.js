import React from 'react'
import Tippy from '@tippy.js/react'
import { set } from 'mobx'

export default class TablePlantViewer extends React.Component {
  state = {
    applyAllToggle: false,
    allLocationChecked: true,
    filterPlant: [],
    filterPlantList: [],
    allClippingValue: 0
  }
  componentDidMount() {
    let filterPlant = this.props.data.data.map(x => {
      return { name: x.location_code, ticked: true }
    })
    let filterPlantList = this.props.data.data.map(x => x.location_code)
    filterPlantList = [...new Set(filterPlantList)]
    this.setState({
      filterPlant: this.getUnique(filterPlant, 'name'),
      filterPlantList
    })
  }
  getUnique = (arr, comp) => {
    const unique = arr
      .map(e => e[comp])

      // store the keys of the unique objects
      .map((e, i, final) => final.indexOf(e) === i && i)

      // eliminate the dead keys & store unique objects
      .filter(e => arr[e])
      .map(e => arr[e])

    return unique
  }
  onShowAllLocation = () => {
    let { allLocationChecked } = this.state
    if (!allLocationChecked) {
      let filterPlant = this.props.data.data.map(x => {
        return { name: x.location_code, ticked: true }
      })
      let filterPlantList = this.props.data.data.map(x => x.location_code)
      filterPlantList = [...new Set(filterPlantList)]
      this.setState({
        filterPlant: this.getUnique(filterPlant, 'name'),
        filterPlantList,
        allLocationChecked: true
      })
    }
  }
  onApplyAllClipping = e => {
    this.props.data.data.map(plant =>
      this.props.onUpdateOnePlant(plant.plant_id, e)
    )
    this.setState({
      allClippingValue: e.target.value
    })
  }
  onFilterLocation = (e, data) => {
    const { filterPlant, filterPlantList } = this.state
    filterPlant[filterPlant.indexOf(data)].ticked = !data.ticked
    filterPlantList.indexOf(data.name) >= 0
      ? filterPlantList.splice(filterPlantList.indexOf(data.name), 1)
      : filterPlantList.push(data.name)
    console.log(filterPlantList)
    this.setState({
      filterPlant,
      filterPlantList,
      allLocationChecked: filterPlant.every(plant => plant.ticked === true)
        ? true
        : false
    })
  }
  render() {
    let { name, data } = this.props.data
    const {
      applyAllToggle,
      allLocationChecked,
      filterPlant,
      filterPlantList,
      allClippingValue
    } = this.state
    return (
      <div className="mb4">
        <div className="subtitle-2">
          <div className="bg-light-gray  grey f5 flex justify-between items-center pa1 pv2 mb1">
            <div className="b flex flex-start items-center pl2">
              {name} > tray <i className="material-icons icon--small">delete</i>
            </div>
            <div className="flex justify-between items-center">
              Apply to all{' '}
              <Tippy
                placement="bottom-end"
                content={
                  <div className="inline_calendar grey ">
                    Tips: If selected, all mother plants in this are will be
                    clipped by the number you indicated above. You may also
                    select the specific mother plants in specific locations and
                    indicate a different number of clipping for each one
                  </div>
                }
              >
                <i className="material-icons icon--small pointer">help</i>
              </Tippy>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={applyAllToggle}
                  onChange={e =>
                    this.setState({ applyAllToggle: !applyAllToggle })
                  }
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </div>
        <div className="mt2">
          <div className="w-100 flex">
            <div className=" w-25  pt2 ">
              <Tippy
                trigger="click"
                content={
                  <div className="bg-white ba b--light-gray br2 ml1 w5 grey overflow-y-auto">
                    <div className="bg-light-gray pa1">
                      <input
                        type="checkbox"
                        checked={allLocationChecked}
                        onChange={e => this.onShowAllLocation()}
                      />{' '}
                      All
                    </div>
                    {filterPlant.map(x => (
                      <div className="pa1" key={x.name}>
                        <input
                          type="checkbox"
                          checked={x.ticked}
                          onChange={e => this.onFilterLocation(e, x)}
                        />
                        {x.name}
                      </div>
                    ))}
                  </div>
                }
              >
                <i className="material-icons icon--small pointer">
                  filter_list
                </i>
              </Tippy>
              Location Code
            </div>
            <div className=" w-25  pt2 ">Plant ID</div>
            <div className={`fl w-25  pt2 ${true && 'flex justify-between'}`}>
              <span className="">Number of clipping</span>
            </div>
            <div className="w-25  pt2 pl3 ">
              Total Clone
              {/* {totalPlantOnForm} */}
            </div>
          </div>
        </div>
        <div className="w-100 flex b h2">
          <div className="w-25 tc bb b--light-gray pb1 mb1">All</div>
          <div className="w-25 bb b--light-gray pb1 mb1">All Plant</div>
          <div className="w-25 tc bb b--light-gray pb1 mb1">
            {applyAllToggle && (
              <input
                type="number"
                className="input w-100 tr"
                value={allClippingValue}
                maxLength="2"
                onChange={e => this.onApplyAllClipping(e)}
                style={{
                  height: 'auto'
                }}
              />
            )}
          </div>
          <div className="w-25 tc bb b--light-gray pb1 mb1">
            {data.reduce((a, b) => a + (parseInt(b['quantity']) || 0), 0)}
          </div>
        </div>
        {data.map((tray, i) => {
          return filterPlantList.indexOf(tray.location_code) >= 0 ? (
            <div className=" w-100 flex" key={tray.plant_id}>
              <div className="w-25 pa1">{tray.location_code}</div>
              <div className="w-25 pa1">{tray.plant_code}</div>
              <div className="w-20 pa1 tc">
                <input
                  type="number"
                  className="gray w-80 tr b--none"
                  value={tray.quantity}
                  maxLength="2"
                  // readOnly
                  onChange={e => this.props.onUpdateOnePlant(tray.plant_id, e)}
                />
              </div>
            </div>
          ) : null
        })}
      </div>
    )
  }
}
