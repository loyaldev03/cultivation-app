import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanelHeader, SlidePanelFooter } from '../utils'
import Calendar from 'react-calendar'

const otCalendar = `
  #ot-calendar .react-calendar{
    border: initial;
  }

  #ot-calendar .react-calendar__tile--active {
      background: #F66830;
      color: white;
  }
`

@observer
class PtoForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  componentDidMount() {}

  onSave = async () => {
    await this.props.onSave(this.state.start_date, this.state.end_date, this.state.description)
  }

  onChange = value => {
    if (value) {
      this.setState({
        start_date: value[0],
        end_date: value[1]
      })
    }
  }

  onChangeDescription = event => {
    console.log(event.target.value)
    this.setState({ description: event.target.value })
  }

  render() {
    const { onClose } = this.props
    return (
      <div className="flex flex-column h-100">
        <style>{otCalendar}</style>
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3">
            <div className="flex justify-center" id="ot-calendar">
              <Calendar
                onChange={this.onChange}
                value={this.state.date}
                selectRange={true}
                returnValue={'range'}
              />
            </div>

            <textarea
              rows="4"
              cols="50"
              className="w-100 pa2 mt4"
              placeholder="Please enter a reason of changing schedule"
              onChange={this.onChangeDescription}
              value={this.state.description}
            />
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

export default PtoForm
