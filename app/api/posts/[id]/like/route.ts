import { auth } from "@/auth";
import { connectDB } from "@/lib/db";
import Post from "@/lib/model/post";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  req: NextRequest,
  {params}: {params: Promise<{ id: string }>}
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();

    const post = await Post.findById((await params).id);
    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const userId = session.user.id;
    const isLiked = post.likes.includes(new mongoose.Types.ObjectId(userId));

    if (isLiked) {
      await Post.findByIdAndUpdate(
        (await params).id,
        { $pull: { likes: userId } },
        { new: true }
      );
    } else {
      await Post.findByIdAndUpdate(
        (await params).id,
        { $addToSet: { likes: userId } },
        { new: true }
      );
    }
    return NextResponse.json({ success: true, action: "liked" });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
