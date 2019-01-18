export const formatIssueNo = issueNo => {
  return `#${issueNo.toString().padStart(5, '0')}`
}
