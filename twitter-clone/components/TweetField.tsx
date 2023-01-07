import React, { SetStateAction, useRef, useState } from 'react';
import profilePic from '../assets/profilePic.png';
import {
  CalendarIcon,
  EmojiHappyIcon,
  LocationMarkerIcon,
  PhotographIcon,
  SearchCircleIcon,
} from '@heroicons/react/outline';
import { useSession } from 'next-auth/react';
import { fetchTweets } from '../utils/fetchTweets';
import { toast } from 'react-hot-toast';

function TweetField({ setTweets }: { setTweets: React.Dispatch<SetStateAction<Tweet[]>> }) {
  const [input, setInput] = useState('');
  const [image, setImage] = useState('');
  const { data: session } = useSession();
  const [imageBoxIsOpen, setImageBoxIsOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imagePreviewRef = useRef<HTMLImageElement>(null);
  const addImageToTweet = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if(!imageInputRef.current?.value) return;
    setImage(imageInputRef.current.value);
    imageInputRef.current.value = '';
    setImageBoxIsOpen(false);
  };
  const handlePreviewImgError = () => {
    if(!imagePreviewRef.current?.src) return;
    imagePreviewRef.current.src = '/default.png'
  };
  const postTweet = async () => {
    const loadingToast = toast.loading('Posting tweet...')
    const tweetBody: TweetBody = {
      text: input,
      username: session?.user?.name ?? 'Unknown User',
      profileImg: session?.user?.image || 'https://www.kindpng.com/picc/m/24-248253_user-profile-default-image-png-clipart-png-download.png',
      image: image
    };

    const result = await fetch(`/api/addTweet`, {
      body: JSON.stringify(tweetBody),
      method: 'POST'
    });

    const json = await result.json();

    const refetchTweets = await fetchTweets();
    setTweets(refetchTweets);
    toast.success('Tweet posted!', {
      id: loadingToast,
      icon: '📬'
    });

    return json;
  };
  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    postTweet();
    setInput('');
    setImage('');
    setImageBoxIsOpen(false);
  };
  return (
    <div className='flex space-x-2 p-5 shadow-sm'>
      <img 
        alt='prfoile pic'
        src={session?.user?.image || profilePic.src}
        className='h-14 w-14 object-cover rounded-full mt-4'
      />
      <div className='flex flex-1 items-center pl-2'>
        <form className='flex flex-1 flex-col' action="">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            type="text"
            placeholder="What's on your mind?"
            className=' h-24 w-full text-xl outline-none placeholder:text-xl'
          />
          <div className='flex items-center'>
            <div className='flex space-x-2 text-twitter flex-1'>
              <PhotographIcon onClick={() => setImageBoxIsOpen(!imageBoxIsOpen)} className='h-5 w-5 cursor-pointer transition-transform duration-150 ease-out hover:scale-150' />
              <SearchCircleIcon className='h-5 w-5' />
              <EmojiHappyIcon className='h-5 w-5' />
              <CalendarIcon className='h-5 w-5' />
              <LocationMarkerIcon className='h-5 w-5' />
            </div>
            <button
              className='bg-twitter px-5 py-2 font-bold text-white 
              rounded-full disabled:opacity-40'
              disabled={!input || !session}
              onClick={handleSubmit}
            >
              Tweet
            </button>
          </div>
          {imageBoxIsOpen && (
            <div className='mt-5 flex rounded-lg bg-twitter/80 py-2 px-4'>
              <input
                className='flex-1 bg-transparent p-2 text-white outline-none 
                  placeholder:text-white' type="text" placeholder='Enter image URL...'
                ref={imageInputRef}
              />
              <button type='submit' onClick={addImageToTweet} className='font-bold text-white border-l-2 border-gray-200 pl-4'>Add Image</button>
            </div>
          )}
          {image && <img src={image} ref={imagePreviewRef} onError={handlePreviewImgError} className='mt-10 h-40 w-full rounded-xl object-contain shadow-lg' alt="attached img" /> }
        </form>
      </div>
    </div>
  )
}

export default TweetField