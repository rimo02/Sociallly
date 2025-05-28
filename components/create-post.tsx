'use client'
import { useSession } from 'next-auth/react'
import React, { ChangeEvent, useState } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Image as ImageIcon, Smile, X } from 'lucide-react'
import ImageNext from 'next/image'
import { uploadImageToFirebase } from '@/lib/utils'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/slice/userSlice'

const CreatePostForm = () => {
    const { data: session } = useSession()
    const [content, setContent] = useState('')
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const currentUser = useSelector(selectUser);
    const [isLoading, setIsLoading] = useState(false)

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFile(file);
        const reader = new FileReader();
        reader.onload = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;
        if (!content.trim() && !imagePreview) return;
        setIsLoading(true);
        try {
            let imageUrl: string | undefined = undefined

            if (file) {
                imageUrl = await uploadImageToFirebase(file)
            }

            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: content.trim(),
                    image: imageUrl
                })
            })

            if (!response.ok) throw new Error('Failed to create post')

            setContent('')
            setImagePreview(null)
            setFile(null)
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    }

    if (!session) return null;
    return (
        <Card className="bg-background py-6 gap-5 text-foreground">
            <CardContent className="">
                <div className="flex gap-3">
                    <Avatar>
                        <AvatarImage src={currentUser?.image} alt={currentUser?.name} />
                        <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <Textarea
                            placeholder="What's happening?"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            className="min-h-[60px] resize-none focus-visible:ring-0 p-2 shadow-sm text-foreground"
                        />
                        {imagePreview && (
                            <div className='relative w-48 h-48 mt-4 rounded overflow-hidden border'>
                                <ImageNext
                                    src={imagePreview}
                                    alt="Preview"
                                    fill
                                    className="object-cover"
                                />
                                <Button
                                    variant={`outline`}
                                    size={`icon`}
                                    className="absolute top-2 right-2 h-6 w-6 rounded-full opacity-90"
                                    onClick={() => setImagePreview(null)}
                                >
                                    <X width={3} height={3} />
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between px-4">
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
                        <label className="cursor-pointer">
                            <ImageIcon className="h-5 w-5 text-foreground" />
                            <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handleImageUpload}
                            />
                        </label>
                    </Button>
                    <Button variant="ghost" size="sm" className="rounded-full p-2 h-8 w-8">
                        <Smile className="h-5 w-5 text-social-purple" />
                    </Button>
                </div>
                <Button
                    disabled={!content.trim()}
                    className="bg-blue-400 hover:bg-blue-600/90"
                    onClick={handleSubmit}
                >
                    {isLoading ? "Posting..." : "Post"}
                </Button>
            </CardFooter>
        </Card>
    )
}

export default CreatePostForm
