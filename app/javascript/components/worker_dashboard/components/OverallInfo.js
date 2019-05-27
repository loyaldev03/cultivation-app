import React from 'react'

export default class OverallInfo extends React.Component {
  render() {
    return (
      <div className="ba b--light-gray pa3 bg-white">
        <div className="flex justify-between">
          <div>
            <h1 className="f5 fw6 ml4">Overall Info</h1>
          </div>
          <div className="flex">
            <h1 className="f5 fw6">Weekly</h1>
            <i className="material-icons grey mr2 dim md-21 pointer mt2">
              keyboard_arrow_down
            </i>
          </div>
        </div>

        <div className="flex justify-between mt2">
          <div className="flex br b--light-gray" style={{ flex: ' 1 1 auto' }}>
            <i className="material-icons mt3 ml5 orange mr3 dim md-48 pointer mt2">
              check_circle
            </i>
            <div>
              <h1 className="f5 fw6 grey">Worked hours</h1>
              <b className="f3 fw6">30</b>
            </div>
          </div>
          <div className="flex br b--light-gray" style={{ flex: ' 1 1 auto' }}>
            <i className="material-icons mt3 ml5 orange mr3 dim md-48 pointer mt2">
              location_on
            </i>
            <div>
              <h1 className="f5 fw6 grey">On time arrivals</h1>
              <b className="f3 fw6">30</b>
            </div>
          </div>
          <div className="flex br b--light-gray" style={{ flex: ' 1 1 auto' }}>
            <i className="material-icons mt3 ml5 orange mr3 dim md-48 pointer mt2">
              assignment
            </i>
            <div>
              <h1 className="f5 fw6 grey">Tasks completed</h1>
              <b className="f3 fw6">30</b>
            </div>
          </div>
          <div className="flex" style={{ flex: ' 1 1 auto' }}>
            <i className="material-icons mt3 ml5 orange mr3 dim md-48 pointer mt2">
              assignment_turned_in
            </i>
            <div>
              <h1 className="f5 fw6 grey">Tasks completed on time</h1>
              <b className="f3 fw6">30</b>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
