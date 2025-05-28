import { connectDB } from "@/lib/db";
import { User } from "@/lib/model/user";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const existingUser = await User.findOne({
      $or: [{ email: body.email }, { username: body.username }],
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email or username already exists" },
        { status: 400 }
      );
    }
    const user = await User.create(body);
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      username: user.username,
      image: user.image,
      bio: user.bio,
      createdAt: user.createdAt,
    };
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error || "Failed to create user" },
      { status: 500 }
    );
  }
}
