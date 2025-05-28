'use client'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { uploadImageToFirebase } from '@/lib/utils'
import Image from 'next/image'

const formSchema = z.object({

  name: z.string().min(1, "Name is required"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  bio: z.string().max(200, "Bio must be under 200 characters"),
  image: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

const Page = ({ params }: { params: Promise<{ username: string }> }) => {
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState<File | null>(null);
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  })

  const { reset, handleSubmit } = form

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/users/${(await params).username}`)
        const data = await res.json()
        reset(data)
      } catch (error) {
        console.error("Failed to load user:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [params, reset])

  const onSubmit = async (data: FormData) => {
    try {
      let url = data.image || "";
      if (image) {
        url = await uploadImageToFirebase(image);
      }

      await fetch(`/api/users/${(await params).username}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, image: url }),
      })
      alert("Profile updated!")
    } catch (err) {
      console.error("Update failed:", err)
      alert("Failed to update profile.")
    }
  }

  if (loading) return <p className='text-center mt-8'>Loading...</p>

  return (
    <div className='py-3 flex items-center justify-center'>
      <Card className="bg-background w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center mt-3">Edit Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 p-10">
          <Form {...form}>

            {(form.getValues("image") || image) && (
              <div className='flex justify-center'>
                <Image
                  src={form.getValues("image") as string}
                  alt='profile'
                  width={100}
                  height={100}
                  className='rounded-full object-cover border w-25 h-25'
                />
              </div>
            )}


            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Profile Picture */}
              <div>
                <FormLabel>Profile Picture</FormLabel>
                <Input type='file' onChange={handleImageChange} accept='image/**' />
              </div>

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="username123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Bio Field */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input placeholder="Tell us about yourself..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default Page
