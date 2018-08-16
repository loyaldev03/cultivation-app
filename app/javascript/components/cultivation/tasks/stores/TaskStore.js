import { observable, computed, action } from "mobx";
import { inject, observer } from 'mobx-react';
class TaskStore {
  @observable tasks = [];

  constructor() {
    //need id here
    //api call /batch/:id/tasks
    this.tasks = [{name: 'Fathi'}, {name: 'Abdul'}, {name: 'Rahim'}]
  }

  @action
  update(id, status) {
    this.status = status
  }
}
const tasks = new TaskStore()
export default tasks