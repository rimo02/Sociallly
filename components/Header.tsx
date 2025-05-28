"use client"
import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, SearchIcon, X } from 'lucide-react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Input } from './ui/input'
import ToggleTheme from './toggle-theme'
import { useRouter } from 'next/navigation'
import { DropdownMenuContent, DropdownMenu, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu'
import { useSelector } from 'react-redux'
import { selectUser } from '@/redux/slice/userSlice'

const Header = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const { data: session } = useSession();
    const [searchQuery, setSearchQuery] = useState('')
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const user = useSelector(selectUser);
    console.log(user);
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault()
        console.log("Search query:", searchQuery);
    }

    return (
        <header className={cn(
            "sticky top-0 w-full transition-all duration-200 flex justify-between border-b-1 z-50 pl-3",
            isScrolled ? "bg-background/80 backdrop-blur-sm shadow-sm" : "bg-transparent"
        )}>
            <div className='flex items-center space-x-1'>
                <div className='md:hidden'>
                    <button className='p-2' onClick={() => setIsMobileMenuOpen(prev => !prev)}>
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
                <Link href="/" className='text-2xl font-bold'>
                    <span className='text-primary'>Sociallly</span>
                </Link>
            </div>


            {/* mobile menu */}
            <div className='md:hidden flex items-center pr-3'>
                <ToggleTheme />
                {session ? (
                    <div className='flex gap-4 items-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className='relative w-8 h-8 rounded-full overflow-hidden cursor-pointer'>
                                    <Image
                                        src={user.image}
                                        alt='User image'
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => router.push(`/profile/${session?.user?.username}`,)}>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <button onClick={() => signIn("google")} className='hover:text-primary cursor-pointer'>
                        Sign In
                    </button>
                )}
            </div>

            {/* desktop menu */}
            <div className='hidden md:flex items-center gap-2 py-3 px-10 '>
                <form onSubmit={handleSubmit}>
                    <div className='md:flex hidden'>
                        <SearchIcon className='h-8 w-5 mt-0.5 left-8 relative' />
                        <Input
                            placeholder='Search...'
                            className='md:w-100 pl-11 rounded-2xl'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </form>
                <ToggleTheme />
                {session ? (
                    <div className='flex gap-4 items-center'>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className='relative w-8 h-8 rounded-full overflow-hidden cursor-pointer'>
                                    <Image
                                        src={user.image}
                                        alt='User image'
                                        fill
                                        className='object-cover'
                                    />
                                </div>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent align='end'>
                                <DropdownMenuItem onClick={() => router.push(`/profile/${session?.user?.username}`,)}>
                                    Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => signOut()}>
                                    Sign Out
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                ) : (
                    <button onClick={() => signIn("google")} className='hover:text-primary cursor-pointer'>
                        Sign In
                    </button>
                )}
            </div>
            {
                isMobileMenuOpen && (
                    <div className='md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-sm z-50 p-4 flex flex-col gap-2'>
                        <form onSubmit={handleSubmit} className='relative w-full'>
                            <SearchIcon className='h-5 w-5 absolute left-4 top-2 text-gray-500' />
                            <Input
                                placeholder='Search...'
                                className='w-full pl-10 rounded-md'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </form>
                    </div>
                )
            }

        </header>
    )
}

export default Header