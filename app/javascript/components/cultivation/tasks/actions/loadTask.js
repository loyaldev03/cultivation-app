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


      }).catch(function (error) {
        console.log(error)
    });
    // fetch(....).then(data => {
    //   store.replaceList(data.tasks))
    //   store.batchName = data.batch_name
    //   store.startDate = new Date(data.start_date)
    // }
  }
}

const task = new loadTask()
export default task
