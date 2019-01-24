export const formatIssueNo = issueNo => {
  if (issueNo) {
    return `#${issueNo.toString().padStart(5, '0')}`
  } else {
    ('')
  }
}
