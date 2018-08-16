
import React from "react";
import { render } from "react-dom";
import taskStore from '../stores/TaskStore'
import { inject, observer } from 'mobx-react';

@inject('store')
class TaskList extends React.Component {
  render() {
    return(
      <React.Fragment>{JSON.stringify(this.props.store)}</React.Fragment>    
    )
    // const list = taskStore.thelist.map((x, i) => <Item data={x} key={i} />
    //     return (<React.Fragment>{list}</React.Fragment>)

  }
}

export default TaskList
