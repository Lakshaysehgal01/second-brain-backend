import mongoose, { model, Schema } from "mongoose";
import { string } from "zod";

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
  },
  password: String,
});

export const User = model("User", userSchema);

const contentSchema = new Schema({
  title: String,
  link: String,
  tags: [{ type: mongoose.Types.ObjectId, ref: "Tag" }],
  type: String,
  userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
});

export const Content = model("Content", contentSchema);

const LinkSchema = new Schema({
  hash: String,
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});
export const Link = model("Link", LinkSchema);

const tagSchema = new Schema({
  tag: String,
});

export const Tag = model("Tag", tagSchema);
