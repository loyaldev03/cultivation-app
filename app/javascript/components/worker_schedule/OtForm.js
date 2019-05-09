import React from 'react'
import { observer } from 'mobx-react'
import { SlidePanelHeader, SlidePanelFooter } from '../utils'
import Calendar from 'react-calendar'
import WorkerScheduleStore from './stores/WorkerScheduleStore'
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
class OtForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      start_date: '',
      end_date: '',
      start_time: '',
      end_time: '',
      description: '',
      schedule_start_time: '',
      schedule_end_time: ''
    }
  }
  componentDidMount() {}

  onSave = async () => {
    const start_date = this.state.start_date
    const start_time = this.state.start_time.split(':')
    const start_date_time = new Date(
      start_date.getYear(),
      start_date.getMonth(),
      start_date.getDay(),
      start_time[0],
      start_time[1]
    )

    const end_date = this.state.end_date
    const end_time = this.state.end_time.split(':')
    const end_date_time = new Date(
      end_date.getYear(),
      end_date.getMonth(),
      end_date.getDay(),
      end_time[0],
      end_time[1]
    )

    await this.props.onSave(
      start_date_time,
      end_date_time,
      this.state.description
    )
  }

  onChangeDate = async value => {
    if (value) {
      let result = await WorkerScheduleStore.getWorkScheduleByDate(value)
      this.setState({
        start_date: value,
        end_date: value,
        schedule_start_time: result.start_time,
        schedule_end_time: result.end_time
      })
    }
  }

  onChangeDescription = event => {
    console.log(event.target.value)
    this.setState({ description: event.target.value })
  }

  onChangeOvertime = (key, value) => {
    console.log(key)
    console.log(value)
    this.setState({ [key]: value })
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
              <Calendar onChange={this.onChangeDate} value={this.state.date} />
            </div>

            <div className="mt4 fl w-100 flex justify-between">
              <label className="f6 fw6 db mb1 gray ttc">Working Hours</label>
              {this.state.schedule_start_time &&
              this.state.schedule_end_time ? (
                <div className="flex w-60 justify-around">
                  <label className="f6 grey">
                    {this.state.schedule_start_time}
                  </label>
                  <div className="flex items-center">
                    <label className="f4 db mb1 ttc">-</label>
                  </div>
                  <label className="f6 grey">
                    {this.state.schedule_end_time}
                  </label>
                </div>
              ) : (
                <div className="flex w-60 items-center mb1">
                  <span class="f6 grey">No schedule</span>
                </div>
              )}
            </div>

            <div className="mt2 fl w-100 flex justify-between">
              <label className="f6 fw6 db mb1 gray ttc">Overtime</label>
              <div className="flex w-60 justify-between">
                <input
                  className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                  type="time"
                  value={this.state.start_time}
                  onChange={e =>
                    this.onChangeOvertime('start_time', e.target.value)
                  }
                />
                <div className="flex items-center">
                  <label className="f4 db mb1 ttc">-</label>
                </div>
                <input
                  className="db pa2 f6 black ba b--black-20 br2 outline-0 no-spinner tc"
                  type="time"
                  value={this.state.end_time}
                  onChange={e =>
                    this.onChangeOvertime('end_time', e.target.value)
                  }
                />
              </div>
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

export default OtForm
