import React from 'react'
const activeTabs =
  'link bb-r br-r bt-l br-l pv3 ph4 b--black-10 f6 fw6 dark-gray hover-bg-light-gray bg-white'
const inactiveTabs =
  'link bt-l bb-l br-l pv3 ph4 b--black-10 f6 fw6 gray hover-dark-gray hover-bg-light-gray bg-white'

const resolveActive = (tab, currentTab) => {
  if (tab === currentTab) {
    return activeTabs
  }
  return inactiveTabs
}

const batchTabs = ({batch, currentTab=''}) => {
  return (
    <div className="flex mt4">
      <a
        href={'/cultivation/batches/' + batch.id}
        className={resolveActive('taskList', currentTab)}
      >
        Tasks List
      </a>

      <a
        href={'/cultivation/batches/' + batch.id + '/gantt'}
        className={resolveActive('gantChart', currentTab)}
      >
        Gantt Chart
      </a>
      <a
        href={'/cultivation/batches/' + batch.id + '/locations'}
        className={resolveActive('location', currentTab)}
      >
        Location
      </a>

      <a
        href={'/cultivation/batches/' + batch.id + '/issues'}
        className={resolveActive('issues', currentTab)}
      >
        Issues
      </a>

      <a
        href={
          '/cultivation/batches/' + batch.id + '/secret_sauce'
        }
        className={resolveActive('secretSauce', currentTab)}
      >
        Secret Sauce
      </a>

      <a
        href={'/cultivation/batches/' + batch.id + '/resource'}
        className={resolveActive('resources', currentTab)}
      >
        Resource
      </a>

      <a
        href={'/cultivation/batches/' + batch.id + '/material'}
        className={resolveActive('materials', currentTab)}
      >
        Material
      </a>
    </div>
  )
}

export default batchTabs