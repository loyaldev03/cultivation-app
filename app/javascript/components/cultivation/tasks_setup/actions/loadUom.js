import UomStore from '../stores/UomStore'

export default function loadUsers() {
  let url = '/api/v1/uoms'
  fetch(url)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      console.log(build_uom_options(data.data))
      UomStore.replace(build_uom_options(data.data))
      console.log(UomStore)
    })
    .catch(function(error) {
      console.log(error)
    })
}

const build_uom_options = roles =>
  roles.map(f => ({
    value: f.attributes.unit,
    label: `${f.attributes.name}`
  }))
