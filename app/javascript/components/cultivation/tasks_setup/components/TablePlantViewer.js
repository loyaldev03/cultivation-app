import React from 'react'
import Tippy from '@tippy.js/react'

export default class TablePlantViewer extends React.Component {
  componentDidMount() {}
  render() {
    let { name, data } = this.props.data
    return (
      <div className="mb2">
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
                  //checked={applyAllToggle}
                  // onChange={e =>
                  //   this.setState({ applyAllToggle: !applyAllToggle })
                  // }
                />
                <span className="slider round" />
              </label>
            </div>
          </div>
        </div>
        <div className="mt2">
          <div className="w-100 flex">
            <div className=" w-25  pt2 bb b--light-gray pb1 mb1">
              {/* <Tippy
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
                  {trayFilterList.map(x => (
                    <div className="pa1" key={x.code}>
                      <input
                        type="checkbox"
                        checked={x.ticked}
                        onChange={e => this.onFilterLocation(e, x)}
                      />
                      {x.code}
                    </div>
                  ))}
                </div>
              }
            > */}
              <i className="material-icons icon--small pointer">filter_list</i>
              {/* </Tippy> */}
              Location Code
            </div>
            <div className=" w-25  pt2 bb b--light-gray pb1 mb1">Plant ID</div>
            <div
              className={`fl w-25  pt2 bb b--light-gray  pb1 mb1 ${true &&
                'flex justify-between'}`}
            >
              <span className="">Number of clipping</span>
            </div>
            <div className="w-25  pt2 bb b--light-gray pb1 mb1">
              Total Clone
              {/* {totalPlantOnForm} */}
            </div>
          </div>
        </div>
        {data.map(tray => (
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
        ))}
      </div>
    )
  }
}
