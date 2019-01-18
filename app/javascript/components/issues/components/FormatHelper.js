export const formatIssueNo = issueNo => {
  return `ISSUE #${issueNo.toString().padStart(5, '0')}`
}