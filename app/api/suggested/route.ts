import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  try {
    await connectDB();
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .select("-password -email -followers -following -posts");

    const loggedUser = await User.findById(session?.user.id).select(
      "following"
    );

    const safeUsers = users.map((user) => ({
      id: user._id.toString(),
      name: user.name,
      username: user.username,
      image: user.image,
      bio: user.bio,
      followersCount: user.followersCount,
      followingCount: user.followingCount,
      postCount: user.postCount,
      isFollowing: loggedUser.following.includes(user._id),
    }));

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
