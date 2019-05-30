import 'babel-polyfill'
import classNames from 'classnames'
import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { httpGetOptions, httpPostOptions, toast } from './'

class TimeTaveller extends React.Component {
  state = {
    current_time: null,
    enable_time_travel: false
  }
  async componentDidMount() {
    const url = '/api/v1/system/configuration'
    const res = await (await fetch(url, httpGetOptions)).json()
    if (res && res.data) {
      if (res.data.enable_time_travel) {
        this.setState({
          current_time: new Date(res.data.current_time),
          enable_time_travel: true
        })
      } else {
        this.setState({
          current_time: new Date(this.props.current_time),
          enable_time_travel: false
        })
      }
    }
  }
  onChange = async current_time => {
    this.setState({ current_time })
    const url = '/api/v1/system/update_configuration'
    const payload = { current_time }
    const res = await (await fetch(url, httpPostOptions(payload))).json()
    if (res && res.data) {
      if (res.data.enable_time_travel) {
        const date = new Date(res.data.current_time)
        toast(`You've time travel to ${date}`, 'success')
      } else {
        const date = new Date(res.data.current_time)
        toast(`You've return to current time`, 'success')
      }
      setTimeout(() => window.location.reload(), 1000)
    }
  }
  render() {
    const { current_time, enable_time_travel } = this.state
    return (
      <div className="ph2 f6 grey flex justify-center items-center">
        <span
          className={classNames('w4 mr2 tr', { 'b red': enable_time_travel })}
        >
          Clock Tower:
        </span>
        <div id="toast" className="toast z-9999" />
        <DatePicker
          className={classNames('f5 w-100 measure-wide ', {
            'ba b--red br3': enable_time_travel
          })}
          value={current_time}
          fieldname="start_date"
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default TimeTaveller
