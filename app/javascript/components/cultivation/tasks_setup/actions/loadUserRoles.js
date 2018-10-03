import UserRoleStore from '../stores/UserRoleStore'

export default function loadUsers() {
  let url = '/api/v1/users/roles'
  fetch(url)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(build_roles_options(data.data))
      UserRoleStore.replace(build_roles_options(data.data))
    })
    .catch(function(error) {
      console.log(error)
    })
}






const build_roles_options = roles =>
  roles.map(f => ({
    value: f.id,
    label: `${f.attributes.name}`
  }))