import { observable, computed, action } from "mobx";
import { inject, observer } from 'mobx-react';
class TaskStore {
  @observable tasks = [];

  constructor() {
    this.tasks = [{name: 'Fathi'}, {name: 'Abdul'}, {name: 'Rahim'}]
  }

  @action
  update(id, status) {
    this.status = status
  }

  replaceList(newList){
    this.tasks = newList
  }
}
const tasks = new TaskStore()
export default tasks