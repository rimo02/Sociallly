'use client'
import { useInfiniteScroll } from '@/hook/infinite-scroll';
import React from 'react'
import PostCard from './post-card';

const Feed = () => {
    const { postList, lastPostRef, loading, hasMore } = useInfiniteScroll(`/api/posts`);

    return (
        <div className='p-3 grid grid-cols-1 sm:flex-col md:grid-cols-2 xlg:grid-cols-3 gap-3'>
            {postList.map((post, idx) => {
                const isLast = idx === postList.length - 1;
                return (
                    <div
                        key={post._id}
                        ref={isLast ? lastPostRef : null}
                    >
                        <PostCard post={post} />
                    </div>
                );
            })}

            {loading && <p className="text-center col-span-1 sm:col-span-2 md:col-span-2 xlg:col-span-3">Loading more posts...</p>}
            {!hasMore && !loading && (
                <p className="text-center col-span-1 sm:col-span-2 md:col-span-2 xlg:col-span-3 text-gray-500">No more posts.</p>
            )}
        </div>
    );
}

export default Feed;