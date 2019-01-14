import React from 'react'
import Select from 'react-select'
import reactSelectStyle from './reactSelectStyle'
import UserOption from './UserOption'
import UserSingleValue from './UserSingleValue'

class UserPicker extends React.Component {
  render() {
    const user = this.props.userId
      ? this.props.users.find(x => x.value === this.props.userId)
      : null

    return (
      <Select
        isSearchable
        isClearable
        options={this.props.users}
        onChange={this.props.onChange}
        value={user}
        styles={reactSelectStyle}
        components={{ Option: UserOption, SingleValue: UserSingleValue }}
      />
    )
  }
}

export default UserPicker
