import 'babel-polyfill'
import React from 'react'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import { httpGetOptions, httpPostOptions, toast } from './'

class TimeTaveller extends React.Component {
  state = {
    current_time: null
  }
  async componentDidMount() {
    const url = '/api/v1/system/configuration'
    const res = await (await fetch(url, httpGetOptions)).json()
    if (res && res.data) {
      this.setState({
        current_time: new Date(res.data.current_time) || new Date()
      })
    }
  }
  onChange = async current_time => {
    this.setState({ current_time })
    const url = '/api/v1/system/update_configuration'
    const payload = { current_time }
    const res = await (await fetch(url, httpPostOptions(payload))).json()
    if (res && res.data) {
      const date = new Date(res.data.current_time)
      toast(`🕓 You time travel to ${date}`, 'success')
      setTimeout(() => window.location.reload(), 1000)
    }
  }
  render() {
    const { current_time } = this.state
    return (
      <div className="ph3 f5 grey flex justify-center items-center">
        <span className="w4 pr2 tr">Clock Tower:</span>
        <div id="toast" className="toast" />
        <DatePicker
          className="w5 tr"
          value={current_time}
          fieldname="start_date"
          onChange={this.onChange}
        />
      </div>
    )
  }
}

export default TimeTaveller
