import React from 'react'
import ReactTable from 'react-table'
import { observer } from 'mobx-react'
import strainStore from '../store/StrainStore'

const columns = [
  {
    Header: 'Name',
    accessor: 'attributes.strain_name',
    className: 'tl pl2',
    headerClassName: 'tl',
    Cell: x => (
      <a href="#0" className="link grey" onClick={e => openStrain(e, x.index)}>
        {x.value}
      </a>
    )
  },
  {
    Header: 'Type',
    accessor: 'attributes.strain_type',
    className: 'tl ttc',
    maxWidth: 120,
    headerClassName: 'tl'
  },
  {
    Header: 'THC Content',
    accessor: 'attributes.thc',
    className: 'tr',
    maxWidth: 120,
    headerClassName: 'tr'
  },
  {
    Header: 'CBD Content',
    accessor: 'attributes.cbd',
    className: 'tr',
    maxWidth: 120,
    headerClassName: 'tr'
  }
]

function openStrain(event, index) {
  const id = strainStore.strains.slice()[index].id
  window.editorSidebar.open({ width: '500px', facility_strain_id: id })
  event.preventDefault()
}

@observer
class StrainList extends React.Component {
  render() {
    return (
      <ReactTable
        columns={columns}
        pagination={{ position: 'top' }}
        data={strainStore.strains.slice()}
        showPagination={false}
        pageSize={30}
        minRows={5}
        filterable
        className="f6 -highlight"
        showPagination={strainStore.strains.length > 30}
      />
    )
  }
}

export default StrainList
