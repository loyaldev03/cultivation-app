import 'babel-polyfill'
import React from 'react'
import { observer } from 'mobx-react'
import Calendar from 'react-calendar'

@observer
class DashboardCalendarApp extends React.Component {
  constructor(props) {
    super(props)
    this.state = { date: new Date() }
  }

  onChange = date => this.setState({ date })

  render() {
    return (
      <React.Fragment>
        <div className='flex justify-center mt3 w-100'>
          <Calendar onChange={this.onChange} value={this.state.date} />
        </div>
      </React.Fragment>
    )
  }
}

export default DashboardCalendarApp
