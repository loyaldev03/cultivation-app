import React from "react";


const MotherPlantSouceSelection = () => (
  <div>
    <span>Please select the mother plant source:</span>
  </div>
)

class BatchLocationApp extends React.Component {
  state = {
    fromMotherPlant: true,
    selectedPlants: new Set([])
  }

  onSelectPlant = e => {
    if (e.target.checked) {
      this.setState({
        selectedPlants: this.state.selectedPlants.add(e.target.value)
      })
    } else {
      this.state.selectedPlants.delete(e.target.value)
      this.setState({
        selectedPlants: this.state.selectedPlants
      })
    }
  }

  render() {
    return (
      <div>
        { this.state.fromMotherPlant &&
          <div>
            <span className="db dark-grey mb2">Please select the mother plant source:</span>
            <table className="collapse ba br2 b--black-10 pv2 ph3">
              <tbody>
                <tr className="striped--light-gray">
                  <th className="pv2 ph3 tl f6 fw6 ttu">Plant ID</th>
                  <th className="tr f6 ttu fw6 pv2 ph3">Strain</th>
                  <th></th>
                </tr>
                <tr className="striped--light-gray">
                  <td className="pv2 ph3">ABCD-001</td>
                  <td className="pv2 ph3">OG Kush</td>
                  <td className="pv2 ph3"> <input type="checkbox" value="ABCD-001" onChange={this.onSelectPlant} /> </td>
                </tr>
                <tr className="striped--light-gray">
                  <td className="pv2 ph3">ABCD-002</td>
                  <td className="pv2 ph3">OG Kush</td>
                  <td className="pv2 ph3"> <input type="checkbox" value="ABCD-002" onChange={this.onSelectPlant} /> </td>
                </tr>
                <tr className="striped--light-gray">
                  <td className="pv2 ph3">ABCD-003</td>
                  <td className="pv2 ph3">OG Kush</td>
                  <td className="pv2 ph3"> <input type="checkbox" value="ABCD-003" onChange={this.onSelectPlant} /> </td>
                </tr>
                <tr className="striped--light-gray">
                  <td className="pv2 ph3">CCDE-001</td>
                  <td className="pv2 ph3">Donkey Kong</td>
                  <td className="pv2 ph3"> <input type="checkbox" value="CCDE-001" onChange={this.onSelectPlant} /> </td>
                </tr>
                <tr className="striped--light-gray">
                  <td className="pv2 ph3">CCDE-002</td>
                  <td className="pv2 ph3">Donkey Kong</td>
                  <td className="pv2 ph3"> <input type="checkbox" value="CCDE-002" onChange={this.onSelectPlant} /> </td>
                </tr>
              </tbody>
            </table>

            { this.state.selectedPlants.size > 0 &&
              <div className="pv2">
                <button className="btn">Next</button>
              </div>
            }
          </div>
        }
      </div>
    )
  }
}

export default BatchLocationApp