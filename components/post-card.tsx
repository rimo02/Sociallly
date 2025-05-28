"use client"
import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Avatar } from './ui/avatar';
import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { cn, formatDate } from '@/lib/utils';
import { Button } from './ui/button';
import { Heart, MessageSquare, Share } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { Post } from '@/lib/model/post';
import Image from 'next/image';


interface PostCardProps {
    post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
    const { data: session } = useSession();
    const [isLiked, setIsLiked] = useState(post.likes?.includes(session?.user?.id as string));
    const [likesCount, setLikesCount] = useState(post.likes?.length || 0);

    const handleLikeToggle = async () => {
        try {
            setIsLiked(!isLiked);
            setLikesCount(isLiked ? likesCount - 1 : likesCount + 1);

            const response = await fetch(`/api/posts/${post._id}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                setIsLiked(isLiked);
                setLikesCount(isLiked ? likesCount : likesCount - 1);
                throw new Error('Failed to like/unlike post');
            }

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <Card className='mb-4 bg-background text-foreground shadow-sm'>
            <CardHeader className='p-4 pb-2 flex space-x-2 border-b-1'>
                <Link href={`/profile/${post.author?.username}`}>
                    <Avatar className='w-10 h-10'>
                        <AvatarImage src={post.author.image} className='w-full h-full' />
                        <AvatarFallback>{post.author.username}</AvatarFallback>
                    </Avatar>
                </Link>
                <div className='flex flex-col'>
                    <span className='font-bold' >{post.author.name}</span>
                    <span className='text-sm font-extralight' >@{post.author.username} .  <span>{formatDate(new Date(post.createdAt))}</span></span>
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <p className="mb-4">{post.content}</p>
                {post.image && (
                    <div className="relative rounded-md overflow-hidden bg-muted h-80 sm:h-40 w-full">
                        <Image
                            src={post.image}
                            alt="Post content"
                            className="object-cover"
                            fill
                        />
                    </div>
                )}
            </CardContent>

            <CardFooter>
                <div className='flex justify-between w-full px-4 py-1'>
                    <Button
                        variant={`ghost`}
                        onClick={handleLikeToggle}
                        className={cn('flex items-center gap-1',
                            isLiked && "text-red-500"
                        )}
                    >
                        <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
                        <span>{likesCount > 0 ? likesCount : ''}</span>
                    </Button>
                    <Button
                        variant={`ghost`}>
                        <MessageSquare />
                    </Button>
                    <Button
                        variant={`ghost`}>
                        <Share />
                    </Button>
                </div>

            </CardFooter>
        </Card>
    );
};
export default PostCard