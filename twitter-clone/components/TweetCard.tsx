import React, { useEffect, useState } from 'react';
import TimeAgo from 'react-timeago';
import {
  ChatAlt2Icon,
  HeartIcon,
  SwitchHorizontalIcon,
  UploadIcon,
} from '@heroicons/react/outline';
import { fetchComments } from '../utils/fetchComments';
import comment from '../sanity/schemas/comment';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';

type IconType = {
  icon: JSX.Element
}

const IconContainer = ({ icon }: IconType) => {
  return (
    <div className='flex cursor-pointer items-center space-x-3 text-gray-400'>
      {icon}
    </div>
  );
};

function TweetCard({ tweet }: { tweet: Tweet }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentIsVisible, setCommentIsVisible] = useState(false);
  const [inputComment, setInputComment] = useState('');
  const refreshComments = async () => {
    const comments: Comment[] = await fetchComments(tweet._id);
    setComments(comments);
  };
  const { data: session } = useSession();

  useEffect(() => {
    refreshComments();
  }, []);

  const postComment = async () => {
    const loadingToast = toast.loading('Posting comment...')
    const commentVody: CommentBody = {
      comment: inputComment,
      tweetId: tweet._id,
      username: session?.user?.name ?? 'Unknown User',
      profileImg: session?.user?.image || 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
    };

    const result = await fetch(`/api/addComment`, {
      body: JSON.stringify(commentVody),
      method: 'POST'
    });

    const json = await result.json();

    const refetchTweets = await refreshComments();
    toast.success('Comment posted!', {
      id: loadingToast,
      icon: '📬'
    });

    return json;
  };

  const handleCommentSubmit = async (e: React.MouseEvent<HTMLFormElement, MouseEvent>) => {
    e.preventDefault();
    postComment();
    setCommentIsVisible(false);
    setInputComment('');
  };
  
  return (
    <div className='flex flex-col space-x-3 border-y p-5 border-gray-100'>
      <div className='flex space-x-3'>
        <img src={tweet.profileImg} alt="profile pic" className='rounded-full h-10 w-10 object-cover' />
        <div>
          <div className='flex items-center space-x-1'>
            <p className='mr-1 font-bold'>{tweet.username}</p>
            <p className='hidden text-sm text-gray-500 sm:inline'>@{tweet.username.replace(/\s+/g, '').toLocaleLowerCase()}</p>
            <TimeAgo
              date={tweet._createdAt}
              className='text-sm text-gray-500'
            />
          </div>
          <p>{tweet.text}</p>
          {tweet?.image && (
            <img src={tweet.image} alt="twitter img" className='m-5 ml-0 mb-1 max-h-60 rounded-lg object-cover shadow-sm' />
          )}
        </div>
      </div>
      <div className='flex justify-between mt-5'>
        <IconContainer icon={<div onClick={() => session && setCommentIsVisible(!commentIsVisible)}>
          <ChatAlt2Icon className='h-5 w-5' />
          <p>{comments?.length ?? 0}</p>
        </div>} />
        <IconContainer icon={<SwitchHorizontalIcon className='h-5 w-5' />} />
        <IconContainer icon={<HeartIcon className='h-5 w-5' />} />
        <IconContainer icon={<UploadIcon className='h-5 w-5' />} /> 
      </div>
      {commentIsVisible && (
        <form className='mt-3 flex space-x-3' onSubmit={handleCommentSubmit}>
          <input
            type="text"
            placeholder='send a comment...'
            className='flex flex-1 rounded-lg bg-gray-100 p-2 outline-none'
            value={inputComment}
            onChange={e => setInputComment(e.target.value)}
          />
          <button
            type='submit'
            disabled={!inputComment}
            className='text-twitter disabled:text-gray-200'>Send</button>
        </form>
      )}
      {comments?.length > 0 && (
        <div className='my-2 mt-5 max-h-44 space-y-5 overflow-y-scroll scrollbar-hide border-t border-gray-100 p-5'>
          {comments.map(comment => (
            <div key={comment._id} className='relative flex space-x-2'>
              <hr className='absolute left-5 top-10 h-8 border-x border-twitter/30' />
              <img
                src={comment.profileImg}
                alt="comment pic"
                className='mt-2 h-7 w-7 object-cover rounded-full'
              />
              <div>
                <div className='flex items-center space-x-1'>
                  <p className='mr-1 font-bold'>{comment.username}</p>
                  <p className='hidden text-sm text-gray-500 lg:inline'>@{comment.username.replace(/\s+/g, '').toLocaleLowerCase()} -</p>
                  <TimeAgo
                    date={comment._createdAt}
                    className='text-sm text-gray-500'
                  />
                </div>
                <p>{comment.comment}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TweetCard;