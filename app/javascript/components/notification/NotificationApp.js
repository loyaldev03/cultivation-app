import 'babel-polyfill'
import React, { useEffect, useRef, useState } from 'react'
import isEmpty from 'lodash.isempty'
import classNames from 'classnames'
import { httpGetOptions, httpPostOptions } from '../utils'
import { observer } from 'mobx-react'
import { observable, action, computed } from 'mobx'

class NotificationStore {
  @observable notifications = []

  constructor() {
    this.load()
  }

  @action
  async load() {
    const url = '/api/v1/notifications'
    const res = await (await fetch(url, httpGetOptions)).json()
    if (res && res.data) {
      this.notifications = res.data.map(x => x.attributes)
    } else {
      this.notifications = []
    }
  }

  @action
  async markAsRead(id) {
    const url = `/api/v1/notifications/${id}/mark_as_read`
    const res = await (await fetch(url, httpPostOptions())).json()
    await this.load()
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

const store = new NotificationStore()

function NotificationApp() {
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
  const handleMarkAsRead = async id => {
    await store.markAsRead(id)
  }
  return (
    <div ref={node}>
      <NotificationIcon onClick={handleExpand} />
      {expand && (
        <div className="z-5 width-550 bg-white shadow-3 ba br2 b--light-grey pb3 fixed top-3 right-1">
          <div className="w-100 tc pv2 ph3">
            <span className="grey f5 fw6">Notifications</span>
            <i
              className="pointer material-icons grey icon--medium fr"
              onClick={() => setExpand(false)}
            >
              close
            </i>
            <hr className="" />
          </div>
          <NotificationList onClick={id => handleMarkAsRead(id)} />
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
    <React.Fragment>
      {store.notifications.map(x => {
        return (
          <div
            key={x.id}
            className="pointer ph3 pv2 hover-bg-grey mb2 bt bb b--light-grey"
          >
            <a
              href="#0"
              className={classNames('link fw6 dark-grey', {
                'light-grey': !!x.read_at
              })}
              onClick={() => onClick(x.id)}
            >
              {x.messages || '--'}
            </a>
            <a href={x.url} className="ph2">
              view
            </a>
          </div>
        )
      })}
    </React.Fragment>
  )
})

export default NotificationApp
