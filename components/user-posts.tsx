"use client"
import { Post } from '@/lib/model/post'
import React, { useEffect, useState } from 'react'
import PostCard from './post-card'

interface UserPostProps {
  id: string
}

const UserPost = ({ id }: UserPostProps) => {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post?id=${id}`)
        const json = await res.json();
        setPosts(json.data);
        console.log(posts);
      } catch (err) {
        console.error('Failed to fetch posts:', err)
      }
    }
    fetchPosts();
  }, [id])


  return (
    <div className='p-3 grid grid-cols-1 md:grid-cols-2 xlg:grid-cols-3'>
      {
        posts.length <= 0 ? <h1 className='text-xl font-bold'>No posts to show</h1> : (
          posts.map((post) => {
            return (
                <PostCard post={post} key={post._id}/>
            );
          })
        )
      }

    </div>
  );
}

export default UserPost