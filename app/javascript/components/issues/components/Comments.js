import React from 'react'
import Avatar from '../../utils/Avatar.js'
import CommentMessage from './CommentMessage'
class Comments extends React.Component {
  renderMessages() {
    const messages = [
      {
        id: 1,
        sender_first_name: 'Tim',
        sender_last_name: 'K',
        sender_photo: null,
        sender_id: 1,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'Seems like we have an issue.',
        quote: '',
        resolved: false
      },
      {
        id: 2,
        sender_first_name: 'Sample',
        sender_last_name: 'User',
        sender_photo: null,
        sender_id: 2,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'Yes it seems to be so...',
        quote: '',
        resolved: false
      },
      {
        id: 3,
        sender_first_name: 'Tim',
        sender_last_name: 'K',
        sender_photo: null,
        sender_id: 1,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'Gonna call Mike.',
        quote: 'Yes it seems to be so...',
        resolved: false
      },
      {
        id: 4,
        sender_first_name: 'Tim',
        sender_last_name: 'K',
        sender_photo: null,
        sender_id: 1,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message:
          'As you can see above, the stateless component is just a function. Thus, all the annoying and confusing quirks with Javascript’s this keyword are avoided. The entire component becomes easier to understand without the this keyword.',
        resolved: false
      },
      {
        id: 5,
        sender_first_name: 'Sample',
        sender_last_name: 'User',
        sender_photo: null,
        sender_id: 2,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'Captured some picture as ref.',
        quote: 'Yes it seems to be so...',
        attachments: [
          {
            url: 'https://picsum.photos/300/200',
            preview: 'https://picsum.photos/300/200',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/300/201',
            preview: 'https://picsum.photos/300/201',
            type: 'image/png'
          }
        ],
        resolved: false
      },
      {
        id: 6,
        sender_first_name: 'Sample',
        sender_last_name: 'User',
        sender_photo: null,
        sender_id: 2,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'and some more...',
        attachments: [
          {
            url: 'https://picsum.photos/300/200',
            preview: 'https://picsum.photos/300/200',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/301/201',
            preview: 'https://picsum.photos/301/201',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/302/202',
            preview: 'https://picsum.photos/302/202',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/303/200',
            preview: 'https://picsum.photos/303/200',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/304/201',
            preview: 'https://picsum.photos/304/201',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/305/202',
            preview: 'https://picsum.photos/305/202',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/306/200',
            preview: 'https://picsum.photos/306/200',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/307/201',
            preview: 'https://picsum.photos/307/201',
            type: 'image/png'
          },
          {
            url: 'https://picsum.photos/307/202',
            preview: 'https://picsum.photos/307/202',
            type: 'video/mp4',
            filename: 'axx111yy'
          },
          {
            url: 'https://picsum.photos/308/203',
            preview: 'https://picsum.photos/308/203',
            type: 'image/png'
          }
        ],
        resolved: false
      },
      {
        id: 7,
        sender_first_name: 'Tim',
        sender_last_name: 'K',
        sender_photo: null,
        sender_id: 1,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'I got this.',
        task_url: 'http://google.com',
        task_name: 'Call Mike for inspection and remedial',
        quote: 'Captured some picture as ref.'
      },
      {
        id: 8,
        sender_first_name: 'Tim',
        sender_last_name: 'K',
        sender_photo: null,
        sender_id: 1,
        current_user_id: 2,
        sent_at: new Date('01 Jan 1970 00:00:00 GMT'),
        message: 'Done',
        resolved: true,
        reason: 'Insufficient material'
      }
    ].map(x => <CommentMessage key={x.id} {...x} />)

    return messages
  }

  render() {
    return (
      <React.Fragment>
        <div className="flex ph3 pb3 items-center mt3">
          <div className="f7 fw6 gray w-auto mr1">ISSUE #001</div>
          <div className="f7 fw6 gray w-auto mr1 self-start">&bull;</div>
          <div className="f7 fw6 gray w-auto">Discussion</div>
        </div>
        {this.renderMessages()}
        <div className="ph3 mv3">
          <div className="b--black-10 flex br3 ba w-100 ph2 pt1 pb2 flex items-center">
            <Avatar firstName="Sample" lastName="User" size={25} />
            <textarea
              type="text"
              className="bn flex-auto flex ml1 f6 dark-grey outline-0"
              rows="1"
            />
            <a href="#" className="ml1">
              <span
                className="material-icons black-30 f6 v-mid"
                style={{ fontSize: '18px' }}
              >
                attach_file
              </span>
            </a>
            <a href="#" className="ml1">
              <span
                className="material-icons black-30 f6 v-mid"
                style={{ fontSize: '18px' }}
              >
                add
              </span>
            </a>
            <a href="#" className="ml1">
              <span
                className="material-icons black-30 f6 v-mid"
                style={{ fontSize: '18px' }}
              >
                send
              </span>
            </a>
          </div>
        </div>
        <div />
      </React.Fragment>
    )
  }
}

export default Comments
