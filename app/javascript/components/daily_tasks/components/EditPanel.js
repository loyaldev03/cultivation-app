import React from 'react'
import { observer } from 'mobx-react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import { addNotes } from '../actions/taskActions'

@observer
class EditPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    const { dailyTask } = this.props
    addNotes(dailyTask, this.state.value);
    this.setState({value: ''});
    event.preventDefault();
  }

  render () {
    const { dailyTask } = this.props

    return (<Tabs>
      <TabList className="f5 bb flex pl1">
        <Tab className="dib link pv1 ph2 black pointer">Logs & Activities</Tab>
        <Tab className="dib link pv1 ph2 black pointer">Material Used & Wastes</Tab>
        <Tab className="dib link pv1 ph2 black pointer">Issues</Tab>
      </TabList>

      <div className="f5 flex pa2">
        <TabPanel className="w-100">
          <div className="b">Notes</div>
          {dailyTask.attributes.notes.map((note, i) => (
            <div key={i}>{i+1}) {note.notes}</div>
          ))}

          <form className="mt3" onSubmit={this.handleSubmit}>
            <textarea className="w-100" placeholder="Write an update ..." rows="5" value={this.state.value} onChange={this.handleChange}></textarea>
            <input type="submit" value="Save" />
          </form>
        </TabPanel>
        <TabPanel></TabPanel>
        <TabPanel></TabPanel>
      </div>
    </Tabs>)
  }
}

export default EditPanel