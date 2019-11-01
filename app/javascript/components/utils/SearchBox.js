import React, { useEffect, useRef, useState } from 'react'
import isEmpty from 'lodash.isempty'
import classNames from 'classnames'
import { httpGetOptions } from '../utils'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'
import QuickSearchBox from './QuickSearchBox'
class SearchStore {
  @observable results = []
  @observable plant

  @action
  async search() {
    const url = '/api/v1/notifications'
    const res = await (await fetch(url, httpGetOptions)).json()
    if (res && res.data) {
      this.results = res.data.map(x => x.attributes)
    } else {
      this.results = []
    }
  }

  @computed
  get hasUnread() {
    if (isEmpty(this.notifications)) {
      return false
    }
    const unread = this.notifications.some(x => isEmpty(x.read_at))
    return !!unread
  }
}

const store = new SearchStore()

function SearchBox(props) {
  const node = useRef()
  const [expand, setExpand] = useState(false)

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // elided, because clicking inside popup
      return
    }
    // clicking outside popup
    setExpand(false)
  }

  const handleExpand = e => {
    e.preventDefault()
    e.stopPropagation()
    if (!expand) {
      store.load()
    }
    setExpand(!expand)
  }

  const handleClickItem = async (id, url) => {
    window.location.replace(url)
  }

  return (
    <div ref={node} className="flex min-w250">
      <QuickSearchBox facility_id={props.facility_ids} />
      {expand && (
        <div className="notification shadow-3 ba br2 b--light-grey fixed top-3 right-1">
          <div className="notification__header">
            <span className="notification__header__text">Notifications</span>
            <i
              className="pointer material-icons grey icon--medium pa1 fr"
              onClick={() => setExpand(false)}
            >
              close
            </i>
          </div>
          <NotificationList onClick={(id, url) => handleClickItem(id, url)} />
        </div>
      )}
    </div>
  )
}

const NotificationIcon = observer(({ onClick }) => {
  return (
    <a href="#0" onClick={onClick} className="ph2">
      <i
        className={classNames('material-icons md-15', {
          red: store.hasUnread,
          grey: !store.hasUnread
        })}
      >
        {store.hasUnread ? 'notifications' : 'notifications_none'}
      </i>
    </a>
  )
})

const NotificationList = observer(({ onClick }) => {
  return (
    <div className="notification__list">
      {store.notifications.map(x => {
        return (
          <div
            key={x.id}
            className={classNames('notification__item', {
              'notification__item--unread': !x.read_at
            })}
          >
            <a
              href="#0"
              className="notification__item__link"
              onClick={() => onClick(x.id, x.url)}
            >
              {x.messages || '--'}
            </a>
          </div>
        )
      })}
    </div>
  )
})

export default SearchBox
