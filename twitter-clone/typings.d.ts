type TweetBody = {
  text: string
  username: string
  profileImg: string
  image?: string
}

interface Tweet extends TweetBody {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  _type: 'tweet'
  blockTweet: boolean
}

type CommentBody = {
  comment: string
  tweetId: string
  username: string
  profileImg: string
}

interface Comment extends CommentBody {
  _id: string
  _createdAt: string
  _updatedAt: string
  _rev: string
  tweet: {
    _ref: string
    _type: 'reference'
  }
}