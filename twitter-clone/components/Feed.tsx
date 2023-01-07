import { RefreshIcon } from '@heroicons/react/outline'
import React, { useState } from 'react'
import { fetchTweets } from '../utils/fetchTweets';
import TweetCard from './TweetCard'
import TweetField from './TweetField'
import toast from 'react-hot-toast';

function Feed({ tweets: tweetsProp }: { tweets: Tweet[] }) {
  const [tweets, setTweets] = useState<Tweet[]>(tweetsProp);
  const handleRefresh = async () => {
    const refreshToast = toast.loading('Updating feed...');
     const tweets = await fetchTweets();
     setTweets(tweets);
     toast.success('Feed updated', {
      id: refreshToast
     });
  };
  return (
    <div className='col-span-7 lg:col-span-5 border-x max-h-screen overflow-scroll scrollbar-hide'>
      <div className='flex items-center justify-between'>
        <h1 className='p-5 pb-0 text-xl font-bold'>Home</h1>
        <RefreshIcon
          onClick={handleRefresh}
          className='h-8 w-8 cursor-pointer text-twitter mr-5 mt-5
          transition-all duration-500 ease-out hover:rotate-180 active:scale-125'
        />
      </div>
      <div className='sticky top-0 z-50 bg-white'>
        <TweetField setTweets={setTweets} />
      </div>
      <div className=''>
        {tweets?.map(tweet => (
          <TweetCard key={tweet._id} tweet={tweet} />
        ))}
      </div>
    </div>
  )
}

export default Feed