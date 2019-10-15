import React from 'react'

const Loading = React.memo(() => <div className="grey">Loading...</div>)

const NoData = React.memo(({ text = '' }) => (
  <section className="mw5 mw7-ns center ph5-ns">
    <p className="lh-copy measure tc grey f4">{text}</p>
  </section>
))
export { Loading, NoData }
