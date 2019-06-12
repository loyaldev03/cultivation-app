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
  componentDidMount() {
    // if (!UserStore.isDataLoaded) {
    //   UserStore.loadUsers(this.props.facilityId)
    // }
  }

  setDate(start_date) {
    this.setState({
      start_date: start_date
    })
  }

  onChangeInput = field => e => this.setState({ [field]: e.target.value })

  handleChangeDate = (fieldName, value) => {
    this.setState({
      [fieldName]: value
    })
  }

  onSave = async () => {
    await this.props.onSave(this.state.selectedUsers)
  }

  render() {
    const { onClose } = this.props
    const { title, start_date, end_date } = this.state
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
                <label className="f6 fw6 db mb1 gray ttc">Start At</label>
                <DatePicker
                  value={start_date}
                  fieldname="start_date"
                  onChange={value => this.handleChangeDate('start_date', value)}
                />
              </div>
              <div className="w-50 pl3">
                <label className="f6 fw6 db mb1 gray ttc">End At</label>
                <DatePicker
                  value={end_date}
                  fieldname="end_date"
                  onChange={value => this.handleChangeDate('end_date', value)}
                />
              </div>
            </div>
          </div>
          <SlidePanelFooter onSave={this.onSave} onCancel={onClose} />
        </div>
      </div>
    )
  }
}

HolidayForm.propTypes = {
  // selectMode: PropTypes.string,
  // facilityId: PropTypes.string.isRequired,
  // onSave: PropTypes.func.isRequired,
  // onClose: PropTypes.func.isRequired,
  // title: PropTypes.string
}

HolidayForm.defaultProps = {
  // selectMode: 'multiple', // or 'single'
  // title: 'Assign Resources'
}

export default HolidayForm
