import { auth } from '@/auth'
import CreatePostForm from '@/components/create-post';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react'

const CreatePage = async () => {
    const session = await auth();
    if (!session) {
        redirect('/auth/signin');
    }
    return (
        <div className='w-full px-4 py-6'>
            <div className='mb-4'>
                <Button variant="ghost" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to feed
                    </Link>
                </Button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Create Post</h1>
            <CreatePostForm />
        </div>
    )
}

export default CreatePage