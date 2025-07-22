import express from "express";
import User from "../models/User.js";
const userRouter = express.Router();
import bcrypt from "bcryptjs";

userRouter.get("/register", (req, res) => {
  return res.render("register", {
    title: "REGISTER USER",
    user: null,
    error: null,
  });
});
userRouter.post("/register", async (req, res) => {
  const { username, password, gender, birth } = req.body;
  const name = await User.findOne({ username });
  if (name) {
    return res.render("register", {
      title: "REGISTER USER",
      user: null,
      error: "이미 사용 중인 아이디입니다.",
    });
  }
  const userpassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    password: userpassword,
    gender,
    birth,
  });
  await user.save();
  return res.redirect("/");
});
userRouter.get("/login", (req, res) => {
  return res.render("login", { title: "LOGIN", user: null, error: null });
});
userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.render("login", {
      title: "LOGIN",
      user: null,
      error: "존재하지않음",
    });
  }
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.render("login", {
      title: "LOGIN",
      user: null,
      error: "일치하지않음",
    });
  }
  req.session.user = {
    username: user.username,
    isAdmin: user.role === "admin",
    cart: [],
  };
  return res.redirect("/");
});

userRouter.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        message: "서버 에러가 발생했습니다.",
      });
    }
    return res.redirect('/')
  });
});
export default userRouter;
