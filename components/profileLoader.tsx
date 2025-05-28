'use client'

import { fetchUser, selectUser } from '@/redux/slice/userSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

export default function ProfileLoader({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>()
  const user = useSelector(selectUser)
  const { data: session } = useSession()
  const { loading } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    if (!user && session?.user?.username) {
      dispatch(fetchUser(session.user.username))
    }
  }, [session, dispatch, user])

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-xl font-medium">
        Loading profile...
      </div>
    )
  }

  return <>{children}</>
}
