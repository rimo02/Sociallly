import { connectDB } from "@/lib/db";
import Post from "@/lib/model/post";
import { User } from "@/lib/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const user = await User.findById(id).select("posts");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const posts = await Post.find({ _id: { $in: user.posts } })
      .sort({ createdAt: -1 })
      .populate("author", "name username image");

    return NextResponse.json({
      data: posts,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
