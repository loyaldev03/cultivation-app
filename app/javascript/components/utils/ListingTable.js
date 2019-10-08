import React from 'react'
import ReactTable from 'react-table'

class ListingTable extends React.PureComponent {
  render() {
    const {
      data,
      columns,
      SubComponent,
      isLoading,
      onFetchData,
      pages = -1,
      sortable = false,
      ajax = false,
      idSelected = ''
    } = this.props
    if (ajax) {
      return (
        <ReactTable
          className="-highlight dashboard-theme"
          columns={columns}
          SubComponent={SubComponent}
          data={data}
          loading={isLoading}
          minRows={5}
          sortable={sortable}
          showPagination={true}
          manual
          onFetchData={onFetchData}
          pages={pages}
          defaultPageSize={20}
          getTrProps={(state, rowInfo, column) => {
            let className = 'task-row'
            if (
              rowInfo &&
              rowInfo.row &&
              idSelected &&
              idSelected === rowInfo.row.id
            ) {
              className = 'task-row shadow-1'
            }
            return {
              className
            }
          }}
        />
      )
    }
    return (
      <ReactTable
        className="-highlight dashboard-theme"
        columns={columns}
        SubComponent={SubComponent}
        data={data}
        loading={isLoading}
        minRows={5}
        sortable={sortable}
        showPagination={data && data.length > 20}
        defaultPageSize={20}
        getTrProps={(state, rowInfo, column) => {
          let className = 'task-row'
          if (
            rowInfo &&
            rowInfo.row &&
            idSelected &&
            idSelected === rowInfo.row.id
          ) {
            className = 'task-row shadow-1'
          }
          return {
            className
          }
        }}
      />
    )
  }
}

export { ListingTable }
