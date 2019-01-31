import React from 'react'

export default class MotherPlantsEditor extends React.Component {
  onSubmit = e => {
    e.preventDefault()
    const newPlant = {
      plantId: this.plantInput.value,
      quantity: this.quantityInput.value
    }
    if (this.props.onAddItem) {
      this.props.onAddItem(newPlant)
    }
  }
  onDelete = plantId => {
    if (this.props.onDeleteItem) {
      this.props.onDeleteItem(plantId)
    }
  }
  render() {
    const { className = '' } = this.props
    return (
      <form className={`${className}`}
        onSubmit={this.onSubmit}
      >
        {this.props.renderLabel(this.props)}
        <table className="w-100 f6 fw6 gray ba b--light-grey collapse">
          <tbody>
            <tr>
              <td className="pa1 bb b--light-grey w4">Plant Id</td>
              <td className="pa1 bb b--light-grey w4 tr">#</td>
              <td className="pa1 bb b--light-grey">Location</td>
              <td className="pa1 bb b--light-grey" />
            </tr>
            <tr>
              <td className="pa1">MOT-AK001</td>
              <td className="pa1 tr">10</td>
              <td className="pa1">MOTHER ROOM</td>
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
              <td className="pa1 tr">12</td>
              <td className="pa1">MOTHER ROOM</td>
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
              <td className="pa1">
                <input
                  type="text"
                  ref={input => this.plantInput = input}
                  className="w-100"
                  required={true}
                  onKeyPress={this.handleKeyPress}
                />
              </td>
              <td className="pa1">
                <input
                  type="number"
                  ref={input => this.quantityInput = input}
                  className="w-100 tr"
                  min="1"
                  required={true}
                  onKeyPress={this.handleKeyPress}
                />
              </td>
              <td />
              <td className="pa1 tc">
                <button type="submit" className="bg-transparent bn pa2 pointer">
                  <i className="material-icons icon--small green">
                    add
                  </i>
                </button>
              </td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="2" className="tr pb1">
                Total: 12
              </td>
              <td colSpan="2" />
            </tr>
          </tfoot>
        </table>
      </form>
    )
  }
}
