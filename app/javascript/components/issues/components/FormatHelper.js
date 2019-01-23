export const formatIssueNo = issueNo => {
  console.log(`issueNo: ${issueNo}`)
  if (issueNo) {
    return `#${issueNo.toString().padStart(5, '0')}` 
  } else {
    ''
  }
}
