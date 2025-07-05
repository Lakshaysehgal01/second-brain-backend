import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { signupSchema } from "./zodSchema";
import bcrypt from "bcrypt";
import { Content, Link, Tag, User } from "./db";
import dotenv from "dotenv";
import { userMiddleWare } from "./middleware";
import { random } from "./util";
dotenv.config();
const app = express();
const port: number = process.env.PORT || 8080;
app.use(express.json());
main()
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}
app.post("/api/v1/signup", async (req, res) => {
  const result = signupSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: result.error.errors.map((err) => err.message).join(", "),
    });
    return;
  }

  const { username, password } = result.data;

  try {
    const hashedPass = await bcrypt.hash(password, 10);
    await User.create({
      username,
      password: hashedPass,
    });
    res.json({ message: "user signed up" });
  } catch {
    res.status(411).json({
      message: "User already exists",
    });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      res.status(403).json({ message: "Incorrect credentials" });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password as string
    );
    if (!isPasswordCorrect) {
      res.status(403).json({ message: "Incorrect credentials" });
      return;
    }

    const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET);

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/v1/content", userMiddleWare, async (req, res) => {
  const { title, link, type, tag } = req.body;
  try {
    let existingTag = await Tag.findOne({
      tag: tag,
    });
    if (!existingTag) {
      existingTag = await Tag.create({
        tag: tag,
      });
    }
    await Content.create({
      link,
      type,
      title,
      userId: req.userId,
      tags: [existingTag._id],
    });
    res.json({
      message: "Content added",
    });
  } catch {
    res.status(500).json({
      message: "Failed to add content",
    });
  }
});

app.get("/api/v1/content", userMiddleWare, async (req, res) => {
  const userId = req.userId;
  try {
    const content = await Content.find({
      userId: userId,
    })
      .populate("userId", "username")
      .populate("tags", "tag");
    res.json({
      content,
    });
  } catch {
    res.status(500).json({
      message: "Error while fetching the content data",
    });
  }
});

app.delete("/api/v1/content", userMiddleWare, async (req, res) => {
  const contentId = req.body.contentId;

  const del = await Content.deleteMany({
    _id: contentId,
    userId: req.userId,
  });
  console.log(del);
  res.json({
    message: "Deleted",
  });
});

app.post("/api/v1/brain/share", userMiddleWare, async (req, res) => {
  const { share } = req.body;
  if (share) {
    const existingLink = await Link.findOne({
      userId: req.userId,
    });
    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }
    const hash = random(10);
    await Link.create({
      hash: hash,
      userId: req.userId,
    });
    res.json({
      hash: hash,
    });
  } else {
    await Link.deleteOne({
      userId: req.userId,
    });
    res.json({
      message: "Link removed",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const { shareLink: hash } = req.params;
  const link = await Link.findOne({
    hash: hash,
  });
  if (!link) {
    res.status(411).json({
      message: "Incorrect Input ",
    });
    return;
  }
  const content = await Content.find({
    userId: link.userId,
  });
  const user = await User.findById(link.userId);
  if (!user) {
    res.status(411).json({
      message: "user not found, error should ideally not happen",
    });
    return;
  }
  res.json({
    username: user.username,
    content: content,
  });
});
app.listen(port, () => {
  console.log(`App is listening on port 8080`);
});
