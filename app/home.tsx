"use client"
import CreatePostForm from '@/components/create-post';
import Feed from '@/components/feed';
import ProfileCard from '@/components/profile-card';
import SuggestedUsers from '@/components/suggested-users';
import { selectUser } from '@/redux/slice/userSlice';
import { useSelector } from 'react-redux';

const Home = () => {
    const user = useSelector(selectUser);

    return (
        <div className='p-6 grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='col-span-1 md:col-span-2 space-y-6 py-2 h-screen'>
                <CreatePostForm />
                <Feed />
            </div>
            <div className='hidden md:block space-y-6'>
                {user && <ProfileCard user={user} />}
                {user && <SuggestedUsers />}
            </div>
        </div>
    );
};

export default Home;
