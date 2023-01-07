import React from 'react';
import {
  BellIcon,
  HashtagIcon,
  BookmarkIcon,
  CollectionIcon,
  DotsCircleHorizontalIcon,
  MailIcon,
  UserIcon,
  HomeIcon
} from '@heroicons/react/outline';
import twitterIcon from '../assets/twitterIcon.png';
import SideFields from './SideFields';
import Image from 'next/image';
import { useSession, signIn, signOut } from 'next-auth/react';

function Sidebar() {
  const { data: session } = useSession();
  return (
    <div className='flex flex-col col-span-2 items-center px-4 md:items-start'>
      <Image 
        alt='twitter pic'
        height={35}
        width={35}
        src={twitterIcon.src}
        className='m-3'
      />
      <SideFields Icon={HomeIcon} title='Home'  />
      <SideFields Icon={HashtagIcon} title='Explore'  />
      <SideFields Icon={BellIcon} title='Notification'  />
      <SideFields Icon={MailIcon} title='Messages'  />
      <SideFields Icon={BookmarkIcon} title='Bookmarks'  />
      <SideFields Icon={CollectionIcon} title='Lists'  />
      <SideFields onClick={session ? signOut : signIn} Icon={UserIcon} title={session ? 'Sign out' : 'Sign in'}  />
      <SideFields Icon={DotsCircleHorizontalIcon} title='More'  />
    </div>
  )
}

export default Sidebar;