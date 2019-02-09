import { httpGetOptions } from '../../utils/FetchHelper'

const loadUnresolvedIssueCount = batchId => {
  return fetch(`/api/v1/issues/unresolved_count/${batchId}`, httpGetOptions).then(x => x.json())
}

export default loadUnresolvedIssueCount