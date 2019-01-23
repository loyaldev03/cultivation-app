import { httpGetOptions } from '../../utils/FetchHelper'
import getComments from './getComments'
import currentIssueStore from '../store/CurrentIssueStore'

const getIssue = issueId => {
  Promise.all([
    _getIssue(issueId),
    getComments(issueId)
  ]).then(([issueData, commentsData]) => {

    console.group('issueData')
    console.log(issueData)
    console.groupEnd()

    console.group('commentsData')
    console.log(commentsData)
    console.groupEnd()

    const { data: { data: { attributes: issue } }, status: issuedStatus } = issueData
    let commentsStatus = commentsData.status
    let comments = []
    

    if (issuedStatus === 200 && commentsStatus === 200) {
      comments = commentsData.data.data.map(x => x.attributes)
      console.log('getIssue success!')
      console.log(issue)
      console.log(comments)
      currentIssueStore.setIssue(issue)
      currentIssueStore.setComments(comments)
    }
  })
}


const _getIssue = issueId => {
  return fetch(`/api/v1/issues/${issueId}`, httpGetOptions).then(response => {
    return response.json().then(data => ({
      status: response.status,
      data
    }))
  })
}

export default getIssue
