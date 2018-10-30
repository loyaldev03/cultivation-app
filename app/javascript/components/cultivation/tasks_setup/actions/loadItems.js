import ItemStore from '../stores/ItemStore'

export default function loadItems(facility_id) {
  let url = `/api/v1/catalogues/raw_materials?facility_id=${facility_id}`
  fetch(url)
    .then(resp => resp.json()) // Transform the data into json
    .then(function(data) {
      ItemStore.replace(build_items_options(data.data))
      // ItemStore.replace(data.data)
    })
    .catch(function(error) {
      console.log(error)
    })
}

// const build_items_options = items =>
//   items.map(f => ({
//     value: f.id,
//     label: `${f.attributes.name}`
//   }))

const build_items_options = items =>
  items.map(f => ({
    id: f.id,
    ...f.attributes
  }))
