"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProfileCard from "@/components/profile-card";
import UserPost from "@/components/user-posts";
import { SafeUser } from "@/lib/model/user";

export default function UserPage({ params }: { params: Promise<{ username: string }> }) {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState<SafeUser>();

  const fetchUser = async () => {
    const res = await fetch(`/api/users/${(await params).username}`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      setCurrentUser(data);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  if (!session?.user) {
    return (
      <div className="p-6 text-center">
        <h2 className="text-2xl font-bold">Please sign in to view profiles</h2>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="col-span-1 md:col-span-2 space-y-6 py-2 h-screen">
        {currentUser && <UserPost id={currentUser?.id} />}
      </div>
      <div className="hidden md:block space-y-6">
        {currentUser && <ProfileCard user={currentUser} />}
      </div>
    </div>
  );
}
