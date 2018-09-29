import React from 'react'
import styled from 'styled-components'

import WorkToDoToday from './components/WorkToDoToday'

const WorkDashboardApp = (props) => (
  <div className="flex">
    <StyledWorkToDoToday className="outline w-50 mr2" {...props} />
    <SelectedTask className="outline w-50" />
  </div>
)

const StyledWorkToDoToday = styled(WorkToDoToday)`
  min-width: 300px;
`

const SelectedTask = styled.div`
  min-width: 300px;
`

export default WorkDashboardApp
