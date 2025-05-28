"use client";
import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SafeUser } from "@/lib/model/user";
import { Button } from "./ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface ProfileCardProps {
    user: SafeUser;
    variant?: "full" | "compact";
}

const ProfileCard = ({ user, variant = "full" }: ProfileCardProps) => {
    const { data: session } = useSession();
    const [isFollowing, setIsFollowing] = useState(user.isFollowing || false);
    const [followers, setFollowers] = useState(user.followersCount);

    const handleFollow = async () => {
        const action = isFollowing ? "unfollow" : "follow";
        const res = await fetch(`/api/users/${user.username}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ action })
        });

        if (res.ok) {
            setFollowers((prev) => prev + (isFollowing ? -1 : 1));
            setIsFollowing((prev) => !prev);
        }
    };

    const isCurrentUser = user.id === session?.user?.id;

    if (variant === "compact") {
        return (
            <Card className="bg-background transition-colors">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <Link href={`/${user.username}`} >
                            <div className="flex items-center gap-3">
                                <Avatar>
                                    <AvatarImage src={user.image} alt={user.name} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground">@{user.username}</p>
                                </div>
                            </div>
                        </Link>
                        {!isCurrentUser && (
                            <div className="flex justify-between">
                                <Button
                                    variant={isFollowing ? "outline" : "default"}
                                    size="sm"
                                    onClick={handleFollow}
                                >
                                    {isFollowing ? "Following" : "Follow"}
                                </Button>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="overflow-hidden bg-background">
            <div className="h-32 bg-gradient-to-r from-purple-300 to-pink-200" />
            <CardContent className="-mt-1 pt-0 px-4 pb-4">
                <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 border-0 border-background -mt-12">
                        <AvatarImage src={user.image} alt={user.name} />
                        <AvatarFallback className="text-2xl">
                            {user.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <h3 className="font-bold text-lg mt-2">{user.name}</h3>
                    <p className="text-sm text-foreground">@{user.username}</p>

                    {user.bio && <p className="text-sm mt-3">{user.bio}</p>}

                    <div className="flex justify-center gap-6 mt-4 mb-4">
                        <div className="text-center">
                            <p className="font-bold">{user.postCount}</p>
                            <p className="text-xs text-muted-foreground">Posts</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">{followers}</p>
                            <p className="text-xs text-muted-foreground">Followers</p>
                        </div>
                        <div className="text-center">
                            <p className="font-bold">{user.followingCount}</p>
                            <p className="text-xs text-muted-foreground">Following</p>
                        </div>
                    </div>

                    {!isCurrentUser && (
                        <div className="flex justify-around w-full">
                            <Button
                                variant={isFollowing ? "outline" : "default"}
                                size="sm"
                                onClick={handleFollow}
                            >
                                {isFollowing ? "Following" : "Follow"}
                            </Button>
                            <Button
                                variant={"default"}
                                size="sm"
                            >
                                Message
                            </Button>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default ProfileCard;
