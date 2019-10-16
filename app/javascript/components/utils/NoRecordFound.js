import React from 'react'

const NoData = React.memo(({ text = '' }) => (
  <section className="mw5 mw7-ns center ph5-ns">
    <p className="lh-copy measure tc grey f4 i">{text ? text : 'No record found'}</p>
  </section>
))

export { NoData }
