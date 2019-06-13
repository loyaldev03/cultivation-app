import React from 'react'
import PropTypes from 'prop-types'
import { observer } from 'mobx-react'
import { SlidePanelHeader, SlidePanelFooter } from '../utils'
import { TextInput, NumericInput } from '../utils/FormHelpers'

import DatePicker from 'react-date-picker/dist/entry.nostyle'

@observer
class HolidayForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  setDate(date) {
    this.setState({
      title: '',
      date: date
    })
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  handleChangeDate = (fieldName, value) => {
    this.setState({
      [fieldName]: value
    })
  }

  onSave = async () => {
    console.log(this.state.title)
    await this.props.onSave({ title: this.state.title, date: this.state.date })
  }

  render() {
    const { onClose } = this.props
    const { title, date } = this.state
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
              <div className="w-50">
                <label className="f6 fw6 db mb1 gray ttc">Date</label>
                <DatePicker
                  value={date}
                  fieldname="date"
                  onChange={value => this.handleChangeDate('date', value)}
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
