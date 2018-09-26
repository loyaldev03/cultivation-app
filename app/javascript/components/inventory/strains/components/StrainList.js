import React from 'react'
import ReactTable from 'react-table'
import { observer } from 'mobx-react'
import strainStore from '../store/StrainStore'

const columns = [
  {
    Header: 'Name',
    accessor: 'attributes.strain_name',
    className: 'tl pl2',
    headerClassName: 'tl'
  },
  {
    Header: 'Type',
    accessor: 'attributes.strain_type',
    className: 'tl',
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
  },
  {
    Header: 'Testing status',
    accessor: 'attributes.testing_status',
    className: 'tl',
    headerClassName: 'tl'
  },
  {
    Header: 'Facility',
    accessor: 'attributes.facility_name',
    className: 'tl',
    headerClassName: 'tl'
  },
  {
    Header: '',
    className: 'tc',
    filterable: false,
    maxWidth: 45,
    Cell: x => (
      <a href="#" onClick={() => openStrain(x.index)}>
        <i className="material-icons gray">more_horiz</i>
      </a>
    )
  }
]

function openStrain(index) {
  const id = strainStore.strains.slice()[index].id
  window.editorSidebar.open({ width: '500px', facility_strain_id: id })
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
        minRows={10}
        filterable
        className="f6"
        showPagination={strainStore.strains.length > 30}
      />
    )
  }
}

export default StrainList
