import React from 'react'
import saveMaterialUsed from '../actions/saveMaterialUsed'

class MaterialUsedRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      actual: props.actual || 0,
      waste: props.waste || 0,
      changed: false
    }
  }

  onInputChange = event => {
    this.setState({
      [event.target.attributes.name.value]: event.target.value,
      changed: true
    })
  }

  onSave = event => {
    event.preventDefault()
    this.setState({ changed: false })

    saveMaterialUsed(
      this.props.batchId,
      this.props.taskId,
      this.props.id,
      this.state.actual,
      this.state.waste
    )
  }

  onCancel = event => {
    this.setState({
      actual: this.props.actual || 0,
      waste: this.props.waste || 0,
      changed: false
    })
  }

  render() {
    const { material, expected, uom, showTarget = false } = this.props

    const { actual, waste } = this.state

    return (
      <div className="flex items-center pv2">
        <div className="f6 dark-gray w-60">{material}</div>
        <div
          className="f6 dark-gray flex items-center justify-center"
          style={{ width: '100px', minWidth: '100px' }}
        >
          {showTarget && `${expected} ${uom}`}
        </div>
        <div
          className="f6 dark-gray flex items-center justify-start mr2"
          style={{ width: '100px' }}
        >
          <input
            value={actual}
            name="actual"
            type="number"
            size="2"
            min="0"
            className="flex flex-auto pa1 br1 tr ba b--black-20 br2 outline-0 w-60"
            onChange={this.onInputChange}
          />
          <span className="ml1 grey" style={{ width: '40px' }}>
            {uom}
          </span>
        </div>
        <div
          className="f6 dark-gray flex items-center justify-start"
          style={{ width: '100px' }}
        >
          <input
            value={waste}
            name="waste"
            type="number"
            size="4"
            min="0"
            className="flex flex-auto pa1 ba tr ba b--black-20 br2 outline-0 w-60"
            onChange={this.onInputChange}
          />
          <span className="ml1 grey" style={{ width: '40px' }}>
            {uom}
          </span>
        </div>
        <div
          style={{ width: '50px', minWidth: '50px' }}
          className="flex items-center justify-start"
        >
          {this.state.changed && (
            <React.Fragment>
              <i
                className="material-icons orange icon--small icon--btn pa0"
                style={{ fontSize: '16px' }}
                onClick={this.onSave}
              >
                done
              </i>
              <i
                className="material-icons grey icon--small icon--btn pa0"
                style={{ fontSize: '16px' }}
                onClick={this.onCancel}
              >
                clear
              </i>
            </React.Fragment>
          )}
        </div>
      </div>
    )
  }
}

export default MaterialUsedRow
