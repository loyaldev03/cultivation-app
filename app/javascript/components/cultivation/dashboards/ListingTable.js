import React from 'react'
import ReactTable from 'react-table'

class ListingTable extends React.PureComponent {
  render() {
    const { data, columns, isLoading } = this.props
    return (
      <ReactTable
        className="-highlight dashboard-theme"
        columns={columns}
        data={data}
        loading={isLoading}
        pageSize={20}
        minRows={3}
        showPagination={data && data.length > 20}
      />
    )
  }
}

export default ListingTable
