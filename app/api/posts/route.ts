import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/model/post";
import { User } from "@/lib/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const post = await Post.create({
      ...body,
      author: session?.user.id,
    });

    await User.findByIdAndUpdate(session?.user.id, {
      $inc: { postCount: 1 },
      $addToSet: { posts: post.id },
    });

    await post.populate("author", "name username image");

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: error || "Failed to create post" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await User.findOne({
      email: session.user.email,
    }).select("_id following");

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const authorIds = [currentUser._id, ...currentUser.following];
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "4");
    const skip = (page - 1) * limit;
    const posts = await Post.find({ author: { $in: authorIds } })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("author", "name username image");

    const totalPosts = await Post.countDocuments({
      author: { $in: authorIds },
    });
    return NextResponse.json({
      data: posts,
      pagination: {
        page,
        limit,
        has_next_page: skip + limit < totalPosts,
      },
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
