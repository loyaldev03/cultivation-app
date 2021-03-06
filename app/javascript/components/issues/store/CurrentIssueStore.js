import { observable, action, computed, set } from 'mobx'

class CurrentIssueStore {
  @observable issue = this.resetState()
  @observable comments = []
  @observable mode = ''

  resetState = () => {
    return {
      id: '',
      issue_no: '',
      title: '',
      description: '',
      severity: '',
      status: '',
      issue_type: '',
      location_id: '',
      location_type: '',
      created_at: null,
      attachments: [], // not sure if this is ok
      task: { id: '', name: '' },
      reported_by: {
        id: '',
        first_name: '',
        last_name: '',
        photo: ''
      },
      assigned_to: {
        id: '',
        first_name: '',
        last_name: '',
        photo: ''
      },
      reason: '',
      resolution_notes: '',
      tags: []
    }
  }

  @action
  setIssue(issue) {
    console.log('set issue called')
    set(this.issue, issue)
  }

  @action
  setComments(comments) {
    // const dummyComments = this.dummyComments()  // should be from issue.comments
    // this.comments.replace([...dummyComments, ...comments])
    const newComments = comments.map(x => ({ ...x, editing: false }))
    this.comments.replace(newComments)
  }

  @action
  addComment(comment) {
    const newComments = [
      ...this.comments.slice(),
      { ...comment, editing: false }
    ]
    this.comments.replace(newComments)
  }

  @action
  updateComment(comment_id, newAttributes) {
    const comments = this.comments.slice()
    let index = comments.findIndex(x => x.id === comment_id)
    if (index >= 0) {
      const toUpdate = comments[index]
      comments[index] = { ...toUpdate, ...newAttributes }
      this.comments.replace(comments)
    }
  }

  @action
  deleteComment(comment_id) {
    const newComments = this.comments.slice().filter(x => x.id !== comment_id)
    this.comments.replace(newComments)
  }

  // dummyComments() {
  //   return [
  //     {
  //       id: 1,
  //       sender: {
  //         first_name: 'Tim',
  //         last_name: 'K',
  //         photo: null
  //       },
  //       is_me: false,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'Seems like we have an issue.',
  //       quote: '',
  //       resolved: false
  //     },
  //     {
  //       id: 2,
  //       sender: {
  //         first_name: 'Sample',
  //         last_name: 'User',
  //         photo: null
  //       },
  //       is_me: true,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'Yes it seems to be so...',
  //       quote: '',
  //       resolved: false
  //     },
  //     {
  //       id: 3,
  //       sender: {
  //         first_name: 'Tim',
  //         last_name: 'K',
  //         photo: null
  //       },
  //       is_me: false,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'Gonna call Mike.',
  //       quote: 'Yes it seems to be so...',
  //       resolved: false
  //     },
  //     {
  //       id: 4,
  //       sender: {
  //         first_name: 'Tim',
  //         last_name: 'K',
  //         photo: null
  //       },
  //       is_me: false,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message:
  //         'As you can see above, the stateless component is just a function. Thus, all the annoying and confusing quirks with Javascript’s this keyword are avoided. The entire component becomes easier to understand without the this keyword.',
  //       resolved: false
  //     },
  //     {
  //       id: 5,
  //       sender: {
  //         first_name: 'Sample',
  //         last_name: 'User',
  //         photo: null
  //       },
  //       is_me: true,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'Captured some picture as ref.',
  //       quote: 'Yes it seems to be so...',
  //       attachments: [
  //         {
  //           url: 'https://picsum.photos/300/200',
  //           preview: 'https://picsum.photos/300/200',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/300/201',
  //           preview: 'https://picsum.photos/300/201',
  //           type: 'image/png'
  //         }
  //       ],
  //       resolved: false
  //     },
  //     {
  //       id: 6,
  //       sender: {
  //         first_name: 'Sample',
  //         last_name: 'User',
  //         photo: null
  //       },
  //       is_me: true,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'and some more...',
  //       attachments: [
  //         {
  //           url: 'https://picsum.photos/300/200',
  //           preview: 'https://picsum.photos/300/200',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/301/201',
  //           preview: 'https://picsum.photos/301/201',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/302/202',
  //           preview: 'https://picsum.photos/302/202',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/303/200',
  //           preview: 'https://picsum.photos/303/200',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/304/201',
  //           preview: 'https://picsum.photos/304/201',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/305/202',
  //           preview: 'https://picsum.photos/305/202',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/306/200',
  //           preview: 'https://picsum.photos/306/200',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/307/201',
  //           preview: 'https://picsum.photos/307/201',
  //           type: 'image/png'
  //         },
  //         {
  //           url: 'https://picsum.photos/307/202',
  //           preview: 'https://picsum.photos/307/202',
  //           type: 'video/mp4',
  //           filename: 'axx111yy'
  //         },
  //         {
  //           url: 'https://picsum.photos/308/203',
  //           preview: 'https://picsum.photos/308/203',
  //           type: 'image/png'
  //         }
  //       ],
  //       resolved: false
  //     },
  //     {
  //       id: 7,
  //       sender: {
  //         first_name: 'Tim',
  //         last_name: 'K',
  //         photo: null
  //       },
  //       is_me: false,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'I got this.',
  //       task_url: 'http://google.com',
  //       task_name: 'Call Mike for inspection and remedial',
  //       quote: 'Captured some picture as ref.'
  //     },
  //     {
  //       id: 8,
  //       sender: {
  //         first_name: 'Tim',
  //         last_name: 'K',
  //         photo: null
  //       },
  //       is_me: false,
  //       sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
  //       message: 'Done',
  //       resolved: true,
  //       reason: 'Insufficient material'
  //     }
  //   ]
  // }

  @action
  reset() {
    set(this.issue, this.resetState())
    this.comments.replace([])
    this.mode = ''
  }
}

const currentIssue = new CurrentIssueStore()
export default currentIssue
