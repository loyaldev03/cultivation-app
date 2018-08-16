import store from '../stores/TaskStore'

class loadTask {
  constructor(){
  }

  loadbatch(batch_id) {
    let id = batch_id['$oid']
    let url = `/api/v1/batches/${id}/tasks`
    fetch(url)
      .then((resp) => resp.json()) // Transform the data into json
      .then(function (data) {
        console.log(data.data)
        store.replaceList(data.data)
        console.log(JSON.stringify(store))
      }).catch(function (error) {
        console.log(error)
    });
  }
}

const task = new loadTask()
export default task
