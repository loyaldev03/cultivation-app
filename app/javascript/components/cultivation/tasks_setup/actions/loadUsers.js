import UserStore from '../stores/UserStore'

export default function loadUsers() {
  let url = '/api/v1/users'
  fetch(url)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      UserStore.load(data.data)
    })
    .catch(function(error) {})
}
