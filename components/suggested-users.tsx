'use client'

import { SafeUser } from "@/lib/model/user"
import { useEffect, useState } from "react"
import ProfileCard from './profile-card'
import { Card, CardContent, CardHeader } from './ui/card'
import { useSession } from "next-auth/react"

const SuggestedUsers = () => {
    const { data: session } = useSession();
    const [users, setUsers] = useState<SafeUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSuggestedUsers = async () => {
            try {
                const res = await fetch('/api/suggested')
                const data = await res.json()
                const filteredUsers = data.filter((user: SafeUser) => user.id !== session?.user.id);
                setUsers(filteredUsers);
            } catch (error) {
                console.error('Failed to fetch suggested users:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSuggestedUsers()
    }, [])

    return (
        <Card className="bg-background text-foreground shadow-sm">
            <CardHeader className="p-4 pb-2 border-b">
                <span className="text-sm font-semibold">Suggested Users</span>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    users.map((user) => (
                        <ProfileCard key={user.id} user={user} variant="compact" />
                    ))
                )}
            </CardContent>
        </Card>
    )


}

export default SuggestedUsers
