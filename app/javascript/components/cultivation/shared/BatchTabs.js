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

const batchTabs = ({ batch, currentTab = '', unresolvedIssueCount = 0 }) => {
  return (
    <div className="flex mt4 items-center">
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
        href={'/cultivation/batches/' + batch.id + '/issues'}
        className={resolveActive('issues', currentTab)}
      >
        Issues
        {unresolvedIssueCount > 0 && (
          <span className="b--orange ba orange f7 fw4 ph1 br2 ml1">
            {unresolvedIssueCount}
          </span>
        )}
      </a>

      {/* <a
        href={'/cultivation/batches/' + batch.id + '/locations'}
        className={resolveActive('location', currentTab)}
      >
        Location
      </a> */}


      <a
        href={'/cultivation/batches/' + batch.id + '/secret_sauce'}
        className={resolveActive('secretSauce', currentTab)}
      >
        Nutrient Profile
      </a>

      <a
        href={'/cultivation/batches/' + batch.id + '/resource'}
        className={resolveActive('resources', currentTab)}
      >
        Resource
      </a>

      {/* <a
        href={'/cultivation/batches/' + batch.id + '/material'}
        className={resolveActive('materials', currentTab)}
      >
        Material
      </a> */}

      <a
        href={'/cultivation/batches/' + batch.id + '/material'}
        className={resolveActive('materials', currentTab)}
      >
        METRC IDs
      </a>
    </div>
  )
}

export default batchTabs
