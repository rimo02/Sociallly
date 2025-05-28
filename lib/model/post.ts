import mongoose, { Schema, models, Model, Document } from "mongoose";

export interface IPost extends Document {
  content: string;
  image?: string;
  author: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Post {
  _id: string;
  content: string;
  image?: string;
  author: {
    _id: string;
    name: string;
    username: string;
    image: string;
  };
  likes: string[];
  comments: string[];
  createdAt: Date;
  updatedAt: Date;
}

const PostSchema = new Schema<IPost>(
  {
    content: {
      type: String,
      required: [true, "Content is required"],
      trim: true,
      maxlength: [500, "Content cannot be more than 500 characters"],
    },
    image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post: Model<IPost> =
  models.Post || mongoose.model<IPost>("Post", PostSchema);

export default Post;
