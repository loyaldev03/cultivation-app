import React from "react";
import { render } from "react-dom";
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';

const styles = `

.DayPickerInput input{
  border-radius: .25rem;
  margin-bottom: .5rem;
  padding-left: .5rem;
  padding-right: .5rem;
  padding-top: .25rem;
  padding-bottom: .25rem;
color: #777;
    width: 70%;
    border-color: rgba(0, 0, 0, 0.2);
    border-style: solid;
    border-width: 1px;
}
.DayPickerInput {
    display: initial;
}
`

class DatepickerInput extends React.Component {


  setDateValue = (date) => {
    console.log(date)
    var s = document.getElementById('record_date_start');
    s.value = date;
  }

  render() {
    return (
      <React.Fragment>
        <style>{styles}</style>

        <div className="w-100 shelves_number_options">
          <div className="mb2">
            <div className="input flex pb2 flex-wrap string required record_conversion">
            <label className="mb2 string required w-100 dib f6 fw5 gray" for="record_conversion">
              When to start 
              <abbr title="required">*</abbr>
            </label>
              <DayPickerInput onDayChange={day => this.setDateValue(day)}/>
            </div>
          </div>
        </div>

      </React.Fragment>
    )
  }

}

export default DatepickerInput
