import React from 'react'
import saveMaterialUsed from '../actions/saveMaterialUsed'

class MaterialUsedRow extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      actual: props.actual || 0,
      wasted: props.wasted || 0,
      changed: false
    }
  }

  componentDidMount() {
    console.log(this.props)
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
      this.state.wasted
    )
  }

  onCancel = event => {
    this.setState({
      actual: this.props.actual || 0,
      wasted: this.props.wasted || 0,
      changed: false
    })
  }

  render() {
    const { material, expected, uom } = this.props

    const { actual, wasted } = this.state

    return (
      <div className="flex items-center pv2">
        <div className="f6 dark-gray w-60">{material}</div>
        <div
          className="f6 dark-gray flex items-center justify-center"
          style={{ width: '100px' }}
        >
          {expected} {uom}
        </div>
        <div
          className="f6 dark-gray flex items-center justify-start"
          style={{ width: '100px' }}
        >
          <input
            value={actual}
            name="actual"
            className="w-40"
            onChange={this.onInputChange}
          />
          <span className="ml1" style={{ width: '20px' }}>
            {uom}
          </span>
        </div>
        <div
          className="f6 dark-gray flex items-center justify-start"
          style={{ width: '100px' }}
        >
          <input
            value={wasted}
            name="wasted"
            className="w-40"
            onChange={this.onInputChange}
          />
          <span className="ml1" style={{ width: '20px' }}>
            {uom}
          </span>
        </div>
        {/* <div className="f6 dark-gray flex items-center justify-start" style={{ width: '100px' }}>
          30 lb
        </div> */}
        <div
          style={{ minWidth: '50px' }}
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
