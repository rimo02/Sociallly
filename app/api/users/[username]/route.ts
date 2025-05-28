import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import { NextRequest, NextResponse } from "next/server";
interface SafeUser {
  _id: string;
  name: string;
  email: string;
  username: string;
  bio?: string;
  image?: string;
  followersCount: number;
  followingCount: number;
  postCount: number;
  isFollowing: boolean;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await auth();
  try {
    await connectDB();
    const user = (await User.findOne({
      username: (await params).username,
    })
      .select(
        "_id name email username image bio followingCount followersCount postCount"
      )
      .lean()) as SafeUser | null;

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const isFollowing = session?.user
      ? await User.exists({ _id: session?.user.id, following: user._id })
      : false;
    const formattedUser = {
      ...user,
      id: user._id.toString(),
      isFollowing: Boolean(isFollowing),
    };
    return NextResponse.json(formattedUser);
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  const session = await auth();
  const { action } = await req.json();
  const username = (await params).username;

  const followingUser = await User.findOne({ username }).select("-password");
  const currentUser = await User.findOne({
    username: session?.user.username,
  }).select("-password");

  if (!followingUser || !currentUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    if (action === "follow") {
      currentUser.following.push(followingUser._id);
      followingUser.followers.push(currentUser._id);

      currentUser.followingCount += 1;
      followingUser.followersCount += 1;

      await currentUser.save();
      await followingUser.save();

      return NextResponse.json({ message: "Followed successfully" });
    } else if (action === "unfollow") {
      currentUser.following = currentUser.following.filter(
        (id: string) => id.toString() !== followingUser._id.toString()
      );
      followingUser.followers = followingUser.followers.filter(
        (id: string) => id.toString() !== currentUser._id.toString()
      );

      currentUser.followingCount -= 1;
      followingUser.followersCount -= 1;

      await currentUser.save();
      await followingUser.save();

      return NextResponse.json({ message: "Unfollowed successfully" });
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  await connectDB();
  const data = await req.json();
  const username = (await params).username;
  await User.findOneAndUpdate(
    { username },
    {
      $set: {
        name: data.name,
        username: data.username,
        bio: data.bio,
        image: data.image,
      },
    }
  );

  return NextResponse.json({ message: "User updated successfully" });
}
