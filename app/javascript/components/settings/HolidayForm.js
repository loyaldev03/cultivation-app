import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { SlidePanelHeader, SlidePanelFooter } from '../utils'
import { TextInput, NumericInput } from '../utils/FormHelpers'
import { addDays, differenceInCalendarDays } from 'date-fns'
import DatePicker from 'react-date-picker/dist/entry.nostyle'
import {parse} from 'date-fns'
@observer
class HolidayForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  setHoliday(holiday) {
    console.log(JSON.stringify(holiday))
    this.setState({
      id: holiday.id,
      title: holiday.attributes.title,
      start_date: new Date(holiday.attributes.start_date),
      end_date: new Date(holiday.attributes.end_date),
      duration: holiday.attributes.duration
    })
  }

  setDate(date) {
    this.setState({
      id: '',
      title: '',
      start_date: date,
      end_date: '',
      duration: ''
    })
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  handleChangeDate = (fieldName, e) => {
    console.log(e)
    if (fieldName === 'duration') {
      this.setState({
        end_date: addDays(this.state.start_date, e.target.value),
        duration: e.target.value
      })
    } 
    else if (fieldName === 'end_date' && this.state.start_date) {
      this.setState({
        end_date: e,
        duration: differenceInCalendarDays(e, this.state.start_date)
      })
    } else if (fieldName === 'start_date' && this.state.end_date) {
      this.setState({
        start_date: e,
        end_date: addDays(e, this.state.duration)
      })
    }
    else {
      this.setState({
        [fieldName]: e
      })
    }
  }

  onSave = async () => {
    await this.props.onSave({
      id: this.state.id,
      title: this.state.title,
      start_date: parse(this.state.start_date),
      end_date: parse(this.state.end_date),
      duration: this.state.duration
    })
  }

  render() {
    const { onClose } = this.props
    const { title, start_date, end_date, duration } = this.state
    return (
      <div className="flex flex-column h-100">
        <SlidePanelHeader onClose={onClose} title={this.props.title} />
        <div className="flex flex-column flex-auto justify-between">
          <div className="pa3 flex flex-column">
            <div className="ph3 mv3 flex">
              <div className="w-100">
                <TextInput
                  label={'Title'}
                  value={title}
                  onChange={this.onChangeInput('title')}
                  errorField="name"
                />
              </div>
            </div>


            <div className="ph3 mb3 flex">
              <div className="w-40">
                <label className="f6 fw6 db mb1 gray ttc">Start At</label>
                <DatePicker
                  value={start_date}
                  fieldname="start_date"
                  onChange={value => this.handleChangeDate('start_date', value)}
                />
              </div>
              <div className="w-40 pl3">
                <label className="f6 fw6 db mb1 gray ttc">End At</label>
                <DatePicker
                  value={end_date}
                  fieldname="end_date"
                  onChange={value => this.handleChangeDate('end_date', value)}
                />
              </div>
              <div className="w-20 pl3">
                <NumericInput
                  label={'Duration'}
                  min="1"
                  value={duration}
                  onChange={e => this.handleChangeDate('duration', e)}
                />
              </div>
            </div>
          </div>
          <div className="pv3 ph4 bt b--light-grey">
            <input
              // type="submit"
              className="fr btn btn--primary w2"
              value={'Save'}
              onClick={this.onSave}
            />
          </div>
        </div>
      </div>
    )
  }
}

export default HolidayForm
