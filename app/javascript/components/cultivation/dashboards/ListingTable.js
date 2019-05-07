import React from 'react'
import ReactTable from 'react-table'

export default class ListingTable extends React.PureComponent {
  render() {
    const {
      data,
      columns,
      isLoading,
      onFetchData,
      pages = -1,
      ajax = false
    } = this.props
    if (ajax) {
      return (
        <ReactTable
          className="-highlight dashboard-theme"
          columns={columns}
          data={data}
          loading={isLoading}
          minRows={3}
          showPagination={true}
          manual
          onFetchData={onFetchData}
          pages={pages}
          defaultPageSize={20}
        />
      )
    }
    return (
      <ReactTable
        className="-highlight dashboard-theme"
        columns={columns}
        data={data}
        loading={isLoading}
        minRows={3}
        showPagination={data && data.length > 20}
        defaultPageSize={20}
      />
    )
  }
}
