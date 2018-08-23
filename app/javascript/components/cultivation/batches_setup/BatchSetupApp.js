
import React from "react";
import Select from 'react-select'
import { render } from "react-dom";

import { observable } from "mobx";
import { observer, Provider } from "mobx-react";

// import loadTasks from './actions/loadTask'
// import TaskList from './components/TaskList'
// import TaskEditor from './components/TaskEditor'
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

class BatchSetupApp extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      plants: this.props.plants,
      strains: this.props.strains,
      facilities: this.props.facilities,
      id: '',
      plant: '',
      facility: '',
      strain: '',
      start_date: ''
    }
  }


  componentDidMount() {
    // loadTasks.loadbatch(this.props.batch_id)
  }

  handleSubmit=(event)=>{
    let url = '/api/v1/batches'
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify({
        batch_source: this.state.plant, facility: this.state.facility, 
        strain: this.state.strain, start_date: this.state.start_date
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.data)
        if(data.data.id != null){

          let elm = $_('#toast')
          elm.innerHTML = 'Batch Saved';
          elm.classList.add('fadeIn', 'toast--' + 'success', 'db');
          setTimeout(function () { fadeToast(); }, 3000);

          document.location.href = `/cultivation/batches/${data.data.id}?step=1`
        }
        else{alert('something is wrong')}
      })
  }

  handleChange=(field, value)=>{
    this.setState({ [field]: value });
  }

  setDateValue =(event) => {
    
  }

  render() {
    let plants = this.state.plants
    let strains = this.state.strains
    let facilities = this.state.facilities
    return (
      <React.Fragment>
        <style>{styles}</style>
        <div id="toast" class="toast animated toast--success">Row Saved</div>
        
        <h5 class="tl pa0 ma0 h5--font dark-grey">Cultivation Setup</h5>
        <p class="mt2 body-1 grey">
          Some cultivation setup here
        </p>
        <form>
          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label className="f6 fw5 db mb1 gray" for="record_batch_source">Select Plant</label>
              <Select options={plants} 
              onChange={(e)=>this.handleChange('plant', e.value)} 
              styles={customStyles}
              />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label className="f6 fw5 db mb1 gray" for="record_batch_source">Select Facility</label>
              <Select options={facilities} 
                styles={customStyles}
                onChange={(e) => this.handleChange('facility', e.value)} />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label className="f6 fw5 db mb1 gray" for="record_batch_source">Select Strains</label>
              <Select options={strains} 
                styles={customStyles}
                onChange={(e) => this.handleChange('strain', e.value)} />
            </div>
          </div>

          <div className="w-100 shelves_number_options">
            <div className="mt3">
              <label className="f6 fw5 db mb1 gray" for="record_batch_source">Select Start Date</label>
              <DayPickerInput onDayChange={(e) => this.handleChange('start_date', e)} />
            </div>
          </div>
          <div className="w-100 flex justify-end">
            <a className="pv2 ph3 bg-orange white bn br2 ttu tracked link dim f6 fw6 pointer" onClick={this.handleSubmit}>Submit</a>
          </div>

        </form>
      </React.Fragment>
    )
  }

}

const customStyles = {
  control: (base, state) => ({
    ...base,
    fontSize: '0.875rem',
    backgroundColor: '#fff',
    height: '30px',
    minHeight: '30px',
    borderColor: 'rgba(0, 0, 0, 0.2)'
  }),
  indicatorSeparator: () => ({
    display: 'none'
  }),
  menu: (base, state) => ({
    ...base,
    marginTop: 2
  }),
  dropdownIndicator: () => ({
    display: 'none'
  }),
  option: (base, state) => {
    return {
      ...base,
      backgroundColor:
        state.isFocused || state.isSelected
          ? 'rgba(100, 100, 100, 0.1)'
          : 'transparent',
      ':active': 'rgba(100, 100, 100, 0.1)',
      WebkitTapHighlightColor: 'rgba(100, 100, 100, 0.1)',
      color: 'black'
    }
  }
}


export default BatchSetupApp