import React from 'react'

export default class MotherPlantsEditor extends React.Component {
  render() {
    return (
      <React.Fragment>
        {this.props.renderLabel(this.props)}
        <table className="f6 fw6 gray ba b--light-grey br2 pa1">
          <thead>
            <tr>
              <td className="bb b--light-grey">Plant Id</td>
              <td className="bb b--light-grey">Location</td>
              <td className="bb b--light-grey tr"># of Clipping</td>
              <td className="bb b--light-grey" />
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pa1">MOT-AK001</td>
              <td className="pa1">MOTHER ROOM</td>
              <td className="pa1 tr">10</td>
              <td className="pa1 flex justify-center">
                <i
                  className="material-icons icon--small red pointer"
                  onClick={() => console.log('delete')}
                >
                  delete
                </i>
              </td>
            </tr>
            <tr>
              <td className="pa1">MOT-AK002</td>
              <td className="pa1">MOTHER ROOM</td>
              <td className="pa1 tr">12</td>
              <td className="pa1 flex justify-center">
                <i
                  className="material-icons icon--small red pointer"
                  onClick={() => console.log('delete')}
                >
                  delete
                </i>
              </td>
            </tr>
            <tr>
              <td>
                <input type="text" className="w-100" />
              </td>
              <td></td>
              <td className="tr">
                <input type="number" className="w-100" />
              </td>
              <td className="flex justify-center">
                <i className="material-icons icon--small">add</i>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="3" className="tr">
                Total: 12
              </td>
            </tr>
          </tfoot>
        </table>
      </React.Fragment>
    )
  }
}
